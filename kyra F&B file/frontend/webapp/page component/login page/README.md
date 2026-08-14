# KYRA Enterprise Self-Contained Admin Portal Login Component

This folder contains all essential files for the **KYRA Enterprise Admin Portal Login Page** packaged as a reusable, modular component.

## Folder Contents
- `Login.view.xml`: SAP Fiori Horizon XML View with centered card, shield avatar, Admin Role dropdown, dynamic Roles dropdown, clean labels (no asterisks), password toggle, support info, and footer.
- `Login.controller.js`: SAPUI5 Controller handling dynamic SubRoles mapping for System Administrator, System Owners, and Stakeholders, input validation, error handling, reset password dialog, and routing to Admin Console.
- `style.css`: Complete SAP Fiori Horizon styling with crisp HSL color variables, 44px height controls, and vibrant solid SAP Blue (`#0066E8`) Sign In button.
- `i18n.properties`: Internationalization text key bindings.

## Dynamic Roles Breakdown

### 1. System Administrator
- **IT Developers**
- **IT Administrators**
- **Lead Engineer**
- **IT Security**

### 2. System Owners
- **Technical Product Owner**
- **Product Group Engineer**

### 3. Stakeholders
- **Business Product Owner**
- **Line Manager**
- **Compliance Manager**
- **Role Owner**
- **ISRM**
- **IAM / GRC Team**
