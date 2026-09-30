const fs = require('fs');

const path = require('path');
function searchCode(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'dist') return;
    if (fs.statSync(p).isDirectory()) searchCode(p);
    else if (p.endsWith('.js') || p.endsWith('.xml') || p.endsWith('.css')) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.toLowerCase().includes('deactive')) {
        console.log(`Found 'deactive' in ${p}`);
      }
    }
  });
}
searchCode('webapp');
