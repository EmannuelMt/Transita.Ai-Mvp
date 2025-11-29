const express = require('express');
const router = express.Router();
const AdminInviteController = require('../controllers/AdminInviteController');
const auth = require('../middlewares/auth');

// confirm invite: user must be authenticated (so we know who is accepting)
router.post('/confirm', auth, AdminInviteController.confirmInvite);

module.exports = router;
