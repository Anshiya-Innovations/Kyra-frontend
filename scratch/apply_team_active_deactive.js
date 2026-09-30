const fs = require('fs');

console.log('--- Step 1: Updating Views with proper Team layout & Active/Deactive pills ---');

const newSplitSection = `<HBox width="100%" justifyContent="SpaceBetween" alignItems="Stretch" class="kyraAdminServiceDetailsSplitBox">

                                        <!-- Left Sub-Panel: Team (live Team Roles for selected Service) -->
                                        <VBox width="43%" class="kyraAdminClassificationsSubPanel" justifyContent="SpaceBetween">
                                            <VBox width="100%">
                                                <Text text="{= 'Team (' + (\${accessModel>/adminClassifications} ? \${accessModel>/adminClassifications}.length : 0) + ')' }" class="kyraAdminSubPanelTitle" />

                                                <VBox items="{\${accessModel}>adminClassifications}" class="kyraAdminClassListContainer">
                                                    <VBox class="kyraAdminClassItemCard sapUiTinyMarginBottom">
                                                        <customData>
                                                            <core:CustomData key="selectedClass" value="{= \${accessModel>selected} ? 'true' : 'false' }" writeToDom="true" />
                                                            <core:CustomData key="status" value="{= \${accessModel>status} || 'Active' }" writeToDom="true" />
                                                        </customData>
                                                        <HBox alignItems="Center" justifyContent="SpaceBetween" class="kyraAdminTeamNameBox" width="100%">
                                                            <HBox alignItems="Center" class="kyraAdminTeamLeftContent">
                                                                <HBox class="kyraAdminVectorDot" />
                                                                <Link
                                                                    text="{\${accessModel}>name}"
                                                                    press=".onSelectAdminClassification"
                                                                    class="kyraAdminClassItemLink"
                                                                    wrapping="true"
                                                                    tooltip="{\${accessModel}>name}" />
                                                            </HBox>
                                                            <HBox
                                                                alignItems="Center"
                                                                class="kyraAdminStatusPill kyraAdminTeamStatusPill"
                                                                press=".onToggleAdminTeamStatus"
                                                                tooltip="Click to toggle Team Active / Deactive status">
                                                                <customData>
                                                                    <core:CustomData key="status" value="{= \${accessModel>status} || 'Active' }" writeToDom="true" />
                                                                </customData>
                                                                <HBox class="kyraAdminVectorDot" />
                                                                <Text text="{= (\${accessModel>status} === 'Inactive' || \${accessModel>status} === 'Deactive') ? 'Deactive' : 'Active' }" class="kyraAdminPillText" />
                                                            </HBox>
                                                        </HBox>
                                                    </VBox>
                                                </VBox>
                                            </VBox>

                                            <Button
                                                text="Add Team"
                                                icon="sap-icon://add"
                                                press=".onAddAdminClassification"
                                                class="kyraAdminSubAddBtn"
                                                width="100%" />
                                        </VBox>

                                        <!-- Right Sub-Panel: Team Name &amp; Persona (live Personas for selected Team) -->
                                        <VBox width="55%" class="kyraAdminClassDetailSubPanel">
                                            <HBox alignItems="Center" class="kyraAdminFieldLabelRow">
                                                <Text text="Team Name" class="kyraAdminFormLabel" />
                                                <Text text="*" class="kyraAdminRequiredStar" />
                                            </HBox>
                                            <HBox alignItems="Center" class="kyraAdminSubClassRow sapUiSmallMarginBottom" width="100%">
                                                <Input
                                                    id="adminTeamNameInput"
                                                    value="{\${accessModel}>/selectedAdminClassification/name}"
                                                    editable="false"
                                                    tooltip="{\${accessModel}>/selectedAdminClassification/name}"
                                                    class="kyraAdminSubClassInput kyraAdminReadOnlyInput"
                                                    width="100%" />
                                                <HBox
                                                    alignItems="Center"
                                                    class="kyraAdminStatusPill kyraAdminTeamDetailStatusPill sapUiTinyMarginBegin"
                                                    press=".onToggleSelectedAdminTeamStatus"
                                                    tooltip="Click to toggle Team Active / Deactive status">
                                                    <customData>
                                                        <core:CustomData key="status" value="{= \${accessModel>/selectedAdminClassification/status} || 'Active' }" writeToDom="true" />
                                                    </customData>
                                                    <HBox class="kyraAdminVectorDot" />
                                                    <Text text="{= (\${accessModel>/selectedAdminClassification/status} === 'Inactive' || \${accessModel>/selectedAdminClassification/status} === 'Deactive') ? 'Deactive' : 'Active' }" class="kyraAdminPillText" />
                                                </HBox>
                                                <Button
                                                    icon="sap-icon://edit"
                                                    press=".onEditSelectedAdminTeam"
                                                    class="kyraAdminSystemEditBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                    tooltip="Edit Team" />
                                                <Button
                                                    icon="sap-icon://delete"
                                                    press=".onDeleteSelectedAdminTeam"
                                                    class="kyraAdminSystemDeleteBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                    tooltip="Delete Team" />
                                            </HBox>

                                            <Text
                                                text="{= 'Persona (' + (\${accessModel>/selectedAdminClassification/subClassifications} ? \${accessModel>/selectedAdminClassification/subClassifications}.length : 0) + ')' }"
                                                class="kyraAdminSubPanelTitle kyraAdminSubClassHeader" />

                                            <VBox items="{\${accessModel}>/selectedAdminClassification/subClassifications}" class="kyraAdminSubClassListContainer" width="100%">
                                                <HBox alignItems="Center" class="kyraAdminSubClassRow" width="100%">
                                                    <Input
                                                        value="{\${accessModel}>name}"
                                                        editable="false"
                                                        tooltip="{\${accessModel}>name}"
                                                        class="kyraAdminSubClassInput kyraAdminReadOnlyInput" width="100%" />
                                                    <HBox
                                                        alignItems="Center"
                                                        class="kyraAdminStatusPill kyraAdminPersonaStatusPill sapUiTinyMarginBegin"
                                                        press=".onToggleAdminPersonaStatus"
                                                        tooltip="Click to toggle Persona Active / Deactive status">
                                                        <customData>
                                                            <core:CustomData key="status" value="{= \${accessModel>status} || 'Active' }" writeToDom="true" />
                                                        </customData>
                                                        <HBox class="kyraAdminVectorDot" />
                                                        <Text text="{= (\${accessModel>status} === 'Inactive' || \${accessModel>status} === 'Deactive') ? 'Deactive' : 'Active' }" class="kyraAdminPillText" />
                                                    </HBox>
                                                    <Button
                                                        icon="sap-icon://edit"
                                                        press=".onEditAdminSubClassification"
                                                        class="kyraAdminSystemEditBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                        tooltip="Edit Persona" />
                                                    <Button
                                                        icon="sap-icon://delete"
                                                        press=".onDeleteAdminSubClassification"
                                                        class="kyraAdminSystemDeleteBtn kyraAdminMiniActionBtn sapUiTinyMarginBegin"
                                                        tooltip="Delete Persona" />
                                                </HBox>
                                            </VBox>

                                            <Button
                                                text="Add Persona"
                                                icon="sap-icon://add"
                                                press=".onAddAdminSubClassification"
                                                class="kyraAdminSubAddBtn kyraAdminAddSubClassBtn" />
                                        </VBox>
                                    </HBox>
                                </VBox>`.replace(/\\{/g, '{'); // unescape if needed

// Wait, let's load it from a plain txt file so there's ZERO template string escaping issue!
