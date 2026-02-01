"use client";

import { Save, Key, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">App Settings</h1>
                <p className="text-zinc-400">Configure system-wide settings and API keys</p>
            </div>

            <div className="space-y-6">
                {/* Payment Gateway Settings */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <Key className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Payment Gateway</h2>
                            <p className="text-zinc-400 text-sm">Configure PayChangu and Stripe keys</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">PayChangu Public Key</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                                placeholder="pub_test_..."
                                defaultValue="pub_test_8392839283928"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">PayChangu Secret Key</label>
                            <input
                                type="password"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                                placeholder="sec_test_..."
                                defaultValue="******************"
                            />
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Globe className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">General Configuration</h2>
                            <p className="text-zinc-400 text-sm">Global app parameters</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                            <div>
                                <div className="font-bold text-white">Maintenance Mode</div>
                                <div className="text-sm text-zinc-500">Disable app access for all users</div>
                            </div>
                            <div className="w-12 h-6 bg-zinc-800 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                            <div>
                                <div className="font-bold text-white">Free New User Bonus</div>
                                <div className="text-sm text-zinc-500">Give 50 coins to new signups</div>
                            </div>
                            <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
