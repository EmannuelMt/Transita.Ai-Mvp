const activityLogService = require('../services/activityLogService');
const userService = require('../services/userService');
const { handleError } = require('../utils/errorHandler');
const Joi = require('joi');

class ActivityController {
    async list(req, res) {
        try {
            const { page = 1, limit = 50 } = req.query;
            // permitir que admins vejam todos os logs
            const user = await userService.getById(req.user.id);
            const filter = (user && user.isAdmin) ? {} : { actorId: req.user.id };
            const { items, total } = await activityLogService.list(filter, { page, limit });
            res.json({ items, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const schema = Joi.object({
                categoria: Joi.string().required(),
                descricao: Joi.string().required(),
                ip: Joi.string().optional(),
                device: Joi.string().optional(),
                meta: Joi.object().optional()
            });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.message });

            const payload = req.body;
            payload.actorId = req.user.id;
            const doc = await activityLogService.create(payload);
            res.status(201).json(doc);
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new ActivityController();
