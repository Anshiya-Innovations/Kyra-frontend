# 🛡️ KYRA Enterprise Identity & Access Management (IAM) Portal
## Developer Handoff Documentation & Complete Technical Guide

---

### 📌 1. Project Overview & Architecture

The **KYRA Enterprise Identity & Access Management Portal** is a modern, high-performance security SaaS platform designed for requesting, reviewing, and governing enterprise system permissions across multi-cloud environments (SAP S/4HANA, SAP BTP, Active Directory / IAM, KYRA Governance, Ariba, SuccessFactors).

While connected to an **SAP CAP OData V4 backend**, the frontend has been completely redesigned into a **Modern Enterprise IAM SaaS Interface** inspired by Linear, Stripe Dashboard, and Vercel.

---

### 📁 2. Unified Folder Structure

```
kyra_frontend_New/
├── webapp/                                 # SAP UI5 Frontend Application
│   ├── Component.js                        # Root Component & Global Model Initialization
│   ├── manifest.json                       # App Descriptor, Routing & OData Models
│   ├── index.html                          # Local Test Entry Point
│   ├── css/
│   │   └── style.css                       # SaaS Design System (Dark Sidebar, Main Card, Stepper, Tables)
│   ├── page component/
│   │   ├── User Access Management Portal page/
│   │   │   ├── AccessPage.view.xml         # 5-Step Access Creation Wizard & User Portal
│   │   │   └── AccessPage.controller.js    # Step Logic, Self/Someone Else Flow, Edit Return Flow
│   │   └── Approver/
│   │       ├── Approver.view.xml           # Approver Dashboard & Pending/Processed History Log
│   │       ├── Approver.controller.js      # Reload/Merge Requests, Processed History Toggle
│   │       ├── ApproverDetail.view.xml     # Detailed Request Governance Review & Entitlement Tables
│   │       └── ApproverDetail.controller.js # Decision Submission, Accept All / Reject All Command Boxes
├── db/                                     # Database CDS Schemas
│   └── schema.cds                          # Data Models (Requests, Entitlements, Decisions)
├── srv/                                    # CAP OData V4 Services
│   ├── cat-service.cds                     # Service Endpoint Declarations
│   └── cat-service.js                      # Custom Handler & Decision Endpoint Logic
├── region/                                 # Interactive SVG World Region Map Component
├── ui5.yaml                                # UI5 Tooling Configuration & Proxy Middleware
├── ui5-local.yaml                          # Local Mock / Dev Server Configuration
└── package.json                            # Unified Dependencies & Dev Scripts
```

---

### 🚀 3. Quick Start Guide for Developers

#### Step 1: Install Project Dependencies
Run the following command in the root `kyra_frontend_New` folder:
```bash
npm install
```

#### Step 2: Start the CDS Backend Server (Terminal 1)
```bash
npx cds watch
```
*(Runs CAP OData V4 server at `http://localhost:4004`)*

#### Step 3: Start the UI5 Dev Server (Terminal 2)
```bash
npm start
```
*(Opens UI5 Portal at `http://localhost:8080/test/flp.html#app-preview`)*

---

### ⚙️ 4. Key Workflows & Implementation Highlights

#### A. User Access Request Creation Wizard (5 Steps)
- **Step 1: Scope & User Selection**: Select Self or Someone Else, search user directory.
- **Step 2: Operating Region & Type**: Interactive World Map region selection, Add Access / Remove Access.
- **Step 3: Target Systems & Entitlements Configuration**: Sequential Target System slides, Team Roles, Personas, Access Duration, Business Justification.
- **Step 4: Conflict Analysis & Access Validation**:
  - **Slide 1**: Access Validation (Threshold Limits, Restricted Records, Duplicate Roles summary cards).
  - **Slide 2**: Segregation of Duties (SoD) Conflict Review matrix.
- **Step 5: Review & Final Submission**: Enterprise Scope summary, configured entitlements tables, and final submission.

#### B. Edit Configuration & Direct Return Flow
- Clicking **`Edit Configuration`** on Step 5 Summary sets `/isEditingFromSummary = true` and opens the target system slide in Step 3.
- During Edit Mode (`isEditingFromSummary === true`), only the **`✓ OK`** button is displayed.
- Clicking **`✓ OK`** saves the updated configuration and returns **DIRECTLY** to Step 5 Summary Page without intermediate step navigation.

#### C. Approver Governance & Processed History Box
- **Pending Requests Queue**: Displays incoming access requests awaiting governance review.
- **Processed Approval History Box**: Toggleable via `[ 📜 Processed History (N) ]` button on `Approver.view.xml`. Historical decisions are merged with `localStorage` (`kyra_processed_requests`) and persist without auto-deletion.
- **Command Box for Batch Actions**:
  - Clicking **`Accept All Requests`** opens a comment dialog (`"Approved - All entitlements compliant with security policies"`).
  - Clicking **`Reject All Requests`** opens a reason dialog (`"Rejected - Segregation of duties conflict or risk non-compliance"`).
  - Submitting a request with unselected entitlements automatically defaults remaining pending rows to Approved without blocking warning popups.

---

### 📡 5. Backend Integration & OData API Endpoints

- **GET `/odata/v4/auth/Requests`**: Fetches pending and processed access requests.
- **POST `/odata/v4/auth/submitAccessDecision`**: Submits final approval/rejection decision payload:
```json
{
  "requestNumber": "REQ-2026-8910",
  "decisions": [
    {
      "requestNumber": "REQ-2026-8910",
      "targetSystem": "SAP S/4HANA Enterprise",
      "roleName": "Financial Auditing",
      "selectedPersona": "Regulatory Compliance Officer Persona",
      "status": "APPROVED"
    }
  ]
}
```

---

### 👥 Handed Off To Developer Team
All files are consolidated in **`kyra_frontend_New`** ready for deployment, git commit, or sharing!
