const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');
const searchClasses = [
    '.kyraDarkStudioWrapper',
    '.kyraDarkTargetBanner',
    '.kyraDarkFormCard',
    '.kyraDarkTestConnBtn',
    '.kyraDarkContinueBtn'
];

searchClasses.forEach(sc => {
    let count = 0;
    let pos = 0;
    while ((pos = css.indexOf(sc, pos)) !== -1) {
        count++;
        pos += sc.length;
    }
    console.log(`${sc}: found ${count} times`);
});
