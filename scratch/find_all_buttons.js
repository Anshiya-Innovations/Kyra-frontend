const fs = require('fs');
const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const lines = v.split('\n');
const adminButtons = [];

// Let's search from line 250 to 2000 (where admin cards, migration studio, persona conversion, etc. are)
lines.forEach((l, idx) => {
    if (l.includes('<Button')) {
        adminButtons.push({ line: idx + 1, text: l.trim() });
    }
});

console.log('Total buttons found in view:', adminButtons.length);
adminButtons.slice(0, 40).forEach(b => console.log('L' + b.line + ': ' + b.text));
