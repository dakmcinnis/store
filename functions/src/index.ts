import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import app from './app';


try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
} catch (e) {
    console.error('admin.initializeApp()', e);
}

export const api = functions.https.onRequest(app);
