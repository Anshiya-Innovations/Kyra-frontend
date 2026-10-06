const fs = require('fs');

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/css/style.css'
];

const newCSS = `/* ========================================================================== */
/* ADMIN HEADER ACTIONS: SEARCH BAR, ADD BUTTON, AND CLOSE ICON (MATCHING IMAGE) */
/* ========================================================================== */

.kyraAdminHeaderActions {
    display: inline-flex !important;
    align-items: center !important;
    gap: 12px !important;
}

.kyraAdminHeaderActions .kyraCloseIconBtn {
    margin-left: 4px !important;
}

/* 2. Form Inputs & Search Fields - Pixel-Perfect KYRA Admin Style */
.kyraAdminSearchField,
.kyraAdminSearchField.sapMSF {
    height: 36px !important;
    background: transparent !important;
}

.kyraAdminSearchField form,
.kyraAdminSearchField .sapMSFF {
    height: 36px !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    background: #FFFFFF !important;
    position: relative !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    box-sizing: border-box !important;
}

.kyraAdminSearchField .sapMSFF:hover {
    border-color: #94A3B8 !important;
}

.kyraAdminSearchField.sapMFocus .sapMSFF,
.kyraAdminSearchField .sapMSFF:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
    outline: none !important;
}

.kyraAdminSearchField .sapMSFInner,
.kyraAdminSearchField .sapMSFR {
    height: 100% !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    position: relative !important;
}

.kyraAdminSearchField input.sapMSFI,
.kyraAdminSearchField input.sapMSFInput,
.kyraAdminSearchField .sapMSFI {
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    left: 0 !important;
    width: calc(100% - 36px) !important;
    height: 32px !important;
    line-height: 32px !important;
    font-size: 13.5px !important;
    color: #1E293B !important;
    padding-left: 14px !important;
    padding-right: 4px !important;
    margin: 0 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    font-style: italic !important;
    box-sizing: border-box !important;
}

.kyraAdminSearchField input.sapMSFI::placeholder,
.kyraAdminSearchField input.sapMSFInput::placeholder,
.kyraAdminSearchField .sapMSFI::placeholder {
    color: #64748B !important;
    font-style: italic !important;
    font-size: 13.5px !important;
    line-height: 32px !important;
    opacity: 0.95 !important;
}

.kyraAdminSearchField .sapMSFB {
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    right: 0 !important;
    height: 32px !important;
    width: 36px !important;
    min-width: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
}

.kyraAdminSearchField .sapMSFB .sapUiIcon,
.kyraAdminSearchField .sapMSFSI {
    color: #334155 !important;
    font-size: 15px !important;
    border: none !important;
    outline: none !important;
    transition: color 0.15s ease !important;
}

.kyraAdminSearchField .sapMSFB:hover .sapUiIcon,
.kyraAdminSearchField .sapMSFB:hover .sapMSFSI {
    color: #008C9C !important;
}

/* 3. Primary Action Buttons (Add System, Add Service, Add Conflict, Enter, Save) - KYRA Brand Teal */
.kyraAdminAddBlueBtn,
.kyraAdminAddBlueBtn.sapMBtn {
    height: 36px !important;
    min-height: 36px !important;
    vertical-align: middle !important;
    display: inline-flex !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
}

.kyraAdminAddBlueBtn .sapMBtnInner,
.kyraAdminSaveBtn .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    height: 36px !important;
    line-height: 34px !important;
    padding: 0 16px !important;
    box-shadow: 0 2px 5px rgba(0, 140, 156, 0.25) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    cursor: pointer !important;
    box-sizing: border-box !important;
}

.kyraAdminAddBlueBtn:hover .sapMBtnInner,
.kyraAdminSaveBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
    box-shadow: 0 4px 10px rgba(0, 140, 156, 0.35) !important;
    transform: translateY(-1px) !important;
}

.kyraAdminAddBlueBtn:active .sapMBtnInner,
.kyraAdminSaveBtn:active .sapMBtnInner {
    transform: translateY(0) !important;
    box-shadow: 0 1px 3px rgba(0, 140, 156, 0.2) !important;
}

.kyraAdminAddBlueBtn .sapMBtnIcon {
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    margin-right: 6px !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
}

.kyraAdminAddBlueBtn .sapMBtnContent,
.kyraAdminAddBlueBtn bdi,
.kyraAdminSaveBtn .sapMBtnContent,
.kyraAdminSaveBtn bdi {
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    line-height: 1 !important;
}

.kyraAdminSaveBtn .sapMBtnIcon {
    margin-right: 6px !important;
    font-size: 14px !important;
}

/* Close Icon Button - Clean Crisp Cross (Matching Image) */
.kyraCloseIconBtn,
.kyraCloseIconBtn.sapMBtn {
    height: 36px !important;
    min-height: 36px !important;
    width: 36px !important;
    min-width: 36px !important;
    vertical-align: middle !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraCloseIconBtn .sapMBtnInner {
    background: transparent !important;
    border: none !important;
    border-radius: 8px !important;
    height: 36px !important;
    width: 36px !important;
    min-width: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    cursor: pointer !important;
    box-shadow: none !important;
    transition: all 0.18s ease !important;
}

.kyraCloseIconBtn .sapMBtnIcon {
    color: #64748B !important;
    font-size: 15px !important;
    line-height: 1 !important;
    margin: 0 !important;
    transition: color 0.15s ease !important;
}

.kyraCloseIconBtn:hover .sapMBtnInner {
    background: #F1F5F9 !important;
    border: none !important;
}

.kyraCloseIconBtn:hover .sapMBtnIcon {
    color: #0F172A !important;
}`;

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace from .kyraAdminHeaderActions to .kyraAdminSaveBtn .sapMBtnIcon { ... }
  const startIdx = content.indexOf('.kyraAdminHeaderActions {');
  if (startIdx === -1) {
    console.error('Could not find .kyraAdminHeaderActions in', file);
    return;
  }
  
  const endAnchor = '.kyraAdminSaveBtn .sapMBtnIcon {';
  const endIdx = content.indexOf(endAnchor, startIdx);
  if (endIdx === -1) {
    console.error('Could not find endAnchor in', file);
    return;
  }
  const closeBraceIdx = content.indexOf('}', endIdx);

  const before = content.substring(0, startIdx);
  const after = content.substring(closeBraceIdx + 1);

  content = before + newCSS + after;

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated CSS in:', file);
});
