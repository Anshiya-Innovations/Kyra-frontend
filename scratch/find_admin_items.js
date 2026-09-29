const fs = require('fs');
const path = require('path');

function search(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== '.git' && e.name !== 'node_modules') search(full);
        else if (e.isFile() && (e.name.endsWith('.xml') || e.name.endsWith('.js') || e.name.endsWith('.json'))) {
            const c = fs.readFileSync(full, 'utf8');
            if (c.includes('key="Admin"') || c.includes('text="Admin"')) {
                console.log('Found in:', full);
            }
        }
    });
}
search('webapp');
