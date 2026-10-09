sap.ui.define([], function() {
    "use strict";

    let dismissTimer = null;
    let startTime = 0;
    let isVisible = false;
    let iActiveCount = 0;
    let isBusyIndicatorHooked = false;
    let isFetchHooked = false;
    let pageLoadTimestamp = Date.now();
    let lastUserActionTimestamp = Date.now();

    if (typeof window !== "undefined") {
        const markAction = () => { lastUserActionTimestamp = Date.now(); };
        ["pointerdown", "keydown", "click", "touchstart"].forEach(evt => {
            window.addEventListener(evt, markAction, { passive: true, capture: true });
        });
        window.addEventListener("hashchange", markAction, { passive: true });
        window.addEventListener("popstate", markAction, { passive: true });
    }

    const KyraLoader = {
        /**
         * Shows or updates the global KYRA project-themed loading popup slide.
         * Only displayed on explicit user actions or explicit calls.
         * Never triggered by background polling intervals.
         * @param {Object|string} options
         */
        /**
         * Transitions the current loading slide into a clean, modern success slide.
         * Shows a teal checkmark icon circle, success title, and success subtitle for a duration, then smoothly hides.
         * @param {Object|string} options { title, subtitle, duration, onComplete }
         */
        showSuccess(options) {
            if (typeof options === "string") {
                options = { subtitle: options };
            }
            options = options || {};
            const sTitle = options.title || "Saved Successfully";
            const sSubtitle = options.subtitle || "Customization saved to database successfully.";
            const iDuration = (typeof options.duration === "number" && options.duration > 0) ? options.duration : 1900;
            const fnComplete = options.onComplete || (() => {});

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

            overlay.innerHTML = `
                <div class="kyraLoadingSlideCard kyraSuccessSlideCard">
                    <div class="kyraSuccessCheckCircle">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div class="kyraLoadingTitle kyraSuccessTitle">${sTitle}</div>
                    <div class="kyraLoadingSubtitle kyraSuccessSubtitle">${sSubtitle}</div>
                </div>
            `;

            overlay.classList.add("kyra-active");
            overlay.style.setProperty("display", "flex", "important");
            overlay.style.setProperty("opacity", "1", "important");
            overlay.style.setProperty("pointer-events", "all", "important");

            dismissTimer = setTimeout(() => {
                this.forceHide(fnComplete);
            }, iDuration);
        },

        show(options) {
            if (typeof options === "string") {
                options = { title: options };
            }
            options = options || {};
            const sTitle = options.title || "Loading Data...";
            const sSubtitle = options.subtitle || "Please wait a moment while Kyra retrieves the latest information...";
            const iDuration = options.duration;
            const fnComplete = options.onComplete || (() => {});

            if (!isVisible) {
                iActiveCount = 1;
                startTime = Date.now();
            } else {
                iActiveCount++;
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

            const oExistingTitle = overlay.querySelector(".kyraLoadingTitle");
            const oExistingSubtitle = overlay.querySelector(".kyraLoadingSubtitle");
            if (oExistingTitle && oExistingSubtitle) {
                oExistingTitle.textContent = sTitle;
                oExistingSubtitle.textContent = sSubtitle;
            } else {
                overlay.innerHTML = `
                    <div class="kyraLoadingSlideCard">
                        <div class="kyraSimpleSpinner"></div>
                        <div class="kyraLoadingTitle">${sTitle}</div>
                        <div class="kyraLoadingSubtitle">${sSubtitle}</div>
                    </div>
                `;
            }

            overlay.classList.add("kyra-active");
            overlay.style.setProperty("display", "flex", "important");
            overlay.style.setProperty("opacity", "1", "important");
            overlay.style.setProperty("pointer-events", "all", "important");

            // Safety timeout: auto-hide after duration or default 6s so app never hangs
            const iEffectiveDuration = (typeof iDuration === "number" && iDuration > 0) ? iDuration : 6000;
            dismissTimer = setTimeout(() => {
                this.forceHide(fnComplete);
            }, iEffectiveDuration);
        },

        /**
         * Gracefully hides the global KYRA loading popup slide.
         * @param {Function} [callback]
         * @param {number} [minDisplayTime=0]
         * @param {boolean} [bForce=false]
         */
        hide(callback, minDisplayTime = 0, bForce = false) {
            if (!bForce && iActiveCount > 1) {
                iActiveCount--;
                return;
            }
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
         * Forcibly hides the loader immediately.
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
         * Embeds the modern Kyra project design, colour, and theme styles.
         */
        _ensureStyles() {
            if (typeof document === "undefined") return;
            if (!document.getElementById("kyra_loading_placement_styles")) {
                const style = document.createElement("style");
                style.id = "kyra_loading_placement_styles";
                style.textContent = `
                    /* Backdrop Overlay with smooth frosted blur */
                    .kyraLoadingSlideOverlay {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: rgba(15, 23, 42, 0.45) !important;
                        backdrop-filter: blur(6px) !important;
                        -webkit-backdrop-filter: blur(6px) !important;
                        display: none !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin: 0 !important;
                        padding: 16px !important;
                        box-sizing: border-box !important;
                        z-index: 9999999 !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        user-select: none !important;
                        -webkit-user-select: none !important;
                        transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1) !important;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                    }
                    .kyraLoadingSlideOverlay.kyra-active {
                        display: flex !important;
                        opacity: 1 !important;
                        pointer-events: all !important;
                    }

                    /* Floating Popup Slide Card - Simple Clean Design from screenshot */
                    .kyraLoadingSlideCard {
                        background: #FFFFFF !important;
                        width: 400px !important;
                        max-width: calc(100vw - 36px) !important;
                        border-radius: 22px !important;
                        border: 1px solid rgba(226, 232, 240, 0.85) !important;
                        box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.16), 0 8px 18px -4px rgba(15, 23, 42, 0.08) !important;
                        padding: 38px 32px 34px 32px !important;
                        margin: 0 auto !important;
                        text-align: center !important;
                        position: relative !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        box-sizing: border-box !important;
                        transform: translateY(12px) scale(0.97) !important;
                        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    }
                    .kyraLoadingSlideOverlay.kyra-active .kyraLoadingSlideCard {
                        transform: translateY(0) scale(1) !important;
                    }

                    /* Simple Circular Ring Spinner */
                    .kyraSimpleSpinner {
                        width: 52px !important;
                        height: 52px !important;
                        border-radius: 50% !important;
                        border: 4px solid #E2E8F0 !important;
                        border-top-color: #008C9C !important;
                        animation: kyraSimpleSpin 0.85s linear infinite !important;
                        margin: 0 auto 22px auto !important;
                        box-sizing: border-box !important;
                    }
                    @keyframes kyraSimpleSpin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    /* Success Card Icon & Animation */
                    .kyraSuccessCheckCircle {
                        width: 56px !important;
                        height: 56px !important;
                        border-radius: 50% !important;
                        background-color: #008C9C !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin: 0 auto 20px auto !important;
                        box-shadow: 0 8px 24px -4px rgba(0, 140, 156, 0.45) !important;
                        animation: kyraCheckPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                    }
                    @keyframes kyraCheckPop {
                        0% { transform: scale(0.6); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .kyraSuccessTitle {
                        color: #0F172A !important;
                        font-size: 19px !important;
                        font-weight: 700 !important;
                        margin-bottom: 8px !important;
                    }
                    .kyraSuccessSubtitle {
                        color: #475569 !important;
                        font-size: 13.5px !important;
                        line-height: 1.45 !important;
                        max-width: 340px !important;
                    }

                    /* Title: Bold & Centered */
                    .kyraLoadingTitle {
                        width: 100% !important;
                        text-align: center !important;
                        font-size: 19px !important;
                        font-weight: 700 !important;
                        color: #0F172A !important;
                        margin: 0 0 10px 0 !important;
                        padding: 0 !important;
                        line-height: 1.35 !important;
                        letter-spacing: -0.015em !important;
                    }

                    /* Subtitle: Clean Slate & Centered */
                    .kyraLoadingSubtitle {
                        width: 100% !important;
                        max-width: 320px !important;
                        text-align: center !important;
                        font-size: 13.5px !important;
                        font-weight: 400 !important;
                        color: #64748B !important;
                        line-height: 1.5 !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                    }

                    /* Suppress standard UI5 busy indicator dots so only Kyra's loading slide appears */
                    .sapUiBusy,
                    .sapUiBLDay,
                    .sapUiLocalBusyIndicator {
                        opacity: 0 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        },

        /**
         * Sets up universal hooks for sap.ui.core.BusyIndicator and intelligent fetch interception.
         * Only triggers on actual user data-running time (navigation, submission, approval, queries)
         * and NEVER during silent background polling intervals or idle time.
         */
        setupGlobalHooks() {
            if (typeof window === "undefined") return;

            // 1. Hook sap.ui.core.BusyIndicator
            if (!isBusyIndicatorHooked && typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                isBusyIndicatorHooked = true;
                const self = this;
                const origShow = sap.ui.core.BusyIndicator.show;
                const origHide = sap.ui.core.BusyIndicator.hide;

                sap.ui.core.BusyIndicator.show = function(iDelay) {
                    self.show({
                        title: "Processing Request...",
                        subtitle: "Verifying and synchronizing governance data..."
                    });
                    if (typeof origShow === "function") {
                        origShow.call(this, 999999); // Suppress default dots
                    }
                };

                sap.ui.core.BusyIndicator.hide = function() {
                    self.hide();
                    if (typeof origHide === "function") {
                        origHide.apply(this, arguments);
                    }
                };
            }

            // 2. Intelligent Fetch Interceptor for Data-Running Time
            if (!isFetchHooked && typeof window.fetch === "function") {
                isFetchHooked = true;
                const self = this;
                const origFetch = window.fetch;

                window.fetch = function(...args) {
                    const resource = args[0];
                    const init = args[1] || {};
                    const sUrl = (typeof resource === "string") ? resource : (resource && resource.url ? resource.url : "");
                    const sMethod = ((init.method) || (resource && resource.method) || "GET").toUpperCase();

                    // Skip static resources (files, assets, html, css, js, json models, icons)
                    const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|webp|css|js|properties|xml|html)(\?.*)?$/i.test(sUrl);
                    const isSilentHeader = init.headers && (
                        init.headers["X-Kyra-Silent"] === "true" || 
                        (typeof init.headers.get === "function" && init.headers.get("X-Kyra-Silent") === "true")
                    );

                    // NEVER show during silent background polling or idle "no action time"
                    const isSilentBackground = window._kyraSilentBackgroundSync === true;
                    const now = Date.now();
                    const isRecentUserAction = (now - lastUserActionTimestamp < 4500);
                    const isInitialPageLoad = (now - pageLoadTimestamp < 6000);
                    const isDataMutation = (sMethod === "POST" || sMethod === "PUT" || sMethod === "DELETE" || sMethod === "PATCH");
                    const isDataEndpoint = sUrl.includes("/odata/v4/") || sUrl.includes("/api/") || sUrl.includes("/GovernanceHistory") || sUrl.includes("/SoDMatrix");

                    const shouldShowLoader = !isStaticAsset && !isSilentHeader && !isSilentBackground && isDataEndpoint && (isDataMutation || isRecentUserAction || isInitialPageLoad);

                    if (!shouldShowLoader) {
                        return origFetch.apply(this, args);
                    }

                    // Contextual title & subtitle for the Kyra Loading Slide
                    let sTitle = "Loading Data...";
                    let sSubtitle = "Retrieving records from Kyra Governance database...";

                    if (sUrl.includes("/submitAccessRequest")) {
                        sTitle = "Submitting Access Request...";
                        sSubtitle = "Recording requested entitlements and routing to approvers...";
                    } else if (sUrl.includes("/submitAccessDecision")) {
                        sTitle = "Recording Decision...";
                        sSubtitle = "Saving governance decision and updating audit trail...";
                    } else if (sUrl.includes("/GovernanceHistory")) {
                        sTitle = "Loading Governance Records...";
                        sSubtitle = "Synchronizing active roles, pending requests, and history...";
                    } else if (sUrl.includes("/SoDMatrix")) {
                        sTitle = "Analyzing Conflicts...";
                        sSubtitle = "Evaluating Segregation of Duties (SoD) risk rules...";
                    } else if (sUrl.includes("/convertUserPersona") || sUrl.includes("/convertDepartmentPersona")) {
                        sTitle = "Converting Persona...";
                        sSubtitle = "Updating user persona classifications in database...";
                    } else if (sUrl.includes("/saveAdminCustomization")) {
                        sTitle = "Saving Configuration...";
                        sSubtitle = "Persisting governance customization settings...";
                    } else if (sUrl.includes("/testConnection") || sUrl.includes("/testKyraConnection")) {
                        sTitle = "Testing Database Connection...";
                        sSubtitle = "Verifying connectivity and schema authorization...";
                    } else if (sUrl.includes("/migrateData")) {
                        sTitle = "Migrating Governance Data...";
                        sSubtitle = "Updating database records and structural tables...";
                    } else if (sUrl.includes("/login")) {
                        sTitle = "Authenticating User...";
                        sSubtitle = "Verifying credentials and security permissions...";
                    }

                    let showTimer = null;
                    let bShown = false;

                    if (isDataMutation) {
                        bShown = true;
                        self.show({ title: sTitle, subtitle: sSubtitle });
                    } else {
                        showTimer = setTimeout(() => {
                            bShown = true;
                            self.show({ title: sTitle, subtitle: sSubtitle });
                        }, 100);
                    }

                    return origFetch.apply(this, args)
                        .then(res => {
                            if (showTimer) clearTimeout(showTimer);
                            if (bShown && !sUrl.includes("/saveAdminCustomization") && !sUrl.includes("/convertDepartmentPersona")) {
                                self.hide(null, 320);
                            }
                            return res;
                        })
                        .catch(err => {
                            if (showTimer) clearTimeout(showTimer);
                            if (bShown) {
                                self.hide(null, 320);
                            }
                            throw err;
                        });
                };
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

        // Automatically initialize hooks and styles
        KyraLoader._ensureStyles();
        KyraLoader.setupGlobalHooks();
    }

    return KyraLoader;
});
