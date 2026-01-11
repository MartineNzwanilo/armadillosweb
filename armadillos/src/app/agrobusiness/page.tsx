"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Sprout, Tractor, Leaf, Loader2 } from "lucide-react";
import { getContent } from "@/lib/cms";

// Icon mapping
const iconMap: any = {
    "Sprout": Sprout,
    "Tractor": Tractor,
    "Leaf": Leaf
};

export default function AgrobusinessPage() {
    const [dbContent, setDbContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContent().then((data) => {
            setDbContent(data);
            setLoading(false);
        });
    }, []);

    const [currentImage, setCurrentImage] = useState(0);

    // useEffect for slideshow rotation
    useEffect(() => {
        if (!dbContent) return;
        const images = dbContent.agrobusiness.page_content.intro?.images || [];
        if (images.length === 0) return;

        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [dbContent]);

    if (loading || !dbContent) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-green-500 font-mono text-sm animate-pulse">Loading Agrobusiness Data...</p>
                </div>
            </div>
        );
    }

    const { page_content, crops = [] } = dbContent.agrobusiness || {};
    const { hero = {}, intro = {}, features = [] } = page_content || {};
    const introImages = intro.images || [];
    const Icon = iconMap;

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
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-widest mb-6">
                                {intro.badge}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                                {intro.title_prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-600">{intro.title_highlight}</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                {intro.description}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-l-2 border-green-500 pl-4">
                                    <span className="block text-3xl font-bold text-slate-900 dark:text-white mb-1">{intro.stat_1_value}</span>
                                    <span className="text-sm text-slate-500">{intro.stat_1_label}</span>
                                </div>
                                <div className="border-l-2 border-green-500 pl-4">
                                    <span className="block text-3xl font-bold text-slate-900 dark:text-white mb-1">{intro.stat_2_value}</span>
                                    <span className="text-sm text-slate-500">{intro.stat_2_label}</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group"
                        >
                            <AnimatePresence mode="popLayout">
                                {introImages.length > 0 && (
                                    <motion.div
                                        key={currentImage}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={introImages[currentImage] || ""}
                                            alt="Farming"
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-black opacity-60 z-10" />

                            {/* Slide Indicators */}
                            <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                                {introImages.map((_: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImage ? "bg-white w-6" : "bg-white/50"}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((item: any, i: number) => {
                            const IconComponent = iconMap[item.icon] || Sprout;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none hover:-translate-y-2 transition-transform"
                                >
                                    <IconComponent className="w-12 h-12 text-emerald-600 dark:text-emerald-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Crop Cycles / Projects Section */}
                    {crops.length > 0 && (
                        <div className="mt-32">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-12 text-center"
                            >
                                Seasonal <span className="text-emerald-500">Crop Cycles</span>
                            </motion.h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {crops.map((crop: any, i: number) => (
                                    <motion.div
                                        key={crop.id || i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative overflow-hidden rounded-[2.5rem]"
                                    >
                                        <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/40 group-hover:bg-slate-900/0 transition-colors z-10" />

                                        {/* Image Fallback or Actual Image */}
                                        <div className="h-64 relative bg-emerald-900">
                                            {crop.image ? (
                                                <Image
                                                    src={crop.image}
                                                    alt={crop.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/20 text-emerald-300">
                                                    <Leaf size={64} opacity={0.5} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 bg-white dark:bg-white/5 border-x border-b border-slate-200 dark:border-white/10 rounded-b-[2.5rem] relative z-20">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{crop.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${crop.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                    crop.status === 'Planned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                        'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                                                    }`}>
                                                    {crop.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-white/5 pb-2">
                                                    <span className="text-slate-500 dark:text-slate-400">Harvest Date</span>
                                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{crop.harvestDate || "TBD"}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-white/5 pb-2">
                                                    <span className="text-slate-500 dark:text-slate-400">Expected Yield</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">{crop.yield || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
}
