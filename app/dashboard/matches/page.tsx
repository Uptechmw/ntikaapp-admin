
"use client";

import { useState } from "react";
import { Search, Mic, Plus, MoreVertical, Globe, Lock, Clock } from "lucide-react";

const MOCK_MATCHES = [
    { id: "1", title: "Midnight Confessions", user: "Arya Stark", status: "Published", duration: "12:45", category: "Relationship", type: "Free" },
    { id: "2", title: "Business Strategy 101", user: "John Doe", status: "Draft", duration: "08:12", category: "Education", type: "Premium" },
    { id: "3", title: "Daily Motivation", user: "Sarah Wilson", status: "Published", duration: "15:00", category: "Lifestyle", type: "Free" },
    { id: "4", title: "Tech Trends 2026", user: "Mike Chen", status: "Review", duration: "22:30", category: "Technology", type: "Premium" },
];

export default function MatchesPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Matches</h1>
                    <p className="text-gray-500">Administered podcasts and audio content</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-purple-100">
                    <Plus className="w-5 h-5" />
                    New Podcast
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-100 p-4 rounded-3xl flex gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search podcasts by title, user, or category..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                    />
                </div>
                <button className="bg-gray-50 border border-gray-200 text-gray-700 px-6 rounded-2xl font-bold hover:bg-white transition">
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-5">Podcast / Match</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5">Access</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MOCK_MATCHES.map((match) => (
                            <tr key={match.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center border border-orange-200 shadow-sm shadow-orange-50">
                                            <Mic className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 truncate max-w-[200px]">{match.title}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {match.duration}</span>
                                                <span className="font-medium text-gray-400">by {match.user}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm text-gray-600 font-medium">{match.category}</span>
                                </td>
                                <td className="px-6 py-5">
                                    {match.type === 'Premium' ? (
                                        <span className="inline-flex items-center gap-1 text-purple-600 font-bold text-xs bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                            <Lock className="w-3 h-3" /> Premium
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                            <Globe className="w-3 h-3" /> Free
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${match.status === 'Published' ? 'bg-green-500' : match.status === 'Draft' ? 'bg-gray-400' : 'bg-yellow-500'
                                            }`} />
                                        <span className="text-sm font-bold text-gray-700">{match.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button className="p-2 border border-transparent hover:border-gray-100 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
