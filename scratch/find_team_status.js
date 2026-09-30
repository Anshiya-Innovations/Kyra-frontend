const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

lines.forEach((l, i) => {
  if (l.includes('Status') && (l.includes('Team') || l.includes('Classification'))) {
    console.log(`Line ${i+1}: ${l}`);
    for (let j = Math.max(0, i - 1); j < Math.min(lines.length, i + 15); j++) {
      console.log('  ' + lines[j]);
    }
  }
});
