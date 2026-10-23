const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml'
];

const oldTabBarBlock = `<HBox id="accessCustomizationSubTabBar" width="100%" alignItems="Center" class="kyraAccessCustomizationTabBar sapUiSmallMarginBottom">
                            <!-- 1. BUSSINESS TAB -->
                            <Button
                                id="btnTabCustomizationBusiness"
                                text="Bussiness"
                                icon="sap-icon://business-objects-mobile"
                                type="Default"
                                press=".onSelectCustomizationTab"
                                class="{= 'kyraCustomizationTabBtn' + (!\${accessModel>/adminCustomizationSubTab} || \${accessModel>/adminCustomizationSubTab} === 'business' ? ' kyraCustomizationTabBtnActive' : '') }">
                                <customData>
                                    <core:CustomData key="tabKey" value="business" writeToDom="true" />
                                </customData>
                            </Button>

                            <!-- 2. REAGION TAB -->
                            <Button
                                id="btnTabCustomizationRegion"
                                text="Reagion"
                                icon="sap-icon://locate-me"
                                type="Default"
                                press=".onSelectCustomizationTab"
                                class="{= 'kyraCustomizationTabBtn' + (\${accessModel>/adminCustomizationSubTab} === 'region' ? ' kyraCustomizationTabBtnActive' : '') }">
                                <customData>
                                    <core:CustomData key="tabKey" value="region" writeToDom="true" />
                                </customData>
                            </Button>

                            <!-- 3. SYSTEM TAB -->
                            <Button
                                id="btnTabCustomizationSystem"
                                text="system"
                                icon="sap-icon://it-system"
                                type="Default"
                                press=".onSelectCustomizationTab"
                                class="{= 'kyraCustomizationTabBtn' + (\${accessModel>/adminCustomizationSubTab} === 'system' ? ' kyraCustomizationTabBtnActive' : '') }">
                                <customData>
                                    <core:CustomData key="tabKey" value="system" writeToDom="true" />
                                </customData>
                            </Button>

                            <!-- 4. CONFLICT TAB -->
                            <Button
                                id="btnTabCustomizationConflict"
                                text="conflict"
                                icon="sap-icon://alert"
                                type="Default"
                                press=".onSelectCustomizationTab"
                                class="{= 'kyraCustomizationTabBtn' + (\${accessModel>/adminCustomizationSubTab} === 'conflict' ? ' kyraCustomizationTabBtnActive' : '') }">
                                <customData>
                                    <core:CustomData key="tabKey" value="conflict" writeToDom="true" />
                                </customData>
                            </Button>
                        </HBox>`;

const newTabBarBlock = `<HBox id="accessCustomizationSubTabBar" width="100%" alignItems="Center" class="kyraAccessCustomizationTabBar sapUiSmallMarginBottom">
                            <!-- 1. BUSINESS TAB -->
                            <Button
                                id="btnTabCustomizationBusiness"
                                text="Business"
                                icon="sap-icon://business-objects-mobile"
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
                                icon="sap-icon://locate-me"
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
                                icon="sap-icon://it-system"
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
                        </HBox>`;

const oldConflictCard = `<!-- 2. BOTTOM FULL-WIDTH CARD: CUSTOM CONFLICT SECTION (Configure Conflicts from Systems, Services, Teams &amp; Personas above) -->
                        <VBox class="kyraAdminWhiteCard sapUiSmallMarginTop" width="100%">`;

const newConflictCard = `<!-- 4. BOTTOM FULL-WIDTH CARD: CUSTOM CONFLICT SECTION (Visible ONLY when Conflict sub-tab is selected) -->
                        <VBox class="kyraAdminWhiteCard sapUiSmallMarginTop" width="100%" visible="{= \${accessModel>/adminCustomizationSubTab} === 'conflict' }">`;

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const isCRLF = content.includes('\r\n');
    const normalize = str => isCRLF ? str.replace(/\r?\n/g, '\r\n') : str.replace(/\r?\n/g, '\n');

    const searchTab = normalize(oldTabBarBlock);
    const repTab = normalize(newTabBarBlock);
    const searchConflict = normalize(oldConflictCard);
    const repConflict = normalize(newConflictCard);

    if (!content.includes(searchTab)) {
        console.error('Could not find searchTab in', filePath);
    } else {
        content = content.replace(searchTab, repTab);
        console.log('Replaced Tab Bar in', filePath);
    }

    if (!content.includes(searchConflict)) {
        console.error('Could not find searchConflict in', filePath);
    } else {
        content = content.replace(searchConflict, repConflict);
        console.log('Replaced Conflict Card in', filePath);
    }

    fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Done updating XML views!');
