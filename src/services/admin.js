import { api } from '../services/api';

// Função para verificar status de admin
export const checkAdminStatus = async (email) => {
    try {
        // Tentar acessar um endpoint admin para testar permissões
        await api.get('/admin/users');
        return true;
    } catch (e) {
        if (email === 'transitaaipro@gmail.com') {
            // Se for o email admin mas não tem permissão, vamos tentar dar a permissão
            try {
                await api.post('/admin/setup-initial-admin', { email });
                return true;
            } catch (err) {
                console.error('Erro ao configurar admin inicial:', err);
                return false;
            }
        }
        return false;
    }
};