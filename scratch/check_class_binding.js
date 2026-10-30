const fs = require('fs');
const c = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = c.split('\n');
let count = 0;
lines.forEach((l, i) => {
  if (l.includes('class="{=')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
    count++;
  }
});
console.log('Total:', count);
