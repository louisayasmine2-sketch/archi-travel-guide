"""British-English spelling check for the content stores.

CLAUDE.md §5 requires British spelling throughout. Neither of the other two
scanners looks at spelling, and a sweep on 2026-08-09 found 30 American forms
across 14 articles — "Travelers", "Prioritize", "colored marble", a driving
"License" — none of which any check would have caught.

Read-only: reports and exits non-zero, never edits content.

Three kinds of American-looking text are legitimate and are excluded, because
a blind sweep would corrupt them:

  slug     — section ids are URL fragments. `hidden-costs-travelers-forget` is
             an anchor other pages and TOCs link to; rewriting it breaks them.
             The visible heading beside it is already British.
  url      — `creativecommons.org/licenses/by-sa/4.0/`, and Italian words that
             merely look American (`organizza-la-tua-visita`).
  quotation — a business describing itself. `best-siena-hotels-with-parking`
             quotes a hotel's own "a short distance from the center of Siena";
             correcting someone's quoted words is a fabrication, not a fix.

Words that are invariant in British English are not flagged at all: size and
its compounds (resize, oversize), prize, seize, capsize.

Run with:  python tools/check_spelling.py  [--json]
"""

import argparse
import json
import re
import sys

from content_store import load_all

# American form -> British form. Keep this list conservative: a word only
# belongs here when the British form is unambiguous in travel prose.
FORMS = {
    "traveler": "traveller", "travelers": "travellers",
    "traveling": "travelling", "traveled": "travelled",
    "canceled": "cancelled", "canceling": "cancelling",
    "color": "colour", "colors": "colours", "colored": "coloured",
    "colorful": "colourful", "coloring": "colouring",
    "favor": "favour", "favors": "favours", "favored": "favoured",
    "favorite": "favourite", "favorites": "favourites",
    "harbor": "harbour", "harbors": "harbours",
    "neighbor": "neighbour", "neighbors": "neighbours",
    "neighborhood": "neighbourhood", "neighborhoods": "neighbourhoods",
    "center": "centre", "centers": "centres", "centered": "centred",
    "theater": "theatre", "theaters": "theatres",
    "fiber": "fibre", "fibers": "fibres",
    "meter": "metre", "meters": "metres",
    "liter": "litre", "liters": "litres",
    "defense": "defence", "offense": "offence",
    "gray": "grey", "jewelry": "jewellery",
    "catalog": "catalogue", "catalogs": "catalogues",
    "dialog": "dialogue", "dialogs": "dialogues",
    "prioritize": "prioritise", "prioritizes": "prioritises",
    "prioritized": "prioritised", "prioritizing": "prioritising",
    "prioritization": "prioritisation",
    "organize": "organise", "organizes": "organises",
    "organized": "organised", "organizing": "organising",
    "organization": "organisation", "organizations": "organisations",
    "recognize": "recognise", "recognizes": "recognises",
    "recognized": "recognised", "recognizing": "recognising",
    "recognizable": "recognisable",
    "authorize": "authorise", "authorizes": "authorises",
    "authorized": "authorised", "authorization": "authorisation",
    "summarize": "summarise", "summarizes": "summarises",
    "summarized": "summarised", "summarizing": "summarising",
    "criticize": "criticise", "criticizes": "criticises",
    "criticized": "criticised", "criticizing": "criticising",
    "polarize": "polarise", "polarized": "polarised",
    "specialize": "specialise", "specializes": "specialises",
    "specialized": "specialised", "specializing": "specialising",
    "realize": "realise", "realizes": "realises", "realized": "realised",
    "emphasize": "emphasise", "emphasizes": "emphasises",
    "emphasized": "emphasised", "emphasizing": "emphasising",
    "minimize": "minimise", "minimized": "minimised",
    "maximize": "maximise", "maximized": "maximised",
    "apologize": "apologise", "apologized": "apologised",
    "analyze": "analyse", "analyzes": "analyses", "analyzed": "analysed",
    "pedestrianize": "pedestrianise", "pedestrianized": "pedestrianised",
    "utilize": "utilise", "utilized": "utilised",
    "practicing": "practising",
    "mustache": "moustache", "plow": "plough",
}

WORD = re.compile(r"\b(" + "|".join(sorted(FORMS, key=len, reverse=True)) + r")\b", re.I)

_URL_SPAN = re.compile(r"https?://\S+")
_QUOTED_SPAN = re.compile(r"[\"“][^\"”\n]{0,400}[\"”]")


def _spans(pattern, text):
    return [(m.start(), m.end()) for m in pattern.finditer(text)]


def _inside(pos, spans):
    return any(a <= pos < b for a, b in spans)


def _is_slug(text, start, end):
    """A hyphen on either side means this word is part of a URL-fragment slug."""
    before = text[start - 1] if start else " "
    after = text[end] if end < len(text) else " "
    return before == "-" or after == "-"


def findings_for(article):
    text = article.text
    urls = _spans(_URL_SPAN, text)
    quotes = _spans(_QUOTED_SPAN, text)
    out = []

    for m in WORD.finditer(text):
        if _inside(m.start(), urls):
            continue
        if _is_slug(text, m.start(), m.end()):
            continue
        if _inside(m.start(), quotes):
            continue
        found = m.group(0)
        british = FORMS[found.lower()]
        if found[0].isupper():
            british = british.capitalize()
        lo, hi = max(0, m.start() - 60), min(len(text), m.end() + 60)
        out.append({
            "found": found,
            "expected": british,
            "context": " ".join(text[lo:hi].split()),
        })
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args()

    articles = load_all()
    report = []
    for article in articles:
        found = findings_for(article)
        if found:
            report.append({
                "store": article.store,
                "article": article.ident,
                "findings": found,
            })

    if args.json:
        print(json.dumps({"articles_scanned": len(articles), "report": report}, indent=2))
    else:
        count = sum(len(entry["findings"]) for entry in report)
        print(f"Scanned {len(articles)} articles for British-English spelling.\n")
        if not report:
            print("No findings.")
        for entry in report:
            print(f"[{entry['store']}] {entry['article']}")
            for f in entry["findings"]:
                print(f"  - {f['found']} → {f['expected']}")
                print(f"    …{f['context']}…")
            print()
        if report:
            print(f"{count} spelling findings. Fix the content, one article at a time — "
                  f"a blanket search-and-replace will rewrite quotations and anchors.")

    sys.exit(1 if report else 0)


if __name__ == "__main__":
    main()
