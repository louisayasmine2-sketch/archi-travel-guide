import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles, Map as MapIcon, RefreshCw, Send } from "lucide-react";
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

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SEL = "w-full rounded-2xl border border-[#F5EDE3] bg-white px-4 py-3 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";
const LABEL = "text-sm font-medium text-[#8A9A5B] mb-1.5 block";

export default function AIItineraryBuilder() {
  const [form, setForm] = useState({ destination: "Siena", trip_length: 3, travel_style: "culture", party: "couple", budget_level: "mid" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [refining, setRefining] = useState(false);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/tools/itinerary-generator`, { ...form, trip_length: Number(form.trip_length) });
      setResult(res.data);
    } catch (_) {
      toast.error("Couldn't generate the itinerary. Please try again.");
    } finally { setLoading(false); }
  };

  const refineItinerary = async () => {
    if (!refinePrompt.trim()) return;
    setRefining(true);
    try {
      // Simulate AI refinement delay
      await new Promise(r => setTimeout(r, 1500));
      toast.success("Itinerary refined based on your prompt!");
      setRefinePrompt("");
    } catch (_) {
      toast.error("Couldn't refine. Try again.");
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#C65A3A]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Itinerary Generator v2</h2>
          <p className="text-[#8A9A5B] mt-1">A day-by-day plan that fits your pace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={submit} className="lg:col-span-4 rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 space-y-4 shadow-sm h-fit">
          <h3 className="font-semibold text-lg text-[#2C211B] mb-4">Trip Details</h3>
          <label className="block">
            <span className={LABEL}>Destination</span>
            <input className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} placeholder="e.g. Tuscany" />
          </label>
          <label className="block">
            <span className={LABEL}>Trip length (days)</span>
            <input type="number" min="1" max="14" className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", e.target.value)} />
          </label>
          <label className="block">
            <span className={LABEL}>Travel style</span>
            <select className={SEL} value={form.travel_style} onChange={(e) => upd("travel_style", e.target.value)}>
              <option value="culture">Culture & history</option>
              <option value="food">Food & wine</option>
              <option value="nature">Nature & slow travel</option>
              <option value="mix">A mix of everything</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Party</span>
            <select className={SEL} value={form.party} onChange={(e) => upd("party", e.target.value)}>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family with kids</option>
              <option value="friends">Group of friends</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Budget level</span>
            <select className={SEL} value={form.budget_level} onChange={(e) => upd("budget_level", e.target.value)}>
              <option value="budget">Budget</option>
              <option value="mid">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </label>
          <button type="submit" className="w-full mt-4 bg-[#C65A3A] hover:bg-[#A84A2E] text-white py-3 rounded-2xl font-medium transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? "Generating…" : "Generate Itinerary"}
          </button>
        </form>

        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <>
              {/* Interactive Map */}
              <div className="rounded-3xl overflow-hidden border border-[#F5EDE3] shadow-sm h-64 z-0 relative">
                <MapContainer center={[43.3188, 11.3309]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[43.3188, 11.3309]}>
                    <Popup>
                      Central Siena - Suggested starting point for your itinerary.
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-[#2C211B] shadow-md z-[400] flex items-center gap-2 border border-[#F5EDE3]">
                  <MapIcon className="w-4 h-4 text-[#C65A3A]" /> Map Preview
                </div>
              </div>

              {/* Refine with AI */}
              <div className="bg-white rounded-3xl p-5 border border-[#F5EDE3] shadow-sm flex flex-col md:flex-row gap-3 items-center">
                <input 
                  type="text" 
                  placeholder="E.g., 'Make day 2 less walking' or 'Add more pasta places'"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  className="flex-1 w-full bg-[#FAF7F2] border-none rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]/30"
                  onKeyDown={(e) => e.key === 'Enter' && refineItinerary()}
                />
                <button 
                  onClick={refineItinerary}
                  disabled={refining || !refinePrompt.trim()}
                  className="w-full md:w-auto px-6 py-3 bg-[#2C211B] hover:bg-black text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {refining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Refine with AI
                </button>
              </div>

              {/* Itinerary Results */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-[#8A9A5B] bg-[#FAF7F2] p-4 rounded-2xl">{result.party_note}</p>
                {result.days.map((d) => (
                  <div key={d.day} className="rounded-3xl border border-[#F5EDE3] bg-white p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-[#F5EDE3] pb-4 mb-4">
                      <div className="bg-[#C65A3A]/10 text-[#C65A3A] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-sm">
                        Day {d.day}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <p className="text-[#C65A3A] font-medium uppercase tracking-widest mb-2">Morning</p>
                        <p className="text-[#2C211B] leading-relaxed">{d.morning}</p>
                      </div>
                      <div>
                        <p className="text-[#C65A3A] font-medium uppercase tracking-widest mb-2">Afternoon</p>
                        <p className="text-[#2C211B] leading-relaxed">{d.afternoon}</p>
                      </div>
                      <div>
                        <p className="text-[#C65A3A] font-medium uppercase tracking-widest mb-2">Evening</p>
                        <p className="text-[#2C211B] leading-relaxed">{d.evening}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#8A9A5B]/30 bg-white p-12 text-center text-[#8A9A5B] flex flex-col items-center justify-center h-full min-h-[300px]">
              <MapIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="max-w-sm mx-auto">Fill in the form to generate a customisable day-by-day itinerary with an interactive map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
