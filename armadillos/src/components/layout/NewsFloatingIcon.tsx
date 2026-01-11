"use client";

import Link from "next/link";
import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

export function NewsFloatingIcon() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    return (
        <Link href="/news">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 left-6 z-50 group pointer-events-auto"
            >
                <div className="relative w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-amber-500/30 border border-white/20">
                    <Newspaper size={24} />

                    {/* Notification Dot (Mocked) */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md">
                    Newsroom
                </div>
            </motion.div>
        </Link>
    );
}
