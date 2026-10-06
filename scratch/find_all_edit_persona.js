const fs = require("fs");
const path = require("path");

function searchInFiles(dir, term) {
  let matches = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && f.name !== "node_modules" && f.name !== "dist" && f.name !== ".git") {
      matches = matches.concat(searchInFiles(full, term));
    } else if (f.isFile() && (f.name.endsWith(".xml") || f.name.endsWith(".js") || f.name.endsWith(".json"))) {
      const c = fs.readFileSync(full, "utf8");
      if (c.includes(term)) {
        matches.push(full);
      }
    }
  }
  return matches;
}

console.log("Modify persona parameters:", searchInFiles("webapp", "Modify persona parameters"));
console.log("Edit Persona:", searchInFiles("webapp", "Edit Persona"));
