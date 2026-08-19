# KYRA Frontend-SK

Official, production-ready SAP Fiori Horizon Light Theme User Access Management Portal frontend package.

---

## 📁 Package Structure

```text
KYRA Frontend-SK/
├── webapp/
│   ├── Component.js
│   ├── manifest.json
│   ├── index.html
│   ├── css/
│   │   └── style.css                                       # Master Light Theme & Custom Controls CSS
│   ├── i18n/
│   │   └── i18n.properties                                 # Internationalization strings
│   ├── images/                                             # Portal assets & diagrams
│   ├── model/
│   │   ├── models.js
│   │   └── KyraDialog.js                                   # Custom Dialog Helpers
│   ├── page component/
│   │   ├── login page/                                     # Login View & Controller
│   │   ├── User Access Management Portal page/             # Main Access & History Portal View & Controller
│   │   ├── Add access/                                     # Add Access Request Wizard View & Controller
│   │   ├── Add Access Business Sector Page/                # Sector Selection View & Controller
│   │   ├── Approver/                                       # Approver Dashboard & Details Views & Controllers
│   │   └── region/                                         # Global Regions Map Component
│   └── test/
├── ui5.yaml
├── ui5-local.yaml
├── package.json
└── README.md
```

---

## 🚀 How to Run the Frontend

### 1. Prerequisites
- **Node.js**: LTS version (Node 18+ or 20+ recommended)
- **NPM**: standard npm installed with Node.js

### 2. Installation
Open your terminal in the `KYRA Frontend-SK` directory and run:

```bash
npm install
```

### 3. Start Local Development Server
To start the SAP Fiori launchpad preview server with live reloading:

```bash
npm start
```
*Or using the local config:*
```bash
npm run start-local
```

### 4. Access the Application in Browser
The portal will be hosted locally at:
👉 **`http://localhost:8080/test/flp.html#app-preview`**

---

## 🌟 Features Included in this Build
- **Persona-Based Login**: Requester, Compliance Reviewer, Approver.
- **My Access Dashboard**: Active role entitlements, search, filter, and detailed audit summaries.
- **My History & Audit Log**: KPI statistics cards, real-time request tracking, and audit log export.
- **Add Access 3-Step Wizard**: System, Business Sector, and Role selection with justification validation.
- **Profile & Notification Popovers**: 1:1 modern web popup with vertical scrolling and quick actions.
- **Sign Out Confirmation Dialog**: Modern modal dialog with cancel and confirmed sign-out flows.
