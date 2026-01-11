"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowRight, MapPin, Bed, Bath, Hash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getContent } from "@/lib/cms";

export default function RealEstateListingsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContent().then((content) => {
            const mappedListings = content?.real_estate_listings.map((item: any) => {
                // Handle potential object location
                const loc = item.location;
                const locationStr = (typeof loc === 'object' && loc?.address) ? loc.address : (loc || "Tanzania");

                return {
                    ...item,
                    image: item.gallery?.[0] || "/assets/images/real-estate-bg.jpg",
                    title: item.title,
                    category: item.category || "Real Estate",
                    location: locationStr,
                    price: item.price,
                    stats: item.stats || { sqft: "-", beds: "-", baths: "-" }
                };
            }) || [];
            setListings(mappedListings);
            setLoading(false);
        });
    }, []);

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <PageHero
                title="Property Listings"
                highlight="Available"
                subtitle="Explore our complete portfolio of premium properties across Tanzania."
                image="/assets/images/real-estate-bg.jpg"
            />

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading properties...</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {listings.length === 0 ? (
                                <div className="col-span-3 text-center py-10">No properties found.</div>
                            ) : (
                                listings.map((project, i) => (
                                    <motion.div
                                        key={project.id || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:shadow-2xl transition-all"
                                    >
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                                                {project.category}
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <div className="flex items-center text-white text-sm">
                                                    <MapPin size={14} className="mr-1 text-amber-500" />
                                                    {project.location}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                                                {project.title}
                                            </h3>
                                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">
                                                {project.price}
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm mb-6 pb-6 border-b border-slate-100 dark:border-white/5">
                                                <div className="flex items-center gap-1">
                                                    <Hash size={16} /> {project.stats?.sqft || '-'} sqft
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bed size={16} /> {project.stats?.beds || '-'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bath size={16} /> {project.stats?.baths || '-'}
                                                </div>
                                            </div>

                                            <Link href={`/real-estate/${project.id}`}>
                                                <Button className="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 font-medium">
                                                    View Details <ArrowRight size={16} className="ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
