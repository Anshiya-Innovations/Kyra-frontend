const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');

    // 1. Update Verify Target Destination button
    content = content.replace(
        /<Button\s+text="[^"]*Verify Target Destination"[^>]*class="kyraVerifyDestLinkBtn"[^>]*\/>/g,
        `<Button text="Verify Target Destination" icon="sap-icon://accept" press=".onVerifyTargetTable" type="Transparent" class="kyraVerifyDestLinkBtn" />`
    );

    // 2. Update Back to Connections
    content = content.replace(
        /<Button\s+text="&lt;\s*Back to Connections"[^>]*class="kyraStep2BackLink"[^>]*\/>/g,
        `<Button text="← Back to Connections" press=".onGoToStep1" type="Transparent" class="kyraStep2BackLink" />`
    );

    // 3. Update Migrate Data button
    content = content.replace(
        /<Button\s+id="btnMigrateData"[\s\S]*?class="kyraStep2MigrateBtn"\s*\/>/g,
        `<Button id="btnMigrateData" text="{= \${accessModel>/dbMigration/hud/state} === 'active' ? 'Migrating Data...' : 'Migrate Data ➔' }" icon="sap-icon://paper-plane" type="Emphasized" press=".onExecuteMigration" class="kyraStep2MigrateBtn" />`
    );

    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated XML in:', f);
});
console.log('All XML files updated successfully!');
