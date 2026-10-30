const fs = require('fs');

console.log('=== Updating Compact Connected Switch Design ===');

const cssSnippet = `/* ========================================================================= */
/* KYRA COMPACT CONNECTED SEGMENTED CONTROL (NO OUTER BOX, ZERO GAP)         */
/* ========================================================================= */
.kyraSwitchGroup,
.sapMFlexBox.kyraSwitchGroup,
html body .sapUiTheme-sap_horizon .kyraSwitchGroup {
    display: inline-flex !important;
    width: auto !important;
    max-width: fit-content !important;
    align-items: center !important;
    border: none !important;
    outline: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 16px !important;
    border-radius: 0 !important;
    overflow: visible !important;
}

/* Base button reset */
.kyraSwitchBtn,
.sapMBtn.kyraSwitchBtn,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn {
    height: 36px !important;
    min-height: 36px !important;
    width: auto !important;
    min-width: unset !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    cursor: pointer !important;
    position: relative !important;
}

.kyraSwitchBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapMBtnInner {
    height: 36px !important;
    min-height: 36px !important;
    line-height: 34px !important;
    padding: 0 16px !important;
    margin: 0 !important;
    outline: none !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    transition: none !important;
    -webkit-transition: none !important;
}

/* OUTSIDE EDGES ROUNDED ONLY */
.kyraSwitchBtnLeft,
.kyraSwitchBtnLeft .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnLeft,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnLeft .sapMBtnInner {
    border-top-left-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.kyraSwitchBtnRight,
.sapMBtn.kyraSwitchBtnRight,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnRight {
    margin-left: -1px !important;
}

.kyraSwitchBtnRight,
.kyraSwitchBtnRight .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnRight,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnRight .sapMBtnInner {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 6px !important;
    border-bottom-right-radius: 6px !important;
}

/* Icon & text layout */
.kyraSwitchBtn .sapUiIcon,
.kyraSwitchBtn .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapMBtnIcon {
    font-size: 15px !important;
    margin-right: 8px !important;
    margin-left: 0 !important;
    padding-right: 0 !important;
    padding-left: 0 !important;
    line-height: 1 !important;
    display: inline-block !important;
}

/* ACTIVE BUTTON: TEAL BACKGROUND (#008C9C) WITH WHITE ICON AND TEXT */
.kyraSwitchBtnActive,
.sapMBtn.kyraSwitchBtnActive,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive {
    z-index: 2 !important;
}

.kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:focus .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #008C9C !important;
    outline: none !important;
    box-shadow: none !important;
}

.kyraSwitchBtnActive .sapMBtnContent,
.kyraSwitchBtnActive .sapMBtnContent > bdi,
.kyraSwitchBtnActive bdi,
.kyraSwitchBtnActive .sapUiIcon,
.kyraSwitchBtnActive .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapMBtnContent > bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:hover .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:hover bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:hover .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:focus .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:focus bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:focus .sapUiIcon {
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    outline: none !important;
}

/* INACTIVE BUTTON: WHITE BACKGROUND WITH DARK TEXT, DARK ICON, AND SUBTLE LIGHT-GRAY BORDER */
.kyraSwitchBtnInactive,
.sapMBtn.kyraSwitchBtnInactive,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive {
    z-index: 1 !important;
}

.kyraSwitchBtnInactive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapMBtnInner {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #CBD5E1 !important;
    outline: none !important;
    box-shadow: none !important;
}

.kyraSwitchBtnInactive .sapMBtnContent,
.kyraSwitchBtnInactive .sapMBtnContent > bdi,
.kyraSwitchBtnInactive bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnContent > bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus bdi {
    color: #0F172A !important;
    font-weight: 500 !important;
    font-size: 13.5px !important;
    outline: none !important;
}

.kyraSwitchBtnInactive .sapUiIcon,
.kyraSwitchBtnInactive .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapMBtnIcon {
    color: #334155 !important;
    outline: none !important;
}

/* Hover on inactive button */
.kyraSwitchBtnInactive:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnInner {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #94A3B8 !important;
}

.kyraSwitchBtnInactive:hover .sapMBtnContent,
.kyraSwitchBtnInactive:hover bdi,
.kyraSwitchBtnInactive:hover .sapUiIcon,
.kyraSwitchBtnInactive:hover .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnIcon {
    color: #008C9C !important;
}

/* Eliminate all UI5 focus brackets, pseudo-elements, blue outlines, and inner borders */
.kyraSwitchBtn *::before,
.kyraSwitchBtn *::after,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn *::before,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn *::after {
    display: none !important;
    content: none !important;
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}`;

const cssFiles = [
    'webapp/css/style.css',
    'webapp/pages/access/style.css',
    'dist/css/style.css',
    'dist/pages/access/style.css'
];

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the previous KYRA PIXEL-PERFECT SEAMLESS SWITCH block
    const blockRegex = /\/\* =+\s*\*\/\s*\/\* KYRA PIXEL-PERFECT SEAMLESS SWITCH[\s\S]*?(?=\/\* =+|$)/;
    if (blockRegex.test(content)) {
        content = content.replace(blockRegex, cssSnippet + '\n\n');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Replaced switch block in ${file}`);
    } else {
        // In case it has KYRA COMPACT CONNECTED
        const compactRegex = /\/\* =+\s*\*\/\s*\/\* KYRA COMPACT CONNECTED[\s\S]*?(?=\/\* =+|$)/;
        if (compactRegex.test(content)) {
            content = content.replace(compactRegex, cssSnippet + '\n\n');
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated compact switch block in ${file}`);
        } else {
            content += '\n\n' + cssSnippet;
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Appended switch block in ${file}`);
        }
    }
});

console.log('=== Done CSS Update ===');
