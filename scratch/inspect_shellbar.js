const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const shellIdx = xml.indexOf('<f:ShellBar');
const shellEnd = xml.indexOf('</f:ShellBar>');
console.log(xml.substring(shellIdx, shellEnd + 15));
