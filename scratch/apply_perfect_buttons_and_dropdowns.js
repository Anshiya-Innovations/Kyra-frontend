const fs = require('fs');

const cssRules = `
/* ========================================================================== */
/* KYRA THEMED DESIGN: SEAMLESS SEGMENTED BUTTONS & ZERO BLUE DROPDOWNS       */
/* ========================================================================== */

/* 1. Seamless Segmented Button (Pixel-Perfect Alignment, No Shifting, Proper Icon Gap) */
.kyraPersonaSegmentedBtn.sapMSegB,
.kyraPersonaSegmentedBtn {
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 9px !important;
    overflow: hidden !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    height: 40px !important;
    box-sizing: border-box !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn {
    height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    vertical-align: middle !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn .sapMSegBBtnInner {
    height: 38px !important;
    line-height: 38px !important;
    margin: 0 !important;
    padding: 0 20px !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease, color 0.2s ease !important;
}

/* Selected Button: Solid KYRA Teal, Perfectly Centered */
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel,
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapMSegBBtnInner,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"],
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapMSegBBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    color: #FFFFFF !important;
    border: none !important;
    box-shadow: none !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapMSegBBtnTxt,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapMSegBBtnTxt {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

/* Unselected Button: Clean Slate, Transparent Background - NO BLUE */
.kyraPersonaSegmentedBtn .sapMSegBBtn:not(.sapMSegBBtnSel) .sapMSegBBtnInner {
    background: transparent !important;
    background-color: transparent !important;
    color: #334155 !important;
    border: none !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:not(.sapMSegBBtnSel) .sapMSegBBtnTxt {
    color: #334155 !important;
    font-weight: 600 !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:not(.sapMSegBBtnSel) .sapUiIcon {
    color: #64748B !important;
}

/* Hover on Unselected */
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapMSegBBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapMSegBBtnTxt,
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapUiIcon {
    color: #008C9C !important;
}

/* Space between Icon and Text */
.kyraPersonaSegmentedBtn .sapMSegBBtn .sapUiIcon {
    margin-right: 8px !important;
    padding-right: 0 !important;
    padding-left: 0 !important;
    font-size: 15px !important;
    line-height: 1 !important;
    vertical-align: middle !important;
    display: inline-block !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtnTxt {
    font-size: 13.5px !important;
    overflow: visible !important;
    white-space: nowrap !important;
    vertical-align: middle !important;
    display: inline-block !important;
}

/* 2. Target Persona Dropdown & Arrow: NO BLUE OUTLINE */
.kyraDeptSelect.sapMSlt,
.kyraAdminBuilderSelect.sapMSlt,
.sapMSlt {
    height: 40px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
    outline: none !important;
}

.kyraDeptSelect .sapMSltLabel,
.kyraAdminBuilderSelect .sapMSltLabel,
.sapMSlt .sapMSltLabel {
    height: 38px !important;
    line-height: 38px !important;
    font-size: 13.5px !important;
    color: #0F172A !important;
    padding: 0 12px !important;
}

/* Remove blue border and blue color on arrow button */
.kyraDeptSelect .sapMSltArrow,
.kyraAdminBuilderSelect .sapMSltArrow,
.sapMSlt .sapMSltArrow,
.sapMSlt:focus .sapMSltArrow,
.sapMSlt.sapMFocus .sapMSltArrow,
.sapMSltHoverable:hover .sapMSltArrow {
    border: none !important;
    outline: none !important;
    color: #008C9C !important;
    box-shadow: none !important;
}

.kyraDeptSelect.sapMSlt:focus,
.kyraDeptSelect.sapMSlt.sapMFocus,
.kyraDeptSelect.sapMSlt:focus-within,
.sapMSlt:focus,
.sapMSlt.sapMFocus {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
    outline: none !important;
}

/* 3. Global Dropdown Popup Theme: ZERO BLUE */
.sapMPopover.sapMSltPicker,
.sapMPopover.sapMComboBoxBasePicker,
.sapMComboBoxPicker,
.sapMSltPicker-CTX {
    border: 1px solid #CBD5E1 !important;
    border-radius: 10px !important;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.08) !important;
    overflow: hidden !important;
}

/* Selected item in dropdown */
.sapMSelectListItemBaseSelected,
.sapMSelectListItem.sapMSelectListItemBaseSelected,
.sapMLIBSelected,
.sapMSelectList .sapMSelectListItemBaseSelected,
.sapMComboBoxBaseItem.sapMLIBSelected {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
    border-left: 3px solid #008C9C !important;
    font-weight: 700 !important;
}

.sapMSelectListItemBaseSelected .sapUiIcon,
.sapMLIBSelected .sapUiIcon,
.sapMSelectListItemBaseSelected .sapMSelectListItemIcon,
.sapMLIBSelected .sapMRbBInn {
    color: #008C9C !important;
    border-color: #008C9C !important;
}

/* Hover item in dropdown */
.sapMSelectListItemBaseHoverable:hover,
.sapMLIBHoverable:hover,
.sapMSelectListItem:hover,
.sapMComboBoxBaseItem:hover {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    color: #008C9C !important;
}

/* Selected item hover */
.sapMSelectListItemBaseSelected:hover,
.sapMLIBSelected:hover {
    background: #E6FFFA !important;
    background-color: #E6FFFA !important;
    color: #007684 !important;
}

.sapMSelectListItem,
.sapMLIB,
.sapMComboBoxBaseItem {
    color: #0F172A !important;
    font-size: 13.5px !important;
}
`;

const cssFiles = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        const marker = '/* KYRA THEMED DESIGN: SEAMLESS SEGMENTED BUTTONS & ZERO BLUE DROPDOWNS */';
        if (content.includes(marker)) {
            const idx = content.indexOf(marker);
            const priorComment = content.lastIndexOf('/* ===', idx);
            if (priorComment !== -1) {
                content = content.substring(0, priorComment);
            } else {
                content = content.substring(0, idx);
            }
        }
        
        content = content.trimEnd() + '\n\n' + cssRules.trim() + '\n';
        fs.writeFileSync(file, content, 'utf8');
        console.log('Successfully updated CSS in:', file);
    } else {
        console.log('File does not exist:', file);
    }
});
console.log('All CSS files updated successfully!');
