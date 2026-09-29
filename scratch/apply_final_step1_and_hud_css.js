const fs = require('fs');

const cssPreview3pm = `
/* ==========================================================================
   AUTHENTIC KYRA PROJECT THEMED DATABASE CONFIGURATION SLIDE (PREVIEW 3 PM)
   ========================================================================== */

/* Outer Studio Wrapper (Clean, Elevated Modern KYRA White Card) */
.kyraDarkStudioWrapper,
.sapMFlexBox.kyraDarkStudioWrapper {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 2px solid #CBD5E1 !important;
    border-radius: 16px !important;
    padding: 32px 36px !important;
    box-shadow: 0 8px 30px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.04) !important;
    box-sizing: border-box !important;
    max-width: 1080px !important;
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
    margin-bottom: 22px !important;
}

.kyraDarkStudioTitle .sapMTitle,
.kyraDarkStudioTitle {
    color: #0F172A !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    letter-spacing: -0.015em !important;
    margin-bottom: 4px !important;
}

.kyraDarkStudioSubtitle {
    color: #64748B !important;
    font-size: 14px !important;
    line-height: 1.55 !important;
    font-weight: 400 !important;
}

/* Target Destination Banner (KYRA Mint & Teal) */
.kyraDarkTargetBanner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 10px !important;
    padding: 13px 20px !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.08) !important;
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
    background: #008C9C !important;
    box-shadow: 0 0 8px #008C9C, 0 0 2px #008C9C !important;
}

.kyraDarkBannerFormattedText {
    display: inline-block !important;
}

.kyraDarkGreenPillBadge {
    background: #ECFDF5 !important;
    background-color: #ECFDF5 !important;
    border: 1.5px solid #10B981 !important;
    border-radius: 9999px !important;
    padding: 4px 14px !important;
    white-space: nowrap !important;
}

.kyraDarkGreenPillText {
    color: #047857 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
}

.kyraDarkGrayPillBadge {
    background: #F1F5F9 !important;
    background-color: #F1F5F9 !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 9999px !important;
    padding: 4px 14px !important;
    white-space: nowrap !important;
}

.kyraDarkGrayPillText {
    color: #475569 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
}

/* Main Form Card */
.kyraDarkFormCard {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 12px !important;
    padding: 24px 28px !important;
    box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04) !important;
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
    color: #008C9C !important;
    font-size: 18px !important;
}

.kyraDarkCardHeaderTitle .sapMTitle,
.kyraDarkCardHeaderTitle {
    color: #0F172A !important;
    font-size: 16px !important;
    font-weight: 700 !important;
}

/* Status Badges */
.kyraDarkStatusBadgeNotConnected {
    background: #F1F5F9 !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 6px !important;
    padding: 4px 12px !important;
}

.kyraDarkStatusBadgeConnected {
    background: #ECFDF5 !important;
    border: 1px solid #10B981 !important;
    border-radius: 6px !important;
    padding: 4px 12px !important;
}

.kyraDarkStatusBadgeText {
    color: #64748B !important;
    font-size: 12px !important;
    font-weight: 600 !important;
}

.kyraDarkStatusBadgeConnected .kyraDarkStatusBadgeText {
    color: #047857 !important;
    font-weight: 700 !important;
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
    color: #1E293B !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    margin-bottom: 6px !important;
    display: block !important;
}

.kyraDarkRequiredStar {
    color: #008C9C !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    margin-left: 3px !important;
}

.kyraDarkFieldRow {
    display: flex !important;
    gap: 16px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

/* Input Fields (Clean light background with crisp border and teal focus) */
.kyraDarkInput,
.kyraDarkInput.sapMInputBase,
.kyraDarkInput .sapMInputBaseContentWrapper {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    height: 42px !important;
    box-sizing: border-box !important;
    box-shadow: none !important;
    padding: 0 !important;
    width: 100% !important;
    transition: all 0.16s ease !important;
}

.kyraDarkInput .sapMInputBaseInner {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    color: #0F172A !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 14px !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

.kyraDarkInput .sapMInputBaseInner::placeholder {
    color: #94A3B8 !important;
    opacity: 1 !important;
}

.kyraDarkInput.sapMInputBase:focus-within,
.kyraDarkInput:focus-within .sapMInputBaseContentWrapper {
    border-color: #008C9C !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
}

/* Select Dropdown */
.kyraDarkSelect,
.kyraDarkSelect.sapMSlt,
.kyraDarkSelect .sapMSlt {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 14px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    transition: all 0.16s ease !important;
}

.kyraDarkSelect:focus-within,
.kyraDarkSelect.sapMSlt:focus {
    border-color: #008C9C !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
}

.kyraDarkSelect .sapMSltLabel {
    color: #0F172A !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 40px !important;
}

.kyraDarkSelect .sapMSltArrow {
    color: #008C9C !important;
    line-height: 40px !important;
}

/* Checkbox */
.kyraDarkCheckboxRow {
    margin: 12px 0 20px 0 !important;
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;
    overflow: visible !important;
}

.kyraDarkCheckbox {
    overflow: visible !important;
}

.kyraDarkCheckbox .sapMCbLabel {
    color: #1E293B !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    margin-left: 8px !important;
    line-height: 24px !important;
}

.kyraDarkCheckbox .sapMCbBg {
    background-color: #F8FAFC !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 4px !important;
    width: 20px !important;
    height: 20px !important;
}

.kyraDarkCheckbox.sapMCbMarkChecked .sapMCbBg {
    background-color: #008C9C !important;
    border-color: #008C9C !important;
}

.kyraDarkCheckbox.sapMCbMarkChecked .sapMCbMark {
    color: #FFFFFF !important;
}

/* Test Connection Button (⚡ Test Source Connection - KYRA Teal Mint Outline) */
.kyraDarkTestConnBtn.sapMBtn,
.kyraDarkTestConnBtn.sapMBtn .sapMBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px solid #008C9C !important;
    border-radius: 8px !important;
    height: 44px !important;
    line-height: 42px !important;
    color: #008C9C !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    width: 100% !important;
    transition: all 0.18s ease !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.12) !important;
}

.kyraDarkTestConnBtn.sapMBtn .sapMBtnContent,
.kyraDarkTestConnBtn.sapMBtn bdi {
    color: #008C9C !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

.kyraDarkTestConnBtn.sapMBtn:hover .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border-color: #007684 !important;
    color: #FFFFFF !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.28) !important;
}

.kyraDarkTestConnBtn.sapMBtn:hover .sapMBtnContent,
.kyraDarkTestConnBtn.sapMBtn:hover bdi {
    color: #FFFFFF !important;
}

/* Bottom Action Bar */
.kyraDarkBottomBar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding-top: 20px !important;
    border-top: 1.5px solid #E2E8F0 !important;
    margin-top: 10px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraDarkBackLinkBtn.sapMBtn .sapMBtnInner {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    color: #334155 !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    padding: 0 16px !important;
    height: 40px !important;
    line-height: 38px !important;
    transition: all 0.16s ease !important;
}

.kyraDarkBackLinkBtn.sapMBtn:hover .sapMBtnInner {
    background: #F8FAFC !important;
    border-color: #94A3B8 !important;
    color: #0F172A !important;
}

.kyraDarkBackLinkBtn.sapMBtn .sapMBtnContent,
.kyraDarkBackLinkBtn.sapMBtn bdi {
    color: inherit !important;
    font-weight: 600 !important;
}

.kyraDarkPromptBox {
    display: flex !important;
    align-items: center !important;
}

.kyraDarkPromptHint {
    color: #64748B !important;
    font-size: 13.5px !important;
}

.kyraDarkPromptTarget {
    color: #008C9C !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    margin-left: 4px !important;
}

/* Continue to Step 2 Button (Solid KYRA Teal) */
.kyraDarkContinueBtn.sapMBtn,
.kyraDarkContinueBtn.sapMBtn .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    height: 42px !important;
    line-height: 40px !important;
    padding: 0 24px !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.3) !important;
    transition: all 0.18s ease !important;
}

.kyraDarkContinueBtn.sapMBtn .sapMBtnContent,
.kyraDarkContinueBtn.sapMBtn bdi {
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

.kyraDarkContinueBtn.sapMBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
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
    content += '\n' + cssPreview3pm;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Appended 3 PM slide styles to:', f);
});

console.log('All CSS files updated successfully!');
