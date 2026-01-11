"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { GoldDust } from "@/components/ui/gold-dust";

interface SlideData {
    id: string;
    icon: any;
    title: string;
    stat: string;
    statLabel: string;
    desc: string;
    badgeValue: string;
    badgeLabel: string;
}

interface ServiceHeroProps {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    image: string;
    slides: SlideData[];
}

export function ServiceHero({ badge, title1, title2, desc, image, slides }: ServiceHeroProps) {
    const { scrollY } = useScroll();
    const rotate = useTransform(scrollY, [0, 1000], [0, 45]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const slide = slides[currentSlide];

    return (
        <section className="relative min-h-[85vh] flex items-center pt-32 md:pt-24 pb-12 overflow-hidden selection:bg-amber-500/30">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt="Background"
                    fill
                    className="object-cover opacity-30 dark:opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-slate-50/90 dark:from-black/90 dark:via-black/50 dark:to-black/90 backdrop-blur-[2px]" />
            </div>
            {/* Dynamic Background Ambience */}
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-b from-amber-500/20 to-transparent blur-[150px] rounded-full animate-pulse" />
            <div className="absolute top-[20%] left-[-20%] w-[50%] h-[50%] bg-amber-900/10 blur-[120px] rounded-full" />

            <GoldDust />

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left relative z-20"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/50 dark:bg-black/50 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <Sparkles size={12} className="text-amber-500 dark:text-amber-300 animate-spin-slow" />
                        <span>{badge}</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] mb-8 text-slate-900 dark:text-white">
                        {title1} <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 dark:from-amber-200 dark:via-amber-400 dark:to-amber-700 animate-shimmer bg-[length:200%_auto]">
                            {title2}
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-white/70 mb-10 max-w-xl leading-relaxed font-light border-l-2 border-amber-500/50 pl-6">
                        {desc}
                    </p>
                </motion.div>

                {/* Right: Visual Experience */}
                <div className="hidden md:flex relative h-[600px] w-full items-center justify-center perspective-1000">

                    {/* Center Glow */}
                    <div className="absolute w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px]" />

                    {/* The Composition */}
                    <motion.div
                        style={{ rotateY: rotate, rotateX: 10 }}
                        className="relative w-[350px] h-[500px] preserve-3d"
                    >
                        {/* Back Plate (Glass) */}
                        <motion.div
                            initial={{ rotateZ: -5 }}
                            animate={{ rotateZ: 0 }}
                            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-[40px] shadow-2xl"
                        />

                        {/* Front Plate (Golden Glass) */}
                        <motion.div
                            initial={{ y: 20, rotateZ: 5 }}
                            animate={{ y: 0, rotateZ: 0 }}
                            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/40 to-white/10 dark:from-amber-500/10 dark:to-transparent backdrop-blur-2xl border border-white/60 dark:border-amber-500/30 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 flex flex-col justify-between p-8"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={slide.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full flex flex-col justify-between"
                                >
                                    {/* Top Detail */}
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg flex items-center justify-center text-black">
                                            <slide.icon size={32} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-amber-600 dark:text-amber-500 font-bold text-3xl">{slide.stat}</div>
                                            <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wider">{slide.statLabel}</div>
                                        </div>
                                    </div>

                                    {/* Middle Abstract Graph */}
                                    <div className="space-y-2">
                                        <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div animate={{ width: ["20%", "70%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-amber-500" />
                                        </div>
                                        <div className="h-1 w-2/3 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div animate={{ width: ["40%", "90%"] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-amber-500/60" />
                                        </div>
                                    </div>

                                    {/* Bottom Detail */}
                                    <div>
                                        <div className="text-slate-900 dark:text-white text-2xl font-serif mb-1">{slide.title}</div>
                                        <div className="text-slate-500 dark:text-white/60 text-sm">{slide.desc}</div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Floating Orbiting Badge */}
                        <motion.div
                            animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-12 top-1/4 w-24 h-24 bg-white dark:bg-black/60 backdrop-blur-xl border border-white/80 dark:border-amber-500/50 rounded-2xl flex items-center justify-center z-20 shadow-2xl"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={slide.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">{slide.badgeValue}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-white/50 uppercase">{slide.badgeLabel}</div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                    </motion.div>
                </div>

            </div>
        </section>
    );
}
