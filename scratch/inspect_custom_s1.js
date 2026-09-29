const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const customIdx = xml.indexOf("targetMode} === 'custom'");
console.log(xml.substring(customIdx, customIdx + 1500));
