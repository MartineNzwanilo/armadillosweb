"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

interface MobileEstatePlayerProps {
    projects: any[];
}

export function MobileEstatePlayer({ projects }: MobileEstatePlayerProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % projects.length);
        }, 6000); // 6 seconds per estate
        return () => clearInterval(interval);
    }, [projects.length]);

    const project = projects[index];

    return (
        <div className="w-full h-[75vh] relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none mx-auto my-10">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <Link href={`/real-estate/${project.id}`} className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                <motion.div
                    key={`text-${project.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                            {project.category}
                        </span>
                        <div className="flex items-center text-slate-300 text-xs">
                            <MapPin size={12} className="mr-1" />
                            {(typeof project.location === 'string' ? project.location : project.location?.address || "Unknown").split(",")[0]}
                        </div>
                    </div>

                    <h2 className="text-4xl font-serif text-white mb-2 leading-none">
                        {project.title}
                    </h2>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-2xl font-bold text-white">
                            {typeof project.price === 'number' ? `Tsh. ${project.price.toLocaleString()}` : project.price}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <motion.div
                        key={index}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="h-full bg-amber-500"
                    />
                </div>
            </Link>
        </div>
    );
}
