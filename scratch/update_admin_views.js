const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                results = results.concat(walk(full));
            }
        } else if (file === 'AccessPage.view.xml') {
            results.push(full);
        }
    });
    return results;
}

const viewFiles = walk('webapp');

for (const f of viewFiles) {
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;

    // 1. Add press=".onSelectAdminDatabaseConfig" to arrowAdminDatabaseConfig if not present
    if (content.includes('id="arrowAdminDatabaseConfig"') && !content.includes('id="arrowAdminDatabaseConfig"\r\n                                        press=".onSelectAdminDatabaseConfig"') && !content.includes('id="arrowAdminDatabaseConfig"\n                                        press=".onSelectAdminDatabaseConfig"')) {
        content = content.replace(
            /(id="arrowAdminDatabaseConfig"[\r\n\s]+src="[^"]+")([\r\n\s]+class="kyraArrowIcon")/g,
            '$1\r\n                                        press=".onSelectAdminDatabaseConfig"$2'
        );
        modified = true;
    }

    // 2. Add press=".onSelectAdminPersonaConversion" to arrowAdminPersonaConversion if not present
    if (content.includes('id="arrowAdminPersonaConversion"') && !content.includes('id="arrowAdminPersonaConversion"\r\n                                        press=".onSelectAdminPersonaConversion"') && !content.includes('id="arrowAdminPersonaConversion"\n                                        press=".onSelectAdminPersonaConversion"')) {
        content = content.replace(
            /(id="arrowAdminPersonaConversion"[\r\n\s]+src="[^"]+")([\r\n\s]+class="kyraArrowIcon")/g,
            '$1\r\n                                        press=".onSelectAdminPersonaConversion"$2'
        );
        modified = true;
    }

    // 3. Add press=".onSelectAdminAccessCustomization" to arrowAdminAccessCustomization if not present
    if (content.includes('id="arrowAdminAccessCustomization"') && !content.includes('id="arrowAdminAccessCustomization"\r\n                                        press=".onSelectAdminAccessCustomization"') && !content.includes('id="arrowAdminAccessCustomization"\n                                        press=".onSelectAdminAccessCustomization"')) {
        content = content.replace(
            /(id="arrowAdminAccessCustomization"[\r\n\s]+src="[^"]+")([\r\n\s]+class="kyraArrowIcon")/g,
            '$1\r\n                                        press=".onSelectAdminAccessCustomization"$2'
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated view:', f);
    } else {
        console.log('Already updated or no change:', f);
    }
}
