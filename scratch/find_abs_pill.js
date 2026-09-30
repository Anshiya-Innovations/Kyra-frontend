const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('kyraAdminTeamStatusPill') || l.includes('kyraAdminStatusPill') || l.includes('kyraAdminClassItemCard')) {
    for (let j = Math.max(0, idx - 2); j < Math.min(lines.length, idx + 10); j++) {
      if (lines[j].includes('position: absolute')) {
        console.log(`FOUND position: absolute near line ${idx+1}:`);
        console.log(lines[j]);
      }
    }
  }
});
