const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const targetSectionStart = '<HBox width="100%" justifyContent="SpaceBetween" alignItems="Stretch" class="kyraAdminServiceDetailsSplitBox">';
const targetSectionEnd = '<!-- Bottom Right Footer Buttons: Cancel &amp; Save -->';

const startIdx = content.indexOf(targetSectionStart);
const endIdx = content.indexOf(targetSectionEnd);

console.log('Found startIdx:', startIdx);
console.log('Found endIdx:', endIdx);

if (startIdx !== -1 && endIdx !== -1) {
  console.log('Current section:');
  console.log(content.substring(startIdx, endIdx));
}
