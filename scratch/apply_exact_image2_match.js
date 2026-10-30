const fs = require('fs');

console.log('=== Applying Exact Image 2 Match Design ===');

// 1. UPDATE XML
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml'
];

const newSwitchXml = `<HBox class="kyraAccessRevokeBar kyraPersonaSwitchBar sapUiMediumMarginBottom" alignItems="Center">
                            <Button
                                id="btnSingleUserMode"
                                text="Single User Conversion"
                                icon="sap-icon://person-placeholder"
                                type="{= \${accessModel>/personaConversionMode} !== 'department' ? 'Emphasized' : 'Transparent' }"
                                press=".onSelectSingleUserMode"
                                class="kyraTabPillBtn kyraSwitchBtn" />
                            <Button
                                id="btnDepartmentMode"
                                text="Department-Wide Conversion"
                                icon="sap-icon://group"
                                type="{= \${accessModel>/personaConversionMode} === 'department' ? 'Emphasized' : 'Transparent' }"
                                press=".onSelectDepartmentMode"
                                class="kyraTabPillBtn kyraSwitchBtn" />
                        </HBox>`;

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let xml = fs.readFileSync(file, 'utf8');

    const pattern = /<HBox[^>]*?(?:kyraSwitchGroup|kyraPersonaSwitchBar)[^>]*?>[\s\S]*?<\/HBox>/;
    if (pattern.test(xml)) {
        xml = xml.replace(pattern, newSwitchXml);
        fs.writeFileSync(file, xml, 'utf8');
        console.log(`Updated XML in ${file}`);
    } else {
        console.warn(`Could not find switch HBox in ${file}`);
    }
});

// 2. UPDATE CONTROLLER
const ctrlFiles = [
    'webapp/pages/access/AccessPage.controller.js',
    'webapp/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js',
    'dist/AccessPage.controller.js'
];

const newMethods = `        onSelectSingleUserMode() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/personaConversionMode", "single");
            }
            const oBtnSingle = this.byId("btnSingleUserMode");
            const oBtnDept = this.byId("btnDepartmentMode");
            if (oBtnSingle) oBtnSingle.setType("Emphasized");
            if (oBtnDept) oBtnDept.setType("Transparent");
        },

        onSelectDepartmentMode() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/personaConversionMode", "department");
            }
            const oBtnSingle = this.byId("btnSingleUserMode");
            const oBtnDept = this.byId("btnDepartmentMode");
            if (oBtnSingle) oBtnSingle.setType("Transparent");
            if (oBtnDept) oBtnDept.setType("Emphasized");
            this._loadAvailableDepartments();
        },`;

ctrlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let ctrl = fs.readFileSync(file, 'utf8');

    const pattern = /onSelectSingleUserMode\(\)\s*\{[\s\S]*?onSelectDepartmentMode\(\)\s*\{[\s\S]*?\}\s*\},/;
    if (pattern.test(ctrl)) {
        ctrl = ctrl.replace(pattern, newMethods);
        fs.writeFileSync(file, ctrl, 'utf8');
        console.log(`Updated controller methods in ${file}`);
    } else {
        console.warn(`Could not find controller methods in ${file}`);
    }
});

// 3. UPDATE CSS
const cssSnippet = `/* ========================================================================= */
/* KYRA PERSONA CONVERSION SWITCH (EXACT 1:1 MATCH TO IMAGE 2 TAB PILL)      */
/* ========================================================================= */
.kyraAccessRevokeBar.kyraPersonaSwitchBar,
.kyraSwitchGroup,
.sapMFlexBox.kyraAccessRevokeBar.kyraPersonaSwitchBar,
.sapMFlexBox.kyraSwitchGroup,
html body .sapUiTheme-sap_horizon .kyraAccessRevokeBar.kyraPersonaSwitchBar,
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

.kyraPersonaSwitchBar .kyraTabPillBtn,
.kyraPersonaSwitchBar .sapMBtn,
.kyraSwitchGroup .kyraSwitchBtn,
.kyraSwitchGroup .sapMBtn,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn,
html body .sapUiTheme-sap_horizon .kyraSwitchGroup .kyraSwitchBtn {
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
}

.kyraPersonaSwitchBar .kyraTabPillBtn .sapMBtnInner,
.kyraSwitchGroup .kyraSwitchBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchGroup .kyraSwitchBtn .sapMBtnInner {
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
.kyraPersonaSwitchBar .kyraTabPillBtn .sapUiIcon,
.kyraPersonaSwitchBar .kyraTabPillBtn .sapMBtnIcon,
.kyraSwitchGroup .kyraSwitchBtn .sapUiIcon,
.kyraSwitchGroup .kyraSwitchBtn .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn .sapMBtnIcon {
    font-size: 14px !important;
    margin-right: 6px !important;
    margin-left: 0 !important;
    padding-right: 0 !important;
    padding-left: 0 !important;
    line-height: 1 !important;
    display: inline-block !important;
}

/* SELECTED (Emphasized): Solid Kyra Teal #008C9C, White text & icon */
.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnInner,
.kyraSwitchGroup .kyraSwitchBtn.kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized:focus .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #008C9C !important;
    border-radius: 6px !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    box-shadow: 0 1px 3px rgba(0, 140, 156, 0.3) !important;
}

.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnContent,
.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnContent > bdi,
.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized bdi,
.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapUiIcon,
.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnIcon,
.kyraSwitchGroup .kyraSwitchBtn.kyraSwitchBtnActive .sapMBtnContent,
.kyraSwitchGroup .kyraSwitchBtn.kyraSwitchBtnActive bdi,
.kyraSwitchGroup .kyraSwitchBtn.kyraSwitchBtnActive .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnContent > bdi,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized bdi,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnEmphasized .sapMBtnIcon {
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    outline: none !important;
}

/* UNSELECTED (Transparent): Transparent background, Teal #008C9C text & icon */
.kyraPersonaSwitchBar .kyraTabPillBtn.sapMBtnTransparent .sapMBtnInner,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnInner,
.kyraSwitchGroup .kyraSwitchBtn.kyraSwitchBtnInactive .sapMBtnInner,
.kyraSwitchGroup .kyraSwitchBtn:not(.kyraSwitchBtnActive) .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):focus .sapMBtnInner {
    background: transparent !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 6px !important;
    box-shadow: none !important;
}

.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnContent,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnContent > bdi,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) bdi,
.kyraSwitchGroup .kyraSwitchBtn:not(.kyraSwitchBtnActive) .sapMBtnContent,
.kyraSwitchGroup .kyraSwitchBtn:not(.kyraSwitchBtnActive) bdi,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnContent > bdi,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) bdi {
    color: #008C9C !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    outline: none !important;
}

.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapUiIcon,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnIcon,
.kyraSwitchGroup .kyraSwitchBtn:not(.kyraSwitchBtnActive) .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized) .sapMBtnIcon {
    color: #008C9C !important;
    outline: none !important;
}

/* Hover on unselected: subtle tint */
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapMBtnInner {
    background: rgba(0, 140, 156, 0.08) !important;
    background-color: rgba(0, 140, 156, 0.08) !important;
    border: 1px solid transparent !important;
}

.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapMBtnContent,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover bdi,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapUiIcon,
.kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapMBtnIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapMBtnContent,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover bdi,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapUiIcon,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn:not(.sapMBtnEmphasized):hover .sapMBtnIcon {
    color: #007684 !important;
}

/* Eliminate all UI5 focus brackets, pseudo-elements, blue outlines, and inner borders */
.kyraPersonaSwitchBar .kyraTabPillBtn *::before,
.kyraPersonaSwitchBar .kyraTabPillBtn *::after,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn *::before,
html body .sapUiTheme-sap_horizon .kyraPersonaSwitchBar .kyraTabPillBtn *::after {
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
    
    const banner = '/* KYRA PERSONA CONVERSION SWITCH';
    const idx = content.indexOf(banner);
    if (idx !== -1) {
        const commentStart = content.lastIndexOf('/* ========================================================================= */', idx);
        content = content.slice(0, commentStart !== -1 ? commentStart : idx).trimEnd() + '\n\n' + cssSnippet + '\n';
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Replaced switch block in ${file}`);
    } else {
        content += '\n\n' + cssSnippet + '\n';
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Appended switch block in ${file}`);
    }
});

console.log('=== Done Image 2 Exact Match ===');
