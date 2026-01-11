"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
    { name: "Mining", href: "/mining" },
    { name: "Real Estate", href: "/real-estate" },
    { name: "Agrobusiness", href: "/agrobusiness" },
    { name: "Chemicals", href: "/chemicals" },
    { name: "Elution Plants", href: "/elution-plants" },
    { name: "About Us", href: "/about" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-6 md:py-8"
                    }`}
                initial={{ y: 0 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
            >
                <div className="container mx-auto px-4">
                    <div className={`relative flex items-center justify-between px-6 py-4 rounded-full transition-all duration-500 ${isScrolled
                        ? "bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                        : "bg-white/75 dark:bg-transparent backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-lg dark:shadow-none"
                        }`}>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative h-12 w-auto transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/assets/images/logo-full.png"
                                    alt="Armadillos"
                                    width={180}
                                    height={50}
                                    className="h-full w-auto object-contain invert dark:invert-0"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-white/5 rounded-full px-2 py-1 border border-slate-200/60 dark:border-white/5 backdrop-blur-md">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 group"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className={`relative z-10 ${isActive ? "text-white" : "text-slate-700 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white"}`}>
                                            {link.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/contact">
                                <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 shadow-lg shadow-amber-500/20 transition-all hover:scale-105">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-amber-600 dark:text-amber-500 hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/5"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Ultra-Pro Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-slate-50 dark:bg-zinc-950 z-[60] border-l border-slate-200 dark:border-white/10 shadow-2xl p-6 md:hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-xl font-serif font-bold text-slate-900 dark:text-white">Menu</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="space-y-4">
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-200 dark:hover:bg-white/5 group border border-transparent hover:border-slate-300 dark:hover:border-white/5 transition-all"
                                        >
                                            <span className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 decoration-slate-900">
                                                {link.name}
                                            </span>
                                            <ChevronRight size={18} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-transform" />
                                        </motion.div>
                                    </Link>
                                ))}
                            </nav>

                            <div className="absolute bottom-10 left-6 right-6">
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg shadow-lg shadow-amber-500/20">
                                        Contact Us <ArrowRight className="ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
