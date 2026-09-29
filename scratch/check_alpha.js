const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded/media_1790672537032.png');
let offset = 8;
const idatChunks = [];
while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    offset += 12 + len;
}

zlib.inflate(Buffer.concat(idatChunks), (err, raw) => {
    const stride = 1 + 999 * 4;
    // Check pixel at center (500, 400)
    const idx = 400 * stride + 1 + 500 * 4;
    console.log(`Pixel at (500, 400): R=${raw[idx]}, G=${raw[idx+1]}, B=${raw[idx+2]}, A=${raw[idx+3]}`);
});
