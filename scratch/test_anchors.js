const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");

console.log("a1 (add persona label):", content.includes('for="kyra_add_persona_name">PERSONA NAME'));
console.log("a2 (add persona push):", content.includes('accessPrivilege: "Restricted"'));
console.log("a4 (sCurrentStatus):", content.includes('const sCurrentStatus = oPersona.status || "Active";'));
console.log("a5 (edit persona status label):", content.includes('for="kyra_edit_persona_status">STATUS</label>'));
console.log("a7 (adminSystems: [):", content.includes('adminSystems: ['));
console.log("a8 (conflict handlers header):", content.includes('// ── Custom Conflict Section Handlers ──'));

const viewContent = fs.readFileSync("webapp/pages/access/AccessPage.view.xml", "utf8");
console.log("viewAnchor (CUSTOM CONFLICT):", viewContent.includes('<!-- 3. BOTTOM FULL-WIDTH CARD: CUSTOM CONFLICT SECTION'));
