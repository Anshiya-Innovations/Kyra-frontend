const fs = require('fs');

// Read files
let xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// 1. Prepare new XML structure inside adminDatabaseConfigSection
// Find start of strategy section
const startPattern = `<!-- Top Subtitle matching media_1790667412965.png -->`;
const endPattern = `<!-- STEP 1: DATABASE CONNECTIONS (Dedicated Separate Slides for Each Top Box) -->`;

const startIndex = xml.indexOf(startPattern);
const endIndex = xml.indexOf(endPattern);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find start or end index in XML!', { startIndex, endIndex });
    process.exit(1);
}

// Extract the strategy selection part
const stratSectionContent = xml.substring(startIndex, endIndex);

// Build new stratSelectionContainer
const newStratSelection = `<!-- VIEW 1: STRATEGY SELECTION BOXES (Shown initially until a box is clicked) -->
                        <VBox id="stratSelectionContainer"
                            visible="{= !${'${accessModel>/dbMigration/showDetails}'} }"
                            width="100%"
                            class="kyraStratSelectionContainer kyraSlideAnim">

                        ${stratSectionContent.trim()}
                        </VBox>

                        <!-- VIEW 2: NEXT DETAILS (Step 1, Step 2, Step 3) shown in the EXACT SAME PLACE when a box is clicked -->
                        <VBox id="migrationDetailsContainer"
                            visible="{= !!${'${accessModel>/dbMigration/showDetails}'} }"
                            width="100%"
                            class="kyraMigrationDetailsContainer kyraSlideAnim">

                            <!-- Top Navigation Bar: Back to Choose Database + Active Strategy Pill + Quick Switch -->
                            <HBox alignItems="Center" justifyContent="SpaceBetween" width="100%" class="kyraDetailsTopBar sapUiSmallMarginBottom">
                                <Button
                                    icon="sap-icon://nav-back"
                                    text="← Back to Choose Database"
                                    press=".onBackToStrategySelection"
                                    type="Transparent"
                                    class="kyraBackToStratBtn" />
                                
                                <HBox alignItems="Center" class="kyraStratTopBadgeGroup">
                                    <Text text="Active Strategy:" class="kyraStratBarLabel sapUiTinyMarginEnd" />
                                    <HBox class="{= ${'${accessModel>/dbMigration/targetMode}'} === 'kyra' ? 'kyraStratPillBadgeTeal' : 'kyraStratPillBadgeGreen' }" alignItems="Center">
                                        <core:Icon src="{= ${'${accessModel>/dbMigration/targetMode}'} === 'kyra' ? 'sap-icon://cloud' : 'sap-icon://database' }" class="kyraStratPillIcon" />
                                        <Text text="{= ${'${accessModel>/dbMigration/targetMode}'} === 'kyra' ? 'Kyra Cloud Database (Encrypted Target)' : 'Own Database (Custom Target BYODB)' }" class="kyraStratPillText" />
                                    </HBox>
                                    <Button
                                        text="{= ${'${accessModel>/dbMigration/targetMode}'} === 'kyra' ? 'Switch to Own DB' : 'Switch to Kyra DB' }"
                                        icon="sap-icon://switch-views"
                                        press=".onToggleMigrationStrategy"
                                        type="Transparent"
                                        class="kyraSwitchStratBtn sapUiTinyMarginBegin" />
                                </HBox>
                            </HBox>
`;

// Replace the old strategy section with the new wrapped one
xml = xml.substring(0, startIndex) + newStratSelection + xml.substring(endIndex);

// Now, close </VBox> for migrationDetailsContainer right after step3
// Step 3 ends right before <!-- ADMIN SECTION 2: USER PERSONA CONVERTION
const adminSection2Pattern = `<!-- ADMIN SECTION 2: USER PERSONA CONVERTION (Opened when Card 2 is clicked) -->`;
const adminSection2Index = xml.indexOf(adminSection2Pattern);

if (adminSection2Index === -1) {
    console.error('Could not find adminSection2Pattern in XML!');
    process.exit(1);
}

// Find the last </VBox> before adminSection2Pattern (which closes adminDatabaseConfigSection)
// We want to insert </VBox> for migrationDetailsContainer right before adminDatabaseConfigSection closes!
const beforeAdmin2 = xml.substring(0, adminSection2Index);
const afterAdmin2 = xml.substring(adminSection2Index);

// Let's find the closing </VBox> of step3MigrationContainer
const step3EndTag = `</VBox>\n\n                    </VBox>`;
const step3Idx = beforeAdmin2.lastIndexOf('</VBox>');
// Right before the closing tag of adminDatabaseConfigSection, insert </VBox>
const lastVBoxIndex = beforeAdmin2.lastIndexOf('</VBox>');
const secondLastVBoxIndex = beforeAdmin2.lastIndexOf('</VBox>', lastVBoxIndex - 1);

console.log('lastVBoxIndex:', lastVBoxIndex, 'secondLastVBoxIndex:', secondLastVBoxIndex);

// Let's insert `</VBox>\n` for migrationDetailsContainer before the final `</VBox>` of adminDatabaseConfigSection
const newBeforeAdmin2 = beforeAdmin2.substring(0, lastVBoxIndex) + `</VBox>\n\n                    ` + beforeAdmin2.substring(lastVBoxIndex);

xml = newBeforeAdmin2 + afterAdmin2;

// Also update step1MigrationContainer visibility to only depend on currentStep === 1
xml = xml.replace(
    `visible="{= \${accessModel>/dbMigration/isSlideOpen} !== false &amp;&amp; \${accessModel>/dbMigration/currentStep} === 1 }"`,
    `visible="{= \${accessModel>/dbMigration/currentStep} === 1 }"`
);

// Save XML
fs.writeFileSync('webapp/pages/access/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('webapp/AccessPage.view.xml', xml, 'utf8');
fs.writeFileSync('dist/pages/access/AccessPage.view.xml', xml, 'utf8');
console.log('Successfully updated XML in all 3 locations');
