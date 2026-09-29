const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

console.log('XML line count:', xml.split('\n').length);
console.log('Includes adminDatabaseConfigSection?', xml.includes('id="adminDatabaseConfigSection"'));
console.log('Includes step1MigrationContainer?', xml.includes('id="step1MigrationContainer"'));
console.log('Includes step3MigrationContainer?', xml.includes('id="step3MigrationContainer"'));

// Check line where step3 ends
const lines = xml.split('\n');
let s3End = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="step3MigrationContainer"')) {
        for (let j = i; j < i + 100; j++) {
            if (lines[j].includes('<!-- ADMIN SECTION 2: USER PERSONA CONVERTION')) {
                s3End = j;
                break;
            }
        }
        break;
    }
}
console.log('Step 3 ends around line:', s3End);
if (s3End !== -1) {
    console.log(lines.slice(s3End - 5, s3End + 3).join('\n'));
}
