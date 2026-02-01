import * as admin from 'firebase-admin';

const initAdmin = () => {
    if (admin.apps.length) return;

    try {
        const saVar = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!saVar) {
            console.warn('FIREBASE_SERVICE_ACCOUNT missing');
            return;
        }

        const serviceAccount = JSON.parse(saVar);

        // Robust private key cleaning
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key
                .replace(/\\n/g, '\n') // Fix escaped newlines
                .replace(/\n\n/g, '\n') // Fix double newlines
                .trim();
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized');
    } catch (error: any) {
        console.error('Firebase Admin init error:', error.message);
        // We don't throw here to allow the build to continue if it's just a build-time check
    }
};

const getDb = () => {
    initAdmin();
    if (!admin.apps.length) {
        throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT.");
    }
    return admin.firestore();
};

const getAuth = () => {
    initAdmin();
    if (!admin.apps.length) {
        throw new Error("Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT.");
    }
    return admin.auth();
};

export { getDb as db, getAuth as auth, admin };
