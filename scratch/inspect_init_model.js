const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const idx = content.indexOf("new JSONModel({");
console.log(content.slice(idx + 1000, idx + 4000));
