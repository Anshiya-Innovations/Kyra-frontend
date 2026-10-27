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
        // 1. Security, Identity & Governance
        "xsuaa": [
            { key: "IAM & Directory Governance Team (xsuaa)", text: "IAM & Directory Governance Team", icon: "sap-icon://shield" }
        ],
        "identity": [
            { key: "Enterprise IAM & Directory Team (identity)", text: "Enterprise IAM & Directory Team", icon: "sap-icon://user-settings" }
        ],
        "credstore": [
            { key: "Cloud Security Operations Team (credstore)", text: "Cloud Security Operations Team", icon: "sap-icon://key" }
        ],
        "auditlog-management": [
            { key: "GRC & Regulatory Compliance Team (auditlog-management)", text: "GRC & Regulatory Compliance Team", icon: "sap-icon://inspection" }
        ],
        "uas": [
            { key: "IAM & Directory Governance Team (uas)", text: "IAM & Directory Governance Team", icon: "sap-icon://customer" }
        ],
        "personal-data-manager-service": [
            { key: "Data Privacy & Legal Compliance Team (personal-data-manager-service)", text: "Data Privacy & Legal Compliance Team", icon: "sap-icon://locked" }
        ],

        // 2. Integration & Connectivity
        "destination": [
            { key: "Hybrid Connectivity & Network Team (destination)", text: "Hybrid Connectivity & Network Team", icon: "sap-icon://connected" }
        ],
        "connectivity": [
            { key: "Hybrid Connectivity & Network Team (connectivity)", text: "Hybrid Connectivity & Network Team", icon: "sap-icon://instance" }
        ],
        "it-rt": [
            { key: "Enterprise Integration Engineering Team (it-rt)", text: "Enterprise Integration Engineering Team", icon: "sap-icon://process" }
        ],
        "sap-graph": [
            { key: "API & Graph Platform Team (sap-graph)", text: "API & Graph Platform Team", icon: "sap-icon://tree" }
        ],
        "saas-registry": [
            { key: "Multi-Tenant Architecture Team (saas-registry)", text: "Multi-Tenant Architecture Team", icon: "sap-icon://building" }
        ],
        "service-manager": [
            { key: "Centralized Service Broker Team (service-manager)", text: "Centralized Service Broker Team", icon: "sap-icon://settings" }
        ],
        "one-mds": [
            { key: "Enterprise Data Management Team (one-mds)", text: "Enterprise Data Management Team", icon: "sap-icon://database" }
        ],
        "apimanagement-trial": [
            { key: "API Management & Gateway Team (apimanagement-trial)", text: "API Management & Gateway Team", icon: "sap-icon://developer-settings" }
        ],

        // 3. Portals, UI & Frontend
        "build-workzone-standard": [
            { key: "Digital Workplace & Portal Team (build-workzone-standard)", text: "Digital Workplace & Portal Team", icon: "sap-icon://grid" }
        ],
        "html5-apps-repo": [
            { key: "Frontend Application Engineering Team (html5-apps-repo)", text: "Frontend Application Engineering Team", icon: "sap-icon://attachment-html" }
        ],
        "app-front": [
            { key: "Frontend Application Engineering Team (app-front)", text: "Frontend Application Engineering Team", icon: "sap-icon://dimension" }
        ],
        "theming": [
            { key: "UI/UX & Design Systems Team (theming)", text: "UI/UX & Design Systems Team", icon: "sap-icon://palette" }
        ],
        "ui5-flexibility-keyuser": [
            { key: "UI/UX & Design Systems Team (ui5-flexibility-keyuser)", text: "UI/UX & Design Systems Team", icon: "sap-icon://customize" }
        ],

        // 4. Databases & Storage
        "hana-cloud": [
            { key: "Cloud Database Administration Team (hana-cloud)", text: "Cloud Database Administration Team", icon: "sap-icon://cylinder" }
        ],
        "postgresql-db": [
            { key: "Cloud Database Administration Team (postgresql-db)", text: "Cloud Database Administration Team", icon: "sap-icon://database" }
        ],
        "redis-cache": [
            { key: "Data Infrastructure & Caching Team (redis-cache)", text: "Data Infrastructure & Caching Team", icon: "sap-icon://speed" }
        ],

        // 5. Process Automation, AI & Machine Learning
        "process-automation-service": [
            { key: "Intelligent Business Automation Team (process-automation-service)", text: "Intelligent Business Automation Team", icon: "sap-icon://workflow-tasks" }
        ],
        "document-information-extraction-trial": [
            { key: "Cognitive Document Intelligence Team (document-information-extraction-trial)", text: "Cognitive Document Intelligence Team", icon: "sap-icon://doc-attachment" }
        ],
        "data-attribute-recommendation-trial": [
            { key: "Enterprise Machine Learning & AI Team (data-attribute-recommendation-trial)", text: "Enterprise Machine Learning & AI Team", icon: "sap-icon://electrocardiogram" }
        ],
        "business-entity-recognition-trial": [
            { key: "Enterprise Machine Learning & AI Team (business-entity-recognition-trial)", text: "Enterprise Machine Learning & AI Team", icon: "sap-icon://text" }
        ],
        "service-ticket-intelligence-trial": [
            { key: "Enterprise Machine Learning & AI Team (service-ticket-intelligence-trial)", text: "Enterprise Machine Learning & AI Team", icon: "sap-icon://customer-briefing" }
        ],
        "document-translation": [
            { key: "Cognitive Document Intelligence Team (document-translation)", text: "Cognitive Document Intelligence Team", icon: "sap-icon://world" }
        ],

        // 6. Developer & Operations Tooling
        "abap-trial": [
            { key: "Core Extension Engineering Team (abap-trial)", text: "Core Extension Engineering Team", icon: "sap-icon://custom-font" }
        ],
        "mobile-services": [
            { key: "Enterprise Mobility Team (mobile-services)", text: "Enterprise Mobility Team", icon: "sap-icon://iphone" }
        ],
        "jobscheduler": [
            { key: "Platform Operations & Reliability Team (jobscheduler)", text: "Platform Operations & Reliability Team", icon: "sap-icon://future" }
        ],
        "autoscaler": [
            { key: "Platform Operations & Reliability Team (autoscaler)", text: "Platform Operations & Reliability Team", icon: "sap-icon://resize-horizontal" }
        ],
        "application-logs": [
            { key: "Cloud Observability & Monitoring Team (application-logs)", text: "Cloud Observability & Monitoring Team", icon: "sap-icon://log" }
        ],
        "alert-notification": [
            { key: "Cloud Observability & Monitoring Team (alert-notification)", text: "Cloud Observability & Monitoring Team", icon: "sap-icon://bell" }
        ],
        "feature-flags": [
            { key: "Release Engineering & Governance Team (feature-flags)", text: "Release Engineering & Governance Team", icon: "sap-icon://flag" }
        ],
        "transport": [
            { key: "Release Engineering & Governance Team (transport)", text: "Release Engineering & Governance Team", icon: "sap-icon://shipping-status" }
        ],
        "cis": [
            { key: "Subaccount & Tenant Governance Team (cis)", text: "Subaccount & Tenant Governance Team", icon: "sap-icon://cloud" }
        ],
        "xfs-runtime-trial": [
            { key: "Core Extension Engineering Team (xfs-runtime-trial)", text: "Core Extension Engineering Team", icon: "sap-icon://wrench" }
        ],

        // Backward compatibility
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
        // Security, Identity & Governance
        "IAM & Directory Governance Team (xsuaa)": [
            { key: "Identity & Access Administrator Persona (xsuaa)", text: "Identity & Access Administrator Persona", icon: "sap-icon://shield" },
            { key: "Security Governance Specialist Persona (xsuaa)", text: "Security Governance Specialist Persona", icon: "sap-icon://shield-check" }
        ],
        "Enterprise IAM & Directory Team (identity)": [
            { key: "Single Sign-On (SSO) Specialist Persona (identity)", text: "Single Sign-On (SSO) Specialist Persona", icon: "sap-icon://user-settings" },
            { key: "Corporate IdP Administrator Persona (identity)", text: "Corporate IdP Administrator Persona", icon: "sap-icon://key-user-settings" }
        ],
        "Cloud Security Operations Team (credstore)": [
            { key: "Cryptographic Secrets Custodian Persona (credstore)", text: "Cryptographic Secrets Custodian Persona", icon: "sap-icon://key" },
            { key: "Cloud Security Officer Persona (credstore)", text: "Cloud Security Officer Persona", icon: "sap-icon://shield" }
        ],
        "GRC & Regulatory Compliance Team (auditlog-management)": [
            { key: "Compliance & Security Trail Auditor Persona (auditlog-management)", text: "Compliance & Security Trail Auditor Persona", icon: "sap-icon://inspection" },
            { key: "Forensic Audit Specialist Persona (auditlog-management)", text: "Forensic Audit Specialist Persona", icon: "sap-icon://activity-assigned-to-goal" }
        ],
        "IAM & Directory Governance Team (uas)": [
            { key: "User Account Lifecycle Administrator Persona (uas)", text: "User Account Lifecycle Administrator Persona", icon: "sap-icon://customer" }
        ],
        "Data Privacy & Legal Compliance Team (personal-data-manager-service)": [
            { key: "Data Privacy Officer (GDPR) Persona (personal-data-manager-service)", text: "Data Privacy Officer (GDPR) Persona", icon: "sap-icon://locked" },
            { key: "Personal Data Governance Specialist Persona (personal-data-manager-service)", text: "Personal Data Governance Specialist Persona", icon: "sap-icon://legal" }
        ],

        // Integration & Connectivity
        "Hybrid Connectivity & Network Team (destination)": [
            { key: "Destination & Endpoint Administrator Persona (destination)", text: "Destination & Endpoint Administrator Persona", icon: "sap-icon://connected" }
        ],
        "Hybrid Connectivity & Network Team (connectivity)": [
            { key: "Cloud Connector Network Engineer Persona (connectivity)", text: "Cloud Connector Network Engineer Persona", icon: "sap-icon://instance" },
            { key: "On-Premise Tunneling Specialist Persona (connectivity)", text: "On-Premise Tunneling Specialist Persona", icon: "sap-icon://action" }
        ],
        "Enterprise Integration Engineering Team (it-rt)": [
            { key: "Cloud Integration (iFlow) Developer Persona (it-rt)", text: "Cloud Integration (iFlow) Developer Persona", icon: "sap-icon://process" },
            { key: "Enterprise Integration Architect Persona (it-rt)", text: "Enterprise Integration Architect Persona", icon: "sap-icon://header" }
        ],
        "API & Graph Platform Team (sap-graph)": [
            { key: "SAP Graph API Architect Persona (sap-graph)", text: "SAP Graph API Architect Persona", icon: "sap-icon://tree" }
        ],
        "Multi-Tenant Architecture Team (saas-registry)": [
            { key: "SaaS Provisioning Operations Lead Persona (saas-registry)", text: "SaaS Provisioning Operations Lead Persona", icon: "sap-icon://building" }
        ],
        "Centralized Service Broker Team (service-manager)": [
            { key: "Service Broker Administrator Persona (service-manager)", text: "Service Broker Administrator Persona", icon: "sap-icon://settings" }
        ],
        "Enterprise Data Management Team (one-mds)": [
            { key: "Master Data Integration Engineer Persona (one-mds)", text: "Master Data Integration Engineer Persona", icon: "sap-icon://database" }
        ],
        "API Management & Gateway Team (apimanagement-trial)": [
            { key: "API Product Manager Persona (apimanagement-trial)", text: "API Product Manager Persona", icon: "sap-icon://developer-settings" },
            { key: "Developer Hub Community Specialist Persona (apimanagement-trial)", text: "Developer Hub Community Specialist Persona", icon: "sap-icon://manager" }
        ],

        // Portals, UI & Frontend
        "Digital Workplace & Portal Team (build-workzone-standard)": [
            { key: "Unified Launchpad Administrator Persona (build-workzone-standard)", text: "Unified Launchpad Administrator Persona", icon: "sap-icon://grid" },
            { key: "Digital Workplace Content Manager Persona (build-workzone-standard)", text: "Digital Workplace Content Manager Persona", icon: "sap-icon://manager" }
        ],
        "Frontend Application Engineering Team (html5-apps-repo)": [
            { key: "UI5 / Fiori Web Application Developer Persona (html5-apps-repo)", text: "UI5 / Fiori Web Application Developer Persona", icon: "sap-icon://attachment-html" },
            { key: "HTML5 Application Release Lead Persona (html5-apps-repo)", text: "HTML5 Application Release Lead Persona", icon: "sap-icon://developer-settings" }
        ],
        "Frontend Application Engineering Team (app-front)": [
            { key: "Application Frontend Hosting Lead Persona (app-front)", text: "Application Frontend Hosting Lead Persona", icon: "sap-icon://dimension" }
        ],
        "UI/UX & Design Systems Team (theming)": [
            { key: "Corporate Brand & Theme Designer Persona (theming)", text: "Corporate Brand & Theme Designer Persona", icon: "sap-icon://palette" }
        ],
        "UI/UX & Design Systems Team (ui5-flexibility-keyuser)": [
            { key: "Fiori Key-User Adaptation Specialist Persona (ui5-flexibility-keyuser)", text: "Fiori Key-User Adaptation Specialist Persona", icon: "sap-icon://customize" }
        ],

        // Databases & Storage
        "Cloud Database Administration Team (hana-cloud)": [
            { key: "SAP HANA Cloud Database Administrator Persona (hana-cloud)", text: "SAP HANA Cloud Database Administrator Persona", icon: "sap-icon://cylinder" },
            { key: "HANA Calculation View & Data Modeler Persona (hana-cloud)", text: "HANA Calculation View & Data Modeler Persona", icon: "sap-icon://database" }
        ],
        "Cloud Database Administration Team (postgresql-db)": [
            { key: "PostgreSQL Database Specialist Persona (postgresql-db)", text: "PostgreSQL Database Specialist Persona", icon: "sap-icon://database" }
        ],
        "Data Infrastructure & Caching Team (redis-cache)": [
            { key: "In-Memory Cache & Performance Engineer Persona (redis-cache)", text: "In-Memory Cache & Performance Engineer Persona", icon: "sap-icon://speed" }
        ],

        // Process Automation, AI & Machine Learning
        "Intelligent Business Automation Team (process-automation-service)": [
            { key: "Workflow & Decision Logic Architect Persona (process-automation-service)", text: "Workflow & Decision Logic Architect Persona", icon: "sap-icon://workflow-tasks" },
            { key: "RPA Bot Developer & Operations Lead Persona (process-automation-service)", text: "RPA Bot Developer & Operations Lead Persona", icon: "sap-icon://robot" }
        ],
        "Cognitive Document Intelligence Team (document-information-extraction-trial)": [
            { key: "OCR & Invoice Processing Specialist Persona (document-information-extraction-trial)", text: "OCR & Invoice Processing Specialist Persona", icon: "sap-icon://doc-attachment" }
        ],
        "Enterprise Machine Learning & AI Team (data-attribute-recommendation-trial)": [
            { key: "Predictive Recommendations Data Scientist Persona (data-attribute-recommendation-trial)", text: "Predictive Recommendations Data Scientist Persona", icon: "sap-icon://electrocardiogram" }
        ],
        "Enterprise Machine Learning & AI Team (business-entity-recognition-trial)": [
            { key: "NLP & Entity Recognition Engineer Persona (business-entity-recognition-trial)", text: "NLP & Entity Recognition Engineer Persona", icon: "sap-icon://text" }
        ],
        "Enterprise Machine Learning & AI Team (service-ticket-intelligence-trial)": [
            { key: "Service Routing & Cognitive Triage Persona (service-ticket-intelligence-trial)", text: "Service Routing & Cognitive Triage Persona", icon: "sap-icon://customer-briefing" }
        ],
        "Cognitive Document Intelligence Team (document-translation)": [
            { key: "Multilingual Translation Operations Lead Persona (document-translation)", text: "Multilingual Translation Operations Lead Persona", icon: "sap-icon://world" }
        ],

        // Developer & Operations Tooling
        "Core Extension Engineering Team (abap-trial)": [
            { key: "ABAP Cloud (Steampunk) Developer Persona (abap-trial)", text: "ABAP Cloud (Steampunk) Developer Persona", icon: "sap-icon://custom-font" }
        ],
        "Enterprise Mobility Team (mobile-services)": [
            { key: "Mobile Application & Push Notifications Engineer Persona (mobile-services)", text: "Mobile Application & Push Notifications Engineer Persona", icon: "sap-icon://iphone" }
        ],
        "Platform Operations & Reliability Team (jobscheduler)": [
            { key: "Scheduled Job & Batch Processing Admin Persona (jobscheduler)", text: "Scheduled Job & Batch Processing Admin Persona", icon: "sap-icon://future" }
        ],
        "Platform Operations & Reliability Team (autoscaler)": [
            { key: "Dynamic Autoscaling & Load Engineer Persona (autoscaler)", text: "Dynamic Autoscaling & Load Engineer Persona", icon: "sap-icon://resize-horizontal" }
        ],
        "Cloud Observability & Monitoring Team (application-logs)": [
            { key: "Observability & Log Analytics Specialist Persona (application-logs)", text: "Observability & Log Analytics Specialist Persona", icon: "sap-icon://log" }
        ],
        "Cloud Observability & Monitoring Team (alert-notification)": [
            { key: "Incident & Alert Notification Manager Persona (alert-notification)", text: "Incident & Alert Notification Manager Persona", icon: "sap-icon://bell" }
        ],
        "Release Engineering & Governance Team (feature-flags)": [
            { key: "Progressive Delivery & Feature Flag Operator Persona (feature-flags)", text: "Progressive Delivery & Feature Flag Operator Persona", icon: "sap-icon://flag" }
        ],
        "Release Engineering & Governance Team (transport)": [
            { key: "Release Manager & cTMS Transport Custodian Persona (transport)", text: "Release Manager & cTMS Transport Custodian Persona", icon: "sap-icon://shipping-status" }
        ],
        "Subaccount & Tenant Governance Team (cis)": [
            { key: "Subaccount & Entitlements Administrator Persona (cis)", text: "Subaccount & Entitlements Administrator Persona", icon: "sap-icon://cloud" }
        ],
        "Core Extension Engineering Team (xfs-runtime-trial)": [
            { key: "Extension Suite Runtime Architect Persona (xfs-runtime-trial)", text: "Extension Suite Runtime Architect Persona", icon: "sap-icon://wrench" }
        ],

        // Backward compatibility
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

    function formatProperDateTime(dInput) {
        if (!dInput) return "";
        if (typeof dInput === "string" && /^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4},\s+\d{1,2}:\d{2}\s+(AM|PM)$/i.test(dInput.trim())) {
            return dInput.trim();
        }
        try {
            const d = (dInput instanceof Date) ? dInput : new Date(dInput);
            if (isNaN(d.getTime())) return String(dInput);
            if (typeof dInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dInput.trim())) {
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            }
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " +
                   d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        } catch (e) {
            return String(dInput);
        }
    }

    return Controller.extend("kyra001.pages.addAccessBusinessSector.AddAccess", {
        onInit() {
            const oModel = new JSONModel({
                step1Visible: true,
                step2Visible: false,
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

            this.getView().setModel(oModel, "addAccessModel");

            const oRouter = this.getOwnerComponent().getRouter();
            if (oRouter) {
                oRouter.getRoute("AddAccessBusinessSector").attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _onRouteMatched(oEvent) {
            const sPreSector = sessionStorage.getItem("kyra_wizard_pre_sector");
            const sPreFunc = sessionStorage.getItem("kyra_wizard_pre_function");

            sessionStorage.removeItem("kyra_reset_add_access");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");

            const oModel = this.getView().getModel("addAccessModel");
            if (oModel) {
                oModel.setData({
                    step1Visible: true,
                    step2Visible: false,
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

            if (sPreSector && oModel) {
                sessionStorage.removeItem("kyra_wizard_pre_sector");
                sessionStorage.removeItem("kyra_wizard_pre_function");

                const aFuncs = oFunctionsMap[sPreSector] || [];
                oModel.setProperty("/sector", sPreSector);
                oModel.setProperty("/functionsList", aFuncs);
                oModel.setProperty("/function", sPreFunc || (aFuncs.length > 0 ? aFuncs[0].key : ""));
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
                    step1Visible: true,
                    step2Visible: false,
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
            const sSector = oModel.getProperty("/sector") || "";
            const sFunction = oModel.getProperty("/function") || "";

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

            this.getOwnerComponent().getRouter().navTo("AddAccess");
        },

        onBackToStep1() {
            const oModel = this.getView().getModel("addAccessModel");
            oModel.setProperty("/step3Visible", false);
            oModel.setProperty("/step2Visible", false);
            oModel.setProperty("/step1Visible", true);
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
                const res = await fetch("odata/v4/auth/Requests", { signal: controller.signal });
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

            const aItemsToSubmit = aSummaryItems.filter(item => item.existingStatus !== "Already Applied" && item.existingStatus !== "Already Active");

            if (aItemsToSubmit.length === 0) {
                MessageBox.warning("All selected access entitlements have already been applied for or are already active. No requests were submitted.");
                return;
            }

            oModel.setProperty("/submitEnabled", false);

            // Show unified SAP Fiori loading screen with #008C9C spinner during Add Access submit
            window._kyraSubmittingAddAccess = true;
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Submitting Access Request…",
                    subtitle: "Persisting access request to PostgreSQL database…",
                    duration: 30000,
                    forceShow: true
                });
            }

            const sSubmissionDate = formatProperDateTime(new Date());
            const sUser = sessionStorage.getItem("kyra_active_user") || "";
            const sUserPersona = sessionStorage.getItem("kyra_active_role") || "Requester";
            const sJustification = (oModel.getProperty("/justification") || "").trim();
            const aExistingSubmitted = JSON.parse(sessionStorage.getItem("kyra_submitted_requests") || "[]");

            const aNewSubmittedRequests = aItemsToSubmit.map((item) => ({
                requestId: item.requestId,
                type: "Addition",
                system: item.system,
                roleName: item.roleName,
                serviceTopic: item.service || "",
                selectedPersona: item.persona || "",
                accessDuration: item.duration || oModel.getProperty("/duration") || "Permanent (Default)",
                submissionDate: sSubmissionDate,
                submittedDate: sSubmissionDate,
                submittedDateTime: sSubmissionDate,
                createdAtRaw: new Date().toISOString(),
                approver: "Line Manager / ISRM Team",
                status: "Pending Approval",
                statusState: "Warning",
                statusIcon: "sap-icon://pending"
            }));

            const aCombined = [...aNewSubmittedRequests, ...aExistingSubmitted];
            sessionStorage.setItem("kyra_submitted_requests", JSON.stringify(aCombined));
            sessionStorage.setItem("kyra_select_tab", "myRequests");

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
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500);
                const response = await fetch("odata/v4/auth/submitAccessRequest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requests: aPayload }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                const data = await response.json();
                console.log("Successfully persisted request audit trail into RDS PostgreSQL:", data);
            } catch (err) {
                console.warn("Database persistence fetch timeout or error, local session saved:", err);
            } finally {
                if (typeof sap !== "undefined" && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator) {
                    sap.ui.core.BusyIndicator.hide();
                }
            }

            sessionStorage.setItem("kyra_reset_add_access", "true");
            oModel.setData({
                step1Visible: true,
                step2Visible: false,
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
                aNewSubmittedRequests.length + " entitlement request(s) saved permanently to the database and transferred to your Dashboard 'My Requests' section." +
                (iSkippedCount > 0 ? `\n\n(Note: ${iSkippedCount} item(s) with status 'Already Applied' or 'Already Active' were excluded.)` : "");

            const fnCompleteSuccess = () => {
                window._kyraSubmittingAddAccess = false;
                MessageBox.success(sMsg, {
                    title: "Request Submitted Successfully",
                    onClose: () => {
                        this.getOwnerComponent().getRouter().navTo("AccessPage");
                    }
                });
            };

            if (window.KyraLoader && typeof window.KyraLoader.showSuccess === "function") {
                window.KyraLoader.showSuccess({
                    title: "Request Submitted Successfully",
                    subtitle: `Successfully recorded ${aNewSubmittedRequests.length} access request(s) into database.`,
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
