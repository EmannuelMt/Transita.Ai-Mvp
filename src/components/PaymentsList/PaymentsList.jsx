import React, { useEffect, useState } from 'react';
import { listPaymentHistory } from '../../services/profile';
import './PaymentsList.css';

const PaymentsList = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load(page);
    }, [page]);

    const load = async (p = 1) => {
        try {
            setLoading(true);
            const res = await listPaymentHistory({ page: p, limit: 10 });
            setItems(res.items);
            setTotal(res.total);
        } catch (err) {
            console.error('Erro ao carregar pagamentos', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payments-list card">
            <h4>Histórico de Pagamentos</h4>
            {loading ? <div>Carregando...</div> : (
                <div>
                    <ul>
                        {items.map(p => (
                            <li key={p._id} className="payment-row">
                                <div>
                                    <strong>R$ {p.valor}</strong>
                                    <div className="muted">{new Date(p.data).toLocaleString()}</div>
                                </div>
                                <div className="muted">{p.metodo} • {p.status}</div>
                            </li>
                        ))}
                        {items.length === 0 && <li>Nenhum pagamento encontrado</li>}
                    </ul>
                    <div className="pagination">
                        <button onClick={() => setPage(s => Math.max(1, s - 1))} disabled={page === 1}>Anterior</button>
                        <span>Página {page}</span>
                        <button onClick={() => setPage(s => s + 1)} disabled={items.length === 0 || items.length < 10}>Próxima</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsList;
