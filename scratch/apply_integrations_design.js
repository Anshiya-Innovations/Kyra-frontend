const fs = require('fs');

// 1. Update the XML view files
const viewFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml'
];

viewFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace sap-icon://database in cardSubSapIntegration with sap-icon://dimension
    const oldRow1Icon = '<HBox class="kyraActionBadge kyraBadgeAmber kyraIntegrationBadge">\n                                            <core:Icon src="sap-icon://database" class="kyraBadgeIcon" />\n                                        </HBox>';
    const newRow1Icon = '<HBox class="kyraActionBadge kyraBadgeAmber kyraIntegrationBadge">\n                                            <core:Icon src="sap-icon://dimension" class="kyraBadgeIcon" />\n                                        </HBox>';
    if (content.includes(oldRow1Icon)) {
        content = content.replace(oldRow1Icon, newRow1Icon);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated Row 1 icon to sap-icon://dimension in', file);
    } else {
        // try regex if formatting differs
        const regex = /(id="cardSubSapIntegration"[\s\S]*?<core:Icon src=")sap-icon:\/\/database(")/;
        if (regex.test(content)) {
            content = content.replace(regex, '$1sap-icon://dimension$2');
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated Row 1 icon via regex in', file);
        } else {
            console.log('Row 1 icon already updated or not found in', file);
        }
    }
});

// 2. Update CSS in webapp/css/style.css
const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetStart = css.indexOf('.kyraIntegrationsPanelCard,');
if (targetStart === -1) {
    console.error('Target not found in style.css');
    process.exit(1);
}

// Find where the integrations block ends
const targetEnd = css.indexOf('/* ========================================================================= */\n/* SAP APPLICATION INTEGRATION SLIDE & TABS (MATCHING IMAGE 2)', targetStart);
const endIdx = targetEnd !== -1 ? targetEnd : css.indexOf('.kyraDarkStudioWrapper', targetStart);

const updatedIntegrationsCSS = `/* ========================================================================= */
/* INTEGRATIONS PANEL CARD & LIST ITEMS (EXACT MATCH TO DESIGN)              */
/* ========================================================================= */
.kyraIntegrationsPanelCard,
.sapMFlexBox.kyraIntegrationsPanelCard,
html body .sapUiTheme-sap_horizon .kyraIntegrationsPanelCard {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 16px !important;
    padding: 24px 32px !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 0 24px 0 !important;
}

.kyraIntegrationsPanelTitle,
.kyraIntegrationsPanelTitle .sapMTitle,
html body .sapUiTheme-sap_horizon .kyraIntegrationsPanelTitle {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin: 0 0 20px 0 !important;
    letter-spacing: -0.2px !important;
    line-height: 1.25 !important;
}

.kyraIntegrationsList,
.sapMFlexBox.kyraIntegrationsList {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

/* Individual Integration Item Row */
.kyraIntegrationListItem,
.sapMFlexBox.kyraIntegrationListItem,
html body .sapUiTheme-sap_horizon .kyraIntegrationListItem {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    padding: 14px 20px !important;
    border-radius: 12px !important;
    background: transparent !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
    min-height: 68px !important;
}

.kyraIntegrationListItem:hover,
html body .sapUiTheme-sap_horizon .kyraIntegrationListItem:hover {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #E2E8F0 !important;
}

.kyraIntegrationListItem.kyraIntegrationListItemActive,
html body .sapUiTheme-sap_horizon .kyraIntegrationListItem.kyraIntegrationListItemActive {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.08) !important;
}

/* Left Section: Icon Badge + Titles */
.kyraIntegrationItemLeft,
.sapMFlexBox.kyraIntegrationItemLeft {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 16px !important;
    flex: 1 1 auto !important;
}

/* Squircle Icon Box: 46x46px with 12px radius */
.kyraIntegrationBadge {
    width: 46px !important;
    height: 46px !important;
    min-width: 46px !important;
    min-height: 46px !important;
    border-radius: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    border: none !important;
}

/* Amber/Orange Squircle for SAP & IAM (Image Match) */
.kyraActionBadge.kyraBadgeAmber.kyraIntegrationBadge,
.kyraIntegrationListItem .kyraBadgeAmber {
    background: #FFF7ED !important;
    background-color: #FFF7ED !important;
    border: none !important;
}

.kyraActionBadge.kyraBadgeAmber.kyraIntegrationBadge .kyraBadgeIcon,
.kyraActionBadge.kyraBadgeAmber.kyraIntegrationBadge .sapUiIcon,
.kyraIntegrationListItem .kyraBadgeAmber .sapUiIcon {
    color: #EA580C !important;
    font-size: 24px !important;
    line-height: 1 !important;
}

/* Teal/Cyan Squircle for AD Group (Image Match) */
.kyraActionBadge.kyraBadgeTeal.kyraIntegrationBadge,
.kyraIntegrationListItem .kyraBadgeTeal {
    background: #CCFBF1 !important;
    background-color: #CCFBF1 !important;
    border: none !important;
}

.kyraActionBadge.kyraBadgeTeal.kyraIntegrationBadge .kyraBadgeIcon,
.kyraActionBadge.kyraBadgeTeal.kyraIntegrationBadge .sapUiIcon,
.kyraIntegrationListItem .kyraBadgeTeal .sapUiIcon {
    color: #0D9488 !important;
    font-size: 24px !important;
    line-height: 1 !important;
}

/* Titles: Title (Bold 15.5px) + Subtitle (Muted 13px) */
.kyraIntegrationTitleBox {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    gap: 4px !important;
}

.kyraIntegrationTitle,
.kyraIntegrationTitle .sapMTitle,
html body .sapUiTheme-sap_horizon .kyraIntegrationTitle {
    font-size: 15.5px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin: 0 !important;
    line-height: 1.25 !important;
}

.kyraIntegrationSub,
.kyraIntegrationSub .sapMText,
html body .sapUiTheme-sap_horizon .kyraIntegrationSub {
    font-size: 13px !important;
    font-weight: 400 !important;
    color: #64748B !important;
    margin: 0 !important;
    line-height: 1.25 !important;
}

/* Right Section: Green Dot + Pill Button + Chevron Arrow */
.kyraIntegrationItemRight,
.sapMFlexBox.kyraIntegrationItemRight {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 18px !important;
    flex-shrink: 0 !important;
}

/* Small Green Status Dot */
.kyraIntegrationStatusDot {
    width: 7px !important;
    height: 7px !important;
    min-width: 7px !important;
    min-height: 7px !important;
    border-radius: 50% !important;
    background: #10B981 !important;
    background-color: #10B981 !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
}

/* Pill Badge Button (Config Ready, Ready to Sync, Config Ready ✓) */
.kyraIntegrationPillBadge,
.sapMFlexBox.kyraIntegrationPillBadge {
    background-color: #ECFDF5 !important;
    background: #ECFDF5 !important;
    border: 1px solid #A7F3D0 !important;
    border-radius: 9999px !important;
    padding: 6px 18px !important;
    height: 32px !important;
    min-height: 32px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
}

.kyraIntegrationPillText,
.kyraIntegrationPillText.sapMText,
html body .sapUiTheme-sap_horizon .kyraIntegrationPillText {
    font-size: 12.5px !important;
    font-weight: 600 !important;
    color: #059669 !important;
    line-height: 1 !important;
    margin: 0 !important;
    white-space: nowrap !important;
    text-align: center !important;
}

/* Right Chevron Arrow Icon */
.kyraIntegrationArrowIcon,
.kyraIntegrationArrowIcon.sapUiIcon {
    font-size: 15px !important;
    color: #008C9C !important;
    cursor: pointer !important;
    line-height: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 20px !important;
    height: 20px !important;
}

`;

if (endIdx !== -1) {
    css = css.substring(0, targetStart) + updatedIntegrationsCSS + css.substring(endIdx);
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Successfully updated Integrations CSS in style.css');
} else {
    console.error('Could not find end boundary in style.css');
}
