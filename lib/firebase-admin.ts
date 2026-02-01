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

            // 3. Normalize the PEM header/footer if they are slightly malformed
            // Search for "BEGIN PRIVATE KEY" and ensure it has 5 dashes
            const beginMatch = key.match(/BEGIN PRIVATE KEY/);
            const endMatch = key.match(/END PRIVATE KEY/);

            if (beginMatch && endMatch) {
                // Extract just the base64 part between any kind of dashes/labels
                // This fix handles cases where dashes were lost or doubled
                const base64Part = key
                    .split(/-----BEGIN [^-]+-----/)[1]
                    ?.split(/-----END [^-]+-----/)[0]
                    ?.replace(/\s+/g, ''); // Remove all whitespace/newlines from base64

                if (base64Part) {
                    // Reconstruct perfectly
                    key = `-----BEGIN PRIVATE KEY-----\n${base64Part}\n-----END PRIVATE KEY-----\n`;
                }
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
