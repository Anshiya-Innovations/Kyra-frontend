const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.user_uploaded/media_1790765237466.png');

// Get width and height from IHDR (starts at byte 16)
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log('Image dimensions:', width, 'x', height);

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
    const bpp = 4; // usually RGBA
    const stride = 1 + width * bpp;
    
    // Let's sample key areas:
    // Center pixel (background)
    const midY = Math.floor(height / 2);
    const bgX = Math.floor(width * 0.2); // inside button background
    const bgIdx = midY * stride + 1 + bgX * bpp;
    console.log('Background RGB:', raw[bgIdx], raw[bgIdx+1], raw[bgIdx+2]);
    console.log('Background Hex: #' + [raw[bgIdx], raw[bgIdx+1], raw[bgIdx+2]].map(x => x.toString(16).padStart(2, '0')).join(''));

    // Border pixel (around edge of button)
    const borderX = 10;
    const borderY = midY;
    const bIdx = borderY * stride + 1 + borderX * bpp;
    console.log('Border RGB:', raw[bIdx], raw[bIdx+1], raw[bIdx+2]);
    console.log('Border Hex: #' + [raw[bIdx], raw[bIdx+1], raw[bIdx+2]].map(x => x.toString(16).padStart(2, '0')).join(''));

    // Text pixel (near center)
    const textX = Math.floor(width / 2);
    const tIdx = midY * stride + 1 + textX * bpp;
    console.log('Text pixel RGB:', raw[tIdx], raw[tIdx+1], raw[tIdx+2]);
    console.log('Text Hex: #' + [raw[tIdx], raw[tIdx+1], raw[tIdx+2]].map(x => x.toString(16).padStart(2, '0')).join(''));
});
