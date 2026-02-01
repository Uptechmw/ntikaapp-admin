"use client";

import { useState, useEffect } from "react";
import { Trash2, MessageSquare, Eye, Heart, Loader2, BookOpen, Quote, Clock, User } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function StoriesPage() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            setLoading(true);
            const data = await fetchWithAuth("/api/stories");
            setStories(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this story from the platform?")) return;
        try {
            setLoading(true);
            await fetchWithAuth(`/api/stories?id=${id}`, {
                method: "DELETE"
            });
            loadStories();
        } catch (err) {
            console.error(err);
            alert("Failed to delete story");
        } finally {
            setLoading(false);
        }
    };

    const getCategoryStyles = (id: string) => {
        switch (id) {
            case 'love-series': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500' };
            case 'confession': return { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', dot: 'bg-pink-500' };
            case 'advice': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' };
            default: return { bg: 'bg-zinc-50', text: 'text-zinc-600', border: 'border-zinc-100', dot: 'bg-zinc-500' };
        }
    };

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Feed Oversight</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Platform Stories</h1>
                    <p className="text-zinc-500 font-medium">Moderate social narratives, series, and anonymous insights</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm border-dashed">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Fetching the narrative stream...</p>
                </div>
            ) : stories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <BookOpen className="w-16 h-16 text-zinc-100 mb-6" />
                    <p className="text-zinc-400 font-bold">The feed is currently empty</p>
                    <button onClick={loadStories} className="mt-4 text-orange-600 font-bold text-sm underline underline-offset-4">Refresh feed</button>
                </div>
            ) : (
                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-50">
                                    <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Story / Category</th>
                                    <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Author</th>
                                    <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest text-center">Stats</th>
                                    <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest text-center">Earnings</th>
                                    <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest text-right">Date</th>
                                    <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {stories.map((story) => (
                                    <tr key={story.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="py-6 pr-6 max-w-sm">
                                            <div className="flex flex-col gap-2">
                                                <div className={`self-start px-2 py-1 rounded-lg border ${getCategoryStyles(story.category).border} ${getCategoryStyles(story.category).bg} inline-flex items-center gap-1.5`}>
                                                    <div className={`w-1 h-1 rounded-full ${getCategoryStyles(story.category).dot}`} />
                                                    <span className={`text-[8px] font-black uppercase tracking-wider ${getCategoryStyles(story.category).text}`}>
                                                        {story.category?.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-zinc-800 line-clamp-2 text-sm leading-relaxed">"{story.teaser}"</p>
                                                {story.parts && (
                                                    <span className="text-[10px] font-bold text-zinc-400">
                                                        {story.parts.length} Chapters
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-6 pr-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 overflow-hidden">
                                                    {story.creatorPhotoUrl ? (
                                                        <img src={story.creatorPhotoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-zinc-400" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-black text-zinc-900">@{story.creatorName || 'anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 pr-6">
                                            <div className="flex gap-4 justify-center">
                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 text-zinc-900 font-black text-xs">
                                                        <Eye className="w-3 h-3 text-blue-500" />
                                                        {story.stats?.views || 0}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 text-zinc-900 font-black text-xs">
                                                        <MessageSquare className="w-3 h-3 text-zinc-400" />
                                                        {story.stats?.commentsCount || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 pr-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 font-black text-zinc-900 text-sm">
                                                    <span className="text-purple-600">$</span>
                                                    {story.stats?.totalEarned || 0}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                                    <Loader2 className="w-3 h-3 text-orange-400" />
                                                    {story.stats?.giftsReceived || 0} Gifts
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="text-xs font-bold text-zinc-400">
                                                {new Date(story.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-6 pl-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-600 hover:text-zinc-900 hover:border-zinc-900 transition-all shadow-sm">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(story.id)}
                                                    className="p-2 bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-95"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
