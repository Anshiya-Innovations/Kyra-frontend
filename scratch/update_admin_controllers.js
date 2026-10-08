const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                results = results.concat(walk(full));
            }
        } else if (file === 'AccessPage.controller.js') {
            results.push(full);
        }
    });
    return results;
}

const controllerFiles = walk('webapp');

for (const f of controllerFiles) {
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;

    // 1. Add global action card click handler in onInit if not present
    if (!content.includes('_bActionCardsGlobalClickBound')) {
        const targetInit = '            // Ensure clicking anywhere inside a Team card triggers team selection';
        const replacementInit = `            // Ensure clicking anywhere inside any Admin card or Top Action card toggles cleanly across view renders
            if (!this._bActionCardsGlobalClickBound) {
                this._bActionCardsGlobalClickBound = true;
                document.addEventListener("click", (e) => {
                    const cardDb = e.target.closest("#cardAdminDatabaseConfig, [id$='cardAdminDatabaseConfig']");
                    if (cardDb) {
                        this.onSelectAdminDatabaseConfig();
                        return;
                    }
                    const cardPersona = e.target.closest("#cardAdminPersonaConversion, [id$='cardAdminPersonaConversion']");
                    if (cardPersona) {
                        this.onSelectAdminPersonaConversion();
                        return;
                    }
                    const cardCustom = e.target.closest("#cardAdminAccessCustomization, [id$='cardAdminAccessCustomization']");
                    if (cardCustom) {
                        this.onSelectAdminAccessCustomization();
                        return;
                    }
                    const cardPending = e.target.closest("#cardPendingRequests, [id$='cardPendingRequests']");
                    if (cardPending) {
                        this.onNavToPendingRequests();
                        return;
                    }
                    const cardApproved = e.target.closest("#cardApprovedRequests, [id$='cardApprovedRequests']");
                    if (cardApproved) {
                        this.onNavToApprovedRequests();
                        return;
                    }
                    const cardAdd = e.target.closest("#cardAddAccess, [id$='cardAddAccess']");
                    if (cardAdd) {
                        this.onNavToAddAccess();
                        return;
                    }
                    const cardRemove = e.target.closest("#cardRemoveAccess, [id$='cardRemoveAccess']");
                    if (cardRemove) {
                        this.onNavToRemoveAccess();
                        return;
                    }
                    const cardKyraStrat = e.target.closest("#stratCardKyra, [id$='stratCardKyra']");
                    if (cardKyraStrat && !e.target.closest("#btnKyraStrat, [id$='btnKyraStrat']")) {
                        this.onSelectKyraMode();
                        return;
                    }
                    const cardCustomStrat = e.target.closest("#stratCardCustom, [id$='stratCardCustom']");
                    if (cardCustomStrat && !e.target.closest("#btnCustomStrat, [id$='btnCustomStrat']")) {
                        this.onSelectCustomMode();
                        return;
                    }
                }, true);
            }

            // Ensure clicking anywhere inside a Team card triggers team selection`;

        if (content.includes(targetInit)) {
            content = content.replace(targetInit, replacementInit);
            modified = true;
        }
    }

    // 2. Update _updateActionCardArrows to handle admin cards
    if (!content.includes('arrowAdminDatabaseConfig') || !content.includes('bAdminDb')) {
        const targetArrowMethodEnd = '            const oCardRemove = this.byId("cardRemoveAccess");\r\n            if (oCardRemove && oCardRemove.getDomRef()) {\r\n                oCardRemove.getDomRef().classList.toggle("kyraCardExpanded", bRemove);\r\n            }\r\n        },';
        const targetArrowMethodEndLF = '            const oCardRemove = this.byId("cardRemoveAccess");\n            if (oCardRemove && oCardRemove.getDomRef()) {\n                oCardRemove.getDomRef().classList.toggle("kyraCardExpanded", bRemove);\n            }\n        },';

        const replacementArrowMethodEnd = `            const oCardRemove = this.byId("cardRemoveAccess");
            if (oCardRemove && oCardRemove.getDomRef()) {
                oCardRemove.getDomRef().classList.toggle("kyraCardExpanded", bRemove);
            }

            const sAdminSec = oModel.getProperty("/adminSelectedSection") || "";
            const bAdminDb = sAdminSec === "databaseConfig";
            const bAdminPersona = sAdminSec === "personaConversion";
            const bAdminCustom = sAdminSec === "accessCustomization";

            const oArrowDb = this.byId("arrowAdminDatabaseConfig");
            if (oArrowDb) {
                oArrowDb.setSrc(bAdminDb ? "sap-icon://navigation-down-arrow" : "sap-icon://navigation-right-arrow");
                const oDom = oArrowDb.getDomRef();
                if (oDom) {
                    const oParent = oDom.closest(".kyraCardCircleArrow");
                    if (oParent) {
                        oParent.setAttribute("data-expanded", bAdminDb ? "true" : "false");
                    }
                }
            }
            const oArrowPersona = this.byId("arrowAdminPersonaConversion");
            if (oArrowPersona) {
                oArrowPersona.setSrc(bAdminPersona ? "sap-icon://navigation-down-arrow" : "sap-icon://navigation-right-arrow");
                const oDom = oArrowPersona.getDomRef();
                if (oDom) {
                    const oParent = oDom.closest(".kyraCardCircleArrow");
                    if (oParent) {
                        oParent.setAttribute("data-expanded", bAdminPersona ? "true" : "false");
                    }
                }
            }
            const oArrowCustom = this.byId("arrowAdminAccessCustomization");
            if (oArrowCustom) {
                oArrowCustom.setSrc(bAdminCustom ? "sap-icon://navigation-down-arrow" : "sap-icon://navigation-right-arrow");
                const oDom = oArrowCustom.getDomRef();
                if (oDom) {
                    const oParent = oDom.closest(".kyraCardCircleArrow");
                    if (oParent) {
                        oParent.setAttribute("data-expanded", bAdminCustom ? "true" : "false");
                    }
                }
            }

            const oCardDb = this.byId("cardAdminDatabaseConfig");
            if (oCardDb && oCardDb.getDomRef()) {
                oCardDb.getDomRef().classList.toggle("kyraCardExpanded", bAdminDb);
            }
            const oCardPersona = this.byId("cardAdminPersonaConversion");
            if (oCardPersona && oCardPersona.getDomRef()) {
                oCardPersona.getDomRef().classList.toggle("kyraCardExpanded", bAdminPersona);
            }
            const oCardCustom = this.byId("cardAdminAccessCustomization");
            if (oCardCustom && oCardCustom.getDomRef()) {
                oCardCustom.getDomRef().classList.toggle("kyraCardExpanded", bAdminCustom);
            }
        },`;

        if (content.includes(targetArrowMethodEnd)) {
            content = content.replace(targetArrowMethodEnd, replacementArrowMethodEnd);
            modified = true;
        } else if (content.includes(targetArrowMethodEndLF)) {
            content = content.replace(targetArrowMethodEndLF, replacementArrowMethodEnd);
            modified = true;
        }
    }

    // 3. Update onSelectAdminDatabaseConfig, onSelectAdminPersonaConversion, onSelectAdminAccessCustomization, and onCloseAdminSection
    const targetAdminHandlers = `        onSelectAdminDatabaseConfig() {
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
        },

        onSelectAdminPersonaConversion() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrent = oModel.getProperty("/adminSelectedSection") || "";
            oModel.setProperty("/adminSelectedSection", sCurrent === "personaConversion" ? "" : "personaConversion");
        },

        onSelectAdminAccessCustomization() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrent = oModel.getProperty("/adminSelectedSection") || "";
            const sNext = sCurrent === "accessCustomization" ? "" : "accessCustomization";
            oModel.setProperty("/adminSelectedSection", sNext);
            if (sNext === "accessCustomization") {
                this._ensureAdminSnapshots(oModel);
                this._refreshCustomConflictOptions(oModel);
                this._loadCustomAccessAndConflictConfig(oModel);
            }
        },

        onCloseAdminSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/adminSelectedSection", "");
            }
        },`;

    const replacementAdminHandlers = `        onSelectAdminDatabaseConfig() {
            const now = Date.now();
            if (this._lastAdminNavClick && (now - this._lastAdminNavClick < 250)) {
                return;
            }
            this._lastAdminNavClick = now;

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
                    this._smoothScrollTo("adminDatabaseConfigSection", 40);
                }, 80);
            }
            this._updateActionCardArrows(oModel);
        },

        onSelectAdminPersonaConversion() {
            const now = Date.now();
            if (this._lastAdminNavClick && (now - this._lastAdminNavClick < 250)) {
                return;
            }
            this._lastAdminNavClick = now;

            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrent = oModel.getProperty("/adminSelectedSection") || "";
            const sNext = sCurrent === "personaConversion" ? "" : "personaConversion";
            oModel.setProperty("/adminSelectedSection", sNext);
            if (sNext === "personaConversion") {
                if (typeof this._loadAvailableDepartments === "function") {
                    this._loadAvailableDepartments();
                }
                setTimeout(() => {
                    this._smoothScrollTo("adminPersonaConversionSection", 40);
                }, 80);
            }
            this._updateActionCardArrows(oModel);
        },

        onSelectAdminAccessCustomization() {
            const now = Date.now();
            if (this._lastAdminNavClick && (now - this._lastAdminNavClick < 250)) {
                return;
            }
            this._lastAdminNavClick = now;

            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const sCurrent = oModel.getProperty("/adminSelectedSection") || "";
            const sNext = sCurrent === "accessCustomization" ? "" : "accessCustomization";
            oModel.setProperty("/adminSelectedSection", sNext);
            if (sNext === "accessCustomization") {
                this._ensureAdminSnapshots(oModel);
                this._refreshCustomConflictOptions(oModel);
                this._loadCustomAccessAndConflictConfig(oModel);
                setTimeout(() => {
                    this._smoothScrollTo("adminAccessCustomizationSection", 40);
                }, 80);
            }
            this._updateActionCardArrows(oModel);
        },

        onCloseAdminSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/adminSelectedSection", "");
                this._updateActionCardArrows(oModel);
            }
        },`;

    // Handle both CRLF and LF variations
    const normContent = content.replace(/\r\n/g, '\n');
    const normTarget = targetAdminHandlers.replace(/\r\n/g, '\n');
    if (normContent.includes(normTarget)) {
        content = normContent.replace(normTarget, replacementAdminHandlers.replace(/\r\n/g, '\n'));
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated controller:', f);
        try {
            execSync(`node -c "${f}"`);
            console.log('Syntax valid:', f);
        } catch (e) {
            console.error('Syntax ERROR in', f, e.message);
        }
    } else {
        console.log('No change needed or already updated:', f);
    }
}
