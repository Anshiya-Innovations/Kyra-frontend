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

    return Controller.extend("kyra001.pages.login.Login", {
        onInit() {
            const sSavedRole = localStorage.getItem("kyra_remember_role") || "Employee";
            const bIsAdmin = sSavedRole === "Administrator" || sSavedRole === "Admin";

            const oModel = new JSONModel({
                isEmployeeMode: !bIsAdmin,
                role: bIsAdmin ? "Administrator" : "Employee",
                userId: "",
                password: "",
                rememberMe: true,
                showPassword: false,
                isBusy: false,
                hasError: false,
                errorMessage: "",
                idLabel: bIsAdmin ? "Administrator ID" : "Employee ID",
                idPlaceholder: bIsAdmin ? "Enter Administrator ID" : "Enter Employee ID",
                idState: "None",
                idStateText: "",
                passwordState: "None",
                passwordStateText: ""
            });

            this.getView().setModel(oModel, "login");
        },

        onSelectEmployeeMode() {
            const oModel = this.getView().getModel("login");
            oModel.setProperty("/isEmployeeMode", true);
            oModel.setProperty("/role", "Employee");
            oModel.setProperty("/idLabel", "Employee ID");
            oModel.setProperty("/idPlaceholder", "Enter Employee ID");
            oModel.setProperty("/userId", "");
            oModel.setProperty("/password", "");

            this._resetErrorStates();
        },

        onSelectAdminMode() {
            const oModel = this.getView().getModel("login");
            oModel.setProperty("/isEmployeeMode", false);
            oModel.setProperty("/role", "Administrator");
            oModel.setProperty("/idLabel", "Administrator ID");
            oModel.setProperty("/idPlaceholder", "Enter Administrator ID");
            oModel.setProperty("/userId", "");
            oModel.setProperty("/password", "");

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

            const sRole = oModel.getProperty("/role");
            const sUserId = (oModel.getProperty("/userId") || "").trim();
            const sPassword = (oModel.getProperty("/password") || "").trim();
            const bRemember = oModel.getProperty("/rememberMe");

            this._resetErrorStates();

            // 1. Check ID Field presence
            if (!sUserId) {
                const sErrText = sRole === "Administrator" ? "Please enter your Administrator ID." : "Please enter your Employee ID.";
                oModel.setProperty("/idState", "Error");
                oModel.setProperty("/hasError", true);
                oModel.setProperty("/errorMessage", sErrText);
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
                localStorage.setItem("kyra_remember_role", sRole);
                localStorage.setItem("kyra_remember_id", sUserId);
            } else {
                localStorage.removeItem("kyra_remember_role");
                localStorage.removeItem("kyra_remember_id");
            }

            sessionStorage.setItem("kyra_active_user", sUserId);
            sessionStorage.setItem("kyra_active_role", sRole);

            // Navigate cleanly to target Dashboard
            setTimeout(() => {
                oModel.setProperty("/isBusy", false);
                MessageToast.show("Login successful! Welcome back, " + sUserId);

                const oRouter = this.getOwnerComponent().getRouter();
                if (sRole === "Employee") {
                    oRouter.navTo("UserDashboard");
                } else {
                    oRouter.navTo("AdminDashboard");
                }
            }, 300);
        },

        onForgotPassword() {
            const oView = this.getView();
            const oLoginModel = oView.getModel("login");
            const sCurrentRole = oLoginModel.getProperty("/role") || "Employee";
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
                                    text: sCurrentRole === "Administrator" ? "Administrator ID / Email" : "Employee ID / Email",
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
