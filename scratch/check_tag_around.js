const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const s = xml.substring(49800, 49950);
console.log('Around 49852:\n' + s);
