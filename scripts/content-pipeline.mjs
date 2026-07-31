#!/usr/bin/env node
/**
 * content-pipeline.mjs — SATU PERINTAH: artikel → paket konten siap review.
 *
 *   node --env-file=.env.local scripts/content-pipeline.mjs --article <path-artikel.md>
 *
 * Opsi:
 *   --date  YYYY-MM-DD   tanggal tayang (default: besok)
 *   --time  HH:MM        jam tayang (default: 08:45)
 *   --img-base-url URL   basis URL publik gambar pin (utk kolom CSV)
 *
 * Tahapan:
 *   A. Ekstraksi fakta eksplisit dari artikel   (LLM)
 *   B. Paket konten 6 platform + teks pin       (LLM)
 *   C. SVG pin (template terverifikasi) → PNG   (sharp)
 *   D. metricool-draft.csv + REVIEW.md
 *
 * TIDAK ADA yang di-upload otomatis. Review manusia adalah gerbang terakhir.
 * Butuh: Node 18+, dan `npm i sharp` (sekali saja, untuk render PNG).
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const BASE_URL = process.env.PIPE_BASE_URL || "https://vsllm.com";
const API_KEY = process.env.VSLLM_KEY;
const MODEL = process.env.PIPE_MODEL || "gpt-5.5";
const BOARD = process.env.PIN_BOARD || "Siena Travel Tips";
const OUT_ROOT = "output/pipeline";

// ------------------------------------------------------------------ util

function gagal(pesan) { console.error(`\n  GAGAL: ${pesan}\n`); process.exit(1); }

function arg(nama, fallback = null) {
  const i = process.argv.indexOf(nama);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function slug(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
    .split(/\s+/).slice(0, 6).join("-").slice(0, 50) || "artikel";
}

function esc(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function csvCell(t) { return `"${String(t ?? "").replace(/"/g, '""')}"`; }

// ------------------------------------------------------------------ LLM

async function kirim(messages, opsi) {
  const body = { model: MODEL, messages: messages.map((m, i) =>
    i === 0 ? { role: opsi.peranSistem, content: m.content } : m) };
  body[opsi.kunciToken] = 3000;
  const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(300_000),
  });
  return { ok: res.ok, status: res.status, teks: await res.text() };
}

async function tanyaJSON(system, user, label) {
  let opsi = { kunciToken: "max_tokens", peranSistem: "system" };
  for (let p = 1; p <= 3; p++) {
    const r = await kirim([{ content: system }, { role: "user", content: user }], opsi);
    if (!r.ok) {
      const e = r.teks.toLowerCase();
      if (e.includes("max_tokens") && opsi.kunciToken === "max_tokens") {
        opsi = { ...opsi, kunciToken: "max_completion_tokens" }; continue;
      }
      if (e.includes("system") && opsi.peranSistem === "system") {
        opsi = { ...opsi, peranSistem: "developer" }; continue;
      }
      gagal(`[${label}] gateway menolak (HTTP ${r.status}):\n  ${r.teks.slice(0, 400)}`);
    }
    let data; try { data = JSON.parse(r.teks); } catch { gagal(`[${label}] jawaban bukan JSON`); }
    const isi = data?.choices?.[0]?.message?.content;
    if (!isi) gagal(`[${label}] struktur jawaban tak dikenali`);
    const bersih = isi.replace(/```json/gi, "").replace(/```/g, "").trim();
    try { return JSON.parse(bersih); }
    catch { gagal(`[${label}] model tidak mengembalikan JSON valid:\n${bersih.slice(0, 400)}`); }
  }
  gagal(`[${label}] gagal setelah 3 percobaan`);
}

// ------------------------------------------------------------------ prompt

const SYS_EKSTRAK = `Kamu mengekstrak fakta dari artikel travel untuk dipakai ulang sebagai bahan konten.

ATURAN MUTLAK:
- Ambil HANYA fakta yang tertulis eksplisit di artikel: angka, tarif, harga, jam, jarak, nama tempat, aturan, denda.
- JANGAN menyimpulkan, membulatkan, menggabungkan, atau menambah apa pun.
- Tulis tiap fakta sebagai satu kalimat pendek berdiri sendiri, dalam bahasa Inggris.
- Kalau artikel tidak memuat fakta bernomor/bernilai yang cukup, kembalikan daftar pendek apa adanya — jangan dipanjang-panjangkan.

Output HANYA JSON valid: {"facts": ["...", "..."]}`;

const SYS_PAKET = `Kamu penulis konten sosial media untuk Archi Travel Guide — panduan travel independen untuk Siena dan Tuscany.

ATURAN MUTLAK:
- JANGAN menambah fakta, angka, harga, jam, atau nama tempat di luar daftar fakta yang diberikan.
- Kalau format butuh detail yang tak tersedia, hilangkan — jangan mengarang.
- Tanpa klaim pengalaman pribadi. Tanpa kata berlebihan ("menakjubkan", "hidden gem").
- Setiap platform menyoroti SUDUT BERBEDA dari fakta yang sama. Dilarang mengulang kalimat antar platform.
- Naskah VO beralur: pembuka penahan → kontras → konsekuensi → penutup.
- Kalau fakta terlalu tipis untuk suatu format, isi field-nya dengan string kosong dan jelaskan di field "notes".

Semua teks bahasa Inggris. Output HANYA JSON valid:
{
  "vo_en": "...", "hooks": ["5 hook, maks 10 kata"],
  "facebook": "...", "instagram": "...", "tiktok": "...", "x": "maks 260 char",
  "pinterest_title": "maks 90 char", "pinterest_desc": "2-3 kalimat kaya kata kunci",
  "youtube_title": "maks 60 char", "youtube_description": "...",
  "hashtags": ["8-12 tanpa #"],
  "pin_top": "teks TERBESAR pin, maks 10 char, mis. €2/hr",
  "pin_bottom": "teks besar kedua, maks 10 char, mis. €35/day",
  "pin_sub": "satu baris di bawahnya, maks 32 char",
  "notes": "catatan jujur: field yang kosong dan alasannya, atau string kosong"
}`;

// ------------------------------------------------------------------ SVG pin
// Geometri dari template yang sudah diverifikasi: kanvas 1000x1500,
// blok judul mulai y=380, margin aman >= 60px per sisi.

function ukuranPas(teks, dasar, faktor = 0.6) {
  const maks = Math.floor(880 / (Math.max(1, teks.length) * faktor));
  return Math.min(dasar, maks);
}

function buatSVG({ pin_top, pin_bottom, pin_sub }) {
  const fTop = ukuranPas(pin_top, 170);
  const fBot = ukuranPas(pin_bottom, 170);
  const fSub = ukuranPas(pin_sub, 52, 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
  <rect width="1000" height="1500" fill="#1E3A2F"/>
  <g fill="#F0E6D2" text-anchor="middle">
    <text x="500" y="380" font-family="Georgia, serif" font-size="${fTop}" font-weight="700">${esc(pin_top)}</text>
    <text x="500" y="500" font-family="Georgia, serif" font-size="60" font-weight="400">vs</text>
    <text x="500" y="680" font-family="Georgia, serif" font-size="${fBot}" font-weight="700">${esc(pin_bottom)}</text>
    <rect x="350" y="760" width="300" height="5" rx="2.5" fill="#F0E6D2"/>
    <text x="500" y="870" font-family="Arial, Helvetica, sans-serif" font-size="${fSub}" font-weight="600">${esc(pin_sub)}</text>
    <text x="500" y="1380" font-family="Arial, Helvetica, sans-serif" font-size="34" letter-spacing="1">affittacameregliarchi.com</text>
  </g>
</svg>`;
}

// ------------------------------------------------------------------ main

async function main() {
  if (!API_KEY) gagal("VSLLM_KEY tidak terbaca. Jalankan dengan --env-file=.env.local");
  const pathArtikel = arg("--article");
  if (!pathArtikel) gagal("Sebutkan artikel: --article <path.md>");

  let artikel;
  try { artikel = readFileSync(pathArtikel, "utf8"); }
  catch { gagal(`Tidak bisa membaca ${pathArtikel}`); }

  const besok = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const tglTayang = arg("--date", besok);
  const jamTayang = arg("--time", "08:45");
  const imgBase = arg("--img-base-url", "");

  console.log(`\n  model    : ${MODEL} @ ${BASE_URL}`);
  console.log(`  artikel  : ${basename(pathArtikel)} (${artikel.length} char)`);

  // A — ekstraksi
  console.log("\n  [A] ekstraksi fakta...");
  const { facts } = await tanyaJSON(SYS_EKSTRAK,
    `Artikel:\n\n${artikel.slice(0, 24_000)}`, "ekstraksi");
  if (!facts?.length) gagal("Tidak ada fakta terekstrak — periksa isi artikel.");
  console.log(`      ${facts.length} fakta ditemukan`);

  // B — paket
  console.log("  [B] generate paket konten...");
  const paket = await tanyaJSON(SYS_PAKET,
    `Fakta terverifikasi:\n\n${facts.map((f) => `- ${f}`).join("\n")}`, "paket");

  // siapkan folder
  const dir = join(OUT_ROOT, `${tglTayang}-${slug(basename(pathArtikel, ".md"))}`);
  mkdirSync(dir, { recursive: true });

  // C — pin
  console.log("  [C] render pin...");
  const svg = buatSVG(paket);
  writeFileSync(join(dir, "pin.svg"), svg);
  let pngOK = false;
  try {
    const { default: sharp } = await import("sharp");
    await sharp(Buffer.from(svg)).resize(1000, 1500).png().toFile(join(dir, "pin.png"));
    pngOK = true;
  } catch {
    console.log("      sharp tidak terpasang -> pin.svg saja. (npm i sharp, lalu ulangi;");
    console.log("      atau konversi manual pin.svg di cloudconvert.com)");
  }

  // D — file teks + CSV + review
  const files = {
    "00-fakta.txt": facts.map((f, i) => `${i + 1}. ${f}`).join("\n"),
    "vo-en.txt": paket.vo_en,
    "hooks.txt": (paket.hooks || []).map((h, i) => `${i + 1}. ${h}`).join("\n"),
    "facebook.txt": paket.facebook, "instagram.txt": paket.instagram,
    "tiktok.txt": paket.tiktok, "x.txt": paket.x,
    "pinterest.txt": `${paket.pinterest_title}\n\n${paket.pinterest_desc}`,
    "youtube.txt": `${paket.youtube_title}\n\n${paket.youtube_description}`,
    "hashtags.txt": (paket.hashtags || []).map((h) => `#${h}`).join(" "),
    "raw.json": JSON.stringify({ facts, paket }, null, 2),
  };
  for (const [n, isi] of Object.entries(files)) if (isi) writeFileSync(join(dir, n), String(isi));

  const imgURL = imgBase ? `${imgBase.replace(/\/$/, "")}/${tglTayang}-pin.png`
                         : "ISI-URL-PUBLIK-GAMBAR";
  const csv = [
    ["Text", "Date", "Time", "Pinterest", "Picture Url 1", "Pinterest Board", "Pin Title", "Pin Link"],
    [paket.pinterest_desc, tglTayang, jamTayang, "TRUE", imgURL, BOARD,
     paket.pinterest_title, "https://affittacameregliarchi.com/blog/siena-parking-and-transfer-guide/"],
  ].map((r) => r.map(csvCell).join(",")).join("\n");
  writeFileSync(join(dir, "metricool-draft.csv"), csv);

  writeFileSync(join(dir, "REVIEW.md"), `# Review sebelum tayang — WAJIB

- [ ] Baca 00-fakta.txt: semua fakta memang ada di artikel? (buka artikelnya, cocokkan angka)
- [ ] Baca semua .txt: ADA angka/nama yang TIDAK ada di 00-fakta.txt? Kalau ada -> buang/perbaiki
- [ ] notes dari model: ${paket.notes || "(kosong)"}
- [ ] pin.png: teks muat, terbaca di ukuran kecil?
- [ ] Upload pin.png ke hosting publik (mis. folder public/pins/ situs, lalu deploy)
- [ ] Edit metricool-draft.csv: pastikan kolom "Picture Url 1" berisi URL publik yang benar
- [ ] Kolom "Pin Link": masih hardcoded artikel parkir — GANTI kalau artikelnya beda
- [ ] PENTING: sebelum import pertama, unduh template resmi dari Metricool
      (Planning -> titik tiga kanan atas -> Import CSV -> Download template)
      dan samakan nama kolom CSV ini dengan template itu kalau berbeda
- [ ] Import: Planning -> Import CSV -> pilih format tanggal YYYY-MM-DD dan waktu HH:mm
`);

  console.log(`\n  selesai -> ${dir}`);
  console.log(pngOK ? "  pin.png siap." : "  pin.svg perlu dikonversi manual.");
  console.log(`  catatan model: ${paket.notes || "-"}`);
  console.log("\n  LANGKAH ANDA: buka REVIEW.md di folder itu dan jalani ceklisnya.\n");
}

main().catch((e) => gagal(e.message));
