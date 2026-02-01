
"use client";

import { AlertTriangle, CheckCircle, XCircle, MoreVertical, User, MessageCircle } from "lucide-react";

const MOCK_REPORTS = [
    { id: "1", type: "User Profile", reason: "Inappropriate Content", reporter: "Arya Stark", target: "John Doe", status: "Pending", date: "2 mins ago" },
    { id: "2", type: "Comment", reason: "Harassment", reporter: "Mike Chen", target: "Sarah Wilson", status: "Resolved", date: "1 hour ago" },
    { id: "3", type: "Post", reason: "Spam", reporter: "Jessica Alba", target: "Test User 01", status: "Ignored", date: "3 hours ago" },
];

export default function ModerationPage() {
    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
                <p className="text-gray-500">Handle user reports and platform safety</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-100">
                <button className="px-6 py-3 border-b-2 border-purple-600 text-purple-600 font-bold text-sm">All Reports</button>
                <button className="px-6 py-3 text-gray-400 font-bold text-sm hover:text-gray-600">Pending</button>
                <button className="px-6 py-3 text-gray-400 font-bold text-sm hover:text-gray-600">Resolved</button>
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
                        {MOCK_REPORTS.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-opacity-10 ${report.type === 'User Profile' ? 'bg-blue-600 text-blue-600' : 'bg-orange-600 text-orange-600'
                                            }`}>
                                            {report.type === 'User Profile' ? <User className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{report.type}</div>
                                            <div className="text-xs text-gray-400 font-medium">Target: {report.target}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                                    {report.reason}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-sm font-bold text-gray-900">{report.reporter}</div>
                                    <div className="text-xs text-gray-400">{report.date}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${report.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                            report.status === 'Resolved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                'bg-gray-50 text-gray-400 border border-gray-100'
                                        }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 border border-gray-100 bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                            <MoreVertical className="w-5 h-5" />
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
