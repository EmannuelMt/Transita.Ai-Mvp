const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de gerenciamento 2FA
router.post('/setup/start', twoFactorController.startSetup);
router.post('/setup/confirm', twoFactorController.confirmSetup);
router.post('/disable', twoFactorController.disable);
router.post('/validate', twoFactorController.validateToken);
router.post('/backup-codes/generate', twoFactorController.generateNewBackupCodes);

module.exports = router;