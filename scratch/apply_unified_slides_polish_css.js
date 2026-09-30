const fs = require('fs');

const cssRules = `
/* ========================================================================== */
/* KYRA THEMED DESIGN: COMPLETE 3-SLIDE ALIGNMENT, BUTTONS, GAPS & THEMES     */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/* SLIDE 1: CONFIGURE DATABASE CONNECTIONS                                    */
/* -------------------------------------------------------------------------- */

/* Target Destination Banner (Mint Accent) */
.kyraDarkTargetBanner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #CCFBF1 !important;
    border-radius: 12px !important;
    padding: 12px 18px !important;
    box-sizing: border-box !important;
    margin-bottom: 20px !important;
}

.kyraDarkTargetText {
    color: #334155 !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
}

.kyraDarkTargetHighlight {
    color: #008C9C !important;
    font-weight: 700 !important;
}

/* Target Status Pill */
.kyraDarkTargetPill {
    background: #FFFFFF !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 9999px !important;
    padding: 5px 14px !important;
}

.kyraDarkTargetPillText {
    color: #008C9C !important;
    font-weight: 700 !important;
    font-size: 12.5px !important;
}

/* Source Database Extract Card */
.kyraDarkFormCard {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 14px !important;
    padding: 24px 28px !important;
    box-sizing: border-box !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05) !important;
    margin-bottom: 22px !important;
}

.kyraDarkCardTitle {
    color: #0F172A !important;
    font-size: 16px !important;
    font-weight: 700 !important;
}

.kyraDarkCardStatusBadge {
    color: #64748B !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

/* Form Inputs & Select in Slide 1 */
.kyraDarkInput.sapMInputBase,
.kyraDarkInput,
.kyraDarkSelect.sapMSlt,
.kyraDarkSelect {
    height: 42px !important;
    margin-bottom: 14px !important;
    border: none !important;
    background: transparent !important;
}

.kyraDarkInput .sapMInputBaseContentWrapper,
.kyraDarkSelect.sapMSlt {
    height: 42px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
}

.kyraDarkInput .sapMInputBaseInner,
.kyraDarkSelect .sapMSltLabel {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 13.5px !important;
    color: #0F172A !important;
    padding: 0 14px !important;
}

.kyraDarkSelect .sapMSltArrow {
    color: #008C9C !important;
    border: none !important;
}

.kyraDarkInput.sapMFocus .sapMInputBaseContentWrapper,
.kyraDarkInput .sapMInputBaseContentWrapper:focus-within,
.kyraDarkSelect.sapMSlt:focus,
.kyraDarkSelect.sapMSlt.sapMFocus {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
}

/* Test Connection Button: Full Width, Subtle Mint, Teal Border & Hover Glow */
.kyraDarkTestConnBtn.sapMBtn,
.kyraDarkTestConnBtn {
    height: 44px !important;
    margin-top: 14px !important;
    margin-bottom: 4px !important;
    border: none !important;
    background: transparent !important;
}

.kyraDarkTestConnBtn .sapMBtnInner {
    height: 44px !important;
    line-height: 42px !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 8px !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    box-shadow: 0 1px 3px rgba(0, 140, 156, 0.15) !important;
    transition: all 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraDarkTestConnBtn .sapMBtnContent,
.kyraDarkTestConnBtn bdi,
.kyraDarkTestConnBtn .sapUiIcon {
    color: #008C9C !important;
    font-weight: 700 !important;
}

.kyraDarkTestConnBtn:hover .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border-color: #007684 !important;
    color: #FFFFFF !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.3) !important;
}

.kyraDarkTestConnBtn:hover .sapMBtnContent,
.kyraDarkTestConnBtn:hover bdi,
.kyraDarkTestConnBtn:hover .sapUiIcon {
    color: #FFFFFF !important;
}

/* Slide 1 Bottom Action Bar: Perfect 42px Alignment */
.kyraDarkBottomBar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 18px !important;
    padding-top: 16px !important;
    border-top: 1px solid #E2E8F0 !important;
}

.kyraDarkBackLinkBtn.sapMBtn,
.kyraDarkBackLinkBtn {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraDarkBackLinkBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 20px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraDarkBackLinkBtn:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
}

.kyraDarkContinueBtn.sapMBtn,
.kyraDarkContinueBtn {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraDarkContinueBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 24px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.3) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraDarkContinueBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    box-shadow: 0 4px 12px rgba(0, 140, 156, 0.4) !important;
}

/* -------------------------------------------------------------------------- */
/* SLIDE 2: SCHEMA & COLUMN POSITIONAL MAPPING                                */
/* -------------------------------------------------------------------------- */

/* Verify Target Destination Button: Clean KYRA Mint & Teal - NO BLUE */
.kyraVerifyDestLinkBtn.sapMBtn,
.kyraVerifyDestLinkBtn {
    height: 36px !important;
    margin-top: 6px !important;
    border: none !important;
    background: transparent !important;
}

.kyraVerifyDestLinkBtn .sapMBtnInner {
    height: 36px !important;
    line-height: 34px !important;
    padding: 0 16px !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 6px !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraVerifyDestLinkBtn .sapUiIcon,
.kyraVerifyDestLinkBtn .sapMBtnContent,
.kyraVerifyDestLinkBtn bdi {
    color: #008C9C !important;
    font-weight: 600 !important;
}

.kyraVerifyDestLinkBtn:hover .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border-color: #007684 !important;
    color: #FFFFFF !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.25) !important;
}

.kyraVerifyDestLinkBtn:hover .sapUiIcon,
.kyraVerifyDestLinkBtn:hover .sapMBtnContent,
.kyraVerifyDestLinkBtn:hover bdi {
    color: #FFFFFF !important;
}

/* Add Column & Auto-Map Buttons */
.kyraStep2OutlineActionBtn.sapMBtn,
.kyraStep2OutlineActionBtn {
    height: 36px !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraStep2OutlineActionBtn .sapMBtnInner {
    height: 36px !important;
    line-height: 34px !important;
    padding: 0 16px !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #008C9C !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    transition: all 0.2s ease !important;
}

.kyraStep2OutlineActionBtn:hover .sapMBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.2) !important;
}

/* Column Mapping Table: Clean Rows & Inputs */
.kyraStep2CleanInput.sapMInputBase,
.kyraStep2CleanInput {
    height: 38px !important;
    border: none !important;
    background: transparent !important;
}

.kyraStep2CleanInput .sapMInputBaseContentWrapper {
    height: 38px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 6px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
}

.kyraStep2CleanInput.sapMFocus .sapMInputBaseContentWrapper,
.kyraStep2CleanInput .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
}

.kyraCleanTargetInput.sapMInputBase,
.kyraCleanTargetInput {
    height: 36px !important;
    border: none !important;
    background: transparent !important;
}

.kyraCleanTargetInput .sapMInputBaseContentWrapper {
    height: 36px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 6px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
}

.kyraCleanTargetInput.sapMFocus .sapMInputBaseContentWrapper,
.kyraCleanTargetInput .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 2px rgba(0, 140, 156, 0.2) !important;
}

/* Data Type Pill */
.kyraCleanTypePill {
    background: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 9999px !important;
    padding: 4px 12px !important;
    display: inline-flex !important;
}

.kyraCleanTypePillText {
    color: #008C9C !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
}

/* Delete Column Button */
.kyraCleanDeleteBtn .sapUiIcon {
    color: #64748B !important;
    transition: color 0.2s ease !important;
}

.kyraCleanDeleteBtn:hover .sapUiIcon {
    color: #EF4444 !important;
}

/* Slide 2 Bottom Action Bar: Matching 42px Alignment */
.kyraStep2BottomActionBar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 24px !important;
    padding-top: 18px !important;
    border-top: 1px solid #E2E8F0 !important;
}

/* Back to Connections: Proper Outline Button (NO RAW LINK) */
.kyraStep2BackLink.sapMBtn,
.kyraStep2BackLink {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraStep2BackLink .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 20px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraStep2BackLink:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
}

/* Migrate Data Button: Solid Teal */
.kyraStep2MigrateBtn.sapMBtn,
.kyraStep2MigrateBtn {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraStep2MigrateBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 26px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.3) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraStep2MigrateBtn .sapUiIcon,
.kyraStep2MigrateBtn .sapMBtnContent,
.kyraStep2MigrateBtn bdi {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraStep2MigrateBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.4) !important;
}

/* -------------------------------------------------------------------------- */
/* SLIDE 3: LIVE DATABRIDGE PIPELINE STREAM CONSOLE                           */
/* -------------------------------------------------------------------------- */

/* Dropdown Container */
.kyraLiveStreamDropdown {
    background: #0B132B !important;
    background-color: #0B132B !important;
    border: 1.5px solid #1E293B !important;
    border-radius: 16px !important;
    padding: 24px 28px !important;
    box-sizing: border-box !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
}

.kyraHudTitle {
    color: #FFFFFF !important;
    font-size: 17px !important;
    font-weight: 700 !important;
}

.kyraHudEnginePill {
    background: rgba(0, 140, 156, 0.2) !important;
    border: 1px solid #008C9C !important;
    border-radius: 9999px !important;
    padding: 3px 12px !important;
}

.kyraHudEnginePillText {
    color: #38BDF8 !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
}

/* Pipeline Metric Ribbon */
.kyraHudStatsRow {
    background: rgba(15, 23, 42, 0.7) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    padding: 10px 18px !important;
}

.kyraHudStatItem {
    color: #E2E8F0 !important;
    font-size: 12.5px !important;
    font-weight: 600 !important;
    font-family: 'JetBrains Mono', 'Consolas', monospace !important;
}

/* Terminal Log Console: Crisp White Pill Cards with High-Contrast Dark Text */
.kyraHudConsoleBox {
    background: rgba(0, 0, 0, 0.25) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 10px !important;
    padding: 12px !important;
    margin-bottom: 20px !important;
}

.kyraHudLogCardItem {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 8px !important;
    margin-bottom: 8px !important;
    padding: 0 !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08) !important;
    overflow: hidden !important;
}

.kyraHudLogCardInner {
    padding: 8px 14px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
}

.kyraHudLogIcon {
    font-size: 16px !important;
    color: #008C9C !important;
}

.kyraHudLogText {
    color: #0F172A !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: 'JetBrains Mono', 'Consolas', monospace !important;
    line-height: 1.4 !important;
}

/* Pipeline Success Card */
.kyraHudSuccessCard {
    background: rgba(16, 185, 129, 0.14) !important;
    border: 1.5px solid rgba(16, 185, 129, 0.35) !important;
    border-radius: 12px !important;
    padding: 18px 22px !important;
}

.kyraHudSuccessTitle {
    color: #FFFFFF !important;
    font-size: 17px !important;
    font-weight: 700 !important;
}

.kyraHudSuccessSubtitle {
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 13.5px !important;
}

.kyraHudSuccessPill {
    background: rgba(16, 185, 129, 0.25) !important;
    border: 1px solid #10B981 !important;
    border-radius: 9999px !important;
    padding: 5px 14px !important;
}

.kyraHudSuccessPillText {
    color: #34D399 !important;
    font-weight: 700 !important;
    font-size: 12.5px !important;
}

/* 4 KPI Metric Tiles */
.kyraHudMetricTile {
    background: rgba(15, 23, 42, 0.75) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 10px !important;
    padding: 16px 18px !important;
    transition: transform 0.2s ease !important;
}

.kyraHudMetricLabel {
    color: #94A3B8 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.03em !important;
}

.kyraHudMetricValue {
    color: #38BDF8 !important;
    font-size: 26px !important;
    font-weight: 800 !important;
    margin: 8px 0 4px 0 !important;
}

.kyraHudMetricSubtext {
    color: #64748B !important;
    font-size: 11.5px !important;
}

/* Destination Target Info Strip */
.kyraHudTargetInfoStrip {
    background: rgba(15, 23, 42, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 8px !important;
    padding: 10px 16px !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
}

.kyraHudTargetStripIcon {
    color: #38BDF8 !important;
    font-size: 16px !important;
}

.kyraHudTargetStripText {
    color: #CBD5E1 !important;
    font-size: 12.5px !important;
    font-weight: 500 !important;
}

/* Slide 3 Bottom Action Bar: Matching 42px Alignment */
.kyraHudDetailsActionBar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 18px !important;
    padding-top: 16px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.kyraHudAnotherBtn.sapMBtn,
.kyraHudAnotherBtn {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraHudAnotherBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 20px !important;
    border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
    border-radius: 8px !important;
    background: rgba(255, 255, 255, 0.08) !important;
    background-color: rgba(255, 255, 255, 0.08) !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraHudAnotherBtn:hover .sapMBtnInner {
    background: rgba(255, 255, 255, 0.16) !important;
    border-color: #008C9C !important;
}

.kyraHudCloseTextBtn.sapMBtn,
.kyraHudCloseTextBtn {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraHudCloseTextBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 16px !important;
    color: #94A3B8 !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
    transition: color 0.2s ease !important;
}

.kyraHudCloseTextBtn:hover .sapMBtnInner,
.kyraHudCloseTextBtn:hover .sapUiIcon {
    color: #FFFFFF !important;
}

.kyraHudDoneBtn.sapMBtn,
.kyraHudDoneBtn {
    height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraHudDoneBtn .sapMBtnInner {
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 24px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.4) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.kyraHudDoneBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.5) !important;
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
        
        const marker = '/* KYRA THEMED DESIGN: COMPLETE 3-SLIDE ALIGNMENT, BUTTONS, GAPS & THEMES */';
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
