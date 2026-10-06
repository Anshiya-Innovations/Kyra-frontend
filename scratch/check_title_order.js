const fs = require("fs");
const content = fs.readFileSync("webapp/pages/access/AccessPage.view.xml", "utf8");
const start = content.indexOf("adminAccessCustomizationSection");
const sub = content.substring(start, start + 30000);

const titles = [];
const lines = sub.split("\n");
lines.forEach(l => {
    if (l.includes("<Title text=")) {
        titles.push(l.trim());
    }
});
console.log("Order of section titles in Access Customization:");
titles.forEach((t, i) => console.log(`${i + 1}. ${t}`));
