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

    return Controller.extend("kyra001.pages.Approver.Approver", {

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
                oModel.setProperty("/showApprovalHistory", !bCurrentState);

                if (!bCurrentState) {
                    MessageToast.show("Displaying Processed Approval History Log.");
                } else {
                    MessageToast.show("Displaying Pending Access Requests Queue.");
                }
            }
        },

        onOpenRequestSummaryDialog(oEvent) {
            const oItem = oEvent.getSource();
            const oData = oItem.getBindingContext("accessModel").getObject();
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
                                            new Text({ text: "User Id: " + oData.requestId + " • Sector: " + (oData.sector || "Enterprise Governance") })
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

            const oProcessedItem = Object.assign({}, oData, {
                requesterName: "Requester",
                persona: "Requester",
                status: sOverallStatus,
                statusState: sOverallState,
                statusIcon: sStatusIcon,
                decisionDate: sDate,
                entitlements: (oData.entitlements || []).map(e => ({
                    system: e.system,
                    roleName: e.roleName,
                    team: e.team,
                    grantedDate: e.grantedDate,
                    expiryDate: e.expiryDate,
                    status: e.status === "Rejected" ? "Rejected" : "Approved",
                    statusState: e.status === "Rejected" ? "Error" : "Success",
                    statusIcon: e.status === "Rejected" ? "sap-icon://error" : "sap-icon://sys-enter-2"
                }))
            });

            let aPending = oModel.getProperty("/pendingRequests") || [];
            const oFoundPending = aPending.find(req => req.requestId === oData.requestId);
            if (oFoundPending) {
                oFoundPending.status = sOverallStatus;
                oFoundPending.statusState = sOverallState;
                oFoundPending.statusIcon = sStatusIcon;
                oFoundPending.entitlements = oProcessedItem.entitlements;
            }
            oModel.setProperty("/pendingRequests", aPending);

            let aProcessed = oModel.getProperty("/processedRequests") || [];
            aProcessed.unshift(oProcessedItem);
            oModel.setProperty("/processedRequests", aProcessed);

            // Also update Requester-side tracking models end-to-end
            let aMyPending = oModel.getProperty("/myPendingRequests") || [];
            let aMyHistory = oModel.getProperty("/requestHistory") || [];
            let aMyApproved = oModel.getProperty("/myApprovedRequests") || [];

            aMyPending = aMyPending.filter(req => req.requestId !== oData.requestId);
            oModel.setProperty("/myPendingRequests", aMyPending);

            aMyHistory.forEach(req => {
                if (req.requestId === oData.requestId) {
                    req.status = sOverallStatus;
                    req.statusState = sOverallState;
                    req.statusIcon = sStatusIcon;
                }
            });
            oModel.setProperty("/requestHistory", aMyHistory);

            if (sOverallStatus === "Approved" || sOverallStatus === "Partially Approved") {
                aMyApproved.unshift(oProcessedItem);
                oModel.setProperty("/myApprovedRequests", aMyApproved);
            }

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
            const aDecisionsPayload = (oData.entitlements || []).map(e => ({
                targetSystem: e.system,
                roleName: e.roleName,
                selectedPersona: oData.persona,
                status: e.status === "Rejected" ? "REJECTED" : "APPROVED"
            }));

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
            }

            // Sync with backend database states
            await this._reloadAllRequests(oModel);

            MessageToast.show("Decision submitted for User Id " + oData.requestId);
            oModel.setProperty("/showRequestDetailView", false);
        },

        async _reloadAllRequests(oModel) {
            if (!oModel) return;

            const aDefaultPending = [
                {
                    requestId: "REQ-2026-9055",
                    requesterId: "User003",
                    persona: "Requester",
                    system: "KYRA Central Governance",
                    serviceAndRole: "Business Product Owner (Stakeholders)",
                    submissionDate: "2026-07-28",
                    decisionDate: "2026-07-28",
                    duration: "Permanent (Default)",
                    sector: "Information Technology & Security",
                    function: "Identity & Access Governance",
                    region: "Global Enterprise (ALL)",
                    justification: "Requires access for Q3 Identity Governance project",
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending",
                    entitlements: [
                        {
                            requestId: "REQ-2026-9055",
                            system: "KYRA Central Governance",
                            roleName: "Business Product Owner",
                            team: "Stakeholders",
                            selectedPersona: "Business Strategy Lead Persona",
                            grantedDate: "2026-07-28",
                            expiryDate: "Permanent (Default)",
                            status: "Pending",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending"
                        }
                    ]
                },
                {
                    requestId: "REQ-2026-9082",
                    requesterId: "Dev001",
                    persona: "Requester",
                    system: "SAP BTP Cloud Platform",
                    serviceAndRole: "IT Developers (System Administrator)",
                    submissionDate: "2026-08-01",
                    decisionDate: "2026-08-01",
                    duration: "Permanent (Default)",
                    sector: "Information Technology & Security",
                    function: "Cloud Systems & Infrastructure",
                    region: "North America (US-EAST)",
                    justification: "Backend API development & UI integration testing",
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending",
                    entitlements: [
                        {
                            requestId: "REQ-2026-9082",
                            system: "SAP BTP Cloud Platform",
                            roleName: "IT Developers",
                            team: "System Administrator",
                            selectedPersona: "Frontend & UI Developer Persona",
                            grantedDate: "2026-08-01",
                            expiryDate: "Permanent (Default)",
                            status: "Pending",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending"
                        }
                    ]
                },
                {
                    requestId: "REQ-2026-8910",
                    requesterId: "User014",
                    persona: "Compliance Reviewer",
                    system: "SAP S/4HANA Enterprise",
                    serviceAndRole: "Financial Auditing (Corporate Accounting)",
                    submissionDate: "2026-08-04",
                    decisionDate: "2026-08-04",
                    duration: "30 Days (Temporary)",
                    sector: "Finance & Enterprise Performance",
                    function: "Financial Auditing",
                    region: "Europe & Middle East (EMEA)",
                    justification: "Quarterly Sarbanes-Oxley (SOX) audit compliance review",
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending",
                    entitlements: [
                        {
                            requestId: "REQ-2026-8910",
                            system: "SAP S/4HANA Enterprise",
                            roleName: "Financial Auditing",
                            team: "Corporate Accounting",
                            selectedPersona: "Regulatory Compliance Officer Persona",
                            grantedDate: "2026-08-04",
                            expiryDate: "30 Days (Temporary)",
                            status: "Pending",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending"
                        }
                    ]
                },
                {
                    requestId: "REQ-2026-8744",
                    requesterId: "User022",
                    persona: "Requester",
                    system: "Active Directory / IAM",
                    serviceAndRole: "IT Security (Security Governance)",
                    submissionDate: "2026-08-06",
                    decisionDate: "2026-08-06",
                    duration: "Permanent (Default)",
                    sector: "Information Technology & Security",
                    function: "Cybersecurity & Access Control",
                    region: "Asia Pacific & Japan (APJ)",
                    justification: "Role assignment for enterprise security posture monitoring",
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending",
                    entitlements: [
                        {
                            requestId: "REQ-2026-8744",
                            system: "Active Directory / IAM",
                            roleName: "IT Security",
                            team: "Security Governance",
                            selectedPersona: "IAM Specialist Persona",
                            grantedDate: "2026-08-06",
                            expiryDate: "Permanent (Default)",
                            status: "Pending",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending"
                        }
                    ]
                }
            ];

            const aDefaultProcessed = [
                {
                    requestId: "REQ-2026-8512",
                    requesterId: "User008",
                    persona: "Requester",
                    system: "SAP BTP Cloud Platform",
                    serviceAndRole: "IT Developers (Cloud Systems)",
                    submissionDate: "2026-07-20",
                    decisionDate: "2026-07-21",
                    duration: "Permanent",
                    sector: "Information Technology & Security",
                    function: "Cloud Systems & Infrastructure",
                    region: "North America (US-EAST)",
                    justification: "Approved cloud infrastructure access",
                    status: "Approved",
                    statusState: "Success",
                    statusIcon: "sap-icon://sys-enter-2",
                    entitlements: [
                        {
                            requestId: "REQ-2026-8512",
                            system: "SAP BTP Cloud Platform",
                            roleName: "IT Developers",
                            team: "Cloud Systems",
                            selectedPersona: "Cloud Architect Persona",
                            grantedDate: "2026-07-21",
                            expiryDate: "Permanent",
                            status: "Approved",
                            statusState: "Success",
                            statusIcon: "sap-icon://sys-enter-2"
                        }
                    ]
                },
                {
                    requestId: "REQ-2026-8430",
                    requesterId: "User019",
                    persona: "Compliance Reviewer",
                    system: "SAP S/4HANA Enterprise",
                    serviceAndRole: "Financial Auditing (Accounting)",
                    submissionDate: "2026-07-15",
                    decisionDate: "2026-07-16",
                    duration: "30 Days",
                    sector: "Finance & Enterprise Performance",
                    function: "Financial Auditing",
                    region: "Europe & Middle East (EMEA)",
                    justification: "Conflict of interest identified during review",
                    status: "Rejected",
                    statusState: "Error",
                    statusIcon: "sap-icon://error",
                    entitlements: [
                        {
                            requestId: "REQ-2026-8430",
                            system: "SAP S/4HANA Enterprise",
                            roleName: "Financial Auditing",
                            team: "Accounting",
                            selectedPersona: "Auditor Persona",
                            grantedDate: "2026-07-16",
                            expiryDate: "30 Days",
                            status: "Rejected",
                            statusState: "Error",
                            statusIcon: "sap-icon://error"
                        }
                    ]
                }
            ];

            let aPending = [].concat(aDefaultPending);
            const sSavedApprover = localStorage.getItem("kyra_submitted_approver_requests");
            if (sSavedApprover) {
                try {
                    const aSavedApp = JSON.parse(sSavedApprover);
                    aSavedApp.forEach(req => {
                        if (!aPending.some(r => r.requestId === req.requestId)) {
                            aPending.unshift(req);
                        }
                    });
                } catch (e) { console.error("Error restoring saved approver requests:", e); }
            }

            let aProcessed = [].concat(aDefaultProcessed);
            const sSavedProcessed = localStorage.getItem("kyra_processed_requests");
            if (sSavedProcessed) {
                try {
                    const aSavedProc = JSON.parse(sSavedProcessed);
                    aSavedProc.forEach(req => {
                        if (!aProcessed.some(r => r.requestId === req.requestId)) {
                            aProcessed.unshift(req);
                        }
                    });
                } catch (e) { console.error("Error restoring saved processed requests:", e); }
            }

            try {
                const response = await fetch("/odata/v4/auth/Requests");
                const data = await response.json();
                if (data && data.value && data.value.length > 0) {
                    data.value.forEach(r => {
                        const isPending = (r.status || "").toLowerCase().includes("pending");
                        const oItem = {
                            requestId: r.request_number,
                            requesterId: r.requester_username || "User003",
                            persona: r.selected_persona || "Engineering & Developer Persona",
                            selectedPersona: r.selected_persona || "Engineering & Developer Persona",
                            system: r.target_system || "SAP BTP Cloud Platform",
                            serviceAndRole: (r.role_name || "IT Developers") + " (" + (r.service_topic || "System Administrator") + ")",
                            submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                            decisionDate: r.updated_at ? r.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
                            duration: r.access_duration || "Permanent",
                            sector: r.business_sector || "Information Technology & Security",
                            function: r.business_function || "Identity & Access Governance",
                            region: r.operating_region || "Global Enterprise (ALL)",
                            justification: r.justification || "Business Access Request",
                            status: isPending ? "Pending Approval" : (r.status === "APPROVED" ? "Approved" : "Rejected"),
                            statusState: isPending ? "Warning" : (r.status === "APPROVED" ? "Success" : "Error"),
                            statusIcon: isPending ? "sap-icon://pending" : (r.status === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error"),
                            entitlements: []
                        };
                        if (isPending) {
                            if (!aPending.some(p => p.requestId === oItem.requestId)) {
                                aPending.unshift(oItem);
                            }
                        } else {
                            if (!aProcessed.some(pr => pr.requestId === oItem.requestId)) {
                                aProcessed.unshift(oItem);
                            }
                        }
                    });
                }
            } catch (err) {
                console.error("Error fetching OData requests:", err);
            }

            oModel.setProperty("/pendingRequests", aPending);
            oModel.setProperty("/processedRequests", aProcessed);
        },

        onOpenDecisionBreakdownDialog(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();
            this._showDecisionSummarySlide(oData, true);
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
