"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationMapProps {
    center: { lat: number, lng: number };
    zoom: number;
    markerPosition?: { lat: number, lng: number };
    onMapClick: (lat: number, lng: number) => void;
}

function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function MapUpdater({ center }: { center: { lat: number, lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (center.lat !== 0 && center.lng !== 0) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function LocationMap({ center, zoom, markerPosition, onMapClick }: LocationMapProps) {
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current) {
            // Fix Leaflet marker icons only once on mount
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
            initializedRef.current = true;
        }
    }, []);

    return (
        <MapContainer
            center={[center.lat || -6.3690, center.lng || 34.8888]}
            zoom={zoom}
            className="h-full w-full"
            style={{ zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onChange={onMapClick} />
            <MapUpdater center={center} />

            {markerPosition && (markerPosition.lat !== 0 || markerPosition.lng !== 0) && (
                <Marker position={[markerPosition.lat, markerPosition.lng]} />
            )}
        </MapContainer>
    );
}
