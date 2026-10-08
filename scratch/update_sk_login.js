const fs = require('fs');
const p = 'webapp/page component/KYRA Frontend-SK/webapp/page component/login page/Login.controller.js';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/title:\s*"Loading KYRA Governance Dashboard\.\.\.",\s*subtitle:\s*"Pre-loading active roles, entitlements, and governance records\.\.\.",\s*duration:\s*15000/, 'title: "Loading Governance Dashboard...", subtitle: "Setting up user workspace and retrieving access records..."');
c = c.replace(/window\.showKyraLoading\("Loading KYRA Governance Dashboard\.\.\.",\s*"Pre-loading active roles, entitlements, and governance records\.\.\.",\s*15000\)/, 'window.showKyraLoading("Loading Governance Dashboard...", "Setting up user workspace and retrieving access records...")');
fs.writeFileSync(p, c, 'utf8');
console.log('SK login controller updated successfully');
