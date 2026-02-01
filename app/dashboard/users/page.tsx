"use client";

import { useState } from "react";
import { Search, MoreVertical, Shield, Ban, CheckCircle } from "lucide-react";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");

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
                    />
                </div>
                <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Reported</option>
                </select>
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
                        {/* Mock Rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex-shrink-0" />
                                        <div>
                                            <div className="font-bold text-white">John Doe {i}</div>
                                            <div className="text-sm text-zinc-500">john{i}@example.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-yellow-500 font-bold">1,250 🪙</span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400">
                                    Oct 24, 2024
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                            <Shield className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 transition-colors">
                                            <Ban className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
