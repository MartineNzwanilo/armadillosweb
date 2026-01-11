"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show for exactly 3 seconds as requested
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
                >
                    {/* Background Ambience */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black opacity-50" />

                    {/* Animated Rings */}
                    <div className="relative w-24 h-24 mb-6">
                        <motion.div
                            className="absolute inset-0 border-4 border-amber-500/30 rounded-full"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute inset-0 border-t-4 border-amber-500 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="text-amber-400 animate-pulse" size={24} />
                        </div>
                    </div>

                    {/* Brand Name */}
                    <div className="text-center relative z-10">
                        <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
                            Armadillos
                        </h2>

                        {/* 3 Second Progress Bar */}
                        <div className="relative h-1 bg-white/10 w-48 mt-4 rounded-full overflow-hidden mx-auto">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-amber-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "linear" }}
                            />
                        </div>
                        <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest animate-pulse">Initializing V9...</p>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
