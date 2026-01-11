"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import { FlaskConical, Beaker, Factory, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { getContent } from "@/lib/cms";

// Icon mapping for dynamic content
const iconMap: any = {
    FlaskConical, Beaker, Factory, ShieldCheck, Truck
};

const chemicalImages = [
    "/assets/images/chemicals-bg.png",
    "/assets/images/elution-bg.png",
    "/assets/images/mining-bg.jpg"
];

export default function ChemicalsPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContent().then((data) => {
            setContent(data);
            setLoading(false);
        });
    }, []);

    const [currentSlide, setCurrentSlide] = useState(0);

    // useEffect for slideshow rotation
    useEffect(() => {
        if (!content) return;
        const slides = content.chemicals.page_content.slides || [];
        if (slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [content]);

    if (loading || !content) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-purple-500 font-mono text-sm animate-pulse">Loading Chemicals Data...</p>
                </div>
            </div>
        );
    }

    const data = content?.chemicals?.page_content || {};
    const { hero = {}, slides = [], features = [] } = data;
    const slide = slides.length > 0 ? slides[currentSlide % slides.length] : {
        title: "Loading...",
        description: "",
        stat: "",
        statLabel: "",
        icon: "FlaskConical",
        badgeValue: "",
        badgeLabel: ""
    };

    // Helper to get icon component
    const SlideIcon = iconMap[slide.icon] || FlaskConical;

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <PageHero
                title={hero.title}
                highlight={hero.highlight}
                subtitle={hero.subtitle}
                image={hero.image}
            />

            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-4 z-10 relative">

                    {/* Main Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-32">

                        {/* Main Card - Slideshow */}
                        <div className="md:col-span-2 md:row-span-2 rounded-[3rem] relative overflow-hidden group shadow-xl dark:shadow-none h-[400px] flex flex-col justify-center">

                            {/* Background Image Slider */}
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={`bg-${currentSlide}`}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 z-0"
                                >
                                    <Image
                                        src={slide.image || chemicalImages[currentSlide % chemicalImages.length]}
                                        alt="Chemical Facility"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 to-purple-900/40 z-10" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative z-20 p-10"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                                            <SlideIcon size={32} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">{slide.stat}</div>
                                            <div className="text-xs uppercase tracking-widest text-purple-200 font-bold">{slide.statLabel}</div>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-serif text-white mb-4">{slide.title}</h3>
                                    <p className="text-lg text-purple-100 leading-relaxed mb-6 max-w-lg">
                                        {slide.description}
                                    </p>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-sm">
                                        <ShieldCheck size={16} /> {slide.badgeValue} {slide.badgeLabel}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Indicators */}
                            <div className="absolute bottom-10 right-10 flex gap-2 z-30">
                                {slides.map((_: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-white w-6" : "bg-white/30"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Secondary Cards */}
                        {features.map((feature: any, idx: number) => {
                            const FeatureIcon = iconMap[feature.icon] || Beaker;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * (idx + 1) }}
                                    className="rounded-[3rem] p-8 glass-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none flex flex-col justify-between"
                                >
                                    <FeatureIcon size={40} className={idx === 0 ? "text-blue-500 mb-4" : "text-green-500 mb-4"} />
                                    <div>
                                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Additional Section: Products / Shipments */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 pl-4 border-l-4 border-amber-500">
                            Our Products & Logistics
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content?.chemicals?.projects?.map((project: any, i: number) => (
                                <div key={i} className="group rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-2xl transition-all duration-300">
                                    <div className="h-48 bg-slate-100 dark:bg-black/20 relative overflow-hidden">
                                        {project.imageUrl || project.image ? (
                                            <Image src={project.imageUrl || project.image} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/20">
                                                <Factory size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-white/10">
                                            {project.stock || "Stockpile"}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors">{project.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                            <Truck size={16} className="text-amber-500" /> {project.details?.location || "Warehouse"}
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/10">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Volume</span>
                                            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{project.details?.yield || "--"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </main>
    );
}
