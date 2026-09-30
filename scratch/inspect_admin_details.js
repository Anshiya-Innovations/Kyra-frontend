const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const lines = content.split('\n');

function showRange(title, start, end) {
  console.log(`=== ${title} (lines ${start}-${end}) ===`);
  for (let i = start - 1; i < end; i++) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}

showRange('User Persona Bulk vs Single', 1095, 1160);
showRange('Department Roles / Persona', 1270, 1300);
showRange('Systems Section', 1405, 1425);
showRange('Services Section', 1485, 1505);
showRange('Service Details Footer', 1608, 1628);
showRange('Conflict Section Footer', 1705, 1728);
