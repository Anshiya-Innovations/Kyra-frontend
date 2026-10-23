const fs = require('fs');

const viewFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml'
];

viewFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace icon="sap-icon://marker" with icon="sap-icon://locate-me" on btnTabCustomizationRegion
    const oldMarker = 'id="btnTabCustomizationRegion"\n                                text="Region"\n                                icon="sap-icon://marker"';
    const newLocate = 'id="btnTabCustomizationRegion"\n                                text="Region"\n                                icon="sap-icon://locate-me"';
    if (content.includes(oldMarker)) {
        content = content.replace(oldMarker, newLocate);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated region icon in', file);
    } else {
        // try regex
        const re = /(id="btnTabCustomizationRegion"[\s\S]*?icon=")([^"]+)(")/;
        if (re.test(content)) {
            content = content.replace(re, '$1sap-icon://locate-me$3');
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated region icon via regex in', file);
        } else {
            console.error('Could not find btnTabCustomizationRegion in', file);
        }
    }
});

// Update style.css to ensure all tab icons are explicitly visible and styled with proper contrast
const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetIdx = css.indexOf('/* Inactive Icon: Dark Slate #1E293B (Image Match) */');
if (targetIdx !== -1) {
    const endIdx = css.indexOf('/* Inactive Hover State */', targetIdx);
    if (endIdx !== -1) {
        const replacement = `/* Inactive Icon: Dark Slate #1E293B (Image Match) */
.kyraCustomizationTabBtn .sapUiIcon,
.kyraCustomizationTabBtn .sapMBtnIcon,
.kyraAccessCustomizationTabBar .sapMBtn .sapUiIcon,
.kyraAccessCustomizationTabBar .sapMBtn .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnIcon,
#accessCustomizationSubTabBar .sapMBtn .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn .sapMBtnIcon {
    color: #1E293B !important;
    font-size: 16px !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    flex-shrink: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
    transition: color 0.15s ease !important;
}

`;
        css = css.substring(0, targetIdx) + replacement + css.substring(endIdx);
        fs.writeFileSync(cssPath, css, 'utf8');
        console.log('Updated inactive icon CSS in style.css');
    }
}

// Also check active icon CSS
const activeIconIdx = css.indexOf('.kyraCustomizationTabBtnActive .sapUiIcon,');
if (activeIconIdx !== -1) {
    const endActive = css.indexOf('/* Active Hover State */', activeIconIdx);
    if (endActive !== -1) {
        const replacementActive = `.kyraCustomizationTabBtnActive .sapUiIcon,
.kyraCustomizationTabBtnActive .sapMBtnIcon,
.kyraCustomizationTabBtn[data-active="true"] .sapUiIcon,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnIcon,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapUiIcon,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapMBtnIcon,
.kyraAccessCustomizationTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
.kyraAccessCustomizationTabBar .sapMBtn[data-active="true"] .sapUiIcon,
.kyraAccessCustomizationTabBar .sapMBtn.sapMBtnEmphasized .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized .sapUiIcon {
    color: #FFFFFF !important;
    font-size: 16px !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    flex-shrink: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
}

`;
        css = css.substring(0, activeIconIdx) + replacementActive + css.substring(endActive);
        fs.writeFileSync(cssPath, css, 'utf8');
        console.log('Updated active icon CSS in style.css');
    }
}
