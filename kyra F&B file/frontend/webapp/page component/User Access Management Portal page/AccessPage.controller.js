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
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const oModel = new JSONModel({
                showAddAccessSector: false,
                showRemoveAccessSector: false,
                selectedTabKey: "myAccess",
                activeRole: sActiveRole,
                isApproverPersona: sActiveRole === "Approver",
                showApprovalHistory: false,
                showPendingSection: false,
                showApprovedSection: false,
                showMyAccessMasterSection: false,
                showAddAccessSector: false,
                showRemoveAccessSector: false,
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

            // Render Region Map Component (from region folder)
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();
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
                const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
                oModel.setProperty("/activeRole", sActiveRole);
                oModel.setProperty("/isApproverPersona", sActiveRole === "Approver");
                
                if (sessionStorage.getItem("kyra_show_approval_history") === "true") {
                    oModel.setProperty("/showApprovalHistory", true);
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
                const response = await fetch("/odata/v4/auth/Requests");
                const data = await response.json();
                if (data && data.value) {
                    aRawDbRequests = data.value;
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

            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            oModel.setProperty("/activeRole", sActiveRole);
            oModel.setProperty("/isApproverPersona", sActiveRole === "Approver");

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

                const oReqObj = {
                    requestId: r.request_number || ("REQ-" + r.ID),
                    requesterId: r.requester_username,
                    requesterUsername: r.requester_username,
                    type: r.request_type || "Addition",
                    system: r.target_system || "SAP System",
                    roleName: r.role_name || "",
                    serviceTopic: r.service_topic || r.business_function || "",
                    selectedPersona: r.selected_persona || r.requester_persona || "Requester",
                    accessDuration: r.access_duration || "Permanent",
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
            const aApproverPendingAccess = [];
            const aApproverPendingRevoke = [];

            aAllGrouped.forEach(g => {
                if (g.status.toLowerCase().includes("pending")) {
                    aApproverPending.push(g);
                    if (g.isRevocation) {
                        aApproverPendingRevoke.push(g);
                    } else {
                        aApproverPendingAccess.push(g);
                    }
                } else {
                    aApproverProcessed.push(g);
                }
            });

            // Deduplicate aMyPending preserving descending order
            const pendingKeys = new Set();
            const aUniqueMyPending = [];
            for (let i = 0; i < aMyPending.length; i++) {
                const item = aMyPending[i];
                const sKey = (item.system || "") + "_" + (item.roleName || "");
                if (!pendingKeys.has(sKey)) {
                    pendingKeys.add(sKey);
                    aUniqueMyPending.push(item);
                }
            }

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

            // Load and filter notifications for active user
            const aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
            const aUserNotifications = aAllNotifications.filter(n => n.requesterId === sActiveUser);
            const iUnreadCount = aUserNotifications.filter(n => n.unread !== false).length;

            this._setSmartProperty(oModel, "/notificationsList", aUserNotifications);
            this._setSmartProperty(oModel, "/notificationsCount", iUnreadCount);
        },

        onOpenAddAccessDialog() {
            sessionStorage.setItem("kyra_reset_add_access", "true");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            this.getOwnerComponent().getRouter().navTo("AddAccessBusinessSector");
        },

        onCloseAddAccessSector() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showAddAccessSector", false);
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
                        aMyPending.push(oNewPendingReq);

                        // Deduplicate myPendingRequests
                        const pendingKeys = new Set();
                        const aUniqueMyPending = [];
                        for (let i = aMyPending.length - 1; i >= 0; i--) {
                            const item = aMyPending[i];
                            const sKey = (item.system || "") + "_" + (item.roleName || "");
                            if (!pendingKeys.has(sKey)) {
                                pendingKeys.add(sKey);
                                aUniqueMyPending.unshift(item);
                            }
                        }
                        this._setSmartProperty(oModel, "/myPendingRequests", aUniqueMyPending);

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
            MessageToast.show("Access page data refreshed.");
        },

        onOpenNotificationsPopover(oEvent) {
            const oSource = oEvent.getSource();
            const oModel = this.getView().getModel("accessModel");
            const aList = oModel.getProperty("/notificationsList") || [];

            sap.ui.require([
                "sap/m/ResponsivePopover", "sap/m/List", "sap/m/CustomListItem",
                "sap/m/HBox", "sap/m/VBox", "sap/m/Avatar", "sap/m/Title", "sap/m/Text", "sap/m/ObjectStatus", "sap/m/Button"
            ], (ResponsivePopover, List, CustomListItem, HBox, VBox, Avatar, Title, Text, ObjectStatus, Button) => {
                
                const aItems = aList.map(n => new CustomListItem({
                    content: [
                        new HBox({
                            class: "sapUiSmallMargin",
                            alignItems: "Center",
                            items: [
                                new Avatar({
                                    src: n.icon || "sap-icon://bell",
                                    displaySize: "S",
                                    backgroundColor: n.state === "Success" ? "Accent8" : (n.state === "Error" ? "Accent2" : "Accent6"),
                                    class: "sapUiSmallMarginEnd"
                                }),
                                new VBox({
                                    items: [
                                        new Title({ text: n.title, level: "H5" }),
                                        new Text({ text: n.description, class: "fioriDescriptionText" }),
                                        new Text({ text: n.timestamp, class: "sapUiTinyMarginTop" })
                                    ]
                                })
                            ]
                        })
                    ]
                }));

                if (aItems.length === 0) {
                    aItems.push(new CustomListItem({
                        content: [
                            new VBox({
                                class: "sapUiMediumMargin",
                                alignItems: "Center",
                                items: [
                                    new Text({ text: "No new notifications." })
                                ]
                            })
                        ]
                    }));
                }

                const oPopover = new ResponsivePopover({
                    title: "Notifications Center (" + aList.length + ")",
                    contentWidth: "380px",
                    placement: "Bottom",
                    content: [
                        new List({ items: aItems })
                    ],
                    endButton: new Button({
                        text: "Clear All",
                        press: () => {
                            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                            let aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                            aAllNotifications = aAllNotifications.filter(n => n.requesterId !== sActiveUser);
                            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aAllNotifications));
                            oModel.setProperty("/notificationsList", []);
                            oModel.setProperty("/notificationsCount", 0);
                            oPopover.close();
                            MessageToast.show("Notifications cleared.");
                        }
                    })
                });

                // Mark as read
                const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                const aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                aAllNotifications.forEach(n => {
                    if (n.requesterId === sActiveUser) {
                        n.unread = false;
                    }
                });
                sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aAllNotifications));
                oModel.setProperty("/notificationsCount", 0);

                this.getView().addDependent(oPopover);
                oPopover.openBy(oSource);
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
                    oModel.setProperty("/selectedSector", "");
                    oModel.setProperty("/selectedFunction", "");
                    oModel.setProperty("/availableFunctions", [
                        { key: "", text: "Select Business Function...", icon: "" }
                    ]);
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
            const aFuncsWithPlaceholder = [
                { key: "", text: "Select Business Function...", icon: "" },
                ...aFuncs
            ];
            oModel.setProperty("/availableFunctions", aFuncsWithPlaceholder);
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

            setTimeout(() => {
                this._renderPins();
                this._attachSelectAllListener();
                this._updateSelectedChips();
            }, 100);
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

            oModel.setProperty("/addAccessStep", 3);
            oModel.setProperty("/addAccessConfigSubStep", 1);
            oModel.setProperty("/addAccessCurrentSystemIndex", 0);
            
            if (!oModel.getProperty("/addAccessSystemSlideConfigs")) {
                oModel.setProperty("/addAccessSystemSlideConfigs", {});
            }

            this._loadCurrentSystemSlideConfig();
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

        _loadCurrentSystemSlideConfig() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sSys = aSystems.length > 0 ? aSystems[iIndex] : "Select Target System";

            oModel.setProperty("/currentSystemSlideName", sSys);

            const oSlideConfigsMap = oModel.getProperty("/addAccessSystemSlideConfigs") || {};
            const oSysConfig = oSlideConfigsMap[sSys] || {
                selectedServices: [],
                selectedRoles: [],
                selectedPersonas: []
            };

            oModel.setProperty("/addAccessSelectedServices", oSysConfig.selectedServices);
            oModel.setProperty("/addAccessSelectedRoles", oSysConfig.selectedRoles);
            oModel.setProperty("/addAccessSelectedPersonas", oSysConfig.selectedPersonas);
        },

        _saveCurrentSystemSlideConfig() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const aSystems = oModel.getProperty("/addAccessSelectedSystems") || [];
            const iIndex = oModel.getProperty("/addAccessCurrentSystemIndex") || 0;
            const sSys = aSystems[iIndex];
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
        },

        onBackToSystemSlides() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessConfigSubStep", 1);
            }
        },

        onInPageServicesSelectionChange(oEvent) {
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
            ];

            const aSelectedServices = oModel.getProperty("/addAccessSelectedServices") || [];
            
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

            const aAllPersonas = [
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
            ];

            const aSelectedRoles = oModel.getProperty("/addAccessSelectedRoles") || [];
            
            if (aSelectedRoles.length === 0) {
                oModel.setProperty("/addAccessPersonasList", aAllPersonasList);
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
            const aMyApproved = oModel.getProperty("/myApprovedRequests") || [];
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

            aSystems.forEach((sSys, idx) => {
                const oSysConfig = oSlideConfigsMap[sSys] || {
                    selectedServices: oModel.getProperty("/addAccessSelectedServices") || [],
                    selectedRoles: oModel.getProperty("/addAccessSelectedRoles") || [],
                    selectedPersonas: oModel.getProperty("/addAccessSelectedPersonas") || []
                };
                const aSysRoles = oSysConfig.selectedRoles || [];
                const aSysPersonas = oSysConfig.selectedPersonas || [];

                let aSysItems = [];

                const processItem = (sRole, sPers) => {
                    const sUniqueReqId = generateUniqueId();
                    
                    // Check if user already has an active role for this system & role
                    const bAlreadyActive = aActiveRoles.some(ar => ar.system === sSys && ar.roleName === sRole && ar.status === "Active") ||
                                           aMyApproved.some(ar => ar.system === sSys && ar.roleName === sRole && ar.status === "Active");
                    
                    // Check if user already has a pending request for this system & role
                    const bAlreadyPending = aMyPending.some(pr => pr.system === sSys && pr.roleName === sRole && pr.status === "Pending Approval");

                    let sStatus = "New Request";
                    let sState = "Information";

                    if (bAlreadyActive) {
                        sStatus = "Already has this access";
                        sState = "Success";
                    } else if (bAlreadyPending) {
                        sStatus = "Already in pending section";
                        sState = "Warning";
                    }

                    const oItem = {
                        requestId: sUniqueReqId,
                        system: sSys,
                        roleName: sRole,
                        persona: sPers || "",
                        sector: sSector && sFunction ? (sSector + " | " + sFunction) : (sSector || sFunction || ""),
                        region: sRegion || "",
                        duration: sDuration || "",
                        existingStatus: sStatus,
                        existingState: sState
                    };

                    aSummaryItems.push(oItem);
                    aSysItems.push(oItem);
                };

                if (aSysRoles.length > 0 && aSysPersonas.length > 0) {
                    aSysRoles.forEach(sRole => {
                        aSysPersonas.forEach(sPers => {
                            processItem(sRole, sPers);
                        });
                    });
                } else if (aSysRoles.length > 0) {
                    aSysRoles.forEach(sRole => {
                        processItem(sRole, "");
                    });
                }

                if (aSysItems.length > 0) {
                    aSummaryTables.push({
                        systemIndex: aSummaryTables.length + 1,
                        systemName: sSys,
                        systemIcon: oSystemIconsMap[sSys] || "sap-icon://cloud",
                        items: aSysItems
                    });
                }
            });

            oModel.setProperty("/addAccessSummaryItems", aSummaryItems);
            oModel.setProperty("/addAccessSummaryTables", aSummaryTables);
            // Bypass Step 4 Conflict Analysis completely and go directly to Summary
            oModel.setProperty("/addAccessStep", 5);
        },

        onGoToStep4Slide1() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 1);
        },

        onGoToStep4Slide2() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 4);
            oModel.setProperty("/addAccessStep4SubStep", 2);
        },

        onGoBackToDurationSlide() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/addAccessStep", 3);
                oModel.setProperty("/addAccessConfigSubStep", 2);
            }
        },

        onGoToAddAccessStep5() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/addAccessStep", 5);
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
            const oItem = oEvent.getSource().getBindingContext("accessModel").getObject();
            let aItems = oModel.getProperty("/addAccessSummaryItems") || [];
            let aTables = oModel.getProperty("/addAccessSummaryTables") || [];

            aItems = aItems.filter(i => i.requestId !== oItem.requestId);
            
            aTables.forEach(t => {
                t.items = t.items.filter(i => i.requestId !== oItem.requestId);
            });
            aTables = aTables.filter(t => t.items.length > 0);

            oModel.setProperty("/addAccessSummaryItems", aItems);
            oModel.setProperty("/addAccessSummaryTables", aTables);
            MessageToast.show("Access request item removed.");
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

            const aPayload = aValidItems.map((item) => ({
                requestNumber: item.requestId || ("REQ-2026-" + Math.floor(100000 + Math.random() * 900000)),
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

            try {
                // Post valid items directly to backend PostgreSQL database endpoint
                const response = await fetch("/odata/v4/auth/submitAccessRequest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requests: aPayload })
                });

                const data = await response.json();

                if (!response.ok || (data.error && data.error.message)) {
                    const sErrMsg = (data.error && data.error.message) ? data.error.message : "Failed to persist request into database.";
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Database Conflict / Error:\n\n" + sErrMsg);
                    return;
                }

                console.log("Successfully persisted request into PostgreSQL database:", data);
                
                // Immediately reload all request tables from PostgreSQL database
                await this._loadSubmittedRequests(oModel);

                // Broadcast real-time mutation event to all open tabs/views
                this._notifyDatabaseMutation();

            } catch (err) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Failed to connect to database: " + err.message);
                return;
            } finally {
                sap.ui.core.BusyIndicator.hide();
            }

            // Reset wizard overlay state
            oModel.setProperty("/addAccessStep", 1);
            oModel.setProperty("/showAddAccessSector", false);

            let sNotificationText = "Access Request processing complete!\n\n" +
                "✅ SENT TO DATABASE (" + aValidItems.length + " item(s)):\n" +
                aValidItems.map(i => `• ${i.requestId}: ${i.system} — ${i.roleName}`).join("\n");

            if (aSkippedItems.length > 0) {
                sNotificationText += "\n\n⚠️ EXCLUDED / NOT SENT (" + aSkippedItems.length + " item(s)):\n" +
                    aSkippedItems.map(i => `• ${i.requestId}: ${i.system} — ${i.roleName} (${i.existingStatus})`).join("\n");
            }

            MessageBox.information(sNotificationText, {
                title: "Database Submission Summary"
            });
        },

        onNavToPendingRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showPendingSection");
                oModel.setProperty("/showPendingSection", !bCurr);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                
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
        },

        onNavToApprovedRequests() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showApprovedSection");
                oModel.setProperty("/showApprovedSection", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                oModel.setProperty("/showRemoveAccessSector", false);
                
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

        onNavToMyAccessMasterPage() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const bCurr = oModel.getProperty("/showMyAccessMasterSection");
            oModel.setProperty("/showMyAccessMasterSection", !bCurr);
            oModel.setProperty("/showPendingSection", false);
            oModel.setProperty("/showApprovedSection", false);
            oModel.setProperty("/showAddAccessSector", false);
            oModel.setProperty("/showRemoveAccessSector", false);

            if (!bCurr) {
                setTimeout(() => {
                    const oPage = this.byId("accessPortalPage");
                    const oTarget = this.byId("myAccessMasterSectionContainer");
                    if (oPage && oTarget) {
                        oPage.scrollToElement(oTarget, 400);
                    }
                }, 100);
            }
        },

        onCloseMyAccessMasterSection() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/showMyAccessMasterSection", false);
            }
        },

        onNavToRemoveAccess() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const bCurr = oModel.getProperty("/showRemoveAccessSector");
                oModel.setProperty("/showRemoveAccessSector", !bCurr);
                oModel.setProperty("/showPendingSection", false);
                oModel.setProperty("/showApprovedSection", false);
                oModel.setProperty("/showAddAccessSector", false);
                
                if (!bCurr) {
                    setTimeout(() => {
                        const oPage = this.byId("accessPortalPage");
                        const oTarget = this.byId("removeAccessSection");
                        if (oPage && oTarget) {
                            oPage.scrollToElement(oTarget, 400);
                        }
                    }, 100);
                }
            }
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
                "sap/m/Dialog", "sap/m/VBox", "sap/m/HBox", "sap/m/Title", "sap/m/Text",
                "sap/m/ObjectStatus", "sap/m/IconTabBar", "sap/m/IconTabFilter",
                "sap/ui/layout/form/SimpleForm", "sap/m/Label", "sap/m/Button", "sap/m/Avatar", "sap/m/MessageToast"
            ], (Dialog, VBox, HBox, Title, Text, ObjectStatus, IconTabBar, IconTabFilter, SimpleForm, Label, Button, Avatar, MessageToast) => {
                
                const sSys = oItem.system || "SAP Enterprise System";
                const sRole = oItem.roleName || "User Role";
                const sRoleId = oItem.roleId || "S4H_FIN_001";
                const sCat = oItem.category || "System Administrator";
                const sPers = oItem.persona || "Requester";
                const sGranted = oItem.grantedDate || "01 May 2024";
                const sExpiry = oItem.expiryDate === "Permanent" ? "31 Dec 9999" : (oItem.expiryDate || "31 Dec 9999");
                const sStatus = oItem.status || "Active";
                const sState = oItem.statusState || "Success";

                const oDialog = new Dialog({
                    title: "Complete Entitlement & Audit Governance View",
                    contentWidth: "680px",
                    contentHeight: "480px",
                    verticalScrolling: true,
                    content: [
                        new VBox({
                            class: "sapUiContentPadding",
                            items: [
                                // Top Header Banner
                                new HBox({
                                    alignItems: "Center",
                                    justifyContent: "SpaceBetween",
                                    class: "fioriWelcomeCard sapUiSmallMarginBottom sapUiResponsivePadding",
                                    items: [
                                        new HBox({
                                            alignItems: "Center",
                                            items: [
                                                new Avatar({ src: "sap-icon://shield-check", displaySize: "M", backgroundColor: "Accent6", class: "sapUiSmallMarginEnd" }),
                                                new VBox({
                                                    items: [
                                                        new Title({ text: sRole, level: "H4" }),
                                                        new Text({ text: sSys, class: "fioriWelcomeSubtitle" })
                                                    ]
                                                })
                                            ]
                                        }),
                                        new ObjectStatus({
                                            text: sStatus + " (100% Compliant)",
                                            state: sState,
                                            icon: "sap-icon://sys-enter-2"
                                        })
                                    ]
                                }),

                                // Details Tabs
                                new IconTabBar({
                                    headerMode: "Inline",
                                    class: "sapUiNoContentPadding",
                                    items: [
                                        new IconTabFilter({
                                            text: "Entitlement Details",
                                            icon: "sap-icon://user-settings",
                                            content: [
                                                new SimpleForm({
                                                    editable: false,
                                                    layout: "ColumnLayout",
                                                    columnsM: 2,
                                                    columnsL: 2,
                                                    content: [
                                                        new Label({ text: "System Name" }),
                                                        new Text({ text: sSys }),

                                                        new Label({ text: "Role Title" }),
                                                        new Text({ text: sRole }),

                                                        new Label({ text: "Category Topic" }),
                                                        new Text({ text: sCat }),

                                                        new Label({ text: "Assigned Persona" }),
                                                        new Text({ text: sPers }),

                                                        new Label({ text: "Access Type" }),
                                                        new Text({ text: "Direct Entitlement (Assigned Role)" }),

                                                        new Label({ text: "Granted Date" }),
                                                        new Text({ text: sGranted }),

                                                        new Label({ text: "Expiration Date" }),
                                                        new Text({ text: sExpiry })
                                                    ]
                                                })
                                            ]
                                        }),
                                        new IconTabFilter({
                                            text: "Audit & Governance Trail",
                                            icon: "sap-icon://history",
                                            content: [
                                                new SimpleForm({
                                                    editable: false,
                                                    layout: "ColumnLayout",
                                                    columnsM: 2,
                                                    columnsL: 2,
                                                    content: [
                                                        new Label({ text: "Audit Tracking ID" }),
                                                        new Text({ text: "AUD-2024-" + Math.floor(1000 + Math.random() * 9000) }),

                                                        new Label({ text: "Governance Approver" }),
                                                        new Text({ text: "KYRA Identity & Access Board" }),

                                                        new Label({ text: "SoD Compliance Risk" }),
                                                        new ObjectStatus({ text: "Low Risk (Segregation of Duties Verified)", state: "Success", icon: "sap-icon://shield-check" }),

                                                        new Label({ text: "Sync Status" }),
                                                        new Text({ text: "Synchronized with Active Directory & SAP GRC" }),

                                                        new Label({ text: "Last Audit Verification" }),
                                                        new Text({ text: new Date().toLocaleDateString() }),

                                                        new Label({ text: "Classification" }),
                                                        new Text({ text: "Restricted Enterprise Entitlement" })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ],
                    beginButton: new Button({
                        text: "Export Audit Log",
                        icon: "sap-icon://excel-attachment",
                        press: () => {
                            MessageToast.show("Exported entitlement audit log for " + sRole);
                        }
                    }),
                    endButton: new Button({
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

        onFilterHistoryDialog() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            sap.ui.require(["sap/m/SelectDialog", "sap/m/StandardListItem", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast"], (SelectDialog, StandardListItem, Filter, FilterOperator, MessageToast) => {
                const oDialog = new SelectDialog({
                    title: "Filter History by Timing & Duration",
                    items: [
                        new StandardListItem({ title: "Last 1 Month Requests", description: "Filter requests submitted within the last 30 days", icon: "sap-icon://history" }),
                        new StandardListItem({ title: "Last 3 Months Requests", description: "Filter requests submitted within the last 90 days", icon: "sap-icon://history" }),
                        new StandardListItem({ title: "Duration: Permanent Access", description: "Filter long-term permanent role assignments", icon: "sap-icon://accept" }),
                        new StandardListItem({ title: "Duration: Temporary Access (30/60 Days)", description: "Filter short-term temporary access roles", icon: "sap-icon://history" })
                    ],
                    confirm: (oEvent) => {
                        const oSelectedItem = oEvent.getParameter("selectedItem");
                        if (!oSelectedItem) return;
                        const sFilterTitle = oSelectedItem.getTitle();
                        const oTable = this.byId("myRequestsUnifiedTable");
                        if (!oTable) return;
                        const oBinding = oTable.getBinding("items");
                        if (!oBinding) return;

                        const dNow = new Date();

                        if (sFilterTitle.includes("Last 1 Month")) {
                            const dOneMonthAgo = new Date(dNow.getFullYear(), dNow.getMonth() - 1, dNow.getDate());
                            const fnFilter1Month = new Filter({
                                path: "submitted",
                                test: (sValue) => {
                                    if (!sValue) return true;
                                    const dDate = new Date(sValue);
                                    return !isNaN(dDate.getTime()) && dDate >= dOneMonthAgo;
                                }
                            });
                            oBinding.filter([fnFilter1Month]);
                            MessageToast.show("Filtered My History by Last 1 Month Requests.");
                        } else if (sFilterTitle.includes("Last 3 Months")) {
                            const dThreeMonthsAgo = new Date(dNow.getFullYear(), dNow.getMonth() - 3, dNow.getDate());
                            const fnFilter3Months = new Filter({
                                path: "submitted",
                                test: (sValue) => {
                                    if (!sValue) return true;
                                    const dDate = new Date(sValue);
                                    return !isNaN(dDate.getTime()) && dDate >= dThreeMonthsAgo;
                                }
                            });
                            oBinding.filter([fnFilter3Months]);
                            MessageToast.show("Filtered My History by Last 3 Months Requests.");
                        } else if (sFilterTitle.includes("Permanent")) {
                            oBinding.filter([ new Filter("accessDuration", FilterOperator.Contains, "Permanent") ]);
                            MessageToast.show("Filtered My History by Permanent Duration.");
                        } else if (sFilterTitle.includes("Temporary")) {
                            oBinding.filter([ new Filter("accessDuration", FilterOperator.Contains, "30") ]);
                            MessageToast.show("Filtered My History by Temporary Duration.");
                        }
                    }
                });
                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        onLogout() {
            MessageBox.confirm("Are you sure you want to sign out?", {
                title: "Sign Out",
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        sessionStorage.removeItem("kyra_active_user");
                        sessionStorage.removeItem("kyra_active_role");
                        MessageToast.show("Session ended.");
                        this.getOwnerComponent().getRouter().navTo("Login");
                    }
                }
            });
        }
    });
});
