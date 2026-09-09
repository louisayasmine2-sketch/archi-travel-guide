# GSC & Indexation Tracker (Siena Sprint)

Tujuan sprint: bikin 10 artikel Siena cepat masuk index dan mulai dapat traffic.

## 10 URL target

1. `/blog/siena-hotel-vs-apartment-guide`
2. `/blog/siena-parking-and-transfer-guide`
3. `/blog/siena-with-kids-in-one-day`
4. `/blog/siena-from-florence-airport-transfer`
5. `/blog/siena-weekend-itinerary-for-couples`
6. `/blog/siena-budget-and-meal-planning`
7. `/blog/siena-food-that-fits-a-budget`
8. `/blog/siena-day-trips-without-a-car`
9. `/blog/siena-weather-and-what-to-pack`
10. `/blog/siena-tours-and-classes-to-book-first`

## Cara pakai (7 hari)

Langkah:
1. Pastikan `https://<domain-kamu>/sitemap.xml` sudah include 10 URL ini (manual check atau grep).
2. Google Search Console → **Sitemaps**: submit `sitemap.xml` (sekali).
3. Google Search Console → **URL Inspection**: inspect masing-masing URL, klik **Request indexing**.
4. Update table di bawah tiap hari (1, 3, 7 hari).

## Daily track log

Isi status sesuai:
- `indexed` = sudah indexed
- `submitted` = sudah di-request
- `discovered` = sudah ditemukan
- `excluded` = ada reason (lihat notes)
- `error` = error indexing (isi note per error)

| URL | Last published | Day 0 | Day 1 | Day 3 | Day 7 | CTR trend |
| --- | --- | --- | --- | --- | --- | --- |
| /blog/siena-hotel-vs-apartment-guide | 2026-07-03 |  |  |  |  |  |
| /blog/siena-parking-and-transfer-guide | 2026-07-03 |  |  |  |  |  |
| /blog/siena-with-kids-in-one-day | 2026-07-03 |  |  |  |  |  |
| /blog/siena-from-florence-airport-transfer | 2026-07-03 |  |  |  |  |  |
| /blog/siena-weekend-itinerary-for-couples | 2026-07-03 |  |  |  |  |  |
| /blog/siena-budget-and-meal-planning | 2026-07-03 |  |  |  |  |  |
| /blog/siena-food-that-fits-a-budget | 2026-07-03 |  |  |  |  |  |
| /blog/siena-day-trips-without-a-car | 2026-07-03 |  |  |  |  |  |
| /blog/siena-weather-and-what-to-pack | 2026-07-03 |  |  |  |  |  |
| /blog/siena-tours-and-classes-to-book-first | 2026-07-03 |  |  |  |  |  |

## Follow-up jika status tidak naik setelah 7 hari

- Pastikan URL sudah reachable (200) dan tidak `noindex`.
- Cek link internal ke halaman itu dari 2+ halaman pendukung.
- Tambahkan 1 internal link ke masing-masing dari:
  - `/siena`, `/siena-2-day-itinerary`, `/siena-3-day-itinerary`.
- Submit ulang Sitemap + request indexing ulang untuk URL yang belum.

---

# Batch 2 — Sprint musim gugur + hub komparasi (published 2026-07-31)

13 artikel baru, semua sudah di sitemap.xml (regenerate otomatis saat `yarn build`).
Setelah deploy: URL Inspection → Request indexing untuk tiap URL di bawah, lalu isi tabel.

Prioritas request indexing (kalau kuota harian GSC terbatas, jalankan sesuai urutan ini —
musiman yang paling dekat tanggalnya dulu, lalu hub komparasi yang jadi pusat internal link):

1. `/blog/tuscany-in-august-2026` — relevan *sekarang* (Agustus mulai besok)
2. `/blog/siena-in-september-2026`
3. `/blog/tuscany-wine-harvest-vendemmia-2026`
4. `/blog/florence-or-siena-which-to-visit-2026` — hub komparasi terbesar
5. `/blog/san-gimignano-day-trip-from-siena-2026`
6. `/blog/siena-or-san-gimignano-day-trip-2026`
7. `/blog/tuscany-in-october-2026`
8. `/blog/tuscany-olive-harvest-olio-nuovo-2026`
9. `/blog/val-dorcia-or-chianti-which-to-visit-2026`
10. `/blog/tuscany-in-november-2026`
11. `/blog/tuscany-in-december-2026`
12. `/blog/tuscany-in-january-2027`
13. `/blog/tuscany-in-february-2027`

## Daily track log — Batch 2

| URL | Last published | Day 0 | Day 1 | Day 3 | Day 7 | CTR trend |
| --- | --- | --- | --- | --- | --- | --- |
| /blog/tuscany-in-august-2026 | 2026-07-31 |  |  |  |  |  |
| /blog/siena-in-september-2026 | 2026-08-02 |  |  |  |  |  |
| /blog/tuscany-wine-harvest-vendemmia-2026 | 2026-07-31 |  |  |  |  |  |
| /blog/florence-or-siena-which-to-visit-2026 | 2026-08-03 |  |  |  |  |  |
| /blog/san-gimignano-day-trip-from-siena-2026 | 2026-07-31 |  |  |  |  |  |
| /blog/siena-or-san-gimignano-day-trip-2026 | 2026-08-05 |  |  |  |  |  |
| /blog/tuscany-in-october-2026 | 2026-08-06 |  |  |  |  |  |
| /blog/tuscany-olive-harvest-olio-nuovo-2026 | 2026-08-04 |  |  |  |  |  |
| /blog/val-dorcia-or-chianti-which-to-visit-2026 | 2026-08-07 |  |  |  |  |  |
| /blog/tuscany-in-november-2026 | 2026-08-08 |  |  |  |  |  |
| /blog/tuscany-in-december-2026 | 2026-08-09 |  |  |  |  |  |
| /blog/tuscany-in-january-2027 | 2026-08-10 |  |  |  |  |  |
| /blog/tuscany-in-february-2027 | 2026-08-11 |  |  |  |  |  |

Catatan batch 2:
- Semua artikel 2.500+ kata, FAQPage JSON-LD aktif, meta description valid 110–155.
- Tiap URL menerima 5–20 internal link dari artikel lain (discovery path selain sitemap).
- Follow-up 7-hari yang sama dengan batch 1 berlaku; halaman pendukung untuk internal
  link tambahan: tiga hub komparasi (florence-or-siena, siena-or-san-gimignano,
  val-dorcia-or-chianti) — semuanya sudah menaut ke artikel musiman.


## Daily track log — Batch 3 (drip 12–29 Agustus)

Prioritas request-indexing: mulai dari baris teratas pada hari tayang masing-masing.
Dua baris pertama sudah live saat batch ini dibuat (12–13 Agu); sisanya menyusul harian.

| URL | Published | Day 0 | Day 1 | Day 3 | Day 7 | CTR trend |
| --- | --- | --- | --- | --- | --- | --- |
| /blog/italy-beach-rules-2026 | 2026-08-12 |  |  |  |  |  |
| /blog/tuscany-on-screen-film-locations-2026 | 2026-08-13 |  |  |  |  |  |
| /blog/rome-to-siena-train-bus-2026 | 2026-08-14 |  |  |  |  |  |
| /blog/tuscan-food-calendar-seasonal-dishes | 2026-08-15 |  |  |  |  |  |
| /blog/what-to-buy-in-tuscany-souvenirs | 2026-08-16 |  |  |  |  |  |
| /blog/via-francigena-day-walk-siena | 2026-08-17 |  |  |  |  |  |
| /blog/renting-a-car-in-tuscany-2026 | 2026-08-18 |  |  |  |  |  |
| /blog/bottini-di-siena-underground-aqueduct | 2026-08-18 |  |  |  |  |  |
| /blog/tuscany-in-march-2027 | 2026-08-19 |  |  |  |  |  |
| /blog/giostra-del-saracino-arezzo-2026 | 2026-08-20 |  |  |  |  |  |
| /blog/tuscany-september-2026-festivals-events | 2026-08-21 |  |  |  |  |  |
| /blog/rent-a-car-in-florence-or-siena-2026 | 2026-08-22 |  |  |  |  |  |
| /blog/siena-day-trip-or-overnight-2026 | 2026-08-23 |  |  |  |  |  |
| /blog/montalcino-or-montepulciano-2026 | 2026-08-24 |  |  |  |  |  |
| /blog/tuscany-without-a-car-2026 | 2026-08-25 |  |  |  |  |  |
| /blog/bagno-vignoni-bagni-san-filippo-hot-springs | 2026-08-26 |  |  |  |  |  |
| /blog/is-arezzo-worth-visiting-2026 | 2026-08-27 |  |  |  |  |  |
| /blog/pienza-pecorino-fiera-del-cacio-2026 | 2026-08-28 |  |  |  |  |  |
| /blog/what-to-wear-in-tuscany-in-september | 2026-08-29 |  |  |  |  |  |
| /blog/panzano-in-chianti-cecchini-vino-al-vino | 2026-08-30 |  |  |  |  |  |
| /blog/via-francigena-which-section-to-walk | 2026-08-31 |  |  |  |  |  |
| /blog/uffizi-tickets-sold-out-what-to-do | 2026-09-01 |  |  |  |  |  |
| /blog/leroica-gaiole-in-chianti-2026 | 2026-09-02 |  |  |  |  |  |
| /blog/accademia-tickets-sold-out-florence | 2026-09-03 |  |  |  |  |  |
| /blog/battle-of-montaperti-1260-siena | 2026-09-04 |  |  |  |  |  |
| /blog/siena-1348-the-year-the-city-stopped | 2026-09-05 |  |  |  |  |  |
| /blog/saint-catherine-of-siena-places | 2026-09-06 |  |  |  |  |  |
| /blog/monte-dei-paschi-oldest-bank-siena | 2026-09-07 |  |  |  |  |  |
| /blog/sienese-school-painting-where-to-see | 2026-09-08 |  |  |  |  |  |
| /blog/crete-senesi-guide | 2026-09-09 |  |  |  |  |  |
| /blog/monteriggioni-guide | 2026-09-10 |  |  |  |  |  |
| /blog/buonconvento-guide | 2026-09-11 |  |  |  |  |  |
| /blog/san-quirico-dorcia-guide | 2026-09-12 |  |  |  |  |  |
| /blog/asciano-guide | 2026-09-13 |  |  |  |  |  |
| /blog/where-to-eat-siena-day-trips | 2026-09-14 |  |  |  |  |  |
| /blog/lucca-comics-and-games-2026-tuscany-guide | 2026-09-15 |  |  |  |  |  |

Catatan batch 3:
- Halaman live yang berubah signifikan dan layak re-request saat deploy: homepage
  (link DiscoverCars + schema brand), /about (identitas PT), siena-day-trips-without-a-car,
  where-to-stay-in-siena, tuscany-on-screen (section Assassin's Creed), vendemmia,
  strikes guide, artikel ETIAS.
- Flagship klaster: /blog/tuscany-without-a-car-2026 menerima link dari 10+ halaman —
  prioritaskan indexing-nya begitu tayang 25 Agu.

---

# Catatan GSC — 2026-08-12: drilldown "Blocked by robots.txt"

Link drilldown yang dibagikan (`item_key=CAMYCyAC`) mengarah ke kategori
**"Blocked by robots.txt"** di bagian *Why pages aren't indexed* untuk properti
`sc-domain:affittacameregliarchi.com`. Identifikasi dari luar akun: item_key
adalah protobuf base64 (reason enum 11, bucket 3 = not indexed), cocok dengan
link drilldown publik ber-item_key sama yang beredar di forum SEO untuk laporan
"pagina bloccata da robots.txt". Konfirmasi final tetap lewat checklist di bawah.

## Kenapa baru muncul sekarang

`robots.txt` dengan `Disallow: /go/` pertama kali live 2026-07-31. Sejak itu
Google berhenti meng-crawl endpoint redirect afiliasi `/go/*` (11 slug di
`_redirects`, plus varian query seperti `/go/booking-search?ss=...`) dan
laporan GSC memindahkannya ke bucket ini — sebelum ada robots.txt, URL yang
sama akan tampil sebagai "Page with redirect". Naiknya angka di baris laporan
ini adalah efek yang memang diinginkan, bukan regresi.

## Status: intentional — tidak ada yang perlu difix

- `/go/*` memang tidak boleh di-crawl/di-index: itu endpoint redirect afiliasi.
- Tidak ada URL `/go/` di sitemap (dicek 2026-08-12: 0 dari 105 URL).
- Link `/go/` di halaman sudah menyandang `rel="sponsored"` (Viator,
  DiscoverCars — tracking live) atau `rel="nofollow"` (programme yang masih
  pending), jadi sinyal "paid link" tidak bergantung pada crawl redirect-nya.
- Jangan klik "Validate fix" untuk baris ini, dan jangan longgarkan robots.txt.

## Checklist verifikasi (buka drilldown-nya, butuh login GSC)

Satu-satunya rule Disallow kita adalah `/go/`, jadi **semua** contoh URL di
daftar drilldown harus berawalan `/go/`. Jumlah wajar: ±11 plus varian query.
Kalau ada URL non-`/go/` di daftar itu, berarti production menyajikan
robots.txt yang berbeda dari repo (mis. di subdomain) — investigasi dulu
sebelum menyimpulkan apa pun.

## Temuan sampingan saat audit (2026-08-12)

Dua artikel batch Rank-1 (2026-08-10) menaut guide Florence–Siena di path salah
`/blog/florence-to-siena-by-train-or-bus/` — path itu tidak punya route sehingga
merender halaman 404 (HTTP 200 + noindex).

Ketiga link konten itu **sudah dibetulkan lewat #78** (2026-08-14), dikerjakan
paralel dan lebih dulu sampai di `main`; branch ini tidak lagi menyumbang
perbaikan link tersebut. Yang tetap disumbang di sini adalah **301 safety net di
`_redirects`** untuk URL salah yang mungkin terlanjur ter-crawl selama URL itu
hidup — perbaikan konten saja tidak menangani URL yang sudah masuk index Google.
Aturan barunya diuji dengan `wrangler pages dev`: kedua varian 301 ke
`/florence-to-siena-by-train-or-bus/`, path kanonik tetap 200 (tidak ada loop),
dan seluruh rule lama tidak berubah. Kalau URL salahnya sempat muncul di GSC
(soft 404 / excluded by noindex), akan bergeser ke "Page with redirect" lalu
hilang setelah recrawl.

Koreksi 2026-08-12: sempat ditambahkan independence note inline di tiga artikel
(florence-or-siena-which-to-visit-2026, rome-to-siena-train-bus-2026,
siena-day-trip-or-overnight-2026) karena dikira belum punya. Ternyata ketiganya
sudah membawa note house-style di akhir section `how-we-checked` ("We have no
affiliate relationship…") — grep awal memakai pola yang salah sehingga tidak
menemukannya. Note inline itu sudah dihapus lagi; tidak ada perubahan bersih
pada ketiga artikel.

Update setelah merge #74 (scanner disclosure baru): `audit_content.py` sekarang
menilai disclosure terhadap programme yang benar-benar live di `_redirects`,
bukan sekadar ada-tidaknya link. Hasilnya **No findings** untuk seluruh korpus —
tiga artikel di atas tidak lagi menyala karena hanya menaut programme yang masih
pending (Booking/Omio/Trainline) dan sudah membawa independence note. Ini
sekaligus memastikan koreksi di atas: ketiganya memang sudah patuh sejak awal.
Mulai sekarang `links_without_disclosure` selalu pelanggaran nyata — perbaiki
di hari ia muncul, jangan ditutup dengan disclosure palsu.


---

# Catatan GSC — 2026-08-17: email "Server error (5xx)" + fix judul dobel

Email GSC melaporkan reason baru "Server error (5xx)". Hasil investigasi dari
repo (produksi tidak bisa diakses dari sandbox):

- Repo ini murni static di Cloudflare Pages — tidak ada Pages Functions atau
  `_worker.js` — jadi 5xx bukan berasal dari kode aplikasi. Sumbernya pasti di
  lapisan Cloudflare (transien saat deploy, WAF/rate-limit, atau DNS).
- Workflow `Deploy Smoke Check` ternyata GAGAL di semua 30 run sejak 9 Agu,
  tapi bukan karena 5xx — semua URL menjawab 200. Penyebabnya "title
  mismatch": setiap halaman pre-render menyajikan DUA tag `<title>` + dua meta
  description (bawaan template shell + suntikan generator), dan tag pertama
  selalu judul brand generik. Crawler yang membaca HTML mentah juga melihat
  judul generik itu lebih dulu.
- Fix-nya **mendarat lewat #107** (2026-08-17): `generate-static-html.js`
  membuang title/description polos milik template sebelum menyuntik pasangan
  data-rh, dan ekspektasi judul homepage di `smoke-deploy.mjs` diperbarui ke
  judul hasil rewrite #76 — plus `extractTitle` kini mendekode entity HTML.
  Branch PR #70 sempat membawa fix yang sama (dikerjakan paralel, diverifikasi
  lokal: 114 halaman tepat satu title + satu description, tag Impact utuh,
  sembilan cek smoke PASS dalam simulasi), lalu mengadopsi versi #107 saat
  merge supaya main tetap satu-satunya sumber implementasi.

Langkah 5xx yang tersisa (butuh akses GSC/Cloudflare, manual):
1. Buka indexing report → baris "Server error (5xx)" → catat contoh URL dan
   tanggal last crawled.
2. Kalau tanggalnya bertepatan dengan deploy dan URL-nya acak → transien;
   klik Validate Fix dan pantau.
3. Kalau berpola atau berlanjut → cek Cloudflare (Security → Events, dan
   Analytics → status 5xx) untuk user-agent Googlebot; ini konfigurasi zone,
   bukan repo.

---

# Catatan GSC — 2026-09-09: ekspor Coverage (indeksasi) — temuan dan perbaikan

Ekspor Coverage dari Search Console (Chart + Critical issues, 2 Jul–4 Sep 2026)
dianalisis di repo. Ini laporan indeksasi, bukan Performance/Queries — data
kueri dan klik per halaman masih belum ada (lihat "Yang masih dibutuhkan").

## Angka mentah

| Tanggal | Terindeks | Tidak terindeks | Impressions/hari |
|---|---:|---:|---:|
| 10 Jul | 27 | 36 | 21 |
| 11–24 Jul | 100 | 153 | 3–232 (puncak 19 Jul: 232) |
| 25 Jul | 74 | 200 | 54 |
| 6 Agu | 67 | 207 | 32 |
| 22 Agu–4 Sep | 64 | 210 | 3–16 |

Total 65 hari: 1.817 impressions, rata-rata 28/hari; 14 hari terakhir
rata-rata 8/hari. Saat ini 96 artikel sudah terbit + ~24 route statis, tapi
hanya 64 URL terindeks. **Indeks turun sementara konten bertambah** — ini
masalah nomor satu situs, di atas backlink dan performa.

Alasan "tidak terindeks" (210):

| Alasan | Halaman | Bacaan |
|---|---:|---|
| Page with redirect (validasi: gagal) | 123 | Sebagian besar wajar: URL warisan B&B, slug lama ejaan Amerika (rename 25 Jul), dan varian tanpa slash → semuanya memang harus redirect. "Validation failed" terjadi karena Google mengecek ulang dan masih menemukan redirect — untuk URL yang seharusnya redirect, itu bukan kegagalan. |
| **Excluded by 'noindex' tag** | **61** | **Bocornya indeks.** Lihat mekanisme di bawah. |
| Crawled – currently not indexed | 10 | Sinyal kualitas/duplikasi; butuh daftar URL untuk diagnosis. |
| Redirect error | 6 | Rantai/loop; butuh daftar URL. |
| Alternate page with proper canonical | 5 | Wajar (varian tanpa slash). |
| Blocked by robots.txt | 4 | Wajar: `Disallow: /go/`. |
| Server error (5xx) | 1 | Lihat catatan 17 Agu; butuh URL + tanggal crawl. |

## Mekanisme kebocoran 61 "noindex" (terkonfirmasi dari kode dan build)

Tiga hal terjadi bersamaan untuk setiap artikel terjadwal di `articles.js`:

1. `generate-static-html.js` membangun halaman statis **penuh** untuk artikel
   yang belum terbit (verifikasi di build 9 Sep: `/blog/asciano-guide/`,
   terbit 13 Sep, sudah punya h1 + 38 paragraf dan `robots: index,follow`).
   Logika "scheduled-draft noindex" yang ada hanya berlaku untuk cluster
   Siena, bukan untuk store artikel utama.
2. `generate-sitemap.js` **memasukkan artikel terjadwal ke sitemap** (3 dari 6
   yang terjadwal ada di sitemap build ini) — Google diundang langsung.
3. Artikel yang sudah terbit me-link ke artikel terjadwal (scanner mencatatnya
   sebagai info "internal link to a SCHEDULED article").

Googlebot merayapi URL itu, membaca HTML mentah "index,follow" berisi konten
penuh, lalu merender JavaScript: SPA melihat artikel belum terbit → halaman
NotFound → `noindex`. Hasil render yang menang, URL masuk bucket "Excluded by
noindex". Setelah terbit, Google merayapi ulang URL ber-noindex dengan
prioritas rendah — berminggu-minggu.

Sejak 20 Juli ada **61 artikel terbit** — angka yang sama persis dengan 61
halaman ber-noindex di laporan. Build saat ini hanya punya 2 halaman noindex
yang disengaja (`/destinations`, `/travel-deals`).

Penurunan impressions dari puncak 19–24 Jul bertepatan dengan rename slug dan
perubahan canonical 25 Jul (fix/seo): ranking awal URL lama hilang, URL baru
belum terindeks ulang. Pelajaran permanen: **jangan rename slug lagi.**

## Perbaikan yang dikirim (branch `seo/scheduled-link-gating`)

Lima perubahan, semuanya membuat Google **tidak pernah melihat URL artikel
sebelum hari terbitnya**:

1. **Tidak ada file statis untuk artikel terjadwal** (`generate-static-html.js`
   membaca status terbit dari `articlesIndex.json`, hasil evaluasi store —
   bukan regex). Urutan build diubah: index dibangun *sebelum* sitemap.
2. **Sitemap dan llms.txt hanya memuat artikel yang sudah terbit.**
3. **Link ke artikel terjadwal dicetak sebagai teks biasa** di semua renderer:
   `Article.jsx` dan `FlorenceToSienaGuide.jsx` (helper
   `isScheduledArticlePath` di `lib/publishedArticles.js`), fallback statis di
   generator, dan cluster Siena (sudah ada sejak awal). Rebuild harian
   mengubahnya jadi link tepat di hari terbit.
4. **URL yang tidak ada menjawab 404 sungguhan**: catch-all `/* /index.html 200`
   dihapus dari `_redirects`, generator menulis `build/404.html` (masih shell
   aplikasi, jadi manusia tetap mendapat halaman NotFound React). URL sampah
   dan artikel terjadwal tidak lagi jadi 200+noindex.
5. **Enam "Redirect error"** = tiga slug pensiun yang hanya di-redirect di sisi
   klien (App.js `Navigate`) tanpa aturan server — kini ada di `_redirects`.

## Yang harus kamu lakukan (manual, GSC)

1. **Request indexing** untuk artikel yang terbit sejak 20 Juli, mulai dari
   yang bernilai traffic tertinggi. Kuota ±10 URL/hari; urutan hari pertama:
   `/florence-to-siena-by-train-or-bus/`, `/blog/siena-ztl-fines-how-to-avoid/`,
   `/blog/siena-parking-and-transfer-guide/`, `/blog/best-things-to-do-in-florence/`,
   `/blog/best-hotels-in-siena/`, `/blog/palio-di-siena-guide/`,
   `/blog/best-time-to-visit-tuscany/`, `/blog/siena-from-florence-airport-transfer/`,
   `/blog/renting-a-car-in-tuscany-2026/`, `/blog/rome-to-siena-train-bus-2026/`.
   Lanjutkan hari berikutnya dengan sisa 51 (daftar lengkap: semua artikel
   dengan `publishedAt` ≥ 2026-07-20 di `articlesIndex.json`).
2. Di laporan Pages, klik "Excluded by 'noindex' tag" → **Validate fix** setelah
   URL-URL di atas direquest — ini memberi Google alasan merayapi ulang seluruh
   bucket.
3. **Ekspor daftar URL** untuk empat alasan yang belum bisa didiagnosis dari
   repo: "Crawled – currently not indexed" (10), "Redirect error" (6),
   "Server error (5xx)" (1), dan "Excluded by noindex" (61, untuk memastikan
   hipotesis). Klik alasannya → tombol Export. Kirim ke sesi berikutnya.
4. **Ekspor Performance → Queries** (3 bulan) dan **Links → Top linking
   sites** — masih belum pernah diterima; tanpa itu target traffic apa pun
   tidak punya dasar.

## Cara membaca hasilnya

Tiga angka mingguan: halaman terindeks (harus naik dari 64 menuju ~120),
"Excluded by noindex" (harus turun dari 61 menuju 2), dan impressions/hari
(harus pulih melewati puncak Juli). Kalau terindeks naik tapi impressions
tidak, masalahnya kualitas/permintaan — bukan lagi indeksasi.
