const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((l, i) => {
  if (l.includes('kyraViewAllBtn')) {
    console.log(`Line ${i+1}: ${l}`);
    for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 25); j++) {
      console.log(lines[j]);
    }
  }
});
