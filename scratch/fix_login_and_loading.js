const fs = require("fs");
const path = require("path");

const accessControllerPaths = [
    "webapp/pages/access/AccessPage.controller.js",
    "webapp/AccessPage.controller.js",
    "webapp/page component/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/page request/User Access Management Portal.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/AccessPage.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js"
];

const loginControllerPaths = [
    "webapp/pages/login/Login.controller.js",
    "webapp/page component/login page/Login.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/login page/Login.controller.js"
];

console.log("=== FIXING ACCESSPAGE CONTROLLERS ===");

accessControllerPaths.forEach(relPath => {
    const fullPath = path.resolve(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) {
        console.log("Skipping (not found):", relPath);
        return;
    }
    let content = fs.readFileSync(fullPath, "utf8");
    let changed = false;

    // 1. Remove undeclared bIsReqRole in _onRouteMatched
    const badReqRoleLine = /oModel\.setProperty\("\/showApproverSection",\s*!bIsReqRole\s*&&[^;]+;\r?\n/g;
    if (badReqRoleLine.test(content)) {
        content = content.replace(badReqRoleLine, "");
        console.log(`[${relPath}] Removed undeclared bIsReqRole line`);
        changed = true;
    }

    // 2. Remove if (!bAuthenticated) { ... return; } from onInit()
    // It is located after localStorage.removeItem("kyra_pending_revocations");
    // and before const oAuthInfo = ...
    const onInitAuthGuardRegex = /(localStorage\.removeItem\("kyra_pending_revocations"\);\s*sessionStorage\.removeItem\("kyra_pending_revocations"\);\s*\}\s*catch\(e\)\s*\{\s*\})([\s\S]*?)(const\s+oAuthInfo\s*=\s*window\.KyraAuthManager)/;
    const match = content.match(onInitAuthGuardRegex);
    if (match && match[2].includes("bAuthenticated")) {
        content = content.replace(onInitAuthGuardRegex, "$1\r\n            $3");
        console.log(`[${relPath}] Removed premature auth return from onInit()`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Successfully updated: ${relPath}`);
    } else {
        console.log(`No changes needed for: ${relPath}`);
    }
});

console.log("\n=== FIXING LOGIN CONTROLLERS ===");

loginControllerPaths.forEach(relPath => {
    const fullPath = path.resolve(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) {
        console.log("Skipping (not found):", relPath);
        return;
    }
    let content = fs.readFileSync(fullPath, "utf8");
    let changed = false;

    // Check performLoginSuccess loader dismissal:
    // Replace early hide with smooth update
    const oldEarlyHide = /\/\/\s*Promptly dismiss loading slide for instantaneous dashboard display\s*setTimeout\(\(\)\s*=>\s*\{\s*if\s*\(window\.KyraLoader[^}]+\}\s*,\s*350\);/g;
    if (oldEarlyHide.test(content)) {
        const newLoaderUpdate = `// Update loader for smooth transition into governance dashboard
                if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                    window.KyraLoader.show({
                        title: "Loading Governance Dashboard...",
                        subtitle: "Setting up user workspace and retrieving access records..."
                    });
                }`;
        content = content.replace(oldEarlyHide, newLoaderUpdate);
        console.log(`[${relPath}] Updated performLoginSuccess loader transition`);
        changed = true;
    }

    // Ensure fallback navigation properly checks createId("AccessPage")
    const oldFallbackNav = /if\s*\(oInnerApp\s*&&\s*typeof\s*oInnerApp\.to\s*===\s*"function"\)\s*\{\s*oInnerApp\.to\("AccessPage"\);\s*\}/g;
    if (oldFallbackNav.test(content)) {
        const newFallbackNav = `if (oInnerApp && typeof oInnerApp.to === "function") {
                            try {
                                const sPageId = (this.getOwnerComponent() && typeof this.getOwnerComponent().createId === "function")
                                    ? this.getOwnerComponent().createId("AccessPage") : "AccessPage";
                                if (typeof oInnerApp.getPage === "function" && oInnerApp.getPage(sPageId)) {
                                    oInnerApp.to(sPageId);
                                }
                            } catch(e) {}
                        }`;
        content = content.replace(oldFallbackNav, newFallbackNav);
        console.log(`[${relPath}] Updated fallback navigation in Login controller`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Successfully updated: ${relPath}`);
    } else {
        console.log(`No changes needed for: ${relPath}`);
    }
});

console.log("\nScript execution finished.");
