const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

lines.forEach((l, i) => {
  if (l.includes('_ensureAdminSnapshots(') || l.includes('_ensureAdminSnapshots =') || l.includes('_ensureAdminSnapshots:')) {
    console.log(`Def at line ${i+1}: ${l}`);
    for (let j = i; j < Math.min(lines.length, i + 25); j++) {
      console.log(lines[j]);
    }
  }
});
