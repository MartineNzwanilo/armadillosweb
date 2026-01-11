"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const projects = [
    {
        title: "Dar Es Salaam City",
        category: "Commercial & Residential",
        image: "/assets/images/apartment.jpg",
    },
    {
        title: "Wellness Centers",
        category: "Health & Lifestyle",
        image: "/assets/images/apartment.jpg",
    },
    {
        title: "Luxury Villas",
        category: "Residential",
        image: "/assets/images/apartment.jpg",
    },
    {
        title: "Safari Lodges",
        category: "Hospitality",
        image: "/assets/images/apartment.jpg",
    },
    {
        title: "Urban Hubs",
        category: "Business",
        image: "/assets/images/apartment.jpg",
    },
];

export function RealEstateSection() {
    return (
        <section id="real-estate" className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden transition-colors duration-300">
            <div className="container mx-auto px-4 mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4">Premium <span className="text-amber-500">Real Estate</span></h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                        Discover our portfolio of developments designed for modern living and high ROI.
                    </p>
                </div>
                <Button variant="outline" className="hidden md:flex rounded-full border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5">
                    View All Projects
                </Button>
            </div>

            {/* Infinite Carousel Wrapper */}
            <div className="relative w-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent dark:from-[#0f172a] z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent dark:from-[#0f172a] z-10" />

                <motion.div
                    className="flex gap-8 w-max pl-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                >
                    {/* Duplicate array for infinite loop effect */}
                    {[...projects, ...projects].map((project, i) => (
                        <div key={i} className="relative w-[300px] md:w-[400px] h-[500px] rounded-3xl overflow-hidden group border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-8 flex flex-col justify-end">
                                <span className="text-amber-400 text-xs uppercase tracking-widest mb-2 font-bold">{project.category}</span>
                                <h3 className="text-2xl font-serif text-white">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
