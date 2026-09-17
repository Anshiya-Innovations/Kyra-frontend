sap.ui.define([], function() {
    "use strict";

    let dismissTimer = null;
    let startTime = 0;
    let isVisible = false;
    let iActiveCount = 0;

    const KyraLoader = {
        /**
         * Shows or updates the global KYRA loading overlay.
         * Supports reference counting: multiple concurrent calls increment the counter.
         * @param {Object|string} options Options object or title string
         */
        show(options) {
            if (typeof options === "string") {
                options = { title: options };
            }
            options = options || {};
            const sTitle = options.title || "Loading KYRA...";
            const sSubtitle = options.subtitle || "Please wait a moment...";
            const iDuration = options.duration;
            const fnComplete = options.onComplete || (() => {});

            iActiveCount++;

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

            // If card already exists in DOM, smoothly update text without tearing down spinner animation
            const oExistingTitle = overlay.querySelector(".kyraLoadingTitle");
            const oExistingSubtitle = overlay.querySelector(".kyraLoadingSubtitle");
            if (oExistingTitle && oExistingSubtitle) {
                oExistingTitle.textContent = sTitle;
                oExistingSubtitle.textContent = sSubtitle;
            } else {
                overlay.innerHTML = `
                    <div class="kyraLoadingSlideCard">
                        <div class="kyraSimpleCircleSpinner"></div>
                        <div class="kyraLoadingTitle">${sTitle}</div>
                        <div class="kyraLoadingSubtitle">${sSubtitle}</div>
                    </div>
                `;
            }

            overlay.classList.add("kyra-active");
            overlay.style.setProperty("display", "flex", "important");
            overlay.style.setProperty("opacity", "1", "important");
            overlay.style.setProperty("pointer-events", "all", "important");

            // Safety timeout: auto-hide after duration or default 10s so application never hangs indefinitely
            const iEffectiveDuration = (typeof iDuration === "number" && iDuration > 0) ? iDuration : 10000;
            dismissTimer = setTimeout(() => {
                this.forceHide(fnComplete);
            }, iEffectiveDuration);
        },

        /**
         * Hides the global KYRA loading overlay.
         * Decrements reference counter; overlay only fades out when all concurrent requests finish (or when bForce is true).
         * @param {Function} [callback] Optional callback invoked after removal
         * @param {number} [minDisplayTime=0] Minimum milliseconds to keep loader displayed
         * @param {boolean} [bForce=false] If true, resets active counter and forces immediate dismissal
         */
        hide(callback, minDisplayTime = 0, bForce = false) {
            if (bForce) {
                iActiveCount = 0;
            } else {
                iActiveCount = Math.max(0, iActiveCount - 1);
            }

            // If concurrent operations are still in-flight, keep overlay visible
            if (iActiveCount > 0) {
                return;
            }

            if (dismissTimer) {
                clearTimeout(dismissTimer);
                dismissTimer = null;
            }

            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);

            const removeOverlay = () => {
                const overlay = document.getElementById("kyra_loading_slide_overlay");
                if (overlay) {
                    overlay.classList.remove("kyra-active");
                    overlay.style.setProperty("opacity", "0", "important");
                    overlay.style.setProperty("pointer-events", "none", "important");
                    setTimeout(() => {
                        if (overlay && overlay.parentNode && iActiveCount === 0) {
                            overlay.style.setProperty("display", "none", "important");
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 240);
                }

                const initLoader = document.getElementById("kyra_initial_loader");
                if (initLoader) {
                    initLoader.style.transition = "opacity 0.22s ease";
                    initLoader.style.opacity = "0";
                    setTimeout(() => {
                        if (initLoader && initLoader.parentNode) {
                            initLoader.parentNode.removeChild(initLoader);
                        }
                    }, 240);
                }

                isVisible = false;
                if (typeof callback === "function") {
                    callback();
                }
            };

            if (remaining > 0) {
                setTimeout(removeOverlay, remaining);
            } else {
                removeOverlay();
            }
        },

        /**
         * Forcibly hides the loader immediately, resetting all pending request counts.
         * @param {Function} [callback]
         */
        forceHide(callback) {
            iActiveCount = 0;
            this.hide(callback, 0, true);
        },

        isShowing() {
            return isVisible;
        },

        getActiveCount() {
            return iActiveCount;
        },

        /**
         * Automatically wraps any Promise with the global KYRA loading screen.
         * @param {Promise} pPromise
         * @param {Object|string} options
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

    if (typeof window !== "undefined") {
        window.KyraLoader = KyraLoader;
        window.KyraLoading = KyraLoader;
        window.showKyraLoading = (title, subtitle, duration, onComplete) => {
            return KyraLoader.show({ title, subtitle, duration, onComplete });
        };
        window.hideKyraLoading = (callback, minDisplayTime, force) => {
            return KyraLoader.hide(callback, minDisplayTime, force);
        };
        window.forceHideKyraLoading = (callback) => {
            return KyraLoader.forceHide(callback);
        };
    }

    return KyraLoader;
});
