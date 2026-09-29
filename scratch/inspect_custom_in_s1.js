const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const s1Start = xml.indexOf('<VBox id="step1MigrationContainer"');
const customStart = xml.indexOf("targetMode} === 'custom'", s1Start);
const s2Start = xml.indexOf('<VBox id="step2MigrationContainer"');

console.log(xml.substring(customStart, s2Start));
