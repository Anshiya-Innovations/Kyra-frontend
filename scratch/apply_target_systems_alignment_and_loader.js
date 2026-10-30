const fs = require('fs');

console.log('=== Updating Target Systems Alignment & Project Loader ===');

// =========================================================================
// 1. UPDATE KyraLoader.js (Universal interception of BusyIndicator)
// =========================================================================
const loaderFiles = [
    'webapp/model/KyraLoader.js',
    'dist/model/KyraLoader.js'
];

loaderFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace setupGlobalHooks to strictly redirect UI5 BusyIndicator to KyraLoader
    const oldHook = /setupGlobalHooks\(\)\s*\{[\s\S]*?oBI\.show\s*=\s*function\([^\)]*\)\s*\{[\s\S]*?\}\s*;\s*const fnOrigHide/m;
    if (oldHook.test(content)) {
        const newHookPart = `setupGlobalHooks() {
            ensureStyles();
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                const oBI = sap.ui.core.BusyIndicator;
                if (!oBI._kyraPatched) {
                    oBI._kyraPatched = true;
                    const fnOrigShow = oBI.show;
                    oBI.show = function(iDelay) {
                        // Suppress native UI5 3-blue-dots BusyIndicator and redirect to project-branded KyraLoader
                        if (KyraLoader && typeof KyraLoader.show === "function") {
                            KyraLoader.show({
                                title: "Loading...",
                                text: "Please wait while we process your request..."
                            });
                        }
                        return;
                    };
                    const fnOrigHide`;
        content = content.replace(oldHook, newHookPart);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated setupGlobalHooks in ${file}`);
    } else {
        console.warn(`Could not find oldHook pattern in ${file}`);
    }
});

// =========================================================================
// 2. UPDATE VIEW XML (Place buttons directly nearby the dropdown box)
// =========================================================================
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml'
];

const newTargetSystemsXml = `<VBox visible="{= !\\\${accessModel>/isEditingFromSummary} &amp;&amp; \\\${accessModel>/hasRegionalSystems} !== false }" class="sapUiSmallMarginBottom kyraTargetSystemsContainer">
                                <Title text="Target Systems &amp; Process Selection" level="H5" class="kyraTargetSystemsTitle sapUiTinyMarginBottom" />
                                
                                <Label text="Select Target Systems &amp; Processes" required="true" class="kyraTargetSystemsLabel sapUiTinyMarginBottom" labelFor="inPageSystemsMultiSelect" />
                                
                                <HBox alignItems="Center" gap="12px" class="kyraTargetSystemsRow">
                                    <MultiComboBox
                                        id="inPageSystemsMultiSelect"
                                        selectedKeys="{accessModel>/addAccessSelectedSystems}"
                                        selectionChange=".onInPageTargetSystemsSelectionChange"
                                        selectionFinish=".onInPageTargetSystemsSelectionChange"
                                        items="{accessModel>/activeAdminSystems}"
                                        placeholder="Select target system processes..."
                                        width="460px"
                                        enabled="{= !\\\${accessModel>/isTargetSystemsConfirmed} }"
                                        class="fioriFormSelect kyraTargetSystemsSelect">
                                        <core:Item key="{accessModel>systemName}" text="{accessModel>systemName}" />
                                    </MultiComboBox>

                                    <!-- ACTION BUTTONS ALIGNED RIGHT NEXT TO THE DROPDOWN -->
                                    <HBox alignItems="Center" gap="8px" class="kyraTargetSystemsActionBtns">
                                        <Button
                                            id="btnEditTargetSystems"
                                            text="Edit"
                                            icon="sap-icon://edit"
                                            type="Default"
                                            press=".onEditTargetSystemsSelection"
                                            visible="{accessModel>/isTargetSystemsConfirmed}"
                                            class="kyraSecondaryBtn" />
                                        <Button
                                            id="btnConfirmTargetSystems"
                                            text="Confirm"
                                            icon="sap-icon://accept"
                                            type="Emphasized"
                                            press=".onConfirmTargetSystemsSelection"
                                            enabled="{= !\\\${accessModel>/isTargetSystemsConfirmed} }"
                                            class="kyraPrimaryBtn" />
                                    </HBox>
                                </HBox>
                            </VBox>`;

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let xml = fs.readFileSync(file, 'utf8');

    // Replace the SimpleForm and following HBox (Confirm/Edit) with the unified nearby row
    const pattern = /<form:SimpleForm[^>]*?>[\s\S]*?<core:Title text="Target Systems &amp; Process Selection" \/>[\s\S]*?<\/form:SimpleForm>\s*<!-- TARGET SYSTEMS CONFIRM &amp; EDIT ACTION ROW[^>]*?-->\s*<HBox[^>]*?btnEditTargetSystems[\s\S]*?<\/HBox>/;
    if (pattern.test(xml)) {
        xml = xml.replace(pattern, newTargetSystemsXml);
        fs.writeFileSync(file, xml, 'utf8');
        console.log(`Updated Target Systems layout in ${file}`);
    } else {
        console.warn(`Could not match Target Systems layout in ${file}`);
    }
});

// =========================================================================
// 3. UPDATE CONTROLLER (Timing and KyraLoader integration)
// =========================================================================
const ctrlFiles = [
    'webapp/pages/access/AccessPage.controller.js',
    'webapp/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js',
    'dist/AccessPage.controller.js'
];

ctrlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let ctrl = fs.readFileSync(file, 'utf8');

    // In onConfirmTargetSystemsSelection, replace BusyIndicator with KyraLoader & proper timing
    const confirmPattern = /async onConfirmTargetSystemsSelection\(\)\s*\{[\s\S]*?\/\/ Single loading screen for all selected systems\s*sap\.ui\.core\.BusyIndicator\.show\(0\);[\s\S]*?await Promise\.all\(aFetchPromises\);\s*sap\.ui\.core\.BusyIndicator\.hide\(\);/;
    
    if (confirmPattern.test(ctrl)) {
        const newConfirmLogic = `async onConfirmTargetSystemsSelection() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            let aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            if (!Array.isArray(aSystems) || aSystems.length === 0) {
                const oSelect = this.byId("inPageSystemsMultiSelect");
                if (oSelect && typeof oSelect.getSelectedKeys === "function") {
                    aSystems = oSelect.getSelectedKeys() || [];
                    oModel.setProperty("/addAccessSelectedSystems", aSystems);
                }
            }

            if (!Array.isArray(aSystems) || aSystems.length === 0) {
                sap.m.MessageBox.warning("Please select at least one Target System and click Confirm.");
                return;
            }

            // Project-related KyraLoader loading screen
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Confirming Target Systems",
                    text: "Loading catalog and entitlements for selected systems..."
                });
            }

            this._dynamicCatalogs = this._dynamicCatalogs || {};

            // Fetch dynamic catalog for all selected SAP BTP systems all at once
            const aFetchPromises = aSystems.map(async (sSys) => {
                if (!sSys || (!sSys.includes("SAP Business Technology Platform") && !sSys.includes("SAP BTP"))) {
                    return null;
                }
                if (this._dynamicCatalogs[sSys] && this._dynamicCatalogs[sSys].ok) {
                    return this._dynamicCatalogs[sSys];
                }
                try {
                    const res = await fetch("/odata/v4/admin-portal/getDynamicSubaccountCatalog", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ targetSystem: sSys })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.ok) {
                            this._dynamicCatalogs[sSys] = data;
                            return data;
                        }
                    }
                } catch (err) {
                    console.warn("[CONFIRM TARGET SYSTEMS] Fetch failed for " + sSys, err);
                }
                return null;
            });

            await Promise.all(aFetchPromises);

            // Proper smooth timing (minimum 700ms) so loader transitions naturally without flicker
            await new Promise(resolve => setTimeout(resolve, 700));

            // Hide project loader
            if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                window.KyraLoader.hide();
            }`;
        ctrl = ctrl.replace(confirmPattern, newConfirmLogic);
        console.log(`Replaced BusyIndicator in onConfirmTargetSystemsSelection in ${file}`);
    } else {
        console.warn(`Could not find onConfirmTargetSystemsSelection pattern in ${file}`);
    }

    // In _fetchDynamicBtpCatalogForSlide, replace BusyIndicator
    const slideFetchPattern = /\/\/\s*Display loading indicator while fetching live data from SAP BTP\s*sap\.ui\.core\.BusyIndicator\.show\(0\);[\s\S]*?sap\.ui\.core\.BusyIndicator\.hide\(\);/m;
    if (slideFetchPattern.test(ctrl)) {
        const newSlideFetch = `// Display project-related KyraLoader while fetching live data from SAP BTP
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Loading SAP BTP Catalog",
                    text: "Retrieving services and role collections..."
                });
            }

            try {
                const res = await fetch("/odata/v4/admin-portal/getDynamicSubaccountCatalog", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ targetSystem: sTarget })
                });

                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                }`;
        ctrl = ctrl.replace(slideFetchPattern, newSlideFetch);
        // Also replace error catch hide
        ctrl = ctrl.replace(/sap\.ui\.core\.BusyIndicator\.hide\(\);\s*console\.warn\("\[DYNAMIC CATALOG\]/g, 'if (window.KyraLoader) window.KyraLoader.hide();\n                console.warn("[DYNAMIC CATALOG]');
        console.log(`Replaced BusyIndicator in _fetchDynamicBtpCatalogForSlide in ${file}`);
    }

    fs.writeFileSync(file, ctrl, 'utf8');
});

// =========================================================================
// 4. UPDATE CSS
// =========================================================================
const cssFiles = [
    'webapp/css/style.css',
    'webapp/pages/access/style.css',
    'dist/css/style.css',
    'dist/pages/access/style.css'
];

const cssSnippet = `
/* ========================================================================= */
/* TARGET SYSTEMS & PROCESS SELECTION (ROW ALIGNMENT & BUTTON DESIGN)        */
/* ========================================================================= */
.kyraTargetSystemsContainer {
    margin-bottom: 16px !important;
}

.kyraTargetSystemsTitle {
    color: #0F172A !important;
    font-weight: 700 !important;
    font-size: 14.5px !important;
}

.kyraTargetSystemsLabel {
    color: #475569 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
}

.kyraTargetSystemsRow {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex-wrap: wrap !important;
}

.kyraTargetSystemsSelect,
.sapMMultiComboBox.kyraTargetSystemsSelect {
    width: 460px !important;
    max-width: 460px !important;
}

.kyraTargetSystemsSelect .sapMInputBaseInner {
    height: 38px !important;
    min-height: 38px !important;
    border-radius: 8px !important;
    font-size: 13.5px !important;
}

.kyraTargetSystemsActionBtns {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    height: 38px !important;
}

.kyraTargetSystemsActionBtns .sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
}

.kyraTargetSystemsActionBtns .sapMBtn .sapMBtnInner {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 36px !important;
    border-radius: 8px !important;
    padding: 0 16px !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* UNIVERSAL SUPPRESSION OF DEFAULT UI5 3-BLUE-DOTS BUSY INDICATOR DIALOG */
.sapUiBusy,
.sapMBusyDialog,
.sapUiLocalBusy,
.sapUiBusyAnimation,
.sapUiBusyIndicator,
html body .sapUiBusy,
html body .sapMBusyDialog {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}
`;

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');
    if (!css.includes('.kyraTargetSystemsRow')) {
        css += '\n' + cssSnippet;
        fs.writeFileSync(file, css, 'utf8');
        console.log(`Appended Target Systems styles to ${file}`);
    } else {
        console.log(`Target Systems styles already present in ${file}`);
    }
});

console.log('=== Done Alignment and Loader Update ===');
