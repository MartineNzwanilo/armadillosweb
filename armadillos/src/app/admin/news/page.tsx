"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Newspaper, Plus, Trash, Edit, RefreshCw, Upload } from "lucide-react";

export default function AdminNewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "TEXT",
        mediaUrl: "",
        published: true
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3005/api/v1/news/admin', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNews(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:3005/api/v1/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ title: "", content: "", type: "TEXT", mediaUrl: "", published: true });
                fetchNews();
            } else {
                alert("Failed to create post");
            }
        } catch (e) {
            alert("Error creating post");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`http://localhost:3005/api/v1/news/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
            });
            fetchNews();
        } catch (e) {
            alert("Delete failed");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('http://localhost:3005/api/v1/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
                body: uploadData
            });
            const data = await res.json();
            if (data.url) {
                const fullUrl = `http://localhost:3005${data.url}`;
                setFormData(prev => ({ ...prev, mediaUrl: fullUrl }));
            } else {
                alert("Upload returned no URL");
            }
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-slate-900 dark:text-white">News & Updates</h1>
                    <p className="text-slate-500">Manage newsletter posts and site updates.</p>
                </div>
                <Button onClick={fetchNews} variant="outline" size="sm">
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Create Form */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-amber-500" /> Create Post
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Title</label>
                            <input
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 mt-1"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Type</label>
                            <select
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 mt-1"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="TEXT">Text Only</option>
                                <option value="IMAGE">Image Post</option>
                                <option value="VIDEO">Video Post</option>
                                <option value="AUDIO">Audio Post</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Content</label>
                            <textarea
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 mt-1 min-h-[100px]"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </div>
                        {(formData.type !== 'TEXT') && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Media Upload</label>

                                {/* Upload Button */}
                                <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept={formData.type === 'VIDEO' ? "video/*" : "image/*,audio/*"}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <div className="flex items-center justify-center gap-2 text-amber-500">
                                            <RefreshCw size={20} className="animate-spin" /> Uploading...
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Upload size={24} />
                                            <span className="text-sm font-medium">Click to upload {formData.type.toLowerCase()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 my-2">
                                    <span className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
                                    <span className="text-xs text-slate-500 uppercase">OR URL</span>
                                    <span className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
                                </div>

                                <input
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2"
                                    value={formData.mediaUrl}
                                    onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                    placeholder={`https://...`}
                                />

                                {/* Preview */}
                                {formData.mediaUrl && (
                                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black">
                                        {formData.type === 'VIDEO' ? (
                                            <video
                                                src={formData.mediaUrl}
                                                controls
                                                className="w-full h-48 object-contain bg-black"
                                            />
                                        ) : (
                                            <img
                                                src={formData.mediaUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                className="w-5 h-5 accent-amber-500"
                            />
                            <span className="text-sm font-medium">Publish & Notify Subscribers</span>
                        </div>
                        <Button type="submit" disabled={submitting || uploading} className="w-full bg-amber-500 text-black hover:bg-amber-600">
                            {submitting ? "Posting..." : "Post News"}
                        </Button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Newspaper size={20} className="text-amber-500" /> Recent Posts
                    </h2>
                    {loading && <div className="text-center text-slate-500">Loading...</div>}
                    {!loading && news.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex justify-between items-start group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.published ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                        {item.published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                                        {item.type}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                                {item.mediaUrl && <p className="text-xs text-amber-500 mt-1 truncate max-w-xs">{item.mediaUrl}</p>}
                                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.content}</p>
                            </div>
                            <Button
                                onClick={() => handleDelete(item.id)}
                                variant="ghost"
                                size="icon"
                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash size={16} />
                            </Button>
                        </div>
                    ))}
                    {!loading && news.length === 0 && (
                        <div className="text-center py-10 text-slate-400 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                            No news posted yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
