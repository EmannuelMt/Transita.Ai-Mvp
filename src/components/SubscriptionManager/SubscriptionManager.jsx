import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSubscription, updateSubscription, cancelSubscription } from '../../services/profile';
import './SubscriptionManager.css';

const SubscriptionManager = ({ onChange }) => {
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const s = await getSubscription();
                setSub(s);
                if (onChange) onChange(s);
            } catch (err) {
                console.error('Erro ao obter assinatura:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleUpgrade = async (plan) => {
        try {
            setProcessing(true);
            const payload = { planoAtual: plan, status: 'ativo' };
            const updated = await updateSubscription(payload);
            setSub(updated);
            alert('Assinatura atualizada');
            if (onChange) onChange(updated);
        } catch (err) {
            console.error('Erro ao atualizar assinatura', err);
            alert('Erro ao atualizar assinatura');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Confirmar cancelamento da assinatura?')) return;
        try {
            setProcessing(true);
            const res = await cancelSubscription();
            setSub(res);
            alert('Assinatura cancelada');
            if (onChange) onChange(res);
        } catch (err) {
            console.error('Erro ao cancelar assinatura', err);
            alert('Erro ao cancelar');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div>Carregando assinatura...</div>;

    return (
        <div className="subscription-manager">
            <h4>Assinatura</h4>
            {sub ? (
                <div>
                    <p><strong>Plano atual:</strong> {sub.planoAtual}</p>
                    <p><strong>Status:</strong> {sub.status}</p>
                    <p><strong>Renovação:</strong> {sub.dataRenovacao ? new Date(sub.dataRenovacao).toLocaleDateString() : '-'}</p>
                    <div className="subscription-actions">
                        <button disabled={processing} onClick={() => handleUpgrade('basico')}>Básico R$49</button>
                        <button disabled={processing} onClick={() => handleUpgrade('profissional')}>Profissional R$99</button>
                        <button disabled={processing} onClick={() => handleUpgrade('empresarial')}>Empresarial R$249</button>
                        <button className="danger" disabled={processing} onClick={handleCancel}>Cancelar assinatura</button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Sem assinatura</p>
                    <div className="subscription-actions">
                        <button disabled={processing} onClick={() => handleUpgrade('basico')}>Assinar Básico R$49</button>
                        <button disabled={processing} onClick={() => handleUpgrade('profissional')}>Assinar Profissional R$99</button>
                    </div>
                </div>
            )}
        </div>
    );
};

SubscriptionManager.propTypes = {
    onChange: PropTypes.func
};

export default SubscriptionManager;
