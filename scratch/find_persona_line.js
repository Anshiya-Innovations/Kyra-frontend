const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = xml.split('\n');
lines.forEach((l, i) => {
    if (l.includes("adminSelectedSection} === 'personaConversion'") && l.includes("fioriTableCard")) {
        console.log(`Line ${i + 1}: ${l}`);
    }
});
