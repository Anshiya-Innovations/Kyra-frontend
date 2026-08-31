sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
    "sap/m/Title",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Avatar",
    "sap/m/ObjectStatus"
], (Controller, MessageToast, MessageBox, Dialog, List, StandardListItem, Button, Title, Text, Label, VBox, HBox, Avatar, ObjectStatus) => {
    "use strict";

    return Controller.extend("kyra001.pages.Approver.ApproverDetail", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            if (oRouter) {
                oRouter.getRoute("ApproverDetail").attachPatternMatched(this._onRouteMatched, this);
            }

            const oModel = this.getOwnerComponent().getModel("accessModel");
            if (oModel) {
                this._setupRealtimeSync(oModel);
            }
        },

        _notifyDatabaseMutation() {
            if (typeof BroadcastChannel !== "undefined") {
                try {
                    const syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    syncChannel.postMessage({ type: "DECISION_SUBMITTED", timestamp: Date.now() });
                    syncChannel.close();
                } catch(e) {}
            }
            try {
                localStorage.setItem("kyra_last_db_mutation", String(Date.now()));
            } catch(e) {}
        },

        _setupRealtimeSync(oModel) {
            // 1. Cross-Device / Cross-Network Real-Time SSE Stream
            if (typeof EventSource !== "undefined" && !this._eventSource) {
                try {
                    this._eventSource = new EventSource("/api/sync/stream");
                    this._eventSource.onmessage = (evt) => {
                        try {
                            const data = JSON.parse(evt.data);
                            if (data.type === "NEW_REQUEST" || data.type === "DECISION_SUBMITTED" || data.type === "MUTATION") {
                                console.log("Cross-network SSE real-time sync event in ApproverDetail:", data);
                                this._reloadAllRequests(oModel);
                            }
                        } catch(e) {}
                    };
                } catch(e) {}
            }

            // 2. Multi-Tab BroadcastChannel
            if (typeof BroadcastChannel !== "undefined" && !this._syncChannel) {
                try {
                    this._syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    this._syncChannel.onmessage = (evt) => {
                        if (evt && evt.data && (evt.data.type === "NEW_REQUEST_SUBMITTED" || evt.data.type === "DECISION_SUBMITTED")) {
                            console.log("Real-time DB sync event in ApproverDetail:", evt.data);
                            this._reloadAllRequests(oModel);
                        }
                    };
                } catch(e) {}
            }

            // 3. Local Storage Sync
            if (!this._fnStorageHandler) {
                this._fnStorageHandler = (e) => {
                    if (e.key === "kyra_last_db_mutation") {
                        this._reloadAllRequests(oModel);
                    }
                };
                window.addEventListener("storage", this._fnStorageHandler);
            }

            // 4. Tab Focus Visibility Change Sync
            if (!this._fnVisibilityHandler) {
                this._fnVisibilityHandler = () => {
                    if (!document.hidden) {
                        this._reloadAllRequests(oModel);
                    }
                };
                document.addEventListener("visibilitychange", this._fnVisibilityHandler);
            }

            // 5. Adaptive Low-Frequency Backup Sync (every 10s only if tab is focused)
            if (!this._pollInterval) {
                this._pollInterval = setInterval(() => {
                    if (!document.hidden && this.getView() && this.getView().getModel("accessModel")) {
                        this._reloadAllRequests(oModel);
                    }
                }, 10000);
            }
        },

        onExit() {
            if (this._eventSource) {
                this._eventSource.close();
                this._eventSource = null;
            }
            if (this._syncChannel) {
                this._syncChannel.close();
                this._syncChannel = null;
            }
            if (this._fnStorageHandler) {
                window.removeEventListener("storage", this._fnStorageHandler);
                this._fnStorageHandler = null;
            }
            if (this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._fnVisibilityHandler = null;
            }
            if (this._pollInterval) {
                clearInterval(this._pollInterval);
                this._pollInterval = null;
            }
        },

        async _onRouteMatched(oEvent) {
            const oPage = this.byId("approverDetailPage");
            if (oPage) {
                oPage.scrollTo(0, 0);
            }
            window.scrollTo(0, 0);

            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Loading Governance Review...",
                    subtitle: "Evaluating live Segregation of Duties (SoD) conflict matrix..."
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Loading Governance Review...", "Evaluating live Segregation of Duties (SoD) conflict matrix...");
            }

            try {
                const sReqId = oEvent.getParameter("arguments").requestId;
                const oModel = this.getView().getModel("accessModel");
                if (!oModel) return;

                let aPending = oModel.getProperty("/pendingRequests") || [];
                let aProcessed = oModel.getProperty("/processedRequests") || [];
                let oRequest = aPending.find(r => r.requestId === sReqId) || aProcessed.find(r => r.requestId === sReqId);

                if (!oRequest) {
                    // If not found in the model, reload from database
                    await this._reloadAllRequests(oModel);
                    aPending = oModel.getProperty("/pendingRequests") || [];
                    aProcessed = oModel.getProperty("/processedRequests") || [];
                    oRequest = aPending.find(r => r.requestId === sReqId) || aProcessed.find(r => r.requestId === sReqId);
                }

                if (oRequest) {
                    const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Approver";
                    const isCompliancePersona = sActiveRole.toLowerCase().includes("compliance");
                    oModel.setProperty("/activeRole", sActiveRole);
                    oModel.setProperty("/isCompliancePersona", isCompliancePersona);

                    const sRequesterId = oRequest.requesterId || "Dev001";
                    const aEntList = [];

                    const cleanRole = (s) => (s || "").replace(/\s*\([^)]*\)/g, "").trim();
                    const getCleanServiceTopic = (req) => {
                        let s = req.serviceTopic || req.service_topic || req.service || req.team;
                        if (!s || s === req.function || s === req.business_function || s.includes("Governance") || s.includes("Finance") || s.includes("Logistics") || s.includes("Supply Chain")) {
                            const roleStr = (req.roleName || req.role_name || req.selectedPersona || req.selected_persona || "").toLowerCase();
                            if (roleStr.includes("owner") || roleStr.includes("architect") || roleStr.includes("analyst")) {
                                return "System Owners";
                            } else if (roleStr.includes("stakeholder") || roleStr.includes("compliance") || roleStr.includes("manager") || roleStr.includes("grc") || roleStr.includes("audit") || roleStr.includes("security")) {
                                return "Stakeholders";
                            } else {
                                return "System Administrator";
                            }
                        }
                        return String(s).replace(/\s*\([^)]*\)/g, "").trim() || "System Administrator";
                    };

                    if (oRequest.entitlements && oRequest.entitlements.length > 0) {
                        oRequest.entitlements.forEach(ent => {
                            const sInitStatus = (ent.status === "Approved" || ent.status === "Rejected") ? ent.status : "Pending";
                            const sInitState = sInitStatus === "Approved" ? "Success" : (sInitStatus === "Rejected" ? "Error" : "Warning");
                            const sInitIcon = sInitStatus === "Approved" ? "sap-icon://sys-enter-2" : (sInitStatus === "Rejected" ? "sap-icon://error" : "sap-icon://pending");

                            let sApproverRemark = "";
                            if (isCompliancePersona) {
                                sApproverRemark = ent.approverRemark || ent.approver_comment || ent.managerRemark || oRequest.approverRemark || oRequest.approver_comment || oRequest.managerRemark || oRequest.comments || "Access approved for this requester.";
                            }

                            const sRawRole = ent.roleName || ent.roleTitle || oRequest.roleName || "System Entitlement";
                            const sService = getCleanServiceTopic(ent) || getCleanServiceTopic(oRequest);

                            aEntList.push({
                                requestId: ent.requestId || oRequest.requestId,
                                system: ent.system || oRequest.system || "SAP System",
                                roleName: cleanRole(sRawRole),
                                team: sService,
                                serviceTopic: sService,
                                selectedPersona: ent.selectedPersona || oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                                grantedDate: ent.grantedDate || oRequest.submissionDate || new Date().toISOString().split("T")[0],
                                expiryDate: ent.expiryDate || oRequest.duration || "Permanent",
                                status: sInitStatus,
                                statusState: sInitState,
                                statusIcon: sInitIcon,
                                approverRemark: sApproverRemark,
                                comment: ent.comment || ""
                            });
                        });
                    } else {
                        const sInitStatus = (oRequest.status === "Approved" || oRequest.status === "Rejected") ? oRequest.status : "Pending";
                        const sInitState = sInitStatus === "Approved" ? "Success" : (sInitStatus === "Rejected" ? "Error" : "Warning");
                        const sInitIcon = sInitStatus === "Approved" ? "sap-icon://sys-enter-2" : (sInitStatus === "Rejected" ? "sap-icon://error" : "sap-icon://pending");

                        let sApproverRemark = "";
                        if (isCompliancePersona) {
                            sApproverRemark = oRequest.approverRemark || oRequest.approver_comment || oRequest.managerRemark || oRequest.comments || "Access approved for this requester.";
                        }

                        const sRawRole = oRequest.roleName || oRequest.serviceAndRole || "System Role";
                        const sService = getCleanServiceTopic(oRequest);

                        aEntList.push({
                            requestId: oRequest.requestId,
                            system: oRequest.system || "SAP System",
                            roleName: cleanRole(sRawRole),
                            team: sService,
                            serviceTopic: sService,
                            selectedPersona: oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                            grantedDate: oRequest.submissionDate || new Date().toISOString().split("T")[0],
                            expiryDate: oRequest.duration || "Permanent",
                            status: sInitStatus,
                            statusState: sInitState,
                            statusIcon: sInitIcon,
                            approverRemark: sApproverRemark,
                            comment: oRequest.comment || ""
                        });
                    }

                    const oSystemIconsMap = {
                        "SAP BTP Cloud Platform": "sap-icon://cloud",
                        "SAP S/4HANA Enterprise": "sap-icon://database",
                        "KYRA Central Governance": "sap-icon://shield",
                        "Active Directory / IAM": "sap-icon://user-settings",
                        "SAP Analytics Cloud": "sap-icon://bar-chart"
                    };

                    const oGroupedMap = {};
                    aEntList.forEach(item => {
                        const sSys = item.system || "SAP System";
                        if (!oGroupedMap[sSys]) {
                            oGroupedMap[sSys] = {
                                systemName: sSys,
                                systemIcon: oSystemIconsMap[sSys] || "sap-icon://system",
                                items: []
                            };
                        }
                        oGroupedMap[sSys].items.push(item);
                    });

                    const aSummaryTables = Object.values(oGroupedMap).map((tbl, idx) => {
                        tbl.systemIndex = idx + 1;
                        return tbl;
                    });

                    oModel.setProperty("/selectedRequest", {
                        requestId: oRequest.requestId,
                        requesterId: sRequesterId,
                        persona: oRequest.persona,
                        selectedPersona: oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                        region: oRequest.region,
                        sector: oRequest.sector,
                        function: oRequest.function,
                        duration: oRequest.duration,
                        justification: oRequest.justification,
                        status: oRequest.status,
                        statusState: oRequest.statusState,
                        statusIcon: oRequest.statusIcon,
                        entitlements: aEntList,
                        summaryTables: aSummaryTables
                    });

                    await this._evaluateSodConflictsForRequest(oRequest, aEntList, oModel);
                    oModel.setProperty("/approverSodTab", 1);
                } else {
                    MessageBox.error("Request ID " + sReqId + " not found in the database access records.");
                }
            } catch(err) {
                console.error("Error in _onRouteMatched:", err);
            } finally {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
            }
        },

        async _evaluateSodConflictsForRequest(oRequest, aEntList, oModel) {
            if (!oModel || !oRequest) return;

            const sRequesterUsername = (oRequest.requesterId || oRequest.requesterUsername || oRequest.requester_username || "").trim();
            
            const getBaseReqId = (num) => {
                if (!num) return "";
                const lastDash = num.lastIndexOf('-');
                if (lastDash > 0 && lastDash >= num.length - 4) {
                    return num.slice(0, lastDash);
                }
                return num;
            };

            const sCurrentRequestId = (oRequest.requestId || "").trim();
            const sCurrentReqBase = getBaseReqId(sCurrentRequestId);

            let aLiveAllRequests = [];
            let aSodRules = [];

            try {
                const [respGov, respSod] = await Promise.all([
                    fetch("/odata/v4/admin-portal/GovernanceHistory"),
                    fetch("/odata/v4/admin-portal/SoDMatrix")
                ]);

                if (respGov.ok) {
                    const dataGov = await respGov.json();
                    if (dataGov && dataGov.value) {
                        aLiveAllRequests = dataGov.value;
                    }
                }

                if (respSod.ok) {
                    const dataSod = await respSod.json();
                    if (dataSod && dataSod.value && dataSod.value.length > 0) {
                        aSodRules = dataSod.value;
                    }
                }
            } catch(e) {
                console.warn("Could not fetch live governance history for SoD evaluation:", e);
            }

            if (!aSodRules || aSodRules.length === 0) {
                aSodRules = oModel.getProperty("/sodMatrix") || [
                    { role1: "IT Admin", role2: "IT Developer", description: "Segregation of Duties conflict between Developer and Admin privileges." },
                    { role1: "IT Admin", role2: "IT Security", description: "System Administrator conflicts with Security Governance." },
                    { role1: "IT Admin", role2: "Compliance Manager", description: "System Administrator conflicts with Compliance Manager oversight." },
                    { role1: "IT Security", role2: "IT Developer", description: "Developer access conflicts with IT Security audit authority." },
                    { role1: "Lead Engineer", role2: "IT Admin", description: "Lead Engineer conflicts with IT Administrators elevated system access." },
                    { role1: "Security", role2: "Compliance Manager", description: "Compliance Manager conflicts with Security Operational access." },
                    { role1: "Security Audit", role2: "IT Developer", description: "Security Audit oversight conflicts with Developer operational access." },
                    { role1: "System Administrator", role2: "Security Audit", description: "System Administrator conflicts with Security Audit role." }
                ];
            }

            // 1. Requester's LIVE active accesses (Approved and not revoked)
            const aRequesterRecords = aLiveAllRequests.filter(r => 
                r.requester_username && sRequesterUsername && r.requester_username.toLowerCase() === sRequesterUsername.toLowerCase()
            );

            const aUserActiveRoles = aRequesterRecords.filter(r => {
                const sStat = (r.status || r.db_status || "").toUpperCase();
                const sType = (r.access_type || "").toUpperCase();
                return (sStat === "APPROVED" || sStat === "ACTIVE") && sType !== "REVOCATION";
            });

            // 2. Requester's LIVE other in-flight pending requests (Excluding current request batch)
            const aUserPendingRequests = aRequesterRecords.filter(r => {
                const sStat = (r.status || r.db_status || "").toUpperCase();
                const reqNum = (r.request_number || "").trim();
                const baseReqNum = getBaseReqId(reqNum);
                const isPending = sStat === "PENDING" || sStat === "PENDING_COMPLIANCE" || sStat === "PENDING_IAM_1" || sStat === "PENDING_IAM_2";
                const isCurrentReq = (reqNum === sCurrentRequestId) || (baseReqNum && baseReqNum === sCurrentReqBase);
                return isPending && !isCurrentReq;
            });

            const isSameSystem = (sysA, sysB) => {
                if (!sysA || !sysB) return false;
                const sA = String(sysA).trim().toLowerCase();
                const sB = String(sysB).trim().toLowerCase();
                return sA === sB;
            };

            const cleanPersonaName = (s) => {
                if (!s) return "";
                let str = String(s).trim();
                str = str.replace(/\s*\([^)]*\)\s*$/g, "").trim();
                return str || s;
            };

            const cleanStr = (s) => String(s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();

            // Check if two items represent the same access
            const isSameAccess = (itemA, itemB) => {
                const sA = itemA.system || itemA.target_system || itemA.targetSystem || "";
                const sB = itemB.system || itemB.target_system || itemB.targetSystem || "";
                if (!isSameSystem(sA, sB)) return false;

                const persA = cleanStr(itemA.persona || itemA.selected_persona || itemA.selectedPersona || "");
                const persB = cleanStr(itemB.persona || itemB.selected_persona || itemB.selectedPersona || "");
                const roleA = cleanStr(itemA.roleName || itemA.role_name || itemA.roleTitle || "");
                const roleB = cleanStr(itemB.roleName || itemB.role_name || itemB.roleTitle || "");

                if (persA && persB) {
                    if (persA === persB) return true;
                    const pA = persA.replace(/persona/g, "").trim();
                    const pB = persB.replace(/persona/g, "").trim();
                    if (pA && pB && (pA === pB || pA.includes(pB) || pB.includes(pA))) return true;
                }
                if (roleA && roleB) {
                    return roleA === roleB || roleA.includes(roleB) || roleB.includes(roleA);
                }
                return false;
            };

            const getFunctionalArchetype = (roleStr, personaStr) => {
                const cleanR = String(roleStr || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
                const cleanP = String(personaStr || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();

                if (cleanR.includes("developer") || cleanP.includes("developer")) return "developer";
                if (cleanR.includes("administrator") || cleanR.includes("it admin") || cleanP.includes("cloud infrastructure") || cleanP.includes("database & iam")) return "admin";
                if (cleanR.includes("security") || cleanP.includes("security") || cleanP.includes("cybersecurity") || cleanR.includes("isrm") || cleanP.includes("isrm") || cleanR.includes("audit") || cleanP.includes("audit")) return "security";
                if (cleanR.includes("lead engineer") || cleanP.includes("principal systems") || cleanP.includes("devops & platform")) return "engineer";
                if (cleanR.includes("compliance") || cleanP.includes("compliance") || cleanP.includes("auditor") || cleanP.includes("privacy")) return "compliance";
                if (cleanR.includes("product owner") || cleanP.includes("solution architecture") || cleanP.includes("product manager")) return "owner";
                if (cleanR.includes("product group engineer") || cleanP.includes("integration engineering") || cleanP.includes("product suite")) return "product_group";
                if (cleanR.includes("line manager") || cleanP.includes("people operations") || cleanP.includes("resource manager")) return "manager";
                if (cleanR.includes("role owner") || cleanP.includes("role custodian") || cleanP.includes("access governance approver")) return "role_owner";
                return cleanR;
            };

            const getRuleArchetype = (ruleStr) => {
                const s = String(ruleStr || "").toLowerCase().trim();
                if (s.includes("developer") || s.includes("dev")) return "developer";
                if (s.includes("admin") || s.includes("system administrator")) return "admin";
                if (s.includes("security") || s.includes("audit") || s.includes("isrm")) return "security";
                if (s.includes("engineer")) return "engineer";
                if (s.includes("compliance")) return "compliance";
                if (s.includes("owner")) return "owner";
                if (s.includes("manager")) return "manager";
                return s;
            };

            const checkConflictMatch = (roleA, personaA, roleB, personaB, rule) => {
                const archA = getFunctionalArchetype(roleA, personaA);
                const archB = getFunctionalArchetype(roleB, personaB);

                if (archA === archB) return false;

                const r1 = getRuleArchetype(rule.role1 || rule.role_a || rule.roleA);
                const r2 = getRuleArchetype(rule.role2 || rule.role_b || rule.roleB);

                return (archA === r1 && archB === r2) || (archA === r2 && archB === r1);
            };

            const aActiveConflicts = [];
            const aPendingConflicts = [];
            const aBatchConflicts = [];
            const oSeenActiveKeys = new Set();
            const oSeenPendingKeys = new Set();
            const oSeenBatchKeys = new Set();

            const aItemsToCheck = aEntList && aEntList.length > 0 ? aEntList : [oRequest];

            aItemsToCheck.forEach(newItem => {
                const sNewSys = newItem.system || newItem.target_system || "";
                const sNewRoleName = newItem.roleName || newItem.role_name || newItem.roleTitle || "Requested Role";
                const sNewPersona = newItem.selectedPersona || newItem.selected_persona || newItem.persona || sNewRoleName;

                // 1. Check Active Conflicts against LIVE active access of this requester
                aUserActiveRoles.forEach(activeRole => {
                    const sActiveSys = activeRole.target_system || activeRole.system || "";
                    if (!isSameSystem(sActiveSys, sNewSys)) return;

                    if (isSameAccess(activeRole, newItem)) return;

                    const sActiveRoleName = activeRole.role_name || activeRole.roleName || activeRole.roleTitle || "Active Role";
                    const sActivePersona = activeRole.selected_persona || activeRole.selectedPersona || activeRole.persona || sActiveRoleName;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between active entitlement and newly requested access.";

                        if (checkConflictMatch(sNewRoleName, sNewPersona, sActiveRoleName, sActivePersona, rule)) {
                            const sKey = `${sActiveSys}:::${sActiveRoleName}:::${sNewSys}:::${sNewRoleName}`;
                            if (!oSeenActiveKeys.has(sKey)) {
                                oSeenActiveKeys.add(sKey);
                                aActiveConflicts.push({
                                    existingRole: `${sActiveSys} — ${cleanPersonaName(sActiveRoleName)}`,
                                    existingPersona: cleanPersonaName(sActivePersona),
                                    newRole: `${sNewSys} — ${cleanPersonaName(sNewRoleName)}`,
                                    newPersona: cleanPersonaName(sNewPersona),
                                    conflictTitle: "Segregation of Duties (SoD) Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                        }
                    });
                });

                // 2. Check Pending Conflicts against LIVE other in-flight requests of this requester
                aUserPendingRequests.forEach(pendingReq => {
                    const sPendingSys = pendingReq.target_system || pendingReq.system || "";
                    if (!isSameSystem(sPendingSys, sNewSys)) return;

                    if (isSameAccess(pendingReq, newItem)) return;

                    const sPendingRoleName = pendingReq.role_name || pendingReq.roleName || pendingReq.roleTitle || "Pending Role";
                    const sPendingPersona = pendingReq.selected_persona || pendingReq.selectedPersona || pendingReq.persona || sPendingRoleName;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected against pending access request.";

                        if (checkConflictMatch(sNewRoleName, sNewPersona, sPendingRoleName, sPendingPersona, rule)) {
                            const sKey = `${sPendingSys}:::${sPendingRoleName}:::${sNewSys}:::${sNewRoleName}`;
                            if (!oSeenPendingKeys.has(sKey)) {
                                oSeenPendingKeys.add(sKey);
                                aPendingConflicts.push({
                                    existingRole: `${sPendingSys} — ${cleanPersonaName(sPendingRoleName)}`,
                                    existingPersona: cleanPersonaName(sPendingPersona),
                                    newRole: `${sNewSys} — ${cleanPersonaName(sNewRoleName)}`,
                                    newPersona: cleanPersonaName(sNewPersona),
                                    conflictTitle: "Segregation of Duties (SoD) Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                        }
                    });
                });
            });

            // 3. Check Batch Intra-Role Conflicts (within the current request batch)
            for (let i = 0; i < aItemsToCheck.length; i++) {
                for (let j = i + 1; j < aItemsToCheck.length; j++) {
                    const itemA = aItemsToCheck[i];
                    const itemB = aItemsToCheck[j];

                    const sSysA = itemA.system || itemA.target_system || "";
                    const sSysB = itemB.system || itemB.target_system || "";
                    if (!isSameSystem(sSysA, sSysB)) continue;

                    if (isSameAccess(itemA, itemB)) continue;

                    const sRoleA = itemA.roleName || itemA.role_name || itemA.roleTitle || "";
                    const sPersonaA = itemA.selectedPersona || itemA.selected_persona || itemA.persona || sRoleA;
                    const sRoleB = itemB.roleName || itemB.role_name || itemB.roleTitle || "";
                    const sPersonaB = itemB.selectedPersona || itemB.selected_persona || itemB.persona || sRoleB;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between multiple roles selected together in this request.";

                        if (checkConflictMatch(sRoleA, sPersonaA, sRoleB, sPersonaB, rule)) {
                            const sKey = `${sSysA}:::${sRoleA}:::${sSysB}:::${sRoleB}`;
                            if (!oSeenBatchKeys.has(sKey)) {
                                oSeenBatchKeys.add(sKey);
                                aBatchConflicts.push({
                                    roleA: `${sSysA} — ${cleanPersonaName(sRoleA)}`,
                                    personaA: cleanPersonaName(sPersonaA),
                                    roleB: `${sSysB} — ${cleanPersonaName(sRoleB)}`,
                                    personaB: cleanPersonaName(sPersonaB),
                                    conflictTitle: "Batch Selection SoD Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                        }
                    });
                }
            }

            oModel.setProperty("/selectedRequestSodActiveConflicts", aActiveConflicts);
            oModel.setProperty("/selectedRequestSodPendingConflicts", aPendingConflicts);
            oModel.setProperty("/selectedRequestSodBatchConflicts", aBatchConflicts);
        },

        onSelectApproverSodExisting() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/approverSodTab", 1);
            }
        },

        onSelectApproverSodNew() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/approverSodTab", 2);
            }
        },

        onCloseRequestSummaryView() {
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        },

        onToggleDecisionSwitch(oEvent) {
            const bState = oEvent.getParameter("state");
            const oSwitch = oEvent.getSource();
            const oContext = oSwitch.getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");

            if (oContext && oModel) {
                const sPath = oContext.getPath();
                const oEntitlement = oContext.getObject();
                const sCurComment = (oEntitlement.comment || "").trim();

                if (sCurComment.includes("standard review cycle") || sCurComment.includes("standard batch review")) {
                    oModel.setProperty(sPath + "/comment", "");
                }

                if (bState) {
                    // Toggled to Accept (Blue)
                    oModel.setProperty(sPath + "/status", "Approved");
                    oModel.setProperty(sPath + "/statusState", "Success");
                    oModel.setProperty(sPath + "/statusIcon", "sap-icon://sys-enter-2");
                    MessageToast.show("Accepted entitlement for " + oEntitlement.system);
                } else {
                    // Toggled to Reject (Red)
                    oModel.setProperty(sPath + "/status", "Rejected");
                    oModel.setProperty(sPath + "/statusState", "Error");
                    oModel.setProperty(sPath + "/statusIcon", "sap-icon://error");
                    MessageToast.show("Rejected entitlement for " + oEntitlement.system);
                }
            }
        },

        onAcceptEntitlement(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");

            if (oContext && oModel) {
                const sPath = oContext.getPath();
                const oEntitlement = oContext.getObject();
                const sCurComment = (oEntitlement.comment || "").trim();

                oModel.setProperty(sPath + "/status", "Approved");
                oModel.setProperty(sPath + "/statusState", "Success");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://sys-enter-2");

                // Clear input field if comment contains batch remark or opposite decision remark
                if (sCurComment === "Rejected during standard review cycle" || sCurComment === "Approved during standard review cycle" || sCurComment.includes("standard batch review") || sCurComment.includes("standard review cycle")) {
                    oModel.setProperty(sPath + "/comment", "");
                }

                MessageToast.show("Approved: " + (oEntitlement.roleName || oEntitlement.system || "Entitlement"));
            }
        },

        onRejectEntitlement(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");

            if (oContext && oModel) {
                const sPath = oContext.getPath();
                const oEntitlement = oContext.getObject();
                const sCurComment = (oEntitlement.comment || "").trim();

                oModel.setProperty(sPath + "/status", "Rejected");
                oModel.setProperty(sPath + "/statusState", "Error");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://error");

                // Clear input field if comment contains batch remark or opposite decision remark
                if (sCurComment === "Approved during standard review cycle" || sCurComment === "Rejected during standard review cycle" || sCurComment.includes("standard batch review") || sCurComment.includes("standard review cycle")) {
                    oModel.setProperty(sPath + "/comment", "");
                }

                MessageToast.show("Rejected: " + (oEntitlement.roleName || oEntitlement.system || "Entitlement"));
            }
        },

        onRemarkLiveChange(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");
            if (oContext && oModel) {
                const sVal = oEvent.getParameter("value");
                oModel.setProperty(oContext.getPath() + "/comment", sVal);
            }
        },

        onApproveSelectedRequest() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const oData = oModel.getProperty("/selectedRequest");
                if (!oData) return;

                // Sync all entitlement statuses & comments from summaryTables if user edited in table
                const aTables = oData.summaryTables || [];
                let aAllItems = [];
                aTables.forEach(tbl => {
                    if (tbl.items && tbl.items.length > 0) {
                        aAllItems = aAllItems.concat(tbl.items);
                    }
                });
                if (aAllItems.length > 0) {
                    oData.entitlements = aAllItems;
                }

                const aEntitlements = oData.entitlements || [];

                // 1. VALIDATION: Do NOT auto-select! All items must have an explicit decision (Approve or Reject)
                const aUndecided = aEntitlements.filter(e => !e.status || e.status.toLowerCase().includes("pending"));
                if (aUndecided.length > 0) {
                    MessageBox.warning(
                        "Decision Required: You have " + aUndecided.length + " pending entitlement(s). Please click Approve (✔) or Reject (✖) for each item before submitting.",
                        {
                            title: "Action Required"
                        }
                    );
                    return;
                }

                // 2. VALIDATION: Comments / Remarks are strictly mandatory!
                const aMissingRemarks = aEntitlements.filter(e => !e.comment || !e.comment.trim());
                if (aMissingRemarks.length > 0) {
                    MessageBox.warning(
                        "Remarks Required: Please enter comments/remarks for all " + aEntitlements.length + " entitlement(s) before submitting your decision.",
                        {
                            title: "Remarks Required"
                        }
                    );
                    return;
                }

                this._showDecisionSummarySlide(oData, false);
            }
        },

        _showDecisionSummarySlide(oData, bReadOnly) {
            const aEntitlements = oData.entitlements || [];

            // Separate items based on explicit approved / rejected status
            const aApprovedItems = aEntitlements.filter(e => {
                const s = (e.status || "").toLowerCase();
                return s === "approved" || s.includes("approved") || s === "success";
            });
            const aRejectedItems = aEntitlements.filter(e => {
                const s = (e.status || "").toLowerCase();
                return s === "rejected" || s.includes("reject") || s === "error";
            });
            const aPendingItems = aEntitlements.filter(e => {
                const s = (e.status || "").toLowerCase();
                return !s.includes("approved") && !s.includes("reject") && s !== "success" && s !== "error";
            });

            // When in read-only view, only show actually approved items
            const aFinalApproved = bReadOnly ? aApprovedItems : (aApprovedItems.length > 0 ? aApprovedItems : aPendingItems);

            const sOverallStatus = aRejectedItems.length === 0 ? "Approved" : (aFinalApproved.length === 0 ? "Rejected" : "Partially Approved");
            const sOverallState = aRejectedItems.length === 0 ? "success" : (aFinalApproved.length === 0 ? "error" : "info");

            let sBodyHtml = `
                <div style="font-family: inherit; color: #0F172A;">
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                        <div>
                            <div style="font-weight: 800; font-size: 14px; color: #0F172A;">Requester (${oData.requesterId || 'Dev001'})</div>
                            <div style="font-size: 11.5px; color: #64748B; margin-top: 2px;">
                                Request ID: <strong style="color: #1E293B;">${oData.requestId}</strong> • Sector: <span style="color: #475569;">${oData.sector || 'Enterprise Governance'}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #64748B; display: block; margin-bottom: 2px;">Decision Result</span>
                            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11.5px; ${sOverallStatus === 'Approved' ? 'background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC;' : (sOverallStatus === 'Rejected' ? 'background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5;' : 'background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D;')}">
                                ${sOverallStatus === 'Approved' ? '✔ Approved' : (sOverallStatus === 'Rejected' ? '✕ Rejected' : '⚠ Partially Approved')}
                            </span>
                        </div>
                    </div>

                    <!-- Single unified scrollable body container so Partially Approved maintains exact same height as Approved/Rejected -->
                    <div class="kyra-dialog-scroll-container" style="max-height: 220px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin;">
            `;

            if (aFinalApproved.length > 0) {
                sBodyHtml += `
                    <div style="color: #15803D; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; margin: 4px 0 6px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>Approved System Entitlements</span>
                        <span style="background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; padding: 1px 8px; border-radius: 10px; font-size: 10.5px; font-weight: 700;">${aFinalApproved.length} Item(s)</span>
                    </div>
                    <div style="margin-bottom: 6px;">
                        ${aFinalApproved.map(i => {
                            const sCleanRole = (i.roleTitle || i.roleName || 'System Entitlement').replace(/\s*\([^)]*\)/g, "");
                            return `
                            <div style="border: 1px solid #BBF7D0; background: #F0FDF4; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(22,163,74,0.06);">
                                <div style="flex: 1; min-width: 0; padding-right: 8px;">
                                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                                        <span style="font-weight: 700; font-size: 11px; color: #15803D;">${i.requestId || oData.requestId}</span>
                                        <span style="background: #FFFFFF; border: 1px solid #86EFAC; border-radius: 4px; padding: 1px 6px; font-size: 10.5px; font-weight: 700; color: #166534;">${i.system}</span>
                                    </div>
                                    <div style="font-size: 12.5px; font-weight: 700; color: #0F172A; line-height: 1.3; margin: 2px 0;">
                                        ${sCleanRole} <span style="font-weight: 500; font-size: 11px; color: #64748B;">(${i.team || oData.function || 'Governance'})</span>
                                    </div>
                                    <div style="font-size: 11px; color: #475569; line-height: 1.2;">
                                        <span style="font-weight: 600; color: #334155;">Persona:</span> ${i.selectedPersona || oData.selectedPersona || 'Engineering & Developer Persona'}
                                    </div>
                                </div>
                                <div style="flex-shrink: 0;">
                                    <span style="background: #16A34A; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        ✔ Approved
                                    </span>
                                </div>
                            </div>
                        `;}).join("")}
                    </div>
                `;
            }

            if (aRejectedItems.length > 0) {
                sBodyHtml += `
                    <div style="color: #B91C1C; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; margin: 6px 0 6px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>Rejected System Entitlements</span>
                        <span style="background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; padding: 1px 8px; border-radius: 10px; font-size: 10.5px; font-weight: 700;">${aRejectedItems.length} Item(s)</span>
                    </div>
                    <div style="margin-bottom: 4px;">
                        ${aRejectedItems.map(i => {
                            const sCleanRole = (i.roleTitle || i.roleName || 'System Entitlement').replace(/\s*\([^)]*\)/g, "");
                            return `
                            <div style="border: 1px solid #FECACA; background: #FEF2F2; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(220,38,38,0.06);">
                                <div style="flex: 1; min-width: 0; padding-right: 8px;">
                                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                                        <span style="font-weight: 700; font-size: 11px; color: #B91C1C;">${i.requestId || oData.requestId}</span>
                                        <span style="background: #FFFFFF; border: 1px solid #FCA5A5; border-radius: 4px; padding: 1px 6px; font-size: 10.5px; font-weight: 700; color: #991B1B;">${i.system}</span>
                                    </div>
                                    <div style="font-size: 12.5px; font-weight: 700; color: #0F172A; line-height: 1.3; margin: 2px 0;">
                                        ${sCleanRole} <span style="font-weight: 500; font-size: 11px; color: #64748B;">(${i.team || oData.function || 'Governance'})</span>
                                    </div>
                                    <div style="font-size: 11px; color: #475569; line-height: 1.2;">
                                        <span style="font-weight: 600; color: #334155;">Persona:</span> ${i.selectedPersona || oData.selectedPersona || 'Engineering & Developer Persona'}
                                    </div>
                                </div>
                                <div style="flex-shrink: 0;">
                                    <span style="background: #DC2626; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        ✕ Rejected
                                    </span>
                                </div>
                            </div>
                        `;}).join("")}
                    </div>
                `;
            }

            sBodyHtml += `
                    </div>
                </div>
            `;

            if (typeof KyraDialog !== "undefined") {
                KyraDialog.show({
                    title: "Decision Breakdown Summary - " + oData.requestId,
                    type: sOverallState,
                    maxWidth: "520px",
                    messageHtml: sBodyHtml,
                    buttonText: bReadOnly ? "Close" : "Confirm & Submit",
                    secondaryButtonText: bReadOnly ? null : "Back",
                    onConfirm: () => {
                        if (!bReadOnly) {
                            this._executeFinalSubmission(oData, sOverallStatus, sOverallState, aFinalApproved, aRejectedItems);
                        }
                    }
                });
            }
        },

        async _executeFinalSubmission(oData, sOverallStatus, sOverallState, aFinalApproved, aRejectedItems) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) {
                return;
            }

            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Submitting Access Decision...",
                    subtitle: "Recording decision and updating governance audit log..."
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Submitting Access Decision...", "Recording decision and updating governance audit log...");
            }
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                sap.ui.core.BusyIndicator.show(0);
            }

            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Approver";
            const bIsComplianceApprover = (sActiveRole === "Compliance Approver");

            // Evaluate if this request has ANY conflicts in the SoD tables or request data
            const aActiveConflicts = oModel.getProperty("/selectedRequestSodActiveConflicts") || [];
            const aPendingConflicts = oModel.getProperty("/selectedRequestSodPendingConflicts") || [];
            const aBatchConflicts = oModel.getProperty("/selectedRequestSodBatchConflicts") || [];
            const bHasConflict = (aActiveConflicts.length > 0 || aPendingConflicts.length > 0 || aBatchConflicts.length > 0 || oData.hasConflict === true || oData.has_conflict === true);

            // Build decisions payload for backend persistence with approver comments
            const aDecisionsPayload = (oData.entitlements || []).map(e => {
                const isRejected = (e.status || "").toLowerCase().includes("reject");
                let sStatus = "";
                let sComment = "";
                
                if (isRejected) {
                    sStatus = "REJECTED";
                    sComment = e.comment || e.comments || "Rejected by Approver";
                } else {
                    sStatus = "APPROVED";
                    sComment = e.comment || e.comments || "Approved by Approver";
                }

                return {
                    requestNumber: e.requestId || oData.requestId,
                    targetSystem: e.system || oData.system,
                    roleName: e.roleName,
                    selectedPersona: e.selectedPersona || oData.selectedPersona,
                    status: sStatus,
                    comments: sComment,
                    actorRole: sActiveRole,
                    hasConflict: bHasConflict
                };
            });

            try {
                // Post decision to backend service (inserts into access_management.approver_decision and updates access_management.all_requests)
                const response = await fetch("/odata/v4/auth/submitAccessDecision", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        requestNumber: oData.requestId,
                        actorRole: sActiveRole,
                        hasConflict: bHasConflict,
                        decisions: aDecisionsPayload
                    })
                });
                const data = await response.json();
                console.log("Decision persisted into database successfully:", data);

                // Reload all request data directly from database
                await this._reloadAllRequests(oModel);

                // Broadcast decision mutation event so user dashboards update live instantly
                this._notifyDatabaseMutation();

            } catch (err) {
                console.error("Database persistence approval decision error:", err);
            } finally {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }
            }

            // Create user notification for the requester
            const sStatusIcon = sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://alert");
            const sOverallComment = (oData.entitlements || []).map(e => e.comment || e.comments).filter(Boolean).join("; ") || (sOverallStatus === "Approved" ? "Access approved for this requester." : (sOverallStatus === "Rejected" ? "Access rejected." : "Decision updated."));
            let sNotifDesc = "Your access request (" + oData.requestId + ") for " + (oData.sector || "Governance Sector") + " has been " + sOverallStatus.toLowerCase() + " by the " + sActiveRole + ".";
            if (sOverallComment) {
                sNotifDesc += " Approver Remark: \"" + sOverallComment + "\"";
            }

            const aUserNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
            aUserNotifications.unshift({
                id: "NOTIF-" + Date.now(),
                requesterId: oData.requesterId || "Dev001",
                requestId: oData.requestId,
                title: sOverallStatus === "Approved" ? ("Access Request Approved: " + oData.requestId) : (sOverallStatus === "Rejected" ? ("Access Request Rejected: " + oData.requestId) : ("Access Request Partially Approved: " + oData.requestId)),
                description: sNotifDesc,
                approverComment: sOverallComment,
                type: sOverallStatus === "Approved" ? "approved" : (sOverallStatus === "Rejected" ? "rejected" : "approved"),
                category: "Access Decisions",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString(),
                state: sOverallState,
                icon: sStatusIcon,
                unread: true
            });
            sessionStorage.setItem("kyra_show_approval_history", "true");
            sessionStorage.setItem("kyra_select_tab", "myAccess");
            sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
            oModel.setProperty("/showApprovalHistory", true);
            oModel.setProperty("/selectedTabKey", "myAccess");
            oModel.setProperty("/showRequestDetailsPage", false);
            oModel.setProperty("/showAddAccessSector", false);
            oModel.setProperty("/showRemoveAccessSector", false);
            MessageToast.show("Decision submitted for Request Id " + oData.requestId);
            this.onCloseRequestSummaryView();
        },

        _setSmartProperty(oModel, sPath, vNewVal) {
            if (!oModel) return;
            const vOldVal = oModel.getProperty(sPath);
            const sOldJson = JSON.stringify(vOldVal === undefined ? null : vOldVal);
            const sNewJson = JSON.stringify(vNewVal === undefined ? null : vNewVal);
            if (sOldJson !== sNewJson) {
                oModel.setProperty(sPath, vNewVal);
            }
        },

        async _reloadAllRequests(oModel) {
            if (!oModel) return;

            let aDbRequests = [];
            let aRawDbRequests = [];
            try {
                const response = await fetch("/odata/v4/admin-portal/GovernanceHistory");
                const data = await response.json();
                if (data && data.value) {
                    aRawDbRequests = data.value;
                    // Sort strictly in descending order for frontend list views (newest first)
                    aRawDbRequests.sort((a, b) => {
                        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
                        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
                        if (tA !== tB) return tB - tA;
                        return (b.request_number || "").localeCompare(a.request_number || "");
                    });
                    aDbRequests = aRawDbRequests.map(r => {
                        const sDbStatus = (r.status || "PENDING").toUpperCase();
                        let sStatusText = "Pending Approval";
                        let sState = "Warning";
                        let sIcon = "sap-icon://pending";
                        
                        if (sDbStatus === "APPROVED") {
                            sStatusText = "Approved";
                            sState = "Success";
                            sIcon = "sap-icon://sys-enter-2";
                        } else if (sDbStatus === "REJECTED") {
                            sStatusText = "Rejected";
                            sState = "Error";
                            sIcon = "sap-icon://error";
                        }

                        let sPersonaText = r.requester_persona || "Requester";
                        if (sPersonaText.toUpperCase().includes("ADMIN") || sPersonaText.toUpperCase().includes("COMPLIANCE")) {
                            sPersonaText = "Compliance Reviewer";
                        } else {
                            sPersonaText = "Requester";
                        }

                        return {
                            requestId: r.request_number,
                            requesterId: r.requester_username,
                            requesterUsername: r.requester_username,
                            type: "Addition",
                            system: r.target_system,
                            roleName: r.role_name,
                            serviceTopic: deriveServiceTopicFromRole(r.role_name, r.service_topic || r.serviceTopic || r.service),
                            selectedPersona: r.selected_persona,
                            accessDuration: r.access_duration,
                            submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                            createdAtRaw: r.created_at || new Date().toISOString(),
                            approver: "Line Manager / ISRM Team",
                            persona: sPersonaText,
                            status: sStatusText,
                            statusState: sState,
                            statusIcon: sIcon
                        };
                    });
                }
            } catch (err) {
                console.error("Error reloading requests:", err);
            }

            const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
            const isCompliance = sActiveRole.includes("compliance");
            const isIamApp2 = sActiveRole.includes("approver 2") || sActiveRole.includes("approver2") || sActiveRole.includes("iam 2") || sActiveRole.includes("iam_2");
            const isIamApp1 = !isCompliance && !isIamApp2 && (sActiveRole.includes("approver 1") || sActiveRole.includes("approver1") || sActiveRole.includes("iam 1") || sActiveRole.includes("iam_1") || sActiveRole.includes("iam approver"));
            const isInitialApprover = !isCompliance && !isIamApp1 && !isIamApp2;

            const oGrouped = {};
            aRawDbRequests.forEach(r => {
                const sDbStatus = (r.db_status || r.status || "PENDING").toUpperCase();
                const sApproverStatus = (r.approver_status || r.approver_decision_status || "").toUpperCase();
                const sComplianceStatus = (r.compliance_status || r.compliance_decision_status || "").toUpperCase();
                const sIamApp1Status = (r.iam_approver_1_status || r.iam_approver_1_decision_status || "").toUpperCase();
                const sIamApp2Status = (r.iam_approver_2_status || r.iam_approver_2_decision_status || "").toUpperCase();

                const isConflictRequest = r.has_conflict === true || !!(r.conflicting_role && r.conflicting_role.trim()) || sDbStatus === "PENDING_COMPLIANCE";

                const isApproverApproved = sApproverStatus === "APPROVED" || sDbStatus === "PENDING_COMPLIANCE" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                const isComplianceApproved = sComplianceStatus === "APPROVED" || (!isConflictRequest && isApproverApproved) || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                const isIamApp1Approved = sIamApp1Status === "APPROVED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                const isIamApp2Approved = sIamApp2Status === "APPROVED" || sDbStatus === "APPROVED";

                let isPendingForRole = false;
                let isProcessedForRole = false;
                let bRoleApproved = false;

                if (isInitialApprover) {
                    if (sApproverStatus === "APPROVED" || sApproverStatus === "REJECTED" || isApproverApproved || sDbStatus === "APPROVED" || sDbStatus === "REJECTED") {
                        isProcessedForRole = true;
                        bRoleApproved = (sApproverStatus === "APPROVED" || isApproverApproved) && sApproverStatus !== "REJECTED";
                    } else if (sDbStatus !== "REJECTED") {
                        isPendingForRole = true;
                    }
                } else if (isCompliance) {
                    const isProcessedInCompliance = sComplianceStatus === "APPROVED" || sComplianceStatus === "REJECTED" || (sDbStatus !== "PENDING_COMPLIANCE" && isApproverApproved && isConflictRequest);
                    if (isProcessedInCompliance) {
                        isProcessedForRole = true;
                        bRoleApproved = (sComplianceStatus === "APPROVED" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED") && sComplianceStatus !== "REJECTED";
                    } else if (isApproverApproved && isConflictRequest && sDbStatus !== "REJECTED") {
                        isPendingForRole = true;
                    }
                } else if (isIamApp1) {
                    // IAM Approver 1 sees:
                    // 1) Conflict requests approved by Compliance
                    // 2) Non-conflict requests approved by Initial Approver directly!
                    const isReadyForIam1 = (isConflictRequest && sComplianceStatus === "APPROVED") || (!isConflictRequest && isApproverApproved) || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                    if (isReadyForIam1) {
                        if (sIamApp1Status === "APPROVED" || sIamApp1Status === "REJECTED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED" || (sDbStatus === "REJECTED" && sIamApp1Status === "REJECTED")) {
                            isProcessedForRole = true;
                            bRoleApproved = (sIamApp1Status === "APPROVED" || isIamApp1Approved) && sIamApp1Status !== "REJECTED";
                        } else if (sDbStatus !== "REJECTED" && sDbStatus !== "PENDING_COMPLIANCE") {
                            isPendingForRole = true;
                        }
                    }
                } else if (isIamApp2) {
                    if (isIamApp1Approved) {
                        if (sIamApp2Status === "APPROVED" || sIamApp2Status === "REJECTED" || sDbStatus === "APPROVED" || (sDbStatus === "REJECTED" && sIamApp2Status === "REJECTED")) {
                            isProcessedForRole = true;
                            bRoleApproved = (sIamApp2Status === "APPROVED" || isIamApp2Approved) && sIamApp2Status !== "REJECTED";
                        } else if (sDbStatus !== "REJECTED") {
                            isPendingForRole = true;
                        }
                    }
                }

                if (!isPendingForRole && !isProcessedForRole) {
                    return; // Do not include in this reviewer's queue
                }

                const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");
                const sService = deriveServiceTopicFromRole(r.role_name, r.service_topic || r.serviceTopic || r.service);
                const sGroupKey = (r.requester_username || "User003") + "_" + (r.business_sector || "") + "_" + (r.business_function || "") + "_" + (isPendingForRole ? "PENDING" : "PROCESSED") + "_" + (isRevocation ? "REVOCATION" : "ADDITION");
                
                let sPersonaText = r.requester_persona || "Requester";
                if (sPersonaText.toUpperCase().includes("ADMIN") || sPersonaText.toUpperCase().includes("COMPLIANCE")) {
                    sPersonaText = "Compliance Reviewer";
                } else {
                    sPersonaText = "Requester";
                }

                if (!oGrouped[sGroupKey]) {
                    oGrouped[sGroupKey] = {
                        requestId: r.request_number,
                        requesterId: r.requester_username || "User003",
                        persona: sPersonaText,
                        system: r.target_system || "SAP BTP Cloud Platform",
                        serviceAndRole: (r.role_name || "IT Developers") + " (" + sService + ")",
                        serviceTopic: sService,
                        submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        decisionDate: r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "Information Technology & Security",
                        function: sService,
                        region: r.operating_region || "Global Enterprise (ALL)",
                        justification: r.justification || "Business Access Request",
                        selectedPersona: r.selected_persona || r.requester_persona || "Requester",
                        status: isRevocation ? (isPendingForRole ? "Revoke Pending" : (bRoleApproved ? "Approved" : "Rejected")) : (isPendingForRole ? "Pending Approval" : (bRoleApproved ? "Approved" : "Rejected")),
                        statusState: isRevocation ? (isPendingForRole ? "Error" : (bRoleApproved ? "Success" : "Error")) : (isPendingForRole ? "Warning" : (bRoleApproved ? "Success" : "Error")),
                        statusIcon: isRevocation ? "sap-icon://pending" : (isPendingForRole ? "sap-icon://pending" : (bRoleApproved ? "sap-icon://sys-enter-2" : "sap-icon://error")),
                        isRevocation: isRevocation,
                        _isPendingForRole: isPendingForRole,
                        approverRemark: r.approver_comment || r.approverComment || "Access approved for this requester.",
                        approver_comment: r.approver_comment || r.approverComment || "Access approved for this requester.",
                        entitlements: []
                    };
                }
                
                // Add entitlement to the group
                oGrouped[sGroupKey].entitlements.push({
                    requestId: r.request_number,
                    system: r.target_system,
                    roleName: r.role_name,
                    team: sService,
                    serviceTopic: sService,
                    selectedPersona: r.selected_persona || "Engineering & Developer Persona",
                    grantedDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    expiryDate: r.access_duration,
                    status: isPendingForRole ? (isRevocation ? "Revoke Pending" : "Pending") : (bRoleApproved ? "Approved" : "Rejected"),
                    statusState: isPendingForRole ? "Warning" : (bRoleApproved ? "Success" : "Error"),
                    statusIcon: isPendingForRole ? "sap-icon://pending" : (bRoleApproved ? "sap-icon://sys-enter-2" : "sap-icon://error"),
                    approverRemark: r.approver_comment || r.approverComment || "Access approved for this requester.",
                    approver_comment: r.approver_comment || r.approverComment || "Access approved for this requester."
                });
            });
            
            const aAllGrouped = Object.values(oGrouped);

            // Recompute overall group status based on individual entitlements decisions
            aAllGrouped.forEach(g => {
                if (!g._isPendingForRole) {
                    const approvedCount = g.entitlements.filter(e => e.status === "Approved").length;
                    const rejectedCount = g.entitlements.filter(e => e.status === "Rejected").length;
                    if (approvedCount > 0 && rejectedCount > 0) {
                        g.status = "Partially Approved";
                        g.statusState = "Warning";
                        g.statusIcon = "sap-icon://warning";
                    } else if (approvedCount > 0 && rejectedCount === 0) {
                        g.status = "Approved";
                        g.statusState = "Success";
                        g.statusIcon = "sap-icon://sys-enter-2";
                    } else if (approvedCount === 0 && rejectedCount > 0) {
                        g.status = "Rejected";
                        g.statusState = "Error";
                        g.statusIcon = "sap-icon://error";
                    }
                }
            });

            aAllGrouped.sort((a, b) => {
                const tA = new Date(a.createdAtRaw || 0).getTime();
                const tB = new Date(b.createdAtRaw || 0).getTime();
                if (tA !== tB) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });

            const aPendingRequests = aAllGrouped.filter(r => r._isPendingForRole);
            const aProcessedRequests = aAllGrouped.filter(r => !r._isPendingForRole);
            // Sort Processed Requests: Latest decision at the very top (first row)
            aProcessedRequests.sort((a, b) => {
                const tA = Math.max(new Date(a.updatedAtRaw || a.updated_at || a.decisionDate || a.createdAtRaw || a.created_at || a.submissionDate || 0).getTime(), 0);
                const tB = Math.max(new Date(b.updatedAtRaw || b.updated_at || b.decisionDate || b.createdAtRaw || b.created_at || b.submissionDate || 0).getTime(), 0);
                if (tA !== tB) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });

            const aPendingAccessRequests = aPendingRequests.filter(r => !r.isRevocation);
            const aPendingRevokeRequests = aPendingRequests.filter(r => r.isRevocation);

            this._setSmartProperty(oModel, "/pendingRequests", aPendingRequests);
            this._setSmartProperty(oModel, "/pendingAccessRequests", aPendingAccessRequests);
            this._setSmartProperty(oModel, "/pendingRevokeRequests", aPendingRevokeRequests);
            this._setSmartProperty(oModel, "/pendingAccessCount", aPendingAccessRequests.length);
            this._setSmartProperty(oModel, "/pendingRevokeCount", aPendingRevokeRequests.length);
            this._setSmartProperty(oModel, "/processedRequests", aProcessedRequests);

            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const aSubmitted = JSON.parse(sessionStorage.getItem("kyra_submitted_requests") || "[]");
            
            const aUserDbRequests = aDbRequests.filter(r => r.requesterUsername === sActiveUser || r.requesterId === sActiveUser);
            const aUserSessionRequests = aSubmitted.filter(r => r.requesterUsername === sActiveUser || r.requesterId === sActiveUser);

            let aCombined = [];

            aUserDbRequests.forEach(dbReq => {
                if (!aCombined.some(item => item.requestId === dbReq.requestId)) {
                    aCombined.push(dbReq);
                }
            });

            aUserSessionRequests.forEach(sessReq => {
                const idx = aCombined.findIndex(item => item.requestId === sessReq.requestId);
                if (idx !== -1) {
                    aCombined[idx] = Object.assign({}, sessReq, aCombined[idx]); // DB status takes precedence
                } else {
                    aCombined.push(sessReq);
                }
            });

            // Sort requests ascending so the newest/latest submissions are at the bottom
            aCombined.sort((a, b) => {
                const dateA = a.createdAtRaw ? new Date(a.createdAtRaw) : new Date(a.submissionDate || 0);
                const dateB = b.createdAtRaw ? new Date(b.createdAtRaw) : new Date(b.submissionDate || 0);
                return dateA - dateB;
            });

            const aMyPending = [];
            const aMyApproved = [];
            const aMyHistory = [];

            aCombined.forEach(r => {
                const sStatus = (r.status || "").toLowerCase();
                const sDuration = r.accessDuration || r.duration || "";
                let bExpired = false;

                if (sStatus.includes("approved") && !sDuration.toLowerCase().includes("permanent")) {
                    const match = sDuration.match(/(\d+)\s*Day/i);
                    if (match) {
                        const iDays = parseInt(match[1], 10);
                        const dSubmission = r.createdAtRaw ? new Date(r.createdAtRaw) : (r.submissionDate ? new Date(r.submissionDate) : new Date());
                        const dExpiry = new Date(dSubmission.getTime() + iDays * 24 * 60 * 60 * 1000);
                        if (new Date() > dExpiry) {
                            bExpired = true;
                        }
                    }
                }

                if (sStatus.includes("pending")) {
                    aMyPending.push(r);
                } else if (sStatus.includes("approved") && !bExpired) {
                    aMyApproved.push(r);
                } else {
                    if (bExpired) {
                        r.status = "Expired";
                        r.statusState = "Error";
                        r.statusIcon = "sap-icon://lateness";
                    }
                    aMyHistory.push(r);
                }
            });

            oModel.setProperty("/myPendingRequests", this._groupRequestsByRequestId(aMyPending));
            oModel.setProperty("/myApprovedRequests", aMyApproved);
            oModel.setProperty("/myHistoryRequests", aMyHistory);
            oModel.setProperty("/requestHistory", aCombined);
        },

        _groupRequestsByRequestId(aRequests) {
            if (!Array.isArray(aRequests) || aRequests.length === 0) return [];

            const oGroupedMap = {};
            const aGroupedOrder = [];

            aRequests.forEach(item => {
                const sReqId = item.requestId || item.requestNumber || "REQ-GENERAL";
                if (!oGroupedMap[sReqId]) {
                    oGroupedMap[sReqId] = {
                        requestId: sReqId,
                        requesterId: item.requesterId || item.requesterUsername || "Dev001",
                        requesterUsername: item.requesterUsername || item.requesterId || "Dev001",
                        type: item.type || "Addition",
                        persona: item.persona || item.selectedPersona || "Engineering & Developer Persona",
                        selectedPersona: item.selectedPersona || item.persona || "Engineering & Developer Persona",
                        accessDuration: item.accessDuration || "Permanent (Default)",
                        submissionDate: item.submissionDate || (item.createdAtRaw ? item.createdAtRaw.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: item.createdAtRaw || new Date().toISOString(),
                        approver: item.approver || "Line Manager / ISRM Team",
                        status: "Pending Approval",
                        statusState: "Warning",
                        statusIcon: "sap-icon://pending",
                        region: item.region || "",
                        justification: item.justification || "",
                        sector: item.sector || "",
                        function: item.function || "",
                        _systems: [],
                        _roles: [],
                        _serviceTopics: [],
                        _durations: [],
                        _types: [],
                        _personas: [],
                        entitlements: []
                    };
                    aGroupedOrder.push(sReqId);
                }

                const g = oGroupedMap[sReqId];
                if (item.system && !g._systems.includes(item.system)) {
                    g._systems.push(item.system);
                }
                if (item.roleName && !g._roles.includes(item.roleName)) {
                    g._roles.push(item.roleName);
                }
                const sTopic = item.serviceTopic || item.team || item.function;
                if (sTopic && !g._serviceTopics.includes(sTopic)) {
                    g._serviceTopics.push(sTopic);
                }
                if (item.accessDuration && !g._durations.includes(item.accessDuration)) {
                    g._durations.push(item.accessDuration);
                }
                if (item.type && !g._types.includes(item.type)) {
                    g._types.push(item.type);
                }
                const sPers = item.selectedPersona || item.persona;
                if (sPers && !g._personas.includes(sPers)) {
                    g._personas.push(sPers);
                }

                g.entitlements.push(item);
            });

            return aGroupedOrder.map(sReqId => {
                const g = oGroupedMap[sReqId];
                g.system = g._systems.join(", ");
                g.roleName = g._roles.join(", ");
                g.serviceTopic = g._serviceTopics.join(", ");
                g.accessDuration = g._durations.join(", ") || g.accessDuration;
                g.type = g._types.join(", ") || g.type;
                if (g._personas.length > 0) {
                    g.selectedPersona = g._personas.join(", ");
                    g.persona = g._personas[0];
                }
                delete g._systems;
                delete g._roles;
                delete g._serviceTopics;
                delete g._durations;
                delete g._types;
                delete g._personas;
                return g;
            });
        },

        onAcceptAllRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sDefaultRemark = "Approved during standard review cycle";

            const sPath = "/selectedRequest/entitlements";
            const aEntitlements = oModel.getProperty(sPath) || [];
            aEntitlements.forEach((ent, i) => {
                oModel.setProperty(sPath + "/" + i + "/status", "Approved");
                oModel.setProperty(sPath + "/" + i + "/statusState", "Success");
                oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://sys-enter-2");
                oModel.setProperty(sPath + "/" + i + "/comment", sDefaultRemark);
            });

            const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
            aTables.forEach(t => {
                (t.items || []).forEach(item => {
                    item.status = "Approved";
                    item.statusState = "Success";
                    item.statusIcon = "sap-icon://sys-enter-2";
                    item.comment = sDefaultRemark;
                });
            });
            oModel.setProperty("/selectedRequest/summaryTables", aTables);

            MessageToast.show("All entitlements approved with default remark.");
        },

        onRejectAllRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sDefaultRemark = "Rejected during standard review cycle";

            const sPath = "/selectedRequest/entitlements";
            const aEntitlements = oModel.getProperty(sPath) || [];
            aEntitlements.forEach((ent, i) => {
                oModel.setProperty(sPath + "/" + i + "/status", "Rejected");
                oModel.setProperty(sPath + "/" + i + "/statusState", "Error");
                oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://error");
                oModel.setProperty(sPath + "/" + i + "/comment", sDefaultRemark);
            });

            const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
            aTables.forEach(t => {
                (t.items || []).forEach(item => {
                    item.status = "Rejected";
                    item.statusState = "Error";
                    item.statusIcon = "sap-icon://error";
                    item.comment = sDefaultRemark;
                });
            });
            oModel.setProperty("/selectedRequest/summaryTables", aTables);

            MessageToast.show("All entitlements rejected with default remark.");
        },

        onCancelRequestSummaryView() {
            sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        }
    });
});
