
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
        const error = await response.json().catch(() => ({}));
        const errorMessage = error.error || error.message || `API Error: ${response.status}`;
        console.error(`API Error on ${endpoint}:`, errorMessage);

        // Throw real error so we can recognize connection issues
        throw new Error(errorMessage);
    }

    const json = await response.json();

    // Unwrap standard backend response format { success: true, data: ... }
    if (json.success === true && json.data !== undefined) {
        return json.data;
    }

    return json;
}
