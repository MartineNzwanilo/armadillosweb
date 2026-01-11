"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, Activity, ExternalLink, Building2, TrendingUp, ArrowRight, Pickaxe, Sprout, Briefcase, FlaskConical, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getContent, type SiteContent } from "@/lib/cms";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        getContent().then(setContent);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (!content) return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-slate-500 animate-pulse font-medium">Loading Dashboard...</p>
            </div>
        </div>
    );

    // --- DERIVE REAL METRICS ---
    const miningProjects = content.mining?.projects || [];
    const realEstateProjects = content.real_estate_listings || [];
    const agroProjects = content.agrobusiness?.crops || [];
    const chemicalProjects = content.chemicals?.projects || [];
    const elutionProjects = content.elution?.projects || [];

    const totalProjects = miningProjects.length + realEstateProjects.length + agroProjects.length + chemicalProjects.length + elutionProjects.length;
    const marketCap = content.mining?.stats?.stat_2_value || "$0.00";
    const goldProduction = content.mining?.stats?.stat_1_value || "0 kg";

    // Main Stats Strip
    const stats = [
        {
            label: "Market Value",
            value: marketCap,
            icon: DollarSign,
            change: "+12%",
            desc: "Total Mining Cap",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "group-hover:border-emerald-500/50"
        },
        {
            label: "Total Projects",
            value: totalProjects.toString(),
            icon: Briefcase,
            change: "Active",
            desc: "Across all sectors",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/50"
        },
        {
            label: "Gold Production",
            value: goldProduction,
            icon: Pickaxe,
            change: "+2.1%",
            desc: "Monthly Output",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "group-hover:border-amber-500/50"
        },
        {
            label: "Properties",
            value: realEstateProjects.length.toString(),
            icon: Building2,
            change: "Listed",
            desc: "Real Estate Portfolio",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "group-hover:border-purple-500/50"
        },
    ];

    // Module Overview Cards
    const modules = [
        {
            title: "Mining",
            count: miningProjects.length,
            label: "Active Sites",
            icon: Pickaxe,
            href: "/admin/mining",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "hover:border-amber-500/50"
        },
        {
            title: "Real Estate",
            count: realEstateProjects.length,
            label: "Properties",
            icon: Building2,
            href: "/admin/real-estate",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "hover:border-blue-500/50"
        },
        {
            title: "Agrobusiness",
            count: agroProjects.length,
            label: "Crop Cycles",
            icon: Sprout,
            href: "/admin/agrobusiness",
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "hover:border-green-500/50"
        },
        {
            title: "Chemicals",
            count: chemicalProjects.length,
            label: "Shipments",
            icon: FlaskConical,
            href: "/admin/chemicals",
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            border: "hover:border-cyan-500/50"
        },
        {
            title: "Elution Plants",
            count: elutionProjects.length,
            label: "Facilities",
            icon: Factory,
            href: "/admin/elution-plants",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            border: "hover:border-indigo-500/50"
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white"> Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Overview of your investment empire.</p>
                </div>
                <Link href="/" target="_blank" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 rounded-xl transition-all hover:scale-105 hover:shadow-amber-500/30">
                        <ExternalLink size={18} className="mr-2" /> View Live Site
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div variants={item} key={i}>
                        <div className={`relative overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-6 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 ${stat.border}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className={`flex items-center text-xs font-bold ${stat.change.includes('+') ? 'text-green-500 bg-green-500/10' : 'text-slate-500 bg-slate-500/10'} px-3 py-1.5 rounded-full`}>
                                    <TrendingUp size={12} className="mr-1" /> {stat.change}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2 mb-1 group-hover:text-amber-500 transition-colors">{stat.value}</div>
                                <div className="text-xs text-slate-400 font-medium">{stat.desc}</div>
                            </div>
                            {/* Decorative Blur */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-2xl group-hover:bg-amber-500/5 transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Layout Grid: Module Overview & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Module Overview Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-slate-400" size={20} /> Module Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((mod, i) => (
                            <Link href={mod.href} key={i}>
                                <motion.div variants={item} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 hover:shadow-lg transition-all hover:-translate-y-1 group ${mod.border}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${mod.bg} ${mod.color} transition-colors`}>
                                                <mod.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{mod.label}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{mod.count}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-300">
                                        <span>Manage</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <motion.div variants={item} className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-amber-600 dark:to-amber-800 rounded-[2rem] p-8 text-white shadow-xl shadow-amber-900/10 relative overflow-hidden flex-1">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

                        <h3 className="text-2xl font-bold mb-2 relative z-10">Quick Actions</h3>
                        <p className="text-slate-300 dark:text-amber-100 mb-8 text-sm relative z-10 leading-relaxed max-w-[80%]">
                            Fast track management of your projects and assets.
                        </p>

                        <div className="space-y-3 relative z-10">
                            {[
                                { label: "Add Property", href: "/admin/real-estate", icon: Building2 },
                                { label: "Update Mining", href: "/admin/mining", icon: Pickaxe },
                                { label: "Agro Stats", href: "/admin/agrobusiness", icon: Sprout },
                            ].map((action, i) => (
                                <Link href={action.href} key={i} className="block">
                                    <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl flex items-center justify-between transition-all group border border-white/5 hover:border-white/20 active:scale-95">
                                        <span className="font-medium text-sm flex items-center gap-3">
                                            <action.icon size={16} className="opacity-70" />
                                            {action.label}
                                        </span>
                                        <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-transform" />
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mini Status Card */}
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-6 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">System Status</div>
                            <div className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                Operational
                            </div>
                        </div>
                        <Activity className="text-amber-500/50" />
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
