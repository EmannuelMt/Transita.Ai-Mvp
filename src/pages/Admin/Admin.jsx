import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
// users will be loaded from backend API instead of direct Firestore reads
import { FaEdit, FaTrash, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import PlanEditModal from '../../components/Modal/PlanEditModal';
import './Admin.css';
const TABS = ['users', 'subscriptions', 'multas', 'activity', 'invites'];

function Admin() {
    const navigate = useNavigate();
    const { user, userClaims } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [subs, setSubs] = useState([]);
    const [multas, setMultas] = useState([]);
    const [activity, setActivity] = useState([]);
    const [invites, setInvites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'asc' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', expiresInDays: 7 });

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                navigate('/');
                return;
            }

            try {
                const response = await api.get('/admin/check');
                if (!response.data.isAdmin) {
                    navigate('/');
                    return;
                }
                loadInitialData();
            } catch (err) {
                console.error('Erro ao verificar permissões de admin:', err);
                navigate('/');
            }
        };

        checkAdmin();
    }, [user, navigate]);

    const loadInitialData = async () => {
        switch (tab) {
            case 'users':
                await loadUsers();
                break;
            case 'subscriptions':
                await loadSubs();
                break;
            case 'multas':
                await loadMultas();
                break;
            case 'activity':
                await loadActivity();
                break;
            case 'invites':
                await loadInvites();
                break;
            default:
                break;
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // fetch users from backend admin API (protected)
            const response = await api.get('/admin/users');
            // backend retorna usuários com id (firebaseUid)
            setUsers(response.data || []);
        } catch (e) {
            setError(e.message);
            console.error('Erro ao carregar usuários:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadSubs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/subscriptions');
            setSubs(response.data || []);
        } catch (e) {
            setError(e.message);
            console.error('Erro ao carregar assinaturas:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadMultas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/multas');
            setMultas(response.data || []);
        } catch (e) {
            setError(e.message);
            console.error('Erro ao carregar multas:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadActivity = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/activity');
            setActivity(response.data || []);
        } catch (e) {
            setError(e.message);
            console.error('Erro ao carregar atividades:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadInvites = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/invites');
            setInvites(response.data || []);
        } catch (e) {
            setError(e.message);
            console.error('Erro ao carregar convites:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (newTab) => {
        setTab(newTab);
        loadInitialData();
    };

    if (loading) return (
        <div className="admin-loading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div>Carregando...</div>
        </div>
    );
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-container">
            <h1>Painel Administrativo</h1>

            <div className="admin-tabs">
                {TABS.map(tabName => (
                    <button
                        key={tabName}
                        className={`tab-button ${tab === tabName ? 'active' : ''}`}
                        onClick={() => handleTabChange(tabName)}
                    >
                        {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                    </button>
                ))}
            </div>

            <div className="content-area">
                {tab === 'users' && (
                    <div className="admin-panel">
                        <div className="panel-header">
                            <h2>Usuários</h2>
                            <div className="search-group">
                                <input placeholder="Pesquisar por nome ou email" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                <button onClick={loadUsers}>Atualizar</button>
                            </div>
                        </div>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Plano</th>
                                    <th>Assinatura</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => {
                                    if (!searchTerm) return true;
                                    const s = searchTerm.toLowerCase();
                                    return (u.nomeCompleto || u.email || '').toLowerCase().includes(s);
                                }).map(u => (
                                    <tr key={u.id || u.firebaseUid}>
                                        <td>{u.nomeCompleto || '-'}</td>
                                        <td>{u.email}</td>
                                        <td>{u.planoAtual || '-'}</td>
                                        <td>{u.statusAssinatura || '-'}</td>
                                        <td className="actions">
                                            <button className="btn" onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}>Editar Plano</button>
                                            <button className="btn danger" onClick={async () => {
                                                if (!confirm('Remover usuário?')) return;
                                                try { await api.delete(`/admin/users/${u.id || u.firebaseUid}`); loadUsers(); } catch (e) { alert('Erro: ' + e.message); }
                                            }}>Remover</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'subscriptions' && (
                    <div className="admin-panel">
                        <h2>Assinaturas</h2>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Usuário</th><th>Plano</th><th>Status</th><th>Renovação</th></tr>
                            </thead>
                            <tbody>
                                {subs.map(s => (
                                    <tr key={s.userId}>
                                        <td>{s.userId}</td>
                                        <td>{s.planoAtual}</td>
                                        <td>{s.status}</td>
                                        <td>{s.dataRenovacao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'multas' && (
                    <div className="admin-panel">
                        <h2>Multas</h2>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Placa</th><th>Descrição</th><th>Valor</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {multas.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.placa}</td>
                                        <td>{m.descricao}</td>
                                        <td>R$ {m.valor}</td>
                                        <td>{m.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'activity' && (
                    <div className="admin-panel">
                        <h2>Activity Log</h2>
                        <div className="activity-list">
                            {activity.map(a => (
                                <div className="activity-item" key={a.id}>
                                    <div className="act-meta">{a.action} — {a.actorEmail || a.actorId}</div>
                                    <div className="act-time">{new Date(a.createdAt || a.timestamp || Date.now()).toLocaleString()}</div>
                                    <pre className="act-body">{JSON.stringify(a.meta || a.before || a.after || {}, null, 2)}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'invites' && (
                    <div className="admin-panel">
                        <h2>Convites Administrativos</h2>
                        <div className="invite-form">
                            <input placeholder="Email para convidar" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} />
                            <input type="number" value={inviteData.expiresInDays} onChange={e => setInviteData({ ...inviteData, expiresInDays: Number(e.target.value) })} />
                            <button className="btn" onClick={async () => {
                                try { await api.post('/admin/invites', inviteData); loadInvites(); alert('Convite criado'); } catch (e) { alert('Erro: ' + e.message); }
                            }}>Criar Convite</button>
                        </div>
                        <table className="admin-table">
                            <thead><tr><th>Email</th><th>Token</th><th>Usado</th><th>Ações</th></tr></thead>
                            <tbody>
                                {invites.map(i => (
                                    <tr key={i.token}>
                                        <td>{i.email}</td>
                                        <td>{i.token}</td>
                                        <td>{i.used ? 'Sim' : 'Não'}</td>
                                        <td><button className="btn danger" onClick={async () => { if (!confirm('Excluir convite?')) return; try { await api.delete(`/admin/invites/${i.token}`); loadInvites(); } catch (e) { alert(e.message); } }}>Excluir</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
