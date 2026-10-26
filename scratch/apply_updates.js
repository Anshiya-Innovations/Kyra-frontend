const fs = require('fs');
const path = require('path');

const viewPath = path.join(__dirname, '../webapp/pages/access/AccessPage.view.xml');
let view = fs.readFileSync(viewPath, 'utf8');

// 1. UPDATE INTEGRATION MANAGEMENT SECTION (IMAGE 3)
const oldIntegrationsVBoxStart = view.indexOf('<VBox class="kyraIntegrationsPanelCard sapUiMediumMarginBottom" width="100%"');
if (oldIntegrationsVBoxStart === -1) {
    console.error("Could not find oldIntegrationsVBoxStart");
} else {
    const endVBoxMarker = '<!-- WRAPPER FOR SAP APPLICATION INTEGRATION';
    const oldIntegrationsVBoxEnd = view.indexOf(endVBoxMarker, oldIntegrationsVBoxStart);
    
    // Find the closing </VBox> right before endVBoxMarker
    const lastClosingVBox = view.lastIndexOf('</VBox>', oldIntegrationsVBoxEnd);
    
    const newIntegrationsXml = `<!-- ========================================================================= -->
                        <!-- INTEGRATIONS CARD CONTAINER & LIST (Exact Match to Image 3)               -->
                        <!-- ========================================================================= -->
                        <VBox class="kyraIntegrationsPanelCard sapUiMediumMarginBottom" width="100%"
                            visible="{= !\${accessModel>/selectedIntegrationType} }">
                            
                            <!-- Header with Node Network Share Icon & Dot Matrix Decor (Image 3 Match) -->
                            <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraIntegrationHeaderRow sapUiMediumMarginBottom">
                                <HBox alignItems="Center" gap="14px" class="kyraIntegrationHeaderLeft">
                                    <Image src="images/integration_share_icon.svg" width="46px" height="46px" densityAware="false" class="kyraIntegrationHeaderShareIcon" tooltip="Enterprise Integrations" />
                                    <VBox class="kyraIntegrationHeaderTitleBox">
                                        <Title text="Integration Management" level="H3" class="kyraIntegrationHeaderTitle" />
                                        <Text text="Connect and manage enterprise systems and identity integrations." class="kyraIntegrationHeaderSubtitle" />
                                    </VBox>
                                </HBox>
                                <!-- Decorative 4x3 Dot Matrix (Image 3 Match) -->
                                <HBox class="kyraDotMatrixDecor" tooltip="Integration Hub">
                                    <VBox gap="4px">
                                        <HBox gap="4px"><HBox class="kyraDot" /><HBox class="kyraDot" /><HBox class="kyraDot" /><HBox class="kyraDot" /></HBox>
                                        <HBox gap="4px"><HBox class="kyraDot" /><HBox class="kyraDot" /><HBox class="kyraDot" /><HBox class="kyraDot" /></HBox>
                                        <HBox gap="4px"><HBox class="kyraDot" /><HBox class="kyraDot" /><HBox class="kyraDot" /><HBox class="kyraDot" /></HBox>
                                    </VBox>
                                </HBox>
                            </HBox>

                            <!-- Vertical List of 3 Integration Cards (Image 3 Match) -->
                            <VBox class="kyraIntegrationsList" width="100%" gap="14px">
                                <!-- ROW 1: SAP INTEGRATION (Image 3 Match) -->
                                <HBox id="cardSubSapIntegration"
                                    class="{= 'kyraIntegrationCardRow kyraIntegrationCardSap fioriClickableCard' + (\${accessModel>/selectedIntegrationType} === 'sap' ? ' kyraIntegrationListItemActive' : '') }"
                                    alignItems="Center"
                                    justifyContent="SpaceBetween"
                                    width="100%"
                                    press=".onSelectSapIntegration">
                                    <HBox alignItems="Center" class="kyraIntegrationItemLeft" gap="16px">
                                        <HBox class="kyraIntegrationBadgeSap" alignItems="Center" justifyContent="Center">
                                            <Image src="images/sap_official_logo.svg" width="48px" height="26px" densityAware="false" class="kyraSapEmblemImg" alt="SAP Logo" />
                                        </HBox>
                                        <VBox class="kyraIntegrationTitleBox">
                                            <Title text="SAP Integration" level="H5" class="kyraIntegrationRowTitle" />
                                            <Text text="Connect and manage SAP BTP and SAP S/4HANA environments." class="kyraIntegrationRowSub" />
                                            <HBox class="kyraIntegrationTagPill kyraTagPillBlue sapUiTinyMarginTop" alignItems="Center" gap="5px">
                                                <core:Icon src="sap-icon://shield" size="11px" color="#0369A1" />
                                                <Text text="Enterprise ERP" class="kyraTagPillTextBlue" />
                                            </HBox>
                                        </VBox>
                                    </HBox>
                                    <HBox alignItems="Center" class="kyraIntegrationItemRight" gap="14px">
                                        <HBox class="kyraIntegrationStatusDotSap" />
                                        <HBox class="kyraIntegrationStatusPill kyraStatusPillGreen" alignItems="Center" gap="6px">
                                            <core:Icon src="sap-icon://sys-enter-2" size="13px" color="#059669" />
                                            <Text text="{= \${accessModel>/sapIntegration/connected} ? 'Connected' : 'Connected' }" class="kyraStatusPillTextGreen" />
                                        </HBox>
                                        <core:Icon
                                            id="arrowSubSapIntegration"
                                            src="sap-icon://navigation-right-arrow"
                                            class="kyraIntegrationChevron" />
                                    </HBox>
                                </HBox>

                                <!-- ROW 2: ACTIVE DIRECTORY INTEGRATION (Image 3 Match) -->
                                <HBox id="cardSubAdGroupIntegration"
                                    class="{= 'kyraIntegrationCardRow kyraIntegrationCardAd fioriClickableCard' + (\${accessModel>/selectedIntegrationType} === 'ad_group' ? ' kyraIntegrationListItemActive' : '') }"
                                    alignItems="Center"
                                    justifyContent="SpaceBetween"
                                    width="100%"
                                    press=".onSelectAdGroupIntegration">
                                    <HBox alignItems="Center" class="kyraIntegrationItemLeft" gap="16px">
                                        <HBox class="kyraIntegrationBadgeAd" alignItems="Center" justifyContent="Center">
                                            <Image src="images/integration_ad_icon.svg" width="46px" height="46px" densityAware="false" alt="Active Directory" />
                                        </HBox>
                                        <VBox class="kyraIntegrationTitleBox">
                                            <Title text="Active Directory Integration" level="H5" class="kyraIntegrationRowTitle" />
                                            <Text text="Synchronize directory groups and manage identity information." class="kyraIntegrationRowSub" />
                                            <HBox class="kyraIntegrationTagPill kyraTagPillSlate sapUiTinyMarginTop" alignItems="Center" gap="5px">
                                                <core:Icon src="sap-icon://windows-icon" size="11px" color="#475569" />
                                                <Text text="AD / LDAP" class="kyraTagPillTextSlate" />
                                            </HBox>
                                        </VBox>
                                    </HBox>
                                    <HBox alignItems="Center" class="kyraIntegrationItemRight" gap="14px">
                                        <HBox class="kyraIntegrationStatusDotAd" />
                                        <HBox class="kyraIntegrationStatusPill kyraStatusPillAmber" alignItems="Center" gap="6px">
                                            <core:Icon src="sap-icon://history" size="13px" color="#D97706" />
                                            <Text text="{= \${accessModel>/adGroupIntegration/connected} ? 'Ready to Sync' : 'Ready to Sync' }" class="kyraStatusPillTextAmber" />
                                        </HBox>
                                        <core:Icon
                                            id="arrowSubAdGroupIntegration"
                                            src="sap-icon://navigation-right-arrow"
                                            class="kyraIntegrationChevron" />
                                    </HBox>
                                </HBox>

                                <!-- ROW 3: IAM APPROVAL INTEGRATION (Image 3 Match) -->
                                <HBox id="cardSubIamIntegration"
                                    class="{= 'kyraIntegrationCardRow kyraIntegrationCardIam fioriClickableCard' + (\${accessModel>/selectedIntegrationType} === 'iam' ? ' kyraIntegrationListItemActive' : '') }"
                                    alignItems="Center"
                                    justifyContent="SpaceBetween"
                                    width="100%"
                                    press=".onSelectIamIntegration">
                                    <HBox alignItems="Center" class="kyraIntegrationItemLeft" gap="16px">
                                        <HBox class="kyraIntegrationBadgeIam" alignItems="Center" justifyContent="Center">
                                            <Image src="images/integration_key_icon.svg" width="46px" height="46px" densityAware="false" alt="IAM Key" />
                                        </HBox>
                                        <VBox class="kyraIntegrationTitleBox">
                                            <Title text="IAM Approval Integration" level="H5" class="kyraIntegrationRowTitle" />
                                            <Text text="Support access approvals, email notifications, and AWS Console governance." class="kyraIntegrationRowSub" />
                                            <HBox class="kyraIntegrationTagPill kyraTagPillSky sapUiTinyMarginTop" alignItems="Center" gap="5px">
                                                <core:Icon src="sap-icon://cloud" size="11px" color="#0284C7" />
                                                <Text text="AWS Console" class="kyraTagPillTextSky" />
                                            </HBox>
                                        </VBox>
                                    </HBox>
                                    <HBox alignItems="Center" class="kyraIntegrationItemRight" gap="14px">
                                        <HBox class="kyraIntegrationStatusDotIam" />
                                        <HBox class="kyraIntegrationStatusPill kyraStatusPillGreen" alignItems="Center" gap="6px">
                                            <core:Icon src="sap-icon://sys-enter-2" size="13px" color="#059669" />
                                            <Text text="Configuration Ready" class="kyraStatusPillTextGreen" />
                                        </HBox>
                                        <core:Icon
                                            id="arrowSubIamIntegration"
                                            src="sap-icon://navigation-right-arrow"
                                            class="kyraIntegrationChevron" />
                                    </HBox>
                                </HBox>
                            </VBox>
                        </VBox>`;
    
    const commentStart = view.lastIndexOf('<!-- ========================================================================= -->', oldIntegrationsVBoxStart);
    view = view.substring(0, commentStart) + newIntegrationsXml + view.substring(lastClosingVBox + 7);
    console.log("Successfully replaced Integration Management section with Image 3 design!");
}

// 2. UPDATE STEP 1 SAP INTEGRATION EDIT HEADER & VISIBILITY
const sapConfigStart = view.indexOf('<VBox id="sapIntegrationConfigContainer"');
if (sapConfigStart !== -1) {
    const titleBlockStart = view.indexOf('<VBox width="100%" class="kyraDarkTitleBlock sapUiSmallMarginBottom">', sapConfigStart);
    const titleBlockEnd = view.indexOf('</VBox>', titleBlockStart) + 7;
    
    const newTitleBlock = `<HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraDarkTitleBlock sapUiSmallMarginBottom">
                                <VBox class="kyraHeaderTitleCol sapUiNoMargin">
                                    <HBox alignItems="Center" gap="12px">
                                        <Button
                                            id="btnBackFromSapConfigTop"
                                            text="Back to Subscriptions"
                                            icon="sap-icon://nav-back"
                                            press=".onBackToPurchasedApps"
                                            type="Default"
                                            class="kyraSapBackBtn"
                                            tooltip="Back to Purchased SAP Subscriptions" />
                                        <Title text="{= \${accessModel>/sapIntegration/formMode} === 'edit' ? ('Edit: ' + (\${accessModel>/sapIntegration/editingDisplayName} || 'SAP Application Integration')) : 'Add SAP Application Integration' }" level="H2" class="kyraDarkStudioTitle" />
                                        <HBox class="kyraDarkEnterpriseBadge" visible="{= \${accessModel>/sapIntegration/formMode} === 'edit' }">
                                            <Text text="Enterprise Subscription (dev space)" class="kyraDarkEnterpriseBadgeText" />
                                        </HBox>
                                    </HBox>
                                    <Text text="{= \${accessModel>/sapIntegration/formMode} === 'edit' ? 'Update authentication credentials, Cloud Foundry endpoints, and connection parameters for this SAP application.' : 'Select your SAP application, enter authentication credentials and connection endpoints to integrate with Kyra.' }" class="kyraDarkStudioSubtitle sapUiTinyMarginTop" />
                                </VBox>
                                <HBox alignItems="Center" gap="10px">
                                    <Button
                                        text="Cancel"
                                        press=".onBackToPurchasedApps"
                                        type="Transparent"
                                        class="kyraDarkOutlineBtn"
                                        visible="{= \${accessModel>/sapIntegration/formMode} === 'edit' }" />
                                    <Button
                                        text="{= \${accessModel>/sapIntegration/formMode} === 'edit' ? 'Save Changes' : 'Test &amp; Save' }"
                                        icon="{= \${accessModel>/sapIntegration/formMode} === 'edit' ? 'sap-icon://save' : 'sap-icon://flash' }"
                                        type="Emphasized"
                                        press=".onTestSapIntegration"
                                        class="kyraDarkPrimaryActionBtn" />
                                </HBox>
                            </HBox>`;
    
    view = view.substring(0, titleBlockStart) + newTitleBlock + view.substring(titleBlockEnd);
    console.log("Successfully updated sapIntegrationConfigContainer header bar!");
}

// Update sapAppSelect ComboBox items to include sap_btp_singapore
if (view.includes('<core:Item key="sap_btp" text="SAP Business Technology Platform (SAP BTP)" />') && !view.includes('key="sap_btp_singapore"')) {
    view = view.replace(
        '<core:Item key="sap_btp" text="SAP Business Technology Platform (SAP BTP)" />',
        '<core:Item key="sap_btp" text="SAP Business Technology Platform (SAP BTP)" />\r\n                                        <core:Item key="sap_btp_singapore" text="SAP Business Technology Platform (Singapore)" />'
    );
    console.log("Added sap_btp_singapore to sapAppSelect!");
}

// Update BTP section visibility to include sap_btp_singapore
view = view.replace(
    'visible="{= ${accessModel>/sapIntegration/selectedApp} === \'sap_btp\' || !${accessModel>/sapIntegration/selectedApp} }"',
    'visible="{= ${accessModel>/sapIntegration/selectedApp} === \'sap_btp\' || ${accessModel>/sapIntegration/selectedApp} === \'sap_btp_singapore\' || !${accessModel>/sapIntegration/selectedApp} }"'
);

// Update inputSapBtpRegion to include ap21
if (view.includes('<core:Item key="ap11" text="ap11 - AWS Asia Pacific (Singapore)" />') && !view.includes('key="ap21"')) {
    view = view.replace(
        '<core:Item key="ap11" text="ap11 - AWS Asia Pacific (Singapore)" />',
        '<core:Item key="ap11" text="ap11 - AWS Asia Pacific (Singapore)" />\r\n                                                <core:Item key="ap21" text="ap21 - Asia Pacific (Singapore)" />'
    );
    console.log("Added ap21 to inputSapBtpRegion!");
}

// 3. UPDATE STEP 2 SAP INTEGRATION CARDS (IMAGE 4 MATCH)
const oldSapCardsStart = view.indexOf('<VBox class="kyraDarkFormCard kyraClickableCard sapUiSmallMarginBottom">');
if (oldSapCardsStart !== -1) {
    const quotaSlideMarker = '<!-- LIVE RESOURCE UTILIZATION & QUOTAS TABLE';
    const oldSapCardsEnd = view.indexOf(quotaSlideMarker, oldSapCardsStart);
    
    const newSapCardRow = `<VBox class="kyraSapIntegrationCard sapUiSmallMarginBottom">
                                        <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%" class="kyraSapCardMainRow">
                                            <!-- Left: App Icon & Info -->
                                            <HBox alignItems="Center" gap="16px" class="kyraSapCardLeftGroup">
                                                <HBox class="kyraSapCloudIconBadge" alignItems="Center" justifyContent="Center">
                                                    <core:Icon src="sap-icon://cloud" class="kyraSapCloudIcon" />
                                                </HBox>
                                                <VBox class="kyraSapCardInfoBox">
                                                    <HBox alignItems="Center" gap="10px" class="kyraSapTitleRow">
                                                        <Title text="{accessModel>displayName}" level="H4" class="kyraSapAppCardTitle" />
                                                        <HBox class="kyraSapDevBadge" alignItems="Center">
                                                            <Text text="{accessModel>subscriptionTier}" class="kyraSapDevBadgeText" />
                                                        </HBox>
                                                    </HBox>
                                                    <Text text="{accessModel>subaccountSubtitle}" class="kyraSapAppCardSubtitle sapUiTinyMarginTop" />
                                                    <Text text="{accessModel>servicesSummary}" class="kyraSapAppCardQuotaSummary sapUiTinyMarginTop" />
                                                </VBox>
                                            </HBox>

                                            <!-- Right: Status Badge & Interactive Action Buttons (Edit + Quotas) -->
                                            <VBox alignItems="End" justifyContent="SpaceBetween" gap="12px" class="kyraSapCardRightGroup">
                                                <HBox class="kyraSapActiveStatusBadge" alignItems="Center" gap="4px">
                                                    <Text text="{accessModel>statusText}" class="kyraSapActiveStatusText" />
                                                    <core:Icon src="sap-icon://navigation-down-arrow" size="10px" class="kyraSapActiveStatusIcon" />
                                                </HBox>
                                                <HBox alignItems="Center" gap="8px" class="kyraSapActionBtnRow">
                                                    <Button
                                                        id="btnEditSapIntegrationItem"
                                                        icon="sap-icon://edit"
                                                        text="Edit"
                                                        type="Default"
                                                        press=".onEditSapIntegrationItem"
                                                        class="kyraSapAppActionBtn kyraSapEditBtn"
                                                        tooltip="Edit SAP Integration Configuration" />
                                                    <Button
                                                        text="{= \${accessModel>isAppExpanded} ? 'Hide Live Resource Quotas ▲' : 'Click to View Live Resource Quotas ▼' }"
                                                        type="Default"
                                                        press=".onToggleAppHierarchyItem"
                                                        class="kyraSapAppActionBtn kyraSapQuotaBtn" />
                                                </HBox>
                                            </VBox>
                                        </HBox>

                                        `;
    view = view.substring(0, oldSapCardsStart) + newSapCardRow + view.substring(oldSapCardsEnd);
    console.log("Successfully updated SAP Integration card to Image 4 match!");
}

// 4. UPDATE IAM APPROVER CARDS (IMAGE 2 MATCH)
const oldIamCardsStartMarker = '<!-- LEVEL 1: THE 2 IAM APPROVER CARDS (APPROVER 1 & APPROVER 2) -->';
const iamCardsIdx = view.indexOf(oldIamCardsStartMarker);
if (iamCardsIdx !== -1) {
    const endIamCardsMarker = '<!-- LEVEL 2: DETAIL CONFIGURATION FOR IAM APPROVER 1 -->';
    const iamCardsEndIdx = view.indexOf(endIamCardsMarker, iamCardsIdx);
    
    const commentStart = view.lastIndexOf('<!-- ========================================================================= -->', iamCardsIdx);
    
    const newIamCardsXml = `<!-- ========================================================================= -->
                            <!-- LEVEL 1: IMAGE 2 GLOWING GLASSMORPHIC CARDS FOR I AM 1 & I AM 2          -->
                            <!-- ========================================================================= -->
                            <VBox width="100%" class="kyraIamShowcaseContainer sapUiMediumMarginBottom" alignItems="Center">
                                <HBox width="100%" class="kyraIamCardsRow" justifyContent="Center" alignItems="Center" gap="32px">
                                    <!-- CARD 1: I AM 1 (Image 2 Match) -->
                                    <VBox id="cardSelectIamApprover1"
                                        class="{= 'kyraIamGlassCard kyraIamGlassCard1 fioriClickableCard iamApproverCard iamApprover1CardTrigger' + (\${accessModel>/selectedIamApprover} === 'approver1' ? ' kyraIamCardSelected1' : '') }"
                                        alignItems="Center"
                                        justifyContent="Center"
                                        press=".onSelectIamApprover1">
                                        <customData>
                                            <core:CustomData key="iam-card" value="approver1" writeToDom="true" />
                                        </customData>
                                        <!-- Rounded Square Glossy App Icon Tile -->
                                        <HBox class="kyraIamAppTile kyraIamAppTile1" alignItems="Center" justifyContent="Center">
                                            <Image src="images/iam_user_shield.svg" width="88px" height="88px" densityAware="false" class="kyraIamTileImg" alt="I AM 1" />
                                        </HBox>
                                        <!-- Title Text -->
                                        <Text text="I AM 1" class="kyraIamCardTitle" />
                                    </VBox>

                                    <!-- CARD 2: I AM 2 (Image 2 Match) -->
                                    <VBox id="cardSelectIamApprover2"
                                        class="{= 'kyraIamGlassCard kyraIamGlassCard2 fioriClickableCard iamApproverCard iamApprover2CardTrigger' + (\${accessModel>/selectedIamApprover} === 'approver2' ? ' kyraIamCardSelected2' : '') }"
                                        alignItems="Center"
                                        justifyContent="Center"
                                        press=".onSelectIamApprover2">
                                        <customData>
                                            <core:CustomData key="iam-card" value="approver2" writeToDom="true" />
                                        </customData>
                                        <!-- Rounded Square Glossy App Icon Tile -->
                                        <HBox class="kyraIamAppTile kyraIamAppTile2" alignItems="Center" justifyContent="Center">
                                            <Image src="images/iam_group_shield.svg" width="88px" height="88px" densityAware="false" class="kyraIamTileImg" alt="I AM 2" />
                                        </HBox>
                                        <!-- Title Text -->
                                        <Text text="I AM 2" class="kyraIamCardTitle" />
                                    </VBox>
                                </HBox>
                            </VBox>

                            `;
    view = view.substring(0, commentStart) + newIamCardsXml + view.substring(iamCardsEndIdx);
    console.log("Successfully replaced IAM Approver cards with Image 2 glowing cards!");
}

fs.writeFileSync(viewPath, view, 'utf8');
console.log("AccessPage.view.xml successfully written!");
