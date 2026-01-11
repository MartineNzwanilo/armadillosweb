"use client";

import { motion } from "framer-motion";
import { Pickaxe, FlaskConical, Factory } from "lucide-react";

const services = [
    {
        title: "Gold Investment",
        description: "Secure, profitable opportunities backed by local expertise and high recovery rates.",
        icon: Pickaxe,
        color: "bg-amber-500",
    },
    {
        title: "CIP / CIL Technology",
        description: "Advanced extraction using activated carbon for maximum efficiency and environmental safety.",
        icon: Factory,
        color: "bg-blue-600",
    },
    {
        title: "Chemical Supply",
        description: "Premium cyanide and reagents supply for mining operations across the region.",
        icon: FlaskConical,
        color: "bg-purple-600",
    },
];

export function MiningSection() {
    return (
        <section id="mining" className="py-12 md:py-24 relative overflow-hidden bg-slate-50 dark:bg-transparent transition-colors duration-300">
            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2 block">Our Expertise</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                        Mining <span className="text-amber-500">Excellence</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Combining traditional expertise with modern extraction technology to deliver superior value.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group rounded-[2rem] p-10 hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${service.color} text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                <service.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 group-hover:text-amber-500 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
