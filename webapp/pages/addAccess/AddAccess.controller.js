sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "kyra001/model/KyraLoader"
], (Controller, JSONModel, MessageToast, MessageBox, KyraLoader) => {
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
            "xsuaa (Authorization and Trust Management Service)": [
                    {
                            "key": "IAM & Directory Governance Team",
                            "text": "IAM & Directory Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "xsuaa": [
                    {
                            "key": "IAM & Directory Governance Team",
                            "text": "IAM & Directory Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "identity (Cloud Identity Services - IAS / IdP / SSO)": [
                    {
                            "key": "Enterprise IAM & Directory Team",
                            "text": "Enterprise IAM & Directory Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "identity": [
                    {
                            "key": "Enterprise IAM & Directory Team",
                            "text": "Enterprise IAM & Directory Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "credstore (SAP Credential Store)": [
                    {
                            "key": "Cloud Security Operations Team",
                            "text": "Cloud Security Operations Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "credstore": [
                    {
                            "key": "Cloud Security Operations Team",
                            "text": "Cloud Security Operations Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "auditlog-management (Audit Log Service)": [
                    {
                            "key": "GRC & Regulatory Compliance Team",
                            "text": "GRC & Regulatory Compliance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "auditlog-management": [
                    {
                            "key": "GRC & Regulatory Compliance Team",
                            "text": "GRC & Regulatory Compliance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "uas (User Account and Authentication Service)": [
                    {
                            "key": "IAM & Directory Governance Team",
                            "text": "IAM & Directory Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "uas": [
                    {
                            "key": "IAM & Directory Governance Team",
                            "text": "IAM & Directory Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "personal-data-manager-service (Data Privacy & GDPR Governance)": [
                    {
                            "key": "Data Privacy & Legal Compliance Team",
                            "text": "Data Privacy & Legal Compliance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "personal-data-manager-service": [
                    {
                            "key": "Data Privacy & Legal Compliance Team",
                            "text": "Data Privacy & Legal Compliance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "destination & connectivity (Destinations & Cloud Connector Tunneling)": [
                    {
                            "key": "Hybrid Connectivity & Network Team",
                            "text": "Hybrid Connectivity & Network Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "destination": [
                    {
                            "key": "Hybrid Connectivity & Network Team",
                            "text": "Hybrid Connectivity & Network Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "it-rt (SAP Integration Suite / Cloud Integration Runtime)": [
                    {
                            "key": "Enterprise Integration Engineering Team",
                            "text": "Enterprise Integration Engineering Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "it-rt": [
                    {
                            "key": "Enterprise Integration Engineering Team",
                            "text": "Enterprise Integration Engineering Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "sap-graph (Unified Enterprise Data Access)": [
                    {
                            "key": "API & Graph Platform Team",
                            "text": "API & Graph Platform Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "sap-graph": [
                    {
                            "key": "API & Graph Platform Team",
                            "text": "API & Graph Platform Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "saas-registry & service-manager (Tenant Provisioning & Service Broker)": [
                    {
                            "key": "Multi-Tenant Architecture Team",
                            "text": "Multi-Tenant Architecture Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "saas-registry": [
                    {
                            "key": "Multi-Tenant Architecture Team",
                            "text": "Multi-Tenant Architecture Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "one-mds (Master Data Integration Service)": [
                    {
                            "key": "Enterprise Data Management Team",
                            "text": "Enterprise Data Management Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "one-mds": [
                    {
                            "key": "Enterprise Data Management Team",
                            "text": "Enterprise Data Management Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "apimanagement-apiportal-trial / apimanagement-devportal-trial": [
                    {
                            "key": "API Management & Gateway Team",
                            "text": "API Management & Gateway Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "apimanagement-trial": [
                    {
                            "key": "API Management & Gateway Team",
                            "text": "API Management & Gateway Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "build-workzone-standard (SAP Build Work Zone / Fiori Launchpad)": [
                    {
                            "key": "Digital Workplace & Portal Team",
                            "text": "Digital Workplace & Portal Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "build-workzone-standard": [
                    {
                            "key": "Digital Workplace & Portal Team",
                            "text": "Digital Workplace & Portal Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "html5-apps-repo & app-front (HTML5 Repository & Frontend Hosting)": [
                    {
                            "key": "Frontend Application Engineering Team",
                            "text": "Frontend Application Engineering Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "html5-apps-repo": [
                    {
                            "key": "Frontend Application Engineering Team",
                            "text": "Frontend Application Engineering Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "theming & ui5-flexibility-keyuser (Theme Designer & UI Adaptation)": [
                    {
                            "key": "UI/UX & Design Systems Team",
                            "text": "UI/UX & Design Systems Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "theming": [
                    {
                            "key": "UI/UX & Design Systems Team",
                            "text": "UI/UX & Design Systems Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "hana-cloud / hana / hanatrial (SAP HANA Cloud DB & Data Lake)": [
                    {
                            "key": "Cloud Database Administration (DBA) Team",
                            "text": "Cloud Database Administration (DBA) Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "hana-cloud": [
                    {
                            "key": "Cloud Database Administration (DBA) Team",
                            "text": "Cloud Database Administration (DBA) Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "postgresql-db (PostgreSQL Backing Service)": [
                    {
                            "key": "Cloud Database Administration (DBA) Team",
                            "text": "Cloud Database Administration (DBA) Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "postgresql-db": [
                    {
                            "key": "Cloud Database Administration (DBA) Team",
                            "text": "Cloud Database Administration (DBA) Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "redis-cache (Redis In-Memory Cache)": [
                    {
                            "key": "Data Infrastructure & Caching Team",
                            "text": "Data Infrastructure & Caching Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "redis-cache": [
                    {
                            "key": "Data Infrastructure & Caching Team",
                            "text": "Data Infrastructure & Caching Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "process-automation-service (SAP Build Process Automation / Workflows & RPA)": [
                    {
                            "key": "Intelligent Business Automation Team",
                            "text": "Intelligent Business Automation Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "process-automation-service": [
                    {
                            "key": "Intelligent Business Automation Team",
                            "text": "Intelligent Business Automation Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "document-information-extraction-trial & document-translation": [
                    {
                            "key": "Cognitive Document Intelligence Team",
                            "text": "Cognitive Document Intelligence Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "document-information-extraction-trial": [
                    {
                            "key": "Cognitive Document Intelligence Team",
                            "text": "Cognitive Document Intelligence Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "data-attribute-recommendation-trial / business-entity / service-ticket-intelligence": [
                    {
                            "key": "Enterprise Machine Learning & AI Team",
                            "text": "Enterprise Machine Learning & AI Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "data-attribute-recommendation-trial": [
                    {
                            "key": "Enterprise Machine Learning & AI Team",
                            "text": "Enterprise Machine Learning & AI Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "abap-trial & xfs-runtime-trial (ABAP Cloud / Steampunk & Extension Suite)": [
                    {
                            "key": "Core Extension Engineering Team",
                            "text": "Core Extension Engineering Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "abap-trial": [
                    {
                            "key": "Core Extension Engineering Team",
                            "text": "Core Extension Engineering Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "mobile-services (SAP Mobile Services)": [
                    {
                            "key": "Enterprise Mobility Team",
                            "text": "Enterprise Mobility Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "mobile-services": [
                    {
                            "key": "Enterprise Mobility Team",
                            "text": "Enterprise Mobility Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "jobscheduler & autoscaler (Task Scheduling & Dynamic Scaling)": [
                    {
                            "key": "Platform Operations & Reliability Team",
                            "text": "Platform Operations & Reliability Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "jobscheduler": [
                    {
                            "key": "Platform Operations & Reliability Team",
                            "text": "Platform Operations & Reliability Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "application-logs & alert-notification (Logging & Real-time Alerts)": [
                    {
                            "key": "Cloud Observability & Monitoring Team",
                            "text": "Cloud Observability & Monitoring Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "application-logs": [
                    {
                            "key": "Cloud Observability & Monitoring Team",
                            "text": "Cloud Observability & Monitoring Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "feature-flags & transport (Feature Toggles & Cloud Transport - cTMS)": [
                    {
                            "key": "Release Engineering & Governance Team",
                            "text": "Release Engineering & Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "feature-flags": [
                    {
                            "key": "Release Engineering & Governance Team",
                            "text": "Release Engineering & Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "cis (Cloud Management Service)": [
                    {
                            "key": "Subaccount & Tenant Governance Team",
                            "text": "Subaccount & Tenant Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ],
            "cis": [
                    {
                            "key": "Subaccount & Tenant Governance Team",
                            "text": "Subaccount & Tenant Governance Team",
                            "icon": "sap-icon://user-settings"
                    }
            ]
    };

    const oTeamPersonasMap = {
            "IAM & Directory Governance Team": [
                    {
                            "key": "User Account Lifecycle Administrator",
                            "text": "User Account Lifecycle Administrator",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Enterprise IAM & Directory Team": [
                    {
                            "key": "Single Sign-On (SSO) Specialist",
                            "text": "Single Sign-On (SSO) Specialist",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Corporate IdP Administrator",
                            "text": "Corporate IdP Administrator",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Cloud Security Operations Team": [
                    {
                            "key": "Cryptographic Secrets Custodian",
                            "text": "Cryptographic Secrets Custodian",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Cloud Security Officer",
                            "text": "Cloud Security Officer",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "GRC & Regulatory Compliance Team": [
                    {
                            "key": "Compliance & Security Trail Auditor",
                            "text": "Compliance & Security Trail Auditor",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Forensic Audit Specialist",
                            "text": "Forensic Audit Specialist",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Data Privacy & Legal Compliance Team": [
                    {
                            "key": "Data Privacy Officer (GDPR / Regulatory)",
                            "text": "Data Privacy Officer (GDPR / Regulatory)",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Personal Data Governance Specialist",
                            "text": "Personal Data Governance Specialist",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Hybrid Connectivity & Network Team": [
                    {
                            "key": "Cloud Connector Network Engineer",
                            "text": "Cloud Connector Network Engineer",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "On-Premise Tunneling Specialist",
                            "text": "On-Premise Tunneling Specialist",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Enterprise Integration Engineering Team": [
                    {
                            "key": "iFlow / Cloud Integration Developer",
                            "text": "iFlow / Cloud Integration Developer",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Enterprise Integration Architect",
                            "text": "Enterprise Integration Architect",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "API & Graph Platform Team": [
                    {
                            "key": "SAP Graph API Architect",
                            "text": "SAP Graph API Architect",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Multi-Tenant Architecture Team": [
                    {
                            "key": "SaaS Provisioning Operations Lead",
                            "text": "SaaS Provisioning Operations Lead",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Service Broker Administrator",
                            "text": "Service Broker Administrator",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Enterprise Data Management Team": [
                    {
                            "key": "Master Data Integration Engineer",
                            "text": "Master Data Integration Engineer",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "API Management & Gateway Team": [
                    {
                            "key": "API Product Manager (API Portal)",
                            "text": "API Product Manager (API Portal)",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Developer Hub Community Specialist (Dev Portal)",
                            "text": "Developer Hub Community Specialist (Dev Portal)",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Digital Workplace & Portal Team": [
                    {
                            "key": "Unified Launchpad Administrator",
                            "text": "Unified Launchpad Administrator",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Digital Workplace Content Manager",
                            "text": "Digital Workplace Content Manager",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Frontend Application Engineering Team": [
                    {
                            "key": "UI5 / Fiori Web Application Developer",
                            "text": "UI5 / Fiori Web Application Developer",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "HTML5 Application Release Lead",
                            "text": "HTML5 Application Release Lead",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "UI/UX & Design Systems Team": [
                    {
                            "key": "Corporate Brand & Theme Designer",
                            "text": "Corporate Brand & Theme Designer",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Fiori Key-User Adaptation Specialist",
                            "text": "Fiori Key-User Adaptation Specialist",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Cloud Database Administration (DBA) Team": [
                    {
                            "key": "PostgreSQL Database Specialist",
                            "text": "PostgreSQL Database Specialist",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Data Infrastructure & Caching Team": [
                    {
                            "key": "In-Memory Cache & Performance Engineer",
                            "text": "In-Memory Cache & Performance Engineer",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Intelligent Business Automation Team": [
                    {
                            "key": "Workflow & Decision Logic Architect",
                            "text": "Workflow & Decision Logic Architect",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "RPA Bot Developer & Operations Lead",
                            "text": "RPA Bot Developer & Operations Lead",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Cognitive Document Intelligence Team": [
                    {
                            "key": "OCR & Invoice Processing Specialist",
                            "text": "OCR & Invoice Processing Specialist",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Multilingual Translation Operations Lead",
                            "text": "Multilingual Translation Operations Lead",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Enterprise Machine Learning & AI Team": [
                    {
                            "key": "Predictive Recommendations Data Scientist",
                            "text": "Predictive Recommendations Data Scientist",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "NLP & Entity Recognition Engineer",
                            "text": "NLP & Entity Recognition Engineer",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Core Extension Engineering Team": [
                    {
                            "key": "ABAP Cloud (Steampunk) Developer",
                            "text": "ABAP Cloud (Steampunk) Developer",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Extension Suite Runtime Architect",
                            "text": "Extension Suite Runtime Architect",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Enterprise Mobility Team": [
                    {
                            "key": "Mobile Application & Push Notifications Engineer",
                            "text": "Mobile Application & Push Notifications Engineer",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Platform Operations & Reliability Team": [
                    {
                            "key": "Site Reliability Engineer (SRE)",
                            "text": "Site Reliability Engineer (SRE)",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Scheduled Job & Batch Processing Admin",
                            "text": "Scheduled Job & Batch Processing Admin",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Cloud Observability & Monitoring Team": [
                    {
                            "key": "Observability & Log Analytics Specialist",
                            "text": "Observability & Log Analytics Specialist",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Incident & Alert Notification Manager",
                            "text": "Incident & Alert Notification Manager",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Release Engineering & Governance Team": [
                    {
                            "key": "Release Manager & cTMS Transport Custodian",
                            "text": "Release Manager & cTMS Transport Custodian",
                            "icon": "sap-icon://person-placeholder"
                    },
                    {
                            "key": "Progressive Delivery / Feature Flag Operator",
                            "text": "Progressive Delivery / Feature Flag Operator",
                            "icon": "sap-icon://person-placeholder"
                    }
            ],
            "Subaccount & Tenant Governance Team": [
                    {
                            "key": "Subaccount & Entitlements Administrator",
                            "text": "Subaccount & Entitlements Administrator",
                            "icon": "sap-icon://person-placeholder"
                    }
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
            const oSelectAll = document.getElementById("selectAllBtnAddAccess") || document.getElementById("selectAllBtn");
            if (oSelectAll) {
                const bAllSelected = this._aSelectedRegionIds.length === this._regionList.length && this._regionList.length > 0;
                oSelectAll.classList.toggle("active", bAllSelected);
                const oText = oSelectAll.querySelector(".select-all-text");
                if (oText) {
                    oText.textContent = bAllSelected ? "All Regions Selected" : "Select All Regions";
                }
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
            sessionStorage.removeItem("kyra_reset_add_access");
            if (bResetFlag || !sessionStorage.getItem("kyra_wizard_sector")) {
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
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            sessionStorage.removeItem("kyra_wizard_pre_sector");
            sessionStorage.removeItem("kyra_wizard_pre_function");
            sessionStorage.setItem("kyra_reset_add_access", "true");
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
            this.getOwnerComponent().getRouter().navTo("AccessPage");
        },

        onCloseAddAccessSector() {
            this.onNavBackToPortal();
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
                    } else {
                        const sRoleClean = sRoleKey.replace(/\s*\([^)]*\)/g, "").trim();
                        if (oTeamPersonasMap[sRoleClean]) {
                            aCombinedPersonas = aCombinedPersonas.concat(oTeamPersonasMap[sRoleClean]);
                        }
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

            // Add Access operations proceed without loading indicators per strict exception

            let aAllSubmittedRequests = [];
            let aExistingRequestNumbers = [];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500);
                const res = await fetch("/odata/v4/admin-portal/GovernanceHistory", { signal: controller.signal });
                clearTimeout(timeoutId);

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
            } catch (e) {
                console.warn("Requests fetch timed out or failed, using local wizard state:", e);
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
            const seenRoleSystemKeys = new Map();

            aSystems.forEach(sSys => {
                aPersonas.forEach(sPersonaKey => {
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

                    // Deduplicate by target system + role name to ensure 1-to-1 matching with active entitlements
                    const sRoleSysKey = (sSys || "").trim().toLowerCase() + ":::" + (sRole || "").trim().toLowerCase();
                    if (seenRoleSystemKeys.has(sRoleSysKey)) {
                        const existing = seenRoleSystemKeys.get(sRoleSysKey);
                        if (existing && sPersonaKey && !existing.persona.includes(sPersonaKey)) {
                            existing.persona = existing.persona + ", " + sPersonaKey;
                        }
                        return;
                    }

                    let sReqId;
                    let bExists = true;
                    while (bExists) {
                        sReqId = "REQ-2026-" + Math.floor(100000 + Math.random() * 900000);
                        bExists = aExistingRequestNumbers.includes(sReqId) || 
                                  aSessionRequests.some(r => r.requestId === sReqId) ||
                                  aSummaryItems.some(r => r.requestId === sReqId);
                    }

                    const aAllowedRestrictedPersonas = [
                        "cloud infrastructure administrator",
                        "database & iam administrator",
                        "devops & platform lead",
                        "cybersecurity operations",
                        "identity management specialist",
                        "solution architecture owner",
                        "integration engineering lead"
                    ];
                    const sCleanPersonaKey = String(sPersonaKey || "").replace(/\s*\([^)]*\)\s*$/g, "").replace(/\s+persona\b/gi, "").trim().toLowerCase();
                    const isRestricted = aAllowedRestrictedPersonas.includes(sCleanPersonaKey);
                    const sAccessType = isRestricted ? "RESTRICTED" : "DEFAULT";

                    let sExistingStatus = "Pending";
                    let sExistingState = "Warning";

                    const bAlreadyApplied = aAllSubmittedRequests.some(r => 
                        r.system === sSys && 
                        r.roleName === sRole && 
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

                    const oNewSummaryItem = {
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
                    };
                    seenRoleSystemKeys.set(sRoleSysKey, oNewSummaryItem);
                    aSummaryItems.push(oNewSummaryItem);
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
            if (this._bIsSubmitting) {
                console.warn("Access request submission is already in flight. Ignoring duplicate click.");
                return;
            }
            this._bIsSubmitting = true;
            const oModel = this.getView().getModel("addAccessModel");
            const aSummaryItems = oModel ? (oModel.getProperty("/summaryItems") || []) : [];

            if (aSummaryItems.length === 0) {
                this._bIsSubmitting = false;
                MessageBox.error("No access items remaining in your summary list.");
                return;
            }

            const isExcludedFromSubmit = (item) => {
                const s = (item.existingStatus || "").toLowerCase();
                const st = (item.statusType || "").toLowerCase();
                return s.startsWith("already") || s.includes("revoke") || st === "revoke_pending";
            };
            const aItemsToSubmit = aSummaryItems.filter(item => !isExcludedFromSubmit(item));

            if (aItemsToSubmit.length === 0) {
                MessageBox.warning("All selected access entitlements are already pending approval or already active in your account. No requests were submitted to the database.");
                return;
            }

            oModel.setProperty("/submitEnabled", false);

            // Show unified SAP Fiori loading screen with #008C9C spinner during Add Access submit
            window._kyraSubmittingAddAccess = true;
            window._kyraSubmittingRequest = true;
            const oLoader = (typeof KyraLoader !== "undefined" && KyraLoader) || window.KyraLoader;
            if (oLoader && typeof oLoader.show === "function") {
                oLoader.show({
                    title: "Submitting Access Request...",
                    subtitle: "Processing entitlements and persisting governance records...",
                    duration: 35000
                });
            } else if (window.showKyraLoading) {
                window.showKyraLoading("Submitting Access Request...", "Processing entitlements and persisting governance records...", 35000);
            }

            const sUser = sessionStorage.getItem("kyra_active_user") || "";
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
                serviceTopic: item.service || "",
                selectedPersona: item.persona || "",
                accessType: item.accessType || "DEFAULT",
                operatingRegion: oModel.getProperty("/region") || "Global Enterprise (ALL)",
                accessDuration: item.duration || oModel.getProperty("/duration") || "Permanent (Default)",
                justification: item.justification || sJustification || oModel.getProperty("/justification") || "Access Request"
            }));

            try {
                // Post directly to backend database service endpoint
                const response = await fetch("/odata/v4/auth/submitAccessRequest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requests: aPayload })
                });

                const text = await response.text();
                let data = {};
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { error: { message: text || response.statusText } };
                }

                if (!response.ok || (data.error && data.error.message)) {
                    window._kyraSubmittingAddAccess = false;
                    window._kyraSubmittingRequest = false;
                    const sErrMsg = (data.error && data.error.message) ? data.error.message : "Failed to persist request into database.";
                    if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                        window.KyraLoader.hide();
                    } else if (window.hideKyraLoading) {
                        window.hideKyraLoading();
                    }
                    sap.ui.core.BusyIndicator.hide();
                    oModel.setProperty("/submitEnabled", true);
                    MessageBox.error("Database Conflict / Error:\n\n" + sErrMsg);
                    return;
                }

                console.log("Successfully persisted request into PostgreSQL database:", data);

                if (typeof BroadcastChannel !== "undefined") {
                    try {
                        const syncChannel = new BroadcastChannel("kyra_db_sync_channel");
                        syncChannel.postMessage({ type: "NEW_REQUEST_SUBMITTED", timestamp: Date.now() });
                        syncChannel.close();
                    } catch(e) {}
                }
                try { localStorage.setItem("kyra_last_db_mutation", String(Date.now())); } catch(e) {}
            } catch (err) {
                window._kyraSubmittingAddAccess = false;
                window._kyraSubmittingRequest = false;
                if (window.KyraLoader && typeof window.KyraLoader.forceHide === "function") {
                    window.KyraLoader.forceHide();
                } else if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide(null, true);
                } else if (window.hideKyraLoading) {
                    window.hideKyraLoading();
                }
                sap.ui.core.BusyIndicator.hide();
                oModel.setProperty("/submitEnabled", true);
                MessageBox.error("Failed to connect to database: " + err.message);
                return;
            } finally {
                this._bIsSubmitting = false;
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }
            }

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

            const fnCompleteSuccess = () => {
                window._kyraSubmittingAddAccess = false;
                MessageBox.success(sMsg, {
                    title: "Request Stored in Database",
                    onClose: () => {
                        this.getOwnerComponent().getRouter().navTo("AccessPage");
                    }
                });
            };

            window._kyraSubmittingAddAccess = false;
            window._kyraSubmittingRequest = false;
            if (oLoader && typeof oLoader.showSuccess === "function") {
                oLoader.showSuccess({
                    title: "Request Stored in Database",
                    subtitle: `Successfully recorded ${aItemsToSubmit.length} access item(s) into database.`,
                    duration: 1800,
                    forceShow: true,
                    onComplete: fnCompleteSuccess
                });
            } else {
                fnCompleteSuccess();
            }
        }
    });
});
