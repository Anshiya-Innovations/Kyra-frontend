const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lastIdx = css.lastIndexOf('.kyraDarkStudioWrapper');
console.log(css.substring(lastIdx, lastIdx + 1200));
