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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {stories.map((story) => (
                        <div key={story.id} className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500 flex flex-col">

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 overflow-hidden">
                                        {story.creatorPhotoUrl ? (
                                            <img src={story.creatorPhotoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-zinc-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-zinc-900">@{story.creatorName || 'anonymous'}</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-zinc-300" />
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                                                {new Date(story.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${getCategoryStyles(story.category).border} ${getCategoryStyles(story.category).bg}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${getCategoryStyles(story.category).dot}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${getCategoryStyles(story.category).text}`}>
                                        {story.category?.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 mb-10">
                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-4 w-12 h-12 text-zinc-50 -z-0" />
                                    <p className="text-xl font-bold text-zinc-800 leading-relaxed relative z-10 italic">
                                        "{story.teaser}"
                                    </p>
                                </div>
                                {story.parts && (
                                    <div className="mt-6 flex gap-2">
                                        <div className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                            {story.parts.length} Chapters
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-4 pb-8 border-b border-zinc-50 mb-8">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Views</p>
                                    <div className="flex items-center justify-center gap-1.5 font-black text-zinc-900">
                                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                                        {story.stats?.views || 0}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Earned</p>
                                    <div className="flex items-center justify-center gap-1.5 font-black text-zinc-900">
                                        <Heart className="w-3.5 h-3.5 text-purple-500" />
                                        {story.stats?.totalEarned || 0}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Gifts</p>
                                    <div className="flex items-center justify-center gap-1.5 font-black text-zinc-900">
                                        <Loader2 className="w-3.5 h-3.5 text-orange-500" />
                                        {story.stats?.giftsReceived || 0}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Replies</p>
                                    <div className="flex items-center justify-center gap-1.5 font-black text-zinc-900">
                                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                                        {story.stats?.commentsCount || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    className="flex-1 bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-950 hover:text-white text-zinc-900 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 text-xs uppercase tracking-widest"
                                >
                                    Review Content
                                </button>
                                <button
                                    onClick={() => handleDelete(story.id)}
                                    className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-90"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
