const fs = require("fs");

console.log("Starting finish_user_3_enhancements.js...");

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
// 1. UPDATE VIEW
// =========================================================================
const viewPath = "webapp/pages/access/AccessPage.view.xml";
let view = fs.readFileSync(viewPath, "utf8");

// A. In Business Sectors Card Header:
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

view = replaceExact(view, oldSectorBtn, newSectorBtn);
console.log("Updated Add Business Sector button to kyraAdminAddBlueBtn.");

// B. In Business Function Details Card Header:
const oldFuncBtnBlock = `<Button
                                            text="+ Add Business Function"
                                            press=".onAddAdminBusinessFunction"
                                            type="Emphasized"
                                            class="kyraAdminAddEntityBtn" />
                                        <Button icon="sap-icon://decline" type="Transparent" press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn sapUiTinyMarginBegin" />`;

const newFuncBtnBlock = `<Button
                                            text="Add Business Function"
                                            icon="sap-icon://add"
                                            press=".onAddAdminBusinessFunction"
                                            type="Emphasized"
                                            class="kyraAdminAddBlueBtn" />
                                        <Button icon="sap-icon://decline" type="Transparent" press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn sapUiTinyMarginBegin" />`;

view = replaceExact(view, oldFuncBtnBlock, newFuncBtnBlock);
console.log("Updated Add Business Function button to kyraAdminAddBlueBtn.");

// C. In System Card (Image 3): Clean layout without Search, Add button, Delete button, Threshold, or Created Date
const normView = view.replace(/\r\n/g, "\n");
const sysStartMarker = '<!-- 1. TOP FULL-WIDTH CARD: SYSTEM (6) -->';
const sysEndMarker = '<!-- 2. MIDDLE SECTION: SPLIT CARDS (Service Table on Left & Service Details on Right) -->';

const sysIdx1 = normView.indexOf(sysStartMarker);
const sysIdx2 = normView.indexOf(sysEndMarker);

if (sysIdx1 !== -1 && sysIdx2 !== -1) {
    const newSysXml = fs.readFileSync("scratch/new_system_section.xml", "utf8").replace(/\r\n/g, "\n");
    const replacedNorm = normView.substring(0, sysIdx1) +
        "<!-- 1. TOP FULL-WIDTH CARD: SYSTEM (6) -->\n                        " +
        newSysXml + "\n\n                        " +
        normView.substring(sysIdx2);
    view = view.includes("\r\n") ? replacedNorm.replace(/\n/g, "\r\n") : replacedNorm;
    console.log("Replaced System section (Image 3) with clean layout (no search, no add, no delete, 3 columns).");
}

fs.writeFileSync(viewPath, view, "utf8");
console.log("Master view saved.");

// =========================================================================
// 2. CONTROLLER VERIFICATION & PERSISTENCE
// =========================================================================
const ctrlPath = "webapp/pages/access/AccessPage.controller.js";
let ctrl = fs.readFileSync(ctrlPath, "utf8");

// Ensure onEditAdminSubClassification has sCurrentRestricted
if (!ctrl.includes("const sCurrentRestricted = oPersona.restricted")) {
    const oldEditVars = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;
    const newEditVars = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentRestricted = oPersona.restricted || oPersona.accessPrivilege || "Not restricted";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;
    ctrl = replaceExact(ctrl, oldEditVars, newEditVars);
    console.log("Added sCurrentRestricted to controller.");
}

// Ensure onEditAdminSubClassification submitBtn saves restricted
const oldEditSave = `const statusSelect = oDom.querySelector("#kyra_edit_persona_status");
                                const sNewStatus = statusSelect ? statusSelect.value : sCurrentStatus;

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).map(p =>
                                    p.name === sOldName ? Object.assign({}, p, { name: sNewName, status: sNewStatus }) : p
                                );`;

const newEditSave = `const statusSelect = oDom.querySelector("#kyra_edit_persona_status");
                                const sNewStatus = statusSelect ? statusSelect.value : sCurrentStatus;
                                const restrictedSelect = oDom.querySelector("#kyra_edit_persona_restricted");
                                const sNewRestricted = restrictedSelect ? restrictedSelect.value : "Not restricted";

                                const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).map(p =>
                                    p.name === sOldName ? Object.assign({}, p, { name: sNewName, status: sNewStatus, restricted: sNewRestricted, accessPrivilege: sNewRestricted }) : p
                                );`;

if (ctrl.includes(oldEditSave.replace(/\r\n/g, "\n"))) {
    ctrl = replaceExact(ctrl, oldEditSave, newEditSave);
    console.log("Updated onEditAdminSubClassification submitBtn save logic.");
}

// Ensure onAddAdminSubClassification submitBtn saves restricted
const oldAddSave = `const aSubs = (oModel.getProperty("/selectedAdminClassification/subClassifications") || []).slice();
                                aSubs.push({
                                    name: sName,
                                    status: "Active",
                                    accessPrivilege: "Restricted"
                                });`;

const newAddSave = `const statusSelect = oDom.querySelector("#kyra_add_persona_status");
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

if (ctrl.includes(oldAddSave.replace(/\r\n/g, "\n"))) {
    ctrl = replaceExact(ctrl, oldAddSave, newAddSave);
    console.log("Updated onAddAdminSubClassification submitBtn save logic.");
}

fs.writeFileSync(ctrlPath, ctrl, "utf8");
console.log("Master controller saved.");

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

console.log("COMPLETED ALL ENHANCEMENTS AND SYNCHRONIZED!");
