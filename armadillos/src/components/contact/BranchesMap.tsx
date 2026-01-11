"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Pickaxe, Sprout, Building, Crown, X, FlaskConical, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import Leaflet map to avoid window is not defined
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900 animate-pulse" />
});

import { getContent, getProjects } from "@/lib/cms";

export function BranchesMap() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"leaflet" | "google">("leaflet");
    const [googleQuery, setGoogleQuery] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const [content, projects] = await Promise.all([getContent(), getProjects()]);

            let allLocations: any[] = [];

            // 1. Office Locations from Settings
            // @ts-ignore
            if (content.locations) {
                // @ts-ignore
                const offices = content.locations.map(loc => ({
                    id: `office-${loc.id}`,
                    title: loc.title || loc.name,
                    location: loc.location || loc.address,
                    lat: loc.lat || loc.coordinates?.lat || 0,
                    lng: loc.lng || loc.coordinates?.lng || 0,
                    desc: loc.desc || loc.description || "Strategic Armadillos Group Location",
                    type: "Office",
                    icon: "Crown",
                    color: "text-slate-900",
                    bg: "bg-slate-200",
                    colorHex: "#f59e0b" // Amber for HQ
                }));
                allLocations = [...allLocations, ...offices];
            }

            // 2. Projects from Database
            // @ts-ignore
            const projectLocations = projects.filter(p => p.details?.location?.coordinates).map(p => {
                const typeMap: any = {
                    'MINING': { icon: 'Pickaxe', color: 'text-amber-500', bg: 'bg-amber-500', hex: '#f59e0b', label: 'Mining Project' },
                    'REAL_ESTATE': { icon: 'Building', color: 'text-cyan-500', bg: 'bg-cyan-500', hex: '#06b6d4', label: 'Real Estate' },
                    'AGROBUSINESS': { icon: 'Sprout', color: 'text-green-500', bg: 'bg-green-500', hex: '#22c55e', label: 'Agrobusiness' },
                    'CHEMICALS': { icon: 'FlaskConical', color: 'text-teal-500', bg: 'bg-teal-500', hex: '#14b8a6', label: 'Chemicals' },
                    'ELUTION': { icon: 'Zap', color: 'text-indigo-500', bg: 'bg-indigo-500', hex: '#6366f1', label: 'Elution Plant' }
                };

                const style = typeMap[p.type] || { icon: 'MapPin', color: 'text-slate-500', bg: 'bg-slate-500', hex: '#64748b', label: 'Project' };

                return {
                    id: `proj-${p.id}`,
                    title: p.name,
                    location: p.details.location.address || "Tanzania",
                    lat: p.details.location.coordinates.lat,
                    lng: p.details.location.coordinates.lng,
                    desc: p.details.description || "Armadillos Group Project",
                    type: style.label,
                    icon: style.icon,
                    color: style.color,
                    bg: style.bg,
                    colorHex: style.hex
                };
            });

            allLocations = [...allLocations, ...projectLocations];
            setBranches(allLocations);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Icon mapping helper
    const getIcon = (iconName: string) => {
        const icons: any = { Crown, Pickaxe, Sprout, Building, MapPin };
        return icons[iconName] || MapPin;
    }

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl font-serif text-slate-900 dark:text-white mb-4">Our <span className="text-amber-500">Presence</span></h2>
                    <p className="text-slate-600 dark:text-slate-400">Strategic locations across Tanzania driving value in key economic sectors.</p>
                </div>

                <div className="relative w-full mx-auto h-[450px] md:h-[600px] bg-slate-100 dark:bg-slate-900/50 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden group">

                    {/* Map Visuals (Swappable) */}
                    <AnimatePresence mode="wait">
                        {viewMode === "leaflet" ? (
                            <motion.div
                                key="leaflet"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-0"
                            >
                                <LeafletMap onSelect={setSelected} branches={branches} />
                                {/* Gradient Border Overlay (Aesthetic) - Only on Leaflet */}
                                <div className="absolute inset-0 border-[4px] md:border-[8px] border-slate-200/50 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] pointer-events-none z-10" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="google"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-0 bg-slate-900"
                            >
                                {/* Back Button */}
                                <button
                                    onClick={() => setViewMode("leaflet")}
                                    className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black/70 transition-all font-bold text-sm border border-white/10"
                                >
                                    <MapPin size={16} /> Back to Overview
                                </button>

                                {/* Google Map Embed */}
                                {googleQuery && (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight={0}
                                        marginWidth={0}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(googleQuery)}&t=m&z=15&output=embed&iwloc=near`}
                                        title="Location Map"
                                        className="w-full h-full"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Detail Card Overlay (Only visible in Leaflet mode) */}
                    <AnimatePresence>
                        {selected && viewMode === "leaflet" && (
                            <div className="absolute inset-0 z-20 flex items-end md:items-center justify-center p-4 md:p-4 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={() => setSelected(null)}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative w-full md:w-auto md:min-w-[320px] max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl mb-2 md:mb-0"
                                >
                                    {(() => {
                                        const branch = branches.find(b => b.id === selected);
                                        if (!branch) return null;
                                        const Icon = getIcon(branch.icon);
                                        return (
                                            <>
                                                <button
                                                    onClick={() => setSelected(null)}
                                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <X size={20} className="text-slate-500" />
                                                </button>

                                                <div className={`w-14 h-14 rounded-2xl ${branch.bg}/10 flex items-center justify-center mb-6`}>
                                                    <Icon size={28} className={branch.color} />
                                                </div>

                                                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{branch.type}</div>
                                                <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">{branch.title}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                                    <MapPin size={14} /> {branch.location}
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                                    {branch.desc}
                                                </p>

                                                <Button
                                                    onClick={() => {
                                                        window.scrollTo({ top: window.scrollY + 100, behavior: 'smooth' }); // Slight scroll for focus
                                                        setGoogleQuery(`${branch.lat},${branch.lng}`);
                                                        setViewMode("google");
                                                        setSelected(null);
                                                    }}
                                                    className="w-full rounded-xl bg-amber-500 text-black hover:bg-amber-600"
                                                >
                                                    <MapPin size={16} className="mr-2" /> View Live Map
                                                </Button>
                                            </>
                                        );
                                    })()}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
