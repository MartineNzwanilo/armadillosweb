"use client";

import { useState, useEffect } from "react";
import { Building2, Pickaxe, Sprout, Landmark, Globe, ShieldCheck, Briefcase, Gem, Hexagon } from "lucide-react";
import { getContent } from "@/lib/cms";

const ICON_MAP: any = {
    Pickaxe, Landmark, Sprout, Building2, Globe, ShieldCheck, Briefcase, Gem, Hexagon
};

export interface PartnersSectionProps {
    partners?: any[];
}

export function PartnersSection({ partners = [] }: PartnersSectionProps) {

    // Fallback if no SQL partners provided, could use default list or empty
    const displayPartners = partners.length > 0 ? partners : [
        { name: "Global Mining Corp", icon: "Pickaxe", type: "Icon" },
        { name: "Tanzania Investment Bank", icon: "Landmark", type: "Icon" },
    ];

    return (
        <section className="py-12 bg-slate-50 dark:bg-black border-y border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">

            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest opacity-80">Trusted by Industry Leaders</p>
            </div>

            {/* Gradient Masks for "Twingate" Fade Effect */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 to-transparent dark:from-black z-10" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent dark:from-black z-10" />

            <div className="relative flex overflow-hidden group">

                {/* Infinite Scroll Container (Doubled for seamless loop) */}
                <div className="flex animate-infinite-scroll group-hover:pause gap-8 md:gap-16 px-8">
                    {/* First Set */}
                    {displayPartners.map((partner, i) => {
                        const Icon = ICON_MAP[partner.logo || partner.icon] || Hexagon;
                        return (
                            <div key={i} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shrink-0 grayscale hover:grayscale-0">
                                {partner.type === 'Image' && partner.logo ? (
                                    <div className="h-12 w-auto flex items-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" />
                                    </div>
                                ) : (
                                    <Icon size={32} className="text-amber-500" />
                                )}
                                <span className="text-xl font-serif font-bold text-slate-900 dark:text-white whitespace-nowrap">{partner.name}</span>
                            </div>
                        );
                    })}
                    {/* Second Set (Duplicate) */}
                    {displayPartners.map((partner, i) => {
                        const Icon = ICON_MAP[partner.logo || partner.icon] || Hexagon;
                        return (
                            <div key={`dup-${i}`} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shrink-0 grayscale hover:grayscale-0">
                                {partner.type === 'Image' && partner.logo ? (
                                    <div className="h-12 w-auto flex items-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" />
                                    </div>
                                ) : (
                                    <Icon size={32} className="text-amber-500" />
                                )}
                                <span className="text-xl font-serif font-bold text-slate-900 dark:text-white whitespace-nowrap">{partner.name}</span>
                            </div>
                        );
                    })}
                </div>

            </div>

            <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }
        .group-hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}
