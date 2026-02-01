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
    Gem
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Matches", href: "/dashboard/matches", icon: Mic },
    { name: "Manage Users", href: "/dashboard/users", icon: Users },
    { name: "Subscription", href: "/dashboard/coins", icon: Gem },
    { name: "Content Moderation", href: "/dashboard/moderation", icon: ShieldAlert },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
                "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-200 lg:translate-x-0 shadow-sm",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SmashPass</h1>
                        </div>
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
                                            ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={clsx("w-5 h-5", isActive ? "text-purple-600" : "text-gray-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-50">
                        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
