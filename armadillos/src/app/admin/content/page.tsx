"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Globe, LayoutTemplate, Search, Layers, Users, Pickaxe, User, Anchor, Sprout, FlaskConical, Zap, Building2, Wifi, WifiOff, Upload, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { getContent, updateContent, saveSettings, getPartners, addPartner, deletePartner, API_Base, checkConnection, type SiteContent } from "@/lib/cms";
import { toast } from "sonner";

export default function ContentManager() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);

    useEffect(() => {
        checkConnection().then(setDbConnected);
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await getContent();
            setContent(data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load content.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!content) return;
        setSaving(true);
        try {
            // Save Settings (Identity, Contact, Footer)
            const settingsSaved = await saveSettings(
                {
                    identity: content.identity,
                    contact: content.contact,
                    footer: content.footer
                },
                content.locations || []
            );

            // Save Home Page Content
            const homeSaved = await updateContent('home', content.home);

            // Save Other Pages
            const agroSaved = await updateContent('agrobusiness', content.agrobusiness.page_content);
            const chemSaved = await updateContent('chemicals', content.chemicals.page_content);
            const elutionSaved = await updateContent('elution', content.elution.page_content);

            if (settingsSaved && homeSaved && agroSaved && chemSaved && elutionSaved) {
                toast.success("All changes saved successfully!");
            } else {
                toast.error("Save failed. Please check your login status or connection.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    }

    function updateField(section: keyof SiteContent, sub: string, field: string, value: any) {
        if (!content) return;
        const newContent = JSON.parse(JSON.stringify(content));
        if (sub) {
            // @ts-ignore
            newContent[section][sub][field] = value;
        } else {
            // @ts-ignore
            newContent[section][field] = value;
        }
        setContent(newContent);
    }

    function updateArray(section: string, field: string, index: number, value: string) {
        if (!content) return;
        const newContent = JSON.parse(JSON.stringify(content));
        // @ts-ignore
        newContent[section][field][index] = value;
        setContent(newContent);
    }

    // Generic Helper for deep updates
    const updateDeep = (path: string[], value: any) => {
        if (!content) return;
        const newContent = JSON.parse(JSON.stringify(content));
        let current = newContent;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setContent(newContent);
    };


    if (loading) return <div className="p-8 text-center text-slate-500">Loading content...</div>;
    if (!content) return <div className="p-8 text-center text-red-500">Failed to load content.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            {/* Header with Glass Effect */}
            <div className="sticky top-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">CMS Manager</h1>
                        <p className="text-xs text-slate-500">Global content control center.</p>
                    </div>
                    {/* DB Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${dbConnected === null ? 'bg-slate-100 text-slate-500 border-slate-200' :
                        dbConnected ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                            'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }`}>
                        {dbConnected === null ? <Loader2 className="w-3 h-3 animate-spin" /> :
                            dbConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {dbConnected === null ? 'Connecting...' : dbConnected ? 'Backend Connected' : 'Backend Disconnected'}
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20"
                >
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                    {saving ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            <Tabs defaultValue="identity" className="w-full space-y-8">
                <TabsList className="w-full p-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl flex-wrap justify-start gap-2 shadow-sm">
                    {/* Core Identiy */}
                    <TabsTrigger value="identity" className="flex-1 min-w-[120px] data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600">
                        <Globe className="mr-2 w-4 h-4" /> Identity
                    </TabsTrigger>


                    {/* Home Page Sections */}
                    <TabsTrigger value="hero" className="flex-1 min-w-[120px] data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-600">
                        <LayoutTemplate className="mr-2 w-4 h-4" /> Home Hero
                    </TabsTrigger>
                    <TabsTrigger value="sectors" className="flex-1 min-w-[120px] data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-600">
                        <Layers className="mr-2 w-4 h-4" /> Service Cards
                    </TabsTrigger>

                    {/* Business Verticals */}
                    <TabsTrigger value="mining" className="flex-1 min-w-[120px] data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-600">
                        <Pickaxe className="mr-2 w-4 h-4" /> Mining
                    </TabsTrigger>
                    <TabsTrigger value="real_estate" className="flex-1 min-w-[120px] data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-600">
                        <Building2 className="mr-2 w-4 h-4" /> Real Estate
                    </TabsTrigger>
                    <TabsTrigger value="agrobusiness" className="flex-1 min-w-[120px] data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600">
                        <Sprout className="mr-2 w-4 h-4" /> Agro
                    </TabsTrigger>
                    <TabsTrigger value="chemicals" className="flex-1 min-w-[120px] data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-600">
                        <FlaskConical className="mr-2 w-4 h-4" /> Chemicals
                    </TabsTrigger>
                    <TabsTrigger value="elution" className="flex-1 min-w-[120px] data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600">
                        <Zap className="mr-2 w-4 h-4" /> Elution
                    </TabsTrigger>

                    {/* Footer / Meta */}
                    <TabsTrigger value="footer" className="flex-1 min-w-[120px]">
                        <Anchor className="mr-2 w-4 h-4" /> Footer
                    </TabsTrigger>
                    <TabsTrigger value="partners" className="flex-1 min-w-[120px] data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-600">
                        <Users className="mr-2 w-4 h-4" /> Partners
                    </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSave}>
                    {/* Identity Tab */}
                    <TabsContent value="identity">
                        {/* ... (Kept existing Identity UI) ... */}
                        <section className="bg-white dark:bg-slate-950/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-8 shadow-xl">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Globe className="text-blue-500" /> Global Identity</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase text-slate-500">Site Name</label>
                                    <input className="input-field w-full p-4 rounded-xl border bg-slate-50 dark:bg-black/40" value={content.identity.name} onChange={(e) => updateField('identity', '', 'name', e.target.value)} />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Description</label>
                                    <textarea className="input-field w-full p-4 rounded-xl border bg-slate-50 dark:bg-black/40 h-32" value={content.identity.description} onChange={(e) => updateField('identity', '', 'description', e.target.value)} />
                                </div>
                            </div>
                        </section>
                        {/* Contact Info */}
                        <section className="mt-8 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-8">
                            <h2 className="text-xl font-bold flex items-center gap-2"><User className="text-amber-500" /> Contact Information</h2>
                            <div className="grid gap-6">
                                <input className="w-full p-4 rounded-xl border bg-slate-50 dark:bg-black/40" placeholder="HQ Title" value={content.contact.title} onChange={(e) => updateField('contact', '', 'title', e.target.value)} />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Emails (One per line)</label>
                                        <textarea className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-black/40 h-32 font-mono text-sm"
                                            value={content.contact.emails?.join('\n') || ""}
                                            onChange={(e) => updateField('contact', '', 'emails', e.target.value.split('\n'))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Phone Numbers (One per line)</label>
                                        <textarea className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-black/40 h-32 font-mono text-sm"
                                            value={content.contact.phones?.join('\n') || ""}
                                            onChange={(e) => updateField('contact', '', 'phones', e.target.value.split('\n'))}
                                        />
                                    </div>
                                </div>
                                <textarea className="w-full p-4 rounded-xl border bg-slate-50 dark:bg-black/40 h-24" placeholder="Physical Address" value={content.contact.address} onChange={(e) => updateField('contact', '', 'address', e.target.value)} />

                                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                    <h3 className="font-bold flex items-center gap-2"><Globe className="w-4 h-4" /> Social Media Links</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {['facebook', 'twitter', 'linkedin', 'instagram'].map(social => (
                                            <div key={social} className="flex flex-col gap-1">
                                                <label className="text-xs font-bold uppercase text-slate-500">{social}</label>
                                                <input
                                                    className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-black/40 text-sm"
                                                    placeholder={`https://${social}.com/...`}
                                                    // @ts-ignore
                                                    value={content.contact.socials?.[social] || ""}
                                                    onChange={(e) => {
                                                        const newSocials = { ...content.contact.socials, [social]: e.target.value };
                                                        updateField('contact', '', 'socials', newSocials);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </TabsContent>

                    {/* Hero Tab */}
                    <TabsContent value="hero">
                        <div className="grid gap-6">
                            <div className="p-6 bg-white dark:bg-slate-900/50 border rounded-2xl space-y-4">
                                <h3 className="font-bold">Main Banner</h3>
                                <input className="w-full p-3 rounded-lg border bg-transparent" placeholder="Badge" value={content.home.hero.badge} onChange={(e) => updateDeep(['home', 'hero', 'badge'], e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full p-3 rounded-lg border bg-transparent" placeholder="Line 1" value={content.home.hero.title_line_1} onChange={(e) => updateDeep(['home', 'hero', 'title_line_1'], e.target.value)} />
                                    <input className="w-full p-3 rounded-lg border bg-transparent" placeholder="Line 2" value={content.home.hero.title_line_2} onChange={(e) => updateDeep(['home', 'hero', 'title_line_2'], e.target.value)} />
                                </div>
                                <textarea className="w-full p-3 rounded-lg border bg-transparent h-24" placeholder="Description" value={content.home.hero.description} onChange={(e) => updateDeep(['home', 'hero', 'description'], e.target.value)} />
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-slate-500">Background Image</h4>
                                    <div className="flex gap-4 items-center">
                                        {content.home.hero.image && (
                                            <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                                                <img src={content.home.hero.image} alt="Hero" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <label className="cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500 text-slate-500 hover:text-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                                            <Upload size={16} /> <span className="text-sm font-semibold">Upload Image</span>
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
                                                                updateDeep(['home', 'hero', 'image'], data.url);
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
                        </div>
                    </TabsContent>

                    {/* Sectors Tab */}
                    <TabsContent value="sectors">
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* @ts-ignore */}
                                {content.home.sectors?.map((sector: any, i: number) => (
                                    <div key={i} className="p-6 bg-white dark:bg-slate-900/50 border rounded-2xl space-y-4">
                                        <div className="font-mono text-xs text-amber-500 uppercase">{sector.id}</div>
                                        <input className="w-full p-2 border rounded bg-transparent" value={sector.title} onChange={(e) => {
                                            const newSectors = [...content.home.sectors];
                                            newSectors[i].title = e.target.value;
                                            // @ts-ignore
                                            updateDeep(['home', 'sectors'], newSectors);
                                        }} />
                                        <textarea className="w-full p-2 border rounded bg-transparent h-20 text-sm" value={sector.desc} onChange={(e) => {
                                            const newSectors = [...content.home.sectors];
                                            newSectors[i].desc = e.target.value;
                                            // @ts-ignore
                                            updateDeep(['home', 'sectors'], newSectors);
                                        }} />
                                    </div>
                                ))}
                            </div>

                            {/* Partners Management Section */}
                            <div className="p-6 bg-white dark:bg-slate-900/50 border rounded-2xl space-y-6">
                                <h3 className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> Trusted Partners</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(content.home.partners_list || []).map((partner: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 p-3 border rounded-lg bg-slate-50 dark:bg-black/20">
                                            <div className="flex-1 space-y-2">
                                                <input className="w-full p-1 text-sm bg-transparent border-b border-transparent focus:border-amber-500" value={partner.name} onChange={(e) => {
                                                    const newList = [...(content.home.partners_list || [])];
                                                    newList[i] = { ...newList[i], name: e.target.value };
                                                    updateDeep(['home', 'partners_list'], newList);
                                                }} />
                                                <select className="w-full p-1 text-xs bg-transparent text-slate-500" value={partner.icon} onChange={(e) => {
                                                    const newList = [...(content.home.partners_list || [])];
                                                    newList[i] = { ...newList[i], icon: e.target.value };
                                                    updateDeep(['home', 'partners_list'], newList);
                                                }}>
                                                    {["Pickaxe", "Landmark", "Sprout", "Building2", "Globe", "ShieldCheck", "Briefcase", "Gem", "Hexagon"].map(icon => (
                                                        <option key={icon} value={icon}>{icon}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => {
                                                const newList = [...(content.home.partners_list || [])];
                                                newList.splice(i, 1);
                                                updateDeep(['home', 'partners_list'], newList);
                                            }}>
                                                <span className="sr-only">Delete</span>
                                                &times;
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" className="h-20 border-dashed border-2 flex flex-col gap-1 items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/50" onClick={() => {
                                        const newList = [...(content.home.partners_list || [])];
                                        newList.push({ name: "New Partner", icon: "Hexagon" });
                                        updateDeep(['home', 'partners_list'], newList);
                                    }}>
                                        <span className="text-2xl">+</span>
                                        <span className="text-xs">Add Partner</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Mining Tab */}
                    <TabsContent value="mining">
                        <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-slate-900/50 border rounded-2xl space-y-4">
                                <h3 className="font-bold">Mining Home Section</h3>
                                <input className="w-full p-3 border rounded bg-transparent" placeholder="Title" value={content.home.mining_section?.title || ""} onChange={(e) => updateDeep(['home', 'mining_section', 'title'], e.target.value)} />
                                <textarea className="w-full p-3 border rounded bg-transparent h-24" placeholder="Description" value={content.home.mining_section?.description || ""} onChange={(e) => updateDeep(['home', 'mining_section', 'description'], e.target.value)} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Real Estate Tab */}
                    <TabsContent value="real_estate">
                        <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-slate-900/50 border rounded-2xl space-y-4">
                                <h3 className="font-bold">Real Estate Home Section</h3>
                                <input className="w-full p-3 border rounded bg-transparent" placeholder="Title" value={content.home.real_estate_section?.title || ""} onChange={(e) => updateDeep(['home', 'real_estate_section', 'title'], e.target.value)} />
                                <textarea className="w-full p-3 border rounded bg-transparent h-24" placeholder="Description" value={content.home.real_estate_section?.description || ""} onChange={(e) => updateDeep(['home', 'real_estate_section', 'description'], e.target.value)} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Agrobusiness Tab */}
                    <TabsContent value="agrobusiness">
                        <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-slate-900/50 border rounded-2xl space-y-4">
                                <h3 className="font-bold">Agrobusiness Home Section</h3>
                                <input className="w-full p-3 border rounded bg-transparent" placeholder="Title" value={content.home.agrobusiness_section?.title || ""} onChange={(e) => updateDeep(['home', 'agrobusiness_section', 'title'], e.target.value)} />
                                <textarea className="w-full p-3 border rounded bg-transparent h-24" placeholder="Description" value={content.home.agrobusiness_section?.description || ""} onChange={(e) => updateDeep(['home', 'agrobusiness_section', 'description'], e.target.value)} />
                            </div>

                            <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl space-y-4">
                                <h3 className="font-bold text-green-600">Agrobusiness Verified Page Content (Inner)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input className="w-full p-3 border rounded bg-transparent" placeholder="Hero Title" value={content.agrobusiness.page_content?.hero?.title || ""} onChange={(e) => updateDeep(['agrobusiness', 'page_content', 'hero', 'title'], e.target.value)} />
                                    <input className="w-full p-3 border rounded bg-transparent" placeholder="Subtitle" value={content.agrobusiness.page_content?.hero?.subtitle || ""} onChange={(e) => updateDeep(['agrobusiness', 'page_content', 'hero', 'subtitle'], e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Chemicals Tab */}
                    <TabsContent value="chemicals">
                        <div className="space-y-6">
                            <div className="p-6 bg-teal-500/5 border border-teal-500/10 rounded-2xl space-y-4">
                                <h3 className="font-bold text-teal-600">Chemicals Page Content</h3>
                                <input className="w-full p-3 border rounded bg-transparent" placeholder="Hero Title" value={content.chemicals.page_content?.hero?.title || ""} onChange={(e) => updateDeep(['chemicals', 'page_content', 'hero', 'title'], e.target.value)} />
                                <textarea className="w-full p-3 border rounded bg-transparent h-24" placeholder="Hero Subtitle" value={content.chemicals.page_content?.hero?.subtitle || ""} onChange={(e) => updateDeep(['chemicals', 'page_content', 'hero', 'subtitle'], e.target.value)} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Elution Tab */}
                    <TabsContent value="elution">
                        <div className="space-y-6">
                            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-4">
                                <h3 className="font-bold text-indigo-600">Elution Page Content</h3>
                                <input className="w-full p-3 border rounded bg-transparent" placeholder="Hero Title" value={content.elution.page_content?.hero?.title || ""} onChange={(e) => updateDeep(['elution', 'page_content', 'hero', 'title'], e.target.value)} />
                                <textarea className="w-full p-3 border rounded bg-transparent h-24" placeholder="Hero Subtitle" value={content.elution.page_content?.hero?.subtitle || ""} onChange={(e) => updateDeep(['elution', 'page_content', 'hero', 'subtitle'], e.target.value)} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Footer Tab */}
                    <TabsContent value="footer">
                        {/* ... (Kept existing Footer UI) ... */}
                        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-8">
                            {/* ... existing footer content ... */}
                            <h2 className="text-xl font-bold">Footer Content</h2>
                            {/* ... re-insert footer content logic ... */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase text-slate-500">Links</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Quick Links */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold">Quick Links</label>
                                            <input
                                                className="w-1/2 p-1 text-xs border rounded bg-transparent text-right focus:border-amber-500"
                                                placeholder="Title (e.g. Explore)"
                                                value={content.footer.quick_links_title || ""}
                                                onChange={(e) => updateField('footer', '', 'quick_links_title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            {(content.footer.quick_links || []).map((link: any, i: number) => (
                                                <div key={i} className="flex gap-2">
                                                    <input className="flex-1 p-2 border rounded bg-slate-50 dark:bg-black/20 text-sm" placeholder="Label" value={link.label} onChange={(e) => {
                                                        const newList = [...(content.footer.quick_links || [])];
                                                        newList[i] = { ...newList[i], label: e.target.value };
                                                        // @ts-ignore
                                                        updateField('footer', '', 'quick_links', newList);
                                                    }} />
                                                    <input className="flex-1 p-2 border rounded bg-slate-50 dark:bg-black/20 text-sm" placeholder="URL" value={link.url} onChange={(e) => {
                                                        const newList = [...(content.footer.quick_links || [])];
                                                        newList[i] = { ...newList[i], url: e.target.value };
                                                        // @ts-ignore
                                                        updateField('footer', '', 'quick_links', newList);
                                                    }} />
                                                    <Button type="button" variant="ghost" size="icon" className="text-red-500 h-9 w-9" onClick={() => {
                                                        const newList = [...(content.footer.quick_links || [])];
                                                        newList.splice(i, 1);
                                                        // @ts-ignore
                                                        updateField('footer', '', 'quick_links', newList);
                                                    }}>&times;</Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => {
                                                const newList = [...(content.footer.quick_links || [])];
                                                newList.push({ label: "New Link", url: "#" });
                                                // @ts-ignore
                                                updateField('footer', '', 'quick_links', newList);
                                            }}>+ Add Quick Link</Button>
                                        </div>
                                    </div>

                                    {/* Legal Links */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold">Company / Legal Links</label>
                                            <input
                                                className="w-1/2 p-1 text-xs border rounded bg-transparent text-right focus:border-amber-500"
                                                placeholder="Title (e.g. Company)"
                                                value={content.footer.legal_links_title || ""}
                                                onChange={(e) => updateField('footer', '', 'legal_links_title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            {(content.footer.legal_links || []).map((link: any, i: number) => (
                                                <div key={i} className="flex gap-2">
                                                    <input className="flex-1 p-2 border rounded bg-slate-50 dark:bg-black/20 text-sm" placeholder="Label" value={link.label} onChange={(e) => {
                                                        const newList = [...(content.footer.legal_links || [])];
                                                        newList[i] = { ...newList[i], label: e.target.value };
                                                        // @ts-ignore
                                                        updateField('footer', '', 'legal_links', newList);
                                                    }} />
                                                    <input className="flex-1 p-2 border rounded bg-slate-50 dark:bg-black/20 text-sm" placeholder="URL" value={link.url} onChange={(e) => {
                                                        const newList = [...(content.footer.legal_links || [])];
                                                        newList[i] = { ...newList[i], url: e.target.value };
                                                        // @ts-ignore
                                                        updateField('footer', '', 'legal_links', newList);
                                                    }} />
                                                    <Button type="button" variant="ghost" size="icon" className="text-red-500 h-9 w-9" onClick={() => {
                                                        const newList = [...(content.footer.legal_links || [])];
                                                        newList.splice(i, 1);
                                                        // @ts-ignore
                                                        updateField('footer', '', 'legal_links', newList);
                                                    }}>&times;</Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => {
                                                const newList = [...(content.footer.legal_links || [])];
                                                newList.push({ label: "New Link", url: "#" });
                                                // @ts-ignore
                                                updateField('footer', '', 'legal_links', newList);
                                            }}>+ Add Legal Link</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase text-slate-500">Newsletter</label>
                                <input className="w-full p-3 border rounded bg-transparent" value={content.footer.newsletter_title} onChange={(e) => updateField('footer', '', 'newsletter_title', e.target.value)} />
                                <textarea className="w-full p-3 border rounded bg-transparent h-20" value={content.footer.newsletter_desc} onChange={(e) => updateField('footer', '', 'newsletter_desc', e.target.value)} />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase text-slate-500">Copyright</label>
                                <input className="w-full p-3 border rounded bg-transparent" placeholder="Armadillos Company Limited" value={content.footer.copyright_text || ""} onChange={(e) => updateField('footer', '', 'copyright_text', e.target.value)} />
                            </div>
                        </section>
                    </TabsContent>

                    {/* Partners Tab */}
                    <TabsContent value="partners">
                        <PartnersManager />
                    </TabsContent>
                </form>
            </Tabs>
        </div >

        // function Partners import removed
    );
}

function PartnersManager() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("Image"); // Image | Icon
    const [newLogo, setNewLogo] = useState(""); // URL or Icon Name
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        loadPartners();
    }, []);

    async function loadPartners() {
        try {
            const data = await getPartners();
            if (Array.isArray(data)) {
                setPartners(data);
            } else {
                setPartners([]);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to load partners");
            setPartners([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (!newName) return toast.error("Name is required");

        // Validate Image
        if (newType === 'Image' && !file && !newLogo) {
            return toast.error("Please upload an image or provide a URL");
        }

        let logoUrl = newLogo;

        if (newType === 'Image' && file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            try {
                // Upload endpoint remains direct or we add abstraction? Direct is fine for now as it's file upload.
                // But let's use API_Base to be consistent.
                const uploadRes = await fetch(`${API_Base}/upload`, {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                    // Start with prefix if relative
                    logoUrl = `${API_Base.replace('/api/v1', '')}${uploadData.url}`;
                }
            } catch (e) {
                toast.error("File upload failed");
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        try {
            await addPartner(newName, newType, logoUrl);
            toast.success("Partner added");
            setNewName("");
            setNewLogo("");
            setFile(null);
            loadPartners();
        } catch (e) {
            toast.error("Failed to add partner");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        const success = await deletePartner(id);
        if (success) {
            toast.success("Partner deleted");
            loadPartners();
        } else {
            toast.error("Failed to delete");
        }
    }

    return (
        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-amber-500" /> Partners Management</h2>

            {/* List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border bg-slate-50 dark:bg-black/20">
                        <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/10 rounded-lg overflow-hidden">
                            {p.type === 'Image' ? (
                                p.logo ? <img src={p.logo} alt={p.name} className="w-full h-full object-contain" /> : <p className="text-xs text-slate-400">No Image</p>
                            ) : (
                                <div className="text-xs font-mono">{p.logo}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">{p.name}</h4>
                            <p className="text-xs text-slate-500">{p.type}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-500 ml-auto">
                            &times;
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add New */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="font-bold">Add New Partner</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <input className="p-3 rounded-lg border" placeholder="Partner Name" value={newName} onChange={e => setNewName(e.target.value)} />
                    <select className="p-3 rounded-lg border bg-transparent" value={newType} onChange={e => setNewType(e.target.value)}>
                        <option value="Image">Image Upload</option>
                        <option value="Icon">Icon Name</option>
                    </select>
                </div>
                {newType === 'Image' ? (
                    <input type="file" className="w-full p-2 border rounded bg-white" onChange={e => setFile(e.target.files?.[0] || null)} />
                ) : (
                    <input className="w-full p-3 rounded-lg border" placeholder="Icon Name (e.g. Activity)" value={newLogo} onChange={e => setNewLogo(e.target.value)} />
                )}
                <Button onClick={handleAdd} disabled={uploading}>
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : "+ Add Partner"}
                </Button>
            </div>
        </section>
    );
}
