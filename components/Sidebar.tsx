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
    X
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Coins & Packages", href: "/dashboard/coins", icon: CreditCard },
    { name: "App Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 rounded-lg text-white"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <div className={clsx(
                "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-900 transform transition-transform duration-200 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-zinc-900">
                        <h1 className="text-2xl font-black text-white tracking-tight">NtikaApp</h1>
                        <p className="text-xs text-zinc-500 font-medium">ADMIN DASHBOARD</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                                        isActive
                                            ? "bg-purple-600/10 text-purple-500"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                    )}
                                >
                                    <Icon className={clsx("w-5 h-5", isActive ? "text-purple-500" : "text-zinc-500")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-zinc-900">
                        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
