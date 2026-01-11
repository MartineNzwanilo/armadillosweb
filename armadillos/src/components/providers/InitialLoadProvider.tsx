"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/layout/SplashScreen";

export function InitialLoadProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Simulate initial load or asset checking
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds splash on initial mount

        return () => clearTimeout(timer);
    }, []);

    // Optional: Reset loading on route change if desired, 
    // but usually Next.js loading.tsx handles that. 
    // We keep this specific for the "App Start" splash.

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && <SplashScreen key="splash" />}
            </AnimatePresence>
            {children}
        </>
    );
}
