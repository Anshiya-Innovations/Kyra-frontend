sap.ui.define([
    "sap/ui/core/UIComponent",
    "kyra001/model/models",
    "kyra001/model/KyraDialog"
], (UIComponent, models, KyraDialog) => {
    "use strict";

    return UIComponent.extend("kyra001.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Setup modern Loading Screen enhancement
            this._setupModernBusyIndicator();

            // enable routing
            this.getRouter().initialize();
        },

        _setupModernBusyIndicator() {
            const injectModernLoader = (el) => {
                if (!el || el.querySelector(".kyra-modern-loader-content")) return;
                const oContent = document.createElement("div");
                oContent.className = "kyra-modern-loader-content";
                oContent.innerHTML = `
                    <div class="kyra-loader-spinner-wrapper">
                        <div class="kyra-loader-spinner-ring"></div>
                        <div class="kyra-loader-shield-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="kyra-loader-title">Loading data...</div>
                    <div class="kyra-loader-subtext">Please wait, this may take a few seconds.</div>
                `;
                el.appendChild(oContent);
            };

            if (typeof MutationObserver !== "undefined") {
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                if (node.id === "sap-ui-busy-indicator" || node.classList.contains("sapUiBusy") || node.classList.contains("sapUiLocalBusyIndicatorBox")) {
                                    injectModernLoader(node);
                                }
                                const aBusy = node.querySelectorAll ? node.querySelectorAll("#sap-ui-busy-indicator, .sapUiBusy, .sapUiLocalBusyIndicatorBox") : [];
                                aBusy.forEach(injectModernLoader);
                            }
                        }
                    }
                });

                if (document.body) {
                    observer.observe(document.body, { childList: true, subtree: true });
                } else {
                    document.addEventListener("DOMContentLoaded", () => {
                        observer.observe(document.body, { childList: true, subtree: true });
                    });
                }
            }
        }
    });
});