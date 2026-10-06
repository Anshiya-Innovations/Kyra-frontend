const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("webapp/manifest.json", "utf8"));
console.log("Routes & Targets in manifest.json:");
console.log("routes:", manifest["sap.ui5"].routing.routes);
console.log("targets:", manifest["sap.ui5"].routing.targets);
