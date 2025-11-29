import React, { useEffect, useState } from 'react';
import { getApiKey, generateApiKey, revokeApiKey } from '../../services/profile';
import './ApiKeyManager.css';

const ApiKeyManager = () => {
    const [key, setKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await getApiKey();
                setKey(res.chaveAPI || null);
            } catch (err) {
                console.error('Erro ao obter chave API', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleGenerate = async () => {
        if (!confirm('Gerar nova chave API (a antiga será sobrescrita)?')) return;
        try {
            setProcessing(true);
            const res = await generateApiKey();
            setKey(res.chaveAPI);
            alert('Chave gerada');
        } catch (err) {
            console.error('Erro ao gerar chave API', err);
            alert('Erro ao gerar chave');
        } finally {
            setProcessing(false);
        }
    };

    const handleRevoke = async () => {
        if (!confirm('Revogar chave API atual?')) return;
        try {
            setProcessing(true);
            await revokeApiKey();
            setKey(null);
            alert('Chave revogada');
        } catch (err) {
            console.error('Erro ao revogar chave', err);
            alert('Erro ao revogar chave');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="api-key-manager card">
            <h4>Chave API (Empresarial)</h4>
            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div>
                    {key ? (
                        <div>
                            <div className="key-box">{key}</div>
                            <div className="actions">
                                <button onClick={() => navigator.clipboard.writeText(key)}>Copiar</button>
                                <button onClick={handleGenerate} disabled={processing}>Gerar nova</button>
                                <button onClick={handleRevoke} disabled={processing} className="danger">Revogar</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>Sem chave ativa. Disponível apenas para plano Empresarial.</p>
                            <div className="actions">
                                <button onClick={handleGenerate} disabled={processing}>Gerar chave</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApiKeyManager;
