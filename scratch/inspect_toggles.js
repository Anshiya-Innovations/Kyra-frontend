const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

for (let i = 12110; i < 12155; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
