sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("kyra001.pages.kyraFEReq.KyraAddAccess", {

        
        onSodConflictToggleChange: function (oEvent) {
            const sKey = oEvent.getParameter('item') ? oEvent.getParameter('item').getKey() : 'all';
            const oModel = this.getView().getModel('accessModel');
            if (oModel) {
                oModel.setProperty('/sodConflictToggle', sKey);
            }
        },

        onInit: function () {
            this._aSelectedRegionIds = [];
            this._oSystemSlideConfigs = {};
        },

        onAfterRendering: function () {
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();
        },

        onInPageSectorChange: function (oEvent) {
            const sSector = oEvent.getSource().getSelectedKey();
            this.onSelectSector(sSector);
        },

        onSelectSector: function (sSectorKey) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/selectedSector", sSectorKey);

            const oFunctionsMap = {
                "Finance & Enterprise Performance": [
                    { key: "Financial Auditing", text: "Financial Auditing", icon: "sap-icon://money-bills" },
                    { key: "Corporate Accounting", text: "Corporate Accounting", icon: "sap-icon://accounting-document-verification" },
                    { key: "FP&A Governance", text: "FP&A Governance", icon: "sap-icon://lead" }
                ],
                "Global Supply Chain & Logistics": [
                    { key: "Supply Operations", text: "Supply Operations", icon: "sap-icon://shipping-status" },
                    { key: "Inventory Governance", text: "Inventory Governance", icon: "sap-icon://product" },
                    { key: "Procurement Audit", text: "Procurement Audit", icon: "sap-icon://supplier" }
                ],
                "Human Capital Management (HCM)": [
                    { key: "HR Operations", text: "HR Operations", icon: "sap-icon://group" },
                    { key: "Payroll Governance", text: "Payroll Governance", icon: "sap-icon://payroll" },
                    { key: "Talent Compliance", text: "Talent Compliance", icon: "sap-icon://employee" }
                ],
                "Information Technology & Security": [
                    { key: "Identity & Access Governance", text: "Identity & Access Governance", icon: "sap-icon://shield" },
                    { key: "Lead Security Engineering", text: "Lead Security Engineering", icon: "sap-icon://shield-check" },
                    { key: "Cloud Platform Admin", text: "Cloud Platform Admin", icon: "sap-icon://cloud" }
                ],
                "Customer Operations & Sales": [
                    { key: "CRM Governance", text: "CRM Governance", icon: "sap-icon://customer-briefing" },
                    { key: "Sales Operations Audit", text: "Sales Operations Audit", icon: "sap-icon://sales-order" },
                    { key: "Customer Success Mgmt", text: "Customer Success Mgmt", icon: "sap-icon://manager" }
                ]
            };

            const aFuncs = oFunctionsMap[sSectorKey] || [];
            oModel.setProperty("/availableFunctions", aFuncs);
            oModel.setProperty("/selectedFunction", "");
        },

        onGoToAddAccessStep1: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 1);
            }
        },

        onGoToAddAccessStep2: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");

            if (!sSector || sSector.trim() === "") {
                MessageBox.error("Please select a Business Sector before proceeding to the next step.");
                return;
            }

            if (!sFunction || sFunction.trim() === "") {
                MessageBox.error("Please select a Business Function before proceeding to the next step.");
                return;
            }

            oModel.setProperty("/addAccessStep", 2);
            setTimeout(() => {
                this._renderPins();
                this._attachSelectAllListener();
                this._updateSelectedChips();
            }, 100);
        },

        _attachSelectAllListener: function () {
            const oSelectAll = document.getElementById("selectAllBtn");
            if (!oSelectAll) {
                setTimeout(this._attachSelectAllListener.bind(this), 100);
                return;
            }

            if (oSelectAll._listenerAttached) return;
            oSelectAll._listenerAttached = true;

            oSelectAll.addEventListener("click", () => {
                const oModel = this.getView().getModel("accessModel");
                if (!oModel) return;
                const aRegions = oModel.getProperty("/mapRegionList") || [];
                
                if (!this._aSelectedRegionIds) {
                    this._aSelectedRegionIds = [];
                }

                if (this._aSelectedRegionIds.length === aRegions.length) {
                    this._aSelectedRegionIds = [];
                    oSelectAll.classList.remove("active");
                } else {
                    this._aSelectedRegionIds = aRegions.map(r => r.id);
                    oSelectAll.classList.add("active");
                }

                this._updatePinSelectionStates();
                this._updateSelectedChips();
            });
        },

        _renderPins: function () {
            const oPinsLayer = document.getElementById("pinsLayer");
            if (!oPinsLayer) {
                setTimeout(this._renderPins.bind(this), 100);
                return;
            }

            oPinsLayer.innerHTML = "";
            const oModel = this.getView().getModel("accessModel");
            const aRegions = (oModel && oModel.getProperty("/mapRegionList")) || [
                { id: "north-america", name: "North America", x: 23, y: 34 },
                { id: "latin-america", name: "Latin America", x: 33, y: 68 },
                { id: "europe", name: "Europe", x: 50, y: 30 },
                { id: "middle-east", name: "Middle East", x: 58, y: 44 },
                { id: "africa", name: "Africa", x: 52, y: 56 },
                { id: "asia-pacific", name: "Asia-Pacific", x: 74, y: 38 },
                { id: "australia", name: "Australia & Oceania", x: 82, y: 72 }
            ];

            const self = this;
            aRegions.forEach((region) => {
                const oPinContainer = document.createElement("div");
                oPinContainer.className = "map-pin-container";
                oPinContainer.style.left = `${region.x}%`;
                oPinContainer.style.top = `${region.y}%`;
                oPinContainer.setAttribute("data-id", region.id);

                if ((self._aSelectedRegionIds || []).indexOf(region.id) !== -1) {
                    oPinContainer.classList.add("active");
                }

                oPinContainer.innerHTML = `
                  <div class="map-pin">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z"/>
                    </svg>
                  </div>
                  <div class="pin-label">${region.name}</div>
                `;

                oPinContainer.addEventListener("click", () => {
                    self.toggleRegionSelection(region.id);
                });

                oPinsLayer.appendChild(oPinContainer);
            });
        },

        toggleRegionSelection: function (sId) {
            if (!this._aSelectedRegionIds) {
                this._aSelectedRegionIds = [];
            }
            const idx = this._aSelectedRegionIds.indexOf(sId);
            if (idx === -1) {
                this._aSelectedRegionIds.push(sId);
            } else {
                this._aSelectedRegionIds.splice(idx, 1);
            }

            this._updatePinSelectionStates();
            this._updateSelectedChips();
            this._updateSelectAllButtonState();
        },

        _updatePinSelectionStates: function () {
            const self = this;
            document.querySelectorAll(".map-pin-container").forEach((el) => {
                const sId = el.getAttribute("data-id");
                const bSelected = (self._aSelectedRegionIds || []).indexOf(sId) !== -1;
                el.classList.toggle("active", bSelected);
            });
        },

        _updateSelectAllButtonState: function () {
            const oSelectAll = document.getElementById("selectAllBtn");
            if (oSelectAll) {
                const oModel = this.getView().getModel("accessModel");
                const aRegions = oModel ? oModel.getProperty("/mapRegionList") || [] : [];
                const bAllSelected = aRegions.length > 0 && (this._aSelectedRegionIds || []).length === aRegions.length;
                oSelectAll.classList.toggle("active", bAllSelected);
            }
        },

        _updateSelectedChips: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aRegions = oModel.getProperty("/mapRegionList") || [];
            const aSelected = aRegions.filter((r) => (this._aSelectedRegionIds || []).indexOf(r.id) !== -1);

            oModel.setProperty("/mapSelectedRegions", aSelected);
            oModel.setProperty("/hasMapRegionSelection", aSelected.length > 0);

            if (aSelected.length === 0) {
                oModel.setProperty("/addAccessRegion", "");
            } else if (aSelected.length === aRegions.length) {
                oModel.setProperty("/addAccessRegion", "Global Enterprise (ALL)");
            } else {
                oModel.setProperty("/addAccessRegion", aSelected.map(r => r.name).join(", "));
            }
        },

        onRemoveMapRegionChip: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            if (!oContext) return;
            const sId = oContext.getProperty("id");
            if (sId) {
                this.toggleRegionSelection(sId);
            }
        },

        onGoToAddAccessStep3: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aMapSelected = oModel.getProperty("/mapSelectedRegions") || [];
            const sRegion = oModel.getProperty("/addAccessRegion");

            if (aMapSelected.length === 0 && (!sRegion || sRegion.trim() === "")) {
                MessageBox.error("Please select at least one Operating Region on the map before proceeding to Configuration.");
                return;
            }

            oModel.setProperty("/isEditingFromSummary", false);
            oModel.setProperty("/addAccessStep", 3);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            oModel.setProperty("/addAccessCurrentSystemIndex", 0);
            
            if (!oModel.getProperty("/addAccessSystemSlideConfigs")) {
                oModel.setProperty("/addAccessSystemSlideConfigs", {});
            }

            this._loadCurrentSystemSlideConfig();
        },

        onInPageTargetSystemsSelectionChange: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex >= aSystems.length) {
                iIndex = Math.max(0, aSystems.length - 1);
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex);
            }

            this._loadCurrentSystemSlideConfig();
        },

        _loadCurrentSystemSlideConfig: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sCurrentSys = aSystems[iIndex] || "";

            oModel.setProperty("/currentSystemSlideName", sCurrentSys);

            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const oSavedConfig = oSlideConfigsMap[sCurrentSys] || {
                services: [],
                roles: [],
                personas: []
            };

            oModel.setProperty("/addAccessSelectedServices", oSavedConfig.services || []);
            this._updateSubRolesList(true);
            oModel.setProperty("/addAccessSelectedRoles", oSavedConfig.roles || []);
            this._updatePersonasList(true);
            oModel.setProperty("/addAccessSelectedPersonas", oSavedConfig.personas || []);
        },

        _saveCurrentSystemSlideConfig: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sCurrentSys = oModel.getProperty("/currentSystemSlideName");
            if (!sCurrentSys) return;

            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            oSlideConfigsMap[sCurrentSys] = {
                services: oModel.getProperty("/addAccessSelectedServices") || [],
                roles: oModel.getProperty("/addAccessSelectedRoles") || [],
                personas: oModel.getProperty("/addAccessSelectedPersonas") || []
            };

            oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);
        },

        onNextSystemSlide: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aServices = oModel.getProperty("/addAccessSelectedServices") || [];
            const aRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            const aPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];

            if (aServices.length === 0 || aRoles.length === 0 || aPersonas.length === 0) {
                MessageBox.error("Please complete Service, Team Role, and Persona selections for this system slide before proceeding.");
                return;
            }

            this._saveCurrentSystemSlideConfig();

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;

            if (iIndex + 1 < aSystems.length) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex + 1);
                this._loadCurrentSystemSlideConfig();
            }
        },

        onPrevSystemSlide: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._saveCurrentSystemSlideConfig();

            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex > 0) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex - 1);
                this._loadCurrentSystemSlideConfig();
            }
        },

        onCompleteSystemSlides: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aServices = oModel.getProperty("/addAccessSelectedServices") || [];
            const aRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            const aPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];

            if (aServices.length === 0 || aRoles.length === 0 || aPersonas.length === 0) {
                MessageBox.error("Please complete Service, Team Role, and Persona selections for this system slide.");
                return;
            }

            this._saveCurrentSystemSlideConfig();
            oModel.setProperty("/addAccessConfigSubStep", 2);
        },

        onBackToSystemSlides: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessConfigSubStep", 1);
            }
        },

        onInPageServicesSelectionChange: function () {
            this._updateSubRolesList(false);
            this._updatePersonasList(false);
        },

        _updateSubRolesList: function (bPreserveSelections) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oServicesRolesMap = {
                "System Administrator": [
                    { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)", icon: "sap-icon://developer-settings" },
                    { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)", icon: "sap-icon://user-settings" },
                    { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)", icon: "sap-icon://header" },
                    { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)", icon: "sap-icon://shield-check" }
                ],
                "System Owners": [
                    { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)", icon: "sap-icon://manager" },
                    { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)", icon: "sap-icon://header" }
                ],
                "Stakeholders": [
                    { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)", icon: "sap-icon://customer-briefing" },
                    { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)", icon: "sap-icon://group" },
                    { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)", icon: "sap-icon://shield" },
                    { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://security-risk" }
                ]
            };

            const aSelectedServices = oModel.getProperty("/addAccessSelectedServices") || [];
            let aCombinedRoles = [];
            aSelectedServices.forEach(sServ => {
                if (oServicesRolesMap[sServ]) {
                    aCombinedRoles = aCombinedRoles.concat(oServicesRolesMap[sServ]);
                }
            });

            oModel.setProperty("/addAccessSubRolesList", aCombinedRoles);

            if (!bPreserveSelections) {
                const aValidRoleKeys = aCombinedRoles.map(r => r.key);
                let aCurrRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
                aCurrRoles = aCurrRoles.filter(k => aValidRoleKeys.includes(k));
                oModel.setProperty("/addAccessSelectedRoles", aCurrRoles);
            }
        },

        onInPageTeamSelectionChange: function () {
            this._updatePersonasList(false);
        },

        _updatePersonasList: function (bPreserveSelections) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oTeamPersonasMap = {
                "IT Developers (System Administrator)": [
                    { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://customer-and-supplier" },
                    { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://database" }
                ],
                "IT Administrators (System Administrator)": [
                    { key: "IT Infrastructure Admin Persona (IT Administrators)", text: "IT Infrastructure Admin Persona (IT Administrators)", icon: "sap-icon://action-settings" }
                ],
                "Lead Engineer (System Administrator)": [
                    { key: "Lead Enterprise Architect Persona (Lead Engineer)", text: "Lead Enterprise Architect Persona (Lead Engineer)", icon: "sap-icon://lead" }
                ],
                "IT Security (System Administrator)": [
                    { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" }
                ],
                "Technical Product Owner (System Owner)": [
                    { key: "Technical Platform Owner Persona (TPO)", text: "Technical Platform Owner Persona (TPO)", icon: "sap-icon://manager" }
                ],
                "Product Group Engineer (System Owner)": [
                    { key: "Engineering Group Lead Persona (PGE)", text: "Engineering Group Lead Persona (PGE)", icon: "sap-icon://header" }
                ],
                "Business Product Owner (Stakeholders)": [
                    { key: "Business Solutions Owner Persona (BPO)", text: "Business Solutions Owner Persona (BPO)", icon: "sap-icon://customer-briefing" }
                ],
                "Line Manager (Stakeholders)": [
                    { key: "Line Operations Manager Persona (Line Manager)", text: "Line Operations Manager Persona (Line Manager)", icon: "sap-icon://group" }
                ],
                "Compliance Manager (Stakeholders)": [
                    { key: "Audit & Risk Compliance Persona (Compliance Manager)", text: "Audit & Risk Compliance Persona (Compliance Manager)", icon: "sap-icon://shield" }
                ],
                "ISRM (Stakeholders)": [
                    { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://security-risk" }
                ]
            };

            const aSelectedRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            let aCombinedPersonas = [];
            aSelectedRoles.forEach(sRoleKey => {
                if (oTeamPersonasMap[sRoleKey]) {
                    aCombinedPersonas = aCombinedPersonas.concat(oTeamPersonasMap[sRoleKey]);
                }
            });

            oModel.setProperty("/addAccessPersonasList", aCombinedPersonas);

            if (!bPreserveSelections) {
                const aValidPersKeys = aCombinedPersonas.map(p => p.key);
                let aCurrPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];
                aCurrPersonas = aCurrPersonas.filter(k => aValidPersKeys.includes(k));
                oModel.setProperty("/addAccessSelectedPersonas", aCurrPersonas);
            }
        },

        onGoToAddAccessStep4: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._saveCurrentSystemSlideConfig();

            const sRegion = oModel.getProperty("/addAccessRegion");
            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const sDuration = oModel.getProperty("/addAccessDuration");
            const sJustification = (oModel.getProperty("/addAccessJustification") || "").trim();

            if (!sRegion || sRegion.trim() === "") {
                MessageBox.error("Please select an Operating Region.");
                oModel.setProperty("/addAccessStep", 2);
                return;
            }
            if (aSystems.length === 0) {
                MessageBox.error("Please select at least one Target System.");
                return;
            }
            if (!sDuration || sDuration.trim() === "") {
                MessageBox.error("Please select Access Duration.");
                return;
            }
            if (!sJustification) {
                MessageBox.error("Please enter Business Justification.");
                return;
            }

            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
        },

        onGoToStep4Slide1: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep4SubStep", 1);
            }
        },

        onGoToStep4Slide2: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep4SubStep", 2);
            }
        },

        onGoToAddAccessStep5: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._compileSummaryTableData();
            oModel.setProperty("/addAccessStep", 5);
        },

        _compileSummaryTableData: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const sDuration = oModel.getProperty("/addAccessDuration") || "Permanent (Default)";

            const aExistingRoles = oModel.getProperty("/activeRoles") || [];
            const aPendingReqs = oModel.getProperty("/myPendingRequests") || [];

            const aSummaryTables = [];
            let iSysCounter = 1;

            aSystems.forEach(sSys => {
                const oCfg = oSlideConfigsMap[sSys] || { services: [], roles: [], personas: [] };
                const aPersonas = oCfg.personas || [];
                if (aPersonas.length === 0) return;

                const aItems = [];
                aPersonas.forEach(sPers => {
                    const sRole = oCfg.roles[0] || "IT Developers (System Administrator)";
                    const sTopic = oCfg.services[0] || "System Administrator";

                    const bAlreadyActive = aExistingRoles.some(r => r.system === sSys && r.roleName === sRole);
                    const bAlreadyPending = aPendingReqs.some(r => r.system === sSys && r.roleName === sRole);

                    let sStatus = "New Request";
                    let sStatusType = "new";
                    let sState = "Success";
                    let sIcon = "sap-icon://add";

                    if (bAlreadyActive) {
                        sStatus = "Already has this access";
                        sStatusType = "existing";
                        sState = "Information";
                        sIcon = "sap-icon://sys-enter-2";
                    } else if (bAlreadyPending) {
                        sStatus = "Already Requested";
                        sStatusType = "pending";
                        sState = "Warning";
                        sIcon = "sap-icon://pending";
                    }

                    aItems.push({
                        requestId: "REQ-2026-" + Math.floor(100000 + Math.random() * 900000),
                        system: sSys,
                        topic: sTopic,
                        roleTitle: sRole.replace(/\s*\([^)]*\)/g, ""),
                        roleName: sRole,
                        persona: sPers,
                        duration: sDuration,
                        existingStatus: sStatus,
                        statusType: sStatusType,
                        existingState: sState,
                        existingIcon: sIcon
                    });
                });

                if (aItems.length > 0) {
                    aSummaryTables.push({
                        systemName: sSys,
                        systemIndex: iSysCounter++,
                        systemIcon: "sap-icon://database",
                        items: aItems
                    });
                }
            });

            oModel.setProperty("/addAccessSummaryTables", aSummaryTables);
        },

        onEditSystemConfiguration: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            if (!oContext) return;

            const sTargetSys = oContext.getProperty("systemName");
            const oModel = this.getView().getModel("accessModel");
            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];

            const iIndex = aSystems.indexOf(sTargetSys);
            if (iIndex !== -1) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex);
                oModel.setProperty("/isEditingFromSummary", true);
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 1);
                this._loadCurrentSystemSlideConfig();
            }
        },

        onSaveAndReturnToSummary: function () {
            this._saveCurrentSystemSlideConfig();
            this._compileSummaryTableData();
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/isEditingFromSummary", false);
                oModel.setProperty("/addAccessStep", 5);
            }
        },

        onRemoveInPageSummaryItem: function (oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oRowData = oItem.getBindingContext("accessModel").getObject();
            const oModel = this.getView().getModel("accessModel");

            MessageBox.confirm(`Remove entitlement '${oRowData.roleTitle}' from request?`, {
                title: "Remove Item",
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const aTables = oModel.getProperty("/addAccessSummaryTables") || [];
                        aTables.forEach(tbl => {
                            if (tbl.systemName === oRowData.system) {
                                tbl.items = tbl.items.filter(i => i.persona !== oRowData.persona);
                            }
                        });
                        const aFilteredTables = aTables.filter(tbl => tbl.items.length > 0);
                        oModel.setProperty("/addAccessSummaryTables", aFilteredTables);
                        MessageToast.show("Item removed.");
                    }
                }
            });
        },

        onGoBackToDurationSlide: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 2);
            }
        },

        onCloseAddAccessSector: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showAddAccessSector", false);
            }
        },

        onFinalSubmitInPageAddAccess: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aTables = oModel.getProperty("/addAccessSummaryTables") || [];
            const aValidItems = [];
            const aSkippedItems = [];

            aTables.forEach(tbl => {
                tbl.items.forEach(i => {
                    if (i.statusType === "new") {
                        aValidItems.push(i);
                    } else {
                        aSkippedItems.push(i);
                    }
                });
            });

            if (aValidItems.length === 0 && aSkippedItems.length === 0) {
                MessageBox.error("No configured entitlements to submit.");
                return;
            }

            let sPopupHtml = `<div style="font-family: inherit;">
                <p style="margin: 0 0 14px 0; color: #475569; font-size: 13.5px;">
                    Your access requests have been successfully submitted and synchronized with the database.
                </p>`;

            if (aValidItems.length > 0) {
                sPopupHtml += `
                <div class="kyra-dialog-section-header" style="color: #15803D;">
                    <span>Submitted to Database</span>
                    <span class="kyra-dialog-badge kyra-dialog-badge-success">${aValidItems.length} Item(s)</span>
                </div>
                <div class="kyra-dialog-list">
                    ${aValidItems.map(i => `
                        <div class="kyra-dialog-item-row kyra-dialog-item-card">
                            <div class="kyra-dialog-card-left">
                                <div class="kyra-dialog-card-top-row">
                                    <span class="kyra-dialog-req-id">${i.requestId}</span>
                                    <span class="kyra-dialog-sys-tag">${i.system}</span>
                                </div>
                                <div class="kyra-dialog-card-role-row">
                                    <span class="kyra-dialog-role-title"><strong>${i.roleTitle || i.roleName}</strong></span>
                                    <span class="kyra-dialog-topic-label">(${i.topic || 'System'})</span>
                                </div>
                                ${i.persona ? `
                                <div class="kyra-dialog-card-persona-row">
                                    <span class="kyra-dialog-persona-badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span>${i.persona}</span>
                                    </span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="kyra-dialog-card-right">
                                <span class="kyra-dialog-item-status-pill kyra-status-submitted">✔ Submitted</span>
                            </div>
                        </div>
                    `).join("")}
                </div>`;
            }

            if (aSkippedItems.length > 0) {
                sPopupHtml += `
                <div class="kyra-dialog-section-header" style="margin-top: 18px;">
                    <span class="kyra-dialog-section-title kyra-text-amber">Excluded / Already Configured</span>
                    <span class="kyra-dialog-badge kyra-dialog-badge-warning">${aSkippedItems.length} Items</span>
                </div>
                <div class="kyra-dialog-list">
                    ${aSkippedItems.map(i => `
                        <div class="kyra-dialog-item-row kyra-dialog-item-card kyra-dialog-card-warning">
                            <div class="kyra-dialog-card-left">
                                <div class="kyra-dialog-card-top-row">
                                    <span class="kyra-dialog-req-id kyra-req-id-warning">${i.requestId}</span>
                                    <span class="kyra-dialog-sys-tag kyra-sys-tag-warning">${i.system}</span>
                                </div>
                                <div class="kyra-dialog-card-role-row">
                                    <span class="kyra-dialog-role-title kyra-role-title-warning">${i.roleTitle || i.roleName}</span>
                                    <span class="kyra-dialog-topic-label">(${i.topic || 'Stakeholders'})</span>
                                </div>
                                ${i.persona ? `
                                <div class="kyra-dialog-card-persona-row">
                                    <span class="kyra-dialog-persona-badge kyra-persona-warning">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span>${i.persona}</span>
                                    </span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="kyra-dialog-card-right">
                                <span class="kyra-dialog-item-status-pill kyra-status-skipped">Already has this access</span>
                            </div>
                        </div>
                    `).join("")}
                </div>`;
            }

            sPopupHtml += `</div>`;

            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                window.KyraDialog.show({
                    title: "Access Request Submitted",
                    messageHtml: sPopupHtml,
                    type: "success",
                    maxWidth: "700px",
                    buttonText: "Done"
                });
            } else {
                MessageBox.information("Access Request processing complete!", {
                    title: "Access Request Submitted"
                });
            }
        }
    });
});
