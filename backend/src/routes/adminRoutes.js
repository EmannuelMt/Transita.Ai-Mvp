
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const AdminController = require('../controllers/AdminController');
const AdminInviteController = require('../controllers/AdminInviteController');

// Endpoint temporário para conceder superadmin ao usuário autenticado
router.post('/grant-superadmin', auth, async (req, res) => {
    const userService = require('../services/userService');
    try {
        const user = await userService.updateById(req.user.id, { isAdmin: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Health-check for admin privileges
router.get('/check', auth, AdminController.check);

// Users
router.get('/users', auth, adminAuth, AdminController.listUsers);
router.get('/users/:id', auth, adminAuth, AdminController.getUser);
router.put('/users/:id', auth, adminAuth, AdminController.updateUser);
router.delete('/users/:id', auth, adminAuth, AdminController.deleteUser);

// Subscriptions
router.get('/subscriptions', auth, adminAuth, AdminController.listSubscriptions);
router.put('/subscriptions/:id', auth, adminAuth, AdminController.updateSubscription);
router.delete('/subscriptions/:id', auth, adminAuth, AdminController.deleteSubscription);

// Multas

// Activity Log
const ActivityController = require('../controllers/ActivityController');
router.get('/activity', auth, adminAuth, ActivityController.list);

router.get('/multas', auth, adminAuth, AdminController.listMultas);
router.put('/multas/:id', auth, adminAuth, AdminController.updateMulta);
router.delete('/multas/:id', auth, adminAuth, AdminController.deleteMulta);

// Invites
router.post('/invites', auth, adminAuth, AdminInviteController.createInvite);
router.get('/invites', auth, adminAuth, AdminInviteController.listInvites);
router.post('/invites/:id/revoke', auth, adminAuth, AdminInviteController.revokeInvite);

module.exports = router;
