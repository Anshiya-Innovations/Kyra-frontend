const fs = require('fs');

const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const targetSubPanelStart = '<!-- Right Sub-Panel: Team Name &amp; Persona';
const targetSubPanelEnd = '<!-- Bottom Right Footer Buttons: Cancel &amp; Save -->';

const sIdx = content.indexOf(targetSubPanelStart);
const eIdx = content.indexOf(targetSubPanelEnd);

console.log('sIdx:', sIdx, 'eIdx:', eIdx);
if (sIdx !== -1 && eIdx !== -1) {
  console.log('--- Current Right Sub-Panel Markup ---');
  console.log(content.substring(sIdx, eIdx));
}
