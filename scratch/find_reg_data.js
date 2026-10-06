const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const lines = content.split(/\r?\n/);
lines.forEach((l, idx) => {
  if (l.includes("adminRegions") || l.includes("adminBusinessSectors") || l.includes("onAddAdminRegion") || l.includes("onEditAdminRegion")) {
    console.log((idx + 1) + ": " + l.trim());
  }
});
