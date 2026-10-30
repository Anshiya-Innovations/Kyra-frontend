const fs = require('fs');

const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml',
    'dist/AccessPage.view.xml'
];

const newTargetSystemsXml = `<VBox visible="{= !\\\${accessModel>/isEditingFromSummary} &amp;&amp; \\\${accessModel>/hasRegionalSystems} !== false }" class="sapUiSmallMarginBottom kyraTargetSystemsContainer">
                                <Title text="Target Systems &amp; Process Selection" level="H5" class="kyraTargetSystemsTitle sapUiTinyMarginBottom" />
                                
                                <Label text="Select Target Systems &amp; Processes" required="true" class="kyraTargetSystemsLabel sapUiTinyMarginBottom" labelFor="inPageSystemsMultiSelect" />
                                
                                <HBox alignItems="Center" gap="12px" class="kyraTargetSystemsRow">
                                    <MultiComboBox
                                        id="inPageSystemsMultiSelect"
                                        selectedKeys="{accessModel>/addAccessSelectedSystems}"
                                        selectionChange=".onInPageTargetSystemsSelectionChange"
                                        selectionFinish=".onInPageTargetSystemsSelectionChange"
                                        items="{accessModel>/activeAdminSystems}"
                                        placeholder="Select target system processes..."
                                        width="460px"
                                        enabled="{= !\\\${accessModel>/isTargetSystemsConfirmed} }"
                                        class="fioriFormSelect kyraTargetSystemsSelect">
                                        <core:Item key="{accessModel>systemName}" text="{accessModel>systemName}" />
                                    </MultiComboBox>

                                    <!-- ACTION BUTTONS ALIGNED RIGHT NEXT TO THE DROPDOWN -->
                                    <HBox alignItems="Center" gap="8px" class="kyraTargetSystemsActionBtns">
                                        <Button
                                            id="btnEditTargetSystems"
                                            text="Edit"
                                            icon="sap-icon://edit"
                                            type="Default"
                                            press=".onEditTargetSystemsSelection"
                                            visible="{accessModel>/isTargetSystemsConfirmed}"
                                            class="kyraSecondaryBtn" />
                                        <Button
                                            id="btnConfirmTargetSystems"
                                            text="Confirm"
                                            icon="sap-icon://accept"
                                            type="Emphasized"
                                            press=".onConfirmTargetSystemsSelection"
                                            enabled="{= !\\\${accessModel>/isTargetSystemsConfirmed} }"
                                            class="kyraPrimaryBtn" />
                                    </HBox>
                                </HBox>
                            </VBox>`;

xmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let raw = fs.readFileSync(f, 'utf8');
    const isCRLF = raw.includes('\r\n');
    let c = raw.replace(/\r\n/g, '\n');

    const searchStart = '<form:SimpleForm\n                                editable="false"\n                                layout="ColumnLayout"\n                                columnsM="2"\n                                columnsL="2"\n                                singleContainerFullWidth="false"\n                                visible="{= !${accessModel>/isEditingFromSummary} &amp;&amp; ${accessModel>/hasRegionalSystems} !== false }"\n                                class="sapUiSmallMarginBottom">';
    const searchEnd = 'class="kyraPrimaryBtn" />\n                            </HBox>';

    const idxStart = c.indexOf(searchStart);
    if (idxStart !== -1) {
        const idxEnd = c.indexOf(searchEnd, idxStart);
        if (idxEnd !== -1) {
            const fullEnd = idxEnd + searchEnd.length;
            c = c.slice(0, idxStart) + newTargetSystemsXml + c.slice(fullEnd);
            if (isCRLF) {
                c = c.replace(/\n/g, '\r\n');
            }
            fs.writeFileSync(f, c, 'utf8');
            console.log(`Replaced Target Systems layout in ${f}`);
        } else {
            console.warn(`Could not find searchEnd in ${f}`);
        }
    } else {
        console.warn(`Could not find searchStart in ${f}`);
    }
});
