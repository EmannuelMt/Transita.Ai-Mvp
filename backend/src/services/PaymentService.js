const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const isGatewayConfigured = !!process.env.PAYMENT_GATEWAY_URL && !!process.env.PAYMENT_GATEWAY_KEY;

class PaymentService {
    constructor() {
        if (isGatewayConfigured) {
            this.api = axios.create({
                baseURL: process.env.PAYMENT_GATEWAY_URL,
                headers: {
                    'Authorization': `Bearer ${process.env.PAYMENT_GATEWAY_KEY}`
                }
            });
        } else {
            this.api = null; // stub mode
        }
    }

    async criarPagamento(multas, metodoPagamento) {
        try {
            const valorTotal = multas.reduce((total, multa) => total + multa.valor, 0);

            const payload = {
                amount: valorTotal * 100, // Centavos
                currency: 'BRL',
                payment_method: metodoPagamento,
                description: `Pagamento de ${multas.length} multa(s)`,
                metadata: {
                    multasIds: multas.map(m => m._id).join(',')
                }
            };

            if (isGatewayConfigured && this.api) {
                const response = await this.api.post('/transactions', payload);
                return {
                    transactionId: response.data.id,
                    status: response.data.status,
                    paymentUrl: response.data.payment_url, // Para PIX/Boleto
                    qrCode: response.data.qr_code, // Para PIX
                };
            }

            // Stub mode: criar pagamento simulado
            const fakeId = uuidv4();
            const fakeStatus = 'pending';
            const paymentUrl = `https://example.com/fake-pay/${fakeId}`;
            const qrCode = null; // opcional

            return {
                transactionId: fakeId,
                status: fakeStatus,
                paymentUrl,
                qrCode
            };
        } catch (error) {
            console.error('Erro no gateway de pagamento:', error);
            throw new Error('Falha ao processar pagamento');
        }
    }

    async verificarStatus(transactionId) {
        try {
            if (isGatewayConfigured && this.api) {
                const response = await this.api.get(`/transactions/${transactionId}`);
                return response.data.status;
            }

            // Stub: return pending for unknown, paid if transactionId ends with 'paid'
            if (!transactionId) return 'unknown';
            if (transactionId.endsWith('paid')) return 'paid';
            return 'pending';
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            throw new Error('Falha ao verificar status do pagamento');
        }
    }
}

module.exports = PaymentService;