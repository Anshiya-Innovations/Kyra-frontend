sap.ui.define([], function() {
    "use strict";

    /**
     * KYRA Universal Enterprise Dynamic Dialog System
     */
    const TYPE_CONFIGS = {
        error: {
            title: "Error",
            iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            iconBg: "#FEF2F2",
            accentColor: "#DC2626",
            btnColor: "#008C9C"
        },
        warning: {
            title: "Warning",
            iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            iconBg: "#FFFBEB",
            accentColor: "#D97706",
            btnColor: "#008C9C"
        },
        info: {
            title: "Information",
            iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            iconBg: "rgba(0, 140, 156, 0.12)",
            accentColor: "#008C9C",
            btnColor: "#008C9C"
        },
        success: {
            title: "Success",
            iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            iconBg: "#ECFDF5",
            accentColor: "#059669",
            btnColor: "#008C9C"
        }
    };

    let activeOverlay = null;

    const KyraDialog = {
        show(options) {
            if (typeof options === "string") {
                options = { message: options };
            }
            options = options || {};
            const type = options.type || "warning";
            const config = TYPE_CONFIGS[type] || TYPE_CONFIGS.warning;
            const title = options.title || config.title;
            const message = options.message || options.messageHtml || "";
            const buttonText = options.buttonText || "Proceed";
            const secondaryButtonText = options.secondaryButtonText || null;
            const maxWidth = options.maxWidth || "480px";

            if (activeOverlay) {
                this.hide();
            }

            const overlay = document.createElement("div");
            overlay.id = "kyra_dialog_overlay";
            overlay.className = "kyraDialogOverlay";
            overlay.style.cssText = "position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; margin: 0 !important; padding: 20px !important; box-sizing: border-box !important; background: rgba(15, 23, 42, 0.6) !important; backdrop-filter: blur(4px) !important; -webkit-backdrop-filter: blur(4px) !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 2000000 !important; animation: kyraDialogFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);";

            const card = document.createElement("div");
            card.className = "kyraDialogCard";
            card.style.cssText = `background: #FFFFFF !important; border-radius: 16px !important; width: 100% !important; max-width: ${maxWidth} !important; max-height: 90vh !important; margin: auto !important; position: relative !important; box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.25), 0 8px 16px -4px rgba(15, 23, 42, 0.1) !important; overflow: hidden !important; animation: kyraDialogPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important; border: 1px solid #E2E8F0 !important; box-sizing: border-box !important;`;

            const hasSecondary = Boolean(secondaryButtonText);

            card.innerHTML = `
                <div style="padding: 22px 24px 18px 24px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${config.iconBg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            ${config.iconSvg}
                        </div>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #0F172A; letter-spacing: -0.01em;">${title}</h3>
                    </div>
                    <button id="kyra_dialog_close_btn" style="background: none; border: none; cursor: pointer; color: #94A3B8; font-size: 20px; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease;" onmouseover="this.style.background='#F1F5F9';this.style.color='#334155';" onmouseout="this.style.background='none';this.style.color='#94A3B8';">✕</button>
                </div>
                <div style="padding: 0 24px 24px 24px; font-size: 14.5px; line-height: 1.6; color: #475569;">
                    ${message}
                </div>
                <div style="padding: 16px 24px; background: #F8FAFC; border-top: 1px solid #F1F5F9; display: flex; justify-content: center; gap: 14px; align-items: center;">
                    ${hasSecondary ? `<button id="kyra_dialog_cancel_btn" style="min-width: 140px; padding: 10px 22px; border-radius: 8px; border: 1.5px solid #CBD5E1; background: #FFFFFF; color: #334155; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.15s ease;" onmouseover="this.style.borderColor='#94A3B8';this.style.background='#F8FAFC';" onmouseout="this.style.borderColor='#CBD5E1';this.style.background='#FFFFFF';">${secondaryButtonText}</button>` : ''}
                    <button id="kyra_dialog_confirm_btn" style="min-width: 160px; padding: 10px 24px; border-radius: 8px; border: none; background: #008C9C; color: #FFFFFF; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25); transition: all 0.15s ease;" onmouseover="this.style.background='#007684';" onmouseout="this.style.background='#008C9C';">${buttonText}</button>
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