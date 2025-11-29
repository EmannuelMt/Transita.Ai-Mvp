const crypto = require('crypto');
const adminInviteService = require('../services/adminInviteService');
const userService = require('../services/userService');
const activityLogService = require('../services/activityLogService');
const { handleError } = require('../utils/errorHandler');
const mailer = require('../utils/mailer');

class AdminInviteController {
    async createInvite(req, res) {
        try {
            const { email, expiresInDays = 7, appUrl } = req.body;
            if (!email) return res.status(400).json({ message: 'email é obrigatório' });

            const token = crypto.randomBytes(20).toString('hex');
            const expiresAt = new Date(Date.now() + (expiresInDays * 24 * 60 * 60 * 1000));

            const now = new Date().toISOString();
            const invite = await adminInviteService.createInvite(token, { email, token, createdBy: req.user.id, expiresAt: expiresAt.toISOString(), createdAt: now, updatedAt: now });

            // Try to send email; if SMTP not configured, mailer will return the token
            let mailResult;
            try {
                mailResult = await mailer.sendInviteEmail({ to: email, token, inviterEmail: req.user.email, appUrl });
            } catch (e) {
                console.warn('Mailer error:', e.message);
                mailResult = { sent: false, reason: e.message, token };
            }

            try {
                await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'createInvite', collection: 'adminInvites', documentId: invite.id, after: invite });
            } catch (e) { console.warn('Falha ao registrar activity log:', e.message); }

            res.json({ invite: { id: invite._id, email: invite.email, expiresAt: invite.expiresAt }, mailResult });
        } catch (err) {
            handleError(res, err);
        }
    }

    async listInvites(req, res) {
        try {
            const invites = await adminInviteService.listAll();
            res.json(invites);
        } catch (err) {
            handleError(res, err);
        }
    }

    async revokeInvite(req, res) {
        try {
            const invite = await adminInviteService.getByToken(req.params.id);
            if (!invite) return res.status(404).json({ message: 'Convite não encontrado' });
            const before = invite;
            await adminInviteService.updateToken(invite.id, { used: true, updatedAt: new Date().toISOString() });
            try { await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'revokeInvite', collection: 'adminInvites', documentId: invite.id, before, after: { used: true } }); } catch (e) { console.warn('Falha activity log:', e.message); }
            res.json({ success: true });
        } catch (err) {
            handleError(res, err);
        }
    }

    // public endpoint — user must be authenticated (so we know who accepts)
    async confirmInvite(req, res) {
        try {
            const { token } = req.body;
            if (!token) return res.status(400).json({ message: 'token é obrigatório' });

            const invite = await adminInviteService.getByToken(token);
            if (!invite) return res.status(404).json({ message: 'Convite inválido' });
            if (invite.used) return res.status(400).json({ message: 'Convite já utilizado' });
            if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) return res.status(400).json({ message: 'Convite expirado' });

            // mark used and grant isAdmin to the authenticated user
            await adminInviteService.updateToken(invite.id, { used: true, usedBy: req.user.id, updatedAt: new Date().toISOString() });
            const user = await userService.updateById(req.user.id, { isAdmin: true });

            try { await activityLogService.create({ actorId: req.user.id, actorEmail: req.user.email, action: 'acceptInvite', collection: 'adminInvites', documentId: invite.id, before: null, after: { used: true } }); } catch (e) { console.warn('Falha activity log:', e.message); }

            res.json({ success: true, user });
        } catch (err) {
            handleError(res, err);
        }
    }
}

module.exports = new AdminInviteController();
