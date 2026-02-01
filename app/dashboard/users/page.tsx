"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Shield, Ban, CheckCircle, Loader2, AlertCircle, TrendingUp, DollarSign, UserCheck, Mail, Calendar } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                loadUsers();
            }
        });
        return () => unsubscribe();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            // In a real app we'd want server-side search. For now, using the basic endpoint.
            const data = await fetchWithAuth("/api/users");
            const userList = data.users || (Array.isArray(data) ? data : []);
            
            // Local filtering for speed if searching
            if (searchTerm) {
                const filtered = userList.filter((u: any) => 
                    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.id?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setUsers(filtered);
            } else {
                setUsers(userList);
            }
        } catch (err) {
            console.error(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: string, action: 'suspend' | 'unsuspend' | 'verify') => {
        setLoadingAction(userId);
        try {
            if (action === 'verify') {
                const user = users.find(u => u.id === userId);
                await fetchWithAuth(`/api/users/${userId}/verify`, {
                    method: "POST",
                    body: JSON.stringify({ verified: !user?.verified })
                });
            } else {
                await fetchWithAuth(`/api/users/${userId}/${action}`, { method: "POST" });
            }
            loadUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">User Directory</h1>
                    <p className="text-zinc-500 font-medium">Internal database of platform participants and creators</p>
                </div>
                <div className="flex bg-white border border-zinc-200 p-1.5 rounded-2xl shadow-sm">
                    <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-950 text-white shadow-lg shadow-zinc-950/20">Active Users</button>
                    <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors">Suspended</button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Accounts", value: users.length, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Verified Users", value: users.filter(u => u.verified).length, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Gross Volume", value: `$${users.reduce((acc, u) => acc + (u.earnings || 0), 0).toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Avg Earnings", value: `$${users.length ? Math.floor(users.reduce((acc, u) => acc + (u.earnings || 0), 0) / users.length) : 0}`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-100 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-black text-zinc-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search master database by UID, Name or Email alias..."
                    className="w-full bg-white border border-zinc-200 rounded-[2rem] pl-16 pr-8 py-5 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all font-medium placeholder:text-zinc-300 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                />
            </div>

            {/* Data Grid */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Profile Identity</th>
                            <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Platform Reach</th>
                            <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Finances</th>
                            <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Administrative</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-32 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
                                        <p className="text-zinc-400 font-black text-xs uppercase tracking-widest">Hydrating table...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-32 text-center">
                                    <AlertCircle className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
                                    <p className="text-zinc-400 font-bold">No matching records found in database</p>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex-shrink-0 overflow-hidden border border-zinc-200 group-hover:border-purple-200 transition-colors shadow-sm">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-600 font-black text-lg">
                                                        {user.displayName[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-black text-zinc-900 flex items-center gap-1.5 leading-tight mb-1">
                                                    {user.displayName}
                                                    {user.verified && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/10" />}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                        <Mail size={10} /> {user.email || "No Email"}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                        <Calendar size={10} /> {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${user.suspended
                                            ? "bg-red-50 text-red-600"
                                            : "bg-green-50 text-green-600 border border-green-100"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.suspended ? "bg-red-500" : "bg-green-500 animate-pulse"}`} />
                                            {user.suspended ? "Blacklisted" : "Operational"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block text-[9px] font-black text-zinc-300 uppercase leading-none mb-1">Matches</span>
                                                <span className="text-sm font-black text-zinc-900">{user.matchesCount || 0}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[9px] font-black text-zinc-300 uppercase leading-none mb-1">Score</span>
                                                <span className="text-sm font-black text-zinc-900">{user.swipeScore || 0}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <span className="block text-[9px] font-black text-zinc-300 uppercase leading-none mb-1">Earnings</span>
                                                <span className="text-sm font-black text-green-600">${(user.earnings || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="px-3 py-2">
                                                <span className="block text-[9px] font-black text-zinc-300 uppercase leading-none mb-1">Balance</span>
                                                <span className="text-sm font-black text-zinc-900">{user.coins || 0} <span className="text-xs text-zinc-300">C</span></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(user.id, 'verify')}
                                                disabled={loadingAction === user.id}
                                                className={`p-3 rounded-xl transition-all shadow-sm border ${user.verified ? "bg-white border-zinc-100 text-blue-500 shadow-blue-500/5 hover:bg-blue-50" : "bg-zinc-950 border-zinc-900 text-white hover:bg-zinc-800"}`}
                                                title="Toggle Verification"
                                            >
                                                {loadingAction === user.id ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Shield className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleAction(user.id, user.suspended ? 'unsuspend' : 'suspend')}
                                                disabled={loadingAction === user.id}
                                                className={`p-3 border rounded-xl transition-all shadow-sm ${user.suspended ? "bg-green-600 border-green-700 text-white hover:bg-green-500" : "bg-white border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50"}`}
                                                title={user.suspended ? "Unsuspend" : "Suspend"}
                                            >
                                                {user.suspended ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-950 transition-all shadow-sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
