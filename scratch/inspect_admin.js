const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = content.split('\n');

console.log('--- Scanning lines 950 to 1850 for Buttons and Sections ---');
for (let i = 950; i < 1850; i++) {
  const line = lines[i];
  if (line.includes('<Button') || line.includes('text="Save"') || line.includes('text="Cancel"') || line.includes('kyraAdminSaveBtn') || line.includes('kyraAdminCancelBtn')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
}
