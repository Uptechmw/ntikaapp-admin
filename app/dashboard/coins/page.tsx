"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Coins, Loader2, Package, Sparkles } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function CoinsPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<any>(null);
    const [formData, setFormData] = useState({
        amount: 0,
        usdPrice: 0,
        badge: "",
        color: "#A855F7",
        order: 0,
        bonusText: ""
    });

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            setLoading(true);
            const data = await fetchWithAuth("/api/packages");
            setPackages(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (pkg: any = null) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                amount: pkg.amount || 0,
                usdPrice: pkg.usdPrice || 0,
                badge: pkg.badge || "",
                color: pkg.color || "#A855F7",
                order: pkg.order || 0,
                bonusText: pkg.bonusText || ""
            });
        } else {
            setEditingPackage(null);
            setFormData({
                amount: 0,
                usdPrice: 0,
                badge: "",
                color: "#A855F7",
                order: packages.length + 1,
                bonusText: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = editingPackage
                ? { id: editingPackage.id, ...formData }
                : formData;

            await fetchWithAuth("/api/packages", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            setIsModalOpen(false);
            loadPackages();
        } catch (err) {
            console.error(err);
            alert("Failed to save package");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        try {
            setLoading(true);
            await fetchWithAuth(`/api/packages?id=${id}`, {
                method: "DELETE"
            });
            loadPackages();
        } catch (err) {
            console.error(err);
            alert("Failed to delete package");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Pricing Engine</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">Coin Packages</h1>
                    <p className="text-zinc-500 font-medium">Manage monetized credit bundles and platform incentives</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-zinc-950 hover:bg-zinc-900 text-white font-black px-8 py-4 rounded-2xl transition-all flex items-center gap-3 shadow-2xl shadow-zinc-950/20 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Create Package
                </button>
            </div>

            {loading && !isModalOpen ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm border-dashed">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Syncing with Firestore...</p>
                </div>
            ) : packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <Package className="w-16 h-16 text-zinc-100 mb-6" />
                    <p className="text-zinc-400 font-bold">No active packages found in database</p>
                    <button onClick={loadPackages} className="mt-4 text-purple-600 font-bold text-sm underline underline-offset-4">Refresh data</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg, i) => (
                        <div key={pkg.id || i} className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-500 flex flex-col items-start min-h-[480px]">
                            {pkg.badge && (
                                <div className="absolute top-0 right-0 bg-zinc-950 text-white text-[10px] font-black tracking-widest px-6 py-3 rounded-bl-3xl uppercase flex items-center gap-2 border-b border-l border-zinc-800">
                                    <Sparkles className="w-3 h-3 text-orange-400" />
                                    {pkg.badge}
                                </div>
                            )}

                            <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-zinc-100">
                                <Coins className="w-10 h-10 text-zinc-900" style={{ color: pkg.color || '#A855F7' }} />
                            </div>

                            <div className="mb-auto w-full">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 block">Bundle Capacity</span>
                                <h3 className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">
                                    {(pkg.amount || pkg.coins)?.toLocaleString()}
                                    <span className="text-zinc-300 font-bold ml-2">Credits</span>
                                </h3>
                                <p className="text-zinc-400 font-bold text-sm mb-10 uppercase tracking-tight">
                                    {pkg.bonusText || (pkg.badge ? `${pkg.badge} PACKAGE` : "Standard Credit Volume")}
                                </p>

                                <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 mb-10 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors duration-500 font-mono">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-2">Unit Price:</span>
                                        <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                                            {pkg.currencySymbol || "$"}{pkg.usdPrice || pkg.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full pt-4">
                                <button
                                    onClick={() => handleOpenModal(pkg)}
                                    className="flex-1 bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-950 hover:text-white text-zinc-900 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 text-xs uppercase tracking-widest"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Configure
                                </button>
                                <button
                                    onClick={() => handleDelete(pkg.id)}
                                    className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-90"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-10">
                            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-8">
                                {editingPackage ? 'Configure Package' : 'Create New Bundle'}
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Coin Amount</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">USD Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.usdPrice}
                                            onChange={(e) => setFormData({ ...formData, usdPrice: parseFloat(e.target.value) })}
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Package Badge (e.g. POPULAR)</label>
                                    <input
                                        type="text"
                                        placeholder="Optional badge"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value.toUpperCase() })}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Brand Color</label>
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-black py-5 rounded-2xl transition-all uppercase text-xs tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] bg-zinc-950 hover:bg-zinc-900 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-zinc-950/20 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-orange-400" />}
                                        {editingPackage ? 'Update Intelligence' : 'Deploy Bundle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
