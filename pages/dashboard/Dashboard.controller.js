sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("kyra001.pages.dashboard.Dashboard", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Dashboard").attachPatternMatched(this._onRouteMatched, this);

            const oModel = new JSONModel({
                userEmpId: "EMP10045",
                userInitials: "EM",
                activities: [
                    {
                        timestamp: "Today, 17:05",
                        description: "User Authentication & Portal Login",
                        source: "192.168.1.104 (Web)",
                        status: "Success",
                        state: "Success"
                    },
                    {
                        timestamp: "Today, 14:20",
                        description: "Security Clearance Verification",
                        source: "System SSO",
                        status: "Verified",
                        state: "Success"
                    },
                    {
                        timestamp: "Yesterday, 09:15",
                        description: "Q3 Financial Analytics Export",
                        source: "Portal BI",
                        status: "Completed",
                        state: "Information"
                    },
                    {
                        timestamp: "21 Jul 2026",
                        description: "Password Update Request",
                        source: "Self-Service",
                        status: "Approved",
                        state: "Success"
                    }
                ]
            });

            this.getView().setModel(oModel, "dashboard");
        },

        formatWelcome(sMsg, sUser) {
            if (!sMsg) return "";
            return sMsg.replace("{0}", sUser || "");
        },

        _onRouteMatched() {
            const sUser = sessionStorage.getItem("kyra_active_user") || "EMP10045";
            const oModel = this.getView().getModel("dashboard");
            
            oModel.setProperty("/userEmpId", sUser);
            
            // Calculate initials
            let sInitials = "US";
            if (sUser) {
                const sClean = sUser.replace(/[^a-zA-Z0-9]/g, "");
                sInitials = sClean.substring(0, 2).toUpperCase();
            }
            oModel.setProperty("/userInitials", sInitials);
        },

        onLogout() {
            const oRouter = this.getOwnerComponent().getRouter();

            MessageBox.confirm("Are you sure you want to sign out of KYRA Portal?", {
                title: "Sign Out Confirmation",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        sessionStorage.removeItem("kyra_active_user");
                        MessageToast.show("Signed out successfully.");
                        oRouter.navTo("Login");
                    }
                }
            });
        },

        onRefreshData() {
            MessageToast.show("Dashboard metrics updated!");
        },

        onTilePress(oEvent) {
            const sHeader = oEvent.getSource().getHeader();
            MessageToast.show("Opening " + sHeader + " module...");
        },

        onQuickAction(oEvent) {
            const sText = oEvent.getSource().getText();
            MessageToast.show("Action triggered: " + sText);
        }
    });
});
