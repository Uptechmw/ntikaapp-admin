import { db, admin } from '../firebase-admin';

export class UserService {
    static async getUsers(limit: number = 100) {
        try {
            const snapshot = await db().collection('users')
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            const users = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();

                // Get user earnings from transactions if possible
                let earnings = 0;
                try {
                    const txSnapshot = await db().collection('transactions')
                        .where('userId', '==', doc.id)
                        .where('status', '==', 'completed')
                        .get();

                    txSnapshot.forEach(tx => {
                        const txData = tx.data();
                        earnings += (txData.amount || 0);
                    });
                } catch (e) {
                    // Silently fail if transactions dont exist yet
                }

                return {
                    id: doc.id,
                    ...data,
                    earnings,
                    displayName: data.displayName || data.name || "Unknown User",
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString()
                };
            }));

            return users;
        } catch (error) {
            console.error('[UserService] List Error:', error);
            throw error;
        }
    }

    static async searchUsers(query: string) {
        try {
            // Simple email search for admin purposes
            const snapshot = await db().collection('users')
                .where('email', '>=', query)
                .where('email', '<=', query + '\uf8ff')
                .limit(50)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('[UserService] Search Error:', error);
            throw error;
        }
    }

    static async suspendUser(userId: string, status: boolean) {
        try {
            await db().collection('users').doc(userId).update({
                suspended: status,
                suspendedAt: status ? admin.firestore.FieldValue.serverTimestamp() : null
            });
            return true;
        } catch (error) {
            console.error('[UserService] Suspend Error:', error);
            throw error;
        }
    }

    static async verifyUser(userId: string, status: boolean) {
        try {
            await db().collection('users').doc(userId).update({
                verified: status,
                verifiedAt: status ? admin.firestore.FieldValue.serverTimestamp() : null
            });
            return true;
        } catch (error) {
            console.error('[UserService] Verify Error:', error);
            throw error;
        }
    }
}
