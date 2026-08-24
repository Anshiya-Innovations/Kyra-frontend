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

        onSelectPendingQueue() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showApprovalHistory", false);
            }
        },

        onSelectHistoryLog() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showApprovalHistory", true);
            }
        },

        onSelectAccessRequestsTab() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/approverPendingTab", "accessRequests");
            }
        },

        onSelectRevokeRequestsTab() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/approverPendingTab", "revokeRequests");
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

                // 2. Validation: Remarks/Comments mandatory
                const aMissingRemarks = aEntitlements.filter(e => !e.comment || !e.comment.trim());
                if (aMissingRemarks.length > 0) {
                    sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
                        MessageBox.warning(
                            "Remarks Required: Please enter comments/remarks for all " + aEntitlements.length + " entitlement(s) before submitting your decision.",
                            { title: "Remarks Required" }
                        );
                    });
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

            const sOverallStatus = aRejectedItems.length === 0 ? "Approved" : (aFinalApproved.length === 0 ? "Rejected" : "Partially Approved");
            const sOverallBadgeClass = aRejectedItems.length === 0 ? "kyra-badge-approved" : (aFinalApproved.length === 0 ? "kyra-badge-rejected" : "kyra-badge-partial");
            const sOverallIcon = aRejectedItems.length === 0 ? "✓" : (aFinalApproved.length === 0 ? "✕" : "⚠");

            const sApprovedCardsHtml = aFinalApproved.length > 0 ? aFinalApproved.map(e => `
                <div class="kyra-entitlement-summary-card kyra-card-approved">
                    <div class="kyra-card-main-left">
                        <div class="kyra-card-system-badge kyra-sys-approved">
                            <span class="kyra-sys-name">${e.system || 'System'}</span>
                        </div>
                        <div class="kyra-card-role-title">${e.roleName || 'System Role'}</div>
                        <div class="kyra-card-role-sub">Persona: <strong>${e.selectedPersona || oData.selectedPersona || oData.persona || 'Engineering Persona'}</strong>${e.team ? ' • Team: ' + e.team : ''}</div>
                    </div>
                    <div class="kyra-card-status-pill kyra-pill-approved">
                        ✓ Approved
                    </div>
                </div>
            `).join('') : `
                <div class="kyra-empty-summary-box">No entitlements in this category.</div>
            `;

            const sRejectedCardsHtml = aRejectedItems.length > 0 ? aRejectedItems.map(e => `
                <div class="kyra-entitlement-summary-card kyra-card-rejected">
                    <div class="kyra-card-main-left">
                        <div class="kyra-card-system-badge kyra-sys-rejected">
                            <span class="kyra-sys-name">${e.system || 'System'}</span>
                        </div>
                        <div class="kyra-card-role-title">${e.roleName || 'System Role'}</div>
                        <div class="kyra-card-role-sub">Persona: <strong>${e.selectedPersona || oData.selectedPersona || oData.persona || 'Engineering Persona'}</strong>${e.team ? ' • Team: ' + e.team : ''}</div>
                    </div>
                    <div class="kyra-card-status-pill kyra-pill-rejected">
                        ✕ Rejected
                    </div>
                </div>
            `).join('') : `
                <div class="kyra-empty-summary-box">No entitlements were rejected.</div>
            `;

            const sHtmlContent = `
                <div class="kyra-decision-breakdown-modal">
                    <!-- Modal Header -->
                    <div class="kyra-breakdown-modal-header">
                        <div class="kyra-breakdown-header-left">
                            <div class="kyra-breakdown-avatar-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <div>
                                <div class="kyra-breakdown-main-title">Decision Breakdown Summary</div>
                                <div class="kyra-breakdown-sub-title">Request ID: <strong>${oData.requestId}</strong></div>
                            </div>
                        </div>
                        <button type="button" class="kyra-breakdown-close-x" id="kyra_btn_breakdown_close_x" aria-label="Close">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-requester-title">Requester (${oData.requesterId || 'Dev001'})</div>
                                    <div class="kyra-requester-details">Sector: <strong>${oData.sector || 'HCM'}</strong> • Function: <strong>${oData.function || 'Payroll'}</strong></div>
                                </div>
                            </div>
                            <div class="kyra-overall-decision-badge ${sOverallBadgeClass}">
                                <span>${sOverallIcon}</span> ${sOverallStatus}
                            </div>
                        </div>

                        <!-- Approved Section -->
                        <div class="kyra-breakdown-section-wrapper">
                            <div class="kyra-breakdown-sec-header kyra-text-approved">
                                <span>Approved System Entitlements</span>
                                <span class="kyra-count-badge kyra-count-approved">${aFinalApproved.length}</span>
                            </div>
                            <div class="kyra-breakdown-card-list">
                                ${sApprovedCardsHtml}
                            </div>
                        </div>

                        <!-- Rejected Section -->
                        <div class="kyra-breakdown-section-wrapper">
                            <div class="kyra-breakdown-sec-header kyra-text-rejected">
                                <span>Rejected System Entitlements</span>
                                <span class="kyra-count-badge kyra-count-rejected">${aRejectedItems.length}</span>
                            </div>
                            <div class="kyra-breakdown-card-list">
                                ${sRejectedCardsHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Footer Actions -->
                    <div class="kyra-breakdown-modal-footer">
                        ${!bReadOnly ? '<button type="button" class="kyra-btn-secondary" id="kyra_btn_breakdown_back">Back</button>' : ''}
                        <button type="button" class="kyra-btn-primary" id="kyra_btn_breakdown_okay">Okay</button>
                    </div>
                </div>
            `;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML"], (Dialog, HTML) => {
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "560px",
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
                }, 50);
            });
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

        onSearchApprovalTable(oEvent) {
            const sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator"], (Filter, FilterOperator) => {
                const aFilters = [];
                if (sQuery && sQuery.trim()) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("requesterId", FilterOperator.Contains, sQuery),
                            new Filter("requestId", FilterOperator.Contains, sQuery),
                            new Filter("sector", FilterOperator.Contains, sQuery),
                            new Filter("function", FilterOperator.Contains, sQuery),
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

        onExportApprovals() {
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                MessageToast.show("Approval audit log exported successfully.");
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
                    { key: "all", title: "All Systems", keyword: "", icon: "sap-icon://world", colorClass: "kyraSysIcon_blue" },
                    { key: "btp", title: "SAP BTP Cloud Platform", keyword: "BTP", icon: "sap-icon://cloud", colorClass: "kyraSysIcon_blue" },
                    { key: "s4hana", title: "SAP S/4HANA Enterprise", keyword: "S/4HANA", icon: "sap-icon://building", colorClass: "kyraSysIcon_green" },
                    { key: "kyra", title: "KYRA Central Governance", keyword: "KYRA", icon: "sap-icon://shield", colorClass: "kyraSysIcon_amber" },
                    { key: "iam", title: "Active Directory / IAM", keyword: "Active Directory", icon: "sap-icon://group", colorClass: "kyraSysIcon_purple" },
                    { key: "sf", title: "SAP SuccessFactors", keyword: "SuccessFactors", icon: "sap-icon://bar-chart", colorClass: "kyraSysIcon_cyan" },
                    { key: "ariba", title: "SAP Ariba Supply Network", keyword: "Ariba", icon: "sap-icon://connected-dots", colorClass: "kyraSysIcon_rose" }
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
                    placeholder: "Select start date (dd-MM-yyyy)",
                    displayFormat: "dd-MM-yyyy",
                    valueFormat: "yyyy-MM-dd",
                    width: "100%"
                }).addStyleClass("kyraHistDatePicker");

                const oEndDatePicker = new DatePicker({
                    placeholder: "Select end date (dd-MM-yyyy)",
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
                        const aSystemFilterConditions = [];
                        aSelectedKeywords.forEach(sKeyword => {
                            const sLowerKeyword = sKeyword.toLowerCase();
                            aSystemFilterConditions.push(new Filter("function", FilterOperator.Contains, sKeyword));
                            aSystemFilterConditions.push(new Filter("sector", FilterOperator.Contains, sKeyword));
                            aSystemFilterConditions.push(new Filter({
                                path: "entitlements",
                                test: (aEntitlements) => {
                                    if (!Array.isArray(aEntitlements)) return false;
                                    return aEntitlements.some(e => {
                                        const sSys = (e.system || "").toLowerCase();
                                        const sRole = (e.roleName || "").toLowerCase();
                                        return sSys.includes(sLowerKeyword) || sRole.includes(sLowerKeyword);
                                    });
                                }
                            }));
                        });

                        oSystemFilter = new Filter({
                            filters: aSystemFilterConditions,
                            and: false
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
                                path: "decisionDate",
                                test: (sValue) => {
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
                                    src: bIsHistoryTab ? "sap-icon://history" : "sap-icon://database",
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
