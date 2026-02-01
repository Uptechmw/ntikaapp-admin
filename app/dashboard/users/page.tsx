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
            const user = users.find(u => (u.id || u.uid) === userId);
            const isSuspended = user?.suspended || user?.isSuspended;
            const isVerified = user?.verified || user?.isVerified;

            if (action === 'verify') {
                const newStatus = !isVerified;
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
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-500">View and manage platform users</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border border-gray-100 p-4 rounded-3xl flex gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or ID..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                    />
                </div>
                <button
                    onClick={() => loadUsers()}
                    className="bg-purple-600 text-white px-8 rounded-2xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                >
                    Search
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-5">User</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5">Coins</th>
                            <th className="px-6 py-5">Joined</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="animate-spin w-5 h-5 text-purple-500" />
                                        Loading users...
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 opacity-20" />
                                        <p>No users found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id || user.uid} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden border border-gray-200">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                                                        {(user.displayName || user.email || "?")[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center gap-1">
                                                    {user.displayName || "Unknown User"}
                                                    {(user.verified || user.isVerified) && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/10" />}
                                                </div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${(user.suspended || user.isSuspended)
                                            ? "bg-red-50 text-red-600"
                                            : "bg-green-50 text-green-600"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${(user.suspended || user.isSuspended) ? "bg-red-500" : "bg-green-500"}`} />
                                            {(user.suspended || user.isSuspended) ? "Suspended" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900 font-bold flex items-center gap-1">
                                            {user.coins || 0}
                                            <span className="text-xs text-orange-400 font-normal">Coins</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleAction(user.id || user.uid, 'verify')}
                                                disabled={loadingAction === (user.id || user.uid)}
                                                className="p-2 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl text-gray-400 hover:text-blue-500 transition-all shadow-sm"
                                                title="Verify User"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(user.id || user.uid, (user.suspended || user.isSuspended) ? 'unsuspend' : 'suspend')}
                                                disabled={loadingAction === (user.id || user.uid)}
                                                className={`p-2 border border-transparent hover:border-gray-100 hover:bg-white rounded-xl transition-all shadow-sm ${(user.suspended || user.isSuspended) ? "text-green-500" : "text-gray-400 hover:text-red-500"
                                                    }`}
                                                title={(user.suspended || user.isSuspended) ? "Unsuspend" : "Suspend"}
                                            >
                                                {(user.suspended || user.isSuspended) ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button className="p-2 border border-transparent hover:border-gray-100 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
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
