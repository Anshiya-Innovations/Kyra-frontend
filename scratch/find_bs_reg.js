const fs = require("fs");
const lines = fs.readFileSync("webapp/AccessPage.view.xml", "utf8").split(/\r?\n/);
lines.forEach((l, idx) => {
  if (l.includes("Business Sectors") || l.includes("Business Function Details") || l.includes("Region (")) {
    console.log((idx + 1) + ": " + l.trim());
  }
});
