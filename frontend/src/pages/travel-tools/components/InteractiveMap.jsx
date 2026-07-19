import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Descriptions are limited to facts checked against official sources:
// straight-line distance from the Piazza del Campo pin (computed from these
// coordinates), the historic-centre ZTL (comune.siena.it), and the car parks
// listed by Visit Siena (visitsiena.it). No experiential or vibe claims.
const sienaPins = [
  {
    id: 1,
    name: 'Piazza del Campo',
    position: [43.3184, 11.3316],
    description: "Siena's central square and the reference point for these distances. The whole historic centre is a ZTL — closed to non-permit cars since the 1960s, with 24-hour camera enforcement. Nearest car park: Il Campo, by Porta Tufi."
  },
  {
    id: 2,
    name: 'Duomo di Siena',
    position: [43.3176, 11.3289],
    description: "≈236 m from Piazza del Campo (straight line), inside the ZTL. The Il Duomo car park is beside the cathedral and Santa Maria della Scala."
  },
  {
    id: 3,
    name: 'Fortezza Medicea',
    position: [43.3218, 11.3228],
    description: "≈806 m from Piazza del Campo, at the north-western edge by the city walls. Two of Siena's largest car parks are here — Fortezza/Stadio (~800 spaces) and Santa Caterina, whose escalators run up into the centre — so it's the main drive-and-park entry point."
  }
];

export default function InteractiveMap() {
  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#C65A3A]">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Best Area to Stay Finder</h2>
          <p className="text-[#8A9A5B] mt-1">Explore Siena's neighborhoods to find your perfect home base.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-2 border border-[#F5EDE3] shadow-sm mb-6">
        <div className="h-[500px] w-full rounded-2xl overflow-hidden relative z-0">
          <MapContainer center={[43.3188, 11.3309]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sienaPins.map((pin) => (
              <Marker key={pin.id} position={pin.position}>
                <Popup className="custom-popup">
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

      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#F5EDE3]">
        <h3 className="font-semibold text-lg text-[#2C211B] mb-3">Why location matters in Siena</h3>
        <p className="text-[#8A9A5B] text-sm leading-relaxed mb-4">
          Siena is highly walkable but very hilly. The entire city center is a ZTL (Zona a Traffico Limitato) meaning you cannot drive inside without a special permit. Staying near the edges of the historic center gives you the best of both worlds: walkability to the sights and easier access for luggage and parking.
        </p>
        <p className="text-[#8A9A5B] text-sm leading-relaxed">
          <strong>Tip:</strong> Look for accommodations just inside or right outside the city walls for the most convenient experience.
        </p>
      </div>
    </div>
  );
}
