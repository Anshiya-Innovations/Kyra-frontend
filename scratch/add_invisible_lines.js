const fs = require('fs');

console.log('--- Setting Invisible Vertical Lines for Custom Conflict Table Alignment ---');

const cssAddition = `
/* ==========================================================================
   CUSTOM CONFLICT TABLE: INVISIBLE VERTICAL COLUMN LINES FOR PERFECT ALIGNMENT
   (As requested: "add this line but invisible because for algniment")
   - Uses border-right: 1px solid transparent to preserve exact column widths & grid alignment
   - Lines remain 100% invisible while maintaining pixel-perfect cell geometry
   ========================================================================== */

#adminCustomConflictsTable th,
#adminCustomConflictsTable .sapMListTblHeaderCell,
.kyraAdminConflictTable th,
.kyraAdminConflictTable .sapMListTblHeaderCell {
    border-right: 1px solid transparent !important;
    border-left: none !important;
    border-top: none !important;
    border-bottom: 1.5px solid #E2E8F0 !important;
    box-sizing: border-box !important;
}

#adminCustomConflictsTable th:last-child,
#adminCustomConflictsTable .sapMListTblHeaderCell:last-child,
.kyraAdminConflictTable th:last-child,
.kyraAdminConflictTable .sapMListTblHeaderCell:last-child {
    border-right: none !important;
}

#adminCustomConflictsTable td,
#adminCustomConflictsTable .sapMListTblCell,
.kyraAdminConflictTable td,
.kyraAdminConflictTable .sapMListTblCell {
    border-right: 1px solid transparent !important;
    border-left: none !important;
    border-top: none !important;
    border-bottom: 1px solid #F1F5F9 !important;
    box-sizing: border-box !important;
}

#adminCustomConflictsTable td:last-child,
#adminCustomConflictsTable .sapMListTblCell:last-child,
.kyraAdminConflictTable td:last-child,
.kyraAdminConflictTable .sapMListTblCell:last-child {
    border-right: none !important;
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
    content += '\n' + cssAddition;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated file:', file);
});

console.log('Invisible vertical lines successfully applied for alignment!');
