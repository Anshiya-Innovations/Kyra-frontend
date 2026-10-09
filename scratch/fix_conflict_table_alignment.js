const fs = require('fs');
const path = require('path');

console.log('--- Applying Custom Conflict Table Alignment Fix (Matching Business Sectors) ---');

// 1. Replacement for the old conflict table CSS block (around line 49795)
const oldConflictCssBlockRegex = /\/\* ========================================================================== \*\/\s*\/\* CUSTOM CONFLICT TABLE: SIMPLE FIRST ROW & COLUMN LINES \+ STRAIGHT ALIGN\s*\*\/[\s\S]*?\/\* Row Actions & Status \*\/[\s\S]*?#adminCustomConflictsTable \.kyraAdminRowActionGroup \{[\s\S]*?margin: 0 auto !important;\s*\}/;

const newConflictCssBlock = `/* ========================================================================== */
/* CUSTOM CONFLICT TABLE: CLEAN STYLING MATCHING BUSINESS SECTORS (NO VERTICAL LINES) */
/* ========================================================================== */
.kyraAdminConflictTable,
#adminCustomConflictsTable,
html body .sapMList.kyraAdminConflictTable,
html body #adminCustomConflictsTable {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    background: #FFFFFF !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03) !important;
    margin-top: 8px !important;
}

.kyraAdminConflictTable table,
.kyraAdminConflictTable .sapMListUl,
#adminCustomConflictsTable table,
#adminCustomConflictsTable .sapMListUl {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    width: 100% !important;
}

/* 1. Header: Clean F8FAFC Background, 1.5px Bottom Border, NO Vertical Lines */
.kyraAdminConflictTable thead,
.kyraAdminConflictTable thead tr,
.kyraAdminConflictTable .sapMListTblHeader,
#adminCustomConflictsTable thead,
#adminCustomConflictsTable thead tr,
#adminCustomConflictsTable .sapMListTblHeader {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-bottom: 1.5px solid #E2E8F0 !important;
}

.kyraAdminConflictTable th,
.kyraAdminConflictTable .sapMListTblHeaderCell,
#adminCustomConflictsTable th,
#adminCustomConflictsTable .sapMListTblHeaderCell {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    padding: 13px 16px !important;
    vertical-align: middle !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: 1.5px solid #E2E8F0 !important;
    box-sizing: border-box !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    color: #1E293B !important;
    text-transform: uppercase !important;
}

/* 2. Data Cells: Clean White Background, 1px Horizontal Border, NO Vertical Lines */
.kyraAdminConflictTable td,
.kyraAdminConflictTable .sapMListTblCell,
#adminCustomConflictsTable td,
#adminCustomConflictsTable .sapMListTblCell {
    padding: 14px 16px !important;
    vertical-align: middle !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: 1px solid #F1F5F9 !important;
    box-sizing: border-box !important;
    background: #FFFFFF !important;
    color: #334155 !important;
    font-size: 13.5px !important;
}

.kyraAdminConflictTable .kyraAdminTableRow,
#adminCustomConflictsTable .kyraAdminTableRow {
    min-height: 52px !important;
    height: auto !important;
    transition: background-color 0.15s ease !important;
}

.kyraAdminConflictTable .kyraAdminTableRow:hover td,
.kyraAdminConflictTable .kyraAdminTableRow:hover .sapMListTblCell,
.kyraAdminConflictTable tbody tr:hover td,
.kyraAdminConflictTable tbody .sapMListTblRow:hover td,
#adminCustomConflictsTable .kyraAdminTableRow:hover td,
#adminCustomConflictsTable .kyraAdminTableRow:hover .sapMListTblCell,
#adminCustomConflictsTable tbody tr:hover td,
#adminCustomConflictsTable tbody .sapMListTblRow:hover td {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
}

/* 3. Text Columns (1, 2, 3, 4): STRICT LEFT-ALIGNMENT matching Business Sectors */
#adminCustomConflictsTable th:nth-child(1) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(2) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(3) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(4) .sapMColumnHeaderContent,
.kyraAdminConflictTable th:nth-child(1) .sapMColumnHeaderContent,
.kyraAdminConflictTable th:nth-child(2) .sapMColumnHeaderContent,
.kyraAdminConflictTable th:nth-child(3) .sapMColumnHeaderContent,
.kyraAdminConflictTable th:nth-child(4) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: flex-start !important;
    align-items: center !important;
    text-align: left !important;
    width: 100% !important;
}

#adminCustomConflictsTable th:nth-child(1) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(2) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(3) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(4) .kyraAdminColHeader,
.kyraAdminConflictTable th:nth-child(1) .kyraAdminColHeader,
.kyraAdminConflictTable th:nth-child(2) .kyraAdminColHeader,
.kyraAdminConflictTable th:nth-child(3) .kyraAdminColHeader,
.kyraAdminConflictTable th:nth-child(4) .kyraAdminColHeader {
    text-align: left !important;
    margin: 0 !important;
    display: block !important;
}

#adminCustomConflictsTable td:nth-child(1),
#adminCustomConflictsTable td:nth-child(2),
#adminCustomConflictsTable td:nth-child(3),
#adminCustomConflictsTable td:nth-child(4),
.kyraAdminConflictTable td:nth-child(1),
.kyraAdminConflictTable td:nth-child(2),
.kyraAdminConflictTable td:nth-child(3),
.kyraAdminConflictTable td:nth-child(4) {
    text-align: left !important;
    vertical-align: middle !important;
}

#adminCustomConflictsTable td:nth-child(1) .kyraAdminCellBold,
#adminCustomConflictsTable td:nth-child(2) .kyraAdminCellBold,
#adminCustomConflictsTable td:nth-child(3) .kyraAdminCellBold,
#adminCustomConflictsTable td:nth-child(4) .kyraAdminCellText,
.kyraAdminConflictTable td:nth-child(1) .kyraAdminCellBold,
.kyraAdminConflictTable td:nth-child(2) .kyraAdminCellBold,
.kyraAdminConflictTable td:nth-child(3) .kyraAdminCellBold,
.kyraAdminConflictTable td:nth-child(4) .kyraAdminCellText {
    text-align: left !important;
    display: block !important;
    width: 100% !important;
    margin: 0 !important;
}

/* 4. Column 5 (STATUS): Perfectly Centered Header & Pill matching Business Sectors */
#adminCustomConflictsTable th:nth-child(5) .sapMColumnHeaderContent,
.kyraAdminConflictTable th:nth-child(5) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    width: 100% !important;
}

#adminCustomConflictsTable th:nth-child(5) .kyraAdminColHeader,
.kyraAdminConflictTable th:nth-child(5) .kyraAdminColHeader {
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

#adminCustomConflictsTable td:nth-child(5),
.kyraAdminConflictTable td:nth-child(5) {
    text-align: center !important;
    vertical-align: middle !important;
}

#adminCustomConflictsTable td:nth-child(5) .kyraAdminStatusPill,
.kyraAdminConflictTable td:nth-child(5) .kyraAdminStatusPill {
    margin: 0 auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
}

/* 5. Column 6 (ACTIONS): Perfectly Centered Header & Buttons matching Business Sectors */
#adminCustomConflictsTable th:nth-child(6) .sapMColumnHeaderContent,
.kyraAdminConflictTable th:nth-child(6) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    width: 100% !important;
}

#adminCustomConflictsTable th:nth-child(6) .kyraAdminColHeader,
.kyraAdminConflictTable th:nth-child(6) .kyraAdminColHeader {
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

#adminCustomConflictsTable td:nth-child(6),
.kyraAdminConflictTable td:nth-child(6) {
    text-align: center !important;
    vertical-align: middle !important;
}

#adminCustomConflictsTable td:nth-child(6) .kyraAdminRowActionGroup,
.kyraAdminConflictTable td:nth-child(6) .kyraAdminRowActionGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    margin: 0 auto !important;
    width: 100% !important;
}

#adminCustomConflictsTable .kyraAdminSystemEditBtn,
#adminCustomConflictsTable .kyraAdminSystemDeleteBtn {
    margin: 0 !important;
}

#adminCustomConflictsTable .kyraAdminSystemEditBtn .sapMBtnInner,
#adminCustomConflictsTable .kyraAdminSystemDeleteBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    box-sizing: border-box !important;
}

/* 6. Add Conflict Button: 36px Height matching Search Field */
.kyraAdminAddConflictTopBtn,
.kyraAdminAddConflictTopBtn.sapMBtn,
.sapMBtn.kyraAdminAddConflictTopBtn {
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    margin: 0 !important;
    padding: 0 !important;
    vertical-align: middle !important;
    display: inline-flex !important;
    align-items: center !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
}

.kyraAdminAddConflictTopBtn .sapMBtnInner,
.kyraAdminAddConflictTopBtn.sapMBtn .sapMBtnInner,
.sapMBtn.kyraAdminAddConflictTopBtn .sapMBtnInner {
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    line-height: 34px !important;
    padding: 0 16px !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    white-space: nowrap !important;
}`;

// Additional tail append to guarantee precedence
const tailAddition = `
/* ==========================================================================
   FINAL OVERRIDE: CUSTOM CONFLICT TABLE ALIGNMENT (MATCHES BUSINESS SECTORS)
   ========================================================================== */
#adminCustomConflictsTable,
.kyraAdminConflictTable {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border-radius: 12px !important;
    border: 1px solid #E2E8F0 !important;
    overflow: hidden !important;
}

#adminCustomConflictsTable th,
#adminCustomConflictsTable td,
.kyraAdminConflictTable th,
.kyraAdminConflictTable td {
    border-left: none !important;
    border-right: none !important;
}

#adminCustomConflictsTable th:nth-child(1),
#adminCustomConflictsTable th:nth-child(2),
#adminCustomConflictsTable th:nth-child(3),
#adminCustomConflictsTable th:nth-child(4),
#adminCustomConflictsTable td:nth-child(1),
#adminCustomConflictsTable td:nth-child(2),
#adminCustomConflictsTable td:nth-child(3),
#adminCustomConflictsTable td:nth-child(4) {
    text-align: left !important;
}

#adminCustomConflictsTable th:nth-child(1) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(2) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(3) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(4) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(1) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(2) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(3) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(4) .kyraAdminColHeader,
#adminCustomConflictsTable td:nth-child(1) .kyraAdminCellBold,
#adminCustomConflictsTable td:nth-child(2) .kyraAdminCellBold,
#adminCustomConflictsTable td:nth-child(3) .kyraAdminCellBold,
#adminCustomConflictsTable td:nth-child(4) .kyraAdminCellText {
    text-align: left !important;
    justify-content: flex-start !important;
    display: block !important;
    margin: 0 !important;
}

#adminCustomConflictsTable th:nth-child(5),
#adminCustomConflictsTable th:nth-child(6),
#adminCustomConflictsTable td:nth-child(5),
#adminCustomConflictsTable td:nth-child(6) {
    text-align: center !important;
}

#adminCustomConflictsTable th:nth-child(5) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(6) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
}

#adminCustomConflictsTable th:nth-child(5) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(6) .kyraAdminColHeader {
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

#adminCustomConflictsTable td:nth-child(5) .kyraAdminStatusPill {
    margin: 0 auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

#adminCustomConflictsTable td:nth-child(6) .kyraAdminRowActionGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    margin: 0 auto !important;
}
`;

const cssFiles = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    if (oldConflictCssBlockRegex.test(content)) {
        content = content.replace(oldConflictCssBlockRegex, newConflictCssBlock);
        console.log('Replaced old conflict CSS block in:', file);
    } else {
        console.log('Old conflict block not matched by regex in:', file);
    }

    content += '\n' + tailAddition;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Appended final override to:', file);
});

// Update XML files
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml',
    'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
    'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
    'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
    'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let xml = fs.readFileSync(file, 'utf8');

    // 1. Update columns in adminCustomConflictsTable:
    // 14%, 22%, 22%, 24%, 9%, 9%
    const oldColumnsRegex = /<Table\s+id="adminCustomConflictsTable"[\s\S]*?<columns>[\s\S]*?<\/columns>/;
    const newColumns = `<Table
                                id="adminCustomConflictsTable"
                                items="{accessModel>/adminCustomConflicts}"
                                fixedLayout="true"
                                class="sapUiNoMargin kyraAdminCleanTable kyraAdminConflictTable">
                                <columns>
                                    <Column width="14%" hAlign="Begin"><Text text="TARGET SYSTEM" class="kyraAdminColHeader" /></Column>
                                    <Column width="22%" hAlign="Begin"><Text text="PRIMARY TEAM / PERSONA" class="kyraAdminColHeader" /></Column>
                                    <Column width="22%" hAlign="Begin"><Text text="CONFLICTING TEAM / PERSONA" class="kyraAdminColHeader" /></Column>
                                    <Column width="24%" hAlign="Begin"><Text text="CONFLICT REASON" class="kyraAdminColHeader" /></Column>
                                    <Column width="9%" hAlign="Center"><Text text="STATUS" class="kyraAdminColHeader" /></Column>
                                    <Column width="9%" hAlign="Center"><Text text="ACTIONS" class="kyraAdminColHeader" /></Column>
                                </columns>`;

    if (oldColumnsRegex.test(xml)) {
        xml = xml.replace(oldColumnsRegex, newColumns);
        console.log('Updated columns in:', file);
    }

    // 2. Center status pill and action group
    xml = xml.replace(
        /(<Table id="adminCustomConflictsTable"[\s\S]*?<HBox alignItems="Center") class="kyraAdminStatusPill"/g,
        '$1 justifyContent="Center" class="kyraAdminStatusPill"'
    );
    xml = xml.replace(
        /(<Table id="adminCustomConflictsTable"[\s\S]*?<HBox alignItems="Center") class="kyraAdminRowActionGroup"/g,
        '$1 justifyContent="Center" class="kyraAdminRowActionGroup"'
    );

    fs.writeFileSync(file, xml, 'utf8');
    console.log('Updated XML in:', file);
});

console.log('All changes applied successfully!');
