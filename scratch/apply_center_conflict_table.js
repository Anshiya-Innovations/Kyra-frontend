const fs = require('fs');
const path = require('path');

console.log('--- Centering Entire Custom Conflict Table (Headers, Data, Badges, Buttons, Column & Row Borders) ---');

const centerConflictCss = `
/* ==========================================================================
   CUSTOM CONFLICT TABLE: 100% CENTER-ALIGNED TABLE (AS REQUESTED)
   Matches media_1791520510134_3030aec2.png:
   - All 6 Column Headers centered
   - All 6 Data Cells centered (Target System, Primary Persona, Conflicting Persona, Conflict Reason, Status, Actions)
   - Straight row & column borders (border-right & border-bottom: 1px solid #E2E8F0)
   - Rounded 8px outer border, F8FAFC header background
   - Applies ONLY to #adminCustomConflictsTable and .kyraAdminConflictTable
   ========================================================================== */

#adminCustomConflictsTable,
.kyraAdminConflictTable,
html body .sapMList.kyraAdminConflictTable,
html body #adminCustomConflictsTable {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    background: #FFFFFF !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03) !important;
    margin-top: 8px !important;
}

#adminCustomConflictsTable table,
#adminCustomConflictsTable .sapMListUl,
.kyraAdminConflictTable table,
.kyraAdminConflictTable .sapMListUl {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    width: 100% !important;
}

/* 1. Header: #F8FAFC, 1px Bottom Border, Straight Column Borders */
#adminCustomConflictsTable thead,
#adminCustomConflictsTable thead tr,
#adminCustomConflictsTable .sapMListTblHeader,
.kyraAdminConflictTable thead,
.kyraAdminConflictTable thead tr,
.kyraAdminConflictTable .sapMListTblHeader {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-bottom: 1px solid #E2E8F0 !important;
}

#adminCustomConflictsTable th,
#adminCustomConflictsTable .sapMListTblHeaderCell,
.kyraAdminConflictTable th,
.kyraAdminConflictTable .sapMListTblHeaderCell {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    padding: 14px 16px !important;
    vertical-align: middle !important;
    text-align: center !important;
    border-top: none !important;
    border-left: none !important;
    border-right: 1px solid #E2E8F0 !important;
    border-bottom: 1px solid #E2E8F0 !important;
    box-sizing: border-box !important;
}

/* Last Column Header: No right border */
#adminCustomConflictsTable th:last-child,
#adminCustomConflictsTable .sapMListTblHeaderCell:last-child,
.kyraAdminConflictTable th:last-child,
.kyraAdminConflictTable .sapMListTblHeaderCell:last-child {
    border-right: none !important;
}

/* Header Text: 100% Center-Aligned */
#adminCustomConflictsTable th .sapMColumnHeaderContent,
.kyraAdminConflictTable th .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    width: 100% !important;
}

#adminCustomConflictsTable th .kyraAdminColHeader,
#adminCustomConflictsTable th .sapMText,
.kyraAdminConflictTable th .kyraAdminColHeader,
.kyraAdminConflictTable th .sapMText {
    font-size: 11.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    color: #475569 !important;
    text-transform: uppercase !important;
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
    width: auto !important;
}

/* 2. Data Cells: #FFFFFF, 1px Row & Column Borders */
#adminCustomConflictsTable td,
#adminCustomConflictsTable .sapMListTblCell,
.kyraAdminConflictTable td,
.kyraAdminConflictTable .sapMListTblCell {
    padding: 16px 18px !important;
    vertical-align: middle !important;
    text-align: center !important;
    border-top: none !important;
    border-left: none !important;
    border-right: 1px solid #E2E8F0 !important;
    border-bottom: 1px solid #E2E8F0 !important;
    box-sizing: border-box !important;
    background: #FFFFFF !important;
}

/* Last Column Cell: No right border */
#adminCustomConflictsTable td:last-child,
#adminCustomConflictsTable .sapMListTblCell:last-child,
.kyraAdminConflictTable td:last-child,
.kyraAdminConflictTable .sapMListTblCell:last-child {
    border-right: none !important;
}

/* Last Row: No bottom border inside card */
#adminCustomConflictsTable tr:last-child td,
#adminCustomConflictsTable tr:last-child .sapMListTblCell,
.kyraAdminConflictTable tr:last-child td,
.kyraAdminConflictTable tr:last-child .sapMListTblCell {
    border-bottom: none !important;
}

#adminCustomConflictsTable .kyraAdminTableRow,
.kyraAdminConflictTable .kyraAdminTableRow {
    min-height: 56px !important;
    height: auto !important;
    transition: background-color 0.15s ease !important;
}

#adminCustomConflictsTable .kyraAdminTableRow:hover td,
#adminCustomConflictsTable .kyraAdminTableRow:hover .sapMListTblCell,
#adminCustomConflictsTable tbody tr:hover td,
#adminCustomConflictsTable tbody .sapMListTblRow:hover td,
.kyraAdminConflictTable .kyraAdminTableRow:hover td,
.kyraAdminConflictTable .kyraAdminTableRow:hover .sapMListTblCell,
.kyraAdminConflictTable tbody tr:hover td,
.kyraAdminConflictTable tbody .sapMListTblRow:hover td {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
}

/* 3. All Data Text in All Columns: 100% Center-Aligned */
#adminCustomConflictsTable td .sapMText,
#adminCustomConflictsTable td .sapMTextBreakWord,
#adminCustomConflictsTable td .kyraAdminCellBold,
#adminCustomConflictsTable td .kyraAdminCellText,
#adminCustomConflictsTable td span,
.kyraAdminConflictTable td .sapMText,
.kyraAdminConflictTable td .sapMTextBreakWord,
.kyraAdminConflictTable td .kyraAdminCellBold,
.kyraAdminConflictTable td .kyraAdminCellText,
.kyraAdminConflictTable td span {
    text-align: center !important;
    text-align-last: center !important;
    display: block !important;
    width: 100% !important;
    margin: 0 auto !important;
}

#adminCustomConflictsTable .kyraAdminCellBold,
.kyraAdminConflictTable .kyraAdminCellBold {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #0F172A !important;
    line-height: 1.45 !important;
    text-align: center !important;
}

#adminCustomConflictsTable .kyraAdminCellText,
.kyraAdminConflictTable .kyraAdminCellText {
    font-size: 13px !important;
    font-weight: 400 !important;
    color: #334155 !important;
    line-height: 1.5 !important;
    text-align: center !important;
}

/* Target all columns explicitly for 100% certainty */
#adminCustomConflictsTable th:nth-child(1),
#adminCustomConflictsTable th:nth-child(2),
#adminCustomConflictsTable th:nth-child(3),
#adminCustomConflictsTable th:nth-child(4),
#adminCustomConflictsTable th:nth-child(5),
#adminCustomConflictsTable th:nth-child(6),
#adminCustomConflictsTable td:nth-child(1),
#adminCustomConflictsTable td:nth-child(2),
#adminCustomConflictsTable td:nth-child(3),
#adminCustomConflictsTable td:nth-child(4),
#adminCustomConflictsTable td:nth-child(5),
#adminCustomConflictsTable td:nth-child(6) {
    text-align: center !important;
    vertical-align: middle !important;
}

#adminCustomConflictsTable th:nth-child(1) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(2) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(3) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(4) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(5) .sapMColumnHeaderContent,
#adminCustomConflictsTable th:nth-child(6) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
}

#adminCustomConflictsTable th:nth-child(1) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(2) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(3) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(4) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(5) .kyraAdminColHeader,
#adminCustomConflictsTable th:nth-child(6) .kyraAdminColHeader {
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

/* 4. Status Pill: Perfectly Centered */
#adminCustomConflictsTable td .kyraAdminStatusPill,
.kyraAdminConflictTable td .kyraAdminStatusPill,
#adminCustomConflictsTable td:nth-child(5) .kyraAdminStatusPill {
    margin: 0 auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    vertical-align: middle !important;
}

/* 5. Action Buttons Group: Perfectly Centered */
#adminCustomConflictsTable td .kyraAdminRowActionGroup,
.kyraAdminConflictTable td .kyraAdminRowActionGroup,
#adminCustomConflictsTable td:nth-child(6) .kyraAdminRowActionGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    margin: 0 auto !important;
    width: 100% !important;
}

#adminCustomConflictsTable .kyraAdminSystemEditBtn,
#adminCustomConflictsTable .kyraAdminSystemDeleteBtn,
.kyraAdminConflictTable .kyraAdminSystemEditBtn,
.kyraAdminConflictTable .kyraAdminSystemDeleteBtn {
    margin: 0 !important;
}

#adminCustomConflictsTable .kyraAdminSystemEditBtn .sapMBtnInner,
#adminCustomConflictsTable .kyraAdminSystemDeleteBtn .sapMBtnInner,
.kyraAdminConflictTable .kyraAdminSystemEditBtn .sapMBtnInner,
.kyraAdminConflictTable .kyraAdminSystemDeleteBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
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

    // Remove any previous override block for conflict table at the tail
    content += '\n' + centerConflictCss;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Appended center conflict styles to:', file);
});

// Update XML files to make all columns hAlign="Center"
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

    // Make all columns in adminCustomConflictsTable hAlign="Center"
    const oldColumnsRegex = /<Table\s+id="adminCustomConflictsTable"[\s\S]*?<columns>[\s\S]*?<\/columns>/;
    const newColumns = `<Table
                                id="adminCustomConflictsTable"
                                items="{accessModel>/adminCustomConflicts}"
                                fixedLayout="true"
                                class="sapUiNoMargin kyraAdminCleanTable kyraAdminConflictTable">
                                <columns>
                                    <Column width="14%" hAlign="Center"><Text text="TARGET SYSTEM" class="kyraAdminColHeader" /></Column>
                                    <Column width="22%" hAlign="Center"><Text text="PRIMARY TEAM / PERSONA" class="kyraAdminColHeader" /></Column>
                                    <Column width="22%" hAlign="Center"><Text text="CONFLICTING TEAM / PERSONA" class="kyraAdminColHeader" /></Column>
                                    <Column width="24%" hAlign="Center"><Text text="CONFLICT REASON" class="kyraAdminColHeader" /></Column>
                                    <Column width="9%" hAlign="Center"><Text text="STATUS" class="kyraAdminColHeader" /></Column>
                                    <Column width="9%" hAlign="Center"><Text text="ACTIONS" class="kyraAdminColHeader" /></Column>
                                </columns>`;

    if (oldColumnsRegex.test(xml)) {
        xml = xml.replace(oldColumnsRegex, newColumns);
        console.log('Updated columns (all hAlign="Center") in:', file);
    }

    fs.writeFileSync(file, xml, 'utf8');
});

console.log('Done centering Custom Conflict table!');
