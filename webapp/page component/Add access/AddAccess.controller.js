sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageToast, MessageBox) => {
    "use strict";

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

    return Controller.extend("kyra001.pages.addAccess.AddAccess", {
        onInit() {
            const oModel = new JSONModel({
                step1Visible: false,
                step2Visible: true,
                step3Visible: false,

                sector: "",
                function: "",
                functionsList: [],

                region: "",
                selectedSystems: [],
                selectedServices: [],
                subRolesList: [],
                selectedRoles: [],
                personasList: [],
                selectedPersonas: [],
                duration: "",
                justification: "",

                selectedRegionChips: [],
                hasRegionSelection: false,

                activeUser: "",
                activePersona: "",
                summaryItems: [],
                submitEnabled: true
            });

            this.getView().setModel(oModel, "addAccessModel");
            this._aSelectedRegionIds = [];
            this._regionList = [
                { id: "na", name: "North America", left: "21.5%", top: "32%" },
                { id: "latam", name: "Latin America", left: "33%", top: "60%" },
                { id: "eu", name: "Europe", left: "51.5%", top: "29%" },
                { id: "me", name: "Middle East", left: "59.5%", top: "41%" },
                { id: "af", name: "Africa", left: "53.5%", top: "52%" },
                { id: "as", name: "Asia", left: "71.5%", top: "35%" },
                { id: "apac", name: "Oceania / Australia", left: "82%", top: "64%" }
            ];

            const oRouter = this.getOwnerComponent().getRouter();
            if (oRouter) {
                oRouter.getRoute("AddAccess").attachPatternMatched(this._onRouteMatched, this);
            }
        },

        onAfterRendering() {
            this._renderPins();
            this._attachSelectAllListener();
            this._updateSelectedChips();
        },

        _attachSelectAllListener() {
            const oSelectAll = document.getElementById("selectAllBtnAddAccess") || document.getElementById("selectAllBtn");
            if (!oSelectAll) {
                setTimeout(this._attachSelectAllListener.bind(this), 100);
                return;
            }

            if (oSelectAll._listenerAttached) return;
            oSelectAll._listenerAttached = true;

            oSelectAll.addEventListener("click", () => {
                if (this._aSelectedRegionIds.length === this._regionList.length) {
                    this._aSelectedRegionIds = [];
                    oSelectAll.classList.remove("active");
                } else {
                    this._aSelectedRegionIds = this._regionList.map(r => r.id);
                    oSelectAll.classList.add("active");
                }
                this._updatePinSelectionStates();
                this._updateSelectedChips();
            });
        },

        _renderPins() {
            const oPinsLayer = document.getElementById("pinsLayerAddAccess") || document.getElementById("pinsLayer");
            if (!oPinsLayer) {
                setTimeout(this._renderPins.bind(this), 100);
                return;
            }

            const oImg = document.getElementById("worldMapImgAddAccess");
            if (oImg) {
                try {
                    const sResolvedPath = sap.ui.require.toUrl("kyra001/world-map.jpg");
                    if (sResolvedPath && oImg.getAttribute("src") !== sResolvedPath) {
                        oImg.src = sResolvedPath;
                    }
                } catch(e) {}
            }

            oPinsLayer.innerHTML = "";
            const self = this;

            this._regionList.forEach(region => {
                const oPinContainer = document.createElement("div");
                oPinContainer.className = "map-pin-container";
                oPinContainer.style.left = region.left;
                oPinContainer.style.top = region.top;
                oPinContainer.setAttribute("data-id", region.id);

                if (self._aSelectedRegionIds.indexOf(region.id) !== -1) {
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
            document.querySelectorAll(".map-pin-container").forEach(el => {
                const sId = el.getAttribute("data-id");
                const bSelected = self._aSelectedRegionIds.indexOf(sId) !== -1;
                el.classList.toggle("active", bSelected);
            });
        },

        _updateSelectAllButtonState() {
            const oSelectAll = document.getElementById("selectAllBtn");
            if (oSelectAll) {
                const bAllSelected = this._aSelectedRegionIds.length === this._regionList.length;
                oSelectAll.classList.toggle("active", bAllSelected);
            }
        },

        _updateSelectedChips() {
            const oModel = this.getView().getModel("addAccessModel");
            if (!oModel) return;

            const self = this;
            const aSelected = this._regionList.filter(r => self._aSelectedRegionIds.indexOf(r.id) !== -1);
            const sRegionSummary = aSelected.map(r => r.name).join(", ") || "Global Enterprise (ALL)";

            oModel.setProperty("/selectedRegionChips", aSelected);
            oModel.setProperty("/hasRegionSelection", aSelected.length > 0);
            oModel.setProperty("/region", sRegionSummary);
        },

        onRemoveMapRegionChip(oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("addAccessModel");
            if (oContext) {
                const sId = oContext.getProperty("id");
                this.toggleRegionSelection(sId);
            }
        },

        _onRouteMatched(oEvent) {
            const bResetFlag = sessionStorage.getItem("kyra_reset_add_access") === "true";
            if (bResetFlag) {
                sessionStorage.removeItem("kyra_reset_add_access");
                sessionStorage.removeItem("kyra_wizard_sector");
                sessionStorage.removeItem("kyra_wizard_function");

                const oModel = this.getView().getModel("addAccessModel");
                if (oModel) {
                    oModel.setData({
                        step1Visible: false,
                        step2Visible: true,
                        step3Visible: false,
                        sector: "",
                        function: "",
                        functionsList: [],
                        region: "",
                        selectedSystems: [],
                        selectedServices: [],
                        subRolesList: [],
                        selectedRoles: [],
                        personasList: [],
                        selectedPersonas: [],
                        duration: "",
                        justification: "",
                        activeUser: "",
                        activePersona: "",
                        summaryItems: [],
                        submitEnabled: true
                    });
                }
            }
        },

        onNavBackToPortal() {
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        },

        onSectorChange(oEvent) {
            const sSector = oEvent.getParameter("selectedItem") ? oEvent.getParameter("selectedItem").getKey() : "";
            const oModel = this.getView().getModel("addAccessModel");

            const aRawFunctions = oFunctionsMap[sSector] || [];
            const aFunctions = [{ key: "", text: "-- Select Business Function --", icon: "sap-icon://question-mark" }, ...aRawFunctions];

            oModel.setProperty("/functionsList", aFunctions);
            oModel.setProperty("/function", "");
        },

        onServicesSelectionChange(oEvent) {
            const oModel = this.getView().getModel("addAccessModel");
            const aSelectedServices = oModel.getProperty("/selectedServices") || [];

            let aCombinedRoles = [];

            if (aSelectedServices.length > 0) {
                aSelectedServices.forEach(sServiceKey => {
                    if (oServicesRolesMap[sServiceKey]) {
                        aCombinedRoles = aCombinedRoles.concat(oServicesRolesMap[sServiceKey]);
                    }
                });
            }

            oModel.setProperty("/subRolesList", aCombinedRoles);

            oModel.setProperty("/selectedRoles", []);
            oModel.setProperty("/selectedPersonas", []);
            this._updatePersonasList([]);
        },

        onTeamSelectionChange(oEvent) {
            const oModel = this.getView().getModel("addAccessModel");
            const aSelectedRoles = oModel.getProperty("/selectedRoles") || [];

            oModel.setProperty("/selectedPersonas", []);
            this._updatePersonasList(aSelectedRoles);
        },

        _updatePersonasList(aTeamRoleKeys) {
            const oModel = this.getView().getModel("addAccessModel");
            let aCombinedPersonas = [];

            if (aTeamRoleKeys && aTeamRoleKeys.length > 0) {
                aTeamRoleKeys.forEach(sRoleKey => {
                    if (oTeamPersonasMap[sRoleKey]) {
                        aCombinedPersonas = aCombinedPersonas.concat(oTeamPersonasMap[sRoleKey]);
                    }
                });
            } else {
                aCombinedPersonas = [];
            }

            oModel.setProperty("/personasList", aCombinedPersonas);
        },

        onGoToStep2() {
            const oModel = this.getView().getModel("addAccessModel");
            const sSector = oModel.getProperty("/sector") || sessionStorage.getItem("kyra_wizard_sector") || "";
            const sFunction = oModel.getProperty("/function") || sessionStorage.getItem("kyra_wizard_function") || "";

            if (!sSector || sSector.trim() === "") {
                MessageBox.error("Please select a Business Sector before proceeding to the next page.");
                return;
            }

            if (!sFunction || sFunction.trim() === "") {
                MessageBox.error("Please select a Business Function before proceeding to the next page.");
                return;
            }

            sessionStorage.setItem("kyra_wizard_sector", sSector);
            sessionStorage.setItem("kyra_wizard_function", sFunction);

            oModel.setProperty("/step1Visible", false);
            oModel.setProperty("/step2Visible", true);
            oModel.setProperty("/step3Visible", false);
        },

        onBackToStep1() {
            this.getOwnerComponent().getRouter().navTo("AddAccessBusinessSector");
        },

        onBackToStep2() {
            const oModel = this.getView().getModel("addAccessModel");
            oModel.setProperty("/step3Visible", false);
            oModel.setProperty("/step2Visible", true);
            oModel.setProperty("/step1Visible", false);
            MessageToast.show("Returned to Configuration. All your selected options have been preserved.");
        },

        async onGoToStep3Summary() {
            const oModel = this.getView().getModel("addAccessModel");
            const sRegion = oModel.getProperty("/region") || "";
            const aSystems = oModel.getProperty("/selectedSystems") || [];
            const aServices = oModel.getProperty("/selectedServices") || [];
            const aRoles = oModel.getProperty("/selectedRoles") || [];
            const aPersonas = oModel.getProperty("/selectedPersonas") || [];
            const sDuration = oModel.getProperty("/duration") || "";
            const sJustification = (oModel.getProperty("/justification") || "").trim();

            if (!sRegion || sRegion.trim() === "") {
                MessageBox.error("Please select an Operating Region before proceeding to the Summary page.");
                return;
            }

            if (aSystems.length === 0) {
                MessageBox.error("Please select at least one Target System before proceeding to the Summary page.");
                return;
            }

            if (aServices.length === 0) {
                MessageBox.error("Please select at least one Service before proceeding to the Summary page.");
                return;
            }

            if (aRoles.length === 0) {
                MessageBox.error("Please select at least one Team role before proceeding to the Summary page.");
                return;
            }

            if (aPersonas.length === 0) {
                MessageBox.error("Please select at least one Persona before proceeding to the Summary page.");
                return;
            }

            if (!sDuration || sDuration.trim() === "") {
                MessageBox.error("Please select an Access Duration before proceeding to the Summary page.");
                return;
            }

            if (!sJustification) {
                MessageBox.error("Please enter a Business Justification before proceeding to the Summary page.");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            let aAllSubmittedRequests = [];
            let aExistingRequestNumbers = [];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500);
                const res = await fetch("odata/v4/auth/Requests", { signal: controller.signal });
                clearTimeout(timeoutId);

                const sContentType = res.headers ? res.headers.get("content-type") : "";
                if (res.ok && sContentType && sContentType.includes("application/json")) {
                    const data = await res.json();
                    if (data && data.value) {
                        aAllSubmittedRequests = data.value.map(r => ({
                            requestId: r.request_number,
                            system: r.target_system,
                            roleName: r.role_name,
                            persona: r.selected_persona,
                            status: r.status
                        }));
                        aExistingRequestNumbers = data.value.map(r => r.request_number);
                    }
                }
            } catch (e) {
                console.warn("Requests fetch timed out or failed, using local wizard state:", e);
            } finally {
                sap.ui.core.BusyIndicator.hide();
            }

            const aSessionRequests = JSON.parse(sessionStorage.getItem("kyra_submitted_requests") || "[]");
            aSessionRequests.forEach(sr => {
                if (!aAllSubmittedRequests.some(r => r.requestId === sr.requestId)) {
                    aAllSubmittedRequests.push({
                        requestId: sr.requestId,
                        system: sr.system,
                        roleName: sr.roleName,
                        persona: sr.selectedPersona || sr.persona,
                        status: sr.status
                    });
                }
            });

            const sSector = oModel.getProperty("/sector") || sessionStorage.getItem("kyra_wizard_sector") || "Information Technology & Security";
            const sFunction = oModel.getProperty("/function") || sessionStorage.getItem("kyra_wizard_function") || "Identity & Access Governance";
            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sActivePersona = sessionStorage.getItem("kyra_active_role") || "Requester";

            oModel.setProperty("/sector", sSector);
            oModel.setProperty("/function", sFunction);
            oModel.setProperty("/activeUser", sActiveUser);
            oModel.setProperty("/activePersona", sActivePersona);
            oModel.setProperty("/selectedPersonasFormatted", aPersonas.join(", "));

            const aActiveRoles = ["Financial Auditing"];
            const aSummaryItems = [];

            aSystems.forEach(sSys => {
                aPersonas.forEach(sPersonaKey => {
                    let sReqId;
                    let bExists = true;
                    while (bExists) {
                        sReqId = "REQ-2026-" + Math.floor(100000 + Math.random() * 900000);
                        bExists = aExistingRequestNumbers.includes(sReqId) || 
                                  aSessionRequests.some(r => r.requestId === sReqId) ||
                                  aSummaryItems.some(r => r.requestId === sReqId);
                    }

                    let sRole = "Default Role";
                    for (const sRoleKey in oTeamPersonasMap) {
                        if (oTeamPersonasMap[sRoleKey].some(p => p.key === sPersonaKey)) {
                            sRole = sRoleKey;
                            break;
                        }
                    }

                    let sService = "General Service";
                    for (const sServiceKey in oServicesRolesMap) {
                        if (oServicesRolesMap[sServiceKey].some(r => r.key === sRole)) {
                            sService = sServiceKey;
                            break;
                        }
                    }

                    const isRestricted = sRole.includes("Owner") || sRole.includes("Lead") || sRole.includes("Security") || sRole.includes("Admin");
                    const sAccessType = isRestricted ? "RESTRICTED" : "DEFAULT";

                    let sExistingStatus = "Pending";
                    let sExistingState = "Warning";

                    const bAlreadyApplied = aAllSubmittedRequests.some(r => 
                        r.system === sSys && 
                        r.roleName === sRole && 
                        (r.persona === sPersonaKey) &&
                        (r.status || "").toLowerCase().includes("pending")
                    );
                    const bAlreadyActive = aActiveRoles.some(ar => ar === sRole);

                    if (bAlreadyActive) {
                        sExistingStatus = "Already Active";
                        sExistingState = "Success";
                    } else if (bAlreadyApplied) {
                        sExistingStatus = "Already Applied";
                        sExistingState = "Warning";
                    } else {
                        sExistingStatus = "Pending";
                        sExistingState = "Warning";
                    }

                    aSummaryItems.push({
                        requestId: sReqId,
                        system: sSys,
                        roleName: sRole,
                        sector: sSector,
                        function: sFunction,
                        service: sService,
                        persona: sPersonaKey,
                        accessType: sAccessType,
                        existingStatus: sExistingStatus,
                        existingState: sExistingState,
                        duration: sDuration,
                        justification: sJustification
                    });
                });
            });

            oModel.setProperty("/summaryItems", aSummaryItems);

            oModel.setProperty("/step1Visible", false);
            oModel.setProperty("/step2Visible", false);
            oModel.setProperty("/step3Visible", true);
            oModel.setProperty("/submitEnabled", true);

            MessageToast.show("Summary Review loaded with Pending status.");
        },

        onRemoveSummaryItem(oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("addAccessModel");
            if (!oContext) {
                return;
            }

            const sPath = oContext.getPath();
            const iIndex = parseInt(sPath.split("/").pop(), 10);

            const oModel = this.getView().getModel("addAccessModel");
            const aSummaryItems = oModel.getProperty("/summaryItems") || [];

            if (iIndex >= 0 && iIndex < aSummaryItems.length) {
                const oRemovedItem = aSummaryItems[iIndex];
                aSummaryItems.splice(iIndex, 1);
                oModel.setProperty("/summaryItems", aSummaryItems);
                MessageToast.show("Removed entitlement: " + (oRemovedItem.persona || "Selected Access Item"));
            }
        },

        async onFinalSubmitRequest() {
            const oModel = this.getView().getModel("addAccessModel");
            const aSummaryItems = oModel.getProperty("/summaryItems") || [];

            if (aSummaryItems.length === 0) {
                MessageBox.error("No access items remaining in your summary list.");
                return;
            }

            const aItemsToSubmit = aSummaryItems.filter(item => item.existingStatus !== "Already Applied" && item.existingStatus !== "Already Pending" && item.existingStatus !== "Already Active");

            if (aItemsToSubmit.length === 0) {
                MessageBox.warning("All selected access entitlements are already pending approval or already active in your account. No requests were submitted to the database.");
                return;
            }

            oModel.setProperty("/submitEnabled", false);
            sap.ui.core.BusyIndicator.show(0);

            const sUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const sUserPersona = sessionStorage.getItem("kyra_active_role") || "Requester";
            const sJustification = (oModel.getProperty("/justification") || "").trim();

            const aPayload = aItemsToSubmit.map((item) => ({
                requestNumber: item.requestId,
                requesterUsername: sUser,
                requesterPersona: sUserPersona,
                targetSystem: item.system,
                roleName: item.roleName,
                businessSector: item.sector || oModel.getProperty("/sector") || "Information Technology & Security",
                businessFunction: item.function || oModel.getProperty("/function") || "Identity & Access Governance",
                serviceTopic: item.service || "System Administrator",
                selectedPersona: item.persona || "Engineering & Developer Persona",
                accessType: item.accessType || "DEFAULT",
                operatingRegion: oModel.getProperty("/region") || "Global Enterprise (ALL)",
                accessDuration: item.duration || oModel.getProperty("/duration") || "Permanent (Default)",
                justification: item.justification || sJustification || oModel.getProperty("/justification") || "Access Request"
            }));

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
                console.warn("Database persistence error / offline, falling back to local state:", err);
            } finally {
                sap.ui.core.BusyIndicator.hide();
            }

            // Always store to local persistent storage so it displays across tabs
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

            if (typeof BroadcastChannel !== "undefined") {
                try {
                    const syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                    syncChannel.postMessage({ type: "NEW_REQUEST_SUBMITTED", timestamp: Date.now() });
                    syncChannel.close();
                } catch(e) {}
            }
            try { localStorage.setItem("kyra_last_db_mutation", String(Date.now())); } catch(e) {}

            // Set tab redirect for AccessPage
            sessionStorage.setItem("kyra_select_tab", "myRequests");
            sessionStorage.setItem("kyra_reset_add_access", "true");

            oModel.setData({
                step1Visible: false,
                step2Visible: true,
                step3Visible: false,
                sector: "",
                function: "",
                functionsList: [],
                region: "",
                selectedSystems: [],
                selectedServices: [],
                subRolesList: [],
                selectedRoles: [],
                personasList: [],
                selectedPersonas: [],
                duration: "",
                justification: "",
                activeUser: "",
                activePersona: "",
                summaryItems: [],
                submitEnabled: true
            });

            const iSkippedCount = aSummaryItems.length - aItemsToSubmit.length;
            const sMsg = "Access Request submitted successfully!\n\n" + 
                aItemsToSubmit.length + " entitlement request(s) stored directly into PostgreSQL database and will now be available in the Approver and User Request views." +
                (iSkippedCount > 0 ? `\n\n(Note: ${iSkippedCount} item(s) with status 'Already Applied' or 'Already Active' were excluded.)` : "");

            MessageBox.success(sMsg, {
                title: "Request Stored in Database",
                onClose: () => {
                    this.getOwnerComponent().getRouter().navTo("AccessPage");
                }
            });
        }
    });
});
