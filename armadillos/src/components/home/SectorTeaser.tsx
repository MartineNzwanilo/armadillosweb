"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Pickaxe, Building2, Sprout } from "lucide-react";

interface SectorTeaserProps {
    sectors?: any[];
}

export function SectorTeaser({ sectors }: SectorTeaserProps) {
    // Default / Fallback
    const displaySectors = (sectors && sectors.length > 0) ? sectors : [
        {
            id: "mining",
            title: "Gold Mining",
            desc: "High-efficiency extraction and chemical supply.",
            icon: "Pickaxe",
            color: "from-amber-400 to-amber-600",
            link: "/mining"
        },
        {
            id: "real-estate",
            title: "Real Estate",
            desc: "Premium developments and urban lifestyle.",
            icon: "Building2",
            color: "from-blue-400 to-blue-600",
            link: "/real-estate"
        },
        {
            id: "agrobusiness",
            title: "Agrobusiness",
            desc: "Sustainable farming and processing technology.",
            icon: "Sprout",
            color: "from-green-400 to-green-600",
            link: "/agrobusiness"
        }
    ];

    // Map string icon names to components if needed, though Hero uses explicit imports.
    // SectorTeaser implemented Lucide imports at top: Pickaxe, Building2, Sprout.
    // But dynamic sectors might have generic names.
    const ICON_MAP: any = { Pickaxe, Building2, Sprout, Landmark: Building2 };


    return (
        <section className="py-12 md:py-24 bg-slate-50 dark:bg-black relative transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {displaySectors.map((sector: any, i: number) => {
                        const Icon = ICON_MAP[sector.icon] || Pickaxe;
                        // Handle color if missing (from CMS)
                        const color = sector.color || "from-amber-400 to-amber-600";
                        const link = sector.link || `/${sector.id}`;

                        const hasImage = !!sector.image;

                        return (
                            <Link href={link} key={i}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 cursor-pointer shadow-xl dark:shadow-none"
                                >
                                    {/* Background Image or Gradient */}
                                    {hasImage ? (
                                        <div className="absolute inset-0">
                                            <div className="absolute inset-0 z-0">
                                                {/* Using next/image */}
                                                <img src={sector.image} alt={sector.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10" />
                                        </div>
                                    ) : (
                                        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                    )}

                                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-20">
                                        <div className={`w-14 h-14 rounded-2xl ${hasImage ? 'bg-white/10 backdrop-blur-md text-white' : `bg-gradient-to-br ${color} text-black`} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon size={28} />
                                        </div>

                                        <div>
                                            <h3 className={`text-3xl font-serif mb-3 group-hover:translate-x-2 transition-transform ${hasImage ? "text-white" : "text-slate-900 dark:text-white"}`}>{sector.title}</h3>
                                            <p className={`text-sm leading-relaxed mb-6 ${hasImage ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}>
                                                {sector.desc}
                                            </p>
                                            <div className={`flex items-center gap-2 font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all ${hasImage ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                                Explore <ArrowRight size={16} className={hasImage ? "text-amber-400" : "text-amber-500"} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
