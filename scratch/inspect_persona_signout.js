const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const personaIdx = xml.indexOf('User Persona Conversion');
if (personaIdx !== -1) {
    console.log('=== USER PERSONA CONVERSION XML ===');
    console.log(xml.substring(Math.max(0, personaIdx - 300), Math.min(xml.length, personaIdx + 1500)));
}

const signOutIdx = xml.indexOf('Sign Out');
if (signOutIdx !== -1) {
    console.log('=== SIGN OUT XML ===');
    console.log(xml.substring(Math.max(0, signOutIdx - 500), Math.min(xml.length, signOutIdx + 400)));
}
