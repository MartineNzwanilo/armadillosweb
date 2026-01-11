"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Check, Building, Key, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { InfiniteDragCarousel } from "@/components/ui/infinite-drag-carousel";
import { MobileEstatePlayer } from "@/components/real-estate/mobile-estate-player";
import { useState, useEffect } from "react";
import { getContent, type SiteContent } from "@/lib/cms";

export default function RealEstatePage() {
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        getContent().then(setContent);
    }, []);

    // Transform API data to match component expectations
    const listings = content?.real_estate_listings.map((item: any) => ({
        ...item,
        image: item.gallery?.[0] || "/assets/images/real-estate-bg.jpg",
        images: item.gallery || ["/assets/images/real-estate-bg.jpg"]
    })) || [];

    const tiers = content?.real_estate_page?.investment_opportunities || [];
    const iconMap: any = { building: <Building />, key: <Key />, crown: <Crown /> };

    if (!content) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <PageHero
                title={content.real_estate_page?.hero?.title || "Premium Real Estate"}
                highlight={content.real_estate_page?.hero?.highlight || "Real Estate"}
                subtitle={content.real_estate_page?.hero?.subtitle || "Curated properties for the discerning investor. Discover exclusive gated communities and high-yield commercial hubs."}
                image={content.real_estate_page?.hero?.image || "/assets/images/real-estate-bg.jpg"}
            />

            <section className="relative py-20 overflow-hidden">

                {listings.length > 0 ? (
                    <>
                        {/* Desktop: Infinite Carousel */}
                        <div className="hidden md:block">
                            <InfiniteDragCarousel items={listings} />
                        </div>

                        {/* Mobile: Auto-Player Card */}
                        <div className="md:hidden px-4 mb-20">
                            <MobileEstatePlayer projects={listings} />
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center text-slate-500">
                        <p>Loading exclusive listings...</p>
                    </div>
                )}

                {/* Investment Tiers */}
                {tiers.length > 0 && (
                    <div className="container mx-auto px-4 mt-20">
                        <h2 className="text-4xl font-serif text-slate-900 dark:text-white text-center mb-16">Investment <span className="text-amber-500">Opportunities</span></h2>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {tiers.map((tier, idx) => (
                                <div key={idx} className={`p-8 rounded-[2.5rem] border transition-all ${tier.popular
                                    ? "bg-gradient-to-b from-amber-50 to-white dark:from-amber-500/10 dark:to-black border-amber-200 dark:border-amber-500/30 relative shadow-2xl shadow-amber-500/10 dark:shadow-none"
                                    : "bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 shadow-xl dark:shadow-none"
                                    }`}>
                                    {tier.popular && (
                                        <div className="absolute top-0 right-0 p-6">
                                            <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold uppercase">Popular</span>
                                        </div>
                                    )}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tier.popular ? "bg-amber-500 text-black" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        }`}>
                                        {iconMap[tier.icon] || <Building />}
                                    </div>
                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">{tier.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{tier.description}</p>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{tier.price} <span className="text-sm font-normal text-slate-500">{tier.priceLabel || "Starting"}</span></div>
                                    <ul className="space-y-4 mb-8">
                                        {tier.features.map((feature: string, i: number) => (
                                            <li key={i} className={`flex items-center gap-3 text-sm ${tier.popular ? "text-slate-700 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                                                <Check size={16} className={tier.popular ? "text-amber-500 dark:text-amber-400" : "text-amber-500"} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="w-full">
                                        <Link href="/contact" className="block w-full">
                                            <Button variant={tier.popular ? "primary" : "outline"} className={`w-full rounded-xl ${tier.popular ? "bg-amber-500 text-black font-bold hover:bg-amber-600" : "border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                                                {tier.popular ? "Request Viewing" : "Details"}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/real-estate/listings">
                        <Button className="px-10 py-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-105 transition-all shadow-xl">
                            View All Properties <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>

            </section>
            <Footer />
        </main>
    );
}
