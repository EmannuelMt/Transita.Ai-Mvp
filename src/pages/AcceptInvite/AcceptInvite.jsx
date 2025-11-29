import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import './AcceptInvite.css';

const AcceptInvite = ({ user }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de convite não fornecido');
            return;
        }

        // precisa estar logado
        if (!user) {
            setStatus('error');
            setMessage('Faça login para aceitar o convite');
            return;
        }

        const acceptInvite = async () => {
            try {
                await api.post('/invites/confirm', { token });
                setStatus('success');
                setMessage('Você agora é um administrador! Redirecionando...');
                setTimeout(() => navigate('/admin'), 2000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || err.message || 'Erro ao confirmar convite');
            }
        };

        acceptInvite();
    }, [token, user, navigate]);

    return (
        <div className="accept-invite-page">
            <div className="invite-container">
                <h2>Confirmação de Convite</h2>

                {status === 'loading' && (
                    <div className="invite-status">
                        <div className="loading-spinner"></div>
                        <p>Processando convite...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="invite-status success">
                        <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p>{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="invite-status error">
                        <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p>{message}</p>
                        {!user && (
                            <button
                                className="login-button"
                                onClick={() => navigate('/login')}
                            >
                                Fazer Login
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;