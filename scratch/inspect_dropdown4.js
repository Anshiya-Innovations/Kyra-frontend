const fs = require('fs');

const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const idx = v.indexOf('Pipeline Duration');
if (idx !== -1) {
    console.log(v.substring(idx, idx + 4500));
} else {
    console.log('Not found');
}
