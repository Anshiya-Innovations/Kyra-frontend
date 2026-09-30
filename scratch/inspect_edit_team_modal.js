const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const lines = ctrl.split('\n');

for (let i = 11955; i < 12020; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
