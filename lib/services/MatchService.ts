import { db } from '../firebase-admin';

export class MatchService {
    static async getRecentMatches(limit: number = 50) {
        try {
            const snapshot = await db().collection('matches')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('[MatchService] Recent Error:', error);
            throw error;
        }
    }
}
