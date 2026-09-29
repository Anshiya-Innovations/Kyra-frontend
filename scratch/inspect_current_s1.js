const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const s1Start = xml.indexOf('<VBox id="step1MigrationContainer"');
const s2Start = xml.indexOf('<VBox id="step2MigrationContainer"');
console.log(xml.substring(s1Start, s1Start + 1500));
