const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

let pos = 0;
while ((pos = xml.indexOf('personaConversion', pos)) !== -1) {
    console.log(`Found personaConversion at ${pos}`);
    console.log(xml.substring(pos, pos + 400));
    console.log('---');
    pos += 17;
}
