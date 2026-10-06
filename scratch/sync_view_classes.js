const fs = require('fs');
const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];
viewFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('class="kyraAdminSearchField sapUiTinyMarginEnd"', 'class="kyraAdminSearchField"');
  content = content.replace(
    '<HBox alignItems="Center">\r\n                                        <Button\r\n                                            text="Add Business Function"',
    '<HBox alignItems="Center" class="kyraAdminHeaderActions">\r\n                                        <Button\r\n                                            text="Add Business Function"'
  );
  content = content.replace(
    '<HBox alignItems="Center">\n                                        <Button\n                                            text="Add Business Function"',
    '<HBox alignItems="Center" class="kyraAdminHeaderActions">\n                                        <Button\n                                            text="Add Business Function"'
  );
  content = content.replace(
    'press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn sapUiTinyMarginBegin"',
    'press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn"'
  );
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Synced view changes successfully');
