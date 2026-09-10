// Internal links carry a trailing slash. Cloudflare Pages serves every route
// at /path/ and 308-redirects /path to it, so a slashless internal href costs
// the crawler two requests and fills Search Console's "Page with redirect"
// bucket (2,637 slashless internal hrefs in the built site on 2026-09-09).
// Paths that name a file (extension) or /go/ redirects are left alone; the
// query string and fragment are preserved.
export function toSlashed(to) {
  if (typeof to !== "string" || !to.startsWith("/") || to.startsWith("/go/")) return to;
  const m = to.match(/^([^?#]*)(.*)$/);
  const path = m[1];
  const rest = m[2];
  if (path.endsWith("/")) return to;
  const last = path.slice(path.lastIndexOf("/") + 1);
  if (last.includes(".")) return to;
  return `${path}/${rest}`;
}
