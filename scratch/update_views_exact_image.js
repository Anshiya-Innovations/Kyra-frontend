const fs = require('fs');

const files = [
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
                                class="{= 'kyraCustomizationTabBtn' + (!\${accessModel>/adminCustomizationSubTab} || \${accessModel>/adminCustomizationSubTab} === 'business' ? ' kyraCustomizationTabBtnActive' : '') }">
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
                                class="{= 'kyraCustomizationTabBtn' + (\${accessModel>/adminCustomizationSubTab} === 'region' ? ' kyraCustomizationTabBtnActive' : '') }">
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
                                class="{= 'kyraCustomizationTabBtn' + (\${accessModel>/adminCustomizationSubTab} === 'system' ? ' kyraCustomizationTabBtnActive' : '') }">
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
                                class="{= 'kyraCustomizationTabBtn' + (\${accessModel>/adminCustomizationSubTab} === 'conflict' ? ' kyraCustomizationTabBtnActive' : '') }">
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
                            <!-- ========================================================================= -->
                            <!-- UNIFIED HEADER ROW: Business Sectors (7), Search, Add Button | Business Function Details -->
                            <!-- ========================================================================= -->
                            <HBox width="100%" alignItems="Center" class="kyraAdminUnifiedCardHeader">
                                <!-- Left Header Group: Sectors Title, Search, and Add Button -->
                                <HBox alignItems="Center" class="kyraAdminUnifiedHeaderLeftGroup">
                                    <Title text="{= 'Business Sectors (' + (\${accessModel>/adminBusinessSectors} ? \${accessModel>/adminBusinessSectors}.length : 0) + ')' }" level="H4" class="kyraAdminCardTitle" />
                                    <SearchField
                                        placeholder="Search sector..."
                                        width="190px"
                                        liveChange=".onSearchAdminBusinessSectors"
                                        class="kyraAdminSearchField" />
                                    <Button
                                        text="Add Business Sector"
                                        icon="sap-icon://add"
                                        type="Emphasized"
                                        press=".onAddAdminBusinessSector"
                                        class="kyraAdminAddBlueBtn" />
                                </HBox>

                                <!-- Inline Divider Line (Exact match to image) -->
                                <VBox class="kyraAdminUnifiedHeaderDivider" />

                                <!-- Right Header Group: Business Function Details Heading & Action -->
                                <HBox alignItems="Center" justifyContent="SpaceBetween" class="kyraAdminUnifiedHeaderRightGroup">
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
                            </HBox>

                            <HBox width="100%" justifyContent="SpaceBetween" alignItems="Stretch" class="kyraAdminBottomSplitRow kyraAdminUnifiedServiceRow">
                                <!-- Left Panel: Business Sectors Table -->
                                <VBox width="48%" class="kyraAdminServiceLeftPanel" justifyContent="SpaceBetween">
                                    <Table id="adminBusinessSectorsTable"
                                        noDataText="No business sectors created yet. Click '+ Add Business Sector' to create one."
                                        items="{accessModel>/adminBusinessSectors}"
                                        fixedLayout="true"
                                        class="sapUiNoMargin kyraAdminCleanTable kyraAdminServiceTable">
                                        <columns>
                                            <Column width="50%" hAlign="Begin" class="kyraColText"><Text text="BUSINESS SECTOR" class="kyraAdminColHeader" /></Column>
                                            <Column width="25%" hAlign="Center" class="kyraColStatus"><Text text="STATUS" class="kyraAdminColHeader" /></Column>
                                            <Column width="25%" hAlign="Center" class="kyraColActions"><Text text="ACTIONS" class="kyraAdminColHeader" /></Column>
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
                                <VBox width="50%" class="kyraAdminServiceRightPanel" justifyContent="SpaceBetween">
                                    <VBox width="100%">
                                        <!-- Clean Empty State when no Business Sector is selected (Exact match to Services) -->
                                        <VBox
                                            visible="{= !\${accessModel>/selectedAdminBusinessSectorName} }"
                                            alignItems="Center"
                                            justifyContent="Center"
                                            class="kyraAdminNoServicePlaceholder sapUiLargeMarginTop sapUiLargeMarginBottom"
                                            width="100%">
                                            <core:Icon src="sap-icon://business-objects-experience" size="44px" color="#94A3B8" class="sapUiSmallMarginBottom" />
                                            <Text text="No Business Sector Selected" class="kyraAdminPlaceholderTitle sapUiTinyMarginBottom" />
                                            <Text text="Select a business sector from the left list to view or configure details, or click '+ Add Business Sector' to create a new one." class="kyraAdminPlaceholderSubtitle" />
                                        </VBox>

                                        <!-- Inner Content: Visible ONLY when a Sector is selected -->
                                        <VBox visible="{= !!\${accessModel>/selectedAdminBusinessSectorName} }" width="100%" class="sapUiSmallMarginTop">
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
                                    </VBox>

                                    <!-- Bottom Right Footer Buttons: Cancel & Save -->
                                    <HBox visible="{= !!\${accessModel>/selectedAdminBusinessSectorName} }" width="100%" justifyContent="End" alignItems="Center" class="kyraAdminServiceDetailsFooter">
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

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const isCRLF = content.includes('\r\n');
    const eol = isCRLF ? '\r\n' : '\n';

    const pStart = content.indexOf(startMarker);
    const pEnd = content.indexOf(endMarker);

    if (pStart === -1 || pEnd === -1) {
        console.error('Markers not found in', filePath, pStart, pEnd);
        return;
    }

    const before = content.substring(0, pStart);
    const after = content.substring(pEnd);
    const formatted = newXmlChunk.replace(/\r?\n/g, eol);

    const updated = before + formatted + eol + '                        ' + after;
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Successfully updated XML in', filePath);
});
