const fs = require("fs");
const css = fs.readFileSync("webapp/css/style.css", "utf8");
console.log({
  hasBfItemCard: css.includes("kyraAdminBusinessFunctionItemCard"),
  hasSelectedHighlight: css.includes("kyraAdminSelectedRowHighlight"),
  hasSectorSelectedText: css.includes("kyraAdminSectorSelectedText")
});
