sap.ui.define([], function() {
    "use strict";

    let _iActiveCount = 0;
    let _oOverlay = null;
    let _oIconContainer = null;
    let _oTitleText = null;
    let _oLoadingText = null;
    let _oTimerWatchdog = null;
    let _oSuccessTimer = null;
    let _bStylesInjected = false;

    /**
     * Determines whether the user is currently inside the Add Access page,
     * including any of its slides, dropdowns, forms, target systems, or child sections.
     * Admin page operations and explicit submit operations are strictly allowed.
     * @param {Object} [options]
     * @returns {boolean}
     */
    function isAddAccess(options) {
        try {
            if (typeof window === "undefined") return false;

            // Explicit bypass for Add Access Submit time
            if (options && options.forceShow === true) {
                return false;
            }
            if (window._kyraSubmittingAddAccess === true) {
                return false;
            }

            // Admin page is strictly excluded from Add Access restriction
            const sHash = (window.location && window.location.hash) || "";
            if (sHash.toLowerCase().includes("admin")) {
                return false;
            }

            if (typeof sap !== "undefined" && sap.ui && sap.ui.getCore) {
                const oCore = sap.ui.getCore();
                const oComp = oCore.getComponent && oCore.getComponent("container");
                const oModel = oComp && oComp.getModel && oComp.getModel("accessModel");
                if (oModel && typeof oModel.getProperty === "function") {
                    if (oModel.getProperty("/isAdminPersona") === true || oModel.getProperty("/isAdmin") === true) {
                        return false;
                    }
                }
            }

            if (window._kyraInAddAccess === true) return true;

            if (sHash.toLowerCase().includes("addaccess")) {
                return true;
            }

            const oAddAccessSec = document.getElementById("addAccessSectionContainer");
            if (oAddAccessSec) {
                const sDisplay = window.getComputedStyle(oAddAccessSec).display;
                const sVisibility = window.getComputedStyle(oAddAccessSec).visibility;
                if (sDisplay !== "none" && sVisibility !== "hidden") {
                    return true;
                }
            }

            // Check if active target is Add Access via SAPUI5 model
            if (typeof sap !== "undefined" && sap.ui && sap.ui.getCore) {
                const oCore = sap.ui.getCore();
                const oComp = oCore.getComponent && oCore.getComponent("container");
                const oModel = oComp && oComp.getModel && oComp.getModel("accessModel");
                if (oModel && typeof oModel.getProperty === "function") {
                    if (oModel.getProperty("/showAddAccessSector") === true) {
                        return true;
                    }
                }
            }
        } catch (e) {}
        return false;
    }

    /**
     * Injects the SAP Fiori light-theme CSS styles for the centralized KyraLoader.
     * Uses #008C9C as primary indicator color, clean centered card, smooth spinner, and success badge.
     */
    function ensureStyles() {
        if (typeof document === "undefined" || _bStylesInjected) return;
        _bStylesInjected = true;

        const sExisting = document.getElementById("kyra_fiori_loader_styles");
        if (sExisting) return;

        // Clean up legacy suppression style tags if present
        const oLegacy = document.getElementById("kyra_loading_suppress_styles");
        if (oLegacy && oLegacy.parentNode) {
            oLegacy.parentNode.removeChild(oLegacy);
        }

        const oStyle = document.createElement("style");
        oStyle.id = "kyra_fiori_loader_styles";
        oStyle.textContent = `
            /* =========================================================================
               KYRA ENTERPRISE - UNIFIED SAP FIORI LOADING & NOTIFICATION SCREEN
               #008C9C Primary Indicator, Clean Minimal Light Theme, Centered & Responsive
               ========================================================================= */

            .kyraLoadingOverlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(255, 255, 255, 0.78) !important;
                backdrop-filter: blur(4px) !important;
                -webkit-backdrop-filter: blur(4px) !important;
                z-index: 999999 !important;
                display: none;
                align-items: center !important;
                justify-content: center !important;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.16s ease-in-out;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            .kyraLoadingOverlay.kyra-active {
                display: flex !important;
                opacity: 1 !important;
                pointer-events: all !important;
            }

            .kyraLoadingCard {
                background: #FFFFFF !important;
                border: 1px solid #E2E8F0 !important;
                border-radius: 12px !important;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04) !important;
                padding: 24px 32px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                min-width: 220px !important;
                max-width: 320px !important;
                box-sizing: border-box !important;
                user-select: none !important;
                text-align: center !important;
            }

            .kyraLoadingIconContainer {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                margin-bottom: 8px !important;
            }

            .kyraLoadingLogo {
                height: 32px !important;
                max-width: 110px !important;
                width: auto !important;
                margin-bottom: 14px !important;
                object-fit: contain !important;
                display: block !important;
            }

            .kyraLoadingSpinner {
                width: 32px !important;
                height: 32px !important;
                border: 3px solid rgba(0, 140, 156, 0.18) !important;
                border-top-color: #008C9C !important;
                border-radius: 50% !important;
                box-sizing: border-box !important;
                animation: kyraSpinAnim 0.75s linear infinite !important;
            }

            @keyframes kyraSpinAnim {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .kyraSuccessCheckCircle {
                width: 44px !important;
                height: 44px !important;
                border-radius: 50% !important;
                background-color: #008C9C !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 10px auto !important;
                box-shadow: 0 4px 14px rgba(0, 140, 156, 0.32) !important;
                animation: kyraCheckPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            }

            @keyframes kyraCheckPop {
                0% { transform: scale(0.6); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }

            .kyraLoadingTitle {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                color: #0F172A !important;
                margin: 4px 0 !important;
                text-align: center !important;
                line-height: 1.3 !important;
            }

            .kyraLoadingText {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                color: #475569 !important;
                margin-top: 6px !important;
                text-align: center !important;
                letter-spacing: 0.01em !important;
                line-height: 1.4 !important;
                word-break: break-word !important;
            }

            /* Local UI5 indicators recolored to #008C9C */
            .sapUiLocalBusyIndicatorAnimation > div,
            .sapUiLocalBusyIndicatorDot,
            .sapMBusyDialog .sapUiLocalBusyIndicatorDot {
                background-color: #008C9C !important;
            }

            /* STRICT EXCEPTION: Absolutely NO loading indicators or overlays inside Add Access */
            #addAccessSectionContainer .sapUiLocalBusyIndicator,
            #addAccessSectionContainer .sapUiBusy,
            #addAccessSectionContainer .sapUiBusyBlockLayer,
            #addAccessSectionContainer .kyraLoadingOverlay,
            [id*="addAccess"] .sapUiLocalBusyIndicator,
            [id*="AddAccess"] .sapUiLocalBusyIndicator,
            [id*="addAccessSection"] .sapUiLocalBusyIndicator {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(oStyle);
    }

    /**
     * Resolves the KYRA logo URL via SAPUI5 require or static fallback.
     */
    function getLogoUrl() {
        let sLogoUrl = "images/kyra_k_logo.png";
        try {
            if (typeof sap !== "undefined" && sap.ui && sap.ui.require && sap.ui.require.toUrl) {
                sLogoUrl = sap.ui.require.toUrl("kyra001/images/kyra_k_logo.png");
            }
        } catch (e) {}
        return sLogoUrl;
    }

    /**
     * Ensures the centralized DOM overlay element exists in document.body.
     */
    function ensureDom() {
        if (typeof document === "undefined" || !document.body) return null;
        if (!_oOverlay) {
            _oOverlay = document.getElementById("kyra_loading_overlay");
        }
        if (!_oOverlay) {
            ensureStyles();

            const sLogoUrl = getLogoUrl();
            _oOverlay = document.createElement("div");
            _oOverlay.id = "kyra_loading_overlay";
            _oOverlay.className = "kyraLoadingOverlay";
            _oOverlay.setAttribute("role", "dialog");
            _oOverlay.setAttribute("aria-modal", "true");
            _oOverlay.setAttribute("aria-label", "Loading");

            _oOverlay.innerHTML = `
                <div class="kyraLoadingCard" id="kyra_loading_card">
                    <div id="kyra_loading_icon_container" class="kyraLoadingIconContainer">
                        <img src="${sLogoUrl}" class="kyraLoadingLogo" alt="KYRA Logo" onerror="this.style.display='none'" />
                        <div class="kyraLoadingSpinner"></div>
                    </div>
                    <div id="kyra_loading_text_container" class="kyraLoadingTextContainer">
                        <div id="kyra_loading_title" class="kyraLoadingTitle" style="display: none;"></div>
                        <div id="kyra_loading_text" class="kyraLoadingText">Loading…</div>
                    </div>
                </div>
            `;
            document.body.appendChild(_oOverlay);
            _oIconContainer = _oOverlay.querySelector("#kyra_loading_icon_container");
            _oTitleText = _oOverlay.querySelector("#kyra_loading_title");
            _oLoadingText = _oOverlay.querySelector("#kyra_loading_text");
        } else {
            if (!_oIconContainer) _oIconContainer = _oOverlay.querySelector("#kyra_loading_icon_container");
            if (!_oTitleText) _oTitleText = _oOverlay.querySelector("#kyra_loading_title");
            if (!_oLoadingText) _oLoadingText = _oOverlay.querySelector("#kyra_loading_text");
        }
        return _oOverlay;
    }

    const KyraLoader = {
        /**
         * Displays the unified SAP Fiori loading screen.
         * Enforces strict Add Access exclusion: if inside Add Access, this is an immediate no-op.
         * Continues fully throughout the entire database save/load operation.
         * @param {Object|string} [options] Optional title/text or options object.
         */
        show(options) {
            if (isAddAccess(options)) {
                this.forceHide();
                if (options && typeof options.onComplete === "function") {
                    try { options.onComplete(); } catch (e) {}
                }
                return;
            }

            _iActiveCount++;

            if (_oTimerWatchdog) {
                clearTimeout(_oTimerWatchdog);
                _oTimerWatchdog = null;
            }
            if (_oSuccessTimer) {
                clearTimeout(_oSuccessTimer);
                _oSuccessTimer = null;
            }

            const oOverlay = ensureDom();
            if (oOverlay) {
                let sText = "Loading…";
                let sTitle = "";
                if (typeof options === "string" && options.trim()) {
                    sText = options.trim();
                } else if (options && typeof options === "object") {
                    if (options.text) sText = options.text;
                    else if (options.subtitle) sText = options.subtitle;
                    else if (options.title) sText = options.title;

                    if (options.title && options.subtitle) {
                        sTitle = options.title;
                        sText = options.subtitle;
                    }
                }

                // Restore Loading State: Brand Logo + #008C9C Spinner
                const sLogoUrl = getLogoUrl();
                if (_oIconContainer) {
                    _oIconContainer.innerHTML = `
                        <img src="${sLogoUrl}" class="kyraLoadingLogo" alt="KYRA Logo" onerror="this.style.display='none'" />
                        <div class="kyraLoadingSpinner"></div>
                    `;
                }

                if (_oTitleText) {
                    if (sTitle) {
                        _oTitleText.textContent = sTitle;
                        _oTitleText.style.display = "block";
                    } else {
                        _oTitleText.style.display = "none";
                    }
                }

                if (_oLoadingText) {
                    _oLoadingText.textContent = sText;
                }

                oOverlay.classList.add("kyra-active");
            }

            // Watchdog: ensures database saves continue fully without premature cutoff (default 20s)
            const iEffectiveDuration = (options && typeof options.duration === "number" && options.duration > 0)
                ? options.duration
                : 20000;

            _oTimerWatchdog = setTimeout(() => {
                this.forceHide();
            }, iEffectiveDuration);
        },

        /**
         * Transitions the loading card to a success notification with checkmark,
         * displays the notification, and only after the duration stops the loading screen.
         * @param {Object|string} options
         */
        showSuccess(options) {
            if (isAddAccess(options)) {
                this.forceHide();
                if (options && typeof options.onComplete === "function") {
                    try { options.onComplete(); } catch (e) {}
                }
                return;
            }

            if (typeof options === "string") {
                options = { subtitle: options };
            }
            options = options || {};

            const sTitle = options.title || "Saved Successfully";
            const sSubtitle = options.subtitle || options.message || options.text || "Customization saved to database successfully.";
            const iDuration = (typeof options.duration === "number" && options.duration > 0) ? options.duration : 1900;
            const fnComplete = options.onComplete || options.callback || null;

            if (_oTimerWatchdog) {
                clearTimeout(_oTimerWatchdog);
                _oTimerWatchdog = null;
            }
            if (_oSuccessTimer) {
                clearTimeout(_oSuccessTimer);
                _oSuccessTimer = null;
            }

            const oOverlay = ensureDom();
            if (oOverlay) {
                // Transition Icon: Show crisp #008C9C checkmark circle
                if (_oIconContainer) {
                    _oIconContainer.innerHTML = `
                        <div class="kyraSuccessCheckCircle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    `;
                }

                if (_oTitleText) {
                    _oTitleText.textContent = sTitle;
                    _oTitleText.style.display = "block";
                }

                if (_oLoadingText) {
                    _oLoadingText.textContent = sSubtitle;
                }

                oOverlay.classList.add("kyra-active");

                // Trigger SAP Fiori MessageToast notification simultaneously
                try {
                    if (typeof sap !== "undefined" && sap.m && sap.m.MessageToast) {
                        sap.m.MessageToast.show(sSubtitle || sTitle);
                    }
                } catch(e) {}
            }

            // Continue showing notification, and ONLY AFTER duration stop the loading screen
            _oSuccessTimer = setTimeout(() => {
                this.forceHide(fnComplete);
            }, iDuration);
        },

        /**
         * Decrements active count and hides the loading screen when all operations finish.
         * @param {Function} [callback] Optional callback to invoke upon hiding.
         * @param {boolean} [force] If true, forcibly hides immediately regardless of active count.
         */
        hide(callback, force) {
            if (force) {
                _iActiveCount = 0;
            } else {
                _iActiveCount = Math.max(0, _iActiveCount - 1);
            }

            if (_iActiveCount === 0) {
                if (_oTimerWatchdog) {
                    clearTimeout(_oTimerWatchdog);
                    _oTimerWatchdog = null;
                }
                if (_oSuccessTimer) {
                    clearTimeout(_oSuccessTimer);
                    _oSuccessTimer = null;
                }
                if (_oOverlay) {
                    _oOverlay.classList.remove("kyra-active");
                }
            }

            if (typeof callback === "function") {
                try { callback(); } catch (e) {}
            }
        },

        /**
         * Forcibly dismisses any visible loading screen immediately.
         * @param {Function} [callback]
         */
        forceHide(callback) {
            this.hide(callback, true);
        },

        isShowing() {
            return !!(_oOverlay && _oOverlay.classList.contains("kyra-active"));
        },

        getActiveCount() {
            return _iActiveCount;
        },

        _ensureStyles() {
            ensureStyles();
        },

        /**
         * Sets up universal hooks:
         * Connects sap.ui.core.BusyIndicator to use the centralized Fiori loading screen.
         * Enforces strict Add Access exclusion so BusyIndicator never appears inside Add Access.
         */
        setupGlobalHooks() {
            ensureStyles();

            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                const self = this;
                sap.ui.core.BusyIndicator.show = function(iDelay) {
                    if (isAddAccess()) return;
                    self.show();
                };
                sap.ui.core.BusyIndicator.hide = function() {
                    self.hide();
                };
            }
        },

        async wrap(pPromise) {
            this.show();
            try {
                return await pPromise;
            } finally {
                this.hide();
            }
        }
    };

    if (typeof window !== "undefined") {
        window.KyraLoader = KyraLoader;
        window.KyraLoading = KyraLoader;
        window.showKyraLoading = (title, subtitle, duration, onComplete) => {
            return KyraLoader.show({ title, subtitle, duration, onComplete });
        };
        window.showKyraSuccess = (title, subtitle, duration, onComplete) => {
            return KyraLoader.showSuccess({ title, subtitle, duration, onComplete });
        };
        window.hideKyraLoading = (callback) => {
            return KyraLoader.hide(callback);
        };
        window.forceHideKyraLoading = (callback) => {
            return KyraLoader.forceHide(callback);
        };

        KyraLoader.setupGlobalHooks();
    }

    return KyraLoader;
});
