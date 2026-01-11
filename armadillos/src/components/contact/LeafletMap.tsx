
"use client";

import { MapContainer, TileLayer, Marker, Tooltip, Circle, LayerGroup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useMemo } from "react";
import { Globe, Sun, Moon, Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";

// Props to receive handleSelect from parent
interface MapProps {
    onSelect: (id: string) => void;
    branches: any[];
}

// Helper component to auto-fit bounds
function MapController({ branches }: { branches: any[] }) {
    const map = useMap();

    useEffect(() => {
        if (!branches || branches.length === 0) return;

        const bounds = L.latLngBounds(branches.map(b => [b.lat, b.lng]));

        map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 10,
            animate: true,
            duration: 1.5
        });

    }, [map, branches]);

    return null;
}

export default function LeafletMap({ onSelect, branches }: MapProps) {
    const { resolvedTheme } = useTheme();
    const [baseLayer, setBaseLayer] = useState<"noir" | "satellite" | "light">("noir");
    const [showZones, setShowZones] = useState(true);

    // Sync map theme with system theme
    useEffect(() => {
        if (resolvedTheme === "light") {
            setBaseLayer("light");
        } else {
            setBaseLayer("noir");
        }
    }, [resolvedTheme]);

    // Calculate Active Zones
    // Only show zones if they contain at least one project
    const activeZones = useMemo(() => {
        const zones = [
            { name: "Lake Zone Gold Belt", center: [-3.3, 33.0] as [number, number], radius: 200000, color: '#fbbf24' },
            { name: "Southern Agricultural Corridor", center: [-7.5, 36.5] as [number, number], radius: 180000, color: '#22c55e' },
            { name: "Coastal Zone", center: [-6.5, 39.2] as [number, number], radius: 100000, color: '#22d3ee' }
        ];

        return zones.filter(zone => {
            const center = L.latLng(zone.center);
            return branches.some(b => center.distanceTo(L.latLng(b.lat, b.lng)) <= zone.radius);
        });
    }, [branches]);


    const createCustomIcon = (color: string) => {
        return L.divIcon({
            className: "custom-map-marker",
            html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); box-sizing: border-box;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8], // Center
        });
    };

    return (
        <div className="relative w-full h-full group">

            {baseLayer === "noir" && (
                <style jsx global>{`
                    .leaflet-container { background: #0f172a; }
                `}</style>
            )}

            {/* Custom Layer Controls */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-[400] flex flex-col gap-2 pointer-events-auto scale-90 md:scale-100 origin-top-right">
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-2xl flex flex-col gap-1">
                    <button onClick={() => setBaseLayer("noir")} className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase ${baseLayer === "noir" ? "bg-amber-500 text-black" : "text-white/60 hover:bg-white/10"}`} title="Noir Theme"><Moon size={16} /></button>
                    <button onClick={() => setBaseLayer("satellite")} className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase ${baseLayer === "satellite" ? "bg-amber-500 text-black" : "text-white/60 hover:bg-white/10"}`} title="Satellite View"><Globe size={16} /></button>
                    <button onClick={() => setBaseLayer("light")} className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase ${baseLayer === "light" ? "bg-amber-500 text-black" : "text-white/60 hover:bg-white/10"}`} title="Light Mode"><Sun size={16} /></button>
                </div>

                {activeZones.length > 0 && (
                    <button
                        onClick={() => setShowZones(!showZones)}
                        className={`bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-white/80 hover:text-amber-500 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider ${showZones ? "text-amber-500 border-amber-500/50" : ""}`}
                    >
                        {showZones ? <Eye size={16} /> : <EyeOff size={16} />} <span className="hidden md:inline">Zones</span>
                    </button>
                )}
            </div>

            <MapContainer
                center={[-6.3690, 34.8888]}
                zoom={6}
                scrollWheelZoom={false}
                className="w-full h-full z-0 outline-none"
                style={{ background: "#0f172a" }}
            >
                <MapController branches={branches} />

                {baseLayer === "noir" && <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />}
                {baseLayer === "satellite" && <TileLayer attribution='&copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />}
                {baseLayer === "light" && <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />}

                {/* Economic Zones Overlay */}
                {showZones && (
                    <LayerGroup>
                        {activeZones.map((zone, i) => (
                            <Circle
                                key={i}
                                center={zone.center}
                                radius={zone.radius}
                                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
                            >
                                <Tooltip sticky direction="top" className="custom-tooltip font-bold">{zone.name}</Tooltip>
                            </Circle>
                        ))}
                    </LayerGroup>
                )}

                {/* Markers */}
                {branches.map((branch) => (
                    <Marker
                        key={branch.id}
                        position={[branch.lat, branch.lng]}
                        icon={createCustomIcon(branch.colorHex)}
                        eventHandlers={{
                            click: () => onSelect(branch.id),
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false} className="font-bold">
                            {branch.title}
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

