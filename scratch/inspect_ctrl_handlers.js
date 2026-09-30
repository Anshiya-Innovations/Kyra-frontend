const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

['onCancelAdminServicesSection', 'onCancelAdminServiceDetails', 'onCancelCustomConflictDraft', 'onSaveAdminSystemsSection'].forEach(fn => {
  lines.forEach((l, i) => {
    if (l.includes(fn)) {
      console.log(`=== ${fn} at line ${i+1} ===`);
      for (let j = Math.max(0, i - 1); j < Math.min(lines.length, i + 25); j++) {
        console.log(lines[j]);
      }
    }
  });
});
