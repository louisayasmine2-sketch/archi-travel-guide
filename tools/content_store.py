"""Read-only loaders for this repo's content stores.

Parses the A() object literals in frontend/src/data/articles.js and the JSON
files in frontend/src/data/ into a uniform Article shape that both scanners
consume. Nothing in this module writes to content.

Spans wrapped in an audit:ignore HTML comment pair are stripped before any
text reaches a scanner, so editor notes and quoted examples are never flagged:

    <!-- audit:ignore -->  ...  <!-- /audit:ignore -->
    <!-- audit:ignore-start -->  ...  <!-- audit:ignore-end -->
"""

import json
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path

# articles.js publishes an entry once its `updated` date has passed in the
# site's +07:00 timezone; A()'s default updated is 2025-11-10.
SITE_TZ = timezone(timedelta(hours=7))
DEFAULT_UPDATED = "2025-11-10"


def _is_published(date_str):
    try:
        return datetime.strptime(date_str[:10], "%Y-%m-%d").replace(tzinfo=SITE_TZ) <= datetime.now(SITE_TZ)
    except (ValueError, TypeError):
        return True

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "frontend" / "src" / "data"
PUBLIC_DIR = REPO_ROOT / "frontend" / "public"

# Own-site URLs are internal, not outbound.
OWN_HOSTS = {"affittacameregliarchi.com", "www.affittacameregliarchi.com"}

_AUDIT_IGNORE = re.compile(
    r"<!--\s*audit:ignore(?:-start)?\s*-->.*?<!--\s*(?:/audit:ignore|audit:ignore-end)\s*-->",
    re.DOTALL | re.IGNORECASE,
)

_URL = re.compile(r"https?://[^\s\"'<>()\\\]]+")
_IMAGE_PATH = re.compile(r"/images/[A-Za-z0-9._/%-]+")


def strip_audit_ignore(text):
    return _AUDIT_IGNORE.sub("", text)


@dataclass
class Article:
    store: str          # file the article came from
    ident: str          # slug, or file stem when there is no slug
    title: str = ""
    meta: str = None    # what the page ships as <meta name="description">
    text: str = ""      # all human-readable strings, audit:ignore stripped
    faq_count: int = 0
    hero_image: str = None
    image_refs: list = field(default_factory=list)   # local /images/... paths
    external_image_srcs: list = field(default_factory=list)  # http(s) srcs used AS images
    urls: list = field(default_factory=list)         # outbound URLs (own site excluded)
    route: str = None   # the article's own path (canonicalPath or /blog/{slug})
    published: bool = True  # False when the entry is scheduled for the future


def _host(url):
    m = re.match(r"https?://([^/]+)", url)
    return m.group(1).lower() if m else ""


def _clean_url(url):
    return url.rstrip(".,;:!?*_")


def _collect_urls(text):
    return [
        _clean_url(u)
        for u in _URL.findall(text)
        if _host(_clean_url(u)) not in OWN_HOSTS
    ]


# ---------------------------------------------------------------------------
# articles.js — A(slug, title, category, region, excerpt, image, sections,
#                 faqs, updated, options) literals
# ---------------------------------------------------------------------------

def _read_js_string(src, i):
    """Read a JS string literal starting at src[i] (quote char). Returns
    (content, index after closing quote). Template-literal interpolation is
    kept as literal text — content is only ever scanned, never evaluated."""
    quote = src[i]
    i += 1
    out = []
    while i < len(src):
        c = src[i]
        if c == "\\" and i + 1 < len(src):
            nxt = src[i + 1]
            out.append({"n": "\n", "t": "\t", "'": "'", '"': '"', "`": "`", "\\": "\\"}.get(nxt, nxt))
            i += 2
            continue
        if c == quote:
            return "".join(out), i + 1
        out.append(c)
        i += 1
    raise ValueError("Unterminated string literal in articles.js")


def _find_calls(src, name):
    """Yield the raw argument text of every top-level `name(...)` call,
    skipping matches inside strings and comments."""
    i, n = 0, len(src)
    pat = name + "("
    while i < n:
        c = src[i]
        if c in "'\"`":
            _, i = _read_js_string(src, i)
            continue
        if src.startswith("//", i):
            i = src.find("\n", i)
            i = n if i == -1 else i
            continue
        if src.startswith("/*", i):
            i = src.find("*/", i)
            i = n if i == -1 else i + 2
            continue
        if src.startswith(pat, i) and (i == 0 or not (src[i - 1].isalnum() or src[i - 1] in "_$.")):
            start = i + len(pat)
            depth, j = 1, start
            while j < n and depth:
                cj = src[j]
                if cj in "'\"`":
                    _, j = _read_js_string(src, j)
                    continue
                if cj == "(":
                    depth += 1
                elif cj == ")":
                    depth -= 1
                j += 1
            yield src[start : j - 1]
            i = j
            continue
        i += 1


def _split_args(raw):
    """Split a call's raw argument text on top-level commas."""
    args, depth, last, i, n = [], 0, 0, 0, len(raw)
    while i < n:
        c = raw[i]
        if c in "'\"`":
            _, i = _read_js_string(raw, i)
            continue
        if c in "([{":
            depth += 1
        elif c in ")]}":
            depth -= 1
        elif c == "," and depth == 0:
            args.append(raw[last:i].strip())
            last = i + 1
        i += 1
    tail = raw[last:].strip()
    if tail:
        args.append(tail)
    return args


def _string_literals(raw):
    """All string-literal contents inside a raw JS fragment."""
    out, i, n = [], 0, len(raw)
    while i < n:
        c = raw[i]
        if c in "'\"`":
            s, i = _read_js_string(raw, i)
            out.append(s)
            continue
        if raw.startswith("//", i):
            i = raw.find("\n", i)
            i = n if i == -1 else i
            continue
        if raw.startswith("/*", i):
            i = raw.find("*/", i)
            i = n if i == -1 else i + 2
            continue
        i += 1
    return out


def _unquote(raw):
    raw = raw.strip()
    if raw and raw[0] in "'\"`":
        s, _ = _read_js_string(raw, 0)
        return s
    return None  # not a plain literal (e.g. guide.dateModified)


def load_articles_js():
    path = DATA_DIR / "articles.js"
    src = strip_audit_ignore(path.read_text(encoding="utf-8"))
    articles = []
    for raw in _find_calls(src, "A"):
        args = _split_args(raw)
        if len(args) < 7:
            continue
        slug = _unquote(args[0]) or args[0]
        sections_raw = args[6]
        faqs_raw = args[7] if len(args) > 7 else "[]"
        body_strings = _string_literals(sections_raw)
        faq_strings = _string_literals(faqs_raw)
        text = "\n".join(body_strings + faq_strings)
        hero = _unquote(args[5])
        canonical_m = re.search(r"canonicalPath:\s*['\"]([^'\"]+)['\"]", args[9] if len(args) > 9 else "")
        updated = next((s for s in (_unquote(a) for a in args) if s and re.match(r"^\d{4}-\d{2}-\d{2}", s)), DEFAULT_UPDATED)
        art = Article(
            store="articles.js",
            ident=slug,
            route=(canonical_m.group(1) if canonical_m else f"/blog/{slug}"),
            published=_is_published(updated),
            title=_unquote(args[1]) or "",
            meta=_unquote(args[4]),
            text=text,
            faq_count=len(re.findall(r"\bq\s*:", faqs_raw)),
            hero_image=hero if hero and hero.startswith("/") else None,
            image_refs=sorted(set(_IMAGE_PATH.findall(sections_raw) + ([hero] if hero and hero.startswith("/images/") else []))),
            urls=sorted(set(_collect_urls(text))),
        )
        # <img src="http..."> inside body strings is a hotlink candidate
        art.external_image_srcs = sorted(set(
            m.group(1) for m in re.finditer(r"<img[^>]*\bsrc=[\"'](https?://[^\"']+)", text, re.IGNORECASE)
        ))
        articles.append(art)
    return articles


# ---------------------------------------------------------------------------
# JSON stores
# ---------------------------------------------------------------------------

def _walk_strings(node, key=None, sink=None, img_srcs=None):
    """Collect every string in a JSON tree; record http(s) values of `src`
    keys separately, since those are used as image sources."""
    if isinstance(node, dict):
        for k, v in node.items():
            _walk_strings(v, k, sink, img_srcs)
    elif isinstance(node, list):
        for v in node:
            _walk_strings(v, key, sink, img_srcs)
    elif isinstance(node, str):
        sink.append(node)
        if key == "src" and node.startswith(("http://", "https://")):
            img_srcs.append(node)


def _article_from_json(store, ident, node):
    strings, img_srcs = [], []
    _walk_strings(node, None, strings, img_srcs)
    text = strip_audit_ignore("\n".join(strings))
    hero = None
    if isinstance(node.get("hero"), dict):
        hero = node["hero"].get("src")
    faqs = node.get("faqs", node.get("faq", []))
    # <img src="http..."> inside HTML/markdown bodies also hotlinks
    inline_ext = [
        m.group(1) for m in re.finditer(r"<img[^>]*\bsrc=[\"'](https?://[^\"']+)", text, re.IGNORECASE)
    ]
    publish_at = node.get("publishAtWib") or node.get("datePublished")
    return Article(
        store=store,
        ident=ident,
        route=node.get("canonicalPath") or node.get("route"),
        published=_is_published(publish_at) if publish_at else True,
        title=node.get("title", ""),
        meta=node.get("metaDescription"),
        text=text,
        faq_count=len(faqs) if isinstance(faqs, list) else 0,
        hero_image=hero,
        image_refs=sorted(set(_IMAGE_PATH.findall(text))),
        external_image_srcs=sorted(set(img_srcs + inline_ext)),
        urls=sorted(set(_collect_urls(text))),
    )


def load_json_stores():
    articles = []
    for path in sorted(DATA_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict) and isinstance(data.get("articles"), list):
            for item in data["articles"]:
                articles.append(_article_from_json(path.name, item.get("slug", "?"), item))
        elif isinstance(data, dict) and ({"bodyMarkdown", "introMarkdown", "sections", "title"} & data.keys()):
            # Only dicts that carry article content. Technical asset maps in the
            # same directory (imageDimensions.json: image path -> width/height)
            # are not articles and must not be audited as if they were.
            articles.append(_article_from_json(path.name, data.get("slug", path.stem), data))
    return articles


def load_all():
    return load_articles_js() + load_json_stores()
