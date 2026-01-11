"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Upload, MapPin, Pickaxe } from "lucide-react";
import { LocationPicker } from "@/components/admin/LocationPicker";
import Link from "next/link";
import { use } from "react";
import { updateProject, createProject, deleteProject, getProject } from "@/lib/cms";
import { toast } from "sonner";

export default function MiningProjectEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Mining Project State
    const [project, setProject] = useState<any>({
        name: "",
        location: "",
        status: "Exploration",
        yield: "",
        image: "",
        details: {}
    });

    useEffect(() => {
        if (!isNew) {
            getProject(id).then(found => {
                if (found) {
                    setProject({
                        ...found,
                        yield: found.reservesEstimate || found.yield || "",
                        image: found.imageUrl || found.image || ""
                    });
                } else {
                    toast.error("Project not found");
                    router.push("/admin/mining");
                }
                setLoading(false);
            });
        }
    }, [id, isNew, router]);

    async function handleSave() {
        setSaving(true);
        const payload = { ...project, imageUrl: project.image };
        try {
            if (!isNew) {
                // Update
                const res = await updateProject(id, project.name, project.status, { ...payload, type: "MINING" });
                if (res) {
                    toast.success("Project updated!");
                    router.refresh();
                } else {
                    toast.error("Failed to update.");
                }
            } else {
                // Create
                const res = await createProject("MINING", project.name, project.status, payload);
                if (res) {
                    toast.success("Project created successfully!");
                    setTimeout(() => router.push("/admin/mining"), 1000);
                } else {
                    toast.error("Failed to create project.");
                }
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
            toast.success("Project deleted");
            router.push("/admin/mining");
        }
    }

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
            const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3005"}${data.url}`;

            setProject((prev: any) => ({ ...prev, image: fullUrl }));
            toast.success("Image uploaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload image");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-12 text-center animate-pulse">Loading project...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/mining">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft size={18} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                            {isNew ? "New Mining Project" : "Edit Project"}
                        </h1>
                        <p className="text-sm text-slate-500">{isNew ? "Launch a new operation" : `Editing ${project.name}`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isNew && (
                        <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" size="icon" onClick={handleDelete}>
                            <Trash2 size={18} />
                        </Button>
                    )}
                    <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-black">
                        <Save className="mr-2" size={18} />
                        {saving ? "Saving..." : "Save Project"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Name</label>
                            <input
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                placeholder="e.g. Geita Gold Belt"
                                value={project.name}
                                onChange={e => setProject({ ...project, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <div className="space-y-2">
                                    <div className="h-[350px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                                        <LocationPicker
                                            value={{
                                                lat: project.details?.lat || 0,
                                                lng: project.details?.lng || 0
                                            }}
                                            onChange={(val) => {
                                                setProject((prev: any) => ({
                                                    ...prev,
                                                    location: val.address || prev.location,
                                                    details: {
                                                        ...prev.details,
                                                        lat: val.lat,
                                                        lng: val.lng,
                                                        location: {
                                                            address: val.address,
                                                            coordinates: { lat: val.lat, lng: val.lng }
                                                        }
                                                    }
                                                }));
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">Selected: {project.location || "None"}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    value={project.status}
                                    onChange={e => setProject({ ...project, status: e.target.value })}
                                >
                                    <option value="Exploration">Exploration</option>
                                    <option value="Active Extraction">Active Extraction</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Projected/Current Yield</label>
                            <div className="relative">
                                <Pickaxe className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                <input
                                    className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    placeholder="e.g. 15 kg/mo"
                                    value={project.yield}
                                    onChange={e => setProject({ ...project, yield: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Image */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl space-y-4">
                        <label className="text-sm font-medium block">Project Cover</label>

                        {project.image ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden group">
                                <img src={project.image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="ghost" className="text-red-500 hover:bg-red-500/20" size="sm" onClick={() => setProject({ ...project, image: "" })}>Remove</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative">
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <Upload size={24} />
                                    <span className="text-xs">Upload Image</span>
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
                </div>
            </div>
        </div>
    );
}
