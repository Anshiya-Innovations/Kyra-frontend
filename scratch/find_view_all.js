const fs = require('fs');

const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Find all occurrences of "View All"
const lines = content.split('\n');
console.log('--- Search for View All in AccessPage.view.xml ---');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('view all') || l.toLowerCase().includes('viewall')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

// Also search in all XML files
console.log('--- Search for View All across all view files ---');
const path = require('path');
function searchDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (f === 'node_modules' || f === '.git') return;
    if (fs.statSync(p).isDirectory()) searchDir(p);
    else if (p.endsWith('.view.xml') || p.endsWith('.fragment.xml')) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.toLowerCase().includes('view all')) {
        console.log(`Found in ${p}`);
      }
    }
  });
}
searchDir('webapp');
