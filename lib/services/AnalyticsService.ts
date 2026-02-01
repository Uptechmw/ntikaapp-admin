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

            const revenueSnapshot = await db().collection('transactions')
                .where('status', '==', 'completed')
                .get();
            let totalRevenue = 0;
            revenueSnapshot.forEach(doc => {
                totalRevenue += (doc.data().amount || 0);
            });

            return {
                totalUsers,
                activeUsers,
                totalSwipes,
                totalPodcasts: totalMatches,
                totalQuizzes: 0,
                totalRevenue,
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
        try {
            const txSnapshot = await db().collection('transactions')
                .where('status', '==', 'completed')
                .orderBy('timestamp', 'asc')
                .get();

            const monthlyRevenue: Record<string, number> = {
                "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
                "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
            };

            txSnapshot.forEach(doc => {
                const data = doc.data();
                const date = data.timestamp?.toDate?.() || new Date(data.timestamp);
                const month = date.toLocaleString('default', { month: 'short' });
                if (monthlyRevenue.hasOwnProperty(month)) {
                    monthlyRevenue[month] += (data.amount || 0);
                }
            });

            return Object.entries(monthlyRevenue).map(([name, revenue]) => ({
                name,
                revenue
            })).slice(0, new Date().getMonth() + 1);
        } catch (error) {
            console.error('[AnalyticsService] Revenue History Error:', error);
            return [];
        }
    }
}
