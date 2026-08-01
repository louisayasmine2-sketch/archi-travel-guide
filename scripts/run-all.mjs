#!/usr/bin/env node
/**
 * run-all.mjs — SATU PERINTAH per artikel: semua aset sekaligus.
 *
 *   node --env-file=.env.local scripts/run-all.mjs --article frontend/build/blog/<slug>/index.html
 *
 * Opsi diteruskan: --date YYYY-MM-DD  --time HH:MM  --voice <edge-tts voice>
 *
 * Menjalankan berurutan:
 *   1. content-pipeline.mjs  (fakta -> paket 6 platform -> pin.png -> CSV)
 *   2. make-variant.mjs      (pin.png -> ig.png 1080x1350)
 *   3. make-video.mjs        (vo-en.txt + pin.png -> video.mp4 + vo.srt)
 * lalu membetulkan link artikel di metricool-draft.csv sesuai slug.
 *
 * Output: output/pipeline/<tanggal>-<slug>/ — WAJIB direview sebelum dijadwalkan.
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { spawnSync } from "node:child_process";

function gagal(p) { console.error(`\n  GAGAL: ${p}\n`); process.exit(1); }
function arg(n, d = null) { const i = process.argv.indexOf(n); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d; }

const ARTIKEL = arg("--article");
if (!ARTIKEL) gagal("Sebutkan artikel: --article <path>");
if (!existsSync(ARTIKEL)) gagal(`${ARTIKEL} tidak ada`);

// slug: dari nama file; kalau index.html, pakai nama folder induknya
let slugSumber = basename(ARTIKEL).replace(/\.(html?|mdx?|txt)$/i, "");
if (/^index$/i.test(slugSumber)) slugSumber = basename(dirname(ARTIKEL));
const slug = slugSumber.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 50);

const tgl = arg("--date", new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));
const dirOut = join("output", "pipeline", `${tgl}-${slug}`);
const urlArtikel = `https://affittacameregliarchi.com/blog/${slug}/`;

console.log(`\n  artikel : ${ARTIKEL}`);
console.log(`  slug    : ${slug}`);
console.log(`  output  : ${dirOut}\n`);

// salin ke nama ber-slug supaya content-pipeline menamai folder dengan benar
const tmpDir = ".tmp-pipeline";
mkdirSync(tmpDir, { recursive: true });
const tmpFile = join(tmpDir, `${slug}.md`);
copyFileSync(ARTIKEL, tmpFile);

function jalan(label, args) {
  console.log(`  == ${label} ==`);
  const r = spawnSync(process.execPath, args, { stdio: "inherit", env: process.env });
  if (r.status !== 0) gagal(`${label} berhenti dengan error — periksa pesan di atas.`);
}

// 1. pipeline inti
const argsPipe = ["scripts/content-pipeline.mjs", "--article", tmpFile, "--date", tgl];
const jam = arg("--time"); if (jam) argsPipe.push("--time", jam);
jalan("pipeline (fakta + paket + pin + CSV)", argsPipe);
if (!existsSync(join(dirOut, "pin.png"))) gagal(`folder ${dirOut} tidak berisi pin.png`);

// 2. varian IG
jalan("varian IG 1080x1350", ["scripts/make-variant.mjs",
  join(dirOut, "pin.png"), "1080", "1350", join(dirOut, "ig.png")]);

// 3. video
const argsVid = ["scripts/make-video.mjs", "--dir", dirOut];
const voice = arg("--voice"); if (voice) argsVid.push("--voice", voice);
jalan("video (suara + rakit)", argsVid);

// 4. betulkan link artikel di CSV (pipeline masih menulis link artikel parkir)
const fCSV = join(dirOut, "metricool-draft.csv");
if (existsSync(fCSV)) {
  const isi = readFileSync(fCSV, "utf8")
    .replace("https://affittacameregliarchi.com/blog/siena-parking-and-transfer-guide/", urlArtikel);
  writeFileSync(fCSV, isi);
}

rmSync(tmpDir, { recursive: true, force: true });

console.log(`\n  SEMUA ASET SIAP -> ${dirOut}`);
console.log(`  link artikel di CSV: ${urlArtikel}`);
console.log(`\n  LANGKAH ANDA (tidak bisa diotomasi):`);
console.log(`  1. Buka REVIEW.md di folder itu, cocokkan 00-fakta.txt dengan artikel`);
console.log(`  2. Tonton video.mp4 sampai habis`);
console.log(`  3. Baru jadwalkan di Metricool\n`);
