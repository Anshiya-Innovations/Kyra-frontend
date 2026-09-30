const fs = require('fs');

const files = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(`File does not exist: ${f}`);
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n=== Checking ${f} ===`);
  console.log('has adminUserPersonaSelect:', content.includes('id="adminUserPersonaSelect"'));
  console.log('has onSaveConvertedUserPersona:', content.includes('press=".onSaveConvertedUserPersona"'));
  console.log('has btnConvertDepartmentPersona:', content.includes('id="btnConvertDepartmentPersona"'));
  console.log('has onSaveAdminSystemsSection:', content.includes('press=".onSaveAdminSystemsSection"'));
  console.log('has onCancelAdminServicesSection:', content.includes('press=".onCancelAdminServicesSection"'));
  console.log('has onCancelAdminServiceDetails:', content.includes('press=".onCancelAdminServiceDetails"'));
  console.log('has onCancelCustomConflictDraft:', content.includes('press=".onCancelCustomConflictDraft"'));
});
