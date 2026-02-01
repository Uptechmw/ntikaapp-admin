import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

            // Fix private key formatting (newlines)
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }

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

const getDb = () => {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT.");
    }
    return admin.firestore();
};

const getAuth = () => {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT.");
    }
    return admin.auth();
};

export { getDb as db, getAuth as auth, admin };
