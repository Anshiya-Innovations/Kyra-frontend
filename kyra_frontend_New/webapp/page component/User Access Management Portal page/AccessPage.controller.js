sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    const aInitialSubRoles = [
        { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)" },
        { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)" },
        { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)" },
        { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)" }
    ];

    const oSubRolesMap = {
        "System Administrator": aInitialSubRoles,
        "System Owners": [
            { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)" },
            { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)" }
        ],
        "Stakeholders": [
            { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)" },
            { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)" },
            { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)" },
            { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)" },
            { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)" },
            { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)" }
        ]
    };

    return Controller.extend("kyra001.pages.access.AccessPage", {
        onInit() {
            this._aSelectedRegionIds = [];
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const oModel = new JSONModel({
                showAddAccessSector: false,
                showRemoveAccessSector: false,
                selectedTabKey: "myAccess",
                activeRole: sActiveRole,
                isApproverPersona: sActiveRole === "Approver",
                showApprovalHistory: false,
                showPendingSection: false,
                showApprovedSection: false,
                showMyAccessMasterSection: false,
                showAddAccessSector: false,
                showRemoveAccessSector: false,
                sodConflictToggle: "existing",

                // Region Map Component State (from region folder)
                mapRegionList: [
                    { id: "na", name: "North America", left: "20.5%", top: "32%" },
                    { id: "latam", name: "Latin America", left: "32.2%", top: "68%" },
                    { id: "eu", name: "Europe", left: "52%", top: "28%" },
                    { id: "me", name: "Middle East", left: "60%", top: "43.5%" },
                    { id: "af", name: "Africa", left: "53.2%", top: "58.5%" },
                    { id: "as", name: "Asia", left: "73%", top: "35%" },
                    { id: "apac", name: "Oceania / Australia", left: "84.5%", top: "72%" }
                ],
                mapSelectedRegions: [],
                hasMapRegionSelection: false,

                // Pre-populated default Team Roles and Personas (Always available in Add Access Step 3)
                addAccessSubRolesList: [
                    { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)", icon: "sap-icon://developer-settings" },
                    { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)", icon: "sap-icon://user-settings" },
                    { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)", icon: "sap-icon://header" },
                    { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)", icon: "sap-icon://shield-check" },
                    { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)", icon: "sap-icon://manager" },
                    { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)", icon: "sap-icon://header" },
                    { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)", icon: "sap-icon://customer-briefing" },
                    { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)", icon: "sap-icon://group" },
                    { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)", icon: "sap-icon://user-settings" },
                    { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://shield-check" },
                    { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)", icon: "sap-icon://shield" }
                ],
                addAccessPersonasList: [
                    { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                    { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                    { key: "Cloud Infrastructure Administrator Persona (IT Administrators)", text: "Cloud Infrastructure Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                    { key: "Database & IAM Administrator Persona (IT Administrators)", text: "Database & IAM Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                    { key: "Principal Systems Engineer Persona (Lead Engineer)", text: "Principal Systems Engineer Persona (Lead Engineer)", icon: "sap-icon://header" },
                    { key: "DevOps & Platform Lead Persona (Lead Engineer)", text: "DevOps & Platform Lead Persona (Lead Engineer)", icon: "sap-icon://header" },
                    { key: "Security Audit & GRC Persona (IT Security)", text: "Security Audit & GRC Persona (IT Security)", icon: "sap-icon://shield-check" },
                    { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" },
                    { key: "Technical Product Manager Persona (Technical Product Owner)", text: "Technical Product Manager Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                    { key: "Solution Architecture Owner Persona (Technical Product Owner)", text: "Solution Architecture Owner Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                    { key: "Product Suite Engineer Persona (Product Group Engineer)", text: "Product Suite Engineer Persona (Product Group Engineer)", icon: "sap-icon://header" },
                    { key: "Integration Engineering Lead Persona (Product Group Engineer)", text: "Integration Engineering Lead Persona (Product Group Engineer)", icon: "sap-icon://header" },
                    { key: "Business Strategy Lead Persona (Business Product Owner)", text: "Business Strategy Lead Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                    { key: "Enterprise Process Owner Persona (Business Product Owner)", text: "Enterprise Process Owner Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                    { key: "Department Resource Manager Persona (Line Manager)", text: "Department Resource Manager Persona (Line Manager)", icon: "sap-icon://group" },
                    { key: "People Operations Lead Persona (Line Manager)", text: "People Operations Lead Persona (Line Manager)", icon: "sap-icon://group" },
                    { key: "Regulatory Compliance Officer Persona (Compliance Manager)", text: "Regulatory Compliance Officer Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Data Privacy Auditor Persona (Compliance Manager)", text: "Data Privacy Auditor Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Entitlement & Role Custodian Persona (Role Owner)", text: "Entitlement & Role Custodian Persona (Role Owner)", icon: "sap-icon://user-settings" },
                    { key: "Access Governance Approver Persona (Role Owner)", text: "Access Governance Approver Persona (Role Owner)", icon: "sap-icon://user-settings" },
                    { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://shield-check" },
                    { key: "Risk & Assessment Analyst Persona (ISRM)", text: "Risk & Assessment Analyst Persona (ISRM)", icon: "sap-icon://shield-check" },
                    { key: "Identity Management Specialist Persona (IAM / GRC Team)", text: "Identity Management Specialist Persona (IAM / GRC Team)", icon: "sap-icon://shield" },
                    { key: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", text: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", icon: "sap-icon://shield" }
                ],

                // 1. My Access Table Data (Assigned Entitlements)
                activeRoles: [
                    {
                        entitlementName: "SAP S/4HANA Finance Access",
                        system: "SAP S/4HANA",
                        roleName: "Finance User",
                        roleId: "S4H_FIN_001",
                        category: "System Administrator",
                        persona: "Financial Auditing & Accounting Persona",
                        accessType: "Direct",
                        grantedDate: "01 May 2024",
                        expiryDate: "31 Dec 9999",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        entitlementName: "SAP BTP Subaccount Access",
                        system: "SAP BTP",
                        roleName: "BTP Developer",
                        roleId: "BTP_DEV_002",
                        category: "System Owners",
                        persona: "Frontend & UI Developer Persona",
                        accessType: "Direct",
                        grantedDate: "15 Apr 2024",
                        expiryDate: "31 Dec 9999",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        entitlementName: "SAP SuccessFactors Employee Central",
                        system: "SAP SuccessFactors",
                        roleName: "HR User",
                        roleId: "SF_HR_003",
                        category: "Stakeholders",
                        persona: "Human Resources Lead Persona",
                        accessType: "Direct",
                        grantedDate: "10 Apr 2024",
                        expiryDate: "31 Dec 9999",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        entitlementName: "SAP Ariba Procurement Access",
                        system: "SAP Ariba",
                        roleName: "Procurement User",
                        roleId: "ARIBA_PROC_004",
                        category: "Business Operations",
                        persona: "Regulatory Compliance Officer Persona",
                        accessType: "Direct",
                        grantedDate: "05 Apr 2024",
                        expiryDate: "31 Dec 9999",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    }
                ],
                userAccessList: [
                    {
                        system: "SAP BTP Cloud Platform",
                        roleName: "IT Developers",
                        roleId: "BTP_DEV_GLOBAL_01",
                        category: "System Administrator",
                        persona: "Frontend & UI Developer Persona",
                        grantedDate: "2026-01-15",
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "KYRA Central Governance",
                        roleName: "Technical Product Owner",
                        roleId: "KYRA_TPO_ADMIN_09",
                        category: "System Owners",
                        persona: "Business Strategy Lead Persona",
                        grantedDate: "2026-03-10",
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "SAP S/4HANA Enterprise",
                        roleName: "Lead Engineer",
                        roleId: "S4H_ENG_LEAD_04",
                        category: "System Administrator",
                        persona: "Enterprise Infrastructure Architect Persona",
                        grantedDate: "2026-05-20",
                        expiryDate: "2027-05-20",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "Active Directory / IAM",
                        roleName: "IT Security",
                        roleId: "IAM_SEC_AUDIT_02",
                        category: "System Administrator",
                        persona: "IAM Specialist Persona",
                        grantedDate: "2026-06-01",
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "Active Directory / IAM",
                        roleName: "Compliance Manager",
                        roleId: "IAM_COMP_MGR_05",
                        category: "Stakeholders",
                        persona: "Regulatory Compliance Officer Persona",
                        grantedDate: "2026-06-14",
                        expiryDate: "30 Days (Temporary)",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    }
                ],

                // 2. Add Access Form State
                newRequest: {
                    system: "SAP BTP Cloud Platform",
                    category: "System Administrator",
                    roleName: aInitialSubRoles[0].key,
                    duration: "Permanent (Default)",
                    justification: ""
                },
                requestSubRoles: aInitialSubRoles,

                // 3. My Requests Tracking & Audit Log
                requestHistory: [
                    {
                        requestId: "REQ-2026-9041",
                        type: "Addition",
                        system: "SAP BTP Cloud Platform",
                        roleName: "IT Developers",
                        serviceTopic: "System Administrator",
                        selectedPersona: "Frontend & UI Developer Persona (IT Developers)",
                        accessDuration: "Permanent (Default)",
                        submissionDate: "2026-07-27",
                        createdAtRaw: new Date("2026-07-27T10:00:00.000Z").toISOString(),
                        approver: "Sarah Connor (IAM Owner)",
                        status: "Approved",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        requestId: "REQ-2026-8812",
                        type: "Revocation",
                        system: "Active Directory / IAM",
                        roleName: "Compliance Manager",
                        serviceTopic: "Stakeholders",
                        selectedPersona: "Regulatory Compliance Officer Persona (Compliance Manager)",
                        accessDuration: "30 Days (Temporary)",
                        submissionDate: "2026-06-14",
                        createdAtRaw: new Date("2026-06-14T09:15:00.000Z").toISOString(),
                        approver: "Compliance Board",
                        status: "Approved",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        requestId: "REQ-2026-8430",
                        type: "Addition",
                        system: "SAP S/4HANA Enterprise",
                        roleName: "Financial Accountant",
                        serviceTopic: "Finance & Operations",
                        selectedPersona: "Financial Compliance Auditor Persona",
                        accessDuration: "Temporary (30 Days)",
                        submissionDate: "2026-05-10",
                        createdAtRaw: new Date("2026-05-10T11:20:00.000Z").toISOString(),
                        approver: "Finance Security Board",
                        status: "Rejected",
                        statusState: "Error",
                        statusIcon: "sap-icon://error"
                    },
                    {
                        requestId: "REQ-2026-7912",
                        type: "Addition",
                        system: "SAP SuccessFactors",
                        roleName: "HR Line Manager",
                        serviceTopic: "Human Resources",
                        selectedPersona: "Human Resources Lead Persona",
                        accessDuration: "Temporary (60 Days)",
                        submissionDate: "2026-04-01",
                        createdAtRaw: new Date("2026-04-01T08:00:00.000Z").toISOString(),
                        approver: "HR Governance",
                        status: "Expired",
                        statusState: "None",
                        statusIcon: "sap-icon://history"
                    },
                    {
                        requestId: "REQ-2026-7201",
                        type: "Addition",
                        system: "KYRA Central Governance",
                        roleName: "Audit Inspector",
                        serviceTopic: "GRC Audit",
                        selectedPersona: "Risk & Compliance Analyst Persona",
                        accessDuration: "Permanent",
                        submissionDate: "2026-03-15",
                        createdAtRaw: new Date("2026-03-15T14:45:00.000Z").toISOString(),
                        approver: "Security Audit Team",
                        status: "Under Review",
                        statusState: "Information",
                        statusIcon: "sap-icon://inspect"
                    }
                ]
            });

            this.getOwnerComponent().setModel(oModel, "accessModel");
            this._loadSubmittedRequests(oModel);

            const oRouter = this.getOwnerComponent().getRouter();
            if (oRouter && oRouter.getRoute("AccessPage")) {
                oRouter.getRoute("AccessPage").attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _loadSubmittedRequests(oModel) {
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

            let aApproverPending = [].concat(aDefaultPending);
            const sSavedApprover = localStorage.getItem("kyra_submitted_approver_requests");
            if (sSavedApprover) {
                try {
                    const aSavedApp = JSON.parse(sSavedApprover);
                    aSavedApp.forEach(req => {
                        if (!aApproverPending.some(r => r.requestId === req.requestId)) {
                            aApproverPending.unshift(req);
                        }
                    });
                } catch (e) { console.error("Error restoring saved approver requests:", e); }
            }
            oModel.setProperty("/pendingRequests", aApproverPending);

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

            let aApproverProcessed = [].concat(aDefaultProcessed);
            const sSavedProcessed = localStorage.getItem("kyra_processed_requests");
            if (sSavedProcessed) {
                try {
                    const aSavedProc = JSON.parse(sSavedProcessed);
                    aSavedProc.forEach(req => {
                        if (!aApproverProcessed.some(r => r.requestId === req.requestId)) {
                            aApproverProcessed.unshift(req);
                        }
                    });
                } catch (e) { console.error("Error restoring saved processed requests:", e); }
            }
            oModel.setProperty("/processedRequests", aApproverProcessed);

            const sSavedMyPending = localStorage.getItem("kyra_submitted_my_pending");
            if (sSavedMyPending) {
                try {
                    const aSavedMy = JSON.parse(sSavedMyPending);
                    oModel.setProperty("/myPendingRequests", aSavedMy);
                } catch (e) { console.error("Error restoring saved my pending requests:", e); }
            }

            const sSavedMyHistory = localStorage.getItem("kyra_submitted_my_history");
            if (sSavedMyHistory) {
                try {
                    const aSavedHist = JSON.parse(sSavedMyHistory);
                    const aCurrHist = oModel.getProperty("/requestHistory") || [];
                    aSavedHist.forEach(req => {
                        if (!aCurrHist.some(r => r.requestId === req.requestId)) {
                            aCurrHist.unshift(req);
                        }
                    });
                    oModel.setProperty("/requestHistory", aCurrHist);
                } catch (e) { console.error("Error restoring saved my history requests:", e); }
            }
        },

        onAfterRendering() {
            const bindClick = (sId, fnHandler) => {
                const oCard = this.byId(sId);
                if (oCard && !oCard._bBoundClick) {
                    oCard._bBoundClick = true;
                    oCard.addEventDelegate({
                        onclick: () => fnHandler.call(this)
                    });
                }
            };

            bindClick("cardPendingRequests", this.onNavToPendingRequests);
            bindClick("cardApprovedRequests", this.onNavToApprovedRequests);
            bindClick("cardAddAccess", this.onNavToAddAccess);
            bindClick("cardRemoveAccess", this.onNavToRemoveAccess);

            // Render Region Map Component (from region folder)
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();
        },

        // =========================================================================
        // REGION MAP COMPONENT LOGIC (EXACT IMPLEMENTATION FROM REGION FOLDER)
        // =========================================================================
        _attachSelectAllListener() {
            const oSelectAll = document.getElementById("selectAllBtn");
            if (!oSelectAll) {
                setTimeout(this._attachSelectAllListener.bind(this), 100);
                return;
            }

            if (oSelectAll._listenerAttached) return;
            oSelectAll._listenerAttached = true;

            oSelectAll.addEventListener("click", () => {
                const oModel = this.getView().getModel("accessModel");
                if (!oModel) return;
                const aRegions = oModel.getProperty("/mapRegionList") || [];
                
                if (!this._aSelectedRegionIds) {
                    this._aSelectedRegionIds = [];
                }

                if (this._aSelectedRegionIds.length === aRegions.length) {
                    this._aSelectedRegionIds = [];
                    oSelectAll.classList.remove("active");
                } else {
                    this._aSelectedRegionIds = aRegions.map(r => r.id);
                    oSelectAll.classList.add("active");
                }

                this._updatePinSelectionStates();
                this._updateSelectedChips();
            });
        },

        _renderPins() {
            const oPinsLayer = document.getElementById("pinsLayer");
            if (!oPinsLayer) {
                setTimeout(this._renderPins.bind(this), 100);
                return;
            }

            oPinsLayer.innerHTML = "";
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aRegions = oModel.getProperty("/mapRegionList") || [];
            const self = this;

            aRegions.forEach((region) => {
                const oPinContainer = document.createElement("div");
                oPinContainer.className = "map-pin-container";
                oPinContainer.style.left = region.left;
                oPinContainer.style.top = region.top;
                oPinContainer.setAttribute("data-id", region.id);

                if ((self._aSelectedRegionIds || []).indexOf(region.id) !== -1) {
                    oPinContainer.classList.add("active");
                }

                oPinContainer.innerHTML = `
                  <div class="map-pin">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div class="pin-label">${region.name}</div>
                `;

                oPinContainer.addEventListener("click", () => {
                    self.toggleRegionSelection(region.id);
                });

                oPinsLayer.appendChild(oPinContainer);
            });
        },

        toggleRegionSelection(sId) {
            if (!this._aSelectedRegionIds) {
                this._aSelectedRegionIds = [];
            }
            const idx = this._aSelectedRegionIds.indexOf(sId);
            if (idx === -1) {
                this._aSelectedRegionIds.push(sId);
            } else {
                this._aSelectedRegionIds.splice(idx, 1);
            }

            this._updatePinSelectionStates();
            this._updateSelectedChips();
            this._updateSelectAllButtonState();
        },

        _updatePinSelectionStates() {
            const self = this;
            document.querySelectorAll(".map-pin-container").forEach((el) => {
                const sId = el.getAttribute("data-id");
                const bSelected = (self._aSelectedRegionIds || []).indexOf(sId) !== -1;
                el.classList.toggle("active", bSelected);
            });
        },

        _updateSelectAllButtonState() {
            const oSelectAll = document.getElementById("selectAllBtn");
            if (oSelectAll) {
                const oModel = this.getView().getModel("accessModel");
                const aRegions = oModel ? oModel.getProperty("/mapRegionList") || [] : [];
                const bAllSelected = (this._aSelectedRegionIds || []).length === aRegions.length && aRegions.length > 0;
                oSelectAll.classList.toggle("active", bAllSelected);
            }
        },

        _updateSelectedChips() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const aRegions = oModel.getProperty("/mapRegionList") || [];
            const self = this;

            const aSelected = aRegions.filter((r) => {
                return (self._aSelectedRegionIds || []).indexOf(r.id) !== -1;
            });

            oModel.setProperty("/mapSelectedRegions", aSelected);
            oModel.setProperty("/hasMapRegionSelection", aSelected.length > 0);

            const sJoinedRegionNames = aSelected.map(r => r.name).join(", ");
            oModel.setProperty("/addAccessRegion", sJoinedRegionNames);
        },

        onRemoveMapRegionChip(oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("accessModel");
            if (oContext) {
                const sId = oContext.getProperty("id");
                this.toggleRegionSelection(sId);
            }
        },

        _onRouteMatched() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
                oModel.setProperty("/activeRole", sActiveRole);
                oModel.setProperty("/isApproverPersona", sActiveRole === "Approver");
                
                if (sessionStorage.getItem("kyra_show_approval_history") === "true") {
                    oModel.setProperty("/showApprovalHistory", true);
                    sessionStorage.removeItem("kyra_show_approval_history");
                }
                
                this._loadSubmittedRequests(oModel);
            }

            const sScrollTo = sessionStorage.getItem("kyra_scroll_to");
            if (sScrollTo) {
                sessionStorage.removeItem("kyra_scroll_to");
                setTimeout(() => {
                    const oPage = this.byId("accessPortalPage");
                    const oTarget = this.byId(sScrollTo);
                    if (oPage && oTarget) {
                        oPage.scrollToElement(oTarget, 400);
                    }
                }, 500);
            }

            const sTabToSelect = sessionStorage.getItem("kyra_select_tab");
            if (sTabToSelect) {
                sessionStorage.removeItem("kyra_select_tab");
                const oTabBar = this.byId("accessIconTabBar");
                if (oTabBar) {
                    oTabBar.setSelectedKey(sTabToSelect);
                }
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", sTabToSelect);
                }
            }
        },

        async _loadSubmittedRequests(oModel) {
            if (!oModel) return;

            let aDbRequests = [];
            let aRawDbRequests = [];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500);
                const response = await fetch("/odata/v4/auth/Requests", { signal: controller.signal });
                clearTimeout(timeoutId);
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
                console.error("Error loading requests from database:", err);
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
                        decisionDate: r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "Information Technology & Security",
                        function: r.business_function || "Identity & Access Governance",
                        region: r.operating_region || "Global Enterprise (ALL)",
                        justification: r.justification || "Business Access Request",
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

            const aPendingRequests = aAllGrouped.filter(r => r.status.toLowerCase().includes("pending"));
            const aProcessedRequests = aAllGrouped.filter(r => !r.status.toLowerCase().includes("pending"));

            // Rich default initial user requests list to preserve all original demo requests
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

            // Merge default initial requests so the User Requests queue is always fully populated and clickable
            aDefaultPending.forEach(defReq => {
                if (!aPendingRequests.some(p => p.requestId === defReq.requestId)) {
                    aPendingRequests.push(defReq);
                }
            });

            // Merge session pending requests and newly submitted requests
            const aSubmittedAll = JSON.parse(sessionStorage.getItem("kyra_submitted_requests") || "[]");
            aSubmittedAll.forEach(subReq => {
                if ((subReq.status || "").toLowerCase().includes("pending") && !aPendingRequests.some(p => p.requestId === subReq.requestId)) {
                    aPendingRequests.unshift(subReq);
                }
            });

            const aSessionPending = JSON.parse(sessionStorage.getItem("kyra_pending_requests") || "[]");
            aSessionPending.forEach(pReq => {
                if ((pReq.status || "").toLowerCase().includes("pending") && !aPendingRequests.some(p => p.requestId === pReq.requestId)) {
                    aPendingRequests.unshift(pReq);
                }
            });

            sessionStorage.setItem("kyra_pending_requests", JSON.stringify(aPendingRequests));
            oModel.setProperty("/pendingRequests", aPendingRequests);
            oModel.setProperty("/processedRequests", aProcessedRequests);
            oModel.setProperty("/activeRole", sessionStorage.getItem("kyra_active_role") || "Requester");
            oModel.setProperty("/isApproverPersona", (sessionStorage.getItem("kyra_active_role") || "Requester") === "Approver");

            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const aSubmitted = JSON.parse(sessionStorage.getItem("kyra_submitted_requests") || "[]");
            
            // Filter requests strictly for the active logged-in user
            const aUserDbRequests = aDbRequests.filter(r => (r.requesterUsername === sActiveUser || r.requesterId === sActiveUser));
            const aUserSessionRequests = aSubmitted.filter(r => (r.requesterUsername === sActiveUser || r.requesterId === sActiveUser));

            let aCombined = [];

            // Merge DB requests
            aUserDbRequests.forEach(dbReq => {
                if (!aCombined.some(item => item.requestId === dbReq.requestId)) {
                    aCombined.push(dbReq);
                }
            });

            // Merge SessionStorage requests
            aUserSessionRequests.forEach(sessReq => {
                const idx = aCombined.findIndex(item => item.requestId === sessReq.requestId);
                if (idx !== -1) {
                    aCombined[idx] = Object.assign({}, sessReq, aCombined[idx]); // DB status takes precedence
                } else {
                    aCombined.push(sessReq);
                }
            });

            const aDefaultHistory = [
                {
                    requestId: "REQ-2026-9055",
                    type: "Addition",
                    persona: "Business Strategy Lead Persona",
                    selectedPersona: "Business Strategy Lead Persona",
                    system: "KYRA Central Governance",
                    serviceTopic: "Stakeholders",
                    roleName: "Business Product Owner",
                    accessDuration: "Permanent (Default)",
                    submissionDate: "2026-07-28",
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending"
                },
                {
                    requestId: "REQ-2026-9082",
                    type: "Addition",
                    persona: "Frontend & UI Developer Persona",
                    selectedPersona: "Frontend & UI Developer Persona",
                    system: "SAP BTP Cloud Platform",
                    serviceTopic: "System Administrator",
                    roleName: "IT Developers",
                    accessDuration: "Permanent (Default)",
                    submissionDate: "2026-08-01",
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending"
                },
                {
                    requestId: "REQ-2026-9041",
                    type: "Addition",
                    persona: "Frontend & UI Developer Persona",
                    selectedPersona: "Frontend & UI Developer Persona",
                    system: "SAP BTP Cloud Platform",
                    serviceTopic: "System Administrator",
                    roleName: "IT Developers",
                    accessDuration: "Permanent (Default)",
                    submissionDate: "2026-07-27",
                    status: "Approved",
                    statusState: "Success",
                    statusIcon: "sap-icon://sys-enter-2"
                },
                {
                    requestId: "REQ-2026-8812",
                    type: "Revocation",
                    persona: "Regulatory Compliance Officer Persona",
                    selectedPersona: "Regulatory Compliance Officer Persona",
                    system: "Active Directory / IAM",
                    serviceTopic: "Stakeholders",
                    roleName: "Compliance Manager",
                    accessDuration: "30 Days (Temporary)",
                    submissionDate: "2026-06-14",
                    status: "Approved",
                    statusState: "Success",
                    statusIcon: "sap-icon://sys-enter-2"
                },
                {
                    requestId: "REQ-2026-8910",
                    type: "Addition",
                    persona: "Regulatory Compliance Officer Persona",
                    selectedPersona: "Regulatory Compliance Officer Persona",
                    system: "SAP S/4HANA Enterprise",
                    serviceTopic: "Corporate Accounting",
                    roleName: "Financial Auditing",
                    accessDuration: "30 Days (Temporary)",
                    submissionDate: "2026-08-04",
                    status: "Rejected",
                    statusState: "Error",
                    statusIcon: "sap-icon://error"
                }
            ];

            aDefaultHistory.forEach(defH => {
                if (!aCombined.some(item => item.requestId === defH.requestId)) {
                    aCombined.push(defH);
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

            // Fallback default approved requests list so Approved Updates card is always populated
            const aDefaultApproved = [
                {
                    requestId: "REQ-2026-9041",
                    type: "Addition",
                    system: "SAP BTP Cloud Platform",
                    roleName: "IT Developers",
                    serviceTopic: "System Administrator",
                    persona: "Frontend & UI Developer Persona",
                    accessDuration: "Permanent (Default)",
                    submissionDate: "2026-07-27",
                    status: "Approved",
                    statusState: "Success",
                    statusIcon: "sap-icon://sys-enter-2"
                },
                {
                    requestId: "REQ-2026-8812",
                    type: "Revocation",
                    system: "Active Directory / IAM",
                    roleName: "Compliance Manager",
                    serviceTopic: "Stakeholders",
                    persona: "Regulatory Compliance Officer Persona",
                    accessDuration: "30 Days (Temporary)",
                    submissionDate: "2026-06-14",
                    status: "Approved",
                    statusState: "Success",
                    statusIcon: "sap-icon://sys-enter-2"
                }
            ];

            aDefaultApproved.forEach(defApp => {
                if (!aMyApproved.some(a => a.requestId === defApp.requestId)) {
                    aMyApproved.push(defApp);
                }
            });

            oModel.setProperty("/myPendingRequests", aMyPending);
            oModel.setProperty("/myApprovedRequests", aMyApproved);
            oModel.setProperty("/requestHistory", aCombined);

            const aInitialAccess = [
                { system: "SAP BTP Cloud Platform", roleName: "IT Developers", roleId: "BTP_DEV_GLOBAL_01", category: "System Administrator", persona: "Frontend & UI Developer Persona", grantedDate: "2026-01-15", expiryDate: "Permanent", status: "Active", statusState: "Success", statusIcon: "sap-icon://sys-enter-2" },
                { system: "KYRA Central Governance", roleName: "Technical Product Owner", roleId: "KYRA_TPO_ADMIN_09", category: "System Owners", persona: "Business Strategy Lead Persona", grantedDate: "2026-03-10", expiryDate: "Permanent", status: "Active", statusState: "Success", statusIcon: "sap-icon://sys-enter-2" },
                { system: "SAP S/4HANA Enterprise", roleName: "Lead Engineer", roleId: "S4H_ENG_LEAD_04", category: "System Administrator", persona: "Enterprise Infrastructure Architect Persona", grantedDate: "2026-05-20", expiryDate: "2027-05-20", status: "Active", statusState: "Success", statusIcon: "sap-icon://sys-enter-2" },
                { system: "Active Directory / IAM", roleName: "IT Security", roleId: "IAM_SEC_AUDIT_02", category: "System Administrator", persona: "IAM Specialist Persona", grantedDate: "2026-06-01", expiryDate: "Permanent", status: "Active", statusState: "Success", statusIcon: "sap-icon://sys-enter-2" },
                { system: "Active Directory / IAM", roleName: "Compliance Manager", roleId: "IAM_COMP_MGR_05", category: "Stakeholders", persona: "Regulatory Compliance Officer Persona", grantedDate: "2026-06-14", expiryDate: "30 Days (Temporary)", status: "Active", statusState: "Success", statusIcon: "sap-icon://sys-enter-2" }
            ];

            aMyApproved.forEach(appReq => {
                if (!aInitialAccess.some(item => item.roleName === appReq.roleName && item.system === appReq.system)) {
                    aInitialAccess.push({
                        system: appReq.system || "SAP BTP Cloud Platform",
                        roleName: appReq.roleName || "System Entitlement",
                        roleId: appReq.requestId || "ENT_APPROVED",
                        category: appReq.serviceTopic || "System Administrator",
                        persona: appReq.selectedPersona || appReq.persona || "Frontend & UI Developer Persona",
                        grantedDate: appReq.submissionDate || "2026-08-01",
                        expiryDate: appReq.accessDuration || "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    });
                }
            });

            oModel.setProperty("/activeRoles", aInitialAccess);
            oModel.setProperty("/userAccessList", aInitialAccess);
            oModel.setProperty("/myPendingRequests", aMyPending);
            oModel.setProperty("/myApprovedRequests", aMyApproved);
            oModel.setProperty("/myHistoryRequests", aMyHistory);
            oModel.setProperty("/requestHistory", aCombined);

            // Load and filter notifications for active user
            const aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
            const aUserNotifications = aAllNotifications.filter(n => n.requesterId === sActiveUser);
            const iUnreadCount = aUserNotifications.filter(n => n.unread !== false).length;

            oModel.setProperty("/notificationsList", aUserNotifications);
            oModel.setProperty("/notificationsCount", iUnreadCount);
        },

        onOpenAddAccessDialog() {
            sessionStorage.setItem("kyra_reset_add_access", "true");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            this.getOwnerComponent().getRouter().navTo("AddAccessBusinessSector");
        },

        onCloseAddAccessSector() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showAddAccessSector", false);
        },

        onOpenRemoveAccessDialog() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showRemoveAccessSector", true);
            oModel.setProperty("/showAddAccessSector", false);
            MessageToast.show("Remove Access Revocation section displayed below.");
        },

        onCloseRemoveAccessSector() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showRemoveAccessSector", false);
        },

        onCategoryChange(oEvent) {
            const sCategory = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("accessModel");

            const aSubRoles = oSubRolesMap[sCategory] || [];
            const sDefaultSubRole = aSubRoles.length > 0 ? aSubRoles[0].key : "";

            oModel.setProperty("/requestSubRoles", aSubRoles);
            oModel.setProperty("/newRequest/roleName", sDefaultSubRole);
        },

        onAddAccessSubmit() {
            const oModel = this.getView().getModel("accessModel");
            const oForm = oModel.getProperty("/newRequest");

            if (!oForm.justification || oForm.justification.trim().length === 0) {
                MessageBox.error("Please provide a business justification before submitting your access request.");
                return;
            }

            const sReqId = "REQ-2026-" + Math.floor(1000 + Math.random() * 9000);
            const aHistory = oModel.getProperty("/requestHistory");

            aHistory.unshift({
                requestId: sReqId,
                type: "Addition",
                system: oForm.system,
                roleName: oForm.roleName,
                submissionDate: new Date().toISOString().split("T")[0],
                createdAtRaw: new Date().toISOString(),
                approver: "Designated Role Owner",
                status: "Pending Approval",
                statusState: "Warning",
                statusIcon: "sap-icon://pending"
            });

            oModel.setProperty("/requestHistory", aHistory);
            oModel.setProperty("/newRequest/justification", "");
            oModel.setProperty("/showAddAccessSector", false);

            MessageBox.success("Access Request " + sReqId + " for '" + oForm.roleName + "' submitted successfully! Routed for role owner approval.", {
                title: "Request Submitted",
                onClose: () => {
                    const oTabBar = this.byId("accessIconTabBar");
                    oTabBar.setSelectedKey("myRequests");
                }
            });
        },

        onClearRequestForm() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/newRequest/justification", "");
            MessageToast.show("Form cleared.");
        },

        onRemoveAccessClick(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();
            const oModel = this.getView().getModel("accessModel");

            MessageBox.confirm("Are you sure you want to request revocation for role '" + oData.roleName + "' on " + oData.system + "?", {
                title: "Confirm Access Removal",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const sReqId = "REV-2026-" + Math.floor(1000 + Math.random() * 9000);
                        const aHistory = oModel.getProperty("/requestHistory");

                        aHistory.unshift({
                            requestId: sReqId,
                            type: "Revocation",
                            system: oData.system,
                            roleName: oData.roleName,
                            submissionDate: new Date().toISOString().split("T")[0],
                            createdAtRaw: new Date().toISOString(),
                            approver: "IAM Security Board",
                            status: "Revocation Pending",
                            statusState: "Error",
                            statusIcon: "sap-icon://pending"
                        });

                        oModel.setProperty("/requestHistory", aHistory);
                        oModel.setProperty("/showRemoveAccessSector", false);
                        MessageToast.show("Revocation Request " + sReqId + " submitted successfully.");

                        const oTabBar = this.byId("accessIconTabBar");
                        oTabBar.setSelectedKey("myRequests");
                    }
                }
            });
        },

        onSearchMyAccess(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
                    new Filter("roleId", FilterOperator.Contains, sQuery),
                    new Filter("category", FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myAccessTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onViewRoleDetails(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();

            MessageBox.information(
                "Role Name: " + oData.roleName + "\n" +
                "Role ID: " + oData.roleId + "\n" +
                "Target System: " + oData.system + "\n" +
                "Category: " + oData.category + "\n" +
                "Granted Date: " + oData.grantedDate + "\n" +
                "Expiration: " + oData.expiryDate + "\n" +
                "Status: " + oData.status,
                { title: "Entitlement Details" }
            );
        },

        onSearchRequests(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("requestId", FilterOperator.Contains, sQuery),
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
                    new Filter("serviceTopic", FilterOperator.Contains, sQuery),
                    new Filter("selectedPersona", FilterOperator.Contains, sQuery),
                    new Filter("accessDuration", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myRequestsTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onExportAccess() {
            MessageToast.show("Exporting My Access entitlements to CSV...");
        },

        onExportRequests() {
            MessageToast.show("Exporting My Requests audit trail to CSV...");
        },

        onRefreshAccess() {
            MessageToast.show("Access page data refreshed.");
        },

        onOpenNotificationsPopover(oEvent) {
            const oSource = oEvent.getSource();
            const oModel = this.getView().getModel("accessModel");
            const aList = oModel.getProperty("/notificationsList") || [];

            sap.ui.require([
                "sap/m/ResponsivePopover", "sap/m/List", "sap/m/CustomListItem",
                "sap/m/HBox", "sap/m/VBox", "sap/m/Avatar", "sap/m/Title", "sap/m/Text", "sap/m/ObjectStatus", "sap/m/Button"
            ], (ResponsivePopover, List, CustomListItem, HBox, VBox, Avatar, Title, Text, ObjectStatus, Button) => {
                
                const aItems = aList.map(n => new CustomListItem({
                    content: [
                        new HBox({
                            class: "sapUiSmallMargin",
                            alignItems: "Center",
                            items: [
                                new Avatar({
                                    src: n.icon || "sap-icon://bell",
                                    displaySize: "S",
                                    backgroundColor: n.state === "Success" ? "Accent8" : (n.state === "Error" ? "Accent2" : "Accent6"),
                                    class: "sapUiSmallMarginEnd"
                                }),
                                new VBox({
                                    items: [
                                        new Title({ text: n.title, level: "H5" }),
                                        new Text({ text: n.description, class: "fioriDescriptionText" }),
                                        new Text({ text: n.timestamp, class: "sapUiTinyMarginTop" })
                                    ]
                                })
                            ]
                        })
                    ]
                }));

                if (aItems.length === 0) {
                    aItems.push(new CustomListItem({
                        content: [
                            new VBox({
                                class: "sapUiMediumMargin",
                                alignItems: "Center",
                                items: [
                                    new Text({ text: "No new notifications." })
                                ]
                            })
                        ]
                    }));
                }

                const oPopover = new ResponsivePopover({
                    title: "Notifications Center (" + aList.length + ")",
                    contentWidth: "380px",
                    placement: "Bottom",
                    content: [
                        new List({ items: aItems })
                    ],
                    endButton: new Button({
                        text: "Clear All",
                        press: () => {
                            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                            let aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                            aAllNotifications = aAllNotifications.filter(n => n.requesterId !== sActiveUser);
                            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aAllNotifications));
                            oModel.setProperty("/notificationsList", []);
                            oModel.setProperty("/notificationsCount", 0);
                            oPopover.close();
                            MessageToast.show("Notifications cleared.");
                        }
                    })
                });

                // Mark as read
                const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                const aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                aAllNotifications.forEach(n => {
                    if (n.requesterId === sActiveUser) {
                        n.unread = false;
                    }
                });
                sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aAllNotifications));
                oModel.setProperty("/notificationsCount", 0);

                this.getView().addDependent(oPopover);
                oPopover.openBy(oSource);
            });
        },

        onNavToAddAccess() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showAddAccessSector");
                oModel.setProperty("/showAddAccessSector", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showRemoveAccessSector", false);

                if (!bCurr) {
                    oModel.setProperty("/selectedSector", "");
                    oModel.setProperty("/selectedFunction", "");
                    oModel.setProperty("/availableFunctions", [
                        { key: "", text: "Select Business Function...", icon: "" }
                    ]);
                    oModel.setProperty("/addAccessSelectedSystems", []);
                    oModel.setProperty("/addAccessSelectedServices", []);
                    oModel.setProperty("/addAccessSelectedRoles", []);
                    oModel.setProperty("/addAccessSelectedPersonas", []);
                    oModel.setProperty("/addAccessDuration", "");
                    oModel.setProperty("/addAccessJustification", "");
                    oModel.setProperty("/addAccessSystemSlideConfigs", {});
                    oModel.setProperty("/addAccessCurrentSystemIndex", 0);
                    oModel.setProperty("/addAccessStep", 1);
                    oModel.setProperty("/addAccessConfigSubStep", 1);
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("addAccessSectionContainer");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            }
        },

        onInPageSectorChange(oEvent) {
            const sSector = oEvent.getSource().getSelectedKey();
            this.onSelectSectorTile(sSector);
        },

        onSelectSectorTile(sSectorKey) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/selectedSector", sSectorKey);

            const oFunctionsMap = {
                "Finance & Enterprise Performance": [
                    { key: "Financial Auditing", text: "Financial Auditing", icon: "sap-icon://money-bills" },
                    { key: "Corporate Accounting", text: "Corporate Accounting", icon: "sap-icon://accounting-document-verification" },
                    { key: "FP&A Governance", text: "FP&A Governance", icon: "sap-icon://lead" }
                ],
                "Global Supply Chain & Logistics": [
                    { key: "Supply Operations", text: "Supply Operations", icon: "sap-icon://shipping-status" },
                    { key: "Inventory Governance", text: "Inventory Governance", icon: "sap-icon://product" },
                    { key: "Procurement Audit", text: "Procurement Audit", icon: "sap-icon://supplier" }
                ],
                "Human Capital Management (HCM)": [
                    { key: "HR Operations", text: "HR Operations", icon: "sap-icon://group" },
                    { key: "Payroll Governance", text: "Payroll Governance", icon: "sap-icon://payroll" },
                    { key: "Talent Compliance", text: "Talent Compliance", icon: "sap-icon://employee" }
                ],
                "Information Technology & Security": [
                    { key: "Identity & Access Governance", text: "Identity & Access Governance", icon: "sap-icon://shield" },
                    { key: "Lead Security Engineering", text: "Lead Security Engineering", icon: "sap-icon://shield-check" },
                    { key: "Cloud Platform Admin", text: "Cloud Platform Admin", icon: "sap-icon://cloud" }
                ],
                "Customer Operations & Sales": [
                    { key: "CRM Governance", text: "CRM Governance", icon: "sap-icon://customer-briefing" },
                    { key: "Sales Operations Audit", text: "Sales Operations Audit", icon: "sap-icon://sales-order" },
                    { key: "Customer Success Mgmt", text: "Customer Success Mgmt", icon: "sap-icon://manager" }
                ]
            };

            const aFuncs = oFunctionsMap[sSectorKey] || [];
            const aFuncsWithPlaceholder = [
                { key: "", text: "Select Business Function...", icon: "" },
                ...aFuncs
            ];
            oModel.setProperty("/availableFunctions", aFuncsWithPlaceholder);
            oModel.setProperty("/selectedFunction", "");
        },

        onSelectFunctionChip(sFuncKey) {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/selectedFunction", sFuncKey);
            }
        },

        onGoToAddAccessStep1() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 1);
            }
        },

        onGoToAddAccessStep2() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");

            if (!sSector || sSector.trim() === "") {
                MessageBox.error("Please select a Business Sector before proceeding to the next step.");
                return;
            }

            if (!sFunction || sFunction.trim() === "") {
                MessageBox.error("Please select a Business Function before proceeding to the next step.");
                return;
            }

            oModel.setProperty("/addAccessStep", 2);

            setTimeout(() => {
                this._renderPins();
                this._attachSelectAllListener();
                this._updateSelectedChips();
            }, 100);
        },

        onGoToAddAccessStep3() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aMapSelected = oModel.getProperty("/mapSelectedRegions") || [];
            const sRegion = oModel.getProperty("/addAccessRegion");

            if (aMapSelected.length === 0 && (!sRegion || sRegion.trim() === "")) {
                MessageBox.error("Please select at least one Operating Region on the map before proceeding to Configuration.");
                return;
            }

            oModel.setProperty("/addAccessStep", 3);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            oModel.setProperty("/addAccessCurrentSystemIndex", 0);
            
            if (!oModel.getProperty("/addAccessSystemSlideConfigs")) {
                oModel.setProperty("/addAccessSystemSlideConfigs", {});
            }

            this._loadCurrentSystemSlideConfig();
        },

        onInPageTargetSystemsSelectionChange(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;

            if (iIndex >= aSystems.length) {
                iIndex = Math.max(0, aSystems.length - 1);
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex);
            }

            this._loadCurrentSystemSlideConfig();
        },

        _loadCurrentSystemSlideConfig() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sSys = aSystems.length > 0 ? aSystems[iIndex] : "Select Target System";

            oModel.setProperty("/currentSystemSlideName", sSys);

            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const oSysConfig = oSlideConfigsMap[sSys] || {
                selectedServices: [],
                selectedRoles: [],
                selectedPersonas: []
            };

            oModel.setProperty("/addAccessSelectedServices", oSysConfig.selectedServices);
            oModel.setProperty("/addAccessSelectedRoles", oSysConfig.selectedRoles);
            oModel.setProperty("/addAccessSelectedPersonas", oSysConfig.selectedPersonas);
        },

        _saveCurrentSystemSlideConfig() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sSys = aSystems[iIndex];
            if (!sSys) return;

            let oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            oSlideConfigsMap[sSys] = {
                selectedServices: oModel.getProperty("/addAccessSelectedServices") || [],
                selectedRoles: oModel.getProperty("/addAccessSelectedRoles") || [],
                selectedPersonas: oModel.getProperty("/addAccessSelectedPersonas") || []
            };

            oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);
        },

        onNextSystemSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aServices = oModel.getProperty("/addAccessSelectedServices") || [];
            const aRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            const aPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];

            if (aServices.length === 0) {
                MessageBox.error("Please select at least one Service topic for this system before proceeding.");
                return;
            }
            if (aRoles.length === 0) {
                MessageBox.error("Please select at least one Team Role for this system before proceeding.");
                return;
            }
            if (aPersonas.length === 0) {
                MessageBox.error("Please select at least one Persona for this system before proceeding.");
                return;
            }

            this._saveCurrentSystemSlideConfig();

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;

            if (iIndex + 1 < aSystems.length) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex + 1);
                this._loadCurrentSystemSlideConfig();
            }
        },

        onPrevSystemSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._saveCurrentSystemSlideConfig();

            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex > 0) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex - 1);
                this._loadCurrentSystemSlideConfig();
            }
        },

        onCompleteSystemSlides() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aServices = oModel.getProperty("/addAccessSelectedServices") || [];
            const aRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            const aPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];

            if (aServices.length === 0 || aRoles.length === 0 || aPersonas.length === 0) {
                MessageBox.error("Please complete Service, Team Role, and Persona selections for this system slide.");
                return;
            }

            this._saveCurrentSystemSlideConfig();
            oModel.setProperty("/addAccessConfigSubStep", 2);
        },

        onBackToSystemSlides() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessConfigSubStep", 1);
            }
        },

        onInPageServicesSelectionChange(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oServicesRolesMap = {
                "System Administrator": [
                    { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)", icon: "sap-icon://developer-settings" },
                    { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)", icon: "sap-icon://user-settings" },
                    { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)", icon: "sap-icon://header" },
                    { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)", icon: "sap-icon://shield-check" }
                ],
                "System Owners": [
                    { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)", icon: "sap-icon://manager" },
                    { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)", icon: "sap-icon://header" }
                ],
                "Stakeholders": [
                    { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)", icon: "sap-icon://customer-briefing" },
                    { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)", icon: "sap-icon://group" },
                    { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)", icon: "sap-icon://user-settings" },
                    { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://shield-check" },
                    { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)", icon: "sap-icon://shield" }
                ]
            };

            const aAllSubRoles = [
                { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)", icon: "sap-icon://developer-settings" },
                { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)", icon: "sap-icon://user-settings" },
                { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)", icon: "sap-icon://header" },
                { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)", icon: "sap-icon://shield-check" },
                { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)", icon: "sap-icon://manager" },
                { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)", icon: "sap-icon://header" },
                { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)", icon: "sap-icon://customer-briefing" },
                { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)", icon: "sap-icon://group" },
                { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)", icon: "sap-icon://activity-assigned-to-goal" },
                { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)", icon: "sap-icon://user-settings" },
                { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://shield-check" },
                { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)", icon: "sap-icon://shield" }
            ];

            const aSelectedServices = oModel.getProperty("/addAccessSelectedServices") || [];
            
            if (aSelectedServices.length === 0) {
                oModel.setProperty("/addAccessSubRolesList", aAllSubRoles);
                return;
            }

            let aCombinedRoles = [];
            aSelectedServices.forEach(sServiceKey => {
                if (oServicesRolesMap[sServiceKey]) {
                    aCombinedRoles = aCombinedRoles.concat(oServicesRolesMap[sServiceKey]);
                }
            });

            oModel.setProperty("/addAccessSubRolesList", aCombinedRoles);
        },

        onInPageTeamSelectionChange(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oTeamPersonasMap = {
                "IT Developers (System Administrator)": [
                    { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                    { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" }
                ],
                "IT Administrators (System Administrator)": [
                    { key: "Cloud Infrastructure Administrator Persona (IT Administrators)", text: "Cloud Infrastructure Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                    { key: "Database & IAM Administrator Persona (IT Administrators)", text: "Database & IAM Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" }
                ],
                "Lead Engineer (System Administrator)": [
                    { key: "Principal Systems Engineer Persona (Lead Engineer)", text: "Principal Systems Engineer Persona (Lead Engineer)", icon: "sap-icon://header" },
                    { key: "DevOps & Platform Lead Persona (Lead Engineer)", text: "DevOps & Platform Lead Persona (Lead Engineer)", icon: "sap-icon://header" }
                ],
                "IT Security (System Administrator)": [
                    { key: "Security Audit & GRC Persona (IT Security)", text: "Security Audit & GRC Persona (IT Security)", icon: "sap-icon://shield-check" },
                    { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" }
                ],
                "Technical Product Owner (System Owner)": [
                    { key: "Technical Product Manager Persona (Technical Product Owner)", text: "Technical Product Manager Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                    { key: "Solution Architecture Owner Persona (Technical Product Owner)", text: "Solution Architecture Owner Persona (Technical Product Owner)", icon: "sap-icon://manager" }
                ],
                "Product Group Engineer (System Owner)": [
                    { key: "Product Suite Engineer Persona (Product Group Engineer)", text: "Product Suite Engineer Persona (Product Group Engineer)", icon: "sap-icon://header" },
                    { key: "Integration Engineering Lead Persona (Product Group Engineer)", text: "Integration Engineering Lead Persona (Product Group Engineer)", icon: "sap-icon://header" }
                ],
                "Business Product Owner (Stakeholders)": [
                    { key: "Business Strategy Lead Persona (Business Product Owner)", text: "Business Strategy Lead Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                    { key: "Enterprise Process Owner Persona (Business Product Owner)", text: "Enterprise Process Owner Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" }
                ],
                "Line Manager (Stakeholders)": [
                    { key: "Department Resource Manager Persona (Line Manager)", text: "Department Resource Manager Persona (Line Manager)", icon: "sap-icon://group" },
                    { key: "People Operations Lead Persona (Line Manager)", text: "People Operations Lead Persona (Line Manager)", icon: "sap-icon://group" }
                ],
                "Compliance Manager (Stakeholders)": [
                    { key: "Regulatory Compliance Officer Persona (Compliance Manager)", text: "Regulatory Compliance Officer Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Data Privacy Auditor Persona (Compliance Manager)", text: "Data Privacy Auditor Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" }
                ],
                "Role Owner (Stakeholders)": [
                    { key: "Entitlement & Role Custodian Persona (Role Owner)", text: "Entitlement & Role Custodian Persona (Role Owner)", icon: "sap-icon://user-settings" },
                    { key: "Access Governance Approver Persona (Role Owner)", text: "Access Governance Approver Persona (Role Owner)", icon: "sap-icon://user-settings" }
                ],
                "ISRM (Stakeholders)": [
                    { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://shield-check" },
                    { key: "Risk & Assessment Analyst Persona (ISRM)", text: "Risk & Assessment Analyst Persona (ISRM)", icon: "sap-icon://shield-check" }
                ],
                "IAM / GRC Team (Stakeholders)": [
                    { key: "Identity Management Specialist Persona (IAM / GRC Team)", text: "Identity Management Specialist Persona (IAM / GRC Team)", icon: "sap-icon://shield" },
                    { key: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", text: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", icon: "sap-icon://shield" }
                ]
            };

            const aAllPersonas = [
                { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                { key: "Cloud Infrastructure Administrator Persona (IT Administrators)", text: "Cloud Infrastructure Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                { key: "Database & IAM Administrator Persona (IT Administrators)", text: "Database & IAM Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                { key: "Principal Systems Engineer Persona (Lead Engineer)", text: "Principal Systems Engineer Persona (Lead Engineer)", icon: "sap-icon://header" },
                { key: "DevOps & Platform Lead Persona (Lead Engineer)", text: "DevOps & Platform Lead Persona (Lead Engineer)", icon: "sap-icon://header" },
                { key: "Security Audit & GRC Persona (IT Security)", text: "Security Audit & GRC Persona (IT Security)", icon: "sap-icon://shield-check" },
                { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" },
                { key: "Technical Product Manager Persona (Technical Product Owner)", text: "Technical Product Manager Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                { key: "Solution Architecture Owner Persona (Technical Product Owner)", text: "Solution Architecture Owner Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                { key: "Product Suite Engineer Persona (Product Group Engineer)", text: "Product Suite Engineer Persona (Product Group Engineer)", icon: "sap-icon://header" },
                { key: "Integration Engineering Lead Persona (Product Group Engineer)", text: "Integration Engineering Lead Persona (Product Group Engineer)", icon: "sap-icon://header" },
                { key: "Business Strategy Lead Persona (Business Product Owner)", text: "Business Strategy Lead Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                { key: "Enterprise Process Owner Persona (Business Product Owner)", text: "Enterprise Process Owner Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                { key: "Department Resource Manager Persona (Line Manager)", text: "Department Resource Manager Persona (Line Manager)", icon: "sap-icon://group" },
                { key: "People Operations Lead Persona (Line Manager)", text: "People Operations Lead Persona (Line Manager)", icon: "sap-icon://group" },
                { key: "Regulatory Compliance Officer Persona (Compliance Manager)", text: "Regulatory Compliance Officer Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                { key: "Data Privacy Auditor Persona (Compliance Manager)", text: "Data Privacy Auditor Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                { key: "Entitlement & Role Custodian Persona (Role Owner)", text: "Entitlement & Role Custodian Persona (Role Owner)", icon: "sap-icon://user-settings" },
                { key: "Access Governance Approver Persona (Role Owner)", text: "Access Governance Approver Persona (Role Owner)", icon: "sap-icon://user-settings" },
                { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://shield-check" },
                { key: "Risk & Assessment Analyst Persona (ISRM)", text: "Risk & Assessment Analyst Persona (ISRM)", icon: "sap-icon://shield-check" },
                { key: "Identity Management Specialist Persona (IAM / GRC Team)", text: "Identity Management Specialist Persona (IAM / GRC Team)", icon: "sap-icon://shield" },
                { key: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", text: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", icon: "sap-icon://shield" }
            ];

            const aSelectedRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            
            if (aSelectedRoles.length === 0) {
                oModel.setProperty("/addAccessPersonasList", aAllPersonasList);
                return;
            }

            let aCombinedPersonas = [];
            aSelectedRoles.forEach(sRoleKey => {
                if (oTeamPersonasMap[sRoleKey]) {
                    aCombinedPersonas = aCombinedPersonas.concat(oTeamPersonasMap[sRoleKey]);
                }
            });

            oModel.setProperty("/addAccessPersonasList", aCombinedPersonas);
        },

        onGoToAddAccessStep4() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sRegion = oModel.getProperty("/addAccessRegion");
            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const sDuration = oModel.getProperty("/addAccessDuration");
            const sJustification = (oModel.getProperty("/addAccessJustification") || "").trim();

            if (!sRegion || sRegion.trim() === "") {
                MessageBox.error("Please select an Operating Region.");
                oModel.setProperty("/addAccessStep", 2);
                return;
            }
            if (aSystems.length === 0) {
                MessageBox.error("Please select at least one Target System before proceeding to Review.");
                return;
            }
            if (!sDuration || sDuration.trim() === "") {
                MessageBox.error("Please select Access Duration before proceeding.");
                return;
            }
            if (!sJustification) {
                MessageBox.error("Please enter Business Justification before proceeding.");
                return;
            }

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");
            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};

            let aSummaryItems = [];
            let aSummaryTables = [];
            let iCounter = 1;

            const oSystemIconsMap = {
                "SAP BTP Cloud Platform": "sap-icon://cloud",
                "SAP S/4HANA Enterprise": "sap-icon://database",
                "KYRA Central Governance": "sap-icon://shield",
                "Active Directory / IAM": "sap-icon://user-settings",
                "SAP SuccessFactors": "sap-icon://group",
                "SAP Ariba Supply Network": "sap-icon://shipping-status"
            };

            aSystems.forEach((sSys, idx) => {
                const oSysConfig = oSlideConfigsMap[sSys] || {
                    selectedServices: oModel.getProperty("/addAccessSelectedServices") || [],
                    selectedRoles: oModel.getProperty("/addAccessSelectedRoles") || [],
                    selectedPersonas: oModel.getProperty("/addAccessSelectedPersonas") || []
                };
                const aSysRoles = oSysConfig.selectedRoles || [];
                const aSysPersonas = oSysConfig.selectedPersonas || [];

                let aSysItems = [];

                if (aSysRoles.length > 0 && aSysPersonas.length > 0) {
                    aSysRoles.forEach(sRole => {
                        aSysPersonas.forEach(sPers => {
                            const oItem = {
                                requestId: "REQ-2026-" + String(1000 + iCounter++),
                                system: sSys,
                                roleName: sRole,
                                persona: sPers,
                                sector: sSector && sFunction ? (sSector + " | " + sFunction) : (sSector || sFunction || ""),
                                region: sRegion || "",
                                duration: sDuration || "",
                                existingStatus: "New Request",
                                existingState: "Information"
                            };
                            aSummaryItems.push(oItem);
                            aSysItems.push(oItem);
                        });
                    });
                } else if (aSysRoles.length > 0) {
                    aSysRoles.forEach(sRole => {
                        const oItem = {
                            requestId: "REQ-2026-" + String(1000 + iCounter++),
                            system: sSys,
                            roleName: sRole,
                            persona: "",
                            sector: sSector && sFunction ? (sSector + " | " + sFunction) : (sSector || sFunction || ""),
                            region: sRegion || "",
                            duration: sDuration || "",
                            existingStatus: "New Request",
                            existingState: "Information"
                        };
                        aSummaryItems.push(oItem);
                        aSysItems.push(oItem);
                    });
                }

                if (aSysItems.length > 0) {
                    aSummaryTables.push({
                        systemIndex: aSummaryTables.length + 1,
                        systemName: sSys,
                        systemIcon: oSystemIconsMap[sSys] || "sap-icon://cloud",
                        items: aSysItems
                    });
                }
            });

            oModel.setProperty("/addAccessSummaryItems", aSummaryItems);
            oModel.setProperty("/addAccessSummaryTables", aSummaryTables);
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
        },

        onGoToStep4Slide1() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
        },

        onGoToStep4Slide2() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 2);
        },

        onGoBackToDurationSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 2);
            }
        },

        onGoToAddAccessStep5() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 5);
        },

        onEditSystemConfiguration(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/isEditingFromSummary", true);

            const oContext = oEvent.getSource().getBindingContext("accessModel");
            const oSystemTable = oContext ? oContext.getObject() : null;
            const sTargetSys = oSystemTable ? oSystemTable.systemName : null;

            const aSelectedSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iSysIdx = 0;

            if (sTargetSys) {
                const iFoundIdx = aSelectedSystems.indexOf(sTargetSys);
                if (iFoundIdx !== -1) {
                    iSysIdx = iFoundIdx;
                }
            }

            oModel.setProperty("/addAccessCurrentSystemIndex", iSysIdx);
            const sActiveSysName = aSelectedSystems[iSysIdx] || sTargetSys || "";
            oModel.setProperty("/currentSystemSlideName", sActiveSysName);

            if (sActiveSysName) {
                this._loadCurrentSystemSlideConfig(sActiveSysName);
            }

            oModel.setProperty("/addAccessStep", 3);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            MessageToast.show("Editing configuration for " + (sActiveSysName || "target system") + ". Click OK when done.");
        },

        onSaveAndReturnToSummary() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sActiveSysName = oModel.getProperty("/currentSystemSlideName");
            if (sActiveSysName) {
                this._saveCurrentSystemSlideConfig(sActiveSysName);
            }

            // Re-generate summary items and tables based on updated selections
            this.onGoToAddAccessStep4();

            // Directly navigate back to Step 5 Summary
            oModel.setProperty("/addAccessStep", 5);
            oModel.setProperty("/isEditingFromSummary", false);

            MessageToast.show("Configuration updated. Returned to Summary page.");
        },

        onSodConflictToggleChange(oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/sodConflictToggle", sKey);
            }
        },

        onRemoveInPageSummaryItem(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const oItem = oEvent.getSource().getBindingContext("accessModel").getObject();
            let aItems = oModel.getProperty("/addAccessSummaryItems") || [];
            let aTables = oModel.getProperty("/addAccessSummaryTables") || [];

            aItems = aItems.filter(i => i.requestId !== oItem.requestId);
            
            aTables.forEach(t => {
                t.items = t.items.filter(i => i.requestId !== oItem.requestId);
            });
            aTables = aTables.filter(t => t.items.length > 0);

            oModel.setProperty("/addAccessSummaryItems", aItems);
            oModel.setProperty("/addAccessSummaryTables", aTables);
            MessageToast.show("Access request item removed.");
        },

        onFinalSubmitInPageAddAccess() {
            const oModel = this.getView().getModel("accessModel");
            const aSummaryItems = oModel.getProperty("/addAccessSummaryItems") || [];

            if (aSummaryItems.length === 0) {
                MessageBox.error("No access items configured to submit.");
                return;
            }

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");
            const sRegion = oModel.getProperty("/addAccessRegion");
            const sDuration = oModel.getProperty("/addAccessDuration");
            const sJustification = oModel.getProperty("/addAccessJustification");
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";

            const aPending = oModel.getProperty("/myPendingRequests") || [];
            const aHistory = oModel.getProperty("/requestHistory") || [];
            const aApproverPending = oModel.getProperty("/pendingRequests") || [];

            const sNewReqId = "REQ-2026-" + Math.floor(1000 + Math.random() * 9000);
            const sTodayDate = new Date().toISOString().split("T")[0];

            let aEntitlements = [];

            aSummaryItems.forEach(item => {
                const sItemReqId = item.requestId || sNewReqId;
                const oNewReq = {
                    requestId: sItemReqId,
                    type: "New Access",
                    persona: item.persona,
                    system: item.system,
                    serviceTopic: sFunction,
                    roleName: item.roleName,
                    accessDuration: item.duration || sDuration,
                    submitted: sTodayDate,
                    submissionDate: sTodayDate,
                    status: "Pending Approval",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending",
                    requesterId: sActiveUser,
                    region: sRegion,
                    justification: sJustification,
                    sector: sSector,
                    function: sFunction
                };

                aPending.unshift(oNewReq);

                aEntitlements.push({
                    requestId: sItemReqId,
                    system: item.system,
                    roleName: item.roleName,
                    team: sFunction,
                    selectedPersona: item.persona,
                    grantedDate: sTodayDate,
                    expiryDate: item.duration || sDuration,
                    status: "Pending",
                    statusState: "Warning",
                    statusIcon: "sap-icon://pending"
                });

                // POST request item to backend OData endpoint
                fetch("/odata/v4/auth/Requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        request_number: sItemReqId,
                        requester_username: sActiveUser,
                        target_system: item.system,
                        service_topic: sFunction,
                        role_name: item.roleName,
                        requester_persona: item.persona,
                        selected_persona: item.persona,
                        access_duration: item.duration || sDuration,
                        business_sector: sSector,
                        business_function: sFunction,
                        operating_region: sRegion,
                        justification: sJustification,
                        status: "PENDING"
                    })
                }).catch(err => console.log("Backend sync notice:", err));
            });

            // Grouped approver request for User Requests table on Approver page
            const oApproverGroupedReq = {
                requestId: sNewReqId,
                requesterId: sActiveUser,
                persona: aSummaryItems[0] ? aSummaryItems[0].persona : "Requester",
                system: aSummaryItems[0] ? aSummaryItems[0].system : "SAP System",
                serviceAndRole: aSummaryItems[0] ? (aSummaryItems[0].roleName + " (" + sFunction + ")") : "Role",
                submissionDate: sTodayDate,
                decisionDate: sTodayDate,
                duration: sDuration,
                sector: sSector,
                function: sFunction,
                region: sRegion,
                justification: sJustification,
                status: "Pending Approval",
                statusState: "Warning",
                statusIcon: "sap-icon://pending",
                entitlements: aEntitlements
            };

            aApproverPending.unshift(oApproverGroupedReq);

            try {
                localStorage.setItem("kyra_submitted_approver_requests", JSON.stringify(aApproverPending));
                localStorage.setItem("kyra_submitted_my_pending", JSON.stringify(aPending));
            } catch(e) { console.error("Error saving to localStorage:", e); }

            oModel.setProperty("/myPendingRequests", aPending);
            oModel.setProperty("/requestHistory", aHistory);
            oModel.setProperty("/pendingRequests", aApproverPending);

            // Reset wizard state
            oModel.setProperty("/addAccessStep", 1);
            oModel.setProperty("/showAddAccessSector", false);

            MessageBox.success("Add Access Request submitted successfully! " + aSummaryItems.length + " entitlement item(s) added to User Requests queue.", {
                title: "Request Submitted Successfully"
            });
        },

        onNavToPendingRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showPendingSection");
                oModel.setProperty("/showPendingSection", !bCurr);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                
                if (!bCurr) {
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("pendingSectionContainer");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            }
        },

        onNavToApprovedRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showApprovedSection");
                oModel.setProperty("/showApprovedSection", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                
                if (!bCurr) {
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("approvedSectionContainer");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            }
        },

        onClosePendingSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showPendingSection", false);
            }
        },

        onCloseApprovedSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showApprovedSection", false);
            }
        },

        onNavToMyAccessMasterPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const bCurr = oModel.getProperty("/showMyAccessMasterSection");
            oModel.setProperty("/showMyAccessMasterSection", !bCurr);
            oModel.setProperty("/showPendingSection", false);
            oModel.setProperty("/showApprovedSection", false);
            oModel.setProperty("/showAddAccessSector", false);
            oModel.setProperty("/showRemoveAccessSector", false);

            if (!bCurr) {
                setTimeout(() => {
                    const oPage = this.byId("accessPortalPage");
                    const oTarget = this.byId("myAccessMasterSectionContainer");
                    if (oPage && oTarget) {
                        oPage.scrollToElement(oTarget, 400);
                    }
                }, 100);
            }
        },

        onCloseMyAccessMasterSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showMyAccessMasterSection", false);
            }
        },

        onNavToRemoveAccess() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showRemoveAccessSector");
                oModel.setProperty("/showRemoveAccessSector", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                
                if (!bCurr) {
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("removeAccessSection");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            }
        },

        onOpenAccessRowActionSheet(oEvent) {
            const oSource = oEvent.getSource();
            const oItemContext = oSource.getBindingContext("accessModel");
            const oItem = oItemContext ? oItemContext.getObject() : null;
            if (!oItem) return;

            sap.ui.require(["sap/m/ActionSheet", "sap/m/Button", "sap/m/MessageToast"], (ActionSheet, Button, MessageToast) => {
                const oActionSheet = new ActionSheet({
                    title: "Actions for " + (oItem.roleName || "Entitlement"),
                    placement: "Bottom",
                    buttons: [
                        new Button({
                            text: "View Details & Audit Log",
                            icon: "sap-icon://display",
                            press: () => {
                                this._showAccessDetailsDialog(oItem);
                            }
                        }),
                        new Button({
                            text: "Export Audit Log",
                            icon: "sap-icon://excel-attachment",
                            press: () => {
                                MessageToast.show("Exported entitlement audit log for " + oItem.roleName);
                            }
                        }),
                        new Button({
                            text: "Request Access Revocation",
                            icon: "sap-icon://delete",
                            type: "Reject",
                            press: () => {
                                this.onNavToRemoveAccess();
                            }
                        })
                    ]
                });

                this.getView().addDependent(oActionSheet);
                oActionSheet.openBy(oSource);
            });
        },

        onViewAccessDetails(oEvent) {
            const oItem = oEvent.getSource().getBindingContext("accessModel").getObject();
            if (!oItem) return;
            this._showAccessDetailsDialog(oItem);
        },

        _showAccessDetailsDialog(oItem) {
            sap.ui.require([
                "sap/m/Dialog", "sap/m/VBox", "sap/m/HBox", "sap/m/Title", "sap/m/Text",
                "sap/m/ObjectStatus", "sap/m/IconTabBar", "sap/m/IconTabFilter",
                "sap/ui/layout/form/SimpleForm", "sap/m/Label", "sap/m/Button", "sap/m/Avatar", "sap/m/MessageToast"
            ], (Dialog, VBox, HBox, Title, Text, ObjectStatus, IconTabBar, IconTabFilter, SimpleForm, Label, Button, Avatar, MessageToast) => {
                
                const sSys = oItem.system || "SAP Enterprise System";
                const sRole = oItem.roleName || "User Role";
                const sRoleId = oItem.roleId || "S4H_FIN_001";
                const sCat = oItem.category || "System Administrator";
                const sPers = oItem.persona || "Requester";
                const sGranted = oItem.grantedDate || "01 May 2024";
                const sExpiry = oItem.expiryDate === "Permanent" ? "31 Dec 9999" : (oItem.expiryDate || "31 Dec 9999");
                const sStatus = oItem.status || "Active";
                const sState = oItem.statusState || "Success";

                const oDialog = new Dialog({
                    title: "Complete Entitlement & Audit Governance View",
                    contentWidth: "680px",
                    contentHeight: "480px",
                    verticalScrolling: true,
                    content: [
                        new VBox({
                            class: "sapUiContentPadding",
                            items: [
                                // Top Header Banner
                                new HBox({
                                    alignItems: "Center",
                                    justifyContent: "SpaceBetween",
                                    class: "fioriWelcomeCard sapUiSmallMarginBottom sapUiResponsivePadding",
                                    items: [
                                        new HBox({
                                            alignItems: "Center",
                                            items: [
                                                new Avatar({ src: "sap-icon://shield-check", displaySize: "M", backgroundColor: "Accent6", class: "sapUiSmallMarginEnd" }),
                                                new VBox({
                                                    items: [
                                                        new Title({ text: sRole, level: "H4" }),
                                                        new Text({ text: sSys, class: "fioriWelcomeSubtitle" })
                                                    ]
                                                })
                                            ]
                                        }),
                                        new ObjectStatus({
                                            text: sStatus + " (100% Compliant)",
                                            state: sState,
                                            icon: "sap-icon://sys-enter-2"
                                        })
                                    ]
                                }),

                                // Details Tabs
                                new IconTabBar({
                                    headerMode: "Inline",
                                    class: "sapUiNoContentPadding",
                                    items: [
                                        new IconTabFilter({
                                            text: "Entitlement Details",
                                            icon: "sap-icon://user-settings",
                                            content: [
                                                new SimpleForm({
                                                    editable: false,
                                                    layout: "ColumnLayout",
                                                    columnsM: 2,
                                                    columnsL: 2,
                                                    content: [
                                                        new Label({ text: "System Name" }),
                                                        new Text({ text: sSys }),

                                                        new Label({ text: "Role Title" }),
                                                        new Text({ text: sRole }),

                                                        new Label({ text: "Category Topic" }),
                                                        new Text({ text: sCat }),

                                                        new Label({ text: "Assigned Persona" }),
                                                        new Text({ text: sPers }),

                                                        new Label({ text: "Access Type" }),
                                                        new Text({ text: "Direct Entitlement (Assigned Role)" }),

                                                        new Label({ text: "Granted Date" }),
                                                        new Text({ text: sGranted }),

                                                        new Label({ text: "Expiration Date" }),
                                                        new Text({ text: sExpiry })
                                                    ]
                                                })
                                            ]
                                        }),
                                        new IconTabFilter({
                                            text: "Audit & Governance Trail",
                                            icon: "sap-icon://history",
                                            content: [
                                                new SimpleForm({
                                                    editable: false,
                                                    layout: "ColumnLayout",
                                                    columnsM: 2,
                                                    columnsL: 2,
                                                    content: [
                                                        new Label({ text: "Audit Tracking ID" }),
                                                        new Text({ text: "AUD-2024-" + Math.floor(1000 + Math.random() * 9000) }),

                                                        new Label({ text: "Governance Approver" }),
                                                        new Text({ text: "KYRA Identity & Access Board" }),

                                                        new Label({ text: "SoD Compliance Risk" }),
                                                        new ObjectStatus({ text: "Low Risk (Segregation of Duties Verified)", state: "Success", icon: "sap-icon://shield-check" }),

                                                        new Label({ text: "Sync Status" }),
                                                        new Text({ text: "Synchronized with Active Directory & SAP GRC" }),

                                                        new Label({ text: "Last Audit Verification" }),
                                                        new Text({ text: new Date().toLocaleDateString() }),

                                                        new Label({ text: "Classification" }),
                                                        new Text({ text: "Restricted Enterprise Entitlement" })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ],
                    beginButton: new Button({
                        text: "Export Audit Log",
                        icon: "sap-icon://excel-attachment",
                        press: () => {
                            MessageToast.show("Exported entitlement audit log for " + sRole);
                        }
                    }),
                    endButton: new Button({
                        text: "Close",
                        type: "Emphasized",
                        press: () => oDialog.close()
                    }),
                    afterClose: () => oDialog.destroy()
                });

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onViewAllEntitlementsMatrix() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            sap.ui.require([
                "sap/m/Dialog", "sap/m/VBox", "sap/m/HBox", "sap/m/Title", "sap/m/Text",
                "sap/m/Table", "sap/m/Column", "sap/m/ColumnListItem", "sap/m/ObjectStatus",
                "sap/m/ObjectIdentifier", "sap/m/Button", "sap/m/MessageToast"
            ], (Dialog, VBox, HBox, Title, Text, Table, Column, ColumnListItem, ObjectStatus, ObjectIdentifier, Button, MessageToast) => {
                
                const aRoles = oModel.getProperty("/activeRoles") || [];

                const oDialog = new Dialog({
                    title: "Master Entitlements & Audit Matrix View",
                    contentWidth: "900px",
                    contentHeight: "560px",
                    verticalScrolling: true,
                    content: [
                        new VBox({
                            class: "sapUiContentPadding",
                            items: [
                                new HBox({
                                    justifyContent: "SpaceBetween",
                                    alignItems: "Center",
                                    class: "sapUiSmallMarginBottom",
                                    items: [
                                        new VBox({
                                            items: [
                                                new Title({ text: "Complete User Access & Audit History Matrix", level: "H4" }),
                                                new Text({ text: "Showing all active system roles, assigned personas, and audit compliance states in a single view.", class: "fioriDescriptionText" })
                                            ]
                                        }),
                                        new Button({
                                            icon: "sap-icon://excel-attachment",
                                            text: "Export Matrix",
                                            press: () => MessageToast.show("Master access matrix exported successfully.")
                                        })
                                    ]
                                }),

                                new Table({
                                    items: aRoles.map(r => new ColumnListItem({
                                        cells: [
                                            new ObjectIdentifier({ title: r.system, text: r.roleId }),
                                            new Text({ text: r.roleName, class: "fioriCellBold" }),
                                            new Text({ text: r.category || "System Administrator" }),
                                            new ObjectStatus({ text: r.persona || "Requester", state: "Information", icon: "sap-icon://account" }),
                                            new Text({ text: r.grantedDate }),
                                            new Text({ text: r.expiryDate === "Permanent" ? "31 Dec 9999" : (r.expiryDate || "31 Dec 9999") }),
                                            new ObjectStatus({ text: "100% Audit Compliant", state: "Success", icon: "sap-icon://sys-enter-2" })
                                        ]
                                    })),
                                    columns: [
                                        new Column({ width: "18%", header: new Text({ text: "System & ID" }) }),
                                        new Column({ width: "20%", header: new Text({ text: "Role Title" }) }),
                                        new Column({ width: "16%", header: new Text({ text: "Category" }) }),
                                        new Column({ width: "16%", header: new Text({ text: "Persona" }) }),
                                        new Column({ width: "11%", header: new Text({ text: "Granted" }) }),
                                        new Column({ width: "11%", header: new Text({ text: "Expiry" }) }),
                                        new Column({ width: "18%", header: new Text({ text: "Audit Compliance" }) })
                                    ]
                                })
                            ]
                        })
                    ],
                    endButton: new Button({
                        text: "Close Matrix",
                        type: "Emphasized",
                        press: () => oDialog.close()
                    }),
                    afterClose: () => oDialog.destroy()
                });

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onShowAuditSummary(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const aRequests = oModel ? oModel.getProperty("/requestHistory") || [] : [];
            
            const iTotal = aRequests.length;
            const iPending = aRequests.filter(r => r.status === "Pending Approval" || r.status === "Pending").length;
            const iApproved = aRequests.filter(r => r.status === "Approved").length;
            const iPermanent = aRequests.filter(r => (r.accessDuration || "").includes("Permanent")).length;
            const iTemp = aRequests.filter(r => (r.accessDuration || "").includes("30") || (r.accessDuration || "").includes("Temporary")).length;

            const oSource = oEvent.getSource();

            sap.ui.require(["sap/m/ResponsivePopover", "sap/m/VBox", "sap/m/Text", "sap/m/Title", "sap/m/Button"], (ResponsivePopover, VBox, Text, Title, Button) => {
                const oPopover = new ResponsivePopover({
                    title: "KYRA Audit Summary Statistics",
                    contentWidth: "360px",
                    placement: "PreferredTop",
                    content: [
                        new VBox({
                            class: "sapUiContentPadding",
                            items: [
                                new Title({ text: "Governance & Audit Overview", level: "H5", class: "sapUiTinyMarginBottom" }),
                                new Text({ text: "• Total Audited Requests: " + iTotal }),
                                new Text({ text: "• Approved Access Granted: " + iApproved }),
                                new Text({ text: "• Pending Approval Queue: " + iPending }),
                                new Text({ text: "• Permanent Entitlements: " + iPermanent }),
                                new Text({ text: "• Temporary Access (30/60 Days): " + iTemp }),
                                new Text({ text: "• Audit Log Last Sync: " + new Date().toLocaleTimeString() })
                            ]
                        })
                    ],
                    endButton: new Button({
                        text: "Close Summary",
                        type: "Emphasized",
                        press: () => oPopover.close()
                    })
                });
                this.getView().addDependent(oPopover);
                oPopover.openBy(oSource);
            });
        },

        onFilterHistoryDialog() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            sap.ui.require(["sap/m/SelectDialog", "sap/m/StandardListItem", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (SelectDialog, StandardListItem, Filter, FilterOperator, MessageToast) => {
                const oDialog = new SelectDialog({
                    title: "Filter History by Timing & Duration",
                    items: [
                        new StandardListItem({ title: "Last 1 Month Requests", description: "Filter requests submitted within the last 30 days", icon: "sap-icon://history" }),
                        new StandardListItem({ title: "Last 3 Months Requests", description: "Filter requests submitted within the last 90 days", icon: "sap-icon://history" }),
                        new StandardListItem({ title: "Duration: Permanent Access", description: "Filter long-term permanent role assignments", icon: "sap-icon://accept" }),
                        new StandardListItem({ title: "Duration: Temporary Access (30/60 Days)", description: "Filter short-term temporary access roles", icon: "sap-icon://history" })
                    ],
                    confirm: (oEvent) => {
                        const oSelectedItem = oEvent.getParameter("selectedItem");
                        if (!oSelectedItem) return;
                        const sFilterTitle = oSelectedItem.getTitle();
                        const oTable = this.byId("myRequestsUnifiedTable");
                        if (!oTable) return;
                        const oBinding = oTable.getBinding("items");
                        if (!oBinding) return;

                        const dNow = new Date();

                        if (sFilterTitle.includes("Last 1 Month")) {
                            const dOneMonthAgo = new Date(dNow.getFullYear(), dNow.getMonth() - 1, dNow.getDate());
                            const fnFilter1Month = new Filter({
                                path: "submitted",
                                test: (sValue) => {
                                    if (!sValue) return true;
                                    const dDate = new Date(sValue);
                                    return !isNaN(dDate.getTime()) && dDate >= dOneMonthAgo;
                                }
                            });
                            oBinding.filter([fnFilter1Month]);
                            MessageToast.show("Filtered My History by Last 1 Month Requests.");
                        } else if (sFilterTitle.includes("Last 3 Months")) {
                            const dThreeMonthsAgo = new Date(dNow.getFullYear(), dNow.getMonth() - 3, dNow.getDate());
                            const fnFilter3Months = new Filter({
                                path: "submitted",
                                test: (sValue) => {
                                    if (!sValue) return true;
                                    const dDate = new Date(sValue);
                                    return !isNaN(dDate.getTime()) && dDate >= dThreeMonthsAgo;
                                }
                            });
                            oBinding.filter([fnFilter3Months]);
                            MessageToast.show("Filtered My History by Last 3 Months Requests.");
                        } else if (sFilterTitle.includes("Permanent")) {
                            oBinding.filter([ new Filter("accessDuration", FilterOperator.Contains, "Permanent") ]);
                            MessageToast.show("Filtered My History by Permanent Duration.");
                        } else if (sFilterTitle.includes("Temporary")) {
                            oBinding.filter([ new Filter("accessDuration", FilterOperator.Contains, "30") ]);
                            MessageToast.show("Filtered My History by Temporary Duration.");
                        }
                    }
                });
                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onLogout() {
            MessageBox.confirm("Are you sure you want to sign out?", {
                title: "Sign Out",
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        sessionStorage.removeItem("kyra_active_user");
                        sessionStorage.removeItem("kyra_active_role");
                        MessageToast.show("Session ended.");
                        this.getOwnerComponent().getRouter().navTo("Login");
                    }
                }
            });
        }
    });
});
