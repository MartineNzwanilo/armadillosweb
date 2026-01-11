"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertySlideshowProps {
    images: string[];
    title: string;
    location: string;
}

export function PropertySlideshow({ images, title, location }: PropertySlideshowProps) {
    const [index, setIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <Image
                        src={images[index]}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end pb-32 px-4 container mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] w-12 bg-amber-500" />
                        <span className="text-amber-500 uppercase tracking-widest text-sm font-bold">{location}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white max-w-4xl leading-tight">
                        {title}
                    </h1>
                </motion.div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-10 right-4 md:right-10 flex gap-4 z-20">
                <button
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={nextSlide}
                    className="w-14 h-14 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                >
                    <ChevronRight />
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-10 left-10 flex gap-2 z-20">
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}
