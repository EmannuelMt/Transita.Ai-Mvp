import React, { useEffect, useState } from 'react';
import { listActivities } from '../../services/profile';
import './ActivityList.css';

const ActivityList = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(page); }, [page]);

    const load = async (p = 1) => {
        try {
            setLoading(true);
            const res = await listActivities({ page: p, limit: 15 });
            setItems(res.items);
        } catch (err) {
            console.error('Erro ao carregar atividades', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="activity-list card">
            <h4>Atividades recentes</h4>
            {loading ? <div>Carregando...</div> : (
                <div>
                    <ul>
                        {items.map(a => (
                            <li key={a._id} className="activity-row">
                                <div>
                                    <div className="muted">{new Date(a.dataHora).toLocaleString()}</div>
                                    <div><strong>{a.categoria}</strong> — {a.descricao}</div>
                                </div>
                                <div className="muted">{a.ip || '-'} • {a.device || '-'}</div>
                            </li>
                        ))}
                        {items.length === 0 && <li>Nenhuma atividade encontrada</li>}
                    </ul>
                    <div className="pagination">
                        <button onClick={() => setPage(s => Math.max(1, s - 1))} disabled={page === 1}>Anterior</button>
                        <span>Página {page}</span>
                        <button onClick={() => setPage(s => s + 1)}>Próxima</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityList;
