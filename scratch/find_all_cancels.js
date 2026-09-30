const fs = require('fs');
const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const lines = v.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('text="Cancel"') || l.includes('text=\'Cancel\'')) {
        console.log(`L${idx + 1}: ${l.trim()}`);
    }
});
