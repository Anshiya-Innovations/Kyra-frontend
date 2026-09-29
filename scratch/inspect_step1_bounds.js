const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Find boundaries of step1MigrationContainer
const s1Start = xml.indexOf('<VBox id="step1MigrationContainer"');
const s1End = xml.indexOf('<VBox id="step2MigrationContainer"');

console.log('s1Start:', s1Start, 's1End:', s1End);

if (s1Start === -1 || s1End === -1) {
    console.error('Could not find boundaries!');
    process.exit(1);
}

console.log('Current Step 1 length:', s1End - s1Start);
