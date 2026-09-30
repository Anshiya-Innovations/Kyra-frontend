const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('kyraAdminAddBlueBtn')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
