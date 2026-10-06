const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const idx = content.indexOf("adminServiceDetailsMap:");
console.log(content.slice(idx + 1000, idx + 3500));
