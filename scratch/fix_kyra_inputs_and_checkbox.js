const fs = require('fs');

const cssFix = `
/* ==========================================================================
   KYRA DATABASE SLIDE INPUT & CHECKBOX FIX (ELIMINATES DOUBLE BOXES & DARK FOCUS)
   ========================================================================== */

/* Outer Input Base: Transparent, No Border, No Double Box */
.kyraDarkInput.sapMInputBase,
.kyraDarkInput {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    height: 42px !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

/* Inner Content Wrapper: Single, Clean Rounded Border & Background */
.kyraDarkInput .sapMInputBaseContentWrapper {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    height: 42px !important;
    box-sizing: border-box !important;
    box-shadow: none !important;
    padding: 0 4px !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    transition: all 0.16s ease !important;
}

/* Input Field Inner: 100% Transparent, Never Dark */
.kyraDarkInput .sapMInputBaseInner,
.kyraDarkInput input.sapMInputBaseInner {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: #0F172A !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 10px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    outline: none !important;
}

/* Prevent Dark Navy Background on Focus */
.kyraDarkInput .sapMInputBaseInner:focus,
.kyraDarkInput input.sapMInputBaseInner:focus {
    background: transparent !important;
    background-color: transparent !important;
    color: #0F172A !important;
    box-shadow: none !important;
    border: none !important;
}

/* Content Wrapper Glow on Focus */
.kyraDarkInput.sapMInputBase:focus-within .sapMInputBaseContentWrapper,
.kyraDarkInput:focus-within .sapMInputBaseContentWrapper {
    border-color: #008C9C !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
}

/* Placeholder Styling */
.kyraDarkInput .sapMInputBaseInner::placeholder {
    color: #94A3B8 !important;
    opacity: 1 !important;
    font-weight: 400 !important;
}

/* Prevent Browser Autofill From Turning Input Dark Navy */
.kyraDarkInput input:-webkit-autofill,
.kyraDarkInput input:-webkit-autofill:hover,
.kyraDarkInput input:-webkit-autofill:focus,
.kyraDarkInput input:-webkit-autofill:active {
    -webkit-text-fill-color: #0F172A !important;
    -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
    box-shadow: 0 0 0 1000px #FFFFFF inset !important;
    transition: background-color 5000s ease-in-out 0s !important;
    background-color: #FFFFFF !important;
}

/* Select Dropdown in Kyra Database Slide */
.kyraDarkSelect.sapMSlt,
.kyraDarkSelect {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    height: 42px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

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
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    transition: all 0.16s ease !important;
}

.kyraDarkSelect:focus-within .sapMSlt,
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

/* Checkbox Row & Checkbox Element (Fix Stacking / Align Horizontally) */
.kyraDarkCheckboxRow {
    margin: 14px 0 20px 0 !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    min-height: 28px !important;
    width: 100% !important;
}

.kyraDarkCheckbox.sapMCb,
.kyraDarkCheckbox {
    display: inline-flex !important;
    flex-direction: row !important;
    align-items: center !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
}

.kyraDarkCheckbox .sapMCbBg {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    background-color: #F8FAFC !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 4px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraDarkCheckbox .sapMCbLabel {
    color: #1E293B !important;
    font-size: 13.5px !important;
    font-weight: 500 !important;
    margin-left: 10px !important;
    line-height: 20px !important;
    cursor: pointer !important;
    display: inline-block !important;
}

.kyraDarkCheckbox.sapMCbMarkChecked .sapMCbBg {
    background-color: #008C9C !important;
    border-color: #008C9C !important;
}

.kyraDarkCheckbox.sapMCbMarkChecked .sapMCbMark {
    color: #FFFFFF !important;
}

/* Test Source Connection Button in Kyra Slide */
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
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.12) !important;
    transition: all 0.18s ease !important;
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
`;

const cssFiles = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

cssFiles.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content += '\n' + cssFix;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Appended input & checkbox fixes to:', f);
});

console.log('All CSS files updated successfully!');
