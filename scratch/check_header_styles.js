const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

const headerClasses = [
    'kyraNotificationBellWrapper',
    'kyraHeaderBellBtn',
    'kyraNotificationBadge',
    'kyraSignOutHeaderBtn',
    'kyraHeaderProfileAvatar',
    'adminPersonaConversionModeSwitch',
    'kyraAdminConflictEditContainer'
];

headerClasses.forEach(hc => {
    let pos = css.indexOf(hc);
    if (pos !== -1) {
        console.log(`=== Found ${hc} at ${pos} ===`);
        console.log(css.substring(pos - 30, pos + 350));
    } else {
        console.log(`=== Not found: ${hc} ===`);
    }
});
