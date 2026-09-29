const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const pos = xml.indexOf("adminSelectedSection} === 'personaConversion'");
console.log(xml.substring(pos, pos + 3000));
