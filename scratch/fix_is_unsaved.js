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
  let content = fs.readFileSync(file, 'utf8');

  // Replace item update inside onEditAdminService
  const regItem = /item\.serviceName === sOldName \? Object\.assign\(\{\}, item, \{\s*serviceName: sNewName,\s*status: sNewStatus\s*\}\) : item/g;
  if (regItem.test(content)) {
    content = content.replace(regItem, `item.serviceName === sOldName ? Object.assign({}, item, {
                                        serviceName: sNewName,
                                        status: sNewStatus,
                                        isUnsaved: false
                                    }) : item`);
    console.log('Fixed item.isUnsaved in:', file);
  } else {
    console.log('Pattern not found for item.isUnsaved in:', file);
  }

  // Ensure isCurrentServiceUnsaved is cleared
  const regCurrent = /(bIsCurrent\)\s*\{\s*oModel\.setProperty\("\/selectedAdminServiceName",\s*sNewName\);)/g;
  if (regCurrent.test(content)) {
    content = content.replace(regCurrent, `$1\n                                    oModel.setProperty("/isCurrentServiceUnsaved", false);`);
    console.log('Fixed isCurrentServiceUnsaved in:', file);
  }

  fs.writeFileSync(file, content, 'utf8');
}
