const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const regex = /"\{(\$\{[^\"]+\})\"/g;
let m;
let count = 0;
while ((m = regex.exec(xml)) !== null) {
    count++;
    console.log(`Match ${count}:`, m[0]);
}
console.log('Total invalid `{${...}}` bindings:', count);
