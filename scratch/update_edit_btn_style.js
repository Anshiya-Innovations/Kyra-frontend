const fs = require('fs');

console.log('=== Updating Edit Button to Kyra Standard ===');

// 1. UPDATE XML
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml'
];

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace class="kyraSecondaryBtn" on btnEditTargetSystems with class="kyraSapEditBtn"
    const oldBtnPattern = /(<Button[^>]*?id="btnEditTargetSystems"[^>]*?class=")[^"]*?(")/;
    if (oldBtnPattern.test(content)) {
        content = content.replace(oldBtnPattern, '$1kyraSapEditBtn$2');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated Edit button class in ${file}`);
    } else {
        console.warn(`Could not find btnEditTargetSystems in ${file}`);
    }
});

// 2. UPDATE CSS
const cssSnippet = `
/* ========================================================================= */
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

.kyraSapEditBtn .sapUiIcon,
.kyraSapEditBtn .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapMBtnIcon {
    color: #008C9C !important;
    font-size: 13.5px !important;
    margin-right: 7px !important;
    margin-left: 0 !important;
    line-height: 1 !important;
}

.kyraSapEditBtn .sapMBtnText,
.kyraSapEditBtn bdi,
.kyraSapEditBtn .sapMBtnContent > bdi,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn .sapMBtnText,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn bdi {
    color: #008C9C !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    line-height: normal !important;
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

.kyraSapEditBtn *::before,
.kyraSapEditBtn *::after,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn *::before,
html body .sapUiTheme-sap_horizon .kyraSapEditBtn *::after {
    display: none !important;
    content: none !important;
    outline: none !important;
    box-shadow: none !important;
}
`;

const cssFiles = [
    'webapp/css/style.css',
    'webapp/pages/access/style.css',
    'dist/css/style.css',
    'dist/pages/access/style.css'
];

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');

    // If .kyraSapEditBtn exists, replace or append updated version
    const banner = '/* KYRA SAP EDIT BUTTON';
    if (css.includes(banner)) {
        const commentStart = css.lastIndexOf('/* ========================================================================= */', css.indexOf(banner));
        const endBanner = css.indexOf('/* ========================================================================= */', css.indexOf(banner) + banner.length);
        if (commentStart !== -1 && endBanner !== -1) {
            css = css.slice(0, commentStart).trimEnd() + '\n' + cssSnippet + '\n' + css.slice(endBanner);
            fs.writeFileSync(file, css, 'utf8');
            console.log(`Replaced kyraSapEditBtn styles in ${file}`);
            return;
        }
    }
    
    // Otherwise append
    css += '\n' + cssSnippet;
    fs.writeFileSync(file, css, 'utf8');
    console.log(`Appended kyraSapEditBtn styles to ${file}`);
});

console.log('=== Done Edit Button Update ===');
