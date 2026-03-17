const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

// The SVG uses Montserrat which may not be available to sharp.
// Create a self-contained SVG with the text baked as paths isn't practical,
// so we render a clean SVG with a system-safe fallback font.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#fff"/>
  <text x="256" y="340" text-anchor="middle" font-family="Montserrat, Arial, Helvetica, sans-serif" font-size="300" font-weight="600" fill="#231f20">SL</text>
</svg>`;

const sizes = [16, 32, 48, 192, 512];

async function generatePngs() {
  const buf = Buffer.from(faviconSvg);

  for (const size of sizes) {
    const out = path.join(PUBLIC, size <= 48 ? `favicon-${size}x${size}.png` : `logo${size}.png`);
    await sharp(buf, { density: Math.round(72 * (size / 20.68)) })
      .resize(size, size)
      .png()
      .toFile(out);
    console.log(`  Created ${path.basename(out)}`);
  }

  // Also create favicon2.png (32x32 alias)
  await sharp(buf, { density: Math.round(72 * (32 / 20.68)) })
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC, 'favicon2.png'));
  console.log('  Created favicon2.png');
}

// Build a minimal ICO file containing 16, 32, 48 px PNG entries
async function generateIco() {
  const buf = Buffer.from(faviconSvg);
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of icoSizes) {
    const png = await sharp(buf, { density: Math.round(72 * (size / 20.68)) })
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push({ size, data: png });
  }

  // ICO header: 6 bytes
  const headerSize = 6;
  const entrySize = 16;
  const numImages = pngBuffers.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);           // reserved
  header.writeUInt16LE(1, 2);           // ICO type
  header.writeUInt16LE(numImages, 4);   // number of images

  const entries = Buffer.alloc(entrySize * numImages);
  let dataOffset = headerSize + entrySize * numImages;

  for (let i = 0; i < numImages; i++) {
    const { size, data } = pngBuffers[i];
    const off = i * entrySize;
    entries.writeUInt8(size < 256 ? size : 0, off);      // width
    entries.writeUInt8(size < 256 ? size : 0, off + 1);  // height
    entries.writeUInt8(0, off + 2);                       // color palette
    entries.writeUInt8(0, off + 3);                       // reserved
    entries.writeUInt16LE(1, off + 4);                    // color planes
    entries.writeUInt16LE(32, off + 6);                   // bits per pixel
    entries.writeUInt32LE(data.length, off + 8);          // data size
    entries.writeUInt32LE(dataOffset, off + 12);          // data offset
    dataOffset += data.length;
  }

  const icoBuffer = Buffer.concat([header, entries, ...pngBuffers.map(p => p.data)]);

  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), icoBuffer);
  console.log('  Created favicon.ico');

  // Copy as favicon2.ico as well
  fs.writeFileSync(path.join(PUBLIC, 'favicon2.ico'), icoBuffer);
  console.log('  Created favicon2.ico');
}

async function main() {
  console.log('Generating favicon files...');
  await generatePngs();
  await generateIco();
  console.log('Done!');
}

main().catch(console.error);
