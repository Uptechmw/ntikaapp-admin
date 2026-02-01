"use client";

import { Plus, Edit2, Trash2, Coins } from "lucide-react";

export default function CoinsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Coin Packages</h1>
                    <p className="text-zinc-400">Manage coin bundles and pricing</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-900/20">
                    <Plus className="w-5 h-5" />
                    Add Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Package Card 1 */}
                {[
                    { coins: 100, price: "$4.99", bonus: "No bonus", color: "bg-purple-500" },
                    { coins: 500, price: "$19.99", bonus: "+50 Bonus", color: "bg-blue-500", featured: true },
                    { coins: 1500, price: "$49.99", bonus: "+200 Bonus", color: "bg-yellow-500" },
                ].map((pkg, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-all">
                        {pkg.featured && (
                            <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                                MOST POPULAR
                            </div>
                        )}

                        <div className={`w-14 h-14 ${pkg.color} bg-opacity-20 rounded-2xl flex items-center justify-center mb-6`}>
                            <Coins className={`w-8 h-8 text-${pkg.color.replace('bg-', '')}`} />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-1">{pkg.coins} Coins</h3>
                        <p className="text-zinc-400 text-sm mb-6">{pkg.bonus}</p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-3xl font-bold text-white">{pkg.price}</span>
                            <span className="text-zinc-500">/one-time</span>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-zinc-950 border border-zinc-800 hover:bg-ziinc-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:border-zinc-600 transition-all">
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
