"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Newspaper, Calendar, ArrowRight, Video, Mic, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3005/api/v1/news')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video size={16} />;
            case 'AUDIO': return <Mic size={16} />;
            case 'IMAGE': return <ImageIcon size={16} />;
            default: return <Newspaper size={16} />;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">Latest Updates</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6">Newsroom</h1>
                        <p className="text-xl text-slate-300">
                            Stay up to date with Armadillos Group announcements, project milestones, and industry insights.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Feed */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    {loading && <div className="text-center py-20 text-slate-500">Loading updates...</div>}

                    {!loading && news.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                            <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold">No news at the moment</h3>
                            <p className="text-slate-500">Check back later for updates.</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 transition-all flex flex-col h-full"
                            >
                                {/* Media Preview (if applicable) */}
                                {item.mediaUrl && (item.type === 'IMAGE' || item.type === 'VIDEO') && (
                                    <div className="h-48 bg-slate-100 dark:bg-black/50 overflow-hidden relative">
                                        {item.type === 'IMAGE' ? (
                                            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <video
                                                src={item.mediaUrl}
                                                controls
                                                className="w-full h-full object-cover bg-black"
                                            />
                                        )}
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 pointer-events-none">
                                            {getTypeIcon(item.type)} {item.type}
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-4">
                                        <Calendar size={12} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>

                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-4 group-hover:text-amber-500 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-1 line-clamp-4">
                                        {item.content}
                                    </p>

                                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                        <Link href={`/news/${item.id}`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white group-hover:gap-4 transition-all">
                                            Read Full Story <ArrowRight size={16} className="text-amber-500" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
