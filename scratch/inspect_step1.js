const fs = require('fs');

const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const s1Idx = v.indexOf('id="step1MigrationContainer"');
if (s1Idx !== -1) {
    const s2Idx = v.indexOf('id="step2MigrationContainer"');
    console.log(v.substring(s1Idx, s2Idx !== -1 ? s2Idx : s1Idx + 2000));
} else {
    console.log('step1MigrationContainer not found');
}
