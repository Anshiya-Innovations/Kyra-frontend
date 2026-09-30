const fs = require('fs');
const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const regex = /<Button[\s\S]*?\/>/g;
let match;
while ((match = regex.exec(v)) !== null) {
    const btn = match[0];
    const line = v.slice(0, match.index).split('\n').length;
    if (line >= 200 && line <= 2600) {
        console.log(`--- Line ${line} ---`);
        console.log(btn.replace(/\s+/g, ' '));
    }
}
