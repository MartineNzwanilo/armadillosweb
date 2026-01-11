"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Pickaxe, TrendingUp, Plus, MapPin, Gauge, Save,
    LayoutTemplate, Image as ImageIcon, Sparkles, Trash, Upload,
    Factory, FlaskConical, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContent, updateContent, getProjects, API_Base } from "@/lib/cms";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Label Component
const Label = ({ children, className }: any) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);

export default function MiningAdmin() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editingStats, setEditingStats] = useState(false);
    const [statsConfig, setStatsConfig] = useState<any>({});

    // Form State for Page Content
    const [contentForm, setContentForm] = useState<any>(null);
    const [savingContent, setSavingContent] = useState(false);

    useEffect(() => {
        Promise.all([
            getContent(),
            getProjects('MINING')
        ]).then(([content, projects]) => {
            const miningData = content.mining || {};
            // Override projects with dynamic data
            setData({ ...miningData, projects: projects || [] });

            // Initialize content form (handling flat/nested structure)
            const pageContent = miningData.page_content || miningData || {};
            setContentForm({
                hero: pageContent.hero || { title: "", highlight: "", subtitle: "", image: "" },
                intro: pageContent.intro || { title: "", description: "", recovery_rate: "", roi: "", images: [] },
                services: pageContent.services || [],
                process: pageContent.process || [
                    "Geological Survey & Exploration",
                    "Open Pit Excavation",
                    "Crushing & Milling",
                    "Chemical Leaching (CIL)",
                    "Smelting & Refining"
                ],
                sustainability: pageContent.sustainability || {
                    title: "Environmental Stewardship",
                    description: "We are committed to zero-harm operations. Our tailings management facilities are built to exceed local regulations, ensuring the safety of the surrounding ecosystem.",
                    stats: [
                        { value: "100%", label: "Water Recycling" },
                        { value: "ISO", label: "Certified Process" }
                    ]
                }
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

    const handleServiceChange = (index: number, field: string, value: string) => {
        const newServices = [...contentForm.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setContentForm((prev: any) => ({ ...prev, services: newServices }));
    };

    const removeImage = (index: number) => {
        const newImages = contentForm.intro.images.filter((_: any, i: number) => i !== index);
        setContentForm((prev: any) => ({
            ...prev,
            intro: { ...prev.intro, images: newImages }
        }));
    };

    const addService = () => {
        setContentForm((prev: any) => ({
            ...prev,
            services: [
                ...prev.services,
                { title: "New Service", description: "Description here.", icon: "Factory" }
            ]
        }));
    };

    const removeService = (index: number) => {
        const newServices = contentForm.services.filter((_: any, i: number) => i !== index);
        setContentForm((prev: any) => ({ ...prev, services: newServices }));
    };

    const handleSaveContent = async () => {
        setSavingContent(true);
        const payload = {
            stats: data.stats || {},
            page_content: contentForm
        };

        const success = await updateContent('mining', payload);

        if (success) {
            toast.success("Content updated successfully!");
        } else {
            toast.error("Failed to update content.");
        }
        setSavingContent(false);
    };

    async function handleUpdateStats() {
        // Save stats specifically, usually preserving other content, but here we update 'mining' overall
        // Best to merge with current contentForm to avoid data loss
        const payload = {
            stats: statsConfig,
            page_content: contentForm
        };
        await updateContent("mining", payload);
        setEditingStats(false);
        window.location.reload();
    }


    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading mining data...</div>;

    const stats = data.stats || {};
    const projects = data.projects || [];

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-6 overflow-x-hidden [&::-webkit-scrollbar]:hidden"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Mining & Operations</h1>
                    <p className="text-slate-500">Manage gold production, projects, and site content.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full md:w-auto md:max-w-[400px] grid-cols-2 mb-8 mx-0">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="content">Page Content</TabsTrigger>
                </TabsList>

                {/* --- DASHBOARD TAB --- */}
                <TabsContent value="dashboard" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Production Overview</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => { setStatsConfig(stats); setEditingStats(true); }}>
                                Edit Stats
                            </Button>
                            <Link href="/admin/mining/new">
                                <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                                    <Plus className="mr-2" size={18} /> New Project
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Editor Dialog */}
                    {editingStats && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
                                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Update Operations Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs text-slate-500">Gold Purity</label><input className="w-full p-2 border rounded bg-transparent dark:border-white/20" value={statsConfig.gold_purity || ''} onChange={e => setStatsConfig({ ...statsConfig, gold_purity: e.target.value })} /></div>
                                    <div><label className="text-xs text-slate-500">Monthly Production</label><input className="w-full p-2 border rounded bg-transparent dark:border-white/20" value={statsConfig.monthly_production || ''} onChange={e => setStatsConfig({ ...statsConfig, monthly_production: e.target.value })} /></div>
                                    <div><label className="text-xs text-slate-500">Total Reserves</label><input className="w-full p-2 border rounded bg-transparent dark:border-white/20" value={statsConfig.total_reserves || ''} onChange={e => setStatsConfig({ ...statsConfig, total_reserves: e.target.value })} /></div>
                                    <div><label className="text-xs text-slate-500">Operational Sites</label><input className="w-full p-2 border rounded bg-transparent dark:border-white/20" value={statsConfig.operational_sites || ''} onChange={e => setStatsConfig({ ...statsConfig, operational_sites: e.target.value })} /></div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button variant="ghost" onClick={() => setEditingStats(false)}>Cancel</Button>
                                    <Button onClick={handleUpdateStats} className="bg-amber-500 text-black hover:bg-amber-600">Save Changes</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Production Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div variants={itemVariant} className="bg-slate-950 text-white p-6 rounded-3xl border border-amber-500/30 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Pickaxe size={80} /></div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700" />
                            <div className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Gauge size={14} /> Purity Grade</div>
                            <div className="text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">{stats.gold_purity}</div>
                            <div className="text-xs text-slate-500">Verified by SGS Lab</div>
                        </motion.div>
                        <motion.div variants={itemVariant} className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Monthly Output</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.monthly_production}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[65%]" /></div>
                        </motion.div>
                        <motion.div variants={itemVariant} className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Proven Reserves</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_reserves}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[80%]" /></div>
                        </motion.div>
                        <motion.div variants={itemVariant} className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Sites</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.operational_sites}</div>
                            <div className="text-xs text-green-500 mt-2 flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" /> All Systems Nominal</div>
                        </motion.div>
                    </div>

                    {/* Projects Grid */}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-6 pl-1 border-l-4 border-amber-500 ml-2">Active Projects</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project: any, i: number) => (
                            <motion.div variants={itemVariant} key={i} className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col sm:flex-row hover:shadow-2xl hover:shadow-black/20">
                                <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-slate-800 flex items-center justify-center">
                                    <Pickaxe className="text-white/20" size={40} />
                                    <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${project.status.includes('Active') ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-blue-500'}`} />
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{project.name}</h3></div>
                                        <div className="flex items-center text-slate-500 text-sm mb-4"><MapPin size={14} className="mr-1 text-amber-500" /> {project.location}</div>
                                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Current Yield</div>
                                            <div className="font-mono font-bold text-slate-900 dark:text-white">{project.yield}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                        <span className={`text-xs font-bold uppercase ${project.status.includes('Active') ? 'text-green-500' : 'text-blue-500'}`}>{project.status}</span>
                                        <Link href={`/admin/mining/${project.id}`}><Button size="sm" variant="ghost" className="hover:text-amber-500 hover:bg-amber-500/10">Manage</Button></Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* --- CONTENT MANAGEMENT TAB --- */}
                <TabsContent value="content" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-amber-500/10 p-6 rounded-3xl mb-6 border border-amber-500/20">
                        <div>
                            <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">Public Page Content</h2>
                            <p className="text-amber-700/60 dark:text-amber-400/60">Edit what users see on /mining</p>
                        </div>
                        <Button
                            onClick={handleSaveContent}
                            disabled={savingContent}
                            className="bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20"
                        >
                            {savingContent ? "Creating..." : <><Save size={18} className="mr-2" /> Publish to Live Site</>}
                        </Button>
                    </div>

                    <Tabs defaultValue="hero" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                            <TabsTrigger value="hero" className="rounded-lg">Hero Section</TabsTrigger>
                            <TabsTrigger value="intro" className="rounded-lg">Intro & Slideshow</TabsTrigger>
                            <TabsTrigger value="services" className="rounded-lg">Services Cards</TabsTrigger>
                            <TabsTrigger value="process" className="rounded-lg">Process & Eco</TabsTrigger>
                        </TabsList>

                        <TabsContent value="hero" className="space-y-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2"><Label>Page Title</Label><input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.hero.title} onChange={(e) => handleContentChange('hero', 'title', e.target.value)} /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Highlight Word</Label><input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.hero.highlight} onChange={(e) => handleContentChange('hero', 'highlight', e.target.value)} /></div>
                                        <div className="space-y-2">
                                            <Label>Hero Image</Label>
                                            <div className="flex gap-4 items-center">
                                                {contentForm.hero.image && (
                                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 group">
                                                        <img src={contentForm.hero.image} alt="Hero" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <label className="cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500 text-slate-500 hover:text-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                                                    <Upload size={16} /> <span className="text-sm font-semibold">Upload</span>
                                                    <input type="file" accept="image/*" className="hidden"
                                                        onChange={async (e) => {
                                                            if (e.target.files?.[0]) {
                                                                const file = e.target.files[0];
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                const toastId = toast.loading("Uploading...");
                                                                try {
                                                                    const res = await fetch(`${API_Base}/upload`, { method: 'POST', body: formData });
                                                                    const data = await res.json();
                                                                    if (data.url) {
                                                                        handleContentChange('hero', 'image', data.url);
                                                                        toast.success("Uploaded!");
                                                                    }
                                                                } catch (err) { toast.error("Upload failed"); }
                                                                finally { toast.dismiss(toastId); }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2"><Label>Subtitle</Label><textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={3} value={contentForm.hero.subtitle} onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)} /></div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="intro" className="space-y-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                                <div className="space-y-2"><Label>Section Title</Label><input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.intro.title} onChange={(e) => handleContentChange('intro', 'title', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Description</Label><textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={4} value={contentForm.intro.description} onChange={(e) => handleContentChange('intro', 'description', e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Recovery Rate (e.g. 98%)</Label><input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.intro.recovery_rate} onChange={(e) => handleContentChange('intro', 'recovery_rate', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>ROI Text (e.g. Consistent ROI)</Label><input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.intro.roi} onChange={(e) => handleContentChange('intro', 'roi', e.target.value)} /></div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-amber-600">Slideshow Images</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {contentForm.intro.images?.map((img: string, idx: number) => (
                                            <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20">
                                                <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button variant="ghost" size="icon" onClick={() => removeImage(idx)} className="text-white hover:bg-red-500/80 rounded-full bg-black/20 backdrop-blur-sm"><Trash size={18} /></Button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="cursor-pointer group relative aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-amber-500 transition-all">
                                            <input type="file" multiple accept="image/*" className="hidden"
                                                onChange={async (e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const files = Array.from(e.target.files);
                                                        const uploadedUrls: string[] = [];
                                                        const toastId = toast.loading("Uploading images...");
                                                        try {
                                                            for (const file of files) {
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                const res = await fetch(`${API_Base}/upload`, { method: 'POST', body: formData });
                                                                const data = await res.json();
                                                                if (data.url) uploadedUrls.push(data.url);
                                                            }
                                                            if (uploadedUrls.length > 0) {
                                                                setContentForm((prev: any) => ({ ...prev, intro: { ...prev.intro, images: [...(prev.intro.images || []), ...uploadedUrls] } }));
                                                                toast.success("Images uploaded");
                                                            }
                                                        } catch (err) { toast.error("Upload failed"); }
                                                        finally { toast.dismiss(toastId); }
                                                    }
                                                }}
                                            />
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-amber-100 flex items-center justify-center"><Upload size={20} /></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="services" className="space-y-6">
                            <div className="flex justify-end"><Button onClick={addService} className="bg-amber-600/10 text-amber-600 hover:bg-amber-600/20 border-amber-600/20"><Plus size={16} className="mr-2" /> Add Service</Button></div>
                            <div className="grid gap-6">
                                {contentForm.services.map((service: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex gap-6 items-start relative group">
                                        <Button variant="ghost" size="icon" onClick={() => removeService(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={18} /></Button>
                                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 shrink-0"><PenTool size={24} /></div>
                                        <div className="flex-1 space-y-4 pr-8">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label>Title</Label><input className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20" value={service.title} onChange={(e) => handleServiceChange(i, 'title', e.target.value)} /></div>
                                                <div className="space-y-2"><Label>Icon</Label><input className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20" value={service.icon} onChange={(e) => handleServiceChange(i, 'icon', e.target.value)} /></div>
                                            </div>
                                            <div className="space-y-2"><Label>Description</Label><textarea className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 resize-none" rows={2} value={service.description} onChange={(e) => handleServiceChange(i, 'description', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="process" className="space-y-8">
                            {/* Extraction Process Section */}
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold">Extraction Process Steps</h3>
                                    <Button onClick={() => setContentForm((prev: any) => ({ ...prev, process: [...prev.process, "New Step"] }))} size="sm" variant="outline"><Plus size={16} className="mr-2" /> Add Step</Button>
                                </div>
                                <div className="space-y-3">
                                    {contentForm.process.map((step: string, i: number) => (
                                        <div key={i} className="flex gap-2">
                                            <div className="w-8 h-10 flex items-center justify-center font-bold text-slate-400 bg-slate-100 dark:bg-white/5 rounded-lg shrink-0">{i + 1}</div>
                                            <input
                                                className="flex-1 px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
                                                value={step}
                                                onChange={(e) => {
                                                    const newProcess = [...contentForm.process];
                                                    newProcess[i] = e.target.value;
                                                    setContentForm((prev: any) => ({ ...prev, process: newProcess }));
                                                }}
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => {
                                                const newProcess = contentForm.process.filter((_: any, idx: number) => idx !== i);
                                                setContentForm((prev: any) => ({ ...prev, process: newProcess }));
                                            }}><Trash size={16} className="text-red-400" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Environmental Stewardship Section */}
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">
                                <h3 className="text-lg font-bold text-green-600">Environmental Stewardship</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2"><Label>Section Title</Label><input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10" value={contentForm.sustainability.title} onChange={(e) => handleContentChange('sustainability', 'title', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Description</Label><textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={3} value={contentForm.sustainability.description} onChange={(e) => handleContentChange('sustainability', 'description', e.target.value)} /></div>

                                    <div className="space-y-2 pt-4">
                                        <Label>Key Stats</Label>
                                        <div className="grid gap-4">
                                            {contentForm.sustainability.stats.map((stat: any, i: number) => (
                                                <div key={i} className="grid grid-cols-2 gap-4 bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                                                    <div className="space-y-1"><Label className="text-xs">Value (e.g. 100%)</Label><input className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10" value={stat.value} onChange={(e) => {
                                                        const newStats = [...contentForm.sustainability.stats];
                                                        newStats[i] = { ...newStats[i], value: e.target.value };
                                                        setContentForm((prev: any) => ({ ...prev, sustainability: { ...prev.sustainability, stats: newStats } }));
                                                    }} /></div>
                                                    <div className="space-y-1"><Label className="text-xs">Label (e.g. Water Recycling)</Label><input className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10" value={stat.label} onChange={(e) => {
                                                        const newStats = [...contentForm.sustainability.stats];
                                                        newStats[i] = { ...newStats[i], label: e.target.value };
                                                        setContentForm((prev: any) => ({ ...prev, sustainability: { ...prev.sustainability, stats: newStats } }));
                                                    }} /></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
