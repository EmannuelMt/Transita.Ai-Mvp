const express = require('express');
const router = express.Router();
const adminInviteController = require('../controllers/adminInviteController');
const { authMiddleware, adminAuthMiddleware } = require('../middleware/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas que requerem privilégios de admin
router.post('/invite', adminAuthMiddleware, adminInviteController.createInvite);
router.get('/invites', adminAuthMiddleware, adminInviteController.listInvites);
router.delete('/invites/:id', adminAuthMiddleware, adminInviteController.revokeInvite);

// Rota para confirmar convite (apenas requer autenticação normal)
router.post('/confirm-invite', adminInviteController.confirmInvite);

module.exports = router;