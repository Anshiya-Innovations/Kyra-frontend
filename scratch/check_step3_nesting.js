const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const idxMigrationDetails = xml.indexOf('id="migrationDetailsContainer"');
console.log('migrationDetailsContainer opened at index:', idxMigrationDetails);

// Find where migrationDetailsContainer is closed
// Count VBox nesting from that point
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

console.log('migrationDetailsContainer closed at index:', closeIndex);
const s3Idx = xml.indexOf('id="step3MigrationContainer"');
console.log('step3MigrationContainer is at index:', s3Idx);

if (s3Idx > closeIndex) {
    console.error('CRITICAL: step3MigrationContainer is OUTSIDE migrationDetailsContainer!');
} else {
    console.log('step3MigrationContainer is INSIDE migrationDetailsContainer.');
}
