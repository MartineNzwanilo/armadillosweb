"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Sprout, Tractor, Plus, Calendar, Leaf, BarChart3, LayoutTemplate,
    Globe, Activity, Save, ArrowLeft, PenTool, Image as ImageIcon,
    Type, Sparkles, Trash, Upload, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContent, updateContent, createProject, getProjects } from "@/lib/cms";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Label Component
const Label = ({ children, className }: any) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);

export default function AgrobusinessAdmin() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State for Page Content
    const [contentForm, setContentForm] = useState<any>(null);
    const [savingContent, setSavingContent] = useState(false);

    useEffect(() => {
        Promise.all([
            getContent(),
            getProjects('CROP_CYCLE')
        ]).then(([content, projects]) => {
            const agroData = content.agrobusiness || {};
            // Override crops with dynamic data
            setData({ ...agroData, crops: projects || [] });

            // Handle both nested page_content (correct) and flat (legacy/buggy save) structures
            const pageContent = agroData.page_content || agroData;

            setContentForm({
                hero: pageContent.hero || pageContent.page_content?.hero || { title: "", highlight: "", subtitle: "", image: "" },
                intro: pageContent.intro || pageContent.page_content?.intro || { badge: "", title_prefix: "", title_highlight: "", description: "", images: [] },
                features: pageContent.features || pageContent.page_content?.features || []
            });
            setLoading(false);
        });
    }, []);

    // --- Content Management Handlers ---
    const handleContentChange = (section: string, field: string, value: string) => {
        setContentForm((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...contentForm.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setContentForm((prev: any) => ({ ...prev, features: newFeatures }));
    };

    const removeImage = (index: number) => {
        const newImages = contentForm.intro.images.filter((_: any, i: number) => i !== index);
        setContentForm((prev: any) => ({
            ...prev,
            intro: { ...prev.intro, images: newImages }
        }));
    };

    const addFeature = () => {
        setContentForm((prev: any) => ({
            ...prev,
            features: [
                ...prev.features,
                { title: "New Feature", description: "Description here.", icon: "Sprout" }
            ]
        }));
    };

    const removeFeature = (index: number) => {
        const newFeatures = contentForm.features.filter((_: any, i: number) => i !== index);
        setContentForm((prev: any) => ({ ...prev, features: newFeatures }));
    };

    const handleSaveContent = async () => {
        setSavingContent(true);
        // Ensure we maintain the page_content wrapper structure
        const payload = {
            stats: data.stats || {},
            page_content: contentForm
        };

        const success = await updateContent('agrobusiness', payload);

        if (success) {
            toast.success("Content updated successfully!");
            // Reload to reflect changes if needed, though state is local
            // window.location.reload(); 
        } else {
            toast.error("Failed to update content.");
        }
        setSavingContent(false);
    };




    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading management suite...</div>;
    const stats = data.stats || {};
    const crops = data.crops || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Agrobusiness Manager</h1>
                    <p className="text-slate-500">Everything you need to manage the agricultural division.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full md:w-auto md:max-w-[600px] grid-cols-2 mb-8 mx-0">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="content">Manage Site Content</TabsTrigger>
                </TabsList>

                {/* --- DASHBOARD TAB --- */}
                <TabsContent value="dashboard" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Stats */}
                    {/* ... Stats blocks ... */}

                    {/* List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sprout className="text-green-500" /> Current Cycles
                            </h2>
                            <Link href="/admin/agrobusiness/new">
                                <Button size="sm" variant="ghost" className="text-green-600">
                                    <Plus size={16} className="mr-2" /> Add New
                                </Button>
                            </Link>
                        </div>
                        <div className="grid gap-4">
                            {crops.map((crop: any, i: number) => (
                                <div key={i} className="flex flex-col md:flex-row items-start md:items-center p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/5 group">
                                    <div className="w-full md:w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 flex items-center justify-center mb-4 md:mb-0 mr-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <Sprout size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-500 transition-colors">{crop.name}</h3>
                                        <div className="flex flex-wrap items-center text-slate-500 text-sm gap-4 mt-1">
                                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md"><Calendar size={12} /> {crop.season}</span>
                                            <span className="text-slate-300 hidden md:inline">|</span>
                                            <span>Export Market: <span className="text-slate-700 dark:text-slate-300 font-medium">{crop.market}</span></span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${crop.status === 'Harvesting' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                                            {crop.status}
                                        </span>
                                        <Link href={`/admin/agrobusiness/${crop.id}`}>
                                            <Button size="sm" variant="outline">Manage</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* --- CONTENT MANAGEMENT TAB --- */}
                <TabsContent value="content" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-green-800 dark:text-green-300">Public Page Content</h2>
                            <p className="text-green-700/60 dark:text-green-400/60">Edit what users see on /agrobusiness</p>
                        </div>
                        <Button
                            onClick={handleSaveContent}
                            disabled={savingContent}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                        >
                            {savingContent ? "Creating..." : <><Save size={18} className="mr-2" /> Publish to Live Site</>}
                        </Button>
                    </div>

                    <Tabs defaultValue="hero" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                            <TabsTrigger value="hero" className="rounded-lg">Hero Section</TabsTrigger>
                            <TabsTrigger value="intro" className="rounded-lg">Intro & Stats</TabsTrigger>
                            <TabsTrigger value="features" className="rounded-lg">Features</TabsTrigger>
                        </TabsList>

                        <TabsContent value="hero" className="space-y-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
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
                                                <label className="cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-green-500 dark:hover:border-green-500 text-slate-500 hover:text-green-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                                                    <Upload size={16} /> <span className="text-sm font-semibold">Upload New</span>
                                                    <input type="file" accept="image/*" className="hidden"
                                                        onChange={async (e) => {
                                                            if (e.target.files?.[0]) {
                                                                const file = e.target.files[0];
                                                                const formData = new FormData();
                                                                formData.append('file', file);

                                                                const loadingToast = toast.loading("Uploading hero image...");

                                                                try {
                                                                    const res = await fetch(`http://localhost:3005/api/v1/upload`, {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    });

                                                                    if (res.ok) {
                                                                        const data = await res.json();
                                                                        if (data.url) {
                                                                            handleContentChange('hero', 'image', data.url);
                                                                            toast.success("Hero image uploaded");
                                                                        }
                                                                    } else {
                                                                        toast.error("Upload failed");
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    toast.error("Error uploading image");
                                                                } finally {
                                                                    toast.dismiss(loadingToast);
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
                        </TabsContent>

                        <TabsContent value="intro" className="space-y-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Badge Text</Label>
                                        <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.intro.badge} onChange={(e) => handleContentChange('intro', 'badge', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Title Prefix</Label>
                                        <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.intro.title_prefix} onChange={(e) => handleContentChange('intro', 'title_prefix', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Title Highlight</Label>
                                        <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.intro.title_highlight} onChange={(e) => handleContentChange('intro', 'title_highlight', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={4} value={contentForm.intro.description} onChange={(e) => handleContentChange('intro', 'description', e.target.value)} />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-green-600">Slideshow Images</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {contentForm.intro.images.map((img: string, idx: number) => (
                                            <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button variant="ghost" size="icon" onClick={() => removeImage(idx)} className="text-white hover:bg-red-500/80 rounded-full bg-black/20 backdrop-blur-sm">
                                                        <Trash size={18} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="cursor-pointer group relative aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-green-500 transition-all">
                                            <input type="file" multiple accept="image/*" className="hidden"
                                                onChange={async (e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const files = Array.from(e.target.files);
                                                        const uploadedUrls: string[] = [];

                                                        // Show loading state if possible, or just toast start
                                                        const loadingToast = toast.loading("Uploading images...");

                                                        try {
                                                            for (const file of files) {
                                                                const formData = new FormData();
                                                                formData.append('file', file);

                                                                const res = await fetch(`http://localhost:3005/api/v1/upload`, {
                                                                    method: 'POST',
                                                                    body: formData
                                                                });

                                                                if (res.ok) {
                                                                    const data = await res.json();
                                                                    if (data.url) {
                                                                        // Ensure path is relative or absolute as needed by the app
                                                                        // The backend likely returns /uploads/filename.ext
                                                                        uploadedUrls.push(data.url);
                                                                    }
                                                                }
                                                            }

                                                            if (uploadedUrls.length > 0) {
                                                                setContentForm((prev: any) => ({
                                                                    ...prev,
                                                                    intro: {
                                                                        ...prev.intro,
                                                                        images: [...prev.intro.images, ...uploadedUrls]
                                                                    }
                                                                }));
                                                                toast.success(`Successfully uploaded ${uploadedUrls.length} images`);
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload failed", err);
                                                            toast.error("Failed to upload some images");
                                                        } finally {
                                                            toast.dismiss(loadingToast);
                                                        }
                                                    }
                                                }}
                                            />
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-green-100 flex items-center justify-center"><Upload size={20} /></div>
                                            <span className="text-xs font-semibold">Upload</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-6">
                            <div className="flex justify-end">
                                <Button onClick={addFeature} className="bg-green-600/10 text-green-600 hover:bg-green-600/20 border-green-600/20"><Plus size={16} className="mr-2" /> Add Feature</Button>
                            </div>
                            <div className="grid gap-6">
                                {contentForm.features.map((feature: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex gap-6 items-start relative group">
                                        <Button variant="ghost" size="icon" onClick={() => removeFeature(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={18} /></Button>
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 shrink-0"><Sparkles size={24} /></div>
                                        <div className="flex-1 space-y-4 pr-8">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label>Title</Label><input className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20" value={feature.title} onChange={(e) => handleFeatureChange(i, 'title', e.target.value)} /></div>
                                                <div className="space-y-2"><Label>Icon</Label><input className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20" value={feature.icon} onChange={(e) => handleFeatureChange(i, 'icon', e.target.value)} /></div>
                                            </div>
                                            <div className="space-y-2"><Label>Description</Label><textarea className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 resize-none" rows={2} value={feature.description} onChange={(e) => handleFeatureChange(i, 'description', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>


            </Tabs>
        </motion.div>
    );
}
