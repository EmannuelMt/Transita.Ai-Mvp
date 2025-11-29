const subscriptionService = require('../services/subscriptionService');
const userService = require('../services/userService');
const { handleError } = require('../utils/errorHandler');
const Joi = require('joi');

class SubscriptionController {
    async getSubscription(req, res) {
        try {
            const sub = await subscriptionService.getByUserId(req.user.id);
            if (!sub) return res.status(404).json({ message: 'Assinatura não encontrada' });
            res.json(sub);
        } catch (error) {
            handleError(res, error);
        }
    }

    async createOrUpdate(req, res) {
        try {
            const schema = Joi.object({
                planoAtual: Joi.string().valid('basico', 'profissional', 'empresarial'),
                status: Joi.string().valid('ativo', 'pendente', 'cancelado'),
                renovacaoAutomatica: Joi.boolean(),
                metodoPagamento: Joi.string(),
                valorMensal: Joi.number()
            });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const payload = req.body;
            const sub = await subscriptionService.createOrUpdate(req.user.id, payload);

            // Update user's plan summary
            if (payload.planoAtual) {
                await userService.updateById(req.user.id, { planoAtual: payload.planoAtual });
            }

            res.json(sub);
        } catch (error) {
            handleError(res, error);
        }
    }

    async cancelSubscription(req, res) {
        try {
            const sub = await subscriptionService.cancel(req.user.id);
            if (!sub) return res.status(404).json({ message: 'Assinatura não encontrada' });
            await userService.updateById(req.user.id, { statusAssinatura: 'cancelado' });
            res.json(sub);
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new SubscriptionController();
