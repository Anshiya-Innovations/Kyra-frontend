const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('showDetails: false')) {
        content = content.replace(
            'dbMigration: {\n                    targetMode: "kyra",',
            'dbMigration: {\n                    targetMode: "kyra",\n                    showDetails: false,'
        );
        fs.writeFileSync(f, content, 'utf8');
        console.log('Added showDetails: false to', f);
    } else {
        console.log('showDetails: false already present in', f);
    }
});
