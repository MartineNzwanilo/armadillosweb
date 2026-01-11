"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Loader() {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black opacity-50" />

            {/* Animated Rings */}
            <div className="relative w-24 h-24 mb-6">
                <motion.div
                    className="absolute inset-0 border-4 border-amber-500/30 rounded-full"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute inset-0 border-t-4 border-amber-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
                <motion.div
                    className="h-0.5 bg-amber-500 mt-2 mx-auto rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>

        </div>
    );
}
