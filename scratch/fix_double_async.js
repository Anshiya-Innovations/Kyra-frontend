const fs = require('fs');

const accessControllerFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js'
];

for (const file of accessControllerFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace duplicate async
    content = content.replace(/async\s+async\s+onRefreshAccess\(\)/g, 'async onRefreshAccess()');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed double async in:', file);
  }
}
