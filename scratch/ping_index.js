const http = require('http');

http.get('http://localhost:8080/index.html', res => {
  console.log('/index.html response code:', res.statusCode);
  process.exit(0);
}).on('error', err => {
  console.error('Server error:', err.message);
  process.exit(1);
});
