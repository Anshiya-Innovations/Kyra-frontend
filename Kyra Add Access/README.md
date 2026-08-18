# 🚀 Kyra Add Access — Unified Developer Component

A complete, self-contained single-component module for the **KYRA Enterprise Access Management Portal**. It combines all 5 wizard slides, interactive region map pins, dynamic persona configurations, SoD conflict validation, multi-target summary tables, and PostgreSQL database synchronization into one unified developer component.

---

## 📂 Folder Location

```
c:\Users\abcom\OneDrive\Desktop\kyra bharath f&b\kyra F&B file\Kyra Add Access\
├── KyraAddAccessComponent.js   # Standalone Unified Component (Single File)
└── README.md                   # Developer API & Integration Documentation
```

Also available in the UI5 app namespace:
```
frontend/webapp/page component/Kyra Add Access/
```

---

## 🌟 Included Slides & Flow Architecture

1. **Step 1: Enterprise Scope Selection**
   - Business Sector & Business Function `ComboBox` selections with native placeholders.
   - Dynamic cascaded function list per sector.

2. **Step 2: Interactive World Map Region Selection**
   - SVG interactive pins across North America, South America, Europe, Africa, Asia, Australia.
   - Live chip badges, "Select All Regions" toggle, and unselected validation.

3. **Step 3: Target System Configuration & Duration/Justification**
   - **Sub-step 3.1: Sequential System Slides**
     - Target System `MultiComboBox`
     - Per-system slide carousel (*Target System Slide X of Y*)
     - Cascading `Service / Topic` ➔ `Team Role` ➔ `Assigned Persona`
   - **Sub-step 3.2: Access Duration & Business Justification**
     - Duration selection (`Permanent`, `30 Days`, `90 Days`)
     - Business justification text area.

4. **Step 4: Conflict Analysis & Governance Validation**
   - **Slide 4.1**: Threshold Limits, Restricted Records & Duplicate Roles validation.
   - **Slide 4.2**: Segregation of Duties (SoD) Conflict Review with live persona conflict matrix.

5. **Step 5: Master Entitlement Summary & Review**
   - Top Scope & Governance Metadata Banner (`Requester ID`, `Sector`, `Function`, `Region`, `Duration`, `Justification`).
   - Separate per-system 7-column entitlement cards (`Request ID`, `Topic`, `Role Title`, `Assigned Persona`, `Duration`, `Status`, `Delete Action`).
   - Bidirectional edit & delete synchronization.

6. **Database Persistence & Success Dialog**
   - Synchronizes requests directly to `/odata/v4/auth/submitAccessRequest`.
   - Displays enterprise `KyraDialog` success modal with structured cards, target system tags, and persona badges.
