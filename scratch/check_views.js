const fs = require('fs');

const f1 = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');
const f2 = fs.readFileSync('webapp/AccessPage.view.xml', 'utf8');
const f3 = fs.readFileSync('dist/pages/access/AccessPage.view.xml', 'utf8');

console.log('Lengths:');
console.log('webapp/pages/access:', f1.length);
console.log('webapp/AccessPage:', f2.length);
console.log('dist/pages/access:', f3.length);

console.log('f1 === f2:', f1 === f2);
console.log('f1 === f3:', f1 === f3);
