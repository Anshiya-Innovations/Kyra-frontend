const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

console.log('Total css length:', css.length);
console.log('kyraLiveStreamDropdown pos:', css.indexOf('.kyraLiveStreamDropdown'));
console.log('kyraDarkFormCardCol pos:', css.indexOf('.kyraDarkFormCardCol'));
console.log('kyraDarkFormCard pos:', css.lastIndexOf('.kyraDarkFormCard'));
console.log('kyraDarkTargetBanner pos:', css.lastIndexOf('.kyraDarkTargetBanner'));
