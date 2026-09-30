const fs = require('fs');

console.log('--- Step 1: Updating XML view files ---');
const newSplitSection = fs.readFileSync('scratch/new_split_section.xml', 'utf8');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) return;
  let content = fs.readFileSync(vf, 'utf8');
  const isCrlf = content.includes('\r\n');
  let norm = content.replace(/\r\n/g, '\n');

  const startMarker = '<HBox width="100%" justifyContent="SpaceBetween" alignItems="Stretch" class="kyraAdminServiceDetailsSplitBox">';
  const endMarker = '<!-- Bottom Right Footer Buttons: Cancel &amp; Save -->';

  const startIdx = norm.indexOf(startMarker);
  const endIdx = norm.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = norm.substring(0, startIdx);
    const after = norm.substring(endIdx);
    norm = before + newSplitSection + '\n\n                                ' + after;
    console.log(`[${vf}] Replaced Service Details inner split box!`);
  } else {
    console.error(`[${vf}] Markers not found!`);
  }

  const finalStr = isCrlf ? norm.replace(/\n/g, '\r\n') : norm;
  fs.writeFileSync(vf, finalStr, 'utf8');
});

console.log('\n--- Step 2: Updating CSS stylesheets ---');
const teamPillCss = fs.readFileSync('scratch/team_pill.css', 'utf8');

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'dist/pages/access/style.css',
  'dist/css/style.css'
];

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  const markerSimple = '/* SERVICE DETAILS: TEAM PLACE & ACTIVE / DEACTIVE STATUS PILL ENGINE';
  const existingIdx = content.indexOf(markerSimple);

  if (existingIdx !== -1) {
    const topIdx = content.lastIndexOf('/* ==========================================================================', existingIdx);
    content = content.substring(0, topIdx !== -1 ? topIdx : existingIdx) + teamPillCss;
  } else {
    content += '\n\n' + teamPillCss;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[UPDATED CSS] ${file}`);
});

console.log('\nAll done cleanly!');
