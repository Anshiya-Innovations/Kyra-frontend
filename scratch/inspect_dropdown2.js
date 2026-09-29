const fs = require('fs');

const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const idx = v.indexOf('migrationLiveStreamDropdown');
if (idx !== -1) {
    console.log(v.substring(idx + 1800, idx + 4500));
} else {
    console.log('Not found');
}
