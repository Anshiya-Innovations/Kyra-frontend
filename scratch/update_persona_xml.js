const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Add class kyraPersonaSegmentedBtn if not present
    if (content.includes('id="adminPersonaConversionModeSwitch"')) {
        content = content.replace(
            /<SegmentedButton\s+id="adminPersonaConversionModeSwitch"\s+selectedKey="\{accessModel>\/personaConversionMode\}"\s+selectionChange="\.onPersonaConversionModeChange"\s+class="([^"]*)"/g,
            (match, p1) => {
                const newClasses = p1.includes('kyraPersonaSegmentedBtn') ? p1 : `${p1} kyraPersonaSegmentedBtn`;
                return `<SegmentedButton id="adminPersonaConversionModeSwitch" selectedKey="{accessModel>/personaConversionMode}" selectionChange=".onPersonaConversionModeChange" class="${newClasses}"`;
            }
        );
    }
    
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated XML in:', f);
});

console.log('XML files updated successfully!');
