const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const s1Kyra = xml.indexOf("targetMode} === 'kyra'");
const s1Custom = xml.indexOf("targetMode} === 'custom'");
console.log(xml.substring(s1Kyra, s1Custom));
