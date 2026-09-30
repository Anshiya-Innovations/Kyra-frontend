const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const lines = content.split('\n');
console.log('--- Lines 1138 to 1152 ---');
for (let i = 1137; i < 1152; i++) {
  console.log((i+1) + ': ' + JSON.stringify(lines[i]));
}

console.log('--- Lines 1410 to 1420 ---');
for (let i = 1409; i < 1420; i++) {
  console.log((i+1) + ': ' + JSON.stringify(lines[i]));
}
