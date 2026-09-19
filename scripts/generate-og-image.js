const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createOgImage() {
  const rootDir = process.cwd();
  const avatarPath = path.join(rootDir, 'public', 'images', 'arinal-crop.jpg');
  const logoPath = path.join(rootDir, 'public', 'images', 'logo.png');
  const outputPath = path.join(rootDir, 'public', 'images', 'og', 'home.jpg');
  const artifactPath = 'C:\\Users\\ACER\\.gemini\\antigravity-ide\\brain\\ffe5532a-f9b8-4788-a8f3-68549bff8225\\og_home_preview.jpg';

  // 1. Prepare circular avatar (260x260) with sharp
  const avatarCircle = await sharp(avatarPath)
    .resize(260, 260, { fit: 'cover' })
    .composite([{
      input: Buffer.from(
        `<svg><circle cx="130" cy="130" r="130" fill="#fff"/></svg>`
      ),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  const avatarBase64 = `data:image/png;base64,${avatarCircle.toString('base64')}`;

  // 2. Prepare logo base64 (48x48)
  const logoBuffer = await sharp(logoPath).resize(48, 48).png().toBuffer();
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  // 3. Construct 1200x630 SVG Canvas
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <!-- Background Gradient -->
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080e1a"/>
        <stop offset="45%" stop-color="#050811"/>
        <stop offset="100%" stop-color="#020306"/>
      </linearGradient>

      <!-- Glow Gradients -->
      <radialGradient id="cyanGlow" cx="15%" cy="20%" r="50%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.22"/>
        <stop offset="60%" stop-color="#0284c7" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#080e1a" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="purpleGlow" cx="85%" cy="75%" r="50%">
        <stop offset="0%" stop-color="#818cf8" stop-opacity="0.18"/>
        <stop offset="60%" stop-color="#6366f1" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#080e1a" stop-opacity="0"/>
      </radialGradient>

      <!-- Text Role Gradient -->
      <linearGradient id="roleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="50%" stop-color="#818cf8"/>
        <stop offset="100%" stop-color="#c084fc"/>
      </linearGradient>

      <!-- Border Gradient -->
      <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#818cf8" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#c084fc" stop-opacity="0.5"/>
      </linearGradient>

      <!-- Avatar Ring Gradient -->
      <linearGradient id="avatarRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="50%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>

      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#38bdf8" flood-opacity="0.35"/>
      </filter>
    </defs>

    <!-- Deep Space Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#cyanGlow)"/>
    <rect width="1200" height="630" fill="url(#purpleGlow)"/>

    <!-- Subtle Tech Grid Lines -->
    <g stroke="rgba(255, 255, 255, 0.03)" stroke-width="1">
      <line x1="100" y1="0" x2="100" y2="630" />
      <line x1="300" y1="0" x2="300" y2="630" />
      <line x1="500" y1="0" x2="500" y2="630" />
      <line x1="700" y1="0" x2="700" y2="630" />
      <line x1="900" y1="0" x2="900" y2="630" />
      <line x1="1100" y1="0" x2="1100" y2="630" />
      <line x1="0" y1="120" x2="1200" y2="120" />
      <line x1="0" y1="240" x2="1200" y2="240" />
      <line x1="0" y1="360" x2="1200" y2="360" />
      <line x1="0" y1="480" x2="1200" y2="480" />
    </g>

    <!-- Outer Frame Card Border -->
    <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="url(#cardBorder)" stroke-width="2"/>

    <!-- TOP HEADER BAR -->
    <g transform="translate(80, 75)">
      <!-- Brand Logo -->
      <image href="${logoBase64}" x="0" y="0" width="48" height="48"/>
      
      <!-- Domain Text -->
      <text x="64" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#ffffff" letter-spacing="-0.5">
        arhaq.dev
      </text>

      <!-- Status Pill -->
      <g transform="translate(210, 8)">
        <rect width="186" height="32" rx="16" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <circle cx="16" cy="16" r="4.5" fill="#10b981"/>
        <text x="28" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#38bdf8">
          Available for Projects
        </text>
      </g>
    </g>

    <!-- MAIN BODY CONTENT -->
    <g transform="translate(80, 215)">
      <!-- Name -->
      <text x="0" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-1">
        Muhammad Arinal Haq
      </text>

      <!-- Role -->
      <text x="0" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="700" fill="url(#roleGrad)" letter-spacing="-0.3">
        Full Stack Web Developer &amp; AI Systems Engineer
      </text>

      <!-- Subtitle Description -->
      <text x="0" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="400" fill="#94a3b8">
        Building scalable modern web apps, cloud systems &amp; autonomous AI agents.
      </text>

      <!-- Tech Badges Row -->
      <g transform="translate(0, 195)">
        <!-- Badge 1: React & Next.js -->
        <g transform="translate(0, 0)">
          <rect width="132" height="36" rx="10" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
          <text x="66" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">
            ⚛️ Next.js 16
          </text>
        </g>

        <!-- Badge 2: React 19 -->
        <g transform="translate(144, 0)">
          <rect width="112" height="36" rx="10" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
          <text x="56" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">
            React 19
          </text>
        </g>

        <!-- Badge 3: Azure & Cloud -->
        <g transform="translate(268, 0)">
          <rect width="144" height="36" rx="10" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
          <text x="72" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">
            ☁️ Azure Cloud
          </text>
        </g>

        <!-- Badge 4: AI Agents -->
        <g transform="translate(424, 0)">
          <rect width="154" height="36" rx="10" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
          <text x="77" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#38bdf8">
            🤖 Hermes Agent
          </text>
        </g>
      </g>
    </g>

    <!-- RIGHT SIDE PORTRAIT -->
    <g transform="translate(850, 165)" filter="url(#softShadow)">
      <!-- Outer Glowing Ring -->
      <circle cx="130" cy="130" r="138" fill="none" stroke="url(#avatarRing)" stroke-width="4" filter="url(#ringGlow)"/>
      <circle cx="130" cy="130" r="134" fill="#0b1120" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>
      
      <!-- Cropped Avatar Image -->
      <image href="${avatarBase64}" x="0" y="0" width="260" height="260" />

      <!-- Location Badge Under Avatar -->
      <g transform="translate(45, 240)">
        <rect width="170" height="34" rx="17" fill="#0c1322" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1"/>
        <text x="85" y="22" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0">
          📍 Semarang, ID
        </text>
      </g>
    </g>
  </svg>`;

  // 4. Render to JPEG (High quality 95%)
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile(outputPath);

  // Copy to artifacts for inspection
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile(artifactPath);

  console.log('Successfully generated modern OG home.jpg (1200x630)!');
}

createOgImage().catch(console.error);
