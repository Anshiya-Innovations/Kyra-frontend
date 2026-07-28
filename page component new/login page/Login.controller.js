sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox",
    "sap/m/Text"
], (Controller, JSONModel, MessageToast, Dialog, Button, Label, Input, VBox, Text) => {
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

    return Controller.extend("kyra001.pages.login.Login", {
        onInit() {
            const sInitialAdminRole = "System Administrator";
            const aInitialSubRoles = oSubRolesMap[sInitialAdminRole];
            const sInitialSubRole = aInitialSubRoles[0].key;

            const oModel = new JSONModel({
                adminRole: sInitialAdminRole,
                subRole: sInitialSubRole,
                availableSubRoles: aInitialSubRoles,
                userId: "",
                password: "",
                rememberMe: true,
                showPassword: false,
                isBusy: false,
                hasError: false,
                errorMessage: "",
                idLabel: sInitialSubRole + " ID",
                idPlaceholder: "Enter " + sInitialSubRole + " ID",
                idState: "None",
                idStateText: "",
                passwordState: "None",
                passwordStateText: ""
            });

            this.getView().setModel(oModel, "login");
        },

        onAdminRoleChange(oEvent) {
            const sSelectedAdminRole = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("login");

            const aSubRoles = oSubRolesMap[sSelectedAdminRole] || [];
            const sDefaultSubRole = aSubRoles.length > 0 ? aSubRoles[0].key : "";

            oModel.setProperty("/adminRole", sSelectedAdminRole);
            oModel.setProperty("/availableSubRoles", aSubRoles);
            oModel.setProperty("/subRole", sDefaultSubRole);
            oModel.setProperty("/idLabel", sDefaultSubRole + " ID");
            oModel.setProperty("/idPlaceholder", "Enter " + sDefaultSubRole + " ID");

            this._resetErrorStates();
        },

        onSubRoleChange(oEvent) {
            const sSelectedSubRole = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("login");

            oModel.setProperty("/subRole", sSelectedSubRole);
            oModel.setProperty("/idLabel", sSelectedSubRole + " ID");
            oModel.setProperty("/idPlaceholder", "Enter " + sSelectedSubRole + " ID");

            this._resetErrorStates();
        },

        _resetErrorStates() {
            const oModel = this.getView().getModel("login");
            oModel.setProperty("/idState", "None");
            oModel.setProperty("/idStateText", "");
            oModel.setProperty("/passwordState", "None");
            oModel.setProperty("/passwordStateText", "");
            oModel.setProperty("/hasError", false);
            oModel.setProperty("/errorMessage", "");
        },

        onInputChange() {
            const oModel = this.getView().getModel("login");
            const sUserId = oModel.getProperty("/userId");
            const sPassword = oModel.getProperty("/password");

            if (sUserId && sUserId.trim().length > 0) {
                oModel.setProperty("/idState", "None");
                oModel.setProperty("/idStateText", "");
            }
            if (sPassword && sPassword.trim().length > 0) {
                oModel.setProperty("/passwordState", "None");
                oModel.setProperty("/passwordStateText", "");
            }

            if (sUserId && sPassword && oModel.getProperty("/hasError")) {
                oModel.setProperty("/hasError", false);
                oModel.setProperty("/errorMessage", "");
            }
        },

        onDismissError() {
            const oModel = this.getView().getModel("login");
            oModel.setProperty("/hasError", false);
            oModel.setProperty("/errorMessage", "");
        },

        onTogglePasswordVisibility() {
            const oModel = this.getView().getModel("login");
            const bCurrentState = oModel.getProperty("/showPassword");
            oModel.setProperty("/showPassword", !bCurrentState);
        },

        onLogin() {
            const oView = this.getView();
            const oModel = oView.getModel("login");

            const sAdminRole = oModel.getProperty("/adminRole");
            const sSubRole = oModel.getProperty("/subRole");
            const sEffectiveTitle = sSubRole || sAdminRole;
            const sUserId = (oModel.getProperty("/userId") || "").trim();
            const sPassword = (oModel.getProperty("/password") || "").trim();
            const bRemember = oModel.getProperty("/rememberMe");

            this._resetErrorStates();

            // 1. Check ID Field presence
            if (!sUserId) {
                oModel.setProperty("/idState", "Error");
                oModel.setProperty("/hasError", true);
                oModel.setProperty("/errorMessage", "Please enter your " + sEffectiveTitle + " ID.");
                return;
            }

            // 2. Check Password presence
            if (!sPassword) {
                oModel.setProperty("/passwordState", "Error");
                oModel.setProperty("/hasError", true);
                oModel.setProperty("/errorMessage", "Please enter your password.");
                return;
            }

            // 3. Clear error state and start loading
            this._resetErrorStates();
            oModel.setProperty("/isBusy", true);

            if (bRemember) {
                localStorage.setItem("kyra_remember_role", sEffectiveTitle);
                localStorage.setItem("kyra_remember_id", sUserId);
            } else {
                localStorage.removeItem("kyra_remember_role");
                localStorage.removeItem("kyra_remember_id");
            }

            sessionStorage.setItem("kyra_active_user", sUserId);
            sessionStorage.setItem("kyra_active_role", sEffectiveTitle);

            // Navigate cleanly to Admin Dashboard
            setTimeout(() => {
                oModel.setProperty("/isBusy", false);
                MessageToast.show("Login successful! Welcome back, " + sUserId);

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("AdminDashboard");
            }, 300);
        },

        onForgotPassword() {
            const oView = this.getView();
            const oLoginModel = oView.getModel("login");
            const sAdminRole = oLoginModel.getProperty("/adminRole") || "System Administrator";
            const sSubRole = oLoginModel.getProperty("/subRole") || "IT Developers";
            const sEffectiveTitle = sSubRole || sAdminRole;
            const sCurrentId = oLoginModel.getProperty("/userId") || "";

            if (!this._oForgotPasswordDialog) {
                const oInput = new Input({
                    id: "forgotEmailInput",
                    placeholder: "Enter ID or Email",
                    value: sCurrentId,
                    width: "100%"
                });

                this._oForgotPasswordDialog = new Dialog({
                    title: "Reset Password",
                    type: "Message",
                    contentWidth: "360px",
                    content: [
                        new VBox({
                            class: "sapUiSmallMargin",
                            items: [
                                new Text({
                                    text: "Enter your registered ID or email to receive password reset instructions.",
                                    class: "sapUiSmallMarginBottom"
                                }),
                                new Label({
                                    text: sEffectiveTitle + " ID / Email",
                                    required: true,
                                    labelFor: oInput
                                }),
                                oInput
                            ]
                        })
                    ],
                    beginButton: new Button({
                        text: "Send Reset Link",
                        type: "Emphasized",
                        press: () => {
                            const sVal = oInput.getValue().trim();
                            if (!sVal) {
                                oInput.setValueState("Error");
                                oInput.setValueStateText("ID or Email is required.");
                                return;
                            }
                            oInput.setValueState("None");
                            this._oForgotPasswordDialog.close();
                            MessageToast.show("Password reset link sent to your registered contact!", { duration: 4000 });
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: () => {
                            this._oForgotPasswordDialog.close();
                        }
                    })
                });

                oView.addDependent(this._oForgotPasswordDialog);
            } else {
                const oInput = sap.ui.getCore().byId("forgotEmailInput");
                if (oInput) {
                    oInput.setValue(sCurrentId);
                    oInput.setValueState("None");
                }
            }

            this._oForgotPasswordDialog.open();
        }
    });
});
