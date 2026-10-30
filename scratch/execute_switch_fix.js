const fs = require('fs');

console.log('=== Executing Kyra Switch Button Fix ===');

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
                                class="{= \${accessModel>/personaConversionMode} !== 'department' ? 'kyraSwitchBtn kyraSwitchBtnActive kyraSwitchBtnLeft' : 'kyraSwitchBtn kyraSwitchBtnInactive kyraSwitchBtnLeft' }" />
                            <Button
                                id="btnDepartmentMode"
                                text="Department-Wide Conversion"
                                icon="sap-icon://group"
                                type="Default"
                                press=".onSelectDepartmentMode"
                                class="{= \${accessModel>/personaConversionMode} === 'department' ? 'kyraSwitchBtn kyraSwitchBtnActive kyraSwitchBtnRight' : 'kyraSwitchBtn kyraSwitchBtnInactive kyraSwitchBtnRight' }" />
                        </HBox>`;

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let xml = fs.readFileSync(file, 'utf8');

    // Replace the switch HBox
    const pattern = /<HBox[^>]*?(?:kyraPersonaSwitchContainer|kyraSwitchGroup)[^>]*?>[\s\S]*?<\/HBox>/;
    if (pattern.test(xml)) {
        xml = xml.replace(pattern, newSwitchXml);
        fs.writeFileSync(file, xml, 'utf8');
        console.log(`Updated switch in ${file}`);
    } else {
        console.warn(`Could not find switch HBox in ${file}`);
    }
});

// 2. UPDATE CONTROLLERS
const ctrlFiles = [
    'webapp/pages/access/AccessPage.controller.js',
    'webapp/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js',
    'dist/AccessPage.controller.js'
];

const newMethods = `        onSelectSingleUserMode() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/personaConversionMode", "single");
            this._updateSwitchButtonVisuals();
        },

        onSelectDepartmentMode() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/personaConversionMode", "department");
            this._loadAvailableDepartments();
            this._updateSwitchButtonVisuals();
        },

        _updateSwitchButtonVisuals() {
            const oModel = this.getView().getModel("accessModel");
            const sMode = oModel ? oModel.getProperty("/personaConversionMode") : "single";
            const oBtnSingle = this.byId("btnSingleUserMode");
            const oBtnDept = this.byId("btnDepartmentMode");
            if (oBtnSingle) {
                if (sMode !== "department") {
                    oBtnSingle.removeStyleClass("kyraSwitchBtnInactive");
                    oBtnSingle.addStyleClass("kyraSwitchBtnActive");
                } else {
                    oBtnSingle.removeStyleClass("kyraSwitchBtnActive");
                    oBtnSingle.addStyleClass("kyraSwitchBtnInactive");
                }
            }
            if (oBtnDept) {
                if (sMode === "department") {
                    oBtnDept.removeStyleClass("kyraSwitchBtnInactive");
                    oBtnDept.addStyleClass("kyraSwitchBtnActive");
                } else {
                    oBtnDept.removeStyleClass("kyraSwitchBtnActive");
                    oBtnDept.addStyleClass("kyraSwitchBtnInactive");
                }
            }
        },`;

ctrlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let ctrl = fs.readFileSync(file, 'utf8');

    // Replace onSelectSingleUserMode and onSelectDepartmentMode
    const pattern = /onSelectSingleUserMode\(\)\s*\{[\s\S]*?onSelectDepartmentMode\(\)\s*\{[\s\S]*?\}\s*\},/;
    if (pattern.test(ctrl)) {
        ctrl = ctrl.replace(pattern, newMethods);
        fs.writeFileSync(file, ctrl, 'utf8');
        console.log(`Updated methods in ${file}`);
    } else {
        console.warn(`Could not find methods in ${file}`);
    }
});

// 3. UPDATE CSS
const cssFiles = [
    'webapp/css/style.css',
    'webapp/pages/access/style.css',
    'dist/css/style.css',
    'dist/pages/access/style.css'
];

const cssSwitchSnippet = `
/* ========================================================================= */
/* KYRA PIXEL-PERFECT SEAMLESS SWITCH BUTTON GROUP (PROPER, CLEAR, ZERO BLUE) */
/* ========================================================================= */
.kyraSwitchGroup,
.sapMFlexBox.kyraSwitchGroup,
html body .sapUiTheme-sap_horizon .kyraSwitchGroup {
    display: inline-flex !important;
    align-items: center !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    padding: 0 !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 16px !important;
    height: 40px !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05) !important;
    box-sizing: border-box !important;
}

.kyraSwitchBtn,
.sapMBtn.kyraSwitchBtn,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    border-radius: 0 !important;
    cursor: pointer !important;
}

.kyraSwitchBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtn .sapMBtnInner {
    height: 38px !important;
    line-height: 36px !important;
    padding: 0 22px !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    outline: none !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: none !important;
    -webkit-transition: none !important;
    background: transparent !important;
}

/* Dividing line between left and right switch buttons */
.kyraSwitchBtnRight,
.sapMBtn.kyraSwitchBtnRight,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnRight {
    border-left: 1px solid #CBD5E1 !important;
}

.kyraSwitchBtnRight.kyraSwitchBtnActive,
.sapMBtn.kyraSwitchBtnRight.kyraSwitchBtnActive,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnRight.kyraSwitchBtnActive {
    border-left: 1px solid #008C9C !important;
}

/* Spacing between icon and text */
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

/* ACTIVE BUTTON: SOLID KYRA TEAL, CRISP BOLD WHITE TEXT & ICON */
.kyraSwitchBtnActive,
.sapMBtn.kyraSwitchBtnActive,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive,
.kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnActive:focus .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: none !important;
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
    font-weight: 700 !important;
    font-size: 13.5px !important;
    outline: none !important;
}

/* INACTIVE BUTTON: CLEAN WHITE, DARK SLATE TEXT, SLATE ICON - STRICTLY NO BLUE */
.kyraSwitchBtnInactive,
.sapMBtn.kyraSwitchBtnInactive,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive,
.kyraSwitchBtnInactive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:focus .sapMBtnInner {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: none !important;
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
    color: #475569 !important;
    outline: none !important;
}

/* Hover on inactive button */
.kyraSwitchBtnInactive:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraSwitchBtnInactive:hover .sapMBtnInner {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
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
}
`;

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');
    if (!css.includes('.kyraSwitchGroup')) {
        css += '\n' + cssSwitchSnippet;
        fs.writeFileSync(file, css, 'utf8');
        console.log(`Appended switch styles to ${file}`);
    } else {
        console.log(`Switch styles already present in ${file}`);
    }
});

console.log('=== Done Execution ===');
