import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin initialized successfully in Next.js');
        } else {
            console.warn('FIREBASE_SERVICE_ACCOUNT not found in environment. Server-side Firebase features will be restricted.');
        }
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
