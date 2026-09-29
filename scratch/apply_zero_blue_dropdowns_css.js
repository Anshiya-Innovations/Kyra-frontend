const fs = require('fs');

const cssRules = `
/* ========================================================================== */
/* KYRA THEMED DESIGN: PERSONA CONVERSION, DROPDOWNS & ACTIONS (NO BLUE)      */
/* ========================================================================== */

/* 1. Segmented Button: Eliminating All Default SAP Blue */
.kyraPersonaSegmentedBtn {
    --sapButton_Selected_Background: #008C9C !important;
    --sapButton_Selected_BorderColor: #007684 !important;
    --sapButton_Selected_TextColor: #FFFFFF !important;
    --sapButton_Selected_Hover_Background: #007684 !important;
    --sapButton_Selected_Hover_BorderColor: #005A65 !important;
    display: inline-flex !important;
    align-items: center !important;
}

/* Selected button: Kyra teal */
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapMSegBBtnInner,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapMSegBBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border-color: #007684 !important;
    color: #FFFFFF !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapMSegBBtnTxt,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapMSegBBtnTxt {
    color: #FFFFFF !important;
}

/* Inactive button: Clean neutral slate - NEVER BLUE */
.kyraPersonaSegmentedBtn .sapMSegBBtn:not(.sapMSegBBtnSel) .sapMSegBBtnInner,
.kyraPersonaSegmentedBtn .sapMSegBBtn:not(.sapMSegBBtnSel) .sapMSegBBtnTxt {
    color: #334155 !important;
    font-weight: 600 !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:not(.sapMSegBBtnSel) .sapUiIcon {
    color: #64748B !important;
}

/* Inactive button hover */
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapMSegBBtnInner,
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapMSegBBtnTxt {
    color: #008C9C !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapUiIcon {
    color: #008C9C !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtnTxt {
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: nowrap !important;
}

/* 2. Department Conversion Controls Row: Pixel-Perfect Alignment & Unified Gap */
.kyraDeptConversionControlsRow {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: flex-end !important;
    gap: 16px !important;
    margin-top: 14px !important;
    margin-bottom: 6px !important;
}

.kyraDeptFieldCol {
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-end !important;
}

.kyraAdminFieldLabelRow {
    margin-bottom: 6px !important;
    height: 18px !important;
    display: flex !important;
    align-items: center !important;
}

.kyraAdminFormLabel {
    font-size: 11.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em !important;
    color: #475569 !important;
    text-transform: uppercase !important;
}

.kyraAdminRequiredStar {
    color: #EF4444 !important;
    font-weight: 700 !important;
    margin-left: 3px !important;
}

/* ComboBox & Select Inputs: 40px Height, Clean Slate Border, Teal Focus */
.kyraDeptComboBox.sapMInputBase,
.kyraDeptComboBox,
.kyraDeptSelect.sapMSlt,
.kyraDeptSelect {
    height: 40px !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraDeptComboBox .sapMInputBaseContentWrapper,
.kyraDeptSelect.sapMSlt {
    height: 40px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
}

.kyraDeptComboBox .sapMInputBaseInner,
.kyraDeptSelect .sapMSltLabel {
    height: 38px !important;
    line-height: 38px !important;
    font-size: 13.5px !important;
    color: #0F172A !important;
    padding: 0 12px !important;
}

/* Dropdown Arrow Icon: Project Teal Accent */
.kyraDeptComboBox .sapMComboBoxArrow,
.kyraDeptComboBox .sapMInputBaseIcon,
.kyraDeptSelect .sapMSltArrow {
    color: #008C9C !important;
    font-size: 14px !important;
}

.kyraDeptComboBox.sapMFocus .sapMInputBaseContentWrapper,
.kyraDeptComboBox .sapMInputBaseContentWrapper:focus-within,
.kyraDeptSelect.sapMSlt:focus,
.kyraDeptSelect.sapMSlt.sapMFocus {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
}

/* 3. Action Buttons: 40px Aligned, Preview Users (Teal Border) & Save Changes (Teal Solid) */
.kyraDeptActionBtns {
    height: 40px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 12px !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Preview Users Button: Clean Outline - NO BLUE */
.kyraDeptPreviewBtn.sapMBtn,
.kyraDeptPreviewBtn {
    height: 40px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraDeptPreviewBtn .sapMBtnInner {
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 18px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.kyraDeptPreviewBtn .sapUiIcon {
    color: #008C9C !important;
    font-size: 14px !important;
    margin-right: 6px !important;
    transition: color 0.2s ease !important;
}

.kyraDeptPreviewBtn .sapMBtnContent,
.kyraDeptPreviewBtn bdi {
    color: #0F172A !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    transition: color 0.2s ease !important;
}

.kyraDeptPreviewBtn:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.18) !important;
}

.kyraDeptPreviewBtn:hover .sapMBtnContent,
.kyraDeptPreviewBtn:hover bdi {
    color: #008C9C !important;
}

.kyraDeptPreviewBtn:hover .sapUiIcon {
    color: #007684 !important;
}

/* Save Changes Button: Solid Teal */
.kyraDeptSaveBtn.sapMBtn,
.kyraDeptSaveBtn {
    height: 40px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraDeptSaveBtn .sapMBtnInner {
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 22px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.28) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraDeptSaveBtn .sapMBtnContent,
.kyraDeptSaveBtn bdi,
.kyraDeptSaveBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraDeptSaveBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005A65 !important;
    box-shadow: 0 4px 12px rgba(0, 140, 156, 0.38) !important;
}

/* ========================================================================== */
/* 4. GLOBAL DROPDOWNS POPUP THEME (NO BLUE COLOR ACROSS ALL DROPDOWNS)        */
/* ========================================================================== */

/* Dropdown Popover Container */
.sapMPopover.sapMSltPicker,
.sapMPopover.sapMComboBoxBasePicker,
.sapMComboBoxPicker,
.sapMSltPicker-CTX {
    border: 1px solid #CBD5E1 !important;
    border-radius: 10px !important;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.08) !important;
    overflow: hidden !important;
}

/* Active / Selected Item in All Dropdowns */
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

/* Radio Icon / Checkmark in Selected Dropdown Item */
.sapMSelectListItemBaseSelected .sapUiIcon,
.sapMLIBSelected .sapUiIcon,
.sapMSelectListItemBaseSelected .sapMSelectListItemIcon,
.sapMLIBSelected .sapMRbBInn {
    color: #008C9C !important;
    border-color: #008C9C !important;
}

/* Hover on Dropdown Items */
.sapMSelectListItemBaseHoverable:hover,
.sapMLIBHoverable:hover,
.sapMSelectListItem:hover,
.sapMComboBoxBaseItem:hover {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    color: #008C9C !important;
}

/* Hover on Selected Item */
.sapMSelectListItemBaseSelected:hover,
.sapMLIBSelected:hover {
    background: #E6FFFA !important;
    background-color: #E6FFFA !important;
    color: #007684 !important;
}

/* Dropdown Base Item Text */
.sapMSelectListItem,
.sapMLIB,
.sapMComboBoxBaseItem {
    color: #0F172A !important;
    font-size: 13.5px !important;
}

/* Dropdown Search / Filter Input inside Popover */
.sapMPopover .sapMSFI,
.sapMPopover .sapMSF {
    border-radius: 6px !important;
}

.sapMPopover .sapMSF:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
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
        
        // Remove prior block if present
        const marker = '/* KYRA THEMED DESIGN: PERSONA CONVERSION, DROPDOWNS & ACTIONS (NO BLUE) */';
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
