
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function RevenueChart({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Summary From Subscribers</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F472B6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#F472B6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                        <CartesianGrid vertical={false} stroke="#F3F4F6" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#F472B6' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#F472B6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="revenue" stroke="#F472B6" strokeWidth={3} fill="none" dot={{ r: 4, fill: "#F472B6", strokeWidth: 2, stroke: "#FFF" }} activeDot={{ r: 6 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
