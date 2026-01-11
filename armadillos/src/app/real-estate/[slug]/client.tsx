"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertySlideshow } from "@/components/real-estate/property-slideshow";
import { motion } from "framer-motion";
import { ArrowRight, Bed, Bath, Ruler, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RealEstateDetailClientProps {
    project: any;
}

export function RealEstateDetailClient({ project }: RealEstateDetailClientProps) {
    if (!project) return null;

    return (
        <main className="min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <PropertySlideshow
                images={project.images}
                title={project.title}
                location={project.location}
            />

            <section className="relative py-20">
                <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">Project Overview</h2>
                            <h3 className="text-4xl font-serif mb-6 leading-tight text-slate-900 dark:text-white">{project.description}</h3>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none">
                                <h4 className="text-xl font-serif mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center"><Check size={16} /></span>
                                    Premium Features
                                </h4>
                                <ul className="space-y-4">
                                    {project.features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-black border border-amber-500/20 shadow-xl dark:shadow-none">
                                <h4 className="text-xl font-serif mb-6 text-amber-500">Property Specs</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Ruler size={18} /> Size</span>
                                        <span className="font-bold text-xl">{project.stats.sqft} sqft</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Bed size={18} /> Bedrooms</span>
                                        <span className="font-bold text-xl">{project.stats.beds}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Bath size={18} /> Bathrooms</span>
                                        <span className="font-bold text-xl">{project.stats.baths}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Sidebar (Right) - Sticky */}
                    <div className="md:sticky md:top-32 h-fit">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] relative overflow-hidden transition-colors"
                        >
                            <div className="relative z-10">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Listing Price</span>
                                <div className="text-5xl font-serif font-bold mb-8 mt-2">{project.price}</div>

                                <div className="space-y-4 mb-8">
                                    <Link href="/contact">
                                        <Button className="w-full h-14 rounded-xl bg-slate-900 dark:bg-black text-white hover:bg-slate-800 dark:hover:bg-slate-900 font-bold text-lg">
                                            Schedule Viewing
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full h-14 rounded-xl border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-lg">
                                        <Phone className="mr-2" size={18} /> Request Callback
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4 pt-8 border-t border-slate-200 dark:border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    <div>
                                        <div className="font-bold">Sarah Jenkins</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Senior Broker</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Pattern */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                        </motion.div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
