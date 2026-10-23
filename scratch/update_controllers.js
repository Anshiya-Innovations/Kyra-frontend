const fs = require('fs');

const controllerFiles = [
    'webapp/pages/access/AccessPage.controller.js',
    'webapp/AccessPage.controller.js'
];

const targetSnippet = `        onSelectCustomizationTab(oEvent) {
            let sTab = "business";
            if (typeof oEvent === "string") {
                sTab = oEvent;
            } else if (oEvent && typeof oEvent.getSource === "function") {
                const oSource = oEvent.getSource();
                sTab = oSource.data("tabKey") || (oSource.getCustomData && oSource.getCustomData().find(cd => cd.getKey() === "tabKey") ? oSource.getCustomData().find(cd => cd.getKey() === "tabKey").getValue() : "business");
            }
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/adminCustomizationSubTab", sTab);
                oModel.setProperty("/adminCustomizationStep", 1);
                try { sap.ui.getCore().applyChanges(); } catch (e) {}
                setTimeout(() => {
                    this._smoothScrollTo("accessCustomizationSubTabBar", 40);
                }, 40);
            }
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
                oModel.setProperty("/adminCustomizationStep", 1);
                if (!oModel.getProperty("/adminCustomizationSubTab")) {
                    oModel.setProperty("/adminCustomizationSubTab", "business");
                }
                this._ensureSystemServicesPopulated(oModel, "SAP Business Technology Platform");
                this._ensureAdminSnapshots(oModel);
                this._refreshCustomConflictOptions(oModel);
                this._loadCustomAccessAndConflictConfig(oModel);
                setTimeout(() => {
                    this._smoothScrollTo("adminAccessCustomizationSection", 40);
                }, 80);
            }
            this._updateActionCardArrows(oModel);
        },`;

const replacementSnippet = `        onSelectCustomizationTab(oEvent) {
            let sTab = "business";
            if (typeof oEvent === "string") {
                sTab = oEvent;
            } else if (oEvent && typeof oEvent.getSource === "function") {
                const oSource = oEvent.getSource();
                sTab = oSource.data("tabKey") || (oSource.getCustomData && oSource.getCustomData().find(cd => cd.getKey() === "tabKey") ? oSource.getCustomData().find(cd => cd.getKey() === "tabKey").getValue() : "business");
            }
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/adminCustomizationSubTab", sTab);
                oModel.setProperty("/adminCustomizationStep", 1);
                this._updateCustomizationTabButtons(sTab);
                try { sap.ui.getCore().applyChanges(); } catch (e) {}
                setTimeout(() => {
                    this._updateCustomizationTabButtons(sTab);
                    this._smoothScrollTo("accessCustomizationSubTabBar", 40);
                }, 40);
            }
        },

        _updateCustomizationTabButtons(sActiveTab) {
            const sCurrentTab = sActiveTab || "business";
            const aTabs = [
                { id: "btnTabCustomizationBusiness", key: "business" },
                { id: "btnTabCustomizationRegion", key: "region" },
                { id: "btnTabCustomizationSystem", key: "system" },
                { id: "btnTabCustomizationConflict", key: "conflict" }
            ];
            aTabs.forEach(tab => {
                const oBtn = this.byId(tab.id);
                if (oBtn) {
                    const bActive = (tab.key === sCurrentTab);
                    oBtn.setType(bActive ? "Emphasized" : "Default");
                    oBtn.toggleStyleClass("kyraCustomizationTabBtnActive", bActive);
                    oBtn.data("active", bActive ? "true" : "false");
                    const oDom = oBtn.getDomRef();
                    if (oDom) {
                        oDom.setAttribute("data-active", bActive ? "true" : "false");
                        if (bActive) {
                            oDom.classList.add("kyraCustomizationTabBtnActive");
                        } else {
                            oDom.classList.remove("kyraCustomizationTabBtnActive");
                        }
                    }
                }
            });
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
                oModel.setProperty("/adminCustomizationStep", 1);
                const sSubTab = oModel.getProperty("/adminCustomizationSubTab") || "business";
                oModel.setProperty("/adminCustomizationSubTab", sSubTab);
                this._updateCustomizationTabButtons(sSubTab);
                this._ensureSystemServicesPopulated(oModel, "SAP Business Technology Platform");
                this._ensureAdminSnapshots(oModel);
                this._refreshCustomConflictOptions(oModel);
                this._loadCustomAccessAndConflictConfig(oModel);
                setTimeout(() => {
                    this._updateCustomizationTabButtons(oModel.getProperty("/adminCustomizationSubTab") || "business");
                    this._smoothScrollTo("adminAccessCustomizationSection", 40);
                }, 80);
            }
            this._updateActionCardArrows(oModel);
        },`;

controllerFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const isCRLF = content.includes('\r\n');
    const normalize = str => isCRLF ? str.replace(/\r?\n/g, '\r\n') : str.replace(/\r?\n/g, '\n');

    const searchStr = normalize(targetSnippet);
    const repStr = normalize(replacementSnippet);

    if (!content.includes(searchStr)) {
        console.error('Target snippet not found in', filePath);
    } else {
        content = content.replace(searchStr, repStr);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully updated controller in', filePath);
    }
});
