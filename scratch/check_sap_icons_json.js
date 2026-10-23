const https = require('https');

https.get('https://ui5.sap.com/resources/sap/ui/core/themes/base/fonts/SAP-icons.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('SAP-icons.json total keys:', Object.keys(json).length);
      const testNames = ['map', 'map-2', 'map-3', 'locate-me', 'marker', 'pin', 'map-pin', 'world', 'globe', 'functional-location', 'building', 'action-settings', 'alert', 'place', 'target-group'];
      testNames.forEach(name => {
        console.log(name, '->', json[name] !== undefined ? json[name] : 'NOT FOUND');
      });

      console.log('\nAll keys containing "map", "loc", "pin", "reg", "geo":');
      Object.keys(json).forEach(k => {
        if (k.includes('map') || k.includes('loc') || k.includes('pin') || k.includes('reg') || k.includes('geo')) {
          console.log(k, '->', json[k]);
        }
      });
    } catch(e) {
      console.error('Error parsing JSON:', e);
    }
  });
}).on('error', err => console.error(err));
