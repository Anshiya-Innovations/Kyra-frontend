sap.ui.define([], function () {
    "use strict";

    const FIELD_HELP_MAP = {
        // =========================================================================
        // SAP APPLICATION INTEGRATION
        // =========================================================================
        "sap_app_select": {
            system: "SAP Cloud Ecosystem",
            badgeClass: "kyraInfoBadgeSap",
            title: "Select SAP Application",
            purpose: "Specifies which SAP business system or cloud platform Kyra connects to for access governance, role catalog discovery, and automated provisioning.",
            steps: [
                "Choose SAP Business Technology Platform (SAP BTP) for subaccount role collections, shadow users, and Cloud Foundry spaces.",
                "Choose SAP S/4HANA Cloud (ERP) for communication arrangements, business catalogs, and PFCG roles.",
                "Choose SAP SuccessFactors (HCM) for employee master data and Role-Based Permissions (RBP).",
                "Choose SAP Ariba for procurement realms and supplier governance groups.",
                "Choose SAP Sales Cloud (C4C) for CRM business roles and service users.",
                "Choose SAP Analytics Cloud for analytics BI teams and content folder access."
            ],
            example: "SAP Business Technology Platform (SAP BTP)",
            tip: "Selecting an application switches the configuration panel below to show the exact API endpoints and credentials required for that platform."
        },
        "btp_service_key": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP BTP Service Key JSON",
            purpose: "Provides the OAuth 2.0 client credentials and endpoints from the Authorization and Trust Management Service (xsuaa) instance, enabling Kyra to automate shadow user creation and role assignments.",
            steps: [
                "Log in to SAP BTP Cockpit (https://cockpit.btp.cloud.sap) and navigate to your Subaccount.",
                "In the left navigation menu, navigate to Services → Instances and Subscriptions.",
                "Under the 'Instances' tab, locate your instance of 'Authorization and Trust Management Service' (service: xsuaa, plan: apiaccess).",
                "Click the '...' (Actions) button next to the instance and select 'Create Service Key'.",
                "Provide a name (e.g., 'kyra-governance-key') and click 'Create'.",
                "Click 'View Credentials' on the created key, copy the complete JSON object, and paste it into this field or click 'Auto-Fill Credentials'."
            ],
            example: '{\n  "clientid": "sb-na-581e795c-6a6a-4396-844c-a262d5145b1c!a725755",\n  "clientsecret": "95425be0-a145-4210-bab9-8286246f5707$naofJGTLH2dNzhopzCwWcWQLzfI42gWHIX2wk99vMfI=",\n  "url": "https://5af75fc5trial.authentication.us10.hana.ondemand.com",\n  "apiurl": "https://api.authentication.us10.hana.ondemand.com",\n  "subaccountid": "33d545ed-34b8-4d60-8789-38e9f943e8ad",\n  "identityzone": "5af75fc5trial"\n}',
            tip: "Pasting the Service Key JSON automatically populates all other BTP fields (Region, Subdomain, URLs, Client ID, Client Secret, and Subaccount ID) instantly."
        },
        "btp_region": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "BTP Landscape / Region",
            purpose: "Identifies the hyperscaler data center hosting your SAP BTP subaccount (e.g. AWS us10, Azure eu20).",
            steps: [
                "In SAP BTP Cockpit, navigate to your Subaccount Overview page.",
                "Locate the 'Subaccount Details' tile in the center/right area.",
                "Find the 'Provider / Region' field (e.g. 'AWS / us10 - AWS US East (N. Virginia)').",
                "Select the corresponding technical code from the dropdown list."
            ],
            example: "us10",
            tip: "The region code forms part of your authentication hostname (e.g., authentication.us10.hana.ondemand.com)."
        },
        "btp_subdomain": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "Subaccount Subdomain / Identity Zone",
            purpose: "The unique tenant identifier for your subaccount used in OAuth 2.0 token routing and SCIM authentication.",
            steps: [
                "Navigate to SAP BTP Cockpit → Select your Subaccount.",
                "In the Subaccount Overview tile, look for the 'Subdomain' row.",
                "Alternatively, check the 'identityzone' attribute in your downloaded XSUAA Service Key JSON."
            ],
            example: "5af75fc5trial",
            tip: "This value is case-sensitive and must match the identity zone configured in your subaccount trust settings."
        },
        "btp_scim_url": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "SCIM 2.0 Base URL",
            purpose: "The REST API endpoint Kyra calls to query user identities (/Users) and provision role collections (/Groups).",
            steps: [
                "In your XSUAA Service Key JSON, locate the 'apiurl' field.",
                "Standard format: https://api.authentication.<region>.hana.ondemand.com",
                "Verify that your XSUAA service instance was created with plan 'apiaccess' to enable SCIM endpoints."
            ],
            example: "https://api.authentication.us10.hana.ondemand.com",
            tip: "Ensure no trailing slash is included at the end of the SCIM Base URL."
        },
        "btp_subaccount_id": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP BTP Subaccount ID (UUID)",
            purpose: "The 36-character globally unique identifier (GUID) of the subaccount used in audit trails and REST routing.",
            steps: [
                "Open SAP BTP Cockpit and open your Subaccount.",
                "In the Subaccount Overview, locate the 'Subaccount ID' field.",
                "Click the copy icon to copy the 36-character UUID."
            ],
            example: "33d545ed-34b8-4d60-8789-38e9f943e8ad",
            tip: "Do not enter your subaccount display name or subdomain here. This field requires the hyphenated 36-character GUID."
        },
        "btp_token_url": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Token URL",
            purpose: "The OAuth 2.0 token endpoint Kyra contacts via Client Credentials grant to obtain a Bearer token for API provisioning.",
            steps: [
                "Check your XSUAA Service Key JSON for the 'url' property.",
                "Append '/oauth/token' to the URL (e.g., https://<subdomain>.authentication.<region>.hana.ondemand.com/oauth/token).",
                "Ensure it points to your tenant-specific subdomain rather than the generic api endpoint."
            ],
            example: "https://5af75fc5trial.authentication.us10.hana.ondemand.com/oauth/token",
            tip: "Tokens issued from this endpoint have a default lifetime of 12 hours and are automatically refreshed by Kyra."
        },
        "btp_idp_origin": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "Default IdP Origin Key",
            purpose: "Specifies which Identity Provider is used to authenticate users in the subaccount (e.g. SAP ID Service or Corporate Azure AD).",
            steps: [
                "In SAP BTP Cockpit, go to Security → Trust Configuration.",
                "Examine the 'Origin Key' column in the table.",
                "For standard SAP accounts, use 'sap.ids'.",
                "For corporate federations (Azure AD / Okta / SAP Cloud Identity Services), enter your custom origin key (e.g. 'kyra-corp-idp')."
            ],
            example: "sap.ids",
            tip: "When Kyra provisions a user into SAP BTP, this origin key determines which user store the shadow record is mapped to."
        },
        "btp_client_id": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Client ID",
            purpose: "The public identifier of your XSUAA apiaccess instance.",
            steps: [
                "Open SAP BTP Cockpit → Services → Instances and Subscriptions.",
                "Click your XSUAA instance and view the active Service Key.",
                "Copy the string value of the 'clientid' attribute."
            ],
            example: "sb-na-581e795c-6a6a-4396-844c-a262d5145b1c!a725755",
            tip: "BTP Client IDs typically contain an exclamation mark followed by a technical plan suffix (e.g., '!a725755')."
        },
        "btp_client_secret": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Client Secret",
            purpose: "The confidential cryptographic secret paired with the Client ID to authenticate provisioning requests.",
            steps: [
                "Open your XSUAA Service Key in SAP BTP Cockpit.",
                "Find the 'clientsecret' attribute.",
                "Copy the entire secret string including any punctuation and trailing '=' character."
            ],
            example: "95425be0-a145-4210-bab9-8286246f5707$naofJGTLH2dNzhopzCwWcWQLzfI42gWHIX2wk99vMfI=",
            tip: "Kyra stores this secret encrypted using AES-256 and never transmits it in plain text."
        },
        "btp_cf_org": {
            system: "SAP BTP Cloud Foundry",
            badgeClass: "kyraInfoBadgeSap",
            title: "Cloud Foundry Organization",
            purpose: "The Cloud Foundry Org within your subaccount where containerized services and applications reside.",
            steps: [
                "In SAP BTP Cockpit, navigate to your Subaccount Overview.",
                "Under 'Cloud Foundry Environment', find the 'Org Name' field.",
                "Copy the exact Org name (typically matches your subaccount subdomain)."
            ],
            example: "5af75fc5trial",
            tip: "Leave blank if you are only governing BTP Cockpit role collections without Cloud Foundry runtime roles."
        },
        "btp_cf_space": {
            system: "SAP BTP Cloud Foundry",
            badgeClass: "kyraInfoBadgeSap",
            title: "Cloud Foundry Space",
            purpose: "The target runtime space (e.g. 'dev', 'prod', 'staging') where role bindings apply.",
            steps: [
                "In SAP BTP Cockpit, expand 'Cloud Foundry' in the left menu and click 'Spaces'.",
                "Identify the target space where your applications or CAP services run.",
                "Enter the space name (e.g., 'dev' or 'production')."
            ],
            example: "dev",
            tip: "Kyra can synchronize Space Developer and Space Auditor roles across this space."
        },
        "btp_cf_api": {
            system: "SAP BTP Cloud Foundry",
            badgeClass: "kyraInfoBadgeSap",
            title: "Cloud Foundry API Endpoint",
            purpose: "The Cloud Foundry Controller REST endpoint (e.g., api.cf.us10-001.hana.ondemand.com).",
            steps: [
                "In SAP BTP Cockpit → Subaccount Overview → Cloud Foundry Environment.",
                "Copy the 'API Endpoint' URL.",
                "Alternatively, run 'cf api' in your terminal to see the active endpoint."
            ],
            example: "https://api.cf.us10-001.hana.ondemand.com",
            tip: "Cloud Foundry API endpoints always begin with 'https://api.cf.' followed by the landscape region."
        },
        "btp_provisioning_scope": {
            system: "SAP BTP Governance",
            badgeClass: "kyraInfoBadgeSap",
            title: "Target Provisioning Scope",
            purpose: "Defines whether Kyra provisions roles into Subaccount Role Collections only, Cloud Foundry Space roles only, or both.",
            steps: [
                "Select 'Subaccount Role Collections Only' for standard BTP Cockpit security roles.",
                "Select 'Cloud Foundry Space Roles Only' for developer runtime permissions (Space Developer).",
                "Select 'Both (Subaccount Roles + CF Space Bindings)' for unified enterprise access."
            ],
            example: "Both (Subaccount Roles + CF Space Bindings)",
            tip: "Unified provisioning ensures developers receive both Cockpit tiles and Cloud Foundry CLI access in a single approval."
        },

        // SAP S/4HANA Cloud
        "s4hana_system_url": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP S/4HANA Cloud API URL",
            purpose: "The base HTTPS URL of your SAP S/4HANA Cloud system where OData IAM services are published.",
            steps: [
                "Log in to your SAP S/4HANA Cloud Fiori Launchpad.",
                "Copy the host URL from your browser address bar (e.g., https://myXXXXXX-api.s4hana.cloud.sap).",
                "Ensure you use the API hostname (with '-api' suffix) rather than the end-user launchpad URL."
            ],
            example: "https://my300123-api.s4hana.ondemand.com",
            tip: "API hostnames in S/4HANA Cloud require inbound TLS 1.3 connectivity."
        },
        "s4hana_client": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Client ID / Tenant",
            purpose: "The 3-digit numerical client identifier (MANDT) of the S/4HANA system (e.g. 100 for Production, 080 for Customizing).",
            steps: [
                "In SAP S/4HANA, check the top right User Profile → About dialog.",
                "Locate the 'Client' number (e.g. '100')."
            ],
            example: "100",
            tip: "In S/4HANA Cloud, the default production client is typically 100."
        },
        "s4hana_scenario": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Communication Scenario / Arrangement",
            purpose: "The technical integration scenario in S/4HANA that exposes Identity and Access Management APIs to external systems.",
            steps: [
                "In Fiori Launchpad, open the 'Communication Arrangements' app (Administrator role).",
                "Search for scenario 'SAP_COM_0093' (IAM User and Business Role Integration) or 'SAP_COM_0193'.",
                "Enter the Communication Scenario ID configured for Kyra."
            ],
            example: "SAP_COM_0093",
            tip: "Scenario SAP_COM_0093 provides standard OData services to read business catalogs and assign business roles."
        },
        "s4hana_auth_type": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Authentication Type",
            purpose: "Specifies whether Kyra authenticates using Basic Auth (Communication User) or OAuth 2.0 mTLS with X.509 certificates.",
            steps: [
                "Select 'Basic Authentication (Communication User)' for username/password authentication.",
                "Select 'OAuth 2.0 / SAML Bearer' or 'Client Certificate (X.509)' for high-security zero-trust architectures."
            ],
            example: "Basic Authentication (Communication User)",
            tip: "Basic Auth with a dedicated technical communication user is the quickest setup for development and staging."
        },
        "s4hana_comm_user": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Communication User",
            purpose: "The technical integration user configured inside S/4HANA to execute inbound OData provisioning calls.",
            steps: [
                "In Fiori Launchpad, open the 'Maintain Communication Users' app.",
                "Create or locate your communication user (e.g., 'CC0000000001' or 'KYRA_INTEGRATION_USER').",
                "Copy the User Name."
            ],
            example: "KYRA_INTEGRATION_USER",
            tip: "Communication users in S/4HANA do not consume dialogue employee licenses and cannot sign in via the browser."
        },
        "s4hana_comm_password": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Communication Password / Secret",
            purpose: "The password assigned to the Communication User for API authentication.",
            steps: [
                "In 'Maintain Communication Users', click 'Edit' on the technical user.",
                "Generate a new secure password or copy the existing password.",
                "Save the user and paste the password here."
            ],
            example: "••••••••••••••••••••••••",
            tip: "Ensure password policy for communication users is set to never expire in S/4HANA security settings."
        },
        "s4hana_odata_url": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "OData IAM User & Role API Path",
            purpose: "The specific OData v2/v4 service path for managing business users and role assignments.",
            steps: [
                "In 'Communication Arrangements' app, open your arrangement for SAP_COM_0093.",
                "Under 'Inbound Services', locate the service URL path.",
                "Standard path: /sap/opu/odata/sap/APS_IAM_USER_ROLE_SRV"
            ],
            example: "/sap/opu/odata/sap/APS_IAM_USER_ROLE_SRV",
            tip: "Kyra uses this endpoint to read business role catalogs and assign PFCG authorizations upon approval."
        },

        // SAP SuccessFactors
        "sf_api_endpoint": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "SuccessFactors API Host",
            purpose: "The OData v2 REST endpoint of your SuccessFactors data center (e.g. api12preview.sapsf.com).",
            steps: [
                "Identify your SuccessFactors data center from your system login URL.",
                "Refer to SAP Note 2215682 for the complete list of SuccessFactors API server URLs.",
                "Example for DC12: https://api12preview.sapsf.com"
            ],
            example: "https://api12preview.sapsf.com",
            tip: "Do not include '/odata/v2' in this host field; Kyra automatically appends service routes."
        },
        "sf_company_id": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "SuccessFactors Company ID",
            purpose: "The unique corporate tenant ID used to identify your organization in the SuccessFactors multi-tenant cloud.",
            steps: [
                "Look at your SuccessFactors login screen, where 'Company ID' is prompted alongside username.",
                "Alternatively, in Admin Center, go to 'Company System and Logo Settings' to view your Company ID."
            ],
            example: "KYRACORP01",
            tip: "Company ID is case-sensitive and must match exactly."
        },
        "sf_api_user": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "API Administrator Username",
            purpose: "The technical admin user with permissions to query user profiles and manage Role-Based Permission (RBP) groups.",
            steps: [
                "In Admin Center, go to 'Manage Role-Based Permission Access'.",
                "Create or locate a service administrator user (e.g. 'sfadmin' or 'kyra_sync_admin').",
                "Ensure this user has 'Manage Permission Roles' and 'General User Permission' enabled."
            ],
            example: "kyra_sync_admin",
            tip: "SuccessFactors API users must have API access permissions granted in Admin Center → Set User Permissions."
        },
        "sf_client_id": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Client ID (API Key)",
            purpose: "The public API key generated when registering Kyra as an OAuth client application in SuccessFactors.",
            steps: [
                "In SuccessFactors Admin Center, search for and open 'Manage OAuth2 Client Applications'.",
                "Click 'Register Client Application'.",
                "Provide an Application Name (e.g. 'Kyra Access Governance') and Application URL.",
                "Click 'Generate X.509 Certificate' and enter Common Name.",
                "Click 'Save', and copy the generated 'API Key' (Client ID)."
            ],
            example: "NWNjMGQxOGYtYTM2NS00YjVjLThmOWQtYmE1ZDRhOTkxOTg1",
            tip: "The generated API Key acts as the Client ID during the SAML Bearer assertion flow."
        },
        "sf_client_secret": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "Private Key / X.509 Certificate",
            purpose: "The private cryptographic key used to sign SAML assertions sent to the SuccessFactors OAuth token endpoint.",
            steps: [
                "In 'Manage OAuth2 Client Applications', download the private key generated alongside the X.509 certificate.",
                "Open the downloaded key file and copy the Base64 PEM content.",
                "Paste the entire key or secret into this field."
            ],
            example: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----",
            tip: "Store your downloaded private key file safely as SuccessFactors does not allow downloading it a second time."
        },

        // SAP Analytics Cloud
        "sac_tenant_url": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Analytics Cloud Tenant Host",
            purpose: "The base HTTPS URL of your SAC tenant (e.g. https://your-tenant.analytics.cloud.sap).",
            steps: [
                "Log in to your SAP Analytics Cloud tenant.",
                "Copy the base domain from your browser address bar (remove /sap/fpa/ui path).",
                "Format: https://<tenant-name>.<region>.analytics.cloud.sap"
            ],
            example: "https://kyra-analytics.eu10.analytics.cloud.sap",
            tip: "Use the primary tenant domain without any trailing URL parameters."
        },
        "sac_scim_url": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SCIM API URL",
            purpose: "The SCIM 2.0 REST endpoint in SAC used to automate user and team provisioning.",
            steps: [
                "In SAC, navigate to System → Administration → App Integration.",
                "Scroll down to 'SCIM API' section.",
                "Copy the endpoint URL: https://<tenant>/api/v1/scim"
            ],
            example: "https://kyra-analytics.eu10.analytics.cloud.sap/api/v1/scim",
            tip: "Kyra calls this endpoint to assign SAC BI Admin, Modeler, and Viewer roles automatically."
        },
        "sac_token_url": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAC OAuth Token URL",
            purpose: "The token endpoint for obtaining Bearer tokens for SCIM calls.",
            steps: [
                "In System → Administration → App Integration, look under 'OAuth Clients'.",
                "Copy the 'Token URL' shown in the OAuth configuration header."
            ],
            example: "https://kyra-analytics.eu10.analytics.cloud.sap/oauth/token",
            tip: "SAC requires OAuth 2.0 authorization code or client credentials flow depending on client registration."
        },
        "sac_client_id": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client ID",
            purpose: "The Client ID generated in SAC App Integration.",
            steps: [
                "In System → Administration → App Integration, click 'Add a New OAuth Client'.",
                "Set Purpose to 'User and Team Provisioning'.",
                "Select Access type: 'API Access'.",
                "Click 'Save' and copy the generated OAuth Client ID."
            ],
            example: "sac-kyra-oauth-client-id",
            tip: "Ensure the client has 'SCIM Provisioning' scope enabled."
        },
        "sac_client_secret": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client Secret",
            purpose: "The Client Secret generated alongside the OAuth Client ID.",
            steps: [
                "In the OAuth Client details modal, copy the Secret value.",
                "Note: The secret is only displayed once upon creation."
            ],
            example: "••••••••••••••••••••••••",
            tip: "If the secret is lost, you must click 'Regenerate Secret' in SAC App Integration."
        },

        // SAP Ariba
        "ariba_realm": {
            system: "SAP Ariba",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Ariba Realm Name",
            purpose: "The technical realm identifier of your Ariba buyer or sourcing site.",
            steps: [
                "Check the URL when logged into SAP Ariba (e.g. https://s1.ariba.com/Buyer/Main?realm=mycompany).",
                "Copy the value following 'realm=' parameter."
            ],
            example: "kyra-buyer-prod",
            tip: "Realms differentiate between Test and Production Ariba environments."
        },
        "ariba_url": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "Ariba Open API Gateway Host",
            purpose: "The regional API gateway URL for SAP Ariba Open APIs (e.g. openapi.ariba.com).",
            steps: [
                "Log in to the SAP Ariba Developer Portal (https://developer.ariba.com).",
                "Check API documentation for the 'User Management API' endpoint corresponding to your data center."
            ],
            example: "https://openapi.ariba.com",
            tip: "Standard global gateway is https://openapi.ariba.com."
        },
        "ariba_api_key": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "Application API Key",
            purpose: "The API Key generated in SAP Ariba Developer Portal required in the 'apiKey' HTTP header.",
            steps: [
                "In developer.ariba.com, go to 'Manage' → 'Applications'.",
                "Select your application and click 'Actions' → 'View API Key'.",
                "Copy the alphanumeric API Key."
            ],
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            tip: "Every request to Ariba Open APIs requires both an OAuth Bearer token and this apiKey header."
        },
        "ariba_client_id": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client ID",
            purpose: "The OAuth 2.0 client credential for Ariba API access.",
            steps: [
                "In your Ariba Developer Portal Application, view 'OAuth Client Details'.",
                "Copy the OAuth Client ID."
            ],
            example: "ariba-client-id-001",
            tip: "Generated upon approval of your application by your Ariba administrator."
        },
        "ariba_client_secret": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client Secret",
            purpose: "The client secret used to retrieve OAuth access tokens for Ariba APIs.",
            steps: [
                "In your Ariba Developer Portal Application, copy the OAuth Client Secret."
            ],
            example: "••••••••••••••••••••••••",
            tip: "Keep this secret secure; it grants access to user management APIs across your Ariba realm."
        },

        // SAP Sales Cloud (C4C)
        "c4c_tenant_url": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Sales Cloud Tenant Host",
            purpose: "The base HTTPS URL of your Cloud for Customer (C4C) tenant.",
            steps: [
                "Log in to your SAP Sales Cloud system.",
                "Copy the hostname from your browser address bar: https://myXXXXXX.crm.ondemand.com."
            ],
            example: "https://my300456.crm.ondemand.com",
            tip: "Do not include any path after .crm.ondemand.com."
        },
        "c4c_odata_url": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "C4C OData User Service Path",
            purpose: "The path to the business user and business role OData service in C4C.",
            steps: [
                "In C4C, go to Administrator → OData API Monitor or Communication Arrangements.",
                "Standard User OData service path: /sap/c4c/odata/v1/c4codata/BusinessUserCollection."
            ],
            example: "/sap/c4c/odata/v1/c4codata",
            tip: "Kyra uses this endpoint to synchronize employee user records and assigned C4C business roles."
        },
        "c4c_service_user": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "Service Integration User",
            purpose: "The technical integration user in C4C authorized for communication scenarios.",
            steps: [
                "In C4C, go to Administrator → General Settings → Communication Systems.",
                "Open your Communication System and navigate to 'System Users'.",
                "Create or copy the technical service user name."
            ],
            example: "_KYRA_SYNC_USER",
            tip: "C4C technical users typically begin with an underscore '_'."
        },
        "c4c_service_password": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "Service User Password",
            purpose: "The password for the C4C technical integration user.",
            steps: [
                "In Communication Systems → System Users, set or reset the password for the technical user.",
                "Copy the password and paste it here."
            ],
            example: "••••••••••••••••••••••••",
            tip: "Set password status to 'Does Not Expire' in C4C user administration."
        },

        // =========================================================================
        // IAM APPROVER 1 INTEGRATION (EMAIL & AWS CONSOLE)
        // =========================================================================
        "iam1_email_name": {
            system: "IAM Governance",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approver 1 Official Name / Designation",
            purpose: "The display name and governance title of IAM Approver 1 shown in approval emails, ticket logs, and audit trails.",
            steps: [
                "Enter the full name and organizational title of the primary security reviewer (e.g. 'Security Lead' or 'IAM Governance Lead').",
                "This name appears as the designated approver on all ticket routing headers."
            ],
            example: "IAM Approver 1 (Security Lead)",
            tip: "Use a clear title so requesters understand why the request was routed to this security reviewer."
        },
        "iam1_email_address": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approver 1 Notification Email Address",
            purpose: "The email address where Level 1 approval notifications, batch action links, and reminder alerts are dispatched.",
            steps: [
                "Enter the corporate email address of IAM Approver 1 or their security distribution list.",
                "Ensure this mailbox is monitored and can receive HTML emails with embedded action tokens.",
                "Click 'Test Email Connection & Send Verification' to verify deliverability."
            ],
            example: "kyra-iam-approver-1@kyra-governance.com",
            tip: "Using a dedicated distribution list (e.g. iam-tier1-approvers@company.com) ensures redundancy when individuals are out of office."
        },
        "iam1_email_dispatch_mode": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Notification Dispatch Mode",
            purpose: "Controls how multiple access requests are packaged when sent to the approver's inbox.",
            steps: [
                "Choose 'Consolidated Batch Notification (1 Email per Batch)' (Recommended) to receive a single email containing a table of all requested entitlements.",
                "Choose 'Individual Notification per Entitlement' to receive a separate email for each role requested."
            ],
            example: "Consolidated Batch Notification (1 Email per Batch)",
            tip: "Batch notifications significantly reduce inbox clutter and allow Approver 1 to 'Approve All' or 'Reject All' in one step."
        },
        "iam1_email_delivery_service": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Email Delivery Service",
            purpose: "The backend email transport mechanism used by Kyra to send outbound approval notifications.",
            steps: [
                "Select 'AWS SNS Email Topic (Standard Enterprise)' to dispatch via Amazon Simple Notification Service.",
                "Select 'AWS SES Direct API' for high-volume enterprise deliverability and custom domain DKIM signing.",
                "Select 'Enterprise SMTP Server' to route through your internal Microsoft Exchange or Postfix relay.",
                "Select 'Ethereal Sandbox' for development and testing without sending live emails."
            ],
            example: "AWS SNS Email Topic (Standard Enterprise)",
            tip: "AWS SNS is the recommended default as it provides automatic subscription confirmations and high reliability."
        },
        "iam1_email_from_address": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Sender 'From' Email Address",
            purpose: "The 'From:' address visible in approver email clients.",
            steps: [
                "Enter your verified corporate governance address (e.g., no-reply-governance@kyra-portal.com).",
                "Ensure this domain is verified in your AWS SES or corporate SMTP relay to avoid spam filtering."
            ],
            example: "no-reply-governance@kyra-portal.com",
            tip: "Use a no-reply address with clear branding so approvers can set up email filter rules easily."
        },
        "iam1_email_webhook": {
            system: "AWS Lambda / Webhook",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approval Review Webhook / Lambda URL",
            purpose: "The HTTPS endpoint that receives decision tokens when approvers click 'Approve' or 'Reject' from their email.",
            steps: [
                "Open the AWS Lambda Console (https://console.aws.amazon.com/lambda).",
                "Navigate to your Kyra Approval Processor function (e.g. 'kyra-approval-handler').",
                "Go to the 'Configuration' tab → 'Function URL'.",
                "Copy the Function URL (e.g. https://happfsy5vp6ff3ru6z2xrwrtny0jkqao.lambda-url.us-east-1.on.aws/).",
                "Paste the URL into this field."
            ],
            example: "https://happfsy5vp6ff3ru6z2xrwrtny0jkqao.lambda-url.us-east-1.on.aws/",
            tip: "Ensure the Function URL is configured with AuthType: NONE and CORS enabled so browser clicks process seamlessly."
        },
        "iam1_email_portal_interface": {
            system: "IAM Governance",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approval Review Portal Interface",
            purpose: "Determines the interaction experience approvers see when opening an approval link.",
            steps: [
                "Select 'Interactive Batch Review Table' (Recommended) to present approvers with an interactive web portal where they can inspect risk scores, add remarks, and approve individually or in bulk.",
                "Select 'Direct One-Click Decision Tokens' for instant approval execution directly from email links without opening a portal."
            ],
            example: "Interactive Batch Review Table (Approve All / Reject All / Remarks)",
            tip: "The interactive review table gives approvers the ability to reject individual entitlements while approving others in the same request."
        },
        "iam1_email_sla_window": {
            system: "IAM Governance",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Decision SLA Window & Timeout",
            purpose: "The maximum timeframe Approver 1 has to take action before automatic reminders or auto-escalation triggers.",
            steps: [
                "Select '12 Hours' for high-priority or emergency production change requests.",
                "Select '24 Hours' for standard enterprise governance.",
                "Select '48 Hours' for extended review cycles."
            ],
            example: "24 Hours (Standard Enterprise SLA)",
            tip: "Combine with the 'Auto-escalate' checkbox to ensure urgent access requests don't get blocked if Approver 1 is unavailable."
        },

        // Cloud Platform Provider Selection (Common to both Approvers)
        "iam_cloud_provider": {
            system: "Multi-Cloud IAM",
            badgeClass: "kyraInfoBadgeAws",
            title: "Select Cloud Identity & IAM Platform Provider",
            purpose: "Specifies which enterprise cloud identity platform hosts your approvers (AWS IAM, Microsoft Azure Entra ID, GCP Cloud IAM, Okta, or SAP IAS). This selection is common and applies to both IAM Approver 1 and IAM Approver 2.",
            steps: [
                "Select 'Amazon Web Services (AWS IAM & Identity Center)' if approvers operate in AWS.",
                "Select 'Microsoft Azure (Microsoft Entra ID / Azure IAM)' if approvers operate in Azure or Office 365.",
                "Select 'Google Cloud Platform (GCP Cloud IAM)' if your enterprise runs on Google Cloud.",
                "Select 'Okta / Ping Identity Enterprise Governance' for dedicated identity provider hubs.",
                "Select 'SAP Cloud Identity Services (SAP IAS)' for direct SAP BTP cloud identity."
            ],
            example: "Amazon Web Services (AWS IAM & Identity Center)",
            tip: "This common setting adjusts console integration settings and labels across both IAM Approvers simultaneously."
        },

        // Approver 1 AWS Console
        "iam1_aws_username": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Approver 1 AWS IAM / SSO Username",
            purpose: "The AWS IAM or IAM Identity Center (SSO) username representing Approver 1 in the AWS Management Console.",
            steps: [
                "Sign in to the AWS Management Console (https://console.aws.amazon.com).",
                "In the search bar at the top, type 'IAM' and open Identity and Access Management.",
                "In the left navigation menu, click 'Users'.",
                "Locate the user designated for security approvals (e.g. 'iam-approver-1').",
                "Copy the exact User name."
            ],
            example: "iam-approver-1",
            tip: "Ensure this IAM user is configured with Console access and MFA enabled."
        },
        "iam1_aws_user_arn": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Approver 1 IAM User / Role ARN",
            purpose: "The Amazon Resource Name (ARN) uniquely identifying the approver principal for permission verification and audit logging.",
            steps: [
                "In the AWS IAM Console, click 'Users' and select your approver user.",
                "In the 'Summary' section at the top, locate the 'ARN' field.",
                "Click the copy icon next to the ARN."
            ],
            example: "arn:aws:iam::197009134141:user/iam-approver-1",
            tip: "If using IAM Identity Center (AWS SSO), enter the ARN of the assigned PermissionSet IAM Role."
        },
        "iam1_aws_sns_topic_arn": {
            system: "AWS SNS Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Approver 1 AWS SNS Topic ARN",
            purpose: "The Amazon SNS Topic that receives Kyra access events and broadcasts notifications to Approver 1.",
            steps: [
                "Open the Amazon SNS Console (https://console.aws.amazon.com/sns/v3/home).",
                "In the left navigation menu, click 'Topics'.",
                "Select your approval topic (e.g., 'kyra-iam-approver-1') or click 'Create topic' (Type: Standard).",
                "Copy the 'ARN' string from the Topic Details section.",
                "Ensure Approver 1's email is subscribed to this topic and confirmed."
            ],
            example: "arn:aws:sns:us-east-1:197009134141:kyra-iam-approver-1",
            tip: "Check the topic's Access Policy to verify that Kyra's IAM credentials have 'sns:Publish' permissions."
        },
        "iam1_aws_region": {
            system: "AWS Management Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Region",
            purpose: "The AWS geographic region hosting your SSM Change Manager templates, SNS topics, and Lambda webhooks.",
            steps: [
                "Look at the top-right navigation bar in the AWS Management Console.",
                "Note the current region (e.g., 'N. Virginia').",
                "Select the matching technical region code (e.g., 'us-east-1')."
            ],
            example: "us-east-1",
            tip: "Systems Manager Change Manager and SNS topics must reside in this configured region."
        },
        "iam1_aws_account_id": {
            system: "AWS Management Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Account ID (12 Digits)",
            purpose: "The 12-digit numeric identifier of your AWS account.",
            steps: [
                "In the AWS Management Console, click on your user/account dropdown in the top-right corner.",
                "Locate the 'Account ID' row.",
                "Click the copy button to copy the 12-digit number (digits only, no hyphens)."
            ],
            example: "197009134141",
            tip: "Account IDs are strictly 12 numerical digits."
        },
        "iam1_aws_access_key": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Access Key ID",
            purpose: "The long-term authentication credential used by Kyra backend to call AWS STS, SNS, and Systems Manager Change Manager APIs.",
            steps: [
                "In AWS IAM Console, click 'Users' and select your programmatic integration user (e.g., 'kyra-backend-service').",
                "Go to the 'Security credentials' tab.",
                "Scroll down to 'Access keys' and click 'Create access key'.",
                "Select 'Application running outside AWS', click 'Next', and click 'Create access key'.",
                "Copy the generated 'Access key ID' (starts with 'AKIA...')."
            ],
            example: "AKIAS3XVI2I667F5SYWM",
            tip: "Rotate AWS access keys every 90 days following security best practices."
        },
        "iam1_aws_secret_key": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Secret Access Key",
            purpose: "The confidential cryptographic key paired with your Access Key ID to sign AWS SigV4 API requests.",
            steps: [
                "Immediately upon creating the access key in the AWS IAM Console, click 'Show' under 'Secret access key'.",
                "Copy the 40-character secret key or download the .csv file.",
                "Paste it into this field."
            ],
            example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
            tip: "This secret is only visible once upon creation in the AWS Console. If lost, you must generate a new key pair."
        },
        "iam1_aws_approval_service": {
            system: "AWS Systems Manager",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Native Approval Service",
            purpose: "The AWS enterprise governance engine where change requests are reviewed and recorded.",
            steps: [
                "Choose 'AWS Systems Manager (SSM) Change Manager' (Recommended) to generate official Change Requests with approval gates.",
                "Choose 'AWS IAM Identity Center (AWS SSO)' for multi-account permission set approvals."
            ],
            example: "AWS Systems Manager (SSM) Change Manager",
            tip: "SSM Change Manager provides immutable audit logs and change freeze window enforcement."
        },
        "iam1_aws_console_url": {
            system: "AWS Systems Manager Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Console Direct Change Requests URL",
            purpose: "The deep link URL sent in approver emails allowing Approver 1 to open the pending change request directly in the AWS Console.",
            steps: [
                "Navigate to AWS Systems Manager → Change Manager → Change requests in your AWS Console.",
                "Copy the URL from your browser address bar.",
                "Standard format: https://<region>.console.aws.amazon.com/systems-manager/change-manager/change-requests"
            ],
            example: "https://us-east-1.console.aws.amazon.com/systems-manager/change-manager/change-requests",
            tip: "Approvers clicking this link from Kyra email alerts land directly in their AWS Change Manager inbox."
        },
        "iam1_aws_required_policy": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Required AWS Managed Policy",
            purpose: "The AWS IAM policy that must be attached to the approver's IAM User or Role to grant permissions to approve change requests.",
            steps: [
                "In AWS IAM Console, go to 'Users' → Select Approver 1's username.",
                "Under 'Permissions policies', click 'Add permissions' → 'Attach policies directly'.",
                "Search for 'AWSSystemsManagerChangeManagerApproverAccess'.",
                "Select the checkbox and click 'Add permissions'."
            ],
            example: "AWSSystemsManagerChangeManagerApproverAccess",
            tip: "This AWS-managed policy enforces least-privilege permissions for Change Manager approvers."
        },

        // =========================================================================
        // IAM APPROVER 2 INTEGRATION (EMAIL & AWS CONSOLE)
        // =========================================================================
        "iam2_email_name": {
            system: "IAM Governance",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approver 2 Official Name / Designation",
            purpose: "The display name and title of IAM Approver 2 (typically the Cloud Platform Owner or System Custodian) who performs the final approval and provisioning trigger.",
            steps: [
                "Enter the full name and title of the Level 2 platform owner (e.g., 'Cloud Platform Owner' or 'SAP BTP Administrator').",
                "This name is stamped in the permanent access grant audit record upon final authorization."
            ],
            example: "IAM Approver 2 (Cloud Platform Owner)",
            tip: "Approver 2 serves as the final authorization gate before live credentials or role collections are provisioned."
        },
        "iam2_email_address": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approver 2 Notification Email Address",
            purpose: "The email address where Level 2 approval notifications and provisioning action links are dispatched.",
            steps: [
                "Enter the corporate email address of Approver 2 or their cloud architecture team distribution list.",
                "Click 'Test Email Connection & Send Verification' to verify."
            ],
            example: "kyra-iam-approver-2@kyra-governance.com",
            tip: "Notifications are dispatched according to the Sequential Routing Trigger configuration."
        },
        "iam2_email_routing_trigger": {
            system: "IAM Governance",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Sequential Routing Trigger",
            purpose: "Defines when Approver 2 receives the request in the multi-level workflow.",
            steps: [
                "Select 'Sequential - Dispatch upon Approver 1 Approval' (Recommended) so Approver 2 only acts after the Security Lead (Approver 1) has vetted and approved the request.",
                "Select 'Parallel - Dispatch concurrently with Approver 1' for simultaneous dual-custody review."
            ],
            example: "Sequential - Dispatch upon Approver 1 Approval",
            tip: "Sequential routing prevents platform owners from spending time reviewing requests that security leads might reject."
        },
        "iam2_email_delivery_service": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Email Delivery Service",
            purpose: "The backend email transport mechanism used to deliver Approver 2 notifications.",
            steps: [
                "Select 'AWS SNS Email Topic (Standard Enterprise)' for SNS topic distribution.",
                "Select 'AWS SES Direct API' for direct email API delivery.",
                "Select 'Enterprise SMTP Server' for on-premises relay."
            ],
            example: "AWS SNS Email Topic (Standard Enterprise)",
            tip: "Maintains consistency with Approver 1's delivery pipeline."
        },
        "iam2_email_from_address": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Sender 'From' Email Address",
            purpose: "The sender email address displayed on Approver 2 notifications.",
            steps: [
                "Enter your verified corporate governance address.",
                "Must match your verified SES domain or SMTP relay address."
            ],
            example: "no-reply-governance@kyra-portal.com",
            tip: "Use an authenticated domain to ensure emails do not trigger spam filters."
        },
        "iam2_email_webhook": {
            system: "AWS Lambda / Webhook",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Approval Review Webhook / Lambda URL",
            purpose: "The HTTPS endpoint that receives Approver 2's decision and triggers automated SCIM role provisioning into SAP BTP.",
            steps: [
                "Provide the AWS Lambda Function URL or API Gateway endpoint configured to process Level 2 decisions.",
                "When Approver 2 approves, this webhook invokes the BTP SCIM API to assign the approved roles."
            ],
            example: "https://happfsy5vp6ff3ru6z2xrwrtny0jkqao.lambda-url.us-east-1.on.aws/",
            tip: "This webhook automatically verifies HMAC token signatures before executing any role assignments."
        },
        "iam2_email_final_action": {
            system: "IAM Governance",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Final Action Executed on Level 2 Approval",
            purpose: "Controls whether approval automatically provisions the role into SAP BTP or generates a manual ticket.",
            steps: [
                "Select 'Trigger Automated Live SCIM Role Provisioning into SAP BTP' (Recommended) to immediately grant the role collections without manual IT intervention.",
                "Select 'Manual Provisioning Only (Audit Record Generated)' if your policy requires a human administrator to perform manual SAP BTP Cockpit assignments."
            ],
            example: "Trigger Automated Live SCIM Role Provisioning into SAP BTP",
            tip: "Automated provisioning reduces access fulfillment time from days to seconds."
        },
        "iam2_email_receipt": {
            system: "Email Gateway",
            badgeClass: "kyraInfoBadgeEmail",
            title: "Requester Completion Notification",
            purpose: "Determines whether an 'Access Granted' receipt with login links is sent to the employee requester upon final approval.",
            steps: [
                "Select 'Send Access Granted receipt with cockpit login links to Requester' (Recommended).",
                "Select 'Silent Provisioning (No requester notification)' if notifications are handled through ServiceNow or Jira."
            ],
            example: "Send Access Granted receipt with cockpit login links to Requester",
            tip: "The completion receipt includes direct links to the SAP BTP Cockpit or Fiori Launchpad so users can begin working immediately."
        },

        // Approver 2 AWS Console
        "iam2_aws_username": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Approver 2 AWS IAM / SSO Username",
            purpose: "The AWS IAM or SSO username representing Approver 2 (Cloud Platform Owner).",
            steps: [
                "Sign in to the AWS Management Console.",
                "Navigate to IAM → Users.",
                "Locate Approver 2's user name (e.g. 'iam-approver-2').",
                "Copy the exact User name."
            ],
            example: "iam-approver-2",
            tip: "This user receives the second approval step in the AWS Systems Manager Change Manager template."
        },
        "iam2_aws_user_arn": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Approver 2 IAM User / Role ARN",
            purpose: "The Amazon Resource Name (ARN) uniquely identifying Approver 2.",
            steps: [
                "In AWS IAM Console, click 'Users' → select Approver 2.",
                "Under 'Summary', copy the 'ARN' value."
            ],
            example: "arn:aws:iam::197009134141:user/iam-approver-2",
            tip: "Used to configure Approver 2 as a required approver in the Change Manager template."
        },
        "iam2_aws_sns_topic_arn": {
            system: "AWS SNS Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Approver 2 AWS SNS Topic ARN",
            purpose: "The SNS Topic that notifies Approver 2 when Approver 1 has approved a request.",
            steps: [
                "In Amazon SNS Console, navigate to 'Topics'.",
                "Select 'kyra-iam-approver-2' and copy the Topic ARN.",
                "Verify Approver 2's subscription is confirmed."
            ],
            example: "arn:aws:sns:us-east-1:197009134141:kyra-iam-approver-2",
            tip: "Only receives messages after Level 1 approval has been granted."
        },
        "iam2_aws_region": {
            system: "AWS Management Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Region",
            purpose: "The AWS Region hosting the Change Manager environment.",
            steps: [
                "Select the AWS region code matching your deployment (e.g. 'us-east-1')."
            ],
            example: "us-east-1",
            tip: "Must match the region where Approver 1 and the SSM Change template reside."
        },
        "iam2_aws_account_id": {
            system: "AWS Management Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Account ID",
            purpose: "The 12-digit AWS Account ID.",
            steps: [
                "In AWS Console, click the account dropdown in the top-right corner.",
                "Copy the 12-digit Account ID."
            ],
            example: "197009134141",
            tip: "Enter 12 digits with no punctuation."
        },
        "iam2_aws_access_key": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Access Key ID",
            purpose: "The AWS Access Key ID used for Approver 2 console integration calls.",
            steps: [
                "In AWS IAM Console, go to Users → Security credentials → Create access key.",
                "Copy the generated Access key ID."
            ],
            example: "AKIAS3XVI2I667F5SYWM",
            tip: "Can share the programmatic service user key with Approver 1 or use a dedicated key."
        },
        "iam2_aws_secret_key": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Secret Access Key",
            purpose: "The Secret Access Key paired with the Access Key ID.",
            steps: [
                "Copy the secret key generated alongside the Access key ID in IAM Console."
            ],
            example: "••••••••••••••••••••••••",
            tip: "Encrypted at rest using AES-256."
        },
        "iam2_aws_approval_service": {
            system: "AWS Systems Manager",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Native Approval Service",
            purpose: "The AWS service engine used for change approvals.",
            steps: [
                "Select 'AWS Systems Manager (SSM) Change Manager'."
            ],
            example: "AWS Systems Manager (SSM) Change Manager",
            tip: "Maintains a dual-tier sequential approval workflow in Change Manager."
        },
        "iam2_aws_console_url": {
            system: "AWS Systems Manager Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "AWS Console Direct Change Requests URL",
            purpose: "Direct deep link to the SSM Change Manager requests page for Approver 2.",
            steps: [
                "Copy the URL: https://<region>.console.aws.amazon.com/systems-manager/change-manager/change-requests."
            ],
            example: "https://us-east-1.console.aws.amazon.com/systems-manager/change-manager/change-requests",
            tip: "Links directly to pending requests awaiting Level 2 sign-off."
        },
        "iam2_aws_required_policy": {
            system: "AWS IAM Console",
            badgeClass: "kyraInfoBadgeAws",
            title: "Required AWS Managed Policy",
            purpose: "Policy granting Change Manager approver permissions.",
            steps: [
                "Attach 'AWSSystemsManagerChangeManagerApproverAccess' to Approver 2's IAM User/Role in the IAM Console."
            ],
            example: "AWSSystemsManagerChangeManagerApproverAccess",
            tip: "Enforces least privilege access for Change Manager approvers."
        },
        "iam2_aws_target_platform": {
            system: "Target Cloud Integration",
            badgeClass: "kyraInfoBadgeSap",
            title: "Target Cloud Platform",
            purpose: "The target cloud system bound to Approver 2's approval action (e.g. SAP BTP).",
            steps: [
                "Displays the target platform configured in SAP Application Integration.",
                "When Approver 2 approves in AWS Change Manager, Kyra automatically provisions into this target system."
            ],
            example: "SAP Business Technology Platform (SAP BTP)",
            tip: "Binds the AWS approval workflow directly to SAP BTP SCIM provisioning."
        },
        "iam2_aws_subaccount_id": {
            system: "Target Cloud Integration",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP BTP Subaccount ID",
            purpose: "The 36-character UUID of the SAP BTP subaccount where roles are assigned upon approval.",
            steps: [
                "Matches the SAP BTP Subaccount ID configured in the SAP Integration tab.",
                "Can be updated here if Approver 2 provisions into a dedicated governance subaccount."
            ],
            example: "33d545ed-34b8-4d60-8789-38e9f943e8ad",
            tip: "Ensure the BTP XSUAA Service Key has admin rights in this subaccount."
        },
        "iam2_aws_scim_endpoint": {
            system: "Target Cloud Integration",
            badgeClass: "kyraInfoBadgeSap",
            title: "SCIM 2.0 API Endpoint",
            purpose: "The SCIM API endpoint called upon Level 2 AWS approval to execute role bindings.",
            steps: [
                "Standard format: https://api.authentication.<region>.hana.ondemand.com.",
                "Automatically synced from the SAP Integration tab."
            ],
            example: "https://api.authentication.us10.hana.ondemand.com",
            tip: "Kyra calls POST /Groups/<role-collection-id>/members to add the user upon approval."
        },
        "iam2_aws_scim_method": {
            system: "Target Cloud Integration",
            badgeClass: "kyraInfoBadgeSap",
            title: "SCIM Role Provisioning Implementation",
            purpose: "The SCIM standard method used to assign role collections.",
            steps: [
                "Shows the automated REST protocol used: SCIM 2.0 /Groups Role Collection Member Assignment.",
                "Ensures standard compliance with RFC 7643 and RFC 7644."
            ],
            example: "SCIM 2.0 /Groups Role Collection Member Assignment",
            tip: "Immutable audit log entries are generated for every SCIM group membership assignment."
        },
        "iam2_aws_sync_user": {
            system: "Target Cloud Integration",
            badgeClass: "kyraInfoBadgeSap",
            title: "Auto-Sync Target User Identity",
            purpose: "Controls automatic shadow user creation if the user does not yet exist in the BTP directory.",
            steps: [
                "Shows status: Auto-Create Shadow User in SAP BTP Directory if Missing.",
                "Ensures approvals never fail due to an uninitialized shadow user."
            ],
            example: "Auto-Create Shadow User in SAP BTP Directory if Missing",
            tip: "Kyra queries the SCIM /Users endpoint first, creates the user record if absent, and then attaches the role collections."
        }
    };

    return {
        getFieldHelp: function (sKey) {
            if (!sKey) {
                return null;
            }
            if (FIELD_HELP_MAP[sKey]) {
                return FIELD_HELP_MAP[sKey];
            }
            // Fallback for unrecognized keys
            return {
                system: "Enterprise Access Governance",
                badgeClass: "kyraInfoBadgeSap",
                title: "Configuration Parameter Guide",
                purpose: "This configuration parameter is required to establish secure communication between Kyra Access Governance and your cloud ecosystem.",
                steps: [
                    "Check your enterprise administration console for the requested value.",
                    "Ensure the credential or endpoint has active permissions.",
                    "Contact your system administrator or cloud security team if you do not have access."
                ],
                example: "Check administrative documentation for sample formats.",
                tip: "Make sure all required fields marked with an asterisk (*) are filled prior to testing connection."
            };
        },
        getAllKeys: function () {
            return Object.keys(FIELD_HELP_MAP);
        }
    };
});
