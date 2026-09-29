const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

const regex = /(?:\.kyraDarkCheckbox|\.sapMCb)[^\{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(css)) !== null) {
    console.log(m[0]);
    console.log('---');
}
