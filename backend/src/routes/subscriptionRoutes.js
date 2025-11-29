const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const SubscriptionController = require('../controllers/SubscriptionController');

router.get('/', auth, SubscriptionController.getSubscription);
router.post('/', auth, SubscriptionController.createOrUpdate);
router.put('/', auth, SubscriptionController.createOrUpdate);
router.post('/cancel', auth, SubscriptionController.cancelSubscription);

module.exports = router;
