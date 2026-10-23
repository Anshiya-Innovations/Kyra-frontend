const fs = require('fs');

const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetIndex = css.indexOf('/* ========================================================================= */\r\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (IMAGE 2 MATCH)');

if (targetIndex === -1) {
    console.error('Target not found with CRLF, checking LF...');
    const targetIndexLF = css.indexOf('/* ========================================================================= */\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (IMAGE 2 MATCH)');
    if (targetIndexLF === -1) {
        console.error('Target block not found!');
        process.exit(1);
    }
}

const newCssBlock = `/* ========================================================================= */
/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (KYRA BRAND THEMED & EQUAL ALIGNMENT)*/
/* ========================================================================= */
.kyraAccessCustomizationTabBar,
.sapMFlexBox.kyraAccessCustomizationTabBar,
html body [id$="accessCustomizationSubTabBar"],
#accessCustomizationSubTabBar {
    background: #F1F5F9 !important;
    background-color: #F1F5F9 !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 6px !important;
    margin-bottom: 20px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    gap: 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05) !important;
}

/* Base Tab Button (Outer Button Wrapper): 4 Equal Width Columns (flex: 1) */
.kyraCustomizationTabBtn,
.kyraCustomizationTabBtn.sapMBtn,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn,
#accessCustomizationSubTabBar .sapMBtn {
    flex: 1 1 0 !important;
    width: 25% !important;
    min-width: 0 !important;
    max-width: 25% !important;
    height: 44px !important;
    min-height: 44px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    vertical-align: middle !important;
}

/* Inner Pill Structure: Inactive State (Crisp White Card Pill) */
.kyraCustomizationTabBtn .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn .sapMBtnInner {
    width: 100% !important;
    height: 44px !important;
    min-height: 44px !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Inactive Icon: Kyra Brand Teal */
.kyraCustomizationTabBtn .sapUiIcon,
.kyraCustomizationTabBtn .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnIcon,
#accessCustomizationSubTabBar .sapMBtn .sapUiIcon {
    color: #008C9C !important;
    font-size: 16px !important;
    margin-right: 8px !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    transition: color 0.2s ease !important;
}

/* Inactive Text / Label: Dark Slate */
.kyraCustomizationTabBtn .sapMBtnContent,
.kyraCustomizationTabBtn bdi,
.kyraCustomizationTabBtn .sapMBtnCustomText,
.kyraCustomizationTabBtn .sapMBtnInner .sapMBtnContent,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnContent,
#accessCustomizationSubTabBar .sapMBtn bdi {
    color: #334155 !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    line-height: 1 !important;
    letter-spacing: 0.2px !important;
    white-space: nowrap !important;
    transition: color 0.2s ease !important;
}

/* Inactive Hover State: Soft Mint Tint & Subtle Elevation */
.kyraCustomizationTabBtn:hover .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapMBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border-color: #008C9C !important;
    box-shadow: 0 3px 8px rgba(0, 140, 156, 0.18) !important;
    transform: translateY(-1px) !important;
}

.kyraCustomizationTabBtn:hover .sapMBtnContent,
.kyraCustomizationTabBtn:hover bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover bdi,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover bdi {
    color: #008C9C !important;
}

.kyraCustomizationTabBtn:hover .sapUiIcon,
.kyraCustomizationTabBtn:hover .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapUiIcon {
    color: #008C9C !important;
}

/* ========================================================================= */
/* ACTIVE TAB STATE: Solid KYRA Brand Teal Fill with Crisp White Content     */
/* ========================================================================= */
.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraCustomizationTabBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized .sapMBtnInner {
    background: linear-gradient(135deg, #008C9C 0%, #007684 100%) !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    box-shadow: 0 4px 12px rgba(0, 140, 156, 0.35) !important;
    transform: none !important;
}

.kyraCustomizationTabBtnActive .sapMBtnContent,
.kyraCustomizationTabBtnActive bdi,
.kyraCustomizationTabBtnActive .sapMBtnCustomText,
.kyraCustomizationTabBtnActive .sapMBtnInner .sapMBtnContent,
.kyraCustomizationTabBtn[data-active="true"] bdi,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnContent,
.kyraCustomizationTabBtn.sapMBtnEmphasized bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized bdi,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive bdi,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] bdi,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized bdi {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraCustomizationTabBtnActive .sapUiIcon,
.kyraCustomizationTabBtnActive .sapMBtnIcon,
.kyraCustomizationTabBtn[data-active="true"] .sapUiIcon,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnIcon,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized .sapUiIcon {
    color: #FFFFFF !important;
}

/* Active Hover State: Deep Teal Accent */
.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
.kyraCustomizationTabBtn[data-active="true"]:hover .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtnEmphasized:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"]:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"]:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.45) !important;
    transform: translateY(-1px) !important;
}

/* Pressed / Active Click state */
.kyraCustomizationTabBtn:active .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn:active .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:active .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:active .sapMBtnInner {
    transform: scale(0.98) !important;
}
`;

const idx = css.indexOf('/* ========================================================================= */\r\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (IMAGE 2 MATCH)');
const cleanIdx = idx !== -1 ? idx : css.indexOf('/* ========================================================================= */\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (IMAGE 2 MATCH)');

const before = css.substring(0, cleanIdx);
const eol = idx !== -1 ? '\r\n' : '\n';
const formattedBlock = newCssBlock.replace(/\r?\n/g, eol);

fs.writeFileSync(cssPath, before + formattedBlock, 'utf8');
console.log('Successfully updated style.css with Kyra themed sub-nav tab bar styles!');
