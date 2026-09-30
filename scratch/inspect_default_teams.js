const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

for (let i = 10540; i < 10590; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
