const fs = require('fs');

console.log('--- Step 1: Updating View XML files ---');

const replacementSnippet = `<!-- Right Sub-Panel: Team Name &amp; Persona (Matches media_1790767316133.png) -->
                                        <VBox width="54%" class="kyraAdminClassDetailSubPanel">
                                            <!-- TEAM NAME Header Label -->
                                            <HBox alignItems="Center" class="kyraAdminFieldLabelRow">
                                                <Text text="TEAM NAME" class="kyraAdminFormLabel" />
                                                <Text text="*" class="kyraAdminRequiredStar" />
                                            </HBox>

                                            <!-- Full-Width Team Name Input Box -->
                                            <Input
                                                id="adminTeamNameInput"
                                                value="{accessModel>/selectedAdminClassification/name}"
                                                editable="false"
                                                tooltip="{accessModel>/selectedAdminClassification/name}"
                                                class="kyraAdminSubClassInput kyraAdminReadOnlyInput"
                                                width="100%" />

                                            <!-- Right-Aligned Edit &amp; Delete Action Buttons directly below Team Name Input -->
                                            <HBox width="100%" justifyContent="End" alignItems="Center" class="sapUiTinyMarginTop sapUiSmallMarginBottom">
                                                <Button
                                                    icon="sap-icon://edit"
                                                    press=".onEditSelectedAdminTeam"
                                                    class="kyraAdminSystemEditBtn kyraAdminMiniActionBtn"
                                                    tooltip="Edit Team" />
                                                <Button
                                                    icon="sap-icon://delete"
                                                    press=".onDeleteSelectedAdminTeam"
                                                    class="kyraAdminSystemDeleteBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                    tooltip="Delete Team" />
                                            </HBox>

                                            <!-- Persona (2) Title -->
                                            <Text
                                                text="{= 'Persona (' + (${accessModel>/selectedAdminClassification/subClassifications} ? ${accessModel>/selectedAdminClassification/subClassifications}.length : 0) + ')' }"
                                                class="kyraAdminSubPanelTitle kyraAdminSubClassHeader sapUiTinyMarginBottom" />

                                            <!-- Persona List: Full-Width Input on Left + Edit &amp; Delete on Right -->
                                            <VBox items="{accessModel>/selectedAdminClassification/subClassifications}" class="kyraAdminSubClassListContainer" width="100%">
                                                <HBox alignItems="Center" class="kyraAdminSubClassRow sapUiTinyMarginBottom" width="100%">
                                                    <Input
                                                        value="{accessModel>name}"
                                                        editable="false"
                                                        tooltip="{accessModel>name}"
                                                        class="kyraAdminSubClassInput kyraAdminReadOnlyInput"
                                                        width="100%" />
                                                    <Button
                                                        icon="sap-icon://edit"
                                                        press=".onEditAdminSubClassification"
                                                        class="kyraAdminSystemEditBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                        tooltip="Edit Persona" />
                                                    <Button
                                                        icon="sap-icon://delete"
                                                        press=".onDeleteAdminSubClassification"
                                                        class="kyraAdminSystemDeleteBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                        tooltip="Delete Persona" />
                                                </HBox>
                                            </VBox>

                                            <!-- +Add Persona Dashed Outline Full-Width Button -->
                                            <Button
                                                text="+Add Persona"
                                                press=".onAddAdminSubClassification"
                                                class="kyraAdminSubAddBtn kyraAdminAddSubClassBtn sapUiTinyMarginTop"
                                                width="100%" />
                                        </VBox>
                                    </HBox>
                                </VBox>`;

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) return;
  let content = fs.readFileSync(vf, 'utf8');
  const isCrlf = content.includes('\r\n');
  let norm = content.replace(/\r\n/g, '\n');

  const targetStart = '<!-- Right Sub-Panel: Team Name &amp; Persona';
  const targetEnd = '<!-- Bottom Right Footer Buttons: Cancel &amp; Save -->';

  const sIdx = norm.indexOf(targetStart);
  const eIdx = norm.indexOf(targetEnd);

  if (sIdx !== -1 && eIdx !== -1) {
    const before = norm.substring(0, sIdx);
    const after = norm.substring(eIdx);
    norm = before + replacementSnippet + '\n\n                                ' + after;
    console.log(`[${vf}] Updated right subpanel to match media_1790767316133.png!`);
  } else {
    console.error(`[${vf}] Target markers not found!`);
  }

  const finalStr = isCrlf ? norm.replace(/\n/g, '\r\n') : norm;
  fs.writeFileSync(vf, finalStr, 'utf8');
});

console.log('\n--- Step 2: Updating Cancel Button & Subpanel CSS ---');

const exactCss = `
/* ========================================================================== */
/* SERVICE DETAILS RIGHT SUB-PANEL: MATCHES media_1790767316133.png EXACTLY   */
/* Clean white card, full-width inputs, right-aligned action buttons          */
/* Clean neutral Cancel button matching image exactly                         */
/* ========================================================================== */

/* Right Sub-Panel Container */
.kyraAdminClassDetailSubPanel {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 22px 24px !important;
    box-sizing: border-box !important;
}

/* Sub-panel Titles */
.kyraAdminSubClassHeader {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin-top: 16px !important;
    margin-bottom: 10px !important;
    display: block !important;
}

/* Input Fields in Right Panel */
.kyraAdminSubClassInput .sapMInputBaseInner {
    height: 38px !important;
    line-height: 36px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #334155 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 0 14px !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    transition: border-color 0.15s ease !important;
}

.kyraAdminSubClassInput .sapMInputBaseInner:focus {
    border-color: #008C9C !important;
}

/* Edit Button (Teal Squircle with White Pencil) */
.kyraAdminSystemEditBtn.sapMBtn,
.kyraAdminSystemEditBtn {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraAdminSystemEditBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    line-height: 30px !important;
    padding: 0 !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #008C9C !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraAdminSystemEditBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-size: 13px !important;
    line-height: 1 !important;
    margin: 0 !important;
}

.kyraAdminSystemEditBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #007684 !important;
    transform: scale(1.04) !important;
}

/* Delete Button (White Squircle with Red Border and Trash Icon) */
.kyraAdminSystemDeleteBtn.sapMBtn,
.kyraAdminSystemDeleteBtn {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraAdminSystemDeleteBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    line-height: 30px !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #FECACA !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraAdminSystemDeleteBtn .sapUiIcon {
    color: #EF4444 !important;
    font-size: 13px !important;
    line-height: 1 !important;
    margin: 0 !important;
}

.kyraAdminSystemDeleteBtn:hover .sapMBtnInner {
    background: #FEF2F2 !important;
    background-color: #FEF2F2 !important;
    border-color: #EF4444 !important;
    transform: scale(1.04) !important;
}

/* +Add Persona Full-Width Dashed Button */
.kyraAdminAddSubClassBtn.sapMBtn,
.kyraAdminAddSubClassBtn {
    width: 100% !important;
    height: 38px !important;
    margin-top: 14px !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraAdminAddSubClassBtn .sapMBtnInner {
    width: 100% !important;
    height: 38px !important;
    line-height: 35px !important;
    padding: 0 16px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px dashed #008C9C !important;
    border-radius: 8px !important;
    color: #008C9C !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    transition: all 0.2s ease !important;
    box-sizing: border-box !important;
}

.kyraAdminAddSubClassBtn .sapMBtnContent,
.kyraAdminAddSubClassBtn bdi,
.kyraAdminAddSubClassBtn .sapUiIcon {
    color: #008C9C !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
}

.kyraAdminAddSubClassBtn:hover .sapMBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border-color: #007684 !important;
    color: #007684 !important;
}

/* ========================================================================== */
/* CANCEL BUTTON: MATCHES media_1790767316133.png EXACTLY                     */
/* Clean white fill #FFFFFF, light border #CBD5E1, slate text #334155, 9px radius */
/* ========================================================================== */
.kyraAdminCancelBtn,
.kyraAdminCancelBtn.sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraAdminCancelBtn .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn .sapMBtnInner,
.kyra-system-modal-cancel-btn,
.kyra-confirm-cancel-btn,
#kyra_del_cancel_btn {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 35px !important;
    padding: 0 22px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 9px !important;
    color: #334155 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    font-family: inherit !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    outline: none !important;
    box-sizing: border-box !important;
    text-decoration: none !important;
}

.kyraAdminCancelBtn .sapMBtnContent,
.kyraAdminCancelBtn bdi,
.kyraAdminCancelBtn .sapUiIcon,
.kyra-system-modal-cancel-btn,
.kyra-confirm-cancel-btn,
#kyra_del_cancel_btn {
    color: #334155 !important;
    font-weight: 600 !important;
    font-size: 14px !important;
}

.kyraAdminCancelBtn:hover .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn:hover .sapMBtnInner,
.kyra-system-modal-cancel-btn:hover,
.kyra-confirm-cancel-btn:hover,
#kyra_del_cancel_btn:hover {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #94A3B8 !important;
    color: #0F172A !important;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1) !important;
    transform: translateY(-1px) !important;
}

.kyraAdminCancelBtn:hover .sapMBtnContent,
.kyraAdminCancelBtn:hover bdi,
.kyraAdminCancelBtn:hover .sapUiIcon {
    color: #0F172A !important;
}

.kyraAdminCancelBtn:active .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn:active .sapMBtnInner,
.kyra-system-modal-cancel-btn:active,
.kyra-confirm-cancel-btn:active,
#kyra_del_cancel_btn:active {
    background: #F1F5F9 !important;
    background-color: #F1F5F9 !important;
    border-color: #64748B !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08) !important;
    transform: translateY(0px) !important;
}

/* Save Button Matches Exactly */
.kyraAdminSaveBtn,
.kyraAdminSaveBtn.sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
}

.kyraAdminSaveBtn .sapMBtnInner,
.kyraAdminSaveBtn.sapMBtn .sapMBtnInner {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 36px !important;
    padding: 0 24px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1.5px solid #007684 !important;
    border-radius: 9px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraAdminSaveBtn .sapMBtnContent,
.kyraAdminSaveBtn bdi,
.kyraAdminSaveBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

.kyraAdminSaveBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.38) !important;
    transform: translateY(-1px) !important;
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

  const marker = '/* ==========================================================================\n/* SERVICE DETAILS RIGHT SUB-PANEL: MATCHES media_1790767316133.png EXACTLY';
  const markerSimple = '/* SERVICE DETAILS RIGHT SUB-PANEL: MATCHES media_1790767316133.png EXACTLY';
  const existingIdx = content.indexOf(markerSimple);

  if (existingIdx !== -1) {
    const topIdx = content.lastIndexOf('/* ==========================================================================', existingIdx);
    content = content.substring(0, topIdx !== -1 ? topIdx : existingIdx) + exactCss;
  } else {
    content += '\n\n' + exactCss;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[UPDATED CSS] ${file}`);
});

console.log('\nAll files updated cleanly!');
