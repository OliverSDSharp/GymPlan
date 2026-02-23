#!/usr/bin/env node
/**
 * Generate PWA icon PNGs from favicon.svg using sharp.
 *
 * Produces:
 *   public/icons/icon-192.png      — standard 192x192
 *   public/icons/icon-512.png      — standard 512x512
 *   public/icons/icon-maskable-512.png — maskable with safe-zone padding
 *
 * Usage: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const iconsDir = resolve(root, 'public/icons');
const svgPath = resolve(root, 'public/favicon.svg');

// Ensure icons directory exists
mkdirSync(iconsDir, { recursive: true });

const svg = readFileSync(svgPath);

async function generate() {
  // --- Standard icons (SVG fills the full canvas) ---
  for (const size of [192, 512]) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(resolve(iconsDir, `icon-${size}.png`));
    console.log(`  icon-${size}.png`);
  }

  // --- Maskable icon (80% safe zone → add 10% padding on each side) ---
  // Android adaptive icons clip a circle from the center 80%.
  // We render the SVG at 80% of the canvas and center it on a filled background.
  const maskSize = 512;
  const innerSize = Math.round(maskSize * 0.75); // icon content at 75% to be safe
  const offset = Math.round((maskSize - innerSize) / 2);

  const innerIcon = await sharp(svg)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: maskSize,
      height: maskSize,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }, // #0f172a
    },
  })
    .composite([{ input: innerIcon, left: offset, top: offset }])
    .png()
    .toFile(resolve(iconsDir, 'icon-maskable-512.png'));
  console.log('  icon-maskable-512.png');

  console.log('\nDone! Icons saved to public/icons/');
}

generate().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
