const https = require('https');

https.get('https://raw.githubusercontent.com/SAP/openui5/master/src/sap.ui.core/src/sap/ui/core/IconPool.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('OpenUI5 IconPool.js length:', data.length);
    // Find where SAP-icons font names are defined
    const testList = ['locate-me', 'map', 'map-2', 'map-3', 'world', 'globe', 'marker', 'building', 'action-settings', 'alert'];
    testList.forEach(name => {
      const idx = data.indexOf(name);
      console.log(name, '-> found at index', idx);
    });
  });
}).on('error', err => console.error(err));
