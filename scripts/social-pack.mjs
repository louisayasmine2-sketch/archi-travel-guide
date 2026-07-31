#!/usr/bin/env node
/**
 * social-pack.mjs
 *
 * Satu fakta terverifikasi  ->  paket konten untuk 6 platform.
 *
 * Cara pakai:
 *   node --env-file=.env.local scripts/social-pack.mjs "teks fakta di sini"
 *   node --env-file=.env.local scripts/social-pack.mjs --file facts/parkir-siena.md
 *
 * Butuh Node 18+. Tanpa dependency eksternal.
 *
 * ATURAN UTAMA: model tidak boleh menambah fakta, angka, harga, jam, atau nama
 * apa pun yang tidak ada di input. Kalau kurang, ia harus menghilangkan, bukan
 * mengarang. Akurasi adalah aset situs ini.
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.SOCIAL_BASE_URL || "https://vsllm.com";
const API_KEY = process.env.VSLLM_KEY;
const MODEL = process.env.SOCIAL_MODEL || "gpt-5.6-sol";
const OUT_ROOT = "output/social";

// ---------------------------------------------------------------- argumen

function bacaInput() {
  const args = process.argv.slice(2);
  if (args.length === 0) return null;

  const i = args.indexOf("--file");
  if (i !== -1) {
    const path = args[i + 1];
    if (!path) gagal("--file butuh nama file setelahnya.");
    try {
      return readFileSync(path, "utf8").trim();
    } catch {
      gagal(`Tidak bisa membaca file: ${path}`);
    }
  }
  return args.join(" ").trim();
}

function gagal(pesan) {
  console.error(`\n  ${pesan}\n`);
  process.exit(1);
}

function slug(teks) {
  return teks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join("-")
    .slice(0, 50) || "fakta";
}

// ---------------------------------------------------------------- prompt

const SYSTEM = `Kamu penulis konten sosial media untuk Archi Travel Guide — panduan travel independen untuk Siena dan Tuscany.

ATURAN PALING PENTING — tidak ada pengecualian:
- JANGAN PERNAH menambah fakta, angka, harga, jarak, jam buka, tanggal, atau nama tempat yang tidak ada di input.
- Kalau sebuah format butuh detail yang tidak tersedia, hilangkan detail itu. Jangan diisi tebakan.
- Jangan menulis klaim pengalaman pribadi ("saya pernah ke sana", "rasanya luar biasa"). Situs ini hanya memuat detail praktis terverifikasi.
- Jangan pakai kata sifat berlebihan seperti "menakjubkan", "wajib dikunjungi", "surga tersembunyi".

Gaya: langsung, spesifik, berguna. Angka jadi bintang utamanya, bukan hiasan.

Output HANYA JSON valid. Tanpa markdown, tanpa pembuka, tanpa pagar kode.

Struktur JSON:
{
  "vo_en": "naskah voice-over bahasa Inggris untuk video 30-40 detik. Kalimat pendek, mudah dibaca keras.",
  "hooks": ["5 pembuka alternatif bahasa Inggris, maksimal 10 kata, untuk 3 detik pertama"],
  "facebook": "teks postingan Facebook bahasa Inggris, 2-4 kalimat, boleh ada sedikit konteks",
  "instagram": "caption Instagram bahasa Inggris, padat, baris pertama harus menahan orang berhenti scroll",
  "tiktok": "caption TikTok bahasa Inggris, sangat pendek, 1-2 kalimat",
  "x": "postingan X bahasa Inggris, maksimal 260 karakter",
  "pinterest": "deskripsi Pinterest bahasa Inggris, kaya kata kunci pencarian, 2-3 kalimat",
  "youtube_title": "judul YouTube Shorts bahasa Inggris, maksimal 60 karakter",
  "youtube_description": "deskripsi YouTube Shorts bahasa Inggris, 2-3 kalimat",
  "hashtags": ["8-12 hashtag relevan tanpa tanda pagar"]
}`;

// ---------------------------------------------------------------- API

function susunBody(fakta, opsi) {
  const body = {
    model: MODEL,
    messages: [
      { role: opsi.peranSistem, content: SYSTEM },
      { role: "user", content: `Fakta terverifikasi:\n\n${fakta}` },
    ],
  };
  body[opsi.kunciToken] = 2000;
  return body;
}

async function kirim(fakta, opsi) {
  const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(susunBody(fakta, opsi)),
    signal: AbortSignal.timeout(120_000),
  });
  return { ok: res.ok, status: res.status, teks: await res.text() };
}

async function panggilModel(fakta) {
  // Sebagian model kelas GPT terbaru menolak `max_tokens` atau peran `system`.
  // Coba bentuk standar dulu, lalu sesuaikan otomatis kalau ditolak.
  let opsi = { kunciToken: "max_tokens", peranSistem: "system" };

  for (let percobaan = 1; percobaan <= 3; percobaan++) {
    const r = await kirim(fakta, opsi);

    if (!r.ok) {
      const pesan = r.teks.toLowerCase();

      if (pesan.includes("max_tokens") && opsi.kunciToken === "max_tokens") {
        console.log("  menyesuaikan: max_tokens -> max_completion_tokens");
        opsi = { ...opsi, kunciToken: "max_completion_tokens" };
        continue;
      }
      if (pesan.includes("system") && opsi.peranSistem === "system") {
        console.log("  menyesuaikan: peran system -> developer");
        opsi = { ...opsi, peranSistem: "developer" };
        continue;
      }
      gagal(`Gateway menolak (HTTP ${r.status}):\n  ${r.teks.slice(0, 500)}`);
    }

    let data;
    try {
      data = JSON.parse(r.teks);
    } catch {
      gagal(`Jawaban bukan JSON:\n  ${r.teks.slice(0, 400)}`);
    }

    const isi = data?.choices?.[0]?.message?.content;
    if (!isi) gagal(`Struktur jawaban tak dikenali:\n  ${r.teks.slice(0, 400)}`);

    const bersih = isi.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      return { hasil: JSON.parse(bersih), usage: data.usage };
    } catch {
      gagal(`Model tidak mengembalikan JSON valid:\n\n${bersih.slice(0, 600)}`);
    }
  }

  gagal("Gagal setelah 3 percobaan penyesuaian.");
}

// ---------------------------------------------------------------- simpan

function simpan(dir, hasil, fakta) {
  mkdirSync(dir, { recursive: true });

  const berkas = {
    "00-fakta-sumber.txt": fakta,
    "vo-en.txt": hasil.vo_en,
    "hooks.txt": (hasil.hooks || []).map((h, i) => `${i + 1}. ${h}`).join("\n"),
    "facebook.txt": hasil.facebook,
    "instagram.txt": hasil.instagram,
    "tiktok.txt": hasil.tiktok,
    "x.txt": hasil.x,
    "pinterest.txt": hasil.pinterest,
    "youtube.txt": `${hasil.youtube_title}\n\n${hasil.youtube_description}`,
    "hashtags.txt": (hasil.hashtags || []).map((h) => `#${h}`).join(" "),
    "raw.json": JSON.stringify(hasil, null, 2),
  };

  for (const [nama, isi] of Object.entries(berkas)) {
    if (isi) writeFileSync(join(dir, nama), String(isi), "utf8");
  }
}

// ---------------------------------------------------------------- jalan

async function main() {
  if (!API_KEY) {
    gagal(
      "VSLLM_KEY tidak terbaca.\n" +
      "  Jalankan dengan: node --env-file=.env.local scripts/social-pack.mjs \"fakta\""
    );
  }

  const fakta = bacaInput();
  if (!fakta) {
    gagal(
      "Belum ada fakta yang dimasukkan.\n\n" +
      '  node --env-file=.env.local scripts/social-pack.mjs "Parkir di luar tembok Siena €2/jam, di dalam ZTL €35/hari"\n' +
      "  node --env-file=.env.local scripts/social-pack.mjs --file facts/parkir.md"
    );
  }

  console.log(`\n  model   : ${MODEL}`);
  console.log(`  gateway : ${BASE_URL}`);
  console.log(`  fakta   : ${fakta.slice(0, 70)}${fakta.length > 70 ? "..." : ""}\n`);
  console.log("  memproses...");

  const mulai = Date.now();
  const { hasil, usage } = await panggilModel(fakta);
  const detik = ((Date.now() - mulai) / 1000).toFixed(1);

  const stamp = new Date().toISOString().slice(0, 10);
  const dir = join(OUT_ROOT, `${stamp}-${slug(fakta)}`);
  simpan(dir, hasil, fakta);

  console.log(`  selesai dalam ${detik}s`);
  if (usage) console.log(`  token   : ${usage.prompt_tokens} masuk / ${usage.completion_tokens} keluar`);
  console.log(`  tersimpan di ${dir}\n`);

  console.log("  --- naskah voice-over (EN) ---\n");
  console.log(`  ${hasil.vo_en}\n`);
  console.log("  --- pilihan hook ---\n");
  (hasil.hooks || []).forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
  console.log("");
}

main().catch((e) => gagal(`Gagal: ${e.message}`));
