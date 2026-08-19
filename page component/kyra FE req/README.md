# KYRA Frontend Add Access Multi-Slide Request System (`kyra FE req`)

## Overview
This folder contains the complete, enterprise-grade Frontend implementation for the **KYRA Add Access** request workflow. It includes all slides, interactive maps, sequential system configuration wizards, conflict analysis, and final audit summary pages.

---

## 📑 Slide & Step Architecture

### **Slide 1 / Step 1: Enterprise Scope Selection**
- **Business Sector** (`sap.m.ComboBox` with clean native placeholder)
- **Business Function** (`sap.m.ComboBox` dynamically loaded per sector)
- Actions: `Cancel`, `Next (Step 2)`

### **Slide 2 / Step 2: Operating Region Map Selection**
- Interactive SVG/Image-based Global Map with clickable geolocation pins.
- **Select All Regions** batch toggle button.
- Live **Selected Regions** chip list with real-time removal buttons.
- Validation blocking progression if no region is selected.
- Actions: `Back to Step 1`, `Cancel`, `Next (Step 3)`

### **Slide 3 / Step 3.1: Sequential Target System Slides & Process Configuration**
- **Target Systems MultiComboBox**: Select one or multiple target platforms (`SAP BTP`, `SAP S/4HANA`, `KYRA Central Governance`, `Active Directory`, etc.).
- **Per-System Slide Wizard**: Iterates through each selected system sequentially (`Slide 1 of N`).
  - **Service / Topic**: Multi-select topics (`System Administrator`, `System Owners`, `Stakeholders`).
  - **Team Role**: Dynamically filtered roles based on selected topics.
  - **Assigned Persona**: Required persona selection mapped to chosen roles.
- Actions: `Previous System Slide`, `Next System Slide`, `Submit System Configs & Set Duration`.

### **Slide 4 / Step 3.2: Access Duration & Business Justification**
- **Access Duration** (`sap.m.ComboBox`): `Permanent (Default)`, `30 Days (Temporary)`, `90 Days (Project)`.
- **Business Justification** (`sap.m.TextArea`): Required detailed justification text.
- Actions: `Back to System Slides`, `Cancel`, `Proceed to Summary`.

### **Slide 5 / Step 4.1: Access Validation & Threshold Limits**
- **Threshold Limits Card**: Evaluates excessive permission percentages per sector.
- **Restricted Records Card**: Audits restricted position and security group bindings.
- **Duplicate Roles Card**: Checks for redundant functional roles.
- Actions: `< Back to Duration`, `Cancel`, `Continue (SoD Review)`.

### **Slide 6 / Step 4.2: Segregation of Duties (SoD) Conflict Review**
- Segregation of Duties matrix comparing requested target roles against existing permissions.
- Existing vs. New access conflict toggle.
- Actions: `Previous`, `Cancel`, `Continue (Review & Summary)`.

### **Slide 7 / Step 5: Access Request Review & Summary**
- **Top Governance Metadata Card**: Displays Requester ID, Business Sector, Business Function, Operating Region, Access Duration, and Business Justification.
- **Configured Entitlements Tables**: Grouped by target system.
  - Displays Request ID, Service Topic, Role Title, Assigned Persona, Access Duration, and Status.
  - **Edit Configuration**: Allows updating existing entitlements without creating duplicate rows.
  - **Delete Configuration**: Soft-deletes rows with confirmation dialog.
- Actions: `Back to Config`, `Cancel`, `Submit Request to Database`.

### **Slide 8 / Submission Modal Confirmation (`KyraDialog.show`)**
- Rich popup displaying:
  - **Request ID** badge (`REQ-2026-XXXXXX`)
  - **Target System** pill tag
  - **Role Title & Service Topic**
  - **Assigned Persona** badge (`👤 Persona`)
  - Status pill (`✔ Submitted` / `ℹ Already Configured`)

---

## 🛠️ Files Included
1. `KyraAddAccess.view.xml` - Complete SAPUI5 XML View containing all wizard slides.
2. `KyraAddAccess.controller.js` - Complete SAPUI5 Controller with state machine & event handlers.
3. `style.css` - Enterprise CSS theme and responsive card styling.
4. `index.html` - Standalone HTML preview to run and inspect the slides.
