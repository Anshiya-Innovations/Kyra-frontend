const fs = require("fs");
const path = require("path");

console.log("Starting safe apply_full_admin_update.js with CRLF-aware replacement...");

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
// 1. UPDATE AccessPage.controller.js
// =========================================================================
const ctrlPath = "webapp/pages/access/AccessPage.controller.js";
let ctrl = fs.readFileSync(ctrlPath, "utf8");

// --- Part A: Add Model Data (adminBusinessSectorsAll, adminRegionsAll, etc.) ---
if (!ctrl.includes("adminBusinessSectorsAll:")) {
  const modelAnchor = "adminSystems: [";
  const modelAddition = `adminBusinessSectorsAll: [
                    { sectorName: "Technology", status: "Active", selected: false },
                    { sectorName: "Finance", status: "Active", selected: true },
                    { sectorName: "Operations", status: "Active", selected: false }
                ],
                adminBusinessSectors: [
                    { sectorName: "Technology", status: "Active", selected: false },
                    { sectorName: "Finance", status: "Active", selected: true },
                    { sectorName: "Operations", status: "Active", selected: false }
                ],
                selectedAdminBusinessSectorName: "Finance",
                adminBusinessFunctions: [
                    { name: "Financial Planning & Analysis" },
                    { name: "Accounts Payable" },
                    { name: "Accounts Receivable" },
                    { name: "Treasury Management" }
                ],
                adminBusinessFunctionsMap: {
                    "Technology": [
                        { name: "Cloud Infrastructure" },
                        { name: "Application Architecture" },
                        { name: "Data Engineering" },
                        { name: "Security & Compliance" }
                    ],
                    "Finance": [
                        { name: "Financial Planning & Analysis" },
                        { name: "Accounts Payable" },
                        { name: "Accounts Receivable" },
                        { name: "Treasury Management" }
                    ],
                    "Operations": [
                        { name: "Supply Chain Logistics" },
                        { name: "Facilities Management" },
                        { name: "Procurement & Sourcing" }
                    ]
                },
                adminRegionsAll: [
                    { regionName: "APAC", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "EMEA", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "Americas", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "LATAM", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "US-East", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "US-West", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "EU-Central", status: "Active", creationDate: "2025-01-15" }
                ],
                adminRegions: [
                    { regionName: "APAC", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "EMEA", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "Americas", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "LATAM", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "US-East", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "US-West", status: "Active", creationDate: "2025-01-15" },
                    { regionName: "EU-Central", status: "Active", creationDate: "2025-01-15" }
                ],
                `;
  ctrl = replaceExact(ctrl, modelAnchor, modelAddition + modelAnchor);
  console.log("Added model data for sectors and regions.");
}

// --- Part B: onAddAdminSubClassification Modal & Submit Logic ---
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

if (!ctrl.includes("kyra_add_persona_restricted")) {
  ctrl = replaceExact(ctrl, oldAddPersonaBody, newAddPersonaBody);
  console.log("Replaced onAddAdminSubClassification modal body with STATUS & RESTRICTED.");
}

// Ensure afterOpen in onAddAdminSubClassification calls _enhanceModalDropdowns
const oldAddAfterOpen = `afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;

                        const closeFn = () => oDialog.close();`;

const newAddAfterOpen = `afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        that._enhanceModalDropdowns(oDom);

                        const closeFn = () => oDialog.close();`;

if (ctrl.includes(oldAddAfterOpen)) {
  ctrl = replaceExact(ctrl, oldAddAfterOpen, newAddAfterOpen);
  console.log("Added _enhanceModalDropdowns to onAddAdminSubClassification afterOpen.");
}

// Update submit handler in onAddAdminSubClassification
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

if (ctrl.includes(oldAddSubmit)) {
  ctrl = replaceExact(ctrl, oldAddSubmit, newAddSubmit);
  console.log("Updated onAddAdminSubClassification submit logic.");
}

// --- Part C: onEditAdminSubClassification Modal & Submit Logic ---
// 1. Read sCurrentRestricted before dialog
const oldEditStatusVar = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;

const newEditStatusVar = `const sCurrentStatus = oPersona.status || "Active";
            const sCurrentRestricted = oPersona.restricted || oPersona.accessPrivilege || "Not restricted";
            const sCurrentTeam = oModel.getProperty("/selectedAdminClassification/name") || "IT Developers";`;

if (ctrl.includes(oldEditStatusVar)) {
  ctrl = replaceExact(ctrl, oldEditStatusVar, newEditStatusVar);
  console.log("Added sCurrentRestricted variable to onEditAdminSubClassification.");
}

// 2. Modal Body for Edit Persona
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

if (!ctrl.includes("kyra_edit_persona_restricted")) {
  ctrl = replaceExact(ctrl, oldEditPersonaBody, newEditPersonaBody);
  console.log("Updated onEditAdminSubClassification modal body with RESTRICTED dropdown.");
}

// 3. Edit Persona Submit logic
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

if (ctrl.includes(oldEditSubmit)) {
  ctrl = replaceExact(ctrl, oldEditSubmit, newEditSubmit);
  console.log("Updated onEditAdminSubClassification submit logic with restricted field.");
}

// --- Part D: Add Handlers for Business Sectors, Functions, and Regions ---
if (!ctrl.includes("onSearchAdminBusinessSectors")) {
  const handlerAnchor = "// ── Custom Conflict Section Handlers ──";
  const newHandlersCode = `
        // =========================================================================
        // BUSINESS SECTORS & BUSINESS FUNCTIONS MANAGEMENT (Image 2)
        // =========================================================================
        onSearchAdminBusinessSectors(oEvent) {
            const sQuery = (oEvent.getParameter("newValue") || oEvent.getParameter("query") || "").toLowerCase().trim();
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const aAll = oModel.getProperty("/adminBusinessSectorsAll") || oModel.getProperty("/adminBusinessSectors") || [];
            if (!sQuery) {
                oModel.setProperty("/adminBusinessSectors", aAll.slice());
            } else {
                oModel.setProperty("/adminBusinessSectors", aAll.filter(s => (s.sectorName || "").toLowerCase().includes(sQuery)));
            }
        },

        onSelectAdminBusinessSectorRow(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const oCtx = oEvent.getSource().getBindingContext("accessModel");
            if (!oModel || !oCtx) return;
            const oObj = oCtx.getObject();
            if (!oObj) return;

            const sSectorName = oObj.sectorName;
            const aSectors = (oModel.getProperty("/adminBusinessSectors") || []).map(s => {
                return Object.assign({}, s, { selected: s.sectorName === sSectorName });
            });
            oModel.setProperty("/adminBusinessSectors", aSectors);
            const aAll = (oModel.getProperty("/adminBusinessSectorsAll") || []).map(s => {
                return Object.assign({}, s, { selected: s.sectorName === sSectorName });
            });
            oModel.setProperty("/adminBusinessSectorsAll", aAll);
            oModel.setProperty("/selectedAdminBusinessSectorName", sSectorName);

            const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
            const aFuncs = oMap[sSectorName] || [
                { name: "General Administration" },
                { name: "Operations Oversight" }
            ];
            oModel.setProperty("/adminBusinessFunctions", aFuncs);
        },

        onAddAdminBusinessSector() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const that = this;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Add Business Sector</div>
                                    <div class="kyra-system-modal-subtitle">Define enterprise business sector</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_sector_name">BUSINESS SECTOR NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_sector_name" class="kyra-system-modal-input" placeholder="e.g. Technology, Finance, Operations" autocomplete="off" />
                            </div>
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_sector_status">STATUS</label>
                                <select id="kyra_add_sector_status" class="kyra-system-modal-select">
                                    <option value="Active" selected>Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Add Business Sector</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [new HTML({ content: sHtmlContent, preferDOM: false })],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        that._enhanceModalDropdowns(oDom);
                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_add_sector_name");
                        if (nameInput) nameInput.focus();

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sName = (nameInput ? nameInput.value : "").trim();
                                if (!sName) {
                                    if (nameInput) nameInput.style.borderColor = "#EF4444";
                                    MessageToast.show("Please enter a Sector name.");
                                    return;
                                }
                                const statusSelect = oDom.querySelector("#kyra_add_sector_status");
                                const sStatus = statusSelect ? statusSelect.value : "Active";

                                const aAll = (oModel.getProperty("/adminBusinessSectorsAll") || []).slice();
                                aAll.push({ sectorName: sName, status: sStatus, selected: false });
                                oModel.setProperty("/adminBusinessSectorsAll", aAll);
                                oModel.setProperty("/adminBusinessSectors", aAll.slice());

                                const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
                                oMap[sName] = [];
                                oModel.setProperty("/adminBusinessFunctionsMap", oMap);

                                that._showSlideNotification("Business Sector Added", "Sector '" + sName + "' created.");
                                MessageToast.show("Sector '" + sName + "' added successfully.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onEditAdminBusinessSector(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oCtx = oEvent && oEvent.getSource ? oEvent.getSource().getBindingContext("accessModel") : null;
            if (!oCtx) return;
            const oSector = oCtx.getObject();
            if (!oSector) return;

            const that = this;
            const sOldName = oSector.sectorName;
            const sCurrentStatus = oSector.status || "Active";

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Edit Business Sector</div>
                                    <div class="kyra-system-modal-subtitle">Modify business sector parameters</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_sector_name">BUSINESS SECTOR NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_sector_name" class="kyra-system-modal-input" value="\${sOldName}" autocomplete="off" />
                            </div>
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_sector_status">STATUS</label>
                                <select id="kyra_edit_sector_status" class="kyra-system-modal-select">
                                    <option value="Active" \${sCurrentStatus === "Active" ? "selected" : ""}>Active</option>
                                    <option value="Inactive" \${sCurrentStatus === "Inactive" ? "selected" : ""}>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Save Changes</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [new HTML({ content: sHtmlContent, preferDOM: false })],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        that._enhanceModalDropdowns(oDom);
                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_edit_sector_name");
                        if (nameInput) { nameInput.focus(); nameInput.select(); }

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sNewName = (nameInput ? nameInput.value : "").trim();
                                if (!sNewName) {
                                    if (nameInput) nameInput.style.borderColor = "#EF4444";
                                    MessageToast.show("Sector name cannot be empty.");
                                    return;
                                }
                                const statusSelect = oDom.querySelector("#kyra_edit_sector_status");
                                const sNewStatus = statusSelect ? statusSelect.value : sCurrentStatus;

                                const aAll = (oModel.getProperty("/adminBusinessSectorsAll") || []).map(s => {
                                    return s.sectorName === sOldName ? Object.assign({}, s, { sectorName: sNewName, status: sNewStatus }) : s;
                                });
                                oModel.setProperty("/adminBusinessSectorsAll", aAll);
                                const aCur = (oModel.getProperty("/adminBusinessSectors") || []).map(s => {
                                    return s.sectorName === sOldName ? Object.assign({}, s, { sectorName: sNewName, status: sNewStatus }) : s;
                                });
                                oModel.setProperty("/adminBusinessSectors", aCur);

                                if (oModel.getProperty("/selectedAdminBusinessSectorName") === sOldName) {
                                    oModel.setProperty("/selectedAdminBusinessSectorName", sNewName);
                                    const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
                                    if (oMap[sOldName] && sOldName !== sNewName) {
                                        oMap[sNewName] = oMap[sOldName];
                                        delete oMap[sOldName];
                                        oModel.setProperty("/adminBusinessFunctionsMap", oMap);
                                    }
                                }

                                that._showSlideNotification("Business Sector Updated", "Sector '" + sNewName + "' updated.");
                                MessageToast.show("Sector '" + sNewName + "' updated successfully.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onDeleteAdminBusinessSector(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oCtx = oEvent && oEvent.getSource ? oEvent.getSource().getBindingContext("accessModel") : null;
            if (!oCtx) return;
            const oSector = oCtx.getObject();
            if (!oSector) return;
            const sSectorName = oSector.sectorName;
            const that = this;

            this._confirmDelete("Delete Business Sector", sSectorName, "Business Sector", () => {
                const aAll = (oModel.getProperty("/adminBusinessSectorsAll") || []).filter(s => s.sectorName !== sSectorName);
                oModel.setProperty("/adminBusinessSectorsAll", aAll);
                const aCur = (oModel.getProperty("/adminBusinessSectors") || []).filter(s => s.sectorName !== sSectorName);
                oModel.setProperty("/adminBusinessSectors", aCur);

                const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
                delete oMap[sSectorName];
                oModel.setProperty("/adminBusinessFunctionsMap", oMap);

                if (oModel.getProperty("/selectedAdminBusinessSectorName") === sSectorName) {
                    if (aCur.length > 0) {
                        aCur[0].selected = true;
                        oModel.setProperty("/selectedAdminBusinessSectorName", aCur[0].sectorName);
                        oModel.setProperty("/adminBusinessFunctions", oMap[aCur[0].sectorName] || []);
                    } else {
                        oModel.setProperty("/selectedAdminBusinessSectorName", "");
                        oModel.setProperty("/adminBusinessFunctions", []);
                    }
                }

                that._showSlideNotification("Sector Deleted", "Sector '" + sSectorName + "' removed.", "delete");
                sap.m.MessageToast.show("Sector '" + sSectorName + "' deleted.");
            });
        },

        onAddAdminBusinessFunction() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrentSector = oModel.getProperty("/selectedAdminBusinessSectorName") || "Finance";
            const that = this;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Add Business Function</div>
                                    <div class="kyra-system-modal-subtitle">Add function under \${sCurrentSector}</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_func_name">BUSINESS FUNCTION NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_func_name" class="kyra-system-modal-input" placeholder="e.g. Treasury Operations, Billing" autocomplete="off" />
                            </div>
                        </div>
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Add Business Function</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [new HTML({ content: sHtmlContent, preferDOM: false })],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_add_func_name");
                        if (nameInput) nameInput.focus();

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sName = (nameInput ? nameInput.value : "").trim();
                                if (!sName) {
                                    if (nameInput) nameInput.style.borderColor = "#EF4444";
                                    MessageToast.show("Please enter a Function name.");
                                    return;
                                }

                                const aFuncs = (oModel.getProperty("/adminBusinessFunctions") || []).slice();
                                aFuncs.push({ name: sName });
                                oModel.setProperty("/adminBusinessFunctions", aFuncs);

                                const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
                                oMap[sCurrentSector] = aFuncs;
                                oModel.setProperty("/adminBusinessFunctionsMap", oMap);

                                that._showSlideNotification("Function Added", "Function '" + sName + "' added under " + sCurrentSector);
                                MessageToast.show("Function '" + sName + "' added.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onEditAdminBusinessFunction(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oCtx = oEvent && oEvent.getSource ? oEvent.getSource().getBindingContext("accessModel") : null;
            if (!oCtx) return;
            const oFunc = oCtx.getObject();
            if (!oFunc) return;
            const sOldName = oFunc.name;
            const sCurrentSector = oModel.getProperty("/selectedAdminBusinessSectorName") || "Finance";
            const that = this;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Edit Business Function</div>
                                    <div class="kyra-system-modal-subtitle">Modify function name</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_func_name">BUSINESS FUNCTION NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_func_name" class="kyra-system-modal-input" value="\${sOldName}" autocomplete="off" />
                            </div>
                        </div>
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Save Changes</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [new HTML({ content: sHtmlContent, preferDOM: false })],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_edit_func_name");
                        if (nameInput) { nameInput.focus(); nameInput.select(); }

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sNewName = (nameInput ? nameInput.value : "").trim();
                                if (!sNewName) {
                                    if (nameInput) nameInput.style.borderColor = "#EF4444";
                                    MessageToast.show("Function name cannot be empty.");
                                    return;
                                }

                                const aFuncs = (oModel.getProperty("/adminBusinessFunctions") || []).map(f => {
                                    return f.name === sOldName ? { name: sNewName } : f;
                                });
                                oModel.setProperty("/adminBusinessFunctions", aFuncs);

                                const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
                                oMap[sCurrentSector] = aFuncs;
                                oModel.setProperty("/adminBusinessFunctionsMap", oMap);

                                that._showSlideNotification("Function Updated", "Function updated to '" + sNewName + "'");
                                MessageToast.show("Function updated.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onDeleteAdminBusinessFunction(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oCtx = oEvent && oEvent.getSource ? oEvent.getSource().getBindingContext("accessModel") : null;
            if (!oCtx) return;
            const oFunc = oCtx.getObject();
            if (!oFunc) return;
            const sName = oFunc.name;
            const sCurrentSector = oModel.getProperty("/selectedAdminBusinessSectorName") || "Finance";
            const that = this;

            this._confirmDelete("Delete Business Function", sName, "Business Function", () => {
                const aFuncs = (oModel.getProperty("/adminBusinessFunctions") || []).filter(f => f.name !== sName);
                oModel.setProperty("/adminBusinessFunctions", aFuncs);

                const oMap = oModel.getProperty("/adminBusinessFunctionsMap") || {};
                oMap[sCurrentSector] = aFuncs;
                oModel.setProperty("/adminBusinessFunctionsMap", oMap);

                that._showSlideNotification("Function Deleted", "Function '" + sName + "' removed.", "delete");
                sap.m.MessageToast.show("Function deleted.");
            });
        },

        // =========================================================================
        // REGION MANAGEMENT (Image 3)
        // =========================================================================
        onSearchAdminRegions(oEvent) {
            const sQuery = (oEvent.getParameter("newValue") || oEvent.getParameter("query") || "").toLowerCase().trim();
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const aAll = oModel.getProperty("/adminRegionsAll") || oModel.getProperty("/adminRegions") || [];
            if (!sQuery) {
                oModel.setProperty("/adminRegions", aAll.slice());
            } else {
                oModel.setProperty("/adminRegions", aAll.filter(r => (r.regionName || "").toLowerCase().includes(sQuery)));
            }
        },

        onAddAdminRegion() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const that = this;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Add Region</div>
                                    <div class="kyra-system-modal-subtitle">Define operational global region</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_region_name">REGION NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_add_region_name" class="kyra-system-modal-input" placeholder="e.g. APAC, EMEA, Americas" autocomplete="off" />
                            </div>
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_add_region_status">STATUS</label>
                                <select id="kyra_add_region_status" class="kyra-system-modal-select">
                                    <option value="Active" selected>Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Add Region</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [new HTML({ content: sHtmlContent, preferDOM: false })],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        that._enhanceModalDropdowns(oDom);
                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_add_region_name");
                        if (nameInput) nameInput.focus();

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sName = (nameInput ? nameInput.value : "").trim();
                                if (!sName) {
                                    if (nameInput) nameInput.style.borderColor = "#EF4444";
                                    MessageToast.show("Please enter a Region name.");
                                    return;
                                }
                                const statusSelect = oDom.querySelector("#kyra_add_region_status");
                                const sStatus = statusSelect ? statusSelect.value : "Active";
                                const sDate = new Date().toISOString().split("T")[0];

                                const aAll = (oModel.getProperty("/adminRegionsAll") || []).slice();
                                aAll.push({ regionName: sName, status: sStatus, creationDate: sDate });
                                oModel.setProperty("/adminRegionsAll", aAll);
                                oModel.setProperty("/adminRegions", aAll.slice());

                                that._showSlideNotification("Region Added", "Region '" + sName + "' created.");
                                MessageToast.show("Region '" + sName + "' added successfully.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onEditAdminRegion(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oCtx = oEvent && oEvent.getSource ? oEvent.getSource().getBindingContext("accessModel") : null;
            if (!oCtx) return;
            const oReg = oCtx.getObject();
            if (!oReg) return;
            const sOldName = oReg.regionName;
            const sCurrentStatus = oReg.status || "Active";
            const that = this;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlContent = \`
                    <div class="kyra-system-modal-card">
                        <div class="kyra-system-modal-header">
                            <div class="kyra-system-modal-header-left">
                                <div class="kyra-system-modal-icon-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008C9C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="kyra-system-modal-title">Edit Region</div>
                                    <div class="kyra-system-modal-subtitle">Modify region parameters</div>
                                </div>
                            </div>
                            <button type="button" class="kyra-system-modal-close-x kyra-modal-close-btn" title="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="kyra-system-modal-body">
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_region_name">REGION NAME <span style="color:#EF4444">*</span></label>
                                <input type="text" id="kyra_edit_region_name" class="kyra-system-modal-input" value="\${sOldName}" autocomplete="off" />
                            </div>
                            <div class="kyra-system-modal-form-group">
                                <label class="kyra-system-modal-label" for="kyra_edit_region_status">STATUS</label>
                                <select id="kyra_edit_region_status" class="kyra-system-modal-select">
                                    <option value="Active" \${sCurrentStatus === "Active" ? "selected" : ""}>Active</option>
                                    <option value="Inactive" \${sCurrentStatus === "Inactive" ? "selected" : ""}>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="kyra-system-modal-footer">
                            <button type="button" class="kyra-system-modal-cancel-btn kyra-modal-cancel-btn">Cancel</button>
                            <button type="button" class="kyra-system-modal-submit-btn kyra-modal-submit-btn">Save Changes</button>
                        </div>
                    </div>
                \`;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [new HTML({ content: sHtmlContent, preferDOM: false })],
                    afterOpen: () => {
                        const oDom = oDialog.getDomRef();
                        if (!oDom) return;
                        that._enhanceModalDropdowns(oDom);
                        const closeFn = () => oDialog.close();
                        const closeX = oDom.querySelector(".kyra-modal-close-btn");
                        if (closeX) closeX.onclick = closeFn;
                        const cancelBtn = oDom.querySelector(".kyra-modal-cancel-btn");
                        if (cancelBtn) cancelBtn.onclick = closeFn;

                        const nameInput = oDom.querySelector("#kyra_edit_region_name");
                        if (nameInput) { nameInput.focus(); nameInput.select(); }

                        const submitBtn = oDom.querySelector(".kyra-modal-submit-btn");
                        if (submitBtn) {
                            submitBtn.onclick = () => {
                                const sNewName = (nameInput ? nameInput.value : "").trim();
                                if (!sNewName) {
                                    if (nameInput) nameInput.style.borderColor = "#EF4444";
                                    MessageToast.show("Region name cannot be empty.");
                                    return;
                                }
                                const statusSelect = oDom.querySelector("#kyra_edit_region_status");
                                const sNewStatus = statusSelect ? statusSelect.value : sCurrentStatus;

                                const aAll = (oModel.getProperty("/adminRegionsAll") || []).map(r => {
                                    return r.regionName === sOldName ? Object.assign({}, r, { regionName: sNewName, status: sNewStatus }) : r;
                                });
                                oModel.setProperty("/adminRegionsAll", aAll);
                                const aCur = (oModel.getProperty("/adminRegions") || []).map(r => {
                                    return r.regionName === sOldName ? Object.assign({}, r, { regionName: sNewName, status: sNewStatus }) : r;
                                });
                                oModel.setProperty("/adminRegions", aCur);

                                that._showSlideNotification("Region Updated", "Region '" + sNewName + "' updated.");
                                MessageToast.show("Region '" + sNewName + "' updated successfully.");
                                closeFn();
                            };
                        }
                    },
                    afterClose: () => oDialog.destroy()
                });

                oDialog.addStyleClass("kyraSystemModalDialog");
                that.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onDeleteAdminRegion(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const oCtx = oEvent && oEvent.getSource ? oEvent.getSource().getBindingContext("accessModel") : null;
            if (!oCtx) return;
            const oReg = oCtx.getObject();
            if (!oReg) return;
            const sName = oReg.regionName;
            const that = this;

            this._confirmDelete("Delete Region", sName, "Region", () => {
                const aAll = (oModel.getProperty("/adminRegionsAll") || []).filter(r => r.regionName !== sName);
                oModel.setProperty("/adminRegionsAll", aAll);
                const aCur = (oModel.getProperty("/adminRegions") || []).filter(r => r.regionName !== sName);
                oModel.setProperty("/adminRegions", aCur);

                that._showSlideNotification("Region Deleted", "Region '" + sName + "' removed.", "delete");
                sap.m.MessageToast.show("Region '" + sName + "' deleted.");
            });
        },
`;

  ctrl = replaceExact(ctrl, handlerAnchor, newHandlersCode + "\n        " + handlerAnchor);
  console.log("Added Business Sectors, Functions, and Region handlers to controller.");
}

// Write updated controller
fs.writeFileSync(ctrlPath, ctrl, "utf8");
console.log("Master controller saved successfully.");


// =========================================================================
// 2. UPDATE AccessPage.view.xml
// =========================================================================
const viewPath = "webapp/pages/access/AccessPage.view.xml";
let view = fs.readFileSync(viewPath, "utf8");

if (!view.includes("adminBusinessSectorsTable")) {
  const viewAnchor = "<!-- 3. BOTTOM FULL-WIDTH CARD: CUSTOM CONFLICT SECTION";
  const newSectionsXml = fs.readFileSync("scratch/new_sections.xml", "utf8");

  view = replaceExact(view, viewAnchor, newSectionsXml + "\n                        " + viewAnchor);
  fs.writeFileSync(viewPath, view, "utf8");
  console.log("Master view updated and saved successfully.");
}

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

// =========================================================================
// 4. ADD CSS STYLING
// =========================================================================
const cssSnippets = `
/* Business Sectors & Functions styles (Image 2) */
.kyraAdminBusinessFunctionItemCard {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    padding: 10px 14px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 8px !important;
    transition: all 0.2s ease !important;
}

.kyraAdminBusinessFunctionItemCard:hover {
    border-color: #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.08) !important;
}

.kyraAdminBusinessFunctionName {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #1E293B !important;
}

.kyraAdminSelectedRowHighlight {
    background-color: #E0F7FA !important;
    border-left: 3px solid #008C9C !important;
}

.kyraAdminSectorSelectedText {
    color: #008C9C !important;
    font-weight: 700 !important;
}

.kyraVectorTealDot {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background-color: #008C9C !important;
    display: inline-block !important;
    flex-shrink: 0 !important;
}
`;

const cssFiles = [
  'webapp/css/style.css',
  'webapp/pages/access/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/css/style.css'
];

for (const cf of cssFiles) {
  if (fs.existsSync(cf)) {
    let css = fs.readFileSync(cf, "utf8");
    if (!css.includes("kyraAdminBusinessFunctionItemCard")) {
      css += "\n" + cssSnippets;
      fs.writeFileSync(cf, css, "utf8");
      console.log("Appended CSS to:", cf);
    }
  }
}

console.log("Apply script completed successfully!");
