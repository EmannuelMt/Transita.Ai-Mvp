const axios = require('axios');

class DetranService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.DETRAN_API_URL,
            headers: {
                'Authorization': `Bearer ${process.env.DETRAN_API_KEY}`
            }
        });
    }

    async consultarPlaca(placa, estado) {
        try {
            // Se não houver uma URL configurada para um provedor real, usar mock local para desenvolvimento
            if (!process.env.DETRAN_API_URL) {
                // Mock: retornar 0-3 multas aleatórias
                const multas = [];
                const qtd = Math.floor(Math.random() * 3);
                for (let i = 0; i < qtd; i++) {
                    multas.push({
                        codigo: `A${Math.floor(Math.random() * 9000) + 1000}`,
                        descricao: `Infração de exemplo ${i + 1}`,
                        valor: parseFloat((Math.random() * 500).toFixed(2)),
                        data: new Date(),
                        local: 'Cidade Exemplo',
                        orgao: 'DETRAN'
                    });
                }

                return {
                    veiculo: {
                        marca: 'MarcaEx',
                        modelo: 'ModeloEx',
                        ano: '2015',
                        cor: 'Branco',
                        renavam: '000000000'
                    },
                    multas,
                    valorTotal: multas.reduce((total, m) => total + m.valor, 0)
                };
            }

            // Implementar conforme a API específica do DETRAN ou provedor
            const response = await this.api.get(`/consulta/${estado}/${placa}`);

            return {
                veiculo: {
                    marca: response.data.marca,
                    modelo: response.data.modelo,
                    ano: response.data.ano,
                    cor: response.data.cor,
                    renavam: response.data.renavam
                },
                multas: (response.data.multas || []).map(multa => ({
                    codigo: multa.auto || multa.codigo,
                    descricao: multa.infracao || multa.descricao,
                    valor: multa.valor,
                    data: multa.data,
                    local: multa.local,
                    orgao: multa.orgao
                })),
                valorTotal: (response.data.multas || []).reduce((total, multa) => total + (multa.valor || 0), 0)
            };
        } catch (error) {
            console.error('Erro na consulta DETRAN:', error);
            throw new Error('Falha ao consultar dados no DETRAN');
        }
    }
}

module.exports = DetranService;