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
            const oModel = new JSONModel({
                selectedRole: "Requester",
                userId: "",
                password: "",
                rememberMe: true,
                showPassword: false,
                isBusy: false,
                hasError: false,
                errorMessage: "",
                idLabel: "Requester ID",
                idPlaceholder: "Enter Requester ID",
                idState: "None",
                idStateText: "",
                passwordState: "None",
                passwordStateText: ""
            });

            this.getView().setModel(oModel, "login");

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Login").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched() {
            const oModel = this.getView().getModel("login");
            if (oModel) {
                oModel.setProperty("/selectedRole", "Requester");
                oModel.setProperty("/userId", "");
                oModel.setProperty("/password", "");
                oModel.setProperty("/hasError", false);
                oModel.setProperty("/errorMessage", "");
                oModel.setProperty("/idLabel", "Requester ID");
                oModel.setProperty("/idPlaceholder", "Enter Requester ID");
                oModel.setProperty("/idState", "None");
                oModel.setProperty("/idStateText", "");
                oModel.setProperty("/passwordState", "None");
                oModel.setProperty("/passwordStateText", "");
            }

            if (this.byId("idInput")) {
                this.byId("idInput").setValue("");
            }
            if (this.byId("passwordInput")) {
                this.byId("passwordInput").setValue("");
            }
        },

        onRoleChange(oEvent) {
            const sSelectedRole = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("login");

            oModel.setProperty("/selectedRole", sSelectedRole);
            oModel.setProperty("/idLabel", sSelectedRole + " ID");
            oModel.setProperty("/idPlaceholder", "Enter " + sSelectedRole + " ID");

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
            const oComponent = this.getOwnerComponent();

            const sEffectiveTitle = oModel.getProperty("/selectedRole") || "Requester";
            let sUserId = (oView.byId("idInput") ? oView.byId("idInput").getValue() : "") || oModel.getProperty("/userId") || "";
            sUserId = sUserId.trim() || "Dev001";
            let sPassword = (oView.byId("passwordInput") ? oView.byId("passwordInput").getValue() : "") || oModel.getProperty("/password") || "";
            sPassword = sPassword.trim() || "password";

            oModel.setProperty("/userId", sUserId);
            oModel.setProperty("/password", sPassword);
            const bRemember = oModel.getProperty("/rememberMe");

            this._resetErrorStates();
            oModel.setProperty("/isBusy", false);

            if (bRemember) {
                localStorage.setItem("kyra_remember_role", sEffectiveTitle);
                localStorage.setItem("kyra_remember_id", sUserId);
            } else {
                localStorage.removeItem("kyra_remember_role");
                localStorage.removeItem("kyra_remember_id");
            }

            const userUuid = "dev-user-001-uuid";
            sessionStorage.setItem("kyra_active_user", sUserId);
            sessionStorage.setItem("kyra_active_user_uuid", userUuid);
            sessionStorage.setItem("kyra_active_role", sEffectiveTitle);

            const oAccessModel = oComponent ? oComponent.getModel("accessModel") : null;
            if (oAccessModel) {
                oAccessModel.setProperty("/activeUser", sUserId);
                oAccessModel.setProperty("/activeRole", sEffectiveTitle);
                oAccessModel.setProperty("/isApproverPersona", sEffectiveTitle === "Approver");
            }

            MessageToast.show(`Welcome, ${sUserId}! Logged in as ${sEffectiveTitle}`);

            // Seamless, instant navigation to the dashboard
            const oRouter = oComponent ? oComponent.getRouter() : null;
            if (oRouter) {
                oRouter.navTo("AccessPage");
            }
        },

        onForgotPassword() {
            const oView = this.getView();
            const oLoginModel = oView.getModel("login");
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            const sEffectiveTitle = oLoginModel.getProperty("/selectedRole") || "Requester";
            const sCurrentId = oLoginModel.getProperty("/userId") || "";

            if (!this._oForgotPasswordDialog) {
                const oInput = new Input({
                    id: "forgotEmailInput",
                    placeholder: "Enter ID or Email",
                    value: sCurrentId,
                    width: "100%"
                });

                this._oForgotPasswordDialog = new Dialog({
                    title: oResourceBundle.getText("forgotPasswordTitle"),
                    type: "Message",
                    contentWidth: "360px",
                    content: [
                        new VBox({
                            class: "sapUiSmallMargin",
                            items: [
                                new Text({
                                    text: oResourceBundle.getText("forgotPasswordInstruction"),
                                    class: "sapUiSmallMarginBottom"
                                }),
                                new Label({
                                    text: oResourceBundle.getText("forgotPasswordIdEmailLabel", [sEffectiveTitle]),
                                    required: true,
                                    labelFor: oInput
                                }),
                                oInput
                            ]
                        })
                    ],
                    beginButton: new Button({
                        text: oResourceBundle.getText("btnSendResetLink"),
                        type: "Emphasized",
                        press: () => {
                            const sVal = oInput.getValue().trim();
                            if (!sVal) {
                                oInput.setValueState("Error");
                                oInput.setValueStateText(oResourceBundle.getText("errForgotPasswordEmailRequired"));
                                        return;
                                    }
                                    oInput.setValueState("None");
                                    this._oForgotPasswordDialog.close();
                                    MessageToast.show(oResourceBundle.getText("msgForgotPasswordLinkSent"), { duration: 4000 });
                                }
                            }),
                            endButton: new Button({
                                text: oResourceBundle.getText("btnCancel"),
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
