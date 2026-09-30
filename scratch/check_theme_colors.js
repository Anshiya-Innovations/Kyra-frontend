const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

// Find color variables or top definitions
const lines = css.split('\n');
console.log('--- Checking root variables or primary theme colors ---');
for (let i = 0; i < Math.min(lines.length, 100); i++) {
  if (lines[i].includes('--') || lines[i].includes('color') || lines[i].includes('background')) {
    console.log((i+1) + ': ' + lines[i]);
  }
}
