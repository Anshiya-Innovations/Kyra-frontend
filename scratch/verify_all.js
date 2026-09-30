const fs = require('fs');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  const content = fs.readFileSync(vf, 'utf8');
  console.log(`\n=== Verification for ${vf} ===`);
  console.log('has onCancelEmployeePersonaLookup:', content.includes('press=".onCancelEmployeePersonaLookup"'));
  console.log('has onCancelDepartmentPersona:', content.includes('press=".onCancelDepartmentPersona"'));
  console.log('has onCancelAdminSystemsSection:', content.includes('press=".onCancelAdminSystemsSection"'));
  console.log('has onCancelAdminServicesSection with margin:', content.includes('press=".onCancelAdminServicesSection"\r\n                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd"') || content.includes('press=".onCancelAdminServicesSection"\n                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd"'));
  console.log('has onCancelAdminServiceDetails with margin:', content.includes('press=".onCancelAdminServiceDetails"\r\n                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd"') || content.includes('press=".onCancelAdminServiceDetails"\n                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd"'));
  console.log('has onCancelCustomConflictDraft with margin:', content.includes('press=".onCancelCustomConflictDraft"\r\n                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd"') || content.includes('press=".onCancelCustomConflictDraft"\n                                        class="kyraAdminCancelBtn sapUiSmallMarginEnd"'));
});

const ctrlFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'dist/pages/access/AccessPage.controller.js'
];

ctrlFiles.forEach(cf => {
  const content = fs.readFileSync(cf, 'utf8');
  console.log(`\n=== Verification for ${cf} ===`);
  console.log('has onCancelEmployeePersonaLookup handler:', content.includes('onCancelEmployeePersonaLookup()'));
  console.log('has onCancelDepartmentPersona handler:', content.includes('onCancelDepartmentPersona()'));
  console.log('has onCancelAdminSystemsSection handler:', content.includes('onCancelAdminSystemsSection()'));
  console.log('has _savedAdminSystemsAll in _ensureAdminSnapshots:', content.includes('this._savedAdminSystemsAll'));
});
