import { api } from './api';
import { auth } from '../firebase/config';

const withTokenRetry = async (apiCall) => {
    try {
        return await apiCall();
    } catch (error) {
        // Se der 401, tentar renovar token e tentar novamente
        if (error.response?.status === 401) {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken(true); // força renovação
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return await apiCall(); // tenta novamente com token novo
            }
        }
        throw error;
    }
};

export const listarMultas = async (params) => {
    // Normaliza parâmetros para evitar enviar objetos aninhados que o backend
    // pode não suportar (ex.: { valor: { min, max } } -> valorMin, valorMax)
    const normalized = { ...params } || {};
    if (normalized.valor && typeof normalized.valor === 'object') {
        const { min, max } = normalized.valor;
        if (min !== undefined) normalized.valorMin = min;
        if (max !== undefined) normalized.valorMax = max;
        delete normalized.valor;
    }

    try {
        const resp = await withTokenRetry(() => api.get('/multas', { params: normalized }));
        return resp.data;
    } catch (err) {
        // Enriquecer erro com informações úteis para debug no frontend
        const error = new Error('Erro ao listar multas');
        error.original = err;
        error.status = err?.response?.status;
        error.serverMessage = err?.response?.data?.message || err?.response?.data;
        // eslint-disable-next-line no-console
        console.error('listarMultas falhou', { params: normalized, status: error.status, serverMessage: error.serverMessage });
        throw error;
    }
};

export const getMulta = async (id) => {
    const resp = await withTokenRetry(() => api.get(`/multas/${id}`));
    return resp.data;
};

/**
 * Adiciona uma nova multa
 * @param {Object} multa - Dados da multa a ser criada
 * @returns {Promise<Object>} Multa criada
 */
export const adicionarMulta = async (multa) => {
    const resp = await withTokenRetry(() => api.post('/multas', multa));
    return resp.data;
};

/**
 * Atualiza uma multa existente
 * @param {string} id - ID da multa
 * @param {Object} dados - Dados a serem atualizados
 * @returns {Promise<Object>} Multa atualizada
 */
export const atualizarMulta = async (id, dados) => {
    const resp = await withTokenRetry(() => api.put(`/multas/${id}`, dados));
    return resp.data;
};

/**
 * Exclui uma multa
 * @param {string} id - ID da multa
 * @returns {Promise<void>}
 */
export const excluirMulta = async (id) => {
    await withTokenRetry(() => api.delete(`/multas/${id}`));
};

/**
 * Consulta informações de um veículo pela placa
 * @param {string} placa - Placa do veículo
 * @returns {Promise<Object>} Informações do veículo
 */
export const consultarPlaca = async (placa) => {
    const resp = await withTokenRetry(() => api.get(`/veiculos/${placa}`));
    return resp.data;
};

/**
 * Registra um pagamento para uma multa
 * @param {string} id - ID da multa
 * @param {Object} dadosPagamento - Dados do pagamento
 * @returns {Promise<Object>} Multa atualizada
 */
export const registrarPagamentoMulta = async (id, dadosPagamento) => {
    const resp = await withTokenRetry(() => api.post(`/multas/${id}/pagamento`, dadosPagamento));
    return resp.data;
};

/**
 * Atualiza o status de uma multa
 * @param {string} id - ID da multa
 * @param {string} status - Novo status
 * @returns {Promise<Object>} Multa atualizada
 */
export const atualizarStatusMulta = async (id, status) => {
    const resp = await withTokenRetry(() => api.patch(`/multas/${id}/status`, { status }));
    return resp.data;
};
