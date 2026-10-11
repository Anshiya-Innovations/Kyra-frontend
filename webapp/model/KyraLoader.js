sap.ui.define([], function() {
    "use strict";

    // Immediate removal of any loading screen DOM elements
    function removeAllLoaderDom() {
        if (typeof document === "undefined") return;
        try {
            const aSelectors = [
                "#kyra_initial_loader",
                "#kyra_loading_slide_overlay",
                ".kyraLoadingSlideOverlay",
                ".kyraLoadingSlideCard"
            ];
            aSelectors.forEach(sSel => {
                const aElements = document.querySelectorAll(sSel);
                aElements.forEach(el => {
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            });
        } catch (e) {}
    }

    // Run DOM cleanup immediately and upon ready
    removeAllLoaderDom();
    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", removeAllLoaderDom);
        }
        window.addEventListener("load", removeAllLoaderDom);
    }

    const KyraLoader = {
        /**
         * Loading screens are completely disabled.
         * Safe no-op that ensures callbacks fire cleanly without rendering any screen.
         * @param {Object|string} options
         */
        show(options) {
            removeAllLoaderDom();
            if (options && typeof options.onComplete === "function") {
                try { options.onComplete(); } catch (e) {}
            }
        },

        /**
         * Related success screens/slides are completely disabled.
         * Safe no-op that executes completion callbacks immediately without displaying screens.
         * @param {Object|string} options
         */
        showSuccess(options) {
            removeAllLoaderDom();
            if (options && typeof options.onComplete === "function") {
                try { options.onComplete(); } catch (e) {}
            } else if (options && typeof options.callback === "function") {
                try { options.callback(); } catch (e) {}
            }
        },

        /**
         * Gracefully ensures all loading screens and overlays remain hidden.
         * @param {Function} [callback]
         */
        hide(callback) {
            removeAllLoaderDom();
            if (typeof callback === "function") {
                try { callback(); } catch (e) {}
            }
        },

        /**
         * Forcibly ensures all loading screens and overlays are removed immediately.
         * @param {Function} [callback]
         */
        forceHide(callback) {
            removeAllLoaderDom();
            if (typeof callback === "function") {
                try { callback(); } catch (e) {}
            }
        },

        isShowing() {
            return false;
        },

        getActiveCount() {
            return 0;
        },

        /**
         * Injects CSS to permanently hide, suppress, and disable all loading screens,
         * overlays, UI5 BusyIndicators, and block layers across the application.
         */
        _ensureStyles() {
            if (typeof document === "undefined") return;
            if (!document.getElementById("kyra_loading_suppress_styles")) {
                const style = document.createElement("style");
                style.id = "kyra_loading_suppress_styles";
                style.textContent = `
                    #kyra_initial_loader,
                    #kyra_loading_slide_overlay,
                    .kyraLoadingSlideOverlay,
                    .kyraLoadingSlideCard,
                    .kyraSimpleCircleSpinner,
                    .kyraSimpleSpinner,
                    .sapUiBusy,
                    .sapUiBusyAnimation,
                    .sapUiBusyDot,
                    .sapUiBusyText,
                    .sapUiBusyBlockLayer,
                    .sapUiBlockLayer,
                    .sapUiBlockLayerAnimation,
                    .sapUiBLFix,
                    .sapUiLocalBusyIndicator,
                    .sapUiLocalBusyIndicatorBox,
                    .sapUiLocalBusyIndicatorAnimation,
                    .sapUiLocalBusyIndicatorDot,
                    .sapMBusyDialog {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        width: 0 !important;
                        height: 0 !important;
                        max-width: 0 !important;
                        max-height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        overflow: hidden !important;
                        z-index: -99999 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        },

        /**
         * Sets up universal hooks:
         * Suppresses sap.ui.core.BusyIndicator completely so no UI5 loading screen ever appears.
         * Ensures window.fetch operates with zero loading screen overhead.
         */
        setupGlobalHooks() {
            this._ensureStyles();
            removeAllLoaderDom();

            // Suppress sap.ui.core.BusyIndicator globally
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                sap.ui.core.BusyIndicator.show = function() {
                    removeAllLoaderDom();
                };
                sap.ui.core.BusyIndicator.hide = function() {
                    removeAllLoaderDom();
                };
            }
        },

        /**
         * Wraps any Promise directly without showing any loading screen.
         * @param {Promise} pPromise
         */
        async wrap(pPromise) {
            return pPromise;
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

        // Initialize suppressive styles and hooks
        KyraLoader._ensureStyles();
        KyraLoader.setupGlobalHooks();
    }

    return KyraLoader;
});
