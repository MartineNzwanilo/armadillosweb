"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AgrobusinessSection() {
    return (
        <section id="agrobusiness" className="relative py-24 min-h-[80vh] flex items-center bg-slate-50 dark:bg-zinc-900 overflow-hidden transition-colors duration-300">

            <div className="absolute inset-0 z-0">
                <Image src="/assets/images/farming.jpg" alt="Modern Farming" fill className="object-cover opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-black dark:via-black/80" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-6xl font-serif text-amber-500 mb-6">Modern Agrobusiness</h2>
                    <p className="text-lg text-slate-700 dark:text-white/90 mb-8 leading-relaxed">
                        Integrating advanced precision agriculture techniques to optimize crop yields and sustainability.
                        From high-quality seeds to modern equipment, we empower the future of farming in Tanzania.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-slate-700 dark:text-white">Precision Farming</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-slate-700 dark:text-white">Quality Seeds</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-slate-700 dark:text-white">Sustainable Tech</span>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Button variant="primary" size="lg">
                            Discover Solutions
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
