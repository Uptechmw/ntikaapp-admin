import { db, admin } from '../firebase-admin';

export class ModerationService {
    static async getReports(status: 'pending' | 'resolved' | 'all' = 'pending', limit: number = 100) {
        try {
            let query = db.collection('reports').orderBy('createdAt', 'desc');

            if (status !== 'all') {
                query = query.where('status', '==', status) as any;
            }

            const snapshot = await query.limit(limit).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('[ModerationService] Get Error:', error);
            throw error;
        }
    }

    static async resolveReport(reportId: string, resolution: string, adminId: string) {
        try {
            await db.collection('reports').doc(reportId).update({
                status: 'resolved',
                resolution,
                resolvedBy: adminId,
                resolvedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('[ModerationService] Resolve Error:', error);
            throw error;
        }
    }
}
