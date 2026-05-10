// Generates PWA icons from the source church logo.
// The source logo is a circular badge stored as a JPEG (no alpha channel),
// so we apply a circular mask to drop the white square background and keep
// only the gold-ringed crest. Everything is then rendered onto cream
// (PWA icons / maskable / apple touch) or kept transparent (hero logo).
//
// - icon-192.png / icon-512.png: masked logo on cream (purpose: any)
// - icon-maskable-512.png: masked logo padded to 70% on burgundy
// - apple-touch-icon.png: 180×180 masked logo on cream
// - logo.png: transparent-background masked logo for the hero
// - favicon.png: 64×64 masked logo on cream
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SOURCE = path.join(PUBLIC_DIR, 'logo-source.jpg');
const CREAM = { r: 248, g: 243, b: 232, alpha: 1 };
const BURGUNDY = { r: 139, g: 30, b: 36, alpha: 1 };

function circleMaskSvg(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`,
  );
}

/** Returns a square PNG buffer of the source logo with a circular alpha mask applied. */
async function maskedLogo(size) {
  const square = await sharp(SOURCE)
    .resize(size, size, { fit: 'cover', position: 'center' })
    .ensureAlpha()
    .toBuffer();
  return sharp(square)
    .composite([{ input: circleMaskSvg(size), blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function makeIconOnBackground({ size, padding = 0, out, background = CREAM }) {
  const inner = Math.round(size * (1 - padding * 2));
  const offset = Math.round((size - inner) / 2);
  const logo = await maskedLogo(inner);
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: logo, top: offset, left: offset }])
    .png()
    .toFile(out);
  console.log('  wrote', path.relative(process.cwd(), out));
}

async function makeTransparent({ size, out }) {
  const logo = await maskedLogo(size);
  await sharp(logo).png().toFile(out);
  console.log('  wrote', path.relative(process.cwd(), out));
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  await makeIconOnBackground({ size: 192, out: path.join(PUBLIC_DIR, 'icon-192.png') });
  await makeIconOnBackground({ size: 512, out: path.join(PUBLIC_DIR, 'icon-512.png') });

  // Maskable: burgundy fill so the OS-applied square mask still looks on-brand,
  // logo at 70% to stay inside the platform safe area.
  await makeIconOnBackground({
    size: 512,
    padding: 0.15,
    out: path.join(PUBLIC_DIR, 'icon-maskable-512.png'),
    background: BURGUNDY,
  });

  await makeIconOnBackground({ size: 180, out: path.join(PUBLIC_DIR, 'apple-touch-icon.png') });

  // Hero / in-app logo: transparent background so it sits naturally on cream.
  await makeTransparent({ size: 512, out: path.join(PUBLIC_DIR, 'logo.png') });

  await makeIconOnBackground({ size: 64, out: path.join(PUBLIC_DIR, 'favicon.png') });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
