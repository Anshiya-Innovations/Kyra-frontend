const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Updating Controller Files ===');

const controllerFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'dist/pages/access/AccessPage.controller.js'
];

controllerFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // 1. Insert helper methods _createCustomStatusDropdownHtml and _initCustomStatusDropdown right before _confirmDelete
  const dropdownHelpers = `
        _createCustomStatusDropdownHtml(sCurrentStatus, sPrefix) {
            const isAct = (sCurrentStatus === "Active" || !sCurrentStatus);
            return \`
                <div class="kyra-custom-select-wrapper" id="\${sPrefix}_wrapper">
                    <div class="kyra-custom-select-trigger" id="\${sPrefix}_trigger" tabindex="0">
                        <div class="kyra-select-value-row">
                            <span class="kyra-status-dot \${isAct ? 'kyra-status-dot-active' : 'kyra-status-dot-inactive'}">●</span>
                            <span class="kyra-select-value-text" id="\${sPrefix}_display">\${isAct ? 'Active' : 'Inactive'}</span>
                        </div>
                        <svg class="kyra-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    <div class="kyra-custom-select-menu" id="\${sPrefix}_menu">
                        <div class="kyra-select-option \${isAct ? 'kyra-select-option-selected' : ''}" data-value="Active">
                            <div class="kyra-option-left">
                                <span class="kyra-status-dot kyra-status-dot-active">●</span>
                                <span class="kyra-option-label">Active</span>
                            </div>
                            <svg class="kyra-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="kyra-select-option \${!isAct ? 'kyra-select-option-selected' : ''}" data-value="Inactive">
                            <div class="kyra-option-left">
                                <span class="kyra-status-dot kyra-status-dot-inactive">●</span>
                                <span class="kyra-option-label">Inactive</span>
                            </div>
                            <svg class="kyra-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <input type="hidden" id="\${sPrefix}_input" value="\${isAct ? 'Active' : 'Inactive'}" />
                </div>
            \`;
        },

        _initCustomStatusDropdown(oDom, sPrefix, onChangeFn) {
            if (!oDom) return null;
            const wrapper = oDom.querySelector("#" + sPrefix + "_wrapper") || oDom.querySelector(".kyra-custom-select-wrapper");
            if (!wrapper) return null;
            const trigger = wrapper.querySelector(".kyra-custom-select-trigger");
            const hiddenInput = wrapper.querySelector("input[type='hidden']");
            const displaySpan = wrapper.querySelector(".kyra-select-value-text");
            const dotSpan = wrapper.querySelector(".kyra-select-value-row .kyra-status-dot");
            const options = wrapper.querySelectorAll(".kyra-select-option");

            const toggleMenu = (e) => {
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                wrapper.classList.toggle("open");
            };

            if (trigger) {
                trigger.onclick = toggleMenu;
                trigger.onkeydown = (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        toggleMenu(e);
                    } else if (e.key === "Escape") {
                        wrapper.classList.remove("open");
                    }
                };
            }

            options.forEach(opt => {
                opt.onclick = (e) => {
                    e.stopPropagation();
                    const val = opt.getAttribute("data-value") || "Active";
                    if (hiddenInput) hiddenInput.value = val;
                    if (displaySpan) displaySpan.textContent = val;
                    if (dotSpan) {
                        dotSpan.className = "kyra-status-dot " + (val === "Active" ? "kyra-status-dot-active" : "kyra-status-dot-inactive");
                    }
                    options.forEach(o => o.classList.remove("kyra-select-option-selected"));
                    opt.classList.add("kyra-select-option-selected");
                    wrapper.classList.remove("open");
                    if (typeof onChangeFn === "function") onChangeFn(val);
                };
            });

            const onDocClick = (e) => {
                if (!wrapper.contains(e.target)) {
                    wrapper.classList.remove("open");
                }
            };
            document.addEventListener("click", onDocClick);
            return () => document.removeEventListener("click", onDocClick);
        },
`;

  // 2. Exact replacement for _confirmDelete
  const confirmDeleteNew = `_confirmDelete(sTitle, sItemName, sItemType, onConfirmFn) {
            if (typeof sItemName === "function") {
                onConfirmFn = sItemName;
                sItemName = sTitle;
                sItemType = "Item";
            } else if (typeof sItemType === "function") {
                onConfirmFn = sItemType;
                sItemType = "Item";
            }
            sTitle = sTitle || "Confirm Deletion";
            sItemName = sItemName || "this item";
            sItemType = sItemType || "Item";

            const that = this;
            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML"], (Dialog, HTML) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card kyra-del-modal-card" style="max-width: 440px;">
                        <div class="kyra-system-modal-header" style="border-bottom: 1px solid #FEE2E2; padding: 20px 24px 18px 24px;">
                            <div class="kyra-system-modal-header-left" style="display: flex; align-items: center; gap: 12px;">
                                <div class="kyra-system-modal-icon-badge" style="width: 42px; height: 42px; border-radius: 10px; background: #FEE2E2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title" style="color: #991B1B; font-size: 17px; font-weight: 700; margin: 0;">\${sTitle}</div>
                                    <div class="kyra-system-modal-subtitle" style="color: #64748B; font-size: 13px; margin-top: 2px;">This action cannot be undone</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-del-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body" style="padding: 20px 24px;">
                            <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.55;">
                                Are you sure you want to delete <strong style="color: #0F172A; font-weight: 700;">\${sItemName}</strong>? It will be permanently removed from this configuration.
                            </p>
                        </div>
                        <div class="kyra-system-modal-footer" style="padding: 16px 24px 20px 24px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #F1F5F9; background: #FAFBFD;">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-del-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-del-confirm-btn">Delete \${sItemType}</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "440px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        const closeX = oDom.querySelector(".kyra-del-close-btn");
                        const cancelBtn = oDom.querySelector(".kyra-del-cancel-btn");
                        const confirmBtn = oDom.querySelector(".kyra-del-confirm-btn");
                        const closeFn = () => oDialog.close();
                        if (closeX) closeX.onclick = closeFn;
                        if (cancelBtn) cancelBtn.onclick = closeFn;
                        if (confirmBtn) {
                            confirmBtn.onclick = () => {
                                closeFn();
                                if (typeof onConfirmFn === "function") {
                                    onConfirmFn();
                                }
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  // Replace _confirmDelete
  const confirmDeleteTarget = /_confirmDelete\s*\([^{]+\{[\s\S]*?afterClose:\s*\(\)\s*=>\s*oDialog\.destroy\(\)\s*\}\);[\s\S]*?\}, 50\);\s*\}\);\s*\}/;
  if (confirmDeleteTarget.test(code)) {
    code = code.replace(confirmDeleteTarget, dropdownHelpers + '\n        ' + confirmDeleteNew);
    console.log(`[${file}] Injected dropdown helpers and updated _confirmDelete!`);
  } else {
    console.warn(`[${file}] Warning: _confirmDelete regex did not match, using fallback replacement.`);
    const simpleTarget = '_confirmDelete(sTitle, sItemName, sItemType, onConfirmFn) {';
    const sIdx = code.indexOf(simpleTarget);
    if (sIdx !== -1) {
      const endMarker = 'onAddAdminSystem() {';
      const eIdx = code.indexOf(endMarker, sIdx);
      if (eIdx !== -1) {
        code = code.substring(0, sIdx) + dropdownHelpers + '\n        ' + confirmDeleteNew + ',\n\n        ' + code.substring(eIdx);
        console.log(`[${file}] Fallback matched: Updated _confirmDelete!`);
      }
    }
  }

  // 3. Exact replacement for onEditSelectedAdminTeam (Image 2)
  const editTeamNew = `onEditSelectedAdminTeam() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oSelected = oModel.getProperty("/selectedAdminClassification");
            if (!oSelected) return;

            const that = this;
            const sOldName = oSelected.name;
            const sCurrentStatus = oSelected.status || "Active";
            const sServiceName = oModel.getProperty("/selectedAdminServiceName") || "System Administrator";

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sDropdownHtml = that._createCustomStatusDropdownHtml(sCurrentStatus, "kyra_edit_team_status");
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Edit Team</div>
                                    <div class="kyra-system-modal-subtitle">Modify team parameters and active status</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_team_name">TEAM NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_team_name" class="kyra-system-modal-input" placeholder="Enter team name" value="\${sOldName}" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label">STATUS</label>
                                \${sDropdownHtml}
                            </div>
                        </div>
                        
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Save Changes</button>
                        </div>
                    </div>
                \`;

                let cleanupDropdown = null;
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        cleanupDropdown = that._initCustomStatusDropdown(oDom, "kyra_edit_team_status");

                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_edit_team_name");
                        if (nameInput) {
                            nameInput.focus();
                            nameInput.select();
                        }

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sNewName = (nameInput ? nameInput.value : "").trim();
                                if (!sNewName) {
                                    if (nameInput) {
                                        nameInput.style.borderColor = "#EF4444";
                                        nameInput.focus();
                                    }
                                    MessageToast.show("Team Name cannot be empty.");
                                    return;
                                }
                                const statusInput = oDom.querySelector("#kyra_edit_team_status_input");
                                const sNewStatus = statusInput ? statusInput.value : sCurrentStatus;

                                const aList = (oModel.getProperty("/adminClassifications") || []).map(item =>
                                    item.name === sOldName ? Object.assign({}, item, {
                                        name: sNewName,
                                        status: sNewStatus,
                                        selected: true
                                    }) : item
                                );
                                oModel.setProperty("/adminClassifications", aList);

                                const oUpdatedSelected = Object.assign({}, oSelected, {
                                    name: sNewName,
                                    status: sNewStatus
                                });
                                oModel.setProperty("/selectedAdminClassification", oUpdatedSelected);

                                const oDetailsMap = oModel.getProperty("/adminServiceDetailsMap") || {};
                                oDetailsMap[sServiceName] = JSON.parse(JSON.stringify(aList));
                                oModel.setProperty("/adminServiceDetailsMap", oDetailsMap);
                                that._ensureAdminSnapshots(oModel);

                                that._showSlideNotification("Team Updated", "Team '" + sNewName + "' updated (Draft: " + sNewStatus + "). Click Save to apply.");
                                MessageToast.show("Team '" + sNewName + "' updated (Draft). Click Save to apply.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => {
                        if (typeof cleanupDropdown === "function") cleanupDropdown();
                        oDialog.destroy();
                    }
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  const editTeamTarget = 'onEditSelectedAdminTeam() {';
  const sTeamIdx = code.indexOf(editTeamTarget);
  if (sTeamIdx !== -1) {
    const endMarker = 'onDeleteSelectedAdminTeam() {';
    const eTeamIdx = code.indexOf(endMarker, sTeamIdx);
    if (eTeamIdx !== -1) {
      code = code.substring(0, sTeamIdx) + editTeamNew + ',\n\n        ' + code.substring(eTeamIdx);
      console.log(`[${file}] Updated onEditSelectedAdminTeam!`);
    }
  }

  // 4. Exact replacement for onEditAdminService
  const editServiceNew = `onEditAdminService(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const oCtx = oEvent.getSource().getBindingContext("accessModel");
            if (!oModel || !oCtx) return;
            const oObj = oCtx.getObject();
            if (!oObj) return;

            const that = this;
            const sOldName = oObj.serviceName;
            const sCurrentStatus = oObj.status || "Active";

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sDropdownHtml = that._createCustomStatusDropdownHtml(sCurrentStatus, "kyra_edit_svc_status");
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Edit Service</div>
                                    <div class="kyra-system-modal-subtitle">Modify service parameters and active status</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_svc_name">SERVICE NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_svc_name" class="kyra-system-modal-input" placeholder="Enter service name" value="\${sOldName}" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label">STATUS</label>
                                \${sDropdownHtml}
                            </div>
                        </div>
                        
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Save Changes</button>
                        </div>
                    </div>
                \`;

                let cleanupDropdown = null;
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        cleanupDropdown = that._initCustomStatusDropdown(oDom, "kyra_edit_svc_status");

                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_edit_svc_name");
                        if (nameInput) {
                            nameInput.focus();
                            nameInput.select();
                        }

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sNewName = (nameInput ? nameInput.value : "").trim();
                                if (!sNewName) {
                                    if (nameInput) {
                                        nameInput.style.borderColor = "#EF4444";
                                        nameInput.focus();
                                    }
                                    MessageToast.show("Service Name cannot be empty.");
                                    return;
                                }
                                const statusInput = oDom.querySelector("#kyra_edit_svc_status_input");
                                const sNewStatus = statusInput ? statusInput.value : sCurrentStatus;

                                const aAll = (oModel.getProperty("/adminServicesAll") || []).map(item =>
                                    item.serviceName === sOldName ? Object.assign({}, item, {
                                        serviceName: sNewName,
                                        status: sNewStatus
                                    }) : item
                                );
                                oModel.setProperty("/adminServicesAll", aAll);
                                oModel.setProperty("/adminServices", aAll.slice());

                                const oDetailsMap = oModel.getProperty("/adminServiceDetailsMap") || {};
                                if (sOldName !== sNewName && oDetailsMap[sOldName]) {
                                    oDetailsMap[sNewName] = oDetailsMap[sOldName];
                                    delete oDetailsMap[sOldName];
                                    oModel.setProperty("/adminServiceDetailsMap", oDetailsMap);
                                }

                                if (oModel.getProperty("/selectedAdminServiceName") === sOldName) {
                                    oModel.setProperty("/selectedAdminServiceName", sNewName);
                                }

                                that._ensureAdminSnapshots(oModel);
                                that._showSlideNotification("Service Updated", "Service '" + sNewName + "' updated (Draft: " + sNewStatus + "). Click Save to apply.");
                                MessageToast.show("Service '" + sNewName + "' updated (Draft). Click Save to apply.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => {
                        if (typeof cleanupDropdown === "function") cleanupDropdown();
                        oDialog.destroy();
                    }
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  const editSvcTarget = 'onEditAdminService(oEvent) {';
  const sSvcIdx = code.indexOf(editSvcTarget);
  if (sSvcIdx !== -1) {
    const endMarker = 'onCancelAdminServicesSection() {';
    const eSvcIdx = code.indexOf(endMarker, sSvcIdx);
    if (eSvcIdx !== -1) {
      code = code.substring(0, sSvcIdx) + editServiceNew + ',\n\n        ' + code.substring(eSvcIdx);
      console.log(`[${file}] Updated onEditAdminService!`);
    }
  }

  // 5. Exact replacement for onAddAdminService
  const addServiceNew = `onAddAdminService() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const that = this;
            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sDropdownHtml = that._createCustomStatusDropdownHtml("Active", "kyra_add_svc_status");
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Add Service</div>
                                    <div class="kyra-system-modal-subtitle">Define a new service / topic for access control</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_svc_name">SERVICE NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_svc_name" class="kyra-system-modal-input" placeholder="e.g. Cloud Operations" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label">STATUS</label>
                                \${sDropdownHtml}
                            </div>
                        </div>
                        
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Create Service</button>
                        </div>
                    </div>
                \`;

                let cleanupDropdown = null;
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        cleanupDropdown = that._initCustomStatusDropdown(oDom, "kyra_add_svc_status");

                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_add_svc_name");
                        if (nameInput) nameInput.focus();

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sName = (nameInput ? nameInput.value : "").trim();
                                if (!sName) {
                                    if (nameInput) {
                                        nameInput.style.borderColor = "#EF4444";
                                        nameInput.focus();
                                    }
                                    MessageToast.show("Please enter a Service name.");
                                    return;
                                }
                                const statusInput = oDom.querySelector("#kyra_add_svc_status_input");
                                const sStatus = statusInput ? statusInput.value : "Active";

                                const aAll = (oModel.getProperty("/adminServicesAll") || []).slice();
                                aAll.push({
                                    serviceName: sName,
                                    status: sStatus,
                                    selected: false
                                });
                                oModel.setProperty("/adminServicesAll", aAll);
                                oModel.setProperty("/adminServices", aAll.slice());

                                const oDetailsMap = oModel.getProperty("/adminServiceDetailsMap") || {};
                                if (!oDetailsMap[sName]) {
                                    oDetailsMap[sName] = [];
                                    oModel.setProperty("/adminServiceDetailsMap", oDetailsMap);
                                }
                                that._ensureAdminSnapshots(oModel);
                                that._showSlideNotification("Service Created", "New Service '" + sName + "' created (Draft: " + sStatus + "). Click Save to apply.");
                                MessageToast.show("Service '" + sName + "' added (Draft). Click Save to apply.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => {
                        if (typeof cleanupDropdown === "function") cleanupDropdown();
                        oDialog.destroy();
                    }
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  const addSvcTarget = 'onAddAdminService() {';
  const sAddSvcIdx = code.indexOf(addSvcTarget);
  if (sAddSvcIdx !== -1) {
    const endMarker = 'onEditAdminService(oEvent) {';
    const eAddSvcIdx = code.indexOf(endMarker, sAddSvcIdx);
    if (eAddSvcIdx !== -1) {
      code = code.substring(0, sAddSvcIdx) + addServiceNew + ',\n\n        ' + code.substring(eAddSvcIdx);
      console.log(`[${file}] Updated onAddAdminService!`);
    }
  }

  // 6. Update onAddAdminClassification (Add Team) to use custom status dropdown
  const addTeamNew = `onAddAdminClassification() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sServiceName = oModel.getProperty("/selectedAdminServiceName") || "System Administrator";

            const that = this;
            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sDropdownHtml = that._createCustomStatusDropdownHtml("Active", "kyra_add_team_status");
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Add Team Role</div>
                                    <div class="kyra-system-modal-subtitle">Add a new team under \${sServiceName}</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_team_name">TEAM ROLE NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_team_name" class="kyra-system-modal-input" placeholder="e.g. Platform Architecture" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label">STATUS</label>
                                \${sDropdownHtml}
                            </div>
                        </div>
                        
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Create Team</button>
                        </div>
                    </div>
                \`;

                let cleanupDropdown = null;
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        cleanupDropdown = that._initCustomStatusDropdown(oDom, "kyra_add_team_status");

                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_add_team_name");
                        if (nameInput) nameInput.focus();

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sName = (nameInput ? nameInput.value : "").trim();
                                if (!sName) {
                                    if (nameInput) {
                                        nameInput.style.borderColor = "#EF4444";
                                        nameInput.focus();
                                    }
                                    MessageToast.show("Please enter a Team name.");
                                    return;
                                }
                                const statusInput = oDom.querySelector("#kyra_add_team_status_input");
                                const sStatus = statusInput ? statusInput.value : "Active";

                                const aList = (oModel.getProperty("/adminClassifications") || []).slice();
                                const oNewTeam = {
                                    name: sName,
                                    status: sStatus,
                                    selected: false,
                                    subClassifications: []
                                };
                                aList.push(oNewTeam);
                                oModel.setProperty("/adminClassifications", aList);

                                const oDetailsMap = oModel.getProperty("/adminServiceDetailsMap") || {};
                                oDetailsMap[sServiceName] = JSON.parse(JSON.stringify(aList));
                                oModel.setProperty("/adminServiceDetailsMap", oDetailsMap);
                                that._ensureAdminSnapshots(oModel);

                                that._showSlideNotification("Team Created", "Team '" + sName + "' created under " + sServiceName + " (Draft: " + sStatus + "). Click Save to apply.");
                                MessageToast.show("Team '" + sName + "' added (Draft). Click Save to apply.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => {
                        if (typeof cleanupDropdown === "function") cleanupDropdown();
                        oDialog.destroy();
                    }
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  const addTeamTarget = 'onAddAdminClassification() {';
  const sAddTeamIdx = code.indexOf(addTeamTarget);
  if (sAddTeamIdx !== -1) {
    const endMarker = 'onEditAdminClassification(oEvent) {';
    const eAddTeamIdx = code.indexOf(endMarker, sAddTeamIdx);
    if (eAddTeamIdx !== -1) {
      code = code.substring(0, sAddTeamIdx) + addTeamNew + ',\n\n        ' + code.substring(eAddTeamIdx);
      console.log(`[${file}] Updated onAddAdminClassification!`);
    }
  }

  // 7. Update onEditAdminSubClassification (Edit Persona) to use afterOpen and addStyleClass
  const editPersonaNew = `onEditAdminSubClassification(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const oCtx = oEvent.getSource().getBindingContext("accessModel");
            if (!oModel || !oCtx) return;
            const oTarget = oCtx.getObject();
            if (!oTarget) return;

            const that = this;
            const sOldName = oTarget.name;
            const sCurrentPrivilege = oTarget.accessPrivilege || "Restricted";
            const sCurrentStatus = oTarget.status || "Active";
            const sServiceName = oModel.getProperty("/selectedAdminServiceName") || "System Administrator";

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sDropdownHtml = that._createCustomStatusDropdownHtml(sCurrentStatus, "kyra_edit_persona_status");
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Edit Persona</div>
                                    <div class="kyra-system-modal-subtitle">Modify persona name and access status</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_persona_name">PERSONA NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_persona_name" class="kyra-system-modal-input" placeholder="Enter persona name" value="\${sOldName}" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label">STATUS</label>
                                \${sDropdownHtml}
                            </div>
                        </div>
                        
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Save Changes</button>
                        </div>
                    </div>
                \`;

                let cleanupDropdown = null;
                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        cleanupDropdown = that._initCustomStatusDropdown(oDom, "kyra_edit_persona_status");

                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_edit_persona_name");
                        if (nameInput) {
                            nameInput.focus();
                            nameInput.select();
                        }

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sNewName = (nameInput ? nameInput.value : "").trim();
                                if (!sNewName) {
                                    if (nameInput) {
                                        nameInput.style.borderColor = "#EF4444";
                                        nameInput.focus();
                                    }
                                    MessageToast.show("Persona Name cannot be empty.");
                                    return;
                                }
                                const statusInput = oDom.querySelector("#kyra_edit_persona_status_input");
                                const sNewStatus = statusInput ? statusInput.value : sCurrentStatus;

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).map(p =>
                                    p.name === sOldName ? Object.assign({}, p, {
                                        name: sNewName,
                                        status: sNewStatus
                                    }) : p
                                );
                                oModel.setProperty("/selectedAdminClassification/subClassifications", aSubs);

                                const oSelected = oModel.getProperty("/selectedAdminClassification");
                                oSelected.subClassifications = aSubs;
                                const aList = (oModel.getProperty("/adminClassifications") || []).map(item =>
                                    item.name === oSelected.name ? Object.assign({}, oSelected, { selected: true }) : item
                                );
                                oModel.setProperty("/adminClassifications", aList);
                                const oDetailsMap = oModel.getProperty("/adminServiceDetailsMap") || {};
                                oDetailsMap[sServiceName] = JSON.parse(JSON.stringify(aList));
                                oModel.setProperty("/adminServiceDetailsMap", oDetailsMap);
                                that._ensureAdminSnapshots(oModel);

                                that._showSlideNotification("Persona Updated", "Persona '" + sNewName + "' updated (Draft: " + sNewStatus + "). Click Save to apply.");
                                MessageToast.show("Persona '" + sNewName + "' updated (Draft). Click Save to apply.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => {
                        if (typeof cleanupDropdown === "function") cleanupDropdown();
                        oDialog.destroy();
                    }
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  const editPersonaTarget = 'onEditAdminSubClassification(oEvent) {';
  const sEditPersonaIdx = code.indexOf(editPersonaTarget);
  if (sEditPersonaIdx !== -1) {
    const endMarker = 'onDeleteAdminSubClassification(oEvent) {';
    const eEditPersonaIdx = code.indexOf(endMarker, sEditPersonaIdx);
    if (eEditPersonaIdx !== -1) {
      code = code.substring(0, sEditPersonaIdx) + editPersonaNew + ',\n\n        ' + code.substring(eEditPersonaIdx);
      console.log(`[${file}] Updated onEditAdminSubClassification!`);
    }
  }

  // 8. Update onAddAdminSubClassification (Add Persona)
  const addPersonaNew = `onAddAdminSubClassification() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";
            const sShortTeam = sCurrentTeam.replace(/\\s*\\([^)]*\\)/g, "").trim();

            const that = this;
            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Add Persona</div>
                                    <div class="kyra-system-modal-subtitle">Add a new persona under \${sShortTeam}</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_persona_name">PERSONA NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_persona_name" class="kyra-system-modal-input" placeholder="e.g. Lead Cloud Architect" autocomplete="off" />
                            </div>
                        </div>
                        
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Create Persona</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;

                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_add_persona_name");
                        if (nameInput) nameInput.focus();

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sName = (nameInput ? nameInput.value : "").trim();
                                if (!sName) {
                                    if (nameInput) {
                                        nameInput.style.borderColor = "#EF4444";
                                        nameInput.focus();
                                    }
                                    MessageToast.show("Please enter a Persona name.");
                                    return;
                                }

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).slice();
                                aSubs.push({
                                    name: sName,
                                    status: "Active",
                                    accessPrivilege: "Restricted"
                                });
                                oModel.setProperty("/selectedAdminClassification/subClassifications", aSubs);

                                const oSelected = oModel.getProperty("/selectedAdminClassification");
                                oSelected.subClassifications = aSubs;
                                const aList = (oModel.getProperty("/adminClassifications") || []).map(item =>
                                    item.name === oSelected.name ? Object.assign({}, oSelected, { selected: true }) : item
                                );
                                oModel.setProperty("/adminClassifications", aList);
                                const sServiceName = oModel.getProperty("/selectedAdminServiceName") || "System Administrator";
                                const oDetailsMap = oModel.getProperty("/adminServiceDetailsMap") || {};
                                oDetailsMap[sServiceName] = JSON.parse(JSON.stringify(aList));
                                oModel.setProperty("/adminServiceDetailsMap", oDetailsMap);
                                that._ensureAdminSnapshots(oModel);

                                that._showSlideNotification("Persona Created", "Persona '" + sName + "' created (Draft: Restricted). Click Save to apply.");
                                MessageToast.show("Persona '" + sName + "' added (Draft). Click Save to apply.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        }`;

  const addPersonaTarget = 'onAddAdminSubClassification() {';
  const sAddPersonaIdx = code.indexOf(addPersonaTarget);
  if (sAddPersonaIdx !== -1) {
    const endMarker = 'onSaveAdminServiceDetails() {';
    const eAddPersonaIdx = code.indexOf(endMarker, sAddPersonaIdx);
    if (eAddPersonaIdx !== -1) {
      code = code.substring(0, sAddPersonaIdx) + addPersonaNew + ',\n\n        ' + code.substring(eAddPersonaIdx);
      console.log(`[${file}] Updated onAddAdminSubClassification!`);
    }
  }

  fs.writeFileSync(file, code, 'utf8');
  console.log(`[SAVED] ${file}`);
});

console.log('\n=== Step 2: Updating View XML Files ===');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) return;
  let content = fs.readFileSync(vf, 'utf8');

  // 1. Balance card widths: Left Card width="48.5%", Right Card width="49.5%"
  content = content.replace(
    '<!-- LEFT CARD: SERVICE (8) -->\n                            <VBox width="43%"',
    '<!-- LEFT CARD: SERVICE (8) -->\n                            <VBox width="48.5%"'
  );
  content = content.replace(
    '<!-- RIGHT CARD: SERVICE DETAILS - SYSTEM ADMINISTRATOR -->\n                            <VBox width="55.5%"',
    '<!-- RIGHT CARD: SERVICE DETAILS - SYSTEM ADMINISTRATOR -->\n                            <VBox width="49.5%"'
  );

  // 2. Inside Service Details: Left Sub-Panel width="42%", Right Sub-Panel width="56%"
  content = content.replace(
    '<VBox width="38%" class="kyraAdminClassificationsSubPanel"',
    '<VBox width="42%" class="kyraAdminClassificationsSubPanel"'
  );
  content = content.replace(
    '<VBox width="60%" class="kyraAdminClassDetailSubPanel"',
    '<VBox width="56%" class="kyraAdminClassDetailSubPanel"'
  );
  content = content.replace(
    '<VBox width="54%" class="kyraAdminClassDetailSubPanel"',
    '<VBox width="56%" class="kyraAdminClassDetailSubPanel"'
  );

  // 3. Ensure Table columns are well proportioned: 46%, 27%, 27%
  content = content.replace(
    '<Column width="48%" hAlign="Begin"><Text text="SERVICE NAME"',
    '<Column width="46%" hAlign="Begin"><Text text="SERVICE NAME"'
  );
  content = content.replace(
    '<Column width="28%" hAlign="Begin"><Text text="STATUS"',
    '<Column width="27%" hAlign="Begin"><Text text="STATUS"'
  );
  content = content.replace(
    '<Column width="24%" hAlign="Begin"><Text text="ACTIONS"',
    '<Column width="27%" hAlign="Begin"><Text text="ACTIONS"'
  );

  fs.writeFileSync(vf, content, 'utf8');
  console.log(`[SAVED] ${vf}`);
});

console.log('\n=== Step 3: Updating CSS Files ===');

const additionalCss = `
/* ========================================================================== */
/* KYRA CUSTOM SELECT & POPUP THEME (MATCHES media_1790773628084.png & THEME) */
/* No default OS blue highlight, strictly KYRA project-related colors         */
/* ========================================================================== */

.kyra-custom-select-wrapper {
    position: relative !important;
    width: 100% !important;
    user-select: none !important;
    box-sizing: border-box !important;
}

.kyra-custom-select-trigger {
    width: 100% !important;
    height: 42px !important;
    background: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    padding: 0 14px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    cursor: pointer !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
    outline: none !important;
}

.kyra-custom-select-trigger:hover,
.kyra-custom-select-wrapper.open .kyra-custom-select-trigger {
    border-color: #008C9C !important;
}

.kyra-custom-select-wrapper.open .kyra-custom-select-trigger {
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
}

.kyra-select-value-row {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
}

.kyra-select-value-text {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: #1E293B !important;
}

.kyra-status-dot {
    font-size: 13px !important;
    line-height: 1 !important;
}

.kyra-status-dot-active {
    color: #008C9C !important;
}

.kyra-status-dot-inactive {
    color: #94A3B8 !important;
}

.kyra-select-chevron {
    transition: transform 0.2s ease !important;
    flex-shrink: 0 !important;
}

.kyra-custom-select-wrapper.open .kyra-select-chevron {
    transform: rotate(180deg) !important;
}

.kyra-custom-select-menu {
    position: absolute !important;
    top: calc(100% + 5px) !important;
    left: 0 !important;
    right: 0 !important;
    background: #FFFFFF !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 8px !important;
    box-shadow: 0 12px 28px -4px rgba(0, 140, 156, 0.2), 0 6px 12px -2px rgba(15, 23, 42, 0.08) !important;
    padding: 5px !important;
    z-index: 1050 !important;
    display: none !important;
    flex-direction: column !important;
    gap: 3px !important;
    box-sizing: border-box !important;
    animation: kyraSelectMenuSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

@keyframes kyraSelectMenuSlide {
    0% {
        opacity: 0;
        transform: translateY(-8px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.kyra-custom-select-wrapper.open .kyra-custom-select-menu {
    display: flex !important;
}

.kyra-select-option {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 10px 12px !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    transition: background 0.15s ease, color 0.15s ease !important;
}

.kyra-option-left {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
}

.kyra-option-label {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #1E293B !important;
}

.kyra-option-check {
    display: none !important;
    flex-shrink: 0 !important;
}

.kyra-select-option:hover {
    background: #F0FDFA !important;
}

.kyra-select-option:hover .kyra-option-label {
    color: #008C9C !important;
}

.kyra-select-option[data-value="Inactive"]:hover {
    background: #FEF2F2 !important;
}

.kyra-select-option[data-value="Inactive"]:hover .kyra-option-label {
    color: #EF4444 !important;
}

.kyra-select-option.kyra-select-option-selected {
    background: #E6F7F8 !important;
}

.kyra-select-option.kyra-select-option-selected .kyra-option-label {
    color: #008C9C !important;
}

.kyra-select-option.kyra-select-option-selected .kyra-option-check {
    display: block !important;
}

.kyra-select-option.kyra-select-option-selected[data-value="Inactive"] {
    background: #FEE2E2 !important;
}

.kyra-select-option.kyra-select-option-selected[data-value="Inactive"] .kyra-option-label {
    color: #DC2626 !important;
}

/* ========================================================================== */
/* DELETE CONFIRMATION POPUP (MATCHES media_1790776040148.png & ACTION BUTTON) */
/* ========================================================================== */

.kyra-del-modal-card {
    background: #FFFFFF !important;
    border-radius: 16px !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

.kyra-del-confirm-btn {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 36px !important;
    padding: 0 22px !important;
    background: #EF4444 !important;
    background-color: #EF4444 !important;
    border: 1px solid #DC2626 !important;
    border-radius: 9px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.25) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    outline: none !important;
}

.kyra-del-confirm-btn:hover {
    background: #DC2626 !important;
    background-color: #DC2626 !important;
    border-color: #B91C1C !important;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.38) !important;
    transform: translateY(-1px) !important;
}

.kyra-del-confirm-btn:active {
    background: #B91C1C !important;
    transform: translateY(0) !important;
}

/* Dialog Container Slide Animation & Styling */
.kyraSystemModalDialog.sapMDialog,
.kyraSystemModalDialog {
    border-radius: 16px !important;
    overflow: visible !important;
    background: transparent !important;
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(15, 23, 42, 0.08) !important;
    border: none !important;
    animation: kyraModalSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

.kyraSystemModalDialog .sapMDialogSection {
    padding: 0 !important;
    background: #FFFFFF !important;
    border-radius: 16px !important;
    overflow: visible !important;
    border: none !important;
}

.kyraSystemModalDialog .sapMDialogScroll {
    overflow: visible !important;
}

@keyframes kyraModalSlideDown {
    0% {
        opacity: 0;
        transform: translateY(-20px) scale(0.98);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Card Proportions from media_1790773628145.png */
.kyraAdminBottomSplitRow {
    display: flex !important;
    justify-content: space-between !important;
    gap: 20px !important;
}

.kyraAdminBottomSplitRow > .kyraAdminWhiteCard:first-child {
    width: 48.5% !important;
}

.kyraAdminBottomSplitRow > .kyraAdminWhiteCard:last-child {
    width: 49.5% !important;
}

.kyraAdminServiceDetailsSplitBox .kyraAdminClassificationsSubPanel {
    width: 42% !important;
}

.kyraAdminServiceDetailsSplitBox .kyraAdminClassDetailSubPanel {
    width: 56% !important;
}

/* Service Table Status Pill & Alignment */
.kyraAdminServiceTable .sapMListTblCell {
    vertical-align: middle !important;
    padding: 12px 14px !important;
}

.kyraAdminStatusPill,
.kyraAdminTeamStatusPill {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    background: #E6F7F8 !important;
    background-color: #E6F7F8 !important;
    border-radius: 20px !important;
    padding: 4px 10px !important;
    font-size: 12.5px !important;
    font-weight: 600 !important;
    color: #008C9C !important;
    width: auto !important;
    cursor: default !important;
}

.kyraAdminStatusPill .kyraAdminVectorDot,
.kyraAdminTeamStatusPill .kyraAdminVectorDot {
    width: 6px !important;
    height: 6px !important;
    border-radius: 50% !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    flex-shrink: 0 !important;
}

.kyraAdminStatusPill .kyraAdminPillText,
.kyraAdminTeamStatusPill .kyraAdminPillText {
    color: #008C9C !important;
    font-size: 12.5px !important;
    font-weight: 600 !important;
}
`;

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'dist/pages/access/style.css',
  'dist/css/style.css'
];

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  const marker = '/* KYRA CUSTOM SELECT & POPUP THEME (MATCHES media_1790773628084.png & THEME) */';
  const existingIdx = content.indexOf(marker);

  if (existingIdx !== -1) {
    const topIdx = content.lastIndexOf('/* ==========================================================================', existingIdx);
    content = content.substring(0, topIdx !== -1 ? topIdx : existingIdx) + additionalCss;
  } else {
    content += '\n\n' + additionalCss;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[SAVED CSS] ${file}`);
});

console.log('\nAll updates applied successfully!');
