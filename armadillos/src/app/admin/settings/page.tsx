"use client";

import { useState, useEffect } from "react";
import {
    User, Shield, Bell, Loader2, Save, KeyRound, Mail, Monitor,
    Globe, MapPin, Moon, Sun, Laptop, Map as MapIcon, Plus, Trash, Crown, Pickaxe, Sprout, Building
} from "lucide-react";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { getContent, saveSettings, changePassword } from "@/lib/cms";
import { toast } from "sonner";

const Label = ({ children }: any) => <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">{children}</label>;
const Input = (props: any) => <input {...props} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-colors" />;
const TextArea = (props: any) => <textarea {...props} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-colors resize-none" />;

export default function AdminSettings() {
    const { theme, setTheme } = useTheme();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data State
    const [identity, setIdentity] = useState<any>({});
    const [contact, setContact] = useState<any>({});
    const [locations, setLocations] = useState<any[]>([]);
    const [footer, setFooter] = useState<any>({});
    const [smtpConfig, setSmtpConfig] = useState<any>({ host: 'smtp.gmail.com', port: 465, user: '', pass: '', senderName: 'Armadillos Group' });

    // Password State
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [updatingPass, setUpdatingPass] = useState(false);

    useEffect(() => {
        // Fetch Content
        getContent().then(content => {
            // @ts-ignore
            setIdentity(content.identity || {});
            // @ts-ignore
            setContact(content.contact || {});
            // @ts-ignore
            setLocations(content.locations || []);
            // @ts-ignore
            setFooter(content.footer || {});
            setLoading(false);
        });

        // Fetch SMTP Securely
        const token = localStorage.getItem('admin_token');
        if (token) {
            fetch('http://localhost:3005/api/v1/settings/admin', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.smtpConfig) {
                        setSmtpConfig((prev: any) => ({ ...prev, ...data.smtpConfig }));
                    }
                })
                .catch(err => console.error("Failed to load SMTP settings", err));
        }
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const settings = {
            identity,
            contact,
            footer
        };

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('http://localhost:3005/api/v1/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    settings,
                    locations,
                    smtpConfig
                })
            });

            if (res.ok) {
                toast.success("Settings saved successfully");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (e) {
            toast.error("Network error saving settings");
        }
        setSaving(false);
    };

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error("Please fill in all password fields");
            return;
        }
        if (passwords.new !== passwords.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwords.new.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setUpdatingPass(true);
        try {
            await changePassword(passwords.current, passwords.new);
            toast.success("Password updated successfully");
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (e: any) {
            toast.error(e.message || "Failed to update password");
        }
        setUpdatingPass(false);
    };

    // --- Handlers ---
    const handleIdentityChange = (field: string, value: string) => setIdentity((p: any) => ({ ...p, [field]: value }));
    const handleContactChange = (field: string, value: string) => setContact((p: any) => ({ ...p, [field]: value }));
    const handleLocationChange = (index: number, field: string, value: string | number) => {
        const newLocs = [...locations];
        newLocs[index] = { ...newLocs[index], [field]: value };
        setLocations(newLocs);
    };

    // Clean defaults for new location
    const addLocation = () => setLocations(p => [...p, { id: `loc-${Date.now()}`, title: "", type: "Office", location: "", lat: 0, lng: 0, icon: "MapPin", desc: "" }]);
    const removeLocation = (index: number) => setLocations(p => p.filter((_, i) => i !== index));

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading settings...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                    <p className="text-slate-500">Control global site identity, locations, and appearance.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20">
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                    {saving ? "Saving Changes..." : "Save All Changes"}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8 w-full md:w-auto overflow-x-auto bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg"><Globe className="mr-2 w-4 h-4" /> General Identity</TabsTrigger>
                    <TabsTrigger value="locations" className="rounded-lg"><MapIcon className="mr-2 w-4 h-4" /> Map Locations</TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-lg"><Monitor className="mr-2 w-4 h-4" /> Theme & UI</TabsTrigger>
                    <TabsTrigger value="profile" className="rounded-lg"><Shield className="mr-2 w-4 h-4" /> Security</TabsTrigger>
                </TabsList>

                {/* --- GENERAL IDENTITY --- */}
                <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-4">
                            <Globe className="text-amber-500" /> Site Information
                        </div>
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label>Site Name / Brand</Label>
                                <Input value={identity.name || ''} onChange={(e: any) => handleIdentityChange('name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Site Description (SEO)</Label>
                                <TextArea rows={3} value={identity.description || ''} onChange={(e: any) => handleIdentityChange('description', e.target.value)} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-4 pt-4">
                            <Mail className="text-amber-500" /> Contact Info
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Primary Address</Label>
                                <TextArea rows={3} value={contact.address || ''} onChange={(e: any) => handleContactChange('address', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Title (Headquarters)</Label>
                                <Input value={contact.title || ''} onChange={(e: any) => handleContactChange('title', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- MAP LOCATIONS --- */}
                <TabsContent value="locations" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-amber-500" /> Manage Interactive Map</h2>
                        <Button onClick={addLocation} variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50"><Plus size={16} className="mr-2" /> Add Location</Button>
                    </div>

                    <div className="grid gap-4">
                        {locations.map((loc: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative group hover:border-amber-500/30 transition-all">
                                <Button onClick={() => removeLocation(i)} variant="ghost" size="icon" className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={18} /></Button>

                                <div className="grid md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-1 flex items-center justify-center pt-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500`}>
                                            <MapPin size={20} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-11 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-1"><Label>Title</Label><Input placeholder="Office Name" value={loc.title || ''} onChange={(e: any) => handleLocationChange(i, 'title', e.target.value)} /></div>
                                        <div className="space-y-1"><Label>Type</Label><Input placeholder="Office" value={loc.type || ''} onChange={(e: any) => handleLocationChange(i, 'type', e.target.value)} /></div>
                                        <div className="md:col-span-2 space-y-1"><Label>Description</Label><Input placeholder="Address or details..." value={loc.desc || ''} onChange={(e: any) => handleLocationChange(i, 'desc', e.target.value)} /></div>

                                        <div className="md:col-span-4 space-y-1">
                                            <Label>Location Coordinates</Label>
                                            <div className="h-[400px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                                                <LocationPicker
                                                    value={{ lat: loc.lat || 0, lng: loc.lng || 0 }}
                                                    onChange={(val) => {
                                                        const newLocs = [...locations];
                                                        newLocs[i] = {
                                                            ...newLocs[i],
                                                            lat: val.lat,
                                                            lng: val.lng,
                                                            // Also update the description/address if empty or valid
                                                            location: val.address || newLocs[i].location
                                                        };
                                                        setLocations(newLocs);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {locations.length === 0 && <div className="text-center p-12 text-slate-400 italic">No locations configured. Add one to show on the map.</div>}
                    </div>
                </TabsContent>

                {/* --- THEME & UI --- */}
                <TabsContent value="appearance" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Interface Theme</h3>
                            <p className="text-slate-500 text-sm mb-6">Choose how the Admin Dashboard and Site looks for you.</p>

                            <div className="grid grid-cols-3 gap-4 max-w-lg">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-amber-300'}`}
                                >
                                    <Sun size={24} />
                                    <span className="font-bold text-sm">Light Mode</span>
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'bg-slate-800 border-amber-500 text-white ring-2 ring-amber-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-amber-300'}`}
                                >
                                    <Moon size={24} />
                                    <span className="font-bold text-sm">Dark Mode</span>
                                </button>
                                <button
                                    onClick={() => setTheme("system")}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'bg-slate-100 dark:bg-slate-800 border-amber-500 text-slate-900 dark:text-white ring-2 ring-amber-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-amber-300'}`}
                                >
                                    <Laptop size={24} />
                                    <span className="font-bold text-sm">System</span>
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-white/5 pt-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Accent Color</h3>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500 ring-4 ring-amber-500/30 cursor-pointer"></div>
                                <div className="w-10 h-10 rounded-full bg-blue-500 opacity-50 cursor-not-allowed" title="Premium Feature"></div>
                                <div className="w-10 h-10 rounded-full bg-green-500 opacity-50 cursor-not-allowed" title="Premium Feature"></div>
                                <div className="w-10 h-10 rounded-full bg-cyan-500 opacity-50 cursor-not-allowed" title="Premium Feature"></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Locked to Brand Gold (Amber-500)</p>
                        </div>
                    </div>
                </TabsContent>

                {/* --- SECURITY --- */}
                <TabsContent value="profile">
                    <div className="space-y-6">
                        {/* SMTP Config */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                                <Bell className="text-amber-500" size={24} />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Notifications</h3>
                                    <p className="text-slate-500 text-sm">Configure Gmail SMTP to send news updates to subscribers.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Gmail Address (User)</Label>
                                    <Input
                                        placeholder="example@gmail.com"
                                        value={smtpConfig.user || ''}
                                        onChange={(e: any) => setSmtpConfig((p: any) => ({ ...p, user: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>App Password</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                                        <Input
                                            type="password"
                                            className="pl-12"
                                            placeholder="xxxx xxxx xxxx xxxx"
                                            value={smtpConfig.pass || ''}
                                            onChange={(e: any) => setSmtpConfig((p: any) => ({ ...p, pass: e.target.value }))}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400">Use a Google App Password, not your login password.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Sender Name</Label>
                                    <Input
                                        placeholder="Armadillos Group"
                                        value={smtpConfig.senderName || ''}
                                        onChange={(e: any) => setSmtpConfig((p: any) => ({ ...p, senderName: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Change Password</h3>
                                <p className="text-slate-500 text-sm">Update your password to keep your account secure.</p>
                            </div>
                            <div className="max-w-md space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                                        <Input type="password" className="pl-12" value={passwords.current} onChange={(e: any) => setPasswords(p => ({ ...p, current: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 dark:border-white/5 my-4"></div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" value={passwords.new} onChange={(e: any) => setPasswords(p => ({ ...p, new: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input type="password" value={passwords.confirm} onChange={(e: any) => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                                </div>
                                <Button onClick={handleUpdatePassword} disabled={updatingPass} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                                    {updatingPass ? <Loader2 className="animate-spin mr-2" size={18} /> : <Shield className="mr-2" size={18} />}
                                    {updatingPass ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
