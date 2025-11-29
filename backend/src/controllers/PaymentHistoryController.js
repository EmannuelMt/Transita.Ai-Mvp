const paymentHistoryService = require('../services/paymentHistoryService');
const { handleError } = require('../utils/errorHandler');
const Joi = require('joi');

class PaymentHistoryController {
    async list(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            // simple list: read all and filter by userId
            const all = await paymentHistoryService.findAll ? await paymentHistoryService.findAll() : await (async () => { const a = await require('../services/realtimeDb').get('/paymentHistory') || {}; return Object.keys(a).map(k => ({ id: k, ...a[k] })); })();
            const docs = all.filter(d => d.userId === req.user.id).sort((a, b) => new Date(b.data) - new Date(a.data)).slice((page - 1) * limit, (page - 1) * limit + Number(limit));
            const total = all.filter(d => d.userId === req.user.id).length;
            res.json({ items: docs, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
        } catch (error) {
            handleError(res, error);
        }
    }

    async get(req, res) {
        try {
            const doc = await paymentHistoryService.getById(req.params.id);
            if (!doc || doc.userId !== req.user.id) return res.status(404).json({ message: 'Pagamento não encontrado' });
            res.json(doc);
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const schema = Joi.object({
                valor: Joi.number().required(),
                metodo: Joi.string().valid('cartao_credito', 'cartao_debito', 'pix', 'boleto', 'paypal').required(),
                status: Joi.string().valid('aprovado', 'pendente', 'falhou'),
                idTransacao: Joi.string(),
                linkRecibo: Joi.string().uri().allow(null),
                linkNotaFiscal: Joi.string().uri().allow(null),
                meta: Joi.object().optional()
            });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const payload = req.body;
            payload.userId = req.user.id;
            const doc = await paymentHistoryService.create(payload);
            res.status(201).json(doc);
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new PaymentHistoryController();
