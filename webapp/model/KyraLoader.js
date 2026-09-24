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

            if (!isVisible) {
                iActiveCount = 1;
                startTime = Date.now();
            } else {
                iActiveCount = 1;
            }

            if (dismissTimer) {
                clearTimeout(dismissTimer);
                dismissTimer = null;
            }

            this._ensureStyles();
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

            // Safety timeout: auto-hide after duration or default 5s so application never hangs indefinitely
            const iEffectiveDuration = (typeof iDuration === "number" && iDuration > 0) ? iDuration : 5000;
            dismissTimer = setTimeout(() => {
                this.forceHide(fnComplete);
            }, iEffectiveDuration);
        },

        /**
         * Hides the global KYRA loading overlay immediately and safely.
         * @param {Function} [callback] Optional callback invoked after removal
         * @param {number} [minDisplayTime=0] Minimum milliseconds to keep loader displayed
         * @param {boolean} [bForce=false] If true, resets active counter and forces immediate dismissal
         */
        hide(callback, minDisplayTime = 0, bForce = false) {
            iActiveCount = 0;

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

        _ensureStyles() {
            if (typeof document === "undefined") return;
            if (!document.getElementById("kyra_loading_placement_styles")) {
                const style = document.createElement("style");
                style.id = "kyra_loading_placement_styles";
                style.textContent = `
                    .kyraLoadingSlideOverlay {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        background: rgba(15, 23, 42, 0.40) !important;
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                        filter: none !important;
                        display: none !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        z-index: 999999 !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        user-select: none !important;
                        -webkit-user-select: none !important;
                        transition: opacity 0.22s ease !important;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                    }
                    .kyraLoadingSlideOverlay.kyra-active {
                        display: flex !important;
                        opacity: 1 !important;
                        pointer-events: all !important;
                    }
                    .kyraLoadingSlideCard {
                        background: #FFFFFF !important;
                        width: 380px !important;
                        max-width: calc(100vw - 48px) !important;
                        border-radius: 22px !important;
                        box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(226, 232, 240, 0.85) !important;
                        padding: 32px 28px 32px 28px !important;
                        margin: 0 auto !important;
                        text-align: center !important;
                        position: relative !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        box-sizing: border-box !important;
                        transform: translateY(14px) scale(0.97) !important;
                        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    }
                    .kyraLoadingSlideOverlay.kyra-active .kyraLoadingSlideCard {
                        transform: translateY(0) scale(1) !important;
                    }
                    .kyraSimpleCircleSpinner {
                        width: 52px !important;
                        height: 52px !important;
                        display: block !important;
                        flex-shrink: 0 !important;
                        margin: 0 auto 18px auto !important;
                        border-radius: 50% !important;
                        border: 4px solid #E2E8F0 !important;
                        border-top-color: #008C9C !important;
                        border-right-color: #008C9C !important;
                        transform-origin: center center !important;
                        animation: kyraSimpleSpin 0.85s linear infinite !important;
                        box-sizing: border-box !important;
                    }
                    @keyframes kyraSimpleSpin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .kyraLoadingTitle {
                        width: 100% !important;
                        max-width: 100% !important;
                        text-align: center !important;
                        font-size: 17px !important;
                        font-weight: 700 !important;
                        color: #0F172A !important;
                        margin: 0 0 8px 0 !important;
                        padding: 0 !important;
                        line-height: 1.35 !important;
                        letter-spacing: -0.01em !important;
                        box-sizing: border-box !important;
                        word-break: break-word !important;
                    }
                    .kyraLoadingSubtitle {
                        width: 100% !important;
                        max-width: 324px !important;
                        text-align: center !important;
                        font-size: 13.5px !important;
                        font-weight: 400 !important;
                        color: #64748B !important;
                        line-height: 1.45 !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        word-break: break-word !important;
                    }
                `;
                document.head.appendChild(style);
            }
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
