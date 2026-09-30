const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

const lines = ctrl.split('\n');
console.log('--- Lines 11460 to 11475 ---');
for (let i = 11460; i < 11475; i++) {
  console.log((i+1) + ': ' + JSON.stringify(lines[i]));
}
