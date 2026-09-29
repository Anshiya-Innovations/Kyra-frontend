const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const start = xml.indexOf("adminSelectedSection} === 'personaConversion'");
const end = xml.indexOf("adminSelectedSection} === 'accessCustomization'");
console.log('Total length of personaConversion section:', end - start);
console.log(xml.substring(start, start + 3500));
