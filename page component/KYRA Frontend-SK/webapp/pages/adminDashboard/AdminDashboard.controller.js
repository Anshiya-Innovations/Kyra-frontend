sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("kyra001.pages.adminDashboard.AdminDashboard", {
        onInit() {
        },

        onLogout() {
            const oRouter = this.getOwnerComponent().getRouter();

            MessageBox.confirm("Are you sure you want to sign out of Admin Console?", {
                title: "Sign Out Confirmation",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        sessionStorage.removeItem("kyra_active_role");
                        MessageToast.show("Signed out successfully.");
                        oRouter.navTo("Login");
                    }
                }
            });
        },

        onRefreshData() {
            MessageToast.show("System administration metrics refreshed!");
        },

        onTilePress(oEvent) {
            const sHeader = oEvent.getSource().getHeader();
            MessageToast.show("Opening " + sHeader + " module...");
        },

        onQuickAction(oEvent) {
            const sText = oEvent.getSource().getText();
            MessageToast.show("Admin action triggered: " + sText);
        }
    });
});
