const userService = require('../services/userService');
const subscriptionService = require('../services/subscriptionService');
const multaService = require('../services/multaService');
const activityLogService = require('../services/activityLogService');
const { handleError } = require('../utils/errorHandler');

class AdminController {
    // Check admin status for current user
    async check(req, res) {
        try {
            const user = await userService.getById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            return res.json({ isAdmin: !!user.isAdmin });
        } catch (err) {
            handleError(res, err);
        }
    }

    // Users
    async listUsers(req, res) {
        try {
            const users = await userService.listAll();
            res.json(users);
        } catch (err) {
            handleError(res, err);
        }
    }

    async getUser(req, res) {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            res.json(user);
        } catch (err) {
            handleError(res, err);
        }
    }

    async updateUser(req, res) {
        try {
            const allowed = ['nomeCompleto', 'email', 'telefone', 'empresa', 'planoAtual', 'statusAssinatura', 'limiteConsultasMes', 'isAdmin'];
            const payload = {};
            for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

            const before = await userService.getById(req.params.id);
            const user = await userService.updateById(req.params.id, payload);

            try {
                await activityLogService.create({
                    actorId: req.user.id,
                    actorEmail: req.user.email,
                    action: 'updateUser',
                    collection: 'users',
                    documentId: req.params.id,
                    before,
                    after: user
                });
            } catch (e) { console.warn('Falha ao registrar activity log:', e.message); }

            res.json(user);
        } catch (err) {
            handleError(res, err);
        }
    }

    async deleteUser(req, res) {
        try {
            const before = await userService.getById(req.params.id);
            await userService.deleteById(req.params.id);
            try {
                await activityLogService.create({
                    actorId: req.user.id,
                    actorEmail: req.user.email,
                    action: 'deleteUser',
                    collection: 'users',
                    documentId: req.params.id,
                    before
                });
            } catch (e) { console.warn('Falha ao registrar activity log:', e.message); }
            res.json({ success: true });
        } catch (err) {
            handleError(res, err);
        }
    }

    // Subscriptions
    async listSubscriptions(req, res) {
        try {
            const subs = await subscriptionService.listAll();
            res.json(subs);
        } catch (err) {
            handleError(res, err);
        }
    }

    async updateSubscription(req, res) {
        try {
            const before = await subscriptionService.getByUserId(req.params.id);
            const sub = await subscriptionService.createOrUpdate(req.params.id, req.body);
            try { await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'updateSubscription', collection: 'subscriptions', documentId: req.params.id, before, after: sub }); } catch (e) { console.warn('Falha activity log:', e.message); }
            res.json(sub);
        } catch (err) {
            handleError(res, err);
        }
    }

    async deleteSubscription(req, res) {
        try {
            const before = await subscriptionService.getByUserId(req.params.id);
            await subscriptionService.deleteByUserId(req.params.id);
            try { await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'deleteSubscription', collection: 'subscriptions', documentId: req.params.id, before }); } catch (e) { console.warn('Falha activity log:', e.message); }
            res.json({ success: true });
        } catch (err) {
            handleError(res, err);
        }
    }

    // Multas
    async listMultas(req, res) {
        try {
            const multas = await multaService.listAll();
            res.json(multas);
        } catch (err) {
            handleError(res, err);
        }
    }

    async updateMulta(req, res) {
        try {
            const before = await multaService.getById(req.params.id);
            const multa = await multaService.update(req.params.id, req.body);
            try { await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'updateMulta', collection: 'multas', documentId: req.params.id, before, after: multa }); } catch (e) { console.warn('Falha activity log:', e.message); }
            res.json(multa);
        } catch (err) {
            handleError(res, err);
        }
    }

    async deleteMulta(req, res) {
        try {
            const before = await multaService.getById(req.params.id);
            await multaService.deleteById(req.params.id);
            try { await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'deleteMulta', collection: 'multas', documentId: req.params.id, before }); } catch (e) { console.warn('Falha activity log:', e.message); }
            res.json({ success: true });
        } catch (err) {
            handleError(res, err);
        }
    }
}

module.exports = new AdminController();