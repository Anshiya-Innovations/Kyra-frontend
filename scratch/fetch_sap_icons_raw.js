const https = require('https');
https.get('https://raw.githubusercontent.com/SAP/openui5/master/src/sap.ui.core/src/sap/ui/core/themes/base/fonts/SAP-icons.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('SAP-icons.json status:', res.statusCode, 'length:', data.length);
    if (res.statusCode === 200) {
      const json = JSON.parse(data);
      console.log('Total icons in SAP-icons font:', Object.keys(json).length);
      ['map', 'map-2', 'map-3', 'locate-me', 'world', 'globe', 'marker', 'building', 'action-settings', 'alert'].forEach(k => {
        console.log(k, '->', json[k]);
      });
      console.log('\nMatching icons:');
      Object.keys(json).filter(k => k.includes('map') || k.includes('loc') || k.includes('pin') || k.includes('reg') || k.includes('world') || k.includes('glob')).forEach(k => console.log(k, ':', json[k]));
    }
  });
});
