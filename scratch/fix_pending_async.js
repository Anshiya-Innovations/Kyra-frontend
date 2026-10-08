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
    // Ensure onRefreshPendingRequests has async
    content = content.replace(/(?<!async\s+)onRefreshPendingRequests\(\)\s*\{/g, 'async onRefreshPendingRequests() {');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed async onRefreshPendingRequests in:', file);
  }
}
