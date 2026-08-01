#!/usr/bin/env node
/**
 * make-video.mjs — vo-en.txt + pin.png → video vertikal TikTok / YouTube Shorts.
 *
 *   node scripts/make-video.mjs --dir output/pipeline/2026-08-01-indexhtml
 *
 * Opsi:
 *   --voice en-GB-SoniaNeural   (atau env VO_VOICE; daftar: python -m edge_tts --list-voices)
 *
 * Tahapan:
 *   1. vo-en.txt → suara (edge-tts, gratis, tanpa API key) + subtitle .srt
 *   2. pin.png + suara → video.mp4 1080x1920, latar hijau brand (ffmpeg-static)
 *
 * Tidak memakai kredit gateway sama sekali. Butuh: python + edge-tts, npm i ffmpeg-static.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const PY = process.env.PY || "python";
const VOICE = (() => {
  const i = process.argv.indexOf("--voice");
  return (i !== -1 && process.argv[i + 1]) || process.env.VO_VOICE || "en-GB-SoniaNeural";
})();

function gagal(p) { console.error(`\n  GAGAL: ${p}\n`); process.exit(1); }

const iDir = process.argv.indexOf("--dir");
const DIR = iDir !== -1 ? process.argv[iDir + 1] : null;
if (!DIR) gagal("Sebutkan folder paket: --dir output/pipeline/<folder>");

const fVO = join(DIR, "vo-en.txt");
const fPIN = join(DIR, "pin.png");
if (!existsSync(fVO)) gagal(`${fVO} tidak ada`);
if (!existsSync(fPIN)) gagal(`${fPIN} tidak ada — jalankan content-pipeline dulu`);

const fMP3 = join(DIR, "vo.mp3");
const fSRT = join(DIR, "vo.srt");
const fOUT = join(DIR, "video.mp4");

console.log(`\n  suara  : ${VOICE}`);
console.log(`  folder : ${DIR}\n`);

// ---- 1. TTS ---------------------------------------------------------------
console.log("  [1] membuat suara...");
let r = spawnSync(PY, ["-m", "edge_tts",
  "--voice", VOICE, "--file", fVO,
  "--write-media", fMP3, "--write-subtitles", fSRT,
], { encoding: "utf8" });

if (r.status !== 0) {
  // beberapa versi edge-tts tidak punya --write-subtitles: ulang tanpa subtitle
  r = spawnSync(PY, ["-m", "edge_tts",
    "--voice", VOICE, "--file", fVO, "--write-media", fMP3,
  ], { encoding: "utf8" });
  if (r.status !== 0) gagal(`edge-tts gagal:\n${(r.stderr || r.stdout || "").slice(0, 500)}`);
  console.log("      (versi edge-tts ini tanpa subtitle — vo.srt dilewati)");
}
if (!existsSync(fMP3)) gagal("vo.mp3 tidak tercipta");
console.log("      vo.mp3 siap");

// ---- 2. Rakit video -------------------------------------------------------
// pin 1000x1500 diskalakan ke lebar 1080, dipasang di kanvas 1080x1920,
// sisa atas-bawah diisi hijau brand. -shortest: video berhenti saat suara habis.
console.log("  [2] merakit video...");
const vf = "scale=1080:1920:force_original_aspect_ratio=decrease," +
           "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x1E3A2F,format=yuv420p";

const f = spawnSync(ffmpegPath, [
  "-y",
  "-loop", "1", "-i", fPIN,
  "-i", fMP3,
  "-vf", vf,
  "-r", "30",
  "-c:v", "libx264", "-tune", "stillimage", "-preset", "medium",
  "-c:a", "aac", "-b:a", "192k",
  "-movflags", "+faststart",
  "-shortest",
  fOUT,
], { encoding: "utf8" });

if (f.status !== 0) gagal(`ffmpeg gagal:\n${(f.stderr || "").slice(-600)}`);
if (!existsSync(fOUT)) gagal("video.mp4 tidak tercipta");

console.log(`\n  selesai -> ${fOUT}`);
if (existsSync(fSRT)) console.log(`  subtitle -> ${fSRT} (upload ke YouTube; TikTok punya auto-caption)`);
console.log("\n  LANGKAH ANDA: tonton video.mp4 sampai habis sebelum menjadwalkan.");
console.log("  Dengarkan: pengucapan angka & nama tempat benar? Kalau ada yang aneh,");
console.log("  perbaiki teks di vo-en.txt lalu jalankan ulang skrip ini.\n");
