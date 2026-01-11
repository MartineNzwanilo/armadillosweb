"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Box, Pickaxe, Building, Sprout, Building2, Gem, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoldDust } from "@/components/ui/gold-dust";

interface HeroProps {
    content?: any;
    services?: any[];
}

const ICON_MAP: any = {
    mining: Pickaxe,
    "real-estate": Building2,
    agrobusiness: Sprout,
    default: Gem
};

export function Hero({ content, services = [] }: HeroProps) {
    const { scrollY } = useScroll();
    const rotate = useTransform(scrollY, [0, 1000], [0, 45]);
    const [currentService, setCurrentService] = useState(0);

    const displayServices = services.length > 0 ? services : [
        {
            id: "mining",
            title: "Gold Mining",
            stat: "99.9%",
            statLabel: "Purity",
            desc: "Ethical extraction and refining.",
            badgeValue: "$2.4B",
            badgeLabel: "Market Cap",
            image: "/assets/images/mining.jpg"
        },
        {
            id: "real-estate",
            title: "Real Estate",
            stat: "15%",
            statLabel: "Target ROI",
            desc: "Premium urban developments.",
            badgeValue: "120+",
            badgeLabel: "Properties",
            image: "/assets/images/apartment.jpg"
        },
        {
            id: "agrobusiness",
            title: "Agrobusiness",
            stat: "45k",
            statLabel: "Acres",
            desc: "Sustainable crop cycles.",
            badgeValue: "+18%",
            badgeLabel: "Annual Growth",
            image: "/assets/images/farming.jpg"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentService((prev) => (prev + 1) % displayServices.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [displayServices.length]);

    const service = displayServices[currentService];
    const ServiceIcon = ICON_MAP[service.id] || ICON_MAP.default;

    // Default fallbacks
    const badge = content?.badge || "The Gold Standard";
    const title1 = content?.title_line_1 || "Forge Your";
    const title2 = content?.title_line_2 || "Golden Legacy";
    const desc = content?.description || "Armadillos is redefining sustainable investment in Tanzania across Mining, Real Estate, and Agriculture.";
    const cta1 = content?.cta_primary || "Start Investing";
    const cta2 = content?.cta_secondary || "View Portfolio";

    return (
        <section className="relative min-h-[92vh] flex items-center pt-32 md:pt-24 pb-12 overflow-hidden selection:bg-amber-500/30 bg-slate-50 dark:bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={content?.image || "/assets/images/home-bg-v2.png"}
                    alt="Background"
                    fill
                    className="object-cover opacity-60 dark:opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/80 to-transparent dark:from-black/95 dark:via-black/80 dark:to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-black z-0" />
            </div>

            <GoldDust />

            {/* Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-left relative z-20 max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-lg shadow-amber-500/10">
                        <Sparkles size={12} className="text-amber-500 animate-spin-slow" />
                        <span>{badge}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[0.95] mb-8 text-slate-900 dark:text-white tracking-tight">
                        {title1} <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-200 dark:via-amber-400 dark:to-amber-600 animate-gradient-text bg-[length:200%_auto]">
                            {title2}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-white/80 mb-10 leading-relaxed font-light border-l-4 border-amber-500 pl-6">
                        {desc}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/mining">
                            <Button className="h-14 pl-8 pr-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 font-bold text-base shadow-xl hover:shadow-2xl transition-all group">
                                {cta1} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/real-estate">
                            <Button variant="ghost" className="h-14 px-8 rounded-full border border-slate-200 dark:border-white/20 hover:border-amber-500/50 hover:bg-amber-500/5 text-slate-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-all font-medium">
                                <Box className="mr-2 w-4 h-4" /> {cta2}
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right: Visual Experience */}
                <div className="hidden lg:flex relative h-[650px] w-full items-center justify-center perspective-1000">

                    {/* Background Orbit */}
                    <div className="absolute w-[500px] h-[500px] border border-slate-200 dark:border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                    <div className="absolute w-[300px] h-[300px] border border-amber-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

                    {/* The Composition */}
                    <motion.div
                        style={{ rotateY: rotate, rotateX: 5 }}
                        className="relative w-[380px] h-[550px] preserve-3d cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Back Plate */}
                        <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl translate-z-[-20px]" />

                        {/* Front Plate (Glass) */}
                        <motion.div
                            initial={{ y: 20, rotateZ: 2 }}
                            animate={{ y: 0, rotateZ: 0 }}
                            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative h-full w-full"
                                >
                                    {/* Image Layer */}
                                    <div className="absolute inset-0 h-3/5 z-0">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent" />
                                    </div>

                                    {/* Content Layer */}
                                    <div className="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black dark:to-transparent z-10 p-8 flex flex-col justify-end">
                                        <div className="flex justify-between items-end mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-lg transform -translate-y-8 group-hover:-translate-y-10 transition-transform duration-500">
                                                <ServiceIcon size={32} strokeWidth={1.5} />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-amber-600 dark:text-amber-400 font-bold text-4xl">{service.stat}</div>
                                                <div className="text-slate-400 font-medium text-xs uppercase tracking-wider">{service.statLabel}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-3xl font-serif text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{service.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">{service.desc}</p>
                                            </div>

                                            {/* Progress Bar Aesthetic */}
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden flex">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 6, ease: "linear" }}
                                                    className="h-full bg-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -right-8 top-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 z-30"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                                    <Coins size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{service.badgeValue}</div>
                                    <div className="text-[10px] uppercase text-slate-500 tracking-wide">{service.badgeLabel}</div>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
