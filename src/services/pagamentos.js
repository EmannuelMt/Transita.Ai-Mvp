import { api } from './api';

export const criarPagamento = async (multasIds, metodoPagamento) => {
    const resp = await api.post('/pagamentos', { multasIds, metodoPagamento });
    return resp.data;
};

export const verificarStatus = async (transactionId) => {
    const resp = await api.get(`/pagamentos/status/${transactionId}`);
    return resp.data;
};
