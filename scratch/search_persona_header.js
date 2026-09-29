const fs = require('fs');
const path = require('path');

function searchDir(dir, terms) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                searchDir(fullPath, terms);
            }
        } else if (file.endsWith('.xml') || file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const t of terms) {
                if (content.includes(t)) {
                    console.log(`Found "${t}" in ${fullPath}`);
                }
            }
        }
    }
}

searchDir('webapp', ['User Persona Conversion', 'Sign Out']);
