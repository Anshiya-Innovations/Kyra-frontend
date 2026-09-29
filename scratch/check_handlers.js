const fs = require('fs');

const c = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');
console.log('has onCloseAdminSection:', c.includes('onCloseAdminSection'));
console.log('has onCloseMigrationDropdown:', c.includes('onCloseMigrationDropdown'));
console.log('has onResetMigrationWorkflow:', c.includes('onResetMigrationWorkflow'));
