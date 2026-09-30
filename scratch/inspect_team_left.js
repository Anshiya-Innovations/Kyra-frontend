const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = content.split('\n');
for (let i = 1514; i < 1555; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
