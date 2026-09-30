const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
console.log('Total lines now:', lines.length);
for (let i = lines.length - 40; i < lines.length; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
