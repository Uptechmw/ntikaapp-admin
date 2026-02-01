"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Shield, Ban, CheckCircle, Loader2, AlertCircle } from "lucide-react";
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
            const endpoint = searchTerm
                ? `/api/users/search?q=${encodeURIComponent(searchTerm)}`
                : "/api/users";

            const data = await fetchWithAuth(endpoint);
            setUsers(data.users || (Array.isArray(data) ? data : [])); // Handle both paginated and array responses
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
                const newStatus = !user?.isVerified;
                await fetchWithAuth(`/api/users/${userId}/verify`, {
                    method: "POST",
                    body: JSON.stringify({ verified: newStatus })
                });
            } else {
                await fetchWithAuth(`/api/users/${userId}/${action}`, { method: "POST" });
            }
            loadUsers();
        } catch (err) {
            console.error(err);
            alert("Action failed. Check console for details.");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-zinc-400">View and manage platform users</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white text-black font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or ID..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                    />
                </div>
                <button
                    onClick={() => loadUsers()}
                    className="bg-purple-600 text-white px-6 rounded-xl font-bold hover:bg-purple-700 transition"
                >
                    Search
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 text-sm font-medium uppercase">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Coins</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Loading users...
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 opacity-50" />
                                        <p>No users found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id || user.uid} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-zinc-800 rounded-full flex-shrink-0 overflow-hidden">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-purple-900 text-purple-200 font-bold">
                                                        {(user.displayName || user.email || "?")[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white flex items-center gap-1">
                                                    {user.displayName || "Unknown User"}
                                                    {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/20" />}
                                                </div>
                                                <div className="text-sm text-zinc-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.isSuspended
                                                ? "bg-red-500/10 text-red-500"
                                                : "bg-green-500/10 text-green-500"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isSuspended ? "bg-red-500" : "bg-green-500"}`} />
                                            {user.isSuspended ? "Suspended" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-yellow-500 font-bold">{user.coins || 0} 🪙</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAction(user.id || user.uid, 'verify')}
                                                disabled={loadingAction === (user.id || user.uid)}
                                                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-blue-500 transition-colors"
                                                title="Verify User"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(user.id || user.uid, user.isSuspended ? 'unsuspend' : 'suspend')}
                                                disabled={loadingAction === (user.id || user.uid)}
                                                className={`p-2 hover:bg-zinc-800 rounded-lg transition-colors ${user.isSuspended ? "text-green-500 hover:text-green-400" : "text-zinc-400 hover:text-red-500"
                                                    }`}
                                                title={user.isSuspended ? "Unsuspend" : "Suspend"}
                                            >
                                                {user.isSuspended ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
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
