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
        danger: {
            title: "Confirm Action",
            iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
            iconBg: "#FFF1F2",
            accentColor: "#E11D48",
            btnColor: "#E11D48"
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
            const message = options.messageHtml || options.message || options.html || "";
            const buttonText = options.buttonText || options.confirmButtonText || "Proceed";
            const secondaryButtonText = options.secondaryButtonText || options.cancelButtonText || null;
            const maxWidth = options.maxWidth || "500px";
            const btnColor = options.btnColor || options.confirmBtnColor || config.btnColor || "#008C9C";
            const btnHoverColor = options.btnHoverColor || (btnColor === "#E11D48" ? "#BE123C" : (btnColor === "#008C9C" ? "#007684" : btnColor));

            if (activeOverlay) {
                this.hide();
            }

            const overlay = document.createElement("div");
            overlay.id = "kyra_dialog_overlay";
            overlay.className = "kyraDialogOverlay";
            overlay.style.cssText = "position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; margin: 0 !important; padding: 20px !important; box-sizing: border-box !important; background: rgba(15, 23, 42, 0.6) !important; backdrop-filter: blur(6px) !important; -webkit-backdrop-filter: blur(6px) !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 2000000 !important; animation: kyraDialogFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);";

            const card = document.createElement("div");
            card.className = "kyraDialogCard";
            card.style.cssText = `background: #FFFFFF !important; border-radius: 16px !important; width: 100% !important; max-width: ${maxWidth} !important; max-height: 88vh !important; margin: auto !important; position: relative !important; box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.35), 0 8px 16px -4px rgba(15, 23, 42, 0.1) !important; overflow: hidden !important; animation: kyraDialogPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important; border: 1px solid #E2E8F0 !important; box-sizing: border-box !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; display: flex !important; flex-direction: column !important;`;

            const hasSecondary = Boolean(secondaryButtonText);

            card.innerHTML = `
                <div style="padding: 18px 22px 16px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; flex-shrink: 0; background: #FFFFFF;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: ${config.iconBg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                            ${config.iconSvg}
                        </div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0F172A; letter-spacing: -0.01em;">${title}</h3>
                    </div>
                    <button id="kyra_dialog_close_btn" style="background: none; border: none; cursor: pointer; color: #94A3B8; font-size: 18px; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease;" onmouseover="this.style.background='#F1F5F9';this.style.color='#334155';" onmouseout="this.style.background='none';this.style.color='#94A3B8';">✕</button>
                </div>
                <div style="padding: 18px 22px; font-size: 14px; line-height: 1.55; color: #475569; overflow-y: auto; flex: 1 1 auto; -webkit-overflow-scrolling: touch;">
                    ${message}
                </div>
                <div style="padding: 14px 22px; background: #F8FAFC; border-top: 1px solid #F1F5F9; display: flex; justify-content: flex-end; gap: 10px; align-items: center; flex-shrink: 0;">
                    ${hasSecondary ? `<button id="kyra_dialog_cancel_btn" style="height: 38px; min-height: 38px; min-width: 100px; padding: 0 20px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #FFFFFF; color: #334155; font-weight: 600; font-size: 13.5px; font-family: inherit; cursor: pointer; box-shadow: none; transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1); display: inline-flex; align-items: center; justify-content: center;" onmouseover="this.style.borderColor='#94A3B8';this.style.background='#F8FAFC';this.style.color='#0F172A';" onmouseout="this.style.borderColor='#CBD5E1';this.style.background='#FFFFFF';this.style.color='#334155';" onmousedown="this.style.transform='scale(0.97)';" onmouseup="this.style.transform='scale(1)';">${secondaryButtonText}</button>` : ''}
                    <button id="kyra_dialog_confirm_btn" style="height: 38px; min-height: 38px; min-width: 120px; padding: 0 24px; border-radius: 10px; border: 1px solid ${btnColor}; background: ${btnColor}; color: #FFFFFF; font-weight: 600; font-size: 13.5px; font-family: inherit; letter-spacing: 0.015em; cursor: pointer; box-shadow: none; transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1); display: inline-flex; align-items: center; justify-content: center;" onmouseover="this.style.background='${btnHoverColor}';this.style.borderColor='${btnHoverColor}';" onmouseout="this.style.background='${btnColor}';this.style.borderColor='${btnColor}';" onmousedown="this.style.transform='scale(0.97)';" onmouseup="this.style.transform='scale(1)';">${buttonText}</button>
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
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                return window.KyraLoader.show(options);
            }
        },
        hide(callback, minDisplayTime, force) {
            if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                return window.KyraLoader.hide(callback, minDisplayTime, force);
            }
        }
    };

    if (typeof window !== "undefined") {
        window.KyraDialog = KyraDialog;
        if (!window.KyraLoading || !window.KyraLoading.wrap) {
            window.KyraLoading = KyraLoading;
        }
    }

    return KyraDialog;
});