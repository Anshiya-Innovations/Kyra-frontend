const fs = require('fs');

const xmlFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

const newOwnDbSlideXml = `                            <!-- ========================================================================= -->
                            <!-- SLIDE 2: OWN DATABASE (BYODB) - EXACT MATCH TO IMAGE 3 (media_1790677909605.jpg) -->
                            <!-- ========================================================================= -->
                            <VBox visible="{= \${accessModel>/dbMigration/targetMode} === 'custom' }" class="kyraOwnDbStudioSlide" width="100%">
                                
                                <!-- Top Subtitle matching media_1790677909605.jpg -->
                                <VBox class="sapUiMediumMarginBottom">
                                    <Text text="Enter the database name, host, port, and authentication credentials for both source and target databases." class="kyraOwnDbSubtitle" />
                                </VBox>

                                <!-- 2-COLUMN SIDE-BY-SIDE CARDS GRID (EXACT MATCH TO media_1790677909605.jpg) -->
                                <HBox width="100%" gap="20px" class="kyraOwnDbCardsGrid sapUiMediumMarginBottom" alignItems="Stretch">
                                    
                                    <!-- ========================================== -->
                                    <!-- LEFT COLUMN: SOURCE DATABASE (EXTRACT FROM) -->
                                    <!-- ========================================== -->
                                    <VBox class="kyraOwnDbCard" width="50%">
                                        
                                        <!-- Header Row -->
                                        <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraOwnDbCardHeader">
                                            <HBox alignItems="Center" gap="10px">
                                                <core:Icon src="sap-icon://database" class="kyraOwnDbCardHeaderIcon" />
                                                <Title text="Source Database (Extract From)" level="H4" class="kyraOwnDbCardHeaderTitle" />
                                            </HBox>
                                            <HBox class="{= 'kyraOwnDbStatusPill ' + (\${accessModel>/dbMigration/source/connected} ? 'kyraOwnDbStatusPillConnected' : 'kyraOwnDbStatusPillNotConnected') }" alignItems="Center">
                                                <Text text="{= \${accessModel>/dbMigration/source/connected} ? 'Connected ✓' : 'Not Connected' }" class="kyraOwnDbStatusPillText" />
                                            </HBox>
                                        </HBox>

                                        <!-- Field 1: Database Type Dropdown -->
                                        <VBox class="kyraOwnDbFieldGroup">
                                            <Text text="Database Type" class="kyraOwnDbFieldLabel" />
                                            <Select selectedKey="{accessModel>/dbMigration/source/engine}" width="100%" class="kyraOwnDbSelect">
                                                <core:Item key="postgresql" text="PostgreSQL" />
                                                <core:Item key="mysql" text="MySQL 8.0 / MariaDB" />
                                                <core:Item key="mongodb" text="MongoDB (NoSQL)" />
                                                <core:Item key="sqlite" text="SQLite (Local)" />
                                            </Select>
                                        </VBox>

                                        <!-- Field 2: Host / IP Address (75%) + Port (25%) in one row -->
                                        <HBox width="100%" gap="14px" class="kyraOwnDbFieldRow">
                                            <VBox width="75%" class="kyraOwnDbFieldGroup">
                                                <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                    <Text text="Host / IP Address" class="kyraOwnDbFieldLabel" />
                                                    <Text text=" *" class="kyraOwnDbRequiredStar" />
                                                </HBox>
                                                <Input
                                                    value="{accessModel>/dbMigration/source/host}"
                                                    placeholder="postgres-primary.internal.kyra.io"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                            <VBox width="25%" class="kyraOwnDbFieldGroup">
                                                <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                    <Text text="Port" class="kyraOwnDbFieldLabel" />
                                                    <Text text=" *" class="kyraOwnDbRequiredStar" />
                                                </HBox>
                                                <Input
                                                    value="{accessModel>/dbMigration/source/port}"
                                                    placeholder="5432"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                        </HBox>

                                        <!-- Field 3: Database Name -->
                                        <VBox class="kyraOwnDbFieldGroup" width="100%">
                                            <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                <Text text="Database Name" class="kyraOwnDbFieldLabel" />
                                                <Text text=" *" class="kyraOwnDbRequiredStar" />
                                            </HBox>
                                            <Input
                                                value="{accessModel>/dbMigration/source/database}"
                                                placeholder="kyra_production"
                                                class="kyraOwnDbInput"
                                                width="100%" />
                                        </VBox>

                                        <!-- Field 4: Username (50%) + Password (50%) in one row -->
                                        <HBox width="100%" gap="14px" class="kyraOwnDbFieldRow">
                                            <VBox width="50%" class="kyraOwnDbFieldGroup">
                                                <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                    <Text text="Username" class="kyraOwnDbFieldLabel" />
                                                    <Text text=" *" class="kyraOwnDbRequiredStar" />
                                                </HBox>
                                                <Input
                                                    value="{accessModel>/dbMigration/source/username}"
                                                    placeholder="svc_admin_reader"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                            <VBox width="50%" class="kyraOwnDbFieldGroup">
                                                <Text text="Password" class="kyraOwnDbFieldLabel" />
                                                <Input
                                                    value="{accessModel>/dbMigration/source/password}"
                                                    type="Password"
                                                    placeholder="••••••••"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                        </HBox>

                                        <!-- Field 5: Enable SSL / TLS encryption Checkbox -->
                                        <HBox alignItems="Center" class="kyraOwnDbCheckboxRow">
                                            <CheckBox
                                                selected="{accessModel>/dbMigration/source/ssl}"
                                                text="Enable SSL / TLS encryption"
                                                class="kyraOwnDbCheckbox" />
                                        </HBox>

                                        <!-- Field 6: Test Source Connection Button (matching media_1790677909605.jpg) -->
                                        <Button
                                            text="Test Source Connection"
                                            press=".onTestSourceConnection"
                                            class="kyraOwnDbTestBtn"
                                            width="100%" />
                                    </VBox>

                                    <!-- ========================================== -->
                                    <!-- RIGHT COLUMN: TARGET DATABASE (LOAD INTO)   -->
                                    <!-- ========================================== -->
                                    <VBox class="kyraOwnDbCard" width="50%">
                                        
                                        <!-- Header Row -->
                                        <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraOwnDbCardHeader">
                                            <HBox alignItems="Center" gap="10px">
                                                <core:Icon src="sap-icon://database" class="kyraOwnDbCardHeaderIcon" />
                                                <Title text="Target Database (Load Into)" level="H4" class="kyraOwnDbCardHeaderTitle" />
                                            </HBox>
                                            <HBox class="{= 'kyraOwnDbStatusPill ' + (\${accessModel>/dbMigration/target/connected} ? 'kyraOwnDbStatusPillConnected' : 'kyraOwnDbStatusPillNotConnected') }" alignItems="Center">
                                                <Text text="{= \${accessModel>/dbMigration/target/connected} ? 'Connected ✓' : 'Not Connected' }" class="kyraOwnDbStatusPillText" />
                                            </HBox>
                                        </HBox>

                                        <!-- Field 1: Database Type Dropdown -->
                                        <VBox class="kyraOwnDbFieldGroup">
                                            <Text text="Database Type" class="kyraOwnDbFieldLabel" />
                                            <Select selectedKey="{accessModel>/dbMigration/target/engine}" width="100%" class="kyraOwnDbSelect">
                                                <core:Item key="postgresql" text="PostgreSQL" />
                                                <core:Item key="mysql" text="MySQL 8.0 / MariaDB" />
                                                <core:Item key="mongodb" text="MongoDB (NoSQL)" />
                                                <core:Item key="sqlite" text="SQLite (Local)" />
                                            </Select>
                                        </VBox>

                                        <!-- Field 2: Host / IP Address (75%) + Port (25%) in one row -->
                                        <HBox width="100%" gap="14px" class="kyraOwnDbFieldRow">
                                            <VBox width="75%" class="kyraOwnDbFieldGroup">
                                                <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                    <Text text="Host / IP Address" class="kyraOwnDbFieldLabel" />
                                                    <Text text=" *" class="kyraOwnDbRequiredStar" />
                                                </HBox>
                                                <Input
                                                    value="{accessModel>/dbMigration/target/host}"
                                                    placeholder="database-1.cwpka6uuuwjw.us-east-1.rds.amazonaws.com"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                            <VBox width="25%" class="kyraOwnDbFieldGroup">
                                                <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                    <Text text="Port" class="kyraOwnDbFieldLabel" />
                                                    <Text text=" *" class="kyraOwnDbRequiredStar" />
                                                </HBox>
                                                <Input
                                                    value="{accessModel>/dbMigration/target/port}"
                                                    placeholder="5432"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                        </HBox>

                                        <!-- Field 3: Database Name -->
                                        <VBox class="kyraOwnDbFieldGroup" width="100%">
                                            <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                <Text text="Database Name" class="kyraOwnDbFieldLabel" />
                                                <Text text=" *" class="kyraOwnDbRequiredStar" />
                                            </HBox>
                                            <Input
                                                value="{accessModel>/dbMigration/target/database}"
                                                placeholder="Kyra"
                                                class="kyraOwnDbInput"
                                                width="100%" />
                                        </VBox>

                                        <!-- Field 4: Username (50%) + Password (50%) in one row -->
                                        <HBox width="100%" gap="14px" class="kyraOwnDbFieldRow">
                                            <VBox width="50%" class="kyraOwnDbFieldGroup">
                                                <HBox alignItems="Center" class="kyraOwnDbLabelRow">
                                                    <Text text="Username" class="kyraOwnDbFieldLabel" />
                                                    <Text text=" *" class="kyraOwnDbRequiredStar" />
                                                </HBox>
                                                <Input
                                                    value="{accessModel>/dbMigration/target/username}"
                                                    placeholder="root"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                            <VBox width="50%" class="kyraOwnDbFieldGroup">
                                                <Text text="Password" class="kyraOwnDbFieldLabel" />
                                                <Input
                                                    value="{accessModel>/dbMigration/target/password}"
                                                    type="Password"
                                                    placeholder="••••••••"
                                                    class="kyraOwnDbInput"
                                                    width="100%" />
                                            </VBox>
                                        </HBox>

                                        <!-- Field 5: Enable SSL / TLS encryption Checkbox -->
                                        <HBox alignItems="Center" class="kyraOwnDbCheckboxRow">
                                            <CheckBox
                                                selected="{accessModel>/dbMigration/target/ssl}"
                                                text="Enable SSL / TLS encryption"
                                                class="kyraOwnDbCheckbox" />
                                        </HBox>

                                        <!-- Field 6: Test Target Connection Button (matching media_1790677909605.jpg) -->
                                        <Button
                                            text="Test Target Connection"
                                            press=".onTestTargetConnection"
                                            class="kyraOwnDbTestBtn"
                                            width="100%" />
                                    </VBox>

                                </HBox>

                                <!-- Bottom Action Bar (EXACT MATCH TO media_1790677909605.jpg) -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraOwnDbBottomBar">
                                    <!-- Left: Back to Home -->
                                    <Button
                                        text="← Back to Home"
                                        press=".onBackToStrategySelection"
                                        class="kyraOwnDbBackBtn" />
                                    
                                    <!-- Center: Prompt Hint -->
                                    <HBox alignItems="Center" class="kyraOwnDbPromptBox">
                                        <Text text="Please test and connect: Source Database &amp; Target Database" class="kyraOwnDbPromptText" />
                                    </HBox>

                                    <!-- Right: Save & Continue to Step 2 -->
                                    <Button
                                        text="Save &amp; Continue to Step 2 →"
                                        press=".onGoToStep2"
                                        type="Emphasized"
                                        class="kyraOwnDbContinueBtn" />
                                </HBox>

                            </VBox>`;

xmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the Slide 2 (custom mode) inside step1MigrationContainer
    const s1Start = content.indexOf('<VBox id="step1MigrationContainer"');
    const customStart = content.indexOf("targetMode} === 'custom'", s1Start);
    
    // Find opening <VBox visible="{= ${accessModel>/dbMigration/targetMode} === 'custom' }"
    const tagOpen = content.lastIndexOf('<VBox', customStart);
    
    // Find closing </VBox> for step1MigrationContainer
    const s2Start = content.indexOf('<VBox id="step2MigrationContainer"');
    const s1Close = content.lastIndexOf('</VBox>', s2Start);
    
    // The custom block is from tagOpen to s1Close
    const before = content.substring(0, tagOpen);
    const after = content.substring(s1Close);
    
    const newContent = before + newOwnDbSlideXml + '\n\n                        ' + after;
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated XML in:', file);
});

console.log('All XML files updated with image 3 design for Own Database!');
