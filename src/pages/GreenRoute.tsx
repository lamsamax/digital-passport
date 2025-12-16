import { useState, useEffect, useRef } from 'react';
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

// Fetch alternative routes from OSRM (returns array of routes)
const fetchRoutes = async (start: [number, number], end: [number, number], profile: string = 'car') => {
  try {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&overview=full&alternatives=true`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('Route fetch failed');
    const data = await response.json();
    if (data.routes && data.routes.length) {
      return data.routes.map((r: any) => ({
        coords: r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]),
        distance: r.distance / 1000, // km
        duration: Math.round(r.duration / 60), // minutes
      }));
    }
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
  return null;
};

// Simple geocode using Nominatim (returns [lat,lng])
const geocode = async (q: string): Promise<[number, number] | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch (e) {
    console.error('Geocode error', e);
  }
  return null;
};

// Calculate CO2 emissions (kg)
const calculateCO2 = (distance: number, weight: number, factor: number): number => {
  return Math.round(distance * weight * factor); // Result in kg CO2
};

// Search suggestions (Nominatim) - returns up to 5 suggestions
const suggest = async (q: string) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default function GreenRoute() {
  const [origin, setOrigin] = useState('Cementara Kakanj');
  const [destination, setDestination] = useState('Sarajevo Tower');
  const [weight, setWeight] = useState('10'); // tons
  const [vehicleType, setVehicleType] = useState<'truck' | 'ecodrive' | 'rail'>('truck');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const mapRef = useRef<any>(null);

  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const originTimer = useRef<number | null>(null);
  const destTimer = useRef<number | null>(null);

  // Fit map to the selected route when results or selectedIndex change
  useEffect(() => {
    if (!mapRef.current || !results || selectedIndex === null) return;
    try {
      const route = results[selectedIndex];
      const bounds = route.routeCoords.map((c: [number, number]) => [c[0], c[1]]);
      // @ts-ignore
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    } catch (e) {
      // ignore
    }
  }, [results, selectedIndex]);

  // Handlers for suggestion typeahead (debounced)
  const handleOriginChange = (val: string) => {
    setOrigin(val);
    setOriginCoords(null);
    setOriginSuggestions([]);
    if (originTimer.current) window.clearTimeout(originTimer.current);
    if (!val || val.length < 3) return;
    originTimer.current = window.setTimeout(async () => {
      const s = await suggest(val);
      setOriginSuggestions(s);
    }, 350) as unknown as number;
  };

  const handleDestChange = (val: string) => {
    setDestination(val);
    setDestCoords(null);
    setDestSuggestions([]);
    if (destTimer.current) window.clearTimeout(destTimer.current);
    if (!val || val.length < 3) return;
    destTimer.current = window.setTimeout(async () => {
      const s = await suggest(val);
      setDestSuggestions(s);
    }, 350) as unknown as number;
  };

  const pickOriginSuggestion = (item: any) => {
    setOrigin(item.display_name);
    setOriginCoords([parseFloat(item.lat), parseFloat(item.lon)]);
    setOriginSuggestions([]);
  };

  const pickDestSuggestion = (item: any) => {
    setDestination(item.display_name);
    setDestCoords([parseFloat(item.lat), parseFloat(item.lon)]);
    setDestSuggestions([]);
  };

  const handleCalculate = async () => {
    setLoading(true);
    const weightNum = parseFloat(weight) || 10;

    // Prefer selected suggestion coords, otherwise geocode, fallback to hardcoded coords
    const oCoords = originCoords || (await geocode(origin)) || ORIGIN_COORDS;
    const dCoords = destCoords || (await geocode(destination)) || DESTINATION_COORDS;

    // Fetch alternative routes once
    const routes = (await fetchRoutes(oCoords, dCoords, 'car')) || [];

    // If no alternatives returned, use single fallback route
    const finalRoutes = routes.length ? routes : [{ coords: [[44.0306, 18.3861], [43.9435, 18.3878], [43.8564, 18.4131]], distance: 28, duration: 45 }];

    // Build result entries per route using selected vehicle type
    const entries = finalRoutes.map((rt, idx) => {
      const factor = vehicleType === 'truck' ? CO2_FACTORS.truck : vehicleType === 'ecodrive' ? CO2_FACTORS.ecodrive : CO2_FACTORS.rail;
      const co2 = calculateCO2(rt.distance, weightNum, factor);
      return {
        id: `r${idx}`,
        title: `Route ${idx + 1}`,
        distance: rt.distance,
        duration: rt.duration,
        routeCoords: rt.coords,
        color: ['#10b981', '#eab308', '#ef4444'][idx % 3],
        co2,
      };
    });

    // Sort by CO2 ascending
    const sorted = entries.sort((a, b) => a.co2 - b.co2);
    const formatted = sorted.map((r, i) => ({
      ...r,
      distanceStr: r.distance.toFixed(1),
      durationStr: r.duration > 60 ? `${Math.floor(r.duration / 60)}h ${r.duration % 60}m` : `${r.duration}m`,
      co2Str: `${r.co2} kg`,
      badge: { text: i === 0 ? 'Best for CBAM' : i === 1 ? 'Lower' : 'High Emissions', color: i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-yellow-400' : 'bg-red-500' },
    }));

    setResults(formatted);
    setSelectedIndex(0);
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
            <div className="relative">
              <input
                value={origin}
                onChange={(e) => handleOriginChange(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                aria-label="Origin"
                autoComplete="off"
              />
              {originSuggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 bg-white border border-slate-200 rounded-md mt-1 max-h-48 overflow-auto">
                  {originSuggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => pickOriginSuggestion(s)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className="block text-xs text-slate-500 mb-1">Destination</label>
            <div className="relative">
              <input
                value={destination}
                onChange={(e) => handleDestChange(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                aria-label="Destination"
                autoComplete="off"
              />
              {destSuggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 bg-white border border-slate-200 rounded-md mt-1 max-h-48 overflow-auto">
                  {destSuggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => pickDestSuggestion(s)}
                      className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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

            <label className="block text-xs text-slate-500 mb-1">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Vehicle Type"
            >
              <option value="truck">Standard Truck</option>
              <option value="ecodrive">Eco-Driving</option>
              <option value="rail">Rail + Truck</option>
            </select>

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
                  results.map((r, idx) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedIndex(idx)}
                      role="button"
                      tabIndex={0}
                      className={`bg-white p-3 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer ${selectedIndex === idx ? 'ring-2 ring-emerald-200' : ''}`}
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
                      {vehicleType === 'truck' && <Truck className="w-6 h-6 text-slate-400" />}
                      {vehicleType === 'ecodrive' && <Truck className="w-6 h-6 text-yellow-500" />}
                      {vehicleType === 'rail' && <Train className="w-6 h-6 text-emerald-500" />}
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
                whenCreated={(map) => (mapRef.current = map)}
                center={[(ORIGIN_COORDS[0] + DESTINATION_COORDS[0]) / 2, (ORIGIN_COORDS[1] + DESTINATION_COORDS[1]) / 2]}
                zoom={12}
                className="w-full h-56 md:h-96 rounded-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {/* Origin marker */}
                <Marker position={results[0].routeCoords[0]}>
                  <Popup>Origin: {origin}</Popup>
                </Marker>

                {/* Destination marker */}
                <Marker position={results[0].routeCoords[results[0].routeCoords.length - 1]}>
                  <Popup>Destination: {destination}</Popup>
                </Marker>

                {/* Route polylines */}
                {results.map((r, idx) => (
                  <Polyline
                    key={r.id}
                    positions={r.routeCoords}
                    pathOptions={{ color: r.color, weight: selectedIndex === idx ? 6 : 3, opacity: selectedIndex === idx ? 1 : 0.6 }}
                  />
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
