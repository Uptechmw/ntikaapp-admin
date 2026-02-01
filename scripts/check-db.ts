import { db } from '../lib/firebase-admin';

async function checkCollections() {
    console.log('--- Checking Packages ---');
    const packages = await db().collection('packages').limit(2).get();
    packages.forEach(doc => console.log(doc.id, doc.data()));

    console.log('--- Checking Transactions ---');
    const tx = await db().collection('transactions').limit(2).get();
    tx.forEach(doc => console.log(doc.id, doc.data()));

    console.log('--- Checking Users ---');
    const users = await db().collection('users').limit(2).get();
    users.forEach(doc => console.log(doc.id, { ...doc.data(), photoURL: 'HIDDEN' }));
}

// Check if being run directly
if (require.main === module) {
    checkCollections().catch(console.error);
}
