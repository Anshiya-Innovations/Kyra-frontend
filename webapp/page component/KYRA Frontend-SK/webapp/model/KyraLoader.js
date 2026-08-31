sap.ui.define([], function() {
    "use strict";

    let dismissTimer = null;
    let startTime = 0;
    let isVisible = false;

    const KyraLoader = {
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
                    <div class="kyraSimpleCircleSpinner"></div>
                    <div class="kyraLoadingTitle">${sTitle}</div>
                    <div class="kyraLoadingSubtitle">${sSubtitle}</div>
                </div>
            `;

            overlay.classList.add("kyra-active");
            overlay.style.setProperty("display", "flex", "important");
            overlay.style.setProperty("pointer-events", "all", "important");

            if (typeof iDuration === "number" && iDuration > 0) {
                dismissTimer = setTimeout(() => {
                    this.hide(fnComplete);
                }, iDuration);
            }
        },

        hide(callback, minDisplayTime = 0) {
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
                    overlay.style.setProperty("display", "none", "important");
                    overlay.style.setProperty("pointer-events", "none", "important");
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }
                isVisible = false;
                if (typeof callback === "function") {
                    callback();
                }
            }, remaining);
        },

        isShowing() {
            return isVisible;
        },

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
        window.hideKyraLoading = (callback, minDisplayTime) => {
            return KyraLoader.hide(callback, minDisplayTime);
        };
    }

    return KyraLoader;
});
