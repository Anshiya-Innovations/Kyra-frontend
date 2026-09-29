const fs = require('fs');
['webapp/pages/access/AccessPage.view.xml', 'webapp/AccessPage.view.xml', 'dist/pages/access/AccessPage.view.xml'].forEach(f => {
    if (!fs.existsSync(f)) return;
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(/<Select\s+id="adminDeptTargetPersonaSelect"[\s\S]*?<\/Select>/);
    console.log('=== ' + f + ' ===\n' + (m ? m[0] : 'NOT FOUND'));
});
