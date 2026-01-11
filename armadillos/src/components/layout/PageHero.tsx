"use client";

import { motion } from "framer-motion";
import { GoldDust } from "@/components/ui/gold-dust";
import Image from "next/image";

interface PageHeroProps {
    title: string;
    subtitle: string;
    image?: string; // Optional background image
    highlight?: string; // Word to highlight in Gold
}

export function PageHero({ title, subtitle, image, highlight }: PageHeroProps) {
    // Split title to highlight the specific word
    const titleParts = highlight ? title.split(highlight) : [title];

    return (
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden pt-32 md:pt-0">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {image ? (
                    <Image src={image} alt={title} fill className="object-cover opacity-40" />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
                <GoldDust />
            </div>

            {/* Content Layer */}
            <div className="container mx-auto px-4 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-amber-500 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                        Armadillos
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                        {highlight ? (
                            <>
                                {titleParts[0]}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
                                    {highlight}
                                </span>
                                {titleParts[1]}
                            </>
                        ) : title}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
