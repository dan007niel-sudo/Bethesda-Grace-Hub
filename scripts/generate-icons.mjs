// Generates PWA icons from the source church logo.
// - icon-192.png / icon-512.png: logo on cream background (purpose: any)
// - icon-maskable-512.png: logo padded to ~70% (purpose: maskable safe zone)
// - apple-touch-icon.png: 180×180 logo on cream
// - logo.png: high-res copy used by the hero on the home page
// - favicon.png: 64×64 raster favicon (the logo is too detailed for a clean SVG)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SOURCE = path.join(PUBLIC_DIR, 'logo-source.jpg');
const CREAM = { r: 248, g: 243, b: 232, alpha: 1 };

async function makeIcon({ size, padding = 0, out, background = CREAM }) {
  const inner = Math.round(size * (1 - padding * 2));
  const offset = Math.round((size - inner) / 2);
  const logo = await sharp(SOURCE).resize(inner, inner, { fit: 'contain' }).toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, top: offset, left: offset }])
    .png()
    .toFile(out);
  console.log('  wrote', path.relative(process.cwd(), out));
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  // PWA "any" icons — logo on cream
  await makeIcon({ size: 192, out: path.join(PUBLIC_DIR, 'icon-192.png') });
  await makeIcon({ size: 512, out: path.join(PUBLIC_DIR, 'icon-512.png') });

  // Maskable: logo at 70% so it stays inside the OS safe area
  await makeIcon({
    size: 512,
    padding: 0.15,
    out: path.join(PUBLIC_DIR, 'icon-maskable-512.png'),
  });

  // Apple touch icon
  await makeIcon({ size: 180, out: path.join(PUBLIC_DIR, 'apple-touch-icon.png') });

  // High-res hero logo (transparent background so it sits naturally on cream)
  await sharp(SOURCE)
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'logo.png'));
  console.log('  wrote public/logo.png');

  // Favicon
  await makeIcon({ size: 64, out: path.join(PUBLIC_DIR, 'favicon.png') });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
