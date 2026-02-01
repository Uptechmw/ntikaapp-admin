import { db } from '../firebase-admin';

export class PackageService {
    static async getPackages() {
        try {
            const snapshot = await db().collection('packages')
                .orderBy('order', 'asc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('[PackageService] List Error:', error);
            throw error;
        }
    }

    static async updatePackage(packageId: string, data: any) {
        try {
            await db().collection('packages').doc(packageId).set({
                ...data,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('[PackageService] Update Error:', error);
            throw error;
        }
    }

    static async deletePackage(packageId: string) {
        try {
            await db().collection('packages').doc(packageId).delete();
            return true;
        } catch (error) {
            console.error('[PackageService] Delete Error:', error);
            throw error;
        }
    }
}
