"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, Activity, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface DashboardStats {
    totalUsers: number;
    activeMatches: number;
    totalRevenue: number;
    recentRegistrations: any[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                loadStats();
            } else {
                // Wait for auth to initialize or redirect
            }
        });
        return () => unsubscribe();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError("");
            // Fetch platform summary from backend
            const data = await fetchWithAuth("/api/analytics/summary");
            setStats(data);
        } catch (err: any) {
            console.error(err);
            setError("Failed to connect to backend API. Please ensure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 text-zinc-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <p>Loading dashboard stats...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-lg mx-auto mt-20">
                <p className="text-red-500 mb-6 font-medium">{error}</p>
                <button
                    onClick={loadStats}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-colors"
                >
                    <RefreshCw className="w-5 h-5" /> Try Again
                </button>
            </div>
        );
    }

    const statCards = [
        {
            name: "Total Users",
            value: stats?.totalUsers?.toLocaleString() || "0",
            change: "+0%",
            icon: Users,
            color: "text-blue-500"
        },
        {
            name: "Active Matches",
            value: stats?.activeMatches?.toLocaleString() || "0",
            change: "+0%",
            icon: Activity,
            color: "text-green-500"
        },
        {
            name: "Revenue (Coins)",
            value: stats?.totalRevenue?.toLocaleString() || "0",
            change: "+0%",
            icon: CreditCard,
            color: "text-yellow-500"
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, Admin. Real-time platform statistics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-zinc-950/50 ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-zinc-500 text-sm font-medium">{stat.name}</p>
                            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl min-h-[300px]">
                    <h3 className="font-bold text-white mb-6">Recent Registrations</h3>
                    <div className="space-y-4">
                        {stats?.recentRegistrations?.length ? (
                            stats.recentRegistrations.map((user: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 font-bold">
                                        {user.displayName?.[0] || "?"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white">{user.displayName || "Unknown"}</div>
                                        <div className="text-xs text-zinc-500">{user.email}</div>
                                    </div>
                                    <div className="text-xs text-zinc-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-600 text-center py-10">No recent signups</p>
                        )}
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
