const http = require('http');

http.get('http://localhost:8080/css/style.css', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        console.log('Length:', data.length);
        const hasKyraStrat = data.includes('.kyraStratCardThemed');
        console.log('Contains .kyraStratCardThemed?', hasKyraStrat);
        if (hasKyraStrat) {
            const idx = data.indexOf('.kyraStratCardThemed');
            console.log(data.substring(idx, idx + 500));
        }
    });
}).on('error', err => {
    console.error('Error fetching CSS:', err);
});
