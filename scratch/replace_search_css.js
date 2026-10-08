const fs = require('fs');

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'webapp/page component/User Access Management Portal page/style.css',
  'webapp/page component/page request/User Access Management Portal page/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/css/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/style.css',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/style.css'
];

const replacementBlock = `/* ==========================================================================
   KYRA MASTER SEARCH FIELD DESIGN: MATCHES ADMIN PAGE SEARCH BAR (8PX RADIUS)
   Applies identically to Admin, Requester, Approver, and Compliance Review
   ========================================================================== */
html body .kyraApproverRightControls .kyraEntitlementsSearchField,
html body .kyraApproverRightControls .kyraAdminSearchField,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField,
html body .kyraEntitlementsSearchField,
html body .kyraAdminSearchField,
.kyraEntitlementsSearchField,
.kyraEntitlementsSearchField.sapMSF,
.kyraAdminSearchField,
.kyraAdminSearchField.sapMSF {
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
    outline: none !important;
    box-shadow: none !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
    vertical-align: middle !important;
    display: inline-flex !important;
    align-items: center !important;
}

html body .kyraApproverRightControls .kyraEntitlementsSearchField form,
html body .kyraApproverRightControls .kyraEntitlementsSearchField .sapMSFF,
html body .kyraApproverRightControls .kyraAdminSearchField form,
html body .kyraApproverRightControls .kyraAdminSearchField .sapMSFF,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField form,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField .sapMSFF,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField form,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField .sapMSFF,
html body .kyraEntitlementsSearchField form,
html body .kyraEntitlementsSearchField .sapMSFF,
html body .kyraAdminSearchField form,
html body .kyraAdminSearchField .sapMSFF,
.kyraEntitlementsSearchField form,
.kyraEntitlementsSearchField .sapMSFF,
.kyraAdminSearchField form,
.kyraAdminSearchField .sapMSFF {
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 8px 0 12px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    position: relative !important;
    transition: border-color 0.18s ease, box-shadow 0.18s ease !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

html body .kyraApproverRightControls .kyraEntitlementsSearchField .sapMSFF:hover,
html body .kyraApproverRightControls .kyraAdminSearchField .sapMSFF:hover,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField .sapMSFF:hover,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField .sapMSFF:hover,
.kyraEntitlementsSearchField .sapMSFF:hover,
.kyraAdminSearchField .sapMSFF:hover {
    border-color: #94A3B8 !important;
}

html body .kyraApproverRightControls .kyraEntitlementsSearchField.sapMFocus .sapMSFF,
html body .kyraApproverRightControls .kyraEntitlementsSearchField .sapMSFF:focus-within,
html body .kyraApproverRightControls .kyraAdminSearchField.sapMFocus .sapMSFF,
html body .kyraApproverRightControls .kyraAdminSearchField .sapMSFF:focus-within,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField.sapMFocus .sapMSFF,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField .sapMSFF:focus-within,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField.sapMFocus .sapMSFF,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField .sapMSFF:focus-within,
.kyraEntitlementsSearchField.sapMFocus .sapMSFF,
.kyraEntitlementsSearchField .sapMSFF:focus-within,
.kyraAdminSearchField.sapMFocus .sapMSFF,
.kyraAdminSearchField .sapMSFF:focus-within {
    border-color: #008C9C !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.15) !important;
    outline: none !important;
}

.kyraEntitlementsSearchField .sapMSFInner,
.kyraAdminSearchField .sapMSFInner {
    height: 100% !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    position: relative !important;
}

/* Suppress browser native clear buttons on search inputs */
.kyraEntitlementsSearchField input[type="search"]::-webkit-search-cancel-button,
.kyraEntitlementsSearchField input[type="search"]::-webkit-search-decoration,
.kyraEntitlementsSearchField input[type="search"]::-webkit-search-results-button,
.kyraEntitlementsSearchField input[type="search"]::-webkit-search-results-decoration,
.kyraAdminSearchField input[type="search"]::-webkit-search-cancel-button,
.kyraAdminSearchField input[type="search"]::-webkit-search-decoration,
.kyraAdminSearchField input[type="search"]::-webkit-search-results-button,
.kyraAdminSearchField input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none !important;
    appearance: none !important;
    display: none !important;
    margin: 0 !important;
}

/* Input typing text */
html body .kyraApproverRightControls .kyraEntitlementsSearchField input,
html body .kyraApproverRightControls .kyraAdminSearchField input,
html body .sapUiTheme-sap_horizon .kyraEntitlementsSearchField input,
html body .sapUiTheme-sap_horizon .kyraAdminSearchField input,
.kyraEntitlementsSearchField input.sapMSFI,
.kyraEntitlementsSearchField input.sapMSFInput,
.kyraAdminSearchField input.sapMSFI,
.kyraAdminSearchField input.sapMSFInput,
.kyraEntitlementsSearchField .sapMSFI,
.kyraAdminSearchField .sapMSFI {
    position: static !important;
    transform: none !important;
    top: auto !important;
    left: auto !important;
    flex: 1 1 auto !important;
    width: 100% !important;
    min-width: 0 !important;
    height: 100% !important;
    line-height: 34px !important;
    font-size: 13px !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    font-weight: 500 !important;
    font-style: normal !important;
    color: #0F172A !important;
    padding: 0 4px 0 0 !important;
    margin: 0 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-sizing: border-box !important;
}

.kyraEntitlementsSearchField input::placeholder,
.kyraAdminSearchField input::placeholder,
.kyraEntitlementsSearchField .sapMSFI::placeholder,
.kyraAdminSearchField .sapMSFI::placeholder {
    color: #94A3B8 !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 13px !important;
    line-height: 34px !important;
    opacity: 1 !important;
}

/* Search Magnifier Button */
.kyraEntitlementsSearchField .sapMSFB,
.kyraAdminSearchField .sapMSFB {
    position: static !important;
    transform: none !important;
    top: auto !important;
    right: auto !important;
    flex: 0 0 auto !important;
    height: 28px !important;
    width: 28px !important;
    min-width: 28px !important;
    margin-left: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    padding: 0 !important;
}

.kyraEntitlementsSearchField .sapMSFB .sapUiIcon,
.kyraEntitlementsSearchField .sapMSFB .sapMSFSI,
.kyraAdminSearchField .sapMSFB .sapUiIcon,
.kyraAdminSearchField .sapMSFB .sapMSFSI {
    color: #64748B !important;
    font-size: 14px !important;
    line-height: 14px !important;
    transition: color 0.15s ease !important;
}

.kyraEntitlementsSearchField .sapMSFB:hover .sapUiIcon,
.kyraEntitlementsSearchField .sapMSFB:hover .sapMSFSI,
.kyraAdminSearchField .sapMSFB:hover .sapUiIcon,
.kyraAdminSearchField .sapMSFB:hover .sapMSFSI {
    color: #008C9C !important;
}

/* Reset / Clear Button */
.kyraEntitlementsSearchField .sapMSFReset,
.kyraAdminSearchField .sapMSFReset {
    position: static !important;
    transform: none !important;
    flex: 0 0 auto !important;
    height: 24px !important;
    width: 24px !important;
    min-width: 24px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 2px 0 0 !important;
}

.kyraEntitlementsSearchField .sapMSFReset .sapUiIcon,
.kyraAdminSearchField .sapMSFReset .sapUiIcon {
    color: #94A3B8 !important;
    font-size: 12px !important;
}

/* ==========================================================================
   CONFLICT REASON TEXTAREA: PIXEL-PERFECT CLEAN BORDER & HOVER
   ========================================================================== */
.kyraAdminBuilderTextArea,
.kyraAdminBuilderTextArea.sapMTextArea,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea {
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    width: 100% !important;
    min-height: 64px !important;
    height: auto !important;
}

.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper {
    min-height: 64px !important;
    height: auto !important;
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
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper::before,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper::after {
    display: none !important;
    content: none !important;
    border: none !important;
}

.kyraAdminBuilderTextArea:hover .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea.sapMTextArea:hover .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea:hover .sapMInputBaseContentWrapper {
    border-color: #008C9C !important;
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.1) !important;
}

.kyraAdminBuilderTextArea.sapMFocus .sapMInputBaseContentWrapper,
.kyraAdminBuilderTextArea .sapMInputBaseContentWrapper:focus-within,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea.sapMFocus .sapMInputBaseContentWrapper,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMInputBaseContentWrapper:focus-within {
    border-color: #008C9C !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 3px rgba(0, 140, 156, 0.16) !important;
    outline: none !important;
}

.kyraAdminBuilderTextArea .sapMTextAreaInner,
html body .sapUiTheme-sap_horizon .kyraAdminBuilderTextArea .sapMTextAreaInner {
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
    min-height: 60px !important;
    font-family: inherit !important;
}

.kyraAdminBuilderTextArea .sapMTextAreaInner::placeholder {
    color: #94A3B8 !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    opacity: 1 !important;
}

/* ==========================================================================
   DEACTIVE STATUS PILL STYLING
   ========================================================================== */
.kyraAdminStatusPill[data-status="Deactive"],
.sapMFlexBox.kyraAdminStatusPill[data-status="Deactive"] {
    background: #F1F5F9 !important;
    background-color: #F1F5F9 !important;
}

.kyraAdminStatusPill[data-status="Deactive"] .kyraAdminPillDot,
.kyraAdminStatusPill[data-status="Deactive"] .sapUiIcon,
.sapMFlexBox.kyraAdminStatusPill[data-status="Deactive"] .sapUiIcon {
    background-color: #94A3B8 !important;
    background: #94A3B8 !important;
}

.kyraAdminStatusPill[data-status="Deactive"] .kyraAdminPillText,
.kyraAdminStatusPill[data-status="Deactive"] .sapMText,
.sapMFlexBox.kyraAdminStatusPill[data-status="Deactive"] .sapMText {
    color: #64748B !important;
}
`;

for (const file of cssFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const marker = '/* SEARCH BAR: MATCHING IMAGE 3';
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      // Replace everything from the marker to end of file with replacementBlock
      content = content.slice(0, idx) + replacementBlock;
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully replaced old search block in:', file);
    } else {
      console.warn('Marker not found in:', file);
    }
  }
}
