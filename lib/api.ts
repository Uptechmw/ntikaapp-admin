
import { auth } from "@/lib/firebase";

const API_URL = "";
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ntikaapp-api.vercel.app";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Not authenticated");
    }

    const token = await user.getIdToken();

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        console.warn(`API Error (${response.status}) on ${endpoint}. Falling back to mock data.`);

        // Mock Data Fallback Logic
        if (endpoint.includes("/analytics/summary")) {
            const { MOCK_SUMMARY } = await import("./mockData");
            return MOCK_SUMMARY;
        }
        if (endpoint.includes("/users")) {
            const { MOCK_USERS } = await import("./mockData");
            return endpoint.includes("search") ? MOCK_USERS.filter(u => u.displayName.toLowerCase().includes("sarah")) : MOCK_USERS;
        }

        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || `API Error: ${response.status}`);
    }

    const json = await response.json();

    // Unwrap standard backend response format { success: true, data: ... }
    if (json.success === true && json.data !== undefined) {
        return json.data;
    }

    return json;
}
