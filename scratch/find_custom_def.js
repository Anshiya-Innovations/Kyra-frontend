const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");
const match = content.match(/_loadCustomAccessAndConflictConfig\s*\([^)]*\)\s*{/);
if (match) {
  const idx = match.index;
  console.log(content.slice(idx, idx + 2500));
} else {
  console.log("Not found as method");
}
