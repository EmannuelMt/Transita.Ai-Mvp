const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const PagamentoController = require('../controllers/PagamentoController');

// Criar pagamento
router.post('/', auth, (req, res) => PagamentoController.criarPagamento(req, res));

// Webhook (gateway) - protegido por segredo
const webhookMiddleware = require('../middlewares/webhook');
router.post('/webhook', webhookMiddleware, (req, res) => PagamentoController.webhookPagamento(req, res));

// Verificar status
router.get('/status/:transactionId', auth, (req, res) => PagamentoController.verificarStatus(req, res));

// Confirmar pagamento manual (teste/admin) - protegido
router.post('/confirm', auth, (req, res) => PagamentoController.confirmarPagamento(req, res));
// Reverter pagamento manual (teste/admin) - protegido
router.post('/revert', auth, (req, res) => PagamentoController.reverterPagamento(req, res));

module.exports = router;
