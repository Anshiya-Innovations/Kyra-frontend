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
                const sRequesterId = oRequest.requesterId || "Dev001";
                const aEntList = [];

                if (oRequest.entitlements && oRequest.entitlements.length > 0) {
                    oRequest.entitlements.forEach(ent => {
                        const sInitStatus = (ent.status === "Approved" || ent.status === "Rejected") ? ent.status : "Pending";
                        const sInitState = sInitStatus === "Approved" ? "Success" : (sInitStatus === "Rejected" ? "Error" : "Warning");
                        const sInitIcon = sInitStatus === "Approved" ? "sap-icon://sys-enter-2" : (sInitStatus === "Rejected" ? "sap-icon://error" : "sap-icon://pending");

                        const sApproverRemark = ent.approverRemark || ent.managerRemark || ent.comment || oRequest.approverRemark || oRequest.managerRemark || oRequest.comments || (ent.status === "Approved" ? "Approved during standard review cycle" : "Verified business requirement and approved");

                        aEntList.push({
                            requestId: ent.requestId || oRequest.requestId,
                            system: ent.system || oRequest.system || "SAP System",
                            roleName: ent.roleName || oRequest.roleName || "System Entitlement",
                            team: ent.team || oRequest.function || "Governance",
                            selectedPersona: ent.selectedPersona || oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                            grantedDate: ent.grantedDate || oRequest.submissionDate || new Date().toISOString().split("T")[0],
                            expiryDate: ent.expiryDate || oRequest.duration || "Permanent",
                            status: sInitStatus,
                            statusState: sInitState,
                            statusIcon: sInitIcon,
                            approverRemark: sApproverRemark,
                            comment: ""
                        });
                    });
                } else {
                    const sInitStatus = (oRequest.status === "Approved" || oRequest.status === "Rejected") ? oRequest.status : "Pending";
                    const sInitState = sInitStatus === "Approved" ? "Success" : (sInitStatus === "Rejected" ? "Error" : "Warning");
                    const sInitIcon = sInitStatus === "Approved" ? "sap-icon://sys-enter-2" : (sInitStatus === "Rejected" ? "sap-icon://error" : "sap-icon://pending");
                    const sApproverRemark = oRequest.approverRemark || oRequest.managerRemark || oRequest.comments || (oRequest.status === "Approved" ? "Approved during standard review cycle" : "Verified business requirement and approved");

                    aEntList.push({
                        requestId: oRequest.requestId,
                        system: oRequest.system || "SAP System",
                        roleName: oRequest.roleName || oRequest.serviceAndRole || "System Role",
                        team: oRequest.function || "Governance",
                        selectedPersona: oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                        grantedDate: oRequest.submissionDate || new Date().toISOString().split("T")[0],
                        expiryDate: oRequest.duration || "Permanent",
                        status: sInitStatus,
                        statusState: sInitState,
                        statusIcon: sInitIcon,
                        approverRemark: sApproverRemark,
                        comment: ""
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
                oModel.setProperty("/approverSodTab", 1);
            } else {
                MessageBox.error("Request ID " + sReqId + " not found in the database access records.");
            }
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

                oModel.setProperty(sPath + "/status", "Approved");
                oModel.setProperty(sPath + "/statusState", "Success");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://sys-enter-2");

                MessageToast.show("Approved: " + (oEntitlement.roleName || oEntitlement.system || "Entitlement"));
            }
        },

        onRejectEntitlement(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            const oModel = this.getView().getModel("accessModel");

            if (oContext && oModel) {
                const sPath = oContext.getPath();
                const oEntitlement = oContext.getObject();

                oModel.setProperty(sPath + "/status", "Rejected");
                oModel.setProperty(sPath + "/statusState", "Error");
                oModel.setProperty(sPath + "/statusIcon", "sap-icon://error");

                MessageToast.show("Rejected: " + (oEntitlement.roleName || oEntitlement.system || "Entitlement"));
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

            const aApprovedItems = aEntitlements.filter(e => e.status === "Approved");
            const aRejectedItems = aEntitlements.filter(e => e.status === "Rejected");
            const aPendingItems = aEntitlements.filter(e => e.status !== "Approved" && e.status !== "Rejected");

            const aFinalApproved = aApprovedItems.concat(aPendingItems);

            const sOverallStatus = aRejectedItems.length === 0 ? "Approved" : (aFinalApproved.length === 0 ? "Rejected" : "Partially Approved");
            const sOverallState = aRejectedItems.length === 0 ? "success" : (aFinalApproved.length === 0 ? "error" : "info");

            let sBodyHtml = `
                <div style="font-family: inherit; color: #0F172A;">
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                        <div>
                            <div style="font-weight: 800; font-size: 15px; color: #0F172A;">Requester (${oData.requesterId || 'Dev001'})</div>
                            <div style="font-size: 12.5px; color: #64748B; margin-top: 3px;">
                                Request ID: <strong style="color: #1E293B;">${oData.requestId}</strong> • Sector: <span style="color: #475569;">${oData.sector || 'Enterprise Governance'}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #64748B; display: block; margin-bottom: 3px;">Decision Result</span>
                            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; border-radius: 14px; font-weight: 700; font-size: 12px; ${sOverallStatus === 'Approved' ? 'background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC;' : (sOverallStatus === 'Rejected' ? 'background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5;' : 'background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D;')}">
                                ${sOverallStatus === 'Approved' ? '✔ Approved' : (sOverallStatus === 'Rejected' ? '✕ Rejected' : '⚠ Partially Approved')}
                            </span>
                        </div>
                    </div>
            `;

            if (aFinalApproved.length > 0) {
                sBodyHtml += `
                    <div style="color: #15803D; font-weight: 800; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; margin: 14px 0 8px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>Approved System Entitlements</span>
                        <span style="background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">${aFinalApproved.length} Item(s)</span>
                    </div>
                    <div class="kyra-dialog-list" style="max-height: 260px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px;">
                        ${aFinalApproved.map(i => {
                            const sCleanRole = (i.roleTitle || i.roleName || 'System Entitlement').replace(/\s*\([^)]*\)/g, "");
                            return `
                            <div style="border: 1px solid #BBF7D0; background: #F0FDF4; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(22,163,74,0.06);">
                                <div style="flex: 1; min-width: 0; padding-right: 12px;">
                                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
                                        <span style="font-weight: 700; font-size: 12px; color: #15803D;">${i.requestId || oData.requestId}</span>
                                        <span style="background: #FFFFFF; border: 1px solid #86EFAC; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #166534;">${i.system}</span>
                                    </div>
                                    <div style="font-size: 13.5px; font-weight: 700; color: #0F172A; line-height: 1.35; margin: 3px 0 2px 0;">
                                        ${sCleanRole} <span style="font-weight: 500; font-size: 12px; color: #64748B;">(${i.team || oData.function || 'Governance'})</span>
                                    </div>
                                    <div style="font-size: 12px; color: #475569; line-height: 1.3; margin-top: 3px;">
                                        <span style="font-weight: 600; color: #334155;">Persona:</span> ${i.selectedPersona || oData.selectedPersona || 'Engineering & Developer Persona'}
                                    </div>
                                </div>
                                <div style="flex-shrink: 0;">
                                    <span style="background: #16A34A; color: #FFFFFF; padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 3px rgba(22,163,74,0.25);">
                                        ✔ Approved
                                    </span>
                                </div>
                            </div>
                        `}).join("")}
                    </div>
                `;
            }

            if (aRejectedItems.length > 0) {
                sBodyHtml += `
                    <div style="color: #B91C1C; font-weight: 800; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; margin: 14px 0 8px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>Rejected System Entitlements</span>
                        <span style="background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">${aRejectedItems.length} Item(s)</span>
                    </div>
                    <div class="kyra-dialog-list" style="max-height: 260px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px;">
                        ${aRejectedItems.map(i => {
                            const sCleanRole = (i.roleTitle || i.roleName || 'System Entitlement').replace(/\s*\([^)]*\)/g, "");
                            return `
                            <div style="border: 1px solid #FECACA; background: #FEF2F2; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(220,38,38,0.06);">
                                <div style="flex: 1; min-width: 0; padding-right: 12px;">
                                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
                                        <span style="font-weight: 700; font-size: 12px; color: #B91C1C;">${i.requestId || oData.requestId}</span>
                                        <span style="background: #FFFFFF; border: 1px solid #FCA5A5; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #991B1B;">${i.system}</span>
                                    </div>
                                    <div style="font-size: 13.5px; font-weight: 700; color: #0F172A; line-height: 1.35; margin: 3px 0 2px 0;">
                                        ${sCleanRole} <span style="font-weight: 500; font-size: 12px; color: #64748B;">(${i.team || oData.function || 'Governance'})</span>
                                    </div>
                                    <div style="font-size: 12px; color: #475569; line-height: 1.3; margin-top: 3px;">
                                        <span style="font-weight: 600; color: #334155;">Persona:</span> ${i.selectedPersona || oData.selectedPersona || 'Engineering & Developer Persona'}
                                    </div>
                                </div>
                                <div style="flex-shrink: 0;">
                                    <span style="background: #DC2626; color: #FFFFFF; padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 3px rgba(220,38,38,0.25);">
                                        ✕ Rejected
                                    </span>
                                </div>
                            </div>
                        `}).join("")}
                    </div>
                `;
            }

            sBodyHtml += `</div>`;

            if (typeof KyraDialog !== "undefined") {
                KyraDialog.show({
                    title: "Decision Breakdown Summary - " + oData.requestId,
                    type: sOverallState,
                    maxWidth: "660px",
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

            sap.ui.core.BusyIndicator.show(0);

            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Approver";
            const bIsComplianceApprover = (sActiveRole === "Compliance Approver");

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
                    comments: sComment
                };
            });

            try {
                // Post decision to backend service (inserts into access_management.approvals and updates access_management.requests)
                const response = await fetch("odata/v4/auth/submitAccessDecision", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        requestNumber: oData.requestId,
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
                sap.ui.core.BusyIndicator.hide();
            }

            // Create user notification for the requester
            const sStatusIcon = sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://warning");
            const aUserNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
            aUserNotifications.unshift({
                id: "NOTIF-" + Date.now(),
                requesterId: oData.requesterId || "Dev001",
                title: sOverallStatus === "Approved" ? "Access Request Approved" : (sOverallStatus === "Rejected" ? "Access Request Rejected" : "Access Decision Updated"),
                description: "Your access request (" + oData.requestId + ") for " + (oData.sector || "Governance Sector") + " has been " + sOverallStatus.toLowerCase() + " by the Approver.",
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
                const response = await fetch("odata/v4/auth/Requests");
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
                            serviceTopic: r.service_topic,
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

            const oGrouped = {};
            aRawDbRequests.forEach(r => {
                const sStatus = r.status || "PENDING";
                const isPending = sStatus.toUpperCase().includes("PENDING");
                const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");
                const sGroupKey = (r.requester_username || "User003") + "_" + (r.business_sector || "") + "_" + (r.business_function || "") + "_" + (isPending ? "PENDING" : "PROCESSED") + "_" + (isRevocation ? "REVOCATION" : "ADDITION");
                
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
                        serviceAndRole: (r.role_name || "IT Developers") + " (" + (r.service_topic || "System Administrator") + ")",
                        submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        decisionDate: r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "Information Technology & Security",
                        function: r.business_function || "Identity & Access Governance",
                        region: r.operating_region || "Global Enterprise (ALL)",
                        justification: r.justification || "Business Access Request",
                        selectedPersona: r.selected_persona || r.requester_persona || "Requester",
                        status: isRevocation ? (isPending ? "Revoke Pending" : (sStatus === "APPROVED" ? "Approved" : "Rejected")) : (isPending ? "Pending Approval" : (sStatus === "APPROVED" ? "Approved" : (sStatus === "REJECTED" ? "Rejected" : sStatus))),
                        statusState: isRevocation ? (isPending ? "Error" : (sStatus === "APPROVED" ? "Success" : "Error")) : (isPending ? "Warning" : (sStatus === "APPROVED" ? "Success" : "Error")),
                        statusIcon: isRevocation ? "sap-icon://pending" : (isPending ? "sap-icon://pending" : (sStatus === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error")),
                        isRevocation: isRevocation,
                        entitlements: []
                    };
                }
                
                // Add entitlement to the group
                oGrouped[sGroupKey].entitlements.push({
                    requestId: r.request_number,
                    system: r.target_system,
                    roleName: r.role_name,
                    team: r.service_topic,
                    selectedPersona: r.selected_persona || "Engineering & Developer Persona",
                    grantedDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    expiryDate: r.access_duration,
                    status: isPending ? (isRevocation ? "Revoke Pending" : "Pending") : (sStatus === "APPROVED" ? "Approved" : (sStatus === "REJECTED" ? "Rejected" : sStatus)),
                    statusState: isPending ? "Warning" : (sStatus === "APPROVED" ? "Success" : "Error"),
                    statusIcon: isPending ? "sap-icon://pending" : (sStatus === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error")
                });
            });
            
            const aAllGrouped = Object.values(oGrouped);

            // Recompute overall group status based on individual entitlements decisions
            aAllGrouped.forEach(g => {
                const isPending = g.status.toLowerCase().includes("pending");
                if (!isPending) {
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

            const aPendingRequests = aAllGrouped.filter(r => {
                const sStat = (r.status || "").toUpperCase();
                return sStat.includes("PENDING") || sStat.includes("SUBMITTED");
            });
            const aProcessedRequests = aAllGrouped.filter(r => {
                const sStat = (r.status || "").toUpperCase();
                return !sStat.includes("PENDING") && !sStat.includes("SUBMITTED");
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

            const sPath = "/selectedRequest/entitlements";
            const aEntitlements = oModel.getProperty(sPath) || [];
            aEntitlements.forEach((ent, i) => {
                oModel.setProperty(sPath + "/" + i + "/status", "Approved");
                oModel.setProperty(sPath + "/" + i + "/statusState", "Success");
                oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://sys-enter-2");
            });

            const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
            aTables.forEach(t => {
                (t.items || []).forEach(item => {
                    item.status = "Approved";
                    item.statusState = "Success";
                    item.statusIcon = "sap-icon://sys-enter-2";
                });
            });
            oModel.setProperty("/selectedRequest/summaryTables", aTables);

            MessageToast.show("All entitlements approved successfully.");
        },

        onRejectAllRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sPath = "/selectedRequest/entitlements";
            const aEntitlements = oModel.getProperty(sPath) || [];
            aEntitlements.forEach((ent, i) => {
                oModel.setProperty(sPath + "/" + i + "/status", "Rejected");
                oModel.setProperty(sPath + "/" + i + "/statusState", "Error");
                oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://error");
            });

            const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
            aTables.forEach(t => {
                (t.items || []).forEach(item => {
                    item.status = "Rejected";
                    item.statusState = "Error";
                    item.statusIcon = "sap-icon://error";
                });
            });
            oModel.setProperty("/selectedRequest/summaryTables", aTables);

            MessageToast.show("All entitlements rejected.");
        },

        onCancelRequestSummaryView() {
            sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        }
    });
});
