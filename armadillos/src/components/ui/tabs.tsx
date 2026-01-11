"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
    const [localActiveTab, setLocalActiveTab] = React.useState(defaultValue);

    const activeTab = value !== undefined ? value : localActiveTab;
    const setActiveTab = onValueChange || setLocalActiveTab;

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("flex items-center p-1 bg-slate-100 dark:bg-white/5 rounded-xl gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-all z-10 whitespace-nowrap",
                isActive ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                className
            )}
            type="button"
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.activeTab !== value) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
