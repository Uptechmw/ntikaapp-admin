import { db, admin } from '../firebase-admin';

export class AnalyticsService {
    static async getPlatformStats() {
        try {
            const usersSnapshot = await db().collection('users').count().get();
            const totalUsers = usersSnapshot.data().count;

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const activeUsersSnapshot = await db().collection('users')
                .where('lastActive', '>=', admin.firestore.Timestamp.fromDate(sevenDaysAgo))
                .count()
                .get();
            const activeUsers = activeUsersSnapshot.data().count;

            const swipesSnapshot = await db().collection('analytics_events')
                .where('event', '==', 'swipe')
                .count()
                .get();
            const totalSwipes = swipesSnapshot.data().count;

            const matchesSnapshot = await db().collection('matches').count().get();
            const totalMatches = matchesSnapshot.data().count;

            return {
                totalUsers,
                activeUsers,
                totalSwipes,
                totalPodcasts: totalMatches,
                totalQuizzes: 0,
                totalRevenue: 0,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('[AnalyticsService] Error:', error);
            throw error;
        }
    }

    static async getUserGrowth(days: number = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const snapshot = await db().collection('users')
                .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
                .orderBy('createdAt', 'asc')
                .get();

            const dailyCounts: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const date = data.createdAt?.toDate().toISOString().split('T')[0];
                if (date) {
                    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
                }
            });

            return Object.entries(dailyCounts).map(([date, count]) => ({
                date,
                count
            }));
        } catch (error) {
            console.error('[AnalyticsService] Growth Error:', error);
            throw error;
        }
    }

    static async getTopEvents(limit: number = 10) {
        try {
            const snapshot = await db().collection('analytics_events')
                .orderBy('timestamp', 'desc')
                .limit(100)
                .get();

            const eventCounts: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
                const event = doc.data().event;
                eventCounts[event] = (eventCounts[event] || 0) + 1;
            });

            return Object.entries(eventCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([event, count]) => ({ event, count }));
        } catch (error) {
            console.error('[AnalyticsService] Events Error:', error);
            throw error;
        }
    }

    static async getRevenueHistory() {
        return [
            { name: "Jan", revenue: 0 },
            { name: "Feb", revenue: 0 },
            { name: "Mar", revenue: 0 },
            { name: "Apr", revenue: 0 },
            { name: "May", revenue: 0 },
            { name: "Jun", revenue: 0 },
        ];
    }
}
