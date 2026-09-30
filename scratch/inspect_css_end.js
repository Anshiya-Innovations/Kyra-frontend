const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
console.log('--- Lines 42795 to 42920 ---');
for (let i = 42794; i < Math.min(lines.length, 42920); i++) {
  console.log((i+1) + ': ' + lines[i]);
}
