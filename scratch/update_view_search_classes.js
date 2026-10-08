const fs = require('fs');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/pages/Approver/Approver.view.xml',
  'webapp/page component/Approver/Approver.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/Approver/Approver.view.xml'
];

for (const file of viewFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace class="kyraEntitlementsSearchField" with class="kyraAdminSearchField kyraEntitlementsSearchField"
    // Make sure not to duplicate if already present
    const updated = content.replace(/class="kyraEntitlementsSearchField"/g, 'class="kyraAdminSearchField kyraEntitlementsSearchField"');
    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log('Updated search field class in:', file);
    } else {
      console.log('No replacement needed in:', file);
    }
  }
}
