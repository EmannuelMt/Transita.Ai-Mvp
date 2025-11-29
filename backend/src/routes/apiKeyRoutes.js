const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ApiKeyController = require('../controllers/ApiKeyController');

router.get('/', auth, ApiKeyController.getKey);
router.post('/generate', auth, ApiKeyController.generateKey);
router.post('/revoke', auth, ApiKeyController.revokeKey);

module.exports = router;
