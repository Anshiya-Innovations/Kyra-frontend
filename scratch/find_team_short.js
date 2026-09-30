const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

lines.forEach((l, i) => {
  if (l.includes('sTeamShort') || l.includes('replace(/\\s*\\([^)]*\\)/g')) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
