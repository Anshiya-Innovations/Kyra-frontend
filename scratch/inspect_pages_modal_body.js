const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const idx = content.indexOf("kyra_edit_persona_name");
console.log(content.slice(idx, idx + 1000));
