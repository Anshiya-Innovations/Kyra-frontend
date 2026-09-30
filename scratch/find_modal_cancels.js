const fs = require('fs');
const ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

const regex = /<button[^>]*class=["'][^"']*cancel[^"']*["'][^>]*>[\s\S]*?<\/button>/gi;
let m;
while ((m = regex.exec(ctrl)) !== null) {
  console.log(`At index ${m.index}:`);
  console.log(m[0]);
}
