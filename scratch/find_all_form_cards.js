const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

// Find all definitions of .kyraDarkFormCard
let idx = 0;
while ((idx = css.indexOf('.kyraDarkFormCard', idx)) !== -1) {
    console.log('--- At index', idx, '---');
    console.log(css.substring(idx, idx + 400));
    idx += 17;
}
