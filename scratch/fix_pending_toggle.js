const fs = require("fs");
const path = require("path");

// 1. Update views
const viewFiles = [
    "webapp/pages/access/AccessPage.view.xml",
    "webapp/AccessPage.view.xml",
    "webapp/page component/User Access Management Portal page/AccessPage.view.xml",
    "webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml"
];

const oldVisibleStr = 'visible="{= !!${accessModel>/showApproverSection} &amp;&amp; !${accessModel>/showAddAccessSector} &amp;&amp; !${accessModel>/showRemoveAccessSector} &amp;&amp; !${accessModel>/showRequestDetailsPage} }"';
const newVisibleStr = 'visible="{= !!${accessModel>/showApproverSection} &amp;&amp; !${accessModel>/showPendingSection} &amp;&amp; !${accessModel>/showAddAccessSector} &amp;&amp; !${accessModel>/showRemoveAccessSector} &amp;&amp; !${accessModel>/showRequestDetailsPage} }"';

viewFiles.forEach(relPath => {
    const fullPath = path.resolve(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, "utf8");
    if (content.includes(oldVisibleStr)) {
        content = content.replace(oldVisibleStr, newVisibleStr);
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Updated approverSectionView visibility in:", relPath);
    } else {
        console.log("String not found in:", relPath);
    }
});

// 2. Update controllers: remove if (bIsApprover) from onNavToPendingRequests
const controllerFiles = [
    "webapp/pages/access/AccessPage.controller.js",
    "webapp/AccessPage.controller.js",
    "webapp/page component/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/page request/User Access Management Portal.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/AccessPage.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js"
];

controllerFiles.forEach(relPath => {
    const fullPath = path.resolve(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, "utf8");

    // Pattern matching onNavToPendingRequests with if (bIsApprover)
    const badApproverBlockRegex = /onNavToPendingRequests\(\)\s*\{\s*this\._confirmDiscardAddAccess\(\(\)\s*=>\s*\{\s*const\s+oModel\s*=\s*this\.getView\(\)\.getModel\("accessModel"\);\s*if\s*\(oModel\)\s*\{\s*const\s+bIsApprover[\s\S]*?return;\s*\}\s*const\s+bCurr\s*=\s*!!oModel\.getProperty\("\/showPendingSection"\);/;

    if (badApproverBlockRegex.test(content)) {
        const cleanReplacement = `onNavToPendingRequests() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    const bCurr = !!oModel.getProperty("/showPendingSection");`;
        content = content.replace(badApproverBlockRegex, cleanReplacement);
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Cleaned onNavToPendingRequests in:", relPath);
    } else {
        console.log("Pattern not matched in:", relPath);
    }
});

console.log("Pending toggle fix script completed.");
