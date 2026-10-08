const fs = require('fs');

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'webapp/page component/User Access Management Portal page/style.css',
  'webapp/page component/page request/User Access Management Portal page/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/css/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/style.css'
];

for (const f of cssFiles) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const idx = c.indexOf('/* SEARCH BAR: MATCHING IMAGE 3');
    console.log(f, 'idx:', idx);
  }
}
