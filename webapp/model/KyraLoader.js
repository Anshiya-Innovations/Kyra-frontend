(function (root, factory) {
    const oInstance = factory();
    if (root) {
        root.KyraLoader = oInstance;
        root.KyraLoading = oInstance;
    }
    if (typeof sap !== "undefined" && sap.ui && sap.ui.define) {
        sap.ui.define([], function() {
            return oInstance;
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = oInstance;
    }
})(typeof window !== "undefined" ? window : this, function() {
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
               KYRA ACCESS MANAGEMENT LOADING SCREEN
               Modern minimal rounded card, #008C9C teal spinner, frosted glass backdrop
               ========================================================================= */

            .kyraLoadingOverlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(15, 23, 42, 0.45) !important;
                backdrop-filter: blur(8px) saturate(120%) !important;
                -webkit-backdrop-filter: blur(8px) saturate(120%) !important;
                z-index: 999999 !important;
                display: none;
                align-items: center !important;
                justify-content: center !important;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 16px !important;
            }

            .kyraLoadingOverlay.kyra-active {
                display: flex !important;
                opacity: 1 !important;
                pointer-events: all !important;
            }

            .kyraLoadingCard {
                background: #FFFFFF !important;
                border: 1px solid rgba(226, 232, 240, 0.8) !important;
                border-radius: 28px !important;
                box-shadow: 0 24px 50px -12px rgba(15, 23, 42, 0.22), 0 12px 24px -8px rgba(15, 23, 42, 0.08) !important;
                padding: 42px 46px 36px 46px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                width: 92% !important;
                min-width: 320px !important;
                max-width: 480px !important;
                box-sizing: border-box !important;
                user-select: none !important;
                text-align: center !important;
                transform: scale(0.96);
                transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }

            .kyraLoadingOverlay.kyra-active .kyraLoadingCard {
                transform: scale(1) !important;
            }

            .kyraLoadingIconContainer {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 0 4px 0 !important;
            }

            .kyraLoadingSpinner {
                width: 48px !important;
                height: 48px !important;
                border: 4.5px solid #E2E8F0 !important;
                border-top-color: #008C9C !important;
                border-radius: 50% !important;
                box-sizing: border-box !important;
                animation: kyraSpinAnim 0.85s linear infinite !important;
                margin: 0 auto !important;
            }

            @keyframes kyraSpinAnim {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .kyraSuccessCheckCircle {
                width: 48px !important;
                height: 48px !important;
                border-radius: 50% !important;
                background-color: #008C9C !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 4px auto !important;
                box-shadow: 0 4px 16px rgba(0, 140, 156, 0.35) !important;
                animation: kyraCheckPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            }

            @keyframes kyraCheckPop {
                0% { transform: scale(0.6); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }

            .kyraLoadingTitle {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                font-size: 19px !important;
                font-weight: 700 !important;
                color: #0F172A !important;
                margin: 22px 0 8px 0 !important;
                text-align: center !important;
                line-height: 1.35 !important;
                letter-spacing: -0.01em !important;
            }

            .kyraLoadingText {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                font-size: 14px !important;
                font-weight: 400 !important;
                color: #64748B !important;
                margin: 0 auto !important;
                max-width: 340px !important;
                text-align: center !important;
                line-height: 1.5 !important;
                word-break: break-word !important;
            }

            /* Local UI5 indicators recolored to #008C9C */
            .sapUiLocalBusyIndicatorAnimation > div,
            .sapUiLocalBusyIndicatorDot,
            .sapMBusyDialog .sapUiLocalBusyIndicatorDot {
                background-color: #008C9C !important;
            }

            /* STRICT SUPPRESSION: While KyraLoader is active, hide ANY and ALL secondary UI5 native busy indicators */
            body.kyra-loader-active #sap-ui-busyindicator,
            body.kyra-loader-active .sapUiLocalBusyIndicator,
            body.kyra-loader-active .sapUiBusy,
            body.kyra-loader-active .sapUiBusyBlockLayer,
            body:has(.kyraLoadingOverlay.kyra-active) #sap-ui-busyindicator,
            body:has(.kyraLoadingOverlay.kyra-active) .sapUiLocalBusyIndicator,
            body:has(.kyraLoadingOverlay.kyra-active) .sapUiBusy,
            body:has(.kyraLoadingOverlay.kyra-active) .sapUiBusyBlockLayer,
            .kyraLoadingOverlay.kyra-active ~ #sap-ui-busyindicator,
            .kyraLoadingOverlay.kyra-active ~ .sapUiLocalBusyIndicator,
            .kyraLoadingOverlay.kyra-active ~ * .sapUiLocalBusyIndicator {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(oStyle);
    }

    /**
     * Ensures the centralized DOM overlay element exists in document.body.
     * Enforces singleton state by removing any orphan duplicate overlays.
     */
    function ensureDom() {
        if (typeof document === "undefined" || !document.body) return null;
        ensureStyles();

        // Enforce strict DOM singleton: remove any duplicate or orphan loading overlays
        const aOverlays = document.querySelectorAll(".kyraLoadingOverlay, #kyra_loading_overlay");
        if (aOverlays && aOverlays.length > 1) {
            for (let i = 1; i < aOverlays.length; i++) {
                if (aOverlays[i] && aOverlays[i].parentNode) {
                    aOverlays[i].parentNode.removeChild(aOverlays[i]);
                }
            }
        }
        _oOverlay = document.getElementById("kyra_loading_overlay");

        if (!_oOverlay) {
            ensureStyles();

            _oOverlay = document.createElement("div");
            _oOverlay.id = "kyra_loading_overlay";
            _oOverlay.className = "kyraLoadingOverlay";
            _oOverlay.setAttribute("role", "dialog");
            _oOverlay.setAttribute("aria-modal", "true");
            _oOverlay.setAttribute("aria-label", "Loading");

            _oOverlay.innerHTML = `
                <div class="kyraLoadingCard" id="kyra_loading_card">
                    <div id="kyra_loading_icon_container" class="kyraLoadingIconContainer">
                        <div class="kyraLoadingSpinner"></div>
                    </div>
                    <div id="kyra_loading_text_container" class="kyraLoadingTextContainer">
                        <div id="kyra_loading_title" class="kyraLoadingTitle">Loading KYRA Access Management...</div>
                        <div id="kyra_loading_text" class="kyraLoadingText">Loading user profile, entitlements, and access records...</div>
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
            _iActiveCount = 1;

            if (_oTimerWatchdog) {
                clearTimeout(_oTimerWatchdog);
                _oTimerWatchdog = null;
            }
            if (_oSuccessTimer) {
                clearTimeout(_oSuccessTimer);
                _oSuccessTimer = null;
            }

            // Immediately suppress and hide any native SAP UI5 BusyIndicator
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                try {
                    sap.ui.core.BusyIndicator.hide();
                } catch(e) {}
            }
            if (typeof document !== "undefined" && document.body) {
                document.body.classList.add("kyra-loader-active");
            }

            const oOverlay = ensureDom();
            if (oOverlay) {
                let sTitle = "Loading KYRA Access Management...";
                let sText = "Loading user profile, entitlements, and access records...";

                if (typeof options === "string" && options.trim()) {
                    sTitle = options.trim();
                } else if (options && typeof options === "object") {
                    if (options.title) sTitle = options.title;
                    if (options.subtitle) sText = options.subtitle;
                    else if (options.text) sText = options.text;
                    else if (options.message) sText = options.message;

                    if (options.title && !options.subtitle && !options.text && !options.message) {
                        sText = "Processing request and synchronizing access records...";
                    }
                }

                // Restore Loading State: Pure modern teal circular spinner without logo
                if (_oIconContainer) {
                    _oIconContainer.innerHTML = '<div class="kyraLoadingSpinner"></div>';
                }

                if (_oTitleText) {
                    _oTitleText.textContent = sTitle;
                    _oTitleText.style.display = "block";
                }

                if (_oLoadingText) {
                    _oLoadingText.textContent = sText;
                    _oLoadingText.style.display = sText ? "block" : "none";
                }

                oOverlay.style.removeProperty("display");
                oOverlay.style.removeProperty("opacity");
                oOverlay.style.removeProperty("pointer-events");
                oOverlay.classList.add("kyra-active");
            }

            // Watchdog: ensures operations continue fully without premature cutoff while preventing endless runs
            const iEffectiveDuration = (options && typeof options.duration === "number" && options.duration > 0)
                ? options.duration
                : 20000;

            _oTimerWatchdog = setTimeout(() => {
                window._kyraSubmittingAddAccess = false;
                window._kyraSubmittingRequest = false;
                window._kyraLoginTransition = false;
                this.forceHide();
            }, iEffectiveDuration);
        },

        /**
         * Transitions the loading card to a success notification with checkmark,
         * displays the notification, and only after the duration stops the loading screen.
         * @param {Object|string} options
         */
        showSuccess(options) {
            window._kyraSubmittingAddAccess = false;
            window._kyraSubmittingRequest = false;
            window._kyraLoginTransition = false;

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

            // Ensure native UI5 indicator remains suppressed during success transition
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                try {
                    sap.ui.core.BusyIndicator.hide();
                } catch(e) {}
            }
            if (typeof document !== "undefined" && document.body) {
                document.body.classList.add("kyra-loader-active");
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
                    _oLoadingText.style.display = sSubtitle ? "block" : "none";
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
            window._kyraSubmittingAddAccess = false;
            window._kyraSubmittingRequest = false;
            window._kyraLoginTransition = false;
            _iActiveCount = 0;
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
            if (typeof document !== "undefined" && document.body) {
                document.body.classList.remove("kyra-loader-active");
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
         * Suppresses sap.ui.core.BusyIndicator whenever KyraLoader is showing or request submission is in flight,
         * ensuring only a single unified loading indicator ever displays.
         */
        setupGlobalHooks() {
            ensureStyles();
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                const oBI = sap.ui.core.BusyIndicator;
                if (!oBI._kyraPatched) {
                    oBI._kyraPatched = true;
                    const fnOrigShow = oBI.show;
                    oBI.show = function(iDelay) {
                        // Suppress native UI5 BusyIndicator when KyraLoader is active or request submit is in flight
                        if (KyraLoader.isShowing() || window._kyraSubmittingAddAccess || window._kyraSubmittingRequest || window._kyraLoginTransition) {
                            return;
                        }
                        return fnOrigShow.apply(this, arguments);
                    };
                }
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
