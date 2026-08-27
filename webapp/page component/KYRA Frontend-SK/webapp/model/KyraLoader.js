/**
 * KYRA Universal Enterprise Clean Loading Popup System
 * Minimal, modern, high-performance loading popup modal.
 * Used across the entire Kyra platform during server reloads, data synchronization, and user actions.
 */
(function(global) {
    "use strict";

    let dismissTimer = null;
    let startTime = 0;
    let isVisible = false;

    const KyraLoader = {
        /**
         * Show the clean loading modal
         * @param {Object|string} [options]
         * @param {string} [options.title='Loading...']
         * @param {string} [options.subtitle='Please wait a moment...']
         * @param {number} [options.duration] - Optional auto-dismiss after ms
         * @param {Function} [options.onComplete]
         */
        show(options) {
            if (typeof options === "string") {
                options = { title: options };
            }
            options = options || {};
            const sTitle = options.title || "Loading...";
            const sSubtitle = options.subtitle || "Please wait a moment...";
            const iDuration = options.duration;
            const fnComplete = options.onComplete || (() => {});

            if (dismissTimer) {
                clearTimeout(dismissTimer);
                dismissTimer = null;
            }

            startTime = Date.now();
            isVisible = true;

            let overlay = document.getElementById("kyra_loading_slide_overlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "kyra_loading_slide_overlay";
                overlay.className = "kyraLoadingSlideOverlay";
                if (document.body) {
                    document.body.appendChild(overlay);
                } else {
                    document.addEventListener("DOMContentLoaded", () => {
                        document.body.appendChild(overlay);
                    });
                }
            }

            overlay.innerHTML = `
                <div class="kyraLoadingSlideCard">
                    <!-- Clean Orbital Spinner -->
                    <div class="kyraLoadingIconWrap">
                        <div class="kyraSimpleCircleSpinner"></div>
                    </div>

                    <div class="kyraLoadingTitle">${sTitle}</div>
                    <div class="kyraLoadingSubtitle">${sSubtitle}</div>
                </div>
            `;

            requestAnimationFrame(() => {
                if (overlay) {
                    overlay.classList.add("kyra-active");
                }
            });

            if (iDuration && iDuration > 0) {
                dismissTimer = setTimeout(() => {
                    this.hide(fnComplete);
                }, iDuration);
            }

            return overlay;
        },

        /**
         * Hide the clean loading modal smoothly
         * @param {Function} [callback]
         * @param {number} [minDisplayTime=250] - Minimum display duration to avoid visual flicker
         */
        hide(callback, minDisplayTime = 250) {
            if (dismissTimer) {
                clearTimeout(dismissTimer);
                dismissTimer = null;
            }

            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);

            setTimeout(() => {
                const overlay = document.getElementById("kyra_loading_slide_overlay");
                if (overlay) {
                    overlay.classList.remove("kyra-active");
                    setTimeout(() => {
                        if (overlay && overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        isVisible = false;
                        if (typeof callback === "function") {
                            callback();
                        }
                    }, 220);
                } else {
                    isVisible = false;
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            }, remaining);
        },

        /**
         * Check if loader is currently visible
         */
        isShowing() {
            return isVisible;
        },

        /**
         * Wrap any async promise with this loader
         * @param {Promise} pPromise 
         * @param {Object} [options]
         */
        async wrap(pPromise, options) {
            this.show(options);
            try {
                const result = await pPromise;
                this.hide();
                return result;
            } catch (err) {
                this.hide();
                throw err;
            }
        }
    };

    global.KyraLoader = KyraLoader;
    global.showKyraLoading = (title, subtitle, duration, onComplete) => {
        return KyraLoader.show({ title, subtitle, duration, onComplete });
    };
    global.hideKyraLoading = (callback, minDisplayTime) => {
        return KyraLoader.hide(callback, minDisplayTime);
    };

    // UI5 AMD define
    if (typeof sap !== "undefined" && typeof sap.ui !== "undefined" && typeof sap.ui.define === "function") {
        sap.ui.define([], function() {
            return KyraLoader;
        });
    }

})(typeof window !== "undefined" ? window : this);
