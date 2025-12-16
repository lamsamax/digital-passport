import { useState, useEffect } from 'react';
import { MapPin, Truck, Train, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Mock coordinates for demo (Cementara Kakanj -> Sarajevo Tower)
const ORIGIN_COORDS: [number, number] = [44.0306, 18.3861]; // Cementara Kakanj
const DESTINATION_COORDS: [number, number] = [43.8564, 18.4131]; // Sarajevo Tower

// CO2 emissions factors (kg CO2 per ton-km)
const CO2_FACTORS = {
  truck: 0.095, // Standard truck: ~95g CO2/ton-km
  ecodrive: 0.075, // Eco-driving optimized: ~75g CO2/ton-km
  rail: 0.025, // Rail: ~25g CO2/ton-km
};

// Fetch route from Vroom API (faster than OSRM)
const fetchRoute = async (start: [number, number], end: [number, number], profile: string = 'car') => {
  try {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Route fetch failed');
    const data = await response.json();
    if (data.routes && data.routes[0]) {
      const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
      const distance = data.routes[0].distance / 1000; // Convert to km
      const duration = Math.round(data.routes[0].duration / 60); // Convert to minutes
      return { coords, distance, duration };
    }
  } catch (error) {
    console.error('Error fetching route:', error);
  }
  return null;
};

// Calculate CO2 emissions
const calculateCO2 = (distance: number, weight: number, factor: number): number => {
  return Math.round((distance * weight * factor) / 1000); // Result in kg CO2
};

export default function GreenRoute() {
  const [origin, setOrigin] = useState('Cementara Kakanj');
  const [destination, setDestination] = useState('Sarajevo Tower');
  const [weight, setWeight] = useState('10'); // tons
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    const weightNum = parseFloat(weight) || 10;

    // Fetch realistic routes for each transport mode
    const routeDataA = await fetchRoute(ORIGIN_COORDS, DESTINATION_COORDS, 'car');
    const routeDataB = await fetchRoute(ORIGIN_COORDS, DESTINATION_COORDS, 'car');
    const routeDataC = await fetchRoute(ORIGIN_COORDS, DESTINATION_COORDS, 'car');

    // Fallback coordinates if fetch fails
    const fallbackCoords = [[44.0306, 18.3861], [43.9435, 18.3878], [43.8564, 18.4131]];

    const optionA = {
      id: 'a',
      title: 'Option A (Standard Truck)',
      distance: routeDataA?.distance || 28,
      duration: routeDataA?.duration || 45,
      weight: weightNum,
      co2: calculateCO2(routeDataA?.distance || 28, weightNum, CO2_FACTORS.truck),
      routeCoords: routeDataA?.coords || fallbackCoords,
      color: '#ef4444',
    };

    const optionB = {
      id: 'b',
      title: 'Option B (Eco-Driving/Optimized)',
      distance: routeDataB?.distance || 28,
      duration: (routeDataB?.duration || 45) + 5, // Slightly longer
      weight: weightNum,
      co2: calculateCO2(routeDataB?.distance || 28, weightNum, CO2_FACTORS.ecodrive),
      routeCoords: routeDataB?.coords || fallbackCoords,
      color: '#eab308',
    };

    const optionC = {
      id: 'c',
      title: 'Option C (Rail + Local Truck)',
      distance: (routeDataC?.distance || 28) * 0.8, // Rail is more direct
      duration: (routeDataC?.duration || 45) * 2.5, // Rail is slower but cheaper
      weight: weightNum,
      co2: calculateCO2((routeDataC?.distance || 28) * 0.8, weightNum, CO2_FACTORS.rail),
      routeCoords: routeDataC?.coords || fallbackCoords,
      color: '#10b981',
    };

    // Sort by CO2 (best first)
    const sorted = [optionC, optionB, optionA].sort((a, b) => a.co2 - b.co2);

    const formattedResults = sorted.map((r) => ({
      ...r,
      distanceStr: r.distance.toFixed(1),
      durationStr: r.duration > 60 ? `${Math.floor(r.duration / 60)}h ${r.duration % 60}m` : `${r.duration}m`,
      co2Str: `${r.co2} kg`,
      badge: {
        text: r.id === sorted[0].id ? 'Best for CBAM' : r.id === sorted[1].id ? 'Lower' : 'High Emissions',
        color: r.id === sorted[0].id ? 'bg-emerald-500' : r.id === sorted[1].id ? 'bg-yellow-400' : 'bg-red-500',
      },
    }));

    setResults(formattedResults);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-emerald-600">Green Route</h2>
        <p className="text-sm text-slate-500">Find the lowest CO2 route to your supplier</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column: inputs + results */}
        <div>
          <section className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="font-medium mb-3">Route Input</h3>
            <label className="block text-xs text-slate-500 mb-1">Origin</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Origin"
            />

            <label className="block text-xs text-slate-500 mb-1">Destination</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Destination"
            />

            <label className="block text-xs text-slate-500 mb-1">Transport Weight (tons)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0.1"
              max="50"
              step="0.1"
              className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Transport Weight"
            />

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Calculate route"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </section>

          <section>
            <h3 className="text-sm font-medium mb-2">Results (Best to Worst for CBAM)</h3>
            {!results && (
              <div className="text-xs text-slate-400 mb-2">No results yet — press Calculate to see mock options.</div>
            )}

            <div className="space-y-3">
              {results &&
                results.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-3 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-700">{r.title}</div>
                        <span className={`text-xs text-white px-2 py-1 rounded-full ${r.badge.color}`}>{r.badge.text}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-4">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{r.durationStr}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{r.distanceStr} km</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">CO₂: {r.co2Str}</span>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 ml-0 md:ml-4 text-slate-400 flex-shrink-0">
                      {r.title.includes('Standard') && <Truck className="w-6 h-6 text-slate-400" />}
                      {r.title.includes('Eco-Driving') && <Truck className="w-6 h-6 text-yellow-500" />}
                      {r.title.includes('Rail') && <Train className="w-6 h-6 text-emerald-500" />}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Right column: map visualization */}
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <h3 className="font-medium mb-3">Live Route Visualization</h3>
            {results ? (
              <MapContainer
                center={[(ORIGIN_COORDS[0] + DESTINATION_COORDS[0]) / 2, (ORIGIN_COORDS[1] + DESTINATION_COORDS[1]) / 2]}
                zoom={12}
                className="w-full h-56 md:h-96 rounded-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {/* Origin marker */}
                <Marker position={ORIGIN_COORDS}>
                  <Popup>Origin: {origin}</Popup>
                </Marker>

                {/* Destination marker */}
                <Marker position={DESTINATION_COORDS}>
                  <Popup>Destination: {destination}</Popup>
                </Marker>

                {/* Route polylines */}
                {results.map((r) => (
                  <Polyline
                    key={r.id}
                    positions={r.routeCoords}
                    color={r.color}
                    weight={r.id === 'c' ? 4 : 2}
                    opacity={r.id === 'c' ? 1 : 0.6}
                  >
                    <Popup>{r.title}</Popup>
                  </Polyline>
                ))}
              </MapContainer>
            ) : (
              <div className="w-full h-56 md:h-96 bg-slate-100 rounded-md flex flex-col items-center justify-center text-slate-400">
                <MapPin className="w-14 h-14 mb-2" />
                <span className="text-sm">Calculate to see live routes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
