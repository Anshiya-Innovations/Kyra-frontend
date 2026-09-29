const cp = require('child_process');

const content = cp.execSync('git show 05f1dd8:webapp/pages/access/AccessPage.view.xml', { maxBuffer: 10*1024*1024 }).toString();
const idx1 = content.indexOf('step1MigrationContainer');
console.log(content.substring(idx1, idx1 + 1200));
