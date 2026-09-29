const fs = require('fs');
const v = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const sIdx = v.indexOf('id="adminPersonaConversionSection"');
const eIdx = v.indexOf('<!-- ADMIN SECTION 3', sIdx);
const section = v.slice(sIdx, eIdx);

const selects = section.match(/<(Select|ComboBox)[\s\S]*?<\/(Select|ComboBox)>/g);
if (selects) {
    selects.forEach((s, i) => console.log('Dropdown ' + (i+1) + ':\n' + s + '\n---'));
} else {
    console.log('No dropdowns found');
}
