import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import type { Trek } from "@/data/treks";
import { MONTHS } from "@/data/treks";

// Approximate coordinates for treks without explicit lat/lng
const REGION_COORDS: Record<string, [number, number]> = {
  "Garhwal": [30.5, 79.2],
  "Kumaon": [30.0, 79.8],
  "Kullu-Lahaul": [32.3, 77.2],
  "Kullu": [32.2, 77.2],
  "Parvati Valley": [32.0, 77.3],
  "Spiti": [32.5, 78.0],
  "Spiti-Ladakh": [32.8, 78.2],
  "Shimla-Kinnaur": [31.5, 77.8],
  "Kangra-Kullu": [32.1, 76.8],
  "Ladakh": [34.2, 77.6],
  "Kashmir": [34.1, 74.8],
  "Sikkim": [27.5, 88.5],
  "Darjeeling": [27.0, 88.3],
  "Western Ghats": [13.5, 75.5],
  "Khasi Hills": [25.5, 91.8],
  "Arunachal": [28.2, 94.7],
  "Eastern Ghats": [16.5, 79.5],
  "Satpura Range": [22.5, 78.4],
  "Aravalli Range": [24.6, 72.7],
  "Central India": [22.8, 82.0],
  "Nagaland": [25.7, 94.1],
  "Kinnaur-Garhwal": [31.2, 78.3],
  "Khumbu": [27.9, 86.8],
  "Annapurna": [28.6, 83.8],
  "Langtang": [28.2, 85.5],
  "Manaslu": [28.5, 84.6],
  "Mustang": [29.2, 83.9],
  "Dolpo": [29.0, 82.9],
  "Dhaulagiri": [28.7, 83.5],
  "Makalu": [27.9, 87.1],
  "Kanchenjunga": [27.7, 88.1],
  "Rolwaling": [27.8, 86.4],
  "Far West": [29.9, 80.6],
  "Mugu": [29.5, 82.1],
  "Ganesh Himal": [28.3, 85.1],
  "Kathmandu Valley": [27.7, 85.3],
  "Cross-Nepal": [28.5, 84.0],
  "Mid-West": [28.5, 82.5],
  "Karnali": [29.2, 81.6],
};

function getTrekCoords(trek: Trek): [number, number] | null {
  if (trek.latitude && trek.longitude) return [trek.latitude, trek.longitude];
  const rc = REGION_COORDS[trek.region];
  if (rc) {
    // Add slight jitter to avoid overlapping markers
    const hash = trek.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return [rc[0] + (hash % 30 - 15) * 0.01, rc[1] + ((hash * 7) % 30 - 15) * 0.01];
  }
  return null;
}

const difficultyColor: Record<string, string> = {
  Easy: "#74c69d",
  Moderate: "#c9973a",
  Difficult: "#e05c5c",
  Challenging: "#a78bfa",
  Expert: "#f472b6",
  Local: "#fbbf24",
};

// Custom green marker icon
const createMarkerIcon = (difficulty: string) => {
  const color = difficultyColor[difficulty] || "#74c69d";
  return L.divIcon({
    className: "custom-trek-marker",
    html: `<div style="width:24px;height:24px;background:${color};border:2px solid #0c1f13;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;background:#0c1f13;border-radius:50%"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
};

interface TrekMapProps {
  treks: Trek[];
}

export default function TrekMap({ treks }: TrekMapProps) {
  const trekMarkers = useMemo(() => {
    return treks
      .map(t => ({ trek: t, coords: getTrekCoords(t) }))
      .filter((m): m is { trek: Trek; coords: [number, number] } => m.coords !== null);
  }, [treks]);

  const center = useMemo((): [number, number] => {
    if (trekMarkers.length === 0) return [28.5, 83.0];
    const avgLat = trekMarkers.reduce((s, m) => s + m.coords[0], 0) / trekMarkers.length;
    const avgLng = trekMarkers.reduce((s, m) => s + m.coords[1], 0) / trekMarkers.length;
    return [avgLat, avgLng];
  }, [trekMarkers]);

  return (
    <MapContainer center={center} zoom={5} className="w-full h-full rounded-xl" style={{ minHeight: 400 }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trekMarkers.map(({ trek, coords }) => (
        <Marker key={trek.id} position={coords} icon={createMarkerIcon(trek.difficulty)}>
          <Popup>
            <div className="text-xs space-y-1.5 min-w-[180px]">
              <div className="font-bold text-sm">{trek.name}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${difficultyColor[trek.difficulty]}20`, color: difficultyColor[trek.difficulty] }}>
                  {trek.difficulty}
                </span>
                <span>{trek.altitudeMeters.toLocaleString()}m</span>
                <span>{trek.durationDays}d</span>
              </div>
              <div className="text-[11px] text-gray-600">{trek.region}, {trek.state}</div>
              <div className="text-[10px] text-gray-500">Best: {trek.bestMonths.map(m => MONTHS[m - 1]).join(", ")}</div>
              <Link to={`/trek/${trek.id}`} className="block mt-1 text-[11px] font-medium text-green-700 hover:underline">
                View Trek →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
