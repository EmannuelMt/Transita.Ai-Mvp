const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// GET /api/health - retorna status do serviço e do banco utilizado
router.get('/', async (req, res) => {
    try {
        const firebaseInfo = {
            initialized: !!(admin.apps && admin.apps.length),
            databaseURL: process.env.FIREBASE_DATABASE_URL || null
        };

        res.json({ ok: true, firebase: firebaseInfo });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

module.exports = router;
