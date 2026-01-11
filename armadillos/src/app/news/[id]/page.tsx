"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Video, Mic, Image as ImageIcon, Newspaper } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

export default function SingleNewsPage() {
    const { id } = useParams();
    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:3005/api/v1/news/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video size={16} />;
            case 'AUDIO': return <Mic size={16} />;
            case 'IMAGE': return <ImageIcon size={16} />;
            default: return <Newspaper size={16} />;
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                <div className="text-slate-500">Loading...</div>
            </main>
        );
    }

    if (!news) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-black">
                <Navbar />
                <div className="container mx-auto py-32 text-center text-slate-500">
                    <h1 className="text-2xl font-bold mb-4">News not found</h1>
                    <Link href="/news" className="text-amber-500 hover:underline">Back to Newsroom</Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black">
            <Navbar />

            <article className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Link href="/news" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Newsroom
                    </Link>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
                        {/* Media Header */}
                        {news.mediaUrl && (news.type === 'IMAGE' || news.type === 'VIDEO') && (
                            <div className="w-full bg-black/5 dark:bg-black aspect-video relative">
                                {news.type === 'IMAGE' ? (
                                    <img src={news.mediaUrl} alt={news.title} className="w-full h-full object-contain" />
                                ) : (
                                    <video src={news.mediaUrl} controls className="w-full h-full bg-black" />
                                )}
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase mb-6">
                                <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full">
                                    {getTypeIcon(news.type)} {news.type}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(news.createdAt).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-8 leading-tight">
                                {news.title}
                            </h1>

                            <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-serif prose-a:text-amber-500">
                                <ReactMarkdown>{news.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
