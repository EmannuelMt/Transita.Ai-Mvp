const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');

// Endpoint especial para configurar o admin inicial
router.post('/setup-initial-admin', auth, async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar se é o email correto do admin
        if (email !== 'transitaaipro@gmail.com') {
            return res.status(403).json({ message: 'Email não autorizado para ser admin' });
        }

        // Verificar se o usuário autenticado é o mesmo do email
        if (req.user.email !== email) {
            return res.status(403).json({ message: 'Token não corresponde ao email informado' });
        }

        // Atualizar o usuário para ser admin
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { isAdmin: true } },
            { new: true }
        );

        res.json({ message: 'Admin configurado com sucesso', user });
    } catch (err) {
        console.error('Erro ao configurar admin:', err);
        res.status(500).json({ message: 'Erro ao configurar admin', error: err.message });
    }
});

module.exports = router;