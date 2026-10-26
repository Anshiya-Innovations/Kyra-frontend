const fs = require('fs');
const path = require('path');

const ctrlPath = path.join(__dirname, '../webapp/pages/access/AccessPage.controller.js');
let ctrl = fs.readFileSync(ctrlPath, 'utf8');

// 1. Update onEditSapIntegrationItem
const editFnStart = ctrl.indexOf('onEditSapIntegrationItem(oEvent) {');
if (editFnStart !== -1) {
    const editFnEnd = ctrl.indexOf('onToggleAppHierarchyItem(oEvent) {', editFnStart);
    
    const newEditFn = `onEditSapIntegrationItem(oEvent) {
            if (oEvent) {
                if (typeof oEvent.stopPropagation === "function") oEvent.stopPropagation();
                if (typeof oEvent.preventDefault === "function") oEvent.preventDefault();
                if (oEvent.cancelBubble !== undefined) oEvent.cancelBubble = true;
            }
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            let oItemData = null;
            if (oEvent && typeof oEvent.getSource === "function") {
                const oCtx = oEvent.getSource().getBindingContext("accessModel");
                if (oCtx) {
                    oItemData = oCtx.getObject();
                }
            }
            if (!oItemData) {
                const aList = oModel.getProperty("/sapIntegrationsList") || [];
                oItemData = aList.find(i => (i.subdomain && i.subdomain.includes("singapore")) || (i.appName && i.appName.includes("singapore"))) || aList[0];
            }

            const sRawApp = (oItemData && oItemData.appName) || "sap_btp";
            const sBaseApp = sRawApp.startsWith("sap_btp") ? "sap_btp" : sRawApp;

            oModel.setProperty("/sapIntegration/formMode", "edit");
            oModel.setProperty("/sapIntegration/editingItemId", (oItemData && oItemData.id) || "");
            oModel.setProperty("/sapIntegration/editingDisplayName", (oItemData && oItemData.displayName) || "SAP Business Technology Platform (Singapore)");
            oModel.setProperty("/sapIntegration/selectedApp", sBaseApp);
            oModel.setProperty("/selectedIntegrationType", "sap");
            oModel.setProperty("/adminSelectedSection", "databaseConfig");
            oModel.setProperty("/sapIntegration/currentStep", 1);
            oModel.setProperty("/sapIntegration/isAppExpanded", false);

            if (oItemData) {
                const sRegion = oItemData.region || "ap21";
                const sSubdomain = oItemData.subdomain || "kyra-singapore";
                const sSubaccountId = oItemData.subaccountId || "c47846a0-2a37-40c4-b9f2-c59802307b00";
                const sUrl = oItemData.url || ("https://" + sSubdomain + ".authentication." + sRegion + ".hana.ondemand.com");
                const sTokenUrl = oItemData.tokenUrl || (sUrl + "/oauth/token");
                const sClientId = oItemData.clientId || "sb-na-2b7c733e-87aa-41c7-b1ec-793d57b557c8!a149803";
                const sClientSecret = oItemData.clientSecret || "d5c51266-cf9a-4f33-af1a-b4760f8ed3ac$jS8qsYOmiHzf7SET22HGt66cxwbhGjpyiCbu5yTVgeQ=";
                const sCfOrg = oItemData.cfOrg || sSubdomain;
                const sCfSpace = oItemData.cfSpace || "dev";
                const sCfApiUrl = oItemData.cfApiUrl || ("https://api.cf." + sRegion + ".hana.ondemand.com");

                oModel.setProperty("/sapIntegration/btp/region", sRegion);
                oModel.setProperty("/sapIntegration/btp/subdomain", sSubdomain);
                oModel.setProperty("/sapIntegration/btp/idpOrigin", oItemData.idpOrigin || "sap.ids");
                oModel.setProperty("/sapIntegration/btp/url", sUrl);
                oModel.setProperty("/sapIntegration/btp/subaccountId", sSubaccountId);
                oModel.setProperty("/sapIntegration/btp/tokenUrl", sTokenUrl);
                oModel.setProperty("/sapIntegration/btp/clientId", sClientId);
                oModel.setProperty("/sapIntegration/btp/clientSecret", sClientSecret);
                oModel.setProperty("/sapIntegration/btp/cfOrg", sCfOrg);
                oModel.setProperty("/sapIntegration/btp/cfSpace", sCfSpace);
                oModel.setProperty("/sapIntegration/btp/cfApiUrl", sCfApiUrl);

                let sKeyJson = oItemData.serviceKeyJson || "";
                if (!sKeyJson) {
                    const oKeyObj = {
                        clientid: sClientId,
                        clientsecret: sClientSecret,
                        url: sUrl,
                        apiurl: sCfApiUrl,
                        subaccountid: sSubaccountId,
                        identityzone: sSubdomain
                    };
                    sKeyJson = JSON.stringify(oKeyObj, null, 2);
                }
                oModel.setProperty("/sapIntegration/btp/serviceKeyJson", sKeyJson);
            }

            try { sap.ui.getCore().applyChanges(); } catch (e) {}
            setTimeout(() => {
                this._smoothScrollTo("sapIntegrationConfigContainer", 40);
            }, 40);
        },

        `;
    ctrl = ctrl.substring(0, editFnStart) + newEditFn + ctrl.substring(editFnEnd);
    console.log("Successfully updated onEditSapIntegrationItem in controller!");
}

// 2. In onTestSapIntegration, update item in place when formMode === 'edit'
const targetInTest = 'oModel.setProperty("/sapIntegration/currentStep", 2);';
const idxInTest = ctrl.indexOf(targetInTest, ctrl.indexOf('onTestSapIntegration()'));
if (idxInTest !== -1) {
    const editUpdateCode = `// If in edit mode, update the item in sapIntegrationsList in place
                if (oModel.getProperty("/sapIntegration/formMode") === "edit") {
                    const sEditId = oModel.getProperty("/sapIntegration/editingItemId");
                    const sSubdomain = (btp.subdomain || "").trim();
                    let aList = (oModel.getProperty("/sapIntegrationsList") || []).slice();
                    let bFound = false;
                    for (let i = 0; i < aList.length; i++) {
                        if ((sEditId && aList[i].id === sEditId) || (!sEditId && aList[i].subdomain === sSubdomain)) {
                            aList[i] = Object.assign({}, aList[i], {
                                region: btp.region,
                                subdomain: btp.subdomain,
                                url: btp.url,
                                subaccountId: btp.subaccountId,
                                tokenUrl: btp.tokenUrl,
                                clientId: btp.clientId,
                                clientSecret: btp.clientSecret,
                                cfOrg: btp.cfOrg || btp.subdomain,
                                cfSpace: btp.cfSpace || "dev",
                                cfApiUrl: btp.cfApiUrl,
                                serviceKeyJson: btp.serviceKeyJson,
                                subaccountSubtitle: "Connected Subaccount: " + btp.subdomain + " • Region: " + btp.region + " • Status: Active Enterprise Subscription"
                            });
                            bFound = true;
                            break;
                        }
                    }
                    if (bFound) {
                        oModel.setProperty("/sapIntegrationsList", aList);
                    }
                    oModel.setProperty("/sapIntegration/formMode", "");
                }
                `;
    ctrl = ctrl.substring(0, idxInTest) + editUpdateCode + ctrl.substring(idxInTest);
    console.log("Successfully updated onTestSapIntegration in controller!");
}

// 3. Update onBackToPurchasedApps to reset formMode
const targetBack = 'oModel.setProperty("/sapIntegration/currentStep", 2);';
const idxBack = ctrl.indexOf(targetBack, ctrl.indexOf('onBackToPurchasedApps()'));
if (idxBack !== -1) {
    ctrl = ctrl.substring(0, idxBack) + 'oModel.setProperty("/sapIntegration/formMode", "");\r\n            ' + ctrl.substring(idxBack);
    console.log("Successfully updated onBackToPurchasedApps in controller!");
}

fs.writeFileSync(ctrlPath, ctrl, 'utf8');
console.log("AccessPage.controller.js successfully written!");
