const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Basic XML tag balancing check
const tags = [];
const regex = /<\/?([a-zA-Z0-9_:]+)(?:\s+[^>]*?)?(\/?)>/g;
let match;
let errors = 0;

// Count opening and closing VBox
const openVBox = (xml.match(/<VBox(\s|>)/g) || []).length;
const closeVBox = (xml.match(/<\/VBox>/g) || []).length;
console.log('Open VBox:', openVBox, 'Close VBox:', closeVBox);

if (openVBox !== closeVBox) {
    console.error('MISMATCH in VBox tags!');
} else {
    console.log('VBox tags perfectly balanced!');
}
