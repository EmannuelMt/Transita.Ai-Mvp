import axios from 'axios';
import { auth } from '../firebase/config';

const base = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: base,
    timeout: 10000,
});

// Interceptor para autenticação
api.interceptors.request.use(async (request) => {
    try {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const token = await currentUser.getIdToken(true);
            request.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Erro ao obter token:', error);
    }
    return request;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            error.message = 'Você não tem permissão para acessar este recurso';
        }
        if (error.response?.status === 401) {
            console.log('Redirecionando para login devido a 401');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);