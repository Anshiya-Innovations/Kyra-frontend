const fs = require('fs');

const css = `
/* ==========================================================================
   IN-PLACE SAME-PAGE SLIDE TRANSITION (DATABASE CONFIGURATION & MIGRATION)
   ========================================================================== */

.kyraStratSelectionContainer {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    animation: kyraFadeSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

.kyraMigrationDetailsContainer {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    animation: kyraFadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

@keyframes kyraFadeSlideIn {
    0% {
        opacity: 0;
        transform: translateY(14px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Top Navigation Bar inside Next Details View */
.kyraDetailsTopBar {
    background: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 12px !important;
    padding: 8px 18px !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05) !important;
    margin-bottom: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraBackToStratBtn.sapMBtn .sapMBtnInner {
    background: #F8FAFC !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #1E293B !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    padding: 0 14px !important;
    height: 36px !important;
    line-height: 34px !important;
    transition: all 0.16s ease !important;
}

.kyraBackToStratBtn.sapMBtn:hover .sapMBtnInner {
    background: #F0FDFA !important;
    border-color: #008C9C !important;
    color: #008C9C !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.15) !important;
}

.kyraBackToStratBtn.sapMBtn .sapMBtnContent,
.kyraBackToStratBtn.sapMBtn bdi {
    color: inherit !important;
    font-weight: 600 !important;
}

.kyraStratTopBadgeGroup {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
}

.kyraStratBarLabel {
    color: #64748B !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

.kyraStratPillBadgeTeal {
    background: #E6F7F7 !important;
    border: 1.5px solid #80DEEA !important;
    border-radius: 9999px !important;
    padding: 5px 14px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
}

.kyraStratPillBadgeTeal .kyraStratPillIcon {
    color: #008C9C !important;
    font-size: 14px !important;
}

.kyraStratPillBadgeTeal .kyraStratPillText {
    color: #007684 !important;
    font-size: 12.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.01em !important;
}

.kyraStratPillBadgeGreen {
    background: #ECFDF5 !important;
    border: 1.5px solid #A7F3D0 !important;
    border-radius: 9999px !important;
    padding: 5px 14px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
}

.kyraStratPillBadgeGreen .kyraStratPillIcon {
    color: #059669 !important;
    font-size: 14px !important;
}

.kyraStratPillBadgeGreen .kyraStratPillText {
    color: #047857 !important;
    font-size: 12.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.01em !important;
}

.kyraSwitchStratBtn.sapMBtn .sapMBtnInner {
    background: #FFFFFF !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 8px !important;
    color: #008C9C !important;
    font-weight: 600 !important;
    font-size: 12.5px !important;
    height: 34px !important;
    line-height: 32px !important;
    padding: 0 12px !important;
    transition: all 0.16s ease !important;
}

.kyraSwitchStratBtn.sapMBtn:hover .sapMBtnInner {
    background: #008C9C !important;
    color: #FFFFFF !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.25) !important;
}

.kyraSwitchStratBtn.sapMBtn .sapMBtnContent,
.kyraSwitchStratBtn.sapMBtn bdi {
    color: inherit !important;
    font-weight: 600 !important;
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
    content += '\n' + css;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Appended top bar and animation CSS to:', f);
});
