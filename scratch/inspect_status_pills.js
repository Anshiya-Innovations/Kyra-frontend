const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
console.log('--- Lines 34055 to 34120 ---');
for (let i = 34054; i < 34120; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
