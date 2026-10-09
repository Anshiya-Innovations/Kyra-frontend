const fs = require('fs');
const path = require('path');

console.log('--- Removing Vertical Lines from Custom Conflict Table (Keeping 100% Center Alignment) ---');

const cssAddition = `
/* ==========================================================================
   CUSTOM CONFLICT TABLE: REMOVE VERTICAL LINES (KEEP FULL CENTER ALIGNMENT)
   - Removes all vertical border lines between columns
   - Retains 100% center alignment for all headers, cells, text, status badges, & action buttons
   - Retains clean horizontal row dividers (border-bottom)
   ========================================================================== */

#adminCustomConflictsTable th,
#adminCustomConflictsTable .sapMListTblHeaderCell,
.kyraAdminConflictTable th,
.kyraAdminConflictTable .sapMListTblHeaderCell {
    border-right: none !important;
    border-left: none !important;
    border-top: none !important;
    border-bottom: 1.5px solid #E2E8F0 !important;
}

#adminCustomConflictsTable td,
#adminCustomConflictsTable .sapMListTblCell,
.kyraAdminConflictTable td,
.kyraAdminConflictTable .sapMListTblCell {
    border-right: none !important;
    border-left: none !important;
    border-top: none !important;
    border-bottom: 1px solid #F1F5F9 !important;
}

/* Ensure all headers remain strictly centered */
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
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

/* Ensure all data cells and text remain strictly centered */
#adminCustomConflictsTable td,
.kyraAdminConflictTable td {
    text-align: center !important;
    vertical-align: middle !important;
}

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

/* Ensure Status and Action Buttons remain strictly centered */
#adminCustomConflictsTable td .kyraAdminStatusPill,
.kyraAdminConflictTable td .kyraAdminStatusPill {
    margin: 0 auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
}

#adminCustomConflictsTable td .kyraAdminRowActionGroup,
.kyraAdminConflictTable td .kyraAdminRowActionGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    margin: 0 auto !important;
    width: 100% !important;
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

    // In the previous block, replace border-right: 1px solid #E2E8F0 !important with border-right: none !important
    content = content.replace(
        /(#adminCustomConflictsTable th,[\s\S]*?border-right:)\s*1px solid #E2E8F0 !important;/g,
        '$1 none !important;'
    );
    content = content.replace(
        /(#adminCustomConflictsTable td,[\s\S]*?border-right:)\s*1px solid #E2E8F0 !important;/g,
        '$1 none !important;'
    );
    content = content.replace(
        /(\.kyraAdminConflictTable th,[\s\S]*?border-right:)\s*1px solid #E2E8F0 !important;/g,
        '$1 none !important;'
    );
    content = content.replace(
        /(\.kyraAdminConflictTable td,[\s\S]*?border-right:)\s*1px solid #E2E8F0 !important;/g,
        '$1 none !important;'
    );

    content += '\n' + cssAddition;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated file:', file);
});

console.log('Vertical lines removed successfully while preserving center alignment!');
