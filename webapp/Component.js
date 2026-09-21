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
                myPendingRequests: [],
                myApprovedRequests: [],
                myHistoryRequests: [],
                requestHistory: [],
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

            // Setup modern Loading Screen, Dialogs, Dropdown enhancements & Textarea full-box clickability
            this._setupModernBusyIndicator();
            this._setupModernDialogs();
            this._setupDropdownPlacementEnhancement();
            this._setupJustificationFieldEnhancement();

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
                    if (oRouter.getTargets && typeof oRouter.getTargets().display === "function") {
                        oRouter.getTargets().display("TargetAccessPage");
                    }
                }
            });

            oRouter.initialize();

            // Safety timeout: dismiss initial HTML loader after 5s if no controller dismissed it
            setTimeout(() => {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                }
            }, 5000);
        },

        _setupJustificationFieldEnhancement() {
            // Ensures 100% full-box clickability for Business Justification textarea:
            // Clicking anywhere on the box (top, center, bottom empty space, borders, padding, wrapper, or label)
            // immediately focuses the inner native textarea and positions the caret.
            const handleJustificationFocus = (e) => {
                const target = e.target;
                if (!target) return;
                const oBox = target.closest("#inPageJustificationArea, .kyraJustificationTextArea, .kyraJustificationLabel");
                if (oBox) {
                    let oTa = oBox.querySelector("textarea");
                    if (!oTa) {
                        oTa = document.querySelector("#inPageJustificationArea textarea, .kyraJustificationTextArea textarea");
                    }
                    if (oTa) {
                        if (document.activeElement !== oTa) {
                            oTa.focus();
                        }
                    }
                }
            };

            document.addEventListener("mousedown", handleJustificationFocus, true);
            document.addEventListener("click", handleJustificationFocus, true);
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
                            oWrapper.classList.remove("kyraHasSelectedItems");
                            if (oInput) {
                                oInput.value = "";
                                oInput.style.opacity = "1";
                                oInput.style.visibility = "visible";
                                oInput.style.color = "";
                                oInput.style.webkitTextFillColor = "";
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
                        oWrapper.classList.add("kyraHasSelectedItems");

                        if (oInput) {
                            oInput.value = "";
                            oInput.title = sFullText;
                            oInput.style.opacity = "1";
                            oInput.style.visibility = "visible";
                            oInput.style.color = "transparent";
                            oInput.style.webkitTextFillColor = "transparent";
                            oInput.style.caretColor = "transparent";
                        }
                    } catch(e) {}
                };
                window._kyraSyncMultiDisplay = syncMultiDisplay;

                // Patch MultiComboBox prototype to prevent unwanted auto-close during multi-select and update text display
                if (typeof MultiComboBox !== "undefined" && MultiComboBox && MultiComboBox.prototype) {
                    const origMultiClose = MultiComboBox.prototype.close;
                    MultiComboBox.prototype.close = function(bForce) {
                        if (this._bPreventAutoClose && !bForce) {
                            return this;
                        }
                        this._bPreventAutoClose = false;
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

                // Helper to get raw DOM element of a popover/picker
                const getPickerDom = (oPicker) => {
                    if (!oPicker) return null;
                    if (typeof oPicker.getDomRef === "function") {
                        const dom = oPicker.getDomRef();
                        if (dom) return dom;
                    }
                    if (typeof oPicker._getPopover === "function") {
                        const pop = oPicker._getPopover();
                        if (pop && typeof pop.getDomRef === "function") {
                            const dom = pop.getDomRef();
                            if (dom) return dom;
                        }
                    }
                    if (typeof oPicker.getPopover === "function") {
                        const pop = oPicker.getPopover();
                        if (pop && typeof pop.getDomRef === "function") {
                            const dom = pop.getDomRef();
                            if (dom) return dom;
                        }
                    }
                    return null;
                };

                const positionPickerDirectly = (oControl, oPicker) => {
                    if (!oControl || !oPicker) return;
                    try {
                        const oOpenerDom = typeof oControl.getDomRef === "function" ? oControl.getDomRef() : null;
                        const oPickerDom = getPickerDom(oPicker);
                        if (!oOpenerDom || !oPickerDom) return;

                        const rect = oOpenerDom.getBoundingClientRect();
                        if (rect.width === 0 && rect.height === 0) return;

                        const scrollX = window.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || 0;
                        const scrollY = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || 0;

                        let offsetParentLeft = 0;
                        let offsetParentTop = 0;
                        if (oPickerDom.offsetParent && oPickerDom.offsetParent !== document.body && oPickerDom.offsetParent !== document.documentElement) {
                            const pRect = oPickerDom.offsetParent.getBoundingClientRect();
                            offsetParentLeft = pRect.left + scrollX;
                            offsetParentTop = pRect.top + scrollY;
                        }

                        const iLeft = Math.round(rect.left + scrollX - offsetParentLeft);
                        const iTop = Math.round(rect.bottom + scrollY - offsetParentTop + 2);
                        const iWidth = Math.round(rect.width || oOpenerDom.offsetWidth);

                        oPickerDom.style.setProperty("position", "absolute", "important");
                        oPickerDom.style.setProperty("left", iLeft + "px", "important");
                        oPickerDom.style.setProperty("top", iTop + "px", "important");
                        oPickerDom.style.setProperty("right", "auto", "important");
                        oPickerDom.style.setProperty("bottom", "auto", "important");
                        oPickerDom.style.setProperty("transform", "none", "important");
                        oPickerDom.style.setProperty("margin", "0", "important");

                        if (iWidth > 0) {
                            oPickerDom.style.setProperty("width", iWidth + "px", "important");
                            oPickerDom.style.setProperty("min-width", iWidth + "px", "important");
                            oPickerDom.style.setProperty("max-width", iWidth + "px", "important");
                        }
                        oPickerDom.style.setProperty("z-index", "100000", "important");

                        oPickerDom.classList.remove("sapMPopoverTop");
                        oPickerDom.classList.add("sapMPopoverBottom");

                        // Single sleek scrollbar setup
                        const oScrollDom = oPickerDom.querySelector(".sapMPopoverScroll");
                        const oContDom = oPickerDom.querySelector(".sapMPopoverCont");

                        if (oScrollDom) {
                            oScrollDom.style.overflowX = "hidden";
                            oScrollDom.style.overflowY = "auto";
                            oScrollDom.style.maxHeight = "320px";
                            oScrollDom.style.scrollbarWidth = "thin";
                            if (oContDom) {
                                oContDom.style.overflow = "hidden";
                                oContDom.style.scrollbarWidth = "none";
                            }
                        } else if (oContDom) {
                            oContDom.style.overflowX = "hidden";
                            oContDom.style.overflowY = "auto";
                            oContDom.style.maxHeight = "320px";
                            oContDom.style.scrollbarWidth = "thin";
                        }

                        const aInnerLists = oPickerDom.querySelectorAll(".sapMListUl, .sapMList");
                        aInnerLists.forEach(el => {
                            el.style.overflow = "visible";
                            el.style.overflowY = "visible";
                            el.style.overflowX = "visible";
                            el.style.scrollbarWidth = "none";
                            el.style.width = "100%";
                            el.style.boxSizing = "border-box";
                        });
                    } catch(e) {}
                };

                const startAlignmentLoop = (oControl, oPicker) => {
                    let rafId = null;
                    const startTime = Date.now();
                    const loop = () => {
                        positionPickerDirectly(oControl, oPicker);
                        const bIsOpen = typeof oControl.isOpen === "function" ? oControl.isOpen() : true;
                        if (Date.now() - startTime < 3000 || bIsOpen) {
                            rafId = requestAnimationFrame(loop);
                        }
                    };
                    loop();
                    return () => {
                        if (rafId) cancelAnimationFrame(rafId);
                    };
                };

                // Hook into internal Popup instance to ensure every position calculation anchors strictly below opener
                const hookPopupPositioning = (oPicker, oControl) => {
                    if (!oPicker || !oControl) return;
                    try {
                        const pop = (typeof oPicker._getPopover === "function" && oPicker._getPopover()) ||
                                    (typeof oPicker.getPopover === "function" && oPicker.getPopover()) ||
                                    oPicker;
                        const oPopup = (pop && pop._oPopup) || oPicker._oPopup;
                        if (oPopup && !oPopup._kyraApplyPositionHooked) {
                            oPopup._kyraApplyPositionHooked = true;
                            oPopup._applyPosition = function() {
                                positionPickerDirectly(oControl, oPicker);
                            };
                        }
                    } catch(e) {}
                };

                const snapPickerToOpener = (oControl, oPicker) => {
                    if (!oControl || !oPicker) return;
                    try {
                        if (typeof oPicker.setPlacement === "function") {
                            oPicker.setPlacement(PlacementType.Bottom || "Bottom");
                        }
                        if (typeof oPicker.setShowArrow === "function") {
                            oPicker.setShowArrow(false);
                        }
                        if (typeof oPicker.setOffsetX === "function") oPicker.setOffsetX(0);
                        if (typeof oPicker.setOffsetY === "function") oPicker.setOffsetY(2);
                        if (typeof oPicker.addStyleClass === "function") oPicker.addStyleClass("kyraDropdownBottomOnly");

                        const pop = (typeof oPicker._getPopover === "function" && oPicker._getPopover()) ||
                                    (typeof oPicker.getPopover === "function" && oPicker.getPopover());
                        if (pop) {
                            if (typeof pop.setPlacement === "function") {
                                pop.setPlacement(PlacementType.Bottom || "Bottom");
                            }
                            if (typeof pop.setShowArrow === "function") {
                                pop.setShowArrow(false);
                            }
                            if (typeof pop.setOffsetX === "function") pop.setOffsetX(0);
                            if (typeof pop.setOffsetY === "function") pop.setOffsetY(2);
                            if (typeof pop.addStyleClass === "function") pop.addStyleClass("kyraDropdownBottomOnly");
                        }
                    } catch(e) {}

                    hookPopupPositioning(oPicker, oControl);

                    // Clear selection highlight inside input field when dropdown opens
                    try {
                        const oInputDom = (typeof oControl.getDomRef === "function" && oControl.getDomRef("inner")) || null;
                        if (oInputDom) {
                            oInputDom.setSelectionRange(0, 0);
                            if (window.getSelection) window.getSelection().removeAllRanges();
                        }
                    } catch(e) {}

                    if (!oPicker._kyraSnapped) {
                        oPicker._kyraSnapped = true;
                        let stopLoop = null;

                        const triggerReposition = () => {
                            hookPopupPositioning(oPicker, oControl);
                            positionPickerDirectly(oControl, oPicker);
                        };

                        oPicker.attachBeforeOpen(() => {
                            try {
                                const oDom = typeof oControl.getDomRef === "function" ? oControl.getDomRef() : null;
                                if (oDom) {
                                    const iWidth = oDom.offsetWidth;
                                    if (iWidth > 0 && typeof oPicker.setContentWidth === "function") {
                                        oPicker.setContentWidth(iWidth + "px");
                                    }
                                }
                            } catch(e) {}
                            triggerReposition();
                            stopLoop = startAlignmentLoop(oControl, oPicker);
                        });

                        oPicker.attachAfterOpen(() => {
                            triggerReposition();
                            if (!stopLoop) stopLoop = startAlignmentLoop(oControl, oPicker);

                            if (oControl && (typeof oControl.getSelectedKeys === "function" || (oControl.isA && oControl.isA("sap.m.MultiComboBox")))) {
                                oControl._bPreventAutoClose = true;
                                window._kyraActiveMultiComboBox = oControl;
                            }

                            // Keep dropdown anchored if window is resized or scrolled while open
                            window.addEventListener("scroll", triggerReposition, { passive: true, capture: true });
                            window.addEventListener("resize", triggerReposition, { passive: true });
                        });

                        oPicker.attachAfterClose(() => {
                            if (stopLoop) {
                                stopLoop();
                                stopLoop = null;
                            }
                            window.removeEventListener("scroll", triggerReposition, { capture: true });
                            window.removeEventListener("resize", triggerReposition);
                            if (window._kyraActiveMultiComboBox === oControl) {
                                window._kyraActiveMultiComboBox = null;
                            }
                        });
                    }
                };

                const aComboPrototypes = [ComboBoxBase, ComboBox, MultiComboBox, Select];
                aComboPrototypes.forEach(CtrlClass => {
                    if (typeof CtrlClass !== "undefined" && CtrlClass && CtrlClass.prototype) {
                        const proto = CtrlClass.prototype;
                        if (!proto._kyraPickerSnapped) {
                            proto._kyraPickerSnapped = true;
                            const origGetPicker = proto.getPicker;
                            if (typeof origGetPicker === "function") {
                                proto.getPicker = function() {
                                    const oPicker = origGetPicker.apply(this, arguments);
                                    if (oPicker) {
                                        snapPickerToOpener(this, oPicker);
                                    }
                                    return oPicker;
                                };
                            }
                            const origOpen = proto.open;
                            if (typeof origOpen === "function") {
                                proto.open = function() {
                                    const oPicker = (typeof this.getPicker === "function" && this.getPicker()) ||
                                                    (typeof this._getPicker === "function" && this._getPicker());
                                    if (oPicker) {
                                        snapPickerToOpener(this, oPicker);
                                    }
                                    const res = origOpen.apply(this, arguments);
                                    if (oPicker) {
                                        startAlignmentLoop(this, oPicker);
                                    }
                                    return res;
                                };
                            }

                            // Make the entire dropdown box clickable to open/toggle across all controls
                            const origOntap = proto.ontap;
                            proto.ontap = function(oEvent) {
                                if (typeof this.getEnabled === "function" && !this.getEnabled()) return;
                                if (oEvent && oEvent.target && oEvent.target.closest) {
                                    // If user clicked token delete icon in MultiComboBox, don't open dropdown
                                    if (oEvent.target.closest(".sapMTokenIcon")) {
                                        if (typeof origOntap === "function") origOntap.apply(this, arguments);
                                        return;
                                    }
                                }
                                const oInputDom = (typeof this.getDomRef === "function" && this.getDomRef("inner")) || null;
                                if (oInputDom) {
                                    oInputDom.setSelectionRange(0, 0);
                                    if (window.getSelection) window.getSelection().removeAllRanges();
                                }
                                if (typeof this.isOpen === "function") {
                                    if (this.isOpen()) {
                                        this.close(true);
                                    } else {
                                        this.open();
                                    }
                                } else if (typeof origOntap === "function") {
                                    origOntap.apply(this, arguments);
                                }
                            };
                        }
                    }
                });

                // Global capture-phase click handler ensuring every dropdown box (including the arrow icon) is 100% clickable everywhere
                if (typeof document !== "undefined" && !document._kyraGlobalDropdownClickAttached) {
                    document._kyraGlobalDropdownClickAttached = true;
                    document.addEventListener("click", (e) => {
                        if (!e.target || !e.target.closest) return;
                        if (e.target.closest(".sapMTokenIcon")) return;
                        if (e.target.closest(".sapMPopover, .sapMDialog, .sapMComboBoxBasePicker, .sapMSltPicker")) return;

                        // Cleanly dismiss active MultiComboBox if clicking outside both the opener and picker
                        if (window._kyraActiveMultiComboBox && typeof window._kyraActiveMultiComboBox.isOpen === "function" && window._kyraActiveMultiComboBox.isOpen()) {
                            const oActiveDom = window._kyraActiveMultiComboBox.getDomRef();
                            const oActivePicker = (typeof window._kyraActiveMultiComboBox.getPicker === "function" && window._kyraActiveMultiComboBox.getPicker()) ||
                                                  (typeof window._kyraActiveMultiComboBox._getPicker === "function" && window._kyraActiveMultiComboBox._getPicker());
                            const oPickerDom = getPickerDom(oActivePicker);
                            if ((!oPickerDom || !oPickerDom.contains(e.target)) &&
                                (!oActiveDom || !oActiveDom.contains(e.target)) &&
                                !e.target.closest(".sapMComboBox, .sapMMultiComboBox, .sapMSlt, .kyraModernSelectField, .fioriSelectGlow, .fioriFormSelect")) {
                                window._kyraActiveMultiComboBox.close(true);
                                window._kyraActiveMultiComboBox = null;
                            }
                        }

                        const oComboDom = e.target.closest(".sapMComboBox, .sapMMultiComboBox, .sapMSlt, .kyraModernSelectField, .fioriSelectGlow, .fioriFormSelect, .sapMSelectArrow, .sapMComboBoxArrow, .sapMInputBaseIconContainer");
                        if (!oComboDom) return;

                        const oMainDom = oComboDom.closest(".sapMComboBox, .sapMMultiComboBox, .sapMSlt, .kyraModernSelectField, .fioriSelectGlow, .fioriFormSelect") || oComboDom;

                        if (typeof sap !== "undefined" && sap.ui) {
                            const oControl = (typeof sap.ui.getCore === "function" && (sap.ui.getCore().byId(oMainDom.id) || sap.ui.getCore().byId(oComboDom.id))) ||
                                             (sap.ui.core && sap.ui.core.Element && typeof sap.ui.core.Element.getElementById === "function" && (sap.ui.core.Element.getElementById(oMainDom.id) || sap.ui.core.Element.getElementById(oComboDom.id))) ||
                                             (typeof jQuery !== "undefined" && jQuery(oMainDom).control && jQuery(oMainDom).control(0)) ||
                                             null;
                            if (oControl && typeof oControl.getEnabled === "function" && oControl.getEnabled()) {
                                const oInputDom = oMainDom.querySelector("input, .sapMInputBaseInner");
                                if (oInputDom) {
                                    oInputDom.setSelectionRange(0, 0);
                                    if (window.getSelection) window.getSelection().removeAllRanges();
                                }

                                e.stopPropagation();

                                if (typeof oControl.isOpen === "function") {
                                    if (oControl.isOpen()) {
                                        oControl.close(true);
                                    } else {
                                        oControl.open();
                                    }
                                } else if (typeof oControl.open === "function") {
                                    oControl.open();
                                }
                            }
                        }
                    }, true);
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
                        window.KyraLoader.show({
                            title: "Processing Request...",
                            subtitle: "Verifying and synchronizing governance data..."
                        });
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
