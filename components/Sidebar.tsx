"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CreditCard,
    Users,
    Settings,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Mic,
    ShieldAlert,
    Gem,
    BookOpen
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Matches", href: "/dashboard/matches", icon: Mic },
    { name: "Manage Users", href: "/dashboard/users", icon: Users },
    { name: "Manage Stories", href: "/dashboard/stories", icon: BookOpen },
    { name: "Subscription", href: "/dashboard/coins", icon: Gem },
    { name: "Content Moderation", href: "/dashboard/moderation", icon: ShieldAlert },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 rounded-lg text-white"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <div className={clsx(
                "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800/50 transform transition-transform duration-200 lg:translate-x-0 shadow-2xl shadow-black/20",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-8 pb-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/40">
                            <span className="text-white font-black text-xl italic mt-0.5 ml-0.5">S</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight uppercase leading-none">SmashPass</h1>
                            <span className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase mt-1 block">Super Admin</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                        <div className="px-4 pb-4">
                            <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4 block">Main Menu</span>
                        </div>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-3.5 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 relative group",
                                        isActive
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                    )}
                                >
                                    <Icon className={clsx("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-zinc-500")} />
                                    {item.name}
                                    {isActive && (
                                        <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 mt-auto">
                        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-4 text-center">
                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-tighter mb-1">Server Connection</div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[10px] font-black text-zinc-300 uppercase">Operational</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
