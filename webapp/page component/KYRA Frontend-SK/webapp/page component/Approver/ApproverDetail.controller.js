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

    function cleanPersonaName(s) {
        if (!s) return "";
        let str = String(s).trim();
        str = str.replace(/\s*\([^)]*\)\s*$/g, "").trim();
        str = str.replace(/\s+persona$/i, "").trim();
        return str || s;
    }

    function deriveServiceTopicFromRole(roleStr, rawService) {
        const sRawService = String(rawService || "").replace(/\s*\([^)]*\)/g, "").trim();
        if (sRawService === "System Administrator" || sRawService === "System Owners" || sRawService === "Stakeholders") {
            return sRawService;
        }
        const rLower = String(roleStr || "").toLowerCase();
        if (rLower.includes("system admin") || rLower.includes("it developer") || rLower.includes("developer") || rLower.includes("it admin") || rLower.includes("it security") || rLower.includes("security")) {
            return "";
        }
        if (rLower.includes("system owner") || rLower.includes("product group engineer") || rLower.includes("technical product owner") || rLower.includes("engineer") || rLower.includes("owner")) {
            return "System Owners";
        }
        if (rLower.includes("stakeholder") || rLower.includes("isrm") || rLower.includes("line manager") || rLower.includes("compliance manager") || rLower.includes("compliance")) {
            return "Stakeholders";
        }
        return "";
    }

    function getBaseReqId(num) {
        if (!num) return "";
        const parts = String(num).trim().split("-");
        if (parts.length >= 3) {
            return parts.slice(0, 3).join("-");
        }
        return String(num).trim();
    }


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
                let oModel = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
                if (!oModel) {
                    oModel = new sap.ui.model.json.JSONModel({});
                    this.getView().setModel(oModel, "accessModel");
                    if (this.getOwnerComponent()) this.getOwnerComponent().setModel(oModel, "accessModel");
                }

                const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
                const isCompliance = sActiveRole.includes("compliance");
                oModel.setProperty("/isCompliance", isCompliance);
                oModel.setProperty("/isComplianceReviewer", isCompliance);
                oModel.setProperty("/isCompliancePersona", isCompliance);
                if (!oModel) return;

                const sBaseReqId = getBaseReqId(sReqId);

                const matchReq = (r) => {
                    if (!r) return false;
                    if (r.requestId === sReqId || r.requestNumber === sReqId) return true;
                    if (sBaseReqId && getBaseReqId(r.requestId || r.requestNumber) === sBaseReqId) return true;
                    if (r.entitlements && r.entitlements.some(e => e.requestId === sReqId || (sBaseReqId && getBaseReqId(e.requestId) === sBaseReqId))) return true;
                    return false;
                };

                let aPending = oModel.getProperty("/pendingRequests") || [];
                let aProcessed = oModel.getProperty("/processedRequests") || [];
                let oRequest = aPending.find(matchReq) || aProcessed.find(matchReq);

                if (!oRequest) {
                    await this._reloadAllRequests(oModel);
                    aPending = oModel.getProperty("/pendingRequests") || [];
                    aProcessed = oModel.getProperty("/processedRequests") || [];
                    oRequest = aPending.find(matchReq) || aProcessed.find(matchReq);
                }

                // Robust direct DB fallback
                if (!oRequest) {
                    try {
                        const resp = await fetch("/odata/v4/admin-portal/GovernanceHistory");
                        const dbData = await resp.json();
                        const aAllDb = dbData && dbData.value ? dbData.value : [];
                        const aMatching = aAllDb.filter(r => r.request_number === sReqId || (sBaseReqId && getBaseReqId(r.request_number) === sBaseReqId));
                        if (aMatching.length > 0) {
                            const first = aMatching[0];
                            const sSvc = deriveServiceTopicFromRole(first.role_name, first.service_topic || first.service);
                            oRequest = {
                                requestId: first.request_number,
                                requesterId: first.requester_username || "Requester",
                                requesterUsername: first.requester_username || "Requester",
                                persona: first.requester_persona || "Requester",
                                system: first.target_system || "SAP System",
                                serviceAndRole: (first.role_name || "Role") + " (" + sSvc + ")",
                                serviceTopic: sSvc,
                                submissionDate: first.created_at ? first.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                                duration: first.access_duration || "",
                                sector: first.business_sector || "",
                                businessSector: first.business_sector || "",
                                function: first.business_function || "",
                                businessFunction: first.business_function || "",
                                duration: first.access_duration || "",
                                region: first.operating_region || "",
                                justification: first.justification || "Access Request",
                                selectedPersona: cleanPersonaName(first.selected_persona || ""),
                                status: "Pending Approval",
                                statusState: "Warning",
                                statusIcon: "sap-icon://pending",
                                approverRemark: first.approver_comment || "",
                                entitlements: aMatching.map(m => ({
                                    requestId: m.request_number,
                                    system: m.target_system,
                                    roleName: (m.role_name || "").replace(/\s*\([^)]*\)/g, "").trim(),
                                    team: deriveServiceTopicFromRole(m.role_name, m.service_topic || m.service),
                                    serviceTopic: deriveServiceTopicFromRole(m.role_name, m.service_topic || m.service),
                                    selectedPersona: cleanPersonaName(m.selected_persona || ""),
                                    grantedDate: m.created_at ? m.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                                    expiryDate: m.access_duration || "Permanent",
                                    status: "Pending",
                                    statusState: "Warning",
                                    statusIcon: "sap-icon://pending",
                                    approverRemark: m.approver_comment || "",
                                    comment: ""
                                }))
                            };
                        }
                    } catch(e) {
                        console.warn("Direct DB fallback fetch error:", e);
                    }
                }

                if (oRequest) {
                    const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Approver";
                    const isCompliancePersona = sActiveRole.toLowerCase().includes("compliance");
                    oModel.setProperty("/activeRole", sActiveRole);
                    oModel.setProperty("/isCompliancePersona", isCompliancePersona);

                    const sRequesterId = oRequest.requesterId || oRequest.requesterUsername || "";
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
                                return "";
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
                                sApproverRemark = ent.approverRemark || ent.approver_comment || ent.managerRemark || oRequest.approverRemark || oRequest.approver_comment || oRequest.managerRemark || oRequest.comments || "";
                            }

                            const sRawRole = ent.roleName || ent.roleTitle || oRequest.roleName || "System Entitlement";
                            const sService = getCleanServiceTopic(ent) || getCleanServiceTopic(oRequest);
                            const sTeam = cleanRole(sRawRole);
                            const sPersona = cleanPersonaName(ent.selectedPersona || ent.selected_persona || ent.persona || oRequest.selectedPersona || oRequest.persona || "");

                            aEntList.push({
                                requestId: ent.requestId || oRequest.requestId,
                                system: ent.system || oRequest.system || "SAP System",
                                services: sService,
                                serviceTopic: sService,
                                service: sService,
                                team: sTeam,
                                teamName: sTeam,
                                roleName: sTeam,
                                selectedPersona: sPersona,
                                persona: sPersona,
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
                            sApproverRemark = oRequest.approverRemark || oRequest.approver_comment || oRequest.managerRemark || oRequest.comments || "";
                        }

                        const sRawRole = oRequest.roleName || oRequest.serviceAndRole || "System Role";
                        const sService = getCleanServiceTopic(oRequest);
                        const sTeam = cleanRole(sRawRole);
                        const sPersona = cleanPersonaName(oRequest.selectedPersona || oRequest.persona || "");

                        aEntList.push({
                            requestId: oRequest.requestId,
                            system: oRequest.system || "SAP System",
                            services: sService,
                            serviceTopic: sService,
                            service: sService,
                            team: sTeam,
                            teamName: sTeam,
                            roleName: sTeam,
                            selectedPersona: sPersona,
                            persona: sPersona,
                            grantedDate: oRequest.submissionDate || new Date().toISOString().split("T")[0],
                            expiryDate: oRequest.duration || "Permanent",
                            status: sInitStatus,
                            statusState: sInitState,
                            statusIcon: sInitIcon,
                            approverRemark: sApproverRemark,
                            comment: oRequest.comment || ""
                        });
                    }

                    // Always enrich entitlements with live DB records to ensure each individual item's persona is 100% accurate
                    try {
                        const respLive = await fetch("/odata/v4/admin-portal/GovernanceHistory");
                        if (respLive.ok) {
                            const liveData = await respLive.json();
                            if (liveData && liveData.value) {
                                const dbMap = {};
                                liveData.value.forEach(dbItem => {
                                    if (dbItem.request_number) {
                                        dbMap[dbItem.request_number] = dbItem;
                                    }
                                });
                                aEntList.forEach(item => {
                                    const dbRec = dbMap[item.requestId];
                                    if (dbRec) {
                                        if (dbRec.approver_comment || dbRec.approverRemark) {
                                            const sRem = dbRec.approver_comment || dbRec.approverRemark;
                                            item.approverRemark = sRem;
                                        }
                                        if (dbRec.selected_persona || dbRec.persona) {
                                            const sCleanP = cleanPersonaName(dbRec.selected_persona || dbRec.persona);
                                            item.selectedPersona = sCleanP;
                                            item.persona = sCleanP;
                                        }
                                        if (dbRec.role_name) {
                                            const sCleanR = cleanRole(dbRec.role_name);
                                            item.team = sCleanR;
                                            item.teamName = sCleanR;
                                            item.roleName = sCleanR;
                                        }
                                        if (dbRec.service_topic || dbRec.service) {
                                            const sCleanS = (dbRec.service_topic || dbRec.service).trim();
                                            item.services = sCleanS;
                                            item.serviceTopic = sCleanS;
                                            item.service = sCleanS;
                                        }
                                    }
                                });
                            }
                        }
                    } catch(e) {
                        console.warn("Could not enrich live personas:", e);
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
                        selectedPersona: cleanPersonaName(oRequest.selectedPersona || oRequest.persona || ""),
                        region: oRequest.region || oRequest.operatingRegion || "Global Enterprise (ALL)",
                        operatingRegion: oRequest.region || oRequest.operatingRegion || "Global Enterprise (ALL)",
                        sector: oRequest.businessSector || oRequest.sector || "Information Technology & Security",
                        businessSector: oRequest.businessSector || oRequest.sector || "Information Technology & Security",
                        function: oRequest.businessFunction || oRequest.function || "Corporate Governance",
                        businessFunction: oRequest.businessFunction || oRequest.function || "Corporate Governance",
                        duration: oRequest.accessDuration || oRequest.duration || "Permanent (Default)",
                        accessDuration: oRequest.accessDuration || oRequest.duration || "Permanent (Default)",
                        justification: oRequest.justification || "Business Access Entitlement",
                        type: oRequest.type || (oRequest.isRevocation ? "Revocation" : "Addition"),
                        status: oRequest.status,
                        statusState: oRequest.statusState,
                        statusIcon: oRequest.statusIcon,
                        approverRemark: oRequest.approverRemark || (aEntList[0] && aEntList[0].approverRemark) || "",
                        entitlements: aEntList,
                        summaryTables: aSummaryTables
                    });

                    await this._evaluateSodConflictsForRequest(oRequest, aEntList, oModel);
                    oModel.setProperty("/approverSodTab", 1);

                    // Wait for UI5 binding updates and DOM rendering to finish before dismissing loader
                    await new Promise(resolve => setTimeout(resolve, 400));
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
                const num = (r.request_number || "").trim();
                const base = getBaseReqId(num);
                const isPending = (sStat === "PENDING" || sStat.startsWith("PENDING_")) && sStat !== "APPROVED" && sStat !== "REJECTED";
                const isCurrentReq = (num === sCurrentRequestId) || (sCurrentReqBase && base === sCurrentReqBase);
                return isPending && !isCurrentReq;
            });

            const normalizeSystemName = (sys) => {
                if (!sys) return "";
                let s = String(sys).trim().toLowerCase();
                if (s.includes("btp")) return "btp";
                if (s.includes("s/4hana") || s.includes("s4hana")) return "s4hana";
                if (s.includes("ariba")) return "ariba";
                if (s.includes("successfactors") || s.includes("success factors")) return "successfactors";
                if (s.includes("concur")) return "concur";
                if (s.includes("analytics")) return "analytics";
                return s;
            };

            const isSameSystem = (sysA, sysB) => {
                if (!sysA || !sysB) return true;
                const normA = normalizeSystemName(sysA);
                const normB = normalizeSystemName(sysB);
                return normA === normB || normA.includes(normB) || normB.includes(normA);
            };

            const cleanStr = (s) => String(s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();

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

            const cleanPersonaName = (s) => {
                if (!s) return "";
                let str = String(s).trim();
                str = str.replace(/\s*\([^)]*\)\s*$/g, "").trim();
                str = str.replace(/\s+persona$/i, "").trim();
                return str || s;
            };

            const getFunctionalArchetype = (roleStr, personaStr) => {
                const cleanR = cleanStr(roleStr);
                const cleanP = cleanStr(personaStr);
                const combined = cleanR + " " + cleanP;

                if (combined.includes("developer") || cleanP.includes("developer")) return "developer";
                if (combined.includes("administrator") || combined.includes("it admin") || cleanP.includes("cloud infrastructure") || cleanP.includes("database & iam") || cleanR.includes("admin")) return "admin";
                if (combined.includes("security") || cleanP.includes("security") || cleanP.includes("cybersecurity") || cleanR.includes("isrm") || cleanP.includes("isrm") || cleanR.includes("audit") || cleanP.includes("audit")) return "security";
                if (combined.includes("lead engineer") || cleanP.includes("principal systems") || cleanP.includes("devops & platform") || cleanR.includes("engineer")) return "engineer";
                if (combined.includes("compliance") || cleanP.includes("compliance") || cleanP.includes("auditor") || cleanP.includes("privacy")) return "compliance";
                if (combined.includes("product owner") || cleanP.includes("solution architecture") || cleanP.includes("product manager")) return "owner";
                if (combined.includes("product group") || cleanP.includes("product suite") || cleanP.includes("integration engineering")) return "product_group";
                if (combined.includes("line manager") || cleanP.includes("people operations") || cleanP.includes("resource manager")) return "manager";
                if (combined.includes("role owner") || cleanP.includes("role custodian") || cleanP.includes("access governance approver")) return "role_owner";
                return cleanR || "user";
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
                const sR1 = String(rule.role1 || rule.role_a || rule.roleA || "").toLowerCase().trim();
                const sR2 = String(rule.role2 || rule.role_b || rule.roleB || "").toLowerCase().trim();
                const cRA = cleanStr(roleA);
                const cRB = cleanStr(roleB);
                const cPA = cleanStr(personaA);
                const cPB = cleanStr(personaB);

                const archA = getFunctionalArchetype(roleA, personaA);
                const archB = getFunctionalArchetype(roleB, personaB);

                if (archA === archB && (cRA === cRB || (cPA && cPB && cPA === cPB))) {
                    return false;
                }

                const directMatch1 = (cRA.includes(sR1) || cPA.includes(sR1)) && (cRB.includes(sR2) || cPB.includes(sR2));
                const directMatch2 = (cRA.includes(sR2) || cPA.includes(sR2)) && (cRB.includes(sR1) || cPB.includes(sR1));
                if (directMatch1 || directMatch2) return true;

                if (archA === archB) return false;

                const r1 = getRuleArchetype(sR1);
                const r2 = getRuleArchetype(sR2);

                return (archA === r1 && archB === r2) || (archA === r2 && archB === r1);
            };

            const aActiveConflicts = [];
            const aPendingConflicts = [];
            const aBatchConflicts = [];

            const aItemsToCheck = (aEntList && aEntList.length > 0 ? aEntList : (oRequest.entitlements && oRequest.entitlements.length > 0 ? oRequest.entitlements : [oRequest])).slice();
            aItemsToCheck.sort((a, b) => String(a.requestId || a.request_number || "").localeCompare(String(b.requestId || b.request_number || ""), undefined, { numeric: true }));

            // 1. Check Active Conflicts against LIVE active access of this requester
            const activeConflictMap = new Map();
            aItemsToCheck.forEach(newItem => {
                const sNewSys = newItem.system || newItem.target_system || "";
                const sNewRoleName = newItem.roleName || newItem.role_name || newItem.roleTitle || "Requested Role";
                const sNewPersona = newItem.selectedPersona || newItem.selected_persona || newItem.persona || sNewRoleName;

                aUserActiveRoles.forEach(activeRole => {
                    const sActiveSys = activeRole.target_system || activeRole.system || "";
                    if (!isSameSystem(sActiveSys, sNewSys)) return;
                    if (isSameAccess(activeRole, newItem)) return;

                    const sActiveRoleName = activeRole.role_name || activeRole.roleName || activeRole.roleTitle || "Active Role";
                    const sActivePersona = activeRole.selected_persona || activeRole.selectedPersona || activeRole.persona || sActiveRoleName;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between active entitlement and newly requested access.";

                        if (checkConflictMatch(sNewRoleName, sNewPersona, sActiveRoleName, sActivePersona, rule)) {
                            const sCleanActiveRole = cleanPersonaName(sActiveRoleName);
                            const sCleanNewRole = cleanPersonaName(sNewRoleName);
                            const sKey = `${sActiveSys}:::${sCleanActiveRole}:::${sNewSys}:::${sCleanNewRole}`;
                            if (!activeConflictMap.has(sKey)) {
                                activeConflictMap.set(sKey, {
                                    system: sNewSys,
                                    existingRole: `${sActiveSys} — ${sCleanActiveRole}`,
                                    newRole: `${sNewSys} — ${sCleanNewRole}`,
                                    cleanActiveRole: sCleanActiveRole,
                                    cleanNewRole: sCleanNewRole,
                                    existingPersonas: new Set(),
                                    newPersonas: new Set(),
                                    conflictTitle: "Segregation of Duties (SoD) Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                            const entry = activeConflictMap.get(sKey);
                            if (sActivePersona) entry.existingPersonas.add(cleanPersonaName(sActivePersona));
                            if (sNewPersona) entry.newPersonas.add(cleanPersonaName(sNewPersona));
                        }
                    });
                });
            });

            activeConflictMap.forEach(entry => {
                const sExisting = Array.from(entry.existingPersonas).join("\n");
                const sNew = Array.from(entry.newPersonas).join("\n");
                aActiveConflicts.push({
                    system: entry.system,
                    existingRole: entry.existingRole,
                    existingPersona: sExisting,
                    newRole: entry.newRole,
                    newPersona: sNew,
                    conflictTitle: entry.conflictTitle,
                    conflictDesc: entry.conflictDesc
                });
            });

            // 2. Check Pending Conflicts against LIVE other in-flight requests of this requester
            const pendingConflictMap = new Map();
            aItemsToCheck.forEach(newItem => {
                const sNewSys = newItem.system || newItem.target_system || "";
                const sNewRoleName = newItem.roleName || newItem.role_name || newItem.roleTitle || "Requested Role";
                const sNewPersona = newItem.selectedPersona || newItem.selected_persona || newItem.persona || sNewRoleName;

                aUserPendingRequests.forEach(pendingReq => {
                    const sPendingSys = pendingReq.target_system || pendingReq.system || "";
                    if (!isSameSystem(sPendingSys, sNewSys)) return;
                    if (isSameAccess(pendingReq, newItem)) return;

                    const sPendingRoleName = pendingReq.role_name || pendingReq.roleName || pendingReq.roleTitle || "Pending Role";
                    const sPendingPersona = pendingReq.selected_persona || pendingReq.selectedPersona || pendingReq.persona || sPendingRoleName;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected against pending access request.";

                        if (checkConflictMatch(sNewRoleName, sNewPersona, sPendingRoleName, sPendingPersona, rule)) {
                            const sCleanPendingRole = cleanPersonaName(sPendingRoleName);
                            const sCleanNewRole = cleanPersonaName(sNewRoleName);
                            const sKey = `${sPendingSys}:::${sCleanPendingRole}:::${sNewSys}:::${sCleanNewRole}`;
                            if (!pendingConflictMap.has(sKey)) {
                                pendingConflictMap.set(sKey, {
                                    system: sNewSys,
                                    existingRole: `${sPendingSys} — ${sCleanPendingRole}`,
                                    newRole: `${sNewSys} — ${cleanPersonaName(sCleanNewRole)}`,
                                    cleanPendingRole: sCleanPendingRole,
                                    cleanNewRole: sCleanNewRole,
                                    existingPersonas: new Set(),
                                    newPersonas: new Set(),
                                    conflictTitle: "Segregation of Duties (SoD) Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                            const entry = pendingConflictMap.get(sKey);
                            if (sPendingPersona) entry.existingPersonas.add(cleanPersonaName(sPendingPersona));
                            if (sNewPersona) entry.newPersonas.add(cleanPersonaName(sNewPersona));
                        }
                    });
                });
            });

            pendingConflictMap.forEach(entry => {
                const sExisting = Array.from(entry.existingPersonas).join("\n");
                const sNew = Array.from(entry.newPersonas).join("\n");
                aPendingConflicts.push({
                    system: entry.system,
                    existingRole: entry.existingRole,
                    existingPersona: sExisting,
                    newRole: entry.newRole,
                    newPersona: sNew,
                    conflictTitle: entry.conflictTitle,
                    conflictDesc: entry.conflictDesc
                });
            });

            // 3. Check Batch Intra-Role Conflicts (within the newly added items / current request batch)
            const batchConflictMap = new Map();
            for (let i = 0; i < aItemsToCheck.length; i++) {
                for (let j = i + 1; j < aItemsToCheck.length; j++) {
                    const itemA = aItemsToCheck[i];
                    const itemB = aItemsToCheck[j];

                    const sSysA = itemA.system || itemA.target_system || "Enterprise System";
                    const sSysB = itemB.system || itemB.target_system || "Enterprise System";

                    if (!isSameSystem(sSysA, sSysB)) continue;
                    if (isSameAccess(itemA, itemB)) continue;

                    const sRoleA = itemA.roleName || itemA.role_name || itemA.roleTitle || "";
                    const sPersonaA = itemA.selectedPersona || itemA.selected_persona || itemA.persona || sRoleA;
                    const sRoleB = itemB.roleName || itemB.role_name || itemB.roleTitle || "";
                    const sPersonaB = itemB.selectedPersona || itemB.selected_persona || itemB.persona || sRoleB;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between multiple newly added roles selected together in this request.";

                        if (checkConflictMatch(sRoleA, sPersonaA, sRoleB, sPersonaB, rule)) {
                            const sCleanRoleA = cleanPersonaName(sRoleA);
                            const sCleanRoleB = cleanPersonaName(sRoleB);

                            const sKey = `${sSysA}:::${sCleanRoleA}:::${sSysB}:::${sCleanRoleB}`;
                            const sReverseKey = `${sSysB}:::${sCleanRoleB}:::${sSysA}:::${sCleanRoleA}`;

                            let targetKey = sKey;
                            let bIsReverse = false;
                            if (batchConflictMap.has(sReverseKey)) {
                                targetKey = sReverseKey;
                                bIsReverse = true;
                            }

                            if (!batchConflictMap.has(targetKey)) {
                                batchConflictMap.set(targetKey, {
                                    system: sSysA,
                                    roleA: `${sSysA} — ${sCleanRoleA}`,
                                    roleB: `${sSysB} — ${sCleanRoleB}`,
                                    cleanRoleA: sCleanRoleA,
                                    cleanRoleB: sCleanRoleB,
                                    personasA: new Set(),
                                    personasB: new Set(),
                                    conflictTitle: "Batch Selection SoD Conflict",
                                    conflictDesc: sDesc
                                });
                            }

                            const entry = batchConflictMap.get(targetKey);
                            if (!bIsReverse) {
                                if (sPersonaA) entry.personasA.add(cleanPersonaName(sPersonaA));
                                if (sPersonaB) entry.personasB.add(cleanPersonaName(sPersonaB));
                            } else {
                                if (sPersonaA) entry.personasB.add(cleanPersonaName(sPersonaA));
                                if (sPersonaB) entry.personasA.add(cleanPersonaName(sPersonaB));
                            }
                        }
                    });
                }
            }

            // Also ensure any matching items in the batch are collected for these conflicted roles
            batchConflictMap.forEach(entry => {
                aItemsToCheck.forEach(item => {
                    const itemSys = item.system || item.target_system || "Enterprise System";
                    if (!isSameSystem(itemSys, entry.system)) return;
                    const itemRole = cleanPersonaName(item.roleName || item.role_name || item.roleTitle || "");
                    const itemPersona = cleanPersonaName(item.selectedPersona || item.selected_persona || item.persona || "");
                    if (!itemPersona) return;

                    const arch = getFunctionalArchetype(itemRole, itemPersona);
                    const archA = getFunctionalArchetype(entry.cleanRoleA, entry.cleanRoleA);
                    const archB = getFunctionalArchetype(entry.cleanRoleB, entry.cleanRoleB);

                    if (itemRole === entry.cleanRoleA || arch === archA) {
                        entry.personasA.add(itemPersona);
                    } else if (itemRole === entry.cleanRoleB || arch === archB) {
                        entry.personasB.add(itemPersona);
                    }
                });

                const sPersonaA = Array.from(entry.personasA).join("\n");
                const sPersonaB = Array.from(entry.personasB).join("\n");

                aBatchConflicts.push({
                    system: entry.system,
                    roleA: entry.roleA,
                    personaA: sPersonaA,
                    roleB: entry.roleB,
                    personaB: sPersonaB,
                    existingRole: entry.roleA,
                    existingPersona: sPersonaA,
                    newRole: entry.roleB,
                    newPersona: sPersonaB,
                    conflictTitle: "Batch Selection SoD Conflict",
                    conflictDesc: entry.conflictDesc
                });
            });

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
            try {
                const oRouter = this.getOwnerComponent() && this.getOwnerComponent().getRouter();
                if (oRouter) {
                    oRouter.navTo("AccessPage", {}, true);
                } else if (window.history && window.history.length > 1) {
                    window.history.back();
                }
            } catch(e) {
                console.warn("Navigation error:", e);
                if (window.history && window.history.length > 1) {
                    window.history.back();
                }
            }
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
                const sCurStatus = oEntitlement.status;
                const sCurComment = (oEntitlement.comment || "").trim();
                const sBatchRemark = (this._lastBatchRemark || "").trim();

                oModel.setProperty(sPath + "/status", "Approved");
                oModel.setProperty(sPath + "/statusState", "Success");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://sys-enter-2");

                // Clear input field if user manually changes decision after batch action, switches from Rejected, or comment equals batch remark
                if (this._hasPerformedBatchAction || sCurStatus === "Rejected" || (sBatchRemark && sCurComment === sBatchRemark) || sCurComment === "Rejected during standard review cycle" || sCurComment === "Approved during standard review cycle") {
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
                const sCurStatus = oEntitlement.status;
                const sCurComment = (oEntitlement.comment || "").trim();
                const sBatchRemark = (this._lastBatchRemark || "").trim();

                oModel.setProperty(sPath + "/status", "Rejected");
                oModel.setProperty(sPath + "/statusState", "Error");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://error");

                // Clear input field if user manually changes decision after batch action, switches from Approved, or comment equals batch remark
                if (this._hasPerformedBatchAction || sCurStatus === "Approved" || (sBatchRemark && sCurComment === sBatchRemark) || sCurComment === "Approved during standard review cycle" || sCurComment === "Rejected during standard review cycle") {
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
                            <div style="font-weight: 800; font-size: 14px; color: #0F172A;">Requester (${oData.requesterId || oData.requesterUsername || ""})</div>
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
                                        <span style="font-weight: 600; color: #334155;">Persona:</span> ${i.selectedPersona || oData.selectedPersona || ""}
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
                                        <span style="font-weight: 600; color: #334155;">Persona:</span> ${i.selectedPersona || oData.selectedPersona || ""}
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
                    subtitle: "Recording decision and updating governance audit log...",
                    duration: 4000
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Submitting Access Decision...", "Recording decision and updating governance audit log...", 4000);
            }
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                sap.ui.core.BusyIndicator.show(0);
            }

            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Approver";
            const bIsComplianceApprover = (sActiveRole === "Compliance Approver" || sActiveRole === "Compliance Reviewer" || sActiveRole === "Compliance Review");

            try {
                // Evaluate if this request has ANY conflicts in the SoD tables or request data
                const aActiveConflicts = oModel.getProperty("/selectedRequestSodActiveConflicts") || [];
                const aPendingConflicts = oModel.getProperty("/selectedRequestSodPendingConflicts") || [];
                const aBatchConflicts = oModel.getProperty("/selectedRequestSodBatchConflicts") || [];
                const bHasConflict = (aActiveConflicts.length > 0 || aPendingConflicts.length > 0 || aBatchConflicts.length > 0 || oData.hasConflict === true || oData.has_conflict === true);

                // Build decisions payload for backend persistence with approver comments
                const aDecisionsPayload = (oData.entitlements || []).map(e => {
                    const isRejected = (e.status || "").toLowerCase().includes("reject");
                    let sStatus = isRejected ? "REJECTED" : "APPROVED";
                    let sComment = e.comment || e.comments || (isRejected ? "Rejected by Approver" : "Approved by Approver");

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

                // Immediately update pending and processed lists in model & sessionStorage
                let aCurrentPending = oModel.getProperty("/pendingRequests") || [];
                let aCurrentProcessed = oModel.getProperty("/processedRequests") || [];

                aCurrentPending = aCurrentPending.filter(req => req.requestId !== oData.requestId);
                oModel.setProperty("/pendingRequests", aCurrentPending);
                oModel.setProperty("/pendingAccessRequests", aCurrentPending.filter(p => !p.isRevocation && p.type !== "Revocation"));
                oModel.setProperty("/pendingRevokeRequests", aCurrentPending.filter(p => p.isRevocation || p.type === "Revocation"));
                oModel.setProperty("/pendingAccessCount", aCurrentPending.filter(p => !p.isRevocation && p.type !== "Revocation").length);
                oModel.setProperty("/pendingRevokeCount", aCurrentPending.filter(p => p.isRevocation || p.type === "Revocation").length);

                const sSec = oData.businessSector || oData.sector || "Information Technology & Security";
                const sFunc = oData.businessFunction || oData.function || "Corporate Governance";
                const sDur = oData.duration || "Permanent (Default)";

                const oNewProcessedItem = {
                    requestId: oData.requestId,
                    requesterId: oData.requesterId || oData.requesterUsername || "User",
                    selectedPersona: oData.selectedPersona || oData.persona || "User",
                    persona: oData.persona || oData.selectedPersona || "User",
                    sector: sSec,
                    businessSector: sSec,
                    function: sFunc,
                    businessFunction: sFunc,
                    duration: sDur,
                    serviceTopic: oData.serviceTopic || "",
                    decisionDate: new Date().toISOString().split("T")[0],
                    submissionDate: oData.submissionDate || new Date().toISOString().split("T")[0],
                    status: sOverallStatus,
                    statusState: sOverallState,
                    statusIcon: sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://alert"),
                    isRevocation: oData.isRevocation || false,
                    _isPendingForRole: false,
                    entitlements: (oData.entitlements || []).map(e => ({
                        requestId: e.requestId || oData.requestId,
                        system: e.system,
                        roleName: e.roleName,
                        team: oData.team || oData.roleName || oData.serviceTopic || "",
                        serviceTopic: oData.serviceTopic || "",
                        status: (e.status || "").toLowerCase().includes("reject") ? "Rejected" : "Approved",
                        statusState: (e.status || "").toLowerCase().includes("reject") ? "Error" : "Success",
                        statusIcon: (e.status || "").toLowerCase().includes("reject") ? "sap-icon://error" : "sap-icon://sys-enter-2",
                        comment: e.comment || e.comments || ""
                    }))
                };

                aCurrentProcessed = aCurrentProcessed.filter(p => p.requestId !== oData.requestId);
                aCurrentProcessed.unshift(oNewProcessedItem);
                oModel.setProperty("/processedRequests", aCurrentProcessed);

                try {
                    sessionStorage.setItem("kyra_processed_requests", JSON.stringify(aCurrentProcessed));
                    sessionStorage.setItem("kyra_pending_requests", JSON.stringify(aCurrentPending));
                } catch(eStorage) {
                    console.warn("Storage warning:", eStorage);
                }

                // Post decision to backend service with timeout protection
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 6000);
                    const response = await fetch("/odata/v4/auth/submitAccessDecision", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        signal: controller.signal,
                        body: JSON.stringify({
                            requestNumber: oData.requestId,
                            actorRole: sActiveRole,
                            hasConflict: bHasConflict,
                            decisions: aDecisionsPayload
                        })
                    });
                    clearTimeout(timeoutId);
                    const data = await response.json();
                    console.log("Decision persisted into database successfully:", data);

                    // Reload all request data directly from database
                    await this._reloadAllRequests(oModel);

                    // Broadcast decision mutation event so user dashboards update live instantly
                    this._notifyDatabaseMutation();
                } catch (netErr) {
                    console.warn("Network / DB persistence note:", netErr.message);
                }

                // Create user notification for requester
                const sStatusIcon = sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://alert");
                const sOverallComment = (oData.entitlements || []).map(e => e.comment || e.comments).filter(Boolean).join("; ") || (sOverallStatus === "Approved" ? "Access approved for this requester." : (sOverallStatus === "Rejected" ? "Access rejected." : "Decision updated."));
                let sNotifDesc = "Your access request (" + oData.requestId + ") for " + sSec + " has been " + sOverallStatus.toLowerCase() + " by the " + sActiveRole + ".";
                if (sOverallComment) {
                    sNotifDesc += " Approver Remark: \"" + sOverallComment + "\"";
                }

                try {
                    const aUserNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                    aUserNotifications.unshift({
                        id: "NOTIF-" + Date.now(),
                        requesterId: oData.requesterId || oData.requesterUsername || "",
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
                    sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aUserNotifications));
                } catch(eNotif) {}

                sessionStorage.setItem("kyra_show_approval_history", "true");
                sessionStorage.setItem("kyra_select_tab", "myAccess");
                sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
                oModel.setProperty("/showApprovalHistory", true);
                oModel.setProperty("/selectedTabKey", "myAccess");
                oModel.setProperty("/showRequestDetailsPage", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);

                MessageToast.show("Decision submitted for Request Id " + oData.requestId);
            } catch (err) {
                console.error("Critical error in _executeFinalSubmission:", err);
            } finally {
                // Ensure ALL loaders and overlays are completely dismissed immediately
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
                const overlay = document.getElementById("kyra_loading_slide_overlay");
                if (overlay) {
                    overlay.classList.remove("kyra-active");
                    overlay.style.setProperty("display", "none", "important");
                    overlay.style.setProperty("pointer-events", "none", "important");
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }

                // Guaranteed Navigation back to dashboard
                setTimeout(() => {
                    this.onCloseRequestSummaryView();
                }, 100);
            }
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
            const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
            const isCompliance = sActiveRole.includes("compliance");

            let aPending = [];
            let aProcessed = [];

            try {
                const response = await fetch("/odata/v4/admin-portal/GovernanceHistory");
                const data = await response.json();
                if (data && data.value && data.value.length > 0) {
                    const oApproverData = this._buildApproverHistoryAndPending(data.value);
                    aPending = oApproverData.pending;
                    aProcessed = oApproverData.processed;
                }
            } catch (err) {
                console.error("Error fetching GovernanceHistory:", err);
            }

            try {
                const aSessionProc = JSON.parse(sessionStorage.getItem("kyra_processed_requests") || "[]");
                aSessionProc.forEach(sp => {
                    if (!aProcessed.some(p => p.requestId === sp.requestId)) {
                        aProcessed.unshift(sp);
                    }
                });
            } catch(e) {}

            const aAccessPending = aPending.filter(p => !p.isRevocation && p.type !== "Revocation");
            const aRevokePending = isCompliance ? [] : aPending.filter(p => p.isRevocation || p.type === "Revocation");

            this._setSmartProperty(oModel, "/pendingRequests", isCompliance ? aAccessPending : aPending);
            this._setSmartProperty(oModel, "/pendingAccessRequests", aAccessPending);
            this._setSmartProperty(oModel, "/pendingRevokeRequests", aRevokePending);
            this._setSmartProperty(oModel, "/pendingAccessCount", aAccessPending.length);
            this._setSmartProperty(oModel, "/pendingRevokeCount", aRevokePending.length);
            this._setSmartProperty(oModel, "/processedRequests", aProcessed);
        },

        _buildApproverHistoryAndPending(aRawRecords) {
            const getBaseReqId = (num) => {
                if (!num) return "";
                const lastDash = num.lastIndexOf('-');
                if (lastDash > 0 && lastDash >= num.length - 4) {
                    return num.slice(0, lastDash);
                }
                return num;
            };

            const deriveCleanService = (r) => {
                const roleStr = (r.role_name || r.roleName || r.selected_persona || r.selectedPersona || r.requester_persona || r.persona || "").toLowerCase();
                if (roleStr.includes("owner") || roleStr.includes("architect") || roleStr.includes("lead") || roleStr.includes("product manager")) {
                    return "System Owners";
                } else if (roleStr.includes("stakeholder") || roleStr.includes("compliance") || roleStr.includes("isrm")) {
                    return "Stakeholders";
                } else {
                    return "";
                }
            };

            const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
            const isCompliance = sActiveRole.includes("compliance");
            const isIam1 = sActiveRole.includes("approver 1") || sActiveRole.includes("iam 1") || sActiveRole.includes("iam_1");
            const isIam2 = sActiveRole.includes("approver 2") || sActiveRole.includes("iam 2") || sActiveRole.includes("iam_2");
            const isApprover = !isCompliance && !isIam1 && !isIam2;

            const oGrouped = {};
            const oPendingGrouped = {};

            (aRawRecords || []).forEach(r => {
                const sDbStatus = (r.db_status || r.status || "PENDING").toUpperCase();
                const sApproverStatus = (r.approver_status || r.approver_decision_status || "").toUpperCase();
                const sCompStatus = (r.compliance_status || r.compliance_decision_status || "").toUpperCase();
                const sIam1Status = (r.iam_approver_1_status || r.iam_approver_1_decision_status || "").toUpperCase();
                const sIam2Status = (r.iam_approver_2_status || r.iam_approver_2_decision_status || "").toUpperCase();

                const isRevocation = (r.access_type || r.request_type || "").toUpperCase().includes("REV") ||
                             (r.business_function || "").toUpperCase().includes("REVOCATION") ||
                             (r.request_number || "").toUpperCase().startsWith("REV-") ||
                             (r.request_number || "").toUpperCase().includes("-REV-");

                let isPendingForRole = false;
                let bRoleApproved = false;
                let isProcessedForRole = false;

                if (isCompliance) {
                    // COMPLIANCE REVIEWER:
                    // Only sees Addition requests that reached PENDING_COMPLIANCE (because of SoD conflict).
                    // NEVER sees freshly submitted Addition requests (status PENDING)!
                    // NEVER sees Revocation requests!
                    if (!isRevocation && sDbStatus === "PENDING_COMPLIANCE" && sCompStatus !== "APPROVED" && sCompStatus !== "REJECTED") {
                        isPendingForRole = true;
                    } else if (!isRevocation && (sCompStatus === "APPROVED" || sCompStatus === "REJECTED" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED")) {
                        isProcessedForRole = true;
                        bRoleApproved = (sCompStatus === "APPROVED" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED") && sCompStatus !== "REJECTED";
                    }
                } else if (isIam1) {
                    // IAM APPROVER 1:
                    if (sDbStatus === "PENDING_IAM_1" && sIam1Status !== "APPROVED" && sIam1Status !== "REJECTED") {
                        isPendingForRole = true;
                    } else if (sIam1Status === "APPROVED" || sIam1Status === "REJECTED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED") {
                        isProcessedForRole = true;
                        bRoleApproved = (sIam1Status === "APPROVED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED") && sIam1Status !== "REJECTED";
                    }
                } else if (isIam2) {
                    // IAM APPROVER 2:
                    if (sDbStatus === "PENDING_IAM_2" && sIam2Status !== "APPROVED" && sIam2Status !== "REJECTED") {
                        isPendingForRole = true;
                    } else if (sIam2Status === "APPROVED" || sIam2Status === "REJECTED" || sDbStatus === "APPROVED") {
                        isProcessedForRole = true;
                        bRoleApproved = (sIam2Status === "APPROVED" || sDbStatus === "APPROVED") && sIam2Status !== "REJECTED";
                    }
                } else {
                    // INITIAL APPROVER (Line Manager):
                    // Freshly submitted requests start at PENDING -> Only initial Approver sees them in pending queue
                    const isApproverDecided = sApproverStatus === "APPROVED" || sApproverStatus === "REJECTED" ||
                                              sDbStatus === "PENDING_COMPLIANCE" || sDbStatus === "PENDING_IAM_1" ||
                                              sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED" || sDbStatus === "REJECTED";

                    if (!isApproverDecided && (sDbStatus === "PENDING" || sDbStatus === "PENDING_APPROVER")) {
                        isPendingForRole = true;
                    } else if (isApproverDecided) {
                        isProcessedForRole = true;
                        bRoleApproved = (sApproverStatus === "APPROVED" || sDbStatus === "PENDING_COMPLIANCE" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED") && sApproverStatus !== "REJECTED";
                    }
                }

                const sService = deriveCleanService(r);
                const sDate = r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : "2026-09-04");
                const sUser = r.requester_username || "User";

                // Accurately preserve Business Sector, Business Function, and Duration from Add Access submission data:
                const sSector = r.business_sector || "Information Technology & Security";
                const sFunction = r.business_function || "Corporate Governance";
                const sDuration = r.access_duration || r.duration || "Permanent (Default)";
                const sRegion = r.operating_region || r.region || "Global Enterprise (ALL)";
                const sJustification = r.justification || "";
                const sType = isRevocation ? "Revocation" : (r.access_type === "RESTRICTED" ? "Addition (Restricted)" : (r.access_type || "Addition"));

                if (isPendingForRole) {
                    const sBaseId = getBaseReqId(r.request_number);
                    const sPendKey = sBaseId || r.request_number || (sUser + "_" + sSector + "_" + sFunction + "_" + (isRevocation ? "REVOCATION" : "ADDITION"));
                    if (!oPendingGrouped[sPendKey]) {
                        oPendingGrouped[sPendKey] = {
                            requestId: sBaseId || r.request_number || ("REQ-" + (r.ID || "GEN")),
                            requesterId: sUser,
                            requesterUsername: sUser,
                            selectedPersona: r.selected_persona || r.role_name || "Frontend & UI Developer",
                            persona: r.selected_persona || r.role_name || "Frontend & UI Developer",
                            sector: sSector,
                            businessSector: sSector,
                            function: sFunction,
                            businessFunction: sFunction,
                            duration: sDuration,
                            accessDuration: sDuration,
                            region: sRegion,
                            operatingRegion: sRegion,
                            justification: sJustification,
                            type: sType,
                            serviceTopic: sService,
                            submissionDate: sDate,
                            decisionDate: sDate,
                            status: isRevocation ? "Revoke Pending" : "Pending Approval",
                            statusState: isRevocation ? "Error" : "Warning",
                            statusIcon: "sap-icon://pending",
                            isRevocation: isRevocation,
                            _isPendingForRole: true,
                            approverRemark: r.approver_comment || r.approverRemark || "",
                            entitlements: []
                        };
                    }
                    oPendingGrouped[sPendKey].entitlements.push({
                        requestId: r.request_number,
                        system: r.target_system,
                        roleName: r.role_name,
                        team: sService,
                        serviceTopic: sService,
                        selectedPersona: cleanPersonaName(r.selected_persona || r.persona || r.role_name || ""),
                        persona: cleanPersonaName(r.selected_persona || r.persona || r.role_name || ""),
                        status: "Pending",
                        statusState: "Warning",
                        statusIcon: "sap-icon://pending",
                        approverRemark: r.approver_comment || r.approverRemark || "",
                        comment: r.reviewer_comment || r.comments || ""
                    });
                    return;
                }

                if (isProcessedForRole) {
                    const sBaseId = getBaseReqId(r.request_number);
                    const sGroupKey = sBaseId || r.request_number || (sUser + "_" + sDate + "_" + (r.selected_persona || r.role_name));

                    if (!oGrouped[sGroupKey]) {
                        const sPersona = r.selected_persona || r.role_name || "";

                        oGrouped[sGroupKey] = {
                            requestId: sBaseId || r.request_number || ("REQ-" + (r.ID || "GEN")),
                            requesterId: sUser,
                            selectedPersona: sPersona,
                            persona: sPersona,
                            sector: sSector,
                            businessSector: sSector,
                            function: sFunction,
                            businessFunction: sFunction,
                            duration: sDuration,
                            accessDuration: sDuration,
                            region: sRegion,
                            operatingRegion: sRegion,
                            justification: sJustification,
                            type: sType,
                            serviceTopic: sService,
                            decisionDate: sDate,
                            submissionDate: r.created_at ? r.created_at.split("T")[0] : sDate,
                            isRevocation: isRevocation,
                            _isPendingForRole: false,
                            entitlements: []
                        };
                    }

                    oGrouped[sGroupKey].entitlements.push({
                        requestId: r.request_number,
                        system: r.target_system,
                        roleName: r.role_name,
                        team: sService,
                        serviceTopic: sService,
                        selectedPersona: cleanPersonaName(r.selected_persona || r.persona || r.role_name || ""),
                        persona: cleanPersonaName(r.selected_persona || r.persona || r.role_name || ""),
                        status: bRoleApproved ? "Approved" : "Rejected",
                        statusState: bRoleApproved ? "Success" : "Error",
                        statusIcon: bRoleApproved ? "sap-icon://sys-enter-2" : "sap-icon://error",
                        comment: r.approver_comment || r.reviewer_comment || r.comments || ""
                    });
                }
            });

            const aProcessed = Object.values(oGrouped);
            aProcessed.forEach(g => {
                const approvedCount = g.entitlements.filter(e => e.status === "Approved").length;
                const rejectedCount = g.entitlements.filter(e => e.status === "Rejected").length;
                if (approvedCount > 0 && rejectedCount > 0) {
                    g.status = "Partially Approved";
                    g.statusState = "Warning";
                    g.statusIcon = "sap-icon://alert";
                } else if (approvedCount > 0 && rejectedCount === 0) {
                    g.status = "Approved";
                    g.statusState = "Success";
                    g.statusIcon = "sap-icon://sys-enter-2";
                } else {
                    g.status = "Rejected";
                    g.statusState = "Error";
                    g.statusIcon = "sap-icon://error";
                }
            });

            aProcessed.sort((a, b) => {
                const dA = new Date(a.decisionDate || a.submissionDate || "1970-01-01").getTime();
                const dB = new Date(b.decisionDate || b.submissionDate || "1970-01-01").getTime();
                if (dA !== dB) return dB - dA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });

            const aPending = Object.values(oPendingGrouped);
            return {
                processed: aProcessed,
                pending: aPending
            };
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
                        requesterId: item.requesterId || item.requesterUsername || "",
                        requesterUsername: item.requesterUsername || item.requesterId || "",
                        type: item.type || "Addition",
                        persona: cleanPersonaName(item.persona || item.selectedPersona || ""),
                        selectedPersona: cleanPersonaName(item.selectedPersona || item.persona || ""),
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
                const sPers = cleanPersonaName(item.selectedPersona || item.persona);
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
                    g.selectedPersona = g._personas.map(p => cleanPersonaName(p)).join(", ");
                    g.persona = cleanPersonaName(g._personas[0]);
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
            this._showBatchDecisionRemarkDialog(true);
        },

        onRejectAllRequests() {
            this._showBatchDecisionRemarkDialog(false);
        },

        _showBatchDecisionRemarkDialog(bIsApprove) {
            sap.ui.require([
                "sap/m/Dialog", "sap/m/Button", "sap/m/TextArea", "sap/m/VBox", "sap/m/HBox",
                "sap/ui/core/Icon", "sap/m/Text", "sap/m/Title"
            ], (Dialog, Button, TextArea, VBox, HBox, Icon, Text, Title) => {
                const sAction = bIsApprove ? "Approve" : "Reject";
                const sTitle = bIsApprove ? "Approve All Entitlements" : "Reject All Entitlements";
                const sSubtitle = bIsApprove
                    ? "Enter a batch approval remark to apply across all request items."
                    : "Enter a batch rejection reason or remark to apply across all request items.";
                const sIconSrc = bIsApprove ? "sap-icon://accept" : "sap-icon://decline";
                const sIconClass = bIsApprove ? "kyraBatchDialogIconApprove" : "kyraBatchDialogIconReject";
                const sIconColor = bIsApprove ? "#16A34A" : "#DC2626";
                const sBtnClass = bIsApprove ? "kyraBatchDialogConfirmApproveBtn" : "kyraBatchDialogConfirmRejectBtn";
                const sBtnText = bIsApprove ? "Approve All" : "Reject All";

                const oTextArea = new TextArea({
                    width: "100%",
                    rows: 4,
                    placeholder: bIsApprove
                        ? "Enter your approval remark (e.g., Approved after verifying business justification)..."
                        : "Enter rejection reason / remark (e.g., Access not required for current project scope)...",
                    liveChange: (oEvt) => {
                        const val = oEvt.getParameter("value") || "";
                        if (val.trim()) {
                            oTextArea.setValueState("None");
                        }
                    }
                }).addStyleClass("kyraBatchRemarkTextArea");

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new VBox({
                            items: [
                                new HBox({
                                    alignItems: "Center",
                                    justifyContent: "SpaceBetween",
                                    items: [
                                        new HBox({
                                            alignItems: "Center",
                                            items: [
                                                new HBox({
                                                    justifyContent: "Center",
                                                    alignItems: "Center",
                                                    items: [
                                                        new Icon({
                                                            src: sIconSrc,
                                                            color: sIconColor,
                                                            size: "20px"
                                                        })
                                                    ]
                                                }).addStyleClass(sIconClass),
                                                new VBox({
                                                    items: [
                                                        new Title({ text: sTitle, level: "H4" }).addStyleClass("kyraBatchDialogTitle"),
                                                        new Text({ text: sSubtitle }).addStyleClass("kyraBatchDialogSubtitle")
                                                    ]
                                                }).addStyleClass("sapUiSmallMarginBegin")
                                            ]
                                        }),
                                        new Button({
                                            icon: "sap-icon://decline",
                                            type: "Transparent",
                                            press: () => oDialog.close()
                                        }).addStyleClass("kyraBatchDialogCloseBtn")
                                    ]
                                }).addStyleClass("kyraBatchDialogHeader"),

                                new VBox({
                                    items: [
                                        new Text({ text: "Remark / Justification" }).addStyleClass("kyraBatchRemarkLabel"),
                                        oTextArea
                                    ]
                                }).addStyleClass("kyraBatchDialogBody")
                            ]
                        })
                    ],
                    buttons: [
                        new Button({
                            text: "Cancel",
                            type: "Transparent",
                            press: () => oDialog.close()
                        }).addStyleClass("kyraBatchDialogCancelBtn"),
                        new Button({
                            text: sBtnText,
                            press: () => {
                                const sRemark = (oTextArea.getValue() || "").trim();
                                if (!sRemark) {
                                    oTextArea.setValueState("Error");
                                    oTextArea.setValueStateText("Please enter a remark before proceeding.");
                                    return;
                                }
                                this._applyBatchDecisionToAll(bIsApprove, sRemark);
                                oDialog.close();
                            }
                        }).addStyleClass(sBtnClass)
                    ],
                    afterClose: () => oDialog.destroy()
                }).addStyleClass("kyraBatchDecisionDialog");

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        _applyBatchDecisionToAll(bIsApprove, sRemark) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._lastBatchRemark = sRemark;
            this._hasPerformedBatchAction = true;

            const sNewStatus = bIsApprove ? "Approved" : "Rejected";
            const sNewState = bIsApprove ? "Success" : "Error";
            const sNewIcon = bIsApprove ? "sap-icon://sys-enter-2" : "sap-icon://error";

            const sPath = "/selectedRequest/entitlements";
            const aEntitlements = oModel.getProperty(sPath) || [];
            aEntitlements.forEach((ent, i) => {
                oModel.setProperty(sPath + "/" + i + "/status", sNewStatus);
                oModel.setProperty(sPath + "/" + i + "/statusState", sNewState);
                oModel.setProperty(sPath + "/" + i + "/statusIcon", sNewIcon);
                oModel.setProperty(sPath + "/" + i + "/comment", sRemark);
            });

            const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
            aTables.forEach(t => {
                (t.items || []).forEach(item => {
                    item.status = sNewStatus;
                    item.statusState = sNewState;
                    item.statusIcon = sNewIcon;
                    item.comment = sRemark;
                });
            });
            oModel.setProperty("/selectedRequest/summaryTables", aTables);

            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                MessageToast.show(`All entitlements marked ${sNewStatus} with your remark.`);
            });
        },

        onCancelRequestSummaryView() {
            sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        }
    });
});
