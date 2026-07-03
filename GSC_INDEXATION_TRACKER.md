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

