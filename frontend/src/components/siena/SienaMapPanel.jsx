import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Importing the pins also applies the module's Leaflet default-icon fix.
import { sienaPins } from "@/pages/travel-tools/components/InteractiveMap";
import MonthCue from "@/components/common/MonthCue";
import { MapPin } from "lucide-react";

// The verified Siena pins (ZTL, car parks, distances — each fact-checked in
// the map tool) surfaced directly on the destination page.
export default function SienaMapPanel() {
  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#F5EDE3] grid place-items-center text-[#A84A2E]">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#657143]">Orientation</p>
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
                      <p className="text-sm text-[#657143] leading-tight">{pin.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#657143]">
          Distances, ZTL and car-park facts in the pins are checked against comune.siena.it and Visit Siena — tap a marker.
        </p>

        <MonthCue />
      </div>
    </section>
  );
}
