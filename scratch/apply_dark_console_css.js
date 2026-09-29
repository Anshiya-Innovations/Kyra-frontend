const fs = require('fs');

const cssContent = `
/* ==========================================================================
   DARK NAVY CONSOLE DESIGN (MATCHING media_1790669797150.png EXACTLY)
   ========================================================================== */

.kyraDarkStudioWrapper {
    background: #080D1A !important;
    background-color: #080D1A !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 16px !important;
    padding: 32px 36px !important;
    box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.6) !important;
    box-sizing: border-box !important;
    max-width: 1040px !important;
    width: 100% !important;
    margin: 10px auto 32px auto !important;
}

.kyraDarkStudioSlide {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
}

.kyraDarkTitleBlock {
    margin-bottom: 20px !important;
}

.kyraDarkStudioTitle .sapMTitle,
.kyraDarkStudioTitle {
    color: #FFFFFF !important;
    font-size: 21px !important;
    font-weight: 700 !important;
    letter-spacing: -0.015em !important;
    margin-bottom: 4px !important;
}

.kyraDarkStudioSubtitle {
    color: #94A3B8 !important;
    font-size: 13.5px !important;
    line-height: 1.55 !important;
    font-weight: 400 !important;
}

/* Target Destination Banner */
.kyraDarkTargetBanner {
    background: #0D1B2E !important;
    background-color: #0D1B2E !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 8px !important;
    padding: 12px 18px !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
}

.kyraDarkTargetBannerLeft {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
}

.kyraDarkGreenGlowDot {
    width: 9px !important;
    height: 9px !important;
    min-width: 9px !important;
    min-height: 9px !important;
    border-radius: 50% !important;
    background: #10B981 !important;
    box-shadow: 0 0 10px #10B981, 0 0 4px #10B981 !important;
}

.kyraDarkBannerFormattedText {
    display: inline-block !important;
}

.kyraDarkGreenPillBadge {
    background: rgba(16, 185, 129, 0.12) !important;
    background-color: rgba(16, 185, 129, 0.12) !important;
    border: 1px solid #059669 !important;
    border-radius: 9999px !important;
    padding: 4px 14px !important;
    white-space: nowrap !important;
}

.kyraDarkGreenPillText {
    color: #34D399 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 0.02em !important;
}

.kyraDarkGrayPillBadge {
    background: rgba(148, 163, 184, 0.12) !important;
    background-color: rgba(148, 163, 184, 0.12) !important;
    border: 1px solid #475569 !important;
    border-radius: 9999px !important;
    padding: 4px 14px !important;
    white-space: nowrap !important;
}

.kyraDarkGrayPillText {
    color: #94A3B8 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
}

/* Main Form Card */
.kyraDarkFormCard {
    background: #111D35 !important;
    background-color: #111D35 !important;
    border: 1px solid #1E2E4A !important;
    border-radius: 12px !important;
    padding: 24px 28px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35) !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

.kyraDarkCardHeader {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    margin-bottom: 20px !important;
}

.kyraDarkCardHeaderIcon {
    color: #CBD5E1 !important;
    font-size: 16px !important;
}

.kyraDarkCardHeaderTitle .sapMTitle,
.kyraDarkCardHeaderTitle {
    color: #FFFFFF !important;
    font-size: 15.5px !important;
    font-weight: 700 !important;
}

/* Status Badges */
.kyraDarkStatusBadgeNotConnected {
    background: #182642 !important;
    border: 1px solid #2B3D5E !important;
    border-radius: 6px !important;
    padding: 4px 12px !important;
}

.kyraDarkStatusBadgeConnected {
    background: rgba(16, 185, 129, 0.16) !important;
    border: 1px solid #10B981 !important;
    border-radius: 6px !important;
    padding: 4px 12px !important;
}

.kyraDarkStatusBadgeText {
    color: #94A3B8 !important;
    font-size: 12px !important;
    font-weight: 500 !important;
}

.kyraDarkStatusBadgeConnected .kyraDarkStatusBadgeText {
    color: #34D399 !important;
    font-weight: 600 !important;
}

/* Field Group & Labels */
.kyraDarkFieldGroup {
    display: flex !important;
    flex-direction: column !important;
    margin-bottom: 16px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraDarkLabelRow {
    display: flex !important;
    align-items: center !important;
    margin-bottom: 6px !important;
}

.kyraDarkFieldLabel {
    color: #CBD5E1 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    margin-bottom: 6px !important;
    display: block !important;
}

.kyraDarkRequiredStar {
    color: #38BDF8 !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    margin-left: 2px !important;
}

.kyraDarkFieldRow {
    display: flex !important;
    gap: 16px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

/* Inputs & Select Elements inside Dark Console */
.kyraDarkInput .sapMInputBaseInner,
.kyraDarkSelect .sapMSlt {
    background: #0A1224 !important;
    background-color: #0A1224 !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 6px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    height: 40px !important;
    padding: 0 14px !important;
    box-sizing: border-box !important;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    transition: border-color 0.16s ease, box-shadow 0.16s ease !important;
}

.kyraDarkInput .sapMInputBaseInner::placeholder {
    color: #64748B !important;
    opacity: 0.8 !important;
}

.kyraDarkInput .sapMInputBaseInner:focus,
.kyraDarkSelect .sapMSlt:focus {
    border-color: #38BDF8 !important;
    box-shadow: 0 0 0 1px #38BDF8, inset 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    background-color: #0C162E !important;
}

.kyraDarkSelect .sapMSltLabel {
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    line-height: 38px !important;
}

.kyraDarkSelect .sapMSltArrow {
    color: #94A3B8 !important;
}

/* Checkbox */
.kyraDarkCheckboxRow {
    margin: 10px 0 20px 0 !important;
    display: flex !important;
    align-items: center !important;
}

.kyraDarkCheckbox .sapMCbLabel {
    color: #CBD5E1 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
}

.kyraDarkCheckbox .sapMCbBg {
    background-color: #0A1224 !important;
    border: 1px solid #1E2D4A !important;
    border-radius: 4px !important;
}

.kyraDarkCheckbox.sapMCbMarkChecked .sapMCbBg {
    background-color: #2563EB !important;
    border-color: #2563EB !important;
}

/* Test Connection Button (⚡ Test Source Connection) */
.kyraDarkTestConnBtn.sapMBtn,
.kyraDarkTestConnBtn.sapMBtn .sapMBtnInner {
    background: #15223D !important;
    background-color: #15223D !important;
    border: 1px solid #233554 !important;
    border-radius: 8px !important;
    height: 42px !important;
    line-height: 40px !important;
    color: #93C5FD !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    width: 100% !important;
    transition: all 0.18s ease !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
}

.kyraDarkTestConnBtn.sapMBtn .sapMBtnContent,
.kyraDarkTestConnBtn.sapMBtn bdi {
    color: #93C5FD !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
}

.kyraDarkTestConnBtn.sapMBtn:hover .sapMBtnInner {
    background: #1E3056 !important;
    background-color: #1E3056 !important;
    border-color: #3B82F6 !important;
    color: #BFDBFE !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25) !important;
}

/* Bottom Action Bar */
.kyraDarkBottomBar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding-top: 18px !important;
    border-top: 1px solid #1E2E4A !important;
    margin-top: 12px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraDarkBackLinkBtn.sapMBtn .sapMBtnInner {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: #94A3B8 !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
    padding: 0 8px !important;
    height: 38px !important;
    line-height: 38px !important;
}

.kyraDarkBackLinkBtn.sapMBtn:hover .sapMBtnInner {
    color: #FFFFFF !important;
}

.kyraDarkBackLinkBtn.sapMBtn .sapMBtnContent,
.kyraDarkBackLinkBtn.sapMBtn bdi {
    color: inherit !important;
    font-weight: 500 !important;
}

.kyraDarkPromptBox {
    display: flex !important;
    align-items: center !important;
}

.kyraDarkPromptHint {
    color: #94A3B8 !important;
    font-size: 13px !important;
}

.kyraDarkPromptTarget {
    color: #FFFFFF !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    margin-left: 4px !important;
}

/* Continue to Step 2 Button */
.kyraDarkContinueBtn.sapMBtn,
.kyraDarkContinueBtn.sapMBtn .sapMBtnInner {
    background: #2563EB !important;
    background-color: #2563EB !important;
    border: 1px solid #1D4ED8 !important;
    border-radius: 6px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    height: 40px !important;
    line-height: 38px !important;
    padding: 0 20px !important;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35) !important;
    transition: all 0.18s ease !important;
}

.kyraDarkContinueBtn.sapMBtn .sapMBtnContent,
.kyraDarkContinueBtn.sapMBtn bdi {
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
}

.kyraDarkContinueBtn.sapMBtn:hover .sapMBtnInner {
    background: #1D4ED8 !important;
    background-color: #1D4ED8 !important;
    border-color: #1E40AF !important;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45) !important;
    transform: translateY(-1px) !important;
}
`;

const files = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content += '\n' + cssContent;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Appended dark theme CSS to:', f);
});
console.log('All CSS files updated successfully!');
