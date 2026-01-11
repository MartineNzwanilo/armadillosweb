"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash, Factory, MapPin, Gauge } from "lucide-react";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { Button } from "@/components/ui/button";
import { getProject, createProject, updateProject, deleteProject } from "@/lib/cms";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ElutionEditor() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const isNew = id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form State for FACILITY
    // Mapped fields:
    // name -> name
    // status -> status
    // location -> details.location
    // yield (capacity) -> details.yield

    const [formData, setFormData] = useState({
        name: "",
        status: "Planned",
        location: "",
        yield: "",

        image: "",
        details: { lat: 0, lng: 0 }
    });

    useEffect(() => {
        if (!isNew && id) {
            getProject(id).then(data => {
                if (data) {
                    setFormData({
                        name: data.name || "",
                        status: data.status || "Planned",
                        location: data.details?.location || "",
                        yield: data.details?.yield || "",
                        image: data.imageUrl || data.image || "",
                        details: { lat: data.details?.lat || 0, lng: data.details?.lng || 0 }
                    });
                } else {
                    toast.error("Facility not found");
                    router.push('/admin/elution-plants');
                }
                setLoading(false);
            });
        }
    }, [isNew, id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Generic Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch('http://localhost:3005/api/v1/upload', { method: 'POST', body: fd });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
                toast.success("Image attached");
            } else {
                toast.error("Upload failed");
            }
        } catch (err) {
            toast.error("Upload error");
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const details = {
            location: formData.location,
            yield: formData.yield,
            imageUrl: formData.image,
            // @ts-ignore
            lat: formData.details?.lat,
            // @ts-ignore
            lng: formData.details?.lng
        };

        let result;
        if (isNew) {
            result = await createProject('FACILITY', formData.name, formData.status, details);
        } else {
            result = await updateProject(id, formData.name, formData.status, details);
        }

        if (result) {
            toast.success(isNew ? "Facility created successfully" : "Facility updated successfully");
            router.push('/admin/elution-plants');
        } else {
            toast.error("Failed to save facility");
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this facility?")) return;
        setDeleting(true);
        const success = await deleteProject(id);
        if (success) {
            toast.success("Facility deleted");
            router.push('/admin/elution-plants');
        } else {
            toast.error("Failed to delete facility");
            setDeleting(false);
        }
    };

    // ... (rest) ...

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading facility details...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6 pb-20"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/elution-plants">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Factory className="text-cyan-500" /> {isNew ? 'New Facility' : 'Edit Facility'}
                        </h1>
                        <p className="text-slate-500 text-sm">Manage elution plants and processing hubs.</p>
                    </div>
                </div>
                {!isNew && (
                    <Button variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleDelete} disabled={deleting}>
                        <Trash size={18} className="mr-2" /> {deleting ? 'Deleting...' : 'Delete Facility'}
                    </Button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-6">

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Facility Name</label>
                        <div className="relative">
                            <Factory className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Geita Processing Hub"
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Operational Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                        >
                            <option value="Planned">Planned</option>
                            <option value="Construction">Construction</option>
                            <option value="Operational">Operational</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <div className="space-y-2">
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Geita Region"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    required
                                />
                            </div>
                            <div className="h-[350px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                                <LocationPicker
                                    value={{
                                        // @ts-ignore
                                        lat: formData.details?.lat || -6.3690,
                                        // @ts-ignore
                                        lng: formData.details?.lng || 34.8888
                                    }}
                                    onChange={(val) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            location: val.address ? val.address : prev.location,
                                            // @ts-ignore
                                            details: { ...prev.details, lat: val.lat, lng: val.lng }
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Yield / Capacity */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Capacity / Recovery Rate</label>
                        <div className="relative">
                            <Gauge className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input
                                name="yield"
                                value={formData.yield}
                                onChange={handleChange}
                                placeholder="e.g. 98% Recovery"
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">Facility Image</label>
                        <div className="flex items-center gap-4">
                            {formData.image && (
                                <div className="h-20 w-32 relative rounded-lg overflow-hidden border border-slate-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                                    <Button type="button" variant="ghost" size="sm" className="absolute top-0 right-0 p-1 h-auto text-red-500 bg-white/80" onClick={() => setFormData(p => ({ ...p, image: '' }))}>x</Button>
                                </div>
                            )}
                            <label className="cursor-pointer bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 hover:border-cyan-500 px-4 py-3 rounded-xl flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-colors">
                                <Factory size={18} /> <span>{formData.image ? "Change Image" : "Upload Image"}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
                    <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[150px]">
                        {saving ? (
                            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
                        ) : (
                            <span className="flex items-center gap-2"><Save size={18} /> Save Facility</span>
                        )}
                    </Button>
                </div>

            </form>
        </motion.div>
    );
}
