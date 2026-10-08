const fs = require('fs');

const files = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js'
];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(file, {
    hasMethod: content.includes('onEditAdminService(') || content.includes('onEditAdminService: function(') || content.includes('onEditAdminService : function('),
    hasStatusSelect: content.includes('kyra_edit_svc_status'),
    hasPersist: content.includes('_persistAllCustomizationsToDb')
  });
}
