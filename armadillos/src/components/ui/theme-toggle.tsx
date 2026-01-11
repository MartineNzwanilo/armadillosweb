"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const tabs = [
        { id: "light", icon: Sun, label: "Light" },
        { id: "system", icon: Monitor, label: "System" },
        { id: "dark", icon: Moon, label: "Dark" },
    ];

    return (
        <div className="flex items-center p-1 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 w-fit">
            {tabs.map((tab) => {
                const isActive = theme === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setTheme(tab.id)}
                        className={`relative px-3 py-1.5 rounded-full flex items-center justify-center transition-colors text-xs font-medium ${isActive
                                ? "text-slate-900 dark:text-black"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            }`}
                        aria-label={`Switch to ${tab.label} theme`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-theme"
                                className="absolute inset-0 bg-white dark:bg-amber-500 rounded-full shadow-sm"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <tab.icon size={14} />
                            {/* <span className="hidden md:inline">{tab.label}</span>  Keep it minimal */}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
