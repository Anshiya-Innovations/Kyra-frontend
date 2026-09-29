const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = xml.split('\n');

lines.forEach((l, i) => {
    if (l.includes('migrationLiveStreamDropdown') || l.includes('Live DataBridge Pipeline Stream') || l.includes('onExecuteMigration')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
