const fs = require('fs');

console.log('=== Step 1: Fixing View XML (Widths & Requester Item) ===');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) return;
  let content = fs.readFileSync(vf, 'utf8');

  // Restore the proper simple clean widths
  content = content.replace(
    '<!-- LEFT CARD: SERVICE (8) -->\n                            <VBox width="48.5%"',
    '<!-- LEFT CARD: SERVICE (8) -->\n                            <VBox width="43%"'
  );
  content = content.replace(
    '<!-- RIGHT CARD: SERVICE DETAILS - SYSTEM ADMINISTRATOR -->\n                            <VBox width="49.5%"',
    '<!-- RIGHT CARD: SERVICE DETAILS - SYSTEM ADMINISTRATOR -->\n                            <VBox width="55.5%"'
  );

  content = content.replace(
    '<VBox width="42%" class="kyraAdminClassificationsSubPanel"',
    '<VBox width="43%" class="kyraAdminClassificationsSubPanel"'
  );
  content = content.replace(
    '<VBox width="56%" class="kyraAdminClassDetailSubPanel"',
    '<VBox width="55%" class="kyraAdminClassDetailSubPanel"'
  );

  // Ensure adminUserPersonaSelect has Requester, Approver, Compliance Reviewer
  const userSelectRegex = /<Select\s+id="adminUserPersonaSelect"[\s\S]*?<\/Select>/;
  if (userSelectRegex.test(content)) {
    content = content.replace(userSelectRegex, `<Select
                                                id="adminUserPersonaSelect"
                                                selectedKey="{accessModel>/personaLookupUser/selectedPersona}"
                                                change=".onAdminPersonaDropdownChange"
                                                width="100%"
                                                class="kyraAdminBuilderSelect kyraDeptSelect">
                                                <core:Item key="Requester" text="Requester" />
                                                <core:Item key="Approver" text="Approver" />
                                                <core:Item key="Compliance Reviewer" text="Compliance Reviewer" />
                                            </Select>`);
    console.log(`[${vf}] Ensured Requester in adminUserPersonaSelect!`);
  }

  fs.writeFileSync(vf, content, 'utf8');
  console.log(`[SAVED] ${vf}`);
});

console.log('\n=== Step 2: Fixing Controller (Dynamically Ensure Requester in Dropdown) ===');

const controllerFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'dist/pages/access/AccessPage.controller.js'
];

controllerFiles.forEach(cf => {
  if (!fs.existsSync(cf)) return;
  let code = fs.readFileSync(cf, 'utf8');

  // In onLookupEmployeePersona, when syncing the dropdown:
  const syncOld = `// Sync the dropdown selected key
                    const oSelectCtrl = this.byId("adminUserPersonaSelect");
                    if (oSelectCtrl && typeof oSelectCtrl.setSelectedKey === "function") {
                        oSelectCtrl.setSelectedKey(sNormalizedPersona);
                    }`;

  const syncNew = `// Sync the dropdown selected key and guarantee Requester is always in the items list
                    const oSelectCtrl = this.byId("adminUserPersonaSelect");
                    if (oSelectCtrl) {
                        const aCurrentKeys = (oSelectCtrl.getItems() || []).map(item => item.getKey());
                        if (!aCurrentKeys.includes("Requester")) {
                            oSelectCtrl.insertItem(new sap.ui.core.Item({ key: "Requester", text: "Requester" }), 0);
                        }
                        if (!aCurrentKeys.includes("Approver")) {
                            oSelectCtrl.addItem(new sap.ui.core.Item({ key: "Approver", text: "Approver" }));
                        }
                        if (!aCurrentKeys.includes("Compliance Reviewer")) {
                            oSelectCtrl.addItem(new sap.ui.core.Item({ key: "Compliance Reviewer", text: "Compliance Reviewer" }));
                        }
                        if (typeof oSelectCtrl.setSelectedKey === "function") {
                            oSelectCtrl.setSelectedKey(sNormalizedPersona);
                        }
                    }`;

  if (code.includes(syncOld)) {
    code = code.replace(syncOld, syncNew);
    console.log(`[${cf}] Enhanced dropdown sync with Requester item guarantee!`);
  }

  // Also in fallback lookup sync:
  const fallbackSyncOld = `const oSelectCtrl = this.byId("adminUserPersonaSelect");
            if (oSelectCtrl && typeof oSelectCtrl.setSelectedKey === "function") {
                oSelectCtrl.setSelectedKey(sFallbackPersona);
            }`;

  const fallbackSyncNew = `const oSelectCtrl = this.byId("adminUserPersonaSelect");
            if (oSelectCtrl) {
                const aCurrentKeys = (oSelectCtrl.getItems() || []).map(item => item.getKey());
                if (!aCurrentKeys.includes("Requester")) {
                    oSelectCtrl.insertItem(new sap.ui.core.Item({ key: "Requester", text: "Requester" }), 0);
                }
                if (!aCurrentKeys.includes("Approver")) {
                    oSelectCtrl.addItem(new sap.ui.core.Item({ key: "Approver", text: "Approver" }));
                }
                if (!aCurrentKeys.includes("Compliance Reviewer")) {
                    oSelectCtrl.addItem(new sap.ui.core.Item({ key: "Compliance Reviewer", text: "Compliance Reviewer" }));
                }
                if (typeof oSelectCtrl.setSelectedKey === "function") {
                    oSelectCtrl.setSelectedKey(sFallbackPersona);
                }
            }`;

  if (code.includes(fallbackSyncOld)) {
    code = code.replace(fallbackSyncOld, fallbackSyncNew);
    console.log(`[${cf}] Enhanced fallback dropdown sync with Requester item guarantee!`);
  }

  fs.writeFileSync(cf, code, 'utf8');
  console.log(`[SAVED] ${cf}`);
});

console.log('\n=== Step 3: Fixing CSS to Prevent Text Wrapping Character-by-Character ===');

const fixCss = `
/* ========================================================================== */
/* FIX: PROPER SIMPLE PREVIOUS DESIGN (PREVENT VERTICAL LETTER-BY-LETTER WRAP) */
/* ========================================================================== */

/* Service & Service Details Cards: Clean Previous Simple Proportions */
.kyraAdminBottomSplitRow {
    display: flex !important;
    justify-content: space-between !important;
    align-items: stretch !important;
    width: 100% !important;
    gap: 16px !important;
}

/* Service Details Inner 2-Column Split: Clean Proportions */
.kyraAdminServiceDetailsSplitBox {
    display: flex !important;
    justify-content: space-between !important;
    align-items: stretch !important;
    width: 100% !important;
    gap: 16px !important;
}

.kyraAdminClassificationsSubPanel {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 18px 20px !important;
    box-sizing: border-box !important;
    min-width: 220px !important;
    overflow: visible !important;
}

.kyraAdminClassDetailSubPanel {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 18px 20px !important;
    box-sizing: border-box !important;
    min-width: 280px !important;
    overflow: visible !important;
}

/* Team Card Item: Clean horizontal layout */
.kyraAdminClassItemCard,
.sapMFlexBox.kyraAdminClassItemCard {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 9px !important;
    padding: 10px 14px !important;
    margin-bottom: 8px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraAdminClassItemCard:hover {
    border-color: #CBD5E1 !important;
    background: #F8FAFC !important;
}

.kyraAdminClassItemCard[data-selectedclass="true"],
.sapMFlexBox.kyraAdminClassItemCard[data-selectedclass="true"] {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.12) !important;
}

/* Inner Team Name Row: Prevent shrinking and letter wrapping */
.kyraAdminTeamNameBox,
.sapMFlexBox.kyraAdminTeamNameBox {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    gap: 8px !important;
    min-width: 0 !important;
}

.kyraAdminTeamLeftContent,
.sapMFlexBox.kyraAdminTeamLeftContent {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 8px !important;
    flex: 1 1 auto !important;
    min-width: 100px !important;
    max-width: none !important;
    overflow: visible !important;
}

/* Team Title Link: NEVER wrap character-by-character */
.kyraAdminClassItemLink.sapMLnk,
.kyraAdminClassItemLink {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #1E293B !important;
    text-decoration: none !important;
    line-height: 1.35 !important;
    white-space: normal !important;
    word-break: normal !important;
    overflow-wrap: break-word !important;
    display: block !important;
    flex: 1 1 auto !important;
    min-width: 90px !important;
}

.kyraAdminClassItemCard[data-selectedclass="true"] .kyraAdminClassItemLink {
    color: #0F172A !important;
    font-weight: 700 !important;
}

/* Team Status Pill: Keep on right side, never shrink */
.kyraAdminTeamStatusPill {
    flex-shrink: 0 !important;
    margin-left: auto !important;
    white-space: nowrap !important;
}
`;

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'dist/pages/access/style.css',
  'dist/css/style.css'
];

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace or append fixCss
  const marker = '/* FIX: PROPER SIMPLE PREVIOUS DESIGN (PREVENT VERTICAL LETTER-BY-LETTER WRAP) */';
  const existingIdx = content.indexOf(marker);

  if (existingIdx !== -1) {
    const topIdx = content.lastIndexOf('/* ==========================================================================', existingIdx);
    content = content.substring(0, topIdx !== -1 ? topIdx : existingIdx) + fixCss;
  } else {
    content += '\n\n' + fixCss;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[SAVED CSS] ${file}`);
});

console.log('\nAll fixes applied successfully!');
