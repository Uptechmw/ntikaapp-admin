"use client";

import { Save, Key, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">App Settings</h1>
                    <p className="text-gray-500">Configure system-wide parameters and API integrations</p>
                </div>
                <button className="bg-purple-600 text-white font-bold px-10 py-3.5 rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-100">
                    <Save className="w-5 h-5" />
                    Save All
                </button>
            </div>

            <div className="space-y-8">
                {/* Payment Gateway Settings */}
                <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <Key className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Payment Gateway</h2>
                            <p className="text-gray-500 text-sm">Configure PayChangu and Stripe credentials</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">PayChangu Public Key</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm transition-all"
                                placeholder="pub_test_..."
                                defaultValue="pub_test_8392839283928"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">PayChangu Secret Key</label>
                            <input
                                type="password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm transition-all"
                                placeholder="sec_test_..."
                                defaultValue="******************"
                            />
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">General Configuration</h2>
                            <p className="text-gray-500 text-sm">Global application behaviors</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group">
                            <div>
                                <div className="font-bold text-gray-900 group-hover:text-black">Maintenance Mode</div>
                                <div className="text-xs text-gray-500 font-medium">Block all non-admin access</div>
                            </div>
                            <div className="w-14 h-7 bg-gray-200 rounded-full relative transition-colors duration-300">
                                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-purple-100 hover:border-purple-200 transition-all cursor-pointer group shadow-sm shadow-purple-50">
                            <div>
                                <div className="font-bold text-gray-900 group-hover:text-black">New User Bonus</div>
                                <div className="text-xs text-gray-500 font-medium">Reward signups with 50 coins</div>
                            </div>
                            <div className="w-14 h-7 bg-purple-600 rounded-full relative transition-colors duration-300">
                                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
