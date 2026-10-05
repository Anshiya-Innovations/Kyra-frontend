const fs = require('fs');
const path = require('path');

// 1. UPDATE AccessPage.view.xml
const accessViewPath = path.join(__dirname, '../webapp/pages/access/AccessPage.view.xml');
let accessViewContent = fs.readFileSync(accessViewPath, 'utf8');

// Update deptPersonaUsersTable columns and ColumnListItem
const oldTableRegex = /<Table id="deptPersonaUsersTable"[\s\S]*?<\/Table>/;

const newTableXml = `<Table id="deptPersonaUsersTable" items="{accessModel>/departmentPersonaUsers}" fixedLayout="true" class="sapUiNoMargin kyraAdminCleanTable kyraDeptUsersTable">
                                    <columns>
                                        <Column width="48px" hAlign="Center" class="kyraTableCheckCol kyraDeptCheckCol">
                                            <CheckBox
                                                id="masterDeptCheckbox"
                                                selected="{accessModel>/departmentPersonaAllSelected}"
                                                select=".onToggleMasterDeptCheckbox"
                                                class="kyraAdminTableCheckbox"
                                                tooltip="Select or Deselect All" />
                                        </Column>
                                        <Column width="16%" hAlign="Begin"><Text text="EMPLOYEE ID" class="kyraAdminColHeader" /></Column>
                                        <Column width="22%" hAlign="Begin"><Text text="FULL NAME" class="kyraAdminColHeader" /></Column>
                                        <Column width="26%" hAlign="Begin"><Text text="EMAIL ADDRESS" class="kyraAdminColHeader" /></Column>
                                        <Column width="20%" hAlign="Begin"><Text text="DEPARTMENT" class="kyraAdminColHeader" /></Column>
                                        <Column width="16%" hAlign="Begin"><Text text="PERSONA" class="kyraAdminColHeader" /></Column>
                                    </columns>
                                    <items>
                                        <ColumnListItem vAlign="Middle" type="Active" highlight="None" press=".onDeptUserRowPress" class="{= 'kyraDeptUserRow ' + (\${accessModel>selected} ? 'kyraDeptUserRowSelected' : '') }">
                                            <cells>
                                                <CheckBox
                                                    selected="{accessModel>selected}"
                                                    select=".onDeptUserCheckboxToggle"
                                                    class="kyraAdminTableCheckbox" />
                                                <Text text="{accessModel>username}" class="kyraAdminCellBold" />
                                                <Text text="{accessModel>fullName}" class="kyraAdminCellText" />
                                                <Text text="{accessModel>email}" class="kyraAdminCellText" />
                                                <Text text="{accessModel>department}" class="kyraAdminCellText" />
                                                <HBox alignItems="Center" class="{= 'kyraDeptPersonaBadge ' + (\${accessModel>personaBadgeClass} || 'kyraPersonaRequester') }">
                                                    <core:Icon src="{= \${accessModel>personaIcon} || 'sap-icon://person-placeholder' }" size="13px" class="sapUiTinyMarginEnd" />
                                                    <Text text="{= \${accessModel>displayedPersona} || \${accessModel>currentPersona} || 'Requester' }" class="kyraPersonaBadgeText" />
                                                </HBox>
                                            </cells>
                                        </ColumnListItem>
                                    </items>
                                </Table>`;

if (!oldTableRegex.test(accessViewContent)) {
    console.error('ERROR: Could not find deptPersonaUsersTable in AccessPage.view.xml');
    process.exit(1);
}

accessViewContent = accessViewContent.replace(oldTableRegex, newTableXml);
fs.writeFileSync(accessViewPath, accessViewContent, 'utf8');
console.log('Successfully updated webapp/pages/access/AccessPage.view.xml');

// 2. UPDATE style.css
const cssPath = path.join(__dirname, '../webapp/css/style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace the obsolete buggy block at lines ~45754 to ~46064
// We can locate it between '.kyraDeptRejectAllBtn.sapMBtn:hover {' and '/* SERVICE DETAILS: SIMPLE, CLEAN & BALANCED'
const buggyBlockRegex = /\/\* Department Users Table Checkbox Specific Alignment \*\/[\s\S]*?(?=\/\* ==========================================================================\s*\*\/\s*\/\* SERVICE DETAILS: SIMPLE, CLEAN & BALANCED)/;

if (buggyBlockRegex.test(cssContent)) {
    cssContent = cssContent.replace(buggyBlockRegex, '/* Obsolete checkbox rules removed - consolidated in unified table design system */\n\n');
    console.log('Successfully removed buggy intermediate checkbox overrides.');
} else {
    console.warn('Warning: Could not match buggyBlockRegex, checking manual search...');
}

// Replace everything from lines ~46564 ('/* DEPARTMENT USERS TABLE: CLEAN, BEAUTIFUL, PROPER TICK CHECKBOX') to end of file
const tailBlockRegex = /\/\* ==========================================================================\s*\*\/\s*\/\* DEPARTMENT USERS TABLE: CLEAN, BEAUTIFUL, PROPER TICK CHECKBOX[\s\S]*$/;

const unifiedTableCss = `/* ========================================================================== */
/* KYRA ENTERPRISE UNIFIED TABLE DESIGN SYSTEM                                */
/* Clean, professional, and consistent layout across all project tables       */
/* ========================================================================== */

/* 1. UNIVERSAL TABLE CONTAINER & CARD ADAPTATION */
.kyraDeptUsersTable,
.kyraAdminCleanTable,
.kyraActiveEntitlementsTable,
.kyraApproverTable,
.kyraHistoryTable,
.kyraPendingRequestsTable,
.kyraValTable,
.kyraSummaryTable,
.kyraStep2CleanTable,
.kyraAdminServiceTable,
.fioriTableCard .sapMList,
.sapMListTbl.kyraAdminCleanTable,
.sapMListTbl.kyraDeptUsersTable,
.sapMListTbl.kyraActiveEntitlementsTable,
.sapMListTbl.kyraApproverTable,
.sapMListTbl.kyraHistoryTable,
.sapMListTbl.kyraPendingRequestsTable {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
}

/* Card wrappers containing tables to support responsive horizontal scrolling without clipping */
.kyraAdminWhiteCard:has(.sapMListTbl),
.fioriTableCard:has(.sapMListTbl),
.kyraDeptUsersTableWrapper {
    overflow-x: auto !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}

/* 2. STRICT ELIMINATION OF SAP UI5 INTERNAL HIGHLIGHT / NAVIGATED / SELECTION DUMMY COLUMNS */
.sapMListTblHighlightCol,
.sapMListTblHighlightCell,
.sapMListTblNavigatedCol,
.sapMListTblNavigatedCell,
.sapMListTblCellNavigated,
.sapMLIBHighlight,
.kyraDeptUsersTable col.sapMListTblHighlightCol,
.kyraDeptUsersTable col.sapMListTblNavigatedCol,
.kyraDeptUsersTable th.sapMListTblHighlightCol,
.kyraDeptUsersTable td.sapMListTblHighlightCell,
.kyraAdminCleanTable col.sapMListTblHighlightCol,
.kyraAdminCleanTable col.sapMListTblNavigatedCol,
.kyraAdminCleanTable th.sapMListTblHighlightCol,
.kyraAdminCleanTable td.sapMListTblHighlightCell,
.kyraActiveEntitlementsTable th.sapMListTblHighlightCol,
.kyraActiveEntitlementsTable td.sapMListTblHighlightCell,
.kyraApproverTable th.sapMListTblHighlightCol,
.kyraApproverTable td.sapMListTblHighlightCell,
.kyraHistoryTable th.sapMListTblHighlightCol,
.kyraHistoryTable td.sapMListTblHighlightCell,
.kyraPendingRequestsTable th.sapMListTblHighlightCol,
.kyraPendingRequestsTable td.sapMListTblHighlightCell,
.sapMListTbl colgroup col.sapMListTblHighlightCol,
.sapMListTbl colgroup col.sapMListTblNavigatedCol,
.sapMListTbl th.sapMListTblHighlightCol,
.sapMListTbl td.sapMListTblHighlightCell {
    display: none !important;
    width: 0px !important;
    min-width: 0px !important;
    max-width: 0px !important;
    padding: 0px !important;
    margin: 0px !important;
    border: none !important;
    border-right: none !important;
    border-bottom: none !important;
    border-left: none !important;
    border-top: none !important;
    box-shadow: none !important;
    outline: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
}

/* 3. TABLE HEADER ROW: EQUAL 44px HEIGHT, SUBTLE BACKGROUND, BOLD HEADINGS */
.kyraDeptUsersTable .sapMListTblHeader,
.kyraAdminCleanTable .sapMListTblHeader,
.kyraActiveEntitlementsTable .sapMListTblHeader,
.kyraApproverTable .sapMListTblHeader,
.kyraHistoryTable .sapMListTblHeader,
.kyraPendingRequestsTable .sapMListTblHeader,
.kyraValTable .sapMListTblHeader,
.kyraSummaryTable .sapMListTblHeader,
.kyraStep2CleanTable .sapMListTblHeader,
.kyraAdminServiceTable .sapMListTblHeader {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-bottom: 1.5px solid #E2E8F0 !important;
    height: 44px !important;
    min-height: 44px !important;
}

.kyraDeptUsersTable th,
.kyraDeptUsersTable .sapMListTblHeaderCell,
.kyraAdminCleanTable th,
.kyraAdminCleanTable .sapMListTblHeaderCell,
.kyraActiveEntitlementsTable th,
.kyraActiveEntitlementsTable .sapMListTblHeaderCell,
.kyraApproverTable th,
.kyraApproverTable .sapMListTblHeaderCell,
.kyraHistoryTable th,
.kyraHistoryTable .sapMListTblHeaderCell,
.kyraPendingRequestsTable th,
.kyraPendingRequestsTable .sapMListTblHeaderCell,
.kyraValTable th,
.kyraValTable .sapMListTblHeaderCell,
.kyraSummaryTable th,
.kyraSummaryTable .sapMListTblHeaderCell,
.kyraStep2CleanTable th,
.kyraStep2CleanTable .sapMListTblHeaderCell,
.kyraAdminServiceTable th,
.kyraAdminServiceTable .sapMListTblHeaderCell {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    padding: 10px 16px !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: 1.5px solid #E2E8F0 !important;
    vertical-align: middle !important;
    color: #475569 !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    box-sizing: border-box !important;
}

/* Header Text elements */
.kyraDeptUsersTable th .sapMText,
.kyraAdminCleanTable th .sapMText,
.kyraActiveEntitlementsTable th .sapMText,
.kyraApproverTable th .sapMText,
.kyraHistoryTable th .sapMText,
.kyraPendingRequestsTable th .sapMText,
.kyraAdminColHeader,
.kyraEntitlementColHeader,
.kyraHistHeader {
    font-weight: 700 !important;
    color: #475569 !important;
    font-size: 11.5px !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    vertical-align: middle !important;
}

/* 4. TABLE DATA ROWS: EQUAL 52px HEIGHT, SUBTLE HORIZONTAL DIVIDERS, NORMAL TEXT */
.kyraDeptUsersTable tr.sapMLIB,
.kyraAdminCleanTable tr.sapMLIB,
.kyraActiveEntitlementsTable tr.sapMLIB,
.kyraApproverTable tr.sapMLIB,
.kyraHistoryTable tr.sapMLIB,
.kyraPendingRequestsTable tr.sapMLIB,
.kyraValTable tr.sapMLIB,
.kyraSummaryTable tr.sapMLIB,
.kyraStep2CleanTable tr.sapMLIB,
.kyraAdminServiceTable tr.sapMLIB,
.kyraDeptUsersTable tr.kyraDeptUserRow {
    height: 52px !important;
    min-height: 52px !important;
    border-bottom: 1px solid #F1F5F9 !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    background: #FFFFFF !important;
    transition: background-color 0.15s ease !important;
}

.kyraDeptUsersTable td.sapMListTblCell,
.kyraAdminCleanTable td.sapMListTblCell,
.kyraActiveEntitlementsTable td.sapMListTblCell,
.kyraApproverTable td.sapMListTblCell,
.kyraHistoryTable td.sapMListTblCell,
.kyraPendingRequestsTable td.sapMListTblCell,
.kyraValTable td.sapMListTblCell,
.kyraSummaryTable td.sapMListTblCell,
.kyraStep2CleanTable td.sapMListTblCell,
.kyraAdminServiceTable td.sapMListTblCell {
    padding: 12px 16px !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: 1px solid #F1F5F9 !important;
    vertical-align: middle !important;
    color: #334155 !important;
    font-size: 13.5px !important;
    font-weight: 400 !important;
    box-sizing: border-box !important;
}

/* Typography Consistency */
.kyraAdminCellBold {
    font-weight: 600 !important;
    color: #0F172A !important;
    font-size: 13.5px !important;
    vertical-align: middle !important;
}

.kyraAdminCellText,
.kyraCellText {
    font-weight: 400 !important;
    color: #475569 !important;
    font-size: 13.5px !important;
    vertical-align: middle !important;
}

.kyraAdminCellMuted {
    color: #94A3B8 !important;
    font-size: 13.5px !important;
    font-style: italic !important;
    font-weight: 500 !important;
    vertical-align: middle !important;
}

/* 5. SUBTLE ROW HOVER EFFECT */
.kyraDeptUsersTable tr.sapMLIB:hover td,
.kyraAdminCleanTable tr.sapMLIB:hover td,
.kyraActiveEntitlementsTable tr.sapMLIB:hover td,
.kyraApproverTable tr.sapMLIB:hover td,
.kyraHistoryTable tr.sapMLIB:hover td,
.kyraPendingRequestsTable tr.sapMLIB:hover td,
.kyraValTable tr.sapMLIB:hover td,
.kyraSummaryTable tr.sapMLIB:hover td,
.kyraStep2CleanTable tr.sapMLIB:hover td,
.kyraAdminServiceTable tr.sapMLIB:hover td,
.kyraDeptUsersTable tr.kyraDeptUserRow:hover td {
    background-color: #F8FAFC !important;
}

/* Selected Row Highlighting (KYRA Brand Soft Mint) */
.kyraDeptUsersTable tr.kyraDeptUserRowSelected td,
.kyraDeptUsersTable tr.kyraDeptUserRow.sapMLIBSelected td,
.kyraDeptUsersTable tr.kyraDeptUserRow[aria-selected="true"] td,
.kyraDeptUsersTable tr.sapMLIBSelected td {
    background-color: #F0FDFA !important;
    background: #F0FDFA !important;
}

.kyraDeptUsersTable tr.kyraDeptUserRowSelected:hover td,
.kyraDeptUsersTable tr.kyraDeptUserRow.sapMLIBSelected:hover td,
.kyraDeptUsersTable tr.kyraDeptUserRow[aria-selected="true"]:hover td,
.kyraDeptUsersTable tr.sapMLIBSelected:hover td {
    background-color: #E6F7F8 !important;
    background: #E6F7F8 !important;
}

/* 6. CHECKBOX COLUMN: NARROW, PRECISELY ALIGNED & KYRA BRAND COLORED */
.kyraDeptUsersTable th.kyraDeptCheckCol,
.kyraDeptUsersTable th.kyraTableCheckCol,
.kyraAdminCleanTable th.kyraTableCheckCol,
.kyraAdminCleanTable th.kyraDeptCheckCol,
.kyraDeptUsersTable td.sapMListTblCell:has(.sapMCb),
.kyraDeptUsersTable td.sapMListTblCell:has(.kyraAdminTableCheckbox),
.kyraAdminCleanTable td.sapMListTblCell:has(.kyraAdminTableCheckbox),
.kyraAdminCleanTable td.sapMListTblCell:has(.sapMCb),
.kyraDeptUsersTable td.kyraTableCheckCell,
.kyraAdminCleanTable td.kyraTableCheckCell {
    width: 48px !important;
    min-width: 48px !important;
    max-width: 48px !important;
    padding: 0 !important;
    text-align: center !important;
    vertical-align: middle !important;
    cursor: pointer !important;
}

.kyraDeptUsersTable th.kyraDeptCheckCol .sapMColumnHeaderContent,
.kyraDeptUsersTable th.kyraTableCheckCol .sapMColumnHeaderContent,
.kyraAdminCleanTable th.kyraTableCheckCol .sapMColumnHeaderContent,
.kyraAdminCleanTable th.kyraDeptCheckCol .sapMColumnHeaderContent {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
    text-align: center !important;
}

.kyraDeptUsersTable .sapMCb,
.kyraDeptUsersTable .kyraAdminTableCheckbox,
.kyraAdminCleanTable .sapMCb,
.kyraAdminCleanTable .kyraAdminTableCheckbox {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 auto !important;
    padding: 0 !important;
    height: 24px !important;
    min-height: 24px !important;
    width: 24px !important;
    min-width: 24px !important;
    cursor: pointer !important;
    vertical-align: middle !important;
    position: relative !important;
}

/* UNCHECKED Checkbox: Clean White with Kyra Signature Teal Border (#008C9C) */
.kyraDeptUsersTable .sapMCbBg,
.kyraDeptUsersTable .sapMCb[aria-checked="false"] .sapMCbBg,
.kyraDeptUsersTable .sapMCb:not(.sapMCbChecked) .sapMCbBg,
.kyraDeptUsersTable .sapMCbBg:not(.sapMCbMarkChecked),
.kyraAdminCleanTable .sapMCbBg,
.kyraAdminCleanTable .sapMCb[aria-checked="false"] .sapMCbBg,
.kyraAdminCleanTable .sapMCb:not(.sapMCbChecked) .sapMCbBg,
.kyraAdminCleanTable .sapMCbBg:not(.sapMCbMarkChecked) {
    width: 18px !important;
    height: 18px !important;
    min-width: 18px !important;
    min-height: 18px !important;
    border-radius: 4px !important;
    border: 1.5px solid #008C9C !important;
    background-color: #FFFFFF !important;
    background-image: none !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 auto !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraDeptUsersTable .sapMCb:hover .sapMCbBg,
.kyraAdminCleanTable .sapMCb:hover .sapMCbBg {
    border-color: #007684 !important;
    background-color: #F0FDFA !important;
}

/* CHECKED Checkbox: Solid Kyra Teal (#008C9C) with Crisp Pure White SVG Tick */
.kyraDeptUsersTable .sapMCbBg.sapMCbMarkChecked,
.kyraDeptUsersTable .sapMCb.sapMCbChecked .sapMCbBg,
.kyraDeptUsersTable .sapMCb[aria-checked="true"] .sapMCbBg,
.kyraDeptUsersTable .sapMCbChecked .sapMCbBg,
.kyraDeptUsersTable tr .sapMCb.sapMCbChecked .sapMCbBg,
.kyraDeptUsersTable tr [aria-checked="true"] .sapMCbBg,
.kyraDeptUsersTable tr .sapMCbBg.sapMCbMarkChecked,
.kyraAdminCleanTable .sapMCbBg.sapMCbMarkChecked,
.kyraAdminCleanTable .sapMCb.sapMCbChecked .sapMCbBg,
.kyraAdminCleanTable .sapMCb[aria-checked="true"] .sapMCbBg,
.kyraAdminCleanTable .sapMCbChecked .sapMCbBg,
.kyraAdminCleanTable tr .sapMCb.sapMCbChecked .sapMCbBg,
.kyraAdminCleanTable tr [aria-checked="true"] .sapMCbBg,
.kyraAdminCleanTable tr .sapMCbBg.sapMCbMarkChecked {
    background-color: #008C9C !important;
    background: #008C9C !important;
    border: 1.5px solid #008C9C !important;
    border-color: #008C9C !important;
    border-radius: 4px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06) !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
    background-size: 13px 13px !important;
}

/* Suppress redundant UI5 internal mark pseudo elements to ensure clean crisp SVG checkmark */
.kyraDeptUsersTable .sapMCbMark::before,
.kyraDeptUsersTable .sapMCbBg::before,
.kyraDeptUsersTable .sapMCbMark::after,
.kyraDeptUsersTable .sapMCbBg::after,
.kyraAdminCleanTable .sapMCbMark::before,
.kyraAdminCleanTable .sapMCbBg::before,
.kyraAdminCleanTable .sapMCbMark::after,
.kyraAdminCleanTable .sapMCbBg::after {
    display: none !important;
    content: none !important;
}
.kyraDeptUsersTable .sapMCbMark svg,
.kyraDeptUsersTable .sapMCb svg,
.kyraAdminCleanTable .sapMCbMark svg,
.kyraAdminCleanTable .sapMCb svg {
    display: none !important;
}

/* 7. PERSONA BADGE ALIGNMENT AND CENTERING */
.kyraDeptPersonaBadge,
.kyraAdminCleanTable .kyraDeptPersonaBadge {
    display: inline-flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 6px !important;
    padding: 4px 12px 4px 8px !important;
    border-radius: 16px !important;
    box-sizing: border-box !important;
    width: fit-content !important;
    max-width: 100% !important;
    min-height: 26px !important;
    height: auto !important;
    background: #EBF9F5 !important;
    background-color: #EBF9F5 !important;
    border: 1px solid #D1FAE5 !important;
    box-shadow: none !important;
    cursor: default !important;
    vertical-align: middle !important;
}

.kyraDeptPersonaBadge .kyraPersonaBadgeText,
.kyraAdminCleanTable .kyraDeptPersonaBadge .kyraPersonaBadgeText {
    font-size: 12.5px !important;
    font-weight: 600 !important;
    letter-spacing: 0.1px !important;
    white-space: nowrap !important;
    line-height: 1.2 !important;
    color: #0F766E !important;
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.kyraDeptPersonaBadge .sapUiIcon,
.kyraAdminCleanTable .kyraDeptPersonaBadge .sapUiIcon {
    font-size: 13px !important;
    color: #0D9488 !important;
    flex-shrink: 0 !important;
    line-height: 1 !important;
    margin-right: 2px !important;
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.kyraDeptPersonaBadge.kyraPersonaRequester {
    background: #EBF9F5 !important;
    background-color: #EBF9F5 !important;
    border: 1px solid #D1FAE5 !important;
}
.kyraDeptPersonaBadge.kyraPersonaRequester .kyraPersonaBadgeText {
    color: #0F766E !important;
}
.kyraDeptPersonaBadge.kyraPersonaRequester .sapUiIcon {
    color: #0D9488 !important;
}

.kyraDeptPersonaBadge.kyraPersonaApprover {
    background: #ECFDF5 !important;
    background-color: #ECFDF5 !important;
    border: 1px solid #A7F3D0 !important;
}
.kyraDeptPersonaBadge.kyraPersonaApprover .kyraPersonaBadgeText {
    color: #047857 !important;
}
.kyraDeptPersonaBadge.kyraPersonaApprover .sapUiIcon {
    color: #059669 !important;
}

.kyraDeptPersonaBadge.kyraPersonaCompliance {
    background: #EFF6FF !important;
    background-color: #EFF6FF !important;
    border: 1px solid #BFDBFE !important;
}
.kyraDeptPersonaBadge.kyraPersonaCompliance .kyraPersonaBadgeText {
    color: #1D4ED8 !important;
}
.kyraDeptPersonaBadge.kyraPersonaCompliance .sapUiIcon {
    color: #2563EB !important;
}

/* 8. TOP BAR: SELECT ALL BUTTON & SELECTION BADGE */
.kyraDeptSelectAllBtn {
    border: 1.5px solid #10B981 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
}
.kyraDeptSelectAllBtn .sapMBtnInner {
    border: 1.5px solid #10B981 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #065F46 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    padding: 0 14px !important;
    height: 32px !important;
}
.kyraDeptSelectAllBtn .sapMBtnIcon {
    color: #0D9488 !important;
    font-size: 13px !important;
}

.kyraPillBadgeSuccess {
    background: #ECFDF5 !important;
    background-color: #ECFDF5 !important;
    border-radius: 20px !important;
    padding: 6px 14px !important;
    border: none !important;
}
.kyraPillBadgeSuccess .kyraPillBadgeSuccessText,
.kyraPillBadgeSuccess .sapMText {
    color: #065F46 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
}
.kyraPillBadgeSuccess .sapUiIcon {
    color: #065F46 !important;
    font-size: 12px !important;
}
`;

if (tailBlockRegex.test(cssContent)) {
    cssContent = cssContent.replace(tailBlockRegex, unifiedTableCss);
    console.log('Successfully replaced tail of style.css with unified table system.');
} else {
    console.error('ERROR: Could not match tailBlockRegex in style.css');
    process.exit(1);
}

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Successfully written updated webapp/css/style.css');

// 3. SYNCHRONIZE COPIES
const syncPairs = [
    // Views
    [accessViewPath, path.join(__dirname, '../webapp/AccessPage.view.xml')],
    [accessViewPath, path.join(__dirname, '../webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml')],
    [accessViewPath, path.join(__dirname, '../webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml')],
    [accessViewPath, path.join(__dirname, '../webapp/page component/User Access Management Portal page/AccessPage.view.xml')],
    [accessViewPath, path.join(__dirname, '../webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml')],
    // Styles
    [cssPath, path.join(__dirname, '../webapp/pages/access/style.css')],
    [cssPath, path.join(__dirname, '../webapp/page component/KYRA Frontend-SK/webapp/css/style.css')]
];

for (const [src, dest] of syncPairs) {
    if (fs.existsSync(path.dirname(dest))) {
        fs.copyFileSync(src, dest);
        console.log('Synchronized: ' + path.relative(path.join(__dirname, '..'), dest));
    }
}

console.log('All table improvements and synchronizations applied successfully!');
