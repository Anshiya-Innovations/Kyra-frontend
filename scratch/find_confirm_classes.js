const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

const regex = /kyra-confirm-[a-zA-Z-]+/g;
const classes = new Set();
let m;
while ((m = regex.exec(ctrl)) !== null) {
  classes.add(m[0]);
}
console.log('Confirm classes in controller:');
console.log(Array.from(classes));
