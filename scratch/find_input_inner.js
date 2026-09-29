const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

// Find all rules targeting sapMInputBaseInner or input
let pos = 0;
while ((pos = css.indexOf('.sapMInputBaseInner', pos)) !== -1) {
    const start = Math.max(0, css.lastIndexOf('{', pos) - 60);
    const end = Math.min(css.length, css.indexOf('}', pos) + 1);
    console.log(css.substring(start, end));
    console.log('---');
    pos += 19;
}
