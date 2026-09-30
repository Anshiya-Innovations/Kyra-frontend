const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

lines.forEach((l, i) => {
  if (l.includes('_ensureAdminSnapshots')) {
    console.log(`=== _ensureAdminSnapshots at line ${i+1} ===`);
    for (let j = Math.max(0, i - 1); j < Math.min(lines.length, i + 30); j++) {
      console.log(lines[j]);
    }
  }
});
