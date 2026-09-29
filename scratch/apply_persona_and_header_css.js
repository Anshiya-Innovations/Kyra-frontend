const fs = require('fs');

const cssRules = `
/* ========================================================================== */
/* KYRA THEMED DESIGN: USER PERSONA CONVERSION & HEADER ACTIONS POLISH        */
/* ========================================================================== */

/* 1. User Persona Conversion Header Badge & Card */
.fioriCardAvatar.kyraBadgeTeal,
.kyraBadgeTeal.sapFAvatar {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    color: #008C9C !important;
    border-radius: 50% !important;
}

.fioriCardAvatar.kyraBadgeTeal .sapUiIcon,
.kyraBadgeTeal.sapFAvatar .sapUiIcon {
    color: #008C9C !important;
}

/* 2. User Persona Conversion Segmented Button */
.kyraPersonaSegmentedBtn,
.kyraPersonaSegmentedBtn.sapMSegB {
    background: #F1F5F9 !important;
    background-color: #F1F5F9 !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 12px !important;
    padding: 4px !important;
    display: inline-flex !important;
    gap: 6px !important;
    box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.04) !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn {
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 22px !important;
    min-width: 220px !important;
    width: auto !important;
    border: none !important;
    border-radius: 8px !important;
    background: transparent !important;
    background-color: transparent !important;
    color: #475569 !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    box-shadow: none !important;
    outline: none !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    cursor: pointer !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn .sapMSegBBtnInner {
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtnTxt {
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: nowrap !important;
    color: inherit !important;
    font-size: 13.5px !important;
    font-weight: inherit !important;
    display: inline-block !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn .sapUiIcon {
    font-size: 15px !important;
    margin-right: 8px !important;
    color: inherit !important;
    vertical-align: middle !important;
    transition: color 0.2s ease !important;
}

/* Hover on Inactive Item */
.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) {
    background: #E2E8F0 !important;
    background-color: #E2E8F0 !important;
    color: #008C9C !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtn:hover:not(.sapMSegBBtnSel) .sapUiIcon {
    color: #008C9C !important;
}

/* Selected Active Item */
.kyraPersonaSegmentedBtn .sapMSegBBtnSel,
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] {
    background: linear-gradient(135deg, #008C9C 0%, #007684 100%) !important;
    background-color: #008C9C !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.3) !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtnSel .sapMSegBBtnTxt,
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapMSegBBtnTxt,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapMSegBBtnTxt {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraPersonaSegmentedBtn .sapMSegBBtnSel .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn.sapMSegBBtnSel .sapUiIcon,
.kyraPersonaSegmentedBtn .sapMSegBBtn[aria-checked="true"] .sapUiIcon {
    color: #FFFFFF !important;
}

/* 3. Employee Login ID Container & Inputs */
.kyraAdminConflictEditContainer {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 20px 24px !important;
    box-sizing: border-box !important;
}

.kyraAdminFieldLabelRow {
    margin-bottom: 8px !important;
}

.kyraAdminFormLabel {
    font-size: 11.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    color: #334155 !important;
    text-transform: uppercase !important;
}

.kyraAdminRequiredStar {
    color: #EF4444 !important;
    font-weight: 700 !important;
    margin-left: 3px !important;
}

/* Input Field */
#adminPersonaLookupInput,
.kyraAdminFormInput.kyraAdminBuilderInput {
    height: 42px !important;
    border-radius: 8px !important;
    border: 1.5px solid #CBD5E1 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    transition: all 0.2s ease !important;
}

#adminPersonaLookupInput .sapMInputBaseInner,
.kyraAdminFormInput.kyraAdminBuilderInput .sapMInputBaseInner {
    height: 40px !important;
    font-size: 13.5px !important;
    color: #0F172A !important;
    padding: 0 14px !important;
}

#adminPersonaLookupInput.sapMFocus,
#adminPersonaLookupInput:focus-within,
.kyraAdminFormInput.kyraAdminBuilderInput.sapMFocus {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
}

/* Enter Button */
.kyraAdminSaveBtn.sapMBtn,
.kyraAdminSaveBtn {
    height: 42px !important;
    border-radius: 8px !important;
    overflow: hidden !important;
}

.kyraAdminSaveBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 42px !important;
    padding: 0 22px !important;
    background: linear-gradient(135deg, #008C9C 0%, #007684 100%) !important;
    background-color: #008C9C !important;
    border: none !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.28) !important;
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
    box-shadow: 0 4px 12px rgba(0, 140, 156, 0.4) !important;
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18) !important;
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

/* Sign Out Button - 40px Height, Sleek Rounded Border & Teal Hover Glow */
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

/* Profile Avatar - 40px Diameter, Perfect Match */
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
        // Clean any old section if previously added
        const marker = '/* KYRA THEMED DESIGN: USER PERSONA CONVERSION & HEADER ACTIONS POLISH */';
        if (content.includes(marker)) {
            const parts = content.split('/* ==========================================================================\n   KYRA THEMED DESIGN: USER PERSONA CONVERSION & HEADER ACTIONS POLISH');
            content = parts[0];
        }
        content = content + '\n' + cssRules + '\n';
        fs.writeFileSync(file, content, 'utf8');
        console.log('Successfully updated CSS in:', file);
    } else {
        console.log('File does not exist:', file);
    }
});
