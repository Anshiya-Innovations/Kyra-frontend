const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

function printBlock(searchStr, len = 20) {
  const idx = content.indexOf(searchStr);
  if (idx !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + searchStr.length + 150);
    console.log(`=== Block for '${searchStr}' ===\n` + content.substring(start, end));
  } else {
    console.log(`NOT FOUND: ${searchStr}`);
  }
}

printBlock('press=".onSaveConvertedUserPersona"');
printBlock('press=".onConvertDepartmentPersona"');
printBlock('press=".onSaveAdminSystemsSection"');
printBlock('press=".onCancelAdminServicesSection"');
printBlock('press=".onCancelAdminServiceDetails"');
printBlock('press=".onCancelCustomConflictDraft"');
