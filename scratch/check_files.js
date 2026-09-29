const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

files.forEach(f => {
    console.log(f, fs.existsSync(f) ? 'EXISTS' : 'NOT FOUND');
});
