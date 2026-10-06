const { execSync } = require("child_process");
try {
  const diff = execSync("git log -S \"Business Function Details\" --oneline", { encoding: "utf8" });
  console.log("Git commits touching Business Function Details:", diff);
} catch(e) {
  console.log("Error running git:", e.message);
}
