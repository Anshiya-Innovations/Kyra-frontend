const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = content.split('\n');

for (let i = 1560; i < 1625; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
