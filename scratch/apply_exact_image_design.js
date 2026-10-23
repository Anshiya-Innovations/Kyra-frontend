const fs = require('fs');

// 1. Update CSS in webapp/css/style.css
const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetCssStart = '/* ========================================================================= */\r\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (KYRA BRAND THEMED & EQUAL ALIGNMENT)*/';
const targetCssStartLF = '/* ========================================================================= */\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (KYRA BRAND THEMED & EQUAL ALIGNMENT)*/';

let cssIdx = css.indexOf(targetCssStart);
let isCRLF = true;
if (cssIdx === -1) {
    cssIdx = css.indexOf(targetCssStartLF);
    isCRLF = false;
    if (cssIdx === -1) {
        console.error('Target CSS start not found!');
        process.exit(1);
    }
}

const newCssRules = `/* ========================================================================= */
/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (EXACT MATCH TO USER SPEC)           */
/* ========================================================================= */
.kyraAccessCustomizationTabBar,
.sapMFlexBox.kyraAccessCustomizationTabBar,
html body [id$="accessCustomizationSubTabBar"],
#accessCustomizationSubTabBar {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 10px !important;
    padding: 4px !important;
    margin-bottom: 20px !important;
    width: 100% !important;
    height: 52px !important;
    min-height: 52px !important;
    box-sizing: border-box !important;
    gap: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
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
    padding: 0 4px !important;
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    vertical-align: middle !important;
    position: relative !important;
}

/* Vertical divider lines between tabs (Image Match) */
.kyraCustomizationTabBtn:not(:last-child),
.kyraCustomizationTabBtn.sapMBtn:not(:last-child),
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(:last-child),
#accessCustomizationSubTabBar .sapMBtn:not(:last-child) {
    border-right: 1px solid #E2E8F0 !important;
}

/* Inner Pill Structure: Inactive State (Clean Transparent Segment) */
.kyraCustomizationTabBtn .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn .sapMBtnInner {
    width: 100% !important;
    height: 42px !important;
    min-height: 42px !important;
    border-radius: 8px !important;
    background: transparent !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    box-shadow: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Inactive Icon: Dark Slate #1E293B (Image Match) */
.kyraCustomizationTabBtn .sapUiIcon,
.kyraCustomizationTabBtn .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnIcon,
#accessCustomizationSubTabBar .sapMBtn .sapUiIcon {
    color: #1E293B !important;
    font-size: 16px !important;
    margin-right: 8px !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    transition: color 0.15s ease !important;
}

/* Inactive Text / Label: Dark Slate #1E293B (Image Match) */
.kyraCustomizationTabBtn .sapMBtnContent,
.kyraCustomizationTabBtn bdi,
.kyraCustomizationTabBtn .sapMBtnCustomText,
.kyraCustomizationTabBtn .sapMBtnInner .sapMBtnContent,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnContent,
#accessCustomizationSubTabBar .sapMBtn bdi {
    color: #1E293B !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    line-height: 1 !important;
    letter-spacing: 0.15px !important;
    white-space: nowrap !important;
    transition: color 0.15s ease !important;
}

/* Inactive Hover State */
.kyraCustomizationTabBtn:hover .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapMBtnInner {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #E2E8F0 !important;
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
/* ACTIVE TAB STATE: Solid KYRA Brand Teal Fill (#008C9C) Matching Image     */
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
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25) !important;
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
    font-weight: 600 !important;
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

/* Active Hover State */
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
}

/* Pressed / Active Click state */
.kyraCustomizationTabBtn:active .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn:active .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:active .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:active .sapMBtnInner {
    transform: scale(0.98) !important;
}

/* ========================================================================= */
/* UNIFIED BUSINESS SECTORS & FUNCTION DETAILS HEADER BAR (EXACT MATCH)      */
/* ========================================================================= */
.kyraAdminUnifiedCardHeader,
.sapMFlexBox.kyraAdminUnifiedCardHeader {
    padding: 16px 20px 14px 20px !important;
    border-bottom: 1px solid #F1F5F9 !important;
    box-sizing: border-box !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
}

.kyraAdminUnifiedHeaderLeftGroup,
.sapMFlexBox.kyraAdminUnifiedHeaderLeftGroup {
    display: inline-flex !important;
    align-items: center !important;
    gap: 14px !important;
    flex-shrink: 0 !important;
}

.kyraAdminUnifiedHeaderLeftGroup .kyraAdminCardTitle {
    margin: 0 !important;
    line-height: 36px !important;
    white-space: nowrap !important;
}

.kyraAdminUnifiedHeaderDivider {
    width: 1px !important;
    min-width: 1px !important;
    height: 28px !important;
    background: #CBD5E1 !important;
    background-color: #CBD5E1 !important;
    margin: 0 20px !important;
    flex-shrink: 0 !important;
    display: block !important;
}

.kyraAdminUnifiedHeaderRightGroup,
.sapMFlexBox.kyraAdminUnifiedHeaderRightGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    flex: 1 !important;
    min-width: 0 !important;
}

.kyraAdminUnifiedHeaderRightGroup .kyraAdminCardTitle {
    margin: 0 !important;
    line-height: 36px !important;
    white-space: nowrap !important;
}

/* Clean up card padding when unified header is present */
.kyraAdminUnifiedServiceCard {
    padding: 0 !important;
    overflow: hidden !important;
}

.kyraAdminUnifiedServiceCard .kyraAdminBottomSplitRow {
    padding: 16px 20px 20px 20px !important;
    box-sizing: border-box !important;
}
`;

const before = css.substring(0, cssIdx);
const eol = isCRLF ? '\r\n' : '\n';
const formattedRules = newCssRules.replace(/\r?\n/g, eol);
fs.writeFileSync(cssPath, before + formattedRules, 'utf8');
console.log('Successfully updated style.css with unified header & nav tab styling!');
