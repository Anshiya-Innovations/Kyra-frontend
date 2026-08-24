# KYRA Enterprise Self-Contained User Access Management Portal Component

This folder contains all necessary files for the **KYRA Enterprise User Access Management Portal Page** packaged as a self-contained, modular component.

## Folder Contents
- `AccessPage.view.xml`: SAP Fiori Horizon XML View with ShellBar header, welcome banner card, and 4 access sectors (**Add Access**, **Remove Access**, **My Access**, **My Requests**).
- `AccessPage.controller.js`: Controller handling dynamic role categorization (*System Administrator*, *System Owners*, *Stakeholders*), SubRoles mapping, addition request workflows, revocation requests, search filtering, and details dialogs.
- `style.css`: SAP Fiori Horizon enterprise CSS styling with HSL color variables and 44px height controls.
- `i18n.properties`: Internationalization text key bindings.

## Included Access Sectors
1. **Add Access**: Request or grant new system entitlements with automatic approval routing.
2. **Remove Access**: Revoke or initiate removal of active access entitlements.
3. **My Access**: Searchable directory of all active granted system roles.
4. **My Requests**: Real-time status tracking audit log for submitted addition and revocation requests.
