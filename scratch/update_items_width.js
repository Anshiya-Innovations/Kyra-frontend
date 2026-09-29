const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(
        /<SegmentedButtonItem\s+key="single"[^>]*\/>/g,
        '<SegmentedButtonItem key="single" icon="sap-icon://person-placeholder" text="Single User Conversion" width="220px" />'
    );
    content = content.replace(
        /<SegmentedButtonItem\s+key="department"[^>]*\/>/g,
        '<SegmentedButtonItem key="department" icon="sap-icon://group" text="Department-Wide Conversion" width="250px" />'
    );
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated items with width in:', f);
});
console.log('All XML files updated successfully!');
