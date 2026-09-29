const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = xml.split(/\r?\n/);
lines.forEach((l, i) => {
    if (l.includes("adminPersonaConversionModeSwitch")) {
        console.log(`Line ${i + 1}: ${l}`);
    }
});
