const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = content.split('\n');

console.log('--- Lines 1520 to 1625 in AccessPage.view.xml ---');
for (let i = 1520; i < 1625; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
