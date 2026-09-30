const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

const regex = /(onCancel\w+|onSave\w+|open\w+Dialog)/g;
let match;
const found = new Set();
while ((match = regex.exec(ctrl)) !== null) {
  found.add(match[0]);
}
console.log('Found handler functions:');
console.log(Array.from(found));
