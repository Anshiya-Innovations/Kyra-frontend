const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

function findSnippet(keyword, before = 4, after = 6) {
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes(keyword)) {
      console.log(`=== Found '${keyword}' at line ${idx+1} ===`);
      for (let j = Math.max(0, idx - before); j <= Math.min(lines.length - 1, idx + after); j++) {
        console.log(`${j+1}: ${lines[j]}`);
      }
    }
  });
}

findSnippet('adminUserPersonaSelect');
findSnippet('btnConvertDepartmentPersona');
findSnippet('onSaveAdminSystemsSection');
findSnippet('onCancelAdminServicesSection');
findSnippet('onCancelAdminServiceDetails');
findSnippet('onCancelCustomConflictDraft');
