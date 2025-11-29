const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const PaymentHistoryController = require('../controllers/PaymentHistoryController');

router.get('/', auth, PaymentHistoryController.list);
router.get('/:id', auth, PaymentHistoryController.get);
router.post('/', auth, PaymentHistoryController.create);

module.exports = router;
