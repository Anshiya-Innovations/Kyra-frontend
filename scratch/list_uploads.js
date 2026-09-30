const fs = require('fs');
const path = require('path');

const userUploadDir = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded';

if (fs.existsSync(userUploadDir)) {
  const files = fs.readdirSync(userUploadDir);
  console.log('Files in .user_uploaded:');
  files.forEach(f => {
    const stat = fs.statSync(path.join(userUploadDir, f));
    console.log(`${f} (${stat.size} bytes, modified ${stat.mtime.toISOString()})`);
  });
}
