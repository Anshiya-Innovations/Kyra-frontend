const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Updating CSS for Business Sector Dropdown & Service Details ===');

const unifiedSectorAndServiceCss = `
/* ========================================================================== */
/* SINGLE UNIFIED BUSINESS SECTOR & FUNCTION DROPDOWN (MATCHES Image 2)      */
/* One clean border, one rounded container (10px), one placeholder text,     */
/* one clean dropdown arrow on the right, no separate colored sections inside */
/* ========================================================================== */

#inPageBusinessSectorSelect,
#inPageBusinessFunctionSelect,
.kyraScopeFieldCol .sapMComboBox,
.kyraScopeFieldCol .fioriFormSelect {
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
    width: 100% !important;
    border-radius: 10px !important;
    background: transparent !important;
    box-sizing: border-box !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
}

#inPageBusinessSectorSelect .sapMInputBaseContentWrapper,
#inPageBusinessFunctionSelect .sapMInputBaseContentWrapper,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseContentWrapper,
.kyraScopeFieldCol .fioriFormSelect .sapMInputBaseContentWrapper {
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
    border: 1.5px solid #008C9C !important;
    border-color: #008C9C !important;
    border-radius: 10px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 2.5px rgba(0, 140, 156, 0.12) !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    overflow: hidden !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative !important;
}

/* Remove ANY pseudo-elements, divider lines or colored bars inside */
#inPageBusinessSectorSelect .sapMInputBaseContentWrapper::before,
#inPageBusinessSectorSelect .sapMInputBaseContentWrapper::after,
#inPageBusinessFunctionSelect .sapMInputBaseContentWrapper::before,
#inPageBusinessFunctionSelect .sapMInputBaseContentWrapper::after,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseContentWrapper::before,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseContentWrapper::after,
.kyraScopeFieldCol .fioriFormSelect .sapMInputBaseContentWrapper::before,
.kyraScopeFieldCol .fioriFormSelect .sapMInputBaseContentWrapper::after {
    display: none !important;
    border: none !important;
    content: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* Inner Text Input: Single unified text, clean typography */
#inPageBusinessSectorSelect .sapMInputBaseInner,
#inPageBusinessSectorSelect input.sapMInputBaseInner,
#inPageBusinessFunctionSelect .sapMInputBaseInner,
#inPageBusinessFunctionSelect input.sapMInputBaseInner,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseInner,
.kyraScopeFieldCol .sapMComboBox input.sapMInputBaseInner,
.kyraScopeFieldCol .fioriFormSelect .sapMInputBaseInner,
.kyraScopeFieldCol .fioriFormSelect input.sapMInputBaseInner {
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    background-color: transparent !important;
    color: #0F172A !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    font-family: inherit !important;
    line-height: 40px !important;
    height: 40px !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    outline: none !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
    cursor: pointer !important;
    caret-color: transparent !important;
}

/* Placeholder styling */
#inPageBusinessSectorSelect input::placeholder,
#inPageBusinessSectorSelect .sapMInputBaseInner::placeholder,
#inPageBusinessFunctionSelect input::placeholder,
#inPageBusinessFunctionSelect .sapMInputBaseInner::placeholder,
.kyraScopeFieldCol .sapMComboBox input::placeholder,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseInner::placeholder {
    color: #64748B !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    opacity: 1 !important;
}

/* Right Dropdown Arrow Icon: Clean teal chevron, NO separate box, NO divider */
#inPageBusinessSectorSelect .sapMInputBaseIconContainer,
#inPageBusinessFunctionSelect .sapMInputBaseIconContainer,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseIconContainer,
.kyraScopeFieldCol .fioriFormSelect .sapMInputBaseIconContainer {
    position: static !important;
    width: 24px !important;
    min-width: 24px !important;
    max-width: 24px !important;
    height: 100% !important;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    border-left: none !important;
    box-shadow: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    margin: 0 0 0 8px !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
}

#inPageBusinessSectorSelect .sapMInputBaseIconContainer::before,
#inPageBusinessSectorSelect .sapMInputBaseIconContainer::after,
#inPageBusinessFunctionSelect .sapMInputBaseIconContainer::before,
#inPageBusinessFunctionSelect .sapMInputBaseIconContainer::after,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseIconContainer::before,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseIconContainer::after {
    display: none !important;
    content: none !important;
    border: none !important;
}

#inPageBusinessSectorSelect .sapUiIcon,
#inPageBusinessSectorSelect .sapMInputBaseIcon,
#inPageBusinessSectorSelect .sapMComboBoxIcon,
#inPageBusinessFunctionSelect .sapUiIcon,
#inPageBusinessFunctionSelect .sapMInputBaseIcon,
#inPageBusinessFunctionSelect .sapMComboBoxIcon,
.kyraScopeFieldCol .sapMComboBox .sapUiIcon,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseIcon,
.kyraScopeFieldCol .sapMComboBox .sapMComboBoxIcon {
    color: #008C9C !important;
    font-size: 14px !important;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    line-height: 1 !important;
    padding: 0 !important;
    margin: 0 !important;
}

/* Hover & Focus States */
#inPageBusinessSectorSelect .sapMInputBaseContentWrapper:hover,
#inPageBusinessFunctionSelect .sapMInputBaseContentWrapper:hover,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseContentWrapper:hover,
.kyraScopeFieldCol .fioriFormSelect .sapMInputBaseContentWrapper:hover {
    border-color: #007684 !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.2) !important;
}

#inPageBusinessSectorSelect.sapMFocus .sapMInputBaseContentWrapper,
#inPageBusinessSectorSelect .sapMInputBaseContentWrapper:focus-within,
#inPageBusinessFunctionSelect.sapMFocus .sapMInputBaseContentWrapper,
#inPageBusinessFunctionSelect .sapMInputBaseContentWrapper:focus-within,
.kyraScopeFieldCol .sapMComboBox.sapMFocus .sapMInputBaseContentWrapper,
.kyraScopeFieldCol .sapMComboBox .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.25) !important;
}

/* ========================================================================== */
/* SERVICE DETAILS: EXACT DESIGN, GAP, ALIGNMENT & READ-ONLY TEXT (Image 1)  */
/* ========================================================================== */

.kyraAdminBottomSplitRow {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: stretch !important;
    width: 100% !important;
    gap: 20px !important;
}

/* Service Details Container Header */
.kyraAdminCardHeaderRow {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 16px !important;
}

.kyraAdminCardTitle {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
}

/* Inner 2-Column Split: Clean 20px gap and proportions matching Image 1 */
.kyraAdminServiceDetailsSplitBox {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: stretch !important;
    width: 100% !important;
    gap: 20px !important;
    box-sizing: border-box !important;
}

/* Left Subpanel: Team (2) */
.kyraAdminClassificationsSubPanel {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 20px 22px !important;
    box-sizing: border-box !important;
    width: 38% !important;
    flex: 0 0 38% !important;
    min-width: 260px !important;
    max-width: 38% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
}

/* Right Subpanel: Team Name & Persona Details */
.kyraAdminClassDetailSubPanel {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 20px 22px !important;
    box-sizing: border-box !important;
    width: 59% !important;
    flex: 0 0 59% !important;
    min-width: 320px !important;
    max-width: 59% !important;
}

/* Sub-panel Title */
.kyraAdminSubPanelTitle {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin-bottom: 12px !important;
    display: block !important;
}

/* Team Card (Unselected) */
.kyraAdminClassItemCard,
.sapMFlexBox.kyraAdminClassItemCard {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 9px !important;
    padding: 12px 14px !important;
    margin-bottom: 10px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.kyraAdminClassItemCard:hover {
    border-color: #CBD5E1 !important;
    background: #F8FAFC !important;
}

/* Team Card (Selected: soft aqua tint #F0FDFA, teal border #008C9C) */
.kyraAdminClassItemCard[data-selectedclass="true"],
.sapMFlexBox.kyraAdminClassItemCard[data-selectedclass="true"] {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.12) !important;
}

/* Team Name Row inside Card */
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
    gap: 10px !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
}

.kyraAdminTeamLeftContent .kyraAdminVectorDot {
    width: 8px !important;
    height: 8px !important;
    min-width: 8px !important;
    min-height: 8px !important;
    border-radius: 50% !important;
    background: #008C9C !important;
    flex-shrink: 0 !important;
}

.kyraAdminClassItemLink.sapMLnk,
.kyraAdminClassItemLink {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #334155 !important;
    text-decoration: none !important;
    line-height: 1.35 !important;
    white-space: normal !important;
    word-break: normal !important;
    overflow-wrap: break-word !important;
    display: block !important;
    flex: 1 1 auto !important;
}

.kyraAdminClassItemCard[data-selectedclass="true"] .kyraAdminClassItemLink {
    color: #0F172A !important;
    font-weight: 700 !important;
}

/* Status Pill in Team Card */
.kyraAdminTeamStatusPill {
    flex-shrink: 0 !important;
    margin-left: 8px !important;
    background: #E6F7F8 !important;
    background-color: #E6F7F8 !important;
    border: 1.5px solid #2DD4BF !important;
    border-radius: 20px !important;
    padding: 3px 10px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    white-space: nowrap !important;
}

.kyraAdminTeamStatusPill .kyraAdminPillText {
    color: #008C9C !important;
    font-size: 12px !important;
    font-weight: 600 !important;
}

/* Non-Editable Input Fields (TEAM NAME & Persona Inputs matching Image 1) */
.kyraAdminReadOnlyInput,
.kyraAdminSubClassInput.kyraAdminReadOnlyInput,
.kyraAdminSubClassInput.sapMInputBaseReadonly,
#adminTeamNameInput {
    height: 38px !important;
    min-height: 38px !important;
    width: 100% !important;
}

.kyraAdminReadOnlyInput .sapMInputBaseContentWrapper,
.kyraAdminSubClassInput.kyraAdminReadOnlyInput .sapMInputBaseContentWrapper,
#adminTeamNameInput .sapMInputBaseContentWrapper {
    height: 38px !important;
    min-height: 38px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    padding: 0 14px !important;
    box-sizing: border-box !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    display: flex !important;
    align-items: center !important;
}

.kyraAdminReadOnlyInput .sapMInputBaseInner,
.kyraAdminReadOnlyInput input.sapMInputBaseInner,
.kyraAdminSubClassInput.kyraAdminReadOnlyInput .sapMInputBaseInner,
#adminTeamNameInput .sapMInputBaseInner,
#adminTeamNameInput input.sapMInputBaseInner {
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    color: #0F172A !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    padding: 0 !important;
    margin: 0 !important;
    height: 36px !important;
    line-height: 36px !important;
    cursor: default !important;
    caret-color: transparent !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}

/* Persona Row & Action Buttons */
.kyraAdminSubClassRow {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    width: 100% !important;
    gap: 8px !important;
    margin-bottom: 8px !important;
    box-sizing: border-box !important;
}

.kyraAdminSubClassRow .kyraAdminReadOnlyInput {
    flex: 1 1 auto !important;
    min-width: 0 !important;
}

/* Mini Action Buttons: Edit (Teal) & Delete (Red Border) */
.kyraAdminMiniActionBtn.sapMBtn,
.kyraAdminMiniActionBtn {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

.kyraAdminSystemEditBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #008C9C !important;
    border-radius: 6px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    box-shadow: none !important;
    cursor: pointer !important;
}

.kyraAdminSystemEditBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-size: 13px !important;
    line-height: 1 !important;
}

.kyraAdminSystemEditBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    transform: scale(1.05) !important;
}

.kyraAdminSystemDeleteBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #FECACA !important;
    border-radius: 6px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    box-shadow: none !important;
    cursor: pointer !important;
}

.kyraAdminSystemDeleteBtn .sapUiIcon {
    color: #EF4444 !important;
    font-size: 13px !important;
    line-height: 1 !important;
}

.kyraAdminSystemDeleteBtn:hover .sapMBtnInner {
    background: #FEF2F2 !important;
    background-color: #FEF2F2 !important;
    border-color: #EF4444 !important;
    transform: scale(1.05) !important;
}

/* Full-Width Dashed +Add Team & +Add Persona Buttons */
.kyraAdminSubAddBtn.sapMBtn,
.kyraAdminAddSubClassBtn.sapMBtn,
.kyraAdminSubAddBtn,
.kyraAdminAddSubClassBtn {
    width: 100% !important;
    height: 38px !important;
    min-height: 38px !important;
    margin-top: 14px !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraAdminSubAddBtn .sapMBtnInner,
.kyraAdminAddSubClassBtn .sapMBtnInner {
    width: 100% !important;
    height: 38px !important;
    line-height: 35px !important;
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
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
}

.kyraAdminSubAddBtn .sapMBtnContent,
.kyraAdminAddSubClassBtn .sapMBtnContent,
.kyraAdminSubAddBtn bdi,
.kyraAdminAddSubClassBtn bdi {
    color: #008C9C !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
}

.kyraAdminSubAddBtn:hover .sapMBtnInner,
.kyraAdminAddSubClassBtn:hover .sapMBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border-color: #007684 !important;
    color: #007684 !important;
}

/* Card Footer: Cancel & Save Buttons */
.kyraAdminServiceDetailsFooter {
    display: flex !important;
    justify-content: flex-end !important;
    align-items: center !important;
    margin-top: 20px !important;
    padding-top: 16px !important;
    border-top: 1px solid #F1F5F9 !important;
    gap: 12px !important;
}

.kyraAdminCancelBtn .sapMBtnInner {
    height: 38px !important;
    line-height: 35px !important;
    padding: 0 22px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #334155 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
}

.kyraAdminCancelBtn:hover .sapMBtnInner {
    background: #F8FAFC !important;
    border-color: #94A3B8 !important;
    color: #0F172A !important;
}

.kyraAdminSaveBtn .sapMBtnInner {
    height: 38px !important;
    line-height: 36px !important;
    padding: 0 24px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1.5px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25) !important;
    transition: all 0.2s ease !important;
}

.kyraAdminSaveBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0, 140, 156, 0.35) !important;
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

  const marker = '/* SINGLE UNIFIED BUSINESS SECTOR & FUNCTION DROPDOWN (MATCHES Image 2) */';
  const existingIdx = content.indexOf(marker);

  if (existingIdx !== -1) {
    const topIdx = content.lastIndexOf('/* ==========================================================================', existingIdx);
    content = content.substring(0, topIdx !== -1 ? topIdx : existingIdx) + unifiedSectorAndServiceCss;
  } else {
    content += '\n\n' + unifiedSectorAndServiceCss;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[SAVED CSS] ${file}`);
});

console.log('\n=== Step 2: Updating View XML Files ===');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(vf => {
  if (!fs.existsSync(vf)) return;
  let content = fs.readFileSync(vf, 'utf8');

  // Subpanel widths: Team 38%, Persona Detail 59% with clean 20px gap
  content = content.replace(
    /<VBox width="4[23]%" class="kyraAdminClassificationsSubPanel"/g,
    '<VBox width="38%" class="kyraAdminClassificationsSubPanel"'
  );
  content = content.replace(
    /<VBox width="5[56]%" class="kyraAdminClassDetailSubPanel"/g,
    '<VBox width="59%" class="kyraAdminClassDetailSubPanel"'
  );

  // Ensure adminTeamNameInput is non-editable
  content = content.replace(
    /(id="adminTeamNameInput"[\s\S]*?)editable="true"/g,
    '$1editable="false"'
  );

  // Ensure persona inputs are non-editable
  // In kyraAdminSubClassRow
  content = content.replace(
    /(<HBox alignItems="Center" class="kyraAdminSubClassRow[\s\S]*?<Input[\s\S]*?)editable="true"/g,
    '$1editable="false"'
  );

  fs.writeFileSync(vf, content, 'utf8');
  console.log(`[SAVED XML] ${vf}`);
});

console.log('\n=== Step 3: Setting initial selected service to "System Owners" in controller ===');

const ctrlFiles = [
  'webapp/pages/access/AccessPage.controller.js'
];

ctrlFiles.forEach(cf => {
  if (!fs.existsSync(cf)) return;
  let content = fs.readFileSync(cf, 'utf8');

  // 1. Initial adminServicesAll & adminServices: set System Owners to selected: true, System Administrator to false
  content = content.replace(
    /adminServicesAll:\s*\[\s*\{\s*serviceName:\s*"System Administrator",\s*status:\s*"Active",\s*selected:\s*true\s*\},\s*\{\s*serviceName:\s*"System Owners",\s*status:\s*"Active",\s*selected:\s*false\s*\}/g,
    'adminServicesAll: [\n                    { serviceName: "System Administrator", status: "Active", selected: false },\n                    { serviceName: "System Owners", status: "Active", selected: true }'
  );
  content = content.replace(
    /adminServices:\s*\[\s*\{\s*serviceName:\s*"System Administrator",\s*status:\s*"Active",\s*selected:\s*true\s*\},\s*\{\s*serviceName:\s*"System Owners",\s*status:\s*"Active",\s*selected:\s*false\s*\}/g,
    'adminServices: [\n                    { serviceName: "System Administrator", status: "Active", selected: false },\n                    { serviceName: "System Owners", status: "Active", selected: true }'
  );

  // 2. Set selectedAdminServiceName fallback to System Owners
  content = content.replace(
    /const sSelectedSrv = oModel\.getProperty\("\/selectedAdminServiceName"\) \|\| "System Administrator";/g,
    'const sSelectedSrv = oModel.getProperty("/selectedAdminServiceName") || "System Owners";'
  );

  fs.writeFileSync(cf, content, 'utf8');
  console.log(`[SAVED CONTROLLER] ${cf}`);
});

console.log('\nAll updates completed successfully!');
