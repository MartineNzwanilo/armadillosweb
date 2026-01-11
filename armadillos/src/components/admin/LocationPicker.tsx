"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import the map component with SSR disabled
const LocationMap = dynamic(() => import("./LocationMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 dark:bg-white/5 animate-pulse flex items-center justify-center text-slate-400 text-xs">Loading Map...</div>
});

interface LocationPickerProps {
    value: { lat: number, lng: number };
    onChange: (value: { lat: number, lng: number, address?: string }) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [localCenter, setLocalCenter] = useState(value);

    // Sync local center if value changes externally (e.g. from search)
    useEffect(() => {
        if (value.lat !== 0 && value.lng !== 0) {
            setLocalCenter(value);
        }
    }, [value]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);

                onChange({ lat: newLat, lng: newLng, address: display_name });
                setLocalCenter({ lat: newLat, lng: newLng });
            }
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search for a place (e.g. Dar es Salaam)"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 dark:bg-black/40 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button type="button" onClick={handleSearch} disabled={searching} variant="outline">
                    {searching ? "Searching..." : "Find"}
                </Button>
            </div>

            <div className="relative h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 z-0">
                <LocationMap
                    center={localCenter.lat ? localCenter : { lat: -6.3690, lng: 34.8888 }}
                    zoom={13}
                    markerPosition={value}
                    onMapClick={(lat, lng) => onChange({ lat, lng })}
                />

                <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-black/90 p-2 rounded-lg text-xs z-[400] shadow-lg backdrop-blur pointer-events-none">
                    <div className="font-mono">Lat: {value.lat?.toFixed(6) || 0}</div>
                    <div className="font-mono">Lng: {value.lng?.toFixed(6) || 0}</div>
                    <div className="text-slate-500 mt-1">Click anywhere to set marker</div>
                </div>
            </div>
        </div>
    );
}
