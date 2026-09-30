const fs = require('fs');
const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const lines = css.split('\n');
console.log('Total lines:', lines.length);
for (let i = 42790; i < lines.length; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
