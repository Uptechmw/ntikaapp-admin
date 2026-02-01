"use client";

import { Users, CreditCard, Activity, ArrowUp } from "lucide-react";

const stats = [
    { name: "Total Users", value: "2,543", change: "+12.5%", icon: Users, color: "text-blue-500" },
    { name: "Active Matches", value: "856", change: "+5.2%", icon: Activity, color: "text-green-500" },
    { name: "Revenue (Coins)", value: "145.2k", change: "+24.3%", icon: CreditCard, color: "text-yellow-500" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-zinc-950/50 ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded-lg">
                                    <ArrowUp className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-zinc-500 text-sm font-medium">{stat.name}</p>
                            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl min-h-[300px]">
                    <h3 className="font-bold text-white mb-6">Recent Registrations</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-xl transition-colors">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
                                    <div className="h-3 w-24 bg-zinc-900 rounded" />
                                </div>
                                <div className="h-8 w-20 bg-zinc-800 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl min-h-[300px]">
                    <h3 className="font-bold text-white mb-6">Recent Reports</h3>
                    <div className="flex items-center justify-center h-full pb-10">
                        <p className="text-zinc-600">No pending reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
