import { db } from '../lib/firebase-admin';

async function checkFinancials() {
    try {
        const txSnap = await db().collection('transactions').limit(5).get();
        console.log('--- Transactions (limit 5) ---');
        if (txSnap.empty) {
            console.log('No transactions found.');
        } else {
            txSnap.docs.forEach(doc => {
                console.log(doc.id, doc.data());
            });
        }

        const payoutSnap = await db().collection('payouts').limit(5).get();
        console.log('\n--- Payouts (limit 5) ---');
        if (payoutSnap.empty) {
            console.log('No payouts found.');
        } else {
            payoutSnap.docs.forEach(doc => {
                console.log(doc.id, doc.data());
            });
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkFinancials();
