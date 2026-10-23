const fs = require('fs');

// 1. Update the XML view files
const viewFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml'
];

const newSubTabBarXml = '<HBox id="accessCustomizationSubTabBar" width="100%" alignItems="Center" class="kyraAccessCustomizationTabBar sapUiSmallMarginBottom">\n' +
'                            <!-- 1. BUSINESS TAB -->\n' +
'                            <Button\n' +
'                                id="btnTabCustomizationBusiness"\n' +
'                                text="Business"\n' +
'                                icon="sap-icon://building"\n' +
'                                type="{= (!${accessModel>/adminCustomizationSubTab} || ${accessModel>/adminCustomizationSubTab} === \'business\') ? \'Emphasized\' : \'Default\' }"\n' +
'                                press=".onSelectCustomizationTab"\n' +
'                                class="kyraCustomizationTabBtn">\n' +
'                                <layoutData>\n' +
'                                    <FlexItemData growFactor="1" baseSize="25%" styleClass="kyraCustomizationTabFlexItem" />\n' +
'                                </layoutData>\n' +
'                                <customData>\n' +
'                                    <core:CustomData key="tabKey" value="business" writeToDom="true" />\n' +
'                                    <core:CustomData key="active" value="{= (!${accessModel>/adminCustomizationSubTab} || ${accessModel>/adminCustomizationSubTab} === \'business\') ? \'true\' : \'false\' }" writeToDom="true" />\n' +
'                                </customData>\n' +
'                            </Button>\n' +
'\n' +
'                            <!-- 2. REGION TAB -->\n' +
'                            <Button\n' +
'                                id="btnTabCustomizationRegion"\n' +
'                                text="Region"\n' +
'                                icon="sap-icon://marker"\n' +
'                                type="{= ${accessModel>/adminCustomizationSubTab} === \'region\' ? \'Emphasized\' : \'Default\' }"\n' +
'                                press=".onSelectCustomizationTab"\n' +
'                                class="kyraCustomizationTabBtn">\n' +
'                                <layoutData>\n' +
'                                    <FlexItemData growFactor="1" baseSize="25%" styleClass="kyraCustomizationTabFlexItem" />\n' +
'                                </layoutData>\n' +
'                                <customData>\n' +
'                                    <core:CustomData key="tabKey" value="region" writeToDom="true" />\n' +
'                                    <core:CustomData key="active" value="{= ${accessModel>/adminCustomizationSubTab} === \'region\' ? \'true\' : \'false\' }" writeToDom="true" />\n' +
'                                </customData>\n' +
'                            </Button>\n' +
'\n' +
'                            <!-- 3. SYSTEM TAB -->\n' +
'                            <Button\n' +
'                                id="btnTabCustomizationSystem"\n' +
'                                text="System"\n' +
'                                icon="sap-icon://action-settings"\n' +
'                                type="{= ${accessModel>/adminCustomizationSubTab} === \'system\' ? \'Emphasized\' : \'Default\' }"\n' +
'                                press=".onSelectCustomizationTab"\n' +
'                                class="kyraCustomizationTabBtn">\n' +
'                                <layoutData>\n' +
'                                    <FlexItemData growFactor="1" baseSize="25%" styleClass="kyraCustomizationTabFlexItem" />\n' +
'                                </layoutData>\n' +
'                                <customData>\n' +
'                                    <core:CustomData key="tabKey" value="system" writeToDom="true" />\n' +
'                                    <core:CustomData key="active" value="{= ${accessModel>/adminCustomizationSubTab} === \'system\' ? \'true\' : \'false\' }" writeToDom="true" />\n' +
'                                </customData>\n' +
'                            </Button>\n' +
'\n' +
'                            <!-- 4. CONFLICT TAB -->\n' +
'                            <Button\n' +
'                                id="btnTabCustomizationConflict"\n' +
'                                text="Conflict"\n' +
'                                icon="sap-icon://alert"\n' +
'                                type="{= ${accessModel>/adminCustomizationSubTab} === \'conflict\' ? \'Emphasized\' : \'Default\' }"\n' +
'                                press=".onSelectCustomizationTab"\n' +
'                                class="kyraCustomizationTabBtn">\n' +
'                                <layoutData>\n' +
'                                    <FlexItemData growFactor="1" baseSize="25%" styleClass="kyraCustomizationTabFlexItem" />\n' +
'                                </layoutData>\n' +
'                                <customData>\n' +
'                                    <core:CustomData key="tabKey" value="conflict" writeToDom="true" />\n' +
'                                    <core:CustomData key="active" value="{= ${accessModel>/adminCustomizationSubTab} === \'conflict\' ? \'true\' : \'false\' }" writeToDom="true" />\n' +
'                                </customData>\n' +
'                            </Button>\n' +
'                        </HBox>';

viewFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const startIdx = content.indexOf('<HBox id="accessCustomizationSubTabBar"');
    if (startIdx === -1) {
        console.error('Could not find sub-tab bar in', file);
        return;
    }
    const endIdx = content.indexOf('</HBox>', startIdx) + 7;
    content = content.substring(0, startIdx) + newSubTabBarXml + content.substring(endIdx);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated sub-tab bar XML in', file);
});

// 2. Update CSS in webapp/css/style.css
const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');
const targetStart = css.indexOf('.kyraAccessCustomizationTabBar,');
if (targetStart === -1) {
    console.error('Target not found in style.css');
    process.exit(1);
}

const updatedCSS = `/* ========================================================================= */
/* KYRA ACCESS CUSTOMIZATION SUB-NAV BAR (4 TABS, FULL WIDTH, EQUAL SPACING) */
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
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
}

/* 4 Equal Width Flex Items (Each 25% of the full bar) */
.kyraAccessCustomizationTabBar > .sapMFlexItem,
.kyraAccessCustomizationTabBar .kyraCustomizationTabFlexItem,
#accessCustomizationSubTabBar > .sapMFlexItem,
html body [id$="accessCustomizationSubTabBar"] > .sapMFlexItem {
    flex: 1 1 25% !important;
    width: 25% !important;
    min-width: 25% !important;
    max-width: 25% !important;
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 4px !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    position: relative !important;
}

/* Centered Subtle Vertical Divider Lines Between the Flex Items */
.kyraAccessCustomizationTabBar > .sapMFlexItem:not(:last-child)::after,
.kyraAccessCustomizationTabBar .kyraCustomizationTabFlexItem:not(:last-child)::after,
#accessCustomizationSubTabBar > .sapMFlexItem:not(:last-child)::after,
html body [id$="accessCustomizationSubTabBar"] > .sapMFlexItem:not(:last-child)::after {
    content: "" !important;
    position: absolute !important;
    right: 0 !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 1px !important;
    height: 22px !important;
    background: #E2E8F0 !important;
    background-color: #E2E8F0 !important;
    pointer-events: none !important;
    z-index: 5 !important;
}

/* Base Tab Button (Outer Button Wrapper): Fills 100% of its 25% Flex Item */
.kyraCustomizationTabBtn,
.kyraCustomizationTabBtn.sapMBtn,
.kyraAccessCustomizationTabBar .sapMBtn,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn,
#accessCustomizationSubTabBar .sapMBtn {
    flex: 1 1 auto !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 42px !important;
    min-height: 42px !important;
    max-height: 42px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    border-right: none !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    vertical-align: middle !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Inner Pill Structure: Inactive State (Clean Transparent Segment) */
.kyraCustomizationTabBtn .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtn .sapMBtnInner,
.kyraAccessCustomizationTabBar .sapMBtn .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn .sapMBtnInner {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
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
.kyraAccessCustomizationTabBar .sapMBtn .sapMBtnContent,
.kyraCustomizationTabBtn .sapMBtnContent,
#accessCustomizationSubTabBar .sapMBtn bdi,
.kyraAccessCustomizationTabBar .sapMBtn bdi,
.kyraCustomizationTabBtn bdi {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
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
.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized) .sapUiIcon,
.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized) .sapMBtnIcon,
.kyraAccessCustomizationTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized) .sapUiIcon,
.kyraAccessCustomizationTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized) .sapMBtnIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized) .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized) .sapUiIcon {
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
.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapMBtnInner,
.kyraAccessCustomizationTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapMBtnInner {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #E2E8F0 !important;
}

.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapMBtnContent,
.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover bdi,
.kyraAccessCustomizationTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover bdi,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover bdi,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover bdi {
    color: #008C9C !important;
}

.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapUiIcon,
.kyraCustomizationTabBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapMBtnIcon,
.kyraAccessCustomizationTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn:not(.kyraCustomizationTabBtnActive):not([data-active="true"]):not(.sapMBtnEmphasized):hover .sapUiIcon {
    color: #008C9C !important;
}

/* ========================================================================= */
/* ACTIVE TAB STATE: Solid KYRA Brand Teal Fill (#008C9C) Matching Image     */
/* ========================================================================= */
.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraCustomizationTabBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraCustomizationTabBtn[data-active="true"] .sapMBtnInner,
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapMBtnInner,
.kyraAccessCustomizationTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapMBtnInner,
.kyraAccessCustomizationTabBar .sapMBtn[data-active="true"] .sapMBtnInner,
.kyraAccessCustomizationTabBar .sapMBtn.sapMBtnEmphasized .sapMBtnInner,
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
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapMBtnContent,
.kyraAccessCustomizationTabBar .sapMBtn.kyraCustomizationTabBtnActive bdi,
.kyraAccessCustomizationTabBar .sapMBtn[data-active="true"] bdi,
.kyraAccessCustomizationTabBar .sapMBtn.sapMBtnEmphasized bdi,
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
.kyraCustomizationTabBtn.sapMBtnEmphasized .sapMBtnIcon,
.kyraAccessCustomizationTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
.kyraAccessCustomizationTabBar .sapMBtn[data-active="true"] .sapUiIcon,
.kyraAccessCustomizationTabBar .sapMBtn.sapMBtnEmphasized .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn[data-active="true"] .sapUiIcon,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.sapMBtnEmphasized .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn[data-active="true"] .sapUiIcon,
#accessCustomizationSubTabBar .sapMBtn.sapMBtnEmphasized .sapUiIcon {
    color: #FFFFFF !important;
    font-size: 16px !important;
}

/* Active Hover State */
.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
.kyraCustomizationTabBtnActive.sapMBtn:hover .sapMBtnInner,
.kyraAccessCustomizationTabBar .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
html body [id$="accessCustomizationSubTabBar"] .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner,
#accessCustomizationSubTabBar .sapMBtn.kyraCustomizationTabBtnActive:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
}

/* Ensure focus outline doesn't look blue or misaligned */
.kyraCustomizationTabBtn:focus,
.kyraCustomizationTabBtn .sapMBtnInner:focus,
#accessCustomizationSubTabBar .sapMBtn:focus,
#accessCustomizationSubTabBar .sapMBtn .sapMBtnInner:focus {
    outline: none !important;
}

/* ========================================================================= */
/* UNIFIED WHITE CARD & TWO-COLUMN SIDE-BY-SIDE SPLIT (MATCHING IMAGE)       */
/* ========================================================================= */
.kyraAdminUnifiedServiceCard {
    padding: 20px 24px !important;
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: 100% !important;
}

.kyraAdminUnifiedServiceCard .kyraAdminBottomSplitRow,
.kyraAdminUnifiedServiceRow {
    padding: 0 !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: stretch !important;
    justify-content: space-between !important;
    width: 100% !important;
    gap: 0 !important;
    box-sizing: border-box !important;
}

/* Header line on both left & right: exact same 38px height & vertical center */
.kyraAdminHeaderLine,
.sapMFlexBox.kyraAdminHeaderLine {
    height: 38px !important;
    min-height: 38px !important;
    max-height: 38px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
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
    width: calc(50% - 16px) !important;
    max-width: calc(50% - 16px) !important;
    flex: 0 0 calc(50% - 16px) !important;
    padding-right: 16px !important;
    box-sizing: border-box !important;
    min-width: 0 !important;
}

/* Center vertical divider between two columns */
.kyraAdminServiceVerticalDivider {
    width: 1px !important;
    min-width: 1px !important;
    max-width: 1px !important;
    background: #E2E8F0 !important;
    background-color: #E2E8F0 !important;
    margin: 0 !important;
    align-self: stretch !important;
    flex-shrink: 0 !important;
}

.kyraAdminServiceRightPanel {
    width: calc(50% - 16px) !important;
    max-width: calc(50% - 16px) !important;
    flex: 0 0 calc(50% - 16px) !important;
    padding-left: 16px !important;
    box-sizing: border-box !important;
    min-width: 0 !important;
    display: flex !important;
    flex-direction: column !important;
}

/* Table Container Box & Header */
#adminBusinessSectorsTable,
div[id$="adminBusinessSectorsTable"],
.sapMTable#adminBusinessSectorsTable,
.kyraAdminServiceTable {
    border: 1px solid #E2E8F0 !important;
    border-radius: 10px !important;
    overflow: hidden !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

#adminBusinessSectorsTable table,
div[id$="adminBusinessSectorsTable"] table {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    width: 100% !important;
}

#adminBusinessSectorsTable th,
div[id$="adminBusinessSectorsTable"] th {
    height: 42px !important;
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-bottom: 1px solid #E2E8F0 !important;
    border-top: none !important;
    padding: 0 16px !important;
    vertical-align: middle !important;
}

#adminBusinessSectorsTable .kyraAdminColHeader {
    font-size: 11.5px !important;
    font-weight: 700 !important;
    color: #64748B !important;
    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;
}

#adminBusinessSectorsTable .kyraAdminTableRow {
    height: 52px !important;
    min-height: 52px !important;
    border-bottom: 1px solid #F1F5F9 !important;
}

#adminBusinessSectorsTable tr:last-child td,
div[id$="adminBusinessSectorsTable"] tr:last-child td {
    border-bottom: none !important;
}

#adminBusinessSectorsTable .kyraAdminTableRow:hover {
    background-color: #F8FAFC !important;
}

#adminBusinessSectorsTable td {
    padding: 0 16px !important;
    vertical-align: middle !important;
}

#adminBusinessSectorsTable td .kyraAdminCellBold {
    font-size: 13.5px !important;
    font-weight: 500 !important;
    color: #1E293B !important;
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
    padding: 4px 12px !important;
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

#adminBusinessSectorsTable .kyraAdminSystemEditBtn,
#adminBusinessSectorsTable .kyraAdminSystemDeleteBtn {
    width: 32px !important;
    min-width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    margin: 0 !important;
}

#adminBusinessSectorsTable .kyraAdminSystemEditBtn .sapMBtnInner {
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 6px !important;
    width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
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
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
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
    padding: 40px 24px !important;
    min-height: 220px !important;
    flex: 1 1 auto !important;
    height: 100% !important;
    text-align: center !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
}

.kyraAdminNoServicePlaceholder .sapUiIcon {
    color: #94A3B8 !important;
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

const newCss = css.substring(0, targetStart) + updatedCSS;
fs.writeFileSync(cssPath, newCss, 'utf8');
console.log('Successfully updated webapp/css/style.css');
