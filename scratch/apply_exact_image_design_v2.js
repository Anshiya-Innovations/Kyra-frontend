const fs = require('fs');
const path = require('path');

console.log('--- Step 1: Updating View XML files ---');

const xmlSnippetPath = path.join(__dirname, 'snippet_right_subpanel.xml');
const replacementSnippet = fs.readFileSync(xmlSnippetPath, 'utf8');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) {
    console.log(`[SKIP] ${vf} does not exist`);
    return;
  }
  let content = fs.readFileSync(vf, 'utf8');
  const isCrlf = content.includes('\r\n');
  let norm = content.replace(/\r\n/g, '\n');

  const targetStart = '<!-- Right Sub-Panel: Team Name &amp; Persona';
  const targetEnd = '<!-- Bottom Right Footer Buttons: Cancel &amp; Save -->';

  const sIdx = norm.indexOf(targetStart);
  const eIdx = norm.indexOf(targetEnd);

  if (sIdx !== -1 && eIdx !== -1) {
    const before = norm.substring(0, sIdx);
    const after = norm.substring(eIdx);
    norm = before + replacementSnippet + '\n\n                                ' + after;
    const finalStr = isCrlf ? norm.replace(/\n/g, '\r\n') : norm;
    fs.writeFileSync(vf, finalStr, 'utf8');
    console.log(`[SUCCESS] Updated ${vf}`);
  } else {
    console.error(`[ERROR] Target markers not found in ${vf}`);
  }
});

console.log('\n--- Step 2: Updating CSS files ---');

const cssSnippetPath = path.join(__dirname, 'snippet_design.css');
const exactCss = fs.readFileSync(cssSnippetPath, 'utf8');

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'dist/pages/access/style.css',
  'dist/css/style.css'
];

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`[SKIP] ${file} does not exist`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  const markerSimple = '/* SERVICE DETAILS RIGHT SUB-PANEL: MATCHES media_1790767316133.png EXACTLY';
  const existingIdx = content.indexOf(markerSimple);

  if (existingIdx !== -1) {
    const topIdx = content.lastIndexOf('/* ==========================================================================', existingIdx);
    content = content.substring(0, topIdx !== -1 ? topIdx : existingIdx) + exactCss;
  } else {
    content += '\n\n' + exactCss;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[SUCCESS] Updated ${file}`);
});

console.log('\nDone applying design!');
