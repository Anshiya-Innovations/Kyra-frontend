const fs = require('fs');

const cssRules = `
/* ========================================================================== */
/* KYRA THEMED DESIGN: SLIDE 3 (LIVE STREAM CONSOLE) PROJECT THEME REVISION   */
/* ========================================================================== */

/* Main Container: Clean KYRA White Studio Card */
.kyraLiveStreamDropdown {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 2px solid #CBD5E1 !important;
    border-radius: 16px !important;
    padding: 28px 32px !important;
    box-sizing: border-box !important;
    box-shadow: 0 10px 35px -5px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04) !important;
}

/* Header Row */
.kyraHudHeaderRow {
    padding-bottom: 6px !important;
}

.kyraHudTitle {
    color: #0F172A !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    letter-spacing: -0.01em !important;
}

.kyraHudEnginePill {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 9999px !important;
    padding: 4px 14px !important;
    display: inline-flex !important;
    align-items: center !important;
}

.kyraHudEnginePillText {
    color: #008C9C !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
}

.kyraHudBadgeSuccess {
    color: #10B981 !important;
    font-weight: 700 !important;
    font-size: 13px !important;
}

.kyraHudCloseBtn .sapUiIcon {
    color: #64748B !important;
    font-size: 16px !important;
    transition: color 0.2s ease !important;
}

.kyraHudCloseBtn:hover .sapUiIcon {
    color: #0F172A !important;
}

/* Status Dot: Pulsing Emerald */
.kyraDotSuccess {
    width: 10px !important;
    height: 10px !important;
    border-radius: 50% !important;
    background: #10B981 !important;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
}

/* Progress Indicator */
.kyraHudProgressIndicator {
    border-radius: 8px !important;
    overflow: hidden !important;
    height: 16px !important;
    margin-bottom: 16px !important;
}

.kyraHudProgressIndicator .sapMPIBar {
    background: linear-gradient(90deg, #008C9C 0%, #10B981 100%) !important;
    border-radius: 8px !important;
}

/* Pipeline Metric Ribbon: Light Slate Container with Clean Contrast */
.kyraHudStatsRow {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #E2E8F0 !important;
    border-radius: 10px !important;
    padding: 12px 20px !important;
    margin-bottom: 16px !important;
    box-sizing: border-box !important;
}

.kyraHudStatItem {
    color: #334155 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: 'JetBrains Mono', 'Consolas', monospace !important;
}

/* Terminal Log Console: Crisp Light Slate Shell with White Cards */
.kyraHudConsoleBox {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 14px !important;
    margin-bottom: 20px !important;
    box-sizing: border-box !important;
}

.kyraHudLogCardItem {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 8px !important;
    margin-bottom: 8px !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
    overflow: hidden !important;
}

.kyraHudLogCardInner {
    padding: 10px 16px !important;
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
    line-height: 1.45 !important;
}

/* Success Summary Card */
.kyraHudSuccessCard {
    background: #F0FDF4 !important;
    background-color: #F0FDF4 !important;
    border: 1.5px solid #86EFAC !important;
    border-radius: 12px !important;
    padding: 18px 24px !important;
    margin-bottom: 18px !important;
    box-sizing: border-box !important;
}

.kyraHudSuccessIconBadge {
    background: #DCFCE7 !important;
    border: 1.5px solid #16A34A !important;
    border-radius: 50% !important;
    width: 38px !important;
    height: 38px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraHudCheckIcon {
    color: #16A34A !important;
    font-size: 18px !important;
}

.kyraHudSuccessTitle .sapMTitle,
.kyraHudSuccessTitle {
    color: #065F46 !important;
    font-size: 17px !important;
    font-weight: 700 !important;
    margin-bottom: 2px !important;
}

.kyraHudSuccessSubtitle {
    color: #1E293B !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
}

.kyraHudSuccessPill {
    background: #DCFCE7 !important;
    border: 1.5px solid #16A34A !important;
    border-radius: 9999px !important;
    padding: 5px 14px !important;
}

.kyraHudSuccessPillText {
    color: #15803D !important;
    font-weight: 700 !important;
    font-size: 12.5px !important;
}

/* 4 KPI Metric Tiles: Clean White Cards with KYRA Teal Data */
.kyraHudMetricTile {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 12px !important;
    padding: 18px 20px !important;
    box-sizing: border-box !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
}

.kyraHudMetricLabel {
    color: #475569 !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
}

.kyraHudMetricIcon {
    color: #008C9C !important;
    font-size: 18px !important;
}

.kyraHudMetricValue {
    color: #008C9C !important;
    font-size: 28px !important;
    font-weight: 800 !important;
    letter-spacing: -0.02em !important;
    margin: 8px 0 4px 0 !important;
}

.kyraHudMetricSubtext {
    color: #64748B !important;
    font-size: 12px !important;
    font-weight: 500 !important;
}

/* Destination Target Info Strip: KYRA Mint */
.kyraHudTargetInfoStrip {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #CCFBF1 !important;
    border-radius: 10px !important;
    padding: 12px 18px !important;
    margin-bottom: 20px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    box-sizing: border-box !important;
}

.kyraHudTargetStripIcon {
    color: #008C9C !important;
    font-size: 17px !important;
}

.kyraHudTargetStripText {
    color: #334155 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
}

/* Slide 3 Bottom Action Bar: Perfect 42px Alignment & "Done" Button */
.kyraHudDetailsActionBar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 20px !important;
    padding-top: 18px !important;
    border-top: 1px solid #E2E8F0 !important;
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

.kyraHudAnotherBtn:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    color: #008C9C !important;
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
    color: #64748B !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
    transition: color 0.2s ease !important;
}

.kyraHudCloseTextBtn:hover .sapMBtnInner,
.kyraHudCloseTextBtn:hover .sapUiIcon {
    color: #0F172A !important;
}

/* "Done" Button: Solid KYRA Teal */
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
    padding: 0 28px !important;
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

.kyraHudDoneBtn .sapUiIcon,
.kyraHudDoneBtn .sapMBtnContent,
.kyraHudDoneBtn bdi {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraHudDoneBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005A65 !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.4) !important;
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
        
        const marker = '/* KYRA THEMED DESIGN: SLIDE 3 (LIVE STREAM CONSOLE) PROJECT THEME REVISION */';
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
