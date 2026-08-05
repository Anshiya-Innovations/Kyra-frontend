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
                const sRequesterId = oRequest.requesterId;
                const aAllPendingForUser = [];
                
                aPending.forEach(req => {
                    if (req.requesterId === sRequesterId) {
                        req.entitlements.forEach(ent => {
                            aAllPendingForUser.push({
                                requestId: req.requestId,
                                system: ent.system,
                                roleName: ent.roleName,
                                team: ent.team,
                                selectedPersona: ent.selectedPersona,
                                grantedDate: ent.grantedDate,
                                expiryDate: ent.expiryDate,
                                status: ent.status,
                                statusState: ent.statusState,
                                statusIcon: ent.statusIcon
                            });
                        });
                    }
                });

                oModel.setProperty("/selectedRequest", {
                    requestId: oRequest.requestId,
                    requesterId: sRequesterId,
                    persona: oRequest.persona,
                    selectedPersona: oRequest.selectedPersona || "Engineering & Developer Persona",
                    region: oRequest.region,
                    sector: oRequest.sector,
                    function: oRequest.function,
                    duration: oRequest.duration,
                    justification: oRequest.justification,
                    status: oRequest.status,
                    statusState: oRequest.statusState,
                    statusIcon: oRequest.statusIcon,
                    entitlements: aAllPendingForUser
                });
            } else {
                MessageBox.error("Request ID " + sReqId + " not found in the database access records.");
            }
        },

        onCloseRequestSummaryView() {
            this.getOwnerComponent().getRouter().navTo("AccessPage");
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
                const hasPending = (oData.entitlements || []).some(e => e.status === "Pending" || e.status === "PENDING");
                if (hasPending) {
                    MessageBox.warning("Please select Accept or Reject for all requested entitlements before submitting.");
                    return;
                }
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
            const sDate = new Date().toISOString().split("T")[0];
            const sStatusIcon = sOverallState === "Success" ? "sap-icon://sys-enter-2" : (sOverallState === "Error" ? "sap-icon://error" : "sap-icon://warning");

            // Persist the decision to the database
            const aDecisionsPayload = (oData.entitlements || []).map(e => ({
                requestNumber: e.requestId,
                targetSystem: e.system,
                roleName: e.roleName,
                selectedPersona: e.selectedPersona || oData.selectedPersona,
                status: e.status === "Rejected" ? "REJECTED" : "APPROVED"
            }));

            sap.ui.core.BusyIndicator.show(0);
            try {
                const response = await fetch("/odata/v4/auth/submitAccessDecision", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        requestNumber: oData.requestId,
                        decisions: aDecisionsPayload
                    })
                });
                const data = await response.json();
                console.log("Successfully persisted approval decision to database:", data);
            } catch (err) {
                console.error("Database persistence approval decision error:", err);
            } finally {
                sap.ui.core.BusyIndicator.hide();
            }

            // Create user notification for the requester
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

            // Sync with backend database states
            await this._reloadAllRequests(oModel);

            sessionStorage.setItem("kyra_show_approval_history", "true");
            MessageToast.show("Decision submitted for User Id " + oData.requestId);
            this.onCloseRequestSummaryView();
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
                    aDbRequests = data.value.map(r => {
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
                const sGroupKey = (r.requester_username || "User003") + "_" + (r.business_sector || "") + "_" + (r.business_function || "") + "_" + (isPending ? "PENDING" : "PROCESSED");
                
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
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "Information Technology & Security",
                        function: r.business_function || "Identity & Access Governance",
                        region: r.operating_region || "Global Enterprise (ALL)",
                        justification: r.justification || "Business Access Request",
                        selectedPersona: r.selected_persona || "Engineering & Developer Persona",
                        status: isPending ? "Pending Approval" : (sStatus === "APPROVED" ? "Approved" : (sStatus === "REJECTED" ? "Rejected" : sStatus)),
                        statusState: isPending ? "Warning" : (sStatus === "APPROVED" ? "Success" : "Error"),
                        statusIcon: isPending ? "sap-icon://pending" : (sStatus === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error"),
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
                    status: isPending ? "Pending" : (sStatus === "APPROVED" ? "Approved" : (sStatus === "REJECTED" ? "Rejected" : sStatus)),
                    statusState: isPending ? "Warning" : (sStatus === "APPROVED" ? "Success" : "Error"),
                    statusIcon: isPending ? "sap-icon://pending" : (sStatus === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error")
                });
            });
            
            const aAllGrouped = Object.values(oGrouped);
            aAllGrouped.sort((a, b) => a.requestId.localeCompare(b.requestId));

            oModel.setProperty("/pendingRequests", aAllGrouped.filter(r => r.status.toLowerCase().includes("pending")));
            oModel.setProperty("/processedRequests", aAllGrouped.filter(r => !r.status.toLowerCase().includes("pending")));

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
            if (oModel) {
                const sPath = "/selectedRequest/entitlements";
                const aEntitlements = oModel.getProperty(sPath) || [];
                aEntitlements.forEach((ent, i) => {
                    oModel.setProperty(sPath + "/" + i + "/status", "Approved");
                    oModel.setProperty(sPath + "/" + i + "/statusState", "Success");
                    oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://sys-enter-2");
                });
                MessageToast.show("Accepted all system entitlements.");
            }
        },

        onRejectAllRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const sPath = "/selectedRequest/entitlements";
                const aEntitlements = oModel.getProperty(sPath) || [];
                aEntitlements.forEach((ent, i) => {
                    oModel.setProperty(sPath + "/" + i + "/status", "Rejected");
                    oModel.setProperty(sPath + "/" + i + "/statusState", "Error");
                    oModel.setProperty(sPath + "/" + i + "/statusIcon", "sap-icon://error");
                });
                MessageToast.show("Rejected all system entitlements.");
            }
        },

        onCancelRequestSummaryView() {
            sessionStorage.setItem("kyra_scroll_to", "approverSectionView");
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        }
    });
});
