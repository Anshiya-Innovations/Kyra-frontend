const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const pStart = xml.indexOf("personaConversion' }\"");
console.log('pStart index:', pStart);
if (pStart !== -1) {
    console.log(xml.substring(pStart, pStart + 2000));
}
