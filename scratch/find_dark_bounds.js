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
    let minX = 999, maxX = 0, minY = 852, maxY = 0;
    let darkPixels = 0;
    for (let y = 0; y < 852; y++) {
        for (let x = 0; x < 999; x++) {
            const idx = y * stride + 1 + x * 4;
            const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
            if (r < 50 && g < 50 && b < 50) {
                darkPixels++;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    console.log(`Dark pixels count: ${darkPixels}`);
    console.log(`Bounds: X [${minX}, ${maxX}], Y [${minY}, ${maxY}]`);
});
