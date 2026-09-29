const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

const targetPattern = /<HBox width="100%" wrap="Wrap" alignItems="End" class="sapUiSmallMarginTop">[\s\S]*?<\/HBox>\s*<\/VBox>\s*<!-- Results \/ Feedback Strip -->/;

const replacement = `<HBox width="100%" wrap="Wrap" alignItems="End" class="kyraDeptConversionControlsRow sapUiSmallMarginTop">
                                    <!-- 1. Department Field (ComboBox with typing and selection support) -->
                                    <VBox class="kyraDeptFieldCol" width="340px">
                                        <HBox alignItems="Center" class="kyraAdminFieldLabelRow">
                                            <Text text="Department Name" class="kyraAdminFormLabel" />
                                            <Text text="*" class="kyraAdminRequiredStar" />
                                        </HBox>
                                        <ComboBox
                                            id="adminDeptPersonaComboBox"
                                            value="{accessModel>/departmentPersona/departmentName}"
                                            selectedKey="{accessModel>/departmentPersona/departmentName}"
                                            placeholder="Enter or select department (e.g., IT Developer, Engineering)..."
                                            items="{accessModel>/allAvailableDepartments}"
                                            width="100%"
                                            class="kyraDeptComboBox">
                                            <core:Item key="{accessModel>name}" text="{accessModel>name}" />
                                        </ComboBox>
                                    </VBox>

                                    <!-- 2. Target Persona Dropdown -->
                                    <VBox class="kyraDeptFieldCol" width="240px">
                                        <HBox alignItems="Center" class="kyraAdminFieldLabelRow">
                                            <Text text="Target Persona" class="kyraAdminFormLabel" />
                                            <Text text="*" class="kyraAdminRequiredStar" />
                                        </HBox>
                                        <Select
                                            id="adminDeptTargetPersonaSelect"
                                            selectedKey="{accessModel>/departmentPersona/targetPersona}"
                                            width="100%"
                                            class="kyraDeptSelect">
                                            <core:Item key="Requester" text="Requester" />
                                            <core:Item key="Approver" text="Approver" />
                                            <core:Item key="Compliance Reviewer" text="Compliance Reviewer" />
                                            <core:Item key="Admin" text="Admin" />
                                        </Select>
                                    </VBox>

                                    <!-- 3. Actions: Preview Users & Save Changes (Convert) -->
                                    <HBox alignItems="Center" class="kyraDeptActionBtns">
                                        <Button
                                            id="btnPreviewDepartmentUsers"
                                            text="Preview Users"
                                            icon="sap-icon://search"
                                            press=".onPreviewDepartmentUsers"
                                            class="kyraDeptPreviewBtn" />
                                        <Button
                                            id="btnConvertDepartmentPersona"
                                            text="Save Changes"
                                            icon="sap-icon://save"
                                            type="Emphasized"
                                            press=".onConvertDepartmentPersona"
                                            class="kyraAdminSaveBtn kyraDeptSaveBtn" />
                                    </HBox>
                                </HBox>
                            </VBox>

                            <!-- Results / Feedback Strip -->`;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (targetPattern.test(content)) {
        content = content.replace(targetPattern, replacement);
        console.log('Replaced department controls in:', f);
    } else {
        console.log('Pattern not found in:', f);
    }

    // Also ensure Admin is in adminUserPersonaSelect
    const singleSelectPattern = /<Select\s+id="adminUserPersonaSelect"[\s\S]*?<\/Select>/;
    if (singleSelectPattern.test(content)) {
        content = content.replace(singleSelectPattern, `<Select
                                                id="adminUserPersonaSelect"
                                                selectedKey="{accessModel>/personaLookupUser/selectedPersona}"
                                                change=".onAdminPersonaDropdownChange"
                                                width="100%"
                                                class="kyraAdminBuilderSelect kyraDeptSelect">
                                                <core:Item key="Requester" text="Requester" />
                                                <core:Item key="Approver" text="Approver" />
                                                <core:Item key="Compliance Reviewer" text="Compliance Reviewer" />
                                                <core:Item key="Admin" text="Admin" />
                                            </Select>`);
        console.log('Updated adminUserPersonaSelect in:', f);
    }

    fs.writeFileSync(f, content, 'utf8');
});
console.log('Finished updating XML files.');
