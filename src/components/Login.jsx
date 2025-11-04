import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  AuthErrorCodes
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css'
// React Icons
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSignInAlt,
  FaUserPlus,
  FaKey,
  FaSpinner,
  FaTimes,
  FaRegPaperPlane,
  FaTruck,
  FaMapMarkedAlt,
  FaChartLine,
  FaShieldAlt,
  FaCogs,
  FaRoute,
  FaChartBar,
  FaLock,
  FaStar,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaBook
} from 'react-icons/fa';

import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertTriangle,
  FiHelpCircle,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiShield,
  FiDollarSign,
  FiArrowRight
} from 'react-icons/fi';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const slides = [
    {
      title: "Gestão Inteligente de Frotas",
      description: "Controle completo de veículos, manutenções e custos operacionais com IA preditiva para otimizar sua operação logística.",
      stats: [
        { value: "500+", label: "Clientes Ativos" },
        { value: "40%", label: "Redução de Custos" }
      ],
      gradient: "var(--gradient-primary)",
      icon: FaTruck
    },
    {
      title: "Rastreamento em Tempo Real",
      description: "Monitoramento 24/7 com atualizações instantâneas, alertas inteligentes e relatórios detalhados de desempenho.",
      stats: [
        { value: "50K+", label: "Entregas/Mês" },
        { value: "99.8%", label: "Disponibilidade" }
      ],
      gradient: "var(--gradient-secondary)",
      icon: FaMapMarkedAlt
    },
    {
      title: "Otimização Avançada",
      description: "Algoritmos de IA para planejamento de rotas que reduzem custos em até 30% e aumentam a eficiência operacional.",
      stats: [
        { value: "85%", label: "Eficiência" },
        { value: "30%", label: "Economia" }
      ],
      gradient: "var(--gradient-success)",
      icon: FaRoute
    },
    {
      title: "Segurança Total",
      description: "Sistema multicamada com criptografia de ponta a ponta, backups automáticos e conformidade com LGPD.",
      stats: [
        { value: "100%", label: "Conformidade" },
        { value: "24/7", label: "Monitoramento" }
      ],
      gradient: "var(--gradient-warning)",
      icon: FaShieldAlt
    }
  ];

  // Auto-play do carrossel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  // Carregar dados salvos
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Verificar mensagem de redirecionamento
  useEffect(() => {
    if (location.state?.message) {
      setMessage({ text: location.state.message, type: 'success' });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (!userCredential.user.emailVerified) {
        setMessage({ 
          text: 'Por favor, verifique seu email antes de fazer login. Um novo email de verificação foi enviado.', 
          type: 'warning' 
        });
        await sendEmailVerification(userCredential.user);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userRef);

      const userData = {
        lastLogin: serverTimestamp(),
        loginCount: (userDoc.data()?.loginCount || 0) + 1,
        emailVerified: userCredential.user.emailVerified
      };

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || formData.email.split('@')[0],
          photoURL: userCredential.user.photoURL || '',
          provider: 'email',
          emailVerified: userCredential.user.emailVerified,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          loginCount: 1
        });
      } else {
        await updateDoc(userRef, userData);
      }

      setMessage({ 
        text: 'Login realizado com sucesso! Redirecionando...', 
        type: 'success' 
      });
      
      setTimeout(() => navigate('/dashboard', { 
        replace: true,
        state: { message: 'Login realizado com sucesso!' }
      }), 1500);

    } catch (error) {
      console.error('Erro no login:', error);
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (error) => {
    switch (error.code) {
      case AuthErrorCodes.USER_DELETED:
        setErrors({ email: 'Usuário não encontrado' });
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        setErrors({ password: 'Senha incorreta' });
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        setErrors({ email: 'Email inválido' });
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        setMessage({ 
          text: 'Muitas tentativas de login. Sua conta foi temporariamente bloqueada por segurança.', 
          type: 'error' 
        });
        break;
      case AuthErrorCodes.USER_DISABLED:
        setMessage({ 
          text: 'Esta conta foi desativada. Entre em contato com o suporte.', 
          type: 'error' 
        });
        break;
      case AuthErrorCodes.NETWORK_REQUEST_FAILED:
        setMessage({ 
          text: 'Erro de conexão. Verifique sua internet e tente novamente.', 
          type: 'error' 
        });
        break;
      default:
        setMessage({ 
          text: 'Erro ao fazer login. Verifique suas credenciais e tente novamente.', 
          type: 'error' 
        });
    }
  };

  const handlePasswordReset = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ 
        text: 'Por favor, insira um email válido.', 
        type: 'error' 
      });
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ 
        text: 'Email de redefinição de senha enviado! Verifique sua caixa de entrada.', 
        type: 'success' 
      });
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      if (error.code === AuthErrorCodes.USER_DELETED) {
        setMessage({ 
          text: 'Nenhuma conta encontrada com este email.', 
          type: 'error' 
        });
      } else {
        setMessage({ 
          text: 'Erro ao enviar email de redefinição. Tente novamente.', 
          type: 'error' 
        });
      }
    } finally {
      setResetLoading(false);
    }
  };

  const openResetModal = () => {
    setResetEmail(formData.email);
    setShowResetModal(true);
    setMessage({ text: '', type: '' });
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetEmail('');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="auth-container">
      {/* Tela de Login Fixa - Esquerda */}
      <motion.div
        className="auth-panel"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="panel-content">
          {/* Header */}
          <div className="panel-header">
            <Link to="/" className="back-button">
              <FiArrowLeft className="back-icon" />
              Voltar ao site
            </Link>
            
            <div className="brand-section">
              <motion.div
                className="brand-logo"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTruck className="brand-icon" />
              </motion.div>
              <div className="brand-text">
                <h1>Transita<span className="gradient-text">.AI</span></h1>
                <p className="brand-tagline">Sua jornada logística inteligente</p>
              </div>
            </div>

            <div className="welcome-section">
              <h2>Bem-vindo de volta! 👋</h2>
              <p>Acesse sua conta para gerenciar sua operação</p>
            </div>
          </div>

          {/* Messages */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                className={`auth-message ${message.type}`}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {message.type === 'success' || message.type === 'info' ? (
                  <FiCheckCircle className="message-icon" />
                ) : (
                  <FiAlertTriangle className="message-icon" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.form
            onSubmit={handleEmailLogin}
            className="auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="label-icon" />
                Endereço de Email
              </label>
              <div className="input-container">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={errors.email ? 'error' : ''}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertTriangle className="error-icon" />
                  {errors.email}
                </motion.span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock className="label-icon" />
                Senha
              </label>
              <div className="input-container">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Sua senha"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <motion.button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertTriangle className="error-icon" />
                  {errors.password}
                </motion.span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading} 
                />
                <span className="checkmark"></span>
                Manter conectado
              </label>
              <motion.button
                type="button"
                className="forgot-password-btn"
                onClick={openResetModal}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaKey className="forgot-icon" />
                Esqueci a senha
              </motion.button>
            </div>

            <motion.button
              type="submit"
              className="auth-button primary"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="button-loading">
                  <FaSpinner className="spinner" />
                  Entrando...
                </div>
              ) : (
                <>
                  <FaSignInAlt className="button-icon" />
                  Acessar Plataforma
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="footer-content">
              <p>
                Não tem uma conta?{' '}
                <Link to="/registro" className="auth-link">
                  <FaUserPlus className="link-icon" />
                  Solicitar demonstração
                </Link>
              </p>
              <div className="security-notice">
                <FiShield className="security-icon" />
                <span>Ambiente 100% seguro e criptografado</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Carrossel de Apresentação - Direita */}
      <motion.div
        className="presentation-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div 
          className="slide-background"
          style={{ background: slides[currentSlide].gradient }}
        >
          <div className="background-glow glow-1"></div>
          <div className="background-glow glow-2"></div>
          <div className="background-glow glow-3"></div>
        </div>

        <div className="presentation-content">
          {/* Navegação */}
          <div className="slide-nav">
            <button 
              className="nav-button prev"
              onClick={prevSlide}
              aria-label="Slide anterior"
            >
              <FaChevronLeft />
            </button>
            
            <div className="nav-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="nav-button next"
              onClick={nextSlide}
              aria-label="Próximo slide"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Conteúdo do Slide */}
          <div className="slide-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.7 }}
                className="slide-inner"
              >
                <div className="slide-icon">
                  {(() => {
                    const IconComponent = slides[currentSlide].icon;
                    return <IconComponent className="icon" />;
                  })()}
                </div>

                <div className="slide-text">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {slides[currentSlide].title}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    className="slide-stats"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    {slides[currentSlide].stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicador */}
          <div className="slide-indicator">
            <span className="current">0{currentSlide + 1}</span>
            <span className="divider">/</span>
            <span className="total">0{slides.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Modal de Recuperação de Senha */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeResetModal}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Recuperar Senha</h3>
                <button className="modal-close" onClick={closeResetModal}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <p>Digite seu email para receber instruções de recuperação de senha:</p>
                <div className="form-group">
                  <div className="input-container">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="seu@email.com"
                      disabled={resetLoading}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="auth-button secondary"
                  onClick={closeResetModal}
                  disabled={resetLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="auth-button primary"
                  onClick={() => handlePasswordReset(resetEmail)}
                  disabled={resetLoading || !resetEmail}
                >
                  {resetLoading ? (
                    <div className="button-loading">
                      <FaSpinner className="spinner" />
                      Enviando...
                    </div>
                  ) : (
                    <>
                      <FaRegPaperPlane className="button-icon" />
                      Enviar Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}