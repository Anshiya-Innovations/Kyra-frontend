const fs = require('fs');
const path = require('path');

function searchDir(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== '.git' && e.name !== 'node_modules') searchDir(full);
        else if (e.isFile() && (e.name.endsWith('.xml') || e.name.endsWith('.fragment.xml'))) {
            const c = fs.readFileSync(full, 'utf8');
            if (c.includes('text="Cancel"') || c.includes('kyraAdminCancelBtn')) {
                console.log('Found in:', full);
            }
        }
    });
}
searchDir('webapp');
