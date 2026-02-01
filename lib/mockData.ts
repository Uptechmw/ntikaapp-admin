
export const MOCK_SUMMARY = {
    totalUsers: 155000,
    activeMatches: 322, // Podcasts equivalent
    totalRevenue: 3273, // Revenue/Quizzes equivalent
    activeUsers: 37898,
    newSignups: 83832,
    subscribedPercentage: 35,
    freeMatches: 110,
    premiumMatches: 212,

    // Graph Data
    userGrowth: [
        { name: 'Jan', new: 18000, subscribed: 30000 },
        { name: 'Feb', new: 30000, subscribed: 35000 },
        { name: 'Mar', new: 20000, subscribed: 28000 },
        { name: 'Apr', new: 18000, subscribed: 42000 },
        { name: 'May', new: 25000, subscribed: 39000 },
        { name: 'Jun', new: 18000, subscribed: 39000 },
    ],
    revenueHistory: [
        { name: 'Jan', revenue: 2000 },
        { name: 'Feb', revenue: 4000 },
        { name: 'Mar', revenue: 15000 },
        { name: 'Apr', revenue: 12000 },
        { name: 'May', revenue: 20000 },
        { name: 'Jun', revenue: 22000 },
        { name: 'Jul', revenue: 18000 },
        { name: 'Aug', revenue: 26000 },
        { name: 'Sep', revenue: 29000 },
    ],

    recentRegistrations: [
        { displayName: "Sarah Wilson", email: "sarah@example.com", createdAt: new Date().toISOString() },
        { displayName: "Mike Chen", email: "mike@example.com", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { displayName: "Jessica Alba", email: "jessica@example.com", createdAt: new Date(Date.now() - 172800000).toISOString() },
    ]
};

export const MOCK_TRANSACTIONS = [
    { id: "TX1001", user: "Sarah Wilson", type: "Coin Purchase", amount: "500 Coins", status: "Completed", date: "2 mins ago" },
    { id: "TX1002", user: "Mike Chen", type: "Premium Sub", amount: "$19.99", status: "Completed", date: "1 hour ago" },
    { id: "TX1003", user: "John Doe", type: "Refund", amount: "-$9.99", status: "Processed", date: "3 hours ago" },
    { id: "TX1004", user: "Emily Davis", type: "Coin Purchase", amount: "100 Coins", status: "Completed", date: "5 hours ago" },
];

export const MOCK_USERS = [
    { id: "1", displayName: "Sarah Wilson", email: "sarah@example.com", coins: 150, isSuspended: false, isVerified: true, createdAt: new Date().toISOString() },
    { id: "2", displayName: "Mike Chen", email: "mike@example.com", coins: 50, isSuspended: false, isVerified: false, createdAt: new Date().toISOString() },
    { id: "3", displayName: "John Doe", email: "john@example.com", coins: 1200, isSuspended: true, isVerified: true, createdAt: new Date().toISOString() },
    { id: "4", displayName: "Test User", email: "test@example.com", coins: 0, isSuspended: false, isVerified: false, createdAt: new Date().toISOString() },
];
