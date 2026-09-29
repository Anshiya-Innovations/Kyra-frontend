const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

// Find all occurrences of "input[" or "input " or ".sapMInputBase"
const regex = /(?:input|\.sapMInputBase)[^\{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(css)) !== null) {
    if (m[0].includes('#0B132B') || m[0].includes('#070D1') || m[0].includes('#141E33') || m[0].includes('background')) {
        console.log(m[0]);
        console.log('---');
    }
}
