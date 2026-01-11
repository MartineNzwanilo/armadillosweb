"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useAnimationFrame, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function InfiniteDragCarousel({ items, basePath = "/real-estate" }: { items: any[], basePath?: string }) {
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate total width of one set of items
    useEffect(() => {
        if (containerRef.current) {
            // Measure the first child's width (assuming all sets are same width)
            // Detailed calculation: roughly calculate scroll width / 3
            // Or better: measure one full set rendered. 
            // Simplest: The container renders 3 sets. We want to wrap when x moves by 1/3 of scrollWidth.
            const totalScrollWidth = containerRef.current.scrollWidth;
            setWidth(totalScrollWidth / 3);
        }
    }, [items]);

    useAnimationFrame((t, delta) => {
        if (!width) return;

        // Auto-scroll logic
        let moveBy = 0;
        if (!isHovered && !isDragging) {
            moveBy = -0.05 * delta; // Speed Factor
        }

        // Apply movement
        const currentX = x.get();
        let newX = currentX + moveBy;

        // Wrap logic for Infinite Loop
        // If we've scrolled past the first set (width), reset to 0 (effectively jumping back to start of 2nd set which looks identical to 1st)
        // Since we are moving LEFT (negative), we check if newX <= -width
        if (newX <= -width) {
            newX = 0; // Jump back to start seamlessly
        }
        // If dragging RIGHT (positive), wrap the other way?
        // For simplicity, let's keep it simple auto-scroll. 
        // If user drags, x updates automatically via drag listener. We need to handle wrap manually on drag too layout-wise?
        // Framer motion drag usually applies transform. We need to sync our logic.

        // Actually, mixing drag="x" and manual x.set is tricky.
        // Better: Apply drag only to updating the motion value?

        if (!isDragging) {
            x.set(newX);
        }
    });

    // Handle Wrap on Drag
    useMotionValueEvent(x, "change", (latest) => {
        if (width && latest <= -width) {
            x.jump(0);
        } else if (width && latest > 0) {
            x.jump(-width);
        }
    });

    return (
        <div
            className="relative w-full overflow-hidden py-10 mb-32 cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="hidden md:block absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-black dark:via-black/80 z-20 pointer-events-none" />
            <div className="hidden md:block absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-black dark:via-black/80 z-20 pointer-events-none" />

            {/* Desktop Navigation Controls */}
            <div className="hidden md:flex absolute inset-y-0 left-0 items-center pl-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => x.set(x.get() + 500)}
                    className="w-14 h-14 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-900 dark:text-white hover:bg-amber-500 hover:text-black transition-all hover:scale-110 active:scale-95 shadow-lg"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => x.set(x.get() - 500)}
                    className="w-14 h-14 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-900 dark:text-white hover:bg-amber-500 hover:text-black transition-all hover:scale-110 active:scale-95 shadow-lg"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <motion.div
                ref={containerRef}
                className="flex gap-0 md:gap-10 w-max pl-0 md:pl-4 items-center"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -10000, right: 10000 }} // Free drag
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
            >
                {/* Tripled Data for Loop Buffer */}
                {[...items, ...items, ...items].map((project, i) => (
                    <Link href={`${basePath}/${project.id}`} key={i} className="block relative group draggable-item">
                        <motion.div
                            className="relative w-[100vw] md:w-[600px] h-[60vh] md:h-[70vh] rounded-none md:rounded-[3rem] overflow-hidden border-y md:border border-slate-200 dark:border-white/5 shadow-2xl pointer-events-none md:pointer-events-auto bg-white dark:bg-slate-900"
                            // pointer-events-none on mobile inside drag ensures drag works better? 
                            // Actually link navigation might conflict with drag. 
                            // Usually: Drag threshold prevents click. Framer handles this.
                            whileHover={{ scale: 0.98 }}
                        >
                            <CardImageSlider images={project.images || [project.image]} title={project.title} />

                            {/* OVERLAYS (Same as before) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end transition-opacity duration-300">
                                <h3 className="text-4xl md:text-5xl font-serif text-white mb-2">{project.title}</h3>
                                <div className="text-xl md:text-2xl font-bold text-amber-400 mb-4">
                                    {typeof project.price === 'number' ? `Tsh. ${project.price.toLocaleString()}` : project.price}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-amber-400 text-sm uppercase tracking-widest font-bold">{project.category}</span>
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white top-right-arrow group-hover:bg-amber-500 transition-colors">
                                        <ArrowRight />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-xl font-serif text-slate-900 dark:text-white mb-2 drop-shadow-lg">View Details</div>
                                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-black scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 shadow-xl">
                                    <ArrowRight size={32} />
                                </div>
                            </div>

                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}

function CardImageSlider({ images, title }: { images: string[], title: string }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        // Randomize start delay slightly to avoid all cards switching in perfect sync
        const delay = Math.random() * 2000;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % images.length);
            }, 4000); // 4 seconds per slide
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [images.length]);

    return (
        <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={images[index]}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        draggable={false}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
