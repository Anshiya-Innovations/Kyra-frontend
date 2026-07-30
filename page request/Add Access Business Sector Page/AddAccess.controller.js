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

    return Controller.extend("kyra001.pages.addAccess.AddAccess", {
        onInit() {
            const aInitialFunctions = oFunctionsMap["Information Technology & Security"];
            const aInitialSubRoles = oServicesRolesMap["System Administrator"];

            const oModel = new JSONModel({
                step1Visible: true,
                step2Visible: false,
                step3Visible: false,

                // Step 1 Data
                sector: "Information Technology & Security",
                function: aInitialFunctions[0].key,
                functionsList: aInitialFunctions,

                // Step 2 Data
                region: "Global Enterprise (ALL)",
                selectedSystems: ["SAP BTP Cloud Platform", "KYRA Central Governance"],
                selectedServices: ["System Administrator"],
                subRolesList: aInitialSubRoles,
                selectedRoles: ["IT Developers (System Administrator)", "Lead Engineer (System Administrator)"],
                selectedPersonas: ["Engineering & Developer Persona", "Security & Compliance Auditor Persona"],
                duration: "Permanent (Default)",
                justification: "",

                // Step 3 Formatted Summary Data
                summarySystemsText: "",
                summaryServicesText: "",
                summaryRolesText: "",
                summaryPersonasText: ""
            });

            this.getView().setModel(oModel, "addAccessModel");
        },

        onSectorChange(oEvent) {
            const sSector = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("addAccessModel");

            const aFunctions = oFunctionsMap[sSector] || [];
            const sDefaultFunction = aFunctions.length > 0 ? aFunctions[0].key : "";

            oModel.setProperty("/functionsList", aFunctions);
            oModel.setProperty("/function", sDefaultFunction);
        },

        // --- DYNAMIC MULTI-SERVICES SELECTION & ROLES COMBINATION ---
        onServicesSelectionChange(oEvent) {
            const oModel = this.getView().getModel("addAccessModel");
            const aSelectedServices = oModel.getProperty("/selectedServices") || [];

            let aCombinedRoles = [];

            if (aSelectedServices.length === 0) {
                aCombinedRoles = oServicesRolesMap["System Administrator"];
            } else {
                aSelectedServices.forEach(sServiceKey => {
                    if (oServicesRolesMap[sServiceKey]) {
                        aCombinedRoles = aCombinedRoles.concat(oServicesRolesMap[sServiceKey]);
                    }
                });
            }

            const aDefaultRoles = aCombinedRoles.length > 0 ? [aCombinedRoles[0].key] : [];

            oModel.setProperty("/subRolesList", aCombinedRoles);
            oModel.setProperty("/selectedRoles", aDefaultRoles);
        },

        // --- GO TO STEP 2 (Same Page Pop/Slide Transition) ---
        onGoToStep2() {
            const oModel = this.getView().getModel("addAccessModel");
            const sSector = oModel.getProperty("/sector");
            const sFunction = oModel.getProperty("/function");

            if (!sSector || !sFunction) {
                MessageBox.error("Please select a Business Sector and Business Function.");
                return;
            }

            oModel.setProperty("/step1Visible", false);
            oModel.setProperty("/step2Visible", true);
            oModel.setProperty("/step3Visible", false);
            MessageToast.show("Step 2 Configuration loaded.");
        },

        // --- BACK TO STEP 1 ---
        onBackToStep1() {
            const oModel = this.getView().getModel("addAccessModel");
            oModel.setProperty("/step3Visible", false);
            oModel.setProperty("/step2Visible", false);
            oModel.setProperty("/step1Visible", true);
        },

        // --- GO TO STEP 3 SUMMARY PAGE ("Next" Button) ---
        onGoToStep3Summary() {
            const oModel = this.getView().getModel("addAccessModel");
            const aSystems = oModel.getProperty("/selectedSystems") || [];
            const aServices = oModel.getProperty("/selectedServices") || [];
            const aRoles = oModel.getProperty("/selectedRoles") || [];
            const aPersonas = oModel.getProperty("/selectedPersonas") || [];
            const sJustification = oModel.getProperty("/justification") || "";

            if (aSystems.length === 0) {
                MessageBox.error("Please select at least one system.");
                return;
            }

            if (aServices.length === 0) {
                MessageBox.error("Please select at least one Service.");
                return;
            }

            if (aRoles.length === 0) {
                MessageBox.error("Please select at least one Team role.");
                return;
            }

            if (aPersonas.length === 0) {
                MessageBox.error("Please select at least one Persona.");
                return;
            }

            if (!sJustification.trim()) {
                MessageBox.error("Please provide a business justification for adding access.");
                return;
            }

            // Populate formatted summary strings
            oModel.setProperty("/summarySystemsText", aSystems.join("  •  "));
            oModel.setProperty("/summaryServicesText", aServices.join("  •  "));
            oModel.setProperty("/summaryRolesText", aRoles.join("  •  "));
            oModel.setProperty("/summaryPersonasText", aPersonas.join("  •  "));

            // Switch to Step 3 Summary
            oModel.setProperty("/step1Visible", false);
            oModel.setProperty("/step2Visible", false);
            oModel.setProperty("/step3Visible", true);

            MessageToast.show("Summary Review loaded. Please review all details.");
        },

        // --- BACK TO STEP 2 CONFIGURATION ---
        onBackToStep2() {
            const oModel = this.getView().getModel("addAccessModel");
            oModel.setProperty("/step3Visible", false);
            oModel.setProperty("/step2Visible", true);
        },

        // --- FINAL SUBMIT ACCESS REQUEST ---
        onFinalSubmitRequest() {
            const oModel = this.getView().getModel("addAccessModel");
            const sReqId = "REQ-2026-" + Math.floor(1000 + Math.random() * 9000);
            const sSystems = oModel.getProperty("/summarySystemsText");

            MessageBox.success("Access Request " + sReqId + " has been successfully submitted and routed for governance approval!\n\nTarget Systems: " + sSystems, {
                title: "Request Submitted Successfully",
                onClose: () => {
                    this.onNavBackToPortal();
                }
            });
        },

        onNavBackToPortal() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("AccessPage");
        }
    });
});
