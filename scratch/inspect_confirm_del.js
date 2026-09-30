const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

lines.forEach((l, i) => {
  if (l.includes('_confirmDelete(')) {
    console.log(`Line ${i+1}: ${l}`);
    for (let j = i; j < i + 40; j++) console.log(lines[j]);
  }
});
