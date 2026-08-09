import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { HERO } from "@/constants/testIds";
import { searchSite, GUIDE_COUNT } from "@/lib/searchIndex";

// Homepage hero search — same published-content index as the header search,
// so a suggestion can never dead-link. Enter submits the filtered /blog?q=
// listing; a suggestion opens only when explicitly highlighted or clicked.
export default function HeroSearch() {
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const navigate = useNavigate();
  const results = q.trim() ? searchSite(q.trim(), 5) : [];

  const goTo = (path) => {
    navigate(path);
    setQ("");
    setActiveIdx(-1);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) return goTo(results[activeIdx].path);
    if (!q.trim()) return;
    goTo(`/blog?q=${encodeURIComponent(q.trim())}`);
  };

  const onKey = (e) => {
    if (e.key === "Escape") { setQ(""); setActiveIdx(-1); }
    else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative mt-6 max-w-xl rise d4">
      <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur border border-white/40 shadow-lg pl-5 pr-2 py-2">
        <Search className="w-4 h-4 text-[#8A9A5B] shrink-0" />
        <input
          data-testid={HERO.searchInput}
          value={q}
          onChange={(e) => { setQ(e.target.value); setActiveIdx(-1); }}
          onKeyDown={onKey}
          placeholder={`Search ${GUIDE_COUNT} guides — parking, Palio, packing…`}
          aria-label="Search guides"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="hero-search-listbox"
          aria-autocomplete="list"
          className="flex-1 bg-transparent text-sm text-[#2C211B] placeholder:text-[#8A9A5B]/80 focus:outline-none min-w-0"
        />
        <button
          type="submit"
          data-testid={HERO.searchSubmit}
          aria-label="Submit search"
          className="shrink-0 px-5 py-2 rounded-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white text-sm font-medium transition-colors"
        >
          Search
        </button>
      </div>
      {results.length > 0 && (
        <ul
          id="hero-search-listbox"
          role="listbox"
          data-testid="hero-search-suggestions"
          className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-xl border border-[#F5EDE3] overflow-hidden z-30 text-left"
        >
          {results.map((r, i) => (
            <li key={r.path} role="option" aria-selected={i === activeIdx}>
              <button
                type="button"
                data-testid="hero-search-suggestion"
                onMouseDown={(e) => { e.preventDefault(); goTo(r.path); }}
                className={[
                  "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                  i === activeIdx ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]",
                ].join(" ")}
              >
                <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8A9A5B] bg-[#F5EDE3] rounded-full px-2 py-0.5 shrink-0">
                  {r.type}
                </span>
                <span className="text-sm text-[#2C211B] leading-snug line-clamp-2">{r.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
