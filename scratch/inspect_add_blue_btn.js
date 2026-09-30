const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('kyraAdminAddBlueBtn') && l.includes('{')) {
    console.log((idx+1) + ': ' + l);
    for (let j = idx; j < Math.min(lines.length, idx + 15); j++) {
      console.log('  ' + lines[j]);
    }
  }
});
