const fs = require('fs');

let ctrl = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

// 1. Update onSelectAdminDatabaseConfig
const oldOnSelectAdminDb = `        onSelectAdminDatabaseConfig() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrent = oModel.getProperty("/adminSelectedSection") || "";
            const sNext = sCurrent === "databaseConfig" ? "" : "databaseConfig";
            oModel.setProperty("/adminSelectedSection", sNext);
            if (sNext === "databaseConfig") {
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
            }
        },`;

const newOnSelectAdminDb = `        onSelectAdminDatabaseConfig() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrent = oModel.getProperty("/adminSelectedSection") || "";
            const sNext = sCurrent === "databaseConfig" ? "" : "databaseConfig";
            oModel.setProperty("/adminSelectedSection", sNext);
            if (sNext === "databaseConfig") {
                const sMode = oModel.getProperty("/dbMigration/targetMode") || "kyra";
                oModel.setProperty("/dbMigration/targetMode", sMode);
                oModel.setProperty("/dbMigration/showDetails", false);
                oModel.setProperty("/dbMigration/currentStep", 1);
                oModel.setProperty("/dbMigration/isSlideOpen", true);
                setTimeout(() => {
                    this._attachCardClickEvents();
                    this._updateStrategyCardStyles(sMode);
                }, 80);
            }
        },`;

if (ctrl.includes(oldOnSelectAdminDb)) {
    ctrl = ctrl.replace(oldOnSelectAdminDb, newOnSelectAdminDb);
    console.log('Replaced onSelectAdminDatabaseConfig in controller');
} else {
    console.log('Warning: oldOnSelectAdminDb not matched exactly');
}

// 2. Update onSelectKyraMode, onSelectCustomMode, and add onBackToStrategySelection, onToggleMigrationStrategy, _attachCardClickEvents
const oldHandlersRegex = /onSelectKyraMode\(\) \{[\s\S]*?async onTestCloudConnection\(\)/;

const newHandlers = `onSelectKyraMode() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/dbMigration/targetMode", "kyra");
            oModel.setProperty("/dbMigration/showDetails", true);
            oModel.setProperty("/dbMigration/isSlideOpen", true);
            oModel.setProperty("/dbMigration/currentStep", 1);
            oModel.setProperty("/dbMigration/target/schema", "access_management");
            oModel.setProperty("/dbMigration/target/table", "ad_group");
            oModel.setProperty("/dbMigration/target/statusText", "Cloud Target (Pre-configured) ✓");
            oModel.setProperty("/dbMigration/target/statusState", "Success");
            this._updateStrategyCardStyles("kyra");
            MessageToast.show("Switched to Kyra Cloud Database mode.");

            // Smoothly display and focus next details in the same place
            setTimeout(() => {
                this._smoothScrollTo("migrationDetailsContainer", 16);
            }, 60);
        },

        onSelectCustomMode() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/dbMigration/targetMode", "custom");
            oModel.setProperty("/dbMigration/showDetails", true);
            oModel.setProperty("/dbMigration/isSlideOpen", true);
            oModel.setProperty("/dbMigration/currentStep", 1);
            oModel.setProperty("/dbMigration/target/statusText", "Not Tested");
            oModel.setProperty("/dbMigration/target/statusState", "None");
            this._updateStrategyCardStyles("custom");
            MessageToast.show("Switched to Custom Target Database mode.");

            // Smoothly display and focus next details in the same place
            setTimeout(() => {
                this._smoothScrollTo("migrationDetailsContainer", 16);
            }, 60);
        },

        onBackToStrategySelection() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/dbMigration/showDetails", false);
            const sMode = oModel.getProperty("/dbMigration/targetMode") || "kyra";
            setTimeout(() => {
                this._attachCardClickEvents();
                this._updateStrategyCardStyles(sMode);
                this._smoothScrollTo("stratSelectionContainer", 16);
            }, 60);
        },

        onToggleMigrationStrategy() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const currentMode = oModel.getProperty("/dbMigration/targetMode") || "kyra";
            if (currentMode === "kyra") {
                this.onSelectCustomMode();
            } else {
                this.onSelectKyraMode();
            }
        },

        _attachCardClickEvents() {
            const oCardKyra = this.byId("stratCardKyra");
            const oCardCustom = this.byId("stratCardCustom");
            if (oCardKyra) {
                const domKyra = oCardKyra.getDomRef();
                if (domKyra) {
                    domKyra.onclick = (e) => {
                        e.stopPropagation();
                        this.onSelectKyraMode();
                    };
                }
                if (!oCardKyra._bClickAttached) {
                    oCardKyra.attachBrowserEvent("click", (e) => {
                        e.stopPropagation();
                        this.onSelectKyraMode();
                    });
                    oCardKyra._bClickAttached = true;
                }
            }
            if (oCardCustom) {
                const domCustom = oCardCustom.getDomRef();
                if (domCustom) {
                    domCustom.onclick = (e) => {
                        e.stopPropagation();
                        this.onSelectCustomMode();
                    };
                }
                if (!oCardCustom._bClickAttached) {
                    oCardCustom.attachBrowserEvent("click", (e) => {
                        e.stopPropagation();
                        this.onSelectCustomMode();
                    });
                    oCardCustom._bClickAttached = true;
                }
            }
        },

        _updateStrategyCardStyles(sMode) {
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

        async onTestCloudConnection()`;

if (oldHandlersRegex.test(ctrl)) {
    ctrl = ctrl.replace(oldHandlersRegex, newHandlers);
    console.log('Replaced handlers and added navigation in controller');
} else {
    console.log('Warning: oldHandlersRegex not matched');
}

fs.writeFileSync('webapp/pages/access/AccessPage.controller.js', ctrl, 'utf8');
if (fs.existsSync('dist/pages/access/AccessPage.controller.js')) {
    fs.writeFileSync('dist/pages/access/AccessPage.controller.js', ctrl, 'utf8');
    console.log('Updated dist controller');
}
console.log('Controller updated successfully!');
