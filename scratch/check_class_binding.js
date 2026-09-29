const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const regex = /class="\{=([^"]+)\}"/g;
let match;
let count = 0;
while ((match = regex.exec(xml)) !== null) {
    count++;
    if (count <= 10) {
        console.log('Match ' + count + ':', match[0]);
    }
}
console.log('Total matches of class="{= ... }":', count);
