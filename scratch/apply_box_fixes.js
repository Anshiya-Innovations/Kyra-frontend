const fs = require('fs');
const path = require('path');

// 1. Update webapp/pages/access/AccessPage.view.xml
let xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Replace the two card declarations to have clean static class names
const oldKyraCard = `<VBox id="stratCardKyra"
                                class="{= 'kyraStratCardThemed' + (\${accessModel>/dbMigration/targetMode} === 'kyra' ? ' kyraStratCardThemedSelected' : '') }"
                                press=".onSelectKyraMode">`;

const newKyraCard = `<VBox id="stratCardKyra"
                                class="kyraStratCardThemed kyraStratCardThemedSelected"
                                press=".onSelectKyraMode">`;

const oldCustomCard = `<VBox id="stratCardCustom"
                                class="{= 'kyraStratCardThemed' + (\${accessModel>/dbMigration/targetMode} === 'custom' ? ' kyraStratCardThemedSelected' : '') }"
                                press=".onSelectCustomMode">`;

const newCustomCard = `<VBox id="stratCardCustom"
                                class="kyraStratCardThemed"
                                press=".onSelectCustomMode">`;

if (xml.includes(oldKyraCard)) {
    xml = xml.replace(oldKyraCard, newKyraCard);
    console.log('Replaced stratCardKyra in XML');
} else {
    console.log('Warning: oldKyraCard not matched exactly, trying regex');
    xml = xml.replace(/<VBox id="stratCardKyra"[\s\S]*?class="\{=[^\"]+\}"[\s\S]*?press="\.onSelectKyraMode">/, newKyraCard);
}

if (xml.includes(oldCustomCard)) {
    xml = xml.replace(oldCustomCard, newCustomCard);
    console.log('Replaced stratCardCustom in XML');
} else {
    console.log('Warning: oldCustomCard not matched exactly, trying regex');
    xml = xml.replace(/<VBox id="stratCardCustom"[\s\S]*?class="\{=[^\"]+\}"[\s\S]*?press="\.onSelectCustomMode">/, newCustomCard);
}

fs.writeFileSync('webapp/pages/access/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('webapp/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('dist/pages/access/AccessPage.view.xml', xml, 'utf8');
console.log('Updated AccessPage.view.xml in all 3 locations');

// 2. Update CSS in style.css
const cssAddition = `
/* ==========================================================================
   ENHANCED HIGH-SPECIFICITY SEPARATE BOXES (KYRA THEMED)
   ========================================================================== */

.kyraStratRowThemed,
.sapMFlexBox.kyraStratRowThemed {
    display: flex !important;
    flex-direction: row !important;
    gap: 28px !important;
    max-width: 1080px !important;
    width: 100% !important;
    margin: 12px auto 32px auto !important;
    box-sizing: border-box !important;
    align-items: stretch !important;
    justify-content: center !important;
}

/* Individual Strategy Box: Clear, Distinct Card Container with Elevation & Border */
.kyraStratCardThemed,
.sapMFlexBox.kyraStratCardThemed,
div.kyraStratCardThemed {
    flex: 1 1 0% !important;
    width: calc(50% - 14px) !important;
    min-height: 380px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 2px solid #CBD5E1 !important;
    border-radius: 16px !important;
    padding: 28px 30px !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04) !important;
    position: relative !important;
    outline: none !important;
}

.kyraStratCardThemed:hover,
.sapMFlexBox.kyraStratCardThemed:hover,
div.kyraStratCardThemed:hover {
    border-color: #008C9C !important;
    transform: translateY(-3px) !important;
    box-shadow: 0 14px 30px -4px rgba(0, 140, 156, 0.18), 0 4px 10px -2px rgba(0, 140, 156, 0.06) !important;
}

/* Selected Strategy Box (Active State) */
.kyraStratCardThemedSelected,
.sapMFlexBox.kyraStratCardThemedSelected,
div.kyraStratCardThemedSelected {
    border: 2.5px solid #008C9C !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    box-shadow: 0 10px 28px -4px rgba(0, 140, 156, 0.22), 0 0 0 1px #008C9C !important;
}

/* Selected Button (KYRA Primary Teal Solid) */
.kyraStratBtnSelected .sapMBtnInner,
.sapMBtn.kyraStratBtnSelected .sapMBtnInner,
.kyraStratActionButton.sapMBtn.sapMBtnEmphasized .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    height: 42px !important;
    line-height: 40px !important;
    width: 100% !important;
    box-shadow: 0 3px 10px rgba(0, 140, 156, 0.28) !important;
    transition: all 0.18s ease !important;
}

.kyraStratBtnSelected .sapMBtnContent,
.kyraStratBtnSelected bdi,
.kyraStratActionButton.sapMBtn.sapMBtnEmphasized .sapMBtnContent,
.kyraStratActionButton.sapMBtn.sapMBtnEmphasized bdi {
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

.kyraStratBtnSelected:hover .sapMBtnInner,
.sapMBtn.kyraStratBtnSelected:hover .sapMBtnInner,
.kyraStratActionButton.sapMBtn.sapMBtnEmphasized:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
    box-shadow: 0 6px 18px rgba(0, 140, 156, 0.38) !important;
    transform: translateY(-1px) !important;
}

/* Unselected Button (Crisp White Card with Slate/Teal Outline) */
.kyraStratBtnUnselected .sapMBtnInner,
.sapMBtn.kyraStratBtnUnselected .sapMBtnInner,
.kyraStratActionButton.sapMBtn.sapMBtnDefault .sapMBtnInner,
.kyraStratActionButton.sapMBtn:not(.sapMBtnEmphasized) .sapMBtnInner {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #334155 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    height: 42px !important;
    line-height: 40px !important;
    width: 100% !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    transition: all 0.18s ease !important;
}

.kyraStratBtnUnselected .sapMBtnContent,
.kyraStratBtnUnselected bdi,
.kyraStratActionButton.sapMBtn.sapMBtnDefault .sapMBtnContent,
.kyraStratActionButton.sapMBtn.sapMBtnDefault bdi,
.kyraStratActionButton.sapMBtn:not(.sapMBtnEmphasized) .sapMBtnContent,
.kyraStratActionButton.sapMBtn:not(.sapMBtnEmphasized) bdi {
    color: #334155 !important;
    font-weight: 600 !important;
    font-size: 14px !important;
}

.kyraStratBtnUnselected:hover .sapMBtnInner,
.sapMBtn.kyraStratBtnUnselected:hover .sapMBtnInner,
.kyraStratActionButton.sapMBtn.sapMBtnDefault:hover .sapMBtnInner,
.kyraStratActionButton.sapMBtn:not(.sapMBtnEmphasized):hover .sapMBtnInner {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #94A3B8 !important;
    color: #008C9C !important;
    transform: translateY(-1px) !important;
}
`;

const cssFiles = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

cssFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content += '\n' + cssAddition;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Appended enhanced styles to:', file);
});

// 3. Update controller logic
let ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

// Ensure _updateStrategyCardStyles updates both classes and button types
const oldMethodRegex = /_updateStrategyCardStyles\(sMode\) \{[\s\S]*?async onTestCloudConnection/;
const newMethod = `_updateStrategyCardStyles(sMode) {
            const oCardKyra = this.byId("stratCardKyra");
            const oCardCustom = this.byId("stratCardCustom");
            const oBtnKyra = this.byId("btnKyraStrat");
            const oBtnCustom = this.byId("btnCustomStrat");

            if (sMode === "kyra") {
                if (oCardKyra) {
                    oCardKyra.addStyleClass("kyraStratCardThemedSelected");
                }
                if (oCardCustom) {
                    oCardCustom.removeStyleClass("kyraStratCardThemedSelected");
                }
                if (oBtnKyra) {
                    oBtnKyra.setType("Emphasized");
                    oBtnKyra.addStyleClass("kyraStratBtnSelected");
                    oBtnKyra.removeStyleClass("kyraStratBtnUnselected");
                }
                if (oBtnCustom) {
                    oBtnCustom.setType("Default");
                    oBtnCustom.removeStyleClass("kyraStratBtnSelected");
                    oBtnCustom.addStyleClass("kyraStratBtnUnselected");
                }
            } else if (sMode === "custom") {
                if (oCardCustom) {
                    oCardCustom.addStyleClass("kyraStratCardThemedSelected");
                }
                if (oCardKyra) {
                    oCardKyra.removeStyleClass("kyraStratCardThemedSelected");
                }
                if (oBtnCustom) {
                    oBtnCustom.setType("Emphasized");
                    oBtnCustom.addStyleClass("kyraStratBtnSelected");
                    oBtnCustom.removeStyleClass("kyraStratBtnUnselected");
                }
                if (oBtnKyra) {
                    oBtnKyra.setType("Default");
                    oBtnKyra.removeStyleClass("kyraStratBtnSelected");
                    oBtnKyra.addStyleClass("kyraStratBtnUnselected");
                }
            }
        },

        async onTestCloudConnection`;

if (oldMethodRegex.test(ctrl)) {
    ctrl = ctrl.replace(oldMethodRegex, newMethod);
    console.log('Updated _updateStrategyCardStyles in controller');
} else {
    console.log('Warning: could not match oldMethodRegex in controller');
}

// In onSelectAdminDatabaseConfig, ensure click listeners are attached to the cards
const oldAdminDbConfig = `if (sNext === "databaseConfig") {
                const sMode = oModel.getProperty("/dbMigration/targetMode") || "kyra";
                oModel.setProperty("/dbMigration/targetMode", sMode);
                oModel.setProperty("/dbMigration/currentStep", 1);
                oModel.setProperty("/dbMigration/isSlideOpen", true);
                setTimeout(() => {
                    this._updateStrategyCardStyles(sMode);
                }, 60);
            }`;

const newAdminDbConfig = `if (sNext === "databaseConfig") {
                const sMode = oModel.getProperty("/dbMigration/targetMode") || "kyra";
                oModel.setProperty("/dbMigration/targetMode", sMode);
                oModel.setProperty("/dbMigration/currentStep", 1);
                oModel.setProperty("/dbMigration/isSlideOpen", true);
                setTimeout(() => {
                    const oCardKyra = this.byId("stratCardKyra");
                    const oCardCustom = this.byId("stratCardCustom");
                    if (oCardKyra && !oCardKyra._bClickAttached) {
                        oCardKyra.attachBrowserEvent("click", () => {
                            this.onSelectKyraMode();
                        });
                        oCardKyra._bClickAttached = true;
                    }
                    if (oCardCustom && !oCardCustom._bClickAttached) {
                        oCardCustom.attachBrowserEvent("click", () => {
                            this.onSelectCustomMode();
                        });
                        oCardCustom._bClickAttached = true;
                    }
                    this._updateStrategyCardStyles(sMode);
                }, 80);
            }`;

if (ctrl.includes(oldAdminDbConfig)) {
    ctrl = ctrl.replace(oldAdminDbConfig, newAdminDbConfig);
    console.log('Updated onSelectAdminDatabaseConfig in controller');
} else {
    console.log('Warning: could not match oldAdminDbConfig in controller');
}

fs.writeFileSync('webapp/pages/access/AccessPage.controller.js', ctrl, 'utf8');
if (fs.existsSync('dist/pages/access/AccessPage.controller.js')) {
    fs.writeFileSync('dist/pages/access/AccessPage.controller.js', ctrl, 'utf8');
    console.log('Updated dist controller');
}
console.log('All changes applied successfully!');
