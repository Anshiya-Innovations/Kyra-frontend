const fs = require('fs');
const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const lines = v.split('\n');
lines.slice(1040, 1600).forEach((l, idx) => {
    const lineNum = 1041 + idx;
    if (l.includes('<Button') || l.includes('<VBox id="admin') || l.includes('<!-- ADMIN SECTION')) {
        console.log(`L${lineNum}: ${l.trim()}`);
    }
});
