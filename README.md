# KYRA - Intelligent Identity & Access Governance (Frontend)

This folder contains the complete, standalone, production-ready frontend for **KYRA**. It is fully pre-configured for **GitHub Pages** static deployment and can also run locally using any web server.

---

## 🚀 How to Run Locally

You can run this frontend locally using any of the simple options below:

### Option 1: Using Node.js / NPM (Recommended)
Open a terminal in this folder (`Kyra git-deploy`) and run:
```bash
npx serve -s . -l 8080
```
or
```bash
npm start
```
Then open your browser at: **`http://localhost:8080`**

---

### Option 2: Using Python
If you have Python installed, run:
```bash
python -m http.server 8080
```
Then open your browser at: **`http://localhost:8080`**

---

### Option 3: Using VS Code Live Server
1. Open this folder (`Kyra git-deploy`) in VS Code.
2. Right-click on `index.html` and select **"Open with Live Server"**.

---

## 🌐 How to Deploy on GitHub Pages

Deploying this frontend to GitHub Pages takes less than 2 minutes:

### Step 1: Initialize Git in this folder
Open PowerShell or Git Bash inside `C:\Users\bhara\Desktop\Kyra git-deploy`:
```bash
git init
git add .
git commit -m "Initial commit for KYRA GitHub Pages deployment"
```

### Step 2: Create a new GitHub Repository
1. Go to [GitHub](https://github.com/new) and create a new public repository (e.g., `kyra-access-governance`).
2. Do **not** check "Add a README file" or ".gitignore" when creating it.

### Step 3: Push your code to GitHub
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY-NAME>.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your GitHub Repository in your browser.
2. Click **Settings** (top tab) ➔ **Pages** (in the left sidebar under Code and automation).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: Select `main` and folder `/ (root)`
   - Click **Save**.
4. Within 1–2 minutes, GitHub will publish your site at:
   **`https://<YOUR-USERNAME>.github.io/<YOUR-REPOSITORY-NAME>/`**

---

## 📁 Key Features Included
- **Login Portal**: Seamless authentication with multiple personas (Requester, Approver, System Administrator, Stakeholders).
- **User Access Management Portal**: Complete overview with KPI metric tiles, Active Entitlements, Pending Requests, and Request History.
- **Region Map**: Interactive regional access selection.
- **5-Step Add Access Wizard**:
  - Step 1: System Selection
  - Step 2: Service & Sub-Role Configuration
  - Step 3: Operating Region & Persona Configuration
  - Step 4: Access Validation & Segregation of Duties (SoD) Conflict Review (Slide 1: Thresholds, Restricted, Duplicates; Slide 2: Active, Pending, and Intra-Role SoD Review)
  - Step 5: Summary & Request Submission
- **Standalone Offline/CDN Ready**: Fully functional without requiring a local SAP CAP backend server.
