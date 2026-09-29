const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = xml.split('\n');

lines.forEach((l, i) => {
    if (l.includes('step1MigrationContainer') || l.includes('step2MigrationContainer') || l.includes('step3MigrationContainer') || l.includes('kyraStepUnit') || l.includes('adminDatabaseConfigSection')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
