const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const realtimeDb = require('../services/realtimeDb');

// Obter estatísticas gerais das multas
router.get('/multas', auth, async (req, res) => {
    try {
        const { periodo = 'mes' } = req.query;
        const userId = req.user.id;

        // Definir intervalo de datas baseado no período
        const dataInicial = new Date();
        switch (periodo) {
            case 'hoje':
                dataInicial.setHours(0, 0, 0, 0);
                break;
            case 'semana':
                dataInicial.setDate(dataInicial.getDate() - 7);
                break;
            case 'mes':
                dataInicial.setMonth(dataInicial.getMonth() - 1);
                break;
            case 'ano':
                dataInicial.setFullYear(dataInicial.getFullYear() - 1);
                break;
            case 'todos':
                dataInicial.setFullYear(2000);
                break;
        }

        // Buscar todas as multas do usuário no Firebase
        const allMultas = await realtimeDb.get(`/multas`) || {};
        const multasArray = Object.values(allMultas).filter(m => m.usuario === userId && new Date(m.dataCriacao) >= dataInicial);

        const total = multasArray.length;
        const pendentes = multasArray.filter(m => m.status === 'pendente').length;
        const valorTotal = multasArray.reduce((sum, m) => sum + (m.valor || 0), 0);
        const valorPendente = multasArray.filter(m => m.status === 'pendente').reduce((sum, m) => sum + (m.valor || 0), 0);

        res.json({
            total,
            pendentes,
            valorTotal,
            valorPendente
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ message: 'Erro ao obter estatísticas' });
    }
});

// Obter estatísticas por localidade
router.get('/multas/localidade', auth, async (req, res) => {
    try {
        const { periodo = 'mes' } = req.query;
        const userId = req.user.id;

        // Definir intervalo de datas baseado no período
        const dataInicial = new Date();
        switch (periodo) {
            case 'hoje':
                dataInicial.setHours(0, 0, 0, 0);
                break;
            case 'semana':
                dataInicial.setDate(dataInicial.getDate() - 7);
                break;
            case 'mes':
                dataInicial.setMonth(dataInicial.getMonth() - 1);
                break;
            case 'ano':
                dataInicial.setFullYear(dataInicial.getFullYear() - 1);
                break;
            case 'todos':
                dataInicial.setFullYear(2000);
                break;
        }

        const estatisticasPorLocalidade = await Multa.aggregate([
            {
                $match: {
                    usuario: userId,
                    dataCriacao: { $gte: dataInicial }
                }
            },
            {
                $group: {
                    _id: {
                        estado: '$estado',
                        cidade: '$cidade'
                    },
                    total: { $sum: 1 },
                    valorTotal: { $sum: '$valor' },
                    pendentes: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'pendente'] }, 1, 0]
                        }
                    },
                    valorPendente: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'pendente'] }, '$valor', 0]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$_id.estado',
                    cidades: {
                        $push: {
                            cidade: '$_id.cidade',
                            total: '$total',
                            valorTotal: '$valorTotal',
                            pendentes: '$pendentes',
                            valorPendente: '$valorPendente'
                        }
                    },
                    total: { $sum: '$total' },
                    valorTotal: { $sum: '$valorTotal' },
                    pendentes: { $sum: '$pendentes' },
                    valorPendente: { $sum: '$valorPendente' }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.json(estatisticasPorLocalidade);

    } catch (error) {
        console.error('Erro ao obter estatísticas por localidade:', error);
        res.status(500).json({ message: 'Erro ao obter estatísticas por localidade' });
    }
});

module.exports = router;