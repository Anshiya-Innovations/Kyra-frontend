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

        onInit: function () {
            this._aSelectedRegionIds = [];
            this._oSystemSlideConfigs = {};
        },

        onAfterRendering: function () {
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();
        },

        // =========================================================================
        // SLIDE 1: BUSINESS SECTOR & FUNCTION HANDLERS
        // =========================================================================
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
                this._updatePinSelectionStates();
                this._updateSelectedChips();
                this._updateSelectAllButtonState();
            }, 100);
        },

        _resetRegionSelection: function () {
            this._aSelectedRegionIds = [];
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/mapSelectedRegions", []);
                oModel.setProperty("/hasMapRegionSelection", false);
                oModel.setProperty("/addAccessRegion", "");
            }
            const oSelectAll = document.getElementById("selectAllBtn");
            if (oSelectAll) {
                oSelectAll.classList.remove("active");
            }
            setTimeout(() => {
                this._renderPins();
                this._attachSelectAllListener();
                this._updateSelectedChips();
                this._updateSelectAllButtonState();
            }, 100);
        },

        // =========================================================================
        // SLIDE 2: REGION MAP CONTROLLER LOGIC
        // =========================================================================
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

            // Dynamically resolve and set the correct world-map.jpg URL
            const oImg = document.getElementById("worldMapImgAccessPage");
            if (oImg) {
                oImg.src = sap.ui.require.toUrl("kyra001/world-map.jpg");
            }

            const aRegions = [
                { id: "na", name: "North America", left: "20.5%", top: "32%" },
                { id: "latam", name: "Latin America", left: "32.2%", top: "68%" },
                { id: "eu", name: "Europe", left: "52%", top: "28%" },
                { id: "me", name: "Middle East", left: "60%", top: "43.5%" },
                { id: "af", name: "Africa", left: "53.2%", top: "58.5%" },
                { id: "as", name: "Asia", left: "73%", top: "35%" },
                { id: "apac", name: "Oceania / Australia", left: "84.5%", top: "72%" }
            ];

            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/mapRegionList", aRegions);
            }

            const self = this;
            aRegions.forEach((region) => {
                const oPinContainer = document.createElement("div");
                oPinContainer.className = "map-pin-container";
                oPinContainer.style.left = region.left;
                oPinContainer.style.top = region.top;
                oPinContainer.setAttribute("data-id", region.id);

                if ((self._aSelectedRegionIds || []).indexOf(region.id) !== -1) {
                    oPinContainer.classList.add("active");
                }

                oPinContainer.innerHTML = `
                  <div class="map-pin">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
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

        // =========================================================================
        // SLIDE 3 & 4: TARGET SYSTEM CONFIGURATION & DURATION
        // =========================================================================
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
                    { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)", icon: "sap-icon://user-settings" },
                    { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://security-risk" },
                    { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)", icon: "sap-icon://shield" }
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
                    { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                    { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" }
                ],
                "IT Administrators (System Administrator)": [
                    { key: "Cloud Infrastructure Administrator Persona (IT Administrators)", text: "Cloud Infrastructure Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                    { key: "Database & IAM Administrator Persona (IT Administrators)", text: "Database & IAM Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" }
                ],
                "Lead Engineer (System Administrator)": [
                    { key: "Principal Systems Engineer Persona (Lead Engineer)", text: "Principal Systems Engineer Persona (Lead Engineer)", icon: "sap-icon://header" },
                    { key: "DevOps & Platform Lead Persona (Lead Engineer)", text: "DevOps & Platform Lead Persona (Lead Engineer)", icon: "sap-icon://header" }
                ],
                "IT Security (System Administrator)": [
                    { key: "Security Audit & GRC Persona (IT Security)", text: "Security Audit & GRC Persona (IT Security)", icon: "sap-icon://shield-check" },
                    { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" }
                ],
                "Technical Product Owner (System Owner)": [
                    { key: "Technical Product Manager Persona (Technical Product Owner)", text: "Technical Product Manager Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                    { key: "Solution Architecture Owner Persona (Technical Product Owner)", text: "Solution Architecture Owner Persona (Technical Product Owner)", icon: "sap-icon://manager" }
                ],
                "Product Group Engineer (System Owner)": [
                    { key: "Product Suite Engineer Persona (Product Group Engineer)", text: "Product Suite Engineer Persona (Product Group Engineer)", icon: "sap-icon://header" },
                    { key: "Integration Engineering Lead Persona (Product Group Engineer)", text: "Integration Engineering Lead Persona (Product Group Engineer)", icon: "sap-icon://header" }
                ],
                "Business Product Owner (Stakeholders)": [
                    { key: "Business Strategy Lead Persona (Business Product Owner)", text: "Business Strategy Lead Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                    { key: "Enterprise Process Owner Persona (Business Product Owner)", text: "Enterprise Process Owner Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" }
                ],
                "Line Manager (Stakeholders)": [
                    { key: "Department Resource Manager Persona (Line Manager)", text: "Department Resource Manager Persona (Line Manager)", icon: "sap-icon://group" },
                    { key: "People Operations Lead Persona (Line Manager)", text: "People Operations Lead Persona (Line Manager)", icon: "sap-icon://group" }
                ],
                "Compliance Manager (Stakeholders)": [
                    { key: "Regulatory Compliance Officer Persona (Compliance Manager)", text: "Regulatory Compliance Officer Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Data Privacy Auditor Persona (Compliance Manager)", text: "Data Privacy Auditor Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" }
                ],
                "Role Owner (Stakeholders)": [
                    { key: "Entitlement & Role Custodian Persona (Role Owner)", text: "Entitlement & Role Custodian Persona (Role Owner)", icon: "sap-icon://user-settings" },
                    { key: "Access Governance Approver Persona (Role Owner)", text: "Access Governance Approver Persona (Role Owner)", icon: "sap-icon://user-settings" }
                ],
                "ISRM (Stakeholders)": [
                    { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://shield-check" },
                    { key: "Risk & Assessment Analyst Persona (ISRM)", text: "Risk & Assessment Analyst Persona (ISRM)", icon: "sap-icon://shield-check" }
                ],
                "IAM / GRC Team (Stakeholders)": [
                    { key: "Identity Management Specialist Persona (IAM / GRC Team)", text: "Identity Management Specialist Persona (IAM / GRC Team)", icon: "sap-icon://shield" },
                    { key: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", text: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", icon: "sap-icon://shield" }
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

        // =========================================================================
        // SLIDE 5, 6 & 7: VALIDATION, CONFLICT REVIEW & SUMMARY
        // =========================================================================
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

            // Calculate Conflicts and Validation Data based on current selections
            this._calculateValidationAndConflicts();

            // Also compile summary tables with unique consistent Request IDs
            this._compileSummaryTableData();

            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
        },

        _calculateValidationAndConflicts: function () {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const sSector = oModel.getProperty("/selectedSector") || "Information Technology & Security";
            const sFunction = oModel.getProperty("/selectedFunction") || "Identity & Access Governance";
            const aExistingRoles = oModel.getProperty("/activeRoles") || [];

            // 1. Conflict Rules Database / Matrix
            const SOD_CONFLICT_PAIRS = [
                {
                    roleA: "IT Developers",
                    roleB: "IT Administrators",
                    detail: "Critical: IT Developer code execution vs IT Administrator root infrastructure access creates severe segregation of duties conflict.",
                    severityState: "Error",
                    severityIcon: "sap-icon://error"
                },
                {
                    roleA: "IT Developers",
                    roleB: "IT Security",
                    detail: "Critical: Software developer cannot hold Security policy and audit authorization simultaneously.",
                    severityState: "Error",
                    severityIcon: "sap-icon://error"
                },
                {
                    roleA: "IT Administrators",
                    roleB: "Compliance Manager",
                    detail: "Critical: System administrator cannot perform self-audits or manage compliance regulations.",
                    severityState: "Error",
                    severityIcon: "sap-icon://error"
                },
                {
                    roleA: "IT Administrators",
                    roleB: "IT Security",
                    detail: "Critical: IT Infrastructure Administrator vs Active Directory IAM Security Governance.",
                    severityState: "Error",
                    severityIcon: "sap-icon://error"
                },
                {
                    roleA: "Compliance Manager",
                    roleB: "IT Security",
                    detail: "Critical: Security operations and regulatory compliance oversight separation.",
                    severityState: "Error",
                    severityIcon: "sap-icon://error"
                },
                {
                    roleA: "Lead Engineer",
                    roleB: "Compliance Manager",
                    detail: "High: Lead Engineer deployer vs Governance Compliance auditor.",
                    severityState: "Warning",
                    severityIcon: "sap-icon://alert"
                },
                {
                    roleA: "Business Product Owner",
                    roleB: "Line Manager",
                    detail: "Medium: Commercial procurement approvals vs Resource line management operations.",
                    severityState: "Information",
                    severityIcon: "sap-icon://information"
                }
            ];

            // Normalize role title helper
            const normalize = (name) => {
                if (!name) return "";
                let n = name.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
                if (n.startsWith("it developer") || n === "developer") return "it developers";
                if (n.startsWith("it administrator") || n === "it admin" || n === "admin") return "it administrators";
                if (n.startsWith("it security") || n === "security") return "it security";
                if (n.startsWith("lead engineer")) return "lead engineer";
                if (n.startsWith("compliance manager")) return "compliance manager";
                if (n.startsWith("business product owner")) return "business product owner";
                if (n.startsWith("line manager")) return "line manager";
                return n;
            };

            // Collect all selected new roles with system and persona info (Deduplicated)
            const aNewSelectedItems = [];
            const seenNewItemKeys = new Set();
            const aSummaryTables = oModel.getProperty("/addAccessSummaryTables");
            
            if (aSummaryTables && Array.isArray(aSummaryTables) && aSummaryTables.length > 0) {
                aSummaryTables.forEach(tbl => {
                    (tbl.items || []).forEach(item => {
                        const sSys = item.system || tbl.systemName;
                        const sRoleTitle = item.roleTitle || (item.roleName ? item.roleName.replace(/\s*\([^)]*\)/g, "") : "");
                        const sPersona = item.persona || "";
                        const sKey = `${sSys}__${sRoleTitle}__${sPersona}`;

                        if (!seenNewItemKeys.has(sKey)) {
                            seenNewItemKeys.add(sKey);
                            aNewSelectedItems.push({
                                system: sSys,
                                roleTitle: sRoleTitle,
                                roleName: item.roleName || item.roleTitle,
                                persona: sPersona,
                                normalized: normalize(item.roleName || item.roleTitle)
                            });
                        }
                    });
                });
            } else if (aSystems && aSystems.length > 0) {
                aSystems.forEach(sSys => {
                    const oCfg = oSlideConfigsMap[sSys] || { services: [], roles: [], personas: [] };
                    const aRoles = oCfg.roles || [];
                    const aPersonas = oCfg.personas || [];
                    aRoles.forEach((sRole, iIdx) => {
                        const sCleanRole = sRole.replace(/\s*\([^)]*\)/g, "");
                        const sPers = aPersonas[iIdx] || aPersonas[0] || "";
                        const sKey = `${sSys}__${sCleanRole}__${sPers}`;

                        if (!seenNewItemKeys.has(sKey)) {
                            seenNewItemKeys.add(sKey);
                            aNewSelectedItems.push({
                                system: sSys,
                                roleTitle: sCleanRole,
                                roleName: sRole,
                                persona: sPers,
                                normalized: normalize(sRole)
                            });
                        }
                    });
                });
            }

            // A. Existing SoD Conflicts (New selection vs User Active Entitlements & Pending Requests)
            const aActiveSodConflicts = [];
            const aPendingSodConflicts = [];
            const seenActiveConflictKeys = new Set();
            const seenPendingConflictKeys = new Set();

            const aPendingReqs = oModel.getProperty("/myPendingRequests") || [];
            const aHistoryReqs = oModel.getProperty("/requestHistory") || [];
            const aAllPending = [...aPendingReqs, ...aHistoryReqs.filter(r => {
                const st = (r.status || "").toLowerCase();
                return st.includes("pending");
            })];

            aNewSelectedItems.forEach(newItem => {
                const sTargetRole = `${newItem.system} — ${newItem.roleTitle || newItem.roleName}${newItem.persona ? ` (${newItem.persona})` : ''}`;

                // 1. Check against Active Entitlements (Red Theme) - NEW SELECTION VS EXISTING ACCESS
                aExistingRoles.forEach(activeItem => {
                    const activeNorm = normalize(activeItem.roleName);
                    SOD_CONFLICT_PAIRS.forEach(rule => {
                        const ruleANorm = normalize(rule.roleA);
                        const ruleBNorm = normalize(rule.roleB);

                        if ((newItem.normalized === ruleANorm && activeNorm === ruleBNorm) ||
                            (newItem.normalized === ruleBNorm && activeNorm === ruleANorm)) {
                            
                            const sActiveRoleName = activeItem.roleTitle || (activeItem.roleName ? activeItem.roleName.replace(/\s*\([^)]*\)/g, "") : "Active Role");
                            const sActivePersona = activeItem.persona || activeItem.selectedPersona || "";
                            const sConflictingRole = `${activeItem.system} — ${sActiveRoleName}${sActivePersona ? ` (${sActivePersona})` : ''}`;
                            const sKey = `${sTargetRole}__VS__${sConflictingRole}`;

                            if (!seenActiveConflictKeys.has(sKey)) {
                                seenActiveConflictKeys.add(sKey);
                                aActiveSodConflicts.push({
                                    targetRole: sTargetRole,
                                    conflictingRole: sConflictingRole,
                                    conflictDetail: rule.detail,
                                    severityState: "Error",
                                    severityIcon: "sap-icon://error",
                                    conflictOrigin: "active",
                                    conflictingPillClass: "fioriSodExistingPill",
                                    conflictingIcon: "sap-icon://shield-check"
                                });
                            }
                        }
                    });
                });

                // 2. Check against Pending Requests (Yellow Theme) - NEW SELECTION VS PENDING REQUEST
                aAllPending.forEach(pendingItem => {
                    const pendingRoleName = pendingItem.roleTitle || pendingItem.roleName || "";
                    const pendingSystem = pendingItem.system || pendingItem.targetSystem || "Target System";
                    const pendingPersona = pendingItem.selectedPersona || pendingItem.persona || "";
                    const pendingNorm = normalize(pendingRoleName);
                    const sReqNum = pendingItem.requestId || pendingItem.requestNumber || "";

                    SOD_CONFLICT_PAIRS.forEach(rule => {
                        const ruleANorm = normalize(rule.roleA);
                        const ruleBNorm = normalize(rule.roleB);

                        if ((newItem.normalized === ruleANorm && pendingNorm === ruleBNorm) ||
                            (newItem.normalized === ruleBNorm && pendingNorm === ruleANorm)) {
                            
                            const sConflictingRole = `${pendingSystem} — ${pendingRoleName}${pendingPersona ? ` (${pendingPersona})` : ''}${sReqNum ? ` [Pending ${sReqNum}]` : ''}`;
                            const sKey = `${sTargetRole}__VS__${sConflictingRole}`;

                            if (!seenPendingConflictKeys.has(sKey)) {
                                seenPendingConflictKeys.add(sKey);
                                aPendingSodConflicts.push({
                                    targetRole: sTargetRole,
                                    conflictingRole: sConflictingRole,
                                    conflictDetail: `[Pending Request Conflict] ${rule.detail}`,
                                    severityState: "Warning",
                                    severityIcon: "sap-icon://pending",
                                    conflictOrigin: "pending",
                                    conflictingPillClass: "fioriSodPendingPill",
                                    conflictingIcon: "sap-icon://pending"
                                });
                            }
                        }
                    });
                });
            });

            // B. Intra-New SoD Conflicts (Conflicts between items selected in this request)
            const aNewSodConflicts = [];
            const seenNewConflictKeys = new Set();

            for (let i = 0; i < aNewSelectedItems.length; i++) {
                for (let j = i + 1; j < aNewSelectedItems.length; j++) {
                    const item1 = aNewSelectedItems[i];
                    const item2 = aNewSelectedItems[j];
                    SOD_CONFLICT_PAIRS.forEach(rule => {
                        const ruleANorm = normalize(rule.roleA);
                        const ruleBNorm = normalize(rule.roleB);

                        if ((item1.normalized === ruleANorm && item2.normalized === ruleBNorm) ||
                            (item1.normalized === ruleBNorm && item2.normalized === ruleANorm)) {
                            
                            const sTargetRole = `${item1.system} — ${item1.roleTitle || item1.roleName}${item1.persona ? ` (${item1.persona})` : ''}`;
                            const sConflictingRole = `${item2.system} — ${item2.roleTitle || item2.roleName}${item2.persona ? ` (${item2.persona})` : ''}`;
                            const sKey = `${sTargetRole}__VS__${sConflictingRole}`;

                            if (!seenNewConflictKeys.has(sKey)) {
                                seenNewConflictKeys.add(sKey);
                                aNewSodConflicts.push({
                                    targetRole: sTargetRole,
                                    conflictingRole: sConflictingRole,
                                    conflictDetail: rule.detail,
                                    severityState: rule.severityState,
                                    severityIcon: rule.severityIcon,
                                    conflictOrigin: "new",
                                    conflictingPillClass: "fioriSodNewBluePill",
                                    conflictingIcon: "sap-icon://add-process"
                                });
                            }
                        }
                    });
                }
            }

            // Store active, pending, and combined conflict lists
            oModel.setProperty("/activeOnlySodConflictsList", aActiveSodConflicts);
            oModel.setProperty("/pendingOnlySodConflictsList", aPendingSodConflicts);
            oModel.setProperty("/existingSodConflictsList", [...aActiveSodConflicts, ...aPendingSodConflicts]);
            oModel.setProperty("/newSodConflictsList", aNewSodConflicts);
            
            const sToggle = oModel.getProperty("/sodConflictToggle") || "existing";
            oModel.setProperty("/activeSodConflictsList", sToggle === "new" ? (aNewSodConflicts.length > 0 ? aNewSodConflicts : [...aActiveSodConflicts, ...aPendingSodConflicts]) : [...aActiveSodConflicts, ...aPendingSodConflicts]);
            
            // C. Threshold Limits Calculation (Limit = Max 5 Items per system)
            const MAX_THRESHOLD = 5;
            const aThresholdLimits = [];

            aSystems.forEach(sSys => {
                const aSysItems = aNewSelectedItems.filter(i => i.system === sSys);
                if (aSysItems.length >= MAX_THRESHOLD) {
                    const iExcess = aSysItems.length > MAX_THRESHOLD ? (aSysItems.length - MAX_THRESHOLD) : 0;
                    const sExcessPct = iExcess > 0 ? `+${Math.round((iExcess / MAX_THRESHOLD) * 100)}% Excess` : "Limit Reached (5/5)";

                    aThresholdLimits.push({
                        system: sSys,
                        sector: sSector,
                        limit: `Max ${MAX_THRESHOLD} Items / System`,
                        excessivePercentage: sExcessPct
                    });
                }
            });

            if (aThresholdLimits.length === 0 && aNewSelectedItems.length >= MAX_THRESHOLD) {
                const iExcess = aNewSelectedItems.length - MAX_THRESHOLD;
                const sExcessPct = iExcess > 0 ? `+${Math.round((iExcess / MAX_THRESHOLD) * 100)}% Excess` : "Limit Reached (5/5)";

                aThresholdLimits.push({
                    system: "All Target Systems (Batch)",
                    sector: sSector,
                    limit: `Max ${MAX_THRESHOLD} Roles / Request Batch`,
                    excessivePercentage: sExcessPct
                });
            }

            oModel.setProperty("/thresholdLimitsList", aThresholdLimits);

            // D. Restricted Records Calculation
            const aRestrictedRecords = [];
            aNewSelectedItems.forEach(item => {
                const r = (item.roleName || item.roleTitle || "").toLowerCase();
                if (r.includes("it security") || r.includes("compliance manager") || r.includes("isrm") || r.includes("administrator") || r.includes("admin")) {
                    aRestrictedRecords.push({
                        system: item.system,
                        sector: sSector,
                        position: item.roleTitle || item.roleName.replace(/\s*\([^)]*\)/g, ""),
                        persona: item.persona || "Engineering & Developer Persona",
                        moduleName: sFunction,
                        securityGroup: "SEC-PRIV-ELEVATED",
                        teamName: "Core Governance",
                        adGroupName: "AD-KYRA-PRIVILEGED"
                    });
                }
            });
            oModel.setProperty("/restrictedRecordsList", aRestrictedRecords);

            // E. Duplicate Roles Calculation (ONLY Active Entitlements in My Access & Pending Requests in Pending Section)
            const aDuplicateRoles = [];
            const seenDuplicateKeys = new Set();

            aNewSelectedItems.forEach(item => {
                const sNormRole = normalize(item.roleName);
                const sCleanRole = (item.roleTitle || item.roleName || "").replace(/\s*\([^)]*\)/g, "").trim();

                // 1. Check against Active Entitlements in My Access
                const activeMatch = aExistingRoles.find(ar => 
                    (ar.system === item.system || !ar.system) && 
                    (ar.roleName === item.roleName || normalize(ar.roleName) === sNormRole)
                );

                // 2. Check against Pending Requests in Pending Section
                const pendingMatch = aAllPending.find(pr => 
                    (pr.system === item.system || pr.targetSystem === item.system) && 
                    (pr.roleName === item.roleName || pr.roleTitle === item.roleName || normalize(pr.roleName || pr.roleTitle) === sNormRole)
                );

                const dupKey = `${item.system}__${item.roleName}`;

                if (activeMatch && !seenDuplicateKeys.has(`active__${dupKey}`)) {
                    seenDuplicateKeys.add(`active__${dupKey}`);
                    aDuplicateRoles.push({
                        system: item.system,
                        functionalRole: item.roleTitle || item.roleName,
                        persona: item.persona || "Default Persona",
                        moduleName: sFunction,
                        selectedSecurityGroups: "SEC-ACTIVE",
                        teamName: `${sCleanRole} Team`,
                        adGroupName: `AD-KYRA-${sCleanRole.toUpperCase().replace(/\s+/g, "_")}`,
                        existingRole: "Already Active in My Access",
                        existingRoleState: "Information",
                        existingRoleIcon: "sap-icon://shield-check"
                    });
                }

                if (pendingMatch && !seenDuplicateKeys.has(`pending__${dupKey}`)) {
                    seenDuplicateKeys.add(`pending__${dupKey}`);
                    const sReqId = pendingMatch.requestId || pendingMatch.requestNumber || "";
                    const sSuffix = sReqId ? ` (${sReqId})` : "";
                    aDuplicateRoles.push({
                        system: item.system,
                        functionalRole: item.roleTitle || item.roleName,
                        persona: item.persona || "Default Persona",
                        moduleName: sFunction,
                        selectedSecurityGroups: "SEC-PENDING",
                        teamName: `${sCleanRole} Team`,
                        adGroupName: `AD-KYRA-${sCleanRole.toUpperCase().replace(/\s+/g, "_")}`,
                        existingRole: `Already Requested in Pending Section${sSuffix}`,
                        existingRoleState: "Warning",
                        existingRoleIcon: "sap-icon://pending"
                    });
                }
            });
            oModel.setProperty("/duplicateRolesList", aDuplicateRoles);
        },

        onSodConflictToggleChange: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/sodConflictToggle", sKey);
            const aExisting = oModel.getProperty("/existingSodConflictsList") || [];
            const aNew = oModel.getProperty("/newSodConflictsList") || [];

            if (sKey === "new") {
                oModel.setProperty("/activeSodConflictsList", aNew.length > 0 ? aNew : aExisting);
            } else {
                oModel.setProperty("/activeSodConflictsList", aExisting);
            }
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

                 // Mappings for dynamic role/topic lookup
                 const oServicesRolesMap = {
                     "System Administrator": [
                         { key: "IT Developers (System Administrator)" },
                         { key: "IT Administrators (System Administrator)" },
                         { key: "Lead Engineer (System Administrator)" },
                         { key: "IT Security (System Administrator)" }
                     ],
                     "System Owners": [
                         { key: "Technical Product Owner (System Owner)" },
                         { key: "Product Group Engineer (System Owner)" }
                     ],
                     "Stakeholders": [
                         { key: "Business Product Owner (Stakeholders)" },
                         { key: "Line Manager (Stakeholders)" },
                         { key: "Compliance Manager (Stakeholders)" },
                         { key: "Role Owner (Stakeholders)" },
                         { key: "ISRM (Stakeholders)" },
                         { key: "IAM / GRC Team (Stakeholders)" }
                     ]
                 };

                 const oTeamPersonasMap = {
                     "IT Developers (System Administrator)": [
                         { key: "Frontend & UI Developer Persona (IT Developers)" },
                         { key: "Backend & Systems Developer Persona (IT Developers)" }
                     ],
                     "IT Administrators (System Administrator)": [
                         { key: "Cloud Infrastructure Administrator Persona (IT Administrators)" },
                         { key: "Database & IAM Administrator Persona (IT Administrators)" }
                     ],
                     "Lead Engineer (System Administrator)": [
                         { key: "Principal Systems Engineer Persona (Lead Engineer)" },
                         { key: "DevOps & Platform Lead Persona (Lead Engineer)" }
                     ],
                     "IT Security (System Administrator)": [
                         { key: "Security Audit & GRC Persona (IT Security)" },
                         { key: "Cybersecurity Operations Persona (IT Security)" }
                     ],
                     "Technical Product Owner (System Owner)": [
                         { key: "Technical Product Manager Persona (Technical Product Owner)" },
                         { key: "Solution Architecture Owner Persona (Technical Product Owner)" }
                     ],
                     "Product Group Engineer (System Owner)": [
                         { key: "Product Suite Engineer Persona (Product Group Engineer)" },
                         { key: "Integration Engineering Lead Persona (Product Group Engineer)" }
                     ],
                     "Business Product Owner (Stakeholders)": [
                         { key: "Business Strategy Lead Persona (Business Product Owner)" },
                         { key: "Enterprise Process Owner Persona (Business Product Owner)" }
                     ],
                     "Line Manager (Stakeholders)": [
                         { key: "Department Resource Manager Persona (Line Manager)" },
                         { key: "People Operations Lead Persona (Line Manager)" }
                     ],
                     "Compliance Manager (Stakeholders)": [
                         { key: "Regulatory Compliance Officer Persona (Compliance Manager)" },
                         { key: "Data Privacy Auditor Persona (Compliance Manager)" }
                     ],
                     "Role Owner (Stakeholders)": [
                         { key: "Entitlement & Role Custodian Persona (Role Owner)" },
                         { key: "Access Governance Approver Persona (Role Owner)" }
                     ],
                     "ISRM (Stakeholders)": [
                         { key: "Information Security Risk Manager Persona (ISRM)" },
                         { key: "Risk & Assessment Analyst Persona (ISRM)" }
                     ],
                     "IAM / GRC Team (Stakeholders)": [
                         { key: "Identity Management Specialist Persona (IAM / GRC Team)" },
                         { key: "Governance Risk Compliance Lead Persona (IAM / GRC Team)" }
                     ]
                 };

                 const aItems = [];
                 aPersonas.forEach(sPers => {
                     let sRole = oCfg.roles[0] || "IT Developers (System Administrator)";
                     let sTopic = oCfg.services[0] || "System Administrator";

                     // Dynamically look up the correct parent role for the persona
                     for (const rKey of Object.keys(oTeamPersonasMap)) {
                         const hasPers = oTeamPersonasMap[rKey].some(p => p.key === sPers);
                         if (hasPers) {
                             sRole = rKey;
                             break;
                         }
                     }

                     // Dynamically look up the correct parent service topic for the role
                     for (const sKey of Object.keys(oServicesRolesMap)) {
                         const hasRole = oServicesRolesMap[sKey].some(r => r.key === sRole);
                         if (hasRole) {
                             sTopic = sKey;
                             break;
                         }
                     }

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
            this._calculateValidationAndConflicts();
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
                                tbl.items = tbl.items.filter(i => (i.persona ? i.persona !== oRowData.persona : i.roleName !== oRowData.roleName));
                            }
                        });
                        const aFilteredTables = aTables.filter(tbl => tbl.items.length > 0);
                        oModel.setProperty("/addAccessSummaryTables", aFilteredTables);

                        // Synchronize with addAccessSystemSlideConfigs
                        const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
                        if (oSlideConfigsMap[oRowData.system]) {
                            const oSysCfg = oSlideConfigsMap[oRowData.system];
                            oSysCfg.personas = (oSysCfg.personas || []).filter(p => p !== oRowData.persona);
                            if (oSysCfg.personas.length === 0) {
                                delete oSlideConfigsMap[oRowData.system];
                                const aSystems = (oModel.getProperty("/addAccessSelectedSystems") || []).filter(s => s !== oRowData.system);
                                oModel.setProperty("/addAccessSelectedSystems", aSystems);
                            }
                            oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);
                        }

                        // Re-calculate Validation and Conflicts so removal immediately reflects on Conflict section
                        this._calculateValidationAndConflicts();
                        MessageToast.show("Item removed.");
                    }
                }
            });
        },

        onGoBackToConflictSlide: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                this._calculateValidationAndConflicts();
                oModel.setProperty("/addAccessStep", 4);
                oModel.setProperty("/addAccessStep4SubStep", 2);
            }
        },

        onGoBackToDurationSlide: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                this._calculateValidationAndConflicts();
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 2);
            }
        },

        onCloseAddAccessSector: function () {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/addAccessStep", 1);
                oModel.setProperty("/addAccessStep4SubStep", 1);
                oModel.setProperty("/addAccessConfigSubStep", 1);
                this._resetRegionSelection();
            }
        },

        onFinalSubmitInPageAddAccess: async function () {
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
                MessageBox.error("No configured entitlements found to submit.");
                return;
            }

            if (aValidItems.length === 0 && aSkippedItems.length > 0) {
                MessageBox.warning("All selected roles are already active in your account or already in Pending Approval. No new requests were submitted.", {
                    title: "No New Access Needed"
                });
                return;
            }

            // DB Integration: Post requests to backend CAP service
            if (aValidItems.length > 0) {
                sap.ui.core.BusyIndicator.show(0);
                const sSector = oModel.getProperty("/selectedSector");
                const sFunction = oModel.getProperty("/selectedFunction");
                const sRegion = oModel.getProperty("/addAccessRegion");
                const sDuration = oModel.getProperty("/addAccessDuration");
                const sJustification = oModel.getProperty("/addAccessJustification");
                const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";

                const aPayload = aValidItems.map((item) => ({
                    requestNumber: item.requestId || ("REQ-2026-" + Math.floor(100000 + Math.random() * 900000)),
                    requesterUsername: sActiveUser,
                    requesterPersona: sActiveRole,
                    targetSystem: item.system,
                    roleName: item.roleTitle || item.roleName,
                    businessSector: sSector || "Information Technology & Security",
                    businessFunction: sFunction || "Identity & Access Governance",
                    serviceTopic: item.topic || sFunction || "System Administrator",
                    selectedPersona: item.persona || "Engineering & Developer Persona",
                    accessType: "DEFAULT",
                    operatingRegion: sRegion || "Global Enterprise (ALL)",
                    accessDuration: item.duration || sDuration || "Permanent (Default)",
                    justification: sJustification || "Access Request"
                }));

                try {
                    const response = await fetch("/odata/v4/auth/submitAccessRequest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ requests: aPayload })
                    });

                    const data = await response.json();

                    sap.ui.core.BusyIndicator.hide();

                    if (!response.ok || (data.error && data.error.message)) {
                        const sErrMsg = (data.error && data.error.message) ? data.error.message : "Failed to persist request into database.";
                        MessageBox.error("Database Error:\n\n" + sErrMsg);
                        return;
                    }

                    console.log("Successfully persisted request into PostgreSQL database:", data);

                    // Sync database states and broadcast channel
                    if (typeof BroadcastChannel !== "undefined") {
                        try {
                            const syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                            syncChannel.postMessage({ type: "NEW_REQUEST_SUBMITTED", timestamp: Date.now() });
                            syncChannel.close();
                        } catch(e) {}
                    }
                    try {
                        localStorage.setItem("kyra_last_db_mutation", String(Date.now()));
                    } catch(e) {}

                } catch (err) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error("Database connection failure:", err);
                    MessageBox.error("Failed to connect to the backend database server.");
                    return;
                }
            }

            let sPopupHtml = `<div style="font-family: inherit;">
                <p style="margin: 0 0 14px 0; color: #475569; font-size: 13.5px;">
                    Your access request review is complete. Only new, non-duplicate requests have been submitted to the database.
                </p>`;

            if (aValidItems.length > 0) {
                sPopupHtml += `
                <div class="kyra-dialog-section-header" style="color: #15803D; font-weight: 700; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span>✔ Successfully Submitted (${aValidItems.length})</span>
                    <span class="kyra-dialog-badge kyra-dialog-badge-success" style="background: #DCFCE7; color: #15803D; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Persisted to Database</span>
                </div>
                <div class="kyra-dialog-list" style="margin-bottom: 14px;">
                    ${aValidItems.map(i => `
                        <div class="kyra-dialog-item-row kyra-dialog-item-card" style="border: 1px solid #BBF7D0; background: #F0FDF4; border-radius: 8px; padding: 10px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div class="kyra-dialog-card-left">
                                <div class="kyra-dialog-card-top-row">
                                    <span class="kyra-dialog-req-id" style="font-weight: 700; color: #166534; font-size: 12px;">${i.requestId}</span>
                                    <span class="kyra-dialog-sys-tag" style="background: #E0F2FE; color: #0369A1; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 6px;">${i.system}</span>
                                </div>
                                <div class="kyra-dialog-card-role-row" style="margin-top: 4px;">
                                    <span class="kyra-dialog-role-title" style="font-size: 13px; color: #0F172A;"><strong>${i.roleTitle || i.roleName}</strong></span>
                                </div>
                                ${i.persona ? `
                                <div class="kyra-dialog-card-persona-row" style="font-size: 11.5px; color: #475569; margin-top: 2px;">
                                    <span>👤 ${i.persona}</span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="kyra-dialog-card-right">
                                <span class="kyra-dialog-item-status-pill kyra-status-submitted" style="background: #16A34A; color: #FFFFFF; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 12px;">✔ Submitted</span>
                            </div>
                        </div>
                    `).join("")}
                </div>`;
            }

            if (aSkippedItems.length > 0) {
                sPopupHtml += `
                <div class="kyra-dialog-section-header" style="color: #B45309; font-weight: 700; display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 8px;">
                    <span>⚠️ Excluded / Skipped (${aSkippedItems.length})</span>
                    <span class="kyra-dialog-badge kyra-dialog-badge-warning" style="background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Already Active / Pending</span>
                </div>
                <div class="kyra-dialog-list">
                    ${aSkippedItems.map(i => `
                        <div class="kyra-dialog-item-row kyra-dialog-item-card kyra-dialog-card-warning" style="border: 1px solid #FED7AA; background: #FFF7ED; border-radius: 8px; padding: 10px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div class="kyra-dialog-card-left">
                                <div class="kyra-dialog-card-top-row">
                                    <span class="kyra-dialog-req-id" style="color: #92400E; font-weight: 700; font-size: 12px;">${i.requestId}</span>
                                    <span class="kyra-dialog-sys-tag kyra-sys-tag-warning" style="background: #FFEDD5; color: #C2410C; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 6px;">${i.system}</span>
                                </div>
                                <div class="kyra-dialog-card-role-row" style="margin-top: 4px;">
                                    <span class="kyra-dialog-role-title" style="color: #78350F; font-size: 13px;"><strong>${i.roleTitle || i.roleName}</strong></span>
                                </div>
                                ${i.persona ? `
                                <div class="kyra-dialog-card-persona-row" style="font-size: 11.5px; color: #9A3412; margin-top: 2px;">
                                    <span>👤 ${i.persona}</span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="kyra-dialog-card-right">
                                <span class="kyra-dialog-item-status-pill kyra-status-skipped" style="background: #F59E0B; color: #FFFFFF; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 12px;">ℹ ${i.existingStatus}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>`;
            }

            sPopupHtml += `</div>`;

            // Reset all wizard inputs and state properties
            oModel.setProperty("/addAccessStep", 1);
            oModel.setProperty("/addAccessStep4SubStep", 1);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            oModel.setProperty("/showAddAccessSector", false);
            oModel.setProperty("/addAccessSelectedSystems", []);
            oModel.setProperty("/addAccessSelectedServices", []);
            oModel.setProperty("/addAccessSelectedRoles", []);
            oModel.setProperty("/addAccessSelectedPersonas", []);
            oModel.setProperty("/addAccessSystemSlideConfigs", {});
            oModel.setProperty("/addAccessRegion", "");
            oModel.setProperty("/addAccessDuration", "Permanent (Default)");
            oModel.setProperty("/addAccessJustification", "");
            oModel.setProperty("/mapSelectedRegions", []);
            oModel.setProperty("/hasMapRegionSelection", false);
            oModel.setProperty("/addAccessSummaryTables", []);
            oModel.setProperty("/thresholdLimitsList", []);
            oModel.setProperty("/restrictedRecordsList", []);
            oModel.setProperty("/duplicateRolesList", []);

            // Cleanly reset region selection & reload map
            this._resetRegionSelection();

            // Navigate to and open Pending Requests section
            oModel.setProperty("/showPendingSection", true);
            oModel.setProperty("/showApprovedSection", false);
            oModel.setProperty("/showRemoveAccessSector", false);
            oModel.setProperty("/showMyAccessMasterSection", false);

            setTimeout(() => {
                const oPendingSection = sap.ui.getCore().byId("pendingSectionContainer") || document.getElementById("pendingSectionContainer");
                if (oPendingSection && typeof oPendingSection.scrollIntoView === "function") {
                    oPendingSection.scrollIntoView({ behavior: "smooth" });
                }
            }, 300);

            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                window.KyraDialog.show({
                    title: "Access Request Submitted",
                    messageHtml: sPopupHtml,
                    type: "success",
                    maxWidth: "640px",
                    buttonText: "View Pending Requests"
                });
            } else {
                MessageBox.success("Access Request submitted successfully! Your requests are now visible in the Pending Requests queue.", {
                    title: "Access Request Submitted"
                });
            }
        }
    });
});
