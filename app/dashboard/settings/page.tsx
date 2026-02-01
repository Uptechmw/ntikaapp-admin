"use client";

import { useState, useEffect } from "react";
import { Save, Key, Globe, Brain, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const [settings, setSettings] = useState({
        ai: {
            geminiKey: "",
            model: "gemini-2.5-flash-lite"
        },
        pawapay: {
            environment: "sandbox",
            live: { baseUrl: "https://api.pawapay.io/v2", token: "" },
            sandbox: { baseUrl: "https://api.sandbox.pawapay.io/v2", token: "" }
        }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await fetchWithAuth('/api/settings');
            setSettings(data);
        } catch (err: any) {
            console.error(err);
            setStatus({ type: 'error', msg: "Failed to load settings" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            await fetchWithAuth('/api/settings', {
                method: 'POST',
                body: JSON.stringify(settings)
            });
            setStatus({ type: 'success', msg: "Settings saved successfully!" });
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            console.error(err);
            setStatus({ type: 'error', msg: err.message || "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">App Settings</h1>
                    <p className="text-gray-500">Configure AI models and PawaPay integrations</p>
                </div>

                <div className="flex items-center gap-4">
                    {status && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.msg}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-purple-600 text-white font-bold px-10 py-3.5 rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-100 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Saving...' : 'Save All'}
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* AI Configuration */}
                <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">AI Intelligence</h2>
                            <p className="text-gray-500 text-sm">Configure Google Gemini API for smart features</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Gemini API Key</label>
                            <input
                                type="password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm transition-all"
                                value={settings.ai.geminiKey}
                                onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, geminiKey: e.target.value } })}
                                placeholder="AIzaSy..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Model Version</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all appearance-none cursor-pointer"
                                value={settings.ai.model}
                                onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, model: e.target.value } })}
                            >
                                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* PawaPay Integration */}
                <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                <Key className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">PawaPay Payments</h2>
                                <p className="text-gray-500 text-sm">Manage mobile money integration across Africa</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                            <button
                                onClick={() => setSettings({ ...settings, pawapay: { ...settings.pawapay, environment: 'sandbox' } })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${settings.pawapay.environment === 'sandbox'
                                        ? 'bg-orange-100 text-orange-700 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                SANDBOX
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, pawapay: { ...settings.pawapay, environment: 'live' } })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${settings.pawapay.environment === 'live'
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                LIVE
                            </button>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Selected Environment Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                            <div className="col-span-full">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                                    {settings.pawapay.environment} Credentials
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 ml-1">API Endpoint URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all"
                                    value={settings.pawapay.environment === 'live' ? settings.pawapay.live.baseUrl : settings.pawapay.sandbox.baseUrl}
                                    onChange={(e) => {
                                        const env = settings.pawapay.environment as 'live' | 'sandbox';
                                        setSettings({
                                            ...settings,
                                            pawapay: {
                                                ...settings.pawapay,
                                                [env]: { ...settings.pawapay[env], baseUrl: e.target.value }
                                            }
                                        });
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Authentication Token</label>
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm transition-all"
                                    value={settings.pawapay.environment === 'live' ? settings.pawapay.live.token : settings.pawapay.sandbox.token}
                                    placeholder="Enter JWT token..."
                                    onChange={(e) => {
                                        const env = settings.pawapay.environment as 'live' | 'sandbox';
                                        setSettings({
                                            ...settings,
                                            pawapay: {
                                                ...settings.pawapay,
                                                [env]: { ...settings.pawapay[env], token: e.target.value }
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Policies */}
                <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Platform Policies</h2>
                            <p className="text-gray-500 text-sm">Control global app behavior and access</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 opacity-60">
                            <div>
                                <div className="font-bold text-gray-900">Maintenance Mode</div>
                                <div className="text-xs text-gray-500 font-medium">Coming Soon</div>
                            </div>
                            <div className="w-14 h-7 bg-gray-200 rounded-full relative">
                                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 opacity-60">
                            <div>
                                <div className="font-bold text-gray-900">New User Bonus</div>
                                <div className="text-xs text-gray-500 font-medium">Coming Soon</div>
                            </div>
                            <div className="w-14 h-7 bg-gray-200 rounded-full relative">
                                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
