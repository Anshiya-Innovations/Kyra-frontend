const fs = require('fs');

console.log('--- Step 1: Updating View XML files ---');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) return;
  let content = fs.readFileSync(vf, 'utf8');

  // 1. Single User Persona Conversion: Add Cancel before Save
  const targetSingleUser = `                                        <Button
                                            text="Save"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onSaveConvertedUserPersona"
                                            class="kyraAdminSaveBtn" />`;

  const replaceSingleUser = `                                        <Button
                                            text="Cancel"
                                            press=".onCancelEmployeePersonaLookup"
                                            class="kyraAdminCancelBtn sapUiSmallMarginEnd" />
                                        <Button
                                            text="Save"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onSaveConvertedUserPersona"
                                            class="kyraAdminSaveBtn" />`;

  if (content.includes(targetSingleUser)) {
    content = content.replace(targetSingleUser, replaceSingleUser);
    console.log(`[${vf}] Single user Cancel added.`);
  } else {
    console.log(`[${vf}] Single user target already changed or not found.`);
  }

  // 2. Department Persona Conversion: Add Cancel between Preview and Save Changes
  const targetDept = `                                        <Button
                                            id="btnPreviewDepartmentUsers"
                                            text="Preview Users"
                                            icon="sap-icon://search"
                                            press=".onPreviewDepartmentUsers"
                                            class="kyraDeptPreviewBtn" />
                                        <Button
                                            id="btnConvertDepartmentPersona"
                                            text="Save Changes"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onConvertDepartmentPersona"
                                            class="kyraAdminSaveBtn kyraDeptSaveBtn" />`;

  const replaceDept = `                                        <Button
                                            id="btnPreviewDepartmentUsers"
                                            text="Preview Users"
                                            icon="sap-icon://search"
                                            press=".onPreviewDepartmentUsers"
                                            class="kyraDeptPreviewBtn sapUiSmallMarginEnd" />
                                        <Button
                                            text="Cancel"
                                            press=".onCancelDepartmentPersona"
                                            class="kyraAdminCancelBtn sapUiSmallMarginEnd" />
                                        <Button
                                            id="btnConvertDepartmentPersona"
                                            text="Save Changes"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onConvertDepartmentPersona"
                                            class="kyraAdminSaveBtn kyraDeptSaveBtn" />`;

  if (content.includes(targetDept)) {
    content = content.replace(targetDept, replaceDept);
    console.log(`[${vf}] Department persona Cancel added.`);
  } else {
    console.log(`[${vf}] Department persona target already changed or not found.`);
  }

  // 3. Systems Footer: Add Cancel before Save
  const targetSysFooter = `<HBox width="100%" justifyContent="End" alignItems="Center" class="kyraAdminServiceDetailsFooter">
                                <Button text="Save" type="Emphasized" press=".onSaveAdminSystemsSection" class="kyraAdminSaveBtn" />
                            </HBox>`;

  const replaceSysFooter = `<HBox width="100%" justifyContent="End" alignItems="Center" class="kyraAdminServiceDetailsFooter">
                                <Button
                                    text="Cancel"
                                    press=".onCancelAdminSystemsSection"
                                    class="kyraAdminCancelBtn sapUiSmallMarginEnd" />
                                <Button text="Save" type="Emphasized" press=".onSaveAdminSystemsSection" class="kyraAdminSaveBtn" />
                            </HBox>`;

  if (content.includes(targetSysFooter)) {
    content = content.replace(targetSysFooter, replaceSysFooter);
    console.log(`[${vf}] Systems Footer Cancel added.`);
  } else {
    console.log(`[${vf}] Systems Footer target already changed or not found.`);
  }

  // 4. Ensure sapUiSmallMarginEnd on existing Cancel buttons
  const targetSvcCancel = `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServicesSection"
                                        class="kyraAdminCancelBtn" />`;
  const replaceSvcCancel = `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServicesSection"
                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd" />`;
  if (content.includes(targetSvcCancel)) {
    content = content.replace(targetSvcCancel, replaceSvcCancel);
    console.log(`[${vf}] Services Cancel margin added.`);
  }

  const targetSvcDetailsCancel = `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServiceDetails"
                                        class="kyraAdminCancelBtn" />`;
  const replaceSvcDetailsCancel = `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServiceDetails"
                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd" />`;
  if (content.includes(targetSvcDetailsCancel)) {
    content = content.replace(targetSvcDetailsCancel, replaceSvcDetailsCancel);
    console.log(`[${vf}] Service Details Cancel margin added.`);
  }

  const targetConflictCancel = `<Button
                                        text="Cancel"
                                        press=".onCancelCustomConflictDraft"
                                        class="kyraAdminCancelBtn" />`;
  const replaceConflictCancel = `<Button
                                        text="Cancel"
                                        press=".onCancelCustomConflictDraft"
                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd" />`;
  if (content.includes(targetConflictCancel)) {
    content = content.replace(targetConflictCancel, replaceConflictCancel);
    console.log(`[${vf}] Conflict Draft Cancel margin added.`);
  }

  fs.writeFileSync(vf, content, 'utf8');
  console.log(`Saved ${vf}`);
});

console.log('\n--- Step 2: Updating Controllers ---');

const ctrlFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'dist/pages/access/AccessPage.controller.js'
];

ctrlFiles.forEach(cf => {
  if (!fs.existsSync(cf)) return;
  let ctrl = fs.readFileSync(cf, 'utf8');

  // A. In _ensureAdminSnapshots, make sure adminSystemsAll is captured
  if (ctrl.includes('_ensureAdminSnapshots(oModel) {')) {
    const oldEnsure = `            if (!this._savedAdminServicesAll) {`;
    const newEnsure = `            if (!this._savedAdminSystemsAll) {
                this._savedAdminSystemsAll = JSON.parse(JSON.stringify(oModel.getProperty("/adminSystemsAll") || []));
            }
            if (!this._savedAdminServicesAll) {`;
    if (!ctrl.includes('this._savedAdminSystemsAll =') && ctrl.includes(oldEnsure)) {
      ctrl = ctrl.replace(oldEnsure, newEnsure);
      console.log(`[${cf}] Added _savedAdminSystemsAll to _ensureAdminSnapshots`);
    }
  }

  // B. Add onCancelAdminSystemsSection and update onSaveAdminSystemsSection
  const targetSaveSys = `        onSaveAdminSystemsSection() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            this._syncAdminConfigToLiveAddAccess(oModel);
            MessageToast.show("System configuration saved and activated for all users.");
        },`;

  const replaceSaveSys = `        onCancelAdminSystemsSection() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            this._ensureAdminSnapshots(oModel);

            // Revert Systems to snapshot
            const aRestoredSystems = JSON.parse(JSON.stringify(this._savedAdminSystemsAll || []));
            oModel.setProperty("/adminSystemsAll", aRestoredSystems);
            oModel.setProperty("/adminSystems", aRestoredSystems.slice());
            this._syncAdminConfigToLiveAddAccess(oModel);
            this._showSlideNotification("Changes Cancelled", "System changes reverted to last saved state.");
            sap.m.MessageToast.show("System changes reverted to last saved state.");
        },

        onSaveAdminSystemsSection() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            this._savedAdminSystemsAll = JSON.parse(JSON.stringify(oModel.getProperty("/adminSystemsAll") || []));
            this._syncAdminConfigToLiveAddAccess(oModel);
            this._showSlideNotification("Systems Saved", "System configuration saved and activated for all users.");
            MessageToast.show("System configuration saved and activated for all users.");
        },`;

  if (ctrl.includes(targetSaveSys)) {
    ctrl = ctrl.replace(targetSaveSys, replaceSaveSys);
    console.log(`[${cf}] Added onCancelAdminSystemsSection and updated onSaveAdminSystemsSection`);
  }

  // C. Add onCancelEmployeePersonaLookup before onSaveConvertedUserPersona
  const targetSaveUserPersona = `        async onSaveConvertedUserPersona() {`;
  const replaceSaveUserPersona = `        onCancelEmployeePersonaLookup() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/personaLookupInput", "");
            oModel.setProperty("/personaLookupUserFound", false);
            oModel.setProperty("/personaLookupUser", null);
            sap.m.MessageToast.show("Persona lookup cleared.");
        },

        async onSaveConvertedUserPersona() {`;

  if (ctrl.includes(targetSaveUserPersona) && !ctrl.includes('onCancelEmployeePersonaLookup()')) {
    ctrl = ctrl.replace(targetSaveUserPersona, replaceSaveUserPersona);
    console.log(`[${cf}] Added onCancelEmployeePersonaLookup`);
  }

  // D. Add onCancelDepartmentPersona before onConvertDepartmentPersona
  const targetDeptPersona = `        async onConvertDepartmentPersona() {`;
  const replaceDeptPersona = `        onCancelDepartmentPersona() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/departmentPersona/departmentName", "");
            oModel.setProperty("/departmentPersona/targetPersona", "");
            oModel.setProperty("/departmentPersonaUsers", []);
            oModel.setProperty("/departmentPersonaResult", { message: "", state: "None" });
            const oDeptCtrl = this.byId("adminDeptPersonaComboBox");
            if (oDeptCtrl && typeof oDeptCtrl.setValue === "function") {
                oDeptCtrl.setValue("");
            }
            sap.m.MessageToast.show("Department conversion form reset.");
        },

        async onConvertDepartmentPersona() {`;

  if (ctrl.includes(targetDeptPersona) && !ctrl.includes('onCancelDepartmentPersona()')) {
    ctrl = ctrl.replace(targetDeptPersona, replaceDeptPersona);
    console.log(`[${cf}] Added onCancelDepartmentPersona`);
  }

  fs.writeFileSync(cf, ctrl, 'utf8');
  console.log(`Saved ${cf}`);
});

console.log('\n--- Step 3: Updating CSS files ---');

const cssSnippet = `
/* ========================================================================== */
/* EXACT USER-UPLOADED CANCEL BUTTON STYLING (media_1790765237466.png)         */
/* Soft cyan fill #E6FAFC, vibrant 2px cyan border #00C3D0, teal text #008B95 */
/* 9px border-radius, smooth cyan glow shadow, elegant hover & active states   */
/* Applied cleanly across ALL Admin Page Cancel buttons and Modals             */
/* ========================================================================== */

/* SAPUI5 Button Wrapper Resets */
.kyraAdminCancelBtn.sapMBtn,
.kyraAdminCancelBtn {
    height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* Base Cancel Button: SAPUI5 Inner & Modal Native Button */
.kyraAdminCancelBtn .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn .sapMBtnInner,
.kyra-system-modal-cancel-btn,
.kyra-confirm-cancel-btn,
#kyra_del_cancel_btn {
    height: 38px !important;
    line-height: 34px !important;
    padding: 0 22px !important;
    background: #E6FAFC !important;
    background-color: #E6FAFC !important;
    border: 2px solid #00C3D0 !important;
    border-radius: 9px !important;
    color: #008B95 !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    font-family: inherit !important;
    box-shadow: 0 2px 8px rgba(0, 195, 208, 0.18) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    outline: none !important;
    box-sizing: border-box !important;
    text-decoration: none !important;
}

/* Inner Text & Icons */
.kyraAdminCancelBtn .sapMBtnContent,
.kyraAdminCancelBtn bdi,
.kyraAdminCancelBtn .sapUiIcon,
.kyra-system-modal-cancel-btn,
.kyra-confirm-cancel-btn,
#kyra_del_cancel_btn {
    color: #008B95 !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

/* Hover State */
.kyraAdminCancelBtn:hover .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn:hover .sapMBtnInner,
.kyra-system-modal-cancel-btn:hover,
.kyra-confirm-cancel-btn:hover,
#kyra_del_cancel_btn:hover {
    background: #D4F4F8 !important;
    background-color: #D4F4F8 !important;
    border-color: #00AAB6 !important;
    color: #007684 !important;
    box-shadow: 0 4px 14px rgba(0, 195, 208, 0.32) !important;
    transform: translateY(-1px) !important;
}

.kyraAdminCancelBtn:hover .sapMBtnContent,
.kyraAdminCancelBtn:hover bdi,
.kyraAdminCancelBtn:hover .sapUiIcon {
    color: #007684 !important;
}

/* Active / Pressed State */
.kyraAdminCancelBtn:active .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn:active .sapMBtnInner,
.kyra-system-modal-cancel-btn:active,
.kyra-confirm-cancel-btn:active,
#kyra_del_cancel_btn:active {
    background: #BEEBF2 !important;
    background-color: #BEEBF2 !important;
    border-color: #00939F !important;
    box-shadow: 0 1px 4px rgba(0, 195, 208, 0.2) !important;
    transform: translateY(0px) !important;
}

/* Matching adjacent Save / Submit Buttons: 38px height, 9px radius, crisp alignment */
.kyraAdminSaveBtn.sapMBtn,
.kyraAdminSaveBtn {
    height: 38px !important;
    margin: 0 !important;
}

.kyraAdminSaveBtn .sapMBtnInner,
.kyraAdminSaveBtn.sapMBtn .sapMBtnInner,
.kyra-system-modal-submit-btn {
    height: 38px !important;
    line-height: 36px !important;
    border-radius: 9px !important;
}

.kyraDeptSaveBtn.sapMBtn,
.kyraDeptSaveBtn {
    height: 38px !important;
    margin: 0 !important;
}

.kyraDeptSaveBtn .sapMBtnInner,
.kyraDeptPreviewBtn .sapMBtnInner {
    height: 38px !important;
    line-height: 36px !important;
    border-radius: 9px !important;
}

/* Admin Footers & Action Bar Flex Alignment */
.kyraAdminServiceDetailsFooter,
.kyraAdminConflictEditFooterBar,
.kyraPersonaDropdownActionBar {
    display: flex !important;
    align-items: center !important;
}
`;

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'dist/pages/access/style.css',
  'dist/css/style.css'
];

cssFiles.forEach(cf => {
  if (!fs.existsSync(cf)) return;
  let css = fs.readFileSync(cf, 'utf8');
  // Avoid duplicate appending
  if (css.includes('EXACT USER-UPLOADED CANCEL BUTTON STYLING (media_1790765237466.png)')) {
    console.log(`[${cf}] Already contains exact cancel styling snippet, updating it.`);
    const idx = css.indexOf('/* EXACT USER-UPLOADED CANCEL BUTTON STYLING (media_1790765237466.png)');
    css = css.substring(0, idx) + cssSnippet;
  } else {
    css += '\n' + cssSnippet;
  }
  fs.writeFileSync(cf, css, 'utf8');
  console.log(`Saved ${cf}`);
});

console.log('\nAll updates applied successfully!');
