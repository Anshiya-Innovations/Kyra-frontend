const fs = require('fs');

// 1. Update CSS in webapp/css/style.css
const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetCssStart = '/* ========================================================================= */\r\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (EXACT MATCH TO USER SPEC)           */';
const targetCssStartLF = '/* ========================================================================= */\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (EXACT MATCH TO USER SPEC)           */';

let cssIdx = css.indexOf(targetCssStart);
let isCRLF = true;
if (cssIdx === -1) {
    cssIdx = css.indexOf(targetCssStartLF);
    isCRLF = false;
    if (cssIdx === -1) {
        console.error('Target CSS start not found! Checking fallback...');
        const altStart = '/* ========================================================================= */\r\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR';
        const altStartLF = '/* ========================================================================= */\n/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR';
        cssIdx = css.indexOf(altStart);
        if (cssIdx === -1) {
            cssIdx = css.indexOf(altStartLF);
            isCRLF = false;
        }
        if (cssIdx === -1) {
            console.error('No CSS marker found!');
            process.exit(1);
        }
    }
}

const newCssRules = `/* ========================================================================= */
/* ACCESS CUSTOMIZATION SUB-NAV TAB BAR (EXACT MATCH TO SPEC & IMAGE)        */
/* ========================================================================= */
.kyraAccessCustomizationTabBar,
.sapMFlexBox.kyraAccessCustomizationTabBar,
html body [id$="accessCustomizationSubTabBar"],
#accessCustomizationSubTabBar {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 10px !important;
    padding: 4px !important;
    margin-bottom: 20px !important;
    width: 100% !important;
    height: 52px !important;
    min-height: 52px !important;
    box-sizing: border-box !important;
    gap: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
}

/* Base Tab Button (Outer Button Wrapper): 4 Equal Width Columns (flex: 1) */
.kyraCustomizationTabBtn,
.kyraCustomizationTabBtn.sapMBtn,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn,
#accessCustomizationSubTabBar .sapMBtn {
    flex: 1 1 0 !important;
    width: 25% !important;
    min-width: 0 !important;
    max-width: 25% !important;
    height: 44px !important;
    min-height: 44px !important;
    margin: 0 !important;
    padding: 0 4px !important;
    border: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    vertical-align: middle !important;
    position: relative !important;
}

/* Vertical divider lines between tabs */
.kyraCustomizationTabBtn:not(:last-child),
.kyraCustomizationTabBtn.sapMBtn:not(:last-child),
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(:last-child),
#accessCustomizationSubTabBar .sapMBtn:not(:last-child) {
    border-right: 1px solid #E2E8F0 !important;
}

/* Inner Pill Structure: Inactive State (Clean Transparent Segment) */
.kyraCustomizationTabBtn .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn .sapMBtnInner {
    width: 100% !important;
    height: 42px !important;
    min-height: 42px !important;
    border-radius: 8px !important;
    background: transparent !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Ensure Button Text/Label is Visible & Sized Appropriately Beside Icon */
#accessCustomizationSubTabBar .sapMBtn .sapMBtnContent,
.kyraCustomizationTabBtn .sapMBtnContent,
#accessCustomizationSubTabBar .sapMBtn bdi,
.kyraCustomizationTabBtn bdi {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: nowrap !important;
    opacity: 1 !important;
    visibility: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    flex-shrink: 0 !important;
    vertical-align: middle !important;
    color: #1E293B !important;
}

/* Inactive Icon: Dark Slate #1E293B (Image Match) */
.kyraCustomizationTabBtn .sapUiIcon,
.kyraCustomizationTabBtn .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnIcon,
#accessCustomizationSubTabBar .sapMBtn .sapUiIcon {
    color: #1E293B !important;
    font-size: 16px !important;
    margin: 0 !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    flex-shrink: 0 !important;
    transition: color 0.15s ease !important;
}

/* Inactive Hover State */
.kyraCustomizationTabBtn:hover .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapMBtnInner {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #E2E8F0 !important;
}

.kyraCustomizationTabBtn:hover .sapMBtnContent,
.kyraCustomizationTabBtn:hover bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover bdi,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover bdi {
    color: #008C9C !important;
}

.kyraCustomizationTabBtn:hover .sapUiIcon,
.kyraCustomizationTabBtn:hover .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):hover .sapUiIcon {
    color: #008C9C !important;
}

/* ========================================================================= */
/* ACTIVE TAB STATE: Solid KYRA Brand Teal Fill (#008C9C) Matching Image     */
/* ========================================================================= */
.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraCustomizationTabBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25) !important;
    transform: none !important;
}

.kyraCustomizationTabBtnActive .sapMBtnContent,
.kyraCustomizationTabBtnActive bdi,
.kyraCustomizationTabBtnActive .sapMBtnCustomText,
.kyraCustomizationTabBtnActive .sapMBtnInner .sapMBtnContent,
.kyraCustomizationTabBtn[data-active="true"] bdi,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnContent,
.kyraCustomizationTabBtn.sapMBtnEmphasized bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized bdi,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive bdi,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] bdi,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized bdi {
    color: #FFFFFF !important;
    font-weight: 600 !important;
}

.kyraCustomizationTabBtnActive .sapUiIcon,
.kyraCustomizationTabBtnActive .sapMBtnIcon,
.kyraCustomizationTabBtn[data-active="true"] .sapUiIcon,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnIcon,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized .sapUiIcon {
    color: #FFFFFF !important;
}

/* Active Hover State */
.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
.kyraCustomizationTabBtn[data-active="true"]:hover .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtnEmphasized:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"]:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"]:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
}

/* Pressed / Active Click state */
.kyraCustomizationTabBtn:active .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn:active .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:active .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:active .sapMBtnInner {
    transform: scale(0.98) !important;
}

/* ========================================================================= */
/* UNIFIED TWO-COLUMN LAYOUT & HORIZONTAL HEADER ALIGNMENT (IMAGE MATCH)      */
/* ========================================================================= */
.kyraAdminUnifiedServiceCard {
    padding: 20px 24px !important;
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
    box-sizing: border-box !important;
}

.kyraAdminUnifiedServiceCard .kyraAdminBottomSplitRow {
    padding: 0 !important;
    margin: 0 !important;
    display: flex !important;
    align-items: stretch !important;
    justify-content: space-between !important;
    width: 100% !important;
}

/* Header line on both left & right: exact same 38px height & vertical center */
.kyraAdminHeaderLine,
.sapMFlexBox.kyraAdminHeaderLine {
    height: 38px !important;
    min-height: 38px !important;
    max-height: 38px !important;
    display: flex !important;
    align-items: center !important;
    margin-bottom: 16px !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

.kyraAdminHeaderLine .kyraAdminCardTitle {
    margin: 0 !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    line-height: 36px !important;
    display: inline-flex !important;
    align-items: center !important;
    white-space: nowrap !important;
}

/* Left panel and right panel proportions */
.kyraAdminServiceLeftPanel {
    width: 48% !important;
    max-width: 48% !important;
    flex-shrink: 0 !important;
}

.kyraAdminServiceRightPanel {
    width: 50% !important;
    max-width: 50% !important;
    flex: 1 !important;
}

/* Center vertical divider between two columns */
.kyraAdminServiceVerticalDivider {
    width: 1px !important;
    min-width: 1px !important;
    background: #E2E8F0 !important;
    background-color: #E2E8F0 !important;
    margin: 0 16px !important;
    align-self: stretch !important;
    flex-shrink: 0 !important;
}

/* Table Column Widths and Centering */
#adminBusinessSectorsTable {
    width: 100% !important;
    border-collapse: separate !important;
}

#adminBusinessSectorsTable th {
    height: 40px !important;
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-bottom: 1px solid #E2E8F0 !important;
    padding: 0 14px !important;
}

#adminBusinessSectorsTable .kyraAdminColHeader {
    font-size: 11.5px !important;
    font-weight: 700 !important;
    color: #475569 !important;
    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;
}

#adminBusinessSectorsTable .kyraAdminTableRow {
    height: 48px !important;
    min-height: 48px !important;
    border-bottom: 1px solid #F1F5F9 !important;
}

#adminBusinessSectorsTable .kyraAdminTableRow:hover {
    background-color: #F8FAFC !important;
}

#adminBusinessSectorsTable td {
    padding: 0 14px !important;
    vertical-align: middle !important;
}

/* Status Pill in Table */
#adminBusinessSectorsTable .kyraAdminStatusPill {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    background: #E6F7F7 !important;
    background-color: #E6F7F7 !important;
    border-radius: 9999px !important;
    padding: 3px 12px !important;
    margin: 0 auto !important;
    border: 1px solid #99D5CB !important;
}

#adminBusinessSectorsTable .kyraAdminStatusPill .kyraAdminVectorDot {
    background-color: #008C9C !important;
    background: #008C9C !important;
    border-radius: 50% !important;
    width: 6px !important;
    height: 6px !important;
}

#adminBusinessSectorsTable .kyraAdminStatusPill .kyraAdminPillText {
    color: #008C9C !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    line-height: 1 !important;
}

/* Action Buttons in Table */
#adminBusinessSectorsTable .kyraAdminRowActionGroup {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    margin: 0 auto !important;
}

#adminBusinessSectorsTable .kyraAdminSystemEditBtn .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 6px !important;
    width: 32px !important;
    height: 32px !important;
}

#adminBusinessSectorsTable .kyraAdminSystemEditBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-size: 13px !important;
}

#adminBusinessSectorsTable .kyraAdminSystemDeleteBtn .sapMBtnInner {
    background: #FFF1F2 !important;
    background-color: #FFF1F2 !important;
    border: 1px solid #FECDD3 !important;
    border-radius: 6px !important;
    width: 32px !important;
    height: 32px !important;
}

#adminBusinessSectorsTable .kyraAdminSystemDeleteBtn .sapUiIcon {
    color: #EF4444 !important;
    font-size: 13px !important;
}

/* Clean Dashed Placeholder Box in Right Panel */
.kyraAdminNoServicePlaceholder {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px dashed #CBD5E1 !important;
    border-radius: 12px !important;
    padding: 50px 24px !important;
    min-height: 340px !important;
    text-align: center !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
}

.kyraAdminPlaceholderTitle {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin-top: 14px !important;
    margin-bottom: 6px !important;
}

.kyraAdminPlaceholderSubtitle {
    font-size: 13px !important;
    color: #64748B !important;
    max-width: 420px !important;
    text-align: center !important;
    line-height: 1.5 !important;
}
`;

const before = css.substring(0, cssIdx);
const eol = isCRLF ? '\r\n' : '\n';
const formattedRules = newCssRules.replace(/\r?\n/g, eol);
fs.writeFileSync(cssPath, before + formattedRules, 'utf8');
console.log('Successfully updated style.css with exact layout & alignment rules!');

// 2. Update XML in webapp/pages/access/AccessPage.view.xml and webapp/AccessPage.view.xml
const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml'
];

const startMarker = '<HBox id="accessCustomizationSubTabBar"';
const endMarker = '<!-- NEW SECTION: REGION FULL-WIDTH TABLE (Image 3)                 -->';

const newXmlChunk = `<HBox id="accessCustomizationSubTabBar" width="100%" alignItems="Center" class="kyraAccessCustomizationTabBar sapUiSmallMarginBottom">
                            <!-- 1. BUSINESS TAB -->
                            <Button
                                id="btnTabCustomizationBusiness"
                                text="Business"
                                icon="sap-icon://building"
                                type="{= (!\${accessModel>/adminCustomizationSubTab} || \${accessModel>/adminCustomizationSubTab} === 'business') ? 'Emphasized' : 'Default' }"
                                press=".onSelectCustomizationTab"
                                class="kyraCustomizationTabBtn">
                                <customData>
                                    <core:CustomData key="tabKey" value="business" writeToDom="true" />
                                    <core:CustomData key="active" value="{= (!\${accessModel>/adminCustomizationSubTab} || \${accessModel>/adminCustomizationSubTab} === 'business') ? 'true' : 'false' }" writeToDom="true" />
                                </customData>
                            </Button>

                            <!-- 2. REGION TAB -->
                            <Button
                                id="btnTabCustomizationRegion"
                                text="Region"
                                icon="sap-icon://map-pin"
                                type="{= \${accessModel>/adminCustomizationSubTab} === 'region' ? 'Emphasized' : 'Default' }"
                                press=".onSelectCustomizationTab"
                                class="kyraCustomizationTabBtn">
                                <customData>
                                    <core:CustomData key="tabKey" value="region" writeToDom="true" />
                                    <core:CustomData key="active" value="{= \${accessModel>/adminCustomizationSubTab} === 'region' ? 'true' : 'false' }" writeToDom="true" />
                                </customData>
                            </Button>

                            <!-- 3. SYSTEM TAB -->
                            <Button
                                id="btnTabCustomizationSystem"
                                text="System"
                                icon="sap-icon://action-settings"
                                type="{= \${accessModel>/adminCustomizationSubTab} === 'system' ? 'Emphasized' : 'Default' }"
                                press=".onSelectCustomizationTab"
                                class="kyraCustomizationTabBtn">
                                <customData>
                                    <core:CustomData key="tabKey" value="system" writeToDom="true" />
                                    <core:CustomData key="active" value="{= \${accessModel>/adminCustomizationSubTab} === 'system' ? 'true' : 'false' }" writeToDom="true" />
                                </customData>
                            </Button>

                            <!-- 4. CONFLICT TAB -->
                            <Button
                                id="btnTabCustomizationConflict"
                                text="Conflict"
                                icon="sap-icon://alert"
                                type="{= \${accessModel>/adminCustomizationSubTab} === 'conflict' ? 'Emphasized' : 'Default' }"
                                press=".onSelectCustomizationTab"
                                class="kyraCustomizationTabBtn">
                                <customData>
                                    <core:CustomData key="tabKey" value="conflict" writeToDom="true" />
                                    <core:CustomData key="active" value="{= \${accessModel>/adminCustomizationSubTab} === 'conflict' ? 'true' : 'false' }" writeToDom="true" />
                                </customData>
                            </Button>
                        </HBox>

                        <!-- ========================================================================= -->
                        <!-- STEP 1: SYSTEMS LIST & GOVERNANCE VIEW (Services are CUT from this step)  -->
                        <!-- ========================================================================= -->
                        <VBox id="adminAccessCustomizationSystemsStep"
                            visible="{= !\${accessModel>/adminCustomizationStep} || \${accessModel>/adminCustomizationStep} === 1 }"
                            width="100%">

                        <!-- ============================================================== -->
                        <!-- 2. UNIFIED CARD: BUSINESS SECTORS [LEFT] &amp; BUSINESS FUNCTION DETAILS [RIGHT] -->
                        <!-- ============================================================== -->
                        <VBox class="kyraAdminWhiteCard kyraAdminUnifiedServiceCard sapUiSmallMarginBottom" width="100%" visible="{= !\${accessModel>/adminCustomizationSubTab} || \${accessModel>/adminCustomizationSubTab} === 'business' }">
                            <HBox width="100%" justifyContent="SpaceBetween" alignItems="Stretch" class="kyraAdminBottomSplitRow kyraAdminUnifiedServiceRow">
                                <!-- Left Panel: Business Sectors -->
                                <VBox width="48%" class="kyraAdminServiceLeftPanel">
                                    <!-- Left Header: Title, Search, and Add Button -->
                                    <HBox alignItems="Center" justifyContent="SpaceBetween" class="kyraAdminHeaderLine sapUiSmallMarginBottom">
                                        <Title text="{= 'Business Sectors (' + (\${accessModel>/adminBusinessSectors} ? \${accessModel>/adminBusinessSectors}.length : 0) + ')' }" level="H4" class="kyraAdminCardTitle" />
                                        <HBox alignItems="Center" gap="10px">
                                            <SearchField
                                                placeholder="Search sector..."
                                                width="180px"
                                                liveChange=".onSearchAdminBusinessSectors"
                                                class="kyraAdminSearchField" />
                                            <Button
                                                text="Add Business Sector"
                                                icon="sap-icon://add"
                                                type="Emphasized"
                                                press=".onAddAdminBusinessSector"
                                                class="kyraAdminAddBlueBtn" />
                                        </HBox>
                                    </HBox>

                                    <!-- Left Table -->
                                    <Table id="adminBusinessSectorsTable"
                                        noDataText="No business sectors created yet. Click '+ Add Business Sector' to create one."
                                        items="{accessModel>/adminBusinessSectors}"
                                        fixedLayout="true"
                                        class="sapUiNoMargin kyraAdminCleanTable kyraAdminServiceTable">
                                        <columns>
                                            <Column width="52%" hAlign="Begin" class="kyraColText"><Text text="BUSINESS SECTOR" class="kyraAdminColHeader" /></Column>
                                            <Column width="24%" hAlign="Center" class="kyraColStatus"><Text text="STATUS" class="kyraAdminColHeader" /></Column>
                                            <Column width="24%" hAlign="Center" class="kyraColActions"><Text text="ACTIONS" class="kyraAdminColHeader" /></Column>
                                        </columns>
                                        <items>
                                            <ColumnListItem
                                                vAlign="Middle"
                                                type="Active"
                                                press=".onSelectAdminBusinessSectorRow"
                                                class="kyraAdminTableRow kyraAdminClickableRow">
                                                <customData>
                                                    <core:CustomData key="selectedService" value="{= \${accessModel>selected} ? 'true' : 'false' }" writeToDom="true" />
                                                    <core:CustomData key="selectedSector" value="{= \${accessModel>selected} ? 'true' : 'false' }" writeToDom="true" />
                                                </customData>
                                                <cells>
                                                    <Text text="{accessModel>sectorName}" class="kyraAdminCellBold" />
                                                    <HBox alignItems="Center" justifyContent="Center" class="kyraAdminStatusPill">
                                                        <customData>
                                                            <core:CustomData key="status" value="{accessModel>status}" writeToDom="true" />
                                                        </customData>
                                                        <HBox class="kyraAdminVectorDot" />
                                                        <Text text="{accessModel>status}" class="kyraAdminPillText" />
                                                    </HBox>
                                                    <HBox alignItems="Center" justifyContent="Center" class="kyraAdminRowActionGroup">
                                                        <Button
                                                            icon="sap-icon://edit"
                                                            press=".onEditAdminBusinessSector"
                                                            class="kyraAdminSystemEditBtn"
                                                            tooltip="Edit Business Sector" />
                                                        <Button
                                                            icon="sap-icon://delete"
                                                            press=".onDeleteAdminBusinessSector"
                                                            class="kyraAdminSystemDeleteBtn"
                                                            tooltip="Delete Business Sector" />
                                                    </HBox>
                                                </cells>
                                            </ColumnListItem>
                                        </items>
                                    </Table>
                                </VBox>

                                <!-- VERTICAL DIVIDER -->
                                <VBox class="kyraAdminServiceVerticalDivider" />

                                <!-- Right Panel: Business Function Details -->
                                <VBox width="50%" class="kyraAdminServiceRightPanel">
                                    <!-- Right Header: Business Function Details Heading & Action -->
                                    <HBox alignItems="Center" justifyContent="SpaceBetween" class="kyraAdminHeaderLine sapUiSmallMarginBottom">
                                        <HBox alignItems="Center" gap="10px">
                                            <Title text="Business Function Details" level="H4" class="kyraAdminCardTitle" />
                                            <Text
                                                visible="{= !!\${accessModel>/selectedAdminBusinessSectorName} }"
                                                text="{\${accessModel>/selectedAdminBusinessSectorName}}"
                                                class="kyraAdminSelectedSectorSubtitle" />
                                        </HBox>
                                        <Button
                                            visible="{= !!\${accessModel>/selectedAdminBusinessSectorName} }"
                                            text="Add Business Function"
                                            icon="sap-icon://add"
                                            type="Emphasized"
                                            press=".onAddAdminBusinessFunction"
                                            class="kyraAdminAddBlueBtn" />
                                    </HBox>

                                    <!-- Clean Empty State when no Business Sector is selected (Exact match to image) -->
                                    <VBox
                                        visible="{= !\${accessModel>/selectedAdminBusinessSectorName} }"
                                        alignItems="Center"
                                        justifyContent="Center"
                                        class="kyraAdminNoServicePlaceholder"
                                        width="100%">
                                        <core:Icon src="sap-icon://line-chart" size="48px" color="#94A3B8" class="sapUiSmallMarginBottom" />
                                        <Text text="No Business Sector Selected" class="kyraAdminPlaceholderTitle sapUiTinyMarginBottom" />
                                        <Text text="Select a business sector from the left list to view or configure details, or click '+ Add Business Sector' to create a new one." class="kyraAdminPlaceholderSubtitle" />
                                    </VBox>

                                    <!-- Inner Content: Visible ONLY when a Sector is selected -->
                                    <VBox visible="{= !!\${accessModel>/selectedAdminBusinessSectorName} }" width="100%">
                                        <Text
                                            text="{= 'Business Functions (' + (\${accessModel>/adminBusinessFunctions} ? \${accessModel>/adminBusinessFunctions}.length : 0) + ')' }"
                                            class="kyraAdminSubPanelTitle sapUiTinyMarginBottom" />

                                            <Text text="No business functions added yet. Click '+ Add Business Function' above."
                                                  visible="{= !\${accessModel>/adminBusinessFunctions} || \${accessModel>/adminBusinessFunctions}.length === 0 }"
                                                  class="kyraAdminEmptyPlaceholderText sapUiSmallMarginBottom" />

                                            <VBox items="{accessModel>/adminBusinessFunctions}" class="kyraAdminBusinessFunctionListContainer" width="100%">
                                                <HBox alignItems="Center" justifyContent="SpaceBetween" class="kyraAdminBusinessFunctionItemCard sapUiTinyMarginBottom" width="100%">
                                                    <HBox alignItems="Center">
                                                        <HBox class="kyraVectorTealDot sapUiSmallMarginEnd" />
                                                        <Text text="{accessModel>name}" class="kyraAdminBusinessFunctionName" />
                                                    </HBox>
                                                    <HBox alignItems="Center" class="kyraAdminRowActionGroup">
                                                        <Button
                                                            icon="sap-icon://edit"
                                                            press=".onEditAdminBusinessFunction"
                                                            class="kyraAdminSystemEditBtn kyraAdminMiniActionBtn"
                                                            tooltip="Edit Function" />
                                                        <Button
                                                            icon="sap-icon://delete"
                                                            press=".onDeleteAdminBusinessFunction"
                                                            class="kyraAdminSystemDeleteBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                            tooltip="Delete Function" />
                                                    </HBox>
                                                </HBox>
                                            </VBox>
                                        </VBox>

                                    <!-- Bottom Right Footer Buttons: Cancel & Save -->
                                    <HBox visible="{= !!\${accessModel>/selectedAdminBusinessSectorName} }" width="100%" justifyContent="End" alignItems="Center" class="kyraAdminServiceDetailsFooter sapUiMediumMarginTop">
                                        <Button
                                            text="Cancel"
                                            press=".onCancelAdminBusinessFunctions"
                                            class="kyraAdminCancelBtn sapUiSmallMarginEnd" />
                                        <Button
                                            text="Save"
                                            type="Emphasized"
                                            press=".onSaveAdminBusinessFunctions"
                                            class="kyraAdminSaveBtn" />
                                    </HBox>
                                </VBox>
                            </HBox>
                        </VBox>
`;

xmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const isFileCRLF = content.includes('\r\n');
    const eolChar = isFileCRLF ? '\r\n' : '\n';

    const pStart = content.indexOf(startMarker);
    const pEnd = content.indexOf(endMarker);

    if (pStart === -1 || pEnd === -1) {
        console.error('Markers not found in', filePath, pStart, pEnd);
        return;
    }

    const beforePart = content.substring(0, pStart);
    const afterPart = content.substring(pEnd);
    const formattedChunk = newXmlChunk.replace(/\r?\n/g, eolChar);

    const updatedContent = beforePart + formattedChunk + eolChar + '                        ' + afterPart;
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log('Successfully updated XML in', filePath);
});
