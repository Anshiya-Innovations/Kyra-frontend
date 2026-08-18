/**
 * =========================================================================
 * KYRA ENTERPRISE ADD ACCESS UNIFIED COMPONENT
 * =========================================================================
 * Comprehensive standalone single-file component for developer use.
 * Encapsulates the entire Add Access flow:
 * 
 * 1. Step 1: Enterprise Scope Selection (Business Sector & Function)
 * 2. Step 2: Interactive World Map Region Selection (Pins, Chips, Select All)
 * 3. Step 3: Target System Configuration Slides & Duration/Justification
 *    - Sub-step 3.1: Sequential Target System Slides (Service -> Team Role -> Persona)
 *    - Sub-step 3.2: Duration & Business Justification
 * 4. Step 4: Access Validation & SoD Conflict Analysis
 *    - Slide 4.1: Threshold Limits, Restricted Records & Duplicate Roles
 *    - Slide 4.2: Segregation of Duties (SoD) Conflict Review
 * 5. Step 5: Master Entitlements Summary & Review Table
 *    - Top Scope Metadata Details
 *    - Per-Target System Entitlements Tables with Delete & Edit Config Sync
 * 6. Database Synchronization & Kyra Popup Dialog with Persona Badges
 * =========================================================================
 */

sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Control, JSONModel, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";

    // Standard Enterprise Mappings for Sectors, Functions, Roles and Personas
    const KYRA_CONFIG = {
        SECTORS: [
            { key: "Finance & Enterprise Performance", text: "Finance & Enterprise Performance" },
            { key: "Global Supply Chain & Logistics", text: "Global Supply Chain & Logistics" },
            { key: "Human Capital Management (HCM)", text: "Human Capital Management (HCM)" },
            { key: "Information Technology & Security", text: "Information Technology & Security" },
            { key: "Customer Operations & Sales", text: "Customer Operations & Sales" }
        ],
        FUNCTIONS_MAP: {
            "Finance & Enterprise Performance": [
                { key: "Financial Auditing", text: "Financial Auditing" },
                { key: "Corporate Accounting", text: "Corporate Accounting" },
                { key: "FP&A Governance", text: "FP&A Governance" }
            ],
            "Global Supply Chain & Logistics": [
                { key: "Supply Operations", text: "Supply Operations" },
                { key: "Inventory Governance", text: "Inventory Governance" },
                { key: "Procurement Audit", text: "Procurement Audit" }
            ],
            "Human Capital Management (HCM)": [
                { key: "HR Operations", text: "HR Operations" },
                { key: "Payroll Governance", text: "Payroll Governance" },
                { key: "Talent Compliance", text: "Talent Compliance" }
            ],
            "Information Technology & Security": [
                { key: "Identity & Access Governance", text: "Identity & Access Governance" },
                { key: "Lead Security Engineering", text: "Lead Security Engineering" },
                { key: "Cloud Platform Admin", text: "Cloud Platform Admin" }
            ],
            "Customer Operations & Sales": [
                { key: "CRM Governance", text: "CRM Governance" },
                { key: "Sales Operations Audit", text: "Sales Operations Audit" },
                { key: "Customer Success Mgmt", text: "Customer Success Mgmt" }
            ]
        },
        TARGET_SYSTEMS: [
            { key: "SAP BTP Cloud Platform", text: "SAP BTP Cloud Platform", icon: "sap-icon://cloud" },
            { key: "SAP S/4HANA Enterprise", text: "SAP S/4HANA Enterprise", icon: "sap-icon://database" },
            { key: "KYRA Central Governance", text: "KYRA Central Governance", icon: "sap-icon://shield" },
            { key: "Active Directory / IAM", text: "Active Directory / IAM", icon: "sap-icon://user-settings" },
            { key: "SAP SuccessFactors", text: "SAP SuccessFactors", icon: "sap-icon://group" },
            { key: "SAP Ariba Supply Network", text: "SAP Ariba Supply Network", icon: "sap-icon://shipping-status" }
        ],
        SERVICES_ROLES_MAP: {
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
                { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://shield" },
                { key: "Auditor (Stakeholders)", text: "Auditor (Stakeholders)", icon: "sap-icon://inspection" }
            ]
        },
        ROLE_TO_PERSONAS_MAP: {
            "IT Developers (System Administrator)": [
                { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://database" },
                { key: "Full Stack Cloud Engineer Persona (IT Developers)", text: "Full Stack Cloud Engineer Persona (IT Developers)", icon: "sap-icon://cloud" }
            ],
            "IT Administrators (System Administrator)": [
                { key: "System Infrastructure Admin Persona (IT Administrators)", text: "System Infrastructure Admin Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                { key: "Database Administrator Persona (IT Administrators)", text: "Database Administrator Persona (IT Administrators)", icon: "sap-icon://database" }
            ],
            "Lead Engineer (System Administrator)": [
                { key: "Lead Architecture Engineer Persona (Lead Engineer)", text: "Lead Architecture Engineer Persona (Lead Engineer)", icon: "sap-icon://header" }
            ],
            "IT Security (System Administrator)": [
                { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" },
                { key: "IAM Security Officer Persona (IT Security)", text: "IAM Security Officer Persona (IT Security)", icon: "sap-icon://user-settings" }
            ],
            "Technical Product Owner (System Owner)": [
                { key: "Technical Product Leader Persona (Technical Product Owner)", text: "Technical Product Leader Persona (Technical Product Owner)", icon: "sap-icon://manager" }
            ],
            "Product Group Engineer (System Owner)": [
                { key: "Platform Engineering Lead Persona (Product Group Engineer)", text: "Platform Engineering Lead Persona (Product Group Engineer)", icon: "sap-icon://header" }
            ],
            "Business Product Owner (Stakeholders)": [
                { key: "Enterprise Product Manager Persona (Business Product Owner)", text: "Enterprise Product Manager Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" }
            ],
            "Line Manager (Stakeholders)": [
                { key: "Operational People Manager Persona (Line Manager)", text: "Operational People Manager Persona (Line Manager)", icon: "sap-icon://group" }
            ],
            "ISRM (Stakeholders)": [
                { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://shield" }
            ],
            "Auditor (Stakeholders)": [
                { key: "Compliance & Regulatory Auditor Persona (Auditor)", text: "Compliance & Regulatory Auditor Persona (Auditor)", icon: "sap-icon://inspection" }
            ]
        },
        MAP_REGIONS: [
            { id: "north-america", name: "North America", top: "35%", left: "20%" },
            { id: "south-america", name: "South America", top: "70%", left: "32%" },
            { id: "europe", name: "Europe", top: "30%", left: "50%" },
            { id: "africa", name: "Africa", top: "58%", left: "52%" },
            { id: "asia", name: "Asia", top: "35%", left: "72%" },
            { id: "australia", name: "Australia", top: "75%", left: "84%" }
        ]
    };

    /**
     * KyraAddAccessComponent
     * Self-contained reusable component
     */
    const KyraAddAccessComponent = Control.extend("kyra001.components.KyraAddAccess", {
        metadata: {
            properties: {
                activeUser: { type: "string", defaultValue: "Dev001" },
                activeRole: { type: "string", defaultValue: "Requester" },
                visible: { type: "boolean", defaultValue: true }
            },
            events: {
                submitted: { parameters: { requests: { type: "object" } } },
                cancelled: {},
                stepChanged: { parameters: { step: { type: "int" } } }
            }
        },

        init: function() {
            this._aSelectedRegionIds = [];
            this._oModel = new JSONModel({
                showAddAccessSector: true,
                addAccessStep: 1,
                addAccessConfigSubStep: 1,
                addAccessStep4SubStep: 1,
                selectedSector: "",
                selectedFunction: "",
                availableFunctions: [],
                addAccessRegion: "",
                mapRegionList: KYRA_CONFIG.MAP_REGIONS,
                mapSelectedRegions: [],
                hasMapRegionSelection: false,
                addAccessSelectedSystems: [],
                addAccessCurrentSystemIndex: 0,
                currentSystemSlideName: "",
                addAccessSelectedServices: [],
                addAccessSelectedRoles: [],
                addAccessSelectedPersonas: [],
                addAccessSubRolesList: [],
                addAccessPersonasList: [],
                addAccessDuration: "",
                addAccessJustification: "",
                addAccessSystemSlideConfigs: {},
                addAccessSummaryItems: [],
                addAccessSummaryTables: [],
                sodConflictToggle: "existing",
                isEditingFromSummary: false,
                activeUser: "Dev001",
                activeRole: "Requester"
            });
            this.setModel(this._oModel, "accessModel");
        },

        onAfterRendering: function() {
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();
        },

        // =========================================================================
        // STEP NAVIGATION METHODS
        // =========================================================================
        goToStep1: function() {
            this._oModel.setProperty("/addAccessStep", 1);
            this.fireStepChanged({ step: 1 });
        },

        goToStep2: function() {
            const sSector = this._oModel.getProperty("/selectedSector");
            const sFunction = this._oModel.getProperty("/selectedFunction");

            if (!sSector || sSector.trim() === "") {
                MessageBox.error("Please select a Business Sector before proceeding.");
                return;
            }
            if (!sFunction || sFunction.trim() === "") {
                MessageBox.error("Please select a Business Function before proceeding.");
                return;
            }

            this._oModel.setProperty("/addAccessStep", 2);
            this.fireStepChanged({ step: 2 });

            setTimeout(() => {
                this._renderPins();
                this._attachSelectAllListener();
                this._updateSelectedChips();
            }, 100);
        },

        goToStep3: function() {
            const aMapSelected = this._oModel.getProperty("/mapSelectedRegions") || [];
            const sRegion = this._oModel.getProperty("/addAccessRegion");

            if (aMapSelected.length === 0 && (!sRegion || sRegion.trim() === "")) {
                MessageBox.error("Please select at least one Operating Region on the map before proceeding.");
                return;
            }

            this._oModel.setProperty("/isEditingFromSummary", false);
            this._oModel.setProperty("/addAccessStep", 3);
            this._oModel.setProperty("/addAccessConfigSubStep", 1);
            this._oModel.setProperty("/addAccessCurrentSystemIndex", 0);
            
            this._loadCurrentSystemSlideConfig();
            this.fireStepChanged({ step: 3 });
        },

        goToStep4: function() {
            this._saveCurrentSystemSlideConfig();

            const sRegion = this._oModel.getProperty("/addAccessRegion");
            const aSystems = this._oModel.getProperty("/addAccessSelectedSystems") || [];
            const sDuration = this._oModel.getProperty("/addAccessDuration");
            const sJustification = (this._oModel.getProperty("/addAccessJustification") || "").trim();

            if (!sRegion) {
                MessageBox.error("Please select an Operating Region.");
                this._oModel.setProperty("/addAccessStep", 2);
                return;
            }
            if (aSystems.length === 0) {
                MessageBox.error("Please select at least one Target System.");
                return;
            }
            if (!sDuration) {
                MessageBox.error("Please select Access Duration before proceeding.");
                return;
            }
            if (!sJustification) {
                MessageBox.error("Please enter Business Justification before proceeding.");
                return;
            }

            // Build Summary Tables & Items
            this._buildSummaryEntitlements();

            const aItems = this._oModel.getProperty("/addAccessSummaryItems") || [];
            if (aItems.length === 0) {
                MessageBox.error("Please configure at least one Role and Persona for your selected systems.");
                return;
            }

            this._oModel.setProperty("/addAccessStep", 4);
            this._oModel.setProperty("/addAccessStep4SubStep", 1);
            this.fireStepChanged({ step: 4 });
        },

        goToStep5: function() {
            this._oModel.setProperty("/addAccessStep", 5);
            this.fireStepChanged({ step: 5 });
        },

        // =========================================================================
        // REGION MAP LOGIC
        // =========================================================================
        _renderPins: function() {
            const oPinsLayer = document.getElementById("mapPinsLayer");
            if (!oPinsLayer) return;

            oPinsLayer.innerHTML = "";
            const self = this;
            KYRA_CONFIG.MAP_REGIONS.forEach((region) => {
                const oPin = document.createElement("div");
                oPin.className = "map-pin-container";
                oPin.setAttribute("data-id", region.id);
                oPin.style.top = region.top;
                oPin.style.left = region.left;

                if ((self._aSelectedRegionIds || []).includes(region.id)) {
                    oPin.classList.add("active");
                }

                oPin.innerHTML = `
                    <div class="map-pin">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z"/>
                        </svg>
                    </div>
                    <div class="pin-label">${region.name}</div>
                `;

                oPin.addEventListener("click", () => {
                    self.toggleRegionSelection(region.id);
                });

                oPinsLayer.appendChild(oPin);
            });
        },

        toggleRegionSelection: function(sId) {
            if (!this._aSelectedRegionIds) this._aSelectedRegionIds = [];
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

        _attachSelectAllListener: function() {
            const oBtn = document.getElementById("mapSelectAllBtn");
            if (!oBtn || oBtn._listenerAttached) return;
            oBtn._listenerAttached = true;

            oBtn.addEventListener("click", () => {
                if (this._aSelectedRegionIds.length === KYRA_CONFIG.MAP_REGIONS.length) {
                    this._aSelectedRegionIds = [];
                    oBtn.classList.remove("active");
                } else {
                    this._aSelectedRegionIds = KYRA_CONFIG.MAP_REGIONS.map(r => r.id);
                    oBtn.classList.add("active");
                }
                this._updatePinSelectionStates();
                this._updateSelectedChips();
            });
        },

        _updatePinSelectionStates: function() {
            document.querySelectorAll(".map-pin-container").forEach((el) => {
                const sId = el.getAttribute("data-id");
                const bSelected = (this._aSelectedRegionIds || []).includes(sId);
                el.classList.toggle("active", bSelected);
            });
        },

        _updateSelectedChips: function() {
            const aSelected = KYRA_CONFIG.MAP_REGIONS.filter(r => (this._aSelectedRegionIds || []).includes(r.id));
            this._oModel.setProperty("/mapSelectedRegions", aSelected);
            this._oModel.setProperty("/hasMapRegionSelection", aSelected.length > 0);
            this._oModel.setProperty("/addAccessRegion", aSelected.map(r => r.name).join(", "));
        },

        _updateSelectAllButtonState: function() {
            const oBtn = document.getElementById("mapSelectAllBtn");
            if (oBtn) {
                const bAll = this._aSelectedRegionIds && this._aSelectedRegionIds.length === KYRA_CONFIG.MAP_REGIONS.length;
                oBtn.classList.toggle("active", bAll);
            }
        },

        // =========================================================================
        // SLIDE CONFIGURATION & SUMMARY BUILDING
        // =========================================================================
        _loadCurrentSystemSlideConfig: function() {
            const aSystems = this._oModel.getProperty("/addAccessSelectedSystems") || [];
            let iIndex = this._oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex >= aSystems.length) iIndex = 0;
            
            const sCurrentSys = aSystems[iIndex] || "";
            this._oModel.setProperty("/currentSystemSlideName", sCurrentSys);

            const oConfigs = this._oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const oSlideConfig = oConfigs[sCurrentSys] || { services: [], roles: [], personas: [] };

            this._oModel.setProperty("/addAccessSelectedServices", oSlideConfig.services || []);
            this._oModel.setProperty("/addAccessSelectedRoles", oSlideConfig.roles || []);
            this._oModel.setProperty("/addAccessSelectedPersonas", oSlideConfig.personas || []);

            this._updateSubRolesList(true);
            this._updatePersonasList(true);
        },

        _saveCurrentSystemSlideConfig: function() {
            const sCurrentSys = this._oModel.getProperty("/currentSystemSlideName");
            if (!sCurrentSys) return;

            const oConfigs = this._oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            oConfigs[sCurrentSys] = {
                services: this._oModel.getProperty("/addAccessSelectedServices") || [],
                roles: this._oModel.getProperty("/addAccessSelectedRoles") || [],
                personas: this._oModel.getProperty("/addAccessSelectedPersonas") || []
            };
            this._oModel.setProperty("/addAccessSystemSlideConfigs", oConfigs);
        },

        _updateSubRolesList: function(bPreserve) {
            const aServices = this._oModel.getProperty("/addAccessSelectedServices") || [];
            let aRoles = [];
            aServices.forEach(s => {
                if (KYRA_CONFIG.SERVICES_ROLES_MAP[s]) {
                    aRoles = aRoles.concat(KYRA_CONFIG.SERVICES_ROLES_MAP[s]);
                }
            });
            this._oModel.setProperty("/addAccessSubRolesList", aRoles);
            if (!bPreserve) {
                const aValidKeys = aRoles.map(r => r.key);
                const aCurrRoles = this._oModel.getProperty("/addAccessSelectedRoles") || [];
                this._oModel.setProperty("/addAccessSelectedRoles", aCurrRoles.filter(k => aValidKeys.includes(k)));
            }
        },

        _updatePersonasList: function(bPreserve) {
            const aRoles = this._oModel.getProperty("/addAccessSelectedRoles") || [];
            let aPersonas = [];
            aRoles.forEach(r => {
                if (KYRA_CONFIG.ROLE_TO_PERSONAS_MAP[r]) {
                    aPersonas = aPersonas.concat(KYRA_CONFIG.ROLE_TO_PERSONAS_MAP[r]);
                }
            });
            this._oModel.setProperty("/addAccessPersonasList", aPersonas);
            if (!bPreserve) {
                const aValidKeys = aPersonas.map(p => p.key);
                const aCurrPersonas = this._oModel.getProperty("/addAccessSelectedPersonas") || [];
                this._oModel.setProperty("/addAccessSelectedPersonas", aCurrPersonas.filter(k => aValidKeys.includes(k)));
            }
        },

        _buildSummaryEntitlements: function() {
            const aSystems = this._oModel.getProperty("/addAccessSelectedSystems") || [];
            const oConfigs = this._oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const sDuration = this._oModel.getProperty("/addAccessDuration") || "Permanent (Default)";
            
            const aAllSummaryItems = [];
            const aSummaryTables = [];

            aSystems.forEach((sSys, idx) => {
                const oCfg = oConfigs[sSys] || {};
                const aPersonas = oCfg.personas || [];
                if (aPersonas.length === 0) return; // Skip systems with 0 personas

                const aSysItems = [];
                aPersonas.forEach(sPersona => {
                    const sReqId = "REQ-2026-" + Math.floor(100000 + Math.random() * 900000);
                    const sRoleTitle = (oCfg.roles && oCfg.roles[0]) ? oCfg.roles[0].split(" (")[0] : "Enterprise Role";
                    const sTopic = (oCfg.services && oCfg.services[0]) ? oCfg.services[0] : "System Administrator";

                    const oItem = {
                        requestId: sReqId,
                        system: sSys,
                        topic: sTopic,
                        roleTitle: sRoleTitle,
                        roleName: (oCfg.roles && oCfg.roles[0]) ? oCfg.roles[0] : sRoleTitle,
                        persona: sPersona,
                        duration: sDuration,
                        existingStatus: "New Request",
                        existingState: "Success",
                        existingIcon: "sap-icon://add",
                        statusType: "new"
                    };
                    aSysItems.push(oItem);
                    aAllSummaryItems.push(oItem);
                });

                if (aSysItems.length > 0) {
                    aSummaryTables.push({
                        systemName: sSys,
                        systemIndex: idx + 1,
                        systemIcon: "sap-icon://database",
                        items: aSysItems
                    });
                }
            });

            this._oModel.setProperty("/addAccessSummaryItems", aAllSummaryItems);
            this._oModel.setProperty("/addAccessSummaryTables", aSummaryTables);
        },

        // =========================================================================
        // FINAL SUBMISSION FLOW & DATABASE SYNC
        // =========================================================================
        submitRequest: async function() {
            const aItems = this._oModel.getProperty("/addAccessSummaryItems") || [];
            if (aItems.length === 0) {
                MessageBox.error("No valid entitlements configured for submission.");
                return;
            }

            const sUser = this._oModel.getProperty("/activeUser") || "Dev001";
            const sRole = this._oModel.getProperty("/activeRole") || "Requester";
            const sSector = this._oModel.getProperty("/selectedSector") || "Information Technology & Security";
            const sFunction = this._oModel.getProperty("/selectedFunction") || "Identity & Access Governance";
            const sRegion = this._oModel.getProperty("/addAccessRegion") || "Global Enterprise (ALL)";
            const sDuration = this._oModel.getProperty("/addAccessDuration") || "Permanent (Default)";
            const sJustification = this._oModel.getProperty("/addAccessJustification") || "Direct Business Justification";

            const aPayload = aItems.map(i => ({
                requestNumber: i.requestId,
                requesterUsername: sUser,
                requesterPersona: sRole,
                businessSector: sSector,
                businessFunction: sFunction,
                operatingRegion: sRegion,
                targetSystem: i.system,
                serviceTopic: i.topic,
                roleName: i.roleName,
                selectedPersona: i.persona,
                accessType: "ADDITION",
                accessDuration: sDuration,
                justification: sJustification
            }));

            try {
                sap.ui.core.BusyIndicator.show(0);
                const res = await fetch("/odata/v4/auth/submitAccessRequest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requests: aPayload })
                });

                sap.ui.core.BusyIndicator.hide();
                this._showSubmissionPopup(aItems);
                this.fireSubmitted({ requests: aPayload });
            } catch (err) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Database synchronization failed: " + err.message);
            }
        },

        _showSubmissionPopup: function(aItems) {
            let sPopupHtml = `<div style="font-family: inherit;">
                <p style="margin: 0 0 14px 0; color: #475569; font-size: 13.5px;">
                    Your access requests have been successfully submitted and synchronized with the database.
                </p>
                <div class="kyra-dialog-section-header" style="color: #15803D;">
                    <span>Submitted to Database</span>
                    <span class="kyra-dialog-badge kyra-dialog-badge-success">${aItems.length} Item(s)</span>
                </div>
                <div class="kyra-dialog-list">
                    ${aItems.map(i => `
                        <div class="kyra-dialog-item-row kyra-dialog-item-card">
                            <div class="kyra-dialog-card-left">
                                <div class="kyra-dialog-card-top-row">
                                    <span class="kyra-dialog-req-id">${i.requestId}</span>
                                    <span class="kyra-dialog-sys-tag">${i.system}</span>
                                </div>
                                <div class="kyra-dialog-card-role-row">
                                    <span class="kyra-dialog-role-title"><strong>${i.roleTitle}</strong></span>
                                    <span class="kyra-dialog-topic-label">(${i.topic})</span>
                                </div>
                                <div class="kyra-dialog-card-persona-row">
                                    <span class="kyra-dialog-persona-badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span>${i.persona}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="kyra-dialog-card-right">
                                <span class="kyra-dialog-item-status-pill kyra-status-submitted">✔ Submitted</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>`;

            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                window.KyraDialog.show({
                    title: "Access Request Submitted",
                    messageHtml: sPopupHtml,
                    type: "success",
                    maxWidth: "640px",
                    buttonText: "Done"
                });
            } else {
                MessageBox.information("Access request submitted successfully!");
            }
        },

        reset: function() {
            this._aSelectedRegionIds = [];
            this._oModel.setProperty("/addAccessStep", 1);
            this._oModel.setProperty("/selectedSector", "");
            this._oModel.setProperty("/selectedFunction", "");
            this._oModel.setProperty("/availableFunctions", []);
            this._oModel.setProperty("/addAccessSelectedSystems", []);
            this._oModel.setProperty("/addAccessDuration", "");
            this._oModel.setProperty("/addAccessJustification", "");
            this._oModel.setProperty("/addAccessSystemSlideConfigs", {});
            this._oModel.setProperty("/addAccessSummaryItems", []);
            this._oModel.setProperty("/addAccessSummaryTables", []);
            this._updatePinSelectionStates();
            this._updateSelectedChips();
        }
    });

    return KyraAddAccessComponent;
});
