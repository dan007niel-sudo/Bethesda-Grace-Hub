// Generates placeholder PWA icons: burgundy square with gold "BGH" wordmark.
// Maskable icon keeps the wordmark inside the inner 80% safe zone.
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BURGUNDY = '#8B1E24';
const GOLD = '#D8B76A';
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const standardSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BURGUNDY}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="Inter, system-ui, sans-serif" font-weight="700"
    font-size="${size * 0.32}" fill="${GOLD}" letter-spacing="${size * 0.01}">
    BGH
  </text>
</svg>
`;

const maskableSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BURGUNDY}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="Inter, system-ui, sans-serif" font-weight="700"
    font-size="${size * 0.22}" fill="${GOLD}" letter-spacing="${size * 0.008}">
    BGH
  </text>
</svg>
`;

async function render(svg, outPath) {
  const buf = Buffer.from(svg);
  await sharp(buf).png().toFile(outPath);
  console.log('  wrote', path.relative(process.cwd(), outPath));
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  await render(standardSvg(192), path.join(PUBLIC_DIR, 'icon-192.png'));
  await render(standardSvg(512), path.join(PUBLIC_DIR, 'icon-512.png'));
  await render(maskableSvg(512), path.join(PUBLIC_DIR, 'icon-maskable-512.png'));
  // Apple touch icon
  await render(standardSvg(180), path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  // Favicon SVG (kept as SVG for crisp rendering)
  await writeFile(path.join(PUBLIC_DIR, 'favicon.svg'), standardSvg(64).trim());
  console.log('  wrote public/favicon.svg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
