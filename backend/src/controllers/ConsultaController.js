const { handleError } = require('../utils/errorHandler');
const DetranService = require('../services/DetranService');
const consultaService = require('../services/consultaService');
const userService = require('../services/userService');
const multaService = require('../services/multaService');

class ConsultaController {
    async create(req, res) {
        try {
            const { placa, estado } = req.body;
            const user = await userService.getById(req.user.id);

            // Verificar limite de consultas
            if (user.numeroConsultasMes >= user.limiteConsultasMes) {
                return res.status(403).json({ message: 'Limite de consultas atingido para este mês' });
            }

            // Criar consulta inicial no Realtime DB
            const consulta = await consultaService.createConsulta(req.user.id, { placa, estado });

            // Realizar consulta no DETRAN
            const detranService = new DetranService();
            const resultado = await detranService.consultarPlaca(placa, estado);

            // Atualizar consulta com resultado básico
            await consultaService.updateConsulta(consulta.id, {
                statusConsulta: 'sucesso',
                veiculo: resultado.veiculo,
                valorTotal: resultado.valorTotal
            });

            // Salvar multas e vincular
            const multasCriadas = [];
            if (Array.isArray(resultado.multas) && resultado.multas.length) {
                const created = await consultaService.saveMultasForConsulta(consulta.id, resultado.multas.map(m => ({ placa, ...m })));
                multasCriadas.push(...created);
            }

            // Incrementar contador de consultas do usuário
            const inc = (user.numeroConsultasMes || 0) + 1;
            await userService.updateById(user.firebaseUid, { numeroConsultasMes: inc });

            // Recuperar consulta com multas populadas
            const consultaPopulada = await consultaService.getById(consulta.id);
            if (Array.isArray(consultaPopulada.multas) && consultaPopulada.multas.length) {
                consultaPopulada.multas = await Promise.all(consultaPopulada.multas.map(id => multaService.getById(id)));
            } else consultaPopulada.multas = [];

            res.json(consultaPopulada);
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const consulta = await consultaService.getById(req.params.id);
            if (!consulta || consulta.userId !== req.user.id) return res.status(404).json({ message: 'Consulta não encontrada' });
            if (Array.isArray(consulta.multas) && consulta.multas.length) consulta.multas = await Promise.all(consulta.multas.map(id => multaService.getById(id)));
            res.json(consulta);
        } catch (error) {
            handleError(res, error);
        }
    }

    async list(req, res) {
        try {
            const { placa, estado, page = 1, limit = 10 } = req.query;
            const { consultas, total } = await consultaService.listByUser(req.user.id, { placa, estado, page, limit });
            res.json({ consultas, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new ConsultaController();