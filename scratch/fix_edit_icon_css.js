const fs = require('fs');

console.log('=== Fixing Edit Button Icon & Styling ===');

const cssSnippet = `/* ========================================================================= */
/* KYRA SAP EDIT BUTTON (PROJECT STANDARD EDIT BUTTON)                       */
/* ========================================================================= */
.kyraSapEditBtn,
.kyraSapEditBtn.sapMBtn,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn {
    background: transparent !important;
    border: none !important;
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    outline: none !important;
    cursor: pointer !important;
}

.kyraSapEditBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapMBtnInner {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    height: 38px !important;
    min-height: 38px !important;
    line-height: 35px !important;
    padding: 0 16px !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
    transition: all 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    outline: none !important;
    box-sizing: border-box !important;
}

/* Edit Icon: Crisply visible with proper spacing */
.kyraSapEditBtn .sapUiIcon,
.kyraSapEditBtn .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapMBtnIcon {
    display: inline-block !important;
    color: #008C9C !important;
    font-size: 14px !important;
    margin-right: 7px !important;
    margin-left: 0 !important;
    line-height: 1 !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.kyraSapEditBtn .sapUiIcon::before,
.kyraSapEditBtn .sapMBtnIcon::before,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapUiIcon::before {
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
    font-family: "SAP-icons" !important;
}

.kyraSapEditBtn .sapMBtnText,
.kyraSapEditBtn bdi,
.kyraSapEditBtn .sapMBtnContent > bdi,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapMBtnText,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn bdi {
    color: #008C9C !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    line-height: normal !important;
    letter-spacing: 0.2px !important;
}

.kyraSapEditBtn:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn:hover .sapMBtnInner {
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border-color: #008C9C !important;
}

.kyraSapEditBtn:hover .sapUiIcon,
.kyraSapEditBtn:hover .sapMBtnText,
.kyraSapEditBtn:hover bdi {
    color: #007684 !important;
}

/* Remove only focus outlines, NOT icon pseudo elements */
.kyraSapEditBtn:focus,
.kyraSapEditBtn .sapMBtnInner:focus,
.kyraSapEditBtn .sapMFocus,
.kyraSapEditBtn .sapMFocus::before,
.kyraSapEditBtn .sapMFocus::after {
    outline: none !important;
    box-shadow: none !important;
}`;

const cssFiles = [
    'webapp/css/style.css',
    'webapp/pages/access/style.css',
    'dist/css/style.css',
    'dist/pages/access/style.css'
];

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');

    // Replace the block at the bottom
    const banner = '/* KYRA SAP EDIT BUTTON (PROJECT STANDARD EDIT BUTTON)';
    const idx = css.lastIndexOf(banner);
    if (idx !== -1) {
        const commentStart = css.lastIndexOf('/* ========================================================================= */', idx);
        css = css.slice(0, commentStart !== -1 ? commentStart : idx).trimEnd() + '\n\n' + cssSnippet + '\n';
        fs.writeFileSync(file, css, 'utf8');
        console.log(`Replaced edit button CSS in ${file}`);
    } else {
        css += '\n\n' + cssSnippet + '\n';
        fs.writeFileSync(file, css, 'utf8');
        console.log(`Appended edit button CSS to ${file}`);
    }
});

console.log('=== Done Fixing Edit Button Icon ===');
