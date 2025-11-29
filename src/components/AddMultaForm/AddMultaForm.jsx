import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './AddMultaForm.css';

const AddMultaForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        placa: initialData?.placa || '',
        descricao: initialData?.descricao || '',
        valor: initialData?.valor || '',
        data: initialData?.data || new Date().toISOString().split('T')[0],
        local: initialData?.local || '',
        agente: initialData?.agente || ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.placa.trim()) {
            newErrors.placa = 'Placa é obrigatória';
        } else if (!/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/.test(formData.placa.toUpperCase())) {
            newErrors.placa = 'Formato de placa inválido';
        }

        if (!formData.descricao.trim()) {
            newErrors.descricao = 'Descrição é obrigatória';
        }

        if (!formData.valor || formData.valor <= 0) {
            newErrors.valor = 'Valor deve ser maior que zero';
        }

        if (!formData.data) {
            newErrors.data = 'Data é obrigatória';
        }

        if (!formData.local.trim()) {
            newErrors.local = 'Local é obrigatório';
        }

        if (!formData.agente.trim()) {
            newErrors.agente = 'Agente é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Por favor, corrija os erros no formulário');
            return;
        }

        setIsSubmitting(true);
        try {
            // Formata o valor para número antes de enviar
            const formattedData = {
                ...formData,
                valor: parseFloat(formData.valor),
                placa: formData.placa.toUpperCase()
            };

            await onSubmit(formattedData);
            toast.success(initialData ? 'Multa atualizada com sucesso!' : 'Multa cadastrada com sucesso!');
            if (typeof onCancel === 'function') {
                onCancel();
            }
        } catch (error) {
            toast.error(error.message || 'Erro ao salvar multa');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-multa-form">
            <div className="form-group">
                <label htmlFor="placa">Placa do Veículo</label>
                <input
                    type="text"
                    id="placa"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    placeholder="ABC1234"
                    maxLength={7}
                    className={errors.placa ? 'error' : ''}
                />
                {errors.placa && <span className="error-message">{errors.placa}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="descricao">Descrição da Infração</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva a infração..."
                    className={errors.descricao ? 'error' : ''}
                />
                {errors.descricao && <span className="error-message">{errors.descricao}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="valor">Valor</label>
                    <input
                        type="number"
                        id="valor"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                        className={errors.valor ? 'error' : ''}
                    />
                    {errors.valor && <span className="error-message">{errors.valor}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="data">Data da Infração</label>
                    <input
                        type="date"
                        id="data"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        className={errors.data ? 'error' : ''}
                    />
                    {errors.data && <span className="error-message">{errors.data}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="local">Local da Infração</label>
                <input
                    type="text"
                    id="local"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                    className={errors.local ? 'error' : ''}
                />
                {errors.local && <span className="error-message">{errors.local}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="agente">Agente Responsável</label>
                <input
                    type="text"
                    id="agente"
                    name="agente"
                    value={formData.agente}
                    onChange={handleChange}
                    placeholder="Nome do agente"
                    className={errors.agente ? 'error' : ''}
                />
                {errors.agente && <span className="error-message">{errors.agente}</span>}
            </div>

            <div className="form-actions">
                <motion.button
                    type="button"
                    className="button secondary"
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                >
                    <FiX /> Cancelar
                </motion.button>

                <motion.button
                    type="submit"
                    className="button primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                >
                    <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar'}
                </motion.button>
            </div>
        </form>
    );
};

AddMultaForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    initialData: PropTypes.shape({
        placa: PropTypes.string,
        descricao: PropTypes.string,
        valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        data: PropTypes.string,
        local: PropTypes.string,
        agente: PropTypes.string
    })
};

export default AddMultaForm;