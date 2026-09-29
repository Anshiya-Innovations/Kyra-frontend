const fs = require('fs');

const cssOwnDb = `
/* ==========================================================================
   OWN DATABASE (BYODB) FIRST SLIDE - EXACT MATCH TO IMAGE 3 (media_1790677909605.jpg)
   ========================================================================== */

.kyraOwnDbStudioSlide {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
}

.kyraOwnDbSubtitle {
    color: #64748B !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
    line-height: 1.5 !important;
    margin-bottom: 22px !important;
}

/* 2-Column Side-by-Side Flex Grid */
.kyraOwnDbCardsGrid {
    display: flex !important;
    flex-direction: row !important;
    gap: 20px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    align-items: stretch !important;
}

/* Individual Dark Card (matching media_1790677909605.jpg) */
.kyraOwnDbCard {
    flex: 1 1 0% !important;
    width: calc(50% - 10px) !important;
    max-width: calc(50% - 10px) !important;
    background: #0B132B !important;
    background-color: #0B132B !important;
    border: 1.5px solid #1E2E4A !important;
    border-radius: 12px !important;
    padding: 22px 24px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45) !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
}

/* Card Header */
.kyraOwnDbCardHeader {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    margin-bottom: 20px !important;
}

.kyraOwnDbCardHeaderIcon {
    color: #CBD5E1 !important;
    font-size: 16px !important;
}

.kyraOwnDbCardHeaderTitle .sapMTitle,
.kyraOwnDbCardHeaderTitle {
    color: #FFFFFF !important;
    font-size: 15px !important;
    font-weight: 700 !important;
}

/* Status Pill */
.kyraOwnDbStatusPill {
    border-radius: 6px !important;
    padding: 4px 12px !important;
    display: inline-flex !important;
    align-items: center !important;
}

.kyraOwnDbStatusPillNotConnected {
    background: #141E33 !important;
    background-color: #141E33 !important;
    border: 1px solid #202F4B !important;
}

.kyraOwnDbStatusPillNotConnected .kyraOwnDbStatusPillText {
    color: #94A3B8 !important;
    font-size: 11.5px !important;
    font-weight: 500 !important;
}

.kyraOwnDbStatusPillConnected {
    background: rgba(16, 185, 129, 0.16) !important;
    background-color: rgba(16, 185, 129, 0.16) !important;
    border: 1px solid #10B981 !important;
}

.kyraOwnDbStatusPillConnected .kyraOwnDbStatusPillText {
    color: #34D399 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
}

/* Field Group & Labels */
.kyraOwnDbFieldGroup {
    display: flex !important;
    flex-direction: column !important;
    margin-bottom: 15px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraOwnDbFieldRow {
    display: flex !important;
    flex-direction: row !important;
    gap: 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraOwnDbLabelRow {
    display: flex !important;
    align-items: center !important;
    margin-bottom: 6px !important;
}

.kyraOwnDbFieldLabel {
    color: #8A94A6 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    letter-spacing: 0.01em !important;
    margin-bottom: 6px !important;
    display: block !important;
}

.kyraOwnDbLabelRow .kyraOwnDbFieldLabel {
    margin-bottom: 0 !important;
}

.kyraOwnDbRequiredStar {
    color: #8A94A6 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    margin-left: 2px !important;
}

/* Select Dropdown */
.kyraOwnDbSelect,
.kyraOwnDbSelect.sapMSlt,
.kyraOwnDbSelect .sapMSlt,
.kyraOwnDbSelect .sapMSltInner {
    background: #070D1E !important;
    background-color: #070D1E !important;
    border: 1.5px solid #1E2E4A !important;
    border-radius: 8px !important;
    color: #94A3B8 !important;
    font-weight: 500 !important;
    font-size: 13px !important;
    height: 38px !important;
    line-height: 36px !important;
    padding: 0 12px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraOwnDbSelect .sapMSltLabel {
    color: #94A3B8 !important;
    line-height: 36px !important;
}

.kyraOwnDbSelect .sapMSltArrow {
    color: #0284C7 !important;
}

/* Inputs */
.kyraOwnDbInput,
.kyraOwnDbInput.sapMInputBase,
.kyraOwnDbInput .sapMInputBaseContentWrapper {
    background: #070D1E !important;
    background-color: #070D1E !important;
    border: 1.5px solid #1E2E4A !important;
    border-radius: 8px !important;
    height: 38px !important;
    padding: 0 12px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    transition: all 0.2s ease !important;
}

.kyraOwnDbInput .sapMInputBaseInner {
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    background: transparent !important;
    height: 36px !important;
    line-height: 36px !important;
    border: none !important;
    padding: 0 !important;
}

.kyraOwnDbInput .sapMInputBaseInner::placeholder {
    color: #475569 !important;
    font-weight: 400 !important;
}

.kyraOwnDbInput:focus-within .sapMInputBaseContentWrapper {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25) !important;
}

/* Checkbox */
.kyraOwnDbCheckboxRow {
    margin-bottom: 16px !important;
    margin-top: 4px !important;
    display: flex !important;
    align-items: center !important;
}

.kyraOwnDbCheckbox .sapMCbLabel {
    color: #8A94A6 !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    margin-left: 8px !important;
}

.kyraOwnDbCheckbox .sapMCbBg {
    background: #070D1E !important;
    background-color: #070D1E !important;
    border: 1.5px solid #1E2E4A !important;
    border-radius: 4px !important;
    width: 18px !important;
    height: 18px !important;
}

.kyraOwnDbCheckbox.sapMCbMarkChecked .sapMCbBg {
    background: #2563EB !important;
    background-color: #2563EB !important;
    border-color: #2563EB !important;
}

.kyraOwnDbCheckbox .sapMCbMark {
    color: #FFFFFF !important;
}

/* Test Connection Buttons */
.kyraOwnDbTestBtn.sapMBtn,
.kyraOwnDbTestBtn.sapMBtn .sapMBtnInner {
    background: #070D1E !important;
    background-color: #070D1E !important;
    border: 1.5px solid #152A4E !important;
    border-radius: 8px !important;
    color: #0284C7 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    height: 40px !important;
    line-height: 38px !important;
    transition: all 0.2s ease !important;
    width: 100% !important;
}

.kyraOwnDbTestBtn.sapMBtn .sapMBtnContent,
.kyraOwnDbTestBtn.sapMBtn bdi {
    color: #0284C7 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

.kyraOwnDbTestBtn.sapMBtn:hover .sapMBtnInner {
    background: rgba(2, 132, 199, 0.08) !important;
    border-color: #0284C7 !important;
    color: #38BDF8 !important;
}

.kyraOwnDbTestBtn.sapMBtn:hover bdi {
    color: #38BDF8 !important;
}

/* Bottom Action Bar */
.kyraOwnDbBottomBar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    margin-top: 24px !important;
    padding-top: 6px !important;
    box-sizing: border-box !important;
}

/* Left: Back to Home */
.kyraOwnDbBackBtn.sapMBtn,
.kyraOwnDbBackBtn.sapMBtn .sapMBtnInner {
    background: #0B132B !important;
    background-color: #0B132B !important;
    border: 1px solid #1E2E4A !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    height: 38px !important;
    line-height: 36px !important;
    padding: 0 18px !important;
    transition: all 0.2s ease !important;
}

.kyraOwnDbBackBtn.sapMBtn:hover .sapMBtnInner {
    background: #152244 !important;
    border-color: #38BDF8 !important;
    color: #FFFFFF !important;
}

.kyraOwnDbBackBtn.sapMBtn bdi {
    color: #FFFFFF !important;
    font-weight: 600 !important;
}

/* Center: Prompt Hint */
.kyraOwnDbPromptBox {
    display: flex !important;
    align-items: center !important;
}

.kyraOwnDbPromptText {
    color: #8A94A6 !important;
    font-size: 12.5px !important;
    font-weight: 500 !important;
}

/* Right: Save & Continue to Step 2 */
.kyraOwnDbContinueBtn.sapMBtn,
.kyraOwnDbContinueBtn.sapMBtn .sapMBtnInner {
    background: #2563EB !important;
    background-color: #2563EB !important;
    border: none !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 13.5px !important;
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 22px !important;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.45) !important;
    transition: all 0.2s ease !important;
}

.kyraOwnDbContinueBtn.sapMBtn:hover .sapMBtnInner {
    background: #1D4ED8 !important;
    background-color: #1D4ED8 !important;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6) !important;
    transform: translateY(-1px) !important;
}

.kyraOwnDbContinueBtn.sapMBtn bdi {
    color: #FFFFFF !important;
    font-weight: 700 !important;
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
    content += '\n' + cssOwnDb;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Appended Own DB styles to:', f);
});

console.log('All CSS files updated successfully!');
