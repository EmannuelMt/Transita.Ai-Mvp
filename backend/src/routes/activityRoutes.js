const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ActivityController = require('../controllers/ActivityController');

router.get('/', auth, ActivityController.list);
router.post('/', auth, ActivityController.create);

module.exports = router;
