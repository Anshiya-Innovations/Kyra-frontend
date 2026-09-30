const fs = require('fs');

fs.copyFileSync('webapp/pages/access/AccessPage.view.xml', 'webapp/AccessPage.view.xml');
fs.copyFileSync('webapp/pages/access/AccessPage.view.xml', 'dist/pages/access/AccessPage.view.xml');
console.log('Synchronized view XML files.');

fs.copyFileSync('webapp/pages/access/AccessPage.controller.js', 'webapp/AccessPage.controller.js');
fs.copyFileSync('webapp/pages/access/AccessPage.controller.js', 'dist/pages/access/AccessPage.controller.js');
console.log('Synchronized controller JS files.');
