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
            const sUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sRole = sessionStorage.getItem("kyra_active_role") || "IT Developers";
            const sUserUuid = sessionStorage.getItem("kyra_active_user_uuid");

            // Find category for active role
            let sRoleCategory = "System Administrator";
            if (oSubRolesMap["System Owners"].some(r => r.key === sRole)) {
                sRoleCategory = "System Owners";
            } else if (oSubRolesMap["Stakeholders"].some(r => r.key === sRole)) {
                sRoleCategory = "Stakeholders";
            }

            const aInitialSubRoles = oSubRolesMap["System Administrator"];

            const oModel = new JSONModel({
                userId: sUser,
                activeRole: sRole,
                userWelcomeTitle: "User Access Directory & Governance, " + sUser,
                isBusy: false,

                // 1. My Access Active Entitlements Data (Populated dynamically)
                activeRoles: [
                    {
                        system: "SAP BTP Cloud Platform",
                        roleName: sRole,
                        roleId: "KYRA_ROLE_" + sUser.toUpperCase(),
                        category: sRoleCategory,
                        grantedDate: new Date().toISOString().split("T")[0],
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2",
                        // Button defaults
                        removeButtonText: "Remove Access",
                        removeButtonIcon: "sap-icon://delete",
                        removeButtonType: "Reject",
                        removeButtonEnabled: true
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
                requestHistory: []
            });

            this.getView().setModel(oModel, "accessModel");

            // Fetch Roles and Systems lists once to resolve names on load
            this._loadMetadataAndRequests();
        },

        _loadMetadataAndRequests() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/isBusy", true);

            const oAuthModel = this.getOwnerComponent().getModel("auth");
            const oRolesBinding = oAuthModel.bindList("/Roles");
            const oSystemsBinding = oAuthModel.bindList("/Systems");

            Promise.all([
                oRolesBinding.requestContexts(0, 100),
                oSystemsBinding.requestContexts(0, 100)
            ]).then(([aRoleCtxs, aSysCtxs]) => {
                this._aRoles = aRoleCtxs.map(c => c.getObject());
                this._aSystems = aSysCtxs.map(c => c.getObject());

                // Update active roles list to match real systems mapped from DB
                const aActive = oModel.getProperty("/activeRoles");
                if (aActive.length > 0) {
                    const oMatchedRole = this._aRoles.find(r => r.name === aActive[0].roleName);
                    if (oMatchedRole) {
                        const oMatchedSys = this._aSystems.find(s => s.id === oMatchedRole.system_id);
                        if (oMatchedSys) {
                            aActive[0].system = oMatchedSys.name;
                            aActive[0].roleId = oMatchedRole.id.substring(0, 8).toUpperCase();
                            oModel.setProperty("/activeRoles", aActive);
                        }
                    }
                }

                this._loadUserRequests();
            }).catch(err => {
                oModel.setProperty("/isBusy", false);
                console.error("Failed to load metadata from database:", err);
            });
        },

        _loadUserRequests() {
            const oModel = this.getView().getModel("accessModel");
            const oAuthModel = this.getOwnerComponent().getModel("auth");
            const sUserUuid = sessionStorage.getItem("kyra_active_user_uuid");

            if (!sUserUuid) {
                oModel.setProperty("/isBusy", false);
                return;
            }

            // OData List Binding sorting by created_at ascending (oldest first, newest last)
            const oListBinding = oAuthModel.bindList("/Requests", null, null, [
                new Filter("requester_id", FilterOperator.EQ, sUserUuid)
            ], {
                $orderby: "created_at asc"
            });

            oListBinding.requestContexts(0, 100).then((aContexts) => {
                const aRequests = aContexts.map(oCtx => oCtx.getObject());
                
                // 1. Process and format requests audit log history
                const aMappedRequests = aRequests.map(req => {
                    const oRole = (this._aRoles || []).find(r => r.id === req.role_id) || {};
                    const oSystem = (this._aSystems || []).find(s => s.id === oRole.system_id) || {};
                    
                    let sDuration = "Permanent (Default)";
                    if (req.requested_duration_days === 30) {
                        sDuration = "30 Days (Temporary)";
                    } else if (req.requested_duration_days === 90) {
                        sDuration = "90 Days (Project)";
                    } else if (req.requested_duration_days === 365) {
                        sDuration = "Permanent (Default)";
                    }
                    
                    const bIsRevocation = req.reason && req.reason.includes("[REVOCATION]");
                    
                    let sStatusText = "Pending Approval";
                    let sStatusState = "Warning";
                    let sStatusIcon = "sap-icon://pending";
                    
                    if (req.status === "APPROVED") {
                        sStatusText = "Approved";
                        sStatusState = "Success";
                        sStatusIcon = "sap-icon://sys-enter-2";
                    } else if (req.status === "REJECTED") {
                        sStatusText = "Rejected";
                        sStatusState = "Error";
                        sStatusIcon = "sap-icon://status-error";
                    } else if (req.status === "CANCELLED") {
                        sStatusText = "Cancelled";
                        sStatusState = "None";
                        sStatusIcon = "sap-icon://decline";
                    } else if (req.status === "REVOKED") {
                        sStatusText = "Revoked";
                        sStatusState = "Error";
                        sStatusIcon = "sap-icon://status-error";
                    } else { // PENDING
                        if (bIsRevocation) {
                            sStatusText = "Revocation Pending";
                            sStatusState = "Error";
                            sStatusIcon = "sap-icon://pending";
                        } else {
                            sStatusText = "Pending Approval";
                            sStatusState = "Warning";
                            sStatusIcon = "sap-icon://pending";
                        }
                    }

                    return {
                        requestId: req.id ? req.id.substring(0, 8).toUpperCase() : "PENDING",
                        dbId: req.id,
                        type: bIsRevocation ? "Revocation" : "Addition",
                        system: oSystem.name || "Unknown System",
                        roleName: oRole.name || "Unknown Role",
                        submissionDate: req.created_at ? req.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        approver: req.status === "APPROVED" ? "IAM Security Board" : "Designated Role Owner",
                        status: sStatusText,
                        statusState: sStatusState,
                        statusIcon: sStatusIcon
                    };
                });

                // 2. Dynamically update entitlements list states based on current pending revocations in requests list
                const aActiveRoles = oModel.getProperty("/activeRoles") || [];
                const aUpdatedActiveRoles = aActiveRoles.map(role => {
                    const oMatchedRole = (this._aRoles || []).find(r => r.name === role.roleName);
                    if (oMatchedRole) {
                        // Check if a PENDING revocation request exists in DB for this role
                        const bPendingRevocation = aRequests.some(req => 
                            req.role_id === oMatchedRole.id && 
                            req.status === "PENDING" && 
                            req.reason && req.reason.includes("[REVOCATION]")
                        );

                        if (bPendingRevocation) {
                            return {
                                ...role,
                                status: "Pending Revocation",
                                statusState: "Error",
                                statusIcon: "sap-icon://pending",
                                removeButtonText: "Pending Revocation",
                                removeButtonIcon: "sap-icon://pending",
                                removeButtonType: "Warning",
                                removeButtonEnabled: false
                            };
                        }
                    }
                    return {
                        ...role,
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2",
                        removeButtonText: "Remove Access",
                        removeButtonIcon: "sap-icon://delete",
                        removeButtonType: "Reject",
                        removeButtonEnabled: true
                    };
                });

                oModel.setProperty("/activeRoles", aUpdatedActiveRoles);
                oModel.setProperty("/requestHistory", aMappedRequests);
                oModel.setProperty("/isBusy", false);
            }).catch(err => {
                oModel.setProperty("/isBusy", false);
                console.error("Failed to load requests from database:", err);
            });
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
            const sUserUuid = sessionStorage.getItem("kyra_active_user_uuid");

            if (!oForm.justification || oForm.justification.trim().length === 0) {
                MessageBox.error("Please provide a business justification before submitting your access request.");
                return;
            }

            if (!this._aRoles || this._aRoles.length === 0) {
                MessageBox.error("Role metadata is not yet loaded from the database. Please reload the page or click the Refresh button.");
                return;
            }

            // Find matching role_id from database Roles list
            const oRole = this._aRoles.find(r => r.name === oForm.roleName);
            if (!oRole) {
                MessageBox.error("The requested role '" + oForm.roleName + "' is not registered in the database.");
                return;
            }

            oModel.setProperty("/isBusy", true);

            const oAuthModel = this.getOwnerComponent().getModel("auth");
            const oListBinding = oAuthModel.bindList("/Requests");
            
            // Map duration: 365 days for Permanent instead of null
            let iDuration = 365;
            if (oForm.duration.includes("30")) {
                iDuration = 30;
            } else if (oForm.duration.includes("90")) {
                iDuration = 90;
            }

            const oContext = oListBinding.create({
                requester_id: sUserUuid,
                role_id: oRole.id,
                reason: oForm.justification,
                status: "PENDING",
                requested_duration_days: iDuration,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            oContext.created().then(() => {
                oModel.setProperty("/newRequest/justification", "");
                this._loadUserRequests();
                MessageBox.success("Access Request submitted successfully to the database!", {
                    title: "Request Submitted",
                    onClose: () => {
                        const oTabBar = this.byId("accessIconTabBar");
                        oTabBar.setSelectedKey("myRequests");
                    }
                });
            }).catch(err => {
                oModel.setProperty("/isBusy", false);
                MessageBox.error("Failed to submit request: " + err.message);
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
            const sUserUuid = sessionStorage.getItem("kyra_active_user_uuid");

            MessageBox.confirm("Are you sure you want to request revocation for role '" + oData.roleName + "' on " + oData.system + "?", {
                title: "Confirm Access Removal",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const oRole = (this._aRoles || []).find(r => r.name === oData.roleName);
                        if (!oRole) {
                            MessageBox.error("Role could not be matched in database.");
                            return;
                        }

                        oModel.setProperty("/isBusy", true);

                        const oAuthModel = this.getOwnerComponent().getModel("auth");
                        const oListBinding = oAuthModel.bindList("/Requests");

                        const oContext = oListBinding.create({
                            requester_id: sUserUuid,
                            role_id: oRole.id,
                            reason: "[REVOCATION] Request to revoke access entitlement.",
                            status: "PENDING",
                            requested_duration_days: null,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });

                        oContext.created().then(() => {
                            this._loadUserRequests();
                            MessageBox.success("Revocation Request submitted successfully to the database!", {
                                title: "Request Submitted",
                                onClose: () => {
                                    const oTabBar = this.byId("accessIconTabBar");
                                    oTabBar.setSelectedKey("myRequests");
                                }
                            });
                        }).catch(err => {
                            oModel.setProperty("/isBusy", false);
                            MessageBox.error("Failed to submit revocation: " + err.message);
                        });
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
            this._loadMetadataAndRequests();
            MessageToast.show("Access page data refreshed.");
        },

        onLogout() {
            MessageBox.confirm("Are you sure you want to sign out?", {
                title: "Sign Out",
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        sessionStorage.removeItem("kyra_active_user");
                        sessionStorage.removeItem("kyra_active_user_uuid");
                        sessionStorage.removeItem("kyra_active_role");
                        localStorage.removeItem("kyra_remember_role");
                        localStorage.removeItem("kyra_remember_id");
                        MessageToast.show("Session ended.");
                        this.getOwnerComponent().getRouter().navTo("Login");
                    }
                }
            });
        }
    });
});
