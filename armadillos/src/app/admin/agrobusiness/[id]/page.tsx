"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Sprout, Calendar, Globe } from "lucide-react";
import { LocationPicker } from "@/components/admin/LocationPicker";
import Link from "next/link";
import { use } from "react";
import { updateProject, createProject, deleteProject, getProject } from "@/lib/cms";
import { toast } from "sonner";

export default function AgrobusinessEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState<any>({
        name: "", // Mapped to 'crop'
        season: "",
        market: "",
        status: "Planting",
        image: "", // New image field
        details: {}
    });

    useEffect(() => {
        if (!isNew) {
            getProject(id).then(found => {
                if (found) {
                    setProject({
                        ...found,
                        // Ensure name is populated from crop if needed, though backend handles this
                        season: found.details?.season || found.season || "",
                        market: found.details?.market || found.market || "",
                        image: found.imageUrl || found.image || ""
                    });
                } else {
                    toast.error("Project not found");
                    router.push("/admin/agrobusiness");
                }
                setLoading(false);
            });
        }
    }, [id, isNew, router]);

    async function handleSave() {
        setSaving(true);
        // Prepare payload. Name maps to crop.
        const payload = {
            season: project.season,
            market: project.market,
            imageUrl: project.image // Save image url
        };

        try {
            if (!isNew) {
                // Update
                const res = await updateProject(id, project.name, project.status, { ...payload, type: "CROP_CYCLE" });
                if (res) {
                    toast.success("Cycle updated!");
                    router.refresh();
                } else {
                    toast.error("Failed to update.");
                }
            } else {
                // Create
                const res = await createProject("CROP_CYCLE", project.name, project.status, payload);
                if (res) {
                    toast.success("Cycle started successfully!");
                    setTimeout(() => router.push("/admin/agrobusiness"), 1000);
                } else {
                    toast.error("Failed to start cycle.");
                }
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred.");
        } finally {
            setSaving(false);
        }
    }

    // Image Upload Handler
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3005"}/api/v1/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            // Assuming backend returns full URL or path. If just path, prepend base.
            // But existing images seem to be root relative in seed.
            const url = data.url;

            setProject((prev: any) => ({ ...prev, image: url }));
            toast.success("Image uploaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload image");
        } finally {
            setSaving(false);
        }
    }


    async function handleDelete() {
        if (confirm("Are you sure you want to delete this cycle?")) {
            await deleteProject(id);
            toast.success("Cycle deleted");
            router.push("/admin/agrobusiness");
        }
    }

    if (loading) return <div className="p-12 text-center animate-pulse">Loading cycle data...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/agrobusiness">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft size={18} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                            {isNew ? "New Harvest Cycle" : "Edit Cycle"}
                        </h1>
                        <p className="text-sm text-slate-500">{isNew ? "Initiate a new crop cycle" : `Managing ${project.name}`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isNew && (
                        <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" size="icon" onClick={handleDelete}>
                            <Trash2 size={18} />
                        </Button>
                    )}
                    <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                        <Save className="mr-2" size={18} />
                        {saving ? "Saving..." : "Save Cycle"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Crop Name</label>
                            <div className="relative">
                                <Sprout className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                <input
                                    className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                    placeholder="e.g. Organic Maize"
                                    value={project.name}
                                    onChange={e => setProject({ ...project, name: e.target.value })}
                                />
                            </div>
                        </div>


                        <label className="text-sm font-medium">Farm Location</label>
                        <div className="p-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">
                            <LocationPicker
                                value={{
                                    lat: project.details?.lat || -6.3690,
                                    lng: project.details?.lng || 34.8888
                                }}
                                onChange={(val) => {
                                    setProject((prev: any) => ({
                                        ...prev,
                                        // Update market text if empty, or just keep it separate
                                        market: !prev.market ? val.address : prev.market,
                                        details: {
                                            ...prev.details,
                                            lat: val.lat,
                                            lng: val.lng
                                        }
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Season</label>
// ... rest of the file
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                <input
                                    className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                    placeholder="e.g. Mar - Sep"
                                    value={project.season}
                                    onChange={e => setProject({ ...project, season: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Export Market</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                <input
                                    className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                    placeholder="Region"
                                    value={project.market}
                                    onChange={e => setProject({ ...project, market: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Phase</label>
                        <select
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            value={project.status}
                            onChange={e => setProject({ ...project, status: e.target.value })}
                        >
                            <option value="Planting">Planting</option>
                            <option value="Growing">Growing</option>
                            <option value="Harvesting">Harvesting</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipping">Shipping</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
                {/* Image Upload Box */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl space-y-4">
                    <label className="text-sm font-medium block">Crop Image</label>

                    {project.image ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={project.image} alt="Crop" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="ghost" className="text-red-500 hover:bg-red-500/20" size="sm" onClick={() => setProject({ ...project, image: "" })}>Remove</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative">
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                    <Globe size={20} className="text-slate-400" />
                                </div>
                                <span className="text-xs font-medium">Upload Image</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                </div>

                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 p-6 rounded-2xl">
                    <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">Cycle Management</h3>
                    <p className="text-sm text-green-700/80 dark:text-green-300/60">
                        Updating the cycle status will automatically trigger notifications to relevant department heads.
                    </p>
                </div>
            </div>
        </div>

    );
}

