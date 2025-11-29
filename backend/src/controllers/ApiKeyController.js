const crypto = require('crypto');
const User = require('../models/User');
const { handleError } = require('../utils/errorHandler');

class ApiKeyController {
    async getKey(req, res) {
        try {
            const user = await User.findById(req.user.id).select('chaveAPI planoAtual');
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            if (user.planoAtual !== 'empresarial') return res.status(403).json({ message: 'Chave API disponível apenas para plano Empresarial' });
            res.json({ chaveAPI: user.chaveAPI });
        } catch (error) {
            handleError(res, error);
        }
    }

    async generateKey(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            if (user.planoAtual !== 'empresarial') return res.status(403).json({ message: 'Chave API disponível apenas para plano Empresarial' });
            const newKey = crypto.randomBytes(24).toString('hex');
            user.chaveAPI = newKey;
            await user.save();
            res.json({ chaveAPI: newKey });
        } catch (error) {
            handleError(res, error);
        }
    }

    async revokeKey(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            user.chaveAPI = null;
            await user.save();
            res.json({ success: true });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new ApiKeyController();
