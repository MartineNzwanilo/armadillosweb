"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Pickaxe, Factory, FlaskConical, TrendingUp, ShieldCheck, Recycle } from "lucide-react";
import { getContent } from "@/lib/cms";

const miningImages = [
    "/assets/images/mining-bg.jpg",
    "/assets/images/mining.jpg"
];

export default function MiningPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContent().then((data) => {
            setContent(data);
            setLoading(false);
        });
    }, []);

    const [currentSlide, setCurrentSlide] = useState(0);

    const { page_content } = content?.mining || {};
    const { hero = {}, intro = {}, process = [], sustainability = {} } = page_content || {};
    const slides = (intro.images && intro.images.length > 0) ? intro.images : miningImages;

    useEffect(() => {
        const timer = setInterval(() => {
            if (slides.length > 0) {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    if (loading || !content) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-amber-500 font-mono text-sm animate-pulse">Loading Mining Data...</p>
                </div>
            </div>
        );
    }

    const services = page_content?.services || [];

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <PageHero
                title={hero.title || "Gold Mining Operations"}
                highlight={hero.highlight || "Mining"}
                subtitle={hero.subtitle || "Sustainable extraction practices meeting world-class efficiency standards in the heart of Tanzania."}
                image={hero.image || "/assets/images/mining-bg.jpg"}
            />

            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-4 z-10 relative">

                    {/* Main Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-32">

                        {/* Main Card - Slideshow */}
                        <div className="md:col-span-2 md:row-span-2 rounded-[3rem] relative overflow-hidden group shadow-xl dark:shadow-none h-[500px]">
                            {/* Background Slideshow */}
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={slides[currentSlide % slides.length]}
                                        alt="Mining Operation"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10" />

                            {/* Content */}
                            <div className="relative z-20 h-full p-10 flex flex-col justify-end">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500/90 backdrop-blur flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/30">
                                    <Pickaxe size={32} />
                                </div>
                                <h3 className="text-4xl font-serif text-white mb-4">{intro.title || "Gold Investment"}</h3>
                                <p className="text-lg text-slate-200 leading-relaxed mb-6 max-w-xl">
                                    {intro.description || "Our primary operations focus on high-yield gold extraction. We utilize both open-pit and responsible processing techniques to ensure maximum recovery with minimal environmental footprint."}
                                </p>
                                <ul className="space-y-3 text-amber-200">
                                    <li className="flex items-center gap-2"><ShieldCheck size={16} /> {intro.recovery_rate || "98% Recovery Rate"}</li>
                                    <li className="flex items-center gap-2"><TrendingUp size={16} /> {intro.roi || "Consistent ROI"}</li>
                                </ul>
                            </div>

                            {/* Indicators */}
                            <div className="absolute bottom-10 right-10 flex gap-2 z-30">
                                {slides.map((_: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide % slides.length ? "bg-white w-6" : "bg-white/40"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Secondary Cards */}
                        {(services.slice(0, 2) || []).map((service: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (i + 1) }}
                                className="rounded-[3rem] p-8 glass-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none flex flex-col justify-between"
                            >
                                {i === 0 ? <Factory size={40} className="text-blue-500 mb-4" /> : <FlaskConical size={40} className="text-purple-500 mb-4" />}
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">{service.title || "Service Title"}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{service.description || "Service description goes here."}</p>
                                </div>
                            </motion.div>
                        ))}

                        {(!services || services.length < 2) && (
                            // Fallback if no services in DB or less than 2
                            <>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="rounded-[3rem] p-8 glass-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none flex flex-col justify-between"
                                >
                                    <Factory size={40} className="text-blue-500 mb-4" />
                                    <div>
                                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">CIP / CIL</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Carbon-in-Pulp technology for efficient gold recovery with &gt;95% purity output.</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="rounded-[3rem] p-8 glass-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none flex flex-col justify-between"
                                >
                                    <FlaskConical size={40} className="text-purple-500 mb-4" />
                                    <div>
                                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">Chemical Supply</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Trusted supplier of mining regents and cyanide to the Lake Zone region.</p>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Detailed Process Section */}
                    <div className="py-20 border-t border-slate-200 dark:border-white/10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-serif text-slate-900 dark:text-white mb-8">Our <span className="text-amber-500">Extraction Process</span></h2>
                                <div className="space-y-8">
                                    {(process.length > 0 ? process : [
                                        "Geological Survey & Exploration",
                                        "Open Pit Excavation",
                                        "Crushing & Milling",
                                        "Chemical Leaching (CIL)",
                                        "Smelting & Refining"
                                    ]).map((step: string, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="pt-1">
                                                <h4 className="text-slate-900 dark:text-white text-lg font-medium">{step}</h4>
                                                <p className="text-slate-500 text-sm mt-1">International safety standards applied.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sustainability Card */}
                            <div className="rounded-[3rem] bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-black border border-green-500/20 p-10 shadow-xl dark:shadow-none">
                                <Recycle size={48} className="text-green-500 mb-8" />
                                <h3 className="text-3xl font-serif text-slate-900 dark:text-white mb-6">
                                    {sustainability.title || "Environmental Stewardship"}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                    {sustainability.description || "We are committed to zero-harm operations. Our tailings management facilities are built to exceed local regulations, ensuring the safety of the surrounding ecosystem."}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {(sustainability.stats && sustainability.stats.length > 0 ? sustainability.stats : [
                                        { value: "100%", label: "Water Recycling" },
                                        { value: "ISO", label: "Certified Process" }
                                    ]).map((stat: any, i: number) => (
                                        <div key={i} className="bg-green-500/10 rounded-2xl p-4">
                                            <span className="block text-2xl font-bold text-green-600 dark:text-green-400">{stat.value}</span>
                                            <span className="text-xs text-green-700/60 dark:text-green-200/60 uppercase">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </main>
    );
}
