"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Pickaxe, Sprout, FileText, Settings, LogOut, X, FlaskConical, Factory, Mail, Newspaper, Info, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "News & Updates", href: "/admin/news", icon: Newspaper },
    { name: "Subscribers", href: "/admin/subscribers", icon: Users },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Site Content", href: "/admin/content", icon: FileText },
    { name: "Real Estate", href: "/admin/real-estate", icon: Building2 },
    { name: "Mining", href: "/admin/mining", icon: Pickaxe },
    { name: "Agrobusiness", href: "/admin/agrobusiness", icon: Sprout },
    { name: "Chemicals", href: "/admin/chemicals", icon: FlaskConical },
    { name: "Elution Plants", href: "/admin/elution-plants", icon: Factory },
    { name: "About Us", href: "/admin/about", icon: Info },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={cn(
                "w-64 h-screen fixed left-0 top-0 bg-slate-900 border-r border-slate-800 text-white flex flex-col z-50 transition-transform duration-300 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-xl font-serif font-bold text-amber-500">Armadillos</span>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon size={18} className={cn(isActive ? "text-slate-900" : "text-slate-500 group-hover:text-amber-500")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={async () => {
                            await logout();
                            localStorage.removeItem('admin_token');
                            window.location.href = "/auth/login";
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
