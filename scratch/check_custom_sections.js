const fs = require("fs");
const content = fs.readFileSync("webapp/AccessPage.view.xml", "utf8");
const lines = content.split(/\r?\n/);
lines.forEach((l, idx) => {
  if (l.includes("adminSelectedSection") || l.includes("Access Customization") || l.includes("Business Sectors") || l.includes("Region")) {
    if (idx > 3800 || l.includes("Region (") || l.includes("Business Sectors")) {
      console.log((idx + 1) + ": " + l.trim());
    }
  }
});
