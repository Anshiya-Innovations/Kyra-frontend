const fs = require("fs");
const f1 = fs.readFileSync("webapp/AccessPage.controller.js", "utf8");
console.log("webapp/AccessPage.controller.js has kyra_edit_persona_restricted?", f1.includes("kyra_edit_persona_restricted"));
const f2 = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
console.log("webapp/pages/access/AccessPage.controller.js has kyra_edit_persona_restricted?", f2.includes("kyra_edit_persona_restricted"));
