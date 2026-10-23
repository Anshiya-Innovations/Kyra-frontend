const fs = require('fs');

const cssPath = 'webapp/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetHeader = '/* Centered Subtle Vertical Divider Lines Between the Flex Items */';
const idxStart = css.indexOf(targetHeader);
if (idxStart === -1) {
    console.error('Target header not found in style.css');
    process.exit(1);
}

const idxEnd = css.indexOf('/* Base Tab Button', idxStart);
if (idxEnd === -1) {
    console.error('Next section not found in style.css');
    process.exit(1);
}

// Replace with rule that explicitly suppresses any divider lines
const replacement = `/* Vertical Divider Lines Between Tabs: Completely Removed as requested */
.kyraAccessCustomizationTabBar > .sapMFlexItem::after,
.kyraAccessCustomizationTabBar .kyraCustomizationTabFlexItem::after,
#accessCustomizationSubTabBar > .sapMFlexItem::after,
html body [id$="accessCustomizationSubTabBar"] > .sapMFlexItem::after,
.kyraCustomizationTabBtn::after {
    display: none !important;
    content: none !important;
    border: none !important;
}

`;

css = css.substring(0, idxStart) + replacement + css.substring(idxEnd);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully removed the tiny line from style.css');
