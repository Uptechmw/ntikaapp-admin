
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string; // Tailwind color class for icon background e.g. "bg-pink-500"
}

export default function StatCard({ title, value, subtext, icon: Icon, trend, trendUp, color = "bg-purple-600" }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {trend}
                    </span>
                )}
                <span className="text-xs text-gray-400">{subtext}</span>
            </div>
        </div>
    );
}
