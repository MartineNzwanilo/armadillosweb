
"use client";

import { useState, useEffect } from "react";
import { Trash2, CheckCircle, XCircle, Search, Mail } from "lucide-react";
import { API_Base } from "@/lib/cms";

interface Subscriber {
    id: number;
    email: string;
    isActive: boolean;
    createdAt: string;
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [filtered, setFiltered] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    useEffect(() => {
        if (!search) {
            setFiltered(subscribers);
        } else {
            setFiltered(subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search, subscribers]);

    async function fetchSubscribers() {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_Base}/subscribers`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                setSubscribers(data);
                setFiltered(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to unsubscribe this user?")) return;
        setDeleting(id);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_Base}/subscribers/${id}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (res.ok) {
                setSubscribers(current => current.filter(s => s.id !== id));
            }
        } catch (e) {
            alert("Failed to delete subscriber");
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Newsletter Subscribers</h1>
                    <p className="text-slate-400">Manage your newsletter audience ({subscribers.length} total)</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="Search emails..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Subscribed Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">Loading subscribers...</td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">No subscribers found</td>
                            </tr>
                        ) : (
                            filtered.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-white font-medium">{sub.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {sub.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                                <CheckCircle size={12} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                                <XCircle size={12} /> Unsubscribed
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            disabled={deleting === sub.id}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Unsubscribe (Delete)"
                                        >
                                            {deleting === sub.id ? (
                                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
