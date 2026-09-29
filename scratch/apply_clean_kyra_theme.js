const fs = require('fs');

const cssRules = `
/* ========================================================================== */
/* KYRA THEMED DESIGN: CLEAN NATIVE STYLING (NO EXTRA DESIGNS)                */
/* ========================================================================== */

/* 1. User Persona Conversion Header Badge */
.fioriCardAvatar.kyraBadgeTeal,
.kyraBadgeTeal.sapFAvatar {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 50% !important;
}

.fioriCardAvatar.kyraBadgeTeal .sapUiIcon,
.kyraBadgeTeal.sapFAvatar .sapUiIcon {
    color: #008C9C !important;
}

/* 2. User Persona Conversion Segmented Button (Clean Native Horizon) */
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

/* Hover on unselected button: subtle Kyra teal */
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapMSegBBtnInner {
    color: #008C9C !important;
    border-color: #008C9C !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapMSegBBtnTxt {
    color: #008C9C !important;
}

/* Ensure no text truncation on SegmentedButton */
.kyraPersonaSegmentedBtn .sapMSegBBtnTxt {
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: nowrap !important;
}

/* 3. Employee Login ID Container & Clean Input */
.kyraAdminConflictEditContainer {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 10px !important;
    padding: 16px 20px !important;
    box-sizing: border-box !important;
}

.kyraAdminFieldLabelRow {
    margin-bottom: 6px !important;
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

/* Input Field: Remove outer double-border, style inner wrapper cleanly */
#adminPersonaLookupInput.sapMInputBase,
#adminPersonaLookupInput {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    height: 40px !important;
}

#adminPersonaLookupInput .sapMInputBaseContentWrapper {
    height: 40px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
}

#adminPersonaLookupInput .sapMInputBaseInner {
    height: 38px !important;
    line-height: 38px !important;
    font-size: 13.5px !important;
    color: #0F172A !important;
    padding: 0 12px !important;
}

#adminPersonaLookupInput.sapMFocus .sapMInputBaseContentWrapper,
#adminPersonaLookupInput .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
}

/* Enter Button: Clean Kyra Teal */
.kyraAdminSaveBtn.sapMBtn,
.kyraAdminSaveBtn {
    height: 40px !important;
    margin: 0 !important;
}

.kyraAdminSaveBtn .sapMBtnInner {
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 20px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    box-shadow: 0 1px 3px rgba(0, 140, 156, 0.25) !important;
    transition: all 0.2s ease !important;
}

.kyraAdminSaveBtn .sapMBtnContent,
.kyraAdminSaveBtn bdi,
.kyraAdminSaveBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraAdminSaveBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005A65 !important;
}

/* ========================================================================== */
/* 4. HEADER TOP-RIGHT ACTIONS: BELL, SIGN OUT & PROFILE AVATAR POLISH        */
/* ========================================================================== */

/* Notification Bell Wrapper: 40px aligned */
.kyraNotificationBellWrapper {
    position: relative !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 40px !important;
    width: 40px !important;
    min-width: 40px !important;
    margin-right: 12px !important;
    vertical-align: middle !important;
}

/* Bell Button */
.kyraHeaderBellBtn,
.kyraHeaderBellBtn.sapMBtn {
    padding: 0 !important;
    margin: 0 !important;
    height: 40px !important;
    width: 40px !important;
    min-width: 40px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
}

.kyraHeaderBellBtn .sapMBtnInner {
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    padding: 0 !important;
    border: 1.5px solid #CBD5E1 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.kyraHeaderBellBtn .sapUiIcon {
    font-size: 17px !important;
    color: #0F172A !important;
    line-height: 1 !important;
    transition: color 0.2s ease !important;
}

.kyraHeaderBellBtn:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.2) !important;
}

.kyraHeaderBellBtn:hover .sapUiIcon {
    color: #008C9C !important;
}

/* Crisp Red Notification Badge - No Blurry Halo */
.kyraNotificationBadge,
.kyraHeaderBellBadge {
    position: absolute !important;
    top: -3px !important;
    right: -3px !important;
    background: #EF4444 !important;
    background-color: #EF4444 !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 11px !important;
    line-height: 1 !important;
    letter-spacing: -0.01em !important;
    text-align: center !important;
    padding: 0 5px !important;
    border-radius: 9999px !important;
    min-width: 20px !important;
    height: 20px !important;
    border: 2px solid #FFFFFF !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
    pointer-events: none !important;
    z-index: 10 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
}

.kyraNotificationBadge .kyraNotificationBadgeText {
    color: #FFFFFF !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    line-height: 1 !important;
}

/* Sign Out Button - 40px Height, Clean Rounded Border & Teal Hover Glow */
.kyraSignOutHeaderBtn,
.kyraSignOutHeaderBtn.sapMBtn {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 0 !important;
    margin: 0 12px 0 0 !important;
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    cursor: pointer !important;
}

.kyraSignOutHeaderBtn .sapMBtnInner {
    border-radius: 10px !important;
    border: 1.5px solid #CBD5E1 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 20px !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    box-shadow: none !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraSignOutHeaderBtn .sapMBtnContent,
.kyraSignOutHeaderBtn bdi {
    color: #0F172A !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    transition: color 0.2s ease !important;
}

.kyraSignOutHeaderBtn:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.2) !important;
}

.kyraSignOutHeaderBtn:hover .sapMBtnContent,
.kyraSignOutHeaderBtn:hover bdi {
    color: #008C9C !important;
    font-weight: 700 !important;
}

/* Profile Avatar - 40px Diameter, Matching Bell */
.kyraHeaderProfileAvatar,
.kyraHeaderProfileAvatar.sapFAvatar,
.sapFShellBarProfile .kyraHeaderProfileAvatar {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    border-radius: 50% !important;
    border: 1.5px solid #CBD5E1 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.kyraHeaderProfileAvatar .sapUiIcon {
    font-size: 18px !important;
    color: #0F172A !important;
    transition: color 0.2s ease !important;
}

.kyraHeaderProfileAvatar:hover {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.2) !important;
}

.kyraHeaderProfileAvatar:hover .sapUiIcon {
    color: #008C9C !important;
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
        // Clean any old section
        const marker = '/* ==========================================================================\n/* KYRA THEMED DESIGN: USER PERSONA CONVERSION & HEADER ACTIONS POLISH';
        if (content.includes('KYRA THEMED DESIGN: USER PERSONA CONVERSION & HEADER ACTIONS POLISH')) {
            const idx = content.indexOf('/* KYRA THEMED DESIGN: USER PERSONA CONVERSION & HEADER ACTIONS POLISH');
            const priorComment = content.lastIndexOf('/* ===', idx);
            if (priorComment !== -1) {
                content = content.substring(0, priorComment);
            } else {
                content = content.substring(0, idx);
            }
        }
        if (content.includes('KYRA THEMED DESIGN: CLEAN NATIVE STYLING (NO EXTRA DESIGNS)')) {
            const idx = content.indexOf('/* ==========================================================================\n/* KYRA THEMED DESIGN: CLEAN NATIVE STYLING');
            if (idx !== -1) {
                content = content.substring(0, idx);
            }
        }
        content = content.trimEnd() + '\n\n' + cssRules.trim() + '\n';
        fs.writeFileSync(file, content, 'utf8');
        console.log('Successfully updated clean CSS in:', file);
    } else {
        console.log('File does not exist:', file);
    }
});
