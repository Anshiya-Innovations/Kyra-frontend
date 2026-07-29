sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    const oSubRolesMap = {
        "System Administrator": [
            { key: "IT Developers", text: "IT Developers", icon: "sap-icon://developer-settings" },
            { key: "IT Administrators", text: "IT Administrators", icon: "sap-icon://user-settings" },
            { key: "Lead Engineer", text: "Lead Engineer", icon: "sap-icon://header" },
            { key: "IT Security", text: "IT Security", icon: "sap-icon://shield-check" }
        ],
        "System Owners": [
            { key: "Technical Product Owner", text: "Technical Product Owner", icon: "sap-icon://manager" },
            { key: "Product Group Engineer", text: "Product Group Engineer", icon: "sap-icon://header" }
        ],
        "Stakeholders": [
            { key: "Business Product Owner", text: "Business Product Owner", icon: "sap-icon://customer-briefing" },
            { key: "Line Manager", text: "Line Manager", icon: "sap-icon://group" },
            { key: "Compliance Manager", text: "Compliance Manager", icon: "sap-icon://activity-assigned-to-goal" },
            { key: "Role Owner", text: "Role Owner", icon: "sap-icon://user-settings" },
            { key: "ISRM", text: "ISRM", icon: "sap-icon://shield-check" },
            { key: "IAM / GRC Team", text: "IAM / GRC Team", icon: "sap-icon://shield" }
        ]
    };

    return Controller.extend("kyra001.pages.access.AccessPage", {
        onInit() {
            const sUser = sessionStorage.getItem("kyra_active_user") || "ADM100001";
            const sRole = sessionStorage.getItem("kyra_active_role") || "System Administrator";

            const aInitialSubRoles = oSubRolesMap["System Administrator"];

            const oModel = new JSONModel({
                userId: sUser,
                activeRole: sRole,
                userWelcomeTitle: "User Access Directory & Governance, " + sUser,

                // 1. My Access Active Entitlements Data
                activeRoles: [
                    {
                        system: "SAP BTP Cloud Platform",
                        roleName: "IT Developers",
                        roleId: "BTP_DEV_GLOBAL_01",
                        category: "System Administrator",
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
                        grantedDate: "2026-06-01",
                        expiryDate: "Permanent",
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
                        submissionDate: "2026-07-27",
                        approver: "Sarah Connor (IAM Owner)",
                        status: "Approved",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        requestId: "REQ-2026-9055",
                        type: "Addition",
                        system: "KYRA Central Governance",
                        roleName: "Business Product Owner",
                        submissionDate: "2026-07-28",
                        approver: "Line Manager / ISRM Team",
                        status: "Pending Approval",
                        statusState: "Warning",
                        statusIcon: "sap-icon://pending"
                    },
                    {
                        requestId: "REQ-2026-8812",
                        type: "Revocation",
                        system: "Active Directory / IAM",
                        roleName: "Compliance Manager",
                        submissionDate: "2026-06-14",
                        approver: "Compliance Board",
                        status: "Approved",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    }
                ]
            });

            this.getView().setModel(oModel, "accessModel");
        },

        onCategoryChange(oEvent) {
            const sCategory = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("accessModel");

            const aSubRoles = oSubRolesMap[sCategory] || [];
            const sDefaultSubRole = aSubRoles.length > 0 ? aSubRoles[0].key : "";

            oModel.setProperty("/requestSubRoles", aSubRoles);
            oModel.setProperty("/newRequest/roleName", sDefaultSubRole);
        },

        // --- SECTOR 1: ADD ACCESS PROCESS ---
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
                approver: "Designated Role Owner",
                status: "Pending Approval",
                statusState: "Warning",
                statusIcon: "sap-icon://pending"
            });

            oModel.setProperty("/requestHistory", aHistory);
            oModel.setProperty("/newRequest/justification", "");

            MessageBox.success("Access Request " + sReqId + " for '" + oForm.roleName + "' submitted successfully! Routed for role owner approval.", {
                title: "Request Submitted",
                onClose: () => {
                    // Navigate to My Requests sector automatically to track progress
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

        // --- SECTOR 2: REMOVE ACCESS PROCESS ---
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
                            approver: "IAM Security Board",
                            status: "Revocation Pending",
                            statusState: "Error",
                            statusIcon: "sap-icon://pending"
                        });

                        oModel.setProperty("/requestHistory", aHistory);
                        MessageToast.show("Revocation Request " + sReqId + " submitted successfully.");

                        // Navigate to My Requests sector automatically
                        const oTabBar = this.byId("accessIconTabBar");
                        oTabBar.setSelectedKey("myRequests");
                    }
                }
            });
        },

        // --- SECTOR 3: MY ACCESS SEARCH & DETAILS ---
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

        // --- SECTOR 4: MY REQUESTS SEARCH & EXPORT ---
        onSearchRequests(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("requestId", FilterOperator.Contains, sQuery),
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
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
