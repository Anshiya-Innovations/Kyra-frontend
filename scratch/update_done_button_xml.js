const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');

    // Replace Done & Close Studio button text with "Done"
    content = content.replace(
        /<Button\s+text="Done\s+&amp;\s+Close\s+Studio\s+✓"[^>]*class="kyraHudDoneBtn"[^>]*\/>/g,
        `<Button text="Done" icon="sap-icon://accept" type="Emphasized" press=".onCloseAdminSection" class="kyraHudDoneBtn" />`
    );

    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated Done button text in:', f);
});
console.log('All XML files updated successfully!');
