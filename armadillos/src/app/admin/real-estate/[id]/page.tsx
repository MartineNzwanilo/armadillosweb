"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Home, MapPin, LayoutGrid, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getContent, createProject, updateProject } from "@/lib/cms";
import { LocationPicker } from "@/components/admin/LocationPicker";

export default function PropertyEditor({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initial State
    const [property, setProperty] = useState({
        title: "",
        price: "",
        category: "Sale", // Sale, Rent
        status: "Available",
        description: "",
        location: { address: "", lat: -6.7924, lng: 39.2083 },
        stats: { beds: "0", baths: "0", sqft: "0", lot_size: "" },
        features: [] as string[],
        gallery: [] as string[]
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        // Unwrap params
        const resolvedParams = await params;
        const paramId = resolvedParams.id;

        if (paramId && paramId !== "new") {
            setId(paramId);
            try {
                // We fetch all generic content which includes properties
                // In a real app we might fetch just one, but our CMS helper gets all
                const content = await getContent();
                // @ts-ignore
                const found = content.real_estate_listings.find((p: any) => p.id === paramId);
                if (found) {
                    setProperty({
                        title: found.title || "",
                        price: found.price || "",
                        category: found.category || "Sale",
                        status: found.status || "Available",
                        description: found.description || "",
                        location: {
                            address: found.location?.address || "",
                            lat: found.location?.lat || -6.7924,
                            lng: found.location?.lng || 39.2083
                        },
                        stats: {
                            beds: found.stats?.beds || "0",
                            baths: found.stats?.baths || "0",
                            sqft: found.stats?.sqft || "0",
                            lot_size: found.stats?.lot_size || ""
                        },
                        features: found.features || [],
                        gallery: found.gallery || []
                    });
                }
            } catch (e) {
                console.error("Failed to load property", e);
            }
        }
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            if (id) {
                // Update
                const res = await updateProject(id, property.title, property.status, property);
                if (res) {
                    toast.success("Property updated successfully!");
                    setTimeout(() => router.push("/admin/real-estate"), 1000);
                } else {
                    toast.error("Failed to update property.");
                }
            } else {
                // Create
                const res = await createProject("REAL_ESTATE", property.title, property.status, property);
                if (res) {
                    toast.success("Property created successfully!");
                    setTimeout(() => router.push("/admin/real-estate"), 1000);
                } else {
                    toast.error("Failed to create property.");
                }
            }
        } catch (e) {
            console.error(e);
            toast.error("An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    }

    function updateField(field: string, value: any) {
        setProperty(prev => ({ ...prev, [field]: value }));
    }

    function updateNested(section: string, field: string, value: any) {
        setProperty(prev => ({
            ...prev,
            // @ts-ignore
            [section]: { ...prev[section], [field]: value }
        }));
    }

    function addFeature() {
        setProperty(prev => ({ ...prev, features: [...prev.features, ""] }));
    }

    function updateFeature(index: number, value: string) {
        const newFeatures = [...property.features];
        newFeatures[index] = value;
        setProperty(prev => ({ ...prev, features: newFeatures }));
    }

    function removeFeature(index: number) {
        setProperty(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    }

    // Handle Image Upload (Mock for now, effectively text input for URL)
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

            setProperty(prev => ({ ...prev, gallery: [...prev.gallery, fullUrl] }));
            toast.success("Image uploaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload image");
        } finally {
            setSaving(false);
        }
    }

    function removeImage(index: number) {
        setProperty(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading editor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/real-estate">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                        {id ? "Edit Property" : "Add Property"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {id ? `Updating listing: ${property.title}` : "Create a new premium listing."}
                    </p>
                </div>
                <div className="ml-auto">
                    <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                        {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                        Save Property
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full space-y-6">
                <TabsList className="w-full p-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl flex justify-start gap-2">
                    <TabsTrigger value="details" className="flex-1"><Home className="mr-2 w-4 h-4" /> Details</TabsTrigger>
                    <TabsTrigger value="stats" className="flex-1"><LayoutGrid className="mr-2 w-4 h-4" /> Stats & Features</TabsTrigger>
                    <TabsTrigger value="location" className="flex-1"><MapPin className="mr-2 w-4 h-4" /> Location</TabsTrigger>
                    <TabsTrigger value="gallery" className="flex-1"><ImageIcon className="mr-2 w-4 h-4" /> Gallery</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details">
                    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Property Title</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-colors"
                                    value={property.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    placeholder="e.g. Luxury Villa in Masaki"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Price (Text)</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-colors"
                                    value={property.price}
                                    onChange={(e) => updateField("price", e.target.value)}
                                    placeholder="e.g. $1,200,000"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-colors"
                                    value={property.status}
                                    onChange={(e) => updateField("status", e.target.value)}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Sold">Sold</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Category</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-colors"
                                    value={property.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                >
                                    <option value="Sale">For Sale</option>
                                    <option value="Rent">For Rent</option>
                                    <option value="Land">Land / Plot</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 h-32 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                                    value={property.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    placeholder="Describe the property..."
                                />
                            </div>
                        </div>
                    </section>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats">
                    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Bedrooms</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500"
                                    value={property.stats.beds}
                                    onChange={(e) => updateNested("stats", "beds", e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Bathrooms</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500"
                                    value={property.stats.baths}
                                    onChange={(e) => updateNested("stats", "baths", e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Area (Sq Ft)</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500"
                                    value={property.stats.sqft}
                                    onChange={(e) => updateNested("stats", "sqft", e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500">Lot Size</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500"
                                    value={property.stats.lot_size}
                                    onChange={(e) => updateNested("stats", "lot_size", e.target.value)}
                                    placeholder="e.g. 0.5 Acres"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 dark:text-white">Features List</h3>
                                <Button type="button" size="sm" variant="outline" onClick={addFeature}>
                                    <Plus size={16} className="mr-2" /> Add Feature
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                {property.features.map((feature, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500"
                                            value={feature}
                                            onChange={(e) => updateFeature(i, e.target.value)}
                                            placeholder="Feature (e.g. Swimming Pool)"
                                        />
                                        <Button type="button" size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => removeFeature(i)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </TabsContent>

                {/* Location Tab */}
                <TabsContent value="location">
                    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase text-slate-500">Full Address</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500"
                                value={property.location.address}
                                onChange={(e) => updateNested("location", "address", e.target.value)}
                                placeholder="Street, Area, City"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase text-slate-500">Geographic Location</label>
                            <div className="p-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">
                                <LocationPicker
                                    value={{ lat: property.location.lat, lng: property.location.lng }}
                                    onChange={(val) => {
                                        setProperty(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                lat: val.lat,
                                                lng: val.lng,
                                                address: val.address ? val.address : prev.location.address
                                            }
                                        }));
                                    }}
                                />
                            </div>
                            <p className="text-xs text-slate-400">Search for a place or click on the map to set the exact pin position.</p>
                        </div>
                    </section>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery">
                    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 space-y-6">
                        {/* Image Upload Area */}
                        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative">
                            <div className="flex flex-col items-center gap-4 text-slate-500">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                    <Upload size={24} />
                                </div>
                                <p>Click to upload property images</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {property.gallery.map((img, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden group bg-black/10">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {property.gallery.length === 0 && (
                            <p className="text-center text-slate-400 text-sm">No images uploaded yet.</p>
                        )}
                    </section>
                </TabsContent>
            </Tabs>
        </div>
    );
}
