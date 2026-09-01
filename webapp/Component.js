sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "kyra001/model/models",
    "kyra001/model/KyraDialog",
    "kyra001/model/KyraLoader"
], (UIComponent, JSONModel, models, KyraDialog, KyraLoader) => {
    "use strict";

    return UIComponent.extend("kyra001.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set global safe access model
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Stake001";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Approver";
            const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Approver 1" || sActiveRole === "Approver 2" || sActiveRole === "Compliance Approver" || sActiveRole === "Compliance Reviewer" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("compliance"))));

            const oGlobalAccessModel = new JSONModel({
                activeUser: sActiveUser,
                activeRole: sActiveRole,
                isApproverPersona: bIsApprover,
                pendingRequests: [],
                processedRequests: [],
                pendingAccessRequests: [],
                pendingRevokeRequests: [],
                activeRoles: [],
                userAccessList: [],
                activeSodConflictsList: [],
                pendingOnlySodConflictsList: [],
                batchSodConflictsList: [],
                selectedRequestSodActiveConflicts: [],
                selectedRequestSodPendingConflicts: [],
                selectedRequestSodBatchConflicts: [],
                filteredNotificationsList: [],
                restrictedRecords: [],
                addAccessSelectedSystems: [],
                addAccessSelectedPersonas: []
            });
            this.setModel(oGlobalAccessModel, "accessModel");

            // Setup modern Loading Screen enhancement
            this._setupModernBusyIndicator();

            // enable routing
            this.getRouter().initialize();
        },

        _setupModernBusyIndicator() {
            // Bridge sap.ui.core.BusyIndicator globally so every action across the whole project uses the modern centered card loader
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                const origShow = sap.ui.core.BusyIndicator.show;
                const origHide = sap.ui.core.BusyIndicator.hide;
                sap.ui.core.BusyIndicator.show = function(iDelay) {
                    if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                        if (!window.KyraLoader.isShowing()) {
                            window.KyraLoader.show({
                                title: "Processing Request...",
                                subtitle: "Verifying and synchronizing governance data..."
                            });
                        }
                    }
                    if (typeof origShow === "function") {
                        origShow.apply(this, arguments);
                    }
                };
                sap.ui.core.BusyIndicator.hide = function() {
                    if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                        window.KyraLoader.hide();
                    }
                    if (typeof origHide === "function") {
                        origHide.apply(this, arguments);
                    }
                };
            }
        }
    });
});
