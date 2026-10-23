const https = require('https');
https.get('https://raw.githubusercontent.com/UI5/webcomponents/main/packages/icons/src/generated/assets/v5/SAP-icons.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status:', res.statusCode, 'length:', data.length);
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('Keys count:', Object.keys(json).length);
        const candidates = ['locate-me', 'map', 'map-2', 'map-3', 'world', 'globe', 'marker', 'building', 'action-settings', 'alert', 'pin'];
        candidates.forEach(c => console.log(c, ':', json[c] ? 'FOUND' : 'NOT FOUND'));
        console.log('\nMatching keys:');
        Object.keys(json).filter(k => k.includes('map') || k.includes('loc') || k.includes('pin') || k.includes('reg') || k.includes('world') || k.includes('glob')).forEach(k => console.log(k));
      } catch (e) {
        console.error(e);
      }
    }
  });
});
