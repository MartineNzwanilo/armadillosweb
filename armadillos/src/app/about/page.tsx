"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getContent } from "@/lib/cms";
import Image from "next/image";
import { Target, Lightbulb, Users, Globe, Shield, Award, ArrowDown } from "lucide-react";

const iconMap: any = { Target, Lightbulb, Users, Globe, Shield, Award };

export default function AboutPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContent().then(data => {
            setContent(data?.about?.page_content || {});
            setLoading(false);
        });
    }, []);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Defaults relative to safely accessing content
    const hero = content?.hero || {};
    const mission = content?.mission || {};
    const vision = content?.vision || {};
    const values = content?.values || [];

    return (
        <main className="bg-slate-50 dark:bg-black min-h-screen">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <Image
                        src={hero.image || "/assets/images/about-hero.jpg"}
                        alt="About Hero"
                        fill
                        className="object-cover scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </motion.div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight"
                    >
                        {hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        {hero.subtitle}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce"
                >
                    <ArrowDown size={32} />
                </motion.div>
            </div>

            {/* --- MISSION & VISION GRID --- */}
            <section className="py-32 px-6 bg-white dark:bg-zinc-950 relative z-20 rounded-t-[4rem] -mt-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <FadeIn>
                            <div className="relative">
                                <span className="absolute -top-10 -left-10 text-9xl font-serif text-slate-100 dark:text-white/5 font-bold select-none">M</span>
                                <h2 className="text-4xl font-serif font-bold mb-6 text-slate-900 dark:text-white relative z-10">{mission.title}</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed relative z-10">
                                    {mission.description}
                                </p>
                                <ul className="space-y-4">
                                    {(mission.list || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-4 text-slate-800 dark:text-slate-200 font-medium p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-amber-500 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="relative p-12 rounded-[3rem] bg-slate-900 text-white overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-900 to-black opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-30" />
                                <div className="relative z-10">
                                    <h2 className="text-4xl font-serif font-bold mb-6">{vision.title}</h2>
                                    <p className="text-xl text-slate-200 leading-relaxed font-light">
                                        &quot;{vision.description}&quot;
                                    </p>
                                    <div className="mt-12 flex justify-end">
                                        <Target size={48} className="text-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* --- CORE VALUES (Horizontal Scroll Feeling) --- */}
            <section className="py-32 bg-slate-100 dark:bg-black relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2 block">Our DNA</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white">Core Values</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((val: any, i: number) => {
                            const Icon = iconMap[val.icon] || Award;
                            return (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8 group-hover:bg-amber-500 transition-colors duration-500 text-slate-900 dark:text-white group-hover:text-white">
                                            <Icon size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{val.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {val.description}
                                        </p>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- VIDEO / STATEMENT --- */}
            <section className="h-[60vh] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url('/assets/images/mining-bg.jpg')` }} />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
                    <FadeIn>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                            Building the Future using <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">African Resources</span>
                        </h2>
                        <p className="text-xl text-slate-300">
                            Armadillos is more than a company. It is a promise of quality, reliability, and growth for the continent.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Fade In Helper Component
function FadeIn({ children, delay = 0 }: any) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}


