import React, { useState } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle
} from '../firebase/auth';
import '../styles/login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: 'teste@transita.ai',
    password: '123456',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await loginWithEmail(formData.email, formData.password);
      } else {
        result = await registerWithEmail(formData.email, formData.password);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onLogin(result.user);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginWithGoogle();
      if (result.error) {
        setError(result.error);
      } else {
        onLogin(result.user);
      }
    } catch (err) {
      setError('Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData(prev => ({
      ...prev,
      confirmPassword: ''
    }));
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'teste@transita.ai',
      password: '123456',
      confirmPassword: '123456'
    });
    setError(null);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="app-logo">
            <span className="logo-icon">🚀</span>
            <h1 className="app-name">Transita.AI</h1>
          </div>
          <p className="login-subtitle">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="Sua senha"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              minLength="6"
            />
          </div>

          {/* Confirm Password Field */}
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-field"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                minLength="6"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-button primary"
          >
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>{isLogin ? 'Entrando...' : 'Criando conta...'}</span>
              </div>
            ) : (
              isLogin ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>ou</span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="login-button google"
        >
          <span className="google-icon">🔍</span>
          Continuar com Google
        </button>

        {/* Toggle Mode */}
        <div className="toggle-mode">
          <p>
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-button"
              disabled={loading}
            >
              {isLogin ? ' Criar conta' : ' Fazer login'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        {isLogin && (
          <div className="demo-info">
            <p className="demo-title">Dados para demonstração</p>
            <button
              onClick={fillDemoCredentials}
              className="demo-button"
              disabled={loading}
              type="button"
            >
              <span className="demo-icon">🎯</span>
              Usar dados de demo
            </button>
            <div className="demo-credentials">
              <div className="credential-item">
                <span>Email:</span>
                <code>teste@transita.ai</code>
              </div>
              <div className="credential-item">
                <span>Senha:</span>
                <code>123456</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
