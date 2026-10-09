const fs = require('fs');
const path = require('path');

console.log('--- Applying Business Sector Alignment & Gap Fixes ---');

const cssAddition = `
/* ==========================================================================
   BUSINESS SECTORS & SERVICES: PERFECT STRAIGHT ALIGNMENT, GAPS & PROPORTIONS
   ========================================================================== */

/* 1. Split Row: Balanced Proportions & Gaps */
.kyraAdminBusinessSectorsSplitRow,
.sapMFlexBox.kyraAdminBusinessSectorsSplitRow {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: stretch !important;
    width: 100% !important;
    gap: 20px !important;
    box-sizing: border-box !important;
}

/* Left Card: Business Sectors (49% width gives plenty of space for table, search and button) */
.kyraAdminBusinessSectorsSplitRow > .kyraAdminWhiteCard:first-child,
.sapMFlexBox.kyraAdminBusinessSectorsSplitRow > .kyraAdminWhiteCard:first-child,
.kyraAdminBusinessSectorsSplitRow > .kyraAdminSplitCard:first-child {
    width: calc(49.5% - 10px) !important;
    flex: 0 0 calc(49.5% - 10px) !important;
    max-width: calc(49.5% - 10px) !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
}

/* Right Card: Business Function Details (50.5% width) */
.kyraAdminBusinessSectorsSplitRow > .kyraAdminWhiteCard:last-child,
.sapMFlexBox.kyraAdminBusinessSectorsSplitRow > .kyraAdminWhiteCard:last-child,
.kyraAdminBusinessSectorsSplitRow > .kyraAdminSplitCard:last-child {
    width: calc(50.5% - 10px) !important;
    flex: 0 0 calc(50.5% - 10px) !important;
    max-width: calc(50.5% - 10px) !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

/* 2. Card Header Row: Straight Horizon Alignment & Clean Gaps */
.kyraAdminCardHeaderRow,
.sapMFlexBox.kyraAdminCardHeaderRow {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 16px !important;
    width: 100% !important;
    min-height: 40px !important;
    margin-bottom: 16px !important;
    box-sizing: border-box !important;
}

/* Card Header Title: Straight single line (Never wraps into 2 lines) */
.kyraAdminCardTitle,
.kyraAdminCardTitle.sapMTitle,
.kyraAdminCardHeaderRow .kyraAdminCardTitle,
.kyraAdminCardHeaderRow .sapMTitle.kyraAdminCardTitle,
.kyraAdminSplitCard:first-child .kyraAdminCardTitle,
.kyraAdminSplitCard:first-child .sapMTitle.kyraAdminCardTitle {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    letter-spacing: -0.015em !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    width: auto !important;
    min-width: 0 !important;
    display: inline-block !important;
    line-height: 1.2 !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Right card title can wrap cleanly if sector name is long */
.kyraAdminSplitCard:last-child .kyraAdminCardTitle,
.kyraAdminSplitCard:last-child .sapMTitle.kyraAdminCardTitle {
    white-space: normal !important;
    word-break: break-word !important;
    line-height: 1.35 !important;
    flex-shrink: 1 !important;
}

/* Header Actions: Search Field and Add Button aligned straight with equal height */
.kyraAdminHeaderActions,
.sapMFlexBox.kyraAdminHeaderActions {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    flex-shrink: 0 !important;
    margin-left: auto !important;
    box-sizing: border-box !important;
}

/* Search Field: 36px Height, 8px Radius, straight alignment */
.kyraAdminSearchField,
.kyraAdminSearchField.sapMSF,
.sapMSF.kyraAdminSearchField {
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 0 !important;
    vertical-align: middle !important;
}

.kyraAdminSearchField form,
.kyraAdminSearchField .sapMSFF,
.sapMSF.kyraAdminSearchField form,
.sapMSF.kyraAdminSearchField .sapMSFF {
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
}

.kyraAdminSearchField input,
.kyraAdminSearchField input.sapMSFI,
.kyraAdminSearchField .sapMSFI {
    font-size: 12.5px !important;
    line-height: 34px !important;
}

.kyraAdminSearchField input::placeholder,
.kyraAdminSearchField .sapMSFI::placeholder {
    font-size: 12.5px !important;
    color: #94A3B8 !important;
}

/* Add Button: Exactly 36px Height matching Search Field, 8px Radius, straight alignment */
.kyraAdminAddServiceTopBtn,
.kyraAdminAddServiceTopBtn.sapMBtn,
.sapMBtn.kyraAdminAddServiceTopBtn {
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

.kyraAdminAddServiceTopBtn .sapMBtnInner,
.kyraAdminAddServiceTopBtn.sapMBtn .sapMBtnInner,
.sapMBtn.kyraAdminAddServiceTopBtn .sapMBtnInner {
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
}

/* 3. Tables: Straight, Centered Column Alignments */
#adminBusinessSectorsTable,
#adminServicesTable,
.kyraAdminCleanTable,
.kyraAdminServiceTable {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
}

/* Table Header Row */
#adminBusinessSectorsTable th,
#adminServicesTable th,
.kyraAdminCleanTable th,
.kyraAdminServiceTable th {
    padding: 12px 16px !important;
    vertical-align: middle !important;
    box-sizing: border-box !important;
}

/* Column 1: Left-aligned name header and cells */
#adminBusinessSectorsTable th:first-child .sapMColumnHeaderContent,
#adminServicesTable th:first-child .sapMColumnHeaderContent,
.kyraAdminServiceTable th:first-child .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: flex-start !important;
    align-items: center !important;
    text-align: left !important;
    width: 100% !important;
}

#adminBusinessSectorsTable th:first-child .kyraAdminColHeader,
#adminServicesTable th:first-child .kyraAdminColHeader,
.kyraAdminServiceTable th:first-child .kyraAdminColHeader {
    text-align: left !important;
    margin: 0 !important;
}

#adminBusinessSectorsTable td:first-child,
#adminServicesTable td:first-child,
.kyraAdminServiceTable td:first-child {
    text-align: left !important;
    vertical-align: middle !important;
    padding: 14px 16px !important;
}

#adminBusinessSectorsTable td:first-child .kyraAdminCellBold,
#adminServicesTable td:first-child .kyraAdminCellBold,
.kyraAdminServiceTable td:first-child .kyraAdminCellBold {
    text-align: left !important;
    display: block !important;
    width: auto !important;
}

/* Column 2 (STATUS): Perfectly centered header & centered pill */
#adminBusinessSectorsTable th:nth-child(2) .sapMColumnHeaderContent,
#adminServicesTable th:nth-child(2) .sapMColumnHeaderContent,
.kyraAdminServiceTable th:nth-child(2) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    width: 100% !important;
}

#adminBusinessSectorsTable th:nth-child(2) .kyraAdminColHeader,
#adminServicesTable th:nth-child(2) .kyraAdminColHeader,
.kyraAdminServiceTable th:nth-child(2) .kyraAdminColHeader {
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

#adminBusinessSectorsTable td:nth-child(2),
#adminServicesTable td:nth-child(2),
.kyraAdminServiceTable td:nth-child(2) {
    text-align: center !important;
    vertical-align: middle !important;
    padding: 14px 16px !important;
}

#adminBusinessSectorsTable td:nth-child(2) .kyraAdminStatusPill,
#adminServicesTable td:nth-child(2) .kyraAdminStatusPill,
.kyraAdminServiceTable td:nth-child(2) .kyraAdminStatusPill,
.kyraAdminStatusPill {
    margin: 0 auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
}

/* Column 3 (ACTIONS): Perfectly centered header & centered action button group */
#adminBusinessSectorsTable th:nth-child(3) .sapMColumnHeaderContent,
#adminServicesTable th:nth-child(3) .sapMColumnHeaderContent,
.kyraAdminServiceTable th:nth-child(3) .sapMColumnHeaderContent {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    width: 100% !important;
}

#adminBusinessSectorsTable th:nth-child(3) .kyraAdminColHeader,
#adminServicesTable th:nth-child(3) .kyraAdminColHeader,
.kyraAdminServiceTable th:nth-child(3) .kyraAdminColHeader {
    text-align: center !important;
    margin: 0 auto !important;
    display: inline-block !important;
}

#adminBusinessSectorsTable td:nth-child(3),
#adminServicesTable td:nth-child(3),
.kyraAdminServiceTable td:nth-child(3) {
    text-align: center !important;
    vertical-align: middle !important;
    padding: 14px 16px !important;
}

#adminBusinessSectorsTable td:nth-child(3) .kyraAdminRowActionGroup,
#adminServicesTable td:nth-child(3) .kyraAdminRowActionGroup,
.kyraAdminServiceTable td:nth-child(3) .kyraAdminRowActionGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    margin: 0 auto !important;
    width: 100% !important;
}

/* Ensure action buttons inside the table row have uniform 32px height and margin */
#adminBusinessSectorsTable .kyraAdminSystemEditBtn,
#adminBusinessSectorsTable .kyraAdminSystemDeleteBtn,
#adminServicesTable .kyraAdminSystemEditBtn,
#adminServicesTable .kyraAdminSystemDeleteBtn {
    margin: 0 !important;
}

#adminBusinessSectorsTable .kyraAdminSystemEditBtn .sapMBtnInner,
#adminBusinessSectorsTable .kyraAdminSystemDeleteBtn .sapMBtnInner,
#adminServicesTable .kyraAdminSystemEditBtn .sapMBtnInner,
#adminServicesTable .kyraAdminSystemDeleteBtn .sapMBtnInner {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    box-sizing: border-box !important;
}
`;

const cssFiles = [
    'webapp/pages/access/style.css',
    'webapp/css/style.css',
    'dist/pages/access/style.css',
    'dist/css/style.css'
];

cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content += '\n' + cssAddition;
        fs.writeFileSync(file, content, 'utf8');
        console.log('Appended CSS to:', file);
    }
});

// Update XML files
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
    'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
    'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
    'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];

xmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let xml = fs.readFileSync(file, 'utf8');

    // 1. Update split row class: add kyraAdminBusinessSectorsSplitRow if not present
    xml = xml.replace(
        /class="kyraAdminBottomSplitRow sapUiSmallMarginBottom"/g,
        'class="kyraAdminBottomSplitRow kyraAdminBusinessSectorsSplitRow sapUiSmallMarginBottom"'
    );

    // 2. Update Left Card width to 49% and Right Card width to 49.5% for Business Sectors
    xml = xml.replace(
        /(<!-- Left Card: Business Sectors -->\s*<VBox width=)"43%"/g,
        '$1"49%"'
    );
    xml = xml.replace(
        /(<!-- Right Card: Business Function Details -->\s*<VBox width=)"55\.5%"/g,
        '$1"49.5%"'
    );

    // 3. Update placeholder from "Search Sectors..." to "Search sector..." and width to 175px
    xml = xml.replace(
        /placeholder="Search Sectors\.\.\."\s*width="170px"/g,
        'placeholder="Search sector..." width="175px"'
    );

    // 4. Update table columns in adminBusinessSectorsTable to 50%, 25%, 25%
    xml = xml.replace(
        /(<Table id="adminBusinessSectorsTable"[\s\S]*?<columns>\s*)<Column width="52%" hAlign="Begin"><Text text="BUSINESS SECTOR" class="kyraAdminColHeader" \/><\/Column>\s*<Column width="24%" hAlign="Center"><Text text="STATUS" class="kyraAdminColHeader" \/><\/Column>\s*<Column width="24%" hAlign="Center"><Text text="ACTIONS" class="kyraAdminColHeader" \/><\/Column>/g,
        '$1<Column width="50%" hAlign="Begin"><Text text="BUSINESS SECTOR" class="kyraAdminColHeader" /></Column>\n                                            <Column width="25%" hAlign="Center"><Text text="STATUS" class="kyraAdminColHeader" /></Column>\n                                            <Column width="25%" hAlign="Center"><Text text="ACTIONS" class="kyraAdminColHeader" /></Column>'
    );

    // 5. Update items in adminBusinessSectorsTable: center cells, remove sapUiTinyMarginBegin
    xml = xml.replace(
        /(<Table id="adminBusinessSectorsTable"[\s\S]*?<HBox alignItems="Center") class="kyraAdminStatusPill">/g,
        '$1 justifyContent="Center" class="kyraAdminStatusPill">'
    );
    xml = xml.replace(
        /(<Table id="adminBusinessSectorsTable"[\s\S]*?<HBox alignItems="Center") class="kyraAdminRowActionGroup">/g,
        '$1 justifyContent="Center" class="kyraAdminRowActionGroup">'
    );
    xml = xml.replace(
        /(<Table id="adminBusinessSectorsTable"[\s\S]*?class="kyraAdminSystemDeleteBtn) sapUiTinyMarginBegin"/g,
        '$1"'
    );

    fs.writeFileSync(file, xml, 'utf8');
    console.log('Updated XML in:', file);
});

console.log('Done!');
