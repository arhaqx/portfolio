const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. High-Quality SVG Design for arhaq.dev Monogram
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1222"/>
      <stop offset="50%" stop-color="#080c16"/>
      <stop offset="100%" stop-color="#03060b"/>
    </linearGradient>

    <!-- Squircle Border Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#818cf8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.5"/>
    </linearGradient>

    <!-- Monogram Electric Gradient -->
    <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="35%" stop-color="#38bdf8"/>
      <stop offset="70%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>

    <!-- Crossbar Glow Accent -->
    <linearGradient id="crossbarGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#00f5d4"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>

    <!-- Subtle Glow Filter -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Ambient Core Glow -->
    <radialGradient id="ambientGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#6366f1" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0c1222" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Squircle Base -->
  <rect x="14" y="14" width="484" height="484" rx="112" fill="url(#bgGrad)"/>
  <rect x="14" y="14" width="484" height="484" rx="112" fill="none" stroke="url(#borderGrad)" stroke-width="3"/>

  <!-- Radial Core Backlight -->
  <rect x="14" y="14" width="484" height="484" rx="112" fill="url(#ambientGlow)"/>

  <!-- Geometric Monogram "A" -->
  <g filter="url(#softGlow)">
    <!-- Main "A" Body (Compound Path) -->
    <path d="M 256,88 L 404,404 L 324,404 L 285,322 L 227,322 L 188,404 L 108,404 Z M 256,170 L 210,274 L 302,274 Z" 
          fill="url(#aGrad)" />

    <!-- Neon Cyber-Crossbar Bridge -->
    <rect x="194" y="278" width="124" height="28" rx="6" fill="url(#crossbarGrad)" opacity="0.95"/>

    <!-- Subtle Tech Spark at Apex -->
    <circle cx="256" cy="88" r="5" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>`;

async function run() {
  const rootDir = process.cwd();
  const appDir = path.join(rootDir, 'src', 'app');
  const publicDir = path.join(rootDir, 'public');
  const imagesDir = path.join(publicDir, 'images');

  // 1. Write SVGs
  const svgPathApp = path.join(appDir, 'icon.svg');
  const svgPathPublic = path.join(publicDir, 'favicon.svg');
  const svgPathLogo = path.join(imagesDir, 'logo.svg');

  fs.writeFileSync(svgPathApp, svgIcon, 'utf8');
  fs.writeFileSync(svgPathPublic, svgIcon, 'utf8');
  fs.writeFileSync(svgPathLogo, svgIcon, 'utf8');
  console.log('Written SVG icons successfully.');

  // 2. Generate PNGs using Sharp
  const svgBuffer = Buffer.from(svgIcon);

  // 32x32 PNG for icon.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  // 180x180 PNG for Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  // 512x512 PNG for high-res logo
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(imagesDir, 'logo.png'));

  // Copy to artifacts for preview
  const artifactDir = 'C:\\Users\\ACER\\.gemini\\antigravity-ide\\brain\\ffe5532a-f9b8-4788-a8f3-68549bff8225';
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, 'arhaq_dev_logo_preview.png'));

  // 3. Generate Valid ICO file (wrapping 32x32 PNG)
  const png32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  
  // ICO header: 6 bytes
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // image type 1 (ICO)
  icoHeader.writeUInt16LE(1, 4); // 1 image

  // ICO directory entry: 16 bytes
  const icoDir = Buffer.alloc(16);
  icoDir.writeUInt8(32, 0); // width: 32
  icoDir.writeUInt8(32, 1); // height: 32
  icoDir.writeUInt8(0, 2);  // color palette: 0
  icoDir.writeUInt8(0, 3);  // reserved
  icoDir.writeUInt16LE(1, 4); // color planes
  icoDir.writeUInt16LE(32, 6); // bpp: 32
  icoDir.writeUInt32LE(png32Buffer.length, 8); // size of image data
  icoDir.writeUInt32LE(22, 12); // offset: 6 + 16 = 22

  const icoBuffer = Buffer.concat([icoHeader, icoDir, png32Buffer]);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico and PNGs successfully!');
}

run().catch(console.error);
