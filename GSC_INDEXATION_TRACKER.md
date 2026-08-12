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

## Temuan sampingan saat audit (difix di branch ini, 2026-08-12)

Dua artikel batch Rank-1 (2026-08-10) menaut guide Florence–Siena di path salah
`/blog/florence-to-siena-by-train-or-bus/` — path itu tidak punya route sehingga
merender halaman 404 (HTTP 200 + noindex). Tiga link konten dibetulkan ke
`/florence-to-siena-by-train-or-bus/` dan ditambah 301 safety net di
`_redirects` untuk varian yang mungkin sudah ter-crawl. Kalau URL salahnya
sempat muncul di GSC (soft 404 / excluded by noindex), akan bergeser ke "Page
with redirect" lalu hilang setelah recrawl.

Koreksi 2026-08-12: sempat ditambahkan independence note inline di tiga artikel
(florence-or-siena-which-to-visit-2026, rome-to-siena-train-bus-2026,
siena-day-trip-or-overnight-2026) karena dikira belum punya. Ternyata ketiganya
sudah membawa note house-style di akhir section `how-we-checked` ("We have no
affiliate relationship…") — grep awal memakai pola yang salah sehingga tidak
menemukannya. Note inline itu sudah dihapus lagi; tidak ada perubahan bersih
pada ketiga artikel. Flag `links_without_disclosure` di audit_content.py untuk
tiga halaman ini memang tetap menyala: itu worklist untuk memasang disclosure
begitu programme Booking/Omio/Trainline approved, sesuai CLAUDE.md §6. Jangan
ditutup dengan disclosure palsu.

