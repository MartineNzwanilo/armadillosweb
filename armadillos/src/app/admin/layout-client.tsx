"use client";

import { useState } from "react";
import { AdminSidebar } from "../../components/admin/Sidebar";
import { Menu } from "lucide-react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black flex">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen transition-all duration-300 md:ml-64">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-3 font-serif font-bold text-lg text-slate-900 dark:text-white">Admin Panel</span>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
