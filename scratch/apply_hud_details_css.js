const fs = require('fs');

const cssHud = `
/* ==========================================================================
   LIVE PIPELINE STREAM DROPDOWN & COMPLETE DETAILS SLIDE (FIX FOR IMAGE 2)
   ========================================================================== */

.kyraLiveStreamDropdown {
    background: #0B132B !important;
    background-color: #0B132B !important;
    border: 1.5px solid #1E2E4A !important;
    border-radius: 14px !important;
    padding: 24px 26px !important;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45) !important;
    width: 100% !important;
    box-sizing: border-box !important;
    animation: kyraFadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

.kyraHudHeaderRow {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
}

.kyraHudTitle {
    color: #FFFFFF !important;
    font-size: 16px !important;
    font-weight: 700 !important;
}

.kyraHudEnginePill {
    background: rgba(0, 140, 156, 0.16) !important;
    border: 1px solid #008C9C !important;
    border-radius: 9999px !important;
    padding: 3px 10px !important;
}

.kyraHudEnginePillText {
    color: #38BDF8 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
}

.kyraStatusDot {
    width: 10px !important;
    height: 10px !important;
    min-width: 10px !important;
    min-height: 10px !important;
    border-radius: 50% !important;
}

.kyraDotPulsing {
    background: #38BDF8 !important;
    box-shadow: 0 0 10px #38BDF8, 0 0 4px #38BDF8 !important;
    animation: kyraPulse 1.2s infinite ease-in-out !important;
}

.kyraDotSuccess {
    background: #10B981 !important;
    box-shadow: 0 0 10px #10B981, 0 0 4px #10B981 !important;
}

@keyframes kyraPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.6; }
}

.kyraHudBadgeActive {
    background: #1E293B !important;
    border: 1px solid #38BDF8 !important;
    color: #38BDF8 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    padding: 4px 12px !important;
    border-radius: 9999px !important;
}

.kyraHudBadgeSuccess {
    background: rgba(16, 185, 129, 0.15) !important;
    border: 1px solid #10B981 !important;
    color: #34D399 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    padding: 4px 12px !important;
    border-radius: 9999px !important;
}

.kyraHudCloseBtn.sapMBtn .sapMBtnInner {
    color: #94A3B8 !important;
}
.kyraHudCloseBtn.sapMBtn:hover .sapMBtnInner {
    color: #FFFFFF !important;
}

/* Progress Indicator */
.kyraHudProgressIndicator {
    height: 14px !important;
    border-radius: 7px !important;
    overflow: hidden !important;
}

.kyraHudProgressIndicator .sapMPIBar {
    background: #10B981 !important;
    background-color: #10B981 !important;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6) !important;
}

/* Stats Row */
.kyraHudStatsRow {
    background: #0E172E !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 8px !important;
    padding: 10px 16px !important;
    box-sizing: border-box !important;
    margin: 10px 0 16px 0 !important;
}

.kyraHudStatItem {
    color: #94A3B8 !important;
    font-size: 12.5px !important;
    font-weight: 500 !important;
}

/* Console Logs List */
.kyraHudConsoleBox {
    background: #080D1A !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 10px !important;
    padding: 12px 14px !important;
    max-height: 220px !important;
    overflow-y: auto !important;
    box-sizing: border-box !important;
}

.kyraHudLogCardList {
    background: transparent !important;
    border: none !important;
}

.kyraHudLogCardItem {
    background: transparent !important;
    border: none !important;
    padding: 4px 0 !important;
}

.kyraHudLogCardInner {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
}

.kyraHudLogIcon {
    color: #38BDF8 !important;
    font-size: 14px !important;
}

.kyraHudLogText {
    color: #E2E8F0 !important;
    font-size: 12.5px !important;
    font-family: 'Consolas', 'Courier New', monospace !important;
    line-height: 1.5 !important;
}

/* ==========================================================================
   DETAILS SLIDE BELOW (Fixing Image 2 Blank Screen!)
   ========================================================================== */

.kyraHudDetailsSlide {
    border-top: 1.5px solid #1E2E4A !important;
    padding-top: 20px !important;
    margin-top: 16px !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    animation: kyraFadeSlideIn 0.3s ease-out forwards !important;
}

.kyraHudSuccessCard {
    background: #0F1D38 !important;
    border: 1.5px solid #1E345E !important;
    border-radius: 10px !important;
    padding: 14px 18px !important;
    box-sizing: border-box !important;
}

.kyraHudSuccessIconBadge {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: rgba(16, 185, 129, 0.15) !important;
    border: 1.5px solid #10B981 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraHudCheckIcon {
    color: #34D399 !important;
    font-size: 18px !important;
}

.kyraHudSuccessTitle .sapMTitle,
.kyraHudSuccessTitle {
    color: #FFFFFF !important;
    font-size: 15.5px !important;
    font-weight: 700 !important;
    margin-bottom: 2px !important;
}

.kyraHudSuccessSubtitle {
    color: #94A3B8 !important;
    font-size: 13px !important;
    font-weight: 400 !important;
}

.kyraHudSuccessPill {
    background: rgba(16, 185, 129, 0.15) !important;
    border: 1px solid #10B981 !important;
    border-radius: 9999px !important;
    padding: 4px 14px !important;
}

.kyraHudSuccessPillText {
    color: #34D399 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
}

/* 4 KPI Metrics Tiles Row */
.kyraHudMetricsRow {
    display: flex !important;
    gap: 16px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraHudMetricTile {
    background: #111D35 !important;
    border: 1px solid #1E2E4A !important;
    border-radius: 10px !important;
    padding: 16px 18px !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    transition: transform 0.18s ease, border-color 0.18s ease !important;
}

.kyraHudMetricTile:hover {
    border-color: #38BDF8 !important;
    transform: translateY(-2px) !important;
}

.kyraHudMetricLabel {
    color: #94A3B8 !important;
    font-size: 12.5px !important;
    font-weight: 600 !important;
}

.kyraHudMetricIcon {
    color: #38BDF8 !important;
    font-size: 15px !important;
}

.kyraHudMetricValue {
    color: #38BDF8 !important;
    font-size: 26px !important;
    font-weight: 800 !important;
    letter-spacing: -0.02em !important;
    margin: 6px 0 2px 0 !important;
}

.kyraHudMetricSubtext {
    color: #64748B !important;
    font-size: 11.5px !important;
    font-weight: 500 !important;
}

/* Target Info Strip */
.kyraHudTargetInfoStrip {
    background: #0E172E !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 8px !important;
    padding: 10px 16px !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    box-sizing: border-box !important;
}

.kyraHudTargetStripIcon {
    color: #008C9C !important;
    font-size: 16px !important;
}

.kyraHudTargetStripText {
    color: #CBD5E1 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
}

/* Action Buttons */
.kyraHudDetailsActionBar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    padding-top: 14px !important;
    box-sizing: border-box !important;
}

.kyraHudAnotherBtn.sapMBtn .sapMBtnInner {
    background: transparent !important;
    border: 1.5px solid #334155 !important;
    border-radius: 8px !important;
    color: #94A3B8 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 16px !important;
}

.kyraHudAnotherBtn.sapMBtn:hover .sapMBtnInner {
    border-color: #64748B !important;
    color: #FFFFFF !important;
    background: #1E293B !important;
}

.kyraHudCloseTextBtn.sapMBtn .sapMBtnInner {
    color: #94A3B8 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
}

.kyraHudCloseTextBtn.sapMBtn:hover .sapMBtnInner {
    color: #FFFFFF !important;
}

.kyraHudDoneBtn.sapMBtn,
.kyraHudDoneBtn.sapMBtn .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 13.5px !important;
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 20px !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.3) !important;
}

.kyraHudDoneBtn.sapMBtn:hover .sapMBtnInner {
    background: #007684 !important;
    box-shadow: 0 6px 18px rgba(0, 140, 156, 0.4) !important;
    transform: translateY(-1px) !important;
}
`;

const cssFiles = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

cssFiles.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content += '\n' + cssHud;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Appended dropdown & details styles to:', f);
});

console.log('All CSS files updated successfully!');
