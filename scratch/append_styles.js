const fs = require('fs');
const path = require('path');

const cssRules = `
/* ========================================================================= */
/* KYRA 2026: IMAGE 2 - GLOWING GLASSMORPHIC IAM APPROVER SHOWCASE           */
/* ========================================================================= */
.kyraIamShowcaseContainer,
.sapMFlexBox.kyraIamShowcaseContainer,
html body .sapUiTheme-sap_horizon .kyraIamShowcaseContainer {
    position: relative !important;
    width: 100% !important;
    min-height: 380px !important;
    border-radius: 24px !important;
    overflow: hidden !important;
    background: #04081c !important;
    background: radial-gradient(ellipse 70% 60% at 15% 15%, rgba(0, 140, 255, 0.7) 0%, rgba(0, 80, 220, 0.28) 35%, transparent 70%),
                radial-gradient(ellipse 70% 60% at 85% 15%, rgba(147, 51, 234, 0.65) 0%, rgba(99, 102, 241, 0.25) 35%, transparent 70%),
                linear-gradient(180deg, #060b24 0%, #030614 100%) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 56px 40px !important;
    box-sizing: border-box !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.kyraIamShowcaseContainer::before {
    content: "" !important;
    position: absolute !important;
    top: -50% !important;
    left: -20% !important;
    width: 140% !important;
    height: 140% !important;
    background: conic-gradient(from 140deg at 20% 0%, transparent 0deg, rgba(56, 189, 248, 0.2) 15deg, transparent 35deg, rgba(168, 85, 247, 0.2) 55deg, transparent 80deg) !important;
    pointer-events: none !important;
    opacity: 0.8 !important;
}

.kyraIamCardsRow,
.sapMFlexBox.kyraIamCardsRow {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 36px !important;
    width: 100% !important;
    position: relative !important;
    z-index: 2 !important;
}

.kyraIamGlassCard,
.sapMFlexBox.kyraIamGlassCard,
html body .sapUiTheme-sap_horizon .kyraIamGlassCard {
    width: 320px !important;
    max-width: 340px !important;
    min-height: 220px !important;
    border-radius: 22px !important;
    background: rgba(12, 22, 60, 0.45) !important;
    backdrop-filter: blur(24px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 36px 28px !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    user-select: none !important;
    transition: all 0.26s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.kyraIamGlassCard * {
    user-select: none !important;
}

/* Card 1: Cyan/Blue Glowing Glass */
.kyraIamGlassCard1 {
    border: 1.5px solid rgba(56, 189, 248, 0.45) !important;
    box-shadow: 0 10px 32px rgba(0, 140, 255, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
}

.kyraIamGlassCard1:hover {
    border-color: #38BDF8 !important;
    transform: translateY(-4px) scale(1.02) !important;
    box-shadow: 0 16px 44px rgba(0, 140, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3) !important;
}

.kyraIamGlassCard1.kyraIamCardSelected1 {
    border-color: #00E5FF !important;
    border-width: 2px !important;
    background: rgba(12, 30, 80, 0.6) !important;
    box-shadow: 0 0 35px rgba(0, 229, 255, 0.65), 0 16px 44px rgba(2, 132, 199, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4) !important;
    transform: scale(1.025) !important;
}

/* Card 2: Violet/Purple Glowing Glass */
.kyraIamGlassCard2 {
    border: 1.5px solid rgba(192, 132, 252, 0.45) !important;
    box-shadow: 0 10px 32px rgba(147, 51, 234, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
}

.kyraIamGlassCard2:hover {
    border-color: #C084FC !important;
    transform: translateY(-4px) scale(1.02) !important;
    box-shadow: 0 16px 44px rgba(147, 51, 234, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3) !important;
}

.kyraIamGlassCard2.kyraIamCardSelected2 {
    border-color: #D946EF !important;
    border-width: 2px !important;
    background: rgba(30, 18, 70, 0.6) !important;
    box-shadow: 0 0 35px rgba(217, 70, 239, 0.65), 0 16px 44px rgba(147, 51, 234, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4) !important;
    transform: scale(1.025) !important;
}

.kyraIamAppTile {
    margin-bottom: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.kyraIamTileImg {
    width: 88px !important;
    height: 88px !important;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.4)) !important;
}

.kyraIamCardTitle,
.kyraIamCardTitle .sapMText,
html body .sapUiTheme-sap_horizon .kyraIamCardTitle {
    font-size: 22px !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6) !important;
    line-height: 1 !important;
    margin: 0 !important;
}


/* ========================================================================= */
/* KYRA 2026: IMAGE 3 - INTEGRATION MANAGEMENT PANEL DESIGN                  */
/* ========================================================================= */
.kyraIntegrationsPanelCard,
.sapMFlexBox.kyraIntegrationsPanelCard,
html body .sapUiTheme-sap_horizon .kyraIntegrationsPanelCard {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 20px !important;
    padding: 28px 32px !important;
    box-shadow: 0 4px 24px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -1px rgba(15, 23, 42, 0.03) !important;
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 0 24px 0 !important;
}

.kyraIntegrationHeaderRow {
    padding-bottom: 6px !important;
}

.kyraIntegrationHeaderShareIcon {
    width: 48px !important;
    height: 48px !important;
    border-radius: 12px !important;
    flex-shrink: 0 !important;
}

.kyraIntegrationHeaderTitle,
.kyraIntegrationHeaderTitle .sapMTitle,
html body .sapUiTheme-sap_horizon .kyraIntegrationHeaderTitle {
    font-size: 22px !important;
    font-weight: 800 !important;
    color: #0F172A !important;
    margin: 0 0 4px 0 !important;
    letter-spacing: -0.3px !important;
    line-height: 1.2 !important;
}

.kyraIntegrationHeaderSubtitle,
.kyraIntegrationHeaderSubtitle .sapMText,
html body .sapUiTheme-sap_horizon .kyraIntegrationHeaderSubtitle {
    font-size: 14px !important;
    color: #64748B !important;
    margin: 0 !important;
    line-height: 1.35 !important;
}

/* Decorative 4x3 Dot Matrix */
.kyraDotMatrixDecor {
    opacity: 0.8 !important;
    flex-shrink: 0 !important;
}

.kyraDot {
    width: 4.5px !important;
    height: 4.5px !important;
    border-radius: 50% !important;
    background: #CBD5E1 !important;
}

/* Integration Card Rows matching Image 3 */
.kyraIntegrationCardRow,
.sapMFlexBox.kyraIntegrationCardRow,
html body .sapUiTheme-sap_horizon .kyraIntegrationCardRow {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #E2E8F0 !important;
    border-radius: 16px !important;
    padding: 18px 24px !important;
    min-height: 84px !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.kyraIntegrationCardRow:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07) !important;
    border-color: #CBD5E1 !important;
}

/* Colored Left Border Accents (Image 3 Match) */
.kyraIntegrationCardSap {
    border-left: 5px solid #0284C7 !important;
}

.kyraIntegrationCardAd {
    border-left: 5px solid #10B981 !important;
}

.kyraIntegrationCardIam {
    border-left: 5px solid #F97316 !important;
}

/* Left Icon Squircle Boxes */
.kyraIntegrationBadgeSap {
    width: 54px !important;
    height: 54px !important;
    min-width: 54px !important;
    min-height: 54px !important;
    border-radius: 14px !important;
    background: #E0F2FE !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
}

.kyraSapEmblemImg {
    width: 46px !important;
    height: 24px !important;
}

.kyraIntegrationBadgeAd {
    width: 54px !important;
    height: 54px !important;
    min-width: 54px !important;
    min-height: 54px !important;
    border-radius: 14px !important;
    background: #CCFBF1 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
}

.kyraIntegrationBadgeIam {
    width: 54px !important;
    height: 54px !important;
    min-width: 54px !important;
    min-height: 54px !important;
    border-radius: 14px !important;
    background: #FFEDD5 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
}

/* Titles & Subtitles */
.kyraIntegrationRowTitle,
.kyraIntegrationRowTitle .sapMTitle,
html body .sapUiTheme-sap_horizon .kyraIntegrationRowTitle {
    font-size: 16.5px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin: 0 0 3px 0 !important;
    line-height: 1.25 !important;
}

.kyraIntegrationRowSub,
.kyraIntegrationRowSub .sapMText,
html body .sapUiTheme-sap_horizon .kyraIntegrationRowSub {
    font-size: 13.5px !important;
    color: #64748B !important;
    margin: 0 !important;
    line-height: 1.25 !important;
}

/* Category Pill Badges below title */
.kyraIntegrationTagPill {
    border-radius: 8px !important;
    padding: 2.5px 8px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    width: fit-content !important;
}

.kyraTagPillBlue {
    background: #F0F9FF !important;
    border: 1px solid #BAE6FD !important;
}

.kyraTagPillTextBlue,
.kyraTagPillTextBlue .sapMText {
    color: #0369A1 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
}

.kyraTagPillSlate {
    background: #F8FAFC !important;
    border: 1px solid #E2E8F0 !important;
}

.kyraTagPillTextSlate,
.kyraTagPillTextSlate .sapMText {
    color: #475569 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
}

.kyraTagPillSky {
    background: #F0F9FF !important;
    border: 1px solid #BAE6FD !important;
}

.kyraTagPillTextSky,
.kyraTagPillTextSky .sapMText {
    color: #0284C7 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
}

/* Status Indicators */
.kyraIntegrationStatusDotSap,
.kyraIntegrationStatusDotIam {
    width: 8px !important;
    height: 8px !important;
    min-width: 8px !important;
    min-height: 8px !important;
    border-radius: 50% !important;
    background: #10B981 !important;
}

.kyraIntegrationStatusDotAd {
    width: 8px !important;
    height: 8px !important;
    min-width: 8px !important;
    min-height: 8px !important;
    border-radius: 50% !important;
    background: #F59E0B !important;
}

.kyraStatusPillGreen {
    background: #ECFDF5 !important;
    border: 1px solid #A7F3D0 !important;
    border-radius: 20px !important;
    padding: 5px 14px !important;
}

.kyraStatusPillTextGreen,
.kyraStatusPillTextGreen .sapMText {
    color: #059669 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

.kyraStatusPillAmber {
    background: #FFFBEB !important;
    border: 1px solid #FDE68A !important;
    border-radius: 20px !important;
    padding: 5px 14px !important;
}

.kyraStatusPillTextAmber,
.kyraStatusPillTextAmber .sapMText {
    color: #D97706 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
}

.kyraIntegrationChevron {
    color: #008C9C !important;
    font-size: 16px !important;
    font-weight: bold !important;
}


/* ========================================================================= */
/* KYRA 2026: IMAGE 4 - SAP INTEGRATION CARD & EDIT FLOW                     */
/* ========================================================================= */
.kyraSapIntegrationCard,
.sapMFlexBox.kyraSapIntegrationCard,
html body .sapUiTheme-sap_horizon .kyraSapIntegrationCard {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 16px !important;
    padding: 22px 28px !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

.kyraSapIntegrationCard:hover {
    border-color: #94A3B8 !important;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07) !important;
}

.kyraSapCloudIconBadge {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    min-height: 44px !important;
    border-radius: 12px !important;
    background: #E0F2FE !important;
    border: 1px solid #BAE6FD !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
}

.kyraSapCloudIcon {
    color: #008C9C !important;
    font-size: 1.4rem !important;
}

.kyraSapAppCardTitle,
.kyraSapAppCardTitle .sapMTitle,
html body .sapUiTheme-sap_horizon .kyraSapAppCardTitle {
    font-size: 17px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin: 0 !important;
    line-height: 1.25 !important;
}

.kyraSapDevBadge {
    background: #F0FDFA !important;
    border: 1px solid #99F6E4 !important;
    border-radius: 6px !important;
    padding: 2px 8px !important;
    display: inline-flex !important;
    align-items: center !important;
}

.kyraSapDevBadgeText,
.kyraSapDevBadgeText .sapMText {
    color: #0D9488 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
}

.kyraSapAppCardSubtitle,
.kyraSapAppCardSubtitle .sapMText {
    font-size: 13px !important;
    color: #64748B !important;
    margin: 4px 0 0 0 !important;
}

.kyraSapAppCardQuotaSummary,
.kyraSapAppCardQuotaSummary .sapMText {
    font-size: 13px !important;
    font-weight: 700 !important;
    color: #0F172A !important;
    margin: 4px 0 0 0 !important;
}

.kyraSapActiveStatusBadge {
    background: #ECFDF5 !important;
    border: 1.5px solid #10B981 !important;
    border-radius: 20px !important;
    padding: 4px 14px !important;
    display: inline-flex !important;
    align-items: center !important;
}

.kyraSapActiveStatusText,
.kyraSapActiveStatusText .sapMText {
    color: #059669 !important;
    font-size: 13px !important;
    font-weight: 700 !important;
}

.kyraSapActiveStatusIcon {
    color: #059669 !important;
}

.kyraSapAppActionBtn,
html body .sapUiTheme-sap_horizon .kyraSapAppActionBtn {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #1E293B !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    height: 36px !important;
    padding: 0 14px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.16s ease !important;
}

.kyraSapAppActionBtn:hover,
html body .sapUiTheme-sap_horizon .kyraSapAppActionBtn:hover {
    background: #F8FAFC !important;
    background-color: #F8FAFC !important;
    border-color: #94A3B8 !important;
}

.kyraSapBackBtn,
html body .sapUiTheme-sap_horizon .kyraSapBackBtn {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #008C9C !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    height: 38px !important;
}

.kyraSapBackBtn:hover,
html body .sapUiTheme-sap_horizon .kyraSapBackBtn:hover {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
}
`;

const file1 = path.join(__dirname, '../webapp/css/style.css');
const file2 = path.join(__dirname, '../webapp/pages/access/style.css');

fs.appendFileSync(file1, '\\n' + cssRules, 'utf8');
console.log('Appended styles to webapp/css/style.css');

fs.appendFileSync(file2, '\\n' + cssRules, 'utf8');
console.log('Appended styles to webapp/pages/access/style.css');
