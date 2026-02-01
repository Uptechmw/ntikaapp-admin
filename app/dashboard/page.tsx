"use client";

import { useEffect, useState } from "react";
import { Users, Mic, HelpCircle, RefreshCw, Upload } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { MOCK_TRANSACTIONS } from "@/lib/mockData";

interface DashboardStats {
    totalUsers: number;
    activeMatches: number;
    totalRevenue: number;
    activeUsers: number;
    newSignups: number;
    subscribedPercentage: number;
    freeMatches: number;
    premiumMatches: number;
    recentRegistrations: any[];
    [key: string]: any; // Allow for graph data etc
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
            // Fetch platform summary from backend (will use mock data fallback)
            const data = await fetchWithAuth("/api/analytics/summary");
            setStats(data);
        } catch (err: any) {
            console.error(err);
            setError("Failed to connect to backend API.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-zinc-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={loadStats} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <RefreshCw size={18} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Row 1: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers?.toLocaleString() || "0"}
                    subtext={`Active: ${stats?.activeUsers?.toLocaleString()}, New: ${stats?.newSignups?.toLocaleString()}`}
                    icon={Users}
                    trend="+2.5%"
                    trendUp={true}
                    color="bg-cyan-500"
                />

                {/* Custom Card for Matches/Podcasts */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Podcasts</h3>
                            <div className="text-3xl font-bold text-gray-900">{stats?.activeMatches}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-100 bg-opacity-50">
                            <Mic className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-8 mt-2">
                        <div>
                            <span className="block text-xs text-gray-400 font-medium">Free:</span>
                            <span className="text-sm font-bold text-gray-900">{stats?.freeMatches}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 font-medium">Premium:</span>
                            <span className="text-sm font-bold text-gray-900">{stats?.premiumMatches}</span>
                        </div>
                        <button className="bg-black text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 ml-auto">
                            + Add New
                        </button>
                    </div>
                </div>

                {/* Custom Card for Quizzes/Revenue Equivalent */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Quizzes</h3>
                            <div className="text-3xl font-bold text-gray-900">{stats?.totalRevenue}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-100 bg-opacity-50">
                            <HelpCircle className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <button className="bg-black text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1 self-end mt-auto">
                        + Add New
                    </button>
                </div>
            </div>

            {/* Row 2: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthChart data={stats?.userGrowth} />
                <RevenueChart data={stats?.revenueHistory} />
            </div>

            {/* Row 3: Transactions & Footer */}
            <div className="grid grid-cols-1 gap-6">
                <RecentTransactions transactions={MOCK_TRANSACTIONS} />
            </div>
        </div>
    );
}
