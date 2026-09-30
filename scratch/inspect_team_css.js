const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');

function findSelectors(selectors) {
  selectors.forEach(sel => {
    console.log(`\n=== Selector: ${sel} ===`);
    lines.forEach((l, idx) => {
      if (l.includes(sel) && l.includes('{')) {
        console.log(`Line ${idx+1}: ${l}`);
        for (let j = idx; j < Math.min(lines.length, idx + 18); j++) {
          console.log('  ' + lines[j]);
        }
      }
    });
  });
}

findSelectors([
  'kyraAdminClassificationsSubPanel',
  'kyraAdminClassItemCard',
  'kyraAdminTeamNameBox',
  'kyraAdminTeamLeftContent',
  'kyraAdminClassItemLink',
  'kyraAdminTeamStatusPill'
]);
