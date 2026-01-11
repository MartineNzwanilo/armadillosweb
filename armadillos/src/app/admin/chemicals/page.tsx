"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FlaskConical, TrendingUp, Plus, MapPin, ShieldCheck, Box,
    LayoutTemplate, PenTool, Image as ImageIcon, Type, Sparkles,
    Trash, Upload, Save, Factory, Truck, Beaker, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContent, updateContent, getProjects } from "@/lib/cms";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock Label
const Label = ({ children, className }: any) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);

export default function ChemicalsAdmin() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Content Form State
    const [contentForm, setContentForm] = useState<any>(null);
    const [savingContent, setSavingContent] = useState(false);

    useEffect(() => {
        Promise.all([
            getContent(),
            getProjects('SHIPMENT')
        ]).then(([content, projects]) => {
            const chemData = content.chemicals || {};
            // Override projects with dynamic data
            setData({ ...chemData, projects: projects || [] });

            // Handle both nested page_content (correct) and flat (legacy/buggy save) structures
            const pageContent = chemData.page_content || chemData;

            setContentForm({
                hero: pageContent.hero || pageContent.page_content?.hero || { title: "", highlight: "", subtitle: "", image: "" },
                slides: pageContent.slides || pageContent.page_content?.slides || [],
                features: pageContent.features || pageContent.page_content?.features || []
            });
            setLoading(false);
        });
    }, []);

    // --- Content Handlers ---
    const handleContentChange = (section: string, field: string, value: string) => {
        setContentForm((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleSlideChange = (index: number, field: string, value: string) => {
        const newSlides = [...contentForm.slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setContentForm((prev: any) => ({ ...prev, slides: newSlides }));
    };

    const handleSaveContent = async () => {
        setSavingContent(true);
        // Ensure strictly nested page_content structure
        const payload = {
            stats: data.stats || {},
            page_content: contentForm
        };

        const success = await updateContent('chemicals', payload);

        if (success) {
            toast.success("Content updated successfully!");
        } else {
            toast.error("Failed to update content.");
        }
        setSavingContent(false);
    };


    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading chemicals data...</div>;

    const stats = data.stats || {};
    const projects = data.projects || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Chemical Logistics</h1>
                    <p className="text-slate-500">Import/Export tracking and hazardous material safety.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full md:w-auto md:max-w-[600px] grid-cols-2 mb-8 mx-0">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="content">Manage Site Content</TabsTrigger>
                </TabsList>

                {/* --- DASHBOARD --- */}
                <TabsContent value="dashboard" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-amber-500/30 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FlaskConical size={80} /></div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700" />
                            <div className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldCheck size={14} /> Safety Compliance</div>
                            <div className="text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">{stats.compliance_score}</div>
                            <div className="text-xs text-slate-500">ISO 9001 Certified</div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Monthly Tonnage</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.tonnage_shipped}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[70%]" /></div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Orders</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.active_orders}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[45%]" /></div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Partner Mines</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.clients}</div>
                            <div className="text-xs text-green-500 mt-2 flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" /> Supply Chain Stable</div>
                        </div>
                    </div>

                    {/* Shipments */}
                    <div>
                        <div className="flex justify-between items-center mb-4 pl-1 border-l-4 border-amber-500 ml-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Shipments</h2>
                            <Link href="/admin/chemicals/new">
                                <Button size="sm" variant="ghost" className="text-amber-600">
                                    <Plus size={16} className="mr-2" /> Add New
                                </Button>
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {projects.map((project: any, i: number) => (
                                <div key={i} className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col sm:flex-row hover:shadow-2xl hover:shadow-black/20">
                                    <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-slate-800 flex items-center justify-center">
                                        <Box className="text-white/20" size={40} />
                                        <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${project.stock === 'Delayed' ? 'bg-red-500 animate-pulse' : project.stock?.includes('Transit') ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{project.name}</h3></div>
                                            <div className="flex items-center text-slate-500 text-sm mb-4"><MapPin size={14} className="mr-1 text-amber-500" /> {project.details?.location || 'Unknown'}</div>
                                            <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Volume</div>
                                                <div className="font-mono font-bold text-slate-900 dark:text-white">{project.details?.yield || '--'}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <span className={`text-xs font-bold uppercase ${project.stock?.includes('Transit') ? 'text-amber-500' : 'text-green-500'}`}>{project.stock}</span>
                                            <Link href={`/admin/chemicals/${project.id}`}>
                                                <Button size="sm" variant="ghost" className="hover:text-amber-500 hover:bg-amber-500/10">Manage</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* --- CONTENT MANAGER --- */}
                <TabsContent value="content" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">Public Page Content</h2>
                            <p className="text-amber-700/60 dark:text-amber-400/60">Edit what users see on /chemicals</p>
                        </div>
                        <Button
                            onClick={handleSaveContent}
                            disabled={savingContent}
                            className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20"
                        >
                            {savingContent ? "Publishing..." : <><Save size={18} className="mr-2" /> Publish Changes</>}
                        </Button>
                    </div>

                    <div className="grid gap-8">
                        {/* Hero Section */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                            <h3 className="font-bold flex items-center gap-2"><LayoutTemplate size={16} /> Hero Configuration</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.hero.title} onChange={(e) => handleContentChange('hero', 'title', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Highlight Word</Label>
                                        <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.hero.highlight} onChange={(e) => handleContentChange('hero', 'highlight', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hero Image</Label>
                                        <div className="flex gap-4 items-center">
                                            {contentForm.hero.image && (
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 group">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={contentForm.hero.image} alt="Hero" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <label className="cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500 dark:hover:border-amber-500 text-slate-500 hover:text-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                                                <Upload size={16} /> <span className="text-sm font-semibold">Upload New</span>
                                                <input type="file" accept="image/*" className="hidden"
                                                    onChange={async (e) => {
                                                        if (e.target.files?.[0]) {
                                                            const file = e.target.files[0];
                                                            const formData = new FormData();
                                                            formData.append('file', file);
                                                            const toastId = toast.loading("Uploading...");

                                                            try {
                                                                const res = await fetch('http://localhost:3005/api/v1/upload', {
                                                                    method: 'POST',
                                                                    body: formData
                                                                });
                                                                if (res.ok) {
                                                                    const data = await res.json();
                                                                    handleContentChange('hero', 'image', data.url);
                                                                    toast.success("Uploaded!");
                                                                } else {
                                                                    toast.error("Upload failed");
                                                                }
                                                            } catch (err) {
                                                                toast.error("Error uploading");
                                                            } finally {
                                                                toast.dismiss(toastId);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={3} value={contentForm.hero.subtitle} onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Slides Config */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 px-2"><Sparkles size={16} /> Feature Slides (Carousel)</h3>
                                <Button size="sm" variant="outline" onClick={() => {
                                    setContentForm((prev: any) => ({
                                        ...prev,
                                        slides: [...prev.slides, { title: "New Slide", description: "", stat: "", statLabel: "", image: "" }]
                                    }));
                                }}>
                                    <Plus size={14} className="mr-2" /> Add Slide
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {contentForm.slides.map((slide: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4 relative group/slide">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                                            <span className="font-bold text-sm text-slate-500 uppercase">Slide {i + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <Upload size={12} /> {slide.image ? "Change" : "Add Img"}
                                                    <input type="file" accept="image/*" className="hidden"
                                                        onChange={async (e) => {
                                                            if (e.target.files?.[0]) {
                                                                const file = e.target.files[0];
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                const toastId = toast.loading("Uploading slide image...");

                                                                try {
                                                                    const res = await fetch('http://localhost:3005/api/v1/upload', {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    });
                                                                    if (res.ok) {
                                                                        const data = await res.json();
                                                                        handleSlideChange(i, 'image', data.url);
                                                                        toast.success("Done");
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                } finally {
                                                                    toast.dismiss(toastId);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => {
                                                    setContentForm((prev: any) => ({
                                                        ...prev,
                                                        slides: prev.slides.filter((_: any, idx: number) => idx !== i)
                                                    }));
                                                }}>
                                                    <Trash size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                        {slide.image && (
                                            <div className="w-full h-24 rounded-lg bg-slate-100 overflow-hidden relative group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={slide.image} className="w-full h-full object-cover" alt="Slide" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Button variant="ghost" size="sm" className="text-white h-auto p-1" onClick={() => handleSlideChange(i, 'image', '')}>Remove</Button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2"><Label>Title</Label><input className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/20 text-sm" value={slide.title} onChange={(e) => handleSlideChange(i, 'title', e.target.value)} /></div>
                                        <div className="space-y-2"><Label>Description</Label><textarea className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/20 text-sm resize-none" rows={3} value={slide.description} onChange={(e) => handleSlideChange(i, 'description', e.target.value)} /></div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1"><Label>Stat Value</Label><input className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/20 text-sm" value={slide.stat} onChange={(e) => handleSlideChange(i, 'stat', e.target.value)} /></div>
                                            <div className="space-y-1"><Label>Stat Label</Label><input className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/20 text-sm" value={slide.statLabel} onChange={(e) => handleSlideChange(i, 'statLabel', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features Config (Side Cards) */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold flex items-center gap-2"><LayoutTemplate size={16} /> Side Features</h3>
                                    <p className="text-xs text-slate-500">Cards displayed next to the main slideshow.</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => {
                                    setContentForm((prev: any) => ({
                                        ...prev,
                                        features: [...prev.features, { title: "New Feature", description: "", icon: "Factory" }]
                                    }));
                                }}>
                                    <Plus size={14} className="mr-2" /> Add Feature
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {contentForm.features.map((feature: any, i: number) => (
                                    <div key={i} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                            onClick={() => {
                                                setContentForm((prev: any) => ({
                                                    ...prev,
                                                    features: prev.features.filter((_: any, idx: number) => idx !== i)
                                                }));
                                            }}
                                        >
                                            <Trash size={14} />
                                        </Button>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Title</Label>
                                                <input
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm"
                                                    value={feature.title}
                                                    onChange={(e) => {
                                                        const newFeatures = [...contentForm.features];
                                                        newFeatures[i].title = e.target.value;
                                                        setContentForm((prev: any) => ({ ...prev, features: newFeatures }));
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <textarea
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm resize-none"
                                                    rows={2}
                                                    value={feature.description}
                                                    onChange={(e) => {
                                                        const newFeatures = [...contentForm.features];
                                                        newFeatures[i].description = e.target.value;
                                                        setContentForm((prev: any) => ({ ...prev, features: newFeatures }));
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Icon Name</Label>
                                                <select
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm"
                                                    value={feature.icon}
                                                    onChange={(e) => {
                                                        const newFeatures = [...contentForm.features];
                                                        newFeatures[i].icon = e.target.value;
                                                        setContentForm((prev: any) => ({ ...prev, features: newFeatures }));
                                                    }}
                                                >
                                                    <option value="FlaskConical">Flask</option>
                                                    <option value="Beaker">Beaker</option>
                                                    <option value="Factory">Factory</option>
                                                    <option value="ShieldCheck">Shield</option>
                                                    <option value="Truck">Truck</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
