const fs = require("fs");
const path = require("path");

const cssPath = path.resolve(__dirname, "../webapp/css/style.css");
let cssContent = fs.readFileSync(cssPath, "utf8");

// 1. Clean up lines 46344-46405
const oldConflictBlock1 = `/* Conflict Reason Textarea Down Row */
.kyraAdminConflictReasonDownRow {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
}

.kyraAdminConflictReasonDownRow .sapMTextArea,
.kyraAdminConflictReasonDownRow .kyraAdminBuilderTextArea,
.kyraAdminBuilderTextArea,
.kyraAdminBuilderTextArea.sapMTextArea {
    min-height: 52px !important;
    height: 52px !important;
    max-height: 52px !important;
    border-radius: 8px !important;
    border: none !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper {
    min-height: 52px !important;
    height: 52px !important;
    max-height: 52px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    box-shadow: none !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
}

.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper:focus-within,
.kyraAdminConflictReasonDownRow .sapMTextArea.sapMFocus .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea.sapMFocus .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
}

.kyraAdminConflictReasonDownRow .sapMTextAreaInner,
.kyraAdminBuilderTextArea .sapMTextAreaInner {
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
    line-height: 20px !important;
    padding: 5px 12px !important;
    font-size: 13.5px !important;
    color: #0F172A !important;
    resize: none !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    box-sizing: border-box !important;
    background: transparent !important;
    font-family: inherit !important;
}`;

// The target replacement for the first block: redirect to unified modern class
const newConflictBlock1 = `/* Conflict Reason Textarea Down Row */
.kyraAdminConflictReasonDownRow {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 7px !important;
    margin-bottom: 6px !important;
}`;

// Let's replace the first conflicting block if found (using normalized regex)
const regexBlock1 = /\.kyraAdminConflictReasonDownRow\s*\{[\s\S]*?font-family:\s*inherit\s*!important;\s*\}/;
if (regexBlock1.test(cssContent)) {
    cssContent = cssContent.replace(regexBlock1, newConflictBlock1);
    console.log("Successfully replaced first conflicting textarea block in style.css");
}

// 2. Update the comprehensive section at lines 50766-50855 to be completely robust and beautiful
const unifiedConflictTextareaCSS = `/* ==========================================================================
   CONFLICT REASON TEXTAREA: PIXEL-PERFECT SPACIOUS, CLEAN BORDER & HOVER
   ========================================================================== */
.kyraAdminConflictReasonDownRow,
.kyraAdminConflictSlideContainer .kyraAdminConflictReasonDownRow {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 7px !important;
    margin-bottom: 8px !important;
    overflow: visible !important;
}

.kyraAdminBuilderTextArea,
.kyraAdminBuilderTextArea.sapMTextArea,
.kyraAdminConflictReasonDownRow .sapMTextArea,
.kyraAdminConflictReasonDownRow .kyraAdminBuilderTextArea,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea,
html body .sapUiTheme-sap_horizon .kyraAdminConflictReasonDownRow .sapMTextArea {
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    width: 100% !important;
    min-height: 72px !important;
    height: auto !important;
    max-height: none !important;
}

.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper,
.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper {
    min-height: 72px !important;
    height: 72px !important;
    max-height: none !important;
    width: 100% !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease !important;
    overflow: hidden !important;
    position: relative !important;
}

.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper::before,
.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper::after,
.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper::before,
.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper::after,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper::before,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper::after {
    display: none !important;
    content: none !important;
    border: none !important;
}

.kyraAdminBuilderTextArea:hover .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea.sapMTextArea:hover .sapMInputBaseContentWrapper,
.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper:hover,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea:hover .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper:hover {
    border-color: #008C9C !important;
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.1) !important;
}

.kyraAdminBuilderTextArea.sapMFocus .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper:focus-within,
.kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper:focus-within,
.kyraAdminConflictReasonDownRow .sapMTextArea.sapMFocus .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea.sapMFocus .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper:focus-within,
html body .sapUiTheme-sap_horizon .kyraAdminConflictReasonDownRow .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.16) !important;
    outline: none !important;
}

.kyraAdminBuilderTextArea .sapMTextAreaInner,
.kyraAdminConflictReasonDownRow .sapMTextAreaInner,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMTextAreaInner,
html body .sapUiTheme-sap_horizon .kyraAdminConflictReasonDownRow .sapMTextAreaInner {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    padding: 10px 14px !important;
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    color: #0F172A !important;
    resize: none !important;
    box-sizing: border-box !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 68px !important;
    max-height: none !important;
    font-family: inherit !important;
}

.kyraAdminBuilderTextArea .sapMTextAreaInner::placeholder,
.kyraAdminConflictReasonDownRow .sapMTextAreaInner::placeholder,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMTextAreaInner::placeholder {
    color: #94A3B8 !important;
    font-size: 13.5px !important;
    font-weight: 400 !important;
    opacity: 1 !important;
}

/* Conflict Slide Footer Bar: Cancel & Save Buttons Margin separation */
.kyraAdminConflictSlideContainer .kyraAdminConflictEditFooterBar,
.kyraAdminConflictEditFooterBar {
    margin-top: 16px !important;
    padding-top: 14px !important;
    border-top: 1px solid #E2E8F0 !important;
}`;

const regexBlock2 = /\/\*\s*={10,}\s*CONFLICT REASON TEXTAREA:[\s\S]*?\/\*\s*={10,}\s*DEACTIVE STATUS PILL STYLING/;
if (regexBlock2.test(cssContent)) {
    cssContent = cssContent.replace(regexBlock2, unifiedConflictTextareaCSS + "\n\n/* ==========================================================================\n   DEACTIVE STATUS PILL STYLING");
    console.log("Successfully replaced unified conflict textarea CSS in style.css");
}

fs.writeFileSync(cssPath, cssContent, "utf8");

// 3. Update all 6 AccessPage.view.xml files: rows="2" -> rows="3"
const viewPaths = [
    "webapp/pages/access/AccessPage.view.xml",
    "webapp/AccessPage.view.xml",
    "webapp/page component/User Access Management Portal page/AccessPage.view.xml",
    "webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml"
];

viewPaths.forEach(relView => {
    const fullView = path.resolve(__dirname, "..", relView);
    if (!fs.existsSync(fullView)) return;
    let content = fs.readFileSync(fullView, "utf8");
    const target = 'placeholder="Enter conflict description..."\r\n                                        rows="2"';
    const targetLF = 'placeholder="Enter conflict description..."\n                                        rows="2"';
    if (content.includes(target)) {
        content = content.replace(target, 'placeholder="Enter conflict description..."\r\n                                        rows="3"');
        fs.writeFileSync(fullView, content, "utf8");
        console.log("Updated rows=\"3\" in:", relView);
    } else if (content.includes(targetLF)) {
        content = content.replace(targetLF, 'placeholder="Enter conflict description..."\n                                        rows="3"');
        fs.writeFileSync(fullView, content, "utf8");
        console.log("Updated rows=\"3\" (LF) in:", relView);
    } else {
        // Regex fallback
        content = content.replace(/(placeholder="Enter conflict description..."\s*)rows="2"/, '$1rows="3"');
        fs.writeFileSync(fullView, content, "utf8");
        console.log("Updated rows=\"3\" (regex) in:", relView);
    }
});

console.log("Conflict reason styling script completed.");
