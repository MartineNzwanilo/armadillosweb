"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 dark:bg-black"
        >
            <div className="relative flex flex-col items-center">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="relative w-40 h-40 md:w-56 md:h-56 mb-8"
                >
                    {/* Dark Mode: Original Logo (White/Color) */}
                    <Image
                        src="/assets/images/logo-icon.png"
                        alt="Armadillos Logo"
                        fill
                        className="object-contain hidden dark:block"
                        sizes="(max-width: 768px) 160px, 224px"
                        priority
                    />

                    {/* Light Mode: Force Gold Color using Mask */}
                    <div
                        className="absolute inset-0 bg-amber-500 dark:hidden"
                        style={{
                            maskImage: 'url(/assets/images/logo-icon.png)',
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: 'url(/assets/images/logo-icon.png)',
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                        }}
                    />
                </motion.div>

                {/* Loading Bar */}
                <div className="w-48 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-full h-full bg-amber-500"
                    />
                </div>
            </div>
        </motion.div>
    );
}
