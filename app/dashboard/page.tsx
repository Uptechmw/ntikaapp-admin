"use client";

import { useEffect, useState } from "react";
import { Users, Mic, RefreshCw, TrendingUp, DollarSign, Activity, PieChart, ArrowUpRight } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

interface DashboardStats {
    totalUsers: number;
    activeMatches: number;
    totalRevenue: number;
    activeUsers: number;
    newSignups: number;
    totalSwipes: number;
    totalPodcasts: number;
    revenueHistory: any[];
    userGrowth: any[];
    recentActivity: any[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                loadStats();
            }
        });
        return () => unsubscribe();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await fetchWithAuth("/api/analytics/summary");
            setStats(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to sync with analytical infrastructure.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-x-0 -bottom-10 text-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Compiling Stats</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 border border-red-100 shadow-sm">
                    <Activity size={40} />
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Sync Failure</h3>
                <p className="text-zinc-500 mb-8 max-w-md font-medium">{error}</p>
                <button onClick={loadStats} className="bg-zinc-950 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-zinc-950/20 active:scale-95 transition-all">
                    <RefreshCw size={18} /> Reconnect
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Real-time Telemetry</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none">System Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white border border-zinc-200 rounded-2xl shadow-sm flex items-center gap-3">
                        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Global Status</span>
                        <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg">Operational</span>
                    </div>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+4.2%" },
                    { title: "Platform Interactions", value: stats?.totalSwipes, icon: Activity, color: "text-purple-600", bg: "bg-purple-50", trend: "+12.5%" },
                    { title: "Active Matches", value: stats?.totalPodcasts, icon: Mic, color: "text-orange-500", bg: "bg-orange-50", trend: "+8.1%" },
                    { title: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50", trend: "+23.4%" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm group hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col justify-between min-h-[180px]">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-xl">
                                <span className="text-[10px] font-black text-green-600">{stat.trend}</span>
                                <ArrowUpRight size={10} className="text-green-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.title}</p>
                            <p className="text-3xl font-black text-zinc-900 tracking-tighter">{stat.value?.toLocaleString() || "0"}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytical Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Growth Velocity</h3>
                            <p className="text-zinc-400 text-sm font-bold">New user onboarding over past 30 days</p>
                        </div>
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <PieChart size={20} className="text-zinc-400" />
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <UserGrowthChart data={stats?.userGrowth || []} />
                    </div>
                </div>

                <div className="bg-zinc-950 rounded-[2.5rem] p-10 shadow-2xl shadow-zinc-950/20 flex flex-col text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-purple-600/40 transition-colors duration-1000" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-12">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                                <TrendingUp size={20} className="text-purple-400" />
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monthly Target</span>
                        </div>

                        <div className="mb-auto">
                            <p className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-2">Total Gross Volume</p>
                            <h4 className="text-5xl font-black text-white tracking-tighter mb-4">${stats?.totalRevenue?.toLocaleString()}</h4>
                            <div className="flex items-center gap-2 text-green-400 font-black text-xs uppercase tracking-tight">
                                <TrendingUp size={14} />
                                <span>24% Growth vs Prev Month</span>
                            </div>
                        </div>

                        <div className="h-[200px] -mx-4">
                            <RevenueChart data={stats?.revenueHistory || []} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Operations Audit */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Operational Audit</h3>
                        <p className="text-zinc-400 text-sm font-bold">Snapshot of recent platform activities and transactions</p>
                    </div>
                    <button className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-8">View Master Log</button>
                </div>
                <RecentTransactions transactions={stats?.recentActivity || []} />
            </div>
        </div>
    );
}
