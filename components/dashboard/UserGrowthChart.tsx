
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function UserGrowthChart({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96">
            <h3 className="text-lg font-bold text-gray-900 mb-6">User Growth</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={8} barGap={4}>
                        <CartesianGrid vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                        <Bar dataKey="new" fill="#3B82F6" radius={[4, 4, 0, 0]} name="New Sign-In" />
                        <Bar dataKey="subscribed" fill="#34D399" radius={[4, 4, 0, 0]} name="Subscribers" />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
