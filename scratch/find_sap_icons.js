const https = require('https');
https.get('https://raw.githubusercontent.com/SAP/openui5/master/src/sap.ui.core/src/sap/ui/core/IconPool.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/['"][a-zA-Z0-9_\-\.\/]+\.json['"]/g);
    console.log('JSON files referenced in IconPool.js:', matches);
    // Find where registerFont or SAP-icons is registered
    const pos = data.indexOf('SAP-icons');
    if (pos !== -1) {
      console.log('SAP-icons snippet:', data.substring(pos - 100, pos + 300));
    }
  });
});
