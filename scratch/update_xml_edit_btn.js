const fs = require('fs');

const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml'
];

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    const searchStr = `id="btnEditTargetSystems"
                                            text="Edit"
                                            icon="sap-icon://edit"
                                            type="Default"
                                            press=".onEditTargetSystemsSelection"
                                            visible="{accessModel>/isTargetSystemsConfirmed}"
                                            class="kyraSecondaryBtn"`;
    
    const replaceStr = `id="btnEditTargetSystems"
                                            text="Edit"
                                            icon="sap-icon://edit"
                                            type="Default"
                                            press=".onEditTargetSystemsSelection"
                                            visible="{accessModel>/isTargetSystemsConfirmed}"
                                            class="kyraSapEditBtn"`;

    if (content.includes(searchStr)) {
        content = content.replace(searchStr, replaceStr);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated Edit button class in ${file}`);
    } else {
        // Try regex across newlines
        const re = /(id="btnEditTargetSystems"[\s\S]*?class=")kyraSecondaryBtn(")/;
        if (re.test(content)) {
            content = content.replace(re, '$1kyraSapEditBtn$2');
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated Edit button class (regex) in ${file}`);
        } else {
            console.warn(`Could not find searchStr in ${file}`);
        }
    }
});
