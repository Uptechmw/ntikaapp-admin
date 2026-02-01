"use client";

import { Plus, Edit2, Trash2, Coins } from "lucide-react";

export default function CoinsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Coin Packages</h1>
                    <p className="text-gray-500">Manage coin bundles and pricing for users</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-purple-200">
                    <Plus className="w-5 h-5" />
                    Add Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Package Card 1 */}
                {[
                    { coins: 100, price: "$4.99", bonus: "No bonus", color: "bg-purple-600" },
                    { coins: 500, price: "$19.99", bonus: "+50 Bonus", color: "bg-blue-600", featured: true },
                    { coins: 1500, price: "$49.99", bonus: "+200 Bonus", color: "bg-orange-500" },
                ].map((pkg, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        {pkg.featured && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-bl-2xl uppercase">
                                Popular
                            </div>
                        )}

                        <div className={`w-16 h-16 ${pkg.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-8`}>
                            <Coins className={`w-8 h-8 ${pkg.color.replace('bg-', 'text-')}`} />
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 mb-1">{pkg.coins} <span className="text-gray-400 text-lg font-bold">Coins</span></h3>
                        <p className="text-gray-500 text-sm mb-8 font-medium">{pkg.bonus}</p>

                        <div className="flex items-baseline gap-1 mb-10">
                            <span className="text-4xl font-black text-gray-900">{pkg.price}</span>
                            <span className="text-gray-400 text-sm">/ pack</span>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button className="p-3.5 bg-red-50 text-red-500 border border-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm group">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
