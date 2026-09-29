const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const idxMigrationDetails = xml.indexOf('id="migrationDetailsContainer"');
const s1Idx = xml.indexOf('id="step1MigrationContainer"');
const s2Idx = xml.indexOf('id="step2MigrationContainer"');
const s3Idx = xml.indexOf('id="step3MigrationContainer"');

console.log('migrationDetailsContainer:', idxMigrationDetails);
console.log('step1MigrationContainer:', s1Idx);
console.log('step2MigrationContainer:', s2Idx);
console.log('step3MigrationContainer:', s3Idx);

// Check VBox closing of migrationDetailsContainer
let depth = 0;
let pos = idxMigrationDetails;
const vRegex = /<(\/)?VBox(\s|>)/g;
vRegex.lastIndex = pos;

let m;
let closeIndex = -1;
while ((m = vRegex.exec(xml)) !== null) {
    if (m[1] === '/') {
        depth--;
        if (depth === 0) {
            closeIndex = m.index;
            break;
        }
    } else {
        depth++;
    }
}
console.log('migrationDetailsContainer closes at index:', closeIndex);
