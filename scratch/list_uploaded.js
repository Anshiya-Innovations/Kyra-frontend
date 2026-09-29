const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded';
const files = fs.readdirSync(dir).map(f => {
    const stat = fs.statSync(path.join(dir, f));
    return { name: f, time: stat.mtime.toISOString(), mtime: stat.mtime };
}).sort((a, b) => b.mtime - a.mtime);

console.log(JSON.stringify(files.slice(0, 15), null, 2));
