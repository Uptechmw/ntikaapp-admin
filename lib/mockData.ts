
export const MOCK_SUMMARY = {
    totalUsers: 1420,
    activeMatches: 350,
    totalRevenue: 5200,
    recentRegistrations: [
        { displayName: "Sarah Wilson", email: "sarah@example.com", createdAt: new Date().toISOString() },
        { displayName: "Mike Chen", email: "mike@example.com", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { displayName: "Jessica Alba", email: "jessica@example.com", createdAt: new Date(Date.now() - 172800000).toISOString() },
    ]
};

export const MOCK_USERS = [
    { id: "1", displayName: "Sarah Wilson", email: "sarah@example.com", coins: 150, isSuspended: false, isVerified: true, createdAt: new Date().toISOString() },
    { id: "2", displayName: "Mike Chen", email: "mike@example.com", coins: 50, isSuspended: false, isVerified: false, createdAt: new Date().toISOString() },
    { id: "3", displayName: "John Doe", email: "john@example.com", coins: 1200, isSuspended: true, isVerified: true, createdAt: new Date().toISOString() },
    { id: "4", displayName: "Test User", email: "test@example.com", coins: 0, isSuspended: false, isVerified: false, createdAt: new Date().toISOString() },
];
