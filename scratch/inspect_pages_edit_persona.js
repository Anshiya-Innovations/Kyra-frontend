const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const idx = content.indexOf("Edit Persona");
console.log(content.slice(idx - 100, idx + 1500));
