const fs = require("fs");
const lines = fs.readFileSync("webapp/AccessPage.view.xml", "utf8").split(/\r?\n/);
for (let i = 1404; i < 2025; i++) {
  const l = lines[i];
  if (l.includes("CARD:") || l.includes("SECTION:") || l.includes("<!-- ") || l.includes("<Title ")) {
    console.log((i + 1) + ": " + l.trim());
  }
}
