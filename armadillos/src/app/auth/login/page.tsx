"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, User, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { setAdminSession } from "../../../lib/auth";

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = (formData.get("username") as string).trim();
        const password = (formData.get("password") as string).trim();

        try {
            // No strict verification - just pass
            const result = await setAdminSession(username, password);
            if (result.success && result.token) {
                localStorage.setItem('admin_token', result.token);
            }
            router.push("/admin");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-amber-500/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 mb-6">
                        <ShieldCheck className="w-10 h-10 text-black" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to your admin dashboard.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20 transition-all mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>
                </form>

                <div className="text-center mt-8">
                    <button onClick={() => router.push("/")} className="text-slate-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 mx-auto group">
                        <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Website
                    </button>
                </div>
            </div>
        </div>
    );
}
