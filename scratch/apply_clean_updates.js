const fs = require('fs');

function updateFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let isCrlf = content.includes('\r\n');
  let normalized = content.replace(/\r\n/g, '\n');

  transforms.forEach(({ search, replace, name }) => {
    let searchNorm = search.replace(/\r\n/g, '\n');
    let replaceNorm = replace.replace(/\r\n/g, '\n');

    if (normalized.includes(searchNorm)) {
      normalized = normalized.replace(searchNorm, replaceNorm);
      console.log(`[${filePath}] Applied: ${name}`);
    } else {
      console.log(`[${filePath}] Already applied or pattern not found: ${name}`);
    }
  });

  const finalContent = isCrlf ? normalized.replace(/\n/g, '\r\n') : normalized;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log(`[SAVED] ${filePath}`);
}

// -------------------------------------------------------------
// View Transformations
// -------------------------------------------------------------
const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

const viewTransforms = [
  {
    name: 'Single User Persona: Add Cancel Button before Save',
    search: `                                        <Button
                                            text="Save"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onSaveConvertedUserPersona"
                                            class="kyraAdminSaveBtn" />`,
    replace: `                                        <Button
                                            text="Cancel"
                                            press=".onCancelEmployeePersonaLookup"
                                            class="kyraAdminCancelBtn sapUiSmallMarginEnd" />
                                        <Button
                                            text="Save"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onSaveConvertedUserPersona"
                                            class="kyraAdminSaveBtn" />`
  },
  {
    name: 'Systems Footer: Add Cancel Button before Save',
    search: `<HBox width="100%" justifyContent="End" alignItems="Center" class="kyraAdminServiceDetailsFooter">
                                <Button text="Save" type="Emphasized" press=".onSaveAdminSystemsSection" class="kyraAdminSaveBtn" />
                            </HBox>`,
    replace: `<HBox width="100%" justifyContent="End" alignItems="Center" class="kyraAdminServiceDetailsFooter">
                                <Button
                                    text="Cancel"
                                    press=".onCancelAdminSystemsSection"
                                    class="kyraAdminCancelBtn sapUiSmallMarginEnd" />
                                <Button text="Save" type="Emphasized" press=".onSaveAdminSystemsSection" class="kyraAdminSaveBtn" />
                            </HBox>`
  },
  {
    name: 'Services Footer: Add sapUiSmallMarginEnd to Cancel',
    search: `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServicesSection"
                                        class="kyraAdminCancelBtn" />`,
    replace: `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServicesSection"
                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd" />`
  },
  {
    name: 'Service Details Footer: Add sapUiSmallMarginEnd to Cancel',
    search: `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServiceDetails"
                                        class="kyraAdminCancelBtn" />`,
    replace: `<Button
                                        text="Cancel"
                                        press=".onCancelAdminServiceDetails"
                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd" />`
  },
  {
    name: 'Conflict Draft Footer: Add sapUiSmallMarginEnd to Cancel',
    search: `<Button
                                        text="Cancel"
                                        press=".onCancelCustomConflictDraft"
                                        class="kyraAdminCancelBtn" />`,
    replace: `<Button
                                        text="Cancel"
                                        press=".onCancelCustomConflictDraft"
                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd" />`
  }
];

viewFiles.forEach(vf => updateFile(vf, viewTransforms));

// -------------------------------------------------------------
// Controller Transformations
// -------------------------------------------------------------
const ctrlFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'dist/pages/access/AccessPage.controller.js'
];

const ctrlTransforms = [
  {
    name: 'Add onCancelAdminSystemsSection & update onSaveAdminSystemsSection',
    search: `        onSaveAdminSystemsSection() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            this._syncAdminConfigToLiveAddAccess(oModel);
            MessageToast.show("System configuration saved and activated for all users.");
        },`,
    replace: `        onCancelAdminSystemsSection() {
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
        },`
  }
];

ctrlFiles.forEach(cf => updateFile(cf, ctrlTransforms));

console.log('\n--- Script finished cleanly ---');
