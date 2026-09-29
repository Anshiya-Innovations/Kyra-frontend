const fs = require('fs');

const css = fs.readFileSync('webapp/pages/access/style.css', 'utf8');

const searches = ['autofill', 'password', 'Password', 'svc_admin'];
searches.forEach(s => {
    let pos = 0;
    while ((pos = css.indexOf(s, pos)) !== -1) {
        console.log(`Found ${s} at ${pos}:`);
        console.log(css.substring(Math.max(0, pos - 50), Math.min(css.length, pos + 150)));
        console.log('---');
        pos += s.length;
    }
});
