const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

const classes = ['.kyraDarkInput', '.kyraDarkCheckbox', '.kyraDarkSelect'];

classes.forEach(c => {
    console.log(`=== Matches for ${c} ===`);
    let pos = 0;
    while ((pos = css.indexOf(c, pos)) !== -1) {
        console.log(css.substring(pos, pos + 250));
        console.log('---');
        pos += c.length;
    }
});
