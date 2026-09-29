const fs = require('fs');

const controller = fs.readFileSync('webapp/pages/access/AccessPage.controller.js', 'utf8');

const lines = controller.split('\n');
lines.forEach((l, i) => {
    if (l.includes('_updateStrategyCardStyles')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
