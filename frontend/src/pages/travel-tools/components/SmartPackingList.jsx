import { useState, useEffect } from "react";
import { packingChecklist } from "@/lib/travelTools";
import { loadTripPlan, notifyTripChange } from "@/lib/tripPlan";
import { toast } from "sonner";
import { ListChecks, Check, CloudRain, Sun, Snowflake, Download, Plus, X } from "lucide-react";

const SEL = "w-full rounded-2xl border border-[#F5EDE3] bg-white px-4 py-3 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";
const LABEL = "text-sm font-medium text-[#657143] mb-1.5 block";

// A packing list is ticked over days, not one sitting — the generated
// checklist and its ticks survive closing the modal.
const PACKING_STORAGE_KEY = "archi_packing_list_v1";

function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(PACKING_STORAGE_KEY) || "null");
    if (!s || typeof s !== "object" || !s.result || typeof s.result.categories !== "object") return null;
    return {
      form: s.form,
      result: s.result,
      checked: Array.isArray(s.checked) ? s.checked : [],
      customItems: Array.isArray(s.customItems) ? s.customItems.filter((i) => typeof i === "string") : [],
    };
  } catch {
    return null;
  }
}

const CUSTOM_CATEGORY = "Your items";

export default function SmartPackingList() {
  const [saved] = useState(loadSaved);
  // A saved checklist wins; otherwise pre-fill from "My Trip".
  const [form, setForm] = useState(() => {
    if (saved?.form) return saved.form;
    const plan = loadTripPlan();
    return { destination: plan.destination, season: plan.season, trip_length: plan.trip_length };
  });
  const [result, setResult] = useState(() => saved?.result ?? null);
  const [checked, setChecked] = useState(() => new Set(saved?.checked ?? []));
  const [customItems, setCustomItems] = useState(() => saved?.customItems ?? []);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    try {
      if (result) {
        localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify({ form, result, checked: [...checked], customItems }));
        notifyTripChange();
      }
    } catch {
      // Storage blocked or full — the in-memory checklist still works.
    }
  }, [form, result, checked, customItems]);

  const addCustomItem = () => {
    const item = newItem.trim();
    if (!item || customItems.includes(item)) return;
    setCustomItems([...customItems, item]);
    setNewItem("");
  };

  const removeCustomItem = (item) => {
    setCustomItems((list) => list.filter((i) => i !== item));
    setChecked((s) => {
      const n = new Set(s);
      n.delete(`${CUSTOM_CATEGORY}::${item}`);
      return n;
    });
  };
  const [loading, setLoading] = useState(false);
  const [weatherNote, setWeatherNote] = useState("");

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-adjust weather note based on season
  useEffect(() => {
    switch (form.season) {
      case "spring":
        setWeatherNote("Expect mild days but chilly evenings. Layering is key. Occasional rain showers.");
        break;
      case "summer":
        setWeatherNote("Hot and sunny. Prioritize breathable fabrics, sun protection, and a refillable water bottle.");
        break;
      case "autumn":
        setWeatherNote("Crisp air and potential rain. Bring a medium jacket and waterproof walking shoes.");
        break;
      case "winter":
        setWeatherNote("Cold, especially at night. A heavy coat, scarf, and warm layers are essential.");
        break;
      default:
        setWeatherNote("");
    }
  }, [form.season]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = packingChecklist({ ...form, trip_length: Number(form.trip_length) });
      setResult(data);
      setChecked(new Set());
    } catch (_) {
      toast.error("Couldn't generate the checklist. Please try again.");
    } finally { setLoading(false); }
  };

  const toggle = (k) => setChecked((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const totalItems = result
    ? Object.values(result.categories).reduce((n, items) => n + items.length, 0) + customItems.length
    : 0;

  const downloadPDF = () => {
    // Simple way to trigger print which allows saving to PDF natively
    window.print();
  };

  const SeasonIcon = () => {
    if (form.season === 'summer') return <Sun className="w-5 h-5 text-[#A84A2E]" />;
    if (form.season === 'winter') return <Snowflake className="w-5 h-5 text-[#657143]" />;
    return <CloudRain className="w-5 h-5 text-[#657143]" />;
  };

  return (
    <div className="font-sans printable-area">
      {/* Print/PDF rules live in index.css (@media print): the sheet must be
          freed from the dialog's fixed/transformed/scroll-clipped container
          or the PDF comes out blank past the title. */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#A84A2E] no-print">
          <ListChecks className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Smart Packing List</h2>
          <p className="text-[#657143] mt-1 no-print">Everything you need, nothing extra.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8 no-print">
          <form onSubmit={submit} className="rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 space-y-4 shadow-sm">
            <h3 className="font-semibold text-lg text-[#2C211B] mb-4">Trip Details</h3>
            <label className="block">
              <span className={LABEL}>Destination</span>
              <input className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} />
            </label>
            <label className="block">
              <span className={LABEL}>Season</span>
              <select className={SEL} value={form.season} onChange={(e) => upd("season", e.target.value)}>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
              </select>
            </label>
            <label className="block">
              <span className={LABEL}>Trip length (days)</span>
              <input type="number" min="1" max="60" className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", e.target.value)} />
            </label>
            <button type="submit" className="w-full mt-4 bg-[#A84A2E] hover:bg-[#8F3E26] text-white py-3 rounded-2xl font-medium transition-colors disabled:opacity-50" disabled={loading}>
              {loading ? "Building…" : "Generate Checklist"}
            </button>
          </form>

          {/* Weather Auto-Adjust Context Widget */}
          <div className="rounded-2xl border border-[#F5EDE3] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-medium text-[#2C211B]">
              <SeasonIcon />
              Weather Insight: {form.season.charAt(0).toUpperCase() + form.season.slice(1)}
            </div>
            <p className="text-sm text-[#657143] leading-relaxed">
              {weatherNote}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#FAF7F2] p-4 rounded-2xl border border-[#F5EDE3]">
                <p className="text-sm font-medium text-[#2C211B]">
                  Checklist for {form.trip_length} days in {form.destination}
                </p>
                <button onClick={downloadPDF} className="no-print flex items-center gap-2 px-4 py-2 bg-white border border-[#C65A3A] text-[#A84A2E] hover:bg-[#A84A2E] hover:text-white rounded-xl text-sm font-medium transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>

              {/* Packing progress */}
              <div className="no-print bg-white p-4 rounded-2xl border border-[#F5EDE3]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-medium text-[#2C211B]">Packing progress</span>
                  <span className="text-sm text-[#657143]">{checked.size} of {totalItems} packed</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#F5EDE3] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8A9A5B] transition-all duration-300"
                    style={{ width: totalItems ? `${(checked.size / totalItems) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              {Object.entries(result.categories).map(([cat, items]) => (
                <div key={cat} className="rounded-3xl border border-[#F5EDE3] bg-white p-6 shadow-sm">
                  <h3 className="font-serif text-2xl text-[#2C211B] mb-4">{cat}</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((it) => {
                      const key = `${cat}::${it}`;
                      const isChecked = checked.has(key);
                      return (
                        <li key={key}>
                          <button type="button" onClick={() => toggle(key)} className={["w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm border transition-all no-print",
                            isChecked ? "border-[#8A9A5B] bg-[#8A9A5B]/10 text-[#657143] line-through" : "border-[#F5EDE3] hover:border-[#C65A3A] text-[#2C211B]"].join(" ")}>
                            <span className={["w-5 h-5 rounded-md border grid place-items-center shrink-0 transition-colors", isChecked ? "border-[#8A9A5B] bg-[#8A9A5B] text-white" : "border-[#8A9A5B]/50"].join(" ")}>
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </span>
                            {it}
                          </button>
                          {/* Print-only list item format */}
                          <div className="hidden print:flex items-center gap-2 text-sm mb-2">
                            <div className="w-4 h-4 border border-black rounded-sm"></div>
                            {it}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Custom items — the visitor's own additions, persisted with the list */}
              <div className="rounded-3xl border border-[#F5EDE3] bg-white p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-[#2C211B] mb-4">{CUSTOM_CATEGORY}</h3>
                <div className="no-print flex gap-3 mb-4">
                  <input
                    placeholder="Add your own item (e.g. Camera batteries)"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomItem(); } }}
                    className="flex-1 px-4 py-3 rounded-2xl border border-[#F5EDE3] focus:outline-none focus:border-[#C65A3A] text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCustomItem}
                    disabled={!newItem.trim()}
                    className="shrink-0 flex items-center gap-2 px-4 py-3 bg-[#A84A2E] hover:bg-[#8F3E26] text-white rounded-2xl text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {customItems.length ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customItems.map((it) => {
                      const key = `${CUSTOM_CATEGORY}::${it}`;
                      const isChecked = checked.has(key);
                      return (
                        <li key={key} className="flex items-center gap-2">
                          <button type="button" onClick={() => toggle(key)} className={["flex-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm border transition-all no-print",
                            isChecked ? "border-[#8A9A5B] bg-[#8A9A5B]/10 text-[#657143] line-through" : "border-[#F5EDE3] hover:border-[#C65A3A] text-[#2C211B]"].join(" ")}>
                            <span className={["w-5 h-5 rounded-md border grid place-items-center shrink-0 transition-colors", isChecked ? "border-[#8A9A5B] bg-[#8A9A5B] text-white" : "border-[#8A9A5B]/50"].join(" ")}>
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </span>
                            {it}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCustomItem(it)}
                            aria-label={`Remove ${it}`}
                            className="no-print shrink-0 w-8 h-8 rounded-full grid place-items-center text-[#657143] hover:bg-[#A84A2E] hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {/* Print-only list item format */}
                          <div className="hidden print:flex items-center gap-2 text-sm mb-2">
                            <div className="w-4 h-4 border border-black rounded-sm"></div>
                            {it}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="no-print text-sm text-[#657143]">Anything the smart list misses — add it here and tick it off with the rest.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#8A9A5B]/30 bg-white p-12 text-center text-[#657143] flex flex-col items-center justify-center min-h-[300px] no-print">
              <ListChecks className="w-12 h-12 mb-4 opacity-20" />
              <p className="max-w-sm mx-auto">Choose a season and trip length to generate a smart packing checklist you can tick as you pack.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
