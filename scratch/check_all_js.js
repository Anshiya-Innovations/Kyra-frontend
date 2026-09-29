const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== 'resources' && entry.name !== 'test') {
                checkDir(full);
            }
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            try {
                execSync(`node -c "${full}"`);
                console.log('OK:', full);
            } catch (e) {
                console.error('SYNTAX ERROR in:', full);
            }
        }
    }
}

checkDir('webapp');
