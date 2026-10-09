const fs = require('fs');
const files = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml',
  'dist/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let xml = fs.readFileSync(f, 'utf8');
  xml = xml.replace(
    /<HBox alignItems="Center" class="kyraAdminStatusPill" press="\.onToggleAdminConflictStatus"/g,
    '<HBox alignItems="Center" justifyContent="Center" class="kyraAdminStatusPill" press=".onToggleAdminConflictStatus"'
  );
  xml = xml.replace(
    /(press="\.onToggleAdminConflictStatus"[\s\S]*?<HBox alignItems="Center") class="kyraAdminRowActionGroup">/g,
    '$1 justifyContent="Center" class="kyraAdminRowActionGroup">'
  );
  fs.writeFileSync(f, xml, 'utf8');
  console.log('Updated', f);
});
