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

const sienaPins = [
  {
    id: 1,
    name: 'Piazza del Campo',
    position: [43.3184, 11.3316],
    description: 'The historic heart of Siena. Perfect for first-time visitors wanting to be in the center of the action. Very busy and can be noisy.',
    isPrimary: false
  },
  {
    id: 2,
    name: 'Duomo di Siena',
    position: [43.3176, 11.3289],
    description: 'Stunning architectural area. Quieter than Il Campo but still very central. Hilly terrain.',
    isPrimary: false
  },
  {
    id: 3,
    name: 'Fortezza Medicea',
    position: [43.3218, 11.3228],
    description: 'Great for families and active travelers. Close to large parks and easier parking outside the ZTL (Restricted Traffic Zone).',
    isPrimary: false
  },
  {
    id: 4,
    name: 'Contrada della Lupa',
    position: [43.3223, 11.3315],
    description: 'Authentic local vibe, slightly off the main tourist rush but just steps away from the center. Excellent local trattorias.',
    isPrimary: true
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
                    <p className="text-sm text-[#8A9A5B] mb-3 leading-tight">{pin.description}</p>
                    {pin.isPrimary ? (
                      <div className="mt-2">
                        <span className="inline-block bg-[#F5EDE3] text-[#C65A3A] text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2">
                          ⭐ Recommended Stay
                        </span>
                        <a 
                          href="https://beds24.com/booking2.php?propid=215570" 
                          target="_blank" 
                          rel="noreferrer"
                          className="block w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          Book Affittacamere Gli Archi
                        </a>
                      </div>
                    ) : null}
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
