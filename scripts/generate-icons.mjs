/**
 * Generate PWA icons as PNG files.
 * Run: node scripts/generate-icons.mjs
 *
 * Creates solid blue rounded-rect icons with "E" letter in white.
 * Uses raw PNG encoding (no dependencies needed).
 */

import { writeFileSync } from "fs";
import { deflateSync } from "zlib";

function createPNG(size) {
  const channels = 4; // RGBA
  const pixels = new Uint8Array(size * size * channels);

  const bgR = 59, bgG = 130, bgB = 246; // #3B82F6 (primary-500)
  const fgR = 255, fgG = 255, fgB = 255; // white

  const radius = Math.floor(size * 0.18);
  const center = size / 2;
  const letterWidth = size * 0.35;
  const letterHeight = size * 0.5;
  const strokeW = Math.max(size * 0.08, 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * channels;

      // Rounded rect check
      const inRect = isInRoundedRect(x, y, 0, 0, size, size, radius);
      if (!inRect) {
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
        continue;
      }

      // Check if pixel is part of the letter "E"
      const lx = center - letterWidth / 2;
      const ly = center - letterHeight / 2;
      const inLetter = isLetterE(x, y, lx, ly, letterWidth, letterHeight, strokeW);

      if (inLetter) {
        pixels[idx] = fgR;
        pixels[idx + 1] = fgG;
        pixels[idx + 2] = fgB;
        pixels[idx + 3] = 255;
      } else {
        pixels[idx] = bgR;
        pixels[idx + 1] = bgG;
        pixels[idx + 2] = bgB;
        pixels[idx + 3] = 255;
      }
    }
  }

  return encodePNG(size, size, pixels);
}

function isInRoundedRect(x, y, rx, ry, w, h, r) {
  if (x < rx || x >= rx + w || y < ry || y >= ry + h) return false;
  // Check corners
  const corners = [
    [rx + r, ry + r],
    [rx + w - r, ry + r],
    [rx + r, ry + h - r],
    [rx + w - r, ry + h - r],
  ];
  for (const [cx, cy] of corners) {
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    const isInCornerZone =
      (x < rx + r || x >= rx + w - r) && (y < ry + r || y >= ry + h - r);
    if (isInCornerZone && dx * dx + dy * dy > r * r) return false;
  }
  return true;
}

function isLetterE(x, y, lx, ly, w, h, sw) {
  // Vertical bar (left side)
  if (x >= lx && x < lx + sw && y >= ly && y < ly + h) return true;
  // Top bar
  if (y >= ly && y < ly + sw && x >= lx && x < lx + w) return true;
  // Middle bar
  const midY = ly + h / 2 - sw / 2;
  if (y >= midY && y < midY + sw && x >= lx && x < lx + w * 0.8) return true;
  // Bottom bar
  if (y >= ly + h - sw && y < ly + h && x >= lx && x < lx + w) return true;
  return false;
}

function encodePNG(width, height, pixels) {
  // Build raw image data with filter byte per row
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // No filter
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (width * 4 + 1) + 1 + x * 4;
      rawData[dstIdx] = pixels[srcIdx];
      rawData[dstIdx + 1] = pixels[srcIdx + 1];
      rawData[dstIdx + 2] = pixels[srcIdx + 2];
      rawData[dstIdx + 3] = pixels[srcIdx + 3];
    }
  }

  const compressed = deflateSync(rawData);

  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = createChunk("IHDR", (() => {
    const buf = Buffer.alloc(13);
    buf.writeUInt32BE(width, 0);
    buf.writeUInt32BE(height, 4);
    buf[8] = 8; // bit depth
    buf[9] = 6; // color type (RGBA)
    buf[10] = 0; // compression
    buf[11] = 0; // filter
    buf[12] = 0; // interlace
    return buf;
  })());

  // IDAT chunk
  const idat = createChunk("IDAT", compressed);

  // IEND chunk
  const iend = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate icons
const sizes = [192, 512];
for (const size of sizes) {
  const png = createPNG(size);
  const path = `public/icons/icon-${size}.png`;
  writeFileSync(path, png);
  console.log(`Created ${path} (${png.length} bytes)`);
}

// Also create apple-touch-icon (180x180)
const apple = createPNG(180);
writeFileSync("public/icons/apple-touch-icon.png", apple);
console.log(`Created public/icons/apple-touch-icon.png (${apple.length} bytes)`);
