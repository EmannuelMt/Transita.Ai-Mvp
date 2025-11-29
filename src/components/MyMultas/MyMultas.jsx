import React, { useEffect, useState, useCallback, useRef } from 'react';
import { listarMultas } from '../../services/multas';
import './MyMultas.css';

const MyMultas = () => {
    const [multas, setMultas] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const loadPage = useCallback(async (p = 1) => {
        try {
            setLoading(true);
            setError(null);
            // buscar multas via endpoint /api/multas que já filtra pelo usuário
            const resp = await listarMultas({ page: p, limit: 20 });
            const items = resp.multas || [];
            if (!mountedRef.current) return; // evitar setState após desmontagem
            setMultas(prev => p === 1 ? items : [...prev, ...items]);
            setHasMore(p < (resp.pages || 1));
            setPage(p);
        } catch (err) {
            console.error('Erro ao carregar minhas multas', err);
            if (!mountedRef.current) return;
            setError('Não foi possível carregar suas multas. Verifique a conexão e tente novamente.');
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPage(1);
    }, [loadPage]);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const loadMore = () => {
        if (!hasMore || loading) return;
        loadPage(page + 1);
    };

    return (
        <div className="my-multas-card">
            <h3>Minhas Multas</h3>
            {multas.length === 0 && loading ? (
                <div className="my-multas-empty"><div className="inline-spinner" aria-live="polite">Carregando...</div></div>
            ) : error ? (
                <div className="my-multas-error">
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => loadPage(1)}>Tentar novamente</button>
                </div>
            ) : multas.length === 0 ? (
                <div className="my-multas-empty">Nenhuma multa encontrada.</div>
            ) : (
                <div className="my-multas-list">
                    {multas.map(m => (
                        <div className="my-multa-item" key={m._id || m.id || `${m.placa}-${Math.random()}`}>
                            <div className="left">
                                <div className="placa">{m.placa}</div>
                                <div className="descricao">{m.descricao}</div>
                            </div>
                            <div className="right">
                                <div className="valor">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(m.valor || 0))}</div>
                                <div className={`status status-${m.status}`}>{m.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="my-multas-actions">
                {hasMore ? (
                    <button className="btn-secondary" onClick={loadMore} disabled={loading}>
                        {loading ? 'Carregando...' : 'Carregar mais'}
                    </button>
                ) : (
                    multas.length > 0 && <div className="end-list">Fim da lista</div>
                )}
            </div>
        </div>
    );
};

export default MyMultas;
