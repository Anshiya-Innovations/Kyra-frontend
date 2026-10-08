const fs = require("fs");
const path = require("path");

const loginControllerPaths = [
    "webapp/pages/login/Login.controller.js",
    "webapp/page component/login page/Login.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/login page/Login.controller.js"
];

loginControllerPaths.forEach(relPath => {
    const fullPath = path.resolve(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, "utf8");

    // Replace the setTimeout 350 hide with update
    const targetOld = `                // Promptly dismiss loading slide for instantaneous dashboard display
                setTimeout(() => {
                    if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                        window.KyraLoader.hide();
                    } else if (window.hideKyraLoading) {
                        window.hideKyraLoading();
                    }
                }, 350);`;

    const targetNew = `                // Transition loader into dashboard loading state
                if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                    window.KyraLoader.show({
                        title: "Loading Governance Dashboard...",
                        subtitle: "Setting up user workspace and retrieving access records..."
                    });
                } else if (window.showKyraLoading) {
                    window.showKyraLoading("Loading Governance Dashboard...", "Setting up user workspace and retrieving access records...");
                }`;

    if (content.includes("Promptly dismiss loading slide for instantaneous dashboard display")) {
        content = content.replace(targetOld, targetNew);
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Updated loader transition in:", relPath);
    } else {
        console.log("Pattern not matched in:", relPath);
    }
});
