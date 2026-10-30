const fs = require('fs');

console.log('=== Applying Image 2 Exact Match Segmented Pill Design ===');

// 1. UPDATE XML
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml'
];

const newSwitchXml = `<HBox alignItems="Center" class="kyraSwitchGroup sapUiMediumMarginBottom">
                            <Button
                                id="btnSingleUserMode"
                                text="Single User Conversion"
                                icon="sap-icon://person-placeholder"
                                type="Default"
                                press=".onSelectSingleUserMode"
                                class="{= \${accessModel>/personaConversionMode} !== 'department' ? 'kyraSwitchBtn kyraSwitchBtnActive' : 'kyraSwitchBtn kyraSwitchBtnInactive' }" />
                            <Button
                                id="btnDepartmentMode"
                                text="Department-Wide Conversion"
                                icon="sap-icon://group"
                                type="Default"
                                press=".onSelectDepartmentMode"
                                class="{= \${accessModel>/personaConversionMode} === 'department' ? 'kyraSwitchBtn kyraSwitchBtnActive' : 'kyraSwitchBtn kyraSwitchBtnInactive' }" />
                        </HBox>`;

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let xml = fs.readFileSync(file, 'utf8');

    const pattern = /<HBox[^>]*?class="[^"]*?kyraSwitchGroup[^"]*?"[^>]*?>[\s\S]*?<\/HBox>/;
    if (pattern.test(xml)) {
        xml = xml.replace(pattern, newSwitchXml);
        fs.writeFileSync(file, xml, 'utf8');
        console.log(`Updated XML in ${file}`);
    } else {
        console.warn(`Could not find kyraSwitchGroup in ${file}`);
    }
});

// 2. UPDATE CSS
const cssSnippet = `/* ========================================================================= */
/* KYRA PERSONA CONVERSION SWITCH (EXACT 1:1 MATCH TO IMAGE 2 TAB PILL)      */
/* ========================================================================= */
.kyraSwitchGroup,
.sapMFlexBox.kyraSwitchGroup,
html body .sapUiTheme-sap_horizon .kyraSwitchGroup {
    background: #F1F5F9 !important;
    background-color: #F1F5F9 !important;
    padding: 3px !important;
    border-radius: 8px !important;
    border: 1px solid #E2E8F0 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    height: 38px !important;
    min-height: 38px !important;
    box-sizing: border-box !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 16px !important;
    box-shadow: none !important;
    width: auto !important;
    max-width: fit-content !important;
    overflow: visible !important;
}

/* Base button inside group */
.kyraSwitchBtn,
.sapMBtn.kyraSwitchBtn,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    height: 30px !important;
    min-height: 30px !important;
    box-shadow: none !important;
    outline: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: auto !important;
    min-width: unset !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    position: relative !important;
}

.kyraSwitchBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapMBtnInner {
    border-radius: 6px !important;
    height: 30px !important;
    min-height: 30px !important;
    line-height: 28px !important;
    padding: 0 16px !important;
    margin: 0 !important;
    font-size: 13px !important;
    outline: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    transition: all 0.15s ease !important;
    -webkit-transition: all 0.15s ease !important;
}

/* Icon layout */
.kyraSwitchBtn .sapUiIcon,
.kyraSwitchBtn .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapMBtnIcon {
    font-size: 14px !important;
    margin-right: 6px !important;
    margin-left: 0 !important;
    padding-right: 0 !important;
    padding-left: 0 !important;
    line-height: 1 !important;
    display: inline-block !important;
}

/* ACTIVE / SELECTED STATE: SOLID KYRA TEAL (#008C9C), PURE WHITE TEXT & ICON */
.kyraSwitchBtnActive,
.sapMBtn.kyraSwitchBtnActive,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive {
    z-index: 1 !important;
}

.kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:focus .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #008C9C !important;
    border-radius: 6px !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    box-shadow: 0 1px 3px rgba(0, 140, 156, 0.3) !important;
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
    font-weight: 700 !important;
    font-size: 13px !important;
    outline: none !important;
}

/* INACTIVE / UNSELECTED STATE: TRANSPARENT BACKGROUND, TEAL TEXT & ICON (EXACT IMAGE 2 MATCH) */
.kyraSwitchBtnInactive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapMBtnInner {
    background: transparent !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 6px !important;
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
    color: #008C9C !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    outline: none !important;
}

.kyraSwitchBtnInactive .sapUiIcon,
.kyraSwitchBtnInactive .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapMBtnIcon {
    color: #008C9C !important;
    outline: none !important;
}

/* Hover on inactive: subtle teal hover tint */
.kyraSwitchBtnInactive:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnInner {
    background: rgba(0, 140, 156, 0.08) !important;
    background-color: rgba(0, 140, 156, 0.08) !important;
    border: 1px solid transparent !important;
}

.kyraSwitchBtnInactive:hover .sapMBtnContent,
.kyraSwitchBtnInactive:hover bdi,
.kyraSwitchBtnInactive:hover .sapUiIcon,
.kyraSwitchBtnInactive:hover .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover bdi,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnIcon {
    color: #007684 !important;
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
    
    // Replace the previous switch block
    const blockRegex = /\/\* =+\s*\*\/\s*\/\* KYRA COMPACT CONNECTED[\s\S]*?(?=\/\* =+|$)/;
    if (blockRegex.test(content)) {
        content = content.replace(blockRegex, cssSnippet + '\n\n');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Replaced switch block in ${file}`);
    } else {
        const altRegex = /\/\* =+\s*\*\/\s*\/\* KYRA PERSONA CONVERSION SWITCH[\s\S]*?(?=\/\* =+|$)/;
        if (altRegex.test(content)) {
            content = content.replace(altRegex, cssSnippet + '\n\n');
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated switch block in ${file}`);
        } else {
            content += '\n\n' + cssSnippet;
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Appended switch block in ${file}`);
        }
    }
});

console.log('=== Done Image 2 Pill Style ===');
