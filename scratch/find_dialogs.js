const fs = require('fs');
const content = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Find all matches for Dialog, Popover, or Modal in AccessPage.view.xml
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('<Dialog') || l.includes('Fragment') || l.includes('admin') && l.includes('Dialog')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
