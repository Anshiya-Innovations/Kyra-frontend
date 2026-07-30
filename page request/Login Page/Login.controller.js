sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("kyra001.pages.login.Login", {
        onLoginSubmit() {
            const sUserId = this.byId("loginUserIdInput").getValue();
            const sPassword = this.byId("loginPasswordInput").getValue();

            if (!sUserId || !sPassword) {
                MessageBox.error("Please enter both User ID and Password.");
                return;
            }

            MessageToast.show("Welcome back to KYRA Enterprise Portal!");
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        }
    });
});
