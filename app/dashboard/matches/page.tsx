"use client";

import { useState, useEffect } from "react";
import { Search, Mic, Plus, MoreVertical, Globe, Lock, Clock, Loader2, AlertCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function MatchesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            setLoading(true);
            // Using analytics recent matches for now as a general list
            const data = await fetchWithAuth("/api/analytics/matches/recent");
            setMatches(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMatches = matches.filter(m =>
        m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="animate-spin w-5 h-5 text-purple-500" />
                                        Loading matches...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredMatches.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 opacity-20" />
                                        <p>No matches found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredMatches.map((match) => (
                                <tr key={match.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center border border-orange-200 shadow-sm shadow-orange-50">
                                                <Mic className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 truncate max-w-[200px]">{match.title || "Untitled"}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {match.duration || "N/A"}</span>
                                                    <span className="font-medium text-gray-400">by {match.user || "Unknown"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-gray-600 font-medium">{match.category || "General"}</span>
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
                                            <span className={`w-2 h-2 rounded-full ${match.status === 'active' || match.status === 'Published' ? 'bg-green-500' : match.status === 'Draft' ? 'bg-gray-400' : 'bg-yellow-500'
                                                }`} />
                                            <span className="text-sm font-bold text-gray-700 capitalize">{match.status || "Pending"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 border border-transparent hover:border-gray-100 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
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
