import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, getUsage, updatePhoto } from '../../services/profile';
import './Profile.css';
import SubscriptionManager from '../../components/SubscriptionManager/SubscriptionManager';
import ApiKeyManager from '../../components/ApiKeyManager/ApiKeyManager';
import PaymentsList from '../../components/PaymentsList/PaymentsList';
import ActivityList from '../../components/ActivityList/ActivityList';
import { auth, storage } from '../../firebase/config';
import { ref as storageRef, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// pequenas utilidades
const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-';
import MyMultas from '../../components/MyMultas/MyMultas';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [usage, setUsage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const p = await getProfile();
                setProfile(p);
                setForm({ nomeCompleto: p.nomeCompleto, email: p.email, telefone: p.telefone, empresa: p.empresa });
                const u = await getUsage();
                setUsage(u);
            } catch (err) {
                console.error('Erro ao carregar profile:', err);
                setError(err);
            }
        };
        load();
    }, []);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imgError, setImgError] = useState(false);

    const handlePhotoChange = async (file) => {
        if (!file) return;
        // preview imediato
        try {
            const tmp = URL.createObjectURL(file);
            setPreviewUrl(tmp);
            setImgError(false);
        } catch (e) {
            // ignore
        }
        try {
            // prefer server-side upload for reliability
            const svc = await import('../../services/profile');
            try {
                const updated = await svc.uploadPhotoFile(file, {
                    onUploadProgress: (evt) => {
                        if (evt.lengthComputable) {
                            const pct = Math.round((evt.loaded / evt.total) * 100);
                            setUploadProgress(pct);
                        }
                    }
                });
                // atualizar estado com resposta do servidor (se retornar objeto de usuário)
                try {
                    // algumas implementações retornam o usuário atualizado, outras apenas meta
                    const refreshed = await getProfile();
                    setProfile(refreshed);
                } catch (e) {
                    setProfile(p => ({ ...p, fotoPerfilUrl: updated.fotoPerfilUrl || p.fotoPerfilUrl }));
                }
                setUploadProgress(0);
                alert('Foto atualizada (via servidor)');
                // limpar preview temporário
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
                return;
            } catch (err) {
                console.warn('Upload server-side falhou, tentando upload client-side:', err);
            }

            // fallback: client-side upload to Firebase Storage
            const user = auth.currentUser;
            if (!user) return alert('Usuário não autenticado');
            const ref = storageRef(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(ref, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', (snapshot) => {
                    const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadProgress(pct);
                }, (error) => reject(error), () => resolve());
            });

            const url = await getDownloadURL(ref);
            // enviar para backend via existing endpoint
            const updated2 = await updatePhoto(url);
            // garantir que pegamos a versão persistida no servidor
            try {
                const refreshed = await getProfile();
                setProfile(refreshed);
            } catch (e) {
                setProfile(p => ({ ...p, fotoPerfilUrl: updated2.fotoPerfilUrl || url }));
            }
            setUploadProgress(0);
            alert('Foto atualizada (via Firebase client)');
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }

        } catch (err) {
            console.error('Erro ao enviar foto:', err);
            alert('Erro ao atualizar foto');
        }
    };

    const handlePreferenceToggle = async (key) => {
        // toggle locally first
        const current = { ...(profile.notificacoes || {}), ...(prefs || {}) };
        current[key] = !current[key];
        setPrefs(current);

        try {
            // persist on backend
            const payload = { notificacoes: { ...profile.notificacoes, ...current } };
            const res = await (await import('../../services/profile')).updatePreferences(payload);
            // update profile state with returned notificacoes
            setProfile(p => ({ ...p, notificacoes: res.notificacoes }));
            localStorage.setItem('profilePrefs', JSON.stringify(res.notificacoes || current));
        } catch (err) {
            console.error('Erro ao salvar preferências:', err);
            alert('Não foi possível salvar preferências no servidor');
        }
    };

    const [prefs, setPrefs] = useState(() => JSON.parse(localStorage.getItem('profilePrefs') || '{}'));

    // carregar preferências do backend ao montar
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const svc = await import('../../services/profile');
                const p = await svc.getPreferences();
                if (!mounted) return;
                if (p && p.notificacoes) {
                    setPrefs(p.notificacoes);
                    setProfile(prev => ({ ...prev, notificacoes: p.notificacoes }));
                }
            } catch (err) {
                // ok — fallback para local
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleSave = async () => {
        try {
            const updated = await updateProfile(form);
            setProfile(updated);
            setEditing(false);
            alert('Perfil atualizado');
        } catch (err) {
            console.error('Erro ao salvar perfil:', err);
            alert('Erro ao salvar');
        }
    };

    if (!profile && !error) return <div>Carregando perfil...</div>;

    if (error) return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Meu Perfil</h1>
            </header>
            <div className="card">
                <h3>Erro ao carregar perfil</h3>
                <p>Servidor indisponível. Por favor, tente novamente mais tarde.</p>
                <div style={{ marginTop: 12 }}>
                    <button onClick={() => {
                        setError(null);
                        setProfile(null);
                        // re-executar o efeito
                        (async () => {
                            try {
                                const p = await getProfile();
                                setProfile(p);
                                setForm({ nomeCompleto: p.nomeCompleto, email: p.email, telefone: p.telefone, empresa: p.empresa });
                                const u = await getUsage();
                                setUsage(u);
                            } catch (e) {
                                setError(e);
                            }
                        })();
                    }}>Tentar novamente</button>
                </div>

            </div>
        </div>
    );

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Meu Perfil</h1>
            </header>

            <section className="profile-overview">
                <div className="card">
                    <h3>Visão Geral</h3>
                    <div className="overview-grid">
                        <div className="avatar-col">
                            <img
                                src={previewUrl || profile.fotoPerfilUrl || profile.photoURL || '/placeholder-avatar.png'}
                                alt="avatar"
                                className="profile-avatar"
                                onError={() => {
                                    if (!imgError) {
                                        setImgError(true);
                                        setPreviewUrl(null);
                                    }
                                }}
                            />
                            <div style={{ marginTop: 8 }}>
                                <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e.target.files[0])} />
                                {uploadProgress > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <div className="upload-progress">
                                            <div className="upload-progress-inner" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                        <div style={{ fontSize: 12, color: '#666' }}>{uploadProgress}%</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="meta-col">
                            <p><strong>Plano:</strong> {profile.planoAtual}</p>
                            <p><strong>Status:</strong> {profile.statusAssinatura}</p>
                            <p><strong>Consultas usadas:</strong> {usage?.consultasUsadas}/{usage?.limiteConsultas}</p>
                            <div className="usage-bar">
                                <div className="usage-inner" style={{ width: `${Math.min(100, Math.round((usage?.consultasUsadas || 0) / (usage?.limiteConsultas || 1) * 100))}%` }} />
                            </div>
                            <p className="muted">Renovação: {formatDate(profile.dataRenovacao)}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <SubscriptionManager onChange={(s) => setProfile(p => ({ ...p, planoAtual: s?.planoAtual || p.planoAtual }))} />
                </div>

                <div className="card">
                    <ApiKeyManager />
                </div>
            </section>

            <section className="profile-main">
                <div className="card">
                    <h3>Dados Pessoais</h3>
                    {!editing ? (
                        <div>
                            <p><strong>Nome:</strong> {profile.nomeCompleto}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Telefone:</strong> {profile.telefone || '-'}</p>
                            <button onClick={() => setEditing(true)}>Editar</button>
                        </div>
                    ) : (
                        <div className="form">
                            <label>Nome</label>
                            <input value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} />
                            <label>Email</label>
                            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <label>Telefone</label>
                            <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
                            <div className="actions">
                                <button onClick={() => setEditing(false)}>Cancelar</button>
                                <button onClick={handleSave}>Salvar</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-side">
                    <MyMultas />
                    <PaymentsList />
                    <ActivityList />
                    <div className="card">
                        <h4>Preferências</h4>
                        <div>
                            <label><input type="checkbox" checked={!!prefs.email} onChange={() => handlePreferenceToggle('email')} /> Receber notificações por email</label>
                        </div>
                        <div>
                            <label><input type="checkbox" checked={!!prefs.push} onChange={() => handlePreferenceToggle('push')} /> Receber notificações push</label>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => {
                                // export data (best-effort)
                                fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/users/me/export', { credentials: 'include' })
                                    .then(r => {
                                        if (!r.ok) throw new Error('Não implementado');
                                        return r.blob();
                                    })
                                    .then(blob => {
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `dados-${profile.email || 'meu'}-${Date.now()}.json`;
                                        a.click();
                                    })
                                    .catch(() => alert('Exportação não disponível.'))
                            }}>Exportar meus dados</button>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <button className="danger" onClick={() => alert('Para excluir sua conta, entre em contato com o suporte ou use o painel administrativo. Esta ação não está disponível via UI para evitar exclusões acidentais.')}>Excluir conta</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
