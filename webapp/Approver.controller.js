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

    function cleanPersonaName(sPersona) {
        if (!sPersona) return "";
        let p = String(sPersona).trim();
        p = p.replace(/\s*\([^)]*\)/g, '').trim();
        p = p.replace(/\s+persona$/i, '').trim();
        if (!p || p === 'undefined') return '';
        return p;
    }

    function cleanRoleStr(sRole) {
        if (!sRole) return "";
        let r = String(sRole).trim();
        r = r.replace(/\s*\([^)]*\)/g, '').trim();
        if (!r || r === 'undefined') return '';
        return r;
    }

    function cleanPersonaStr(s) {
        return cleanPersonaName(s);
    }

    function getBaseReqId(num) {
        if (!num) return "";
        const str = String(num).trim();
        const parts = str.split("-");
        if (parts.length >= 4 && /^\d{1,2}$/.test(parts[parts.length - 1])) {
            return parts.slice(0, -1).join("-");
        }
        return str;
    }

    function calculateRevokeRemainingDays(r, matchingActiveRole) {
        return formatArDuration(r, matchingActiveRole);
    }

    function formatArDuration(r, matchingApproved) {
        const orig = matchingApproved || r;
        const rawDur = String((orig && (orig.access_duration || orig.duration || orig.accessDuration)) || "").toLowerCase();
        
        if (rawDur.includes("permanent") && !rawDur.includes("30") && !rawDur.includes("90")) {
            return "Permanent (Default)";
        }
        
        let totalDays = 30;
        if (rawDur.includes("90")) totalDays = 90;
        else if (rawDur.includes("30")) totalDays = 30;
        else if (rawDur.includes("60")) totalDays = 60;
        else if (rawDur.includes("180")) totalDays = 180;
        else if (rawDur.includes("365")) totalDays = 365;

        const sGrant = (matchingApproved && (matchingApproved.granted_date || matchingApproved.grantedDate || matchingApproved.created_at)) || 
                       (r && (r.created_at || r.createdAt || r.submissionDate)) || "";
        
        let gDate;
        try {
            gDate = sGrant ? new Date(sGrant) : new Date();
            if (isNaN(gDate.getTime())) gDate = new Date("2026-09-09");
        } catch(e) {
            gDate = new Date("2026-09-09");
        }

        const now = new Date();
        const gUtc = Date.UTC(gDate.getUTCFullYear(), gDate.getUTCMonth(), gDate.getUTCDate());
        const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const elapsed = Math.max(0, Math.floor((nowUtc - gUtc) / (1000 * 60 * 60 * 24)));
        
        let remainingDays = totalDays - elapsed;
        if (remainingDays <= 0) remainingDays = 0;
        
        return remainingDays + "/" + totalDays + " days left";
    }

    function sortChronologicallyDesc(a, b) {
        const tA = new Date(a.createdAtRaw || a.created_at || a.createdAt || a.submissionDate || a.decisionDate || a.submittedDate || 0).getTime();
        const tB = new Date(b.createdAtRaw || b.created_at || b.createdAt || b.submissionDate || b.decisionDate || 0).getTime();
        if (tA !== tB && !isNaN(tA) && !isNaN(tB)) return tB - tA;
        return (a.requestId || "").localeCompare(b.requestId || "");
    }

    return Controller.extend("kyra001.pages.Approver.Approver", {

        onInit() {
            // Disable spellcheck on search fields
            this.getView().addEventDelegate({
                onAfterRendering: () => {
                    setTimeout(() => {
                        document.querySelectorAll('.kyraEntitlementsSearchField input, .sapMSF input').forEach(el => {
                            el.setAttribute('spellcheck', 'false');
                            el.setAttribute('autocomplete', 'off');
                            el.setAttribute('autocorrect', 'off');
                        });
                    }, 300);
                }
            });

            const oComp = this.getOwnerComponent();
            const oSharedModel = oComp && oComp.getModel("accessModel");
            if (oSharedModel) {
                this.getView().setModel(oSharedModel, "accessModel");
            }
            const oRouter = oComp && oComp.getRouter();
            if (oRouter) {
                ["AccessPage", "UserDashboard", "AdminDashboard"].forEach(routeName => {
                    const r = oRouter.getRoute(routeName);
                    if (r) {
                        r.attachPatternMatched(this._onRouteMatched, this);
                    }
                });
            }
            window.openApproverDecisionBreakdown = (sTargetIdOrData) => {
                this.openDecisionBreakdownSummary(sTargetIdOrData);
            };
            this._instanceId = "approver_" + Date.now() + "_" + Math.random().toString(36).slice(2);
            if (typeof BroadcastChannel !== "undefined" && !this._syncChannel) {
                try {
                    this._syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    this._syncChannel.onmessage = (event) => {
                        if (!event || !event.data) return;
                        if (event.data.senderId === this._instanceId) return;
                        if (event.data.type !== "DECISION_SUBMITTED" && event.data.type !== "NEW_REQUEST_SUBMITTED") return;
                        clearTimeout(this._approverSyncDebounceTimer);
                        this._approverSyncDebounceTimer = setTimeout(() => {
                            const oM = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
                            if (oM) {
                                this._reloadAllRequests(oM, true);
                            }
                        }, 350);
                    };
                } catch(e) {}
            }
            if (!this._boundStorageListener) {
                this._boundStorageListener = (e) => {
                    if (e.key === "kyra_last_db_mutation") {
                        clearTimeout(this._approverStorageDebounceTimer);
                        this._approverStorageDebounceTimer = setTimeout(() => {
                            const oM = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
                            if (oM) {
                                this._reloadAllRequests(oM, true);
                            }
                        }, 350);
                    }
                };
                window.addEventListener("storage", this._boundStorageListener);
            }
            this._syncModelAndRequests();
        },

        _notifyDatabaseMutation() {
            if (typeof BroadcastChannel !== "undefined") {
                try {
                    const syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    syncChannel.postMessage({ type: "DECISION_SUBMITTED", senderId: this._instanceId, timestamp: Date.now() });
                    syncChannel.close();
                } catch(e) {}
            }
            try {
                localStorage.setItem("kyra_last_db_mutation", String(Date.now()));
            } catch(e) {}
        },

        _onRouteMatched() {
            this._syncModelAndRequests();
        },

        _syncModelAndRequests() {
            const oModel = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
            if (oModel) {
                const sActiveRole = (oModel.getProperty("/activeRole") || sessionStorage.getItem("kyra_active_role") || "Requester").trim();
                const sRoleLower = sActiveRole.toLowerCase();
                const bIsRequester = (sActiveRole === "Requester" || sRoleLower === "requester" || sRoleLower === "" || !!oModel.getProperty("/isRequester"));
                const bIsAdmin = (sActiveRole === "Admin" || sActiveRole === "Administrator" || sRoleLower === "admin" || sRoleLower === "administrator" || !!oModel.getProperty("/isAdminPersona"));

                // STRICT: When active persona is Requester or Admin, NEVER show approver section
                if (bIsRequester || bIsAdmin) {
                    oModel.setProperty("/showApproverSection", false);
                    oModel.setProperty("/isApproverPersona", false);
                    oModel.setProperty("/isCompliance", false);
                    oModel.setProperty("/isComplianceReviewer", false);
                    oModel.setProperty("/isCompliancePersona", false);
                    const oCompModel = this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel");
                    if (oCompModel && oCompModel !== oModel) {
                        oCompModel.setProperty("/showApproverSection", false);
                        oCompModel.setProperty("/isApproverPersona", false);
                        oCompModel.setProperty("/isCompliance", false);
                        oCompModel.setProperty("/isComplianceReviewer", false);
                        oCompModel.setProperty("/isCompliancePersona", false);
                    }
                    if (this.getView()) {
                        this.getView().setVisible(false);
                    }
                    const oCardRoot = this.byId("kyraApproverCardRoot");
                    if (oCardRoot) {
                        oCardRoot.setVisible(false);
                    }
                    return;
                }

                const isCompliance = sRoleLower.includes("compliance");
                const isApprover = sRoleLower.includes("approver") || isCompliance;
                const bShowApproverSection = isApprover;

                oModel.setProperty("/isCompliance", isCompliance);
                oModel.setProperty("/isComplianceReviewer", isCompliance);
                oModel.setProperty("/isCompliancePersona", isCompliance);
                oModel.setProperty("/isApproverPersona", isApprover);
                oModel.setProperty("/showApproverSection", bShowApproverSection);

                const oCompModel = this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel");
                if (oCompModel && oCompModel !== oModel) {
                    oCompModel.setProperty("/isCompliance", isCompliance);
                    oCompModel.setProperty("/isComplianceReviewer", isCompliance);
                    oCompModel.setProperty("/isCompliancePersona", isCompliance);
                    oCompModel.setProperty("/isApproverPersona", isApprover);
                    oCompModel.setProperty("/showApproverSection", bShowApproverSection);
                }

                if (!bShowApproverSection) {
                    if (this.getView()) {
                        this.getView().setVisible(false);
                    }
                    const oCardRoot = this.byId("kyraApproverCardRoot");
                    if (oCardRoot) {
                        oCardRoot.setVisible(false);
                    }
                    return;
                }

                if (this.getView()) {
                    this.getView().setVisible(true);
                }
                const oCardRoot = this.byId("kyraApproverCardRoot");
                if (oCardRoot) {
                    oCardRoot.setVisible(true);
                }

                if (!oModel.getProperty("/approverPendingTab") || isCompliance) {
                    oModel.setProperty("/approverPendingTab", "accessRequests");
                }
                if (!oModel.getProperty("/approverHistoryTab")) {
                    oModel.setProperty("/approverHistoryTab", "accessRequests");
                }
                const bShowHistory = sessionStorage.getItem("kyra_show_approval_history") === "true";
                if (bShowHistory) {
                    oModel.setProperty("/showApprovalHistory", true);
                } else {
                    oModel.setProperty("/showApprovalHistory", false);
                }
                this._reloadAllRequests(oModel);
            }
        },

        onSelectPendingQueue() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
                const isCompliance = sActiveRole.includes("compliance");
                oModel.setProperty("/isCompliance", isCompliance);
                oModel.setProperty("/isComplianceReviewer", isCompliance);
                oModel.setProperty("/isCompliancePersona", isCompliance);
                oModel.setProperty("/showApprovalHistory", false);
                sessionStorage.removeItem("kyra_show_approval_history");
                if (isCompliance) {
                    oModel.setProperty("/approverPendingTab", "accessRequests");
                }
            }
        },

        onSelectHistoryLog() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
                const isCompliance = sActiveRole.includes("compliance");
                oModel.setProperty("/isCompliance", isCompliance);
                oModel.setProperty("/isComplianceReviewer", isCompliance);
                oModel.setProperty("/isCompliancePersona", isCompliance);
                oModel.setProperty("/showApprovalHistory", true);
                sessionStorage.setItem("kyra_show_approval_history", "true");
                if (!oModel.getProperty("/approverHistoryTab")) {
                    oModel.setProperty("/approverHistoryTab", "accessRequests");
                }
                this._updateDisplayedHistoryRequests();
            }
        },

        onSelectAccessRequestsTab() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                if (oModel.getProperty("/showApprovalHistory")) {
                    oModel.setProperty("/approverHistoryTab", "accessRequests");
                    this._updateDisplayedHistoryRequests();
                } else {
                    oModel.setProperty("/approverPendingTab", "accessRequests");
                }
            }
        },

        onSelectRevokeRequestsTab() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                if (oModel.getProperty("/showApprovalHistory")) {
                    oModel.setProperty("/approverHistoryTab", "revokeRequests");
                    this._updateDisplayedHistoryRequests();
                } else {
                    oModel.setProperty("/approverPendingTab", "revokeRequests");
                }
            }
        },

        onFilterAccessRequests() {
            this.onSelectAccessRequestsTab();
        },

        onFilterRevokeRequests() {
            this.onSelectRevokeRequestsTab();
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

        _updateDisplayedHistoryRequests() {
            const oModel = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
            if (!oModel) return;
            const bIsCompliance = !!oModel.getProperty("/isCompliance");
            if (bIsCompliance) {
                const aProcessed = oModel.getProperty("/processedRequests") || [];
                this._setSmartProperty(oModel, "/displayedHistoryRequests", aProcessed);
            } else {
                const sTab = oModel.getProperty("/approverHistoryTab") || "accessRequests";
                const aAccess = oModel.getProperty("/historyAccessRequests") || oModel.getProperty("/processedAccessRequests") || [];
                const aRevoke = oModel.getProperty("/historyRevokeRequests") || oModel.getProperty("/processedRevokeRequests") || [];
                this._setSmartProperty(oModel, "/displayedHistoryRequests", sTab === "revokeRequests" ? aRevoke : aAccess);
            }
            const oCompModel = this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel");
            if (oCompModel && oCompModel !== oModel) {
                this._setSmartProperty(oCompModel, "/displayedHistoryRequests", oModel.getProperty("/displayedHistoryRequests"));
            }
            if (this._sCurrentSearchQuery) {
                this._applySearchFilter(this._sCurrentSearchQuery);
            }
        },

        onOpenAddAccessDialog() {
            this.getOwnerComponent().getRouter().navTo("AddAccessBusinessSector");
        },

        onOpenRemoveAccessDialog() {
            MessageToast.show("Select an active entitlement below to request removal.");
        },

        onToggleApprovalHistory() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurrentState = oModel.getProperty("/showApprovalHistory");
                const bNextState = !bCurrentState;
                oModel.setProperty("/showApprovalHistory", bNextState);
                if (bNextState) {
                    sessionStorage.setItem("kyra_show_approval_history", "true");
                } else {
                    sessionStorage.removeItem("kyra_show_approval_history");
                }

                if (bNextState) {
                    MessageToast.show("Displaying Processed Approval History Log.");
                } else {
                    MessageToast.show("Displaying Pending Access Requests Queue.");
                }
            }
        },

        onOpenRequestSummaryDialog(oEvent) {
            const oItem = oEvent.getSource();
            const oData = oItem.getBindingContext("accessModel").getObject();
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Loading Governance Review...",
                    subtitle: "Fetching request details and evaluating live SoD conflict matrix..."
                });
            }
            this.getOwnerComponent().getRouter().navTo("ApproverDetail", {
                requestId: oData.requestId
            });
        },

        onAcceptEntitlement(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");

            if (oContext && oModel) {
                const sPath = oContext.getPath();
                const oEntitlement = oContext.getObject();

                oModel.setProperty(sPath + "/status", "Approved");
                oModel.setProperty(sPath + "/statusState", "Success");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://sys-enter-2");

                MessageToast.show("Accepted entitlement for " + oEntitlement.system);
            }
        },

        onRejectEntitlement(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");

            if (oContext && oModel) {
                const sPath = oContext.getPath();
                const oEntitlement = oContext.getObject();

                oModel.setProperty(sPath + "/status", "Rejected");
                oModel.setProperty(sPath + "/statusState", "Error");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://error");

                MessageToast.show("Rejected entitlement for " + oEntitlement.system);
            }
        },

        onApproveSelectedRequest() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const oData = oModel.getProperty("/selectedRequest");
                if (!oData) return;

                const aEntitlements = oData.entitlements || [];

                // 1. Validation: NO AUTO-SELECT! All items must have an explicit decision
                const aUndecided = aEntitlements.filter(e => !e.status || e.status.toLowerCase().includes("pending"));
                if (aUndecided.length > 0) {
                    sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
                        MessageBox.warning(
                            "Decision Required: You have " + aUndecided.length + " pending entitlement(s). Please select Approve (✔) or Reject (✖) for each item before submitting.",
                            { title: "Action Required" }
                        );
                    });
                    return;
                }

                // 2. Default remark / comment if omitted so user is not blocked
                aEntitlements.forEach(e => {
                    if (!e.comment || !e.comment.trim()) {
                        e.comment = ((e.status || "").toLowerCase().includes("reject")) ? "Rejected by Approver" : "Approved by Approver";
                    }
                });

                this._showDecisionSummarySlide(oData, false);
            }
        },

        _showDecisionSummarySlide(oData, bReadOnly) {
            const oModel = this.getView().getModel("accessModel");
            const rawEntitlements = oData.entitlements || [];
            const seenEntSummary = new Set();
            const aEntitlements = rawEntitlements.filter(e => {
                const sReq = (e.requestId || e.request_number || e.requestNumber || '').trim();
                const sSys = (e.system || oData.system || '').trim();
                const sRole = (e.roleName || e.role_name || e.team || '').trim();
                const sPersona = (e.selectedPersona || e.selected_persona || e.persona || oData.persona || '').trim();
                const sKey = sReq ? `${sReq}:::${sSys}:::${sRole}:::${sPersona}` : `${sSys}:::${sRole}:::${sPersona}`;
                if (seenEntSummary.has(sKey)) return false;
                seenEntSummary.add(sKey);
                return true;
            });

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

            const aFinalApproved = bReadOnly ? aApprovedItems : aApprovedItems.concat(aPendingItems);

            const sOverallStatus = aRejectedItems.length === 0 ? "Approved" : (aFinalApproved.length === 0 ? "Rejected" : "Partially Approved");
            const sOverallBadgeClass = aRejectedItems.length === 0 ? "kyra-badge-approved" : (aFinalApproved.length === 0 ? "kyra-badge-rejected" : "kyra-badge-partial");
            const sOverallIcon = aRejectedItems.length === 0 ? "✓" : (aFinalApproved.length === 0 ? "✕" : "⚠");

            const sApprovedCardsHtml = aFinalApproved.length > 0 ? aFinalApproved.map(e => {
                const sReqId = e.requestId || oData.requestId || oData.id || '';
                const sSystemVal = e.system || oData.system || 'SAP S/4HANA Enterprise';

                // Team: e.g. "Line Manager", "Role Owner", "IT Developers"
                let sTeamVal = cleanRoleStr(e.roleName || e.roleTitle || e.teamRole || "");
                if (!sTeamVal && e.team && !e.team.includes("Administrator") && !e.team.includes("Owners") && !e.team.includes("Stakeholders")) {
                    sTeamVal = cleanRoleStr(e.team);
                }
                if (!sTeamVal) {
                    sTeamVal = "Line Manager";
                }

                // Service: e.g. "System Administrator", "System Owners", "Stakeholders"
                let sServiceVal = e.serviceTopic || e.service || oData.serviceTopic || oData.service || "";
                if (!sServiceVal) {
                    if (e.team && (e.team.includes("Administrator") || e.team.includes("Owners") || e.team.includes("Stakeholders"))) {
                        sServiceVal = e.team;
                    } else if (oData.team && (oData.team.includes("Administrator") || oData.team.includes("Owners") || oData.team.includes("Stakeholders"))) {
                        sServiceVal = oData.team;
                    } else {
                        const sCombined = (sTeamVal + " " + (e.selectedPersona || "")).toLowerCase();
                        if (sCombined.includes("owner") || sCombined.includes("custodian")) {
                            sServiceVal = "System Owners";
                        } else {
                            sServiceVal = "System Administrator";
                        }
                    }
                }

                const sPersonaVal = cleanPersonaName(e.selectedPersona || oData.selectedPersona || e.persona || oData.persona || 'People Operations Lead');

                return `
                <div class="kyra-entitlement-summary-card kyra-card-approved kyra-clickable-card" data-req-id="${sReqId}" style="cursor: pointer;" title="Click to view live request tracking for ${sReqId}">
                    <div class="kyra-card-body-content">
                        <div class="kyra-card-top-row">
                            <div class="kyra-card-badge-row">
                                <div class="kyra-card-system-badge kyra-sys-approved">
                                    <span class="kyra-card-meta-label">System:</span>
                                    <span class="kyra-card-meta-val">${sSystemVal}</span>
                                </div>
                                ${sReqId ? `
                                <div class="kyra-card-reqid-badge">
                                    <span class="kyra-reqid-name">${sReqId}</span>
                                </div>` : ''}
                            </div>
                            <div class="kyra-card-status-pill kyra-pill-approved">
                                ✓ Approved
                            </div>
                        </div>
                        <div class="kyra-card-service-row">
                            <span class="kyra-card-meta-label">Service:</span>
                            <span class="kyra-card-meta-val">${sServiceVal}</span>
                        </div>
                        <div class="kyra-card-meta-row">
                            <div class="kyra-card-team-col">
                                <span class="kyra-card-meta-label">Team:</span>
                                <span class="kyra-card-meta-val">${sTeamVal}</span>
                            </div>
                            <div class="kyra-card-persona-col">
                                <span class="kyra-card-meta-label">Persona:</span>
                                <span class="kyra-card-meta-val">${sPersonaVal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;}).join('') : `
                <div class="kyra-empty-summary-box">No entitlements in this category.</div>
            `;

            const sRejectedCardsHtml = aRejectedItems.length > 0 ? aRejectedItems.map(e => {
                const sReqId = e.requestId || oData.requestId || oData.id || '';
                const sSystemVal = e.system || oData.system || 'SAP S/4HANA Enterprise';

                // Team: e.g. "Line Manager", "Role Owner", "IT Developers"
                let sTeamVal = cleanRoleStr(e.roleName || e.roleTitle || e.teamRole || "");
                if (!sTeamVal && e.team && !e.team.includes("Administrator") && !e.team.includes("Owners") && !e.team.includes("Stakeholders")) {
                    sTeamVal = cleanRoleStr(e.team);
                }
                if (!sTeamVal) {
                    sTeamVal = "Line Manager";
                }

                // Service: e.g. "System Administrator", "System Owners", "Stakeholders"
                let sServiceVal = e.serviceTopic || e.service || oData.serviceTopic || oData.service || "";
                if (!sServiceVal) {
                    if (e.team && (e.team.includes("Administrator") || e.team.includes("Owners") || e.team.includes("Stakeholders"))) {
                        sServiceVal = e.team;
                    } else if (oData.team && (oData.team.includes("Administrator") || oData.team.includes("Owners") || oData.team.includes("Stakeholders"))) {
                        sServiceVal = oData.team;
                    } else {
                        const sCombined = (sTeamVal + " " + (e.selectedPersona || "")).toLowerCase();
                        if (sCombined.includes("owner") || sCombined.includes("custodian")) {
                            sServiceVal = "System Owners";
                        } else {
                            sServiceVal = "System Administrator";
                        }
                    }
                }

                const sPersonaVal = cleanPersonaName(e.selectedPersona || oData.selectedPersona || e.persona || oData.persona || 'People Operations Lead');

                return `
                <div class="kyra-entitlement-summary-card kyra-card-rejected kyra-clickable-card" data-req-id="${sReqId}" style="cursor: pointer;" title="Click to view live request tracking for ${sReqId}">
                    <div class="kyra-card-body-content">
                        <div class="kyra-card-top-row">
                            <div class="kyra-card-badge-row">
                                <div class="kyra-card-system-badge kyra-sys-rejected">
                                    <span class="kyra-card-meta-label">System:</span>
                                    <span class="kyra-card-meta-val">${sSystemVal}</span>
                                </div>
                                ${sReqId ? `
                                <div class="kyra-card-reqid-badge">
                                    <span class="kyra-reqid-name">${sReqId}</span>
                                </div>` : ''}
                            </div>
                            <div class="kyra-card-status-pill kyra-pill-rejected">
                                ✕ Rejected
                            </div>
                        </div>
                        <div class="kyra-card-service-row">
                            <span class="kyra-card-meta-label">Service:</span>
                            <span class="kyra-card-meta-val">${sServiceVal}</span>
                        </div>
                        <div class="kyra-card-meta-row">
                            <div class="kyra-card-team-col">
                                <span class="kyra-card-meta-label">Team:</span>
                                <span class="kyra-card-meta-val">${sTeamVal}</span>
                            </div>
                            <div class="kyra-card-persona-col">
                                <span class="kyra-card-meta-label">Persona:</span>
                                <span class="kyra-card-meta-val">${sPersonaVal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;}).join('') : `
                <div class="kyra-empty-summary-box">No entitlements were rejected.</div>
            `;

            const sHtmlContent = `
                <div class="kyra-decision-breakdown-modal">
                    <!-- Modal Header -->
                    <div class="kyra-breakdown-modal-header">
                        <div class="kyra-breakdown-header-left">
                            <div class="kyra-breakdown-avatar-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 11l3 3L22 4"></path>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="kyra-breakdown-main-title">Decision Breakdown Summary</div>
                                <div class="kyra-breakdown-sub-title">System access evaluation and approval status</div>
                            </div>
                        </div>
                        <button type="button" class="kyra-breakdown-close-x" id="kyra_btn_breakdown_close_x" aria-label="Close">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="kyra-breakdown-modal-body">
                        <!-- Requester Info Meta Card -->
                        <div class="kyra-breakdown-requester-card">
                            <div class="kyra-requester-card-left">
                                <div class="kyra-user-circle-avatar">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-requester-title">Requester (${oData.requesterId || oData.requesterUsername || ''})</div>
                                    <div class="kyra-requester-details">Sector: <strong>${oData.sector || 'HCM'}</strong> • Function: <strong>${oData.function || 'Payroll'}</strong></div>
                                </div>
                            </div>
                            <div class="kyra-overall-decision-badge ${sOverallBadgeClass}">
                                <span>${sOverallIcon}</span> ${sOverallStatus}
                            </div>
                        </div>

                        <!-- Approved Section -->
                        <div class="kyra-breakdown-section-wrapper">
                            <div class="kyra-breakdown-sec-header">
                                <div class="kyra-breakdown-sec-title kyra-text-approved">
                                    <span class="kyra-sec-dot kyra-dot-approved"></span>
                                    <span>Approved System Entitlements</span>
                                </div>
                                <span class="kyra-count-badge kyra-count-approved">${aFinalApproved.length}</span>
                            </div>
                            <div class="kyra-breakdown-card-list">
                                ${sApprovedCardsHtml}
                            </div>
                        </div>

                        <!-- Rejected Section -->
                        <div class="kyra-breakdown-section-wrapper">
                            <div class="kyra-breakdown-sec-header">
                                <div class="kyra-breakdown-sec-title kyra-text-rejected">
                                    <span class="kyra-sec-dot kyra-dot-rejected"></span>
                                    <span>Rejected System Entitlements</span>
                                </div>
                                <span class="kyra-count-badge kyra-count-rejected">${aRejectedItems.length}</span>
                            </div>
                            <div class="kyra-breakdown-card-list">
                                ${sRejectedCardsHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Footer Actions -->
                    <div class="kyra-breakdown-modal-footer">
                        ${!bReadOnly ? '<button type="button" class="kyra-btn-secondary kyra-btn-back-teal" id="kyra_btn_breakdown_back">Back</button>' : ''}
                        <button type="button" class="kyra-btn-primary" id="kyra_btn_breakdown_okay">Okay</button>
                    </div>
                </div>
            `;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML"], (Dialog, HTML) => {
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "580px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent })
                    ],
                    afterClose: () => oDialog.destroy()
                }).addStyleClass("kyraModernBreakdownDialog");

                this.getView().addDependent(oDialog);
                oDialog.open();

                setTimeout(() => {
                    const btnCloseX = document.getElementById("kyra_btn_breakdown_close_x");
                    if (btnCloseX) {
                        btnCloseX.onclick = () => oDialog.close();
                    }
                    const btnBack = document.getElementById("kyra_btn_breakdown_back");
                    if (btnBack) {
                        btnBack.onclick = () => oDialog.close();
                    }
                    const btnOkay = document.getElementById("kyra_btn_breakdown_okay");
                    if (btnOkay) {
                        btnOkay.onclick = () => {
                            if (!bReadOnly) {
                                const sOverallState = aRejectedItems.length === 0 ? "Success" : (aFinalApproved.length === 0 ? "Error" : "Warning");
                                this._executeFinalSubmission(oData, sOverallStatus, sOverallState, aFinalApproved, aRejectedItems);
                            }
                            oDialog.close();
                        };
                    }

                    // Enable clicking any specific request card to navigate to its Live Request Tracking page
                    const cardList = (oDialog.getDomRef() || document).querySelectorAll(".kyra-clickable-card");
                    cardList.forEach(card => {
                        card.onclick = (ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            const sClickedReqId = card.getAttribute("data-req-id");
                            if (sClickedReqId) {
                                oDialog.close();
                                this._navigateToLiveRequestTracking(sClickedReqId, oData);
                            }
                        };
                    });
                }, 50);
            });
        },

        async _navigateToLiveRequestTracking(sReqId, oData) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Loading Request Tracking...",
                    subtitle: "Retrieving live governance status from database..."
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Loading Request Tracking...", "Retrieving live governance status from database...");
            }
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                sap.ui.core.BusyIndicator.show(0);
            }

            const oCleanData = Object.assign({}, oData || {});
            delete oCleanData.requestId;
            delete oCleanData.requestNumber;
            const oTargetItem = {
                ...oCleanData,
                requestId: sReqId,
                requestNumber: sReqId
            };

            try {
                if (window.openKyraRequestTracking && typeof window.openKyraRequestTracking === "function") {
                    await window.openKyraRequestTracking(sReqId, oTargetItem);
                    return;
                }

                const [response] = await Promise.all([
                    fetch("/odata/v4/admin-portal/GovernanceHistory"),
                    new Promise(r => setTimeout(r, 450))
                ]);
                const data = await response.json();
                let oDbItem = null;
                if (data && data.value) {
                    // Exact match first
                    oDbItem = data.value.find(r => r.request_number === sReqId || r.id === sReqId);
                    if (!oDbItem) {
                        oDbItem = data.value.find(r => (
                            ("REQ-" + r.ID) === sReqId ||
                            ("REQ-" + r.id) === sReqId ||
                            (sReqId && r.request_number && r.request_number.startsWith(sReqId))
                        ));
                    }
                }

                const oLiveDetails = this._buildRequestDetailFromItem ?
                    this._buildRequestDetailFromItem(oTargetItem, oDbItem) :
                    null;

                if (oLiveDetails) {
                    oModel.setProperty("/selectedRequestDetail", oLiveDetails);
                }
                oModel.setProperty("/showRequestDetailsPage", true);
                oModel.setProperty("/showAllNotificationsPage", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showMyAccessMasterSection", false);

                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (e) {
                console.error("Error navigating to live request tracking:", e);
                oModel.setProperty("/showRequestDetailsPage", true);
                window.scrollTo({ top: 0, behavior: "smooth" });
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
        },

        async _executeFinalSubmission(oData, sOverallStatus, sOverallState, aFinalApproved, aRejectedItems) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) {
                return;
            }
            const sDate = new Date().toISOString().split("T")[0];
            const sStatusIcon = sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://warning");

            const rawSubmitEnts = oData.entitlements || [];
            const seenSubmitEnts = new Set();
            const aDedupedSubmitEnts = rawSubmitEnts.filter(e => {
                const sKey = `${e.requestId || oData.requestId || ''}:::${e.system || oData.system || ''}:::${e.roleName || e.team || ''}:::${e.selectedPersona || e.persona || ''}`;
                if (seenSubmitEnts.has(sKey)) return false;
                seenSubmitEnts.add(sKey);
                return true;
            });

            const oProcessedItem = Object.assign({}, oData, {
                requesterName: "Requester",
                persona: "Requester",
                status: sOverallStatus,
                statusState: sOverallState,
                statusIcon: sStatusIcon,
                decisionDate: sDate,
                entitlements: aDedupedSubmitEnts.map(e => ({
                    requestId: e.requestId || oData.requestId,
                    system: e.system,
                    roleName: e.roleName,
                    team: e.team,
                    selectedPersona: e.selectedPersona || oData.selectedPersona || oData.persona || "",
                    persona: e.persona || oData.persona || "",
                    grantedDate: e.grantedDate,
                    expiryDate: e.expiryDate,
                    status: e.status === "Rejected" ? "Rejected" : "Approved",
                    statusState: e.status === "Rejected" ? "Error" : "Success",
                    statusIcon: e.status === "Rejected" ? "sap-icon://error" : "sap-icon://sys-enter-2",
                    comment: e.comment || ""
                }))
            });

            let aPending = oModel.getProperty("/pendingRequests") || [];
            aPending = aPending.filter(req => req.requestId !== oData.requestId && (req.request_number || req.requestId) !== oData.requestId);
            
            const isRevCheckInner = (req) => {
                const sType = (req.type || req.access_type || "").toUpperCase();
                const sFunc = (req.function || req.businessFunction || req.business_function || "").toUpperCase();
                const sId = (req.requestId || req.request_number || "").toUpperCase();
                return req.isRevocation === true || sType.includes("REV") || sFunc.includes("REVOCATION") || sId.startsWith("REV-") || sId.includes("-REV-");
            };
            const sortAscInner = (a, b) => {
                const tA = new Date(a.createdAtRaw || a.created_at || a.createdAt || a.submissionDate || 0).getTime();
                const tB = new Date(b.createdAtRaw || b.created_at || b.createdAt || b.submissionDate || 0).getTime();
                if (tA !== tB && !isNaN(tA) && !isNaN(tB)) return tA - tB;
                return (a.requestId || "").localeCompare(b.requestId || "");
            };
            const sortDescInner = (a, b) => {
                const tA = new Date(a.updatedAtRaw || a.updated_at || a.decisionDate || a.createdAtRaw || a.created_at || a.submissionDate || 0).getTime();
                const tB = new Date(b.updatedAtRaw || b.updated_at || b.decisionDate || b.createdAtRaw || b.created_at || b.submissionDate || 0).getTime();
                if (tA !== tB && !isNaN(tA) && !isNaN(tB)) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            };

            const aAccessPending = aPending.filter(p => !isRevCheckInner(p));
            const aRevokePending = aPending.filter(p => isRevCheckInner(p));
            aPending.sort(sortAscInner);
            aAccessPending.sort(sortAscInner);
            aRevokePending.sort(sortAscInner);

            oModel.setProperty("/pendingRequests", aPending);
            oModel.setProperty("/pendingAccessRequests", aAccessPending);
            oModel.setProperty("/pendingRevokeRequests", aRevokePending);
            oModel.setProperty("/pendingAccessCount", aAccessPending.length);
            oModel.setProperty("/pendingRevokeCount", aRevokePending.length);

            let aProcessed = oModel.getProperty("/processedRequests") || [];
            aProcessed = aProcessed.filter(p => p.requestId !== oData.requestId && (p.request_number || p.requestId) !== oData.requestId);
            aProcessed.unshift(oProcessedItem);
            aProcessed.sort(sortDescInner);

            const aAccessProcessed = aProcessed.filter(p => !isRevCheckInner(p));
            const aRevokeProcessed = aProcessed.filter(p => isRevCheckInner(p));
            aAccessProcessed.sort(sortDescInner);
            aRevokeProcessed.sort(sortDescInner);

            oModel.setProperty("/processedRequests", aProcessed);
            oModel.setProperty("/historyAccessRequests", aAccessProcessed);
            oModel.setProperty("/historyRevokeRequests", aRevokeProcessed);
            oModel.setProperty("/historyAccessCount", aAccessProcessed.length);
            oModel.setProperty("/historyRevokeCount", aRevokeProcessed.length);

            const isReqRevoc = isRevCheckInner(oData);
            oModel.setProperty("/showApprovalHistory", true);
            sessionStorage.setItem("kyra_show_approval_history", "true");
            oModel.setProperty("/approverHistoryTab", isReqRevoc ? "revokeRequests" : "accessRequests");
            this._updateDisplayedHistoryRequests();
            sessionStorage.setItem("kyra_pending_requests", JSON.stringify(aPending));
            sessionStorage.setItem("kyra_processed_requests", JSON.stringify(aProcessed));

            const aActiveRoles = oModel.getProperty("/activeRoles") || [];
            aFinalApproved.forEach(app => {
                aActiveRoles.unshift({
                    system: app.system,
                    roleName: app.roleName,
                    roleId: "GRANTED_" + oData.requestId,
                    category: oData.sector,
                    grantedDate: sDate,
                    expiryDate: oData.duration,
                    status: "Active",
                    statusState: "Success",
                    statusIcon: "sap-icon://sys-enter-2"
                });
            });
            oModel.setProperty("/activeRoles", aActiveRoles);

            const aNotifs = oModel.getProperty("/notifications") || [];
            aNotifs.unshift({
                title: "Access Decision Submitted",
                description: "User Id " + oData.requestId + " for Requester: " + aFinalApproved.length + " Approved, " + aRejectedItems.length + " Rejected.",
                info: "Just now",
                icon: sStatusIcon
            });
            oModel.setProperty("/notifications", aNotifs);
            oModel.setProperty("/notificationCount", aNotifs.length);

            // Persist the decision to the database
            const bHasConflict = (
                oData.hasConflict === true ||
                oData.has_conflict === true ||
                !!oData.conflictingRole ||
                !!oData.conflicting_role ||
                (oData.entitlements || []).some(e => e.hasConflict === true || e.has_conflict === true || !!e.conflictingRole || !!e.conflicting_role)
            );
            let aDecisionsPayload = (oData.entitlements || []).map(e => ({
                requestNumber: e.requestId || oData.requestId,
                targetSystem: e.system,
                roleName: e.roleName,
                selectedPersona: e.selectedPersona || oData.persona,
                status: (e.status || "").toLowerCase().includes("reject") ? "REJECTED" : "APPROVED",
                hasConflict: bHasConflict
            }));

            if (!aDecisionsPayload || aDecisionsPayload.length === 0) {
                const isRejected = (sOverallStatus || "").toLowerCase().includes("reject");
                aDecisionsPayload = [{
                    requestNumber: oData.requestId,
                    targetSystem: oData.system || "SAP System",
                    roleName: oData.roleName || oData.serviceAndRole || "System Entitlement",
                    selectedPersona: oData.selectedPersona || oData.persona || "User",
                    status: isRejected ? "REJECTED" : "APPROVED",
                    hasConflict: bHasConflict
                }];
            }

            try {
                const sActiveUser = sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || "emp081";
                const response = await fetch("/odata/v4/auth/submitAccessDecision", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        requestNumber: oData.requestId,
                        actorRole: sessionStorage.getItem("kyra_active_role") || "Approver",
                        actorUsername: sActiveUser,
                        approverUsername: sActiveUser,
                        hasConflict: bHasConflict,
                        decisions: aDecisionsPayload
                    })
                });
                const data = await response.json();
                console.log("Successfully persisted approval decision to database:", data);
            } catch (err) {
                console.error("Database persistence approval decision error:", err);
            }

            // 2. Clear in-flight background query coalescers so fresh DB read is forced
            window._kyraGovFetchPromise = null;
            window._kyraDecisionMutationEpoch = (window._kyraDecisionMutationEpoch || 0) + 1;
            window._kyraDecisionInFlight = false;
            window._kyraLastDecidedReqId = oData.requestId;
            window._kyraLastDecisionSubmitTime = Date.now();

            // 3. Track decided request in a persistent map so it can never leak back into pending
            if (!window._kyraDecidedRequestsMap) {
                window._kyraDecidedRequestsMap = {};
                try {
                    const sSavedMap = sessionStorage.getItem("kyra_decided_requests_map");
                    if (sSavedMap) window._kyraDecidedRequestsMap = JSON.parse(sSavedMap);
                } catch(e) {}
            }
            let oDecidedMap = window._kyraDecidedRequestsMap || {};
            const sReqIdNorm = String(oData.requestId).trim().toUpperCase();
            const sReqBaseNorm = getBaseReqId(sReqIdNorm).toUpperCase();
            const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver");
            const bIsCompliance = sActiveRole.toLowerCase().includes("compliance");
            const oDecidedRecord = {
                requestId: sReqIdNorm,
                baseRequestId: sReqBaseNorm,
                status: sOverallStatus,
                actorRole: sActiveRole,
                isCompliance: bIsCompliance,
                timestamp: Date.now()
            };
            window._kyraDecidedRequestsMap[sReqIdNorm] = oDecidedRecord;
            window._kyraDecidedRequestsMap[sReqBaseNorm] = oDecidedRecord;
            oDecidedMap[sReqIdNorm] = oDecidedRecord;
            oDecidedMap[sReqBaseNorm] = oDecidedRecord;
            (oData.entitlements || []).forEach(e => {
                if (e.requestId) {
                    const eNorm = String(e.requestId).trim().toUpperCase();
                    window._kyraDecidedRequestsMap[eNorm] = oDecidedRecord;
                    oDecidedMap[eNorm] = oDecidedRecord;
                }
            });
            try {
                sessionStorage.setItem("kyra_decided_requests_map", JSON.stringify(oDecidedMap));
            } catch(e) {}

            // Immediately update in-memory and persisted cached requests
            const sNowIso = new Date().toISOString();
            if (window._kyraCachedGovRequests && Array.isArray(window._kyraCachedGovRequests)) {
                window._kyraCachedGovRequests.forEach(r => {
                    const rId = String(r.request_number || r.requestId || r.id || "").trim().toUpperCase();
                    const rBase = getBaseReqId(rId).toUpperCase();
                    if (rId === sReqIdNorm || rBase === sReqBaseNorm || rId === sReqBaseNorm || rBase === sReqIdNorm) {
                        if (bIsCompliance) {
                            r.compliance_status = sOverallStatus.toUpperCase();
                            r.compliance_decision_status = sOverallStatus.toUpperCase();
                            r.status = sOverallStatus.toUpperCase().includes("REJECT") ? "REJECTED" : "PENDING_IAM_1";
                            r.db_status = r.status;
                        } else {
                            r.approver_status = sOverallStatus.toUpperCase();
                            r.approver_decision_status = sOverallStatus.toUpperCase();
                            const hasRowConf = r.has_conflict === true || !!(r.conflicting_role && r.conflicting_role.trim());
                            r.status = sOverallStatus.toUpperCase().includes("REJECT") ? "REJECTED" : (hasRowConf ? "PENDING_COMPLIANCE" : "PENDING_IAM_1");
                            r.db_status = r.status;
                        }
                        r.updated_at = sNowIso;
                    }
                });
                try {
                    sessionStorage.setItem("kyra_cached_gov_requests", JSON.stringify(window._kyraCachedGovRequests));
                    localStorage.setItem("kyra_cached_gov_requests", JSON.stringify(window._kyraCachedGovRequests));
                } catch(e) {}
            }

            // Sync with backend database states
            await this._reloadAllRequests(oModel);
            this._notifyDatabaseMutation();

            MessageToast.show("Decision submitted for User Id " + oData.requestId);
            oModel.setProperty("/showRequestDetailView", false);
        },

        _buildApproverHistoryAndPending(aRawRecords) {

            const deriveCleanService = (r) => {
                const roleStr = (r.role_name || r.roleName || r.selected_persona || r.selectedPersona || r.requester_persona || r.persona || "").toLowerCase();
                if (roleStr.includes("owner") || roleStr.includes("architect") || roleStr.includes("lead") || roleStr.includes("product manager")) {
                    return "System Owners";
                } else if (roleStr.includes("stakeholder") || roleStr.includes("compliance") || roleStr.includes("isrm")) {
                    return "Stakeholders";
                } else {
                    return "System Administrator";
                }
            };

            const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
            const sActiveUser = (sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || "").trim().toLowerCase();
            const isCompliance = sActiveRole.includes("compliance");
            const isIam1 = sActiveRole.includes("approver 1") || sActiveRole.includes("iam 1") || sActiveRole.includes("iam_1");
            const isIam2 = sActiveRole.includes("approver 2") || sActiveRole.includes("iam 2") || sActiveRole.includes("iam_2");
            const isApprover = !isCompliance && !isIam1 && !isIam2;

            const oGrouped = {};
            const oPendingGrouped = {};

            const aSortedRecords = [...(aRawRecords || [])].sort((a, b) => {
                const tA = new Date(a.updated_at || a.created_at || 0).getTime() || 0;
                const tB = new Date(b.updated_at || b.created_at || 0).getTime() || 0;
                if (tB !== tA) return tB - tA;
                return String(b.request_number || "").localeCompare(String(a.request_number || ""));
            });

            let oDecidedMap = window._kyraDecidedRequestsMap || {};
            try {
                const sDecSaved = sessionStorage.getItem("kyra_decided_requests_map");
                if (sDecSaved) {
                    const parsed = JSON.parse(sDecSaved);
                    oDecidedMap = Object.assign({}, parsed, oDecidedMap);
                }
            } catch(eDec) {}

            // Apply decided map to raw records so they carry their decided status
            if (oDecidedMap && Object.keys(oDecidedMap).length > 0) {
                aSortedRecords.forEach(r => {
                    const sNum = (r.request_number || r.requestId || r.id || "").trim();
                    const sBase = getBaseReqId(sNum);
                    const dec = oDecidedMap[sNum] || oDecidedMap[sNum.toUpperCase()] || 
                                (sBase ? (oDecidedMap[sBase] || oDecidedMap[sBase.toUpperCase()]) : null);
                    if (dec) {
                        const sDecStatus = (dec.status || "").toUpperCase();
                        if (dec.role === "compliance" || dec.isCompliance || (dec.actorRole && dec.actorRole.toLowerCase().includes("compliance")) || isCompliance) {
                            r.compliance_status = sDecStatus;
                            r.compliance_decision_status = sDecStatus;
                            r.status = sDecStatus.includes("REJECT") ? "REJECTED" : "PENDING_IAM_1";
                            r.db_status = r.status;
                        } else if (dec.role === "iam1" || isIam1) {
                            r.iam_approver_1_status = sDecStatus;
                            r.iam_approver_1_decision_status = sDecStatus;
                        } else if (dec.role === "iam2" || isIam2) {
                            r.iam_approver_2_status = sDecStatus;
                            r.iam_approver_2_decision_status = sDecStatus;
                        } else {
                            r.approver_status = sDecStatus;
                            r.approver_decision_status = sDecStatus;
                            const hasRowConf = r.has_conflict === true || !!(r.conflicting_role && r.conflicting_role.trim());
                            r.status = sDecStatus.includes("REJECT") ? "REJECTED" : (hasRowConf ? "PENDING_COMPLIANCE" : "PENDING_IAM_1");
                            r.db_status = r.status;
                        }
                    }
                });
            }

            // ── PASS 1: Base Request Pre-Aggregation across all child items ────────
            const mBaseInfo = {};
            aSortedRecords.forEach(r => {
                const sDbStatus = (r.db_status || r.status || "PENDING").toUpperCase();
                if (sDbStatus === "EXPIRED") return;
                const sBase = getBaseReqId(r.request_number || r.requestId || r.id);
                if (!sBase) return;

                if (!mBaseInfo[sBase]) {
                    mBaseInfo[sBase] = {
                        hasConflict: false,
                        conflictingRole: "",
                        isRevocation: false,
                        hasApproverDecided: false,
                        hasApproverRejected: false,
                        hasComplianceDecided: false,
                        hasComplianceRejected: false,
                        hasIam1Decided: false,
                        hasIam2Decided: false,
                        statuses: new Set(),
                        allRows: []
                    };
                }
                const info = mBaseInfo[sBase];
                info.allRows.push(r);
                info.statuses.add(sDbStatus);

                const hasRowConflict = r.has_conflict === true || r.hasConflict === true || !!(r.conflicting_role && String(r.conflicting_role).trim());
                if (hasRowConflict) {
                    info.hasConflict = true;
                    if (r.conflicting_role) info.conflictingRole = r.conflicting_role;
                }

                const isRowRevoc = (r.access_type || r.request_type || r.accessType || r.type || "").toUpperCase().includes("REV") ||
                                   (r.business_function || r.businessFunction || "").toUpperCase().includes("REVOCATION") ||
                                   (r.request_number || r.requestId || "").toUpperCase().startsWith("REV-") ||
                                   (r.request_number || r.requestId || "").toUpperCase().includes("-REV-");
                if (isRowRevoc) {
                    info.isRevocation = true;
                }

                const sApprStatus = (r.approver_status || r.approver_decision_status || "").toUpperCase();
                const sCompStatus = (r.compliance_status || r.compliance_decision_status || "").toUpperCase();
                const sIam1Status = (r.iam_approver_1_status || r.iam_approver_1_decision_status || "").toUpperCase();
                const sIam2Status = (r.iam_approver_2_status || r.iam_approver_2_decision_status || "").toUpperCase();

                if (sApprStatus === "APPROVED" || sApprStatus === "REJECTED" ||
                    sDbStatus === "PENDING_COMPLIANCE" || sDbStatus === "PENDING_IAM_1" ||
                    sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED" || sDbStatus === "REJECTED") {
                    info.hasApproverDecided = true;
                }
                if (sApprStatus === "REJECTED" || (sDbStatus === "REJECTED" && !sCompStatus && !sIam1Status && !sIam2Status)) {
                    info.hasApproverRejected = true;
                }

                if (sCompStatus === "APPROVED" || sCompStatus === "REJECTED" ||
                    sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" ||
                    (sDbStatus === "APPROVED" && info.hasConflict) ||
                    (sDbStatus === "REJECTED" && sCompStatus === "REJECTED")) {
                    info.hasComplianceDecided = true;
                }
                if (sCompStatus === "REJECTED") {
                    info.hasComplianceRejected = true;
                }

                if (sIam1Status === "APPROVED" || sIam1Status === "REJECTED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED") {
                    info.hasIam1Decided = true;
                }

                if (sIam2Status === "APPROVED" || sIam2Status === "REJECTED" || sDbStatus === "APPROVED") {
                    info.hasIam2Decided = true;
                }
            });

            // ── PASS 2: Categorization & Grouping based on Base Aggregation ────
            aSortedRecords.forEach(r => {
                const sDbStatus = (r.db_status || r.status || "PENDING").toUpperCase();
                if (sDbStatus === "EXPIRED") return;
                const sReqUser = (r.requester_username || r.requesterId || r.requesterUsername || "").trim().toLowerCase();
                // Allow all submitted requests to appear in Approver / Reviewer queue without self-suppression

                const sBaseId = getBaseReqId(r.request_number || r.requestId || r.id);
                const info = mBaseInfo[sBaseId] || {
                    hasConflict: r.has_conflict === true || !!(r.conflicting_role && String(r.conflicting_role).trim()),
                    conflictingRole: r.conflicting_role || "",
                    isRevocation: false,
                    hasApproverDecided: false,
                    hasApproverRejected: false,
                    hasComplianceDecided: false,
                    hasComplianceRejected: false,
                    hasIam1Decided: false,
                    hasIam2Decided: false,
                    statuses: new Set([sDbStatus])
                };

                const hasConflict = info.hasConflict;
                const isRevocation = info.isRevocation;

                let isPendingForRole = false;
                let bRoleApproved = false;
                let isProcessedForRole = false;

                if (isCompliance) {
                    // COMPLIANCE REVIEWER:
                    // Only handles non-revocation requests WITH conflict.
                    // If Compliance has already decided: goes to History (Processed), NEVER in Pending!
                    if (!isRevocation && hasConflict) {
                        if (info.hasComplianceDecided) {
                            isProcessedForRole = true;
                            bRoleApproved = !info.hasComplianceRejected;
                        } else if (sDbStatus !== "REJECTED" && sDbStatus !== "EXPIRED") {
                            isPendingForRole = true;
                        }
                    }
                } else if (isIam1) {
                    // IAM APPROVER 1:
                    if (info.hasIam1Decided) {
                        isProcessedForRole = true;
                        bRoleApproved = (r.iam_approver_1_status || "").toUpperCase() !== "REJECTED" && sDbStatus !== "REJECTED";
                    } else if (sDbStatus !== "REJECTED" && sDbStatus !== "EXPIRED" && (info.statuses.has("PENDING_IAM_1") || 
                              (isRevocation && info.hasApproverDecided) ||
                              (!hasConflict && info.hasApproverDecided) ||
                              (hasConflict && info.hasComplianceDecided))) {
                        isPendingForRole = true;
                    }
                } else if (isIam2) {
                    // IAM APPROVER 2:
                    if (info.hasIam2Decided) {
                        isProcessedForRole = true;
                        bRoleApproved = (r.iam_approver_2_status || "").toUpperCase() !== "REJECTED" && sDbStatus !== "REJECTED";
                    } else if (sDbStatus !== "REJECTED" && sDbStatus !== "EXPIRED" && (info.statuses.has("PENDING_IAM_2") || info.hasIam1Decided)) {
                        isPendingForRole = true;
                    }
                } else {
                    // INITIAL APPROVER (Line Manager):
                    // If Initial Approver has already decided: goes to History (Processed), NEVER in Pending!
                    if (info.hasApproverDecided) {
                        isProcessedForRole = true;
                        bRoleApproved = !info.hasApproverRejected;
                    } else if (sDbStatus !== "REJECTED" && sDbStatus !== "EXPIRED") {
                        isPendingForRole = true;
                    }
                }

                const sService = deriveCleanService(r);
                const sDate = r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : "2026-09-04");
                const sUser = r.requester_username || r.requesterId || r.requesterUsername || "User";

                // Accurately preserve Business Sector, Business Function, and Duration from Add Access submission data:
                let matchingApproved = null;
                if (isRevocation) {
                    matchingApproved = (aRawRecords || []).find(cand => {
                        if (!cand) return false;
                        const candRev = (cand.access_type || cand.request_type || "").toUpperCase().includes("REV") ||
                                        (cand.business_function || "").toUpperCase().includes("REVOCATION") ||
                                        (cand.request_number || "").toUpperCase().startsWith("REV-") ||
                                        (cand.request_number || "").includes("-REV-");
                        if (candRev) return false;
                        const candDb = (cand.db_status || cand.status || "").toUpperCase();
                        if (candDb !== "APPROVED" && candDb !== "ACTIVE") return false;
                        if ((cand.requester_username || "").toLowerCase() !== (r.requester_username || "").toLowerCase()) return false;
                        if ((cand.target_system || "") !== (r.target_system || "")) return false;
                        const cRoleA = (cand.role_name || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
                        const cRoleB = (r.role_name || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
                        return cRoleA === cRoleB || (cRoleA && cRoleB && (cRoleA.includes(cRoleB) || cRoleB.includes(cRoleA)));
                    });
                }

                const sSector = (matchingApproved && matchingApproved.business_sector) || r.business_sector || r.sector || "Information Technology & Security";
                const sFunction = (isRevocation && matchingApproved && matchingApproved.business_function)
                    ? matchingApproved.business_function
                    : (r.business_function && r.business_function !== "Access Revocation" ? r.business_function : (r.function || "Corporate Governance"));
                const sDuration = isRevocation ? formatArDuration(r, matchingApproved) : (r.access_duration || r.duration || "Permanent");
                const sRegion = r.operating_region || r.region || "Global Enterprise (ALL)";
                const sJustification = r.justification || "";
                const sType = isRevocation ? "Revocation" : (r.access_type === "RESTRICTED" ? "Addition (Restricted)" : (r.access_type || "Addition"));

                if (isPendingForRole) {
                    const sBaseId = getBaseReqId(r.request_number || r.requestId);
                    const sPendKey = sBaseId || r.request_number || r.requestId || (sUser + "_" + sSector + "_" + sFunction + "_" + (isRevocation ? "REVOCATION" : "ADDITION"));
                    if (!oPendingGrouped[sPendKey]) {
                        oPendingGrouped[sPendKey] = {
                            requestId: sBaseId || r.request_number || r.requestId || ("REQ-" + (r.ID || "GEN")),
                            requesterId: sUser,
                            requesterUsername: sUser,
                            selectedPersona: r.selected_persona || r.selectedPersona || r.role_name || "Frontend & UI Developer",
                            persona: r.selected_persona || r.selectedPersona || r.role_name || "Frontend & UI Developer",
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
                            createdAtRaw: r.created_at || r.createdAtRaw || new Date().toISOString(),
                            created_at: r.created_at || r.createdAtRaw || new Date().toISOString(),
                            updated_at: r.updated_at || r.created_at || new Date().toISOString(),
                            status: isRevocation ? "Revoke Pending" : "Pending Approval",
                            statusState: isRevocation ? "Error" : "Warning",
                            statusIcon: "sap-icon://pending",
                            isRevocation: isRevocation,
                            hasConflict: hasConflict,
                            has_conflict: hasConflict,
                            conflictingRole: r.conflicting_role || "",
                            conflicting_role: r.conflicting_role || "",
                            _isPendingForRole: true,
                            approverRemark: r.approver_comment || r.approverRemark || "",
                            entitlements: []
                        };
                    } else if (hasConflict) {
                        oPendingGrouped[sPendKey].hasConflict = true;
                        oPendingGrouped[sPendKey].has_conflict = true;
                        if (r.conflicting_role) {
                            oPendingGrouped[sPendKey].conflictingRole = r.conflicting_role;
                            oPendingGrouped[sPendKey].conflicting_role = r.conflicting_role;
                        }
                    }
                    if (!oPendingGrouped[sPendKey]._seenEnts) {
                        oPendingGrouped[sPendKey]._seenEnts = new Set();
                    }
                    const sEntUnique = `${r.request_number || r.requestId || ''}:::${r.target_system || r.system || ''}:::${r.role_name || r.roleName || ''}:::${cleanPersonaName(r.selected_persona || r.persona || '')}`;
                    if (!oPendingGrouped[sPendKey]._seenEnts.has(sEntUnique)) {
                        oPendingGrouped[sPendKey]._seenEnts.add(sEntUnique);
                        oPendingGrouped[sPendKey].entitlements.push({
                            requestId: r.request_number || r.requestId,
                            system: r.target_system || r.system,
                            roleName: r.role_name || r.roleName,
                            team: sService,
                            serviceTopic: sService,
                            selectedPersona: cleanPersonaName(r.selected_persona || r.persona || r.role_name || ""),
                            persona: cleanPersonaName(r.selected_persona || r.persona || r.role_name || ""),
                            status: "Pending",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending",
                            approverRemark: r.approver_comment || r.approverRemark || "",
                            comment: r.reviewer_comment || r.comments || "",
                            hasConflict: hasConflict,
                            has_conflict: hasConflict,
                            conflictingRole: r.conflicting_role || "",
                            conflicting_role: r.conflicting_role || ""
                        });
                    }
                    return;
                }

                if (isProcessedForRole) {
                    const sBaseId = getBaseReqId(r.request_number || r.requestId);
                    const sGroupKey = sBaseId || r.request_number || r.requestId || (sUser + "_" + sDate + "_" + (r.selected_persona || r.role_name));

                    if (!oGrouped[sGroupKey]) {
                        const sPersona = r.selected_persona || r.selectedPersona || r.role_name || "";

                        oGrouped[sGroupKey] = {
                            requestId: sBaseId || r.request_number || r.requestId || ("REQ-" + (r.ID || "GEN")),
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
                            createdAtRaw: r.created_at || r.createdAtRaw || new Date().toISOString(),
                            created_at: r.created_at || r.createdAtRaw || new Date().toISOString(),
                            updatedAtRaw: r.updated_at || r.iam_approver_2_decision_created_at || r.iam_approver_1_decision_created_at || r.compliance_decision_created_at || r.approver_decision_created_at || r.created_at || new Date().toISOString(),
                            updated_at: r.updated_at || r.iam_approver_2_decision_created_at || r.iam_approver_1_decision_created_at || r.compliance_decision_created_at || r.approver_decision_created_at || r.created_at || new Date().toISOString(),
                            isRevocation: isRevocation,
                            hasConflict: hasConflict,
                            has_conflict: hasConflict,
                            conflictingRole: r.conflicting_role || "",
                            conflicting_role: r.conflicting_role || "",
                            _isPendingForRole: false,
                            entitlements: []
                        };
                    } else if (hasConflict) {
                        oGrouped[sGroupKey].hasConflict = true;
                        oGrouped[sGroupKey].has_conflict = true;
                        if (r.conflicting_role) {
                            oGrouped[sGroupKey].conflictingRole = r.conflicting_role;
                            oGrouped[sGroupKey].conflicting_role = r.conflicting_role;
                        }
                    }

                    const sCandidateUpd = r.updated_at || r.iam_approver_2_decision_created_at || r.iam_approver_1_decision_created_at || r.compliance_decision_created_at || r.approver_decision_created_at || r.created_at || "";
                    if (sCandidateUpd && new Date(sCandidateUpd).getTime() > new Date(oGrouped[sGroupKey].updatedAtRaw || oGrouped[sGroupKey].updated_at || 0).getTime()) {
                        oGrouped[sGroupKey].updatedAtRaw = sCandidateUpd;
                        oGrouped[sGroupKey].updated_at = sCandidateUpd;
                        oGrouped[sGroupKey].decisionDate = sCandidateUpd.split("T")[0];
                    }
                    if (window._kyraLastDecidedReqId && getBaseReqId(oGrouped[sGroupKey].requestId).toUpperCase() === String(window._kyraLastDecidedReqId).toUpperCase() && (Date.now() - (window._kyraLastDecisionSubmitTime || 0) < 15000)) {
                        const sForcedIso = new Date(window._kyraLastDecisionSubmitTime).toISOString();
                        if (new Date(sForcedIso).getTime() > new Date(oGrouped[sGroupKey].updatedAtRaw || 0).getTime()) {
                            oGrouped[sGroupKey].updatedAtRaw = sForcedIso;
                            oGrouped[sGroupKey].updated_at = sForcedIso;
                            oGrouped[sGroupKey].decisionDate = sForcedIso.split("T")[0];
                        }
                    }
                    if (!oGrouped[sGroupKey]._seenEnts) {
                        oGrouped[sGroupKey]._seenEnts = new Set();
                    }
                    const sEntUnique = `${r.request_number || r.requestId || ''}:::${r.target_system || r.system || ''}:::${r.role_name || r.roleName || ''}:::${cleanPersonaName(r.selected_persona || r.persona || '')}`;
                    if (!oGrouped[sGroupKey]._seenEnts.has(sEntUnique)) {
                        oGrouped[sGroupKey]._seenEnts.add(sEntUnique);
                        oGrouped[sGroupKey].entitlements.push({
                            requestId: r.request_number || r.requestId,
                            system: r.target_system || r.system,
                            roleName: r.role_name || r.roleName,
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
                const tA = new Date(a.updatedAtRaw || a.updated_at || a.decisionDate || a.createdAtRaw || a.created_at || a.submissionDate || 0).getTime();
                const tB = new Date(b.updatedAtRaw || b.updated_at || b.decisionDate || b.createdAtRaw || b.created_at || b.submissionDate || 0).getTime();
                if (tA !== tB && !isNaN(tA) && !isNaN(tB)) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });

            const processedBaseIds = new Set(Object.keys(oGrouped).map(k => getBaseReqId(k).toUpperCase()).filter(Boolean));
            if (oDecidedMap) {
                Object.keys(oDecidedMap).forEach(k => {
                    const sK = String(k).trim().toUpperCase();
                    processedBaseIds.add(sK);
                    const bK = getBaseReqId(sK).toUpperCase();
                    if (bK) processedBaseIds.add(bK);
                });
            }
            if (window._kyraLastDecidedReqId) {
                const sL = String(window._kyraLastDecidedReqId).trim().toUpperCase();
                processedBaseIds.add(sL);
                const bL = getBaseReqId(sL).toUpperCase();
                if (bL) processedBaseIds.add(bL);
            }
            Object.keys(oPendingGrouped).forEach(k => {
                const bId = getBaseReqId(k).toUpperCase();
                if (processedBaseIds.has(bId) || processedBaseIds.has(k.toUpperCase())) {
                    delete oPendingGrouped[k];
                }
            });
            const aPending = Object.values(oPendingGrouped).filter(p => {
                const pId = String(p.requestId || p.request_number || "").toUpperCase();
                const pBase = getBaseReqId(pId).toUpperCase();
                return !processedBaseIds.has(pId) && !processedBaseIds.has(pBase);
            });
            const getPendingTime = (r) => {
                const raw = r.createdAtRaw || r.created_at || r.createdAt || r.submissionDate || "";
                if (!raw) return 0;
                const parsed = new Date(raw).getTime();
                return isNaN(parsed) ? 0 : parsed;
            };
            aPending.sort((a, b) => {
                const tA = getPendingTime(a);
                const tB = getPendingTime(b);
                if (tA !== tB && tA > 0 && tB > 0) return tA - tB;
                return (a.requestId || "").localeCompare(b.requestId || "");
            });
            return {
                processed: aProcessed,
                pending: aPending
            };
        },

        _applyLoadedApproverData(oModel, aRawData, isCompliance) {
            if (!oModel || !aRawData) return;

            let aPending = [];
            let aProcessed = [];

            try {
                const sS = sessionStorage.getItem("kyra_pending_revocations");
                const sL = localStorage.getItem("kyra_pending_revocations");
                const aS = sS ? JSON.parse(sS) : [];
                const aL = sL ? JSON.parse(sL) : [];
                const aStoredRev = aS.concat(aL);

                aStoredRev.forEach(rev => {
                    if (!rev || !rev.requestId) return;
                    const sRevId = String(rev.requestId).trim().toUpperCase();
                    const bAlreadyExists = aRawData.some(r => {
                        const sNum = String(r.request_number || r.requestId || r.id || "").trim().toUpperCase();
                        return sNum === sRevId || sNum.startsWith(sRevId + "-") || sRevId.startsWith(sNum + "-");
                    });

                    if (!bAlreadyExists) {
                        aRawData.unshift({
                            id: rev.requestId,
                            request_number: rev.requestId,
                            requester_username: rev.requesterUsername || rev.requesterId || "emp018",
                            requester_persona: rev.persona || "Requester",
                            business_sector: rev.sector || "Information Technology & Security",
                            business_function: rev.function || "Corporate Governance",
                            operating_region: rev.region || "Global Enterprise (ALL)",
                            target_system: rev.system,
                            role_name: rev.roleName,
                            service_topic: rev.category || "System Administrator",
                            selected_persona: rev.persona,
                            access_type: "Revocation",
                            access_duration: rev.duration || rev.accessDuration || "30 Days (Temporary)",
                            justification: rev.justification || "Revocation of access",
                            db_status: "PENDING",
                            status: "PENDING",
                            approver_status: "",
                            created_at: rev.createdAt || new Date().toISOString()
                        });
                    }
                });
            } catch(eRev) {
                console.warn("Error merging stored pending revocations in Approver:", eRev);
            }

            if (aRawData.length > 0) {
                const oApproverData = this._buildApproverHistoryAndPending(aRawData);
                aPending = oApproverData.pending;
                aProcessed = oApproverData.processed;
            }

            try {
                const aStoredProc = JSON.parse(sessionStorage.getItem("kyra_processed_requests") || "[]");
                const processedBaseIds = new Set();
                aProcessed.forEach(p => {
                    if (p.requestId) {
                        processedBaseIds.add(String(p.requestId).trim().toUpperCase());
                        processedBaseIds.add(getBaseReqId(String(p.requestId).trim()).toUpperCase());
                    }
                    if (p.request_number) {
                        processedBaseIds.add(String(p.request_number).trim().toUpperCase());
                        processedBaseIds.add(getBaseReqId(String(p.request_number).trim()).toUpperCase());
                    }
                });
                aStoredProc.forEach(sp => {
                    if (sp && sp.requestId) {
                        const sReq = String(sp.requestId).trim().toUpperCase();
                        const bReq = getBaseReqId(sReq).toUpperCase();
                        processedBaseIds.add(sReq);
                        processedBaseIds.add(bReq);
                        const existingIdx = aProcessed.findIndex(p => {
                            const pId = String(p.requestId || p.request_number || "").trim().toUpperCase();
                            return pId === sReq || getBaseReqId(pId).toUpperCase() === bReq;
                        });
                        if (existingIdx >= 0) {
                            const existing = aProcessed[existingIdx];
                            if (sp.status && sp.status !== "Pending" && sp.status !== "Revoke Pending") {
                                existing.status = sp.status;
                                existing.statusState = sp.statusState;
                                existing.statusIcon = sp.statusIcon;
                                existing.decisionDate = sp.decisionDate || existing.decisionDate;
                                existing.updatedAtRaw = sp.updatedAtRaw || existing.updatedAtRaw;
                                existing.updated_at = sp.updated_at || existing.updated_at;
                            }
                            if (existing.entitlements && existing.entitlements.length > 0) {
                                const seenE = new Set();
                                existing.entitlements = existing.entitlements.filter(e => {
                                    const sKey = `${e.requestId || ''}:::${e.system || ''}:::${e.roleName || ''}:::${e.selectedPersona || ''}`;
                                    if (seenE.has(sKey)) return false;
                                    seenE.add(sKey);
                                    return true;
                                });
                            }
                        } else {
                            if (!sp.updatedAtRaw) sp.updatedAtRaw = sp.updated_at || new Date().toISOString();
                            if (!sp.updated_at) sp.updated_at = sp.updatedAtRaw;
                            if (sp.entitlements && sp.entitlements.length > 0) {
                                const seenE = new Set();
                                sp.entitlements = sp.entitlements.filter(e => {
                                    const sKey = `${e.requestId || ''}:::${e.system || ''}:::${e.roleName || ''}:::${e.selectedPersona || ''}`;
                                    if (seenE.has(sKey)) return false;
                                    seenE.add(sKey);
                                    return true;
                                });
                            }
                            aProcessed.unshift(sp);
                        }
                    }
                });
                let oDecidedMap = window._kyraDecidedRequestsMap || {};
                try {
                    const sDecSaved = sessionStorage.getItem("kyra_decided_requests_map");
                    if (sDecSaved) {
                        const parsed = JSON.parse(sDecSaved);
                        oDecidedMap = Object.assign({}, parsed, oDecidedMap);
                    }
                } catch(eDec) {}
                if (oDecidedMap) {
                    Object.keys(oDecidedMap).forEach(k => {
                        const sK = String(k).trim().toUpperCase();
                        processedBaseIds.add(sK);
                        const bK = getBaseReqId(sK).toUpperCase();
                        if (bK) processedBaseIds.add(bK);
                    });
                }
                if (window._kyraLastDecidedReqId) {
                    const sL = String(window._kyraLastDecidedReqId).trim().toUpperCase();
                    processedBaseIds.add(sL);
                    const bL = getBaseReqId(sL).toUpperCase();
                    if (bL) processedBaseIds.add(bL);
                }
                aPending = aPending.filter(p => {
                    const pId = String(p.requestId || p.request_number || "").trim().toUpperCase();
                    const pBase = getBaseReqId(pId).toUpperCase();
                    if (processedBaseIds.has(pId) || processedBaseIds.has(pBase)) return false;
                    if (p.entitlements && p.entitlements.some(e => {
                        const eId = String(e.requestId || "").trim().toUpperCase();
                        const eBase = getBaseReqId(eId).toUpperCase();
                        return processedBaseIds.has(eId) || (eBase && processedBaseIds.has(eBase));
                    })) {
                        return false;
                    }
                    return true;
                });
            } catch(eProc) {}

            const isRevCheck = (req) => {
                const sType = (req.type || req.access_type || "").toUpperCase();
                const sFunc = (req.function || req.businessFunction || req.business_function || "").toUpperCase();
                const sId = (req.requestId || req.request_number || "").toUpperCase();
                return req.isRevocation === true ||
                       sType.includes("REV") ||
                       sFunc.includes("REVOCATION") ||
                       sId.startsWith("REV-") ||
                       sId.includes("-REV-");
            };

            const sortChronologicallyAsc = (a, b) => {
                const getTime = (r) => {
                    const raw = r.createdAtRaw || r.created_at || r.createdAt || r.submissionDate || "";
                    if (!raw) return 0;
                    const parsed = new Date(raw).getTime();
                    return isNaN(parsed) ? 0 : parsed;
                };
                const tA = getTime(a);
                const tB = getTime(b);
                if (tA !== tB && tA > 0 && tB > 0) return tA - tB;
                return (a.requestId || "").localeCompare(b.requestId || "");
            };

            const sortChronologicallyDesc = (a, b) => {
                const getTime = (r) => {
                    const raw = r.updatedAtRaw || r.updated_at || r.decisionDate || r.createdAtRaw || r.created_at || r.submissionDate || "";
                    if (!raw) return 0;
                    const parsed = new Date(raw).getTime();
                    return isNaN(parsed) ? 0 : parsed;
                };
                const tA = getTime(a);
                const tB = getTime(b);
                if (tA !== tB && tA > 0 && tB > 0) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            };

            const aAccessPending = aPending.filter(p => !isRevCheck(p));
            const aRevokePending = aPending.filter(p => isRevCheck(p));
            const aAccessProcessed = aProcessed.filter(p => !isRevCheck(p));
            const aRevokeProcessed = aProcessed.filter(p => isRevCheck(p));

            aPending.sort(sortChronologicallyAsc);
            aAccessPending.sort(sortChronologicallyAsc);
            aRevokePending.sort(sortChronologicallyAsc);

            aProcessed.sort(sortChronologicallyDesc);
            aAccessProcessed.sort(sortChronologicallyDesc);
            aRevokeProcessed.sort(sortChronologicallyDesc);

            this._setSmartProperty(oModel, "/pendingAccessRequests", aAccessPending);
            this._setSmartProperty(oModel, "/pendingRevokeRequests", aRevokePending);
            this._setSmartProperty(oModel, "/pendingAccessCount", aAccessPending.length);
            this._setSmartProperty(oModel, "/pendingRevokeCount", aRevokePending.length);

            this._setSmartProperty(oModel, "/processedAccessRequests", aAccessProcessed);
            this._setSmartProperty(oModel, "/processedRevokeRequests", aRevokeProcessed);
            this._setSmartProperty(oModel, "/processedAccessCount", aAccessProcessed.length);
            this._setSmartProperty(oModel, "/processedRevokeCount", aRevokeProcessed.length);
            this._setSmartProperty(oModel, "/processedCount", aProcessed.length);

            this._setSmartProperty(oModel, "/historyAccessRequests", aAccessProcessed);
            this._setSmartProperty(oModel, "/historyRevokeRequests", aRevokeProcessed);
            this._setSmartProperty(oModel, "/historyAccessCount", aAccessProcessed.length);
            this._setSmartProperty(oModel, "/historyRevokeCount", aRevokeProcessed.length);

            this._setSmartProperty(oModel, "/pendingRequests", isCompliance ? aAccessPending : aPending);
            this._setSmartProperty(oModel, "/processedRequests", aProcessed);
            const bShowHistory = sessionStorage.getItem("kyra_show_approval_history") === "true";
            if (bShowHistory) {
                this._setSmartProperty(oModel, "/showApprovalHistory", true);
            }
            this._updateDisplayedHistoryRequests();

            const oCompModel = this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel");
            if (oCompModel && oCompModel !== oModel) {
                this._setSmartProperty(oCompModel, "/pendingRequests", isCompliance ? aAccessPending : aPending);
                this._setSmartProperty(oCompModel, "/pendingAccessRequests", aAccessPending);
                this._setSmartProperty(oCompModel, "/pendingRevokeRequests", aRevokePending);
                this._setSmartProperty(oCompModel, "/pendingAccessCount", aAccessPending.length);
                this._setSmartProperty(oCompModel, "/pendingRevokeCount", aRevokePending.length);
                this._setSmartProperty(oCompModel, "/processedRequests", aProcessed);
                this._setSmartProperty(oCompModel, "/processedAccessRequests", aAccessProcessed);
                this._setSmartProperty(oCompModel, "/processedRevokeRequests", aRevokeProcessed);
                this._setSmartProperty(oCompModel, "/processedAccessCount", aAccessProcessed.length);
                this._setSmartProperty(oCompModel, "/processedRevokeCount", aRevokeProcessed.length);
                this._setSmartProperty(oCompModel, "/processedCount", aProcessed.length);
                this._setSmartProperty(oCompModel, "/historyAccessRequests", aAccessProcessed);
                this._setSmartProperty(oCompModel, "/historyRevokeRequests", aRevokeProcessed);
                this._setSmartProperty(oCompModel, "/historyAccessCount", aAccessProcessed.length);
                this._setSmartProperty(oCompModel, "/historyRevokeCount", aRevokeProcessed.length);
                this._setSmartProperty(oCompModel, "/displayedHistoryRequests", oModel.getProperty("/displayedHistoryRequests"));
                if (bShowHistory) {
                    this._setSmartProperty(oCompModel, "/showApprovalHistory", true);
                }
            }
        },

        async _reloadAllRequests(oModel, bSilent = false) {
            if (!bSilent) {
                if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                    window.KyraLoader.show({
                        title: "Loading Governance Review...",
                        subtitle: "Retrieving pending approvals and compliance records..."
                    });
                }
            }
            if (!oModel) return;

            const sActiveRole = (sessionStorage.getItem("kyra_active_role") || "Approver").toLowerCase();
            const isCompliance = sActiveRole.includes("compliance");
            oModel.setProperty("/isCompliance", isCompliance);
            oModel.setProperty("/isComplianceReviewer", isCompliance);
            oModel.setProperty("/isCompliancePersona", isCompliance);
            if (isCompliance) {
                oModel.setProperty("/approverPendingTab", "accessRequests");
            }
            if (sessionStorage.getItem("kyra_show_approval_history") === "true") {
                oModel.setProperty("/showApprovalHistory", true);
            } else {
                oModel.setProperty("/showApprovalHistory", false);
            }

            // ── STEP 1: INSTANT HYDRATION (0 ms) from memory or storage ──────────
            let aInitialData = window._kyraCachedGovRequests;
            if (!aInitialData || !aInitialData.length) {
                try {
                    const sSaved = sessionStorage.getItem("kyra_cached_gov_requests") || localStorage.getItem("kyra_cached_gov_requests");
                    if (sSaved) aInitialData = JSON.parse(sSaved);
                } catch(e) {}
            }
            if (aInitialData && aInitialData.length > 0) {
                const seenInit = new Set();
                const aDedupedInit = aInitialData.filter(r => {
                    const sNum = (r.request_number || r.requestId || ("REQ-" + r.ID) || "").trim();
                    if (!sNum) return true;
                    if (seenInit.has(sNum)) return false;
                    seenInit.add(sNum);
                    return true;
                });
                this._applyLoadedApproverData(oModel, aDedupedInit, isCompliance);
            }

            // ── STEP 2: BACKGROUND REVALIDATION WITH SINGLE-FLIGHT COALESCING ────
            const iStartEpoch = window._kyraDecisionMutationEpoch || 0;
            if (window._kyraDecisionInFlight) return;

            try {
                if (!window._kyraGovFetchPromise) {
                    window._kyraGovFetchPromise = fetch("/odata/v4/admin-portal/GovernanceHistory", {
                        cache: "no-cache",
                        headers: {
                            "Cache-Control": "no-cache",
                            "Pragma": "no-cache"
                        }
                    })
                        .then(r => r.json())
                        .catch(err => {
                            console.error("Error fetching GovernanceHistory in Approver:", err);
                            return null;
                        })
                        .finally(() => {
                            setTimeout(() => { window._kyraGovFetchPromise = null; }, 200);
                        });
                }

                const data = await window._kyraGovFetchPromise;
                if (window._kyraDecisionInFlight || (window._kyraDecisionMutationEpoch || 0) !== iStartEpoch) {
                    this._reloadAllRequests(oModel);
                    return;
                }

                if (data && data.value && data.value.length > 0) {
                    const rawList = Array.isArray(data.value) ? data.value : [];
                    const seenRawReqs = new Set();
                    const aRawData = rawList.filter(r => {
                        const sNum = (r.request_number || r.requestId || ("REQ-" + r.ID) || "").trim();
                        if (!sNum) return true;
                        if (seenRawReqs.has(sNum)) return false;
                        seenRawReqs.add(sNum);
                        return true;
                    });
                    let oDecidedMap = window._kyraDecidedRequestsMap || {};
                    try {
                        const sDecSaved = sessionStorage.getItem("kyra_decided_requests_map");
                        if (sDecSaved) oDecidedMap = Object.assign({}, JSON.parse(sDecSaved), oDecidedMap);
                    } catch(eDec) {}
                    if (oDecidedMap && Object.keys(oDecidedMap).length > 0) {
                        aRawData.forEach(r => {
                            const sNum = (r.request_number || r.requestId || r.id || "").trim();
                            const sBase = getBaseReqId(sNum);
                            const dec = oDecidedMap[sNum] || oDecidedMap[sNum.toUpperCase()] || (sBase ? (oDecidedMap[sBase] || oDecidedMap[sBase.toUpperCase()]) : null);
                            if (dec) {
                                const sDecStatus = (dec.status || "").toUpperCase();
                                if (dec.isCompliance || (dec.actorRole && dec.actorRole.toLowerCase().includes("compliance")) || isCompliance) {
                                    r.compliance_status = sDecStatus;
                                    r.compliance_decision_status = sDecStatus;
                                    r.status = sDecStatus.includes("REJECT") ? "REJECTED" : "PENDING_IAM_1";
                                    r.db_status = r.status;
                                } else {
                                    r.approver_status = sDecStatus;
                                    r.approver_decision_status = sDecStatus;
                                    const hasRowConf = r.has_conflict === true || !!(r.conflicting_role && r.conflicting_role.trim());
                                    r.status = sDecStatus.includes("REJECT") ? "REJECTED" : (hasRowConf ? "PENDING_COMPLIANCE" : "PENDING_IAM_1");
                                    r.db_status = r.status;
                                }
                            }
                        });
                    }
                    window._kyraCachedGovRequests = aRawData;
                    try {
                        sessionStorage.setItem("kyra_cached_gov_requests", JSON.stringify(aRawData));
                        localStorage.setItem("kyra_cached_gov_requests", JSON.stringify(aRawData));
                    } catch(e) {}
                    this._applyLoadedApproverData(oModel, aRawData, isCompliance);
                }
            } catch (err) {
                console.error("Error refreshing OData requests:", err);
            } finally {
                if (!bSilent) {
                    setTimeout(() => {
                        if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                            window.KyraLoader.hide();
                        }
                    }, 250);
                }
            
                console.error("Error refreshing OData requests:", err);
            }
        },

        onOpenDecisionBreakdownDialog(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();
            this._showDecisionSummarySlide(oData, true);
        },

        openDecisionBreakdownSummary(sTargetIdOrData) {
            const oModel = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
            if (!oModel) return;

            let oData = null;
            if (sTargetIdOrData && typeof sTargetIdOrData === "object" && Array.isArray(sTargetIdOrData.entitlements) && sTargetIdOrData.entitlements.length > 0) {
                oData = sTargetIdOrData;
            } else {
                const aProcessed = oModel.getProperty("/processedRequests") || [];
                const sTarget = (typeof sTargetIdOrData === "string" ? sTargetIdOrData : (sTargetIdOrData && (sTargetIdOrData.requestId || sTargetIdOrData.request_number || sTargetIdOrData.requestNumber || "")) || "").trim().toLowerCase();
                
                if (sTarget) {
                    oData = aProcessed.find(g => {
                        if (!g) return false;
                        if ((g.requestId || g.requestNumber || "").toLowerCase() === sTarget) return true;
                        if (g.entitlements && g.entitlements.some(e => (e.requestId || e.requestNumber || "").toLowerCase() === sTarget)) return true;
                        return false;
                    });
                }

                if (!oData && sTarget) {
                    const aHistory = oModel.getProperty("/requestHistory") || oModel.getProperty("/displayedHistoryRequests") || [];
                    oData = aHistory.find(g => {
                        if (!g) return false;
                        if ((g.requestId || g.requestNumber || "").toLowerCase() === sTarget) return true;
                        if (g.entitlements && g.entitlements.some(e => (e.requestId || e.requestNumber || "").toLowerCase() === sTarget)) return true;
                        return false;
                    });
                }

                if (!oData && sTargetIdOrData && typeof sTargetIdOrData === "object") {
                    oData = {
                        requestId: sTargetIdOrData.request_number || sTargetIdOrData.requestId || sTarget,
                        requesterId: (sTargetIdOrData.requester_username || sTargetIdOrData.requesterId || "emp018").toLowerCase(),
                        sector: sTargetIdOrData.business_sector || sTargetIdOrData.sector || "Information Technology & Security",
                        function: sTargetIdOrData.business_function || sTargetIdOrData.function || "Corporate Governance",
                        entitlements: [{
                            requestId: sTargetIdOrData.request_number || sTargetIdOrData.requestId || sTarget,
                            system: sTargetIdOrData.target_system || sTargetIdOrData.system || "SAP System",
                            roleName: sTargetIdOrData.role_name || sTargetIdOrData.roleName || "Corporate Role",
                            status: (sTargetIdOrData.approver_status || sTargetIdOrData.compliance_status || sTargetIdOrData.status || "Approved"),
                            statusState: ((sTargetIdOrData.approver_status || sTargetIdOrData.compliance_status || "").toUpperCase() === "REJECTED") ? "Error" : "Success",
                            statusIcon: ((sTargetIdOrData.approver_status || sTargetIdOrData.compliance_status || "").toUpperCase() === "REJECTED") ? "sap-icon://error" : "sap-icon://sys-enter-2",
                            grantedDate: sTargetIdOrData.created_at ? sTargetIdOrData.created_at.split("T")[0] : "",
                            expiryDate: sTargetIdOrData.access_duration || "Permanent"
                        }]
                    };
                }

                if (!oData && aProcessed.length > 0) {
                    oData = aProcessed[0];
                }
            }

            oModel.setProperty("/showApprovalHistory", true);
            if (oData && oData.isRevocation) {
                oModel.setProperty("/approverHistoryTab", "revokeRequests");
            } else {
                oModel.setProperty("/approverHistoryTab", "accessRequests");
            }
            this._updateDisplayedHistoryRequests();

            if (oData) {
                this._showDecisionSummarySlide(oData, true);
            }
        },

        _applySearchFilter(sQuery) {
            sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator"], (Filter, FilterOperator) => {
                const aFilters = [];
                if (sQuery && sQuery.trim()) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("requesterId", FilterOperator.Contains, sQuery),
                            new Filter("requestId", FilterOperator.Contains, sQuery),
                            new Filter("sector", FilterOperator.Contains, sQuery),
                            new Filter("businessSector", FilterOperator.Contains, sQuery),
                            new Filter("function", FilterOperator.Contains, sQuery),
                            new Filter("businessFunction", FilterOperator.Contains, sQuery),
                            new Filter("duration", FilterOperator.Contains, sQuery),
                            new Filter("persona", FilterOperator.Contains, sQuery),
                            new Filter("selectedPersona", FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    }));
                }

                ["approvalAccessTable", "approvalRevokeTable", "approvalHistoryTable"].forEach(sId => {
                    const oTable = this.byId(sId);
                    if (oTable) {
                        const oBinding = oTable.getBinding("items");
                        if (oBinding) {
                            oBinding.filter(aFilters);
                        }
                    }
                });
            });
        },

        onSearchApprovalTable(oEvent) {
            const sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            this._sCurrentSearchQuery = sQuery;
            this._applySearchFilter(sQuery);
        },

        async onExportApprovals() {
            const oModel = this.getView().getModel("accessModel") || (this.getOwnerComponent() && this.getOwnerComponent().getModel("accessModel"));
            const bHistory = oModel ? !!oModel.getProperty("/showApprovalHistory") : false;
            const sPendingTab = oModel ? (oModel.getProperty("/approverPendingTab") || "accessRequests") : "accessRequests";
            const sHistoryTab = oModel ? (oModel.getProperty("/approverHistoryTab") || "accessRequests") : "accessRequests";

            let sActiveTableId = "";
            let sSectionName = "";
            let sFilterBase = "";
            let aFallbackItems = [];

            if (!bHistory) {
                // Section 3: User requests
                if (sPendingTab === "revokeRequests") {
                    sActiveTableId = "approvalRevokeTable";
                    sSectionName = "User Requests — Revoke Queue";
                    sFilterBase = "Pending Revocation Requests";
                    aFallbackItems = oModel ? (oModel.getProperty("/pendingRevokeRequests") || []) : [];
                } else {
                    sActiveTableId = "approvalAccessTable";
                    sSectionName = "User Requests — Access Queue";
                    sFilterBase = "Pending Access Requests";
                    aFallbackItems = oModel ? (oModel.getProperty("/pendingAccessRequests") || []) : [];
                }
            } else {
                // Section 4: Processed Approval History Log
                sActiveTableId = "approvalHistoryTable";
                if (sHistoryTab === "revokeRequests") {
                    sSectionName = "Processed Approval History Log — Revoke Requests";
                    sFilterBase = "Processed Revocation Requests";
                    aFallbackItems = oModel ? (oModel.getProperty("/historyRevokeRequests") || oModel.getProperty("/processedRevokeRequests") || []) : [];
                } else {
                    sSectionName = "Processed Approval History Log — Access Requests";
                    sFilterBase = "Processed Access Requests";
                    aFallbackItems = oModel ? (oModel.getProperty("/historyAccessRequests") || oModel.getProperty("/processedAccessRequests") || []) : [];
                }
            }

            const oTable = this.byId(sActiveTableId);

            // Filter Type calculation
            const aFilterParts = [sFilterBase];
            if (this._sCurrentSearchQuery && this._sCurrentSearchQuery.trim()) {
                aFilterParts.push('Search: "' + this._sCurrentSearchQuery.trim() + '"');
            }
            if (this._lastApproverFilterLabel && this._lastApproverFilterLabel.trim()) {
                aFilterParts.push('Filter: ' + this._lastApproverFilterLabel.trim());
            }
            const sFilterType = aFilterParts.join(" | ");
            const sPrefix = bHistory ? "Kyra_Processed_History_" : "Kyra_User_Requests_";

            this._openExportDialog({
                title: "Export to Excel",
                subtitle: "Download the current filtered approval records as an Excel spreadsheet (.xlsx).",
                onConfirmDownload: async () => {
                    await this._executeAuditExcelExport({
                        oTable: oTable,
                        aFallbackItems: aFallbackItems,
                        sSectionName: sSectionName,
                        sFilterType: sFilterType,
                        sFilenamePrefix: sPrefix + (bHistory ? sHistoryTab : sPendingTab) + "_"
                    });
                }
            });
        },

        _ensureXlsxLibrary() {
            return new Promise((resolve, reject) => {
                if (window.XLSX && window.XLSX.utils && window.XLSX.writeFile) {
                    return resolve(window.XLSX);
                }

                const existingScript = document.querySelector("script[data-xlsx-lib='true']");
                if (existingScript) {
                    if (window.XLSX && window.XLSX.utils) return resolve(window.XLSX);
                    existingScript.addEventListener("load", () => resolve(window.XLSX));
                    existingScript.addEventListener("error", (e) => reject(e));
                    return;
                }

                const tryLoadScript = (sources, index = 0) => {
                    if (index >= sources.length) {
                        return reject(new Error("Unable to load Excel export library (XLSX)."));
                    }
                    const src = sources[index];
                    const script = document.createElement("script");
                    script.setAttribute("data-xlsx-lib", "true");
                    script.src = src;
                    script.onload = () => {
                        if (window.XLSX && window.XLSX.utils) {
                            resolve(window.XLSX);
                        } else {
                            tryLoadScript(sources, index + 1);
                        }
                    };
                    script.onerror = () => {
                        script.remove();
                        tryLoadScript(sources, index + 1);
                    };
                    document.head.appendChild(script);
                };

                const possibleSources = [
                    "lib/xlsx.full.min.js",
                    "./lib/xlsx.full.min.js",
                    "webapp/lib/xlsx.full.min.js",
                    "/lib/xlsx.full.min.js",
                    "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
                ];
                tryLoadScript(possibleSources, 0);
            });
        },

        async _executeAuditExcelExport(mParams) {
            const { oTable, aFallbackItems, sSectionName, sFilterType, sFilenamePrefix } = mParams;

            // 1. Retrieve displayed / filtered items from table binding
            let aDisplayedItems = [];
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    const aContexts = oBinding.getContexts ? oBinding.getContexts(0, oBinding.getLength ? oBinding.getLength() : 2500) : [];
                    if (aContexts && aContexts.length > 0) {
                        aDisplayedItems = aContexts.map(c => c && c.getObject ? c.getObject() : null).filter(Boolean);
                    }
                }
            }
            if ((!aDisplayedItems || aDisplayedItems.length === 0) && Array.isArray(aFallbackItems)) {
                aDisplayedItems = aFallbackItems;
            }

            if (!aDisplayedItems || aDisplayedItems.length === 0) {
                sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                    MessageToast.show("No records available to export for current filter.");
                });
                return;
            }

            // 2. Obtain complete raw database requests
            let aRawDb = window._kyraCachedGovRequests;
            if (!aRawDb || !Array.isArray(aRawDb) || aRawDb.length === 0) {
                try {
                    const sCached = sessionStorage.getItem("kyra_cached_gov_requests") || localStorage.getItem("kyra_cached_gov_requests");
                    if (sCached) aRawDb = JSON.parse(sCached);
                } catch(eCache) {}
            }
            if (!aRawDb || !Array.isArray(aRawDb) || aRawDb.length === 0) {
                try {
                    const res = await fetch("/odata/v4/admin-portal/GovernanceHistory", {
                        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
                    });
                    const data = await res.json();
                    if (data && data.value) {
                        aRawDb = data.value;
                        window._kyraCachedGovRequests = aRawDb;
                    }
                } catch(eFetch) {
                    console.warn("Failed fetching GovernanceHistory for audit export:", eFetch);
                }
            }
            if (!Array.isArray(aRawDb)) aRawDb = [];

            // Helper to clean strings and find raw db record
            const cleanStr = (s) => (s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
            const findRawDbRecord = (sReqId, sSys, sRole) => {
                const reqStr = (sReqId || "").trim();
                const sysStr = (sSys || "").trim();
                const roleClean = cleanStr(sRole);

                if (reqStr) {
                    const matchById = aRawDb.find(r => {
                        const rNum = String(r.request_number || r.id || r.ID || "").trim();
                        return rNum === reqStr || (rNum && reqStr && (rNum.toUpperCase() === reqStr.toUpperCase() || rNum.startsWith(reqStr + "-") || reqStr.startsWith(rNum + "-")));
                    });
                    if (matchById) return matchById;
                }

                if (sysStr && roleClean) {
                    const matchBySysRole = aRawDb.find(r => {
                        const rSys = (r.target_system || "").trim();
                        const rRole = cleanStr(r.role_name);
                        return rSys === sysStr && (rRole === roleClean || (rRole && roleClean && (rRole.includes(roleClean) || roleClean.includes(rRole))));
                    });
                    if (matchBySysRole) return matchBySysRole;
                }
                return null;
            };

            // 3. Map displayed items to complete 29 database columns
            const aExportRows = [];
            const seenKeys = new Set();

            aDisplayedItems.forEach(item => {
                if (!item) return;

                if (Array.isArray(item.entitlements) && item.entitlements.length > 0) {
                    item.entitlements.forEach(ent => {
                        const sEntReqId = ent.requestId || item.requestId || item.request_number || item.id || "";
                        const sEntSys = ent.system || item.system || item.target_system || "";
                        const sEntRole = ent.roleName || ent.role || item.roleName || "";
                        const rawDb = findRawDbRecord(sEntReqId, sEntSys, sEntRole);

                        const rowKey = (sEntReqId || (rawDb && rawDb.request_number) || "") + ":::" + (sEntSys || (rawDb && rawDb.target_system) || "") + ":::" + (sEntRole || (rawDb && rawDb.role_name) || "");
                        if (seenKeys.has(rowKey)) return;
                        seenKeys.add(rowKey);

                        aExportRows.push({
                            id: (rawDb && (rawDb.id || rawDb.ID)) || ent.requestId || item.requestId || "",
                            request_number: (rawDb && rawDb.request_number) || ent.requestId || item.requestId || item.request_number || "",
                            requester_username: (rawDb && rawDb.requester_username) || item.requesterUsername || item.requesterId || item.userId || "emp018",
                            requester_persona: (rawDb && rawDb.requester_persona) || item.requesterPersona || item.persona || "Requester",
                            business_sector: (rawDb && rawDb.business_sector) || item.businessSector || item.sector || "Information Technology & Security",
                            business_function: (rawDb && rawDb.business_function) || item.businessFunction || item.function || "Corporate Governance",
                            operating_region: (rawDb && rawDb.operating_region) || item.operatingRegion || item.region || "Global Enterprise (ALL)",
                            target_system: (rawDb && rawDb.target_system) || sEntSys,
                            service_topic: (rawDb && rawDb.service_topic) || ent.serviceTopic || ent.team || item.serviceTopic || "",
                            role_name: (rawDb && rawDb.role_name) || sEntRole,
                            selected_persona: (rawDb && rawDb.selected_persona) || ent.selectedPersona || ent.persona || item.selectedPersona || item.persona || "",
                            access_type: (rawDb && rawDb.access_type) || item.type || item.requestType || (item.isRevocation ? "Revocation" : "Addition"),
                            access_duration: (rawDb && rawDb.access_duration) || item.duration || item.accessDuration || "Permanent",
                            justification: (rawDb && rawDb.justification) || item.justification || "",
                            status: ent.status || (rawDb && rawDb.status) || item.status || "Pending",
                            db_status: (rawDb && rawDb.db_status) || (ent.status || item.status || "PENDING").toUpperCase(),
                            approver_status: (rawDb && rawDb.approver_status) || (item.approver_status || ""),
                            compliance_status: (rawDb && rawDb.compliance_status) || (item.compliance_status || ""),
                            iam_approver_1_status: (rawDb && rawDb.iam_approver_1_status) || (item.iam_approver_1_status || ""),
                            iam_approver_2_status: (rawDb && rawDb.iam_approver_2_status) || (item.iam_approver_2_status || ""),
                            approver_comment: (rawDb && rawDb.approver_comment) || item.approverRemark || item.approver_comment || "",
                            reviewer_comment: (rawDb && rawDb.reviewer_comment) || ent.comment || item.reviewer_comment || "",
                            iam_approver_1_comment: (rawDb && rawDb.iam_approver_1_comment) || item.iam_approver_1_comment || "",
                            iam_approver_2_comment: (rawDb && rawDb.iam_approver_2_comment) || item.iam_approver_2_comment || "",
                            has_conflict: rawDb ? (rawDb.has_conflict === true ? "true" : "false") : (item.has_conflict === true ? "true" : "false"),
                            conflicting_role: (rawDb && rawDb.conflicting_role) || item.conflicting_role || "",
                            conflict_reason: (rawDb && rawDb.conflict_reason) || item.conflict_reason || "",
                            created_at: (rawDb && rawDb.created_at) || item.createdAtRaw || item.submissionDate || "",
                            updated_at: (rawDb && rawDb.updated_at) || item.updatedAtRaw || item.decisionDate || ""
                        });
                    });
                } else {
                    const sReqId = item.requestId || item.request_number || item.id || "";
                    const sSys = item.system || item.target_system || "";
                    const sRole = item.roleName || item.roleTitle || item.teamRole || item.role || "";
                    const rawDb = findRawDbRecord(sReqId, sSys, sRole);

                    const rowKey = (sReqId || (rawDb && rawDb.request_number) || "") + ":::" + (sSys || (rawDb && rawDb.target_system) || "") + ":::" + (sRole || (rawDb && rawDb.role_name) || "");
                    if (seenKeys.has(rowKey)) return;
                    seenKeys.add(rowKey);

                    aExportRows.push({
                        id: (rawDb && (rawDb.id || rawDb.ID)) || sReqId,
                        request_number: (rawDb && rawDb.request_number) || sReqId,
                        requester_username: (rawDb && rawDb.requester_username) || item.requesterUsername || item.requesterId || item.userId || "emp018",
                        requester_persona: (rawDb && rawDb.requester_persona) || item.requesterPersona || item.persona || "Requester",
                        business_sector: (rawDb && rawDb.business_sector) || item.businessSector || item.sector || "Information Technology & Security",
                        business_function: (rawDb && rawDb.business_function) || item.businessFunction || item.function || "Corporate Governance",
                        operating_region: (rawDb && rawDb.operating_region) || item.operatingRegion || item.region || "Global Enterprise (ALL)",
                        target_system: (rawDb && rawDb.target_system) || sSys,
                        service_topic: (rawDb && rawDb.service_topic) || item.serviceTopic || item.services || item.service || "",
                        role_name: (rawDb && rawDb.role_name) || sRole,
                        selected_persona: (rawDb && rawDb.selected_persona) || item.selectedPersona || item.persona || "",
                        access_type: (rawDb && rawDb.access_type) || item.type || item.requestType || (item.isRevocation ? "Revocation" : "Addition"),
                        access_duration: (rawDb && rawDb.access_duration) || item.duration || item.accessDuration || item.expiryDate || "Permanent",
                        justification: (rawDb && rawDb.justification) || item.justification || "",
                        status: item.status || (rawDb && rawDb.status) || "Active",
                        db_status: (rawDb && rawDb.db_status) || ((rawDb && rawDb.status) || item.status || "ACTIVE").toUpperCase(),
                        approver_status: (rawDb && rawDb.approver_status) || (item.approver_status || ""),
                        compliance_status: (rawDb && rawDb.compliance_status) || (item.compliance_status || ""),
                        iam_approver_1_status: (rawDb && rawDb.iam_approver_1_status) || (item.iam_approver_1_status || ""),
                        iam_approver_2_status: (rawDb && rawDb.iam_approver_2_status) || (item.iam_approver_2_status || ""),
                        approver_comment: (rawDb && rawDb.approver_comment) || item.approverRemark || item.approver_comment || "",
                        reviewer_comment: (rawDb && rawDb.reviewer_comment) || item.reviewer_comment || item.comment || "",
                        iam_approver_1_comment: (rawDb && rawDb.iam_approver_1_comment) || item.iam_approver_1_comment || "",
                        iam_approver_2_comment: (rawDb && rawDb.iam_approver_2_comment) || item.iam_approver_2_comment || "",
                        has_conflict: rawDb ? (rawDb.has_conflict === true ? "true" : "false") : (item.has_conflict === true ? "true" : "false"),
                        conflicting_role: (rawDb && rawDb.conflicting_role) || item.conflicting_role || "",
                        conflict_reason: (rawDb && rawDb.conflict_reason) || item.conflict_reason || "",
                        created_at: (rawDb && rawDb.created_at) || item.createdAtRaw || item.submissionDate || item.grantedDate || "",
                        updated_at: (rawDb && rawDb.updated_at) || item.updatedAtRaw || item.decisionDate || item.grantedDate || ""
                    });
                }
            });

            if (aExportRows.length === 0) {
                sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                    MessageToast.show("No records available to export for current filter.");
                });
                return;
            }

            // 4. Construct Genuine OpenXML Excel Spreadsheet (.xlsx) using SheetJS
            const DB_COLUMNS = [
                { key: "id", label: "ID" },
                { key: "request_number", label: "REQUEST NUMBER" },
                { key: "requester_username", label: "REQUESTER USERNAME" },
                { key: "requester_persona", label: "REQUESTER PERSONA" },
                { key: "business_sector", label: "BUSINESS SECTOR" },
                { key: "business_function", label: "BUSINESS FUNCTION" },
                { key: "operating_region", label: "OPERATING REGION" },
                { key: "target_system", label: "TARGET SYSTEM" },
                { key: "service_topic", label: "SERVICE TOPIC" },
                { key: "role_name", label: "ROLE NAME" },
                { key: "selected_persona", label: "SELECTED PERSONA" },
                { key: "access_type", label: "ACCESS TYPE" },
                { key: "access_duration", label: "ACCESS DURATION" },
                { key: "justification", label: "JUSTIFICATION" },
                { key: "status", label: "STATUS" },
                { key: "db_status", label: "DB STATUS" },
                { key: "approver_status", label: "APPROVER STATUS" },
                { key: "compliance_status", label: "COMPLIANCE STATUS" },
                { key: "iam_approver_1_status", label: "IAM APPROVER 1 STATUS" },
                { key: "iam_approver_2_status", label: "IAM APPROVER 2 STATUS" },
                { key: "approver_comment", label: "APPROVER COMMENT" },
                { key: "reviewer_comment", label: "REVIEWER COMMENT" },
                { key: "iam_approver_1_comment", label: "IAM APPROVER 1 COMMENT" },
                { key: "iam_approver_2_comment", label: "IAM APPROVER 2 COMMENT" },
                { key: "has_conflict", label: "HAS CONFLICT" },
                { key: "conflicting_role", label: "CONFLICTING ROLE" },
                { key: "conflict_reason", label: "CONFLICT REASON" },
                { key: "created_at", label: "CREATED AT" },
                { key: "updated_at", label: "UPDATED AT" }
            ];

            try {
                const XLSX = await this._ensureXlsxLibrary();

                const oModel = (this.getView() && (this.getView().getModel("accessModel") || this.getView().getModel("approverModel") || this.getView().getModel())) || null;
                const sDownloadUserId = (oModel && (oModel.getProperty("/activeUser") || oModel.getProperty("/userId"))) ||
                                        sessionStorage.getItem("kyra_active_user") ||
                                        sessionStorage.getItem("kyra_user_id") ||
                                        sessionStorage.getItem("kyra_active_username") ||
                                        localStorage.getItem("kyra_active_user") ||
                                        "emp001";

                const sDownloadUserRole = (oModel && (oModel.getProperty("/activeRole") || oModel.getProperty("/selectedPersona") || oModel.getProperty("/activePersona") || oModel.getProperty("/persona"))) ||
                                          sessionStorage.getItem("kyra_active_role") ||
                                          sessionStorage.getItem("kyra_active_persona") ||
                                          localStorage.getItem("kyra_active_role") ||
                                          "Requester";

                const sDownloadUserName = (oModel && (oModel.getProperty("/activeUserName") || oModel.getProperty("/userName") || oModel.getProperty("/fullName"))) ||
                                          sessionStorage.getItem("kyra_active_fullname") ||
                                          sessionStorage.getItem("kyra_user_fullname") ||
                                          sessionStorage.getItem("kyra_active_username") ||
                                          "";

                let sDownloadedByDisplay = sDownloadUserId;
                if (sDownloadUserName && sDownloadUserName.trim().toLowerCase() !== sDownloadUserId.trim().toLowerCase()) {
                    sDownloadedByDisplay = sDownloadUserName.trim() + " (" + sDownloadUserId + ") — " + sDownloadUserRole;
                } else {
                    sDownloadedByDisplay = sDownloadUserId + " (" + sDownloadUserRole + ")";
                }

                const aAoa = [
                    ["KYRA ENTERPRISE GOVERNANCE AUDIT REPORT"],
                    ["Report Section:", sSectionName || "Audit Log"],
                    ["Downloaded By (User):", sDownloadedByDisplay],
                    ["User ID:", sDownloadUserId],
                    ["User Role / Persona:", sDownloadUserRole],
                    ["Filter Type:", sFilterType || "All Records (Unfiltered)"],
                    ["Export Timestamp:", new Date().toLocaleString()],
                    ["Total Records Exported:", aExportRows.length],
                    [], // Blank separator row
                    DB_COLUMNS.map(c => c.label)
                ];

                aExportRows.forEach(row => {
                    aAoa.push(DB_COLUMNS.map(c => {
                        const val = row[c.key];
                        return (val === null || val === undefined) ? "" : String(val);
                    }));
                });

                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(aAoa);
                ws["!cols"] = DB_COLUMNS.map(c => ({ wch: Math.max(c.label.length + 3, 16) }));
                if (ws["!cols"] && ws["!cols"][0]) ws["!cols"][0].wch = Math.max(ws["!cols"][0].wch, 26);
                if (ws["!cols"] && ws["!cols"][1]) ws["!cols"][1].wch = Math.max(ws["!cols"][1].wch, 35);
                XLSX.utils.book_append_sheet(wb, ws, "Audit Log");

                const sFilename = (sFilenamePrefix || "Kyra_Audit_Export_") + new Date().toISOString().slice(0, 10) + ".xlsx";
                XLSX.writeFile(wb, sFilename, { bookType: "xlsx", compression: true });

                sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                    MessageToast.show("Audit log exported to Excel (" + aExportRows.length + " records).");
                });
            } catch (err) {
                console.error("Excel export error:", err);
                sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
                    MessageBox.error("Failed to generate Excel file: " + (err.message || err));
                });
            }
        },

        _openExportDialog(oConfig) {
            sap.ui.require([
                "sap/m/Dialog",
                "sap/m/VBox",
                "sap/m/HBox",
                "sap/m/Avatar",
                "sap/m/Title",
                "sap/m/Text",
                "sap/m/Button",
                "sap/m/MessageToast"
            ], (Dialog, VBox, HBox, Avatar, Title, Text, Button, MessageToast) => {
                let oDialog;
                // Notification Modal Header with Close button
                const oTopBar = new HBox({
                    justifyContent: "End",
                    items: [
                        new Button({
                            icon: "sap-icon://decline",
                            type: "Transparent",
                            tooltip: "Close",
                            press: () => oDialog.close()
                        }).addStyleClass("kyraExportNotifCloseBtn")
                    ]
                }).addStyleClass("kyraExportNotifTopBar");

                // Excel Icon Circle
                const oIconCircle = new HBox({
                    justifyContent: "Center",
                    items: [
                        new Avatar({
                            src: "sap-icon://excel-attachment",
                            displaySize: "M"
                        })
                    ]
                }).addStyleClass("kyraExportNotifIconCircle");

                // Title & Subtitle
                const oTitle = new Title({
                    text: oConfig.title || "Export to Excel",
                    level: "H3",
                    textAlign: "Center",
                    width: "100%"
                }).addStyleClass("kyraExportNotifTitle");

                const oDesc = new Text({
                    text: oConfig.subtitle || "Download the active filtered records as an Excel spreadsheet (.xlsx).",
                    textAlign: "Center",
                    width: "100%"
                }).addStyleClass("kyraExportNotifDesc");

                // File info card (Excel .xlsx only)
                const oFileCard = new HBox({
                    alignItems: "Center",
                    items: [
                        new Text({ text: ".XLSX" }).addStyleClass("kyraExportNotifFormatPill"),
                        new VBox({
                            items: [
                                new Title({ text: "Excel Spreadsheet (.xlsx)", level: "H5" }).addStyleClass("kyraExportNotifCardTitle"),
                                new Text({ text: "Formatted tabular workbook with audit columns" }).addStyleClass("kyraExportNotifCardSubtitle")
                            ]
                        }).addStyleClass("kyraExportNotifCardInfo")
                    ]
                }).addStyleClass("kyraExportNotifFileCard");

                // Download Handler
                const handleDownload = async () => {
                    oDialog.close();
                    if (typeof oConfig.onConfirmDownload === "function") {
                        await oConfig.onConfirmDownload();
                    } else if (typeof oConfig.getData === "function") {
                        const aData = oConfig.getData();
                        if (!aData || aData.length === 0) {
                            MessageToast.show("No records available to export for current filter.");
                            return;
                        }
                        try {
                            const XLSX = await this._ensureXlsxLibrary();
                            const ws = XLSX.utils.json_to_sheet(aData);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                            const sFilename = (oConfig.filename || "Kyra_Approvals_Export") + ".xlsx";
                            XLSX.writeFile(wb, sFilename, { bookType: "xlsx", compression: true });
                            MessageToast.show("Excel report downloaded successfully!");
                        } catch (eXlsx) {
                            console.error("Excel fallback error:", eXlsx);
                            MessageToast.show("Export failed: " + (eXlsx.message || eXlsx));
                        }
                    }
                };

                // ONLY 2 BUTTONS: Cancel & Download
                const oFooter = new HBox({
                    justifyContent: "End",
                    alignItems: "Center",
                    items: [
                        new Button({
                            text: "Cancel",
                            press: () => oDialog.close()
                        }).addStyleClass("kyraExportNotifCancelBtn"),
                        new Button({
                            text: "Download",
                            icon: "sap-icon://download",
                            type: "Emphasized",
                            press: handleDownload
                        }).addStyleClass("kyraExportNotifDownloadBtn")
                    ]
                }).addStyleClass("kyraExportNotifFooter");

                // Assemble Dialog
                oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "420px",
                    verticalScrolling: false,
                    horizontalScrolling: false,
                    resizable: false,
                    content: [
                        new VBox({
                            alignItems: "Stretch",
                            items: [
                                oTopBar,
                                oIconCircle,
                                oTitle,
                                oDesc,
                                oFileCard,
                                oFooter
                            ]
                        }).addStyleClass("sapUiNoMargin")
                    ],
                    afterClose: () => oDialog.destroy()
                }).addStyleClass("kyraModernExportNotificationDialog");

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onFilterApprovalsDialog() {
            const oModel = this.getView().getModel("accessModel");
            const bIsHistoryTab = oModel ? !!oModel.getProperty("/showApprovalHistory") : false;

            sap.ui.require([
                "sap/m/Dialog",
                "sap/m/DatePicker",
                "sap/m/Label",
                "sap/m/VBox",
                "sap/m/HBox",
                "sap/m/Title",
                "sap/m/Text",
                "sap/m/Button",
                "sap/m/Avatar",
                "sap/ui/model/Filter",
                "sap/ui/model/FilterOperator",
                "sap/m/MessageToast"
            ], (Dialog, DatePicker, Label, VBox, HBox, Title, Text, Button, Avatar, Filter, FilterOperator, MessageToast) => {
                
                const aSystemOptions = [
                    { key: "all", title: "All Systems", keyword: "", icon: "sap-icon://world", colorClass: "kyraSysIcon_teal" },
                    { key: "btp", title: "SAP BTP Cloud Platform", keyword: "BTP", icon: "sap-icon://cloud", colorClass: "kyraSysIcon_teal" },
                    { key: "s4hana", title: "SAP S/4HANA Enterprise", keyword: "S/4HANA", icon: "sap-icon://building", colorClass: "kyraSysIcon_green" },
                    { key: "kyra", title: "KYRA Central Governance", keyword: "KYRA", icon: "sap-icon://shield", colorClass: "kyraSysIcon_amber" },
                    { key: "iam", title: "Active Directory / IAM", keyword: "Active Directory", icon: "sap-icon://group", colorClass: "kyraSysIcon_slate" },
                    { key: "sf", title: "SAP SuccessFactors", keyword: "SuccessFactors", icon: "sap-icon://bar-chart", colorClass: "kyraSysIcon_cyan" },
                    { key: "ariba", title: "SAP Ariba Supply Network", keyword: "Ariba", icon: "sap-icon://connected-dots", colorClass: "kyraSysIcon_darkteal" }
                ];

                if (bIsHistoryTab) {
                    aSystemOptions.push({
                        key: "custom_date",
                        title: "Custom Date Range",
                        keyword: "",
                        icon: "sap-icon://date-time",
                        colorClass: "kyraSysIcon_blue"
                    });
                }

                // Multi-select state
                const oSystemSelection = this._oAppliedSystemSelection || {
                    all: true,
                    btp: false,
                    s4hana: false,
                    kyra: false,
                    iam: false,
                    sf: false,
                    ariba: false,
                    custom_date: false
                };

                const oStartDatePicker = new DatePicker({
                    placeholder: "dd-MM-yyyy",
                    displayFormat: "dd-MM-yyyy",
                    valueFormat: "yyyy-MM-dd",
                    width: "100%"
                }).addStyleClass("kyraHistDatePicker");

                const oEndDatePicker = new DatePicker({
                    placeholder: "dd-MM-yyyy",
                    displayFormat: "dd-MM-yyyy",
                    valueFormat: "yyyy-MM-dd",
                    width: "100%"
                }).addStyleClass("kyraHistDatePicker");

                const oCustomDateSection = new VBox({
                    visible: false,
                    items: [
                        new HBox({
                            justifyContent: "SpaceBetween",
                            gap: "14px",
                            items: [
                                new VBox({
                                    width: "48%",
                                    items: [
                                        new Label({ text: "Start Date", required: true }).addStyleClass("kyraHistFieldLabel"),
                                        oStartDatePicker
                                    ]
                                }),
                                new VBox({
                                    width: "48%",
                                    items: [
                                        new Label({ text: "End Date", required: true }).addStyleClass("kyraHistFieldLabel"),
                                        oEndDatePicker
                                    ]
                                })
                            ]
                        })
                    ]
                }).addStyleClass("kyraHistCustomDateWrapper sapUiSmallMarginTop");

                const aRowItems = [];

                const updateSelectionUI = () => {
                    aRowItems.forEach(item => {
                        const bIsSelected = !!oSystemSelection[item.data.key];
                        if (bIsSelected) {
                            item.container.addStyleClass("kyraSysFilterRowSelected");
                        } else {
                            item.container.removeStyleClass("kyraSysFilterRowSelected");
                        }
                    });
                    if (bIsHistoryTab) {
                        oCustomDateSection.setVisible(!!oSystemSelection.custom_date);
                    }
                };

                const toggleSystemKey = (sKey) => {
                    if (sKey === "all") {
                        oSystemSelection.all = true;
                        aSystemOptions.forEach(opt => {
                            if (opt.key !== "all" && opt.key !== "custom_date") oSystemSelection[opt.key] = false;
                        });
                    } else if (sKey === "custom_date") {
                        oSystemSelection.custom_date = !oSystemSelection.custom_date;
                    } else {
                        oSystemSelection[sKey] = !oSystemSelection[sKey];
                        oSystemSelection.all = false;

                        const bAnyChecked = aSystemOptions.some(opt => opt.key !== "all" && opt.key !== "custom_date" && oSystemSelection[opt.key]);
                        if (!bAnyChecked) {
                            oSystemSelection.all = true;
                        }
                    }
                    updateSelectionUI();
                };

                const applyFilter = () => {
                    this._oAppliedSystemSelection = Object.assign({}, oSystemSelection);

                    const aSelectedKeywords = [];
                    const aSelectedTitles = [];

                    aSystemOptions.forEach(opt => {
                        if (opt.key !== "all" && opt.key !== "custom_date" && oSystemSelection[opt.key]) {
                            aSelectedKeywords.push(opt.keyword);
                            aSelectedTitles.push(opt.title);
                        }
                    });

                    let oSystemFilter = null;
                    if (aSelectedKeywords.length > 0) {
                        oSystemFilter = new Filter({
                            path: "",
                            test: (oRow) => {
                                if (!oRow) return false;
                                return aSelectedKeywords.some(sKeyword => {
                                    const sLowerKeyword = sKeyword.toLowerCase();
                                    
                                    // Check request-level target system
                                    const sSys = (oRow.system || "").toLowerCase();
                                    if (sSys.includes(sLowerKeyword)) return true;

                                    // Check entitlements
                                    if (Array.isArray(oRow.entitlements)) {
                                        return oRow.entitlements.some(e => {
                                            const sEntSys = (e.system || "").toLowerCase();
                                            const sEntRole = (e.roleName || "").toLowerCase();
                                            return sEntSys.includes(sLowerKeyword) || sEntRole.includes(sLowerKeyword);
                                        });
                                    }
                                    return false;
                                });
                            }
                        });
                    }

                    let oDateFilter = null;
                    if (bIsHistoryTab && oSystemSelection.custom_date) {
                        const dStart = oStartDatePicker.getDateValue();
                        const dEnd = oEndDatePicker.getDateValue() || dStart;
                        if (dStart) {
                            const dFrom = new Date(dStart);
                            dFrom.setHours(0, 0, 0, 0);
                            const dTo = new Date(dEnd);
                            dTo.setHours(23, 59, 59, 999);

                            oDateFilter = new Filter({
                                path: "",
                                test: (oRow) => {
                                    if (!oRow) return false;
                                    const sValue = oRow.decisionDate || oRow.submissionDate;
                                    if (!sValue) return false;
                                    const dItemDate = new Date(sValue);
                                    return !isNaN(dItemDate.getTime()) && dItemDate >= dFrom && dItemDate <= dTo;
                                }
                            });
                            aSelectedTitles.push(dStart.toLocaleDateString() + " - " + dEnd.toLocaleDateString());
                        }
                    }

                    const aFinalFilters = [];
                    if (oSystemFilter && oDateFilter) {
                        aFinalFilters.push(new Filter({
                            filters: [oSystemFilter, oDateFilter],
                            and: true
                        }));
                    } else if (oSystemFilter) {
                        aFinalFilters.push(oSystemFilter);
                    } else if (oDateFilter) {
                        aFinalFilters.push(oDateFilter);
                    }

                    ["approvalAccessTable", "approvalRevokeTable", "approvalHistoryTable"].forEach(sId => {
                        const oTable = this.byId(sId);
                        if (oTable) {
                            const oBinding = oTable.getBinding("items");
                            if (oBinding) oBinding.filter(aFinalFilters);
                        }
                    });
                    const sSummary = aSelectedTitles.join(", ");
                    this._lastApproverFilterLabel = sSummary;
                    MessageToast.show(sSummary ? "Filtered by: " + sSummary : "Showing all requests.");
                };

                // Build Row Controls: Icon -> System Name -> Multi-select Checkbox
                aSystemOptions.forEach(opt => {
                    const oCheck = new sap.ui.core.HTML({
                        content: '<div class="kyraCheckboxSquare"><span class="kyraCheckMark">✓</span></div>'
                    });

                    const oIconAvatar = new Avatar({
                        src: opt.icon,
                        displaySize: "XS"
                    }).addStyleClass("kyraSysIconAvatar " + opt.colorClass);

                    const oTitleText = new Text({
                        text: opt.title
                    }).addStyleClass("kyraSysRowTitle sapUiSmallMarginBegin");

                    const oLeftBox = new HBox({
                        alignItems: "Center",
                        items: [oIconAvatar, oTitleText]
                    }).addStyleClass("kyraSysRowLeft");

                    const oRowContainer = new HBox({
                        justifyContent: "SpaceBetween",
                        alignItems: "Center",
                        items: [oLeftBox, oCheck]
                    }).addStyleClass("kyraSysFilterRow");

                    if (oSystemSelection[opt.key]) {
                        oRowContainer.addStyleClass("kyraSysFilterRowSelected");
                    }

                    oRowContainer.attachBrowserEvent("click", () => {
                        toggleSystemKey(opt.key);
                    });

                    aRowItems.push({
                        data: opt,
                        container: oRowContainer
                    });
                });

                const oListContainer = new VBox({
                    items: aRowItems.map(item => item.container)
                }).addStyleClass("kyraSysFilterList");

                // Header
                const oHeader = new HBox({
                    justifyContent: "SpaceBetween",
                    alignItems: "Center",
                    items: [
                        new HBox({
                            alignItems: "Center",
                            items: [
                                new Avatar({
                                    src: bIsHistoryTab ? "sap-icon://history" : "sap-icon://filter",
                                    displaySize: "S"
                                }).addStyleClass("kyraSysFilterAvatar"),
                                new VBox({
                                    items: [
                                        new Title({ text: bIsHistoryTab ? "Filter History & Systems" : "Filter by System", level: "H4" }).addStyleClass("kyraSysFilterTitle"),
                                        new Text({ text: bIsHistoryTab ? "Select systems or custom date range to filter history" : "Select one or more systems to filter the results" }).addStyleClass("kyraSysFilterSubtitle")
                                    ]
                                }).addStyleClass("sapUiSmallMarginBegin")
                            ]
                        }),
                        new Button({
                            icon: "sap-icon://decline",
                            type: "Transparent",
                            press: () => oDialog.close(),
                            tooltip: "Close"
                        }).addStyleClass("kyraSysFilterCloseBtn")
                    ]
                }).addStyleClass("kyraSysFilterHeader");

                // Footer
                const oFooter = new HBox({
                    justifyContent: "SpaceBetween",
                    alignItems: "Center",
                    items: [
                        new Button({
                            text: "Reset",
                            icon: "sap-icon://refresh",
                            type: "Transparent",
                            press: () => {
                                toggleSystemKey("all");
                                oSystemSelection.custom_date = false;
                                oStartDatePicker.setDateValue(null);
                                oEndDatePicker.setDateValue(null);
                                updateSelectionUI();
                            }
                        }).addStyleClass("kyraSysResetBtn"),
                        new HBox({
                            alignItems: "Center",
                            items: [
                                new Button({
                                    text: "Cancel",
                                    press: () => oDialog.close()
                                }).addStyleClass("kyraSysCancelBtn sapUiTinyMarginEnd"),
                                new Button({
                                    text: "Apply Filter",
                                    type: "Emphasized",
                                    press: () => {
                                        applyFilter();
                                        oDialog.close();
                                    }
                                }).addStyleClass("kyraSysApplyBtn")
                            ]
                        }).addStyleClass("kyraSysFooterRight")
                    ]
                }).addStyleClass("kyraSysFilterFooter");

                const aDialogContent = [oHeader, oListContainer];
                if (bIsHistoryTab) {
                    aDialogContent.push(oCustomDateSection);
                }
                aDialogContent.push(oFooter);

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    content: [
                        new VBox({
                            items: aDialogContent
                        })
                    ],
                    afterClose: () => oDialog.destroy()
                }).addStyleClass("kyraSystemFilterDialog");

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onCancelRequestSummaryView() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) {
                return;
            }
            const oData = oModel.getProperty("/selectedRequest");

            MessageBox.confirm("Clicking Cancel will REJECT ALL entitlements for User Id " + oData.requestId + ". Do you wish to cancel and reject all?", {
                title: "Cancel & Reject Request",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        const aRejectedEntitlements = (oData.entitlements || []).map(e => ({
                            system: e.system,
                            roleName: e.roleName,
                            team: e.team,
                            grantedDate: e.grantedDate,
                            expiryDate: e.expiryDate,
                            status: "Rejected",
                            statusState: "Error",
                            statusIcon: "sap-icon://error"
                        }));

                        this._executeFinalSubmission(oData, "Rejected", "Error", [], aRejectedEntitlements);
                    }
                }
            });
        }
    });
});
