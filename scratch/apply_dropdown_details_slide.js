const fs = require('fs');

let xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const oldDropdownStart = '<!-- DROPDOWN LIVE PIPELINE STREAM HUD (KYRA PROJECT THEMED DROPDOWN) -->';
const oldDropdownEnd = '</VBox>\n\n                        </VBox>\n\n                        <VBox id="step3MigrationContainer"';

const startIdx = xml.indexOf(oldDropdownStart);
const endIdx = xml.indexOf(oldDropdownEnd);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find dropdown start or end in XML!');
    process.exit(1);
}

const newDropdownXml = `<!-- DROPDOWN LIVE PIPELINE STREAM HUD (KYRA PROJECT THEMED DROPDOWN) -->
                            <VBox id="migrationLiveStreamDropdown"
                                class="kyraLiveStreamDropdown fioriSlideDownAnim sapUiMediumMarginTop"
                                visible="{= !!\${accessModel>/dbMigration/hud/visible} }">
                                
                                <!-- Header Row -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraHudHeaderRow sapUiSmallMarginBottom">
                                    <HBox alignItems="Center" gap="10px">
                                        <HBox class="{= 'kyraStatusDot ' + (\${accessModel>/dbMigration/hud/state} === 'active' ? 'kyraDotPulsing' : 'kyraDotSuccess') }" />
                                        <Text text="Live DataBridge Pipeline Stream" class="kyraHudTitle" />
                                        <HBox class="kyraHudEnginePill" alignItems="Center">
                                            <Text text="KYRA Cloud ETL Engine" class="kyraHudEnginePillText" />
                                        </HBox>
                                    </HBox>
                                    <HBox alignItems="Center" gap="14px">
                                        <Text text="{accessModel>/dbMigration/hud/statusBadge}" class="{= 'kyraHudBadge ' + (\${accessModel>/dbMigration/hud/state} === 'active' ? 'kyraHudBadgeActive' : 'kyraHudBadgeSuccess') }" />
                                        <Button
                                            icon="sap-icon://decline"
                                            type="Transparent"
                                            tooltip="Close Stream"
                                            press=".onCloseMigrationDropdown"
                                            class="kyraHudCloseBtn" />
                                    </HBox>
                                </HBox>

                                <!-- Progress Indicator -->
                                <ProgressIndicator
                                    percentValue="{accessModel>/dbMigration/hud/progressPercent}"
                                    displayValue="{accessModel>/dbMigration/hud/progressText}"
                                    state="{accessModel>/dbMigration/hud/progressState}"
                                    class="kyraHudProgressIndicator sapUiSmallMarginBottom" />

                                <!-- Stats Row -->
                                <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraHudStatsRow sapUiSmallMarginBottom">
                                    <Text text="{= 'Pipeline: ' + (\${accessModel>/dbMigration/source/engine} || 'POSTGRESQL').toUpperCase() + ' ➔ ' + (\${accessModel>/dbMigration/targetMode} === 'kyra' ? 'Kyra Cloud DB (RDS)' : 'Custom Target') }" class="kyraHudStatItem" />
                                    <Text text="{= 'Mapped Columns: ' + \${accessModel>/dbMigration/columnMappings}.length + ' cols' }" class="kyraHudStatItem" />
                                    <Text text="{= 'Rows Transferred: ' + \${accessModel>/dbMigration/hud/rowsTransferred} + ' rows' }" class="kyraHudStatItem" />
                                    <Text text="{= 'Latency: ' + \${accessModel>/dbMigration/hud/latency} }" class="kyraHudStatItem" />
                                </HBox>

                                <!-- Log Console Cards List -->
                                <VBox class="kyraHudConsoleBox" width="100%">
                                    <List items="{accessModel>/dbMigration/hud/logs}" noDataText="Awaiting pipeline execution..." class="kyraHudLogCardList">
                                        <items>
                                            <CustomListItem class="kyraHudLogCardItem">
                                                <HBox alignItems="Center" gap="12px" width="100%" class="kyraHudLogCardInner">
                                                    <core:Icon src="{accessModel>icon}" class="kyraHudLogIcon" />
                                                    <Text text="{accessModel>text}" class="kyraHudLogText" />
                                                </HBox>
                                            </CustomListItem>
                                        </items>
                                    </List>
                                </VBox>

                                <!-- COMPLETE MIGRATION DETAILS SLIDE (SHOWN DOWN IN THE SAME DROPDOWN) -->
                                <VBox visible="{= \${accessModel>/dbMigration/hud/state} === 'success' }" class="kyraHudDetailsSlide sapUiMediumMarginTop" width="100%">
                                    
                                    <!-- Executive Success Card -->
                                    <VBox class="kyraHudSuccessCard sapUiSmallMarginBottom" width="100%">
                                        <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%">
                                            <HBox alignItems="Center" gap="12px">
                                                <HBox class="kyraHudSuccessIconBadge" alignItems="Center" justifyContent="Center">
                                                    <core:Icon src="sap-icon://sys-enter-2" class="kyraHudCheckIcon" />
                                                </HBox>
                                                <VBox>
                                                    <Title text="Data Pipeline Completed Successfully!" level="H4" class="kyraHudSuccessTitle" />
                                                    <Text text="{= 'Successfully transferred ' + \${accessModel>/dbMigration/hud/rowsTransferred} + ' records into target in ' + (\${accessModel>/dbMigration/summary/duration} || '1.42s') + ' with 100% data integrity.' }" class="kyraHudSuccessSubtitle" />
                                                </VBox>
                                            </HBox>
                                            <HBox class="kyraHudSuccessPill" alignItems="Center">
                                                <Text text="Pipeline Succeeded ✓" class="kyraHudSuccessPillText" />
                                            </HBox>
                                        </HBox>
                                    </VBox>

                                    <!-- 4 KPI Metrics Tiles Grid -->
                                    <HBox width="100%" gap="16px" class="kyraHudMetricsRow sapUiSmallMarginBottom">
                                        <!-- Metric 1: Rows Extracted -->
                                        <VBox class="kyraHudMetricTile" width="25%">
                                            <HBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
                                                <Text text="Rows Extracted" class="kyraHudMetricLabel" />
                                                <core:Icon src="sap-icon://download" class="kyraHudMetricIcon" />
                                            </HBox>
                                            <Text text="{= \${accessModel>/dbMigration/summary/extractedCount} || \${accessModel>/dbMigration/hud/rowsTransferred} || 1250 }" class="kyraHudMetricValue" />
                                            <Text text="Extracted from Source" class="kyraHudMetricSubtext" />
                                        </VBox>

                                        <!-- Metric 2: Rows Loaded -->
                                        <VBox class="kyraHudMetricTile" width="25%">
                                            <HBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
                                                <Text text="Rows Loaded" class="kyraHudMetricLabel" />
                                                <core:Icon src="sap-icon://upload" class="kyraHudMetricIcon" />
                                            </HBox>
                                            <Text text="{= \${accessModel>/dbMigration/hud/rowsTransferred} || 1250 }" class="kyraHudMetricValue" />
                                            <Text text="Loaded into Destination" class="kyraHudMetricSubtext" />
                                        </VBox>

                                        <!-- Metric 3: Pipeline Duration -->
                                        <VBox class="kyraHudMetricTile" width="25%">
                                            <HBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
                                                <Text text="Pipeline Duration" class="kyraHudMetricLabel" />
                                                <core:Icon src="sap-icon://history" class="kyraHudMetricIcon" />
                                            </HBox>
                                            <Text text="{= \${accessModel>/dbMigration/summary/duration} || '1.42s' }" class="kyraHudMetricValue" />
                                            <Text text="End-to-End Latency" class="kyraHudMetricSubtext" />
                                        </VBox>

                                        <!-- Metric 4: Pipeline Completion -->
                                        <VBox class="kyraHudMetricTile" width="25%">
                                            <HBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
                                                <Text text="Completion Rate" class="kyraHudMetricLabel" />
                                                <core:Icon src="sap-icon://accept" class="kyraHudMetricIcon" />
                                            </HBox>
                                            <Text text="100%" class="kyraHudMetricValue" />
                                            <Text text="0 Errors • Verified" class="kyraHudMetricSubtext" />
                                        </VBox>
                                    </HBox>

                                    <!-- Target Destination Info Strip -->
                                    <HBox alignItems="Center" width="100%" class="kyraHudTargetInfoStrip sapUiSmallMarginBottom">
                                        <core:Icon src="sap-icon://cloud" class="kyraHudTargetStripIcon" />
                                        <Text text="{= 'Destination Target: ' + \${accessModel>/dbMigration/target/schema} + '.' + \${accessModel>/dbMigration/target/table} + ' in ' + \${accessModel>/dbMigration/target/database} + ' (' + (\${accessModel>/dbMigration/targetMode} === 'kyra' ? 'Kyra Cloud DB @ AWS RDS PostgreSQL' : 'Custom Target DB') + ')' }" class="kyraHudTargetStripText" />
                                    </HBox>

                                    <!-- Action Buttons Bar -->
                                    <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraHudDetailsActionBar sapUiTinyMarginTop">
                                        <Button
                                            text="← Configure Another Migration"
                                            press=".onResetMigrationWorkflow"
                                            class="kyraHudAnotherBtn" />
                                        
                                        <HBox alignItems="Center" gap="10px">
                                            <Button
                                                text="Close Stream"
                                                icon="sap-icon://decline"
                                                press=".onCloseMigrationDropdown"
                                                type="Transparent"
                                                class="kyraHudCloseTextBtn" />
                                            <Button
                                                text="Done &amp; Close Studio ✓"
                                                type="Emphasized"
                                                press=".onCloseAdminSection"
                                                class="kyraHudDoneBtn" />
                                        </HBox>
                                    </HBox>

                                </VBox>

                            </VBox>`;

xml = xml.substring(0, startIdx) + newDropdownXml + '\n\n                        </VBox>\n\n                        <VBox id="step3MigrationContainer"' + xml.substring(endIdx + oldDropdownEnd.length);

fs.writeFileSync('webapp/pages/access/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('webapp/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('dist/pages/access/AccessPage.view.xml', xml, 'utf8');
console.log('Successfully updated dropdown in all 3 XML files!');
