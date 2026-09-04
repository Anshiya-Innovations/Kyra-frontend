sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "kyra001/model/models",
    "kyra001/model/KyraDialog",
    "kyra001/model/KyraLoader",
    "sap/m/ComboBoxBase",
    "sap/m/Select",
    "sap/m/PlacementType"
], (UIComponent, JSONModel, models, KyraDialog, KyraLoader, ComboBoxBase, Select, PlacementType) => {
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
            this._setupDropdownPlacementEnhancement();

            // enable routing
            const oRouter = this.getRouter();
            oRouter.initialize();

            // Always display Login screen by default on initial launch
            const sCurrentHash = window.location.hash || "";
            if (!sCurrentHash || sCurrentHash === "#" || sCurrentHash === "#app-preview" || sCurrentHash === "#/app-preview" || sCurrentHash.includes("app-preview")) {
                try {
                    oRouter.navTo("Login", {}, true);
                } catch(e) {}
            }
        },

        
        _setupDropdownPlacementEnhancement() {
            // Global positioning enhancement: ensures ALL dropdown popovers open strictly downwards,
            // never flip upwards over form headers/labels, and match opener dropdown box width and coordinates.
            try {
                const snapPickerToOpener = (oControl, oPicker) => {
                    if (!oControl || !oPicker) return;
                    try {
                        oPicker.setPlacement("Bottom");
                        oPicker.setShowArrow(false);
                        oPicker.setOffsetX(0);
                        oPicker.setOffsetY(2);
                    } catch(e) {}

                    const alignFn = () => {
                        try {
                            const oDom = oControl.getDomRef();
                            const oPickerDom = oPicker.getDomRef();
                            if (oDom && oPickerDom) {
                                const rect = oDom.getBoundingClientRect();
                                const iWidth = rect.width;
                                if (iWidth > 0) {
                                    oPickerDom.style.width = iWidth + "px";
                                    oPickerDom.style.minWidth = iWidth + "px";
                                    oPickerDom.style.maxWidth = iWidth + "px";
                                    oPickerDom.style.left = rect.left + "px";
                                    oPickerDom.style.top = (rect.bottom + 2) + "px";
                                }
                            }
                        } catch(e) {}
                    };

                    if (!oPicker._kyraSnapped) {
                        oPicker._kyraSnapped = true;
                        oPicker.attachBeforeOpen(function() {
                            try {
                                this.setPlacement("Bottom");
                                this.setShowArrow(false);
                                this.setOffsetX(0);
                                this.setOffsetY(2);
                                const oDom = oControl.getDomRef();
                                if (oDom) {
                                    const iWidth = oDom.offsetWidth;
                                    if (iWidth > 0) {
                                        this.setContentWidth(iWidth + "px");
                                        this.setContentMinWidth(iWidth + "px");
                                        this.setContentMaxWidth(iWidth + "px");
                                    }
                                }
                            } catch(e) {}
                        });
                        oPicker.attachAfterOpen(() => {
                            alignFn();
                            setTimeout(alignFn, 10);
                            setTimeout(alignFn, 40);
                            setTimeout(alignFn, 100);
                        });
                    }
                };

                if (typeof ComboBoxBase !== "undefined" && ComboBoxBase && ComboBoxBase.prototype) {
                    const origGetPicker = ComboBoxBase.prototype.getPicker;
                    ComboBoxBase.prototype.getPicker = function() {
                        const oPicker = origGetPicker.apply(this, arguments);
                        snapPickerToOpener(this, oPicker);
                        return oPicker;
                    };
                    const origOpen = ComboBoxBase.prototype.open;
                    ComboBoxBase.prototype.open = function() {
                        const oPicker = this.getPicker();
                        snapPickerToOpener(this, oPicker);
                        return origOpen.apply(this, arguments);
                    };
                }

                if (typeof Select !== "undefined" && Select && Select.prototype) {
                    const origGetSelectPicker = Select.prototype.getPicker;
                    Select.prototype.getPicker = function() {
                        const oPicker = origGetSelectPicker.apply(this, arguments);
                        snapPickerToOpener(this, oPicker);
                        return oPicker;
                    };
                    const origOpenSelect = Select.prototype.open;
                    Select.prototype.open = function() {
                        const oPicker = this.getPicker();
                        snapPickerToOpener(this, oPicker);
                        return origOpenSelect.apply(this, arguments);
                    };
                }
            } catch(err) {
                console.warn("Dropdown placement setup error:", err);
            }
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
