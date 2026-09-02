sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    const aInitialSubRoles = [
        { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)" },
        { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)" },
        { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)" },
        { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)" }
    ];

    const oSubRolesMap = {
        "System Administrator": aInitialSubRoles,
        "System Owners": [
            { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)" },
            { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)" }
        ],
        "Stakeholders": [
            { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)" },
            { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)" },
            { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)" },
            { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)" },
            { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)" },
            { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)" }
        ]
    };

    return Controller.extend("kyra001.pages.access.AccessPage", {
        onInit() {
            this._localInFlightRevocations = {};
            this._aSelectedRegionIds = [];
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || sessionStorage.getItem("kyra_remember_id") || "";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Approver 1" || sActiveRole === "Approver 2" || sActiveRole === "Compliance Approver" || sActiveRole === "Compliance Reviewer" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("compliance"))));
            const oModel = new JSONModel({
                activeUser: sActiveUser,
                activeRole: sActiveRole,
                isApproverPersona: bIsApprover,
                showAddAccessSector: false,
                showRemoveAccessSector: false,
                showRequestDetailsPage: false,
                selectedRequestDetail: {},
                selectedTabKey: "myAccess",
                showApprovalHistory: false,
                showPendingSection: false,
                showApprovedSection: false,
                showMyAccessMasterSection: false,
                sodConflictToggle: "existing",

                // Region Map Component State (from region folder)
                mapRegionList: [
                    { id: "na", name: "North America", left: "21.5%", top: "32%" },
                    { id: "latam", name: "Latin America", left: "33%", top: "60%" },
                    { id: "eu", name: "Europe", left: "51.5%", top: "29%" },
                    { id: "me", name: "Middle East", left: "59.5%", top: "41%" },
                    { id: "af", name: "Africa", left: "53.5%", top: "52%" },
                    { id: "as", name: "Asia", left: "71.5%", top: "35%" },
                    { id: "apac", name: "Oceania / Australia", left: "82%", top: "64%" }
                ],
                mapSelectedRegions: [],
                hasMapRegionSelection: false,

                // Pre-populated default Team Roles and Personas (Always available in Add Access Step 3)
                addAccessSubRolesList: [
                    { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)", icon: "sap-icon://developer-settings" },
                    { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)", icon: "sap-icon://user-settings" },
                    { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)", icon: "sap-icon://header" },
                    { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)", icon: "sap-icon://shield-check" },
                    { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)", icon: "sap-icon://manager" },
                    { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)", icon: "sap-icon://header" },
                    { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)", icon: "sap-icon://customer-briefing" },
                    { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)", icon: "sap-icon://group" },
                    { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)", icon: "sap-icon://user-settings" },
                    { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://shield-check" },
                    { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)", icon: "sap-icon://shield" }
                ],
                addAccessPersonasList: [
                    { key: "Frontend & UI Developer Persona (IT Developers)", text: "Frontend & UI Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                    { key: "Backend & Systems Developer Persona (IT Developers)", text: "Backend & Systems Developer Persona (IT Developers)", icon: "sap-icon://developer-settings" },
                    { key: "Cloud Infrastructure Administrator Persona (IT Administrators)", text: "Cloud Infrastructure Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                    { key: "Database & IAM Administrator Persona (IT Administrators)", text: "Database & IAM Administrator Persona (IT Administrators)", icon: "sap-icon://user-settings" },
                    { key: "Principal Systems Engineer Persona (Lead Engineer)", text: "Principal Systems Engineer Persona (Lead Engineer)", icon: "sap-icon://header" },
                    { key: "DevOps & Platform Lead Persona (Lead Engineer)", text: "DevOps & Platform Lead Persona (Lead Engineer)", icon: "sap-icon://header" },
                    { key: "Security Audit & GRC Persona (IT Security)", text: "Security Audit & GRC Persona (IT Security)", icon: "sap-icon://shield-check" },
                    { key: "Cybersecurity Operations Persona (IT Security)", text: "Cybersecurity Operations Persona (IT Security)", icon: "sap-icon://shield-check" },
                    { key: "Technical Product Manager Persona (Technical Product Owner)", text: "Technical Product Manager Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                    { key: "Solution Architecture Owner Persona (Technical Product Owner)", text: "Solution Architecture Owner Persona (Technical Product Owner)", icon: "sap-icon://manager" },
                    { key: "Product Suite Engineer Persona (Product Group Engineer)", text: "Product Suite Engineer Persona (Product Group Engineer)", icon: "sap-icon://header" },
                    { key: "Integration Engineering Lead Persona (Product Group Engineer)", text: "Integration Engineering Lead Persona (Product Group Engineer)", icon: "sap-icon://header" },
                    { key: "Business Strategy Lead Persona (Business Product Owner)", text: "Business Strategy Lead Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                    { key: "Enterprise Process Owner Persona (Business Product Owner)", text: "Enterprise Process Owner Persona (Business Product Owner)", icon: "sap-icon://customer-briefing" },
                    { key: "Department Resource Manager Persona (Line Manager)", text: "Department Resource Manager Persona (Line Manager)", icon: "sap-icon://group" },
                    { key: "People Operations Lead Persona (Line Manager)", text: "People Operations Lead Persona (Line Manager)", icon: "sap-icon://group" },
                    { key: "Regulatory Compliance Officer Persona (Compliance Manager)", text: "Regulatory Compliance Officer Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Data Privacy Auditor Persona (Compliance Manager)", text: "Data Privacy Auditor Persona (Compliance Manager)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Entitlement & Role Custodian Persona (Role Owner)", text: "Entitlement & Role Custodian Persona (Role Owner)", icon: "sap-icon://user-settings" },
                    { key: "Access Governance Approver Persona (Role Owner)", text: "Access Governance Approver Persona (Role Owner)", icon: "sap-icon://user-settings" },
                    { key: "Information Security Risk Manager Persona (ISRM)", text: "Information Security Risk Manager Persona (ISRM)", icon: "sap-icon://shield-check" },
                    { key: "Risk & Assessment Analyst Persona (ISRM)", text: "Risk & Assessment Analyst Persona (ISRM)", icon: "sap-icon://shield-check" },
                    { key: "Identity Management Specialist Persona (IAM / GRC Team)", text: "Identity Management Specialist Persona (IAM / GRC Team)", icon: "sap-icon://shield" },
                    { key: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", text: "Governance Risk Compliance Lead Persona (IAM / GRC Team)", icon: "sap-icon://shield" }
                ],

                // 1. My Access Table Data (Assigned Entitlements) - Empty for fresh state
                activeRoles: [],
                userAccessList: [],

                // 2. Add Access Form State
                newRequest: {
                    system: "SAP BTP Cloud Platform",
                    category: "System Administrator",
                    roleName: aInitialSubRoles[0].key,
                    duration: "Permanent (Default)",
                    justification: ""
                },
                requestSubRoles: aInitialSubRoles,

                // 3. My Requests Tracking & Audit Log - Empty for fresh state
                requestHistory: []
            });

            this.getOwnerComponent().setModel(oModel, "accessModel");
            this._loadSubmittedRequests(oModel);

            // Setup Real-Time BroadcastChannel Event Bus & Storage Sync (Zero-Server-Overload Live Update)
            this._setupRealtimeSync(oModel);

            // Enable entire-row clickability to select/deselect items in MultiComboBox dropdowns
            this._setupMultiComboBoxRowClickSelection();

            const oRouter = this.getOwnerComponent().getRouter();
            if (oRouter && oRouter.getRoute("AccessPage")) {
                oRouter.getRoute("AccessPage").attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _notifyDatabaseMutation() {
            if (typeof BroadcastChannel !== "undefined") {
                try {
                    const syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    syncChannel.postMessage({ type: "NEW_REQUEST_SUBMITTED", timestamp: Date.now() });
                    syncChannel.close();
                } catch(e) { console.warn("BroadcastChannel post error:", e); }
            }
            try {
                localStorage.setItem("kyra_last_db_mutation", String(Date.now()));
            } catch(e) {}
        },

        _setupRealtimeSync(oModel) {
            // 1. Cross-Device / Cross-Network Real-Time SSE (Server-Sent Events) Stream
            if (typeof EventSource !== "undefined" && !this._eventSource) {
                try {
                    this._eventSource = new EventSource("/api/sync/stream");
                    this._eventSource.onmessage = (evt) => {
                        try {
                            const data = JSON.parse(evt.data);
                            if (data.type === "NEW_REQUEST" || data.type === "DECISION_SUBMITTED" || data.type === "MUTATION") {
                                console.log("Cross-network SSE real-time sync event:", data);
                                this._loadSubmittedRequests(oModel);
                            }
                        } catch(e) {}
                    };
                } catch(e) { console.warn("SSE init warning:", e); }
            }

            // 2. Multi-Tab BroadcastChannel event bus
            if (typeof BroadcastChannel !== "undefined" && !this._syncChannel) {
                try {
                    this._syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    this._syncChannel.onmessage = (evt) => {
                        if (evt && evt.data && (evt.data.type === "NEW_REQUEST_SUBMITTED" || evt.data.type === "DECISION_SUBMITTED")) {
                            console.log("Real-time DB sync event received:", evt.data);
                            this._loadSubmittedRequests(oModel);
                        }
                    };
                } catch(e) { console.warn("BroadcastChannel init error:", e); }
            }

            // 3. Local Storage Sync
            if (!this._fnStorageHandler) {
                this._fnStorageHandler = (e) => {
                    if (e.key === "kyra_last_db_mutation") {
                        this._loadSubmittedRequests(oModel);
                    }
                };
                window.addEventListener("storage", this._fnStorageHandler);
            }

            // 4. Tab Focus Visibility Change Sync
            if (!this._fnVisibilityHandler) {
                this._fnVisibilityHandler = () => {
                    if (!document.hidden) {
                        this._loadSubmittedRequests(oModel);
                    }
                };
                document.addEventListener("visibilitychange", this._fnVisibilityHandler);
            }

            // 5. Load backend SoD Matrix rules
            this._loadBackendSoDMatrix();

            // 6. Adaptive Low-Frequency Backup Sync (every 10s only if tab is focused)
            if (!this._pollInterval) {
                this._pollInterval = setInterval(() => {
                    if (!document.hidden && this.getView() && this.getView().getModel("accessModel")) {
                        const oM = this.getView().getModel("accessModel");
                        if (oM && !oM.getProperty("/showRequestDetailsPage")) {
                            this._loadSubmittedRequests(oM);
                        }
                    }
                }, 10000);
            }
        },

        onExit() {
            if (this._eventSource) {
                this._eventSource.close();
                this._eventSource = null;
            }
            if (this._syncChannel) {
                this._syncChannel.close();
                this._syncChannel = null;
            }
            if (this._fnStorageHandler) {
                window.removeEventListener("storage", this._fnStorageHandler);
                this._fnStorageHandler = null;
            }
            if (this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._fnVisibilityHandler = null;
            }
            if (this._pollInterval) {
                clearInterval(this._pollInterval);
                this._pollInterval = null;
            }
        },

        _setSmartProperty(oModel, sPath, vNewVal) {
            if (!oModel) return;
            const vOldVal = oModel.getProperty(sPath);
            const sOldJson = JSON.stringify(vOldVal === undefined ? null : vOldVal);
            const sNewJson = JSON.stringify(vNewVal === undefined ? null : vNewVal);
            if (sOldJson !== sNewJson) {
                oModel.setProperty(sPath, vNewVal);
            }
        },

        _loadSubmittedRequests(oModel) {
            if (!oModel) return;
            this._loadSubmittedRequestsFromDatabase(oModel);
        },

        onAfterRendering() {
            const bindClick = (sId, fnHandler) => {
                const oCard = this.byId(sId);
                if (oCard && !oCard._bBoundClick) {
                    oCard._bBoundClick = true;
                    oCard.addEventDelegate({
                        onclick: () => fnHandler.call(this)
                    });
                }
            };

            bindClick("cardPendingRequests", this.onNavToPendingRequests);
            bindClick("cardApprovedRequests", this.onNavToApprovedRequests);
            bindClick("cardAddAccess", this.onNavToAddAccess);
            bindClick("cardRemoveAccess", this.onNavToRemoveAccess);

            // Bind click for 5 History KPI Cards
            bindClick("kpiCardAll", this.onFilterHistoryByAll);
            
            bindClick("kpiCardRemoved", this.onFilterHistoryByRemoved);
            bindClick("kpiCardApproved", this.onFilterHistoryByApproved);
            bindClick("kpiCardRejected", this.onFilterHistoryByRejected);

            // Render Region Map Component (from region folder)
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();

            // Apply full-row clickability to MultiComboBox dropdowns
            this._applyMultiComboBoxRowClickSelection();
        },

        _setupMultiComboBoxRowClickSelection() {
            try {
                if (typeof sap !== "undefined" && sap.m && sap.m.MultiComboBox && sap.m.MultiComboBox.prototype) {
                    const proto = sap.m.MultiComboBox.prototype;
                    if (!proto._bRowClickPatched) {
                        proto._bRowClickPatched = true;
                        
                        const fnOrigCreateList = proto._createList;
                        if (typeof fnOrigCreateList === "function") {
                            proto._createList = function() {
                                const oList = fnOrigCreateList.apply(this, arguments);
                                if (this._oList && typeof this._oList.setIncludeItemInSelection === "function") {
                                    this._oList.setIncludeItemInSelection(true);
                                }
                                return oList;
                            };
                        }

                        const fnOrigGetList = proto._getList;
                        if (typeof fnOrigGetList === "function") {
                            proto._getList = function() {
                                const oList = fnOrigGetList.apply(this, arguments);
                                if (oList && typeof oList.setIncludeItemInSelection === "function") {
                                    oList.setIncludeItemInSelection(true);
                                }
                                return oList;
                            };
                        }
                    }
                }

                if (typeof sap !== "undefined" && sap.m && sap.m.Tokenizer && sap.m.Tokenizer.prototype) {
                    const tokProto = sap.m.Tokenizer.prototype;
                    if (!tokProto._bMaxTokensPatched) {
                        tokProto._bMaxTokensPatched = true;
                        const fnOrigTokInit = tokProto.init;
                        tokProto.init = function() {
                            if (typeof fnOrigTokInit === "function") {
                                fnOrigTokInit.apply(this, arguments);
                            }
                            if (typeof this.setMaxTokens === "function") {
                                this.setMaxTokens(2);
                            }
                        };
                    }
                }
            } catch(e) {
                console.warn("MultiComboBox prototype setup warning:", e);
            }
        },

        _applyMultiComboBoxRowClickSelection() {
            const aControls = [
                { id: "inPageServicesMultiSelect", prereqName: null, prereqProp: null, prereqId: null },
                { id: "inPageTeamMultiSelect", prereqName: "Service / Topic", prereqProp: "/addAccessSelectedServices", prereqId: "inPageServicesMultiSelect" },
                { id: "inPagePersonaMultiSelect", prereqName: "Team Role", prereqProp: "/addAccessSelectedRoles", prereqId: "inPageTeamMultiSelect" },
                { id: "inPageSystemsMultiSelect", prereqName: null, prereqProp: null, prereqId: null }
            ];

            const oModel = this.getView().getModel("accessModel");

            aControls.forEach(item => {
                const oControl = this.byId(item.id);
                if (!oControl) return;

                const fnSetupControl = () => {
                    const oTokenizer = (typeof oControl._getTokenizer === "function" && oControl._getTokenizer()) || 
                                       oControl._oTokenizer || 
                                       (typeof oControl.getAggregation === "function" && (oControl.getAggregation("_tokenizer") || oControl.getAggregation("tokenizer")));
                    if (oTokenizer) {
                        if (typeof oTokenizer.setMaxTokens === "function") {
                            oTokenizer.setMaxTokens(2);
                        }
                        if (typeof oTokenizer.setRenderMode === "function") {
                            oTokenizer.setRenderMode("Narrow");
                        }
                    }
                    if (typeof oControl._getList === "function") {
                        const oList = oControl._getList();
                        if (oList && typeof oList.setIncludeItemInSelection === "function") {
                            oList.setIncludeItemInSelection(true);
                        }
                    }
                    const oInputDom = oControl.getDomRef("inner");
                    if (oInputDom) {
                        oInputDom.setAttribute("readonly", "readonly");
                        oInputDom.style.cursor = "pointer";
                    }
                    const oDom = oControl.getDomRef();
                    if (oDom) {
                        oDom.style.cursor = "pointer";
                        const oWrapper = oDom.querySelector(".sapMInputBaseContentWrapper");
                        if (oWrapper) oWrapper.style.cursor = "pointer";
                        const oTokDom = oDom.querySelector(".sapMTokenizer");
                        if (oTokDom) {
                            oTokDom.scrollLeft = 0;
                            oTokDom.style.cursor = "pointer";
                        }
                    }
                };

                fnSetupControl();

                if (oControl._rowClickDelegate) {
                    oControl.removeEventDelegate(oControl._rowClickDelegate);
                }

                oControl._rowClickDelegate = {
                    onAfterRendering: fnSetupControl,
                    ontap: (oEvent) => {
                        // If control is disabled, block any touch/click completely
                        if (typeof oControl.getEnabled === "function" && !oControl.getEnabled()) {
                            oEvent.preventDefault();
                            oEvent.stopPropagation();
                            return;
                        }

                        // If clicked on token delete icon (X), allow token removal
                        if (oEvent.target && oEvent.target.closest && oEvent.target.closest(".sapMTokenIcon")) {
                            return;
                        }

                        // Check sequential prerequisite
                        if (item.prereqProp && oModel) {
                            const aPrereqVal = oModel.getProperty(item.prereqProp) || [];
                            if (!Array.isArray(aPrereqVal) || aPrereqVal.length === 0) {
                                oEvent.preventDefault();
                                oEvent.stopPropagation();
                                MessageToast.show("Please select " + item.prereqName + " first.");
                                if (item.prereqId) {
                                    const oPrereqCtrl = this.byId(item.prereqId);
                                    if (oPrereqCtrl && typeof oPrereqCtrl.open === "function") {
                                        setTimeout(() => oPrereqCtrl.open(), 150);
                                    }
                                }
                                return;
                            }
                        }

                        // If clicked on dropdown arrow, UI5 handles toggling natively
                        if (oEvent.target && oEvent.target.closest && (oEvent.target.closest(".sapMComboBoxIcon") || oEvent.target.closest(".sapMInputBaseIconContainer"))) {
                            return;
                        }

                        // Touching / clicking anywhere on the box opens the dropdown
                        if (typeof oControl.open === "function" && !oControl.isOpen()) {
                            oControl.open();
                        }
                    }
                };

                oControl.addEventDelegate(oControl._rowClickDelegate);
            });
        },

        // =========================================================================
        // REGION MAP COMPONENT LOGIC (EXACT IMPLEMENTATION FROM REGION FOLDER)
        // =========================================================================
        _attachSelectAllListener() {
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

        _renderPins() {
            const oPinsLayer = document.getElementById("pinsLayer");
            if (!oPinsLayer) {
                setTimeout(this._renderPins.bind(this), 100);
                return;
            }

            // Ensure image URL resolves properly
            const oImg = document.getElementById("worldMapImgAccessPage");
            if (oImg) {
                try {
                    const sResolvedPath = sap.ui.require.toUrl("kyra001/world-map.jpg");
                    if (sResolvedPath && oImg.getAttribute("src") !== sResolvedPath) {
                        oImg.src = sResolvedPath;
                    }
                } catch(e) {}
            }

            oPinsLayer.innerHTML = "";
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aRegions = oModel.getProperty("/mapRegionList") || [];
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
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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

        toggleRegionSelection(sId) {
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

        _updatePinSelectionStates() {
            const self = this;
            document.querySelectorAll(".map-pin-container").forEach((el) => {
                const sId = el.getAttribute("data-id");
                const bSelected = (self._aSelectedRegionIds || []).indexOf(sId) !== -1;
                el.classList.toggle("active", bSelected);
            });
        },

        _updateSelectAllButtonState() {
            const oSelectAll = document.getElementById("selectAllBtn");
            if (oSelectAll) {
                const oModel = this.getView().getModel("accessModel");
                const aRegions = oModel ? oModel.getProperty("/mapRegionList") || [] : [];
                const bAllSelected = (this._aSelectedRegionIds || []).length === aRegions.length && aRegions.length > 0;
                oSelectAll.classList.toggle("active", bAllSelected);
            }
        },

        _updateSelectedChips() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const aRegions = oModel.getProperty("/mapRegionList") || [];
            const self = this;

            const aSelected = aRegions.filter((r) => {
                return (self._aSelectedRegionIds || []).indexOf(r.id) !== -1;
            });

            oModel.setProperty("/mapSelectedRegions", aSelected);
            oModel.setProperty("/hasMapRegionSelection", aSelected.length > 0);

            const sJoinedRegionNames = aSelected.map(r => r.name).join(", ");
            oModel.setProperty("/addAccessRegion", sJoinedRegionNames);
        },

        onRemoveMapRegionChip(oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("accessModel");
            if (oContext) {
                const sId = oContext.getProperty("id");
                this.toggleRegionSelection(sId);
            }
        },

                        _onRouteMatched() {
            const oModel = this.getView().getModel("accessModel");
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || "";

            

            const oView = this.getView();
            try {
                let p = oView ? oView.getParent() : null;
                while (p) {
                    if (p.isA && (p.isA("sap.m.App") || p.isA("sap.m.NavContainer"))) {
                        p.to(oView);
                        break;
                    }
                    p = p.getParent && p.getParent();
                }
            } catch(e) {}

            if (oModel) {
                const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
                const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Approver 1" || sActiveRole === "Approver 2" || sActiveRole === "Compliance Approver" || sActiveRole === "Compliance Reviewer" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("compliance"))));
                oModel.setProperty("/activeUser", sActiveUser);
                oModel.setProperty("/activeRole", sActiveRole);
                oModel.setProperty("/isApproverPersona", bIsApprover);
                
                if (sessionStorage.getItem("kyra_show_approval_history") === "true") {
                    oModel.setProperty("/showApprovalHistory", true);
                    oModel.setProperty("/selectedTabKey", "myAccess");
                    oModel.setProperty("/showRequestDetailsPage", false);
                    oModel.setProperty("/showAddAccessSector", false);
                    oModel.setProperty("/showRemoveAccessSector", false);
                    sessionStorage.removeItem("kyra_show_approval_history");
                }
                
                this._loadSubmittedRequests(oModel);
            }

            const sScrollTo = sessionStorage.getItem("kyra_scroll_to");
            if (sScrollTo) {
                sessionStorage.removeItem("kyra_scroll_to");
                setTimeout(() => {
                    const oPage = this.byId("accessPortalPage");
                    const oTarget = this.byId(sScrollTo);
                    if (oPage && oTarget) {
                        oPage.scrollToElement(oTarget, 400);
                    }
                }, 500);
            }

            const sTabToSelect = sessionStorage.getItem("kyra_select_tab");
            if (sTabToSelect) {
                sessionStorage.removeItem("kyra_select_tab");
                const oTabBar = this.byId("accessIconTabBar");
                if (oTabBar) {
                    oTabBar.setSelectedKey(sTabToSelect);
                }
            }
        },

        _deriveCleanTeamName(oItem) {
            if (!oItem) return "Enterprise Security Team";
            const sRaw = (oItem.team || oItem.business_function || oItem.businessFunction || oItem.function || oItem.service_topic || oItem.serviceTopic || oItem.category || oItem.role_name || oItem.roleName || "").toString().toLowerCase();
            
            if (sRaw.includes("procure") || sRaw.includes("purchas") || sRaw.includes("buyer") || sRaw.includes("vendor") || sRaw.includes("sourcing") || sRaw.includes("ariba")) {
                return "Procurement Team";
            }
            if (sRaw.includes("finan") || sRaw.includes("account") || sRaw.includes("treasur") || sRaw.includes("tax") || sRaw.includes("ledger") || sRaw.includes("controlling") || sRaw.includes("fico") || sRaw.includes("s/4hana")) {
                return "Finance Team";
            }
            if (sRaw.includes("audit") || sRaw.includes("complian") || sRaw.includes("risk") || sRaw.includes("governan") || sRaw.includes("isrm") || sRaw.includes("grc")) {
                return "Audit & Compliance Team";
            }
            if (sRaw.includes("secur") || sRaw.includes("iam") || sRaw.includes("identity") || sRaw.includes("cyber") || sRaw.includes("access")) {
                return "Security & IAM Team";
            }
            if (sRaw.includes("logic") || sRaw.includes("warehous") || sRaw.includes("supply") || sRaw.includes("inventor") || sRaw.includes("plant") || sRaw.includes("mfg") || sRaw.includes("manufactur") || sRaw.includes("shipping")) {
                return "Supply Chain & Logistics Team";
            }
            if (sRaw.includes("sale") || sRaw.includes("order") || sRaw.includes("distribut") || sRaw.includes("market") || sRaw.includes("customer") || sRaw.includes("crm")) {
                return "Sales & Distribution Team";
            }
            if (sRaw.includes("hr") || sRaw.includes("people") || sRaw.includes("workforce") || sRaw.includes("payroll") || sRaw.includes("talent") || sRaw.includes("successfactors")) {
                return "HR & People Operations Team";
            }
            if (sRaw.includes("develop") || sRaw.includes("engineer") || sRaw.includes("tech") || sRaw.includes("ui5") || sRaw.includes("btp") || sRaw.includes("cloud") || sRaw.includes("admin") || sRaw.includes("infra")) {
                return "Engineering & Cloud Ops Team";
            }
            if (oItem.team && !oItem.team.toLowerCase().includes("category") && !oItem.team.toLowerCase().includes("revocation")) return oItem.team;
            return "Enterprise Operations Team";
        },

        _groupRequestsByRequestId(aRequests) {
            if (!Array.isArray(aRequests) || aRequests.length === 0) return [];

            const oGroupedMap = {};
            const aGroupedOrder = [];

            aRequests.forEach(item => {
                const sReqId = item.requestId || item.requestNumber || "REQ-GENERAL";
                if (!oGroupedMap[sReqId]) {
                    oGroupedMap[sReqId] = {
                        requestId: sReqId,
                        requesterId: item.requesterId || item.requesterUsername || "Dev001",
                        requesterUsername: item.requesterUsername || item.requesterId || "Dev001",
                        type: item.type || "Addition",
                        persona: item.persona || item.selectedPersona || "Engineering & Developer Persona",
                        selectedPersona: item.selectedPersona || item.persona || "Engineering & Developer Persona",
                        accessDuration: item.accessDuration || "Permanent (Default)",
                        submissionDate: item.submissionDate || (item.createdAtRaw ? item.createdAtRaw.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: item.createdAtRaw || new Date().toISOString(),
                        approver: item.approver || "Line Manager / ISRM Team",
                        status: "Pending Approval",
                        statusState: "Warning",
                        statusIcon: "sap-icon://pending",
                        region: item.region || "",
                        justification: item.justification || "",
                        sector: item.sector || "",
                        function: item.function || "",
                        _systems: [],
                        _roles: [],
                        _serviceTopics: [],
                        _durations: [],
                        _types: [],
                        _personas: [],
                        entitlements: []
                    };
                    aGroupedOrder.push(sReqId);
                }

                const g = oGroupedMap[sReqId];
                if (item.system && !g._systems.includes(item.system)) {
                    g._systems.push(item.system);
                }
                if (item.roleName && !g._roles.includes(item.roleName)) {
                    g._roles.push(item.roleName);
                }
                const sTopic = item.serviceTopic || item.team || item.function;
                if (sTopic && !g._serviceTopics.includes(sTopic)) {
                    g._serviceTopics.push(sTopic);
                }
                if (item.accessDuration && !g._durations.includes(item.accessDuration)) {
                    g._durations.push(item.accessDuration);
                }
                if (item.type && !g._types.includes(item.type)) {
                    g._types.push(item.type);
                }
                const sPers = item.selectedPersona || item.persona;
                if (sPers && !g._personas.includes(sPers)) {
                    g._personas.push(sPers);
                }

                g.entitlements.push(item);
            });

            return aGroupedOrder.map(sReqId => {
                const g = oGroupedMap[sReqId];
                g.system = g._systems.join(", ");
                g.roleName = g._roles.join(", ");
                g.serviceTopic = g._serviceTopics.join(", ");
                g.accessDuration = g._durations.join(", ") || g.accessDuration;
                g.type = g._types.join(", ") || g.type;
                if (g._personas.length > 0) {
                    g.selectedPersona = g._personas.join(", ");
                    g.persona = g._personas[0];
                }
                delete g._systems;
                delete g._roles;
                delete g._serviceTopics;
                delete g._durations;
                delete g._types;
                delete g._personas;
                return g;
            });
        },

        async _loadSubmittedRequests(oModel) {
            if (!oModel) return;
            // Prevent list re-renders and auto-scroll reset when user is on Request Tracking page
            if (oModel.getProperty("/showRequestDetailsPage")) return;

            // Clear old local mock cache to ensure 100% fresh database state
            localStorage.removeItem("kyra_submitted_my_pending");
            localStorage.removeItem("kyra_submitted_approver_requests");
            localStorage.removeItem("kyra_processed_requests");
            localStorage.removeItem("kyra_submitted_my_history");
            sessionStorage.removeItem("kyra_submitted_requests");
            sessionStorage.removeItem("kyra_pending_requests");

            let aRawDbRequests = [];
            try {
                const response = await fetch("/odata/v4/admin-portal/GovernanceHistory");
                const data = await response.json();
                if (data && data.value) {
                    aRawDbRequests = data.value;

                    // Filter out persisted deleted requests & entitlements across page refreshes
                    const aDeletedKeys = JSON.parse(sessionStorage.getItem("kyra_deleted_entitlements") || "[]");
                    const aDeletedRequestIds = JSON.parse(sessionStorage.getItem("kyra_deleted_requests") || "[]");

                    if (aDeletedKeys.length > 0 || aDeletedRequestIds.length > 0) {
                        aRawDbRequests = aRawDbRequests.filter(r => {
                            const sId = r.request_number || ("REQ-" + r.ID);
                            const sKey = `${r.target_system}:::${r.role_name}:::${r.selected_persona || ''}`;
                            const sRoleKey = `${r.target_system}:::${r.role_name}`;
                            if (aDeletedRequestIds.includes(sId) || (r.ID && aDeletedRequestIds.includes(String(r.ID)))) return false;
                            if (aDeletedKeys.includes(sKey) || aDeletedKeys.includes(sRoleKey)) return false;
                            return true;
                        });
                    }

                    // Sort strictly in descending order for frontend list views (newest first)
                    aRawDbRequests.sort((a, b) => {
                        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
                        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
                        if (tA !== tB) return tB - tA;
                        return (b.request_number || "").localeCompare(a.request_number || "");
                    });
                }
            } catch (err) {
                console.error("Error loading requests from database:", err);
            }

            const sActiveUser = sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || sessionStorage.getItem("kyra_remember_id") || "";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Approver 1" || sActiveRole === "Approver 2" || sActiveRole === "Compliance Approver" || sActiveRole === "Compliance Reviewer" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("compliance"))));
            oModel.setProperty("/activeRole", sActiveRole);
            oModel.setProperty("/isApproverPersona", bIsApprover);

            // Scan all raw database requests to find pending revocation requests for active user
            // Also clean local in-flight cache if database now reflects it
            const pendingRevocations = new Set();
            aRawDbRequests.forEach(r => {
                const sDbStatus = (r.status || "PENDING").toUpperCase();
                const isPending = sDbStatus.includes("PENDING");
                const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");
                if (isPending && isRevocation && r.requester_username === sActiveUser) {
                    const sKey = (r.target_system || "") + "_" + (r.role_name || "");
                    pendingRevocations.add(sKey);
                    if (this._localInFlightRevocations && this._localInFlightRevocations[sKey]) {
                        delete this._localInFlightRevocations[sKey];
                    }
                }
            });

            const aMyPending = [];
            const aMyApproved = [];
            const aMyHistory = [];
            const aApproverPending = [];
            const aApproverProcessed = [];
            const aUserAccessList = [];

            // Group requests by user/sector/function for Approver grouped view
            const oGrouped = {};
            const roleStates = {};

            const sRoleLower = (sActiveRole || "").toLowerCase();
            const isCompliancePersona = sRoleLower.includes("compliance");
            const isIamApp2Persona = sRoleLower.includes("approver 2") || sRoleLower.includes("approver2") || sRoleLower.includes("iam 2") || sRoleLower.includes("iam_2");
            const isIamApp1Persona = !isCompliancePersona && !isIamApp2Persona && (sRoleLower.includes("approver 1") || sRoleLower.includes("approver1") || sRoleLower.includes("iam 1") || sRoleLower.includes("iam_1") || sRoleLower.includes("iam approver"));
            const isInitialApproverPersona = !isCompliancePersona && !isIamApp1Persona && !isIamApp2Persona && sRoleLower.includes("approver");
            const isAnyReviewerPersona = isCompliancePersona || isIamApp1Persona || isIamApp2Persona || isInitialApproverPersona;

            aRawDbRequests.forEach(r => {
                const sDbStatus = (r.db_status || r.status || "PENDING").toUpperCase();
                const sApproverStatus = (r.approver_status || r.approver_decision_status || "").toUpperCase();
                const sComplianceStatus = (r.compliance_status || r.compliance_decision_status || "").toUpperCase();
                const sIamApp1Status = (r.iam_approver_1_status || r.iam_approver_1_decision_status || "").toUpperCase();
                const sIamApp2Status = (r.iam_approver_2_status || r.iam_approver_2_decision_status || "").toUpperCase();

                const isConflictRequest = r.has_conflict === true || !!(r.conflicting_role && r.conflicting_role.trim());
                const isApproverApproved = sApproverStatus === "APPROVED" || sDbStatus === "PENDING_COMPLIANCE" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                const isComplianceApproved = sComplianceStatus === "APPROVED" || (!isConflictRequest && isApproverApproved) || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                const isIamApp1Approved = sIamApp1Status === "APPROVED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                const isIamApp2Approved = sIamApp2Status === "APPROVED" || sDbStatus === "APPROVED";
                const bRoleApproved = (sApproverStatus === "APPROVED" || isApproverApproved || (isCompliancePersona && sComplianceStatus === "APPROVED") || (isIamApp1Persona && sIamApp1Status === "APPROVED") || (isIamApp2Persona && sIamApp2Status === "APPROVED") || sDbStatus === "APPROVED") && sApproverStatus !== "REJECTED" && (!isCompliancePersona || sComplianceStatus !== "REJECTED");

                // Overall approval happens ONLY after final IAM Approver 2 approval!
                const isOverallApproved = (sDbStatus === "APPROVED" || sIamApp2Status === "APPROVED") && sDbStatus !== "REJECTED";
                const isOverallRejected = sDbStatus === "REJECTED" || sApproverStatus === "REJECTED" || (isConflictRequest && sComplianceStatus === "REJECTED") || sIamApp1Status === "REJECTED" || sIamApp2Status === "REJECTED";
                const isOverallPending = !isOverallApproved && !isOverallRejected;

                let sStatusText = "Pending Approval";
                let sState = "Warning";
                let sIcon = "sap-icon://pending";

                if (isOverallApproved) {
                    sStatusText = "Approved";
                    sState = "Success";
                    sIcon = "sap-icon://sys-enter-2";
                } else if (isOverallRejected) {
                    sStatusText = "Rejected";
                    sState = "Error";
                    sIcon = "sap-icon://error";
                } else if (isIamApp1Approved) {
                    sStatusText = "Pending IAM Approver 2";
                    sState = "Information";
                    sIcon = "sap-icon://pending";
                } else if (isConflictRequest && sComplianceStatus !== "APPROVED" && isApproverApproved && sDbStatus !== "PENDING_IAM_1") {
                    sStatusText = "Pending Compliance";
                    sState = "Information";
                    sIcon = "sap-icon://pending";
                } else if (isApproverApproved) {
                    sStatusText = "Pending IAM Approver 1";
                    sState = "Information";
                    sIcon = "sap-icon://pending";
                }

                const sRawDuration = r.access_duration || "Permanent (Default)";
                let sCleanDuration = sRawDuration;
                if (sRawDuration === "Permanent" || sRawDuration === "Permanent (Default)") {
                    sCleanDuration = "Permanent (Default)";
                } else if (sRawDuration.includes("30")) {
                    sCleanDuration = "30 Days (Temporary)";
                } else if (sRawDuration.includes("90")) {
                    sCleanDuration = "90 Days (Project)";
                }

                                                const deriveServiceTopicFromRole = (roleStr, rawService) => {
                    const cleanRaw = rawService ? String(rawService).replace(/\s*\([^)]*\)/g, "").trim() : "";
                    if (cleanRaw === "System Administrator" || cleanRaw === "System Owners" || cleanRaw === "Stakeholders") {
                        return cleanRaw;
                    }
                    const r = String(roleStr || "");
                    const match = r.match(/\((.*?)\)/);
                    if (match && match[1]) {
                        const m = match[1].trim();
                        if (m.includes("Administrator")) return "System Administrator";
                        if (m.includes("Owner") && !m.includes("Stakeholders")) return "System Owners";
                        if (m.includes("Stakeholder")) return "Stakeholders";
                    }
                    const rLower = r.toLowerCase();
                    if (rLower.includes("developer") || rLower.includes("administrator") || rLower.includes("lead engineer") || rLower.includes("security")) {
                        return "System Administrator";
                    }
                    if (rLower.includes("product group") || rLower.includes("technical product owner")) {
                        return "System Owners";
                    }
                    if (rLower.includes("stakeholder") || rLower.includes("line manager") || rLower.includes("compliance") || rLower.includes("isrm") || rLower.includes("grc") || rLower.includes("role owner")) {
                        return "Stakeholders";
                    }
                    return cleanRaw || "System Administrator";
                };

                const cleanPersonaStr = (s) => {
                    if (!s) return "Engineering & Developer Persona";
                    let str = String(s).replace(/\s*\([^)]*\)/g, "").trim();
                    if (!str || str === "undefined") return "Engineering & Developer Persona";
                    return str;
                };

                const cleanRoleStr = (s) => {
                    if (!s) return "IT Developers";
                    let str = String(s).replace(/\s*\([^)]*\)/g, "").trim();
                    if (!str || str === "undefined") return "IT Developers";
                    return str;
                };

                const sCleanItemPersona = cleanPersonaStr(r.selected_persona || r.persona || r.role_name);
                const sCleanItemRole = cleanRoleStr(r.role_name);
                const sCleanItemService = deriveServiceTopicFromRole(r.role_name, r.service_topic || r.serviceTopic || r.service);

                const oReqObj = {
                    requestId: r.request_number || ("REQ-" + r.ID),
                    requesterId: r.requester_username,
                    requesterUsername: r.requester_username,
                    type: r.request_type || "Addition",
                    system: r.target_system || "SAP System",
                    roleName: sCleanItemRole,
                    roleTitle: sCleanItemRole,
                    serviceTopic: sCleanItemService,
                    selectedPersona: sCleanItemPersona,
                    accessDuration: sCleanDuration,
                    submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    createdAtRaw: r.created_at || new Date().toISOString(),
                    approver: "Line Manager / ISRM Team",
                    persona: sCleanItemPersona,
                    status: sStatusText,
                    statusState: sState,
                    statusIcon: sIcon,
                    region: r.operating_region || "",
                    justification: r.justification || "",
                    sector: r.business_sector || "",
                    function: r.business_function || ""
                };

                // Populate user's history & pending lists (match active user or fallback)
                const bIsUserMatch = !!(r.requester_username && sActiveUser && r.requester_username.toLowerCase() === sActiveUser.toLowerCase());
                if (bIsUserMatch) {
                    aMyHistory.push(oReqObj);
                    if (isOverallPending) {
                        aMyPending.push(oReqObj);
                    } else if (isOverallApproved) {
                        aMyApproved.push(oReqObj);
                    }

                    // Track active/pending/revoked role state machine
                    const sKey = (r.target_system || "") + "_" + (r.role_name || "");
                    const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");
                    if (isOverallApproved) {
                        if (isRevocation) {
                            roleStates[sKey] = { request: r, status: 'REVOKED' };
                        } else {
                            roleStates[sKey] = { request: r, status: 'ACTIVE' };
                        }
                    } else if (isOverallPending) {
                        if (isRevocation) {
                            roleStates[sKey] = { request: r, status: 'REVOKE_PENDING' };
                        }
                    } else if (isOverallRejected) {
                        if (isRevocation) {
                            roleStates[sKey] = { request: r, status: 'ACTIVE' };
                        }
                    }
                }

                // Determine whether this request is visible in pending or processed queue for the current persona
                let isPendingForRole = false;
                let isProcessedForRole = false;

                if (isInitialApproverPersona) {
                    if (sApproverStatus === "APPROVED" || sApproverStatus === "REJECTED" || isApproverApproved || sDbStatus === "APPROVED" || sDbStatus === "REJECTED") {
                        isProcessedForRole = true;
                    } else if (sDbStatus !== "REJECTED") {
                        isPendingForRole = true;
                    }
                                } else if (isCompliancePersona) {
                    // Compliance Reviewer sees conflict requests or requests with existing compliance decision
                    const hasComplianceDecision = sComplianceStatus === "APPROVED" || sComplianceStatus === "REJECTED" || !!(r.reviewer_comment && r.reviewer_comment.trim());
                    if (hasComplianceDecision || (isApproverApproved && isConflictRequest)) {
                        if (sComplianceStatus === "APPROVED" || sComplianceStatus === "REJECTED" || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED" || (sDbStatus === "REJECTED" && sComplianceStatus === "REJECTED")) {
                            isProcessedForRole = true;
                        } else if (sDbStatus !== "REJECTED") {
                            isPendingForRole = true;
                        }
                    }
                } else if (isIamApp1Persona) {
                    // IAM Approver 1 sees:
                    // 1) Conflict requests approved by Compliance
                    // 2) Non-conflict requests approved by Approver directly!
                    const isReadyForIam1 = (isConflictRequest && sComplianceStatus === "APPROVED") || (!isConflictRequest && isApproverApproved) || sDbStatus === "PENDING_IAM_1" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED";
                    if (isReadyForIam1) {
                        if (sIamApp1Status === "APPROVED" || sIamApp1Status === "REJECTED" || sDbStatus === "PENDING_IAM_2" || sDbStatus === "APPROVED" || (sDbStatus === "REJECTED" && sIamApp1Status === "REJECTED")) {
                            isProcessedForRole = true;
                        } else if (sDbStatus !== "REJECTED" && sDbStatus !== "PENDING_COMPLIANCE") {
                            isPendingForRole = true;
                        }
                    }
                } else if (isIamApp2Persona) {
                    if (isIamApp1Approved) {
                        if (sIamApp2Status === "APPROVED" || sIamApp2Status === "REJECTED" || sDbStatus === "APPROVED" || (sDbStatus === "REJECTED" && sIamApp2Status === "REJECTED")) {
                            isProcessedForRole = true;
                        } else if (sDbStatus !== "REJECTED") {
                            isPendingForRole = true;
                        }
                    }
                } else {
                    // Requester
                    isPendingForRole = isOverallPending;
                    isProcessedForRole = !isOverallPending;
                }

                // For Reviewer personas, only include requests belonging to their queue
                if (isAnyReviewerPersona && !isPendingForRole && !isProcessedForRole) {
                    return;
                }

                const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");

                // Group for Approver / Reviewer Page
                const sServiceTopic = r.business_function || r.businessFunction || r.function || r.service_topic || r.serviceTopic || deriveServiceTopicFromRole(r.role_name, r.service) || "Inventory Governance";
                const sGroupKey = (r.requester_username || "User") + "_" + (r.business_sector || "") + "_" + sServiceTopic + "_" + (isPendingForRole ? "PENDING" : "PROCESSED") + "_" + (isRevocation ? "REVOCATION" : "ADDITION");
if (!oGrouped[sGroupKey]) {
                    oGrouped[sGroupKey] = {
                        requestId: r.request_number,
                        requesterId: r.requester_username || "User",
                        persona: r.requester_persona || "Requester",
                        system: r.target_system || "SAP System",
                        serviceAndRole: (r.role_name || "Role") + " (" + sServiceTopic + ")",
                        serviceTopic: sServiceTopic,
                        submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        decisionDate: r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "",
                        function: sServiceTopic,
                        region: r.operating_region || "",
                        justification: r.justification || "",
                        selectedPersona: r.selected_persona || r.requester_persona || "Requester",
                        status: isRevocation ? (isPendingForRole ? "Revoke Pending" : sStatusText) : (isPendingForRole ? "Pending Approval" : sStatusText),
                        statusState: isRevocation ? (isPendingForRole ? "Error" : sState) : sState,
                        statusIcon: isRevocation ? "sap-icon://pending" : sIcon,
                        isRevocation: isRevocation,
                        requestType: isRevocation ? "Revocation" : "Addition",
                        _isPendingForRole: isPendingForRole,
                        entitlements: []
                    };
                }

                oGrouped[sGroupKey].entitlements.push({
                    requestId: r.request_number,
                    system: r.target_system,
                    roleName: r.role_name,
                    team: sServiceTopic,
                    serviceTopic: sServiceTopic,
                    selectedPersona: r.selected_persona || "User",
                    grantedDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    expiryDate: r.access_duration,
                    status: isPendingForRole ? (isRevocation ? "Revoke Pending" : "Pending") : (bRoleApproved ? "Approved" : "Rejected"),
                    statusState: sState,
                    statusIcon: sIcon
                });
            });

            // Inject in-flight local cache revocation requests if not yet committed in database
            if (this._localInFlightRevocations) {
                Object.keys(this._localInFlightRevocations).forEach(sKey => {
                    const inflight = this._localInFlightRevocations[sKey];
                    
                    // Force state machine status to REVOKE_PENDING
                    roleStates[sKey] = {
                        request: {
                            request_number: inflight.requestId,
                            target_system: inflight.system,
                            role_name: inflight.roleName,
                            requester_username: sActiveUser,
                            created_at: inflight.createdAt,
                            access_duration: "Permanent",
                            service_topic: inflight.category,
                            selected_persona: inflight.persona,
                            business_sector: inflight.sector,
                            business_function: "Access Revocation",
                            operating_region: inflight.region,
                            justification: inflight.justification
                        },
                        status: 'REVOKE_PENDING'
                    };

                    // Insert into aMyPending and aMyHistory if not already there
                    const alreadyPending = aMyPending.some(p => p.system === inflight.system && p.roleName === inflight.roleName);
                    if (!alreadyPending) {
                        const oInflightReqObj = {
                            requestId: inflight.requestId,
                            requesterId: sActiveUser,
                            requesterUsername: sActiveUser,
                            type: "Revocation",
                            system: inflight.system,
                            roleName: inflight.roleName,
                            serviceTopic: inflight.category || "Revocation Request",
                            selectedPersona: inflight.persona || "User",
                            accessDuration: "Permanent",
                            submissionDate: inflight.createdAt.split("T")[0],
                            createdAtRaw: inflight.createdAt,
                            approver: "Line Manager / ISRM Team",
                            persona: sActiveRole,
                            status: "Pending Approval",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending",
                            region: inflight.region || "Global Enterprise (ALL)",
                            justification: inflight.justification,
                            sector: inflight.sector || "Information Technology & Security",
                            function: "Access Revocation"
                        };
                        aMyPending.push(oInflightReqObj);
                        aMyHistory.push(oInflightReqObj);
                    }
                });
            }

            // Populate user's active/pending access list from state machine tracking
            Object.keys(roleStates).forEach(sKey => {
                const stateObj = roleStates[sKey];
                if (stateObj.status === 'REVOKED') return; // Exclude approved revocations

                const r = stateObj.request;
                const isCurrentlyRevoking = stateObj.status === 'REVOKE_PENDING';

                aUserAccessList.push({
                    system: r.target_system,
                    roleName: r.role_name,
                    roleId: r.request_number || ("ENT-" + r.ID),
                    team: this._deriveCleanTeamName(r),
                    category: r.service_topic || "System Entitlement",
                    persona: r.selected_persona || r.requester_persona || "User",
                    grantedDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    expiryDate: r.access_duration || "Permanent",
                    status: isCurrentlyRevoking ? "Revoke Pending" : "Active",
                    statusState: isCurrentlyRevoking ? "Warning" : "Success",
                    statusIcon: isCurrentlyRevoking ? "sap-icon://pending" : "sap-icon://sys-enter-2",
                    sector: r.business_sector || "",
                    function: r.business_function || "",
                    region: r.operating_region || ""
                });
            });

            const aAllGrouped = Object.values(oGrouped);

            // Recompute overall group status based on individual entitlements decisions
            aAllGrouped.forEach(g => {
                if (!g._isPendingForRole) {
                    const approvedCount = g.entitlements.filter(e => e.status === "Approved").length;
                    const rejectedCount = g.entitlements.filter(e => e.status === "Rejected").length;
                    if (approvedCount > 0 && rejectedCount > 0) {
                        g.status = "Partially Approved";
                        g.statusState = "Warning";
                        g.statusIcon = "sap-icon://alert";
                    } else if (approvedCount > 0 && rejectedCount === 0) {
                        g.status = "Approved";
                        g.statusState = "Success";
                        g.statusIcon = "sap-icon://sys-enter-2";
                    } else if (approvedCount === 0 && rejectedCount > 0) {
                        g.status = "Rejected";
                        g.statusState = "Error";
                        g.statusIcon = "sap-icon://error";
                    } else {
                        g.status = "Approved";
                        g.statusState = "Success";
                        g.statusIcon = "sap-icon://sys-enter-2";
                    }
                }
            });

            aAllGrouped.sort((a, b) => {
                const tA = new Date(a.createdAtRaw || 0).getTime();
                const tB = new Date(b.createdAtRaw || 0).getTime();
                if (tA !== tB) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });
            const aApproverPendingAccess = [];
            const aApproverPendingRevoke = [];
            aAllGrouped.forEach(g => {
                const sStat = (g.status || "").toUpperCase();
                const isRevocation = g.isRevocation;
                const isPending = g._isPendingForRole !== undefined ? g._isPendingForRole : (sStat.includes("PENDING") || sStat.includes("SUBMITTED"));

                if (isPending) {
                    aApproverPending.push(g);
                    if (isRevocation) {
                        aApproverPendingRevoke.push(g);
                    } else {
                        aApproverPendingAccess.push(g);
                    }
                } else {
                    aApproverProcessed.push(g);
                }
            });

            // Group aMyPending by Request ID so one access request appears as one row with all systems joined
            const aUniqueMyPending = this._groupRequestsByRequestId(aMyPending);

            // Deduplicate aUserAccessList preserving descending order
            const activeKeys = new Set();
            const aUniqueUserAccessList = [];
            for (let i = 0; i < aUserAccessList.length; i++) {
                const item = aUserAccessList[i];
                const sKey = (item.system || "") + "_" + (item.roleName || "");
                if (!activeKeys.has(sKey)) {
                    activeKeys.add(sKey);
                    aUniqueUserAccessList.push(item);
                }
            }

            const aActiveRolesList = aUniqueUserAccessList.filter(item => item.status !== "Revoke Pending");

            // Ensure every single item in Pending and History has a distinct unique Request ID
            const oReqCountsPending = {};
            aMyPending.forEach(p => { oReqCountsPending[p.requestId] = (oReqCountsPending[p.requestId] || 0) + 1; });
            const oReqIndexPending = {};
            aMyPending.forEach(p => {
                if (oReqCountsPending[p.requestId] > 1) {
                    oReqIndexPending[p.requestId] = (oReqIndexPending[p.requestId] || 0) + 1;
                    const sPad = String(oReqIndexPending[p.requestId]).padStart(2, "0");
                    p.requestId = `${p.requestId}-${sPad}`;
                }
            });

            const oReqCountsHist = {};
            aMyHistory.forEach(h => { oReqCountsHist[h.requestId] = (oReqCountsHist[h.requestId] || 0) + 1; });
            const oReqIndexHist = {};
            aMyHistory.forEach(h => {
                if (oReqCountsHist[h.requestId] > 1) {
                    oReqIndexHist[h.requestId] = (oReqIndexHist[h.requestId] || 0) + 1;
                    const sPad = String(oReqIndexHist[h.requestId]).padStart(2, "0");
                    h.requestId = `${h.requestId}-${sPad}`;
                }
            });

            this._setSmartProperty(oModel, "/myPendingRequests", aMyPending);
            this._setSmartProperty(oModel, "/myApprovedRequests", aMyApproved);
            this._setSmartProperty(oModel, "/pendingRequests", aApproverPending);
            this._setSmartProperty(oModel, "/pendingAccessRequests", aApproverPendingAccess);
            this._setSmartProperty(oModel, "/pendingRevokeRequests", aApproverPendingRevoke);
            this._setSmartProperty(oModel, "/pendingAccessCount", aApproverPendingAccess.length);
            this._setSmartProperty(oModel, "/pendingRevokeCount", aApproverPendingRevoke.length);
            // Sort Processed Requests: Latest decision at the very top (first row)
            aApproverProcessed.sort((a, b) => {
                const tA = Math.max(new Date(a.updatedAtRaw || a.updated_at || a.decisionDate || a.createdAtRaw || a.created_at || a.submissionDate || 0).getTime(), 0);
                const tB = Math.max(new Date(b.updatedAtRaw || b.updated_at || b.decisionDate || b.createdAtRaw || b.created_at || b.submissionDate || 0).getTime(), 0);
                if (tA !== tB) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });
            this._setSmartProperty(oModel, "/processedRequests", aApproverProcessed);
            this._setSmartProperty(oModel, "/requestHistory", aMyHistory);
            this._setSmartProperty(oModel, "/myHistoryRequests", aMyHistory);
            this._setSmartProperty(oModel, "/userAccessList", aUniqueUserAccessList);
            this._setSmartProperty(oModel, "/activeRoles", aActiveRolesList);

            // Compute 4 History KPI Metrics: 1. All History, 2. Approved, 3. Rejected, 4. Removed
            let iRemovedHistory = 0;
            let iApprovedHistory = 0;
            let iRejectedHistory = 0;

            const aAllCombinedHistory = aMyHistory || [];
            aAllCombinedHistory.forEach(req => {
                const sStat = (req.status || "").toLowerCase();
                const sType = (req.type || "").toLowerCase();
                const isRevocation = sType.includes("revocation") || sType.includes("removal") || (req.function || "").toLowerCase().includes("revocation") || sStat.includes("revoke") || sStat.includes("expired") || sStat.includes("removed");
                
                if (isRevocation) {
                    iRemovedHistory++;
                } else if (sStat.includes("approved") || sStat.includes("active")) {
                    iApprovedHistory++;
                } else if (sStat.includes("reject") || sStat.includes("decline")) {
                    iRejectedHistory++;
                }
            });

            this._setSmartProperty(oModel, "/allHistoryCount", aMyHistory.length);
            this._setSmartProperty(oModel, "/approvedHistoryCount", iApprovedHistory);
            this._setSmartProperty(oModel, "/rejectedHistoryCount", iRejectedHistory);
            this._setSmartProperty(oModel, "/removedHistoryCount", iRemovedHistory);

            this._setSmartProperty(oModel, "/allHistoryCount", (aAllCombinedHistory || []).length);
            
            
            this._setSmartProperty(oModel, "/approvedHistoryCount", iApprovedHistory);
            this._setSmartProperty(oModel, "/rejectedHistoryCount", iRejectedHistory);

            // Maintain top-10 pagination vs view-all state
            const bShowAll = oModel.getProperty("/myAccessShowAll") || false;
            this._setSmartProperty(oModel, "/displayedUserAccessList", bShowAll ? aUniqueUserAccessList : aUniqueUserAccessList.slice(0, 10));

            // Load and filter notifications dynamically for active user
            this._loadNotifications(oModel);
        },

        async onRefreshAccess(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const oBtn = this.byId("fioriHeaderRefreshBtn") || (oEvent ? oEvent.getSource() : null);
            const oContentBox = this.byId("accessMainContentBox") || document.querySelector(".fioriMainContentBox");

            if (oBtn) {
                oBtn.addStyleClass("kyraBtnSpinning");
            }
            if (oContentBox) {
                if (oContentBox.addStyleClass) oContentBox.addStyleClass("kyraPageRefreshFlash");
                else if (oContentBox.classList) oContentBox.classList.add("kyraPageRefreshFlash");
            }

            try {
                if (oModel) {
                    await this._loadSubmittedRequests(oModel);
                    this._loadNotifications(oModel);
                }
            } catch (e) {
                console.warn("Refresh error:", e);
            } finally {
                setTimeout(() => {
                    if (oBtn) {
                        oBtn.removeStyleClass("kyraBtnSpinning");
                    }
                    if (oContentBox) {
                        if (oContentBox.removeStyleClass) oContentBox.removeStyleClass("kyraPageRefreshFlash");
                        else if (oContentBox.classList) oContentBox.classList.remove("kyraPageRefreshFlash");
                    }
                    sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                        MessageToast.show("Portal data refreshed successfully.");
                    });
                }, 700);
            }
        },

        onToggleViewAllMyAccess() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const bCurrent = oModel.getProperty("/myAccessShowAll") || false;
            const bNew = !bCurrent;
            oModel.setProperty("/myAccessShowAll", bNew);
            const aFull = oModel.getProperty("/userAccessList") || [];
            oModel.setProperty("/displayedUserAccessList", bNew ? aFull : aFull.slice(0, 10));
            MessageToast.show(bNew ? "Showing all active entitlements (" + aFull.length + ")" : "Showing first 10 entitlements");
        },

        onSelectMyAccessTab() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", "myAccess");
                    oModel.setProperty("/showRequestDetailsPage", false);
                }
            });
        },

        onSelectMyHistoryTab() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", "myRequests");
                    oModel.setProperty("/showRequestDetailsPage", false);
                    oModel.setProperty("/showAddAccessSector", false);
                    oModel.setProperty("/showRemoveAccessSector", false);
                    oModel.setProperty("/showMyAccessMasterSection", false);
                    oModel.setProperty("/showPendingSection", false);
                    oModel.setProperty("/showApprovedSection", false);
                    oModel.setProperty("/showHistorySection", true);
                    oModel.setProperty("/historyFilterTitle", "All History");
                    oModel.setProperty("/historyFilterSubtitle", "All submitted and historical access requests.");
                    oModel.setProperty("/historyFilterIcon", "sap-icon://documents");
                    oModel.setProperty("/historyFilterAvatarColor", "Accent6");
                    oModel.setProperty("/filteredHistoryCount", oModel.getProperty("/allHistoryCount") || (oModel.getProperty("/requestHistory") || []).length);
                }
                const oTable = this.byId("myRequestsUnifiedTable");
                if (oTable) {
                    const oBinding = oTable.getBinding("items");
                    if (oBinding) oBinding.filter([]);
                }
            });
        },

        onOpenAddAccessDialog() {
            sessionStorage.setItem("kyra_reset_add_access", "true");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            this.getOwnerComponent().getRouter().navTo("AddAccessBusinessSector");
        },

        onCloseAddAccessSector() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    oModel.setProperty("/showAddAccessSector", false);
                }
            });
        },

        onOpenRemoveAccessDialog() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showRemoveAccessSector", true);
            oModel.setProperty("/showAddAccessSector", false);
            MessageToast.show("Remove Access Revocation section displayed below.");
        },

        onCloseRemoveAccessSector() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showRemoveAccessSector", false);
        },

        onCategoryChange(oEvent) {
            const sCategory = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("accessModel");

            const aSubRoles = oSubRolesMap[sCategory] || [];
            const sDefaultSubRole = aSubRoles.length > 0 ? aSubRoles[0].key : "";

            oModel.setProperty("/requestSubRoles", aSubRoles);
            oModel.setProperty("/newRequest/roleName", sDefaultSubRole);
        },

        onAddAccessSubmit() {
            const oModel = this.getView().getModel("accessModel");
            const oForm = oModel.getProperty("/newRequest");

            if (!oForm.justification || oForm.justification.trim().length === 0) {
                MessageBox.error("Please provide a business justification before submitting your access request.");
                return;
            }

            const sReqId = "REQ-2026-" + Math.floor(1000 + Math.random() * 9000);
            const aHistory = oModel.getProperty("/requestHistory");

            aHistory.unshift({
                requestId: sReqId,
                type: "Addition",
                system: oForm.system,
                roleName: oForm.roleName,
                submissionDate: new Date().toISOString().split("T")[0],
                createdAtRaw: new Date().toISOString(),
                approver: "Designated Role Owner",
                status: "Pending Approval",
                statusState: "Warning",
                statusIcon: "sap-icon://pending"
            });

            oModel.setProperty("/requestHistory", aHistory);
            oModel.setProperty("/newRequest/justification", "");
            oModel.setProperty("/showAddAccessSector", false);

            MessageBox.success("Access Request " + sReqId + " for '" + oForm.roleName + "' submitted successfully! Routed for role owner approval.", {
                title: "Request Submitted",
                onClose: () => {
                    const oTabBar = this.byId("accessIconTabBar");
                    oTabBar.setSelectedKey("myRequests");
                }
            });
        },

        onClearRequestForm() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/newRequest/justification", "");
            MessageToast.show("Form cleared.");
        },

        onRemoveAccessClick(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();
            const oModel = this.getView().getModel("accessModel");

            MessageBox.confirm("Are you sure you want to request revocation for role '" + oData.roleName + "' on " + oData.system + "?", {
                title: "Confirm Access Removal",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const sReqId = "REQ-2026-" + Math.floor(100000 + Math.random() * 900000);
                        const sActiveUser = sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || sessionStorage.getItem("kyra_remember_id") || "";
                        const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";

                        // Store in local in-flight cache to prevent background sync race conditions
                        const sCacheKey = (oData.system || "") + "_" + (oData.roleName || "");
                        this._localInFlightRevocations[sCacheKey] = {
                            requestId: sReqId,
                            system: oData.system,
                            roleName: oData.roleName,
                            category: oData.category || "Revocation Request",
                            persona: oData.persona || "User",
                            region: oData.region || "Global Enterprise (ALL)",
                            sector: oData.sector || "Information Technology & Security",
                            justification: "Revocation of access for role " + oData.roleName,
                            createdAt: new Date().toISOString()
                        };

                        // Update status in My Access section immediately to "Revoke Pending"
                        const aAccessList = oModel.getProperty("/userAccessList") || [];
                        aAccessList.forEach(item => {
                            if (item.system === oData.system && item.roleName === oData.roleName) {
                                item.status = "Revoke Pending";
                                item.statusState = "Warning";
                                item.statusIcon = "sap-icon://pending";
                            }
                        });
                        
                        // Exclude the revoked item from the Remove Access section list immediately
                        const aActiveRoles = aAccessList.filter(item => item.status !== "Revoke Pending");
                        
                        this._setSmartProperty(oModel, "/userAccessList", aAccessList);
                        this._setSmartProperty(oModel, "/activeRoles", aActiveRoles);

                        // Construct pending request object and prepend to myPendingRequests immediately
                        const oNewPendingReq = {
                            requestId: sReqId,
                            requesterId: sActiveUser,
                            requesterUsername: sActiveUser,
                            type: "Revocation",
                            system: oData.system,
                            roleName: oData.roleName,
                            team: this._deriveCleanTeamName(oData),
                            serviceTopic: oData.category || "Revocation Request",
                            selectedPersona: oData.persona || "User",
                            accessDuration: "Permanent",
                            submissionDate: new Date().toISOString().split("T")[0],
                            createdAtRaw: new Date().toISOString(),
                            approver: "Line Manager / ISRM Team",
                            persona: sActiveRole,
                            status: "Pending Approval",
                            statusState: "Warning",
                            statusIcon: "sap-icon://pending",
                            region: oData.region || "Global Enterprise (ALL)",
                            justification: "Revocation of access for role " + oData.roleName,
                            sector: oData.sector || "Information Technology & Security",
                            function: "Access Revocation"
                        };

                        const aMyPending = oModel.getProperty("/myPendingRequests") || [];
                        aMyPending.unshift(oNewPendingReq);
                        const aUniqueMyPending = this._groupRequestsByRequestId(aMyPending);
                        this._setSmartProperty(oModel, "/myPendingRequests", aMyPending);

                        const aMyHistory = oModel.getProperty("/myHistoryRequests") || [];
                        aMyHistory.push(oNewPendingReq);
                        this._setSmartProperty(oModel, "/myHistoryRequests", aMyHistory);
                        this._setSmartProperty(oModel, "/requestHistory", aMyHistory);

                        // Persist Revocation Request to PostgreSQL database
                        fetch("/odata/v4/auth/submitAccessRequest", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                requests: [{
                                    requestNumber: sReqId,
                                    requesterUsername: sActiveUser,
                                    requesterPersona: sActiveRole,
                                    businessSector: oData.sector || "Information Technology & Security",
                                    businessFunction: "Access Revocation",
                                    operatingRegion: oData.region || "Global Enterprise (ALL)",
                                    targetSystem: oData.system,
                                    serviceTopic: oData.category || "Revocation Request",
                                    roleName: oData.roleName,
                                    selectedPersona: oData.persona || "User",
                                    accessType: "REVOCATION",
                                    accessDuration: "Permanent",
                                    justification: "Revocation of access for role " + oData.roleName
                                }]
                            })
                        })
                        .then(res => res.json())
                        .then(() => {
                            MessageToast.show("Revocation Request " + sReqId + " submitted successfully.");
                            this._notifyDatabaseMutation();
                            this._loadSubmittedRequestsFromDatabase(oModel);
                        })
                        .catch(err => {
                            console.error("Error submitting revocation request:", err);
                            MessageToast.show("Submitted revocation request " + sReqId);
                            this._notifyDatabaseMutation();
                            this._loadSubmittedRequestsFromDatabase(oModel);
                        });

                        // SECTION STAYS OPEN (No setProperty showRemoveAccessSector false, no tab navigation)
                    }
                }
            });
        },

        onSearchMyAccess(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
                    new Filter("roleId", FilterOperator.Contains, sQuery),
                    new Filter("category", FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myAccessTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onViewRoleDetails(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();

            MessageBox.information(
                "Role Name: " + oData.roleName + "\n" +
                "Role ID: " + oData.roleId + "\n" +
                "Target System: " + oData.system + "\n" +
                "Category: " + oData.category + "\n" +
                "Granted Date: " + oData.grantedDate + "\n" +
                "Expiration: " + oData.expiryDate + "\n" +
                "Status: " + oData.status,
                { title: "Entitlement Details" }
            );
        },

        onSearchRequests(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("requestId", FilterOperator.Contains, sQuery),
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
                    new Filter("serviceTopic", FilterOperator.Contains, sQuery),
                    new Filter("selectedPersona", FilterOperator.Contains, sQuery),
                    new Filter("accessDuration", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myRequestsTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onExportAccess() {
            MessageToast.show("Exporting My Access entitlements to CSV...");
        },

        onExportRequests() {
            MessageToast.show("Exporting My Requests audit trail to CSV...");
        },

        onRefreshAccess() {
            MessageToast.show("Refreshing Access Governance Data...");
            this._loadSubmittedRequestsFromDatabase();
            setTimeout(() => {
                MessageToast.show("Access page data refreshed successfully.");
            }, 300);
        },

        
        _loadNotifications(oModel) {
            if (!oModel) oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sActiveUser = (oModel.getProperty("/activeUser") || sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || "").trim();
            const aHistory = oModel.getProperty("/requestHistory") || [];

            let aSavedStatusMap = {};
            let aSavedNotifications = [];
            try {
                aSavedNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                (aSavedNotifications || []).forEach(n => {
                    if (n.id) aSavedStatusMap[n.id] = n.unread;
                });
            } catch (e) {}

            // Load set of deleted notification IDs from sessionStorage to prevent them from recreating
            let aDeletedIds = [];
            try {
                aDeletedIds = JSON.parse(sessionStorage.getItem("kyra_deleted_notification_ids") || "[]");
            } catch (e) {}
            const oDeletedSet = new Set(aDeletedIds);

            let aNotifications = [];

            if (aHistory.length > 0) {
                aHistory.forEach((r, idx) => {
                    const sReqId = r.requestId || ("REQ-2026-" + (300160 + idx));
                    const sStatus = (r.status || "Pending Approval").trim();
                    const sStatusUpper = sStatus.toUpperCase();
                    const sSys = r.system || "SAP System";
                    const sRole = r.roleName || r.serviceAndRole || "System Role";
                    const sDate = r.decisionDate || r.submissionDate || (r.created_at ? r.created_at.split("T")[0] : "Today");
                    const sApproverComment = (r.approver_comment || r.approverComment || r.reviewer_comment || r.reviewerComment || r.comments || "").trim();

                    let sCandidateNotifId = "";
                    if (sStatusUpper.includes("APPROV")) {
                        sCandidateNotifId = "notif-appr-" + sReqId;
                    } else if (sStatusUpper.includes("REJECT") || sStatusUpper.includes("DECLINE")) {
                        sCandidateNotifId = "notif-rej-" + sReqId;
                    } else {
                        sCandidateNotifId = "notif-submit-" + sReqId;
                    }

                    // Skip if explicitly deleted by user
                    if (oDeletedSet.has(sCandidateNotifId)) {
                        return;
                    }

                    if (sStatusUpper.includes("APPROV")) {
                        const isPartial = sStatusUpper.includes("PARTIAL");
                        const bUnread = aSavedStatusMap[sCandidateNotifId] !== undefined ? aSavedStatusMap[sCandidateNotifId] : true;
                        let sDesc = "Your access request for " + sSys + " (" + sRole + ") has been " + (isPartial ? "partially approved" : "approved") + ".";
                        if (sApproverComment) {
                            sDesc += " Approver Remark: \"" + sApproverComment + "\"";
                        }
                        aNotifications.push({
                            id: sCandidateNotifId,
                            requesterId: sActiveUser,
                            requestId: sReqId,
                            system: sSys,
                            roleName: sRole,
                            type: "approved",
                            category: "Access Decisions",
                            title: isPartial ? "Access Request Partially Approved" : "Access Request Approved",
                            description: sDesc,
                            approverComment: sApproverComment,
                            timestamp: sDate,
                            icon: isPartial ? "sap-icon://alert" : "sap-icon://sys-enter-2",
                            state: isPartial ? "Warning" : "Success",
                            unread: bUnread
                        });
                    } else if (sStatusUpper.includes("REJECT") || sStatusUpper.includes("DECLINE")) {
                        const bUnread = aSavedStatusMap[sCandidateNotifId] !== undefined ? aSavedStatusMap[sCandidateNotifId] : true;
                        let sDesc = "Your access request for " + sSys + " (" + sRole + ") has been rejected.";
                        if (sApproverComment) {
                            sDesc += " Approver Remark: \"" + sApproverComment + "\"";
                        }
                        aNotifications.push({
                            id: sCandidateNotifId,
                            requesterId: sActiveUser,
                            requestId: sReqId,
                            system: sSys,
                            roleName: sRole,
                            type: "rejected",
                            category: "Access Decisions",
                            title: "Access Request Rejected",
                            description: sDesc,
                            approverComment: sApproverComment,
                            timestamp: sDate,
                            icon: "sap-icon://error",
                            state: "Error",
                            unread: bUnread
                        });
                    } else {
                        // Submitted / Pending Approval
                        const bUnread = aSavedStatusMap[sCandidateNotifId] !== undefined ? aSavedStatusMap[sCandidateNotifId] : true;
                        aNotifications.push({
                            id: sCandidateNotifId,
                            requesterId: sActiveUser,
                            requestId: sReqId,
                            system: sSys,
                            roleName: sRole,
                            type: "submitted",
                            category: "Access Requests",
                            title: "Access Request Submitted",
                            description: "Your access request for " + sSys + " (" + sRole + ") has been submitted successfully and is awaiting review.",
                            approverComment: "",
                            timestamp: r.submissionDate || sDate,
                            icon: "sap-icon://pending",
                            state: "Information",
                            unread: bUnread
                        });
                    }
                });
            }

            // Include any additional custom/manual notifications that were pushed
            (aSavedNotifications || []).forEach(sn => {
                if (sn.title && sn.title.includes(": REQ-")) {
                    sn.title = sn.title.split(": REQ-")[0];
                }
                if (sn.id && !aNotifications.some(n => n.id === sn.id)) {
                    aNotifications.push(sn);
                }
            });

            // Sort notifications newest first
            aNotifications.sort((a, b) => {
                const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                if (tA && tB && tA !== tB) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });

            if (aNotifications.length === 0) {
                const sDefId = "notif-submit-REQ-2026-300162";
                if (!oDeletedSet.has(sDefId)) {
                    const bUnread = aSavedStatusMap[sDefId] !== undefined ? aSavedStatusMap[sDefId] : true;
                    aNotifications = [
                        {
                            id: sDefId,
                            requesterId: sActiveUser,
                            requestId: "REQ-2026-300162",
                            system: "SAP BTP Cloud Platform",
                            roleName: "IT Developers (System Administrator)",
                            type: "submitted",
                            category: "Access Requests",
                            title: "Access Request Submitted",
                            description: "Your access request for SAP BTP Cloud Platform (IT Developers) has been submitted successfully and is awaiting review.",
                            approverComment: "",
                            timestamp: "Just now",
                            icon: "sap-icon://pending",
                            state: "Information",
                            unread: bUnread
                        }
                    ];
                }
            }

            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aNotifications));

            const iUnreadCount = aNotifications.filter(n => n.unread !== false).length;

            this._setSmartProperty(oModel, "/notificationsList", aNotifications);
            this._setSmartProperty(oModel, "/notificationsCount", iUnreadCount);
            this._setSmartProperty(oModel, "/allNotificationsCount", aNotifications.length);
            this._setSmartProperty(oModel, "/unreadNotificationsCount", iUnreadCount);

            this._applyNotificationFilter(oModel);
        },

        _applyNotificationFilter(oModel) {
            if (!oModel) oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aList = oModel.getProperty("/notificationsList") || [];
            const sKey = oModel.getProperty("/notifFilterKey") || "all";
            const sQuery = (oModel.getProperty("/notifSearchQuery") || "").toLowerCase().trim();

            let aFiltered = aList;
            if (sKey === "unread") {
                aFiltered = aFiltered.filter(n => n.unread !== false);
            } else if (sKey === "requests") {
                aFiltered = aFiltered.filter(n => n.type === "approved" || n.type === "updated" || (n.category && n.category.toLowerCase().includes("access")));
            } else if (sKey === "approvals") {
                aFiltered = aFiltered.filter(n => n.type === "new_request" || (n.category && n.category.toLowerCase().includes("approval")));
            } else if (sKey === "system") {
                aFiltered = aFiltered.filter(n => n.type === "system" || (n.category && n.category.toLowerCase().includes("system")));
            }

            if (sQuery) {
                aFiltered = aFiltered.filter(n => {
                    const sTitle = (n.title || "").toLowerCase();
                    const sDesc = (n.description || "").toLowerCase();
                    const sSys = (n.system || "").toLowerCase();
                    const sReqId = (n.requestId || "").toLowerCase();
                    const sCat = (n.category || "").toLowerCase();
                    return sTitle.includes(sQuery) || sDesc.includes(sQuery) || sSys.includes(sQuery) || sReqId.includes(sQuery) || sCat.includes(sQuery);
                });
            }

            oModel.setProperty("/filteredNotificationsList", aFiltered);
        },

        onNavToAllNotificationsPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._confirmDiscardAddAccess(() => {
                oModel.setProperty("/showAllNotificationsPage", true);
                oModel.setProperty("/showRequestDetailsPage", false);
                oModel.setProperty("/showHelpPage", false);
                oModel.setProperty("/showContactITPage", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showMyAccessMasterSection", false);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/notifFilterKey", "all");
                oModel.setProperty("/notifSearchQuery", "");
                this._applyNotificationFilter(oModel);
                this._scrollToTop();
            });
        },

        onBackFromNotificationsPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/showAllNotificationsPage", false);
            this._scrollToTop();
        },

        onOpenHelpPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._confirmDiscardAddAccess(() => {
                oModel.setProperty("/showHelpPage", true);
                oModel.setProperty("/showAllNotificationsPage", false);
                oModel.setProperty("/showRequestDetailsPage", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showMyAccessMasterSection", false);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                this._scrollToTop();
            });
        },

        onBackFromHelpPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/showHelpPage", false);
            this._scrollToTop();
        },

        onHelpSearchLiveChange(oEvent) {
            const sQuery = (oEvent.getParameter("value") || oEvent.getParameter("newValue") || "").toLowerCase().trim();
            const aCards = document.querySelectorAll(".kyraHelpCard");
            if (aCards && aCards.length > 0) {
                aCards.forEach(card => {
                    if (!sQuery) {
                        card.style.display = "";
                    } else {
                        const sText = card.textContent.toLowerCase();
                        card.style.display = sText.includes(sQuery) ? "" : "none";
                    }
                });
            }
        },

        onHelpCardPress(oEvent) {
            const oBtn = oEvent.getSource();
            let sTopic = "Help Topic";
            if (oBtn.data) {
                sTopic = oBtn.data("topic") || "Help Topic";
            } else if (oBtn.getCustomData && oBtn.getCustomData().length > 0) {
                sTopic = oBtn.getCustomData()[0].getValue() || "Help Topic";
            }

            if (sTopic === "Contact IT") {
                this.onOpenContactITPage();
                return;
            }

            if (sTopic === "Troubleshooting") {
                this.onOpenTroubleshootPage();
                return;
            }

            this._showHelpTopicDialog(sTopic);
        },

        onOpenTroubleshootPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._confirmDiscardAddAccess(() => {
                oModel.setProperty("/showTroubleshootPage", true);
                oModel.setProperty("/troubleshootSuccess", false);
                oModel.setProperty("/showContactITPage", false);
                oModel.setProperty("/showHelpPage", false);
                oModel.setProperty("/showAllNotificationsPage", false);
                oModel.setProperty("/showRequestDetailsPage", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showMyAccessMasterSection", false);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);

                const oEmail = this.byId("kyraTroubleshootEmail");
                const oSubj = this.byId("kyraTroubleshootSubject");
                const oDesc = this.byId("kyraTroubleshootDescription");
                const oCounter = this.byId("kyraTroubleshootCharCounter");

                if (oEmail) { oEmail.setValue(""); oEmail.setValueState("None"); }
                if (oSubj) { oSubj.setValue(""); oSubj.setValueState("None"); }
                if (oDesc) { oDesc.setValue(""); oDesc.setValueState("None"); }
                if (oCounter) { oCounter.setText("0 / 1000"); }

                this._scrollToTop();
            });
        },

        onBackFromTroubleshootPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/showTroubleshootPage", false);
            oModel.setProperty("/troubleshootSuccess", false);
            oModel.setProperty("/showHelpPage", true);
            this._scrollToTop();
        },

        onSubmitTroubleshootRequest() {
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                const oName = this.byId("kyraTroubleshootName");
                const sNameVal = oName ? oName.getValue().trim() : "";
                const oEmail = this.byId("kyraTroubleshootEmail");
                const sEmailVal = oEmail ? oEmail.getValue().trim() : "";
                const oSubj = this.byId("kyraTroubleshootSubject");
                const sSubjVal = oSubj ? oSubj.getValue().trim() : "";
                const oDesc = this.byId("kyraTroubleshootDescription");
                const sDescVal = oDesc ? oDesc.getValue().trim() : "";

                if (!sNameVal) {
                    MessageToast.show("Please enter your name.");
                    if (oName) oName.setValueState("Error");
                    return;
                }
                if (oName) oName.setValueState("None");

                if (!sEmailVal || !sEmailVal.includes("@")) {
                    MessageToast.show("Please enter a valid email address.");
                    if (oEmail) oEmail.setValueState("Error");
                    return;
                }
                if (oEmail) oEmail.setValueState("None");

                if (!sSubjVal) {
                    MessageToast.show("Please enter an issue subject.");
                    if (oSubj) oSubj.setValueState("Error");
                    return;
                }
                if (oSubj) oSubj.setValueState("None");

                if (!sDescVal) {
                    MessageToast.show("Please describe your issue in detail.");
                    if (oDesc) oDesc.setValueState("Error");
                    return;
                }
                if (oDesc) oDesc.setValueState("None");

                const sTicketId = "TRB-" + Math.floor(100000 + Math.random() * 900000);
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    oModel.setProperty("/troubleshootTicketId", sTicketId);
                    oModel.setProperty("/troubleshootSuccess", true);
                }

                this._scrollToTop();
            });
        },

        onTroubleshootDescLiveChange(oEvent) {
            const sVal = oEvent.getParameter("value") || "";
            const oCounter = this.byId("kyraTroubleshootCharCounter");
            if (oCounter) {
                oCounter.setText(`${sVal.length} / 1000`);
            }
        },

        onBrowseTroubleshootAttachment() {
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                const oFileInput = document.createElement("input");
                oFileInput.type = "file";
                oFileInput.accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx";
                oFileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        MessageToast.show("File Attached: " + file.name + " (" + (file.size / 1024).toFixed(1) + " KB)");
                    }
                };
                oFileInput.click();
            });
        },

        onOpenContactITPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._confirmDiscardAddAccess(() => {
                oModel.setProperty("/showContactITPage", true);
                oModel.setProperty("/showHelpPage", false);
                oModel.setProperty("/showAllNotificationsPage", false);
                oModel.setProperty("/showRequestDetailsPage", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showMyAccessMasterSection", false);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                this._scrollToTop();
            });
        },

        onBackFromContactITPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/showContactITPage", false);
            oModel.setProperty("/showHelpPage", true);
            this._scrollToTop();
        },

        onSubmitContactITRequest() {
            sap.ui.require(["sap/m/MessageBox", "sap/m/MessageToast"], (MessageBox, MessageToast) => {
                const oName = this.byId("kyraContactITFullName");
                const sNameVal = oName ? oName.getValue().trim() : "";
                const oEmail = this.byId("kyraContactITEmail");
                const sEmailVal = oEmail ? oEmail.getValue().trim() : "";
                const oPhone = this.byId("kyraContactITPhone");
                const oSubj = this.byId("kyraContactITSubject");
                const sSubjVal = oSubj ? oSubj.getValue().trim() : "";
                const oMsg = this.byId("kyraContactITMessage");
                const sMsgVal = oMsg ? oMsg.getValue().trim() : "";

                if (!sNameVal) {
                    MessageToast.show("Please enter your full name.");
                    if (oName) oName.setValueState("Error");
                    return;
                }
                if (oName) oName.setValueState("None");

                if (!sEmailVal || !sEmailVal.includes("@")) {
                    MessageToast.show("Please enter a valid email address.");
                    if (oEmail) oEmail.setValueState("Error");
                    return;
                }
                if (oEmail) oEmail.setValueState("None");

                if (!sSubjVal) {
                    MessageToast.show("Please enter an issue subject.");
                    if (oSubj) oSubj.setValueState("Error");
                    return;
                }
                if (oSubj) oSubj.setValueState("None");

                if (!sMsgVal) {
                    MessageToast.show("Please describe how we can help you.");
                    if (oMsg) oMsg.setValueState("Error");
                    return;
                }
                if (oMsg) oMsg.setValueState("None");

                const sTicket = "TKT-" + Math.floor(100000 + Math.random() * 900000);
                MessageBox.success(`Your IT support request has been submitted successfully!\n\nTicket Reference: ${sTicket}\nOur IT support team will respond within 24 hours.`, {
                    title: "Request Submitted",
                    onClose: () => {
                        if (oEmail) oEmail.setValue("");
                        if (oPhone) oPhone.setValue("");
                        if (oSubj) oSubj.setValue("");
                        if (oMsg) oMsg.setValue("");
                        this.onBackFromContactITPage();
                    }
                });
            });
        },

        onBrowseContactITAttachment() {
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                const oFileInput = document.createElement("input");
                oFileInput.type = "file";
                oFileInput.accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx";
                oFileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        MessageToast.show("File Attached: " + file.name + " (" + (file.size / 1024).toFixed(1) + " KB)");
                    }
                };
                oFileInput.click();
            });
        },

        onContactITDescLiveChange(oEvent) {
            const sVal = oEvent.getParameter("value") || "";
            const oCounter = this.byId("kyraContactITCharCounter");
            if (oCounter) {
                oCounter.setText(`${sVal.length} / 1000`);
            }
        },

        _showHelpTopicDialog(sTopic) {
            sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/core/HTML"], (Dialog, Button, HTML) => {
                let sTitle = sTopic;
                let sBodyHtml = "";

                if (sTopic === "Contact IT") {
                    sTitle = "Contact IT Support";
                    sBodyHtml = `
                        <div style="padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B;">
                            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: #FEF3C7; border: 1px solid #FDE68A; display: flex; align-items: center; justify-content: center; font-size: 22px;">📧</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0F172A;">IT Support Helpdesk</h3>
                                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #64748B;">Reach out directly to our enterprise identity and access team.</p>
                                </div>
                            </div>
                            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
                                <div style="margin-bottom: 12px;">
                                    <div style="font-size: 11.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">Support Email</div>
                                    <div style="font-size: 14px; font-weight: 600; color: #2563EB; margin-top: 2px;">itsupport@enterprise.kyra.com</div>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-size: 11.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">Direct Hotline</div>
                                    <div style="font-size: 14px; font-weight: 600; color: #0F172A; margin-top: 2px;">+1 (800) 555-0199 (Ext. 4040)</div>
                                </div>
                                <div>
                                    <div style="font-size: 11.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">Service Availability</div>
                                    <div style="font-size: 13.5px; color: #16A34A; font-weight: 600; margin-top: 2px;">● 24/7 Global Enterprise Support</div>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (sTopic === "User Guide") {
                    sTitle = "KYRA User Guide";
                    sBodyHtml = `
                        <div style="padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B;">
                            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: #EFF6FF; border: 1px solid #DBEAFE; display: flex; align-items: center; justify-content: center; font-size: 22px;">📖</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0F172A;">User Access Guide</h3>
                                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #64748B;">Overview of core features in KYRA Portal.</p>
                                </div>
                            </div>
                            <div style="font-size: 13.5px; line-height: 1.6; color: #334155;">
                                <p style="margin: 0 0 10px 0;"><strong>1. Requesting Access:</strong> Click <em>"+ Request New Access"</em> to select your business sector, country, and systems.</p>
                                <p style="margin: 0 0 10px 0;"><strong>2. Approvals:</strong> Track your multi-level approvals under <em>My Requests</em> tab in real-time.</p>
                                <p style="margin: 0;"><strong>3. Access Management:</strong> View and manage all assigned systems and roles directly under <em>My Access</em>.</p>
                            </div>
                        </div>
                    `;
                } else if (sTopic === "FAQs") {
                    sTitle = "Frequently Asked Questions";
                    sBodyHtml = `
                        <div style="padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B;">
                            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: #DCFCE7; border: 1px solid #BBF7D0; display: flex; align-items: center; justify-content: center; font-size: 22px;">❓</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0F172A;">Common Questions</h3>
                                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #64748B;">Quick answers to frequently asked questions.</p>
                                </div>
                            </div>
                            <div style="font-size: 13.5px; line-height: 1.5; color: #334155;">
                                <p style="margin: 0 0 8px 0;"><strong>Q: How long does approval take?</strong><br/><span style="color: #64748B;">Standard requests are reviewed by Line Managers within 24 to 48 hours.</span></p>
                                <p style="margin: 0 0 8px 0;"><strong>Q: How do I request temporary access?</strong><br/><span style="color: #64748B;">Select duration dates during Step 3 of the Request New Access wizard.</span></p>
                            </div>
                        </div>
                    `;
                } else {
                    sTitle = "Troubleshooting";
                    sBodyHtml = `
                        <div style="padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B;">
                            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: #F3E8FF; border: 1px solid #E9D5FF; display: flex; align-items: center; justify-content: center; font-size: 22px;">🔧</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #0F172A;">Troubleshooting &amp; Fixes</h3>
                                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #64748B;">Common resolutions for portal connectivity and session issues.</p>
                                </div>
                            </div>
                            <div style="font-size: 13.5px; line-height: 1.6; color: #334155;">
                                <p style="margin: 0 0 8px 0;">• <strong>Session expired:</strong> Log out and sign in using SSO credentials.</p>
                                <p style="margin: 0 0 8px 0;">• <strong>Access not showing:</strong> Ensure your approver has finalized the governance sign-off.</p>
                            </div>
                        </div>
                    `;
                }

                const oDialog = new Dialog({
                    title: sTitle,
                    contentWidth: "480px",
                    content: [
                        new HTML({ content: sBodyHtml })
                    ],
                    beginButton: new Button({
                        text: "Close",
                        type: "Emphasized",
                        press: () => oDialog.close()
                    }),
                    afterClose: () => oDialog.destroy()
                });

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onFilterNotifications(oEvent) {
            const oBtn = oEvent.getSource();
            let sKey = "all";
            if (oBtn.data) {
                sKey = oBtn.data("key") || "all";
            } else if (oBtn.getCustomData && oBtn.getCustomData().length > 0) {
                sKey = oBtn.getCustomData()[0].getValue() || "all";
            }
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/notifFilterKey", sKey);
                this._applyNotificationFilter(oModel);
            }
        },

        onSearchNotifications(oEvent) {
            const sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/notifSearchQuery", sQuery);
                this._applyNotificationFilter(oModel);
            }
        },

        onMarkAllNotificationsRead() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aList = oModel.getProperty("/notificationsList") || [];
            aList.forEach(n => n.unread = false);
            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aList));

            this._loadNotifications(oModel);
            MessageToast.show("All notifications marked as read.");
        },

        onClearReadNotifications() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            let aList = oModel.getProperty("/notificationsList") || [];
            let aDeletedIds = [];
            try {
                aDeletedIds = JSON.parse(sessionStorage.getItem("kyra_deleted_notification_ids") || "[]");
            } catch (e) {}

            aList.forEach(n => {
                if (n.id && !aDeletedIds.includes(n.id)) {
                    aDeletedIds.push(n.id);
                }
            });

            sessionStorage.setItem("kyra_deleted_notification_ids", JSON.stringify(aDeletedIds));
            sessionStorage.setItem("kyra_user_notifications", "[]");

            this._loadNotifications(oModel);
            MessageToast.show("All notifications cleared.");
        },

        onToggleNotificationRead(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            if (!oContext) return;
            const oNotif = oContext.getObject();
            if (!oNotif) return;

            const oModel = this.getView().getModel("accessModel");
            oNotif.unread = !oNotif.unread;

            const aList = oModel.getProperty("/notificationsList") || [];
            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aList));

            this._loadNotifications(oModel);
            MessageToast.show(oNotif.unread ? "Marked as unread." : "Marked as read.");
        },

        onDeleteNotification(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            if (!oContext) return;
            const oNotif = oContext.getObject();
            if (!oNotif) return;

            const oModel = this.getView().getModel("accessModel");
            
            let aDeletedIds = [];
            try {
                aDeletedIds = JSON.parse(sessionStorage.getItem("kyra_deleted_notification_ids") || "[]");
            } catch (e) {}

            if (oNotif.id && !aDeletedIds.includes(oNotif.id)) {
                aDeletedIds.push(oNotif.id);
            }

            sessionStorage.setItem("kyra_deleted_notification_ids", JSON.stringify(aDeletedIds));

            let aList = oModel.getProperty("/notificationsList") || [];
            aList = aList.filter(n => n.id !== oNotif.id);
            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aList));

            this._loadNotifications(oModel);
            MessageToast.show("Notification deleted.");
        },

        onOpenNotificationDetail(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("accessModel");
            if (!oContext) return;
            const oNotif = oContext.getObject();
            if (!oNotif || !oNotif.requestId) return;

            // Mark as read
            oNotif.unread = false;
            const oModel = this.getView().getModel("accessModel");
            const aList = oModel.getProperty("/notificationsList") || [];
            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aList));
            this._loadNotifications(oModel);

            // Open request details page
            const aHistory = oModel.getProperty("/requestHistory") || [];
            const oReq = aHistory.find(r => r.requestId === oNotif.requestId);
            if (oReq) {
                this.onOpenPendingRequestDetails({
                    getSource: () => ({
                        getBindingContext: () => ({
                            getObject: () => oReq
                        })
                    })
                });
            } else {
                this.onNavToAllNotificationsPage();
            }
        },

        onNotifPrevPage() {
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                MessageToast.show("You are on page 1 of 1.");
            });
        },

        onNotifNextPage() {
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                MessageToast.show("You are on page 1 of 1.");
            });
        },

                onOpenNotificationsPopover(oEvent) {
            let oSource = oEvent.getSource ? oEvent.getSource() : null;
            if (!oSource || (oSource.getMetadata && oSource.getMetadata().getName() === "sap.f.ShellBar")) {
                oSource = this.byId("kyraHeaderBellBtn") || oSource;
            }

            const oModel = this.getView().getModel("accessModel");
            const iUnreadCount = oModel ? (oModel.getProperty("/notificationsCount") || 0) : 0;
            const aNotifs = oModel ? (oModel.getProperty("/notificationsList") || []) : [];
            const aTopNotifs = aNotifs.slice(0, 3);

            sap.ui.require([
                "sap/m/ResponsivePopover", "sap/ui/core/HTML", "sap/m/MessageToast"
            ], (ResponsivePopover, HTML, MessageToast) => {
                
                let sItemsHtml = "";
                if (aTopNotifs.length === 0) {
                    sItemsHtml = `
                        <div style="padding: 24px; text-align: center; color: #64748B; font-size: 13px;">
                            No notifications at this time.
                        </div>
                    `;
                } else {
                    aTopNotifs.forEach((n, idx) => {
                        const sHasStripe = idx === 0 ? "kyra-notif-item-has-stripe" : "";
                        const sDotHtml = n.unread !== false ? `<span class="kyra-notif-blue-dot"></span>` : "";
                        
                        let sAvatarHtml = "";
                        if (n.type === "approved") {
                            sAvatarHtml = `
                                <div class="kyra-notif-avatar-circle" style="background: #DCFCE7; border: 1px solid #BBF7D0;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#16A34A" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10" fill="#16A34A"></circle>
                                        <polyline points="9 11 12 14 16 9" stroke="#FFFFFF" stroke-width="2.5" fill="none"></polyline>
                                    </svg>
                                </div>
                            `;
                        } else if (n.type === "rejected") {
                            sAvatarHtml = `
                                <div class="kyra-notif-avatar-circle" style="background: #FEE2E2; border: 1px solid #FCA5A5;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10" fill="#DC2626"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15" stroke="#FFFFFF" stroke-width="2.5"></line>
                                        <line x1="9" y1="9" x2="15" y2="15" stroke="#FFFFFF" stroke-width="2.5"></line>
                                    </svg>
                                </div>
                            `;
                        } else {
                            // submitted / pending / info
                            sAvatarHtml = `
                                <div class="kyra-notif-avatar-circle" style="background: #DBEAFE; border: 1px solid #BFDBFE;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10" fill="#2563EB"></circle>
                                        <polyline points="12 6 12 12 16 14" stroke="#FFFFFF" stroke-width="2.5" fill="none"></polyline>
                                    </svg>
                                </div>
                            `;
                        }

                        let sRemarkHtml = "";
                        if (n.approverComment) {
                            const sBorderColor = n.type === 'rejected' ? '#DC2626' : (n.type === 'approved' ? '#16A34A' : '#2563EB');
                            const sBgColor = n.type === 'rejected' ? '#FEF2F2' : (n.type === 'approved' ? '#F0FDF4' : '#F8FAFC');
                            const sLabelColor = n.type === 'rejected' ? '#991B1B' : (n.type === 'approved' ? '#166534' : '#1E40AF');
                            sRemarkHtml = `
                                <div style="margin-top: 6px; padding: 6px 10px; background: ${sBgColor}; border-left: 3px solid ${sBorderColor}; border-radius: 4px; font-size: 11.5px; line-height: 1.35; color: #334155;">
                                    <span style="font-weight: 700; color: ${sLabelColor};">Approver Remark:</span>
                                    <span style="font-style: italic; color: #0F172A; margin-left: 4px;">"${n.approverComment}"</span>
                                </div>
                            `;
                        }

                        sItemsHtml += `
                            <div class="kyra-notif-item ${sHasStripe}" id="kyra_notif_item_${idx}" data-reqid="${n.requestId || ''}" style="cursor: pointer;">
                                <div class="kyra-notif-avatar-col">
                                    ${sAvatarHtml}
                                </div>
                                <div class="kyra-notif-content-col">
                                    <div class="kyra-notif-item-head">${n.title || 'Access Request Notification'}</div>
                                    <div class="kyra-notif-item-desc">${n.description || ''}</div>
                                    ${sRemarkHtml}
                                    <div class="kyra-notif-item-time" style="margin-top: 4px;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span>${n.timestamp || 'Just now'}</span>
                                    </div>
                                </div>
                                <div class="kyra-notif-dot-col">
                                    ${sDotHtml}
                                </div>
                            </div>
                        `;
                    });
                }

                const sHtmlContent = `
                    <div class="kyra-notif-box-card">
                        <!-- Top Header -->
                        <div class="kyra-notif-header">
                            <div class="kyra-notif-header-left">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                <span class="kyra-notif-title">Notifications</span>
                                <div class="kyra-notif-count-wrap">
                                    <span class="kyra-notif-count-pill" id="kyra_notif_badge_pill">${iUnreadCount}</span>
                                    <span class="kyra-notif-new-text">New</span>
                                </div>
                            </div>
                            <button type="button" class="kyra-notif-mark-all" id="kyra_notif_mark_all_btn">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10" fill="#2563EB"></circle>
                                    <polyline points="9 11 12 14 16 9" stroke="#FFFFFF" stroke-width="2.5" fill="none"></polyline>
                                </svg>
                                <span>Mark all as read</span>
                            </button>
                        </div>

                        <!-- Notification Items List (Top 3 Recent) -->
                        <div class="kyra-notif-list">
                            ${sItemsHtml}
                        </div>

                        <!-- Footer (View all notifications) -->
                        <div class="kyra-notif-footer" id="kyra_notif_view_all_footer" style="cursor: pointer;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span class="kyra-notif-footer-text">View all notifications</span>
                            <span class="kyra-notif-footer-chevron">›</span>
                        </div>
                    </div>
                `;

                const oPopover = new ResponsivePopover({
                    showHeader: false,
                    contentWidth: "440px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    placement: "Bottom",
                    showArrow: true,
                    class: "kyraNotificationPopover",
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterClose: () => oPopover.destroy()
                });

                this.getView().addDependent(oPopover);
                oPopover.openBy(oSource);

                setTimeout(() => {
                    const btnMarkAll = document.getElementById("kyra_notif_mark_all_btn");
                    if (btnMarkAll) {
                        btnMarkAll.onclick = () => {
                            this.onMarkAllNotificationsRead();
                            const dots = document.querySelectorAll(".kyra-notif-blue-dot");
                            dots.forEach(d => d.style.display = "none");
                            const pill = document.getElementById("kyra_notif_badge_pill");
                            if (pill) pill.innerText = "0";
                            oPopover.close();
                        };
                    }

                    const footerBtn = document.getElementById("kyra_notif_view_all_footer");
                    if (footerBtn) {
                        footerBtn.onclick = () => {
                            oPopover.close();
                            this.onNavToAllNotificationsPage();
                        };
                    }

                    aTopNotifs.forEach((n, idx) => {
                        const el = document.getElementById("kyra_notif_item_" + idx);
                        if (el) {
                            el.onclick = () => {
                                n.unread = false;
                                const aList = oModel.getProperty("/notificationsList") || [];
                                sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aList));
                                this._loadNotifications(oModel);
                                oPopover.close();

                                const aHistory = oModel.getProperty("/requestHistory") || [];
                                const oReq = aHistory.find(r => r.requestId === n.requestId);
                                if (oReq) {
                                    this.onOpenPendingRequestDetails({
                                        getSource: () => ({
                                            getBindingContext: () => ({
                                                getObject: () => oReq
                                            })
                                        })
                                    });
                                } else {
                                    this.onNavToAllNotificationsPage();
                                }
                            };
                        }
                    });
                }, 100);
            });
        },

        onNavToAddAccess() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showAddAccessSector");
                oModel.setProperty("/showAddAccessSector", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showRemoveAccessSector", false);

                if (!bCurr) {
                    this._aSelectedRegionIds = [];
                    this._updatePinSelectionStates();
                    this._updateSelectedChips();
                    this._updateSelectAllButtonState();

                    oModel.setProperty("/selectedSector", "");
                    oModel.setProperty("/selectedFunction", "");
                    oModel.setProperty("/availableFunctions", []);
                    oModel.setProperty("/addAccessRegion", "");
                    oModel.setProperty("/mapSelectedRegions", []);
                    oModel.setProperty("/hasMapRegionSelection", false);
                    oModel.setProperty("/addAccessSelectedSystems", []);
                    oModel.setProperty("/addAccessSelectedServices", []);
                    oModel.setProperty("/addAccessSelectedRoles", []);
                    oModel.setProperty("/addAccessSelectedPersonas", []);
                    oModel.setProperty("/addAccessDuration", "");
                    oModel.setProperty("/addAccessJustification", "");
                    oModel.setProperty("/addAccessSystemSlideConfigs", {});
                    oModel.setProperty("/addAccessCurrentSystemIndex", 0);
                    oModel.setProperty("/addAccessStep", 1);
                    oModel.setProperty("/addAccessConfigSubStep", 1);
                    oModel.setProperty("/isEditingFromSummary", false);
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("addAccessSectionContainer");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            }
        },

        onInPageSectorChange(oEvent) {
            const sSector = oEvent.getSource().getSelectedKey();
            this.onSelectSectorTile(sSector);
        },

        onSelectSectorTile(sSectorKey) {
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

        onSelectFunctionChip(sFuncKey) {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/selectedFunction", sFuncKey);
            }
        },

        onGoToAddAccessStep1() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 1);
                this._scrollToWizardContainer();
            }
        },

        onGoToAddAccessStep2() {
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
            this._scrollToWizardContainer();

            setTimeout(() => {
                this._renderPins();
                this._attachSelectAllListener();
                this._updateSelectedChips();
            }, 100);
        },

        _scrollToWizardContainer() {
            setTimeout(() => {
                const oPage = this.byId("accessPortalPage");
                const oTarget = this.byId("addAccessSectionContainer");
                if (oPage && oTarget) {
                    oPage.scrollToElement(oTarget, 300);
                }
                const domTarget = document.getElementById(this.createId("addAccessSectionContainer"));
                if (domTarget) {
                    domTarget.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 60);
        },

        onGoToAddAccessStep3() {
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
            this._scrollToWizardContainer();
        },

        onInPageTargetSystemsSelectionChange(oEvent) {
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

        _loadCurrentSystemSlideConfig(sSysNameOverride) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sSys = sSysNameOverride || (aSystems.length > 0 ? aSystems[iIndex] : "Select Target System");

            oModel.setProperty("/currentSystemSlideName", sSys);

            let oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            let oSysConfig = oSlideConfigsMap[sSys];

            // Robust fallback: if slide config is not populated, extract from existing summary items
            if (!oSysConfig || !oSysConfig.selectedServices || oSysConfig.selectedServices.length === 0) {
                const aSummaryItems = oModel.getProperty("/addAccessSummaryItems") || [];
                const aMatching = aSummaryItems.filter(item => (item.system || "").trim().toLowerCase() === sSys.trim().toLowerCase());
                if (aMatching.length > 0) {
                    const aExtractedServices = [...new Set(aMatching.map(i => i.topic).filter(Boolean))];
                    const aExtractedRoles = [...new Set(aMatching.map(i => i.roleTitle || i.roleName).filter(Boolean))];
                    const aExtractedPersonas = [...new Set(aMatching.map(i => i.persona).filter(Boolean))];
                    oSysConfig = {
                        selectedServices: aExtractedServices,
                        selectedRoles: aExtractedRoles,
                        selectedPersonas: aExtractedPersonas
                    };
                    oSlideConfigsMap[sSys] = oSysConfig;
                    oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);
                } else {
                    oSysConfig = {
                        selectedServices: [],
                        selectedRoles: [],
                        selectedPersonas: []
                    };
                }
            }

            const aServices = (oSysConfig.selectedServices || []).slice();
            const aRoles = (oSysConfig.selectedRoles || []).slice();
            const aPersonas = (oSysConfig.selectedPersonas || []).slice();

            oModel.setProperty("/addAccessSelectedServices", aServices);
            oModel.setProperty("/addAccessSelectedRoles", aRoles);
            oModel.setProperty("/addAccessSelectedPersonas", aPersonas);

            // Populate dependent dropdown lists preserving selections
            this._updateSubRolesList(true);
            this._updatePersonasList(true);

            // Force MultiComboBox UI controls to reflect exact updated selectedKeys
            setTimeout(() => {
                try {
                    const oServicesSelect = this.byId("inPageServicesMultiSelect");
                    if (oServicesSelect) oServicesSelect.setSelectedKeys(aServices);

                    const oTeamSelect = this.byId("inPageTeamMultiSelect");
                    if (oTeamSelect) oTeamSelect.setSelectedKeys(aRoles);

                    const oPersonaSelect = this.byId("inPagePersonaMultiSelect");
                    if (oPersonaSelect) oPersonaSelect.setSelectedKeys(aPersonas);

                    this._applyMultiComboBoxRowClickSelection();
                } catch(e) {}
            }, 60);
        },

        _saveCurrentSystemSlideConfig(sSysNameOverride) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sSys = sSysNameOverride || aSystems[iIndex];
            if (!sSys) return;

            let oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            oSlideConfigsMap[sSys] = {
                selectedServices: oModel.getProperty("/addAccessSelectedServices") || [],
                selectedRoles: oModel.getProperty("/addAccessSelectedRoles") || [],
                selectedPersonas: oModel.getProperty("/addAccessSelectedPersonas") || []
            };

            oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);
        },

        onNextSystemSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aServices = oModel.getProperty("/addAccessSelectedServices") || [];
            const aRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            const aPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];

            if (aServices.length === 0) {
                MessageBox.error("Please select at least one Service topic for this system before proceeding.");
                return;
            }
            if (aRoles.length === 0) {
                MessageBox.error("Please select at least one Team Role for this system before proceeding.");
                return;
            }
            if (aPersonas.length === 0) {
                MessageBox.error("Please select at least one Persona for this system before proceeding.");
                return;
            }

            this._saveCurrentSystemSlideConfig();

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;

            if (iIndex + 1 < aSystems.length) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex + 1);
                this._loadCurrentSystemSlideConfig();
                this._scrollToWizardContainer();
            }
        },

        onPrevSystemSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            this._saveCurrentSystemSlideConfig();

            let iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex > 0) {
                oModel.setProperty("/addAccessCurrentSystemIndex", iIndex - 1);
                this._loadCurrentSystemSlideConfig();
                this._scrollToWizardContainer();
            }
        },

        onCompleteSystemSlides() {
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
            this._scrollToWizardContainer();
        },

        onStep3Slide1Previous() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex > 0) {
                this.onPrevSystemSlide();
            } else {
                this.onGoToAddAccessStep2();
            }
        },

        onStep3Slide1Continue() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            const bEditing = oModel.getProperty("/isEditingFromSummary");
            if (bEditing) {
                this.onSaveAndReturnToSummary();
                return;
            }
            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            if (iIndex + 1 < aSystems.length) {
                this.onNextSystemSlide();
            } else {
                this.onCompleteSystemSlides();
            }
        },

        onBackToSystemSlides() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessConfigSubStep", 1);
                this._scrollToWizardContainer();
            }
        },

        onInPageServicesSelectionChange(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            if (oModel) {
                oModel.setProperty("/addAccessSelectedServices", aSelectedKeys);
            }
            this._updateSubRolesList(false);
            this._updatePersonasList(false);
        },

        onInPageServicesSelectionFinish(oEvent) {
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessSelectedServices", aSelectedKeys);
            }
            this._updateSubRolesList(false);
            this._updatePersonasList(false);

            if (aSelectedKeys && aSelectedKeys.length > 0) {
                const oTeamSelect = this.byId("inPageTeamMultiSelect");
                if (oTeamSelect) {
                    const aCurrentRoles = oModel ? oModel.getProperty("/addAccessSelectedRoles") || [] : [];
                    if (aCurrentRoles.length === 0) {
                        setTimeout(() => {
                            if (typeof oTeamSelect.open === "function" && !oTeamSelect.isOpen()) {
                                oTeamSelect.open();
                            }
                        }, 250);
                    }
                }
            }
        },

        _updateSubRolesList(bPreserveSelections) {
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
                    { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)", icon: "sap-icon://activity-assigned-to-goal" },
                    { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)", icon: "sap-icon://user-settings" },
                    { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)", icon: "sap-icon://shield-check" },
                    { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)", icon: "sap-icon://shield" }
                ]
            };

            const aAllSubRoles = [
                ...oServicesRolesMap["System Administrator"],
                ...oServicesRolesMap["System Owners"],
                ...oServicesRolesMap["Stakeholders"]
            ];

            const aSelectedServices = oModel.getProperty("/addAccessSelectedServices") || [];

            if (!bPreserveSelections) {
                oModel.setProperty("/addAccessSelectedRoles", []);
                oModel.setProperty("/addAccessSelectedPersonas", []);
            }

            if (aSelectedServices.length === 0) {
                oModel.setProperty("/addAccessSubRolesList", aAllSubRoles);
                return;
            }

            let aCombinedRoles = [];
            aSelectedServices.forEach(sServiceKey => {
                if (oServicesRolesMap[sServiceKey]) {
                    aCombinedRoles = aCombinedRoles.concat(oServicesRolesMap[sServiceKey]);
                }
            });

            oModel.setProperty("/addAccessSubRolesList", aCombinedRoles);
        },

        onInPageTeamSelectionChange(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            if (oModel) {
                oModel.setProperty("/addAccessSelectedRoles", aSelectedKeys);
            }
            this._updatePersonasList(false);
        },

        onInPageTeamSelectionFinish(oEvent) {
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessSelectedRoles", aSelectedKeys);
            }
            this._updatePersonasList(false);

            if (aSelectedKeys && aSelectedKeys.length > 0) {
                const oPersonaSelect = this.byId("inPagePersonaMultiSelect");
                if (oPersonaSelect) {
                    const aCurrentPersonas = oModel ? oModel.getProperty("/addAccessSelectedPersonas") || [] : [];
                    if (aCurrentPersonas.length === 0) {
                        setTimeout(() => {
                            if (typeof oPersonaSelect.open === "function" && !oPersonaSelect.isOpen()) {
                                oPersonaSelect.open();
                            }
                        }, 250);
                    }
                }
            }
        },

        onInPagePersonaSelectionChange(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            if (oModel) {
                oModel.setProperty("/addAccessSelectedPersonas", aSelectedKeys);
            }
        },

        _updatePersonasList(bPreserveSelections) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            if (!bPreserveSelections) {
                oModel.setProperty("/addAccessSelectedPersonas", []);
            }

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

            let aAllPersonas = [];
            Object.values(oTeamPersonasMap).forEach(arr => {
                aAllPersonas = aAllPersonas.concat(arr);
            });

            const aSelectedRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            
            if (aSelectedRoles.length === 0) {
                oModel.setProperty("/addAccessPersonasList", aAllPersonas);
                return;
            }

            let aCombinedPersonas = [];
            aSelectedRoles.forEach(sRoleKey => {
                if (oTeamPersonasMap[sRoleKey]) {
                    aCombinedPersonas = aCombinedPersonas.concat(oTeamPersonasMap[sRoleKey]);
                }
            });

            oModel.setProperty("/addAccessPersonasList", aCombinedPersonas);
        },

        onGoToAddAccessStep4() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            // Ensure current active slide is saved to slide configs map
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
                MessageBox.error("Please select at least one Target System before proceeding to Review.");
                return;
            }
            if (!sDuration || sDuration.trim() === "") {
                MessageBox.error("Please select Access Duration before proceeding.");
                return;
            }
            if (!sJustification) {
                MessageBox.error("Please enter Business Justification before proceeding.");
                return;
            }

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");
            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};

            // Collect all existing Request IDs from model to prevent duplicate ID generation
            const aHistory = oModel.getProperty("/requestHistory") || [];
            const aMyPending = oModel.getProperty("/myPendingRequests") || [];
            const aActiveRoles = oModel.getProperty("/activeRoles") || [];
            const aPending = oModel.getProperty("/pendingRequests") || [];
            const aProcessed = oModel.getProperty("/processedRequests") || [];
            
            const aExistingRequestIds = [
                ...aHistory.map(r => r.requestId),
                ...aMyPending.map(r => r.requestId),
                ...aPending.map(r => r.requestId),
                ...aProcessed.map(r => r.requestId)
            ].filter(Boolean);

            const generateUniqueId = () => {
                let sId;
                let bFound = true;
                let iSafety = 0;
                while (bFound && iSafety < 50) {
                    sId = "REQ-2026-" + Math.floor(100000 + Math.random() * 900000);
                    bFound = aExistingRequestIds.includes(sId);
                    iSafety++;
                }
                aExistingRequestIds.push(sId);
                return sId;
            };

            // Build map of existing summary items to retain Request IDs when editing
            const oExistingItemsMap = {};
            (oModel.getProperty("/addAccessSummaryItems") || []).forEach(item => {
                const sKeyWithPers = `${item.system}:::${item.roleName}:::${item.persona}`;
                const sKeyNoPers = `${item.system}:::${item.roleName}`;
                if (!oExistingItemsMap[sKeyWithPers]) {
                    oExistingItemsMap[sKeyWithPers] = item;
                }
                if (!oExistingItemsMap[sKeyNoPers]) {
                    oExistingItemsMap[sKeyNoPers] = item;
                }
            });

            const oRoleToPersonas = {
                "IT Developers (System Administrator)": [
                    "Frontend & UI Developer Persona (IT Developers)",
                    "Backend & Systems Developer Persona (IT Developers)"
                ],
                "IT Administrators (System Administrator)": [
                    "Cloud Infrastructure Administrator Persona (IT Administrators)",
                    "Database & IAM Administrator Persona (IT Administrators)"
                ],
                "Lead Engineer (System Administrator)": [
                    "Principal Systems Engineer Persona (Lead Engineer)",
                    "DevOps & Platform Lead Persona (Lead Engineer)"
                ],
                "IT Security (System Administrator)": [
                    "Security Audit & GRC Persona (IT Security)",
                    "Cybersecurity Operations Persona (IT Security)"
                ],
                "Technical Product Owner (System Owner)": [
                    "Technical Product Manager Persona (Technical Product Owner)",
                    "Solution Architecture Owner Persona (Technical Product Owner)"
                ],
                "Product Group Engineer (System Owner)": [
                    "Product Suite Engineer Persona (Product Group Engineer)",
                    "Integration Engineering Lead Persona (Product Group Engineer)"
                ],
                "Business Product Owner (Stakeholders)": [
                    "Business Strategy Lead Persona (Business Product Owner)",
                    "Enterprise Process Owner Persona (Business Product Owner)"
                ],
                "Line Manager (Stakeholders)": [
                    "Department Resource Manager Persona (Line Manager)",
                    "People Operations Lead Persona (Line Manager)"
                ],
                "Compliance Manager (Stakeholders)": [
                    "Regulatory Compliance Officer Persona (Compliance Manager)",
                    "Data Privacy Auditor Persona (Compliance Manager)"
                ],
                "Role Owner (Stakeholders)": [
                    "Entitlement & Role Custodian Persona (Role Owner)",
                    "Access Governance Approver Persona (Role Owner)"
                ],
                "ISRM (Stakeholders)": [
                    "Information Security Risk Manager Persona (ISRM)",
                    "Risk & Assessment Analyst Persona (ISRM)"
                ],
                "IAM / GRC Team (Stakeholders)": [
                    "Identity Management Specialist Persona (IAM / GRC Team)",
                    "Governance Risk Compliance Lead Persona (IAM / GRC Team)"
                ]
            };

            const findParentRoleForPersona = (sPersonaKey, aAvailableRoles) => {
                for (const [sRole, aPersonas] of Object.entries(oRoleToPersonas)) {
                    if (aPersonas.includes(sPersonaKey)) {
                        if (aAvailableRoles.includes(sRole)) return sRole;
                        return sRole;
                    }
                }
                const m = sPersonaKey.match(/\((.*?)\)/);
                if (m && m[1]) {
                    const sTag = m[1].trim();
                    const found = aAvailableRoles.find(r => r.includes(sTag));
                    if (found) return found;
                }
                return aAvailableRoles[0] || "IT Developers (System Administrator)";
            };

            let aSummaryItems = [];
            let aSummaryTables = [];

            const oSystemIconsMap = {
                "SAP BTP Cloud Platform": "sap-icon://cloud",
                "SAP S/4HANA Enterprise": "sap-icon://database",
                "KYRA Central Governance": "sap-icon://shield",
                "Active Directory / IAM": "sap-icon://user-settings",
                "SAP SuccessFactors": "sap-icon://group",
                "SAP Ariba Supply Network": "sap-icon://shipping-status"
            };

            const cleanPersonaName = (s) => {
                if (!s) return "";
                let str = String(s).trim();
                str = str.replace(/\s*\([^)]*\)\s*$/g, "").trim();
                return str || s;
            };

            const aUsedReqIdsInBatch = new Set();

            aSystems.forEach((sSys) => {
                const oSysConfig = oSlideConfigsMap[sSys] || {
                    selectedServices: oModel.getProperty("/addAccessSelectedServices") || [],
                    selectedRoles: oModel.getProperty("/addAccessSelectedRoles") || [],
                    selectedPersonas: oModel.getProperty("/addAccessSelectedPersonas") || []
                };
                const aSysServices = oSysConfig.selectedServices || [];
                const aSysRoles = oSysConfig.selectedRoles || [];
                const aSysPersonas = oSysConfig.selectedPersonas || [];

                // Exclude systems/processes that have NO selected Persona
                if (!aSysPersonas || aSysPersonas.length === 0) {
                    return;
                }

                let aSysItems = [];
                const oAddedKeys = new Set();

                const processItem = (sRole, sPers) => {
                    if (!sPers || sPers.trim() === "") return;

                    const sCleanPers = cleanPersonaName(sPers);
                    const sItemKey = `${sSys}:::${sRole}:::${sPers}`;
                    if (oAddedKeys.has(sItemKey)) return;
                    oAddedKeys.add(sItemKey);

                    let sRoleTitle = sRole;
                    let sTopic = "System Administrator";
                    const match = sRole.match(/^(.*?)\s*\((.*?)\)$/);
                    if (match) {
                        sRoleTitle = match[1].trim();
                        sTopic = match[2].trim();
                    } else if (aSysServices.length > 0) {
                        sTopic = aSysServices[0];
                    }

                    // Assign a truly unique Request ID for each item row
                    const oExisting = oExistingItemsMap[sItemKey] || oExistingItemsMap[`${sSys}:::${sRole}`];
                    const sUniqueReqId = (oExisting && oExisting.requestId && !aUsedReqIdsInBatch.has(oExisting.requestId))
                        ? oExisting.requestId
                        : generateUniqueId();
                    aUsedReqIdsInBatch.add(sUniqueReqId);

                    const oItem = {
                        _itemUniqueId: "ITEM_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
                        requestId: sUniqueReqId,
                        system: sSys,
                        roleName: sRole,
                        roleTitle: sRoleTitle,
                        topic: sTopic,
                        persona: sCleanPers,
                        selectedPersona: sCleanPers,
                        sector: sSector && sFunction ? (sSector + " | " + sFunction) : (sSector || sFunction || ""),
                        region: sRegion || "",
                        duration: sDuration || "Permanent (Default)",
                        existingStatus: "New Request",
                        existingState: "Success",
                        existingIcon: "sap-icon://sys-enter-2",
                        statusType: "new"
                    };

                    // Standard matching helper for System + Persona + Role granularity
                    const cleanStr = (s) => String(s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
                    const isSameSys = (sysA, sysB) => String(sysA || "").trim().toLowerCase() === String(sysB || "").trim().toLowerCase();
                    const isMatch = (itemA, itemB) => {
                        const sA = itemA.system || itemA.target_system || itemA.targetSystem || "";
                        const sB = itemB.system || itemB.target_system || itemB.targetSystem || "";
                        if (!isSameSys(sA, sB)) return false;

                        const persA = cleanStr(itemA.persona || itemA.selected_persona || itemA.selectedPersona || "");
                        const persB = cleanStr(itemB.persona || itemB.selected_persona || itemB.selectedPersona || "");
                        const roleA = cleanStr(itemA.roleName || itemA.role_name || itemA.roleTitle || "");
                        const roleB = cleanStr(itemB.roleName || itemB.role_name || itemB.roleTitle || "");

                        if (persA && persB) {
                            if (persA === persB) return true;
                            const pA = persA.replace(/persona/g, "").trim();
                            const pB = persB.replace(/persona/g, "").trim();
                            if (pA && pB && (pA === pB || pA.includes(pB) || pB.includes(pA))) return true;
                            return false;
                        }
                        if (roleA && roleB) {
                            return roleA === roleB || roleA.includes(roleB) || roleB.includes(roleA);
                        }
                        return false;
                    };

                    // Check 1: Duplicate within current request cart
                    const bBatchDup = aSummaryItems.some(prev => isMatch(prev, oItem));

                    // Check 2: Active Assigned Access in user's profile
                    const aActiveList = oModel.getProperty("/userAccessList") || oModel.getProperty("/activeRoles") || [];
                    const bAlreadyActive = aActiveList.some(ar => {
                        const sStat = (ar.status || "").toLowerCase();
                        const isActive = sStat.includes("active") || sStat.includes("approved") || sStat === "success";
                        return isActive && isMatch(ar, oItem);
                    });

                    // Check 3: Pending request in approval queue
                    const aPendingList = oModel.getProperty("/myPendingRequests") || oModel.getProperty("/pendingAccessRequests") || [];
                    const bAlreadyPending = aPendingList.some(pr => {
                        const sStat = (pr.status || "").toLowerCase();
                        const isPending = sStat.includes("pending") || sStat.includes("submitted");
                        if (!isPending) return false;
                        if (isMatch(pr, oItem)) return true;
                        if (Array.isArray(pr.entitlements)) {
                            return pr.entitlements.some(e => isMatch(e, oItem));
                        }
                        return false;
                    });

                    if (bBatchDup) {
                        oItem.existingStatus = "Duplicate in Request";
                        oItem.existingState = "Warning";
                        oItem.existingIcon = "sap-icon://alert";
                        oItem.statusType = "duplicate";
                    } else if (bAlreadyActive) {
                        oItem.existingStatus = "Already Active";
                        oItem.existingState = "Information";
                        oItem.existingIcon = "sap-icon://message-information";
                        oItem.statusType = "existing";
                    } else if (bAlreadyPending) {
                        oItem.existingStatus = "Already in Pending";
                        oItem.existingState = "Warning";
                        oItem.existingIcon = "sap-icon://alert";
                        oItem.statusType = "pending";
                    }

                    aSummaryItems.push(oItem);
                    aSysItems.push(oItem);
                };

                aSysPersonas.forEach(sPers => {
                    const sParentRole = findParentRoleForPersona(sPers, aSysRoles);
                    processItem(sParentRole, sPers);
                });

                if (aSysItems.length > 0) {
                    aSummaryTables.push({
                        systemIndex: aSummaryTables.length + 1,
                        systemName: sSys,
                        systemIcon: oSystemIconsMap[sSys] || "sap-icon://cloud",
                        items: aSysItems
                    });
                }
            });

            if (aSummaryItems.length === 0) {
                MessageBox.error("No valid entitlements configured. Please select at least one Persona for your target system process before proceeding to Validation.");
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 1);
                this._scrollToWizardContainer();
                return;
            }

            const sActiveUser = oModel.getProperty("/activeUser") || "Dev001";
            const sSelectedSector = oModel.getProperty("/selectedSector") || "Finance & Enterprise Performance";
            const sSelectedFunction = oModel.getProperty("/selectedFunction") || "Financial Planning & Analysis";

            // Build dynamic Restricted Records matching exact 8-column specification
            const aRestrictedRecords = aSummaryItems.map((item, idx) => {
                const sSys = item.system || "SAP S/4HANA Enterprise";
                const sSector = sSelectedSector || item.sector || "Finance & Enterprise Performance";
                const sFunction = sSelectedFunction || "Financial Planning & Analysis";
                const sPersona = cleanPersonaName(item.persona || "Database & IAM Administrator Persona");
                const sRoleTitle = cleanPersonaName(item.roleTitle || item.roleName || "IT Administrators");
                
                let sSecGroup = "SEC-PRIVILEGED-ACCESS";
                let sAdGroup = "AD-KYRA-PRIVILEGED-GRP";
                if (sSys.includes("BTP")) {
                    sSecGroup = "SEC-BTP-ADMIN-ACCESS";
                    sAdGroup = "AD-KYRA-BTP-ENG-GRP";
                } else if (sSys.includes("Ariba")) {
                    sSecGroup = "SEC-ARIBA-PROCURE-ACCESS";
                    sAdGroup = "AD-KYRA-ARIBA-GRP";
                } else if (sSys.includes("SuccessFactors")) {
                    sSecGroup = "SEC-SF-HR-ACCESS";
                    sAdGroup = "AD-KYRA-SF-GRP";
                }

                return {
                    id: "RR-" + (idx + 1),
                    system: sSys,
                    name: sActiveUser,
                    roleTitle: sRoleTitle,
                    sector: sSector,
                    businessFunction: sFunction,
                    persona: sPersona,
                    securityGroup: sSecGroup,
                    adGroupName: sAdGroup
                };
            });

            oModel.setProperty("/addAccessSummaryItems", aSummaryItems);
            oModel.setProperty("/addAccessSummaryTables", aSummaryTables);
            oModel.setProperty("/restrictedRecords", aRestrictedRecords);

            // Execute comprehensive dynamic SoD Conflict evaluation
            this._evaluateSodConflicts(aSummaryItems);

            // Execute dynamic Threshold Limits and Duplicate Roles evaluation
            this._evaluateThresholdAndDuplicates(aSummaryItems);

            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
            this._scrollToWizardContainer();
        },

        _recalculateRestrictedRecords(aSummaryItems) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel || !aSummaryItems) return;

            const sActiveUser = oModel.getProperty("/activeUser") || "Stake001";
            const sSelectedSector = oModel.getProperty("/selectedSector") || "Finance & Enterprise Performance";
            const sSelectedFunction = oModel.getProperty("/selectedFunction") || "Financial Planning & Analysis";

            const cleanPersonaName = (s) => {
                if (!s) return "";
                let str = String(s).trim();
                str = str.replace(/\s*\([^)]*\)\s*$/g, "").trim();
                return str || s;
            };

            const aRestrictedRecords = aSummaryItems.map((item, idx) => {
                const sSys = item.system || "SAP S/4HANA Enterprise";
                const sSector = sSelectedSector || item.sector || "Finance & Enterprise Performance";
                const sFunction = sSelectedFunction || "Financial Planning & Analysis";
                const sPersona = cleanPersonaName(item.persona || "Database & IAM Administrator Persona");
                const sRoleTitle = cleanPersonaName(item.roleTitle || item.roleName || "IT Administrators");
                
                let sSecGroup = "SEC-PRIVILEGED-ACCESS";
                let sAdGroup = "AD-KYRA-PRIVILEGED-GRP";
                if (sSys.includes("BTP")) {
                    sSecGroup = "SEC-BTP-ADMIN-ACCESS";
                    sAdGroup = "AD-KYRA-BTP-ENG-GRP";
                } else if (sSys.includes("Ariba")) {
                    sSecGroup = "SEC-ARIBA-PROCURE-ACCESS";
                    sAdGroup = "AD-KYRA-ARIBA-GRP";
                } else if (sSys.includes("SuccessFactors")) {
                    sSecGroup = "SEC-SF-HR-ACCESS";
                    sAdGroup = "AD-KYRA-SF-GRP";
                }

                return {
                    id: "RR-" + (idx + 1),
                    system: sSys,
                    name: sActiveUser,
                    roleTitle: sRoleTitle,
                    sector: sSector,
                    businessFunction: sFunction,
                    persona: sPersona,
                    securityGroup: sSecGroup,
                    adGroupName: sAdGroup
                };
            });

            oModel.setProperty("/restrictedRecords", aRestrictedRecords);
        },

        _evaluateThresholdAndDuplicates(aSummaryItems) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel || !aSummaryItems) return;

            const aActiveAccess = (oModel.getProperty("/userAccessList") || oModel.getProperty("/activeRoles") || [])
                .filter(acc => {
                    const sStatus = (acc.status || "").toLowerCase();
                    return sStatus.includes("active") || sStatus.includes("approved") || sStatus === "success";
                });

            const aPendingRequests = (oModel.getProperty("/myPendingRequests") || oModel.getProperty("/pendingAccessRequests") || [])
                .filter(p => {
                    const sStatus = (p.status || "").toLowerCase();
                    const isRevoke = p.type === "Revocation" || p.isRevocation === true;
                    return (sStatus.includes("pending") || sStatus.includes("submitted")) && !isRevoke;
                });

            const cleanStr = (s) => String(s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
            const isSameSys = (sysA, sysB) => String(sysA || "").trim().toLowerCase() === String(sysB || "").trim().toLowerCase();
            
            const getEntitlementKey = (sys, role, persona) => {
                const sSys = cleanStr(sys);
                const sRole = cleanStr(role);
                const sPers = cleanStr(persona).replace(/persona/g, "").trim();
                return `${sSys}:::${sRole}:::${sPers || sRole}`;
            };

            const isMatch = (itemA, itemB) => {
                const sA = itemA.system || itemA.target_system || itemA.targetSystem || "";
                const sB = itemB.system || itemB.target_system || itemB.targetSystem || "";
                if (!isSameSys(sA, sB)) return false;

                const persA = cleanStr(itemA.persona || itemA.selected_persona || itemA.selectedPersona || "");
                const persB = cleanStr(itemB.persona || itemB.selected_persona || itemB.selectedPersona || "");
                const roleA = cleanStr(itemA.roleName || itemA.role_name || itemA.roleTitle || "");
                const roleB = cleanStr(itemB.roleName || itemB.role_name || itemB.roleTitle || "");

                if (persA && persB) {
                    if (persA === persB) return true;
                    const pA = persA.replace(/persona/g, "").trim();
                    const pB = persB.replace(/persona/g, "").trim();
                    if (pA && pB && (pA === pB || pA.includes(pB) || pB.includes(pA))) return true;
                    return false;
                }
                if (roleA && roleB) {
                    return roleA === roleB || roleA.includes(roleB) || roleB.includes(roleA);
                }
                return false;
            };

            const aThresholdLimits = [];
            const aDuplicateRoles = [];
            const oSystemSector = {};
            const aSeenItemsInBatch = [];
            const oSystemUniqueSets = {};

            // 1. Process items in the current summary cart
            aSummaryItems.forEach((item) => {
                const sSys = item.system || "SAP S/4HANA Enterprise";
                const sRole = item.roleTitle || item.roleName || "Requested Role";
                const sTopic = item.topic || item.sector || "Core Access Module";
                const sSector = item.sector || "Enterprise Access";
                const sPersona = item.persona || item.selectedPersona || sRole;

                if (!oSystemSector[sSys]) {
                    oSystemSector[sSys] = sSector;
                }
                if (!oSystemUniqueSets[sSys]) {
                    oSystemUniqueSets[sSys] = new Set();
                }

                // Check 1: Batch Duplication (within current request cart)
                const bBatchDup = aSeenItemsInBatch.some(prev => isMatch(prev, item));
                if (bBatchDup) {
                    aDuplicateRoles.push({
                        system: sSys,
                        functionalRole: sRole,
                        moduleName: sTopic,
                        selectedSecurityGroups: "SG_" + sRole.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "_DUP",
                        teamName: item.team || sTopic || "Identity Governance",
                        adGroupName: "AD_GRP_" + sSys.toUpperCase().replace(/[^A-Z0-9]/g, "_"),
                        existingRoles: "Duplicate in Current Request Cart"
                    });
                }
                aSeenItemsInBatch.push(item);

                // Check 2: Active Assigned Access in My Access Section (already active)
                const bFoundInActive = aActiveAccess.some(ar => isMatch(ar, item));
                if (bFoundInActive && !bBatchDup) {
                    aDuplicateRoles.push({
                        system: sSys,
                        functionalRole: sRole,
                        moduleName: sTopic,
                        selectedSecurityGroups: "SEC-" + sSys.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "-GRP",
                        teamName: item.team || sTopic || "System Administrator",
                        adGroupName: "AD-KYRA-" + sSys.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "-GRP",
                        existingRoles: "already active",
                        statusState: "Information"
                    });
                }

                // Check 3: Pending Access Requests Section (already requested)
                const bFoundInPending = aPendingRequests.some(pr => {
                    if (isMatch(pr, item)) return true;
                    if (Array.isArray(pr.entitlements)) {
                        return pr.entitlements.some(e => isMatch(e, item));
                    }
                    return false;
                });
                if (bFoundInPending && !bBatchDup && !bFoundInActive) {
                    aDuplicateRoles.push({
                        system: sSys,
                        functionalRole: sRole,
                        moduleName: sTopic,
                        selectedSecurityGroups: "SEC-" + sSys.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "-GRP",
                        teamName: item.team || sTopic || "System Administrator",
                        adGroupName: "AD-KYRA-" + sSys.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "-GRP",
                        existingRoles: "already requested",
                        statusState: "Warning"
                    });
                }

                // Add newly selected item to unique system entitlement set (automatically deduplicates within cart)
                oSystemUniqueSets[sSys].add(getEntitlementKey(sSys, sRole, sPersona));
            });

            // 2. Add Active and Pending unique entitlements for each target system being requested
            Object.keys(oSystemUniqueSets).forEach(sSys => {
                const uniqueSet = oSystemUniqueSets[sSys];

                // Add distinct active accesses for this system
                aActiveAccess.forEach(acc => {
                    const sysAcc = acc.system || acc.target_system || acc.targetSystem || "";
                    if (isSameSys(sysAcc, sSys)) {
                        const sRole = acc.roleName || acc.role_name || acc.roleTitle || "";
                        const sPers = acc.persona || acc.selected_persona || sRole;
                        uniqueSet.add(getEntitlementKey(sSys, sRole, sPers));
                    }
                });

                // Add distinct pending requests for this system
                aPendingRequests.forEach(p => {
                    if (Array.isArray(p.entitlements) && p.entitlements.length > 0) {
                        p.entitlements.forEach(e => {
                            const sysE = e.system || e.target_system || e.targetSystem || "";
                            if (isSameSys(sysE, sSys)) {
                                const sRole = e.roleName || e.role_name || e.roleTitle || "";
                                const sPers = e.persona || e.selected_persona || e.selectedPersona || sRole;
                                uniqueSet.add(getEntitlementKey(sSys, sRole, sPers));
                            }
                        });
                    } else {
                        const sysP = p.system || p.target_system || p.targetSystem || "";
                        if (isSameSys(sysP, sSys)) {
                            const sRole = p.roleName || p.role_name || p.roleTitle || "";
                            const sPers = p.persona || p.selected_persona || p.selectedPersona || sRole;
                            uniqueSet.add(getEntitlementKey(sSys, sRole, sPers));
                        }
                    }
                });

                // Distinct total count across (Newly Selected + Active Access + Pending Requests)
                const iTotalUniqueCount = uniqueSet.size;

                if (iTotalUniqueCount > 5) {
                    const iPct = Math.round((iTotalUniqueCount / 5) * 100);
                    aThresholdLimits.push({
                        system: sSys,
                        sector: oSystemSector[sSys] || "Enterprise Access",
                        thresholdLimit: "5",
                        actualCount: iTotalUniqueCount,
                        limit: iTotalUniqueCount + "/5",
                        excessivePercentage: iPct + "%",
                        status: "Excessive",
                        state: "Warning",
                        statusState: "Warning"
                    });
                }
            });

            // Set evaluated threshold limits and duplicate roles
            oModel.setProperty("/thresholdLimits", aThresholdLimits);
            oModel.setProperty("/duplicateRoles", aDuplicateRoles);
        },

        _loadBackendSoDMatrix() {
            const oModel = this.getView().getModel("accessModel");
            fetch("/odata/v4/admin-portal/SoDMatrix")
                .then(res => res.json())
                .then(data => {
                    if (data && data.value && oModel) {
                        const aRules = data.value.map(r => ({
                            role1: r.roleA || r.role_a || r.role1,
                            role2: r.roleB || r.role_b || r.role2,
                            description: r.conflictReason || r.conflict_reason || r.description || "Segregation of Duties conflict."
                        }));
                        oModel.setProperty("/sodMatrix", aRules);
                    }
                })
                .catch(err => {
                    console.warn("SoDMatrix backend query skipped or unavailable:", err);
                });
        },

        _evaluateSodConflicts(aSummaryItems) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel || !aSummaryItems) return;

            const aUserActiveRoles = oModel.getProperty("/activeRoles") || oModel.getProperty("/userAccessList") || [];
            const aUserPendingRequests = oModel.getProperty("/myPendingRequests") || [];
            
            const aSodRules = oModel.getProperty("/sodMatrix") || [
                { role1: "IT Admin", role2: "IT Developer", description: "Segregation of Duties conflict between Developer and Admin privileges." },
                { role1: "IT Admin", role2: "IT Security", description: "System Administrator conflicts with Security Governance." },
                { role1: "IT Admin", role2: "Compliance Manager", description: "System Administrator conflicts with Compliance Manager oversight." },
                { role1: "IT Security", role2: "IT Developer", description: "Developer access conflicts with IT Security audit authority." },
                { role1: "Lead Engineer", role2: "IT Admin", description: "Lead Engineer conflicts with IT Administrators elevated system access." },
                { role1: "Security", role2: "Compliance Manager", description: "Compliance Manager conflicts with Security Operational access." },
                { role1: "Security Audit", role2: "IT Developer", description: "Security Audit oversight conflicts with Developer operational access." },
                { role1: "System Administrator", role2: "Security Audit", description: "System Administrator conflicts with Security Audit role." }
            ];

            const isSameSystem = (sysA, sysB) => {
                if (!sysA || !sysB) return false;
                const sA = String(sysA).trim().toLowerCase();
                const sB = String(sysB).trim().toLowerCase();
                return sA === sB;
            };

            const cleanPersonaName = (s) => {
                if (!s) return "";
                let str = String(s).trim();
                str = str.replace(/\s*\([^)]*\)\s*$/g, "").trim();
                return str || s;
            };

            const cleanStr = (s) => String(s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();

            // Check if two items represent the same access
            const isSameAccess = (itemA, itemB) => {
                const sA = itemA.system || itemA.target_system || itemA.targetSystem || "";
                const sB = itemB.system || itemB.target_system || itemB.targetSystem || "";
                if (!isSameSystem(sA, sB)) return false;

                const persA = cleanStr(itemA.persona || itemA.selected_persona || itemA.selectedPersona || "");
                const persB = cleanStr(itemB.persona || itemB.selected_persona || itemB.selectedPersona || "");
                const roleA = cleanStr(itemA.roleName || itemA.role_name || itemA.roleTitle || "");
                const roleB = cleanStr(itemB.roleName || itemB.role_name || itemB.roleTitle || "");

                if (persA && persB) {
                    if (persA === persB) return true;
                    const pA = persA.replace(/persona/g, "").trim();
                    const pB = persB.replace(/persona/g, "").trim();
                    if (pA && pB && (pA === pB || pA.includes(pB) || pB.includes(pA))) return true;
                    return false;
                }
                if (roleA && roleB) {
                    return roleA === roleB || roleA.includes(roleB) || roleB.includes(roleA);
                }
                return false;
            };

            // Derive functional archetype category (developer, admin, security, engineer, compliance, owner, manager)
            // Strips out category tags like "(System Administrator)" so developer roles are not confused with admin
            const getFunctionalArchetype = (roleStr, personaStr) => {
                const cleanR = String(roleStr || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
                const cleanP = String(personaStr || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();

                if (cleanR.includes("developer") || cleanP.includes("developer")) return "developer";
                if (cleanR.includes("administrator") || cleanR.includes("it admin") || cleanP.includes("cloud infrastructure") || cleanP.includes("database & iam")) return "admin";
                if (cleanR.includes("security") || cleanP.includes("security") || cleanP.includes("cybersecurity") || cleanR.includes("isrm") || cleanP.includes("isrm")) return "security";
                if (cleanR.includes("lead engineer") || cleanP.includes("principal systems") || cleanP.includes("devops & platform")) return "engineer";
                if (cleanR.includes("compliance") || cleanP.includes("compliance") || cleanP.includes("auditor") || cleanP.includes("privacy")) return "compliance";
                if (cleanR.includes("product owner") || cleanP.includes("solution architecture") || cleanP.includes("product manager")) return "owner";
                if (cleanR.includes("product group engineer") || cleanP.includes("integration engineering") || cleanP.includes("product suite")) return "product_group";
                if (cleanR.includes("line manager") || cleanP.includes("people operations") || cleanP.includes("resource manager")) return "manager";
                if (cleanR.includes("role owner") || cleanP.includes("role custodian")) return "role_owner";
                return cleanR;
            };

            const getRuleArchetype = (ruleStr) => {
                const s = String(ruleStr || "").toLowerCase().trim();
                if (s.includes("developer") || s.includes("dev")) return "developer";
                if (s.includes("admin") || s.includes("system administrator")) return "admin";
                if (s.includes("security") || s.includes("audit") || s.includes("isrm")) return "security";
                if (s.includes("engineer")) return "engineer";
                if (s.includes("compliance")) return "compliance";
                if (s.includes("owner")) return "owner";
                if (s.includes("manager")) return "manager";
                return s;
            };

            const checkConflictMatch = (roleA, personaA, roleB, personaB, rule) => {
                const archA = getFunctionalArchetype(roleA, personaA);
                const archB = getFunctionalArchetype(roleB, personaB);

                // Two roles of the SAME archetype (e.g. developer vs developer) DO NOT conflict with each other!
                if (archA === archB) return false;

                const r1 = getRuleArchetype(rule.role1 || rule.role_a || rule.roleA);
                const r2 = getRuleArchetype(rule.role2 || rule.role_b || rule.roleB);

                return (archA === r1 && archB === r2) || (archA === r2 && archB === r1);
            };

            const aActiveConflicts = [];
            const aPendingConflicts = [];
            const aBatchConflicts = [];
            const oSeenActiveKeys = new Set();
            const oSeenPendingKeys = new Set();
            const oSeenBatchKeys = new Set();

            aSummaryItems.forEach(newItem => {
                const sNewSys = newItem.system || "";
                const sNewRoleName = newItem.roleName || newItem.roleTitle || newItem.persona || "Requested Role";
                const sNewPersona = newItem.persona || newItem.selectedPersona || newItem.selected_persona || sNewRoleName;

                // 1. Check conflicts against Active Database Entitlements (ONLY for the EXACT SAME system)
                aUserActiveRoles.forEach(activeRole => {
                    const sActiveSys = activeRole.target_system || activeRole.system || "";
                    if (!isSameSystem(sActiveSys, sNewSys)) return; // Strictly ignore different systems!

                    // A role/persona CANNOT have an SoD conflict with itself or with the exact same access!
                    if (isSameAccess(activeRole, newItem)) return;

                    const sActiveRoleName = activeRole.role_name || activeRole.roleName || activeRole.roleTitle || activeRole.persona || "Active Role";
                    const sActivePersona = activeRole.selected_persona || activeRole.persona || activeRole.selectedPersona || sActiveRoleName;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between active entitlement and newly requested access.";

                        if (checkConflictMatch(sNewRoleName, sNewPersona, sActiveRoleName, sActivePersona, rule)) {
                            const sKey = `${sActiveSys}:::${sActiveRoleName}:::${sNewSys}:::${sNewRoleName}`;
                            if (!oSeenActiveKeys.has(sKey)) {
                                oSeenActiveKeys.add(sKey);
                                aActiveConflicts.push({
                                    system: sNewSys,
                                    existingRole: `${sActiveSys} — ${cleanPersonaName(sActiveRoleName)}`,
                                    existingPersona: cleanPersonaName(sActivePersona),
                                    newRole: `${sNewSys} — ${cleanPersonaName(sNewRoleName)}`,
                                    newPersona: cleanPersonaName(sNewPersona),
                                    conflictTitle: "Segregation of Duties (SoD) Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                        }
                    });
                });

                // 2. Check conflicts against Pending In-Flight Requests (ONLY for the EXACT SAME system)
                aUserPendingRequests.forEach(pendingReq => {
                    const sPendingSys = pendingReq.targetSystem || pendingReq.system || pendingReq.target_system || "";
                    if (!isSameSystem(sPendingSys, sNewSys)) return; // Strictly ignore different systems!

                    // A role/persona CANNOT have an SoD conflict with itself or with the exact same access!
                    if (isSameAccess(pendingReq, newItem)) return;

                    const sPendingRoleName = pendingReq.roleName || pendingReq.roleTitle || pendingReq.persona || "Pending Role";
                    const sPendingPersona = pendingReq.selected_persona || pendingReq.persona || pendingReq.selectedPersona || sPendingRoleName;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between pending request and newly requested access.";

                        if (checkConflictMatch(sNewRoleName, sNewPersona, sPendingRoleName, sPendingPersona, rule)) {
                            const sKey = `${sPendingSys}:::${sPendingRoleName}:::${sNewSys}:::${sNewRoleName}`;
                            if (!oSeenPendingKeys.has(sKey)) {
                                oSeenPendingKeys.add(sKey);
                                aPendingConflicts.push({
                                    system: sNewSys,
                                    existingRole: `${sPendingSys} — ${cleanPersonaName(sPendingRoleName)}`,
                                    existingPersona: cleanPersonaName(sPendingPersona),
                                    newRole: `${sNewSys} — ${cleanPersonaName(sNewRoleName)}`,
                                    newPersona: cleanPersonaName(sNewPersona),
                                    conflictTitle: "Segregation of Duties (SoD) Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                        }
                    });
                });
            });

            // 3. Check batch intra-role conflicts (between newly selected roles in current request cart - ONLY for the EXACT SAME system)
            for (let i = 0; i < aSummaryItems.length; i++) {
                for (let j = i + 1; j < aSummaryItems.length; j++) {
                    const itemA = aSummaryItems[i];
                    const itemB = aSummaryItems[j];
                    const sSysA = itemA.system || "";
                    const sSysB = itemB.system || "";

                    if (!isSameSystem(sSysA, sSysB)) continue; // Strictly ignore different systems!

                    // Same access or same parent archetype does not have an SoD conflict
                    if (isSameAccess(itemA, itemB)) continue;

                    const sRoleA = itemA.roleName || itemA.roleTitle || itemA.persona || "Role A";
                    const sPersonaA = itemA.persona || itemA.selectedPersona || itemA.selected_persona || sRoleA;
                    const sRoleB = itemB.roleName || itemB.roleTitle || itemB.persona || "Role B";
                    const sPersonaB = itemB.persona || itemB.selectedPersona || itemB.selected_persona || sRoleB;

                    aSodRules.forEach(rule => {
                        const sDesc = rule.description || rule.conflict_reason || rule.conflictReason || "Segregation of Duties conflict detected between multiple roles selected in this request.";

                        if (checkConflictMatch(sRoleA, sPersonaA, sRoleB, sPersonaB, rule)) {
                            const sKey = `BATCH:::${sSysA}:::${sRoleA}:::${sSysB}:::${sRoleB}`;
                            if (!oSeenBatchKeys.has(sKey)) {
                                oSeenBatchKeys.add(sKey);
                                aBatchConflicts.push({
                                    system: sSysA,
                                    roleA: `${sSysA} — ${cleanPersonaName(sRoleA)}`,
                                    personaA: cleanPersonaName(sPersonaA),
                                    roleB: `${sSysB} — ${cleanPersonaName(sRoleB)}`,
                                    personaB: cleanPersonaName(sPersonaB),
                                    existingRole: `${sSysA} — ${cleanPersonaName(sRoleA)}`,
                                    existingPersona: cleanPersonaName(sPersonaA),
                                    newRole: `${sSysB} — ${cleanPersonaName(sRoleB)}`,
                                    newPersona: cleanPersonaName(sPersonaB),
                                    conflictTitle: "Batch Selection SoD Conflict",
                                    conflictDesc: sDesc
                                });
                            }
                        }
                    });
                }
            }

            oModel.setProperty("/activeSodConflictsList", aActiveConflicts);
            oModel.setProperty("/pendingOnlySodConflictsList", aPendingConflicts);
            oModel.setProperty("/batchSodConflictsList", aBatchConflicts);
        },

        onGoToStep4Slide1() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                try {
                    const aItems = oModel.getProperty("/addAccessSummaryItems") || [];
                    this._recalculateRestrictedRecords(aItems);
                    this._evaluateThresholdAndDuplicates(aItems);
                    this._evaluateSodConflicts(aItems);
                } catch (e) {
                    console.warn("Step 4 Slide 1 eval error:", e);
                }
            }
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
            this._scrollToWizardContainer();
        },

        onGoToStep4Slide2() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                try {
                    const aItems = oModel.getProperty("/addAccessSummaryItems") || [];
                    this._recalculateRestrictedRecords(aItems);
                    this._evaluateThresholdAndDuplicates(aItems);
                    this._evaluateSodConflicts(aItems);
                } catch (e) {
                    console.warn("Step 4 Slide 2 eval error:", e);
                }
            }
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 2);
            this._scrollToWizardContainer();
        },

        onGoToStep4Slide3() {
            // Maintained for backward compatibility, delegates to unified Slide 2
            this.onGoToStep4Slide2();
        },

        onGoBackToDurationSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 2);
                this._scrollToWizardContainer();
            }
        },

        onNavBackFromStep5() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            try {
                const aItems = oModel.getProperty("/addAccessSummaryItems") || [];
                this._recalculateRestrictedRecords(aItems);
                this._evaluateThresholdAndDuplicates(aItems);
                this._evaluateSodConflicts(aItems);
            } catch (e) {
                console.warn("NavBackFromStep5 eval error:", e);
            }

            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 2);
            this._scrollToWizardContainer();
        },

        onGoToAddAccessStep5() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 5);
            this._scrollToWizardContainer();
        },

        onEditSystemConfiguration(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            oModel.setProperty("/isEditingFromSummary", true);

            const oContext = oEvent.getSource().getBindingContext("accessModel");
            const oSystemTable = oContext ? oContext.getObject() : null;
            const sTargetSys = oSystemTable ? oSystemTable.systemName : null;

            const aSelectedSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            let iSysIdx = 0;

            if (sTargetSys) {
                const iFoundIdx = aSelectedSystems.indexOf(sTargetSys);
                if (iFoundIdx !== -1) {
                    iSysIdx = iFoundIdx;
                }
            }

            oModel.setProperty("/addAccessCurrentSystemIndex", iSysIdx);
            const sActiveSysName = aSelectedSystems[iSysIdx] || sTargetSys || "";
            oModel.setProperty("/currentSystemSlideName", sActiveSysName);

            // Reconstruct slide config if missing or empty from table items
            let oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            if (!oSlideConfigsMap[sActiveSysName] || !oSlideConfigsMap[sActiveSysName].selectedServices || oSlideConfigsMap[sActiveSysName].selectedServices.length === 0) {
                if (oSystemTable && Array.isArray(oSystemTable.items) && oSystemTable.items.length > 0) {
                    const aExtractedServices = [...new Set(oSystemTable.items.map(i => i.topic).filter(Boolean))];
                    const aExtractedRoles = [...new Set(oSystemTable.items.map(i => i.roleTitle || i.roleName).filter(Boolean))];
                    const aExtractedPersonas = [...new Set(oSystemTable.items.map(i => i.persona).filter(Boolean))];
                    oSlideConfigsMap[sActiveSysName] = {
                        selectedServices: aExtractedServices,
                        selectedRoles: aExtractedRoles,
                        selectedPersonas: aExtractedPersonas
                    };
                    oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);
                }
            }

            if (sActiveSysName) {
                this._loadCurrentSystemSlideConfig(sActiveSysName);
            }

            oModel.setProperty("/addAccessStep", 3);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            this._scrollToWizardContainer();
            MessageToast.show("Editing configuration for " + (sActiveSysName || "target system") + ". Click OK when done.");
        },

        onSaveAndReturnToSummary() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aServices = oModel.getProperty("/addAccessSelectedServices") || [];
            const aRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            const aPersonas = oModel.getProperty("/addAccessSelectedPersonas") || [];

            if (aServices.length === 0) {
                MessageBox.error("Please select at least one Service / Topic for this system.");
                return;
            }
            if (aRoles.length === 0) {
                MessageBox.error("Please select at least one Team Role for this system.");
                return;
            }
            if (aPersonas.length === 0) {
                MessageBox.error("Please select at least one Persona for this system.");
                return;
            }

            const sActiveSysName = oModel.getProperty("/currentSystemSlideName");
            if (sActiveSysName) {
                this._saveCurrentSystemSlideConfig(sActiveSysName);
            }

            // Re-generate summary items and tables based on updated selections
            this.onGoToAddAccessStep4();

            // Directly navigate back to Step 5 Summary
            oModel.setProperty("/addAccessStep", 5);
            oModel.setProperty("/isEditingFromSummary", false);
            this._scrollToWizardContainer();

            MessageToast.show("Configuration updated. Returned to Summary page.");
        },

        onSodConflictToggleChange(oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/sodConflictToggle", sKey);
            }
        },

        onRemoveInPageSummaryItem(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const oBindingCtx = oEvent.getSource().getBindingContext("accessModel");
            if (!oBindingCtx) return;

            const oItem = oBindingCtx.getObject();
            if (!oItem) return;

            const cleanStr = (s) => String(s || "").replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
            const isPersonaMatch = (keyInList, targetPersona) => {
                if (!keyInList || !targetPersona) return false;
                const cKey = cleanStr(keyInList);
                const cTarget = cleanStr(targetPersona);
                return cKey === cTarget || cKey.includes(cTarget) || cTarget.includes(cKey);
            };

            // 1. Remove ONLY the specific selected item from Summary in-memory lists
            let aItems = oModel.getProperty("/addAccessSummaryItems") || [];
            let aTables = oModel.getProperty("/addAccessSummaryTables") || [];

            const isTargetItem = (i) => {
                if (i === oItem) return true;
                if (i._itemUniqueId && oItem._itemUniqueId && i._itemUniqueId === oItem._itemUniqueId) return true;
                return (cleanStr(i.system) === cleanStr(oItem.system) && 
                        (cleanStr(i.roleName) === cleanStr(oItem.roleName) || cleanStr(i.roleTitle) === cleanStr(oItem.roleTitle)) && 
                        isPersonaMatch(i.persona, oItem.persona));
            };

            aItems = aItems.filter(i => !isTargetItem(i));
            
            aTables.forEach(t => {
                if (Array.isArray(t.items)) {
                    t.items = t.items.filter(i => !isTargetItem(i));
                }
            });
            aTables = aTables.filter(t => Array.isArray(t.items) && t.items.length > 0);

            oModel.setProperty("/addAccessSummaryItems", aItems);
            oModel.setProperty("/addAccessSummaryTables", aTables);

            // Re-evaluate SoD conflicts and threshold/duplicate validations
            this._evaluateSodConflicts(aItems);
            this._evaluateThresholdAndDuplicates(aItems);
            this._recalculateRestrictedRecords(aItems);

            // 2. Synchronize with Main Configuration Page (Step 3) & System Slide Configs
            const sSys = oItem.system;
            const sRole = oItem.roleName || oItem.roleTitle;
            const sPersona = oItem.persona;
            const sTopic = oItem.topic;

            let oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            if (sSys && oSlideConfigsMap[sSys]) {
                let oSysCfg = oSlideConfigsMap[sSys];
                
                // Remove deleted persona matching clean string
                if (sPersona && Array.isArray(oSysCfg.selectedPersonas)) {
                    oSysCfg.selectedPersonas = oSysCfg.selectedPersonas.filter(p => !isPersonaMatch(p, sPersona));
                }
                
                // Check if any remaining items for this system have this role
                const bRoleStillUsed = aItems.some(i => cleanStr(i.system) === cleanStr(sSys) && (cleanStr(i.roleName) === cleanStr(sRole) || cleanStr(i.roleTitle) === cleanStr(sRole)));
                if (!bRoleStillUsed && Array.isArray(oSysCfg.selectedRoles)) {
                    oSysCfg.selectedRoles = oSysCfg.selectedRoles.filter(r => !isPersonaMatch(r, sRole));
                }

                // Check if any remaining items for this system have this topic
                const bTopicStillUsed = aItems.some(i => cleanStr(i.system) === cleanStr(sSys) && (cleanStr(i.topic) === cleanStr(sTopic) || cleanStr(i.serviceTopic) === cleanStr(sTopic)));
                if (!bTopicStillUsed && Array.isArray(oSysCfg.selectedServices)) {
                    oSysCfg.selectedServices = oSysCfg.selectedServices.filter(s => !isPersonaMatch(s, sTopic));
                }

                // If all items for this system are removed, clean up system
                const bSystemStillUsed = aItems.some(i => cleanStr(i.system) === cleanStr(sSys));
                if (!bSystemStillUsed) {
                    delete oSlideConfigsMap[sSys];
                    let aSelectedSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
                    aSelectedSystems = aSelectedSystems.filter(s => cleanStr(s) !== cleanStr(sSys));
                    oModel.setProperty("/addAccessSelectedSystems", aSelectedSystems);
                }

                oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);

                // Update active form fields & controls if currently viewing this system slide
                const sCurrentSys = oModel.getProperty("/currentSystemSlideName");
                if (cleanStr(sCurrentSys) === cleanStr(sSys)) {
                    oModel.setProperty("/addAccessSelectedServices", oSysCfg.selectedServices || []);
                    oModel.setProperty("/addAccessSelectedRoles", oSysCfg.selectedRoles || []);
                    oModel.setProperty("/addAccessSelectedPersonas", oSysCfg.selectedPersonas || []);
                    this._updateSubRolesList(true);
                    this._updatePersonasList(true);

                    try {
                        const oServicesSelect = this.byId("inPageServicesMultiSelect");
                        if (oServicesSelect) oServicesSelect.setSelectedKeys(oSysCfg.selectedServices || []);
                        const oTeamSelect = this.byId("inPageTeamMultiSelect");
                        if (oTeamSelect) oTeamSelect.setSelectedKeys(oSysCfg.selectedRoles || []);
                        const oPersonaSelect = this.byId("inPagePersonaMultiSelect");
                        if (oPersonaSelect) oPersonaSelect.setSelectedKeys(oSysCfg.selectedPersonas || []);
                    } catch(e) {}
                }
            }

            MessageToast.show("Access item removed from request.");
        },

        async onFinalSubmitInPageAddAccess() {
            const oModel = this.getView().getModel("accessModel");
            const aSummaryItems = oModel.getProperty("/addAccessSummaryItems") || [];

            if (aSummaryItems.length === 0) {
                MessageBox.error("No access items configured to submit.");
                return;
            }

            // Filter out items that are already pending or already active
            const aValidItems = aSummaryItems.filter(item => !item.existingStatus.startsWith("Already"));
            const aSkippedItems = aSummaryItems.filter(item => item.existingStatus.startsWith("Already"));

            if (aValidItems.length === 0) {
                MessageBox.warning("All configured access entitlements are already pending approval or already active in your account. No requests were submitted to the database.");
                return;
            }

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");
            const sRegion = oModel.getProperty("/addAccessRegion");
            const sDuration = oModel.getProperty("/addAccessDuration");
            const sJustification = oModel.getProperty("/addAccessJustification");
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id") || sessionStorage.getItem("kyra_remember_id") || "";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";

            // 1. Show Modern Centered Loading Screen
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Submitting Access Request...",
                    subtitle: "Synchronizing governance records with the database..."
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Submitting Access Request...", "Synchronizing governance records with the database...");
            }
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                sap.ui.core.BusyIndicator.show(0);
            }

            const aActiveConflicts = oModel.getProperty("/activeSodConflictsList") || [];
            const aPendingConflicts = oModel.getProperty("/pendingOnlySodConflictsList") || [];
            const aBatchConflicts = oModel.getProperty("/batchSodConflictsList") || [];
            const bHasConflict = (aActiveConflicts.length > 0 || aPendingConflicts.length > 0 || aBatchConflicts.length > 0);

                        const aPayload = aValidItems.map((item, idx) => {
                let sItemReqNum = item.requestId;
                if (!sItemReqNum || sItemReqNum === "REQ-2026-000378") {
                    sItemReqNum = "REQ-2026-" + Math.floor(100000 + Math.random() * 900000);
                } else if (aValidItems.length > 1) {
                    const sPad = String(idx + 1).padStart(2, "0");
                    if (!sItemReqNum.endsWith("-" + sPad)) {
                        sItemReqNum = sItemReqNum + "-" + sPad;
                    }
                }
                item.requestId = sItemReqNum;

                const sCleanPersona = String(item.persona || item.selectedPersona || "Engineering & Developer Persona").replace(/\s*\([^)]*\)/g, "").trim();
                const sCleanServiceTopic = String(item.topic || item.serviceTopic || "System Administrator").replace(/\s*\([^)]*\)/g, "").trim();

                return {
                    requestNumber: sItemReqNum,
                    requesterUsername: sActiveUser,
                    requesterPersona: sActiveRole,
                    targetSystem: item.system,
                    roleName: item.roleName,
                    businessSector: sSector || "Information Technology & Security",
                    businessFunction: sFunction || "Identity & Access Governance",
                    serviceTopic: sCleanServiceTopic,
                    selectedPersona: sCleanPersona,
                    accessType: "DEFAULT",
                    operatingRegion: sRegion || "Global Enterprise (ALL)",
                    accessDuration: item.duration || sDuration || "Permanent (Default)",
                    justification: sJustification || "Access Request",
                    hasConflict: bHasConflict || item.hasConflict || false,
                    conflictingRole: bHasConflict ? "SoD Conflict" : (item.conflictingRole || ""),
                    conflictReason: bHasConflict ? "Segregation of Duties conflict detected" : (item.conflictReason || "")
                };
            });

            try {
                // Post valid items directly to backend PostgreSQL database endpoint
                const response = await fetch("/odata/v4/auth/submitAccessRequest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requests: aPayload })
                });

                const text = await response.text();
                let data = {};
                try {
                    data = JSON.parse(text);
                } catch(e) {
                    data = { error: { message: text || response.statusText } };
                }

                if (!response.ok || (data.error && data.error.message)) {
                    const sErrMsg = (data.error && data.error.message) ? data.error.message : "Failed to persist request into database.";
                    if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                        window.KyraLoader.hide();
                    } else if (window.hideKyraLoading) {
                        window.hideKyraLoading();
                    }
                    if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                    MessageBox.error("Database Conflict / Error:\n\n" + sErrMsg);
                    return;
                }

                console.log("Successfully persisted request into PostgreSQL database:", data);
                
                // Immediately reload all request tables from PostgreSQL database
                await this._loadSubmittedRequests(oModel);

                // Broadcast real-time mutation event to all open tabs/views
                this._notifyDatabaseMutation();

            } catch (err) {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }
                MessageBox.error("Failed to connect to database: " + err.message);
                return;
            } finally {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }
            }

            // Reset wizard overlay state
            oModel.setProperty("/addAccessStep", 1);
            oModel.setProperty("/showAddAccessSector", false);

            let sPopupHtml = `
                <div style="font-family: inherit; color: #0F172A;">
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                        <div>
                            <div style="font-weight: 800; font-size: 13.5px; color: #0F172A;">Governance Request Submission</div>
                            <div style="font-size: 11.5px; color: #64748B; margin-top: 2px;">
                                Your access requests have been successfully recorded in the database.
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11.5px; background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC;">
                                ✔ ${aValidItems.length} Submitted
                            </span>
                        </div>
                    </div>

                    <!-- Single compact scrollable container capped at 220px to prevent oversized modal -->
                    <div class="kyra-dialog-scroll-container" style="max-height: 220px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; margin-bottom: 6px;">
            `;

            if (aValidItems.length > 0) {
                sPopupHtml += `
                    <div style="color: #15803D; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; margin: 4px 0 6px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>Submitted Access Items</span>
                        <span style="background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; padding: 1px 8px; border-radius: 10px; font-size: 10.5px; font-weight: 700;">${aValidItems.length} Item(s)</span>
                    </div>
                    <div style="margin-bottom: 6px;">
                        ${aValidItems.map(i => {
                            const sCleanRole = (i.roleTitle || i.roleName || 'Access Role').replace(/\s*\([^)]*\)/g, "");
                            return `
                            <div style="border: 1px solid #BBF7D0; background: #F0FDF4; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(22,163,74,0.06);">
                                <div style="flex: 1; min-width: 0; padding-right: 8px;">
                                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                                        <span style="font-weight: 700; font-size: 11px; color: #15803D;">${i.requestId}</span>
                                        <span style="background: #FFFFFF; border: 1px solid #86EFAC; border-radius: 4px; padding: 1px 6px; font-size: 10.5px; font-weight: 700; color: #166534;">${i.system}</span>
                                    </div>
                                    <div style="font-size: 12.5px; font-weight: 700; color: #0F172A; line-height: 1.3; margin: 2px 0;">
                                        ${sCleanRole} <span style="font-weight: 500; font-size: 11px; color: #64748B;">(${i.topic || 'System Administrator'})</span>
                                    </div>
                                    ${i.persona ? `<div style="font-size: 11px; color: #475569; line-height: 1.2;"><span style="font-weight: 600; color: #334155;">Persona:</span> ${i.persona}</div>` : ''}
                                </div>
                                <div style="flex-shrink: 0;">
                                    <span style="background: #16A34A; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        ✔ Submitted
                                    </span>
                                </div>
                            </div>
                        `;}).join("")}
                    </div>
                `;
            }

            if (aSkippedItems.length > 0) {
                sPopupHtml += `
                    <div style="color: #B45309; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; margin: 6px 0 6px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>Excluded Items</span>
                        <span style="background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D; padding: 1px 8px; border-radius: 10px; font-size: 10.5px; font-weight: 700;">${aSkippedItems.length} Item(s)</span>
                    </div>
                    <div style="margin-bottom: 4px;">
                        ${aSkippedItems.map(i => {
                            const sCleanRole = (i.roleTitle || i.roleName || 'Access Role').replace(/\s*\([^)]*\)/g, "");
                            const isPending = (i.statusType === "pending" || (i.existingStatus && (i.existingStatus.toLowerCase().includes("pending") || i.existingStatus.toLowerCase().includes("requested") || i.existingStatus.toLowerCase().includes("applied"))));
                            const isDuplicate = (i.statusType === "duplicate" || (i.existingStatus && i.existingStatus.toLowerCase().includes("duplicate")));
                            
                            let sBadgeText = "Already Active";
                            let sBadgeBg = "#D97706";
                            if (isPending) {
                                sBadgeText = "Already Requested";
                                sBadgeBg = "#D97706";
                            } else if (isDuplicate) {
                                sBadgeText = "Duplicate in Request";
                                sBadgeBg = "#EA580C";
                            }

                            return `
                            <div style="border: 1px solid #FDE68A; background: #FFFBEB; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(217,119,6,0.06);">
                                <div style="flex: 1; min-width: 0; padding-right: 8px;">
                                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                                        <span style="font-weight: 700; font-size: 11px; color: #B45309;">${i.requestId}</span>
                                        <span style="background: #FFFFFF; border: 1px solid #FCD34D; border-radius: 4px; padding: 1px 6px; font-size: 10.5px; font-weight: 700; color: #92400E;">${i.system}</span>
                                    </div>
                                    <div style="font-size: 12.5px; font-weight: 700; color: #0F172A; line-height: 1.3; margin: 2px 0;">
                                        ${sCleanRole} <span style="font-weight: 500; font-size: 11px; color: #64748B;">(${i.topic || 'System Administrator'})</span>
                                    </div>
                                    ${i.persona ? `<div style="font-size: 11px; color: #475569; line-height: 1.2;"><span style="font-weight: 600; color: #334155;">Persona:</span> ${i.persona}</div>` : ''}
                                </div>
                                <div style="flex-shrink: 0;">
                                    <span style="background: ${sBadgeBg}; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        ${sBadgeText}
                                    </span>
                                </div>
                            </div>
                        `;}).join("")}
                    </div>
                `;
            }

            sPopupHtml += `
                    </div>
                </div>
            `;

            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                window.KyraDialog.show({
                    title: "Access Request Submitted",
                    messageHtml: sPopupHtml,
                    type: "success",
                    maxWidth: "520px",
                    buttonText: "Done"
                });
            } else {
                MessageBox.information("Access Request processing complete!", {
                    title: "Access Request Submitted"
                });
            }
        },

        _hasAddAccessInProgress() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return false;
            const bOpen = oModel.getProperty("/showAddAccessSector");
            if (!bOpen) return false;

            const sSector = oModel.getProperty("/selectedSector");
            const sFunction = oModel.getProperty("/selectedFunction");
            const aMapSelected = oModel.getProperty("/mapSelectedRegions") || [];
            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iStep = oModel.getProperty("/addAccessStep") || 1;
            const sJustification = (oModel.getProperty("/addAccessJustification") || "").trim();

            return !!(sSector || sFunction || aMapSelected.length > 0 || aSystems.length > 0 || iStep > 1 || sJustification);
        },

        _resetAddAccessState() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            this._aSelectedRegionIds = [];
            this._updatePinSelectionStates();
            this._updateSelectedChips();
            this._updateSelectAllButtonState();

            oModel.setProperty("/showAddAccessSector", false);
            oModel.setProperty("/selectedSector", "");
            oModel.setProperty("/selectedFunction", "");
            oModel.setProperty("/availableFunctions", []);
            oModel.setProperty("/addAccessSelectedSystems", []);
            oModel.setProperty("/addAccessSelectedServices", []);
            oModel.setProperty("/addAccessSelectedRoles", []);
            oModel.setProperty("/addAccessSelectedPersonas", []);
            oModel.setProperty("/addAccessDuration", "");
            oModel.setProperty("/addAccessJustification", "");
            oModel.setProperty("/addAccessSystemSlideConfigs", {});
            oModel.setProperty("/addAccessCurrentSystemIndex", 0);
            oModel.setProperty("/addAccessStep", 1);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            oModel.setProperty("/isEditingFromSummary", false);
        },

        _confirmDiscardAddAccess(fnProceedCallback) {
            if (!this._hasAddAccessInProgress()) {
                fnProceedCallback();
                return;
            }

            if (window.KyraDialog && typeof window.KyraDialog.show === "function") {
                window.KyraDialog.show({
                    title: "Unsaved Changes",
                    message: "If you navigate to another section, your in-progress access request details will be discarded. Do you want to proceed?",
                    type: "warning",
                    buttonText: "Proceed & Discard",
                    secondaryButtonText: "Stay on Page",
                    onConfirm: () => {
                        this._resetAddAccessState();
                        fnProceedCallback();
                    },
                    onCancel: () => {
                        // Stay on current page, do nothing
                    }
                });
            } else {
                MessageBox.confirm("If you navigate to another section, your in-progress access request details will be discarded. Do you want to proceed?", {
                    title: "Unsaved Changes",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.CANCEL,
                    onClose: (sAction) => {
                        if (sAction === MessageBox.Action.OK) {
                            this._resetAddAccessState();
                            fnProceedCallback();
                        }
                    }
                });
            }
        },

        onTabSelect(oEvent) {
            const sSelectedKey = oEvent.getParameter("key") || oEvent.getParameter("selectedKey") || "myAccess";
            const oModel = this.getView().getModel("accessModel");
            
            this._confirmDiscardAddAccess(() => {
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", sSelectedKey);
                }
            });
        },

        onNavToPendingRequests() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    const bCurr = oModel.getProperty("/showPendingSection");
                    oModel.setProperty("/showPendingSection", !bCurr);
                    oModel.setProperty("/showApprovedSection", false);
                    oModel.setProperty("/showAddAccessSector", false);
                    oModel.setProperty("/showRemoveAccessSector", false);
                    oModel.setProperty("/showRequestDetailsPage", false);
                    
                    if (!bCurr) {
                        setTimeout(() => {
                            const oPage = this.byId("accessPortalPage");
                            const oTarget = this.byId("pendingSectionContainer");
                            if (oPage && oTarget) {
                                oPage.scrollToElement(oTarget, 400);
                            }
                        }, 100);
                    }
                }
            });
        },

        onNavToApprovedRequests() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    const bCurr = oModel.getProperty("/showApprovedSection");
                    oModel.setProperty("/showApprovedSection", !bCurr);
                    oModel.setProperty("/showPendingSection", false);
                    oModel.setProperty("/showAddAccessSector", false);
                    oModel.setProperty("/showRemoveAccessSector", false);
                    oModel.setProperty("/showRequestDetailsPage", false);
                    
                    if (!bCurr) {
                        setTimeout(() => {
                            const oPage = this.byId("accessPortalPage");
                            const oTarget = this.byId("approvedSectionContainer");
                            if (oPage && oTarget) {
                                oPage.scrollToElement(oTarget, 400);
                            }
                        }, 100);
                    }
                }
            });
        },

        onClosePendingSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showPendingSection", false);
            }
        },

        onCloseApprovedSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showApprovedSection", false);
            }
        },

                async onOpenPendingRequestDetails(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            let oItem = null;
            if (oEvent && oEvent.getSource) {
                const oContext = oEvent.getSource().getBindingContext("accessModel");
                if (oContext) {
                    oItem = oContext.getObject();
                }
            }

            if (!oItem) {
                const aPending = oModel.getProperty("/myPendingRequests") || [];
                oItem = aPending.length > 0 ? aPending[0] : null;
            }

            const sReqNum = (oItem && (oItem.requestId || oItem.requestNumber)) || "REQ-GENERAL";

            // 1. Show Modern Loading Screen & BusyIndicator
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Loading Request Tracking...",
                    subtitle: "Retrieving live governance status from database..."
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Loading Request Tracking...", "Retrieving live governance status from database...");
            }
            if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                sap.ui.core.BusyIndicator.show(0);
            }

            try {
                // 2. Fetch fresh live database records with a smooth minimum delay for loader visibility
                const [response] = await Promise.all([
                    fetch("/odata/v4/admin-portal/GovernanceHistory"),
                    new Promise(r => setTimeout(r, 550))
                ]);
                const data = await response.json();
                let oDbItem = null;
                if (data && data.value) {
                    oDbItem = data.value.find(r => (r.request_number === sReqNum || r.id === sReqNum || ("REQ-" + r.ID) === sReqNum || ("REQ-" + r.id) === sReqNum));
                }

                // 3. Build live details directly from fresh database record
                const oLiveDetails = this._buildRequestDetailFromItem(oItem, oDbItem);
                oModel.setProperty("/selectedRequestDetail", oLiveDetails);

                // 4. Transition to Request Details / Tracking Page
                oModel.setProperty("/showRequestDetailsPage", true);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showMyAccessMasterSection", false);

                this._scrollToTop();
            } catch(e) {
                console.warn("Live fetch error on opening tracking details:", e);
                const oFallbackDetails = this._buildRequestDetailFromItem(oItem, null);
                oModel.setProperty("/selectedRequestDetail", oFallbackDetails);
                oModel.setProperty("/showRequestDetailsPage", true);
                this._scrollToTop();
            } finally {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }
            }
        },

        _buildRequestDetailFromItem(oItem, oDbItem) {
            const sReqNum = (oDbItem && oDbItem.request_number) || (oItem && oItem.requestId) || "REQ-2026-000378";
            let sReqIdShort = sReqNum.replace(/^REQ-2026-/, "").replace(/^REQ-/, "");
            if (!sReqIdShort) sReqIdShort = "000378";

            const sRequesterUsername = (oDbItem && oDbItem.requester_username) || (oItem && (oItem.requesterUsername || oItem.requesterId)) || "Dev001";
            const sSystem = (oDbItem && oDbItem.target_system) || (oItem && oItem.system) || "SAP S/4HANA";
            const sRoleName = (oDbItem && oDbItem.role_name) || (oItem && oItem.roleName) || "Access Role";
            const sCreatedAtRaw = (oDbItem && oDbItem.created_at) || (oItem && oItem.createdAtRaw) || new Date().toISOString();
            const sUpdatedAtRaw = (oDbItem && oDbItem.updated_at) || (oItem && oItem.updatedAtRaw) || sCreatedAtRaw;

            const formatDateStr = (dInput) => {
                if (!dInput) return "";
                try {
                    const d = new Date(dInput);
                    if (isNaN(d.getTime())) return String(dInput);
                    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                } catch (e) {
                    return String(dInput);
                }
            };

            const sSubmittedDateStr = formatDateStr(sCreatedAtRaw);
            const sUpdatedDateStr = formatDateStr(sUpdatedAtRaw);

            const sDbStatus = ((oDbItem && (oDbItem.db_status || oDbItem.status)) || (oItem && (oItem.db_status || oItem.status)) || "PENDING").toUpperCase();
            const bHasConflict = ((oDbItem && oDbItem.has_conflict) === true) || !!(oDbItem && oDbItem.conflicting_role && oDbItem.conflicting_role.trim()) || sDbStatus === "PENDING_COMPLIANCE" || ((oItem && oItem.hasConflict) === true) || ((oItem && oItem.has_conflict) === true);

            const sApproverStatus = ((oDbItem && (oDbItem.approver_status || oDbItem.approver_decision_status)) || (oItem && (oItem.approver_status || oItem.approver_decision_status)) || "").toUpperCase();
            const sApproverComment = (oDbItem && oDbItem.approver_comment) || (oItem && oItem.approver_comment) || (oDbItem && oDbItem.approverComment) || (oItem && oItem.approverComment) || "";

            const sComplianceStatus = ((oDbItem && (oDbItem.compliance_status || oDbItem.compliance_decision_status)) || (oItem && (oItem.compliance_status || oItem.compliance_decision_status)) || "").toUpperCase();
            const sComplianceComment = (oDbItem && (oDbItem.reviewer_comment || oDbItem.reviewerComment)) || (oItem && (oItem.reviewer_comment || oItem.reviewerComment)) || "";

            const sIam1Status = ((oDbItem && (oDbItem.iam_approver_1_status || oDbItem.iam_approver_1_decision_status)) || (oItem && (oItem.iam_approver_1_status || oItem.iam_approver_1_decision_status)) || "").toUpperCase();
            const sIam1Comment = (oDbItem && (oDbItem.iam_approver_1_comment || oDbItem.iamApprover1Comment)) || (oItem && (oItem.iam_approver_1_comment || oItem.iamApprover1Comment)) || "";

            const sIam2Status = ((oDbItem && (oDbItem.iam_approver_2_status || oDbItem.iam_approver_2_decision_status)) || (oItem && (oItem.iam_approver_2_status || oItem.iam_approver_2_decision_status)) || "").toUpperCase();
            const sIam2Comment = (oDbItem && (oDbItem.iam_approver_2_comment || oDbItem.iamApprover2Comment)) || (oItem && (oItem.iam_approver_2_comment || oItem.iamApprover2Comment)) || "";

            const isInitialApproverApproved = sApproverStatus === "APPROVED" || ["PENDING_COMPLIANCE", "PENDING_IAM_1", "PENDING_IAM_2", "APPROVED"].includes(sDbStatus);
            const isInitialApproverRejected = sApproverStatus === "REJECTED" || (sDbStatus === "REJECTED" && !sComplianceStatus && !sIam1Status && !sIam2Status);

            const isComplianceApproved = sComplianceStatus === "APPROVED" || (bHasConflict && ["PENDING_IAM_1", "PENDING_IAM_2", "APPROVED"].includes(sDbStatus));
            const isComplianceRejected = sComplianceStatus === "REJECTED";

            const isIam1Approved = sIam1Status === "APPROVED" || ["PENDING_IAM_2", "APPROVED"].includes(sDbStatus);
            const isIam1Rejected = sIam1Status === "REJECTED";

            const isIam2Approved = sIam2Status === "APPROVED" || sDbStatus === "APPROVED";
            const isIam2Rejected = sIam2Status === "REJECTED";

            const isOverallApproved = sDbStatus === "APPROVED" || isIam2Approved;
            const isOverallRejected = sDbStatus === "REJECTED" || isInitialApproverRejected || isComplianceRejected || isIam1Rejected || isIam2Rejected;

            // STEP 1: Request Submitted
            const oStep1 = {
                state: "GREEN",
                title: "Request Submitted",
                subtitle: sRequesterUsername === "Dev001" ? "Requester" : sRequesterUsername,
                statusText: "Completed",
                dateTime: sSubmittedDateStr,
                subNote: ""
            };

            // STEP 2: Approver
            let oStep2State = "GRAY";
            let oStep2Status = "Waiting";
            let oStep2SubNote = "";
            if (isInitialApproverApproved) {
                oStep2State = "GREEN";
                oStep2Status = "Approved";
            } else if (isInitialApproverRejected) {
                oStep2State = "RED";
                oStep2Status = "Rejected";
                oStep2SubNote = "Rejected by Approver";
            } else {
                oStep2State = "BLUE";
                oStep2Status = "In Progress";
                oStep2SubNote = "Currently with Approver";
            }
            const oStep2 = {
                state: oStep2State,
                title: "Approver",
                subtitle: (oDbItem && (oDbItem.approver_name || oDbItem.approver_full_name || oDbItem.approver_username || oDbItem.approver)) || (oItem && (oItem.approverName || oItem.approver)) || "Line Manager Approver",
                statusText: oStep2Status,
                dateTime: (isInitialApproverApproved || isInitialApproverRejected) ? sUpdatedDateStr : "",
                subNote: oStep2SubNote
            };

            // STEP 3: Compliance Approver
            let oStep3State = "GRAY";
            let oStep3Status = "Waiting";
            let oStep3SubNote = "";
            if (!bHasConflict) {
                oStep3State = "AMBER";
                oStep3Status = "Skipped";
                oStep3SubNote = "Direct to IAM (No Conflict)";
            } else if (isComplianceApproved) {
                oStep3State = "GREEN";
                oStep3Status = "Approved";
            } else if (isComplianceRejected) {
                oStep3State = "RED";
                oStep3Status = "Rejected";
                oStep3SubNote = "Rejected by Compliance";
            } else if (isInitialApproverApproved && sDbStatus === "PENDING_COMPLIANCE") {
                oStep3State = "BLUE";
                oStep3Status = "In Progress";
                oStep3SubNote = "Currently with Compliance Approver";
            }
            const oStep3 = {
                state: oStep3State,
                title: "Compliance Approver",
                subtitle: "Compliance Review",
                statusText: oStep3Status,
                dateTime: (isComplianceApproved || isComplianceRejected) ? sUpdatedDateStr : "",
                subNote: oStep3SubNote
            };

            // STEP 4: IAM Approver
            let oStep4State = "GRAY";
            let oStep4Status = "Waiting";
            let oStep4SubNote = "";
            if (isIam1Approved) {
                oStep4State = "GREEN";
                oStep4Status = "Approved";
            } else if (isIam1Rejected) {
                oStep4State = "RED";
                oStep4Status = "Rejected";
                oStep4SubNote = "Rejected by IAM Approver";
            } else if ((isInitialApproverApproved && !bHasConflict && sDbStatus === "PENDING_IAM_1") || (isComplianceApproved && sDbStatus === "PENDING_IAM_1")) {
                oStep4State = "BLUE";
                oStep4Status = "In Progress";
                oStep4SubNote = "Currently with IAM Approver";
            }
            const oStep4 = {
                state: oStep4State,
                title: "IAM Approver",
                subtitle: "Identity Governance",
                statusText: oStep4Status,
                dateTime: (isIam1Approved || isIam1Rejected) ? sUpdatedDateStr : "",
                subNote: oStep4SubNote
            };

            // STEP 5: IAM Approver 2
            let oStep5State = "GRAY";
            let oStep5Status = "Waiting";
            let oStep5SubNote = "";
            if (isIam2Approved) {
                oStep5State = "GREEN";
                oStep5Status = "Approved";
            } else if (isIam2Rejected) {
                oStep5State = "RED";
                oStep5Status = "Rejected";
                oStep5SubNote = "Rejected by IAM Approver 2";
            } else if (isIam1Approved && sDbStatus === "PENDING_IAM_2") {
                oStep5State = "BLUE";
                oStep5Status = "In Progress";
                oStep5SubNote = "Currently with IAM Approver 2";
            }
            const oStep5 = {
                state: oStep5State,
                title: "IAM Approver 2",
                subtitle: "Access Provisioning",
                statusText: oStep5Status,
                dateTime: (isIam2Approved || isIam2Rejected) ? sUpdatedDateStr : "",
                subNote: oStep5SubNote
            };

            // STEP 6: Completed
            let oStep6State = "GRAY";
            let oStep6Status = "Waiting";
            let oStep6SubNote = "";
            if (isOverallApproved) {
                oStep6State = "GREEN";
                oStep6Status = "Completed";
                oStep6SubNote = "Provisioned & Live";
            } else if (isOverallRejected) {
                oStep6State = "RED";
                oStep6Status = "Rejected";
                oStep6SubNote = "Access Request Rejected";
            }
            const oStep6 = {
                state: oStep6State,
                title: "Completed",
                subtitle: "Access Activated",
                statusText: oStep6Status,
                dateTime: (isOverallApproved || isOverallRejected) ? sUpdatedDateStr : "",
                subNote: oStep6SubNote
            };

            // Connecting lines
            const line1Class = "kyraStepLineGreen";
            const line2Class = isInitialApproverApproved ? "kyraStepLineGreen" : (isInitialApproverRejected ? "kyraStepLineRed" : "kyraStepLineDashed");
            const line3Class = ((!bHasConflict && isInitialApproverApproved) || isComplianceApproved) ? "kyraStepLineGreen" : (isComplianceRejected ? "kyraStepLineRed" : "kyraStepLineDashed");
            const line4Class = isIam1Approved ? "kyraStepLineGreen" : (isIam1Rejected ? "kyraStepLineRed" : "kyraStepLineDashed");
            const line5Class = isIam2Approved ? "kyraStepLineGreen" : (isIam2Rejected ? "kyraStepLineRed" : "kyraStepLineDashed");

            // --- Timeline Comments List ---
            const aTimelineComments = [];

            // 1. Requester Submission
            aTimelineComments.push({
                title: "Initial Access Request Submission",
                timestamp: sSubmittedDateStr,
                comment: (oDbItem && oDbItem.justification) || (oItem && oItem.justification) || "Access request submitted for target system entitlement.",
                author: "By: " + sRequesterUsername + " (Requester)",
                icon: "sap-icon://document-text",
                state: "GREEN",
                statusBadge: "Submitted"
            });

            // 2. Approver Decision
            if (sApproverStatus || isInitialApproverApproved || isInitialApproverRejected || sApproverComment) {
                aTimelineComments.push({
                    title: isInitialApproverRejected ? "Line Manager Rejection Decision" : "Line Manager Approval Decision",
                    timestamp: sUpdatedDateStr,
                    comment: sApproverComment || (isInitialApproverRejected ? "Rejected access request during manager review." : "Approved access request entitlement during standard review cycle."),
                    author: "By: " + ((oDbItem && (oDbItem.approver_name || oDbItem.approver_full_name || oDbItem.approver_username || oDbItem.approver)) || (oItem && (oItem.approverName || oItem.approver)) || "Line Manager") + " (Manager Approver)",
                    icon: isInitialApproverRejected ? "sap-icon://error" : "sap-icon://sys-enter-2",
                    state: isInitialApproverRejected ? "RED" : "GREEN",
                    statusBadge: isInitialApproverRejected ? "Rejected" : "Approved"
                });
            }

            // 3. Compliance Decision
            if (bHasConflict && (sComplianceStatus || isComplianceApproved || isComplianceRejected || sComplianceComment)) {
                aTimelineComments.push({
                    title: isComplianceRejected ? "Compliance Reviewer Rejection Decision" : "Compliance Reviewer Approval Decision",
                    timestamp: sUpdatedDateStr,
                    comment: sComplianceComment || (isComplianceRejected ? "Rejected by Compliance Reviewer due to Segregation of Duties policy constraint." : "Compliance verified. SoD risk mitigated and approved for technical provisioning."),
                    author: "By: Compliance Reviewer (Compliance & Audit)",
                    icon: isComplianceRejected ? "sap-icon://error" : "sap-icon://sys-enter-2",
                    state: isComplianceRejected ? "RED" : "GREEN",
                    statusBadge: isComplianceRejected ? "Rejected" : "Approved"
                });
            }

            // 4. IAM Approver 1 Decision
            if (sIam1Status || isIam1Approved || isIam1Rejected || sIam1Comment) {
                aTimelineComments.push({
                    title: isIam1Rejected ? "IAM Approver 1 Rejection Decision" : "IAM Approver 1 Governance Decision",
                    timestamp: sUpdatedDateStr,
                    comment: sIam1Comment || (isIam1Rejected ? "Rejected during IAM Level 1 technical review." : "Approved by IAM Approver 1. Sent to IAM Approver 2 for final provisioning."),
                    author: "By: IAM Approver 1 (Identity Governance)",
                    icon: isIam1Rejected ? "sap-icon://error" : "sap-icon://sys-enter-2",
                    state: isIam1Rejected ? "RED" : "GREEN",
                    statusBadge: isIam1Rejected ? "Rejected" : "Approved"
                });
            }

            // 5. IAM Approver 2 Decision
            if (sIam2Status || isIam2Approved || isIam2Rejected || sIam2Comment) {
                aTimelineComments.push({
                    title: isIam2Rejected ? "IAM Approver 2 Rejection Decision" : "IAM Approver 2 Provisioning Decision",
                    timestamp: sUpdatedDateStr,
                    comment: sIam2Comment || (isIam2Rejected ? "Rejected during IAM Level 2 final sign-off." : "Approved by IAM Approver 2. User account entitlement provisioned and activated."),
                    author: "By: IAM Approver 2 (Access Provisioning)",
                    icon: isIam2Rejected ? "sap-icon://error" : "sap-icon://sys-enter-2",
                    state: isIam2Rejected ? "RED" : "GREEN",
                    statusBadge: isIam2Rejected ? "Rejected" : "Approved"
                });
            }

            // 6. If no decisions yet, add awaiting note
            if (aTimelineComments.length === 1 && !isOverallRejected && !isOverallApproved) {
                aTimelineComments.push({
                    title: "Awaiting Line Manager Review",
                    timestamp: "In Progress",
                    comment: "This request is currently in queue awaiting Line Manager review and sign-off.",
                    author: "Current Assignee: " + ((oDbItem && (oDbItem.approver_name || oDbItem.approver_full_name || oDbItem.approver_username || oDbItem.approver)) || (oItem && (oItem.approverName || oItem.approver)) || "Line Manager Approver") + " (Manager Approver)",
                    icon: "sap-icon://pending",
                    state: "BLUE",
                    statusBadge: "In Progress"
                });
            }

            return {
                requestId: sReqNum,
                requestIdDisplay: sReqIdShort,
                requesterUsername: sRequesterUsername,
                submittedDateTime: sSubmittedDateStr,
                system: sSystem,
                roleName: sRoleName,
                status: sDbStatus,
                line1Class: line1Class,
                line2Class: line2Class,
                line3Class: line3Class,
                line4Class: line4Class,
                line5Class: line5Class,
                step1: oStep1,
                step2: oStep2,
                step3: oStep3,
                step4: oStep4,
                step5: oStep5,
                step6: oStep6,
                timelineComments: aTimelineComments
            };
        },

        onBackFromRequestDetails() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showRequestDetailsPage", false);
                this._scrollToTop();
            }
        },

        onNavHomeFromRequestDetails() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showRequestDetailsPage", false);
                oModel.setProperty("/selectedTabKey", "myAccess");
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                this._scrollToTop();
            }
        },

        onOpenAddCommentDialog() {
            sap.ui.require([
                "sap/m/Dialog", "sap/m/TextArea", "sap/m/Button", "sap/m/MessageToast"
            ], (Dialog, TextArea, Button, MessageToast) => {
                const oModel = this.getView().getModel("accessModel");
                const oTextArea = new TextArea({
                    width: "100%",
                    rows: 4,
                    placeholder: "Type your comment or note here..."
                });

                const oDialog = new Dialog({
                    title: "Add Comment / Note",
                    type: "Message",
                    content: [oTextArea],
                    beginButton: new Button({
                        text: "Add Comment",
                        type: "Emphasized",
                        press: () => {
                            const sVal = oTextArea.getValue();
                            if (sVal && sVal.trim()) {
                                if (oModel) {
                                    oModel.setProperty("/selectedRequestDetail/comments", sVal.trim());
                                }
                                MessageToast.show("Comment added successfully.");
                                oDialog.close();
                            } else {
                                MessageToast.show("Please enter a comment.");
                            }
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: () => oDialog.close()
                    }),
                    afterClose: () => oDialog.destroy()
                });

                oDialog.open();
            });
        },

        onFollowUpComments() {
            MessageToast.show("Follow-up comment recorded for this request.");
        },

        onRejectRequestDetail() {
            MessageBox.confirm("Are you sure you want to reject this access request?", {
                title: "Reject Request",
                onClose: (sAction) => {
                    if (sAction === "OK") {
                        MessageToast.show("Request has been marked as Rejected.");
                        this.onBackFromRequestDetails();
                    }
                }
            });
        },

        onCancelRequestDetail() {
            MessageBox.confirm("Are you sure you want to cancel this request?", {
                title: "Cancel Request",
                onClose: (sAction) => {
                    if (sAction === "OK") {
                        MessageToast.show("Access request cancelled.");
                        this.onBackFromRequestDetails();
                    }
                }
            });
        },

        onSubmitRequestDetail() {
            MessageToast.show("Request details updated and submitted successfully.");
            this.onBackFromRequestDetails();
        },

        _scrollToTop() {
            setTimeout(() => {
                const oPage = this.byId("accessPortalPage");
                if (oPage && typeof oPage.scrollTo === "function") {
                    oPage.scrollTo(0, 200);
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }, 50);
        },

        onNavToMyAccessMasterPage() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (!oModel) return;

                const bCurr = oModel.getProperty("/showMyAccessMasterSection");
                oModel.setProperty("/showMyAccessMasterSection", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                oModel.setProperty("/showRequestDetailsPage", false);

                if (!bCurr) {
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("myAccessMasterSectionContainer");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            });
        },

        onCloseMyAccessMasterSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showMyAccessMasterSection", false);
            }
        },

        onOpenAllAccessModal() {
            this.onNavToMyAccessMasterPage();
        },

        onSearchMasterAccess(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new sap.ui.model.Filter([
                    new sap.ui.model.Filter("system", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("roleName", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("category", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("persona", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("grantedDate", sap.ui.model.FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myAccessMasterSectionTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.filter(aFilters);
                }
            }
        },

        onNavToRemoveAccess() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    const bCurr = oModel.getProperty("/showRemoveAccessSector");
                    const bNewState = !bCurr;
                    oModel.setProperty("/showRemoveAccessSector", bNewState);
                    oModel.setProperty("/showPendingSection", false);
                    oModel.setProperty("/showApprovedSection", false);
                    oModel.setProperty("/showAddAccessSector", false);
                    oModel.setProperty("/selectedTabKey", "myAccess");

                    if (bNewState) {
                        setTimeout(() => {
                            const oSec = this.byId("removeAccessSection");
                            const oDom = oSec ? oSec.getDomRef() : document.getElementById(this.createId("removeAccessSection"));
                            if (oDom) {
                                oDom.scrollIntoView({ behavior: "smooth", block: "start" });
                            } else {
                                const oPage = this.byId("accessPortalPage");
                                if (oPage && oSec) {
                                    oPage.scrollToElement(oSec, 400);
                                }
                            }
                        }, 120);
                    }
                }
            });
        },

        onOpenAccessRowActionSheet(oEvent) {
            const oSource = oEvent.getSource();
            const oItemContext = oSource.getBindingContext("accessModel");
            const oItem = oItemContext ? oItemContext.getObject() : null;
            if (!oItem) return;

            sap.ui.require(["sap/m/ActionSheet", "sap/m/Button", "sap/m/MessageToast"], (ActionSheet, Button, MessageToast) => {
                const oActionSheet = new ActionSheet({
                    title: "Actions for " + (oItem.roleName || "Entitlement"),
                    placement: "Bottom",
                    buttons: [
                        new Button({
                            text: "View Details & Audit Log",
                            icon: "sap-icon://display",
                            press: () => {
                                this._showAccessDetailsDialog(oItem);
                            }
                        }),
                        new Button({
                            text: "Export Audit Log",
                            icon: "sap-icon://excel-attachment",
                            press: () => {
                                MessageToast.show("Exported entitlement audit log for " + oItem.roleName);
                            }
                        }),
                        new Button({
                            text: "Request Access Revocation",
                            icon: "sap-icon://delete",
                            type: "Reject",
                            press: () => {
                                this.onNavToRemoveAccess();
                            }
                        })
                    ]
                });

                this.getView().addDependent(oActionSheet);
                oActionSheet.openBy(oSource);
            });
        },

        onViewAccessDetails(oEvent) {
            const oItem = oEvent.getSource().getBindingContext("accessModel").getObject();
            if (!oItem) return;
            this._showAccessDetailsDialog(oItem);
        },

        _showAccessDetailsDialog(oItem) {
            sap.ui.require([
                "sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"
            ], (Dialog, HTML, MessageToast) => {
                const oModel = this.getView().getModel("accessModel");
                
                const sSys = oItem.system || "SAP BTP Cloud Platform";
                const sRole = oItem.roleName || oItem.roleTitle || "Lead Engineer (System Administrator)";
                const sRoleId = oItem.roleId || ("ROL-" + sSys.replace(/[^A-Za-z0-9]/g, "").substring(0, 4).toUpperCase() + "-001");
                const sTeam = this._deriveCleanTeamName ? this._deriveCleanTeamName(oItem) : (oItem.team || "Audit & Compliance Team");
                const sService = oItem.serviceTopic || oItem.service || oItem.category || "Core Business Operations";
                const sPers = oItem.selectedPersona || oItem.persona || (oModel ? oModel.getProperty("/activeRole") : null) || "Principal Systems Engineer Persona (Lead Engineer)";
                const sRegion = oItem.region || (oModel ? oModel.getProperty("/addAccessRegion") : null) || "Asia";
                const sGranted = oItem.grantedDate || oItem.submissionDate || "2026-08-21";
                const sExpiry = (oItem.expiryDate && oItem.expiryDate !== "Permanent") ? oItem.expiryDate : (oItem.duration || "30 Days (Temporary)");
                const sJustification = oItem.justification || "Business operational governance, audit compliance, and system execution privileges.";
                const sStatus = oItem.status || "Active";

                const sHtmlContent = `
                    <div class="kyra-role-details-modal">
                        <!-- Top Header Bar with Close X -->
                        <div class="kyra-modal-top-bar">
                            <div>
                                <div class="kyra-modal-main-title">Role Details</div>
                                <div class="kyra-modal-sub-title">Complete Entitlement & Scope Configuration</div>
                            </div>
                            <button type="button" class="kyra-modal-close-x" id="kyra_btn_close_top_x" aria-label="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <!-- Scrollable Body Content -->
                        <div class="kyra-modal-scroll-body">
                            <div class="kyra-modal-body-padding">
                                <!-- Hero Role Header Card -->
                                <div class="kyra-modal-header-card">
                                    <div class="kyra-modal-header-left">
                                        <div class="kyra-modal-role-avatar">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                        </div>
                                        <div class="kyra-modal-role-meta">
                                            <div class="kyra-modal-role-name">${sRole}</div>
                                            <div class="kyra-modal-role-sys">${sSys} • ${sRoleId}</div>
                                        </div>
                                    </div>
                                    <div class="kyra-modal-status-badge">
                                        <span class="kyra-modal-status-dot"></span> ${sStatus}
                                    </div>
                                </div>

                                <!-- Details Card Grid with Full Selection Fields -->
                                <div class="kyra-modal-details-card">
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">System Name</span>
                                        <span class="kyra-modal-val">${sSys}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Business Role</span>
                                        <span class="kyra-modal-val">${sRole}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Team</span>
                                        <span class="kyra-modal-val">${sTeam}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Service / Topic</span>
                                        <span class="kyra-modal-val">${sService}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Assigned Persona</span>
                                        <span class="kyra-modal-val">${sPers}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Operating Region</span>
                                        <span class="kyra-modal-val">${sRegion}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Granted Date</span>
                                        <span class="kyra-modal-val">${sGranted}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Expiration Date</span>
                                        <span class="kyra-modal-val">${sExpiry}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row">
                                        <span class="kyra-modal-label">Business Justification</span>
                                        <span class="kyra-modal-val" style="max-width: 60%; line-height: 1.3;">${sJustification}</span>
                                    </div>
                                    <div class="kyra-modal-grid-row kyra-modal-grid-row-last">
                                        <span class="kyra-modal-label">Security &amp; Audit</span>
                                        <span class="kyra-val-verified-badge">✓ Audit Verified &amp; Compliant</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Action Buttons (Sticky at Bottom) -->
                        <div class="kyra-modal-footer-actions">
                            <button type="button" class="kyra-btn-outline" id="kyra_btn_export_log">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export Log
                            </button>
                            <button type="button" class="kyra-btn-primary" id="kyra_btn_close_modal">Close</button>
                        </div>
                    </div>
                `;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "550px",
                    horizontalScrolling: false,
                    verticalScrolling: true,
                    class: "kyraModernDetailsDialog",
                    content: [
                        new HTML({ content: sHtmlContent })
                    ],
                    afterClose: () => oDialog.destroy()
                });

                this.getView().addDependent(oDialog);
                oDialog.open();

                setTimeout(() => {
                    const btnCloseX = document.getElementById("kyra_btn_close_top_x");
                    if (btnCloseX) {
                        btnCloseX.onclick = () => oDialog.close();
                    }
                    const btnExport = document.getElementById("kyra_btn_export_log");
                    if (btnExport) {
                        btnExport.onclick = () => {
                            MessageToast.show("Audit log exported for " + sRole);
                        };
                    }
                    const btnClose = document.getElementById("kyra_btn_close_modal");
                    if (btnClose) {
                        btnClose.onclick = () => oDialog.close();
                    }
                }, 50);
            });
        },

        onViewAllEntitlementsMatrix() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            sap.ui.require([
                "sap/m/Dialog", "sap/m/VBox", "sap/m/HBox", "sap/m/Title", "sap/m/Text",
                "sap/m/Table", "sap/m/Column", "sap/m/ColumnListItem", "sap/m/ObjectStatus",
                "sap/m/ObjectIdentifier", "sap/m/Button", "sap/m/MessageToast"
            ], (Dialog, VBox, HBox, Title, Text, Table, Column, ColumnListItem, ObjectStatus, ObjectIdentifier, Button, MessageToast) => {
                
                const aRoles = oModel.getProperty("/activeRoles") || [];

                const oDialog = new Dialog({
                    title: "Master Entitlements & Audit Matrix View",
                    contentWidth: "900px",
                    contentHeight: "560px",
                    verticalScrolling: true,
                    content: [
                        new VBox({
                            class: "sapUiContentPadding",
                            items: [
                                new HBox({
                                    justifyContent: "SpaceBetween",
                                    alignItems: "Center",
                                    class: "sapUiSmallMarginBottom",
                                    items: [
                                        new VBox({
                                            items: [
                                                new Title({ text: "Complete User Access & Audit History Matrix", level: "H4" }),
                                                new Text({ text: "Showing all active system roles, assigned personas, and audit compliance states in a single view.", class: "fioriDescriptionText" })
                                            ]
                                        }),
                                        new Button({
                                            icon: "sap-icon://excel-attachment",
                                            text: "Export Matrix",
                                            press: () => MessageToast.show("Master access matrix exported successfully.")
                                        })
                                    ]
                                }),

                                new Table({
                                    items: aRoles.map(r => new ColumnListItem({
                                        cells: [
                                            new ObjectIdentifier({ title: r.system, text: r.roleId }),
                                            new Text({ text: r.roleName, class: "fioriCellBold" }),
                                            new Text({ text: r.category || "System Administrator" }),
                                            new ObjectStatus({ text: r.persona || "Requester", state: "Information", icon: "sap-icon://account" }),
                                            new Text({ text: r.grantedDate }),
                                            new Text({ text: r.expiryDate === "Permanent" ? "31 Dec 9999" : (r.expiryDate || "31 Dec 9999") }),
                                            new ObjectStatus({ text: "100% Audit Compliant", state: "Success", icon: "sap-icon://sys-enter-2" })
                                        ]
                                    })),
                                    columns: [
                                        new Column({ width: "18%", header: new Text({ text: "System & ID" }) }),
                                        new Column({ width: "20%", header: new Text({ text: "Role Title" }) }),
                                        new Column({ width: "16%", header: new Text({ text: "Category" }) }),
                                        new Column({ width: "16%", header: new Text({ text: "Persona" }) }),
                                        new Column({ width: "11%", header: new Text({ text: "Granted" }) }),
                                        new Column({ width: "11%", header: new Text({ text: "Expiry" }) }),
                                        new Column({ width: "18%", header: new Text({ text: "Audit Compliance" }) })
                                    ]
                                })
                            ]
                        })
                    ],
                    endButton: new Button({
                        text: "Close Matrix",
                        type: "Emphasized",
                        press: () => oDialog.close()
                    }),
                    afterClose: () => oDialog.destroy()
                });

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onShowAuditSummary(oEvent) {
            const oModel = this.getView().getModel("accessModel");
            const aRequests = oModel ? oModel.getProperty("/requestHistory") || [] : [];
            
            const iTotal = aRequests.length;
            const iPending = aRequests.filter(r => r.status === "Pending Approval" || r.status === "Pending").length;
            const iApproved = aRequests.filter(r => r.status === "Approved").length;
            const iPermanent = aRequests.filter(r => (r.accessDuration || "").includes("Permanent")).length;
            const iTemp = aRequests.filter(r => (r.accessDuration || "").includes("30") || (r.accessDuration || "").includes("Temporary")).length;

            const oSource = oEvent.getSource();

            sap.ui.require(["sap/m/ResponsivePopover", "sap/m/VBox", "sap/m/Text", "sap/m/Title", "sap/m/Button"], (ResponsivePopover, VBox, Text, Title, Button) => {
                const oPopover = new ResponsivePopover({
                    title: "KYRA Audit Summary Statistics",
                    contentWidth: "360px",
                    placement: "PreferredTop",
                    content: [
                        new VBox({
                            class: "sapUiContentPadding",
                            items: [
                                new Title({ text: "Governance & Audit Overview", level: "H5", class: "sapUiTinyMarginBottom" }),
                                new Text({ text: "• Total Audited Requests: " + iTotal }),
                                new Text({ text: "• Approved Access Granted: " + iApproved }),
                                new Text({ text: "• Pending Approval Queue: " + iPending }),
                                new Text({ text: "• Permanent Entitlements: " + iPermanent }),
                                new Text({ text: "• Temporary Access (30/60 Days): " + iTemp }),
                                new Text({ text: "• Audit Log Last Sync: " + new Date().toLocaleTimeString() })
                            ]
                        })
                    ],
                    endButton: new Button({
                        text: "Close Summary",
                        type: "Emphasized",
                        press: () => oPopover.close()
                    })
                });
                this.getView().addDependent(oPopover);
                oPopover.openBy(oSource);
            });
        },

        onFilterHistoryByAll() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
                oModel.setProperty("/activeKpiFilter", "ALL");
                oModel.setProperty("/historyFilterTitle", "All History");
                oModel.setProperty("/historyFilterSubtitle", "All submitted and historical access requests.");
                oModel.setProperty("/historyFilterIcon", "sap-icon://documents");
                oModel.setProperty("/historyFilterAvatarColor", "Accent6");
                oModel.setProperty("/filteredHistoryCount", (oModel.getProperty("/requestHistory") || []).length);
            }
            const oTable = this.byId("myRequestsUnifiedTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.filter([]);
                }
            }
            sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                MessageToast.show("Showing all history requests.");
            });
        },

        onFilterHistoryByPending() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
                oModel.setProperty("/activeKpiFilter", "PENDING");
                oModel.setProperty("/historyFilterTitle", "Pending");
                oModel.setProperty("/historyFilterSubtitle", "Showing requests currently pending approval.");
                oModel.setProperty("/historyFilterIcon", "sap-icon://pending");
                oModel.setProperty("/historyFilterAvatarColor", "Accent1");
                oModel.setProperty("/filteredHistoryCount", oModel.getProperty("/pendingHistoryCount") || 0);
            }
            const oTable = this.byId("myRequestsUnifiedTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (Filter, FilterOperator, MessageToast) => {
                        oBinding.filter([
                            new Filter("status", FilterOperator.Contains, "Pending")
                        ]);
                        MessageToast.show("Filtered by Pending requests.");
                    });
                }
            }
        },

        onFilterHistoryByExpired() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
                oModel.setProperty("/activeKpiFilter", "EXPIRED");
                oModel.setProperty("/historyFilterTitle", "Expired");
                oModel.setProperty("/historyFilterSubtitle", "Showing expired and revoked entitlements.");
                oModel.setProperty("/historyFilterIcon", "sap-icon://history");
                oModel.setProperty("/historyFilterAvatarColor", "Accent9");
                oModel.setProperty("/filteredHistoryCount", oModel.getProperty("/expiredHistoryCount") || 0);
            }
            const oTable = this.byId("myRequestsUnifiedTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (Filter, FilterOperator, MessageToast) => {
                        oBinding.filter([
                            new Filter({
                                filters: [
                                    new Filter("status", FilterOperator.Contains, "Expired"),
                                    new Filter("status", FilterOperator.Contains, "Revoke")
                                ],
                                and: false
                            })
                        ]);
                        MessageToast.show("Filtered by Expired / Revoked requests.");
                    });
                }
            }
        },

                onFilterHistoryByRemoved() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
                oModel.setProperty("/activeKpiFilter", "REMOVED");
                oModel.setProperty("/historyFilterTitle", "Removed Access History");
                oModel.setProperty("/historyFilterSubtitle", "Historical log of all revoked and removed access entitlements.");
                oModel.setProperty("/historyFilterIcon", "sap-icon://delete");
                oModel.setProperty("/historyFilterAvatarColor", "Accent2");
                oModel.setProperty("/filteredHistoryCount", oModel.getProperty("/removedHistoryCount") || 0);
            }
            const oTable = this.byId("myRequestsUnifiedTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (Filter, FilterOperator, MessageToast) => {
                        oBinding.filter([
                            new Filter({
                                filters: [
                                    new Filter("type", FilterOperator.Contains, "Revocation"),
                                    new Filter("type", FilterOperator.Contains, "Removal"),
                                    new Filter("type", FilterOperator.Contains, "Revoke"),
                                    new Filter("function", FilterOperator.Contains, "Revocation"),
                                    new Filter("status", FilterOperator.Contains, "Revoke"),
                                    new Filter("status", FilterOperator.Contains, "Expired"),
                                    new Filter("status", FilterOperator.Contains, "Removed")
                                ],
                                and: false
                            })
                        ]);
                        MessageToast.show("Filtered by Removed / Revoked access requests.");
                    });
                }
            }
        },

        onFilterHistoryByApproved() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
                oModel.setProperty("/activeKpiFilter", "APPROVED");
                oModel.setProperty("/historyFilterTitle", "Approved");
                oModel.setProperty("/historyFilterSubtitle", "Showing approved and active entitlements.");
                oModel.setProperty("/historyFilterIcon", "sap-icon://sys-enter-2");
                oModel.setProperty("/historyFilterAvatarColor", "Accent8");
                oModel.setProperty("/filteredHistoryCount", oModel.getProperty("/approvedHistoryCount") || 0);
            }
            const oTable = this.byId("myRequestsUnifiedTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
                        oBinding.filter([
                            new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.Contains, "Approved")
                        ]);
                        MessageToast.show("Filtered by Approved requests.");
                    });
                }
            }
        },

        onFilterHistoryByRejected() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
                oModel.setProperty("/activeKpiFilter", "REJECTED");
                oModel.setProperty("/historyFilterTitle", "Rejected");
                oModel.setProperty("/historyFilterSubtitle", "Showing rejected access requests.");
                oModel.setProperty("/historyFilterIcon", "sap-icon://error");
                oModel.setProperty("/historyFilterAvatarColor", "Accent2");
                oModel.setProperty("/filteredHistoryCount", oModel.getProperty("/rejectedHistoryCount") || 0);
            }
            const oTable = this.byId("myRequestsUnifiedTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (Filter, FilterOperator, MessageToast) => {
                        oBinding.filter([
                            new Filter("status", FilterOperator.Contains, "Reject")
                        ]);
                        MessageToast.show("Filtered by Rejected requests.");
                    });
                }
            }
        },

        onCloseHistorySection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", false);
            }
            const oContainer = this.byId("historySectionContainer");
            if (oContainer) {
                oContainer.setVisible(false);
            }
        },

        onFilterHistoryDialog() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            sap.ui.require([
                "sap/m/Dialog",
                "sap/m/DatePicker",
                "sap/m/VBox",
                "sap/m/HBox",
                "sap/m/Label",
                "sap/m/Title",
                "sap/m/Text",
                "sap/m/Avatar",
                "sap/m/Button",
                "sap/ui/model/Filter",
                "sap/ui/model/FilterOperator",
                "sap/m/MessageToast"
            ], (Dialog, DatePicker, VBox, HBox, Label, Title, Text, Avatar, Button, Filter, FilterOperator, MessageToast) => {

                const aOptions = [
                    { key: "ALL", title: "All History", desc: "Show all submitted & historical requests", icon: "sap-icon://history", colorClass: "kyraHistIcon_blue" },
                    { key: "PERMANENT", title: "Permanent", desc: "Standard continuous access requests", icon: "sap-icon://shield", colorClass: "kyraHistIcon_blue" },
                    { key: "30DAYS", title: "30 Days", desc: "Temporary 30-day access requests", icon: "sap-icon://appointment-2", colorClass: "kyraHistIcon_blue" },
                    { key: "90DAYS", title: "90 Days", desc: "Project-based 90-day access requests", icon: "sap-icon://calendar", colorClass: "kyraHistIcon_blue" },
                    { key: "CUSTOM", title: "Custom Date Range", desc: "Filter by specific start & end dates", icon: "sap-icon://date-time", colorClass: "kyraHistIcon_blue" }
                ];

                // Multiple selection state
                const oSelectionState = {
                    ALL: true,
                    PERMANENT: false,
                    "30DAYS": false,
                    "90DAYS": false,
                    CUSTOM: false
                };

                const oStartDatePicker = new DatePicker({
                    placeholder: "Select start date (dd-MM-yyyy)",
                    displayFormat: "dd-MM-yyyy",
                    valueFormat: "yyyy-MM-dd",
                    width: "100%"
                }).addStyleClass("kyraHistDatePicker");

                const oEndDatePicker = new DatePicker({
                    placeholder: "Select end date (dd-MM-yyyy)",
                    displayFormat: "dd-MM-yyyy",
                    valueFormat: "yyyy-MM-dd",
                    width: "100%"
                }).addStyleClass("kyraHistDatePicker");

                const oCustomDateSection = new VBox({
                    visible: false,
                    items: [
                        new HBox({
                            justifyContent: "SpaceBetween",
                            gap: "14px",
                            items: [
                                new VBox({
                                    width: "48%",
                                    items: [
                                        new Label({ text: "Start Date", required: true }).addStyleClass("kyraHistFieldLabel"),
                                        oStartDatePicker
                                    ]
                                }),
                                new VBox({
                                    width: "48%",
                                    items: [
                                        new Label({ text: "End Date", required: true }).addStyleClass("kyraHistFieldLabel"),
                                        oEndDatePicker
                                    ]
                                })
                            ]
                        })
                    ]
                }).addStyleClass("kyraHistCustomDateWrapper sapUiSmallMarginTop");

                const aRowItems = [];

                const updateUI = () => {
                    aRowItems.forEach(item => {
                        const bSelected = !!oSelectionState[item.key];
                        if (bSelected) {
                            item.row.addStyleClass("kyraHistMultiRowSelected");
                        } else {
                            item.row.removeStyleClass("kyraHistMultiRowSelected");
                        }
                    });
                    oCustomDateSection.setVisible(!!oSelectionState.CUSTOM);
                };

                const toggleKey = (sKey) => {
                    if (sKey === "ALL") {
                        oSelectionState.ALL = true;
                        oSelectionState.PERMANENT = false;
                        oSelectionState["30DAYS"] = false;
                        oSelectionState["90DAYS"] = false;
                    } else if (sKey === "CUSTOM") {
                        oSelectionState.CUSTOM = !oSelectionState.CUSTOM;
                    } else {
                        oSelectionState[sKey] = !oSelectionState[sKey];
                        oSelectionState.ALL = false;

                        const bAnyDurationChecked = oSelectionState.PERMANENT || oSelectionState["30DAYS"] || oSelectionState["90DAYS"];
                        if (!bAnyDurationChecked) {
                            oSelectionState.ALL = true;
                        }
                    }
                    updateUI();
                };

                aOptions.forEach(opt => {
                    const oCheckIndicator = new sap.ui.core.HTML({
                        content: '<div class="kyraCheckboxSquare"><span class="kyraCheckMark">✓</span></div>'
                    });

                    const oIconAvatar = new Avatar({
                        src: opt.icon,
                        displaySize: "XS"
                    }).addStyleClass("kyraHistIconAvatar " + opt.colorClass);

                    const oTitle = new Text({
                        text: opt.title
                    }).addStyleClass("kyraHistRowTitle");

                    const oSubtitle = new Text({
                        text: opt.desc
                    }).addStyleClass("kyraHistRowSubtitle");

                    const oTextCol = new VBox({
                        items: [oTitle, oSubtitle]
                    }).addStyleClass("kyraHistRowTextCol");

                    const oLeftBox = new HBox({
                        alignItems: "Center",
                        gap: "14px",
                        items: [oIconAvatar, oTextCol]
                    }).addStyleClass("kyraHistRowLeft");

                    const oRow = new HBox({
                        alignItems: "Center",
                        justifyContent: "SpaceBetween",
                        items: [oLeftBox, oCheckIndicator]
                    }).addStyleClass("kyraHistMultiRow");

                    if (opt.key === "ALL") {
                        oRow.addStyleClass("kyraHistMultiRowSelected");
                    }

                    oRow.addEventDelegate({
                        onclick: () => toggleKey(opt.key)
                    });

                    aRowItems.push({
                        key: opt.key,
                        row: oRow
                    });
                });

                const oListContainer = new VBox({
                    items: aRowItems.map(item => item.row)
                }).addStyleClass("kyraHistMultiList");

                const applySelectedFilter = () => {
                    const sActiveKpi = String(oModel.getProperty("/activeKpiFilter") || oModel.getProperty("/historyFilterTitle") || "ALL").toUpperCase();
                    const aDurationLabels = [];

                    if (!oSelectionState.ALL) {
                        if (oSelectionState.PERMANENT) aDurationLabels.push("Permanent");
                        if (oSelectionState["30DAYS"]) aDurationLabels.push("30 Days");
                        if (oSelectionState["90DAYS"]) aDurationLabels.push("90 Days");
                    }

                    const aLabels = [].concat(aDurationLabels);

                    let dFrom = null;
                    let dTo = null;
                    if (oSelectionState.CUSTOM) {
                        const dStart = oStartDatePicker.getDateValue();
                        const dEnd = oEndDatePicker.getDateValue() || dStart;
                        if (!dStart) {
                            MessageToast.show("Please select a Start Date.");
                            return;
                        }
                        dFrom = new Date(dStart);
                        dFrom.setHours(0, 0, 0, 0);
                        dTo = new Date(dEnd);
                        dTo.setHours(23, 59, 59, 999);
                        aLabels.push(dStart.toLocaleDateString() + " - " + dEnd.toLocaleDateString());
                    }

                    // 1. Status Filter from Active KPI Card Selection
                    let oStatusUI5Filter = null;
                    if (sActiveKpi.includes("REJECT")) {
                        oStatusUI5Filter = new Filter("status", FilterOperator.Contains, "Reject");
                    } else if (sActiveKpi.includes("APPROV")) {
                        oStatusUI5Filter = new Filter("status", FilterOperator.Contains, "Approv");
                    } else if (sActiveKpi.includes("PENDING")) {
                        oStatusUI5Filter = new Filter("status", FilterOperator.Contains, "Pending");
                    } else if (sActiveKpi.includes("EXPIRED") || sActiveKpi.includes("EXPAIR")) {
                        oStatusUI5Filter = new Filter({
                            filters: [
                                new Filter("status", FilterOperator.Contains, "Expired"),
                                new Filter("status", FilterOperator.Contains, "Revoke")
                            ],
                            and: false
                        });
                    }

                    // 2. Duration UI5 Filter Objects
                    const aDurationUI5Filters = [];
                    if (!oSelectionState.ALL && aDurationLabels.length > 0) {
                        if (oSelectionState.PERMANENT) {
                            aDurationUI5Filters.push(new Filter("accessDuration", FilterOperator.Contains, "Permanent"));
                            aDurationUI5Filters.push(new Filter("duration", FilterOperator.Contains, "Permanent"));
                            aDurationUI5Filters.push(new Filter("accessDuration", FilterOperator.Contains, "Default"));
                        }
                        if (oSelectionState["30DAYS"]) {
                            aDurationUI5Filters.push(new Filter("accessDuration", FilterOperator.Contains, "30"));
                            aDurationUI5Filters.push(new Filter("duration", FilterOperator.Contains, "30"));
                        }
                        if (oSelectionState["90DAYS"]) {
                            aDurationUI5Filters.push(new Filter("accessDuration", FilterOperator.Contains, "90"));
                            aDurationUI5Filters.push(new Filter("duration", FilterOperator.Contains, "90"));
                        }
                    }

                    let oDurationCombined = null;
                    if (aDurationUI5Filters.length > 0) {
                        oDurationCombined = new Filter({
                            filters: aDurationUI5Filters,
                            and: false
                        });
                    }

                    let oDateCombined = null;
                    if (dFrom && dTo) {
                        oDateCombined = new Filter({
                            path: "submissionDate",
                            test: (sVal) => {
                                if (!sVal) return false;
                                const d = new Date(sVal);
                                return !isNaN(d.getTime()) && d >= dFrom && d <= dTo;
                            }
                        });
                    }

                    const aFinalUI5Filters = [];
                    if (oStatusUI5Filter) aFinalUI5Filters.push(oStatusUI5Filter);
                    if (oDurationCombined) aFinalUI5Filters.push(oDurationCombined);
                    if (oDateCombined) aFinalUI5Filters.push(oDateCombined);

                    // 3. Direct Model Array Filtering (dual-layer fallback)
                    const matchesItem = (item) => {
                        if (!item) return false;

                        // Check status against active KPI card selection
                        if (sActiveKpi.includes("REJECT")) {
                            const sStat = String(item.status || "").toLowerCase();
                            if (!sStat.includes("reject")) return false;
                        } else if (sActiveKpi.includes("APPROV")) {
                            const sStat = String(item.status || "").toLowerCase();
                            if (!sStat.includes("approved") && !sStat.includes("active")) return false;
                        } else if (sActiveKpi.includes("PENDING")) {
                            const sStat = String(item.status || "").toLowerCase();
                            if (!sStat.includes("pending")) return false;
                        } else if (sActiveKpi.includes("EXPIRED") || sActiveKpi.includes("EXPAIR")) {
                            const sStat = String(item.status || "").toLowerCase();
                            if (!sStat.includes("expired") && !sStat.includes("revoke")) return false;
                        }

                        // Check duration
                        const sDur = String(item.accessDuration || item.duration || item.access_duration || "").toLowerCase();
                        if (!oSelectionState.ALL && aDurationLabels.length > 0) {
                            let bDurMatch = false;
                            if (oSelectionState.PERMANENT && (sDur.includes("permanent") || sDur.includes("default") || sDur.includes("continuous"))) {
                                bDurMatch = true;
                            }
                            if (oSelectionState["30DAYS"]) {
                                if (sDur.includes("30")) bDurMatch = true;
                            }
                            if (oSelectionState["90DAYS"]) {
                                if (sDur.includes("90")) bDurMatch = true;
                            }
                            if (!bDurMatch) return false;
                        }

                        // Check custom date range
                        if (dFrom && dTo) {
                            const sDateStr = item.submissionDate || item.createdAtRaw || item.created_at || item.submission_timestamp || item.grantedDate || item.decisionDate;
                            if (!sDateStr) return false;
                            const d = new Date(sDateStr);
                            if (isNaN(d.getTime()) || d < dFrom || d > dTo) return false;
                        }

                        return true;
                    };

                    if (!this._masterMyHistoryRequests && oModel.getProperty("/myHistoryRequests")) {
                        this._masterMyHistoryRequests = [].concat(oModel.getProperty("/myHistoryRequests") || []);
                    }
                    if (!this._masterPendingAccessRequests && oModel.getProperty("/pendingAccessRequests")) {
                        this._masterPendingAccessRequests = [].concat(oModel.getProperty("/pendingAccessRequests") || []);
                    }
                    if (!this._masterPendingRequests && oModel.getProperty("/pendingRequests")) {
                        this._masterPendingRequests = [].concat(oModel.getProperty("/pendingRequests") || []);
                    }
                    if (!this._masterProcessedRequests && oModel.getProperty("/processedRequests")) {
                        this._masterProcessedRequests = [].concat(oModel.getProperty("/processedRequests") || []);
                    }

                    if (oSelectionState.ALL && !oSelectionState.CUSTOM && (sActiveKpi === "ALL" || sActiveKpi === "ALL HISTORY")) {
                        if (this._masterMyHistoryRequests) oModel.setProperty("/myHistoryRequests", [].concat(this._masterMyHistoryRequests));
                        if (this._masterPendingAccessRequests) {
                            oModel.setProperty("/pendingAccessRequests", [].concat(this._masterPendingAccessRequests));
                            oModel.setProperty("/pendingAccessCount", this._masterPendingAccessRequests.length);
                        }
                        if (this._masterPendingRequests) oModel.setProperty("/pendingRequests", [].concat(this._masterPendingRequests));
                        if (this._masterProcessedRequests) oModel.setProperty("/processedRequests", [].concat(this._masterProcessedRequests));

                        const aTableIds = ["myRequestsUnifiedTable", "approvalAccessTable", "approvalRevokeTable", "approvalHistoryTable"];
                        aTableIds.forEach(sTableId => {
                            const oTable = this.byId ? this.byId(sTableId) : (this.getView() && this.getView().byId(sTableId));
                            if (oTable && oTable.getBinding("items")) {
                                oTable.getBinding("items").filter([]);
                            }
                        });

                        oModel.setProperty("/historyFilterSubtitle", "All submitted and historical access requests.");
                        MessageToast.show("Showing all history requests.");
                        oDialog.close();
                        return;
                    }

                    if (this._masterMyHistoryRequests) {
                        const aFiltered = this._masterMyHistoryRequests.filter(matchesItem);
                        oModel.setProperty("/myHistoryRequests", aFiltered);
                    }
                    if (this._masterPendingAccessRequests) {
                        const aFiltered = this._masterPendingAccessRequests.filter(matchesItem);
                        oModel.setProperty("/pendingAccessRequests", aFiltered);
                        oModel.setProperty("/pendingAccessCount", aFiltered.length);
                    }
                    if (this._masterPendingRequests) {
                        const aFiltered = this._masterPendingRequests.filter(matchesItem);
                        oModel.setProperty("/pendingRequests", aFiltered);
                    }
                    if (this._masterProcessedRequests) {
                        const aFiltered = this._masterProcessedRequests.filter(matchesItem);
                        oModel.setProperty("/processedRequests", aFiltered);
                    }

                    const aTableIds = ["myRequestsUnifiedTable", "approvalAccessTable", "approvalRevokeTable", "approvalHistoryTable"];
                    aTableIds.forEach(sTableId => {
                        const oTable = this.byId ? this.byId(sTableId) : (this.getView() && this.getView().byId(sTableId));
                        if (oTable && oTable.getBinding("items")) {
                            oTable.getBinding("items").filter(aFinalUI5Filters);
                        }
                    });

                    const sSectionLabel = (sActiveKpi === "ALL" || sActiveKpi === "ALL HISTORY") ? "" : (sActiveKpi + " requests");
                    const sFilterSummary = aLabels.length > 0 ? aLabels.join(", ") : "All Duration";
                    const sFinalMsg = sSectionLabel ? (sSectionLabel + " filtered by: " + sFilterSummary) : ("Filtered by: " + sFilterSummary);
                    oModel.setProperty("/historyFilterSubtitle", sFinalMsg);
                    MessageToast.show(sFinalMsg);
                    oDialog.close();
                };

                // Header
                const oHeader = new HBox({
                    justifyContent: "SpaceBetween",
                    alignItems: "Center",
                    items: [
                        new HBox({
                            alignItems: "Center",
                            items: [
                                new Avatar({
                                    src: "sap-icon://filter",
                                    displaySize: "S"
                                }).addStyleClass("kyraHistHeaderAvatar sapUiSmallMarginEnd"),
                                new VBox({
                                    items: [
                                        new Title({ text: "Filter History & Audit Reports", level: "H4" }).addStyleClass("kyraHistHeaderTitle"),
                                        new Text({ text: "Select one or more filters or date range to generate your report" }).addStyleClass("kyraHistHeaderSubtitle")
                                    ]
                                })
                            ]
                        }),
                        new Button({
                            icon: "sap-icon://decline",
                            type: "Transparent",
                            press: () => oDialog.close(),
                            tooltip: "Close"
                        }).addStyleClass("kyraHistCloseBtn")
                    ]
                }).addStyleClass("kyraHistDialogHeader sapUiSmallMarginBottom");

                // Footer
                const oFooter = new HBox({
                    justifyContent: "SpaceBetween",
                    alignItems: "Center",
                    items: [
                        new Button({
                            text: "Reset Filter",
                            icon: "sap-icon://refresh",
                            type: "Transparent",
                            press: () => {
                                toggleKey("ALL");
                                oStartDatePicker.setDateValue(null);
                                oEndDatePicker.setDateValue(null);
                            }
                        }).addStyleClass("kyraHistResetBtn"),
                        new HBox({
                            alignItems: "Center",
                            items: [
                                new Button({
                                    text: "Cancel",
                                    press: () => oDialog.close()
                                }).addStyleClass("kyraHistCancelBtn sapUiTinyMarginEnd"),
                                new Button({
                                    text: "Apply Filter",
                                    type: "Emphasized",
                                    press: applySelectedFilter
                                }).addStyleClass("kyraHistApplyBtn")
                            ]
                        }).addStyleClass("kyraHistFooterRight")
                    ]
                }).addStyleClass("kyraHistDialogFooter sapUiSmallMarginTop");

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "500px",
                    content: [
                        new VBox({
                            items: [
                                oHeader,
                                oListContainer,
                                oCustomDateSection,
                                oFooter
                            ]
                        }).addStyleClass("sapUiNoMargin")
                    ],
                    afterClose: () => oDialog.destroy()
                }).addStyleClass("kyraModernHistoryFilterDialog");

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onProfilePress(oEvent) {
            let oSource = this.byId("kyraHeaderProfileAvatar");
            if (!oSource) {
                oSource = oEvent.getSource ? oEvent.getSource() : oEvent.getParameter("item");
            }

            const oModel = this.getView().getModel("accessModel");
            const sUser = (oModel ? oModel.getProperty("/activeUser") : null) || sessionStorage.getItem("kyra_active_user") || "User";
            const sRole = (oModel ? oModel.getProperty("/activeRole") : null) || sessionStorage.getItem("kyra_active_role") || "SAP UI5 Developer";

            sap.ui.require([
                "sap/m/ResponsivePopover", "sap/ui/core/HTML", "sap/m/MessageToast"
            ], (ResponsivePopover, HTML, MessageToast) => {
                
                const sHtmlContent = `
                    <div class="kyra-modern-profile-popup">
                        <!-- Header -->
                        <div class="kyra-profile-header">
                            <div class="kyra-avatar-circle">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div class="kyra-profile-user-info">
                                <div class="kyra-user-name">${sUser}</div>
                                <div class="kyra-user-subtitle">${sRole}</div>
                                <div class="kyra-user-empid">Employee ID: 20000101</div>
                                <div class="kyra-user-status"><span class="kyra-status-dot"></span> Active</div>
                            </div>
                        </div>

                        <div class="kyra-menu-separator"></div>

                        <!-- ACCOUNT -->
                        <div class="kyra-section-title">ACCOUNT</div>
                        <div class="kyra-menu-item" id="kyra_menu_profile">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span class="kyra-item-label">My Profile</span>
                            </div>
                            <span class="kyra-arrow">›</span>
                        </div>
                        <div class="kyra-menu-item" id="kyra_menu_access">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <span class="kyra-item-label">My Access</span>
                            </div>
                            <span class="kyra-arrow">›</span>
                        </div>
                        <div class="kyra-menu-item" id="kyra_menu_requests">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span class="kyra-item-label">My Requests</span>
                            </div>
                            <span class="kyra-arrow">›</span>
                        </div>
                        <div class="kyra-menu-item" id="kyra_menu_history">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span class="kyra-item-label">Request History</span>
                            </div>
                            <span class="kyra-arrow">›</span>
                        </div>

                        <div class="kyra-menu-separator"></div>

                        <!-- PREFERENCES -->
                        <div class="kyra-section-title">PREFERENCES</div>
                        <div class="kyra-menu-item" id="kyra_menu_lang">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                                <span class="kyra-item-label">Language</span>
                            </div>
                            <div class="kyra-menu-right">
                                <span class="kyra-right-badge">English</span>
                                <span class="kyra-arrow">›</span>
                            </div>
                        </div>

                        <div class="kyra-menu-separator"></div>

                        <!-- SUPPORT -->
                        <div class="kyra-section-title">SUPPORT</div>
                        <div class="kyra-menu-item" id="kyra_menu_help">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                <span class="kyra-item-label">Help</span>
                            </div>
                            <span class="kyra-arrow">›</span>
                        </div>
                        <div class="kyra-menu-item" id="kyra_menu_contact">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                </svg>
                                <span class="kyra-item-label">Contact IT</span>
                            </div>
                            <span class="kyra-arrow">›</span>
                        </div>

                        <div class="kyra-menu-separator"></div>

                        <!-- SESSION -->
                        <div class="kyra-section-title">SESSION</div>
                        <div class="kyra-menu-item kyra-signout-item" id="kyra_menu_signout">
                            <div class="kyra-menu-left">
                                <svg class="kyra-icon-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span class="kyra-item-label kyra-signout-label">Sign Out</span>
                            </div>
                        </div>

                        <div class="kyra-menu-separator"></div>

                        <!-- FOOTER -->
                        <div class="kyra-profile-footer">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <div class="kyra-footer-text">
                                <div class="kyra-footer-title">SAP Fiori Access Portal</div>
                                <div class="kyra-footer-ver">Version 1.0.0</div>
                            </div>
                        </div>
                    </div>
                `;

                const oPopover = new ResponsivePopover({
                    showHeader: false,
                    contentWidth: "320px",
                    horizontalScrolling: false,
                    verticalScrolling: true,
                    placement: "Bottom",
                    showArrow: true,
                    class: "kyraUserProfilePopover",
                    content: [
                        new HTML({ content: sHtmlContent, preferDOM: false })
                    ],
                    afterClose: () => oPopover.destroy()
                });

                this.getView().addDependent(oPopover);
                if (oSource) {
                    oPopover.openBy(oSource);
                }

                setTimeout(() => {
                    const attachClick = (id, fn) => {
                        const el = document.getElementById(id);
                        if (el) {
                            el.onclick = () => {
                                oPopover.close();
                                fn();
                            };
                        }
                    };

                    attachClick("kyra_menu_profile", () => {
                        this._showMyProfileDetailsDialog();
                    });

                    attachClick("kyra_menu_access", () => {
                        this._confirmDiscardAddAccess(() => {
                            oModel.setProperty("/selectedTabKey", "myAccess");
                            oModel.setProperty("/showAddAccessSector", false);
                            oModel.setProperty("/showRemoveAccessSector", false);
                            oModel.setProperty("/showMyAccessMasterSection", false);
                        });
                    });

                    attachClick("kyra_menu_requests", () => {
                        this._confirmDiscardAddAccess(() => {
                            oModel.setProperty("/selectedTabKey", "myRequests");
                            oModel.setProperty("/showAddAccessSector", false);
                            oModel.setProperty("/showRemoveAccessSector", false);
                            oModel.setProperty("/showMyAccessMasterSection", false);
                        });
                    });

                    attachClick("kyra_menu_history", () => {
                        this._confirmDiscardAddAccess(() => {
                            oModel.setProperty("/selectedTabKey", "myRequests");
                            oModel.setProperty("/showAddAccessSector", false);
                            oModel.setProperty("/showRemoveAccessSector", false);
                            oModel.setProperty("/showMyAccessMasterSection", false);
                        });
                    });

                    attachClick("kyra_menu_lang", () => {
                        MessageToast.show("Language set to English (United States)");
                    });

                    attachClick("kyra_menu_help", () => {
                        this.onOpenHelpPage();
                    });

                    attachClick("kyra_menu_contact", () => {
                        this.onOpenHelpPage();
                    });

                    attachClick("kyra_menu_signout", () => {
                        this.onLogout();
                    });
                }, 50);
            });
        },

        _showMyProfileDetailsDialog() {
            const oModel = this.getView().getModel("accessModel");
            const sUser = (oModel ? oModel.getProperty("/activeUser") : null) || sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sRole = (oModel ? oModel.getProperty("/activeRole") : null) || sessionStorage.getItem("kyra_active_role") || "SAP UI5 Lead Developer";
            const iAccessCount = oModel ? ((oModel.getProperty("/userAccessList") || []).length) : 14;

            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlModal = `
                    <div class="kyra-profile-modal-card">
                        <!-- Top Header -->
                        <div class="kyra-profile-modal-head">
                            <div class="kyra-profile-modal-title-box">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span class="kyra-profile-modal-head-title">User Profile & Identity Overview</span>
                            </div>
                            <button type="button" class="kyra-profile-modal-close" id="kyra_modal_profile_close_x">✕</button>
                        </div>

                        <!-- User Hero Summary -->
                        <div class="kyra-profile-modal-hero">
                            <div class="kyra-profile-modal-avatar">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div class="kyra-profile-modal-info">
                                <div class="kyra-profile-modal-name-row">
                                    <span class="kyra-profile-modal-name">${sUser}</span>
                                    <span class="kyra-profile-modal-status-badge"><span class="kyra-modal-status-dot"></span> Active Employee</span>
                                </div>
                                <div class="kyra-profile-modal-role">${sRole}</div>
                                <div class="kyra-profile-modal-email">dev001.kyra@enterprise.local &bull; EMP-20000101</div>
                            </div>
                        </div>

                        <!-- 2-Column Info Grid -->
                        <div class="kyra-profile-modal-grid">
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Department</span>
                                <span class="kyra-profile-val">Digital Enterprise Engineering</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Organization Unit</span>
                                <span class="kyra-profile-val">KYRA Foods &amp; Beverages IT Global</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Cost Center</span>
                                <span class="kyra-profile-val">CC-88201-GLOBAL</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Direct Manager</span>
                                <span class="kyra-profile-val">Sarah Jenkins (Lead Architect)</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Security Clearance</span>
                                <span class="kyra-profile-val">Level 3 Enterprise (Audited)</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">MFA Authentication</span>
                                <span class="kyra-profile-val" style="color:#16A34A;font-weight:700;">✓ Enabled (FIDO2 Token)</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Active Entitlements</span>
                                <span class="kyra-profile-val">${iAccessCount} Active System Roles</span>
                            </div>
                            <div class="kyra-profile-grid-item">
                                <span class="kyra-profile-label">Audit Compliance</span>
                                <span class="kyra-profile-val" style="color:#16A34A;font-weight:700;">✓ 100% Audit Verified</span>
                            </div>
                        </div>

                        <!-- Bottom Actions -->
                        <div class="kyra-profile-modal-footer">
                            <button type="button" class="kyra-profile-btn-outline" id="kyra_modal_profile_export_btn">Export Profile Summary</button>
                            <button type="button" class="kyra-profile-btn-primary" id="kyra_modal_profile_close_btn">Close</button>
                        </div>
                    </div>
                `;

                const oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "520px",
                    class: "kyraProfileDetailsModalDialog",
                    content: [
                        new HTML({ content: sHtmlModal, preferDOM: false })
                    ],
                    afterClose: () => oDialog.destroy()
                });

                this.getView().addDependent(oDialog);
                oDialog.open();

                setTimeout(() => {
                    const closeFn = () => oDialog.close();
                    const closeX = document.getElementById("kyra_modal_profile_close_x");
                    if (closeX) closeX.onclick = closeFn;
                    const closeBtn = document.getElementById("kyra_modal_profile_close_btn");
                    if (closeBtn) closeBtn.onclick = closeFn;
                    const exportBtn = document.getElementById("kyra_modal_profile_export_btn");
                    if (exportBtn) {
                        exportBtn.onclick = () => {
                            MessageToast.show("Exporting profile summary PDF...");
                            setTimeout(closeFn, 600);
                        };
                    }
                }, 50);
            });
        },

        onLogout() {
            // 1. Clear session storage & credentials
            sessionStorage.removeItem("kyra_active_user");
            sessionStorage.removeItem("kyra_active_role");
            sessionStorage.removeItem("kyra_active_user_uuid");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            sessionStorage.removeItem("kyra_reset_add_access");
            sessionStorage.clear();
            localStorage.removeItem("kyra_remember_id");
            localStorage.removeItem("kyra_remember_role");

            // 2. Reset global model properties
            const oAccessModel = this.getOwnerComponent().getModel("accessModel") || this.getView().getModel("accessModel");
            if (oAccessModel) {
                oAccessModel.setProperty("/activeUser", "");
                oAccessModel.setProperty("/activeRole", "Requester");
                oAccessModel.setProperty("/isApproverPersona", false);
                oAccessModel.setProperty("/showAddAccessSector", false);
                oAccessModel.setProperty("/showRemoveAccessSector", false);
                oAccessModel.setProperty("/showMyAccessMasterSection", false);
                oAccessModel.setProperty("/showPendingSection", false);
                oAccessModel.setProperty("/showApprovedSection", false);
                oAccessModel.setProperty("/selectedTabKey", "myAccess");
                oAccessModel.setProperty("/activeRoles", []);
                oAccessModel.setProperty("/userAccessList", []);
                oAccessModel.setProperty("/myApprovedRequests", []);
                oAccessModel.setProperty("/myPendingRequests", []);
                oAccessModel.setProperty("/requestHistory", []);
            }

            MessageToast.show("Signed out successfully.");

            // 3. SAPUI5 Router navigation & Target Display to Login page
            try {
                const oRouter = this.getOwnerComponent() ? this.getOwnerComponent().getRouter() : null;
                if (oRouter) {
                    oRouter.navTo("Login", {}, true);
                    if (oRouter.getTargets()) {
                        oRouter.getTargets().display("TargetLogin");
                    }
                }
            } catch (e) {
                console.warn("Logout router nav error:", e);
            }

            // 4. Reset Login view state
            try {
                const oRoot = this.getOwnerComponent() ? this.getOwnerComponent().getRootControl() : null;
                if (oRoot && oRoot.byId) {
                    const oApp = oRoot.byId("app");
                    if (oApp && oApp.getPages) {
                        const oLoginPage = oApp.getPages().find(p => p.getId().includes("Login"));
                        if (oLoginPage) {
                            oApp.to(oLoginPage);
                        }
                    }
                }
            } catch(e) {}
        }
    });
});
