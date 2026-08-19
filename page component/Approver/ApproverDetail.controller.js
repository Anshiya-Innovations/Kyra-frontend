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
                        aEntList.push({
                            requestId: ent.requestId || oRequest.requestId,
                            system: ent.system || oRequest.system || "SAP System",
                            roleName: ent.roleName || oRequest.roleName || "System Entitlement",
                            team: ent.team || oRequest.function || "Governance",
                            selectedPersona: ent.selectedPersona || oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                            grantedDate: ent.grantedDate || oRequest.submissionDate || new Date().toISOString().split("T")[0],
                            expiryDate: ent.expiryDate || oRequest.duration || "Permanent",
                            status: ent.status || "Pending",
                            statusState: ent.statusState || "Warning",
                            statusIcon: ent.statusIcon || "sap-icon://pending"
                        });
                    });
                } else {
                    aEntList.push({
                        requestId: oRequest.requestId,
                        system: oRequest.system || "SAP System",
                        roleName: oRequest.roleName || oRequest.serviceAndRole || "System Role",
                        team: oRequest.function || "Governance",
                        selectedPersona: oRequest.selectedPersona || oRequest.persona || "Engineering & Developer Persona",
                        grantedDate: oRequest.submissionDate || new Date().toISOString().split("T")[0],
                        expiryDate: oRequest.duration || "Permanent",
                        status: oRequest.status || "Pending",
                        statusState: oRequest.statusState || "Warning",
                        statusIcon: oRequest.statusIcon || "sap-icon://pending"
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
            } else {
                MessageBox.error("Request ID " + sReqId + " not found in the database access records.");
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

                    const sComment = oModel.getProperty(sPath + "/comment");
                    if (!sComment || !sComment.trim()) {
                        oModel.setProperty(sPath + "/comment", "Approved - Entitlement verified & compliant");
                    }
                    MessageToast.show("Accepted entitlement for " + oEntitlement.system);
                } else {
                    // Toggled to Reject (Red)
                    oModel.setProperty(sPath + "/status", "Rejected");
                    oModel.setProperty(sPath + "/statusState", "Error");
                    oModel.setProperty(sPath + "/statusIcon", "sap-icon://error");

                    const sComment = oModel.getProperty(sPath + "/comment");
                    if (!sComment || !sComment.trim()) {
                        oModel.setProperty(sPath + "/comment", "Rejected - Segregation of duties or risk conflict");
                    }
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

                const sComment = oModel.getProperty(sPath + "/comment");
                if (!sComment || !sComment.trim()) {
                    oModel.setProperty(sPath + "/comment", "Approved - Entitlement verified & compliant");
                }

                MessageToast.show("Accepted entitlement for " + (oEntitlement.system || oEntitlement.roleName || "item"));
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

                const sComment = oModel.getProperty(sPath + "/comment");
                if (!sComment || !sComment.trim()) {
                    oModel.setProperty(sPath + "/comment", "Rejected - Segregation of duties or risk conflict");
                }

                MessageToast.show("Rejected entitlement for " + (oEntitlement.system || oEntitlement.roleName || "item"));
            }
        },

        onApproveSelectedRequest() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const oData = oModel.getProperty("/selectedRequest");
                if (!oData) return;

                // Auto-default any unselected / pending items to Approved without blocking popup
                const aEntitlements = oData.entitlements || [];
                aEntitlements.forEach(e => {
                    if (!e.status || e.status === "Pending" || e.status === "PENDING") {
                        e.status = "Approved";
                        e.statusState = "Success";
                        e.statusIcon = "sap-icon://sys-enter-2";
                        if (!e.comment || !e.comment.trim()) {
                            e.comment = "Approved - Entitlement verified & compliant";
                        }
                    }
                });

                this._showDecisionSummarySlide(oData, false);
            }
        },

        _showDecisionSummarySlide(oData, bReadOnly) {
            const oModel = this.getView().getModel("accessModel");
            const aEntitlements = oData.entitlements || [];

            const aApprovedItems = aEntitlements.filter(e => e.status === "Approved");
            const aRejectedItems = aEntitlements.filter(e => e.status === "Rejected");
            const aPendingItems = aEntitlements.filter(e => e.status !== "Approved" && e.status !== "Rejected");

            const aFinalApproved = aApprovedItems.concat(aPendingItems);

            const oApprovedList = new List({
                headerText: "Approved System Entitlements (" + aFinalApproved.length + ")",
                items: aFinalApproved.map(e => new StandardListItem({
                    title: e.system,
                    description: e.roleName + " (" + e.team + ") - Persona: " + (e.selectedPersona || oData.selectedPersona || "Engineering & Developer Persona"),
                    info: "Approved",
                    infoState: "Success",
                    icon: "sap-icon://sys-enter-2",
                    wrapping: true
                }))
            });

            const oRejectedList = new List({
                headerText: "Rejected System Entitlements (" + aRejectedItems.length + ")",
                noDataText: "No entitlements were rejected.",
                items: aRejectedItems.map(e => new StandardListItem({
                    title: e.system,
                    description: e.roleName + " (" + e.team + ") - Persona: " + (e.selectedPersona || oData.selectedPersona || "Engineering & Developer Persona"),
                    info: "Rejected",
                    infoState: "Error",
                    icon: "sap-icon://error",
                    wrapping: true
                }))
            });

            const sOverallStatus = aRejectedItems.length === 0 ? "Approved" : (aFinalApproved.length === 0 ? "Rejected" : "Partially Approved");
            const sOverallState = aRejectedItems.length === 0 ? "Success" : (aFinalApproved.length === 0 ? "Error" : "Warning");

            let aButtons = [];

            if (bReadOnly) {
                aButtons = [
                    new Button({
                        text: "Okay",
                        type: "Emphasized",
                        icon: "sap-icon://accept",
                        press: () => {
                            oDialog.close();
                        }
                    })
                ];
            } else {
                aButtons = [
                    new Button({
                        text: "Back",
                        type: "Default",
                        icon: "sap-icon://navigation-left-arrow",
                        press: () => {
                            oDialog.close();
                        }
                    }),
                    new Button({
                        text: "Okay",
                        type: "Emphasized",
                        icon: "sap-icon://accept",
                        press: () => {
                            this._executeFinalSubmission(oData, sOverallStatus, sOverallState, aFinalApproved, aRejectedItems);
                            oDialog.close();
                        }
                    })
                ];
            }

            const oDialog = new Dialog({
                title: "Decision Breakdown Summary Information - " + oData.requestId,
                type: "Message",
                contentWidth: "520px",
                content: [
                    new VBox({
                        class: "sapUiSmallMargin",
                        items: [
                            new HBox({
                                alignItems: "Center",
                                class: "sapUiSmallMarginBottom",
                                items: [
                                    new Avatar({
                                        src: "sap-icon://summary-detail",
                                        backgroundColor: "Accent1",
                                        displaySize: "M",
                                        class: "sapUiMediumMarginEnd"
                                    }),
                                    new VBox({
                                        items: [
                                            new Title({ text: "Requester (" + (oData.requesterId || "Dev001") + ")", level: "H3" }),
                                            new Text({ text: "Request ID: " + oData.requestId + " • Sector: " + (oData.sector || "Enterprise Governance") })
                                        ]
                                    })
                                ]
                            }),
                            new HBox({
                                justifyContent: "SpaceBetween",
                                alignItems: "Center",
                                class: "sapUiSmallMarginBottom",
                                items: [
                                    new Label({ text: "Overall Decision Result:" }),
                                    new ObjectStatus({
                                        text: sOverallStatus,
                                        state: sOverallState,
                                        icon: sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://warning")
                                    })
                                ]
                            }),
                            oApprovedList,
                            oRejectedList
                        ]
                    })
                ],
                buttons: aButtons
            });

            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        async _executeFinalSubmission(oData, sOverallStatus, sOverallState, aFinalApproved, aRejectedItems) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) {
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            // Build decisions payload for backend persistence with approver comments
            const aDecisionsPayload = (oData.entitlements || []).map(e => ({
                requestNumber: e.requestId || oData.requestId,
                targetSystem: e.system || oData.system,
                roleName: e.roleName,
                selectedPersona: e.selectedPersona || oData.selectedPersona,
                status: (e.status || "").toLowerCase().includes("reject") ? "REJECTED" : "APPROVED",
                comments: e.comment || e.comments || ((e.status || "").toLowerCase().includes("reject") ? "Rejected by Approver" : "Approved by Approver")
            }));

            try {
                // Post decision to backend service (inserts into access_management.approvals and updates access_management.requests)
                const response = await fetch("/odata/v4/auth/submitAccessDecision", {
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
            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aUserNotifications));

            sessionStorage.setItem("kyra_show_approval_history", "true");
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
                const response = await fetch("/odata/v4/auth/Requests");
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

            const aPendingRequests = aAllGrouped.filter(r => r.status.toLowerCase().includes("pending"));
            const aPendingAccessRequests = aPendingRequests.filter(r => !r.isRevocation);
            const aPendingRevokeRequests = aPendingRequests.filter(r => r.isRevocation);
            const aProcessedRequests = aAllGrouped.filter(r => !r.status.toLowerCase().includes("pending"));

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

            oModel.setProperty("/myPendingRequests", aMyPending);
            oModel.setProperty("/myApprovedRequests", aMyApproved);
            oModel.setProperty("/myHistoryRequests", aMyHistory);
            oModel.setProperty("/requestHistory", aCombined);
        },

        onAcceptAllRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oTextArea = new TextArea({
                value: "Approved - All entitlements compliant with security policies",
                placeholder: "Enter approval remark...",
                rows: 3,
                width: "100%"
            });

            const oDialog = new Dialog({
                title: "Accept All Entitlements",
                type: "Message",
                contentWidth: "420px",
                content: [
                    new VBox({
                        class: "sapUiSmallMargin",
                        items: [
                            new Label({ text: "Enter Approval Remark / Comment (Optional):", class: "sapUiTinyMarginBottom" }),
                            oTextArea
                        ]
                    })
                ],
                beginButton: new Button({
                    text: "✓ Confirm Accept All",
                    type: "Accept",
                    press: () => {
                        const sComment = oTextArea.getValue() || "Approved - Batch approval by Governance Officer";
                        const sPath = "/selectedRequest/entitlements";
                        const aEntitlements = oModel.getProperty(sPath) || [];
                        aEntitlements.forEach((ent, i) => {
                            oModel.setProperty(sPath + "/" + i + "/status", "Approved");
                            oModel.setProperty(sPath + "/" + i + "/statusState", "Success");
                            oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://sys-enter-2");
                            oModel.setProperty(sPath + "/" + i + "/comment", sComment);
                        });

                        const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
                        aTables.forEach(t => {
                            (t.items || []).forEach(item => {
                                item.status = "Approved";
                                item.statusState = "Success";
                                item.statusIcon = "sap-icon://sys-enter-2";
                                item.comment = sComment;
                            });
                        });
                        oModel.setProperty("/selectedRequest/summaryTables", aTables);

                        MessageToast.show("Accepted all system entitlements.");
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    type: "Transparent",
                    press: () => {
                        oDialog.close();
                    }
                })
            });

            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        onRejectAllRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oTextArea = new TextArea({
                value: "Rejected - Segregation of duties conflict or risk non-compliance",
                placeholder: "Enter rejection reason...",
                rows: 3,
                width: "100%"
            });

            const oDialog = new Dialog({
                title: "Reject All Entitlements",
                type: "Message",
                contentWidth: "420px",
                content: [
                    new VBox({
                        class: "sapUiSmallMargin",
                        items: [
                            new Label({ text: "Enter Rejection Reason / Comment:", class: "sapUiTinyMarginBottom" }),
                            oTextArea
                        ]
                    })
                ],
                beginButton: new Button({
                    text: "✕ Confirm Reject All",
                    type: "Reject",
                    press: () => {
                        const sComment = oTextArea.getValue() || "Rejected - Batch rejection by Governance Officer";
                        const sPath = "/selectedRequest/entitlements";
                        const aEntitlements = oModel.getProperty(sPath) || [];
                        aEntitlements.forEach((ent, i) => {
                            oModel.setProperty(sPath + "/" + i + "/status", "Rejected");
                            oModel.setProperty(sPath + "/" + i + "/statusState", "Error");
                            oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://error");
                            oModel.setProperty(sPath + "/" + i + "/comment", sComment);
                        });

                        const aTables = oModel.getProperty("/selectedRequest/summaryTables") || [];
                        aTables.forEach(t => {
                            (t.items || []).forEach(item => {
                                item.status = "Rejected";
                                item.statusState = "Error";
                                item.statusIcon = "sap-icon://error";
                                item.comment = sComment;
                            });
                        });
                        oModel.setProperty("/selectedRequest/summaryTables", aTables);

                        MessageToast.show("Rejected all system entitlements.");
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    type: "Transparent",
                    press: () => {
                        oDialog.close();
                    }
                })
            });

            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        onCancelRequestSummaryView() {
            sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        }
    });
});
