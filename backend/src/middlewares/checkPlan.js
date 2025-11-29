const User = require('../models/User');

const checkPlan = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar status da assinatura
        if (user.statusAssinatura !== 'ativo') {
            return res.status(403).json({
                message: 'Assinatura inativa. Por favor, regularize seu plano.'
            });
        }

        // Verificar limite de consultas
        if (user.numeroConsultasMes >= user.limiteConsultasMes) {
            return res.status(403).json({
                message: 'Limite de consultas atingido para este mês',
                upgrade: true
            });
        }

        // Verificar recursos específicos do plano
        if (req.path.includes('/api/') && user.planoAtual !== 'empresarial') {
            return res.status(403).json({
                message: 'Acesso à API disponível apenas no plano empresarial',
                upgrade: true
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar plano' });
    }
};

module.exports = checkPlan;