const admin = require('firebase-admin');
require('dotenv').config();

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

    // inferir bucket padrão se não fornecido explicitamente
    const inferredBucket = process.env.FIREBASE_STORAGE_BUCKET || (serviceAccount.project_id ? `${serviceAccount.project_id}.appspot.com` : undefined);

    if (!admin.apps.length) {
        const initOptions = {
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        };
        if (inferredBucket) initOptions.storageBucket = inferredBucket;

        admin.initializeApp(initOptions);
        if (process.env.NODE_ENV !== 'test') {
            console.log('Firebase Admin SDK inicializado com sucesso');
            if (!inferredBucket) console.warn('AVISO: storageBucket não definido. Operações com Storage poderão falhar. Defina FIREBASE_STORAGE_BUCKET no .env');
            else console.log(`Firebase storage bucket: ${inferredBucket}`);
        }
    }
} catch (error) {
    if (process.env.NODE_ENV !== 'test') {
        console.error('Erro ao inicializar Firebase Admin:', error);
        process.exit(1); // Encerra o processo se não conseguir inicializar o Firebase Admin
    } else {
        // em ambiente de teste, relançar para que o runner possa lidar ou falhar explicitamente
        throw error;
    }
}

module.exports = admin;