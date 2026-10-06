const fs = require("fs");
const content = fs.readFileSync("webapp/AccessPage.view.xml", "utf8");
const lines = content.split(/\r?\n/);
lines.forEach((l, idx) => {
  if (l.includes("adminSelectedSection")) {
    console.log((idx + 1) + ": " + l.trim());
  }
});
