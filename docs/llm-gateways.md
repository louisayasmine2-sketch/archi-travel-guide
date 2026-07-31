# Audit gateway LLM

Diaudit: **31 Juli 2026** dengan `scripts/audit-gateways.mjs`.
Ulangi kapan saja dengan:

```
node --env-file=.env.local scripts/audit-gateways.mjs
```

Kunci API tersimpan di `.env.local` (ter-gitignore). Dokumen ini hanya menyebut nama variabelnya, tidak pernah nilainya.

## Status gateway

| Gateway | Variabel env | Base URL | Status | Keterangan |
|---|---|---|---|---|
| AgentRouter | `AGENTROUTER_KEY` | `https://agentrouter.org` | ❌ Mati | 401 `unauthorized client detected` di semua endpoint |
| VSLLM | `VSLLM_KEY` | `https://vsllm.com` | ✅ Hidup | 57 model, chat completions berfungsi |
| GoRouter | `GOROUTER_KEY` | `https://gorouter.app` | ✅ Hidup | 4 model (semua Claude Opus), chat completions berfungsi |

### Detail AgentRouter (mati)

Ditolak 401 dengan pesan `unauthorized client detected, contact support for assistance at https://discord.gg/aYq5B4RW3` pada:

- `GET /v1/models` dan `POST /v1/chat/completions` (format OpenAI, header `Authorization: Bearer`)
- `POST /v1/messages` (format Anthropic, dicoba dengan header `x-api-key` maupun `Bearer`)

Karena kedua format dan kedua gaya autentikasi ditolak dengan pesan yang sama, ini bukan soal "endpoint beda" — kuncinya atau akunnya yang diblokir di sisi mereka. Perlu ditindaklanjuti ke kantor / support AgentRouter; tidak bisa diperbaiki dari sisi kita.

## Model yang tersedia

### GoRouter (4)

`claude-opus-4-8`, `claude-opus-4-8-thinking`, `claude-opus-5`, `claude-opus-5-thinking`

### VSLLM (57)

Kelompok besar (daftar lengkap ada di keluaran skrip / `.gateway-audit.json`):

- **Claude**: `claude-opus-5`, `claude-opus-4-8`, `claude-opus-4-6`, `claude-opus-4-5-20251101`, `claude-sonnet-5`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, `claude-fable-5`
- **OpenAI**: `gpt-5.5`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.6-luna/sol/terra`, `gpt-5.3-codex-spark`, `gpt-oss-120b`
- **Google**: `gemini-3.1-pro-preview`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-2.5-pro`
- **Lainnya**: DeepSeek v4 (`-flash`, `-flash-free`, `-pro`), GLM (`glm-5.2`, `glm-5.2-free`), Qwen 3.6/3.7, Kimi `kimi-k3`, MiniMax M2.5–M3, Grok 4.3/4.5, Doubao, MiMo
- **Gratis** (akhiran `-free` / `auto-free`): `auto-free`, `deepseek-v4-flash-free`, `glm-5.2-free`

> ⚠️ Katalog VSLLM memuat entri mencurigakan seperti `claude-fake-5`. Ini gateway agregator; nama model tidak menjamin model aslinya yang dilayani. Untuk pekerjaan yang bergantung pada kualitas model tertentu, uji dulu keluarannya sebelum dipercaya.

## Model di lebih dari satu gateway (cadangan failover)

| Model | Gateway |
|---|---|
| `claude-opus-4-8` | VSLLM, GoRouter |
| `claude-opus-5` | VSLLM, GoRouter |

Kalau satu gateway bermasalah, dua model ini bisa dipindah ke gateway satunya tanpa ganti nama model.

## Rekomendasi pemetaan tugas

Catatan: harga per token **tidak** diaudit di sesi ini — label "murah" di bawah disimpulkan dari kelas model dan akhiran `-free`, bukan dari daftar harga.

### (a) Agen coding (mengerjakan repo ini)

**GoRouter → `claude-opus-5-thinking`** (fallback: `claude-opus-5` di VSLLM).
GoRouter memang khusus melayani Claude Opus, varian `-thinking` cocok untuk kerja coding multi-langkah, dan modelnya tersedia juga di VSLLM sebagai cadangan.

### (b) Tugas borongan murah (alt text, meta description, terjemahan, klasifikasi)

**VSLLM → `gemini-3.1-flash-lite`** untuk volume besar; `deepseek-v4-flash-free` / `glm-5.2-free` kalau mau gratis total (uji dulu kualitas terjemahannya); `claude-haiku-4-5-20251001` kalau butuh hasil borongan yang lebih rapi.
GoRouter tidak punya model kecil, jadi borongan jangan ke sana — Opus untuk alt text itu buang uang.

### (c) Penalaran panjang (analisis dokumen, telaah kritis)

**GoRouter → `claude-opus-5-thinking`** sebagai pilihan utama; **VSLLM → `gemini-3.1-pro-preview`** atau `gpt-5.5` sebagai pembanding/second opinion lintas keluarga model.

## Endpoint non-chat

**Tidak ada yang bisa dipakai saat ini.**

| Endpoint | AgentRouter | VSLLM | GoRouter |
|---|---|---|---|
| `/v1/embeddings` | 401 | 503 | 503 |
| `/v1/audio/speech` | 401 | 503 | 503 |
| `/v1/images/generations` | 401 | 503 | 503 |
| `/v1/rerank` | 401 | 503 | 503 |

503 di VSLLM/GoRouter berbunyi `No available channel for model … under group default` — artinya rutenya ada (software router-nya mengenali endpoint), tapi tidak ada upstream yang dikonfigurasi untuk model non-chat. VSLLM mencantumkan `gemini-embedding-001` dan `mimo-v2.5-tts-voicedesign` di katalog, tapi tes embeddings nyata ke `gemini-embedding-001` gagal 403 (project Google di sisi upstream belum mengaktifkan Gemini API). Kesimpulan: untuk embeddings/TTS/gambar/rerank, jangan andalkan ketiga gateway ini dulu.

## File terkait

- `scripts/audit-gateways.mjs` — skrip audit, tanpa dependency, baca kunci dari `process.env`
- `.gateway-audit.json` — hasil lengkap terakhir (ter-gitignore)
- `.env.local` — kunci API (ter-gitignore, jangan pernah di-commit)
