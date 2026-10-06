const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const idx = content.indexOf("_loadCustomAccessAndConflictConfig");
console.log(content.slice(idx, idx + 2000));
