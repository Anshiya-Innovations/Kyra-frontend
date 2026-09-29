const fs = require('fs');

const imgPath = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded/media_1790672537032.png';
const stats = fs.statSync(imgPath);
console.log('File size:', stats.size);

// Read png header
const buf = fs.readFileSync(imgPath);
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`Width: ${width}, Height: ${height}`);
