import { useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import { bestTime } from "@/lib/travelTools";
import { CalendarDays, ArrowRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// The month guide for a given month, if one is PUBLISHED — resolved from the
// articles store itself (which already filters out future-dated entries), so
// this can never render a dead link. Matches slugs like tuscany-in-august-2026
// and siena-in-september-2026.
function monthGuide(month) {
  const needle = `-in-${month.toLowerCase()}-2`;
  return articles.find((a) => a.slug.includes(needle)) || null;
}

export default function MonthPicker() {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const guide = monthGuide(month);
  const fallback = bestTime({ destination: "Tuscany", preference: "good_weather" });

  return (
    <section className="border-y border-[#e8dfd4] bg-white/50 px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5EDE3] grid place-items-center text-[#C65A3A]">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#2C211B] sm:text-3xl">
            When are you going?
          </h2>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(m)}
              className={["px-4 py-2 rounded-full border text-sm font-medium transition-all",
                m === month
                  ? "border-[#C65A3A] bg-[#C65A3A] text-white shadow-sm"
                  : monthGuide(m)
                    ? "border-[#C65A3A]/40 bg-white text-[#2C211B] hover:border-[#C65A3A]"
                    : "border-[#e8dfd4] bg-white/70 text-[#8A9A5B] hover:border-[#C65A3A]/40",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-[#F5EDE3] bg-white p-6 sm:p-8 shadow-sm">
          {guide ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8A9A5B]">Month guide</p>
              <h3 className="mt-2 font-serif text-2xl text-[#2C211B]">{guide.title}</h3>
              <p className="mt-3 text-sm text-[#8A9A5B] leading-relaxed max-w-3xl">{guide.excerpt}</p>
              <Link
                to={guide.canonicalPath || `/blog/${guide.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#C65A3A] hover:underline"
              >
                Read the {month} guide <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8A9A5B]">No dedicated {month} guide yet</p>
              <p className="mt-3 text-sm text-[#8A9A5B] leading-relaxed max-w-3xl">
                For context while you plan: the best-weather months for Tuscany are <span className="text-[#2C211B] font-medium">{fallback.months}</span>. {fallback.note}
              </p>
              <Link to="/travel-tools" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#C65A3A] hover:underline">
                Compare months in the Best Time tool <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
