const fs = require('fs');

let xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Find start of step1MigrationContainer and start of step2MigrationContainer
const s1Start = xml.indexOf('<VBox id="step1MigrationContainer"');
const s2Start = xml.indexOf('<VBox id="step2MigrationContainer"');

if (s1Start === -1 || s2Start === -1) {
    console.error('Could not find step1 or step2 start!');
    process.exit(1);
}

// Also check if kyraDetailsTopBar is right before s1Start and remove it so the dark design is 100% clean
const topBarPattern = `<!-- Top Navigation Bar: Back to Choose Database + Active Strategy Pill + Quick Switch -->`;
const topBarIdx = xml.indexOf(topBarPattern);

let replaceStart = s1Start;
if (topBarIdx !== -1 && topBarIdx < s1Start) {
    replaceStart = topBarIdx;
}

const newStep1Xml = `<!-- STEP 1: DATABASE CONNECTIONS (MATCHING media_1790669797150.png EXACTLY) -->
                        <VBox id="step1MigrationContainer"
                            visible="{= \${accessModel>/dbMigration/currentStep} === 1 }"
                            width="100%"
                            class="kyraDarkStudioWrapper kyraSlideAnim">

                            <!-- ========================================================================= -->
                            <!-- SLIDE 1: KYRA CLOUD DATABASE SLIDE (EXACT MATCH TO media_1790669797150.png)-->
                            <!-- ========================================================================= -->
                            <VBox visible="{= \${accessModel>/dbMigration/targetMode} === 'kyra' }" class="kyraDarkStudioSlide" width="100%">
                                
                                <!-- Top Title & Subtitle -->
                                <VBox class="kyraDarkTitleBlock sapUiSmallMarginBottom">
                                    <Title text="Configure Database Connections" level="H2" class="kyraDarkStudioTitle" />
                                    <Text text="Enter the database name, host, port, and authentication credentials for your source (extract) database." class="kyraDarkStudioSubtitle" />
                                </VBox>

                                <!-- Target Destination Banner (Exact match to media_1790669797150.png) -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkTargetBanner sapUiMediumMarginBottom">
                                    <HBox alignItems="Center" class="kyraDarkTargetBannerLeft">
                                        <HBox class="kyraDarkGreenGlowDot" />
                                        <FormattedText
                                            htmlText="&lt;span style='color: #94A3B8; font-size: 13.5px;'&gt;Target Destination: &lt;/span&gt;&lt;span style='color: #38BDF8; font-weight: 700; font-size: 13.5px;'&gt;Kyra Cloud Database&lt;/span&gt; &lt;span style='color: #94A3B8; font-size: 13.5px;'&gt;(Encrypted PostgreSQL @ Kyra &amp;#10142; Schema: &lt;/span&gt;&lt;span style='color: #38BDF8; font-weight: 700; font-size: 13.5px;'&gt;Admin&lt;/span&gt;&lt;span style='color: #94A3B8; font-size: 13.5px;'&gt;, Table: &lt;/span&gt;&lt;span style='color: #38BDF8; font-weight: 700; font-size: 13.5px;'&gt;ad_group&lt;/span&gt;&lt;span style='color: #94A3B8; font-size: 13.5px;'&gt;)&lt;/span&gt;"
                                            class="kyraDarkBannerFormattedText" />
                                    </HBox>
                                    <HBox class="kyraDarkGreenPillBadge" alignItems="Center">
                                        <Text text="Encrypted Target Ready ✓" class="kyraDarkGreenPillText" />
                                    </HBox>
                                </HBox>

                                <!-- Main Card: Source Database (Extract From) -->
                                <VBox class="kyraDarkFormCard sapUiMediumMarginBottom" width="100%">
                                    <!-- Card Header -->
                                    <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkCardHeader sapUiSmallMarginBottom">
                                        <HBox alignItems="Center" gap="10px">
                                            <core:Icon src="sap-icon://database" class="kyraDarkCardHeaderIcon" />
                                            <Title text="Source Database (Extract From)" level="H4" class="kyraDarkCardHeaderTitle" />
                                        </HBox>
                                        <HBox class="{= \${accessModel>/dbMigration/source/connected} ? 'kyraDarkStatusBadgeConnected' : 'kyraDarkStatusBadgeNotConnected' }" alignItems="Center">
                                            <Text text="{= \${accessModel>/dbMigration/source/connected} ? 'Connected ✓' : 'Not Connected' }" class="kyraDarkStatusBadgeText" />
                                        </HBox>
                                    </HBox>

                                    <!-- Field 1: Database Type -->
                                    <VBox class="kyraDarkFieldGroup sapUiSmallMarginBottom" width="100%">
                                        <Text text="Database Type" class="kyraDarkFieldLabel" />
                                        <Select selectedKey="{accessModel>/dbMigration/source/engine}" width="100%" class="kyraDarkSelect">
                                            <core:Item key="postgresql" text="PostgreSQL" />
                                            <core:Item key="mysql" text="MySQL 8.0 / MariaDB" />
                                            <core:Item key="mongodb" text="MongoDB (NoSQL)" />
                                            <core:Item key="sqlite" text="SQLite (Local)" />
                                        </Select>
                                    </VBox>

                                    <!-- Row 2: Host / IP Address (75%) + Port (25%) -->
                                    <HBox width="100%" gap="16px" class="kyraDarkFieldRow sapUiSmallMarginBottom">
                                        <VBox width="75%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Host / IP Address" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input
                                                value="{accessModel>/dbMigration/source/host}"
                                                placeholder="e.g. database-1.cwpka6uuuwjw.us-east-1.rds.amazonaws.com"
                                                class="kyraDarkInput"
                                                width="100%" />
                                        </VBox>
                                        <VBox width="25%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Port" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input
                                                value="{accessModel>/dbMigration/source/port}"
                                                placeholder="5432"
                                                class="kyraDarkInput"
                                                width="100%" />
                                        </VBox>
                                    </HBox>

                                    <!-- Row 3: Database Name -->
                                    <VBox class="kyraDarkFieldGroup sapUiSmallMarginBottom" width="100%">
                                        <HBox alignItems="Center" class="kyraDarkLabelRow">
                                            <Text text="Database Name" class="kyraDarkFieldLabel" />
                                            <Text text=" *" class="kyraDarkRequiredStar" />
                                        </HBox>
                                        <Input
                                            value="{accessModel>/dbMigration/source/database}"
                                            placeholder="e.g. Kyra"
                                            class="kyraDarkInput"
                                            width="100%" />
                                    </VBox>

                                    <!-- Row 4: Username (50%) + Password (50%) -->
                                    <HBox width="100%" gap="16px" class="kyraDarkFieldRow sapUiSmallMarginBottom">
                                        <VBox width="50%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Username" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input
                                                value="{accessModel>/dbMigration/source/username}"
                                                placeholder="e.g. root"
                                                class="kyraDarkInput"
                                                width="100%" />
                                        </VBox>
                                        <VBox width="50%" class="kyraDarkFieldGroup">
                                            <Text text="Password" class="kyraDarkFieldLabel" />
                                            <Input
                                                value="{accessModel>/dbMigration/source/password}"
                                                type="Password"
                                                placeholder="••••••••"
                                                class="kyraDarkInput"
                                                width="100%" />
                                        </VBox>
                                    </HBox>

                                    <!-- Row 5: Enable SSL / TLS encryption Checkbox -->
                                    <HBox alignItems="Center" class="kyraDarkCheckboxRow sapUiMediumMarginBottom">
                                        <CheckBox
                                            selected="{accessModel>/dbMigration/source/ssl}"
                                            text="Enable SSL / TLS encryption"
                                            class="kyraDarkCheckbox" />
                                    </HBox>

                                    <!-- Row 6: Test Source Connection Button (Full-width button matching media_1790669797150.png) -->
                                    <Button
                                        icon="sap-icon://flash"
                                        text="⚡ Test Source Connection"
                                        press=".onTestSourceConnection"
                                        class="kyraDarkTestConnBtn"
                                        width="100%" />
                                </VBox>

                                <!-- Bottom Action Bar (Matching media_1790669797150.png) -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkBottomBar">
                                    <!-- Left: Back to Home / Selection -->
                                    <Button
                                        text="← Back to Choose Database"
                                        press=".onBackToStrategySelection"
                                        type="Transparent"
                                        class="kyraDarkBackLinkBtn" />
                                    
                                    <!-- Center: Prompt Hint -->
                                    <HBox alignItems="Center" class="kyraDarkPromptBox">
                                        <Text text="Please enter credentials &amp; connect: " class="kyraDarkPromptHint" />
                                        <Text text="Source Database" class="kyraDarkPromptTarget" />
                                    </HBox>

                                    <!-- Right: Save & Continue to Step 2 Button -->
                                    <Button
                                        text="Save &amp; Continue to Step 2 →"
                                        press=".onGoToStep2"
                                        type="Emphasized"
                                        class="kyraDarkContinueBtn" />
                                </HBox>

                            </VBox>

                            <!-- ========================================================================= -->
                            <!-- SLIDE 2: OWN DATABASE (BYODB) - MATCHING DARK DESIGN                      -->
                            <!-- ========================================================================= -->
                            <VBox visible="{= \${accessModel>/dbMigration/targetMode} === 'custom' }" class="kyraDarkStudioSlide" width="100%">
                                
                                <!-- Top Title & Subtitle -->
                                <VBox class="kyraDarkTitleBlock sapUiSmallMarginBottom">
                                    <Title text="Configure Database Connections" level="H2" class="kyraDarkStudioTitle" />
                                    <Text text="Enter the database name, host, port, and authentication credentials for both your Source and Target databases." class="kyraDarkStudioSubtitle" />
                                </VBox>

                                <!-- Target Destination Banner (Custom BYODB) -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkTargetBanner sapUiMediumMarginBottom">
                                    <HBox alignItems="Center" class="kyraDarkTargetBannerLeft">
                                        <HBox class="kyraDarkGreenGlowDot" />
                                        <FormattedText
                                            htmlText="&lt;span style='color: #94A3B8; font-size: 13.5px;'&gt;Target Destination: &lt;/span&gt;&lt;span style='color: #38BDF8; font-weight: 700; font-size: 13.5px;'&gt;Own Database (Custom Target BYODB)&lt;/span&gt; &lt;span style='color: #94A3B8; font-size: 13.5px;'&gt;(Multi-Engine PostgreSQL / MySQL / MongoDB)&lt;/span&gt;"
                                            class="kyraDarkBannerFormattedText" />
                                    </HBox>
                                    <HBox class="kyraDarkGrayPillBadge" alignItems="Center">
                                        <Text text="Custom Target Ready" class="kyraDarkGrayPillText" />
                                    </HBox>
                                </HBox>

                                <!-- Card 1: Source Database (Extract From) -->
                                <VBox class="kyraDarkFormCard sapUiMediumMarginBottom" width="100%">
                                    <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkCardHeader sapUiSmallMarginBottom">
                                        <HBox alignItems="Center" gap="10px">
                                            <core:Icon src="sap-icon://database" class="kyraDarkCardHeaderIcon" />
                                            <Title text="Source Database (Extract From)" level="H4" class="kyraDarkCardHeaderTitle" />
                                        </HBox>
                                        <HBox class="{= \${accessModel>/dbMigration/source/connected} ? 'kyraDarkStatusBadgeConnected' : 'kyraDarkStatusBadgeNotConnected' }" alignItems="Center">
                                            <Text text="{= \${accessModel>/dbMigration/source/connected} ? 'Connected ✓' : 'Not Connected' }" class="kyraDarkStatusBadgeText" />
                                        </HBox>
                                    </HBox>

                                    <!-- Source Fields -->
                                    <VBox class="kyraDarkFieldGroup sapUiSmallMarginBottom" width="100%">
                                        <Text text="Database Type" class="kyraDarkFieldLabel" />
                                        <Select selectedKey="{accessModel>/dbMigration/source/engine}" width="100%" class="kyraDarkSelect">
                                            <core:Item key="postgresql" text="PostgreSQL" />
                                            <core:Item key="mysql" text="MySQL 8.0 / MariaDB" />
                                            <core:Item key="mongodb" text="MongoDB (NoSQL)" />
                                            <core:Item key="sqlite" text="SQLite (Local)" />
                                        </Select>
                                    </VBox>

                                    <HBox width="100%" gap="16px" class="kyraDarkFieldRow sapUiSmallMarginBottom">
                                        <VBox width="75%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Host / IP Address" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input value="{accessModel>/dbMigration/source/host}" placeholder="e.g. 192.168.1.100 or db.company.com" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                        <VBox width="25%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Port" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input value="{accessModel>/dbMigration/source/port}" placeholder="5432" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                    </HBox>

                                    <VBox class="kyraDarkFieldGroup sapUiSmallMarginBottom" width="100%">
                                        <HBox alignItems="Center" class="kyraDarkLabelRow">
                                            <Text text="Database Name" class="kyraDarkFieldLabel" />
                                            <Text text=" *" class="kyraDarkRequiredStar" />
                                        </HBox>
                                        <Input value="{accessModel>/dbMigration/source/database}" placeholder="e.g. source_db" class="kyraDarkInput" width="100%" />
                                    </VBox>

                                    <HBox width="100%" gap="16px" class="kyraDarkFieldRow sapUiSmallMarginBottom">
                                        <VBox width="50%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Username" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input value="{accessModel>/dbMigration/source/username}" placeholder="e.g. admin" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                        <VBox width="50%" class="kyraDarkFieldGroup">
                                            <Text text="Password" class="kyraDarkFieldLabel" />
                                            <Input value="{accessModel>/dbMigration/source/password}" type="Password" placeholder="••••••••" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                    </HBox>

                                    <HBox alignItems="Center" class="kyraDarkCheckboxRow sapUiMediumMarginBottom">
                                        <CheckBox selected="{accessModel>/dbMigration/source/ssl}" text="Enable SSL / TLS encryption" class="kyraDarkCheckbox" />
                                    </HBox>

                                    <Button
                                        icon="sap-icon://flash"
                                        text="⚡ Test Source Connection"
                                        press=".onTestSourceConnection"
                                        class="kyraDarkTestConnBtn"
                                        width="100%" />
                                </VBox>

                                <!-- Card 2: Target Database (Load Into) -->
                                <VBox class="kyraDarkFormCard sapUiMediumMarginBottom" width="100%">
                                    <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkCardHeader sapUiSmallMarginBottom">
                                        <HBox alignItems="Center" gap="10px">
                                            <core:Icon src="sap-icon://cloud" class="kyraDarkCardHeaderIcon" />
                                            <Title text="Target Database (Load Into)" level="H4" class="kyraDarkCardHeaderTitle" />
                                        </HBox>
                                        <HBox class="{= \${accessModel>/dbMigration/target/connected} ? 'kyraDarkStatusBadgeConnected' : 'kyraDarkStatusBadgeNotConnected' }" alignItems="Center">
                                            <Text text="{= \${accessModel>/dbMigration/target/connected} ? 'Connected ✓' : 'Not Connected' }" class="kyraDarkStatusBadgeText" />
                                        </HBox>
                                    </HBox>

                                    <!-- Target Fields -->
                                    <VBox class="kyraDarkFieldGroup sapUiSmallMarginBottom" width="100%">
                                        <Text text="Database Type" class="kyraDarkFieldLabel" />
                                        <Select selectedKey="{accessModel>/dbMigration/target/engine}" width="100%" class="kyraDarkSelect">
                                            <core:Item key="postgresql" text="PostgreSQL" />
                                            <core:Item key="mysql" text="MySQL 8.0 / MariaDB" />
                                            <core:Item key="mongodb" text="MongoDB (NoSQL)" />
                                        </Select>
                                    </VBox>

                                    <HBox width="100%" gap="16px" class="kyraDarkFieldRow sapUiSmallMarginBottom">
                                        <VBox width="75%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Host / IP Address" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input value="{accessModel>/dbMigration/target/host}" placeholder="e.g. target-db.domain.com" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                        <VBox width="25%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Port" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input value="{accessModel>/dbMigration/target/port}" placeholder="5432" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                    </HBox>

                                    <VBox class="kyraDarkFieldGroup sapUiSmallMarginBottom" width="100%">
                                        <HBox alignItems="Center" class="kyraDarkLabelRow">
                                            <Text text="Database Name" class="kyraDarkFieldLabel" />
                                            <Text text=" *" class="kyraDarkRequiredStar" />
                                        </HBox>
                                        <Input value="{accessModel>/dbMigration/target/database}" placeholder="e.g. target_database" class="kyraDarkInput" width="100%" />
                                    </VBox>

                                    <HBox width="100%" gap="16px" class="kyraDarkFieldRow sapUiSmallMarginBottom">
                                        <VBox width="50%" class="kyraDarkFieldGroup">
                                            <HBox alignItems="Center" class="kyraDarkLabelRow">
                                                <Text text="Username" class="kyraDarkFieldLabel" />
                                                <Text text=" *" class="kyraDarkRequiredStar" />
                                            </HBox>
                                            <Input value="{accessModel>/dbMigration/target/username}" placeholder="e.g. target_admin" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                        <VBox width="50%" class="kyraDarkFieldGroup">
                                            <Text text="Password" class="kyraDarkFieldLabel" />
                                            <Input value="{accessModel>/dbMigration/target/password}" type="Password" placeholder="••••••••" class="kyraDarkInput" width="100%" />
                                        </VBox>
                                    </HBox>

                                    <HBox alignItems="Center" class="kyraDarkCheckboxRow sapUiMediumMarginBottom">
                                        <CheckBox selected="{accessModel>/dbMigration/target/ssl}" text="Enable SSL / TLS encryption" class="kyraDarkCheckbox" />
                                    </HBox>

                                    <Button
                                        icon="sap-icon://flash"
                                        text="⚡ Test Target Connection"
                                        press=".onTestTargetConnection"
                                        class="kyraDarkTestConnBtn"
                                        width="100%" />
                                </VBox>

                                <!-- Bottom Action Bar -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkBottomBar">
                                    <Button
                                        text="← Back to Choose Database"
                                        press=".onBackToStrategySelection"
                                        type="Transparent"
                                        class="kyraDarkBackLinkBtn" />
                                    
                                    <HBox alignItems="Center" class="kyraDarkPromptBox">
                                        <Text text="Please enter credentials &amp; connect: " class="kyraDarkPromptHint" />
                                        <Text text="Source &amp; Target Databases" class="kyraDarkPromptTarget" />
                                    </HBox>

                                    <Button
                                        text="Save &amp; Continue to Step 2 →"
                                        press=".onGoToStep2"
                                        type="Emphasized"
                                        class="kyraDarkContinueBtn" />
                                </HBox>

                            </VBox>

                        </VBox>

`;

xml = xml.substring(0, replaceStart) + newStep1Xml + xml.substring(s2Start);

fs.writeFileSync('webapp/pages/access/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('webapp/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('dist/pages/access/AccessPage.view.xml', xml, 'utf8');
console.log('Successfully wrote dark theme Step 1 to all 3 XML files!');
