"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Layers } from 'lucide-react';

// Dynamic import of map components since Leaflet needs window
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface CampInfo {
  country: string;
  population: number;
}

const coordinates: Record<string, [number, number]> = {
  // Bangladesh
  'Kutupalong': [21.2131, 92.1557],
  'Bhasan Char': [22.2858, 91.3650],
  'Nayapara': [20.9754, 92.2618],
  'Camp 24': [21.0531, 92.1465],
  'Camp 26': [21.0494, 92.1587],
  
  // Thailand
  'Mae La': [17.1667, 98.2431],
  'Umpiem Mai': [16.3267, 98.8894],
  'Nu Po': [15.6881, 98.9228],
  'Mae Ra Ma Luang': [18.2720, 97.6475],
  
  // Malaysia
  'Klang Valley': [3.1390, 101.6869],
  'Penang': [5.4141, 100.3288],
  'Johor': [1.4927, 103.7414],
  
  // India
  'New Delhi': [28.6139, 77.2090],
  'Jammu': [32.7266, 74.8570],
  'Hyderabad': [17.3850, 78.4867],
  
  // Indonesia
  'Aceh': [4.6951, 96.7494],
  'Medan': [3.5952, 98.6722],
  'Jakarta': [-6.2088, 106.8456],
  
  // Cambodia
  'Border Area 1': [14.0000, 104.0000],
  'Border Area 2': [13.5000, 105.0000],
  'Transit Center': [11.5564, 104.9282],
  
  // Myanmar (IDPs broadly spread)
  'Rakhine IDP Camps': [20.1465, 93.3603],
  'Kachin Shelters': [25.7925, 97.4116],
  'Shan Region': [21.8214, 98.0533],
  'Sagaing': [23.1165, 95.1638],
};

const logisticsHubs: Record<string, { coords: [number, number], type: string }> = {
  'Yangon Int. Airport': { coords: [16.904, 96.133], type: 'Airport' },
  'Cox\'s Bazar Airport': { coords: [21.4538, 91.9638], type: 'Airport' },
  'Chittagong Port': { coords: [22.3168, 91.8028], type: 'Seaport' },
  'Don Mueang Airport': { coords: [13.9126, 100.6068], type: 'Airport' },
  'Hat Yai Int. Airport': { coords: [7.1065, 100.4180], type: 'Airport' },
  'Sihanoukville Port': { coords: [10.638, 103.500], type: 'Seaport' },
};

const getRadius = (population: number) => {
  if (population > 1000000) return 45;
  if (population > 500000) return 35;
  if (population > 100000) return 25;
  if (population > 10000) return 15;
  return 8;
};

const getColor = (country: string) => {
  switch (country) {
    case 'Bangladesh': return '#059669'; // emarald-600
    case 'Myanmar': return '#d97706'; // amber-600
    case 'Thailand': return '#2563eb'; // blue-600
    case 'Malaysia': return '#7c3aed'; // violet-600
    case 'Cambodia': return '#db2777'; // pink-600
    default: return '#dc2626'; // red-600
  }
};

export default function InteractiveMap() {
  const [camps, setCamps] = useState<Record<string, CampInfo>>({});
  const [loading, setLoading] = useState(true);
  const [showLogistics, setShowLogistics] = useState(false);

  useEffect(() => {
    fetch('/api/camps')
      .then(res => res.json())
      .then(data => {
        if (data && data.allCamps) {
          setCamps(data.allCamps);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="w-full h-[600px] flex items-center justify-center bg-slate-100 rounded-lg shadow-inner"><p className="text-slate-500 font-bold">Loading Geographic Data...</p></div>;
  }

  // Create markers based on data + coordinates mapping
  const activeMarkers = Object.entries(camps).map(([name, info]) => {
    const coords = coordinates[name] || [15.0, 100.0]; // fallback
    return { name, country: info.country, population: info.population, coords };
  });

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-slate-200 relative">
      <div className="absolute top-4 right-4 z-[1000]">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowLogistics(!showLogistics); }}
          className={`px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition-colors ${showLogistics ? 'bg-[#00385e] text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}`}
        >
          <Layers className="w-4 h-4" /> Supply Chain Hubs
        </button>
      </div>
      <MapContainer center={[15.0, 97.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {activeMarkers.map((marker, i) => (
          <CircleMarker
            key={i}
            center={marker.coords as [number, number]}
            radius={getRadius(marker.population)}
            pathOptions={{ 
              color: getColor(marker.country),
              fillColor: getColor(marker.country),
              fillOpacity: 0.6,
              weight: 2
            }}
          >
            <Popup className="min-w-[200px]">
              <div className="p-1">
                <h3 className="font-bold text-lg mb-1">{marker.name}</h3>
                <p className="text-sm text-slate-500 mb-2">{marker.country}</p>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <p className="text-xl font-black text-slate-800">
                    {marker.population.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">Synthetic Population</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {showLogistics && Object.entries(logisticsHubs).map(([name, info], i) => (
          <CircleMarker
            key={`hub-${i}`}
            center={info.coords}
            radius={8}
            pathOptions={{ 
              color: '#334155',
              fillColor: '#64748b',
              fillOpacity: 1,
              weight: 2
            }}
          >
            <Popup className="min-w-[150px]">
              <div className="p-1 text-center">
                <h3 className="font-bold text-base mb-1 text-slate-800">{name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{info.type}</p>
                <div className="mt-3 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                  Strategic Logistics Node
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
