sap.ui.define([], function () {
    "use strict";

    const FIELD_HELP_MAP = {
        // =========================================================================
        // SAP APPLICATION INTEGRATION (COMPREHENSIVE FROM-SCRATCH GUIDES)
        // =========================================================================
        "sap_app_select": {
            system: "SAP Cloud Ecosystem",
            badgeClass: "kyraInfoBadgeSap",
            title: "Select SAP Application (From Scratch)",
            purpose: "Specifies which SAP business system or cloud platform Kyra connects to for access governance, role catalog discovery, automated provisioning, and Segregation of Duties (SoD) enforcement.",
            steps: [
                "Sign in to your organization's SAP management console (e.g., SAP BTP Cockpit at https://cockpit.btp.cloud.sap or your S/4HANA / SaaS Fiori Launchpad).",
                "Determine which SAP target system your enterprise needs Kyra to govern and auto-provision access for.",
                "Choose 'SAP Business Technology Platform (SAP BTP)' to manage Subaccount Role Collections, Cloud Foundry Space developer roles, shadow users, and identity providers.",
                "Choose 'SAP S/4HANA Cloud (ERP)' to automate Business Catalogs, PFCG roles, and IAM User Provisioning via standard SAP Communication Arrangements.",
                "Choose 'SAP SuccessFactors (HCM)' to synchronize employee user records and govern Role-Based Permission (RBP) user groups.",
                "Choose 'SAP Analytics Cloud (SAC)' to automate BI story modeler, administrator, and analytics viewer team permissions via SCIM 2.0.",
                "Choose 'SAP Ariba Supply Network' to govern sourcing, contract management, and procurement realm groups via Ariba Open APIs.",
                "Choose 'SAP Sales Cloud (C4C)' to govern CRM sales representative, manager, and service user permissions via C4C OData services.",
                "Selecting an application immediately tailors the configuration form below to display the exact credentials, endpoints, and step-by-step setup instructions for that specific system."
            ],
            example: "SAP Business Technology Platform (SAP BTP)",
            tip: "Kyra supports multi-system connectivity: you can configure and connect each SAP application independently to manage complete cross-system access governance."
        },
        "btp_service_key": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP BTP Service Key JSON (From Scratch)",
            purpose: "Provides the OAuth 2.0 client credentials, identity zone, and SCIM REST endpoints from the Authorization and Trust Management Service (xsuaa, plan apiaccess) instance, enabling Kyra to automate shadow user creation and role assignments.",
            steps: [
                "STEP 1 (Sign In): Open your browser, navigate to the SAP BTP Cockpit (https://cockpit.btp.cloud.sap), and log in with your SAP Universal ID or administrator credentials.",
                "STEP 2 (Create Subaccount if needed): If you have a fresh Global Account without a Subaccount, click 'Create' → 'Subaccount'. Enter a Display Name (e.g., 'Kyra-Governance-Dev'), Subdomain (e.g., 'kyra-dev-subaccount'), select your Region/Provider (e.g., AWS - us10 or Azure - eu20), and click 'Create'. Once provisioned, click into the Subaccount tile.",
                "STEP 3 (Enable Cloud Foundry if needed): On the Subaccount Overview page, locate the 'Cloud Foundry Environment' card and click 'Enable Cloud Foundry'. Choose an Org Name (e.g. 'kyra-org') and click 'Create'. Then go to 'Cloud Foundry' → 'Spaces' in the left menu, click 'Create Space', enter 'dev', and click 'Save'.",
                "STEP 4 (Create Service Instance): In the left sidebar of your Subaccount, navigate to 'Services' → 'Instances and Subscriptions'. Click the blue 'Create' button at the top right.",
                "STEP 5 (Configure Instance Wizard): In the wizard, select Service: 'Authorization and Trust Management Service' (technical name: xsuaa). Select Plan: 'apiaccess' (CRITICAL: only the 'apiaccess' plan exposes the administrative SCIM APIs Kyra requires). Select Runtime Environment: 'Cloud Foundry', choose Space: 'dev' (or your created space), enter Instance Name: 'kyra-xsuaa-instance', and click 'Create'.",
                "STEP 6 (Create Service Key): Wait a few moments for the instance status to show 'Created' with a green checkmark. Click the '...' (Actions) button on the right side of the 'kyra-xsuaa-instance' row, and select 'Create Service Key'.",
                "STEP 7 (Name Key): In the popup, enter a Service Key Name (e.g., 'kyra-governance-key') and click 'Create'.",
                "STEP 8 (Copy Credentials): Click the '...' button next to the newly created Service Key and select 'View'. In the dialog, verify 'JSON' view is selected, click the 'Copy JSON' button (or copy the entire JSON object from opening brace '{' to closing brace '}').",
                "STEP 9 (Auto-Fill in Kyra): Paste the copied JSON text into this field, then click the blue 'Auto-Fill Credentials' button below to automatically populate all remaining BTP fields instantly!"
            ],
            example: "{\n  \"clientid\": \"sb-na-581e795c-6a6a-4396-844c-a262d5145b1c!a725755\",\n  \"clientsecret\": \"95425be0-a145-4210-bab9-8286246f5707$naofJGTLH2dNzhopzCwWcWQLzfI42gWHIX2wk99vMfI=\",\n  \"url\": \"https://5af75fc5trial.authentication.us10.hana.ondemand.com\",\n  \"apiurl\": \"https://api.authentication.us10.hana.ondemand.com\",\n  \"subaccountid\": \"33d545ed-34b8-4d60-8789-38e9f943e8ad\",\n  \"identityzone\": \"5af75fc5trial\"\n}",
            tip: "Pasting the Service Key JSON and clicking 'Auto-Fill Credentials' automatically parses and populates Region, Subdomain, SCIM URL, Subaccount ID, Token URL, Client ID, and Client Secret in a single click."
        },
        "btp_region": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "BTP Landscape / Region (Data Center)",
            purpose: "Identifies the cloud provider and hyperscaler data center hosting your SAP BTP subaccount (e.g. AWS us10, Azure eu20), needed to construct API endpoints and token routing.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit (https://cockpit.btp.cloud.sap).",
                "STEP 2: If you have not created a Subaccount yet: In your Global Account, click 'Create' → 'Subaccount'. When selecting the 'Region' dropdown, choose your provider and region (e.g., AWS - US East (VA) us10 or Azure - Europe (Frankfurt) eu20).",
                "STEP 3: Click into your Subaccount tile to open the Subaccount dashboard.",
                "STEP 4: In the left navigation menu, make sure you are on the 'Overview' page.",
                "STEP 5: In the 'Subaccount Details' card at the top center/right, locate the line labeled 'Provider / Region'.",
                "STEP 6: Note the technical region code (e.g., 'us10', 'eu10', 'eu20', 'ap11', 'ca10').",
                "STEP 7: Select this matching technical region code from the Kyra dropdown list.",
                "STEP 8 (Alternative): If you paste your XSUAA Service Key JSON into the field above and click 'Auto-Fill Credentials', Kyra automatically extracts and selects the region code for you."
            ],
            example: "us10",
            tip: "The region code forms an essential part of your SAP authentication hostnames (for example, api.authentication.us10.hana.ondemand.com)."
        },
        "btp_subdomain": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "Subaccount Subdomain / Identity Zone",
            purpose: "The unique tenant identifier assigned to your subaccount. SAP BTP uses this subdomain to route OAuth authentication requests to your dedicated Identity Zone.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit (https://cockpit.btp.cloud.sap).",
                "STEP 2: If creating a fresh Subaccount: From your Global Account, click 'Create' → 'Subaccount'. The form prompts you to enter a 'Subdomain'. This is the custom subdomain you assign to your tenant (e.g. 'acme-corp-dev'). Enter your subdomain and click 'Create'.",
                "STEP 3: If using an existing Subaccount: Click on the Subaccount tile from the Global Account dashboard.",
                "STEP 4: On the Subaccount 'Overview' page, look at the 'Subaccount Details' card.",
                "STEP 5: Locate the row labeled 'Subdomain'.",
                "STEP 6: Copy the exact alphanumeric subdomain value (e.g. 'acme-corp-dev' or '5af75fc5trial'). Do NOT include 'https://' or '.authentication...'.",
                "STEP 7: Alternatively, look inside your XSUAA Service Key JSON for the 'identityzone' attribute and copy its string value.",
                "STEP 8: Paste the subdomain into this field."
            ],
            example: "acme-corp-dev",
            tip: "The subdomain is strictly case-sensitive and must match the identity zone configured in your SAP BTP subaccount."
        },
        "btp_scim_url": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "BTP SCIM 2.0 API Base URL",
            purpose: "The SCIM 2.0 REST endpoint Kyra calls to discover role collections, read users (/Users), and execute automated role assignment requests (/Groups).",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit (https://cockpit.btp.cloud.sap) and navigate into your Subaccount.",
                "STEP 2: Verify that your Subaccount has an active service instance of 'Authorization and Trust Management Service' (xsuaa) under plan 'apiaccess' (navigate to Services → Instances and Subscriptions → Create → Service: Authorization and Trust Management Service, Plan: apiaccess).",
                "STEP 3: Under the 'Instances' tab, locate your xsuaa instance, click the '...' (Actions) button, and select 'Create Service Key' (or view an existing one).",
                "STEP 4: In the Service Key JSON viewer, locate the 'apiurl' attribute.",
                "STEP 5: Copy the URL string (format: https://api.authentication.<region>.hana.ondemand.com).",
                "STEP 6: Paste this URL into the field. Make sure there is NO trailing slash at the end.",
                "STEP 7: (Auto-Fill): Pasting the Service Key JSON into the top box and clicking 'Auto-Fill Credentials' populates this automatically."
            ],
            example: "https://api.authentication.us10.hana.ondemand.com",
            tip: "Notice that the SCIM API URL always starts with 'https://api.authentication...' (not your tenant subdomain), while the OAuth Token URL starts with your tenant subdomain."
        },
        "btp_subaccount_id": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP BTP Subaccount ID (36-Character UUID)",
            purpose: "The globally unique identifier (GUID) of your SAP BTP subaccount, used in REST API routing and governance audit logs.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit (https://cockpit.btp.cloud.sap).",
                "STEP 2: If you haven't created a Subaccount yet: Click 'Create' → 'Subaccount' in your Global Account. SAP BTP automatically assigns a unique 36-character UUID upon subaccount creation.",
                "STEP 3: Click into your Subaccount to open its dashboard.",
                "STEP 4: In the left navigation menu, click 'Overview'.",
                "STEP 5: In the 'Subaccount Details' card, locate the row labeled 'Subaccount ID'.",
                "STEP 6: Click the copy icon next to the 36-character hyphenated UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).",
                "STEP 7: Alternatively, open your XSUAA Service Key JSON and copy the value of the 'subaccountid' key.",
                "STEP 8: Paste the 36-character UUID into this field. (Do not confuse this with the Subdomain or Display Name)."
            ],
            example: "33d545ed-34b8-4d60-8789-38e9f943e8ad",
            tip: "A valid BTP Subaccount ID always contains exactly 32 hexadecimal digits separated by 4 hyphens (8-4-4-4-12 format)."
        },
        "btp_token_url": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Token URL",
            purpose: "The OAuth 2.0 token endpoint Kyra contacts using Client Credentials grant to obtain secure Bearer tokens before issuing provisioning commands.",
            steps: [
                "STEP 1: Open your Subaccount in SAP BTP Cockpit (https://cockpit.btp.cloud.sap).",
                "STEP 2: Navigate to Services → Instances and Subscriptions.",
                "STEP 3: Under the 'Instances' tab, locate your xsuaa (plan: apiaccess) instance, click the '...' button, and view your Service Key.",
                "STEP 4: In the Service Key JSON, locate the 'url' property (e.g., 'https://5af75fc5trial.authentication.us10.hana.ondemand.com').",
                "STEP 5: Construct the full Token URL by appending '/oauth/token' to that base URL.",
                "STEP 6: Standard format: https://<subdomain>.authentication.<region>.hana.ondemand.com/oauth/token",
                "STEP 7: Copy and paste this full Token URL into the field.",
                "STEP 8: (Auto-Fill): Clicking 'Auto-Fill Credentials' after pasting the Service Key JSON computes and fills this URL automatically."
            ],
            example: "https://5af75fc5trial.authentication.us10.hana.ondemand.com/oauth/token",
            tip: "Unlike the SCIM base URL, the OAuth Token URL must include your tenant-specific subdomain at the beginning of the hostname."
        },
        "btp_idp_origin": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "Default IdP Origin Key",
            purpose: "Specifies which Identity Provider is used to authenticate users in the subaccount. When Kyra provisions shadow users and binds role collections, this origin key tells BTP which IdP directory owns the user.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit (https://cockpit.btp.cloud.sap) and navigate to your Subaccount.",
                "STEP 2: In the left navigation menu, expand 'Security' and click 'Trust Configuration'.",
                "STEP 3: Inspect the table of configured identity providers and check the 'Origin Key' column:",
                "  • If you are using standard SAP credentials (default on brand-new accounts), the origin key is 'sap.ids' (SAP ID Service). Enter 'sap.ids'.",
                "  • If you have connected SAP Cloud Identity Services (IAS), look for the origin key starting with 'sap.custom' or your custom IAS tenant name.",
                "  • If you have federated Microsoft Entra ID (Azure AD), Okta, or Ping Identity via SAML, find the custom origin key you configured.",
                "STEP 4: For a new account that has not set up corporate single sign-on yet, enter 'sap.ids'.",
                "STEP 5: Copy the exact origin key and paste it into this field."
            ],
            example: "sap.ids",
            tip: "When Kyra provisions a user into SAP BTP, this origin key determines which user store the shadow record is mapped to. If users log in via Azure AD, ensure this matches your Azure AD trust origin."
        },
        "btp_client_id": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Client ID",
            purpose: "The public client identifier generated by SAP BTP's XSUAA service for your Kyra governance integration.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit and open your Subaccount.",
                "STEP 2: If you haven't created an instance yet: Go to Services → Instances and Subscriptions → Click 'Create' → Service: 'Authorization and Trust Management Service', Plan: 'apiaccess', Instance Name: 'kyra-xsuaa-instance' → Click 'Create'.",
                "STEP 3: Once created, click the '...' (Actions) button on the instance row and select 'Create Service Key'.",
                "STEP 4: Enter a name (e.g. 'kyra-key') and click 'Create'.",
                "STEP 5: Click '...' on the newly created Service Key and select 'View'.",
                "STEP 6: In the JSON viewer, locate the 'clientid' attribute.",
                "STEP 7: Copy the string value (e.g., 'sb-na-581e795c-6a6a-4396-844c-a262d5145b1c!a725755').",
                "STEP 8: Paste it into the OAuth 2.0 Client ID field."
            ],
            example: "sb-na-581e795c-6a6a-4396-844c-a262d5145b1c!a725755",
            tip: "BTP Client IDs typically begin with 'sb-' and end with an exclamation mark '!' followed by a plan suffix."
        },
        "btp_client_secret": {
            system: "SAP BTP Cockpit",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Client Secret",
            purpose: "The confidential cryptographic password paired with the Client ID to authenticate Kyra with SAP BTP.",
            steps: [
                "STEP 1: Open your Subaccount in SAP BTP Cockpit.",
                "STEP 2: Navigate to Services → Instances and Subscriptions.",
                "STEP 3: Locate your XSUAA (plan: apiaccess) instance, click the '...' menu, and open your Service Key.",
                "STEP 4: Find the 'clientsecret' property in the JSON object.",
                "STEP 5: Copy the full secret string, being careful to include all characters, symbols, and any trailing '=' padding.",
                "STEP 6: Paste the secret into the OAuth 2.0 Client Secret field.",
                "STEP 7: Note: Kyra securely encrypts this secret in the backend using AES-256 and never transmits it in plain text."
            ],
            example: "95425be0-a145-4210-bab9-8286246f5707$naofJGTLH2dNzhopzCwWcWQLzfI42gWHIX2wk99vMfI=",
            tip: "If you ever delete or regenerate the Service Key in SAP BTP, remember to update this secret in Kyra to prevent authentication failures."
        },
        "btp_cf_org": {
            system: "SAP BTP Cloud Foundry",
            badgeClass: "kyraInfoBadgeSap",
            title: "Cloud Foundry Organization (From Scratch)",
            purpose: "The top-level Cloud Foundry organizational unit in your BTP subaccount where runtime spaces, applications, and developer roles reside.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit and open your Subaccount.",
                "STEP 2: If Cloud Foundry is not enabled yet: On your Subaccount Overview page, locate the 'Cloud Foundry Environment' card and click the blue 'Enable Cloud Foundry' button.",
                "STEP 3: In the popup dialog, choose a Landscape (e.g. standard CF landscape for your region) and an 'Org Name'. By default, SAP suggests your subaccount subdomain. Click 'Create'.",
                "STEP 4: Wait approximately 30-60 seconds for Cloud Foundry enablement to finish.",
                "STEP 5: Once enabled, the card displays 'Org Name' (e.g., 'acme-corp-dev' or '5af75fc5trial').",
                "STEP 6: Copy the exact Org Name and paste it into this field.",
                "STEP 7 (Optional): If you do not use Cloud Foundry and only want Kyra to govern Cockpit Subaccount Role Collections, you can leave this field blank."
            ],
            example: "acme-corp-dev",
            tip: "Enabling Cloud Foundry allows Kyra to provision Cloud Foundry developer permissions (SpaceDeveloper, SpaceAuditor) in addition to Subaccount Role Collections."
        },
        "btp_cf_space": {
            system: "SAP BTP Cloud Foundry",
            badgeClass: "kyraInfoBadgeSap",
            title: "Cloud Foundry Space (From Scratch)",
            purpose: "The target runtime environment (e.g., dev, test, prod) within your Cloud Foundry Organization where apps run and developers need access.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit and open your Subaccount.",
                "STEP 2: Ensure Cloud Foundry is enabled (see Cloud Foundry Org guide above).",
                "STEP 3: In the left navigation menu under your Subaccount, click 'Cloud Foundry' → 'Spaces'.",
                "STEP 4: If no space exists yet: Click the blue 'Create Space' button at the top right.",
                "STEP 5: Enter a Space Name (e.g., 'dev' or 'production'), select initial space roles, and click 'Save'.",
                "STEP 6: In the Spaces table, locate the name of the space you want Kyra to govern.",
                "STEP 7: Enter that exact space name (e.g. 'dev') into this field.",
                "STEP 8: When a user requests Cloud Foundry developer access in Kyra, Kyra binds their role directly to this specified space."
            ],
            example: "dev",
            tip: "Space names are case-sensitive. Common standard spaces include 'dev', 'qa', 'staging', and 'prod'."
        },
        "btp_cf_api": {
            system: "SAP BTP Cloud Foundry",
            badgeClass: "kyraInfoBadgeSap",
            title: "Cloud Foundry API Endpoint",
            purpose: "The REST endpoint for the Cloud Foundry Controller (CC API) through which Kyra manages Cloud Foundry space memberships and service bindings.",
            steps: [
                "STEP 1: Log in to SAP BTP Cockpit and open your Subaccount.",
                "STEP 2: On the Subaccount Overview page, look at the 'Cloud Foundry Environment' card (enabled as described above).",
                "STEP 3: Locate the field labeled 'API Endpoint' (e.g., 'https://api.cf.us10-001.hana.ondemand.com').",
                "STEP 4: Click the copy icon next to the URL.",
                "STEP 5: Alternatively, open a terminal on your workstation with the Cloud Foundry CLI installed, run 'cf login', and run 'cf api' to see the active endpoint.",
                "STEP 6: Paste the URL into this field. Ensure it starts with 'https://' and has no trailing slash."
            ],
            example: "https://api.cf.us10-001.hana.ondemand.com",
            tip: "Cloud Foundry API endpoints always follow the format 'https://api.cf.<region>.hana.ondemand.com'."
        },
        "btp_provisioning_scope": {
            system: "SAP BTP Governance",
            badgeClass: "kyraInfoBadgeSap",
            title: "Target Provisioning Scope",
            purpose: "Defines whether Kyra automatically provisions permissions into BTP Subaccount Role Collections only, Cloud Foundry Space roles only, or both simultaneously.",
            steps: [
                "STEP 1: Evaluate what security layer in SAP BTP your users require access to:",
                "STEP 2: Select 'Subaccount Role Collections Only' if your users only require administrative Cockpit access, Launchpad access, or SaaS application business roles (e.g. Subaccount Administrator, Destination Administrator, Business Application Studio Administrator).",
                "STEP 3: Select 'Cloud Foundry Space Roles Only' if you are exclusively onboarding software engineers and DevOps who only need Space Developer or Space Auditor CLI access.",
                "STEP 4: Select 'Both (Subaccount Roles + CF Space Bindings)' (RECOMMENDED) for unified enterprise governance. In a single approval, the user receives both their Subaccount Role Collection and their Cloud Foundry Space Developer permissions.",
                "STEP 5: Select your preferred option from the dropdown menu."
            ],
            example: "Both (Subaccount Roles + CF Space Bindings)",
            tip: "Using 'Both' eliminates the need for separate developer onboarding tickets by synchronizing Cockpit permissions and Cloud Foundry space roles simultaneously."
        },
        "s4hana_system_url": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP S/4HANA Cloud API URL (From Scratch)",
            purpose: "The base HTTPS URL of your SAP S/4HANA Cloud system where OData IAM services are published for external access governance.",
            steps: [
                "STEP 1 (Find Hostname): Sign in to your SAP S/4HANA Cloud system as an Administrator (e.g. https://myXXXXXX.s4hana.cloud.sap or .s4hana.ondemand.com).",
                "STEP 2 (Identify API Host): In S/4HANA Cloud, external APIs use a dedicated API host with '-api' inserted before the domain.",
                "  • If your Launchpad URL is: https://my300123.s4hana.cloud.sap",
                "  • Your API Host URL is: https://my300123-api.s4hana.cloud.sap",
                "STEP 3 (Verify in Communication Systems): Alternatively, open the Fiori app 'Communication Systems', check your inbound communication settings or consult your SAP welcome email for the Inbound API Base URL.",
                "STEP 4: Copy the API host URL.",
                "STEP 5: Paste this URL into the field. Make sure it begins with 'https://' and has no trailing slash or path."
            ],
            example: "https://my300123-api.s4hana.cloud.sap",
            tip: "Always use the '-api' hostname for S/4HANA Cloud. Inbound OData API calls routed to the UI hostname will be rejected by SAP's security gateway."
        },
        "s4hana_client": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Client ID / Mandant (From Scratch)",
            purpose: "The 3-digit numerical tenant/client identifier (MANDT) in the S/4HANA database where user accounts and business role assignments are stored.",
            steps: [
                "STEP 1: Sign in to your SAP S/4HANA Cloud Fiori Launchpad.",
                "STEP 2: Click on your user avatar or profile icon in the top right corner of the screen.",
                "STEP 3: Click 'About' or 'Settings' in the user dropdown menu.",
                "STEP 4: In the system details popup, find the 'Client' or 'Mandant' field.",
                "  • In S/4HANA Cloud Production systems, this is typically '100'.",
                "  • In Customizing / Development tenants, it is often '080' or '100'.",
                "  • In Quality Assurance / Test tenants, it is typically '100'.",
                "STEP 5: Enter the 3-digit client number (e.g., 100) into this field."
            ],
            example: "100",
            tip: "Every S/4HANA OData API request includes this client number in the 'sap-client=100' query parameter to target the correct business tenant."
        },
        "s4hana_scenario": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Communication Scenario / Arrangement (From Scratch)",
            purpose: "The technical integration scenario in S/4HANA that exposes Identity and Access Management APIs to external systems for user and role provisioning.",
            steps: [
                "STEP 1: Sign in to SAP S/4HANA Cloud with an Administrator user having business catalog 'SAP_CORE_BC_COM' (Communication Management).",
                "STEP 2: In the Fiori Launchpad search bar, search for and open the app 'Communication Arrangements'.",
                "STEP 3 (Create from Scratch): If no arrangement has been created for Kyra yet, click the 'New' button.",
                "STEP 4 (Select Scenario): In the 'Scenario' dropdown, select standard SAP IAM scenario: 'SAP_COM_0093' (Identity and Access Management Integration) or 'SAP_COM_0193'.",
                "STEP 5: In 'Arrangement Name', enter 'KYRA_IAM_INTEGRATION'.",
                "STEP 6: Assign your Communication System and Communication User (see the next steps).",
                "STEP 7: Click 'Save' to activate the arrangement.",
                "STEP 8: Enter the scenario ID 'SAP_COM_0093' into this field."
            ],
            example: "SAP_COM_0093",
            tip: "Scenario SAP_COM_0093 is the official SAP S/4HANA Cloud standard API for reading business catalogs and automating business role assignments."
        },
        "s4hana_auth_type": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Authentication Type",
            purpose: "Specifies whether Kyra authenticates using Basic Auth (Communication User) or OAuth 2.0 / Client Certificate with SAP S/4HANA Cloud.",
            steps: [
                "STEP 1: In S/4HANA Cloud, open the 'Communication Systems' app and open your Kyra communication system.",
                "STEP 2: Scroll down to 'Users for Inbound Communication'.",
                "STEP 3: Check the Authentication Method configured for that user:",
                "  • Choose 'Basic Authentication (Communication User)' for User ID and Password (recommended for straightforward and reliable setup).",
                "  • Choose 'OAuth 2.0 / SAML Bearer' or 'Client Certificate (X.509)' if your organization requires certificate-based zero-trust security.",
                "STEP 4: Select the matching option from this dropdown."
            ],
            example: "Basic Authentication (Communication User)",
            tip: "Basic Auth with a dedicated technical communication user is the quickest and most stable setup for S/4HANA Cloud integrations."
        },
        "s4hana_comm_user": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Communication User (From Scratch)",
            purpose: "A dedicated technical background user created inside S/4HANA Cloud that Kyra uses to execute provisioning APIs without consuming dialogue licenses.",
            steps: [
                "STEP 1: Sign in to SAP S/4HANA Cloud Fiori Launchpad as an Administrator.",
                "STEP 2: Search for and open the 'Maintain Communication Users' app.",
                "STEP 3 (Create User): Click the 'New' button.",
                "STEP 4: Enter a User Name (e.g., 'KYRA_SYNC_USER' or 'CC0000000001') and a Description (e.g., 'Kyra Governance Integration User').",
                "STEP 5: Enter or generate a strong password, re-enter to confirm, and click 'Create'.",
                "STEP 6 (Assign to Communication System): Open the 'Communication Systems' app, open your system, and under 'Users for Inbound Communication', click '+' to add this user.",
                "STEP 7: Copy the exact technical User Name and paste it into this field."
            ],
            example: "KYRA_SYNC_USER",
            tip: "Communication users in S/4HANA Cloud cannot sign in via browser, which secures them against interactive credential theft and saves dialogue user licenses."
        },
        "s4hana_comm_password": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "Communication Password / Secret (From Scratch)",
            purpose: "The password assigned to the technical Communication User in S/4HANA Cloud for API authorization.",
            steps: [
                "STEP 1: In S/4HANA Cloud Fiori Launchpad, open the 'Maintain Communication Users' app.",
                "STEP 2: Select your communication user (e.g. 'KYRA_SYNC_USER') and click 'Edit' (or set it during user creation).",
                "STEP 3: Click 'Change Password' or click the 'Generate Password' button to produce a high-entropy secret.",
                "STEP 4: Copy the password immediately and paste it into this field.",
                "STEP 5: Click 'Save' in S/4HANA to ensure the new password is live.",
                "STEP 6: Note: Kyra encrypts this password at rest using AES-256."
            ],
            example: "••••••••••••••••••••••••",
            tip: "In S/4HANA Cloud, communication user passwords do not enforce periodic password expiry policies like dialogue users do, ensuring uninterrupted API connectivity."
        },
        "s4hana_odata_url": {
            system: "SAP S/4HANA Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "OData IAM User & Role API Path (From Scratch)",
            purpose: "The relative URL path of the SAP OData service that Kyra queries to list available business roles and assign them to business users.",
            steps: [
                "STEP 1: In S/4HANA Cloud Fiori Launchpad, open the 'Communication Arrangements' app.",
                "STEP 2: Open your arrangement for 'SAP_COM_0093'.",
                "STEP 3: Scroll down to the 'Inbound Services' section in the arrangement details.",
                "STEP 4: Find the service named 'IAM: User & Business Role Integration' (Service ID: APS_IAM_USER_ROLE_SRV).",
                "STEP 5: Copy the Service URL path (standard SAP default is: /sap/opu/odata/sap/APS_IAM_USER_ROLE_SRV).",
                "STEP 6: Paste this path into the field."
            ],
            example: "/sap/opu/odata/sap/APS_IAM_USER_ROLE_SRV",
            tip: "Kyra appends this path to your S/4HANA Cloud API URL to execute OData v2 batch operations for user role assignments."
        },
        "sf_api_endpoint": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "SuccessFactors API Host (From Scratch)",
            purpose: "The regional OData REST gateway endpoint corresponding to your SAP SuccessFactors data center.",
            steps: [
                "STEP 1: Look at the URL you use to log in to SAP SuccessFactors in your browser (e.g., https://performancemanager12.successfactors.com/login?company=KYRACORP).",
                "STEP 2: Note the data center number or code after 'performancemanager' (e.g., '12' represents Data Center DC12, '4' represents DC4, '8' represents DC8, etc.).",
                "STEP 3: Map your data center to the official SAP SuccessFactors API endpoint:",
                "  • DC12 (Rot, Germany): https://api12.sapsf.eu or https://api12preview.sapsf.com",
                "  • DC4 (Chandler, US): https://api4.successfactors.com",
                "  • DC8 (Ashburn, US): https://api8.successfactors.com",
                "  • DC2 (Amsterdam): https://api2.successfactors.eu",
                "  • DC10 (Sydney): https://api10.successfactors.com",
                "STEP 4: Copy and paste your data center's base API host (e.g., 'https://api12preview.sapsf.com') into this field.",
                "STEP 5: Do NOT append '/odata/v2' as Kyra handles service path routing automatically."
            ],
            example: "https://api12preview.sapsf.com",
            tip: "Consult SAP Knowledge Base Article (KBA) 2215682 for the complete list of all global SuccessFactors production and preview API endpoints."
        },
        "sf_company_id": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "SuccessFactors Company ID (From Scratch)",
            purpose: "The unique corporate tenant ID used to identify your organization in the SuccessFactors multi-tenant cloud.",
            steps: [
                "STEP 1: Open your SuccessFactors login screen.",
                "STEP 2: On the login page, locate the 'Company ID' input box next to Username and Password. That exact text is your Company ID.",
                "STEP 3 (Alternative in Admin Center): If already signed in with an administrator account, search for 'Company System and Logo Settings' in Admin Center.",
                "STEP 4: View the 'Company ID' displayed at the top of the settings page.",
                "STEP 5: Enter the Company ID in this field (it is strictly case-sensitive)."
            ],
            example: "KYRACORP01",
            tip: "Your Company ID is permanent and identical across all SuccessFactors modules (Employee Central, Performance & Goals, Recruiting)."
        },
        "sf_api_user": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "API Administrator Username (From Scratch)",
            purpose: "A dedicated technical user in SuccessFactors authorized to query employee data and assign Role-Based Permission (RBP) groups.",
            steps: [
                "STEP 1: Sign in to SuccessFactors as a System Administrator.",
                "STEP 2: In Admin Center, create or identify an administrative service account (e.g., 'kyra_api_user').",
                "STEP 3: Ensure this technical user is granted permission to access OData APIs:",
                "  • In Admin Center, go to 'Manage Role-Based Permission Access'.",
                "  • Assign the user a permission role with 'General User Permission' → 'SFAPI/OData API Access' checked.",
                "  • Also grant 'Manage User' and 'Manage Role-Based Permissions' under User Permissions.",
                "STEP 4: Enter the technical username in this field."
            ],
            example: "kyra_api_user",
            tip: "Never use an employee's personal account for API synchronization. A dedicated service user prevents access failures when employees change roles."
        },
        "sf_client_id": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth 2.0 Client ID / API Key (From Scratch)",
            purpose: "The public client identifier generated by registering Kyra in SuccessFactors' OAuth2 Client Applications registry.",
            steps: [
                "STEP 1: Sign in to SuccessFactors Admin Center as an Administrator.",
                "STEP 2: In the 'Tool Search' box at the top right, search for 'Manage OAuth2 Client Applications' and click it.",
                "STEP 3 (Register from Scratch): If Kyra has not been registered yet, click the 'Register Client Application' button.",
                "STEP 4: Fill in the registration form:",
                "  • Application Name: 'Kyra Access Governance'",
                "  • Description: 'Kyra IAM and automated role provisioning'",
                "  • Application URL: 'https://kyra.cloud' (or your Kyra hosting domain)",
                "STEP 5: Click the 'Generate X.509 Certificate' button. In the popup, enter Common Name 'CN=Kyra Governance' and click 'Generate'.",
                "STEP 6: Click 'Download' on the private key and save it securely on your computer (needed for the Private Key field below).",
                "STEP 7: Click 'Register' / 'Save' at the bottom of the page.",
                "STEP 8: In the client list, locate 'Kyra Access Governance' and copy the generated 'API Key' string.",
                "STEP 9: Paste this API Key into the OAuth 2.0 Client ID field."
            ],
            example: "NWNjMGQxOGYtYTM2NS00YjVjLThmOWQtYmE1ZDRhOTkxOTg1",
            tip: "The API Key generated in Manage OAuth2 Client Applications functions as the OAuth Client ID during SAML assertion exchange."
        },
        "sf_client_secret": {
            system: "SAP SuccessFactors",
            badgeClass: "kyraInfoBadgeSap",
            title: "Private Key / X.509 Certificate (From Scratch)",
            purpose: "The private cryptographic key paired with your SuccessFactors OAuth registration, used to cryptographically sign SAML Bearer assertions for API authentication.",
            steps: [
                "STEP 1: Locate the private key file downloaded during Step 6 of the OAuth Client ID registration above (usually named 'private_key.pem' or '.key').",
                "STEP 2: Open the file with a text editor such as Notepad, TextEdit, or VS Code.",
                "STEP 3: Copy the complete text of the private key, including the lines '-----BEGIN RSA PRIVATE KEY-----' and '-----END RSA PRIVATE KEY-----'.",
                "STEP 4: Paste the entire text into this field.",
                "STEP 5 (CRITICAL): SuccessFactors NEVER allows you to view or re-download this private key once you leave that screen. If you lost the file, open 'Manage OAuth2 Client Applications', edit the client, generate a new certificate, and download the new private key."
            ],
            example: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----",
            tip: "SuccessFactors uses SAML 2.0 Bearer Assertion flow for OAuth 2.0. Kyra signs the assertion with this private key to obtain an access token without exposing your user passwords."
        },
        "sac_tenant_url": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Analytics Cloud Tenant Host (From Scratch)",
            purpose: "The base HTTPS URL of your SAP Analytics Cloud (SAC) tenant hosting stories, models, and BI teams.",
            steps: [
                "STEP 1: Open your SAP Analytics Cloud tenant in your browser.",
                "STEP 2: Look at the URL in your browser's address bar (e.g. https://mycompany-analytics.eu10.analytics.cloud.sap/sap/fpa/ui/tenants/...).",
                "STEP 3: Strip away any trailing path after the domain name, keeping only the protocol and domain.",
                "STEP 4: Standard format: https://<tenant-id>.<region>.analytics.cloud.sap (or .hanaglobal.ondemand.com).",
                "STEP 5: Paste this clean URL into the field."
            ],
            example: "https://acme-analytics.eu10.analytics.cloud.sap",
            tip: "Ensure you do not include trailing slashes or URL query parameters like '/sap/fpa/ui' in this field."
        },
        "sac_scim_url": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SCIM API URL (From Scratch)",
            purpose: "The SCIM 2.0 REST endpoint in SAC through which Kyra reads users, teams, and automatically provisions BI modeler, administrator, or viewer roles.",
            steps: [
                "STEP 1: Log in to SAP Analytics Cloud with a System Administrator user.",
                "STEP 2: In the left navigation menu, click 'System' → 'Administration'.",
                "STEP 3: Click on the 'App Integration' tab in the top navigation bar.",
                "STEP 4: Scroll down to the section titled 'SCIM API' or 'OAuth API Access'.",
                "STEP 5: Copy the displayed SCIM API URL (standard path is https://<tenant-host>/api/v1/scim).",
                "STEP 6: Paste the full URL into this field."
            ],
            example: "https://acme-analytics.eu10.analytics.cloud.sap/api/v1/scim",
            tip: "SAC SCIM 2.0 API supports standard user provisioning and team membership assignments compliant with RFC 7643/7644."
        },
        "sac_token_url": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAC OAuth Token URL (From Scratch)",
            purpose: "The OAuth 2.0 token endpoint where Kyra exchanges OAuth credentials for a Bearer token to authorize SCIM requests.",
            steps: [
                "STEP 1: Log in to SAP Analytics Cloud as an Administrator.",
                "STEP 2: Go to 'System' → 'Administration' → 'App Integration' tab.",
                "STEP 3: Under the 'OAuth Clients' section, look at the top configuration details header.",
                "STEP 4: Locate the line labeled 'Token URL' (e.g., 'https://<tenant-host>/oauth/token').",
                "STEP 5: Copy this Token URL and paste it into this field."
            ],
            example: "https://acme-analytics.eu10.analytics.cloud.sap/oauth/token",
            tip: "SAC tokens expire after 3600 seconds (1 hour); Kyra automatically handles seamless background token refreshment."
        },
        "sac_client_id": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client ID (From Scratch)",
            purpose: "The public client identifier generated in SAC App Integration specifically configured for SCIM user and team provisioning.",
            steps: [
                "STEP 1: Log in to SAP Analytics Cloud as a System Administrator.",
                "STEP 2: Navigate to 'System' → 'Administration' → 'App Integration'.",
                "STEP 3 (Create Client from Scratch): In the 'OAuth Clients' section, click the '+ Add a New OAuth Client' button.",
                "STEP 4: Configure the OAuth Client:",
                "  • Name: 'Kyra Access Governance'",
                "  • Purpose: Select 'User and Team Provisioning' from the dropdown.",
                "  • Access: Select 'API Access'.",
                "  • Permissions: Ensure 'SCIM API' permissions (read/write users and teams) are checked.",
                "STEP 5: Click 'Save'.",
                "STEP 6: In the OAuth Clients list, locate 'Kyra Access Governance' and copy the generated 'OAuth Client ID'.",
                "STEP 7: Paste it into this field."
            ],
            example: "acme-kyra-sac-client-01",
            tip: "Specifying 'User and Team Provisioning' as the purpose ensures the generated OAuth client has the necessary scopes to create users and assign teams."
        },
        "sac_client_secret": {
            system: "SAP Analytics Cloud",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client Secret (From Scratch)",
            purpose: "The confidential cryptographic client secret generated for your SAC OAuth client.",
            steps: [
                "STEP 1: When creating the OAuth client in 'System' → 'Administration' → 'App Integration' as described in the previous step, a popup displays the 'Secret'.",
                "STEP 2 (IMPORTANT): SAP Analytics Cloud only displays this Secret ONCE at the moment of client creation.",
                "STEP 3: Copy the Secret immediately and paste it into this field.",
                "STEP 4: If you missed copying the secret or lost it, find the OAuth Client in the list, click the edit pencil or key icon, and select 'Generate New Secret'."
            ],
            example: "••••••••••••••••••••••••",
            tip: "Never share this secret in unencrypted communications. Kyra encrypts the secret at rest using enterprise AES-256 encryption."
        },
        "ariba_realm": {
            system: "SAP Ariba",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Ariba Realm Name (From Scratch)",
            purpose: "The unique customer realm identifier that differentiates your company's procurement or sourcing environment within SAP Ariba.",
            steps: [
                "STEP 1: Sign in to your SAP Ariba site (e.g., Ariba Buyer, Sourcing, or Network).",
                "STEP 2: Look at the URL in your browser address bar (e.g., https://s1.ariba.com/Buyer/Main?realm=acmecorp-T or ?realm=acmecorp).",
                "STEP 3: Locate the parameter 'realm=' in the URL.",
                "STEP 4: Copy the exact realm name following the '=' sign (e.g. 'acmecorp' or 'acmecorp-T' for test realms).",
                "STEP 5: Alternatively, click on your user name in the top right header inside Ariba to view your current Realm name.",
                "STEP 6: Paste the realm name into this field."
            ],
            example: "acmecorp-prod",
            tip: "Realms ending in '-T' are typically sandbox/test realms. Verify you are connecting to your intended target realm."
        },
        "ariba_url": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "Ariba Open API Gateway Host (From Scratch)",
            purpose: "The regional API gateway through which SAP Ariba exposes Open APIs for user management and role groups.",
            steps: [
                "STEP 1: Log in to the SAP Ariba Developer Portal at https://developer.ariba.com.",
                "STEP 2: If you do not have an account yet, your company's Ariba administrator must invite you to the portal.",
                "STEP 3: Navigate to 'API Catalog' and look up 'User Management API'.",
                "STEP 4: Check the regional gateway host for your realm:",
                "  • Global / US: https://openapi.ariba.com",
                "  • Europe: https://eu.openapi.ariba.com",
                "  • Australia / Pacific: https://au.openapi.ariba.com",
                "STEP 5: For standard US/Global deployments, use 'https://openapi.ariba.com'.",
                "STEP 6: Enter this gateway URL into the field."
            ],
            example: "https://openapi.ariba.com",
            tip: "Always use HTTPS. Do not include path suffixes like '/api' in this host field."
        },
        "ariba_api_key": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "Application API Key (From Scratch)",
            purpose: "The application identifier issued by the SAP Ariba Developer Portal that must be transmitted in the 'apiKey' HTTP header of every request.",
            steps: [
                "STEP 1: Sign in to the SAP Ariba Developer Portal (https://developer.ariba.com).",
                "STEP 2 (Create Application): If you haven't created an application yet, click 'Manage' in the top menu → 'Applications' → '+ Click to create a new application'.",
                "STEP 3: Enter an Application Name (e.g., 'Kyra Governance Integration') and Description.",
                "STEP 4: Under 'APIs', search for and check 'User Management API' (and 'Group Management API' if governing procurement approval groups).",
                "STEP 5: Submit the application. Your designated Ariba Designated Support Contact (DSC) or Admin must approve the application.",
                "STEP 6: Once approved, open the application in the Developer Portal.",
                "STEP 7: Locate the 'API Key' field on the application overview page and copy the alphanumeric key.",
                "STEP 8: Paste the API Key into this field."
            ],
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            tip: "Ariba Open APIs require two layers of security: an OAuth 2.0 Bearer token AND this static apiKey header."
        },
        "ariba_client_id": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client ID (From Scratch)",
            purpose: "The OAuth 2.0 Client ID generated for your approved application in the Ariba Developer Portal.",
            steps: [
                "STEP 1: In SAP Ariba Developer Portal (https://developer.ariba.com), navigate to 'Manage' → 'Applications'.",
                "STEP 2: Click on your approved Kyra integration application.",
                "STEP 3: In the application details, scroll down to the 'OAuth Client Details' section.",
                "STEP 4: Copy the 'OAuth Client ID'.",
                "STEP 5: Paste it into this field."
            ],
            example: "kyra-ariba-client-001",
            tip: "OAuth Client IDs in Ariba are generated only after the application request is approved by the organization administrator."
        },
        "ariba_client_secret": {
            system: "SAP Ariba Developer Portal",
            badgeClass: "kyraInfoBadgeSap",
            title: "OAuth Client Secret (From Scratch)",
            purpose: "The confidential client secret paired with your Ariba OAuth Client ID for token generation.",
            steps: [
                "STEP 1: In SAP Ariba Developer Portal (https://developer.ariba.com), open your application under 'Manage' → 'Applications'.",
                "STEP 2: Under 'OAuth Client Details', find the 'OAuth Client Secret' field.",
                "STEP 3: Click 'Show' or copy the secret value.",
                "STEP 4: Paste the secret into this field."
            ],
            example: "••••••••••••••••••••••••",
            tip: "If this secret is compromised or expires, you can generate a new secret in the Ariba Developer Portal without changing your Application API Key."
        },
        "c4c_tenant_url": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "SAP Sales Cloud Tenant Host (From Scratch)",
            purpose: "The base HTTPS URL of your Cloud for Customer (C4C) tenant.",
            steps: [
                "STEP 1: Sign in to SAP Sales Cloud (C4C) in your browser.",
                "STEP 2: Check the browser address bar (e.g. https://my300456.crm.ondemand.com).",
                "STEP 3: Strip away any trailing path after '.crm.ondemand.com'.",
                "STEP 4: Standard format: https://myXXXXXX.crm.ondemand.com.",
                "STEP 5: Paste the clean hostname into this field."
            ],
            example: "https://my300456.crm.ondemand.com",
            tip: "Do not include any path like '/sap/c4c/...' in this host field."
        },
        "c4c_odata_url": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "C4C OData User Service Path (From Scratch)",
            purpose: "The relative endpoint path of the standard C4C OData v1 service that provides access to the BusinessUserCollection and business role assignments.",
            steps: [
                "STEP 1: Log in to SAP Sales Cloud as an Administrator.",
                "STEP 2: In the left navigation menu, go to 'Administrator' → 'General Settings'.",
                "STEP 3: Under 'Integration', click 'OData API Monitor' or 'Communication Arrangements'.",
                "STEP 4: Verify that the standard C4C OData service 'c4codata' is enabled.",
                "STEP 5: The standard SAP path for business users is: /sap/c4c/odata/v1/c4codata.",
                "STEP 6: Paste this path into the field."
            ],
            example: "/sap/c4c/odata/v1/c4codata",
            tip: "Kyra queries this service path to synchronize employee business users and provision C4C Business Roles upon approval."
        },
        "c4c_service_user": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "Service Integration User (From Scratch)",
            purpose: "A technical integration user in SAP Sales Cloud configured in Communication Systems to execute inbound OData API operations.",
            steps: [
                "STEP 1: Sign in to SAP Sales Cloud as an Administrator.",
                "STEP 2: Navigate to 'Administrator' → 'General Settings'.",
                "STEP 3: Under 'Integration', click 'Communication Systems'.",
                "STEP 4 (Create from Scratch): If no system exists for Kyra yet, click 'New'. Enter a System ID (e.g., 'KYRA_INTEGRATION'), Host Name (e.g. 'kyra.cloud'), and System Access Type 'Internet'. Click 'Save'.",
                "STEP 5: In the Communication System details, navigate to the 'System Users' tab.",
                "STEP 6: Click 'New' or 'Add' to create a technical service user (e.g. '_KYRA_SERVICE_USER').",
                "STEP 7: Copy the technical user name and paste it into this field."
            ],
            example: "_KYRA_SERVICE_USER",
            tip: "Technical service users in C4C typically begin with an underscore '_' and do not consume a named user business license."
        },
        "c4c_service_password": {
            system: "SAP Sales Cloud (C4C)",
            badgeClass: "kyraInfoBadgeSap",
            title: "Service User Password (From Scratch)",
            purpose: "The password for the technical service user in SAP Sales Cloud used for Basic Authentication.",
            steps: [
                "STEP 1: In SAP Sales Cloud, open 'Administrator' → 'General Settings' → 'Communication Systems'.",
                "STEP 2: Open your Kyra Communication System and select the 'System Users' tab.",
                "STEP 3: Select your technical service user (e.g. '_KYRA_SERVICE_USER') and click 'Edit' or 'Set Password'.",
                "STEP 4: Enter a strong password, confirm it, and set the Password Validity to 'Password Does Not Expire'.",
                "STEP 5: Save the settings and paste the password into this field."
            ],
            example: "••••••••••••••••••••••••",
            tip: "Setting 'Password Does Not Expire' prevents scheduled provisioning failures caused by unexpected password expiration."
        },

        // =========================================================================
        // IAM APPROVER 1 INTEGRATION (EMAIL & CLOUD IAM CONSOLE)
        // =========================================================================
        "iam1_provider_select": {
            system: "Multi-Cloud IAM & Governance",
            badgeClass: "kyraInfoBadgeAws",
            title: "Select IAM Provider / Platform",
            purpose: "Designates the enterprise Identity and Access Management (IAM) or Cloud Governance platform used by IAM Approver 1 to review and authorize access requests.",
            steps: [
                "Select 'Amazon Web Services (AWS IAM & Identity Center)' for AWS-native IAM, IAM Identity Center (SSO), and Systems Manager workflows.",
                "Select 'Microsoft Entra ID (Azure Active Directory & PIM)' for Azure Privileged Identity Management and Entra Governance reviews.",
                "Select 'Google Cloud Platform (GCP IAM & Privileged Access Manager)' for GCP PAM access approvals.",
                "Select 'SAP Cloud Identity Services (IAS / IAG / BTP)' for SAP Cloud Identity Access Governance and BTP role reviews.",
                "Select 'Okta Identity Governance (OIG / Access Requests)' for Okta self-service review and Slack/Teams integrated approvals.",
                "Select 'ServiceNow (Access Management & IT Service Governance)' for enterprise ITSM Change and Request workflows.",
                "Select 'SailPoint (Identity Security Cloud / IdentityIQ)' for enterprise IGA and Segregation of Duties certification.",
                "Select 'Oracle Cloud Infrastructure (OCI IAM Domains)' for Oracle Cloud access governance.",
                "Select 'CyberArk (Privileged Access Management - PAM)' for dual-authorization privileged access vaulting."
            ],
            example: "Amazon Web Services (AWS IAM & Identity Center)",
            tip: "Choosing an IAM provider automatically populates the appropriate governance engine, region, and portal URL endpoints for this approver."
        },
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
        // IAM APPROVER 2 INTEGRATION (EMAIL & CLOUD IAM CONSOLE)
        // =========================================================================
        "iam2_provider_select": {
            system: "Multi-Cloud IAM & Governance",
            badgeClass: "kyraInfoBadgeAws",
            title: "Select IAM Provider / Platform",
            purpose: "Designates the enterprise Identity and Access Management (IAM) or Cloud Governance platform used by IAM Approver 2 to review and authorize access requests.",
            steps: [
                "Select 'Amazon Web Services (AWS IAM & Identity Center)' for AWS-native IAM, IAM Identity Center (SSO), and Systems Manager workflows.",
                "Select 'Microsoft Entra ID (Azure Active Directory & PIM)' for Azure Privileged Identity Management and Entra Governance reviews.",
                "Select 'Google Cloud Platform (GCP IAM & Privileged Access Manager)' for GCP PAM access approvals.",
                "Select 'SAP Cloud Identity Services (IAS / IAG / BTP)' for SAP Cloud Identity Access Governance and BTP role reviews.",
                "Select 'Okta Identity Governance (OIG / Access Requests)' for Okta self-service review and Slack/Teams integrated approvals.",
                "Select 'ServiceNow (Access Management & IT Service Governance)' for enterprise ITSM Change and Request workflows.",
                "Select 'SailPoint (Identity Security Cloud / IdentityIQ)' for enterprise IGA and Segregation of Duties certification.",
                "Select 'Oracle Cloud Infrastructure (OCI IAM Domains)' for Oracle Cloud access governance.",
                "Select 'CyberArk (Privileged Access Management - PAM)' for dual-authorization privileged access vaulting."
            ],
            example: "Amazon Web Services (AWS IAM & Identity Center)",
            tip: "Choosing an IAM provider automatically populates the appropriate governance engine, region, and portal URL endpoints for this approver."
        },
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
        },
        "ad_provider_select": {
          "system": "Directory Services",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Select Directory Service Provider",
          "purpose": "Chooses the enterprise identity repository or directory service provider (Cloud, AWS Managed, On-Premises, or OpenLDAP) that Kyra synchronizes security groups and users from.",
          "steps": [
                    "Identify where your enterprise user directory and security access groups are hosted.",
                    "Select 'Microsoft Entra ID (Azure Active Directory)' if your enterprise uses Microsoft 365, Azure AD, or cloud-native security groups managed via Microsoft Graph API.",
                    "Select 'AWS Directory Service (AWS Managed Microsoft AD)' if your organization runs Microsoft Active Directory hosted and managed natively in Amazon Web Services (AWS).",
                    "Select 'Microsoft Active Directory Domain Services (AD DS - On-Premises)' if your corporate domain controllers run on Windows Server in your on-premises datacenter or private cloud.",
                    "Select 'OpenLDAP / FreeIPA Directory Service' if your organization uses standard Linux/Unix LDAP servers or Red Hat FreeIPA.",
                    "Selecting a provider immediately updates the configuration form below with the exact parameters and step-by-step guidance for that directory platform."
          ],
          "example": "Microsoft Entra ID (Azure Active Directory)",
          "tip": "Kyra securely queries and maps directory groups to Kyra approval personas and target roles, ensuring your existing corporate directory remains the single source of truth."
},
        "ad_azure_tenant_id": {
          "system": "Microsoft Entra ID",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Directory (Tenant) ID",
          "purpose": "Uniquely identifies your Microsoft Entra ID (Azure AD) tenant in the Microsoft Cloud. Kyra uses this GUID to route OAuth 2.0 token requests to your organization's directory instance.",
          "steps": [
                    "Open your browser and navigate to the Microsoft Entra Admin Center (https://entra.microsoft.com) or Azure Portal (https://portal.azure.com).",
                    "Sign in with your Global Administrator or Cloud Application Administrator credentials.",
                    "In the left navigation menu, expand 'Identity' and select 'Overview'.",
                    "In the 'Basic information' tile at the center of the page, locate the row labeled 'Tenant ID'.",
                    "Click the 'Copy to clipboard' icon next to the 36-character GUID.",
                    "Paste the copied Tenant ID into this field in Kyra."
          ],
          "example": "b33b5cb8-4fb1-4b19-92f6-b22cc4af8efe",
          "tip": "The Tenant ID is also visible in Azure Portal under Azure Active Directory > Overview > Tenant ID."
},
        "ad_azure_domain_fqdn": {
          "system": "Microsoft Entra ID",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Primary Domain / FQDN",
          "purpose": "The verified primary domain name or default '*.onmicrosoft.com' namespace associated with your Microsoft Entra ID tenant.",
          "steps": [
                    "In Microsoft Entra Admin Center (https://entra.microsoft.com), navigate to 'Identity' > 'Settings' > 'Domain names'.",
                    "Locate the domain marked with a green checkmark as 'Primary' (e.g., 'company.com' or 'yourtenant.onmicrosoft.com').",
                    "Copy the domain name string exactly as shown.",
                    "Paste the domain name into this field."
          ],
          "example": "bharathmohanraj12gmail.onmicrosoft.com",
          "tip": "If you have a custom domain (e.g. corp.kyra.com), enter your custom domain name. Otherwise, use your initial tenant onmicrosoft.com domain."
},
        "ad_azure_client_id": {
          "system": "Microsoft Entra ID",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Application (Client) ID",
          "purpose": "The unique identifier of the App Registration created in Microsoft Entra ID for Kyra. Authorizes Kyra to call Microsoft Graph API to read directory groups and user memberships.",
          "steps": [
                    "In Microsoft Entra Admin Center (https://entra.microsoft.com), navigate to 'Identity' > 'Applications' > 'App registrations'.",
                    "Select your registered application (e.g., 'Kyra-Access-Governance'). If not yet created, click '+ New registration', enter 'Kyra-Access-Governance', select 'Accounts in this organizational directory only', and click 'Register'.",
                    "On the application Overview page, locate 'Application (client) ID'.",
                    "Click the 'Copy to clipboard' icon next to the 36-character GUID.",
                    "Ensure the app has Microsoft Graph API Application permissions: 'GroupMember.Read.All' and 'User.Read.All', and click 'Grant admin consent'."
          ],
          "example": "6897baed-5616-4bff-bcab-8b249feea9a6",
          "tip": "Always ensure an admin has clicked 'Grant admin consent for [Tenant]' under API Permissions > Microsoft Graph, otherwise Graph API calls will return 403 Forbidden."
},
        "ad_azure_client_secret": {
          "system": "Microsoft Entra ID",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Client Secret Value",
          "purpose": "The cryptographic password/secret string used by Kyra to authenticate with Microsoft Entra ID during client credentials OAuth token exchange.",
          "steps": [
                    "In your App Registration page in Microsoft Entra Admin Center, click 'Certificates & secrets' in the left menu.",
                    "Click on the 'Client secrets' tab, then click '+ New client secret'.",
                    "Enter a description (e.g. 'Kyra Integration Secret'), choose an expiration period (e.g. 12 or 24 months), and click 'Add'.",
                    "CRITICAL: Immediately copy the value from the 'Value' column (NOT the Secret ID column). Microsoft masks this value permanently once you leave the page.",
                    "Paste the secret value into this field."
          ],
          "example": "naofJGTLH2dNzhopzCwWcWQLzfI42gWHIX2wk99vMfI=",
          "tip": "Always copy the 'Value' column, never the 'Secret ID' column. If you lose the secret, generate a new one under Certificates & secrets."
},
        "ad_azure_group_id": {
          "system": "Microsoft Entra ID",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Target AD Security Group Object ID",
          "purpose": "The unique directory Object ID (GUID) of the security group in Microsoft Entra ID whose members Kyra discovers, syncs, and governs.",
          "steps": [
                    "In Microsoft Entra Admin Center (https://entra.microsoft.com), navigate to 'Identity' > 'Groups' > 'All groups'.",
                    "Search for or click on your designated security group (e.g., 'Kyra-Access-Group').",
                    "On the group's Overview page, locate the 'Object ID' field.",
                    "Click the 'Copy to clipboard' icon next to the Object ID GUID.",
                    "Paste the Object ID into this field in Kyra."
          ],
          "example": "14740ac6-2647-4a81-b15f-009b800f7305",
          "tip": "Members added or removed from this group in Microsoft Entra ID will automatically sync to Kyra according to your configured sync frequency."
},
        "ad_azure_group_name": {
          "system": "Microsoft Entra ID",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "AD Group Display Name",
          "purpose": "The human-readable name of the target security group as defined in Microsoft Entra ID. Used for UI labels, audit logging, and access review reporting.",
          "steps": [
                    "In Microsoft Entra Admin Center, navigate to 'Identity' > 'Groups' > 'All groups'.",
                    "View the 'Group name' column for your security group.",
                    "Enter the exact display name into this field."
          ],
          "example": "Kyra-Access-Group",
          "tip": "Match the name exactly as it appears in Entra ID (e.g., 'Kyra-Access-Group' or 'KYRA_ENTERPRISE_ADMINS')."
},
        "ad_aws_directory_id": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "AWS Directory ID",
          "purpose": "The unique identifier (starting with 'd-') assigned by AWS to your AWS Managed Microsoft Active Directory or Simple AD instance.",
          "steps": [
                    "Sign in to the AWS Management Console (https://console.aws.amazon.com).",
                    "Ensure you are in the AWS Region where your directory is deployed (e.g., us-east-1 N. Virginia).",
                    "In the top search bar, type 'Directory Service' and open the AWS Directory Service console.",
                    "In the left navigation menu, click 'Directories'.",
                    "In the directories table, locate your directory (e.g., 'corp.kyra-aws.internal').",
                    "Copy the 'Directory ID' value (e.g., 'd-90671234ab').",
                    "Paste the Directory ID into this field."
          ],
          "example": "d-90671234ab",
          "tip": "AWS Directory IDs always start with the lowercase letter 'd-' followed by a 10-character hexadecimal string."
},
        "ad_aws_dns_name": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "Directory DNS Name (FQDN)",
          "purpose": "The fully qualified domain name (FQDN) configured for your AWS Managed Microsoft AD domain controllers.",
          "steps": [
                    "In the AWS Directory Service console, navigate to 'Directories'.",
                    "Click into your directory to view its Directory Details.",
                    "Locate the 'Directory DNS name' field in the Directory details section.",
                    "Copy the domain name string (e.g., 'corp.kyra-aws.internal' or 'corp.example.com').",
                    "Paste the DNS name into this field."
          ],
          "example": "corp.kyra-aws.internal",
          "tip": "This is the active Kerberos realm and DNS zone hosted by your AWS domain controllers in your AWS VPC."
},
        "ad_aws_netbios": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "AWS Directory NetBIOS Name",
          "purpose": "The short, pre-Windows 2000 NetBIOS domain name used for NT authentication and group prefixing in AWS Managed Microsoft AD.",
          "steps": [
                    "In the AWS Directory Service console, click on your directory.",
                    "In the 'Directory details' panel, locate the 'Directory NetBIOS name' field.",
                    "Copy the uppercase NetBIOS name string (e.g., 'CORP' or 'KYRA').",
                    "Paste the NetBIOS name into this field."
          ],
          "example": "CORP",
          "tip": "The NetBIOS name is typically 1 to 15 uppercase characters without dots (e.g., 'CORP', 'AWS', 'KYRA')."
},
        "ad_aws_region": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "AWS Region",
          "purpose": "The AWS geographical region where your AWS Directory Service cluster and VPC domain controllers are provisioned.",
          "steps": [
                    "Look at the top-right corner of the AWS Management Console navigation bar.",
                    "Note the selected Region code (e.g., 'N. Virginia us-east-1', 'Oregon us-west-2', 'Ireland eu-west-1', 'Mumbai ap-south-1').",
                    "Select or enter the matching AWS Region technical code into this field."
          ],
          "example": "us-east-1 (N. Virginia)",
          "tip": "Ensure your Kyra server or VPC peering route has network access to the VPC in this AWS region."
},
        "ad_aws_dns_ips": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "Directory DNS Server IP Addresses",
          "purpose": "The private VPC IP addresses of the two dedicated AWS Managed Microsoft AD domain controller nodes. Kyra connects to these IPs for LDAPS directory queries.",
          "steps": [
                    "In the AWS Directory Service console, click into your directory.",
                    "In the 'Networking & security' section, locate 'DNS addresses'.",
                    "Note the two private IPv4 addresses assigned to your domain controllers (e.g., '10.0.1.10, 10.0.2.20').",
                    "Copy both IP addresses separated by a comma and space.",
                    "Paste the IP addresses into this field."
          ],
          "example": "10.0.1.10, 10.0.2.20",
          "tip": "AWS creates two domain controllers in separate Availability Zones for high availability. Providing both ensures automatic failover."
},
        "ad_aws_service_user": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "Service Account / Admin Username",
          "purpose": "The administrative account or dedicated service account username authorized to bind to the directory and enumerate Active Directory security groups.",
          "steps": [
                    "You can use the default directory administrator account 'Admin', or create a dedicated service account in your AWS Managed Microsoft AD OU (e.g., 'svc_kyra_sync').",
                    "Ensure the service account belongs to the 'Domain Users' group with read permissions on security groups and user objects.",
                    "Enter the username into this field."
          ],
          "example": "Admin",
          "tip": "For production environments, best practice is to create a dedicated service user (e.g. 'svc_kyra_sync') rather than using the master 'Admin' account."
},
        "ad_aws_service_password": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "Service Account Password",
          "purpose": "The password for the AWS Directory Service administrator or dedicated service account used for secure LDAP bind authentication.",
          "steps": [
                    "Enter the secure password established when the AWS Directory was provisioned, or the password set for your dedicated service account in Active Directory Users and Computers.",
                    "The password is encrypted and stored securely within Kyra."
          ],
          "example": "••••••••••••••••",
          "tip": "AWS Directory Service passwords require uppercase, lowercase, numbers, and special symbols and must be at least 8 to 64 characters long."
},
        "ad_aws_group_name": {
          "system": "AWS Directory Service",
          "badgeClass": "kyraInfoBadgeAws",
          "title": "Target AD Security Group Name",
          "purpose": "The name of the security group created inside your AWS Managed Microsoft AD Organizational Unit (OU) whose members Kyra discovers and manages.",
          "steps": [
                    "Connect to an EC2 instance joined to your AWS Managed Microsoft AD domain, or open Active Directory Users and Computers (ADUC).",
                    "Navigate to your corporate OU (e.g., 'corp.kyra-aws.internal' > 'CORP' > 'Groups').",
                    "Locate or create your target security group (e.g., 'Kyra-Access-Group').",
                    "Enter the group's name into this field."
          ],
          "example": "Kyra-Access-Group",
          "tip": "Kyra will discover all members assigned to this security group and map them to their corresponding access personas."
},
        "ad_onprem_domain_fqdn": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Domain Name (FQDN)",
          "purpose": "The fully qualified corporate domain name of your on-premises Windows Server Active Directory domain (e.g. corp.kyra-enterprise.com).",
          "steps": [
                    "On a domain controller or domain-joined Windows PC, open PowerShell or Command Prompt.",
                    "Run the command: 'echo %USERDNSDOMAIN%' or '(Get-ADDomain).DNSRoot'.",
                    "Copy the returned domain FQDN and paste it into this field."
          ],
          "example": "corp.kyra-enterprise.com",
          "tip": "Ensure your network or VPN tunnel can resolve this internal DNS domain name."
},
        "ad_onprem_netbios": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "NetBIOS Domain Name",
          "purpose": "The legacy NetBIOS domain name of your on-premises Active Directory domain, used for DOWN-LEVEL logon names (DOMAIN\\Username).",
          "steps": [
                    "On a domain-joined machine, run 'echo %USERDOMAIN%' in Command Prompt.",
                    "Enter the uppercase NetBIOS name into this field."
          ],
          "example": "CORP",
          "tip": "Commonly matches the first part of your domain name (e.g. 'CORP' for 'corp.kyra-enterprise.com')."
},
        "ad_onprem_ldap_url": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Domain Controller Host / LDAPS URL",
          "purpose": "The network hostname or IP address and secure LDAPS port (636) used to establish encrypted SSL/TLS communication with your domain controller.",
          "steps": [
                    "Identify the fully qualified hostname of your primary or secondary domain controller (e.g., 'dc01.corp.kyra-enterprise.com').",
                    "Ensure TCP port 636 (LDAPS) is accessible through your firewall or VPN.",
                    "Enter the full LDAPS connection URL into this field."
          ],
          "example": "ldaps://dc01.corp.kyra-enterprise.com:636",
          "tip": "Using 'ldaps://' with port 636 guarantees that credentials and directory query results are strongly encrypted over TLS."
},
        "ad_onprem_base_dn": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Base DN (Distinguished Name)",
          "purpose": "The root Distinguished Name (DN) search base where Kyra begins scanning for users, groups, and organizational units in Active Directory.",
          "steps": [
                    "Construct the Base DN from your domain name components (e.g., 'corp.kyra-enterprise.com' becomes 'DC=corp,DC=kyra-enterprise,DC=com').",
                    "Alternatively, run '(Get-ADDomain).DistinguishedName' in Active Directory PowerShell module.",
                    "Enter the Base DN string into this field."
          ],
          "example": "DC=corp,DC=kyra-enterprise,DC=com",
          "tip": "To scope searches to a specific department or OU, you can specify an OU Base DN like 'OU=Governance,DC=corp,DC=kyra-enterprise,DC=com'."
},
        "ad_onprem_service_user": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Bind Service Account (UPN / DN)",
          "purpose": "The service account identity used to authenticate (bind) to Active Directory and execute LDAP searches.",
          "steps": [
                    "Create a dedicated service account in Active Directory (e.g. 'svc_kyra_sync').",
                    "Enter the User Principal Name (UPN) or Distinguished Name (DN) into this field.",
                    "Standard Domain User privileges are sufficient for group and member discovery."
          ],
          "example": "svc_kyra_sync@corp.kyra-enterprise.com",
          "tip": "You can format this as a UPN (svc_kyra_sync@corp.kyra-enterprise.com) or as a Distinguished Name (CN=svc_kyra_sync,OU=ServiceAccounts,DC=corp,DC=kyra-enterprise,DC=com)."
},
        "ad_onprem_service_password": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Bind Account Password",
          "purpose": "The password for the Active Directory bind service account.",
          "steps": [
                    "Enter the password configured for your bind service account in Active Directory Users and Computers.",
                    "The password is stored securely and never exposed in client logs."
          ],
          "example": "••••••••••••••••",
          "tip": "Set the service account's password to 'Password never expires' in Active Directory to prevent scheduled sync interruptions."
},
        "ad_onprem_group_name": {
          "system": "Active Directory (On-Premises)",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Target AD Security Group Name / DN",
          "purpose": "The name or Distinguished Name of the on-premises Active Directory security group containing governed users.",
          "steps": [
                    "Open Active Directory Users and Computers (dsa.msc).",
                    "Locate the target security group (e.g., 'Kyra-Access-Group' or 'KYRA_EMPLOYEES').",
                    "Enter the sAMAccountName or CN of the group into this field."
          ],
          "example": "Kyra-Access-Group",
          "tip": "Enter either the simple group name ('Kyra-Access-Group') or full DN ('CN=Kyra-Access-Group,OU=Groups,DC=corp,DC=kyra-enterprise,DC=com')."
},
        "ad_ldap_url": {
          "system": "OpenLDAP / FreeIPA",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "LDAP / LDAPS Server Host URL",
          "purpose": "The hostname and port of your OpenLDAP, 389 Directory Server, or FreeIPA directory instance.",
          "steps": [
                    "Identify your LDAP server's public or internal DNS hostname or IP address.",
                    "Specify port 636 for secure LDAPS, or port 389 with StartTLS.",
                    "Enter the connection URL."
          ],
          "example": "ldaps://ldap.corp.kyra-enterprise.com:636",
          "tip": "Always use LDAPS (port 636) to safeguard directory data in transit."
},
        "ad_ldap_base_dn": {
          "system": "OpenLDAP / FreeIPA",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Base DN (Search Base)",
          "purpose": "The starting point for LDAP search operations in your directory tree.",
          "steps": [
                    "Locate the root suffix or base DN configured in your slapd.conf or cn=config file (e.g. 'dc=kyra,dc=enterprise,dc=com').",
                    "Enter the Base DN into this field."
          ],
          "example": "dc=kyra,dc=enterprise,dc=com",
          "tip": "Case-insensitive in standard LDAP, but preserving standard lowercase is recommended."
},
        "ad_ldap_bind_dn": {
          "system": "OpenLDAP / FreeIPA",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Bind DN (Admin / Manager DN)",
          "purpose": "The Distinguished Name of the LDAP administrative entry or service account used to authenticate and read entries.",
          "steps": [
                    "Enter the full Distinguished Name for your bind account (e.g., 'cn=admin,dc=kyra,dc=enterprise,dc=com' or 'uid=kyra_sync,cn=sysaccounts,cn=etc,dc=kyra,dc=enterprise,dc=com')."
          ],
          "example": "cn=admin,dc=kyra,dc=enterprise,dc=com",
          "tip": "In FreeIPA, you can create a dedicated bind account under System Accounts."
},
        "ad_ldap_bind_password": {
          "system": "OpenLDAP / FreeIPA",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Bind Password",
          "purpose": "The password for the LDAP bind DN account.",
          "steps": [
                    "Enter the secret password for the specified bind DN."
          ],
          "example": "••••••••••••••••",
          "tip": "The password is used solely for initial authenticated bind requests."
},
        "ad_ldap_filter": {
          "system": "OpenLDAP / FreeIPA",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "User & Group Search Filter",
          "purpose": "Standard RFC 4515 LDAP search filter used to identify active users and group members.",
          "steps": [
                    "Specify an LDAP search filter matching your schema object classes (e.g. 'inetOrgPerson', 'posixGroup', or 'groupOfNames').",
                    "Enter the filter syntax."
          ],
          "example": "(&(objectClass=inetOrgPerson)(memberOf=cn=kyra-access-group,ou=groups,dc=kyra,dc=enterprise,dc=com))",
          "tip": "Use standard LDAP filter syntax: '(&(objectClass=inetOrgPerson)(status=active))'."
},
        "ad_ldap_group_name": {
          "system": "OpenLDAP / FreeIPA",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Target Group Name / DN",
          "purpose": "The CN or Distinguished Name of the target group in OpenLDAP / FreeIPA.",
          "steps": [
                    "Identify the target group in your LDAP tree (e.g. 'cn=kyra-access-group,ou=groups,dc=kyra,dc=enterprise,dc=com').",
                    "Enter the group name or full DN."
          ],
          "example": "kyra-access-group",
          "tip": "Kyra reads the 'member' or 'memberUid' attribute of this entry to discover group membership."
},
        "ad_sync_interval": {
          "system": "Directory Services",
          "badgeClass": "kyraInfoBadgeSap",
          "title": "Directory Synchronization Frequency",
          "purpose": "Defines the polling schedule on which Kyra connects to your directory provider to detect newly added or removed users and security group membership changes.",
          "steps": [
                    "Select 'Every 15 Minutes' for rapid updates when onboarding or offboarding employees frequently.",
                    "Select 'Every 30 Minutes' or 'Every 1 Hour' for balanced enterprise directory sync with minimal network overhead.",
                    "Select 'Real-time Webhook Sync' if your cloud identity provider supports Microsoft Graph Change Notifications or AWS EventBridge webhooks."
          ],
          "example": "Every 15 Minutes",
          "tip": "You can also manually trigger an instant synchronization at any time using the 'Sync Groups Now' button on Page 2."
},
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
