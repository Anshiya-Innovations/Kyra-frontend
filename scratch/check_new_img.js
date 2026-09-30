const fs = require('fs');

// Simple PNG pixel reader for media_1790767316133.png
const imgPath = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded/media_1790767316133.png';
console.log('File size:', fs.statSync(imgPath).size);
