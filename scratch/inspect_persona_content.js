const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const pStart = xml.indexOf("personaConversion' }\"\n                        class=\"fioriTableCard");
console.log(xml.substring(pStart, pStart + 3500));
