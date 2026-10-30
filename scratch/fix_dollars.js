const fs = require('fs');
['webapp/pages/access/AccessPage.view.xml', 'webapp/AccessPage.view.xml', 'dist/pages/access/AccessPage.view.xml', 'dist/AccessPage.view.xml'].forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  c = c.split('\\${accessModel').join('${accessModel');
  fs.writeFileSync(f, c, 'utf8');
  console.log(`Fixed in ${f}`);
});
