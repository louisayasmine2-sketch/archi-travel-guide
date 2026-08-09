import { useState } from "react";
import { itineraryGenerator, ITINERARY_DESTINATIONS } from "@/lib/travelTools";
import { loadTripPlan, markToolDone, hasTripPlan } from "@/lib/tripPlan";
import { itineraryToIcs, downloadIcs, dayDateLabel } from "@/lib/icsExport";
import { toast } from "sonner";
import { Sparkles, Map as MapIcon, Share2, CalendarPlus } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SEL = "w-full rounded-2xl border border-[#F5EDE3] bg-white px-4 py-3 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";
const LABEL = "text-sm font-medium text-[#657143] mb-1.5 block";

// Map view per itinerary destination. Keys match ITIN_TEMPLATES in
// lib/travelTools.js (lower-cased destination).
const MAP_VIEWS = {
  siena: {
    center: [43.3184, 11.3316],
    zoom: 13,
    markers: [
      { position: [43.3184, 11.3316], label: "Piazza del Campo — the day-1 starting point of this itinerary." },
    ],
  },
  tuscany: {
    center: [43.55, 11.3],
    zoom: 9,
    markers: [
      { position: [43.7696, 11.2558], day: 1, label: "Florence — day 1 of this itinerary." },
      { position: [43.3184, 11.3316], day: 2, label: "Siena — day 2 of this itinerary." },
    ],
  },
};

// Initial form state: a ?dest=&days= share link wins, then the saved
// "My Trip" plan, then the defaults. Only template-backed destinations count.
function initialForm() {
  const valid = (d) => ITINERARY_DESTINATIONS.some((x) => x.value === d);
  try {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get("dest");
    const days = parseInt(params.get("days"), 10);
    if (valid(dest)) {
      const max = ITINERARY_DESTINATIONS.find((x) => x.value === dest).days;
      return {
        form: { destination: dest, trip_length: Math.min(Math.max(days || 1, 1), max) },
        fromShareLink: true,
      };
    }
  } catch { /* no window (prerender) or bad params — fall through */ }
  const plan = loadTripPlan();
  if (valid(plan.destination)) {
    const max = ITINERARY_DESTINATIONS.find((x) => x.value === plan.destination).days;
    return { form: { destination: plan.destination, trip_length: Math.min(plan.trip_length, max) }, fromShareLink: false };
  }
  return { form: { destination: "Siena", trip_length: 3 }, fromShareLink: false };
}

export default function AIItineraryBuilder() {
  const [init] = useState(initialForm);
  const [form, setForm] = useState(init.form);
  // A share link opens with its itinerary already generated.
  const [result, setResult] = useState(() =>
    init.fromShareLink ? itineraryGenerator({ ...init.form, trip_length: Number(init.form.trip_length) }) : null
  );
  const [loading, setLoading] = useState(false);

  const copyShareLink = async () => {
    const url = `${window.location.origin}/travel-tools?tool=itinerary&dest=${encodeURIComponent(result.destination)}&days=${result.trip_length}`;
    // Native share sheet where available (mobile); clipboard elsewhere.
    if (navigator.share) {
      try {
        await navigator.share({ title: `${result.destination} itinerary — Archi Travel Guide`, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return; // user closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied — anyone opening it sees this itinerary.");
    } catch {
      toast.error(`Couldn't copy automatically. Link: ${url}`);
    }
  };

  // Calendar export needs real dates: only offered when the saved My Trip
  // plan has a start date, matches the itinerary's destination, AND covers
  // its length — otherwise the export would date days after the trip ends.
  const calendarPlan = (() => {
    if (!result || !hasTripPlan()) return null;
    const plan = loadTripPlan();
    const matches = plan.start_date &&
      plan.destination === result.destination &&
      plan.trip_length >= result.trip_length;
    return matches ? plan : null;
  })();

  const addToCalendar = () => {
    const ics = itineraryToIcs({ plan: calendarPlan, itinerary: result });
    if (ics) downloadIcs(ics, `archi-${result.destination.toLowerCase()}-trip.ics`);
  };

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const maxDays = ITINERARY_DESTINATIONS.find((d) => d.value === form.destination)?.days ?? 1;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = itineraryGenerator({ ...form, trip_length: Number(form.trip_length) });
      setResult(data);
      markToolDone("itinerary");
    } catch (_) {
      toast.error("Couldn't generate the itinerary. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#A84A2E]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Itinerary Generator v2</h2>
          <p className="text-[#657143] mt-1">A day-by-day outline, structured morning to evening.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={submit} className="lg:col-span-4 rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 space-y-4 shadow-sm h-fit">
          <h3 className="font-semibold text-lg text-[#2C211B] mb-4">Trip Details</h3>
          <label className="block">
            <span className={LABEL}>Destination</span>
            <select className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)}>
              {ITINERARY_DESTINATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Trip length (days, max {maxDays})</span>
            <input type="number" min="1" max={maxDays} className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", Math.min(Number(e.target.value) || 1, maxDays))} />
          </label>
          <button type="submit" className="w-full mt-4 bg-[#A84A2E] hover:bg-[#8F3E26] text-white py-3 rounded-2xl font-medium transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? "Generating…" : "Generate Itinerary"}
          </button>
        </form>

        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <>
              {/* Interactive Map — view follows the generated destination.
                  key remounts the MapContainer, since center/zoom are only
                  read on first render. */}
              {(() => {
                const view = MAP_VIEWS[result.destination.trim().toLowerCase()] ?? MAP_VIEWS.siena;
                const markers = view.markers.filter((m) => !m.day || m.day <= result.trip_length);
                return (
              <div className="rounded-3xl overflow-hidden border border-[#F5EDE3] shadow-sm h-64 z-0 relative">
                <MapContainer key={result.destination} center={view.center} zoom={view.zoom} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {markers.map((m) => (
                    <Marker key={m.label} position={m.position}>
                      <Popup>{m.label}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-[#2C211B] shadow-md z-[400] flex items-center gap-2 border border-[#F5EDE3]">
                  <MapIcon className="w-4 h-4 text-[#A84A2E]" /> Map Preview
                </div>
              </div>
                );
              })()}

              {/* Itinerary Results */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#FAF7F2] p-4 rounded-2xl">
                  <p className="text-sm font-medium text-[#657143] flex-1">{result.summary}</p>
                  {calendarPlan && (
                    <button
                      type="button"
                      data-testid="itinerary-add-to-calendar"
                      onClick={addToCalendar}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-[#C65A3A] text-[#A84A2E] hover:bg-[#A84A2E] hover:text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4" /> Add to calendar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-[#C65A3A] text-[#A84A2E] hover:bg-[#A84A2E] hover:text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
                {result.days.map((d, i) => (
                  <div key={d.day} className="rounded-3xl border border-[#F5EDE3] bg-white p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-[#F5EDE3] pb-4 mb-4">
                      <div className="bg-[#A84A2E]/10 text-[#A84A2E] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-sm">
                        Day {d.day}
                      </div>
                      {calendarPlan && dayDateLabel(calendarPlan.start_date, i) && (
                        <span className="text-sm font-medium text-[#657143]">{dayDateLabel(calendarPlan.start_date, i)}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <p className="text-[#A84A2E] font-medium uppercase tracking-widest mb-2">Morning</p>
                        <p className="text-[#2C211B] leading-relaxed">{d.morning}</p>
                      </div>
                      <div>
                        <p className="text-[#A84A2E] font-medium uppercase tracking-widest mb-2">Afternoon</p>
                        <p className="text-[#2C211B] leading-relaxed">{d.afternoon}</p>
                      </div>
                      <div>
                        <p className="text-[#A84A2E] font-medium uppercase tracking-widest mb-2">Evening</p>
                        <p className="text-[#2C211B] leading-relaxed">{d.evening}</p>
                      </div>
                    </div>
                    {d.notes?.length > 0 && (
                      <div className="mt-5 space-y-2">
                        {d.notes.map((n, i) => (
                          <p key={i} className="text-xs leading-relaxed text-[#657143] bg-[#FAF7F2] rounded-2xl px-4 py-3">
                            <span className="font-semibold text-[#2C211B]">Plan around this: </span>{n.text} <span className="opacity-70">(Checked {n.checked})</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#8A9A5B]/30 bg-white p-12 text-center text-[#657143] flex flex-col items-center justify-center h-full min-h-[300px]">
              <MapIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="max-w-sm mx-auto">Fill in the form to generate a customisable day-by-day itinerary with an interactive map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
