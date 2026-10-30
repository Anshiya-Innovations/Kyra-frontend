const fs = require('fs');

const walk = dir => {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const p = dir + '/' + f;
    if (fs.statSync(p).isDirectory()) res = res.concat(walk(p));
    else if (p.endsWith('.view.xml')) res.push(p);
  });
  return res;
};

walk('webapp').forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  c.split('\n').forEach((l, i) => {
    if (l.includes('text="Edit"') || (l.includes('sap-icon://edit') && l.includes('<Button'))) {
      console.log(`${f}:${i+1}: ${l.trim()}`);
    }
  });
});
