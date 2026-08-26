/**
 * KYRA Universal Enterprise Dynamic Dialog System
 * Reusable dynamic popup dialog matching the KYRA Error Popup design.
 * Compatible with UI5, Vanilla JS, HTML, React, and external web frameworks.
 */

(function(global) {
    "use strict";

    const TYPE_CONFIGS = {
        error: {
            title: "Error",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            iconBg: "#dc2626", // Vivid Red
            accentColor: "#dc2626",
            btnColor: "#0284c7"
        },
        warning: {
            title: "Warning",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            iconBg: "#d97706", // Amber
            accentColor: "#d97706",
            btnColor: "#0284c7"
        },
        info: {
            title: "Information",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            iconBg: "#2563eb", // Blue
            accentColor: "#2563eb",
            btnColor: "#0284c7"
        },
        success: {
            title: "Success",
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            iconBg: "#16a34a", // Green
            accentColor: "#16a34a",
            btnColor: "#0284c7"
        }
    };

    let activeOverlay = null;

    const KyraDialog = {
        /**
         * Show dynamic dialog popup
         * @param {Object|string} options 
         * @param {string} [options.title] - Dialog header title
         * @param {string} options.message - Body message string or html
         * @param {'error'|'warning'|'info'|'success'} [options.type='error'] - Type of popup
         * @param {string} [options.buttonText='Close'] - Main action button label
         * @param {string} [options.secondaryButtonText] - Secondary button label (optional)
         * @param {Function} [options.onConfirm] - Callback on primary button click
         * @param {Function} [options.onCancel] - Callback on secondary button click
         * @param {Function} [options.onClose] - Callback on close
         */
        show(options) {
            if (typeof options === "string") {
                options = { message: options, type: "error" };
            }

            const type = (options.type || "error").toLowerCase();
            const config = TYPE_CONFIGS[type] || TYPE_CONFIGS.error;

            const titleText = options.title || config.title;
            const messageText = options.message || "An unexpected issue occurred.";
            const primaryBtnLabel = options.buttonText || (options.confirmButtonText ? options.confirmButtonText : "Close");
            const secondaryBtnLabel = options.secondaryButtonText || options.cancelButtonText;

            // Remove existing dialog if any
            this.closeCurrent();

            // Create Backdrop Overlay
            const overlay = document.createElement("div");
            overlay.className = "kyra-dialog-backdrop";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");

            // Create Modal Card Container
            const card = document.createElement("div");
            card.className = "kyra-dialog-card";
            if (options.maxWidth) {
                card.style.maxWidth = options.maxWidth;
            }

            // 1. Header Container
            const header = document.createElement("div");
            header.className = "kyra-dialog-header";

            const iconEl = document.createElement("div");
            iconEl.className = `kyra-dialog-icon-circle kyra-icon-${type}`;
            iconEl.style.backgroundColor = config.iconBg;
            iconEl.innerHTML = config.iconSvg;

            const titleEl = document.createElement("div");
            titleEl.className = "kyra-dialog-title-text";
            titleEl.textContent = titleText;

            header.appendChild(iconEl);
            header.appendChild(titleEl);

            // 2. Dynamic Accent Bar Line (directly below header)
            const accentBar = document.createElement("div");
            accentBar.className = "kyra-dialog-accent-bar";
            accentBar.style.backgroundColor = config.accentColor;

            // 3. Body Message Container
            const body = document.createElement("div");
            body.className = "kyra-dialog-body";
            
            if (options.messageHtml) {
                body.innerHTML = options.messageHtml;
            } else if (typeof messageText === "string" && (messageText.includes("<div") || messageText.includes("<p") || messageText.includes("<span"))) {
                body.innerHTML = messageText;
            } else {
                const messageEl = document.createElement("p");
                messageEl.className = "kyra-dialog-message";
                messageEl.style.whiteSpace = "pre-line";
                messageEl.textContent = messageText;
                body.appendChild(messageEl);
            }

            // 4. Footer & Action Buttons
            const footer = document.createElement("div");
            footer.className = "kyra-dialog-footer";

            if (secondaryBtnLabel) {
                const secBtn = document.createElement("button");
                secBtn.type = "button";
                secBtn.className = "kyra-dialog-btn kyra-dialog-btn-secondary";
                secBtn.textContent = secondaryBtnLabel;
                secBtn.addEventListener("click", () => {
                    this.closeCurrent();
                    if (typeof options.onCancel === "function") {
                        options.onCancel();
                    }
                    if (typeof options.onClose === "function") {
                        options.onClose("cancel");
                    }
                });
                footer.appendChild(secBtn);
            }

            const priBtn = document.createElement("button");
            priBtn.type = "button";
            priBtn.className = "kyra-dialog-btn kyra-dialog-btn-primary";
            priBtn.textContent = primaryBtnLabel;
            priBtn.addEventListener("click", () => {
                this.closeCurrent();
                if (typeof options.onConfirm === "function") {
                    options.onConfirm();
                }
                if (typeof options.onClose === "function") {
                    options.onClose("confirm");
                }
            });
            footer.appendChild(priBtn);

            // Assemble Component Structure
            card.appendChild(header);
            card.appendChild(accentBar);
            card.appendChild(body);
            card.appendChild(footer);
            overlay.appendChild(card);

            document.body.appendChild(overlay);
            activeOverlay = overlay;

            // Focus management
            setTimeout(() => {
                priBtn.focus();
            }, 50);

            // Allow ESC key to close
            const escHandler = (e) => {
                if (e.key === "Escape" && activeOverlay === overlay) {
                    document.removeEventListener("keydown", escHandler);
                    priBtn.click();
                }
            };
            document.addEventListener("keydown", escHandler);
        },

        error(message, title, buttonText, onClose) {
            this.show({ message, title: title || "Error", type: "error", buttonText, onClose });
        },

        warning(message, title, buttonText, onClose) {
            this.show({ message, title: title || "Warning", type: "warning", buttonText, onClose });
        },

        info(message, title, buttonText, onClose) {
            this.show({ message, title: title || "Information", type: "info", buttonText, onClose });
        },

        success(message, title, buttonText, onClose) {
            this.show({ message, title: title || "Success", type: "success", buttonText, onClose });
        },

        confirm(options) {
            const opts = typeof options === "string" ? { message: options } : options || {};
            this.show({
                title: opts.title || "Confirm Action",
                message: opts.message || "Are you sure you want to proceed?",
                type: opts.type || "warning",
                buttonText: opts.confirmText || opts.buttonText || "Confirm",
                secondaryButtonText: opts.cancelText || "Cancel",
                onConfirm: opts.onConfirm,
                onCancel: opts.onCancel,
                onClose: opts.onClose
            });
        },

        closeCurrent() {
            if (activeOverlay && activeOverlay.parentNode) {
                activeOverlay.parentNode.removeChild(activeOverlay);
                activeOverlay = null;
            }
        },

        /**
         * Patch SAPUI5 sap.m.MessageBox globally to enforce this dynamic KYRA dialog design
         */
        patchSapMessageBox() {
            if (typeof sap !== "undefined" && sap.ui) {
                sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {
                    if (MessageBox && !MessageBox._kyraPatched) {
                        MessageBox._kyraPatched = true;

                        MessageBox.error = function(vMessage, mOptions) {
                            const sMsg = typeof vMessage === "string" ? vMessage : (vMessage ? String(vMessage) : "");
                            const sTitle = (mOptions && mOptions.title) ? mOptions.title : "Error";
                            const fnClose = (mOptions && typeof mOptions.onClose === "function") ? mOptions.onClose : null;
                            const sBtn = (mOptions && mOptions.actions && mOptions.actions[0]) ? mOptions.actions[0] : "Close";
                            
                            KyraDialog.error(sMsg, sTitle, sBtn, fnClose);
                        };

                        MessageBox.warning = function(vMessage, mOptions) {
                            const sMsg = typeof vMessage === "string" ? vMessage : (vMessage ? String(vMessage) : "");
                            const sTitle = (mOptions && mOptions.title) ? mOptions.title : "Warning";
                            const fnClose = (mOptions && typeof mOptions.onClose === "function") ? mOptions.onClose : null;
                            KyraDialog.warning(sMsg, sTitle, "Close", fnClose);
                        };

                        MessageBox.information = function(vMessage, mOptions) {
                            const sMsg = typeof vMessage === "string" ? vMessage : (vMessage ? String(vMessage) : "");
                            const sTitle = (mOptions && mOptions.title) ? mOptions.title : "Information";
                            const fnClose = (mOptions && typeof mOptions.onClose === "function") ? mOptions.onClose : null;
                            KyraDialog.info(sMsg, sTitle, "Close", fnClose);
                        };

                        MessageBox.success = function(vMessage, mOptions) {
                            const sMsg = typeof vMessage === "string" ? vMessage : (vMessage ? String(vMessage) : "");
                            const sTitle = (mOptions && mOptions.title) ? mOptions.title : "Success";
                            const fnClose = (mOptions && typeof mOptions.onClose === "function") ? mOptions.onClose : null;
                            KyraDialog.success(sMsg, sTitle, "Close", fnClose);
                        };

                        MessageBox.alert = function(vMessage, mOptions) {
                            const sMsg = typeof vMessage === "string" ? vMessage : (vMessage ? String(vMessage) : "");
                            const sTitle = (mOptions && mOptions.title) ? mOptions.title : "Alert";
                            const fnClose = (mOptions && typeof mOptions.onClose === "function") ? mOptions.onClose : null;
                            KyraDialog.warning(sMsg, sTitle, "Close", fnClose);
                        };

                        MessageBox.show = function(vMessage, mOptions) {
                            const sMsg = typeof vMessage === "string" ? vMessage : (vMessage ? String(vMessage) : "");
                            const sTitle = (mOptions && mOptions.title) ? mOptions.title : "Notification";
                            const sIcon = (mOptions && mOptions.icon) ? String(mOptions.icon).toLowerCase() : "info";
                            let type = "info";
                            if (sIcon.includes("error")) type = "error";
                            if (sIcon.includes("warning")) type = "warning";
                            if (sIcon.includes("success")) type = "success";
                            const fnClose = (mOptions && typeof mOptions.onClose === "function") ? mOptions.onClose : null;
                            KyraDialog.show({ message: sMsg, title: sTitle, type: type, buttonText: "Close", onClose: fnClose });
                        };
                    }
                });
            }
        }
    };

    // Auto-patch when DOM is ready or UI5 is loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            KyraDialog.patchSapMessageBox();
        });
    } else {
        KyraDialog.patchSapMessageBox();
    }

    // Export globally
    global.KyraDialog = KyraDialog;

    /**
     * =========================================================================
     * KYRA Universal Enterprise Loading Screen & Popup Slide System
     * Matching the exact Shield & Orbit Spinner design from media_1787652709745
     * =========================================================================
     */
    let activeLoadingOverlay = null;
    let loadingHideTimer = null;
    let loadingShowTimestamp = 0;

    const KyraLoading = {
        /**
         * Show Kyra Loading Screen
         * @param {Object|string} [options]
         * @param {string} [options.title="Loading Access Data..."]
         * @param {string} [options.subtitle="Please wait while we synchronize and update permissions..."]
         * @param {number} [options.duration] - Optional auto-dismiss duration in ms
         * @param {Function} [options.onComplete] - Callback on auto-dismiss
         */
        show(options) {
            if (typeof options === "string") {
                options = { title: options };
            }
            options = options || {};
            const title = options.title || "Loading Access Data...";
            const subtitle = options.subtitle || "Please wait while we synchronize and update permissions...";

            if (loadingHideTimer) {
                clearTimeout(loadingHideTimer);
                loadingHideTimer = null;
            }

            const existing = document.getElementById("kyra_loading_slide_overlay");
            if (existing) {
                existing.remove();
            }

            const overlay = document.createElement("div");
            overlay.id = "kyra_loading_slide_overlay";
            overlay.className = "kyraLoadingSlideOverlay";

            overlay.innerHTML = `
                <div class="kyraLoadingSlideCard">
                    <!-- Clean Single Circle Loading -->
                    <div class="kyraSimpleCircleSpinner"></div>

                    <!-- Title -->
                    <div class="kyraLoadingTitle">${title}</div>

                    <!-- Subtitle / Simple Command Down -->
                    <div class="kyraLoadingSubtitle">${subtitle}</div>
                </div>
            `;

            document.body.appendChild(overlay);
            activeLoadingOverlay = overlay;
            loadingShowTimestamp = Date.now();

            requestAnimationFrame(() => {
                overlay.classList.add("kyra-active");
            });

            if (options.duration && options.duration > 0) {
                loadingHideTimer = setTimeout(() => {
                    this.hide(options.onComplete);
                }, options.duration);
            }
        },

        /**
         * Hide Kyra Loading Screen smoothly
         * @param {Function} [onHidden]
         */
        hide(onHidden) {
            if (loadingHideTimer) {
                clearTimeout(loadingHideTimer);
                loadingHideTimer = null;
            }

            const overlay = activeLoadingOverlay || document.getElementById("kyra_loading_slide_overlay");
            if (!overlay) {
                if (typeof onHidden === "function") onHidden();
                return;
            }

            const elapsed = Date.now() - loadingShowTimestamp;
            const delay = Math.max(0, 260 - elapsed);

            setTimeout(() => {
                overlay.classList.remove("kyra-active");
                setTimeout(() => {
                    overlay.remove();
                    if (activeLoadingOverlay === overlay) {
                        activeLoadingOverlay = null;
                    }
                    if (typeof onHidden === "function") onHidden();
                }, 220);
            }, delay);
        },

        /**
         * Wrap async function in Kyra Loading Screen
         */
        async runWithLoading(options, asyncTask) {
            if (typeof options === "function") {
                asyncTask = options;
                options = {};
            }
            this.show(options);
            try {
                return await asyncTask();
            } finally {
                this.hide();
            }
        }
    };

    global.KyraLoading = KyraLoading;
    global.showKyraLoading = KyraLoading.show.bind(KyraLoading);
    global.hideKyraLoading = KyraLoading.hide.bind(KyraLoading);

    // Hook into SAP UI5 core BusyIndicator to replace default black "Please wait" box globally
    function setupBusyIndicatorHook() {
        if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
            sap.ui.core.BusyIndicator.show = function(iDelay, sCustomText) {
                KyraLoading.show({
                    title: (typeof sCustomText === "string" && sCustomText) ? sCustomText : "Loading Access Data...",
                    subtitle: "Please wait while we synchronize and update permissions..."
                });
            };

            sap.ui.core.BusyIndicator.hide = function() {
                KyraLoading.hide();
            };
        }
    }

    if (typeof sap !== "undefined" && sap.ui && sap.ui.core) {
        setupBusyIndicatorHook();
    } else {
        window.addEventListener("DOMContentLoaded", setupBusyIndicatorHook);
        window.addEventListener("load", setupBusyIndicatorHook);
    }

    // Initial page load screen hook
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            if (!sessionStorage.getItem("kyra_loaded_once")) {
                KyraLoading.show({
                    title: "Initializing Kyra Portal...",
                    subtitle: "Loading security governance policies and enterprise ledger...",
                    duration: 900
                });
                sessionStorage.setItem("kyra_loaded_once", "true");
            }
        });
    }

    // Export as UI5 Module if sap.ui.define is available
    if (typeof sap !== "undefined" && sap.ui && sap.ui.define) {
        sap.ui.define([], function() {
            return {
                KyraDialog: KyraDialog,
                KyraLoading: KyraLoading
            };
        });
    }
})(typeof window !== "undefined" ? window : this);
