const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Multa = require('../models/Multa');

// GET /api/multas - listar multas do usuário (com filtros)
router.get('/', auth, async (req, res) => {
    try {
        const { status, placa, page = 1, limit = 20 } = req.query;
        const query = { placa: placa, /* default: buscar por placa se informado */ };

        // busca por usuário via consultas -> multa.consultaId -> consulta.userId
        // para simplificar, buscar multas relacionadas às consultas do usuário
        const Consulta = require('../models/Consulta');
        const consultas = await Consulta.find({ userId: req.user.id }).select('_id');
        const consultaIds = consultas.map(c => c._id);

        const mongoQuery = { consultaId: { $in: consultaIds } };
        if (status) mongoQuery.status = status;
        if (placa) mongoQuery.placa = placa;

        const multas = await Multa.find(mongoQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Multa.countDocuments(mongoQuery);

        res.json({ multas, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar multas' });
    }
});

module.exports = router;
