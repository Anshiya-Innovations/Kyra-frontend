const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

const blueHexes = ['#0070F2', '#0064D9', '#0854A0', '#1B6ACB', '#005FB8', '#0A6ED1', '#1873B9', '#0B63C5'];

console.log('--- Checking for unwanted blue colors in Admin / Button sections ---');
const lines = css.split('\n');
lines.forEach((l, idx) => {
  blueHexes.forEach(hex => {
    if (l.toUpperCase().includes(hex)) {
      if (idx > 30000) {
        console.log(`Line ${idx+1} [${hex}]: ${l.trim()}`);
      }
    }
  });
});
