import React, { useState } from 'react';
import { api } from '../../services/api';
import './Modal.css';

const PLANOS = [
    { id: 'basico', nome: 'Básico', valor: 49.90, limiteConsultas: 50 },
    { id: 'pro', nome: 'Profissional', valor: 99.90, limiteConsultas: 200 },
    { id: 'enterprise', nome: 'Enterprise', valor: 299.90, limiteConsultas: -1 }, // -1 = ilimitado
    { id: 'custom', nome: 'Personalizado', valor: 0, limiteConsultas: 0 }
];

const PlanEditModal = ({ user, onClose, onSave }) => {
    const [planoAtual, setPlanoAtual] = useState(user.planoAtual || 'basico');
    const [customValues, setCustomValues] = useState({
        // valor is not stored in User model by default but kept for UI
        valor: user.valorPlano || 0,
        limiteConsultas: user.limiteConsultasMes || 0,
        // use backend enum values (português)
        statusAssinatura: user.statusAssinatura || 'ativo'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // map frontend names to backend User fields
            const payload = {
                planoAtual,
                statusAssinatura: customValues.statusAssinatura,
                limiteConsultasMes: parseInt(customValues.limiteConsultas, 10)
            };

            // backend accepts PUT /api/admin/users/:id to update allowed user fields
            await api.put(`/admin/users/${user._id}`, payload);
            onSave(payload);
            onClose();
        } catch (error) {
            alert('Erro ao atualizar plano: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Editar Plano - {user.nomeCompleto}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Plano:</label>
                        <select
                            value={planoAtual}
                            onChange={e => setPlanoAtual(e.target.value)}
                        >
                            {PLANOS.map(plano => (
                                <option key={plano.id} value={plano.id}>
                                    {plano.nome} - R$ {plano.valor.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {planoAtual === 'custom' && (
                        <>
                            <div className="form-group">
                                <label>Valor Mensal (R$):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={customValues.valor}
                                    onChange={e => setCustomValues({
                                        ...customValues,
                                        valor: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Limite de Consultas:</label>
                                <input
                                    type="number"
                                    min="-1"
                                    value={customValues.limiteConsultas}
                                    onChange={e => setCustomValues({
                                        ...customValues,
                                        limiteConsultas: parseInt(e.target.value)
                                    })}
                                    placeholder="-1 para ilimitado"
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Status da Assinatura:</label>
                        <select
                            value={customValues.statusAssinatura}
                            onChange={e => setCustomValues({
                                ...customValues,
                                statusAssinatura: e.target.value
                            })}
                        >
                            <option value="active">Ativa</option>
                            <option value="pending">Pendente</option>
                            <option value="cancelled">Cancelada</option>
                            <option value="trial">Trial</option>
                            <option value="suspended">Suspensa</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="primary">
                            Salvar Alterações
                        </button>
                        <button type="button" onClick={onClose} className="secondary">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanEditModal;