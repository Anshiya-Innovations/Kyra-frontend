const fs = require("fs");

let ctrl = fs.readFileSync("webapp/pages/access/AccessPage.controller.js", "utf8");

function replaceExact(text, searchStr, replaceStr) {
    const isCRLF = text.includes("\r\n");
    const normText = text.replace(/\r\n/g, "\n");
    const normSearch = searchStr.replace(/\r\n/g, "\n");
    const normReplace = replaceStr.replace(/\r\n/g, "\n");
    if (!normText.includes(normSearch)) {
        throw new Error("Could not find search string:\n" + normSearch.substring(0, 80));
    }
    const result = normText.replace(normSearch, normReplace);
    return isCRLF ? result.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n") : result;
}

// Test 1: onAddAdminSubClassification body
const oldAddPersonaBody = `<div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_persona_name">PERSONA NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_persona_name" class="kyra-system-modal-input" placeholder="e.g. Lead Cloud Architect" autocomplete="off" />
                            </div>
                        </div>`;

const newAddPersonaBody = `<div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_persona_name">PERSONA NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_persona_name" class="kyra-system-modal-input" placeholder="e.g. Lead Cloud Architect" autocomplete="off" />
                            </div>

                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_persona_status">STATUS</label>
                                <select id="kyra_add_persona_status" class="kyra-system-modal-select">
                                    <option value="Active" selected>Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_persona_restricted">RESTRICTED</label>
                                <select id="kyra_add_persona_restricted" class="kyra-system-modal-select">
                                    <option value="Not restricted" selected>Not restricted</option>
                                    <option value="Restricted">Restricted</option>
                                </select>
                            </div>
                        </div>`;

ctrl = replaceExact(ctrl, oldAddPersonaBody, newAddPersonaBody);
console.log("Successfully replaced oldAddPersonaBody!");

// Test 2: onEditAdminSubClassification status var
const oldEditStatusVar = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;

const newEditStatusVar = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentRestricted = oPersona.restricted || oPersona.accessPrivilege || "Not restricted";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;

ctrl = replaceExact(ctrl, oldEditStatusVar, newEditStatusVar);
console.log("Successfully replaced oldEditStatusVar!");

// Test 3: onEditAdminSubClassification body
const oldEditPersonaBody = `<div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_persona_name">PERSONA NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_persona_name" class="kyra-system-modal-input" placeholder="Enter persona name" value="\${sOldName}" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_persona_status">STATUS</label>
                                <select id="kyra_edit_persona_status" class="kyra-system-modal-select">
                                    <option value="Active" \${sCurrentStatus === "Active" ? "selected" : ""}>Active</option>
                                    <option value="Inactive" \${sCurrentStatus === "Inactive" ? "selected" : ""}>Inactive</option>
                                </select>
                            </div>
                        </div>`;

const newEditPersonaBody = `<div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_persona_name">PERSONA NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_persona_name" class="kyra-system-modal-input" placeholder="Enter persona name" value="\${sOldName}" autocomplete="off" />
                            </div>
                            
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_persona_status">STATUS</label>
                                <select id="kyra_edit_persona_status" class="kyra-system-modal-select">
                                    <option value="Active" \${sCurrentStatus === "Active" ? "selected" : ""}>Active</option>
                                    <option value="Inactive" \${sCurrentStatus === "Inactive" ? "selected" : ""}>Inactive</option>
                                </select>
                            </div>

                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_persona_restricted">RESTRICTED</label>
                                <select id="kyra_edit_persona_restricted" class="kyra-system-modal-select">
                                    <option value="Not restricted" \${sCurrentRestricted === "Not restricted" ? "selected" : ""}>Not restricted</option>
                                    <option value="Restricted" \${sCurrentRestricted === "Restricted" ? "selected" : ""}>Restricted</option>
                                </select>
                            </div>
                        </div>`;

ctrl = replaceExact(ctrl, oldEditPersonaBody, newEditPersonaBody);
console.log("Successfully replaced oldEditPersonaBody!");

// Test 4: onEditAdminSubClassification submit
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

ctrl = replaceExact(ctrl, oldEditSubmit, newEditSubmit);
console.log("Successfully replaced oldEditSubmit!");

// Test 5: onAddAdminSubClassification submit
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

ctrl = replaceExact(ctrl, oldAddSubmit, newAddSubmit);
console.log("Successfully replaced oldAddSubmit!");
