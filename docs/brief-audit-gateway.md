# Brief: Audit 3 Gateway LLM

## Konteks

Kantor memberi saya akses ke tiga gateway LLM yang kompatibel dengan format OpenAI. Saya belum tahu model apa saja yang tersedia di masing-masing, dan saya belum tahu gateway mana yang sebaiknya dipakai untuk apa.

Kunci API sudah saya simpan di `.env.local` di root repo ini:

| Variabel | Base URL |
|---|---|
| `AGENTROUTER_KEY` | `https://agentrouter.org` |
| `VSLLM_KEY` | `https://vsllm.com` |
| `GOROUTER_KEY` | `https://gorouter.app` |

Catatan: AgentRouter diketahui menyediakan dua bentuk endpoint — `/v1/...` (format OpenAI) dan root `/` (format Anthropic, untuk Claude Code). Dua gateway lainnya belum diketahui bentuknya, tolong dideteksi.

---

## Aturan keamanan — WAJIB, tidak ada pengecualian

1. **Jangan pernah menulis nilai kunci ke file apa pun**, termasuk file skrip, log, komentar, atau dokumentasi. Baca selalu dari `process.env`.
2. **Jangan tampilkan kunci di output terminal.** Kalau perlu menunjukkan kunci mana yang dipakai, tampilkan maksimal 6 karakter pertama lalu `...`.
3. **Jangan commit atau push apa pun** dalam sesi ini tanpa saya minta secara eksplisit.
4. Sebelum melakukan hal lain, verifikasi `.env.local` dan `.gateway-audit.json` sudah ada di `.gitignore`. Kalau belum, tambahkan.

---

## Tugas 1 — Amankan dulu

- Cek `.gitignore`, pastikan memuat `.env.local` dan `.gateway-audit.json`.
- Jalankan `git status` dan konfirmasi ke saya bahwa tidak ada file berisi kunci yang ter-track.
- Kalau ada kunci yang pernah ter-commit di riwayat git, beri tahu saya. Jangan coba perbaiki sendiri.

## Tugas 2 — Buat skrip audit

Buat `scripts/audit-gateways.mjs` dengan ketentuan:

- Node 18+, pakai `fetch` bawaan. **Tanpa dependency eksternal apa pun.**
- Baca `.env.local` (boleh dengan `node --env-file=.env.local`).
- Untuk setiap gateway, lakukan berurutan:
  1. `GET {base}/v1/models` — catat status HTTP, jumlah model, dan seluruh `id` model.
  2. Kalau langkah 1 gagal, tetap lanjutkan: kirim `POST {base}/v1/chat/completions` dengan `max_tokens` kecil untuk menguji apakah kuncinya hidup. Ini membedakan "endpoint beda" dari "kunci mati".
  3. Deteksi endpoint tambahan yang tersedia dengan probe ringan: `/v1/embeddings`, `/v1/audio/speech`, `/v1/images/generations`, `/v1/rerank`. Cukup catat status kode, jangan benar-benar generate isi.
- Timeout 20 detik per permintaan. Satu gateway yang mati tidak boleh menghentikan audit gateway lain.
- Tangani semua error — skrip harus selalu selesai dan selalu melaporkan, tidak boleh crash.
- Output ke terminal berupa tabel ringkas yang mudah dibaca.
- Simpan hasil lengkap ke `.gateway-audit.json`.

## Tugas 3 — Jalankan dan laporkan

Jalankan skripnya, lalu ringkas untuk saya dalam bahasa Indonesia:

- Gateway mana yang hidup, mana yang tidak, dan apa penyebabnya.
- Daftar model yang tersedia di masing-masing.
- Rekomendasi pemetaan tugas ke model, dengan alasan singkat:
  - **(a) Agen coding** — untuk mengerjakan repo ini
  - **(b) Tugas borongan murah** — alt text, meta description, terjemahan, klasifikasi
  - **(c) Penalaran panjang** — analisis dokumen, telaah kritis
- Endpoint non-chat apa saja yang tersedia (embeddings / audio / image / rerank), dan di gateway mana.
- Kalau ada model yang muncul di lebih dari satu gateway, sebutkan — itu berguna sebagai cadangan saat satu gateway sedang bermasalah.

## Tugas 4 — Catat hasilnya

Tulis ringkasan Tugas 3 ke `docs/llm-gateways.md` supaya saya tidak perlu mengulang audit ini. **Tanpa kunci di dalamnya** — cukup nama variabel environment-nya.

---

## Yang tidak boleh dilakukan di sesi ini

- Jangan mengubah kode situs, komponen, konten, atau konfigurasi build.
- Jangan menambah dependency ke `package.json`.
- Jangan membuat file lain di luar yang disebut di atas.
- Jangan menghabiskan kredit untuk generasi besar — semua tes harus pakai `max_tokens` kecil.

Kalau ada bagian yang ambigu, tanyakan dulu sebelum mengeksekusi.
