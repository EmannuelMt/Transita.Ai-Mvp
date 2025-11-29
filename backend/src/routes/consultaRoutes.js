const express = require('express');
const router = express.Router();
const ConsultaController = require('../controllers/ConsultaController');
const auth = require('../middlewares/auth');
const checkPlan = require('../middlewares/checkPlan');

router.post('/', auth, checkPlan, ConsultaController.create);
router.get('/:id', auth, ConsultaController.getById);
router.get('/', auth, ConsultaController.list);

module.exports = router;