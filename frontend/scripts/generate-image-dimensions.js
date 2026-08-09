#!/usr/bin/env node
/*
 * scripts/generate-image-dimensions.js
 *
 * Writes src/data/imageDimensions.json: pixel dimensions for every image under
 * public/images, keyed by site path ("/images/..."). Article.jsx and
 * generate-static-html.js use it to emit width/height on in-body <img> tags so
 * the browser reserves the box before the file loads (no layout shift).
 *
 * Dimensions are measured from the actual file bytes, sniffed by magic number
 * (several .webp files in the repo are actually JPEG data), never guessed.
 * Dependency-free like every other script here. Regenerated on build and on
 * npm start; committed so fresh clones work without a build step.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const OUT = path.join(ROOT, 'src', 'data', 'imageDimensions.json');

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegSize(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    // Spec-legal fill padding: any number of 0xFF bytes may precede a marker.
    if (marker === 0xff) { i += 1; continue; }
    // TEM and RSTn are standalone markers with no length field.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    // SOF0..SOF15 except DHT(C4)/JPG(C8)/DAC(CC) carry the frame size.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    // SOS starts entropy-coded data; SOF always precedes it — stop rather
    // than desync on stuffed bytes.
    if (marker === 0xda) return null;
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function webpSize(buf) {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const fourcc = buf.toString('ascii', 12, 16);
  if (fourcc === 'VP8 ') {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (fourcc === 'VP8L') {
    const n = buf.readUInt32LE(21);
    return { width: (n & 0x3fff) + 1, height: ((n >> 14) & 0x3fff) + 1 };
  }
  if (fourcc === 'VP8X') {
    return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  return null;
}

function svgSize(buf) {
  // Only the ROOT <svg> tag counts: strip comments first (a commented-out
  // <svg> must not match), take the first opening tag, and read attributes
  // from that substring alone — a nested/sprite <svg> must not leak in.
  const text = buf.toString('utf-8').replace(/<!--[\s\S]*?-->/g, '');
  const root = text.match(/<svg[^>]*>/i);
  if (!root) return null;
  const tag = root[0];
  const attr = (name) => {
    const m = tag.match(new RegExp(`[\\s"']${name}\\s*=\\s*["']([0-9.]+)(?:px)?["']`, 'i'));
    return m ? Math.round(parseFloat(m[1])) : null;
  };
  const width = attr('width');
  const height = attr('height');
  if (width && height) return { width, height };
  // viewBox numbers may be separated by whitespace and/or commas (SVG spec).
  const vb = tag.match(/viewBox\s*=\s*["']\s*[0-9.-]+[\s,]+[0-9.-]+[\s,]+([0-9.]+)[\s,]+([0-9.]+)\s*["']/i);
  if (vb) return { width: Math.round(parseFloat(vb[1])), height: Math.round(parseFloat(vb[2])) };
  return null;
}

function measure(filePath) {
  const buf = fs.readFileSync(filePath);
  // Sniff by content, not extension — mislabeled files exist.
  return webpSize(buf) || jpegSize(buf) || pngSize(buf) ||
    (/\.svg$/i.test(filePath) ? svgSize(buf) : null);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(webp|jpe?g|png|svg)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function main() {
  const map = {};
  const skipped = [];
  for (const file of walk(IMAGES_DIR).sort()) {
    const key = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
    const size = measure(file);
    if (size && size.width > 0 && size.height > 0) map[key] = size;
    else skipped.push(key);
  }
  fs.writeFileSync(OUT, `${JSON.stringify(map, null, 1)}\n`);
  console.log(`imageDimensions.json written: ${Object.keys(map).length} images measured` +
    (skipped.length ? `; UNPARSEABLE (no dimensions emitted): ${skipped.join(', ')}` : ''));
}

main();
