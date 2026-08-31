sap.ui.define([], function() {
    "use strict";

    /**
     * KYRA Universal Enterprise Dynamic Dialog System
     */
    const TYPE_CONFIGS = {
        error: {
            title: "Error",
            iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            iconBg: "#dc2626",
            accentColor: "#dc2626",
            btnColor: "#0284c7"
        },
        warning: {
            title: "Warning",
            iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            iconBg: "#d97706",
            accentColor: "#d97706",
            btnColor: "#0284c7"
        },
        info: {
            title: "Information",
            iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            iconBg: "#2563eb",
            accentColor: "#2563eb",
            btnColor: "#0284c7"
        },
        success: {
            title: "Success",
            iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            iconBg: "#16a34a",
            accentColor: "#16a34a",
            btnColor: "#0284c7"
        }
    };

    let activeOverlay = null;

    const KyraDialog = {
        show(options) {
            if (typeof options === "string") {
                options = { message: options };
            }
            options = options || {};
            const type = options.type || "error";
            const config = TYPE_CONFIGS[type] || TYPE_CONFIGS.error;
            const title = options.title || config.title;
            const message = options.message || options.messageHtml || "";
            const buttonText = options.buttonText || "Close";
            const secondaryButtonText = options.secondaryButtonText || null;
            const maxWidth = options.maxWidth || "520px";

            if (activeOverlay) {
                this.hide();
            }

            const overlay = document.createElement("div");
            overlay.id = "kyra_dialog_overlay";
            overlay.className = "kyraDialogOverlay";
            overlay.style.cssText = "position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; animation: kyraFadeIn 0.2s ease;";

            const card = document.createElement("div");
            card.className = "kyraDialogCard";
            card.style.cssText = `background: #FFFFFF; border-radius: 16px; width: 100%; max-width: ${maxWidth}; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); overflow: hidden; animation: kyraScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);`;

            const hasSecondary = Boolean(secondaryButtonText);

            card.innerHTML = `
                <div style="padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${config.iconBg}; color: white; display: flex; align-items: center; justify-content: center;">
                            ${config.iconSvg}
                        </div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0F172A;">${title}</h3>
                    </div>
                    <button id="kyra_dialog_close_btn" style="background: none; border: none; cursor: pointer; color: #94A3B8; font-size: 20px; padding: 4px; display: flex; align-items: center; justify-content: center;">✕</button>
                </div>
                <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #334155;">
                    ${message}
                </div>
                <div style="padding: 16px 24px; background: #F8FAFC; border-top: 1px solid #F1F5F9; display: flex; justify-content: flex-end; gap: 12px;">
                    ${hasSecondary ? `<button id="kyra_dialog_cancel_btn" style="padding: 9px 18px; border-radius: 8px; border: 1px solid #CBD5E1; background: white; color: #475569; font-weight: 600; cursor: pointer;">${secondaryButtonText}</button>` : ''}
                    <button id="kyra_dialog_confirm_btn" style="padding: 9px 22px; border-radius: 8px; border: none; background: #2563EB; color: white; font-weight: 600; cursor: pointer;">${buttonText}</button>
                </div>
            `;

            overlay.appendChild(card);
            document.body.appendChild(overlay);
            activeOverlay = overlay;

            const closeDialog = () => {
                this.hide();
                if (typeof options.onClose === "function") options.onClose();
            };

            const closeBtn = card.querySelector("#kyra_dialog_close_btn");
            if (closeBtn) closeBtn.onclick = closeDialog;

            const cancelBtn = card.querySelector("#kyra_dialog_cancel_btn");
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    this.hide();
                    if (typeof options.onCancel === "function") options.onCancel();
                };
            }

            const confirmBtn = card.querySelector("#kyra_dialog_confirm_btn");
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    this.hide();
                    if (typeof options.onConfirm === "function") options.onConfirm();
                };
            }
        },

        hide() {
            if (activeOverlay && activeOverlay.parentNode) {
                activeOverlay.parentNode.removeChild(activeOverlay);
            }
            activeOverlay = null;
        }
    };

    const KyraLoading = {
        show(options) {
            console.log("KyraLoading show", options);
        },
        hide() {
            console.log("KyraLoading hide");
        }
    };

    if (typeof window !== "undefined") {
        window.KyraDialog = KyraDialog;
        window.KyraLoading = KyraLoading;
    }

    return KyraDialog;
});