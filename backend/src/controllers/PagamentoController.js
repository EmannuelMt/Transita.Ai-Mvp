const PaymentService = require('../services/PaymentService');
const multaService = require('../services/multaService');
const paymentHistoryService = require('../services/paymentHistoryService');
const { handleError } = require('../utils/errorHandler');
const Joi = require('joi');

class PagamentoController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    async criarPagamento(req, res) {
        try {
            const schema = Joi.object({
                multasIds: Joi.array().items(Joi.string()).min(1).required(),
                metodoPagamento: Joi.string().valid('pix', 'boleto', 'cartao_credito', 'cartao_debito', 'paypal').required()
            });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const { multasIds, metodoPagamento } = req.body;

            // Buscar multas e verificar propriedade
            const multas = await Promise.all(multasIds.map(id => multaService.getById(id)));
            const pendentes = multas.filter(m => m && m.status === 'pendente');
            if (pendentes.length === 0) return res.status(404).json({ message: 'Nenhuma multa encontrada' });

            // Criar transação no gateway
            const pagamento = await this.paymentService.criarPagamento(pendentes, metodoPagamento);

            // Criar registro no histórico de pagamentos
            const valorTotal = pendentes.reduce((total, m) => total + (m.valor || 0), 0);
            await paymentHistoryService.create({ userId: req.user.id, valor: valorTotal, metodo: metodoPagamento, status: pagamento.status === 'paid' ? 'aprovado' : 'pendente', idTransacao: pagamento.transactionId, linkRecibo: pagamento.paymentUrl || null, meta: { multas: pendentes.map(m => m.id) }, data: new Date().toISOString() });

            // Atualizar status das multas para 'processando'
            await Promise.all(pendentes.map(m => multaService.update(m.id, { status: 'processando', paymentReference: pagamento.transactionId })));

            res.json({
                transactionId: pagamento.transactionId,
                status: pagamento.status,
                paymentUrl: pagamento.paymentUrl,
                qrCode: pagamento.qrCode
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async webhookPagamento(req, res) {
        try {
            const schema = Joi.object({ transactionId: Joi.string().required(), status: Joi.string().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const { transactionId, status } = req.body;

            // Verificar assinatura do webhook
            // Implementar verificação de segurança conforme gateway

            // Atualizar status das multas
            if (status === 'paid') {
                const all = await require('../services/realtimeDb').get('/multas') || {};
                const keys = Object.keys(all).filter(k => all[k].paymentReference === transactionId);
                await Promise.all(keys.map(k => multaService.update(k, { status: 'paga' })));
            } else if (status === 'failed') {
                const all = await require('../services/realtimeDb').get('/multas') || {};
                const keys = Object.keys(all).filter(k => all[k].paymentReference === transactionId);
                await Promise.all(keys.map(k => multaService.update(k, { status: 'pendente', paymentReference: null })));
            }

            res.json({ success: true });
        } catch (error) {
            handleError(res, error);
        }
    }

    async verificarStatus(req, res) {
        try {
            const { transactionId } = req.params;
            const status = await this.paymentService.verificarStatus(transactionId);
            res.json({ status });
        } catch (error) {
            handleError(res, error);
        }
    }

    // Endpoint de teste/admin para confirmar pagamento manualmente (marcar como paid)
    async confirmarPagamento(req, res) {
        try {
            const schema = Joi.object({ transactionId: Joi.string().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const { transactionId } = req.body;

            // Atualizar multas ligadas à transação
            // Atualizar multas ligadas à transação
            const all = await require('../services/realtimeDb').get('/multas') || {};
            const keys = Object.keys(all).filter(k => all[k].paymentReference === transactionId);
            await Promise.all(keys.map(k => multaService.update(k, { status: 'paga' })));

            // Atualizar histórico de pagamentos
            const ph = await paymentHistoryService.findByTransactionId ? await paymentHistoryService.findByTransactionId(transactionId) : await paymentHistoryService.findByTransactionId(transactionId);
            if (ph) await paymentHistoryService.updateById(ph.id, { status: 'aprovado' });

            res.json({ success: true });
        } catch (error) {
            handleError(res, error);
        }
    }

    // Reverter pagamento - marcar como falhou / pendente
    async reverterPagamento(req, res) {
        try {
            const schema = Joi.object({ transactionId: Joi.string().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const { transactionId } = req.body;

            const all2 = await require('../services/realtimeDb').get('/multas') || {};
            const keys2 = Object.keys(all2).filter(k => all2[k].paymentReference === transactionId);
            await Promise.all(keys2.map(k => multaService.update(k, { status: 'pendente', paymentReference: null })));
            const ph2 = await paymentHistoryService.findByTransactionId(transactionId);
            if (ph2) await paymentHistoryService.updateById(ph2.id, { status: 'falhou' });

            res.json({ success: true });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new PagamentoController();