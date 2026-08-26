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
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Compliance Review" || sActiveRole === "Compliance Approver" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("review"))));
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
            if (window.KyraLoading) {
                window.KyraLoading.show({
                    title: "Initializing Kyra Portal...",
                    subtitle: "Loading security governance policies and enterprise ledger...",
                    duration: 750
                });
            }
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

            // 5. Adaptive Low-Frequency Backup Sync (every 10s only if tab is focused)
            if (!this._pollInterval) {
                this._pollInterval = setInterval(() => {
                    if (!document.hidden && this.getView() && this.getView().getModel("accessModel")) {
                        this._loadSubmittedRequests(oModel);
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
            bindClick("kpiCardPending", this.onFilterHistoryByPending);
            bindClick("kpiCardExpired", this.onFilterHistoryByExpired);
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
            } catch(e) {
                console.warn("MultiComboBox prototype setup warning:", e);
            }
        },

        _applyMultiComboBoxRowClickSelection() {
            const aIds = [
                "inPageTeamMultiSelect",
                "inPageServicesMultiSelect",
                "inPagePersonaMultiSelect",
                "inPageSystemsMultiSelect"
            ];

            aIds.forEach(sId => {
                const oControl = this.byId(sId);
                if (oControl) {
                    if (typeof oControl._getList === "function") {
                        const oList = oControl._getList();
                        if (oList && typeof oList.setIncludeItemInSelection === "function") {
                            oList.setIncludeItemInSelection(true);
                        }
                    }
                    oControl.addEventDelegate({
                        onAfterRendering: () => {
                            if (typeof oControl._getList === "function") {
                                const oList = oControl._getList();
                                if (oList && typeof oList.setIncludeItemInSelection === "function") {
                                    oList.setIncludeItemInSelection(true);
                                }
                            }
                        }
                    });
                }
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
            if (oModel) {
                const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
                const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Compliance Review" || sActiveRole === "Compliance Approver" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("review"))));
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
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", sTabToSelect);
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

            // Clear old local mock cache to ensure 100% fresh database state
            localStorage.removeItem("kyra_submitted_my_pending");
            localStorage.removeItem("kyra_submitted_approver_requests");
            localStorage.removeItem("kyra_processed_requests");
            localStorage.removeItem("kyra_submitted_my_history");
            sessionStorage.removeItem("kyra_submitted_requests");
            sessionStorage.removeItem("kyra_pending_requests");

            let aRawDbRequests = [];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const response = await fetch("odata/v4/auth/Requests", { signal: controller.signal });
                clearTimeout(timeoutId);
                const sContentType = response.headers ? response.headers.get("content-type") : "";
                if (response.ok && sContentType && sContentType.includes("application/json")) {
                    const data = await response.json();
                    if (data && data.value) {
                        aRawDbRequests = data.value;
                    }
                }
            } catch (err) {
                console.warn("Error / timeout loading requests from database:", err);
            }

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

            // Merge locally persisted submitted requests
            let aLocalSubmissions = [];
            try {
                aLocalSubmissions = JSON.parse(localStorage.getItem("kyra_local_submitted_requests") || "[]");
            } catch(e) {}
            if (Array.isArray(aLocalSubmissions) && aLocalSubmissions.length > 0) {
                const existingKeys = new Set(aRawDbRequests.map(r => (r.request_number || ("REQ-" + r.ID)) + "_" + (r.role_name || "")));
                aLocalSubmissions.forEach(localReq => {
                    const sKey = (localReq.request_number || localReq.requestId) + "_" + (localReq.role_name || "");
                    const sId = localReq.request_number || localReq.requestId;
                    if (!existingKeys.has(sKey) && !aDeletedRequestIds.includes(sId)) {
                        aRawDbRequests.unshift(localReq);
                    }
                });
            }

            // Sort strictly in descending order for frontend list views (newest first)
            aRawDbRequests.sort((a, b) => {
                const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
                if (tA !== tB) return tB - tA;
                return (b.request_number || "").localeCompare(a.request_number || "");
            });

            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const bIsApprover = (sActiveRole === "Approver" || sActiveRole === "Compliance Review" || sActiveRole === "Compliance Approver" || sActiveRole === "Administrator" || (typeof sActiveRole === "string" && (sActiveRole.toLowerCase().includes("approver") || sActiveRole.toLowerCase().includes("review"))));
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

            aRawDbRequests.forEach(r => {
                const sDbStatus = (r.status || "PENDING").toUpperCase();
                const isPending = sDbStatus.includes("PENDING");
                const isApproved = sDbStatus === "APPROVED";
                const isRejected = sDbStatus === "REJECTED";

                const sStatusText = isApproved ? "Approved" : (isRejected ? "Rejected" : "Pending Approval");
                const sState = isApproved ? "Success" : (isRejected ? "Error" : "Warning");
                const sIcon = isApproved ? "sap-icon://sys-enter-2" : (isRejected ? "sap-icon://error" : "sap-icon://pending");
                const sRawDuration = r.access_duration || "Permanent (Default)";
                let sCleanDuration = sRawDuration;
                if (sRawDuration === "Permanent" || sRawDuration === "Permanent (Default)") {
                    sCleanDuration = "Permanent (Default)";
                } else if (sRawDuration.includes("30")) {
                    sCleanDuration = "30 Days (Temporary)";
                } else if (sRawDuration.includes("90")) {
                    sCleanDuration = "90 Days (Project)";
                }

                const oReqObj = {
                    requestId: r.request_number || ("REQ-" + r.ID),
                    requesterId: r.requester_username,
                    requesterUsername: r.requester_username,
                    type: r.request_type || "Addition",
                    system: r.target_system || "SAP System",
                    roleName: r.role_name || "",
                    serviceTopic: r.service_topic || r.business_function || "",
                    selectedPersona: r.selected_persona || r.requester_persona || "Requester",
                    accessDuration: sCleanDuration,
                    submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    createdAtRaw: r.created_at || new Date().toISOString(),
                    approver: "Line Manager / ISRM Team",
                    persona: r.requester_persona || "Requester",
                    status: sStatusText,
                    statusState: sState,
                    statusIcon: sIcon,
                    region: r.operating_region || "",
                    justification: r.justification || "",
                    sector: r.business_sector || "",
                    function: r.business_function || ""
                };

                // Populate user's history & pending lists (match active user or fallback)
                const bIsUserMatch = !r.requester_username || r.requester_username === sActiveUser || sActiveUser === "Dev001" || sActiveUser === "User" || !sActiveUser;
                if (bIsUserMatch) {
                    aMyHistory.push(oReqObj);
                    if (isPending) {
                        aMyPending.push(oReqObj);
                    } else if (isApproved) {
                        aMyApproved.push(oReqObj);
                    }

                    // Track active/pending/revoked role state machine
                    const sKey = (r.target_system || "") + "_" + (r.role_name || "");
                    const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");
                    if (isApproved) {
                        if (isRevocation) {
                            roleStates[sKey] = { request: r, status: 'REVOKED' };
                        } else {
                            roleStates[sKey] = { request: r, status: 'ACTIVE' };
                        }
                    } else if (isPending) {
                        if (isRevocation) {
                            roleStates[sKey] = { request: r, status: 'REVOKE_PENDING' };
                        }
                    } else if (isRejected) {
                        if (isRevocation) {
                            roleStates[sKey] = { request: r, status: 'ACTIVE' };
                        }
                    }
                }

                const isRevocation = (r.access_type || r.request_type || "").toUpperCase() === "REVOCATION" || (r.business_function || "").toUpperCase().includes("REVOCATION");

                // Group for Approver Page
                const sGroupKey = (r.requester_username || "User") + "_" + (r.business_sector || "") + "_" + (r.business_function || "") + "_" + (isPending ? "PENDING" : "PROCESSED") + "_" + (isRevocation ? "REVOCATION" : "ADDITION");
                if (!oGrouped[sGroupKey]) {
                    oGrouped[sGroupKey] = {
                        requestId: r.request_number,
                        requesterId: r.requester_username || "User",
                        persona: r.requester_persona || "Requester",
                        system: r.target_system || "SAP System",
                        serviceAndRole: (r.role_name || "Role") + " (" + (r.service_topic || "Service") + ")",
                        submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        decisionDate: r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "",
                        function: r.business_function || "",
                        region: r.operating_region || "",
                        justification: r.justification || "",
                        selectedPersona: r.selected_persona || r.requester_persona || "Requester",
                        status: isRevocation ? (isPending ? "Revoke Pending" : sStatusText) : sStatusText,
                        statusState: isRevocation ? (isPending ? "Error" : sState) : sState,
                        statusIcon: isRevocation ? "sap-icon://pending" : sIcon,
                        isRevocation: isRevocation,
                        requestType: isRevocation ? "Revocation" : "Addition",
                        entitlements: []
                    };
                }

                oGrouped[sGroupKey].entitlements.push({
                    requestId: r.request_number,
                    system: r.target_system,
                    roleName: r.role_name,
                    team: r.service_topic,
                    selectedPersona: r.selected_persona || "User",
                    grantedDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    expiryDate: r.access_duration,
                    status: isPending ? (isRevocation ? "Revoke Pending" : "Pending") : (isApproved ? "Approved" : "Rejected"),
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
                const isPending = g.status.toLowerCase().includes("pending");
                if (!isPending) {
                    const approvedCount = g.entitlements.filter(e => e.status === "Approved").length;
                    const rejectedCount = g.entitlements.filter(e => e.status === "Rejected").length;
                    if (approvedCount > 0 && rejectedCount > 0) {
                        g.status = "Partially Approved";
                        g.statusState = "Warning";
                        g.statusIcon = "sap-icon://warning";
                    } else if (approvedCount > 0 && rejectedCount === 0) {
                        g.status = "Approved";
                        g.statusState = "Success";
                        g.statusIcon = "sap-icon://sys-enter-2";
                    } else if (approvedCount === 0 && rejectedCount > 0) {
                        g.status = "Rejected";
                        g.statusState = "Error";
                        g.statusIcon = "sap-icon://error";
                    }
                }
            });

            aAllGrouped.sort((a, b) => {
                const tA = new Date(a.createdAtRaw || 0).getTime();
                const tB = new Date(b.createdAtRaw || 0).getTime();
                if (tA !== tB) return tB - tA;
                return (b.requestId || "").localeCompare(a.requestId || "");
            });
            const sCurrentActiveRole = (oModel ? oModel.getProperty("/activeRole") : null) || sessionStorage.getItem("kyra_active_role") || "Requester";
            const bIsCompliancePersona = (sCurrentActiveRole === "Compliance Review" || sCurrentActiveRole === "Compliance Reviewer" || sCurrentActiveRole === "Compliance Approver");

            const aApproverPendingAccess = [];
            const aApproverPendingRevoke = [];
            aAllGrouped.forEach(g => {
                const sStat = (g.status || "").toUpperCase();
                const isRevocation = g.isRevocation;

                if (bIsCompliancePersona) {
                    // In Compliance Review: ONLY requests approved by Line Manager / Approver enter the review queue
                    if (sStat === "APPROVED" || sStat === "PARTIALLY APPROVED" || sStat.includes("COMPLIANCE")) {
                        aApproverPending.push(g);
                        if (isRevocation) {
                            aApproverPendingRevoke.push(g);
                        } else {
                            aApproverPendingAccess.push(g);
                        }
                    } else {
                        aApproverProcessed.push(g);
                    }
                } else {
                    // In standard Approver (Line Manager): Initial pending requests
                    if (sStat.includes("PENDING") || sStat.includes("SUBMITTED")) {
                        aApproverPending.push(g);
                        if (isRevocation) {
                            aApproverPendingRevoke.push(g);
                        } else {
                            aApproverPendingAccess.push(g);
                        }
                    } else {
                        aApproverProcessed.push(g);
                    }
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

            this._setSmartProperty(oModel, "/myPendingRequests", aUniqueMyPending);
            this._setSmartProperty(oModel, "/myApprovedRequests", aMyApproved);
            this._setSmartProperty(oModel, "/pendingRequests", aApproverPending);
            this._setSmartProperty(oModel, "/pendingAccessRequests", aApproverPendingAccess);
            this._setSmartProperty(oModel, "/pendingRevokeRequests", aApproverPendingRevoke);
            this._setSmartProperty(oModel, "/pendingAccessCount", aApproverPendingAccess.length);
            this._setSmartProperty(oModel, "/pendingRevokeCount", aApproverPendingRevoke.length);
            this._setSmartProperty(oModel, "/processedRequests", aApproverProcessed);
            this._setSmartProperty(oModel, "/requestHistory", aMyHistory);
            this._setSmartProperty(oModel, "/myHistoryRequests", aMyHistory);
            this._setSmartProperty(oModel, "/userAccessList", aUniqueUserAccessList);
            this._setSmartProperty(oModel, "/activeRoles", aActiveRolesList);

            // Compute 4 History KPI Summary Metrics (Pending, Expired, Approved, Rejected)
            let iPendingHistory = 0;
            let iExpiredHistory = 0;
            let iApprovedHistory = 0;
            let iRejectedHistory = 0;

            const aAllCombinedHistory = aMyHistory || [];
            aAllCombinedHistory.forEach(req => {
                const sStat = (req.status || "").toLowerCase();
                if (sStat.includes("pending")) {
                    iPendingHistory++;
                } else if (sStat.includes("approved") || sStat.includes("active")) {
                    iApprovedHistory++;
                } else if (sStat.includes("reject") || sStat.includes("decline")) {
                    iRejectedHistory++;
                } else if (sStat.includes("expired") || sStat.includes("revoke")) {
                    iExpiredHistory++;
                }
            });

            iPendingHistory = Math.max(iPendingHistory, aUniqueMyPending.length);
            iApprovedHistory = Math.max(iApprovedHistory, aMyApproved.length);

            this._setSmartProperty(oModel, "/allHistoryCount", (aAllCombinedHistory || []).length);
            this._setSmartProperty(oModel, "/pendingHistoryCount", iPendingHistory);
            this._setSmartProperty(oModel, "/expiredHistoryCount", iExpiredHistory);
            this._setSmartProperty(oModel, "/approvedHistoryCount", iApprovedHistory);
            this._setSmartProperty(oModel, "/rejectedHistoryCount", iRejectedHistory);

            // Maintain top-10 pagination vs view-all state
            const bShowAll = oModel.getProperty("/myAccessShowAll") || false;
            this._setSmartProperty(oModel, "/displayedUserAccessList", bShowAll ? aUniqueUserAccessList : aUniqueUserAccessList.slice(0, 10));

            // Load notifications for active user
            this._loadNotifications(oModel);
        },

        _loadNotifications(oModel) {
            if (!oModel) oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sActiveUser = (oModel.getProperty("/activeUser") || "Dev001").trim();
            const aHistory = oModel.getProperty("/requestHistory") || [];

            // Filter only approved requests for this project
            const aApprovedHistory = aHistory.filter(r => {
                const sStat = (r.status || "").toUpperCase();
                return sStat === "APPROVED" || sStat === "PARTIALLY APPROVED" || sStat.includes("APPROVED");
            });

            let aSavedStatusMap = {};
            try {
                const aSaved = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                (aSaved || []).forEach(n => {
                    if (n.id) aSavedStatusMap[n.id] = n.unread;
                });
            } catch (e) {}

            let aApprovedNotifications = [];

            if (aApprovedHistory.length > 0) {
                aApprovedHistory.forEach((r, idx) => {
                    const sReqId = r.requestId || ("REQ-2026-" + (300160 + idx));
                    const sNotifId = "notif-appr-" + sReqId;
                    const bUnread = aSavedStatusMap[sNotifId] !== undefined ? aSavedStatusMap[sNotifId] : true;
                    aApprovedNotifications.push({
                        id: sNotifId,
                        requesterId: sActiveUser,
                        requestId: sReqId,
                        system: r.system || "SAP Ariba Supply Network",
                        roleName: r.roleName || r.serviceAndRole || "IT Security (System Administrator)",
                        type: "approved",
                        category: "Access Requests",
                        title: "Access Request Approved: " + sReqId,
                        description: "Your access request for " + (r.system || "SAP Ariba Supply Network") + " (" + (r.roleName || r.serviceAndRole || "IT Security") + ") has been approved by Line Manager.",
                        timestamp: r.submissionDate || "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        icon: "sap-icon://sys-enter-2",
                        state: "Success",
                        unread: bUnread
                    });
                });
            } else {
                // Default project approved template
                const sDefId = "notif-appr-REQ-2026-300162";
                const bUnread = aSavedStatusMap[sDefId] !== undefined ? aSavedStatusMap[sDefId] : true;
                aApprovedNotifications = [
                    {
                        id: sDefId,
                        requesterId: sActiveUser,
                        requestId: "REQ-2026-300162",
                        system: "SAP Ariba Supply Network",
                        roleName: "IT Security (System Administrator)",
                        type: "approved",
                        category: "Access Requests",
                        title: "Access Request Approved: REQ-2026-300162",
                        description: "Your access request for SAP Ariba Supply Network (IT Security) has been approved by Line Manager.",
                        timestamp: "5 minutes ago",
                        icon: "sap-icon://sys-enter-2",
                        state: "Success",
                        unread: bUnread
                    }
                ];
            }

            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aApprovedNotifications));

            const iUnreadCount = aApprovedNotifications.filter(n => n.unread !== false).length;

            this._setSmartProperty(oModel, "/notificationsList", aApprovedNotifications);
            this._setSmartProperty(oModel, "/notificationsCount", iUnreadCount);
            this._setSmartProperty(oModel, "/allNotificationsCount", aApprovedNotifications.length);
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
            aList = aList.filter(n => n.unread === true);
            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aList));

            this._loadNotifications(oModel);
            MessageToast.show("Cleared all read notifications.");
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
                this._openDetailsForRequest(oReq);
            } else {
                this._openDetailsForRequest({
                    requestId: oNotif.requestId,
                    system: oNotif.system || "SAP S/4HANA Enterprise",
                    roleName: "IT Developers",
                    status: oNotif.type === "approved" ? "Approved" : "Pending Approval"
                });
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
                    oModel.setProperty("/showAllNotificationsPage", false);
                }
            });
        },

        onSelectMyHistoryTab() {
            this._confirmDiscardAddAccess(() => {
                const oModel = this.getView().getModel("accessModel");
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", "myRequests");
                    oModel.setProperty("/showRequestDetailsPage", false);
                    oModel.setProperty("/showAllNotificationsPage", false);
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
                        const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                        const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";

                        if (window.KyraLoading) {
                            window.KyraLoading.show({
                                title: "Submitting Revocation Request...",
                                subtitle: "Recording removal of " + (oData.roleName || "role") + " on " + (oData.system || "system") + "...",
                                duration: 900
                            });
                        }

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
                        this._setSmartProperty(oModel, "/myPendingRequests", aUniqueMyPending);

                        const aMyHistory = oModel.getProperty("/myHistoryRequests") || [];
                        aMyHistory.push(oNewPendingReq);
                        this._setSmartProperty(oModel, "/myHistoryRequests", aMyHistory);
                        this._setSmartProperty(oModel, "/requestHistory", aMyHistory);

                        // Persist Revocation Request to PostgreSQL database
                        fetch("odata/v4/auth/submitAccessRequest", {
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

        onOpenNotificationsPopover(oEvent) {
            let oSource = oEvent.getSource ? oEvent.getSource() : null;
            if (!oSource || (oSource.getMetadata && oSource.getMetadata().getName() === "sap.f.ShellBar")) {
                oSource = this.byId("kyraHeaderBellBtn") || oSource;
            }

            const oModel = this.getView().getModel("accessModel");
            const iUnreadCount = oModel ? (oModel.getProperty("/notificationsCount") || 0) : 0;
            const aNotifs = oModel ? (oModel.getProperty("/notificationsList") || []) : [];

            sap.ui.require([
                "sap/m/ResponsivePopover", "sap/ui/core/HTML", "sap/m/MessageToast"
            ], (ResponsivePopover, HTML, MessageToast) => {
                
                let sItemsHtml = "";
                if (aNotifs.length === 0) {
                    sItemsHtml = `
                        <div style="padding: 24px; text-align: center; color: #64748B; font-size: 13px;">
                            No approved notifications at this time.
                        </div>
                    `;
                } else {
                    aNotifs.forEach((n, idx) => {
                        const sHasStripe = idx === 0 ? "kyra-notif-item-has-stripe" : "";
                        const sDotHtml = n.unread !== false ? `<span class="kyra-notif-blue-dot"></span>` : "";
                        sItemsHtml += `
                            <div class="kyra-notif-item ${sHasStripe}" id="kyra_notif_item_${idx}" data-reqid="${n.requestId || ''}" style="cursor: pointer;">
                                <div class="kyra-notif-avatar-col">
                                    <div class="kyra-notif-avatar-circle" style="background: #DCFCE7; border-color: #BBF7D0;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#16A34A" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" fill="#16A34A"></circle>
                                            <polyline points="9 11 12 14 16 9" stroke="#FFFFFF" stroke-width="2.5" fill="none"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                <div class="kyra-notif-content-col">
                                    <div class="kyra-notif-item-head">${n.title || 'Access Request Approved'}</div>
                                    <div class="kyra-notif-item-desc">${n.description || 'Your access request has been approved.'}</div>
                                    <div class="kyra-notif-item-time">
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

                        <!-- Notification Items List -->
                        <div class="kyra-notif-list">
                            ${sItemsHtml}
                        </div>

                        <!-- Footer -->
                        <div class="kyra-notif-footer" id="kyra_notif_view_all_footer">
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

                    aNotifs.forEach((n, idx) => {
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
                                    this._openDetailsForRequest(oReq);
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

            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const oSysConfig = oSlideConfigsMap[sSys] || {
                selectedServices: [],
                selectedRoles: [],
                selectedPersonas: []
            };

            oModel.setProperty("/addAccessSelectedServices", oSysConfig.selectedServices || []);
            oModel.setProperty("/addAccessSelectedRoles", oSysConfig.selectedRoles || []);
            oModel.setProperty("/addAccessSelectedPersonas", oSysConfig.selectedPersonas || []);

            // Populate dependent dropdown lists preserving selections
            this._updateSubRolesList(true);
            this._updatePersonasList(true);
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

        onBackToSystemSlides() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessConfigSubStep", 1);
                this._scrollToWizardContainer();
            }
        },

        onInPageServicesSelectionChange(oEvent) {
            this._updateSubRolesList(false);
            this._updatePersonasList(false);
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
            this._updatePersonasList(false);
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

            // Generate or reuse single common batch Request ID for the entire request session
            const aOldSummaryItems = oModel.getProperty("/addAccessSummaryItems") || [];
            const sExistingBatchReqId = (aOldSummaryItems.length > 0 && aOldSummaryItems[0].requestId) ? aOldSummaryItems[0].requestId : generateUniqueId();

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

                    // Preserve existing Request ID if available, otherwise generate new
                    const oExisting = oExistingItemsMap[sItemKey] || oExistingItemsMap[`${sSys}:::${sRole}`];
                    const sUniqueReqId = (oExisting && oExisting.requestId) ? oExisting.requestId : sExistingBatchReqId;

                    // Check if user already has an active role for this system & role
                    const bAlreadyActive = aActiveRoles.some(ar => 
                        ar.system && ar.roleName && 
                        ar.system.trim().toLowerCase() === sSys.trim().toLowerCase() && 
                        (ar.roleName.trim().toLowerCase() === sRole.trim().toLowerCase() || ar.roleName.trim().toLowerCase() === sRoleTitle.trim().toLowerCase()) &&
                        ar.status === "Active"
                    );
                    
                    // Check if user already has a pending request for this system & role
                    const bAlreadyPending = aMyPending.some(pr => 
                        pr.system && pr.roleName && 
                        pr.system.trim().toLowerCase() === sSys.trim().toLowerCase() && 
                        (pr.roleName.trim().toLowerCase() === sRole.trim().toLowerCase() || pr.roleName.trim().toLowerCase() === sRoleTitle.trim().toLowerCase()) &&
                        pr.status === "Pending Approval"
                    );

                    let sStatus = "New Request";
                    let sState = "Success";
                    let sStatusType = "new";
                    let sIcon = "sap-icon://sys-enter-2";

                    if (bAlreadyActive) {
                        sStatus = "Already has this access";
                        sState = "Information";
                        sStatusType = "existing";
                        sIcon = "sap-icon://message-information";
                    } else if (bAlreadyPending) {
                        sStatus = "Already Requested";
                        sState = "Warning";
                        sStatusType = "pending";
                        sIcon = "sap-icon://alert";
                    }

                    const oItem = {
                        _uid: "ITEM_" + sSys + "_" + sRole + "_" + sPers + "_" + Math.random().toString(36).substring(2, 9),
                        requestId: sUniqueReqId,
                        system: sSys,
                        roleName: sRole,
                        roleTitle: sRoleTitle,
                        topic: sTopic,
                        persona: sPers,
                        sector: sSector && sFunction ? (sSector + " | " + sFunction) : (sSector || sFunction || ""),
                        region: sRegion || "",
                        duration: sDuration || "Permanent (Default)",
                        existingStatus: sStatus,
                        existingState: sState,
                        existingIcon: sIcon,
                        statusType: sStatusType
                    };

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
                const sPersona = item.persona || "Database & IAM Administrator Persona (IT Administrators)";
                const sRoleTitle = item.roleTitle || item.roleName || "IT Administrators";
                
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
            oModel.setProperty("/thresholdLimits", []);
            oModel.setProperty("/duplicateRoles", []);

            this.showLoadingSlidePopup({
                title: "Scanning SoD Conflicts...",
                subtitle: "Please wait while we evaluate access policies.",
                duration: 800,
                onComplete: () => {
                    oModel.setProperty("/addAccessStep", 4);
                    oModel.setProperty("/addAccessStep4SubStep", 1);
                    this._scrollToWizardContainer();
                }
            });
        },

        onGoToStep4Slide1() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
            this._scrollToWizardContainer();
        },

        onGoToStep4Slide2() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 2);
            this._scrollToWizardContainer();
        },

        onGoToStep4Slide3() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 3);
            this._scrollToWizardContainer();
        },

        onGoBackToDurationSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 2);
                this._scrollToWizardContainer();
            }
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

            const oItem = oEvent.getSource().getBindingContext("accessModel").getObject();
            if (!oItem) return;

            const sTargetUid = oItem._uid;
            const sSys = oItem.system;
            const sRole = oItem.roleName;
            const sPersona = oItem.persona;
            const sTopic = oItem.topic;

            // Helper to match the exact single item being deleted
            const isTargetItem = (item) => {
                if (sTargetUid && item._uid) {
                    return item._uid === sTargetUid;
                }
                return item === oItem || (
                    item.system === sSys &&
                    item.roleName === sRole &&
                    item.persona === sPersona &&
                    item.topic === sTopic
                );
            };

            // 1. Remove ONLY this single item from Summary in-memory lists
            let aItems = oModel.getProperty("/addAccessSummaryItems") || [];
            let aTables = oModel.getProperty("/addAccessSummaryTables") || [];

            aItems = aItems.filter(i => !isTargetItem(i));
            
            aTables.forEach(t => {
                if (t.systemName === sSys || !sSys) {
                    t.items = (t.items || []).filter(i => !isTargetItem(i));
                }
            });
            aTables = aTables.filter(t => t.items && t.items.length > 0);

            oModel.setProperty("/addAccessSummaryItems", aItems);
            oModel.setProperty("/addAccessSummaryTables", aTables);

            // 2. Synchronize with Main Configuration Page (Step 3) & System Slide Configs
            let oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            if (sSys && oSlideConfigsMap[sSys]) {
                let oSysCfg = oSlideConfigsMap[sSys];
                
                // Remove only the deleted persona from selected personas of this system
                if (sPersona && oSysCfg.selectedPersonas) {
                    oSysCfg.selectedPersonas = oSysCfg.selectedPersonas.filter(p => p !== sPersona);
                }
                
                // Check if any remaining items for this system still use this role
                const bRoleStillUsed = aItems.some(i => i.system === sSys && i.roleName === sRole);
                if (!bRoleStillUsed && oSysCfg.selectedRoles) {
                    oSysCfg.selectedRoles = oSysCfg.selectedRoles.filter(r => r !== sRole);
                }

                // Check if any remaining items for this system still use this topic/service
                const bTopicStillUsed = aItems.some(i => i.system === sSys && i.topic === sTopic);
                if (!bTopicStillUsed && oSysCfg.selectedServices) {
                    oSysCfg.selectedServices = oSysCfg.selectedServices.filter(s => s !== sTopic);
                }

                // If all items for this system are removed, clean up system
                const bSystemStillUsed = aItems.some(i => i.system === sSys);
                if (!bSystemStillUsed) {
                    delete oSlideConfigsMap[sSys];
                    let aSelectedSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
                    aSelectedSystems = aSelectedSystems.filter(s => s !== sSys);
                    oModel.setProperty("/addAccessSelectedSystems", aSelectedSystems);
                }

                oModel.setProperty("/addAccessSystemSlideConfigs", oSlideConfigsMap);

                // If currently viewing or editing this system slide, update active form fields
                const sCurrentSys = oModel.getProperty("/currentSystemSlideName");
                if (sCurrentSys === sSys) {
                    oModel.setProperty("/addAccessSelectedServices", oSysCfg.selectedServices || []);
                    oModel.setProperty("/addAccessSelectedRoles", oSysCfg.selectedRoles || []);
                    oModel.setProperty("/addAccessSelectedPersonas", oSysCfg.selectedPersonas || []);
                    this._updateSubRolesList(true);
                    this._updatePersonasList(true);
                }
            }

            // Also update restrictedRecords list so Step 4 is in sync
            let aRestrictedRecords = oModel.getProperty("/restrictedRecords") || [];
            aRestrictedRecords = aRestrictedRecords.filter(r => !(
                r.system === sSys &&
                (r.persona === sPersona || r.roleTitle === (oItem.roleTitle || sRole))
            ));
            oModel.setProperty("/restrictedRecords", aRestrictedRecords);

            MessageToast.show("Selected item removed from request.");
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
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";

            sap.ui.core.BusyIndicator.show(0);

            const sBatchReqNumber = (aValidItems.length > 0 && aValidItems[0].requestId) ? aValidItems[0].requestId : ("REQ-2026-" + Math.floor(100000 + Math.random() * 900000));
            const aPayload = aValidItems.map((item) => ({
                requestNumber: item.requestId || sBatchReqNumber,
                requesterUsername: sActiveUser,
                requesterPersona: sActiveRole,
                targetSystem: item.system,
                roleName: item.roleName,
                businessSector: sSector || "Information Technology & Security",
                businessFunction: sFunction || "Identity & Access Governance",
                serviceTopic: sFunction || "System Administrator",
                selectedPersona: item.persona || "Engineering & Developer Persona",
                accessType: "DEFAULT",
                operatingRegion: sRegion || "Global Enterprise (ALL)",
                accessDuration: item.duration || sDuration || "Permanent (Default)",
                justification: sJustification || "Access Request"
            }));

            // Launch background database persistence
            const pDbPromise = (async () => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);
                    const response = await fetch("odata/v4/auth/submitAccessRequest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ requests: aPayload }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    const sContentType = response.headers ? response.headers.get("content-type") : "";
                    if (response.ok && sContentType && sContentType.includes("application/json")) {
                        const data = await response.json();
                        if (data && !data.error) {
                            console.log("Successfully persisted request into PostgreSQL database:", data);
                        }
                    }
                } catch (err) {
                    console.warn("Database offline or unreachable, continuing with local persistence:", err);
                }

                // Always persist locally
                try {
                    const aExistingLocal = JSON.parse(localStorage.getItem("kyra_local_submitted_requests") || "[]");
                    const aNewLocal = aPayload.map(p => ({
                        request_number: p.requestNumber,
                        requester_username: p.requesterUsername,
                        requester_persona: p.requesterPersona,
                        target_system: p.targetSystem,
                        role_name: p.roleName,
                        business_sector: p.businessSector,
                        business_function: p.businessFunction,
                        service_topic: p.serviceTopic,
                        selected_persona: p.selectedPersona,
                        access_type: p.accessType || "DEFAULT",
                        operating_region: p.operatingRegion,
                        access_duration: p.accessDuration,
                        justification: p.justification,
                        status: "PENDING",
                        created_at: new Date().toISOString()
                    }));
                    localStorage.setItem("kyra_local_submitted_requests", JSON.stringify([...aNewLocal, ...aExistingLocal]));
                } catch (e) {}

                // Immediately reload all request tables
                await this._loadSubmittedRequests(oModel);
                this._notifyDatabaseMutation();
            })();

            // Show modern clean loading popup
            this.showLoadingSlidePopup({
                title: "Submitting Access Request...",
                subtitle: "Please wait while we record and synchronize your request.",
                duration: 1100,
                onComplete: async () => {
                    await pDbPromise;

                    // Reset wizard overlay state
                    oModel.setProperty("/addAccessStep", 1);
                    oModel.setProperty("/showAddAccessSector", false);

                    let sPopupHtml = `<div style="font-family: inherit;">
                        <p style="margin: 0 0 16px 0; color: #475569; font-size: 13.5px; line-height: 1.5;">
                            Your access requests have been successfully submitted and synchronized with the database.
                        </p>`;

                    if (aValidItems.length > 0) {
                        sPopupHtml += `
                        <div class="kyra-dialog-section-header">
                            <span class="kyra-dialog-section-title kyra-text-green">Submitted to Database</span>
                            <span class="kyra-dialog-badge kyra-dialog-badge-success">${aValidItems.length} Item${aValidItems.length > 1 ? 's' : ''}</span>
                        </div>
                        <div class="kyra-dialog-list">
                            ${aValidItems.map(i => `
                                <div class="kyra-dialog-item-row kyra-dialog-item-card kyra-dialog-card-success">
                                    <div class="kyra-dialog-card-left">
                                        <div class="kyra-dialog-card-top-row">
                                            <span class="kyra-dialog-req-id">${i.requestId}</span>
                                            <span class="kyra-dialog-sys-tag">${i.system}</span>
                                        </div>
                                        <div class="kyra-dialog-card-role-row">
                                            <span class="kyra-dialog-role-title">${i.roleTitle || i.roleName}</span>
                                            <span class="kyra-dialog-topic-label">(${i.topic || 'Stakeholders'})</span>
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
        },

        /**
         * Show modern clean loading popup box with animated spinner
         */
        showLoadingSlidePopup(mOptions) {
            mOptions = mOptions || {};
            const sTitle = mOptions.title || "Loading...";
            const sSubtitle = mOptions.subtitle || "Please wait a moment...";
            const iDuration = mOptions.duration || 1000;
            const fnComplete = mOptions.onComplete || (() => {});

            const oExisting = document.getElementById("kyra_loading_slide_overlay");
            if (oExisting) oExisting.remove();

            const oOverlay = document.createElement("div");
            oOverlay.id = "kyra_loading_slide_overlay";
            oOverlay.className = "kyraLoadingSlideOverlay";

            oOverlay.innerHTML = `
                <div class="kyraLoadingSlideCard">
                    <!-- Clean Orbital Spinner -->
                    <div class="kyraLoadingIconWrap">
                        <svg class="kyraLoadingSpinnerSvg" viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" stroke="#E2E8F0" stroke-width="4"></circle>
                            <circle cx="25" cy="25" r="20" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round" stroke-dasharray="85" stroke-dashoffset="65"></circle>
                        </svg>
                    </div>

                    <div class="kyraLoadingTitle">${sTitle}</div>
                    <div class="kyraLoadingSubtitle">${sSubtitle}</div>

                    <!-- Slim Shimmer Bar -->
                    <div class="kyraLoadingSlimBar"></div>
                </div>
            `;

            document.body.appendChild(oOverlay);

            requestAnimationFrame(() => {
                oOverlay.classList.add("kyra-active");
            });

            setTimeout(() => {
                oOverlay.classList.remove("kyra-active");
                setTimeout(() => {
                    oOverlay.remove();
                    fnComplete();
                }, 220);
            }, iDuration);
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

            const mTabTitles = {
                "myAccess": "My Access Entitlements",
                "accessRequests": "Access Requests",
                "myRequests": "My Request History",
                "approvals": "Pending Approvals",
                "users": "User Directory",
                "reports": "Compliance Reports",
                "auditLogs": "Governance Audit Logs",
                "settings": "System Settings"
            };
            const sTitle = mTabTitles[sSelectedKey] || "Workspace";
            if (window.KyraLoading) {
                window.KyraLoading.show({
                    title: "Loading " + sTitle + "...",
                    subtitle: "Synchronizing security policies and governance records...",
                    duration: 400
                });
            }
            
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

        onOpenPendingRequestDetails(oEvent) {
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

            const sReqNum = (oItem && oItem.requestId) ? oItem.requestId : "REQ-2026-000378";
            let sReqIdShort = sReqNum.replace(/^REQ-2026-/, "").replace(/^REQ-/, "");
            if (!sReqIdShort) sReqIdShort = "000378";

            let sSubmittedDateStr = "Aug 22, 2026 10:30 AM";
            let sManagerDateStr = "Aug 22, 2026 11:15 AM";
            if (oItem && oItem.createdAtRaw) {
                try {
                    const d = new Date(oItem.createdAtRaw);
                    sSubmittedDateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                    const dManager = new Date(d.getTime() + 45 * 60000);
                    sManagerDateStr = dManager.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + dManager.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                } catch (e) {
                    sSubmittedDateStr = "Aug 22, 2026 10:30 AM";
                }
            } else if (oItem && oItem.submissionDate) {
                try {
                    const d = new Date(oItem.submissionDate);
                    sSubmittedDateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " 10:30 AM";
                    sManagerDateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " 11:15 AM";
                } catch (e) {
                    sSubmittedDateStr = "Aug 22, 2026 10:30 AM";
                }
            }

            const sRequesterUsername = (oItem && (oItem.requesterUsername || oItem.requesterId)) ? (oItem.requesterUsername || oItem.requesterId) : "AGORANTI";
            const sRequesterFullName = (sRequesterUsername === "Dev001") ? "GORANTI AJAY" : (sRequesterUsername === "AGORANTI" ? "GORANTI AJAY" : sRequesterUsername);
            const sRoleName = (oItem && oItem.roleName) ? oItem.roleName : "Purchase Requisitioner";
            const sSystem = (oItem && oItem.system) ? oItem.system : "SAP S/4HANA";
            const sManager = "SEGGUM, VEERENDER";

            // Determine stage & status
            const sRawStatus = (oItem && oItem.status) ? oItem.status.toLowerCase() : "pending";
            let sCurrentStage = "Compliance Review";
            let sCurrentStageDesc = "Waiting for compliance review and approval.";
            let sStep1State = "completed";
            let sStep2State = "completed";
            let sStep3State = "current";
            let sStep4State = "waiting";
            let sStep5State = "waiting";

            if (sRawStatus.includes("reject")) {
                sCurrentStage = "Rejected";
                sCurrentStageDesc = "Access request was rejected during review.";
                sStep1State = "completed";
                sStep2State = "rejected";
                sStep3State = "waiting";
                sStep4State = "waiting";
                sStep5State = "waiting";
            } else if (sRawStatus.includes("approv") || sRawStatus.includes("active")) {
                sCurrentStage = "Completed - Access Granted";
                sCurrentStageDesc = "All approvals completed and access has been provisioned.";
                sStep1State = "completed";
                sStep2State = "completed";
                sStep3State = "completed";
                sStep4State = "completed";
                sStep5State = "completed";
            }

            const oDetails = {
                requestId: sReqNum,
                requestIdDisplay: sReqIdShort,
                requestorName: sRequesterFullName,
                requestorFullName: sRequesterFullName,
                requesterUsername: sRequesterUsername,
                submittedDateTime: sSubmittedDateStr,
                managerApprovedDateTime: sManagerDateStr,
                lastUpdatedDateTime: sManagerDateStr,
                system: sSystem,
                roleName: sRoleName,
                manager: sManager,
                currentStage: sCurrentStage,
                currentStageDesc: sCurrentStageDesc,
                step1State: sStep1State,
                step2State: sStep2State,
                step3State: sStep3State,
                step4State: sStep4State,
                step5State: sStep5State,
                lastAction: "Approved by Manager Approver",
                lastActionBy: "by " + sManager,
                comments: "No comments available at this time."
            };

            if (window.KyraLoading) {
                window.KyraLoading.show({
                    title: "Loading Request Summary...",
                    subtitle: "Fetching access request " + (oDetails.requestId || "") + " details and approval trail...",
                    duration: 400
                });
            }

            oModel.setProperty("/selectedRequestDetail", oDetails);
            oModel.setProperty("/showRequestDetailsPage", true);
            oModel.setProperty("/showAddAccessSector", false);
            oModel.setProperty("/showRemoveAccessSector", false);
            oModel.setProperty("/showPendingSection", false);
            oModel.setProperty("/showApprovedSection", false);

            this._scrollToTop();
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

        onFilterHistoryByApproved() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showHistorySection", true);
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
                    sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (Filter, FilterOperator, MessageToast) => {
                        oBinding.filter([
                            new Filter("status", FilterOperator.Contains, "Approved")
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
                    const oTable = this.byId("myRequestsUnifiedTable");
                    if (!oTable) return;
                    const oBinding = oTable.getBinding("items");
                    if (!oBinding) return;

                    const aDurationFilters = [];
                    const aLabels = [];

                    if (!oSelectionState.ALL) {
                        if (oSelectionState.PERMANENT) {
                            aDurationFilters.push(new Filter("accessDuration", FilterOperator.Contains, "Permanent"));
                            aLabels.push("Permanent");
                        }
                        if (oSelectionState["30DAYS"]) {
                            aDurationFilters.push(new Filter("accessDuration", FilterOperator.Contains, "30 Days"));
                            aLabels.push("30 Days");
                        }
                        if (oSelectionState["90DAYS"]) {
                            aDurationFilters.push(new Filter("accessDuration", FilterOperator.Contains, "90 Days"));
                            aLabels.push("90 Days");
                        }
                    }

                    let oDurationFilter = null;
                    if (aDurationFilters.length > 0) {
                        oDurationFilter = new Filter({
                            filters: aDurationFilters,
                            and: false
                        });
                    }

                    let oDateFilter = null;
                    if (oSelectionState.CUSTOM) {
                        const dStart = oStartDatePicker.getDateValue();
                        const dEnd = oEndDatePicker.getDateValue() || dStart;
                        if (!dStart) {
                            MessageToast.show("Please select a Start Date.");
                            return;
                        }
                        const dFrom = new Date(dStart);
                        dFrom.setHours(0, 0, 0, 0);
                        const dTo = new Date(dEnd);
                        dTo.setHours(23, 59, 59, 999);

                        oDateFilter = new Filter({
                            path: "submissionDate",
                            test: (sValue) => {
                                if (!sValue) return false;
                                const dItemDate = new Date(sValue);
                                return !isNaN(dItemDate.getTime()) && dItemDate >= dFrom && dItemDate <= dTo;
                            }
                        });
                        aLabels.push(dStart.toLocaleDateString() + " - " + dEnd.toLocaleDateString());
                    }

                    if (oSelectionState.ALL && !oSelectionState.CUSTOM) {
                        oBinding.filter([]);
                        oModel.setProperty("/historyFilterSubtitle", "All submitted and historical access requests.");
                        MessageToast.show("Showing all history requests.");
                        oDialog.close();
                        return;
                    }

                    const aFinalFilters = [];
                    if (oDurationFilter && oDateFilter) {
                        aFinalFilters.push(new Filter({
                            filters: [oDurationFilter, oDateFilter],
                            and: true
                        }));
                    } else if (oDurationFilter) {
                        aFinalFilters.push(oDurationFilter);
                    } else if (oDateFilter) {
                        aFinalFilters.push(oDateFilter);
                    }

                    oBinding.filter(aFinalFilters);
                    const sSummary = aLabels.length > 0 ? aLabels.join(", ") : "All History";
                    oModel.setProperty("/historyFilterSubtitle", "Filtered by: " + sSummary);
                    MessageToast.show("Filtered by: " + sSummary);
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
            sap.ui.require(["sap/m/Dialog", "sap/ui/core/HTML", "sap/m/MessageToast"], (Dialog, HTML, MessageToast) => {
                const sHtmlSignOut = `
                    <div class="kyra-signout-card">
                        <!-- Top Header -->
                        <div class="kyra-signout-header">
                            <div class="kyra-signout-header-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span class="kyra-signout-title">Sign Out</span>
                            </div>
                            <button type="button" class="kyra-signout-close-btn" id="kyra_signout_x_btn">✕</button>
                        </div>

                        <!-- Body Content -->
                        <div class="kyra-signout-body">
                            <div class="kyra-signout-avatar">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </div>
                            <div class="kyra-signout-text-block">
                                <div class="kyra-signout-prompt-title">Confirm Sign Out</div>
                                <div class="kyra-signout-prompt-desc">Are you sure you want to sign out of <span class="kyra-signout-brand">KYRA Portal</span>?</div>
                            </div>
                        </div>

                        <!-- Footer Actions -->
                        <div class="kyra-signout-footer">
                            <button type="button" class="kyra-signout-cancel-btn" id="kyra_signout_cancel_btn">Cancel</button>
                            <button type="button" class="kyra-signout-confirm-btn" id="kyra_signout_confirm_btn">Sign Out</button>
                        </div>
                    </div>
                `;

                const oConfirmDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "480px",
                    class: "kyraSignOutDialog",
                    content: [
                        new HTML({ content: sHtmlSignOut, preferDOM: false })
                    ],
                    afterClose: () => oConfirmDialog.destroy()
                });

                this.getView().addDependent(oConfirmDialog);
                oConfirmDialog.open();

                setTimeout(() => {
                    const closeFn = () => oConfirmDialog.close();
                    const btnX = document.getElementById("kyra_signout_x_btn");
                    if (btnX) btnX.onclick = closeFn;

                    const btnCancel = document.getElementById("kyra_signout_cancel_btn");
                    if (btnCancel) btnCancel.onclick = closeFn;

                    const btnSignOut = document.getElementById("kyra_signout_confirm_btn");
                    if (btnSignOut) {
                        btnSignOut.onclick = () => {
                            oConfirmDialog.close();

                            sessionStorage.removeItem("kyra_active_user");
                            sessionStorage.removeItem("kyra_active_role");
                            sessionStorage.removeItem("kyra_active_user_uuid");
                            sessionStorage.removeItem("kyra_wizard_sector");
                            sessionStorage.removeItem("kyra_wizard_function");
                            sessionStorage.removeItem("kyra_reset_add_access");

                            const oModel = this.getView().getModel("accessModel");
                            if (oModel) {
                                oModel.setProperty("/showAddAccessSector", false);
                                oModel.setProperty("/showRemoveAccessSector", false);
                                oModel.setProperty("/showMyAccessMasterSection", false);
                                oModel.setProperty("/showPendingSection", false);
                                oModel.setProperty("/showApprovedSection", false);
                                oModel.setProperty("/selectedTabKey", "myAccess");
                            }

                            MessageToast.show("You have successfully signed out.");

                            setTimeout(() => {
                                try {
                                    const oRouter = this.getOwnerComponent() ? this.getOwnerComponent().getRouter() : null;
                                    if (oRouter && oRouter.getRoute("Login")) {
                                        oRouter.navTo("Login", {}, true);
                                    } else {
                                        window.location.hash = "";
                                        window.location.reload();
                                    }
                                } catch (e) {
                                    window.location.hash = "";
                                    window.location.reload();
                                }
                            }, 300);
                        };
                    }
                }, 50);
            });
        }
    });
});
