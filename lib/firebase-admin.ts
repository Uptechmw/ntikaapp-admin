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

        // Extremely robust private key cleaning
        if (serviceAccount.private_key) {
            let key = serviceAccount.private_key;

            // 1. Convert literal \n to actual newlines
            key = key.replace(/\\n/g, '\n');

            // 2. Remove any accidentally doubled backslashes
            key = key.replace(/\\\\n/g, '\n');

            // 3. Bulletproof re-construction
            // This regex captures the base64 content between any variation of the labels
            const bodyMatch = key.match(/BEGIN PRIVATE KEY[\s\-]+([\s\S]+?)[\s\-]+END PRIVATE KEY/);

            if (bodyMatch && bodyMatch[1]) {
                const base64Part = bodyMatch[1].replace(/\s+/g, ''); // Remove all newlines/spaces
                key = `-----BEGIN PRIVATE KEY-----\n${base64Part}\n-----END PRIVATE KEY-----\n`;
            }

            serviceAccount.private_key = key.trim();
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
