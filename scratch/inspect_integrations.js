const fs = require('fs');
const view = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const startIdx = view.indexOf('Integrations');
console.log('startIdx:', startIdx);
const cardStart = view.lastIndexOf('<VBox', startIdx);
console.log(view.substring(cardStart, cardStart + 7500));
