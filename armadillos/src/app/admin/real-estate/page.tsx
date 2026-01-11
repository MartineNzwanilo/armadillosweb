"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Building2, Plus, Search, Filter, MapPin, BedDouble, Bath, Square, Edit, Trash, ArrowUpRight, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContent, deleteProject, updateContent, API_Base } from "@/lib/cms";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function RealEstateAdmin() {
    const [listings, setListings] = useState<any[]>([]);
    const [pageContent, setPageContent] = useState<any>({ hero: { title: "", highlight: "", subtitle: "", image: "" } });
    const [loading, setLoading] = useState(true);
    const [savingContent, setSavingContent] = useState(false);
    const [activeTab, setActiveTab] = useState("listings");

    useEffect(() => {
        getContent().then(content => {
            // @ts-ignore
            setListings(content.real_estate_listings || []);
            // @ts-ignore
            if (content.real_estate_page) {
                // @ts-ignore
                setPageContent(content.real_estate_page);
            }
            setLoading(false);
        });
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this property?")) return;
        setLoading(true);
        const success = await deleteProject(id);
        if (success) {
            setListings(listings.filter(l => l.id !== id));
        }
        setLoading(false);
    }

    async function handleSaveContent() {
        setSavingContent(true);
        const success = await updateContent('real-estate', {
            hero: pageContent.hero,
            investment_opportunities: pageContent.investment_opportunities
        });
        if (success) {
            toast.success("Page content updated successfully!");
        } else {
            toast.error("Failed to update content.");
        }
        setSavingContent(false);
    }

    const handleHeroChange = (field: string, value: string) => {
        setPageContent((prev: any) => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const handleTierChange = (index: number, field: string, value: any) => {
        const newTiers = [...(pageContent.investment_opportunities || [])];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setPageContent((prev: any) => ({ ...prev, investment_opportunities: newTiers }));
    };

    async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        const toastId = toast.loading("Uploading hero image...");

        try {
            const res = await fetch(`${API_Base}/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                handleHeroChange('image', data.url);
                toast.success("Image uploaded!");
            }
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            toast.dismiss(toastId);
        }
    }


    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading properties...</div>;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Real Estate Portfolio</h1>
                    <p className="text-slate-500">Manage listings and page landing content.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="listings" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
                    <TabsTrigger value="listings">Property Listings</TabsTrigger>
                    <TabsTrigger value="content">Page Content</TabsTrigger>
                </TabsList>

                {/* --- LISTINGS TAB --- */}
                <TabsContent value="listings" className="space-y-6">
                    <div className="flex justify-between items-center bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                            <input
                                placeholder="Search properties..."
                                className="w-full pl-12 pr-4 py-2.5 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
                            />
                        </div>
                        <Link href="/admin/real-estate/new">
                            <Button className="bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20">
                                <Plus className="mr-2" size={18} /> Add Property
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {listings.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No properties found. Add your first listing!</p>
                            </div>
                        )}
                        {listings.map((item, i) => (
                            <motion.div variants={itemVariant} key={item.id || i} className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-2 hover:border-amber-500/50 transition-all flex flex-col md:flex-row gap-4 md:gap-6 shadow-sm hover:shadow-xl hover:shadow-black/5">
                                {/* Image Section */}
                                <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                                    {item.gallery?.[0] ? (
                                        <img src={item.gallery[0] || ""} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-700">
                                            <Building2 size={48} className="opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 flex flex-col justify-between py-2 pr-4 pl-2 md:pl-0">
                                    <div>
                                        <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-2">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{item.title}</h3>
                                            <div className="text-xl font-bold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg">
                                                {typeof item.price === 'number' ? `Tsh. ${item.price.toLocaleString()}` : item.price}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-slate-500 text-sm mb-6">
                                            <MapPin size={16} className="mr-1 text-amber-500" /> {item.location?.address || "No Address"}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 max-w-sm mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-[10px] uppercase font-bold">Area</span>
                                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
                                                    <Square size={14} className="text-amber-500" /> {item.stats?.sqft}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-[10px] uppercase font-bold">Bedrooms</span>
                                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
                                                    <BedDouble size={14} className="text-amber-500" /> {item.stats?.beds}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-[10px] uppercase font-bold">Bathrooms</span>
                                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
                                                    <Bath size={14} className="text-amber-500" /> {item.stats?.baths}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                            {item.features?.slice(0, 3).map((f: string, idx: number) => (
                                                <span key={idx} className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-medium border border-slate-100 dark:border-white/5">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Link href={`/admin/real-estate/${item.id}`} className="w-full md:w-auto">
                                                <Button size="sm" variant="ghost" className="w-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500">
                                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1 md:flex-none border border-slate-200 dark:border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 text-slate-500"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* --- CONTENT TAB --- */}
                <TabsContent value="content" className="space-y-6">
                    <div className="flex justify-between items-center bg-amber-500/10 p-6 rounded-3xl mb-6 border border-amber-500/20">
                        <div>
                            <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">Public Page Content</h2>
                            <p className="text-amber-700/60 dark:text-amber-400/60">Customize the Hero Section of /real-estate</p>
                        </div>
                        <Button
                            onClick={handleSaveContent}
                            disabled={savingContent}
                            className="bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20"
                        >
                            {savingContent ? "Saving..." : <><Save size={18} className="mr-2" /> Publish Changes</>}
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
                        <h3 className="text-lg font-bold mb-4 font-serif">Hero Section Configuration</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Page Title</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:outline-none"
                                    value={pageContent.hero?.title || ""}
                                    onChange={(e) => handleHeroChange('title', e.target.value)}
                                    placeholder="e.g. Premium Real Estate"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Highlight Text (Amber Color)</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:outline-none"
                                        value={pageContent.hero?.highlight || ""}
                                        onChange={(e) => handleHeroChange('highlight', e.target.value)}
                                        placeholder="e.g. Real Estate"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Hero Image</label>
                                    <div className="flex gap-2 items-center">
                                        {pageContent.hero?.image && (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                <img src={pageContent.hero.image} alt="Hero" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <label className="cursor-pointer flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-amber-500 transition-all">
                                            <Upload size={16} /> <span className="text-sm">Upload New Image</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Subtitle / Description</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:outline-none resize-none"
                                    rows={3}
                                    value={pageContent.hero?.subtitle || ""}
                                    onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                                    placeholder="Brief description appearing below the title..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
                        <h3 className="text-lg font-bold mb-4 font-serif">Investment Opportunities</h3>
                        <p className="text-sm text-slate-500 mb-4">Edit the 3 featured investment categories displayed on the page.</p>

                        {(pageContent.investment_opportunities || []).map((tier: any, idx: number) => (
                            <div key={idx} className="border border-slate-200 dark:border-white/10 rounded-2xl p-6 bg-slate-50/50 dark:bg-white/5 relative">
                                <div className="absolute top-4 right-4 text-xs font-mono text-slate-400">TIER {idx + 1}</div>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                                        <input
                                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm focus:border-amber-500 focus:outline-none"
                                            value={tier.title || ""}
                                            onChange={(e) => handleTierChange(idx, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Price</label>
                                        <input
                                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm focus:border-amber-500 focus:outline-none"
                                            value={tier.price || ""}
                                            onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 mb-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <textarea
                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm resize-none focus:border-amber-500 focus:outline-none"
                                        rows={2}
                                        value={tier.description || ""}
                                        onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1 mb-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Features (comma separated)</label>
                                    <textarea
                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm resize-none focus:border-amber-500 focus:outline-none"
                                        rows={2}
                                        value={tier.features?.join(', ') || ""}
                                        onChange={(e) => handleTierChange(idx, 'features', e.target.value.split(',').map((s: string) => s.trim()))}
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="space-y-1 flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Icon</label>
                                        <select
                                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm focus:border-amber-500 focus:outline-none"
                                            value={tier.icon || "building"}
                                            onChange={(e) => handleTierChange(idx, 'icon', e.target.value)}
                                        >
                                            <option value="building">Building (Urban)</option>
                                            <option value="key">Key (Luxury)</option>
                                            <option value="crown">Crown (Commercial)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 pt-5">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-amber-500"
                                            checked={tier.popular || false}
                                            onChange={(e) => handleTierChange(idx, 'popular', e.target.checked)}
                                        />
                                        <span className="text-sm font-medium">Highlight Popular</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
