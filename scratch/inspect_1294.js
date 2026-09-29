const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
console.log(css.substring(1294000, 1296413));
