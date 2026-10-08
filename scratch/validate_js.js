const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let count = 0;
function checkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') checkDir(full);
        } else if (file.endsWith('.js')) {
            try {
                execSync(`node -c "${full}"`);
                count++;
            } catch(e) {
                console.error('SYNTAX ERROR IN:', full);
                process.exit(1);
            }
        }
    });
}
checkDir('webapp');
console.log(`All ${count} JS files in webapp validated cleanly with ZERO syntax errors!`);
