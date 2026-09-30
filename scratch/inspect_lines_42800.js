const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
for (let i = 42800; i < 42880; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
