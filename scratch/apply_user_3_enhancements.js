const fs = require("fs");

console.log("Starting apply_user_3_enhancements.js...");

function replaceExact(text, searchStr, replaceStr) {
    const isCRLF = text.includes("\r\n");
    const normText = text.replace(/\r\n/g, "\n");
    const normSearch = searchStr.replace(/\r\n/g, "\n");
    const normReplace = replaceStr.replace(/\r\n/g, "\n");
    if (!normText.includes(normSearch)) {
        throw new Error("Could not find search string:\n" + normSearch.substring(0, 100));
    }
    const result = normText.replace(normSearch, normReplace);
    return isCRLF ? result.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n") : result;
}

// =========================================================================
// 1. UPDATE CONTROLLER: Fix Edit Persona & Add Persona
// =========================================================================
const ctrlPath = "webapp/pages/access/AccessPage.controller.js";
let ctrl = fs.readFileSync(ctrlPath, "utf8");

// A. onEditAdminSubClassification: ensure sCurrentRestricted is defined
if (!ctrl.includes("const sCurrentRestricted = oPersona.restricted")) {
    const oldEditVars = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;
    const newEditVars = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentRestricted = oPersona.restricted || oPersona.accessPrivilege || "Not restricted";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;
    ctrl = replaceExact(ctrl, oldEditVars, newEditVars);
    console.log("Added sCurrentRestricted definition to onEditAdminSubClassification.");
}

// B. onEditAdminSubClassification: ensure submitBtn reads & saves restricted value
const oldEditSubmit = `const statusSelect = oDom.querySelector("#kyra_edit_persona_status");
                                const sNewStatus = statusSelect ? statusSelect.value : sCurrentStatus;

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).map(p =>
                                    p.name === sOldName ? Object.assign({}, p, { name: sNewName, status: sNewStatus }) : p
                                );`;

const newEditSubmit = `const statusSelect = oDom.querySelector("#kyra_edit_persona_status");
                                const sNewStatus = statusSelect ? statusSelect.value : sCurrentStatus;
                                const restrictedSelect = oDom.querySelector("#kyra_edit_persona_restricted");
                                const sNewRestricted = restrictedSelect ? restrictedSelect.value : "Not restricted";

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).map(p =>
                                    p.name === sOldName ? Object.assign({}, p, { name: sNewName, status: sNewStatus, restricted: sNewRestricted, accessPrivilege: sNewRestricted }) : p
                                );`;

if (ctrl.includes(oldEditSubmit.replace(/\r\n/g, "\n"))) {
    ctrl = replaceExact(ctrl, oldEditSubmit, newEditSubmit);
    console.log("Updated onEditAdminSubClassification submitBtn logic.");
}

// C. onAddAdminSubClassification: ensure submitBtn reads & saves restricted value
const oldAddSubmit = `const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).slice();
                                aSubs.push({
                                    name: sName,
                                    status: "Active",
                                    accessPrivilege: "Restricted"
                                });`;

const newAddSubmit = `const statusSelect = oDom.querySelector("#kyra_add_persona_status");
                                const sStatus = statusSelect ? statusSelect.value : "Active";
                                const restrictedSelect = oDom.querySelector("#kyra_add_persona_restricted");
                                const sRestricted = restrictedSelect ? restrictedSelect.value : "Not restricted";

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).slice();
                                aSubs.push({
                                    name: sName,
                                    status: sStatus,
                                    restricted: sRestricted,
                                    accessPrivilege: sRestricted
                                });`;

if (ctrl.includes(oldAddSubmit.replace(/\r\n/g, "\n"))) {
    ctrl = replaceExact(ctrl, oldAddSubmit, newAddSubmit);
    console.log("Updated onAddAdminSubClassification submitBtn logic.");
}

fs.writeFileSync(ctrlPath, ctrl, "utf8");
console.log("Master controller saved.");

// =========================================================================
// 2. UPDATE VIEW: Business Sectors & Functions Add buttons + Region & System tables
// =========================================================================
const viewPath = "webapp/pages/access/AccessPage.view.xml";
let view = fs.readFileSync(viewPath, "utf8");

// A. In Business Sectors Card: Add Business Sector button
const oldSectorBtn = `<Button
                                            text="+ Add Business Sector"
                                            press=".onAddAdminBusinessSector"
                                            type="Emphasized"
                                            class="kyraAdminAddEntityBtn" />`;

const newSectorBtn = `<Button
                                            text="Add Business Sector"
                                            icon="sap-icon://add"
                                            press=".onAddAdminBusinessSector"
                                            type="Emphasized"
                                            class="kyraAdminAddBlueBtn" />`;

if (view.includes(oldSectorBtn.replace(/\r\n/g, "\n"))) {
    view = replaceExact(view, oldSectorBtn, newSectorBtn);
    console.log("Updated Add Business Sector button to kyraAdminAddBlueBtn.");
}

// B. In Business Function Details: Add Business Function button + close button
const oldFuncBtnBlock = `<HBox alignItems="Center">
                                        <Button
                                            text="+ Add Business Function"
                                            press=".onAddAdminBusinessFunction"
                                            type="Emphasized"
                                            class="kyraAdminAddEntityBtn" />
                                        <Button icon="sap-icon://decline" type="Transparent" press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn sapUiTinyMarginBegin" />
                                    </HBox>`;

const newFuncBtnBlock = `<HBox alignItems="Center" class="kyraAdminHeaderActions">
                                        <Button
                                            text="Add Business Function"
                                            icon="sap-icon://add"
                                            press=".onAddAdminBusinessFunction"
                                            type="Emphasized"
                                            class="kyraAdminAddBlueBtn" />
                                        <Button icon="sap-icon://decline" type="Transparent" press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn sapUiTinyMarginBegin" />
                                    </HBox>`;

if (view.includes(oldFuncBtnBlock.replace(/\r\n/g, "\n"))) {
    view = replaceExact(view, oldFuncBtnBlock, newFuncBtnBlock);
    console.log("Updated Add Business Function button block.");
}

// C. In Region Table: replace whole Region section with new_region_section.xml
const normView = view.replace(/\r\n/g, "\n");
const regStartMarker = '<!-- NEW SECTION: REGION FULL-WIDTH TABLE';
const regEndMarker = '<!-- 1. TOP FULL-WIDTH CARD: SYSTEM (6) -->';

const regIdx1 = normView.indexOf(regStartMarker);
const regIdx2 = normView.indexOf(regEndMarker);

if (regIdx1 !== -1 && regIdx2 !== -1) {
    const newRegXml = fs.readFileSync("scratch/new_region_section.xml", "utf8").replace(/\r\n/g, "\n");
    const replacedNorm = normView.substring(0, regIdx1) +
        "<!-- NEW SECTION: REGION FULL-WIDTH TABLE (Image 3)                 -->\n                        " +
        newRegXml + "\n\n                        " +
        normView.substring(regIdx2);
    view = view.includes("\r\n") ? replacedNorm.replace(/\n/g, "\r\n") : replacedNorm;
    console.log("Replaced Region section with clean layout (no search, no add, no delete, 3 columns).");
}

// D. In System Table: replace whole System section with new_system_section.xml
const normView2 = view.replace(/\r\n/g, "\n");
const sysStartMarker = '<!-- 1. TOP FULL-WIDTH CARD: SYSTEM (6) -->';
const sysEndMarker = '<!-- 2. MIDDLE SECTION: SPLIT CARDS (Service Table on Left & Service Details on Right) -->';

const sysIdx1 = normView2.indexOf(sysStartMarker);
const sysIdx2 = normView2.indexOf(sysEndMarker);

if (sysIdx1 !== -1 && sysIdx2 !== -1) {
    const newSysXml = fs.readFileSync("scratch/new_system_section.xml", "utf8").replace(/\r\n/g, "\n");
    const replacedNorm2 = normView2.substring(0, sysIdx1) +
        "<!-- 1. TOP FULL-WIDTH CARD: SYSTEM (6) -->\n                        " +
        newSysXml + "\n\n                        " +
        normView2.substring(sysIdx2);
    view = view.includes("\r\n") ? replacedNorm2.replace(/\n/g, "\r\n") : replacedNorm2;
    console.log("Replaced System section with clean layout (no search, no add, no delete, 3 columns).");
}

fs.writeFileSync(viewPath, view, "utf8");
console.log("Master view saved.");

// =========================================================================
// 3. SYNCHRONIZE MASTER CONTROLLER AND VIEW ACROSS ALL DUPLICATES
// =========================================================================
const ctrlCopies = [
  'webapp/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/User Access Management Portal page/AccessPage.controller.js'
];

for (const p of ctrlCopies) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, ctrl, "utf8");
    console.log("Synced controller to:", p);
  }
}

const viewCopies = [
  'webapp/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml'
];

for (const p of viewCopies) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, view, "utf8");
    console.log("Synced view to:", p);
  }
}

console.log("ALL ENHANCEMENTS APPLIED AND SYNCHRONIZED SUCCESSFULLY!");
