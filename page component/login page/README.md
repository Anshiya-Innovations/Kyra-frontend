# KYRA Enterprise Login Page Component

This folder (`Kyra/page component/login page/`) contains all self-contained files, controls, views, controllers, styles, and i18n text bundles for the **KYRA Enterprise SAP Fiori Horizon Login Page**.

## Component File Structure

```
c:\Users\abcom\OneDrive\Desktop\kyra frontend\Kyra\page component\login page\
├── Login.view.xml        # Complete SAPUI5 XML View declaration
├── Login.controller.js   # SAPUI5 Controller managing state & event handlers
├── style.css             # SAP Fiori Horizon CSS tokens & design rules
├── i18n.properties       # Multilingual text keys and labels
└── README.md             # Integration & architecture guide
```

## Features Included
1. **SAP Fiori Horizon Design**: Built with official SAP Horizon theme colors (`#0A6ED1` SAP Blue, `#F5F7FA` light background).
2. **Two Separate Mode Buttons**: `[ 👤 Employee ]` & `[ 🛡 Administrator ]` rectangular buttons with interactive blue fill selection.
3. **High-Visibility Input Fields**: 44px height inputs with integrated trailing icons (`sap-icon://customer` & password reveal toggle).
4. **Empty Initial Field State**: Placeholders *"Enter Employee ID"* / *"Enter Administrator ID"* are clearly displayed.
5. **Interactive Actions**: Emphasized Sign In button, Remember Me checkbox, Password Reset Dialog, IT Support box (`support@kyraenterprise.com`), and version footer.

## How to Use / Integrate
1. Place this `login page` folder into your project under `webapp/pages/`.
2. Map the route target in `webapp/manifest.json`:
   ```json
   "targets": {
     "Login": {
       "id": "Login",
       "name": "login.Login"
     }
   }
   ```
3. Include `style.css` in your application manifest `resources.css` array.
