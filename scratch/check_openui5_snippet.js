const https = require('https');

https.get('https://raw.githubusercontent.com/SAP/openui5/master/src/sap.ui.core/src/sap/ui/core/IconPool.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('--- AT 10528 ---');
    console.log(data.substring(10500, 10700));
    console.log('--- AT 17845 ---');
    console.log(data.substring(17800, 18000));
  });
}).on('error', err => console.error(err));
