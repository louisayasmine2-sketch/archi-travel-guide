import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Importing the pins also applies the module's Leaflet default-icon fix.
import { sienaPins } from "@/pages/travel-tools/components/InteractiveMap";
import articlesIndex from "@/data/articlesIndex.json";
import { MapPin, ArrowRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Month guide for the CURRENT month, resolved from the published-articles
// index — shown only when it actually exists, so no dead links.
function currentMonthGuide() {
  const month = MONTHS[new Date().getMonth()];
  const needle = `-in-${month.toLowerCase()}-2`;
  const guide = articlesIndex.find((a) => a.slug.includes(needle));
  return guide ? { month, guide } : null;
}

// The verified Siena pins (ZTL, car parks, distances — each fact-checked in
// the map tool) surfaced directly on the destination page.
export default function SienaMapPanel() {
  const cue = currentMonthGuide();

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#F5EDE3] grid place-items-center text-[#C65A3A]">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Orientation</p>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-[#2C211B] mb-8">The lie of the land</h2>

        <div className="bg-white rounded-3xl p-2 border border-[#F5EDE3] shadow-sm">
          <div className="h-[420px] w-full rounded-2xl overflow-hidden relative z-0">
            <MapContainer center={[43.3188, 11.3309]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {sienaPins.map((pin) => (
                <Marker key={pin.id} position={pin.position}>
                  <Popup>
                    <div className="text-center p-1">
                      <h4 className="font-serif text-lg text-[#2C211B] mb-1">{pin.name}</h4>
                      <p className="text-sm text-[#8A9A5B] leading-tight">{pin.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8A9A5B]">
          Distances, ZTL and car-park facts in the pins are checked against comune.siena.it and Visit Siena — tap a marker.
        </p>

        {cue && (
          <Link
            to={(cue.guide.canonicalPath || `/blog/${cue.guide.slug}`).replace(/\/?$/, "/")}
            className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl bg-[#2C211B] text-[#F5EDE3] px-6 py-4 hover:bg-[#3a2c22] transition-colors group"
          >
            <span className="font-medium">Going this month?</span>
            <span className="text-sm text-gray-300 flex-1 truncate">{cue.guide.title}</span>
            <span className="text-sm font-medium text-[#C65A3A] group-hover:underline shrink-0 inline-flex items-center gap-1">
              Read the {cue.month} guide <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
