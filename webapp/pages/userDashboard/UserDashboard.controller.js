sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("kyra001.pages.userDashboard.UserDashboard", {
        onInit() {
        },

        onLogout() {
            const oRouter = this.getOwnerComponent().getRouter();

            MessageBox.confirm("Are you sure you want to sign out of User Portal?", {
                title: "Sign Out Confirmation",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        if (window.KyraAuthManager && typeof window.KyraAuthManager.clearSession === "function") {
                            window.KyraAuthManager.clearSession();
                        }
                        sessionStorage.clear();
                        MessageToast.show("Signed out successfully.");
                        oRouter.navTo("Login", {}, true);
                    }
                }
            });
        },

        onRefreshData() {
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Refreshing Dashboard Data...",
                    subtitle: "Synchronizing user metrics, requests, and activity status...",
                    duration: 1000
                });
            }
            setTimeout(() => {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                }
                MessageToast.show("User metrics refreshed!");
            }, 700);
        },

        onTilePress(oEvent) {
            const sHeader = oEvent.getSource().getHeader();
            MessageToast.show("Opening " + sHeader + "...");
        },

        onQuickAction(oEvent) {
            const sText = oEvent.getSource().getText();
            MessageToast.show("Action triggered: " + sText);
        }
    });
});
