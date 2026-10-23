const https = require('https');

https.get('https://ui5.sap.com/resources/sap/ui/core/IconPool.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('IconPool fetched length:', data.length);
    const icons = ['map', 'map-2', 'map-3', 'locate-me', 'marker', 'pin', 'map-pin', 'world', 'globe', 'functional-location', 'building', 'action-settings', 'alert'];
    icons.forEach(name => {
      const found = data.includes('"' + name + '"') || data.includes("'" + name + "'");
      console.log(name, '->', found);
    });
  });
}).on('error', err => console.error(err));
