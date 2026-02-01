"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, MoreVertical, User, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function ModerationPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'resolved' | 'all'>('pending');

    useEffect(() => {
        loadReports();
    }, [filter]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await fetchWithAuth(`/api/moderation/reports?status=${filter}`);
            setReports(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (reportId: string) => {
        try {
            await fetchWithAuth(`/api/moderation/reports/${reportId}/resolve`, {
                method: "POST",
                body: JSON.stringify({ resolution: "Resolved by admin" })
            });
            loadReports();
        } catch (err) {
            console.error(err);
            alert("Failed to resolve report");
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
                <p className="text-gray-500">Handle user reports and platform safety</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-100">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 border-b-2 font-bold text-sm transition-all ${filter === 'all' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    All Reports
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-6 py-3 border-b-2 font-bold text-sm transition-all ${filter === 'pending' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('resolved')}
                    className={`px-6 py-3 border-b-2 font-bold text-sm transition-all ${filter === 'resolved' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Resolved
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-5">Object</th>
                            <th className="px-6 py-5">Reason</th>
                            <th className="px-6 py-5">Reporter</th>
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
                                        Loading reports...
                                    </div>
                                </td>
                            </tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 opacity-20" />
                                        <p>No reports found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{report.reporterId ? "User Report" : "Content Report"}</div>
                                                <div className="text-xs text-gray-400 font-medium truncate max-w-[150px]">Target: {report.reportedUserId || "N/A"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                                        {report.reason}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-gray-900">{report.reporterId || "Anonymous"}</div>
                                        <div className="text-xs text-gray-400">
                                            {report.createdAt ? new Date(report.createdAt._seconds * 1000).toLocaleDateString() : "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${report.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                            report.status === 'resolved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                'bg-gray-50 text-gray-400 border border-gray-100'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {report.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleResolve(report.id)}
                                                        className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                                        title="Resolve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Dismiss">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-2 border border-gray-100 bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                                <MoreVertical className="w-5 h-5" />
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
