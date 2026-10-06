const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const idx = content.indexOf("onSearchAdminBusinessSectors");
console.log(idx !== -1 ? "FOUND at " + idx : "NOT FOUND");
if (idx !== -1) {
  console.log(content.slice(idx, idx + 1500));
}
