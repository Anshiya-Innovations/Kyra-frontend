const fs = require('fs');

const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = content.split('\n');

console.log('--- Searching for Service Details / Team cards in AccessPage.view.xml ---');
for (let i = 1500; i < 1630; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
