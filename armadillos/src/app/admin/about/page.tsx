"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    LayoutTemplate, Info, Target, Eye, Plus, Trash,
    Save, Upload, Image as ImageIcon, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContent, updateContent } from "@/lib/cms";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Mock Label
const Label = ({ children, className }: any) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);

export default function AboutAdmin() {
    const [activeTab, setActiveTab] = useState("hero");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        hero: { title: "", subtitle: "", image: "" },
        mission: { title: "", description: "", list: [] as string[] },
        vision: { title: "", description: "" },
        values: [] as any[]
    });

    useEffect(() => {
        getContent().then(data => {
            if (data?.about?.page_content) {
                setForm({
                    hero: data.about.page_content.hero || { title: "", subtitle: "", image: "" },
                    mission: data.about.page_content.mission || { title: "", description: "", list: ["Quality"] },
                    vision: data.about.page_content.vision || { title: "", description: "" },
                    values: data.about.page_content.values || []
                });
            }
            setLoading(false);
        });
    }, []);

    const handleChange = (section: string, field: string, value: any) => {
        setForm(prev => ({
            ...prev,
            [section]: { ...(prev as any)[section], [field]: value }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        const success = await updateContent('about', { page_content: form });
        if (success) toast.success("About page updated successfully!");
        else toast.error("Failed to update.");
        setSaving(false);
    };

    if (loading) return <div className="p-12 text-center animate-pulse">Loading content...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto space-y-8 pb-20"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">About Us Page</h1>
                    <p className="text-slate-500">Manage company story, mission, and values.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white">
                    {saving ? "Saving..." : <><Save size={18} className="mr-2" /> Publish Changes</>}
                </Button>
            </div>

            <Tabs defaultValue="hero" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-8">
                    <TabsTrigger value="hero" className="rounded-lg">Hero Section</TabsTrigger>
                    <TabsTrigger value="mission" className="rounded-lg">Mission & Vision</TabsTrigger>
                    <TabsTrigger value="values" className="rounded-lg">Core Values</TabsTrigger>
                </TabsList>

                {/* --- HERO EDIT --- */}
                <TabsContent value="hero" className="space-y-6">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl space-y-6">
                        <h3 className="font-bold flex items-center gap-2"><LayoutTemplate size={20} /> Hero Banner</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Main Title</Label>
                                <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
                                    value={form.hero.title} onChange={e => handleChange('hero', 'title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle / Slogan</Label>
                                <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={3}
                                    value={form.hero.subtitle} onChange={e => handleChange('hero', 'subtitle', e.target.value)} />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Background Image</Label>
                                <div className="flex gap-4 items-center">
                                    {form.hero.image && (
                                        <div className="w-32 h-20 rounded-lg overflow-hidden relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={form.hero.image} className="w-full h-full object-cover" alt="Hero" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-slate-100 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-200 transition-colors">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                            <Upload size={16} /> Upload Image
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                                const fd = new FormData();
                                                fd.append('file', e.target.files[0]);
                                                const toastId = toast.loading("Uploading...");
                                                const res = await fetch('http://localhost:3005/api/v1/upload', { method: 'POST', body: fd });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    handleChange('hero', 'image', data.url);
                                                    toast.success("Uploaded!");
                                                }
                                                toast.dismiss(toastId);
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- MISSION/VISION EDIT --- */}
                <TabsContent value="mission" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* MISSION */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-amber-500"><Target size={20} /> Mission</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
                                        value={form.mission.title} onChange={e => handleChange('mission', 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={4}
                                        value={form.mission.description} onChange={e => handleChange('mission', 'description', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bullet Points (Comma separated)</Label>
                                    <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
                                        placeholder="Integrity, Excellence, ..."
                                        value={form.mission.list.join(', ')}
                                        onChange={e => handleChange('mission', 'list', e.target.value.split(',').map(s => s.trim()))} />
                                </div>
                            </div>
                        </div>

                        {/* VISION */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-blue-500"><Eye size={20} /> Vision</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
                                        value={form.vision.title} onChange={e => handleChange('vision', 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vision Statement</Label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 resize-none" rows={6}
                                        value={form.vision.description} onChange={e => handleChange('vision', 'description', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- VALUES EDIT --- */}
                <TabsContent value="values" className="space-y-6">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2"><Shield size={20} /> Core Values</h3>
                            <Button size="sm" onClick={() => setForm(prev => ({ ...prev, values: [...prev.values, { title: "New Value", description: "", icon: "Shield" }] }))}>
                                <Plus size={16} className="mr-2" /> Add Value
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {form.values.map((val: any, i: number) => (
                                <div key={i} className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl relative border border-slate-200 dark:border-white/5">
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                        onClick={() => setForm(prev => ({ ...prev, values: prev.values.filter((_, idx) => idx !== i) }))}>
                                        <Trash size={14} />
                                    </Button>
                                    <div className="space-y-3">
                                        <input className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none font-bold placeholder:text-slate-400"
                                            value={val.title} placeholder="Value Title"
                                            onChange={e => {
                                                const newVals = [...form.values];
                                                newVals[i].title = e.target.value;
                                                setForm(prev => ({ ...prev, values: newVals }));
                                            }}
                                        />
                                        <textarea className="w-full bg-transparent border-none text-sm text-slate-600 dark:text-slate-400 resize-none outline-none"
                                            value={val.description} placeholder="Value Description" rows={2}
                                            onChange={e => {
                                                const newVals = [...form.values];
                                                newVals[i].description = e.target.value;
                                                setForm(prev => ({ ...prev, values: newVals }));
                                            }}
                                        />
                                        <select className="text-xs bg-white dark:bg-black/20 p-1 rounded border border-slate-200 dark:border-white/10"
                                            value={val.icon}
                                            onChange={e => {
                                                const newVals = [...form.values];
                                                newVals[i].icon = e.target.value;
                                                setForm(prev => ({ ...prev, values: newVals }));
                                            }}
                                        >
                                            <option value="Shield">Shield</option>
                                            <option value="Target">Target</option>
                                            <option value="Lightbulb">Lightbulb</option>
                                            <option value="Users">Users</option>
                                            <option value="Globe">Globe</option>
                                            <option value="Award">Award</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
