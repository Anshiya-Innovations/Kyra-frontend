const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

// Check the very end of style.css
console.log('--- Last 2000 chars of style.css ---');
console.log(css.substring(css.length - 2000));
