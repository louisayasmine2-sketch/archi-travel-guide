# Lighthouse Performance Cleanup

Valid domain: `https://affittacameregliarchi.com`
Invalid typo domain to ignore: `https://affittacamregliarchi.com`

## Current Clean Baseline From Valid Local Reports

| Page | Fetch time | Performance | LCP | CLS | INP | Source |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| / | 2026-07-08T15:38:07.065Z | 50 | 8.6 s | 0 | not reported in lab run | .tmp/lh-home.json |
| /siena-travel-guide | 2026-07-10T03:41:21.721Z | 51 | 8.5 s | 0 | not reported in lab run | lh-siena.json |
| /where-to-stay-in-siena | 2026-07-10T03:45:19.493Z | 72 | 3.8 s | 0.03 | not reported in lab run | lh-stay.json |

## Notes

- Reports using `affittacamregliarchi.com` are invalid and should not be used; Chrome recorded `CHROME_INTERSTITIAL_ERROR`.
- These valid reports are a cleanup baseline. For final post-fix numbers, rerun the commands below after the latest deploy/cache settles.
- Lighthouse lab runs may not report INP when no interaction is simulated; use CrUX/PageSpeed field data for real INP when available.

## Correct Rerun Commands

Run from `C:\Users\MY DEKSBOOK 11\Downloads\archi-travel-guide\frontend`:

```powershell
New-Item -ItemType Directory -Force .\lh-reports-final | Out-Null
npx lighthouse "https://affittacameregliarchi.com/" --only-categories=performance --output=json --output-path=".\lh-reports-final\lh-home.json" --chrome-flags="--no-sandbox"
npx lighthouse "https://affittacameregliarchi.com/siena-travel-guide" --only-categories=performance --output=json --output-path=".\lh-reports-final\lh-siena.json" --chrome-flags="--no-sandbox"
npx lighthouse "https://affittacameregliarchi.com/where-to-stay-in-siena" --only-categories=performance --output=json --output-path=".\lh-reports-final\lh-stay.json" --chrome-flags="--no-sandbox"
```

Then extract scores:

```powershell
$files = @(
  @{ Path = ".\lh-reports-final\lh-home.json"; Name = "homepage" },
  @{ Path = ".\lh-reports-final\lh-siena.json"; Name = "siena-travel-guide" },
  @{ Path = ".\lh-reports-final\lh-stay.json"; Name = "where-to-stay-in-siena" }
)
foreach ($item in $files) {
  $j = Get-Content -Raw $item.Path | ConvertFrom-Json
  $lcp = $j.audits."largest-contentful-paint"
  $cls = $j.audits."cumulative-layout-shift"
  $inp = $j.audits."interaction-to-next-paint"
  [PSCustomObject]@{
    Page = $item.Name
    Performance = [math]::Round($j.categories.performance.score * 100, 0)
    LCP = $lcp.displayValue
    CLS = $cls.displayValue
    INP = if ($inp) { $inp.displayValue } else { "not reported" }
  } | Format-Table -AutoSize
}
```