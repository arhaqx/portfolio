const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(publicDir, 'images');
const appDir = path.join(rootDir, 'src', 'app');

const sourceImage = 'C:/Users/ACER/.gemini/antigravity-ide/brain/ffe5532a-f9b8-4788-a8f3-68549bff8225/logo_closed_mouth_1789976917320.jpg';

function backupIfExists(filePath, backupPath) {
  if (fs.existsSync(filePath) && !fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up: ${path.basename(filePath)} -> ${path.basename(backupPath)}`);
  }
}

async function createTransparentBuffer(inputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  }

  // Flood fill from outer boundaries
  const visited = new Uint8Array(width * height);
  const queue = [];

  function addPixel(x, y) {
    const idx = y * width + x;
    if (visited[idx]) return;
    const r = rgba[idx * 4], g = rgba[idx * 4 + 1], b = rgba[idx * 4 + 2];
    if (r > 240 && g > 240 && b > 240) {
      visited[idx] = 1;
      queue.push([x, y]);
    }
  }

  for (let x = 0; x < width; x++) {
    addPixel(x, 0);
    addPixel(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    addPixel(0, y);
    addPixel(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const idx = cy * width + cx;
    rgba[idx * 4 + 3] = 0;

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy],
      [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx]) {
          const nr = rgba[nIdx * 4], ng = rgba[nIdx * 4 + 1], nb = rgba[nIdx * 4 + 2];
          if (nr > 235 && ng > 235 && nb > 235) {
            visited[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Edge smoothing / anti-aliasing
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (rgba[idx * 4 + 3] === 255) {
        const hasTransNeighbor = (
          rgba[((y-1) * width + x) * 4 + 3] === 0 ||
          rgba[((y+1) * width + x) * 4 + 3] === 0 ||
          rgba[(y * width + (x-1)) * 4 + 3] === 0 ||
          rgba[(y * width + (x+1)) * 4 + 3] === 0
        );
        if (hasTransNeighbor) {
          const r = rgba[idx * 4], g = rgba[idx * 4 + 1], b = rgba[idx * 4 + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > 200) {
            const alphaFactor = Math.max(0, Math.min(1, (255 - brightness) / 55));
            rgba[idx * 4 + 3] = Math.round(alphaFactor * 255);
          }
        }
      }
    }
  }

  return { rgba, width, height };
}

async function run() {
  console.log('--- 1. Backing up original assets ---');
  backupIfExists(path.join(imagesDir, 'arinal-crop.jpg'), path.join(imagesDir, 'arinal-crop.backup.jpg'));
  backupIfExists(path.join(imagesDir, 'avatar.jpg'), path.join(imagesDir, 'avatar.backup.jpg'));
  backupIfExists(path.join(imagesDir, 'logo.png'), path.join(imagesDir, 'logo.backup.png'));
  backupIfExists(path.join(imagesDir, 'logo.svg'), path.join(imagesDir, 'logo.backup.svg'));
  backupIfExists(path.join(publicDir, 'favicon.ico'), path.join(publicDir, 'favicon.backup.ico'));
  backupIfExists(path.join(appDir, 'icon.png'), path.join(appDir, 'icon.backup.png'));
  backupIfExists(path.join(appDir, 'apple-icon.png'), path.join(appDir, 'apple-icon.backup.png'));
  backupIfExists(path.join(appDir, 'favicon.ico'), path.join(appDir, 'favicon.backup.ico'));

  console.log('--- 2. Processing Transparent High-Res Logo ---');
  const { rgba, width, height } = await createTransparentBuffer(sourceImage);
  const transBuffer = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();

  // Save public/images/logo.png (512x512)
  await sharp(transBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(imagesDir, 'logo.png'));
  console.log('Saved: public/images/logo.png');

  // Save public/images/logo.svg (SVG with embedded high-res data URI)
  const logoBase64 = `data:image/png;base64,${transBuffer.toString('base64')}`;
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="${logoBase64}" width="512" height="512"/>
</svg>`;
  fs.writeFileSync(path.join(imagesDir, 'logo.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  console.log('Saved: logo.svg & favicon.svg');

  console.log('--- 3. Processing Profile Avatar (arinal-crop.jpg & avatar.jpg) ---');
  // Crop centered on the blue circle so that Once UI <Avatar size="xl" /> clips perfectly
  // Circle center is approx (512, 473), diameter 864
  const cropSize = 880;
  const left = Math.round(512 - cropSize / 2);
  const top = Math.round(473 - cropSize / 2);

  await sharp(sourceImage)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(1024, 1024)
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(path.join(imagesDir, 'arinal-crop.jpg'));

  await sharp(sourceImage)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(1024, 1024)
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(path.join(imagesDir, 'avatar.jpg'));
  console.log('Saved: arinal-crop.jpg & avatar.jpg');

  console.log('--- 4. Generating Favicons & App Icons ---');
  // 32x32 for icon.png
  await sharp(transBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  // 180x180 for Apple Touch Icon
  await sharp(transBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  // 32x32 ICO file
  const png32Buffer = await sharp(transBuffer).resize(32, 32).png().toBuffer();
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // type 1 (ICO)
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoDir = Buffer.alloc(16);
  icoDir.writeUInt8(32, 0); // width
  icoDir.writeUInt8(32, 1); // height
  icoDir.writeUInt8(0, 2);  // color palette
  icoDir.writeUInt8(0, 3);  // reserved
  icoDir.writeUInt16LE(1, 4); // color planes
  icoDir.writeUInt16LE(32, 6); // bpp: 32
  icoDir.writeUInt32LE(png32Buffer.length, 8); // size
  icoDir.writeUInt32LE(22, 12); // offset: 6 + 16 = 22

  const icoBuffer = Buffer.concat([icoHeader, icoDir, png32Buffer]);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Saved: favicon.ico, icon.png, apple-icon.png');

  console.log('--- 5. Updating OpenGraph Home Preview ---');
  try {
    const ogScript = path.join(rootDir, 'scripts', 'generate-og-image.js');
    if (fs.existsSync(ogScript)) {
      require(ogScript);
    }
  } catch (err) {
    console.warn('OG generation warning:', err.message);
  }

  console.log('=== All website assets updated successfully! ===');
}

run().catch(console.error);
