const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded/media_1790765237466.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

let offset = 8;
const idatChunks = [];
while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    offset += 12 + len;
}

zlib.inflate(Buffer.concat(idatChunks), (err, raw) => {
    const bpp = 4;
    const stride = 1 + width * bpp;
    const uncompressed = Buffer.alloc(width * height * bpp);
    
    // Unfilter PNG (supports Sub, Up, Average, Paeth)
    for (let y = 0; y < height; y++) {
        const filterType = raw[y * stride];
        for (let x = 0; x < width * bpp; x++) {
            const rawByte = raw[y * stride + 1 + x];
            const a = x >= bpp ? uncompressed[y * width * bpp + x - bpp] : 0;
            const b = y > 0 ? uncompressed[(y - 1) * width * bpp + x] : 0;
            const c = (x >= bpp && y > 0) ? uncompressed[(y - 1) * width * bpp + x - bpp] : 0;
            let val = 0;
            if (filterType === 0) val = rawByte;
            else if (filterType === 1) val = (rawByte + a) & 0xff;
            else if (filterType === 2) val = (rawByte + b) & 0xff;
            else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
            else if (filterType === 4) {
                const p = a + b - c;
                const pa = Math.abs(p - a);
                const pb = Math.abs(p - b);
                const pc = Math.abs(p - c);
                let pr;
                if (pa <= pb && pa <= pc) pr = a;
                else if (pb <= pc) pr = b;
                else pr = c;
                val = (rawByte + pr) & 0xff;
            }
            uncompressed[y * width * bpp + x] = val;
        }
    }
    
    // Sample colors
    const colors = new Map();
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = uncompressed[idx];
            const g = uncompressed[idx + 1];
            const b = uncompressed[idx + 2];
            const a = uncompressed[idx + 3];
            if (a > 50) {
                const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
                colors.set(hex, (colors.get(hex) || 0) + 1);
            }
        }
    }
    const sorted = Array.from(colors.entries()).sort((a, b) => b[1] - a[1]);
    console.log('Top colors:\n', sorted.slice(0, 25));
});
