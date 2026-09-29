const fs = require('fs');
const zlib = require('zlib');

// Decode PNG IDAT chunks
const buf = fs.readFileSync('C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded/media_1790672537032.png');

let offset = 8;
const idatChunks = [];
while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') {
        idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
}

const idatConcat = Buffer.concat(idatChunks);
zlib.inflate(idatConcat, (err, raw) => {
    if (err) {
        console.error('Inflate error:', err);
        return;
    }
    console.log('Raw uncompressed length:', raw.length);
    // Find unique RGB colors in raw data (assuming RGBA or RGB)
    // 999 width * 852 height. Scanline has 1 filter byte + bytes per pixel
    const bpp = Math.round((raw.length / 852 - 1) / 999);
    console.log('Bytes per pixel:', bpp);
    
    // Sample lines
    const colors = new Set();
    const stride = 1 + 999 * bpp;
    for (let y = 0; y < 852; y += 10) {
        for (let x = 0; x < 999; x += 10) {
            const idx = y * stride + 1 + x * bpp;
            const r = raw[idx];
            const g = raw[idx + 1];
            const b = raw[idx + 2];
            const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            colors.add(hex);
        }
    }
    console.log('Sampled colors count:', colors.size);
    console.log('Colors:', Array.from(colors).slice(0, 20));
});
