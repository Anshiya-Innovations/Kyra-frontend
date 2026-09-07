sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "kyra001/model/models",
    "kyra001/model/KyraDialog",
    "kyra001/model/KyraLoader",
    "kyra001/model/AuthManager",
    "sap/m/MultiComboBox",
    "sap/m/ComboBox",
    "sap/m/ComboBoxBase",
    "sap/m/Select",
    "sap/m/PlacementType",
    "sap/m/Tokenizer"
], (UIComponent, JSONModel, models, KyraDialog, KyraLoader, AuthManager, MultiComboBox, ComboBox, ComboBoxBase, Select, PlacementType, Tokenizer) => {
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

            // Restore and validate authentication session state on startup / reload
            const bIsAuthenticated = AuthManager.isAuthenticated();
            const oUserInfo = AuthManager.getUserInfo();
            const sActiveUser = bIsAuthenticated ? oUserInfo.userId : "";
            const sActiveRole = bIsAuthenticated ? oUserInfo.role : "Requester";
            const bIsApprover = bIsAuthenticated ? oUserInfo.isApproverPersona : false;

            const oGlobalAccessModel = new JSONModel({
                activeUser: sActiveUser,
                activeRole: sActiveRole,
                isApproverPersona: bIsApprover,
                isAuthenticated: bIsAuthenticated,
                pendingRequests: [],
                processedRequests: [],
                approverPendingTab: "accessRequests",
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

            // Setup modern Loading Screen, Dialogs & Dropdown positioning/multi-select enhancements
            this._setupModernBusyIndicator();
            this._setupModernDialogs();
            this._setupDropdownPlacementEnhancement();

            // Enable routing with Route Guards & Session Persistence
            const oRouter = this.getRouter();

            // Global Route Guard: Keeps users on current protected page on refresh, redirects only if unauthenticated
            oRouter.attachBeforeRouteMatched((oEvent) => {
                const sRouteName = oEvent.getParameter("name");
                const oArgs = oEvent.getParameter("arguments") || {};
                const bAuth = AuthManager.isAuthenticated();

                // 1. Unauthenticated user trying to access protected route -> save intended route & redirect to Login
                if (AuthManager.isProtectedRoute(sRouteName)) {
                    if (!bAuth) {
                        console.warn("[Kyra Auth Guard] Blocked unauthenticated route access:", sRouteName);
                        try {
                            sessionStorage.setItem("kyra_redirect_route", sRouteName);
                            sessionStorage.setItem("kyra_redirect_args", JSON.stringify(oArgs));
                        } catch(e) {}
                        oRouter.navTo("Login", {}, true);
                        return;
                    }
                }

                // 2. Authenticated user opening Login page directly -> redirect to intended route or AccessPage
                if (bAuth && (sRouteName === "Login" || sRouteName === "AppPreviewLogin")) {
                    const sSavedRoute = sessionStorage.getItem("kyra_redirect_route");
                    const sSavedArgs = sessionStorage.getItem("kyra_redirect_args");
                    sessionStorage.removeItem("kyra_redirect_route");
                    sessionStorage.removeItem("kyra_redirect_args");

                    if (sSavedRoute && sSavedRoute !== "Login" && sSavedRoute !== "AppPreviewLogin") {
                        try {
                            const oParsedArgs = sSavedArgs ? JSON.parse(sSavedArgs) : {};
                            oRouter.navTo(sSavedRoute, oParsedArgs, true);
                            return;
                        } catch(e) {}
                    }

                    // Otherwise direct to primary portal AccessPage
                    oRouter.navTo("AccessPage", {}, true);
                }
            });

            oRouter.initialize();

            // Handle initial root / preview URL launch without disrupting active subroutes
            const sCurrentHash = window.location.hash || "";
            const bPureRoot = !sCurrentHash || sCurrentHash === "#" || sCurrentHash === "#app-preview" || sCurrentHash === "#/app-preview" || sCurrentHash === "#/Login";
            if (bPureRoot) {
                if (bIsAuthenticated) {
                    oRouter.navTo("AccessPage", {}, true);
                } else {
                    try {
                        oRouter.navTo("Login", {}, true);
                    } catch(e) {}
                }
            }
        },

        _setupDropdownPlacementEnhancement() {
            // Global positioning & behavior enhancement:
            // 1. Ensures ALL dropdown popovers open strictly downwards matching opener width.
            // 2. Completely removes horizontal scrollbars at the bottom of dropdowns.
            // 3. Prevents automatic close on MultiComboBox during item selections - manual close only!
            try {
                // Dynamic multi-select text display helper:
                // "Show all selected values inside the field, separated by commas.
                // If many items are selected and there is not enough space, show the first selected value followed by '+ X more'."
                const syncMultiDisplay = function(oMCB) {
                    if (!oMCB) return;
                    try {
                        let aTexts = [];
                        if (typeof oMCB.getSelectedItems === "function") {
                            const aItems = oMCB.getSelectedItems() || [];
                            aTexts = aItems.map(item => item.getText ? item.getText() : "").filter(Boolean);
                        }
                        if (aTexts.length === 0 && typeof oMCB.getSelectedKeys === "function") {
                            const aKeys = oMCB.getSelectedKeys() || [];
                            aKeys.forEach(sKey => {
                                let sText = sKey;
                                if (typeof oMCB.getItemByKey === "function") {
                                    const item = oMCB.getItemByKey(sKey);
                                    if (item && item.getText) sText = item.getText();
                                }
                                if (sText) aTexts.push(sText);
                            });
                        }

                        const oDom = typeof oMCB.getDomRef === "function" ? oMCB.getDomRef() : null;
                        if (!oDom) return;

                        const oWrapper = oDom.querySelector(".sapMInputBaseContentWrapper");
                        if (!oWrapper) return;

                        let oDisplay = oWrapper.querySelector(".kyraMultiSelectDisplayText");
                        if (!oDisplay) {
                            oDisplay = document.createElement("span");
                            oDisplay.className = "kyraMultiSelectDisplayText";
                            oWrapper.appendChild(oDisplay);
                        }

                        const oInput = oWrapper.querySelector(".sapMInputBaseInner");

                        if (aTexts.length === 0) {
                            oDisplay.textContent = "";
                            oDisplay.style.display = "none";
                            if (oInput) {
                                oInput.value = "";
                                oInput.style.opacity = "1";
                                oInput.style.visibility = "visible";
                            }
                            return;
                        }

                        const sFullText = aTexts.join(", ");
                        const iWrapperWidth = oWrapper.clientWidth || 400;
                        const iAvailableWidth = Math.max(100, iWrapperWidth - 55);

                        if (!syncMultiDisplay._canvas) {
                            syncMultiDisplay._canvas = document.createElement("canvas");
                        }
                        const ctx = syncMultiDisplay._canvas.getContext("2d");
                        ctx.font = "600 13.5px Inter, -apple-system, BlinkMacSystemFont, sans-serif";
                        const fTextWidth = ctx.measureText(sFullText).width;

                        let sDisplayText = sFullText;
                        if (fTextWidth > iAvailableWidth && aTexts.length > 1) {
                            sDisplayText = aTexts[0] + " + " + (aTexts.length - 1) + " more";
                        }

                        oDisplay.textContent = sDisplayText;
                        oDisplay.title = sFullText;
                        oDisplay.style.display = "flex";

                        if (oInput) {
                            oInput.value = sDisplayText;
                            oInput.title = sFullText;
                            oInput.style.opacity = "1";
                            oInput.style.visibility = "visible";
                            oInput.style.color = "transparent"; // Prevent ghosting / double text over oDisplay
                            oInput.style.caretColor = "#008C9C";
                        }
                    } catch(e) {}
                };
                window._kyraSyncMultiDisplay = syncMultiDisplay;

                // Patch MultiComboBox prototype to prevent unwanted auto-close during multi-select and update text display
                if (typeof MultiComboBox !== "undefined" && MultiComboBox && MultiComboBox.prototype) {
                    const origMultiClose = MultiComboBox.prototype.close;
                    MultiComboBox.prototype.close = function() {
                        if (this._bPreventAutoClose) {
                            return this;
                        }
                        return origMultiClose.apply(this, arguments);
                    };

                    const origItemTap = MultiComboBox.prototype._handleItemTap;
                    MultiComboBox.prototype._handleItemTap = function(oEvent) {
                        if (typeof origItemTap === "function") {
                            origItemTap.apply(this, arguments);
                        }
                        this._bCheckBoxClicked = true;
                    };

                    const origFireSelectionChange = MultiComboBox.prototype.fireSelectionChange;
                    MultiComboBox.prototype.fireSelectionChange = function() {
                        const res = origFireSelectionChange.apply(this, arguments);
                        syncMultiDisplay(this);
                        setTimeout(() => syncMultiDisplay(this), 10);
                        return res;
                    };

                    MultiComboBox.prototype._updateKyraDisplay = function() {
                        syncMultiDisplay(this);
                    };

                    const origSetSelectedKeys = MultiComboBox.prototype.setSelectedKeys;
                    MultiComboBox.prototype.setSelectedKeys = function() {
                        const res = origSetSelectedKeys.apply(this, arguments);
                        syncMultiDisplay(this);
                        return res;
                    };

                    const origSetSelection = MultiComboBox.prototype.setSelection;
                    MultiComboBox.prototype.setSelection = function() {
                        const res = origSetSelection.apply(this, arguments);
                        syncMultiDisplay(this);
                        return res;
                    };

                    const origRemoveSelection = MultiComboBox.prototype.removeSelection;
                    MultiComboBox.prototype.removeSelection = function() {
                        const res = origRemoveSelection.apply(this, arguments);
                        syncMultiDisplay(this);
                        return res;
                    };

                    const origAfterRendering = MultiComboBox.prototype.onAfterRendering;
                    MultiComboBox.prototype.onAfterRendering = function() {
                        if (typeof origAfterRendering === "function") {
                            origAfterRendering.apply(this, arguments);
                        }
                        syncMultiDisplay(this);
                    };
                }

                // Ensure Tokenizer is completely hidden on MultiComboBox
                if (typeof Tokenizer !== "undefined" && Tokenizer && Tokenizer.prototype) {
                    Tokenizer.prototype._handleNMoreIndicator = function() {
                        if (this._oIndicator) {
                            this._oIndicator.addClass("sapUiHidden");
                            this._oIndicator.hide();
                        }
                    };
                }

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

                                // Check whether sapMPopoverScroll exists to ensure ONLY ONE single side scrollbar
                                const oScrollDom = oPickerDom.querySelector(".sapMPopoverScroll");
                                const oContDom = oPickerDom.querySelector(".sapMPopoverCont");

                                if (oScrollDom) {
                                    // Only oScrollDom gets the single sleek side scrollbar
                                    oScrollDom.style.overflowX = "hidden";
                                    oScrollDom.style.overflowY = "auto";
                                    oScrollDom.style.maxHeight = "380px";
                                    oScrollDom.style.scrollbarWidth = "thin";
                                    if (oContDom) {
                                        oContDom.style.overflow = "hidden";
                                        oContDom.style.scrollbarWidth = "none";
                                    }
                                } else if (oContDom) {
                                    oContDom.style.overflowX = "hidden";
                                    oContDom.style.overflowY = "auto";
                                    oContDom.style.maxHeight = "380px";
                                    oContDom.style.scrollbarWidth = "thin";
                                }

                                // Make inner lists visible so they never create a second scrollbar
                                const aInnerLists = oPickerDom.querySelectorAll(".sapMListUl, .sapMList");
                                aInnerLists.forEach(el => {
                                    el.style.overflow = "visible";
                                    el.style.overflowY = "visible";
                                    el.style.overflowX = "visible";
                                    el.style.scrollbarWidth = "none";
                                });
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

                            const oPickerDom = oPicker.getDomRef();
                            if (oPickerDom && !oPickerDom._kyraMultiEventsAttached) {
                                oPickerDom._kyraMultiEventsAttached = true;

                                // Prevent auto-close while user is interacting inside picker
                                const markInteracting = () => {
                                    oControl._bPreventAutoClose = true;
                                };
                                const clearInteracting = () => {
                                    setTimeout(() => {
                                        oControl._bPreventAutoClose = false;
                                    }, 350);
                                };

                                oPickerDom.addEventListener("mousedown", markInteracting, true);
                                oPickerDom.addEventListener("touchstart", markInteracting, true);
                                oPickerDom.addEventListener("pointerdown", markInteracting, true);

                                oPickerDom.addEventListener("mouseup", clearInteracting, true);
                                oPickerDom.addEventListener("touchend", clearInteracting, true);
                                oPickerDom.addEventListener("pointerup", clearInteracting, true);
                            }
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
        },

        _setupModernDialogs() {
            // Bridge sap.m.MessageBox globally so every alert/error across the project uses Kyra's modern card style
            if (typeof sap !== "undefined" && sap.ui) {
                sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {
                    if (MessageBox) {
                        const origError = MessageBox.error;
                        MessageBox.error = function(vMsg, mOptions) {
                            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                                window.KyraDialog.show({
                                    type: "error",
                                    title: (mOptions && mOptions.title) || "Validation Notice",
                                    message: typeof vMsg === "string" ? vMsg : (vMsg && vMsg.message) || String(vMsg),
                                    buttonText: "Close",
                                    onClose: mOptions && mOptions.onClose
                                });
                                return;
                            }
                            if (typeof origError === "function") origError.apply(this, arguments);
                        };

                        const origWarning = MessageBox.warning;
                        MessageBox.warning = function(vMsg, mOptions) {
                            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                                window.KyraDialog.show({
                                    type: "warning",
                                    title: (mOptions && mOptions.title) || "Warning",
                                    message: typeof vMsg === "string" ? vMsg : (vMsg && vMsg.message) || String(vMsg),
                                    buttonText: "Close",
                                    onClose: mOptions && mOptions.onClose
                                });
                                return;
                            }
                            if (typeof origWarning === "function") origWarning.apply(this, arguments);
                        };

                        const origInfo = MessageBox.information;
                        MessageBox.information = function(vMsg, mOptions) {
                            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                                window.KyraDialog.show({
                                    type: "info",
                                    title: (mOptions && mOptions.title) || "Information",
                                    message: typeof vMsg === "string" ? vMsg : (vMsg && vMsg.message) || String(vMsg),
                                    buttonText: "Close",
                                    onClose: mOptions && mOptions.onClose
                                });
                                return;
                            }
                            if (typeof origInfo === "function") origInfo.apply(this, arguments);
                        };
                    }
                });
            }
        }
    });
});
