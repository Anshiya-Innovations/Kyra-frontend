const fs = require('fs');

const c = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
const idx = c.indexOf('onResetMigrationWorkflow');
console.log(JSON.stringify(c.substring(idx - 10, idx + 250)));
