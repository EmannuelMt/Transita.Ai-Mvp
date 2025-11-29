const userService = require('../services/userService');

const adminAuth = async (req, res, next) => {
    try {
        // auth middleware must have set req.user.id
        if (!req.user || !req.user.id) return res.status(401).json({ message: 'Não autenticado' });
        const user = await userService.getById(req.user.id);
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });
        if (!user.isAdmin) return res.status(403).json({ message: 'Acesso de administrador necessário' });
        // attach admin info
        req.admin = { id: user.firebaseUid, email: user.email, nome: user.nomeCompleto };
        next();
    } catch (err) {
        console.error('adminAuth error', err);
        res.status(500).json({ message: 'Erro ao verificar permissões de administrador' });
    }
};

module.exports = adminAuth;
