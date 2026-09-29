const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const s1Start = xml.indexOf('<VBox id="step1MigrationContainer"');
const s1Kyra = xml.indexOf("targetMode} === 'kyra'", s1Start);
const s1Custom = xml.indexOf("targetMode} === 'custom'", s1Start);
console.log(xml.substring(s1Kyra, s1Custom));
