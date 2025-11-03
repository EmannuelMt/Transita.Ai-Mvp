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
import '../styles/login.css'
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRocket,
  FaPalette,
  FaShieldAlt,
  FaSignInAlt,
  FaUserPlus,
  FaKey,
  FaUser,
  FaSpinner,
  FaTimes,
  FaRegPaperPlane,
  FaTruck,
  FaMapMarkedAlt,
  FaChartLine,
  FaClock,
  FaAward,
  FaGlobeAmericas,
  FaLeaf,
  FaCogs,
  FaRoute,
  FaChartBar,
  FaLock,
  FaStar,
  FaPlay,
  FaBook,
  FaHandshake,
  FaBrain,
  FaRecycle,
  FaArrowRight,
  FaCheck,
  FaArrowLeft,
  FaArrowRight as FaArrowRightSolid,
  FaChevronLeft,
  FaChevronRight
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
  FiTarget,
  FiCalendar,
  FiDollarSign,
  FiArrowRight,
  FiChevronDown
} from 'react-icons/fi';

import {
  RiRoadMapLine,
  RiTeamLine,
  RiGlobalLine,
  RiLightbulbFlashLine,
  RiCustomerService2Line,
  RiBarChartBoxLine
} from 'react-icons/ri';

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
  const [securityTipIndex, setSecurityTipIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const securityTips = [
    "Use senhas fortes com combinações de letras, números e símbolos",
    "Ative a autenticação de dois fatores para maior segurança",
    "Nunca compartilhe suas credenciais de login com ninguém",
    "Verifique sempre o URL do site antes de inserir suas informações",
    "Mantenha seu navegador e sistema operacional atualizados"
  ];

  const sections = [
    {
      id: 'hero',
      title: 'Transita.AI',
      subtitle: 'Transformando a logística brasileira com tecnologia de ponta',
      icon: FaTruck,
      background: 'var(--gradient-hero)'
    },
    {
      id: 'story',
      title: 'Nossa História',
      subtitle: 'Da startup à referência em logística inteligente',
      icon: RiRoadMapLine,
      background: 'var(--gradient-primary)'
    },
    {
      id: 'values',
      title: 'Nossos Valores',
      subtitle: 'Princípios que guiam nossa jornada',
      icon: RiTeamLine,
      background: 'var(--gradient-secondary)'
    },
    {
      id: 'features',
      title: 'Nossas Soluções',
      subtitle: 'Tecnologia avançada para sua operação',
      icon: RiBarChartBoxLine,
      background: 'var(--gradient-success)'
    },
    {
      id: 'plans',
      title: 'Planos e Preços',
      subtitle: 'Escolha o ideal para seu negócio',
      icon: FiDollarSign,
      background: 'var(--gradient-warning)'
    }
  ];

  const features = [
    {
      icon: FaCogs,
      title: "Gestão de Frota Inteligente",
      description: "Controle completo de veículos, manutenções e custos operacionais com IA preditiva",
      number: "01"
    },
    {
      icon: FaMapMarkedAlt,
      title: "Rastreamento em Tempo Real",
      description: "Monitoramento 24/7 com atualizações instantâneas e alertas inteligentes",
      number: "02"
    },
    {
      icon: FaRoute,
      title: "Otimização de Rotas Avançada",
      description: "Algoritmos de IA para planejamento de rotas que reduzem custos em até 30%",
      number: "03"
    },
    {
      icon: FaChartBar,
      title: "Analytics Preditivo",
      description: "Relatórios detalhados com insights acionáveis e previsões de desempenho",
      number: "04"
    }
  ];

  const values = [
    {
      icon: RiLightbulbFlashLine,
      title: "Inovação",
      description: "Buscamos constantemente novas tecnologias e soluções criativas"
    },
    {
      icon: RiTeamLine,
      title: "Parceria",
      description: "Trabalhamos lado a lado com nossos clientes para o sucesso mútuo"
    },
    {
      icon: FaShieldAlt,
      title: "Confiança",
      description: "Segurança e transparência em todas as nossas operações"
    },
    {
      icon: FaRecycle,
      title: "Sustentabilidade",
      description: "Compromisso com operações logísticas eco-friendly"
    }
  ];

  const plans = [
    {
      name: "Essencial",
      price: "R$ 299",
      period: "/mês",
      popular: false,
      features: [
        "Até 5 veículos",
        "Rastreamento básico",
        "Relatórios simples",
        "Suporte por email",
        "App móvel básico"
      ],
      buttonText: "Começar Agora"
    },
    {
      name: "Profissional",
      price: "R$ 599",
      period: "/mês",
      popular: true,
      badge: "Mais Popular",
      features: [
        "Até 20 veículos",
        "Rastreamento avançado",
        "Relatórios detalhados",
        "Otimização de rotas com IA",
        "Suporte prioritário 24/7"
      ],
      buttonText: "Começar Agora"
    },
    {
      name: "Empresarial",
      price: "R$ 999",
      period: "/mês",
      popular: false,
      features: [
        "Frota ilimitada",
        "Todos os recursos premium",
        "Dashboard customizado",
        "Suporte dedicado 24/7",
        "Consultoria estratégica"
      ],
      buttonText: "Começar Agora"
    }
  ];

  // Auto-play do carrossel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSection((prev) => (prev + 1) % sections.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, sections.length]);

  // Carregar dados salvos do localStorage ao inicializar
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // Rotacionar dicas de segurança
    const tipInterval = setInterval(() => {
      setSecurityTipIndex(prev => (prev + 1) % securityTips.length);
    }, 5000);

    return () => {
      clearInterval(tipInterval);
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  // Verificar se há mensagem de redirecionamento
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
          text: 'Muitas tentativas de login. Sua conta foi temporariamente bloqueada por segurança. Tente novamente mais tarde ou redefina sua senha.', 
          type: 'error' 
        });
        break;
      case AuthErrorCodes.USER_DISABLED:
        setMessage({ 
          text: 'Esta conta foi desativada. Entre em contato com o suporte para mais informações.', 
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
        text: 'Email de redefinição de senha enviado! Verifique sua caixa de entrada e pasta de spam.', 
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

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSection = (index) => {
    setCurrentSection(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0: // Hero
        return (
          <div className="carousel-hero">
            <motion.div
              className="hero-logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="logo-icon-wrapper">
                <FaTruck className="logo-icon" />
              </div>
              <h1>Transita<span className="gradient-text">.AI</span></h1>
            </motion.div>
            
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Transformando a logística brasileira com tecnologia de ponta
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Soluções inteligentes em gestão de frotas com inteligência artificial 
              para empresas que buscam eficiência e redução de custos
            </motion.p>

            <motion.div
              className="hero-stats"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="stats-grid">
                <div className="stat-item">
                  <FiUsers className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Clientes</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiPackage className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Entregas/Mês</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiTrendingUp className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">40%</span>
                    <span className="stat-label">Economia</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 1: // Story
        return (
          <div className="carousel-story">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Nossa História</h2>
              <div className="story-content">
                <p>
                  Fundada em 2018, a Transita.AI nasceu da visão de revolucionar o setor 
                  logístico brasileiro através da tecnologia. De uma pequena startup a 
                  referência em soluções inteligentes para gestão de frotas.
                </p>
                <p>
                  Nossa missão é simplificar a complexidade das operações logísticas, 
                  proporcionando eficiência, redução de custos e sustentabilidade para 
                  empresas de todos os portes.
                </p>
              </div>
              
              <div className="journey-highlights">
                <div className="journey-item">
                  <span className="year">2018</span>
                  <span className="event">Fundação</span>
                </div>
                <div className="journey-item">
                  <span className="year">2021</span>
                  <span className="event">Série A</span>
                </div>
                <div className="journey-item">
                  <span className="year">2024</span>
                  <span className="event">+1000 Clientes</span>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 2: // Values
        return (
          <div className="carousel-values">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Nossos Valores</h2>
              <div className="values-grid">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    className="value-card"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <div className="value-icon-wrapper">
                      <value.icon className="value-icon" />
                    </div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 3: // Features
        return (
          <div className="carousel-features">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Nossas Soluções</h2>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="feature-card"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <div className="feature-header">
                      <div className="feature-number">{feature.number}</div>
                      <div className="feature-icon-wrapper">
                        <feature.icon className="feature-icon" />
                      </div>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 4: // Plans
        return (
          <div className="carousel-plans">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Planos e Preços</h2>
              <div className="plans-grid">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    className={`plan-card ${plan.popular ? 'popular' : ''}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    {plan.popular && (
                      <div className="plan-badge">
                        <FaStar className="badge-icon" />
                        {plan.badge}
                      </div>
                    )}
                    <div className="plan-header">
                      <h3>{plan.name}</h3>
                      <div className="plan-price">
                        <span className="price">{plan.price}</span>
                        <span className="period">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="plan-features">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>
                          <FaCheck className="feature-check" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="plan-button">
                      {plan.buttonText}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      {/* Carrossel Horizontal - Lado Esquerdo */}
      <motion.div
        className="auth-carousel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="carousel-background"
          style={{ background: sections[currentSection].background }}
        >
          <div className="background-glow glow-1"></div>
          <div className="background-glow glow-2"></div>
          <div className="background-glow glow-3"></div>
        </div>

        <div className="carousel-container">
          {/* Navegação do Carrossel */}
          <div className="carousel-nav">
            <button 
              className="nav-button prev"
              onClick={prevSection}
              aria-label="Seção anterior"
            >
              <FaChevronLeft />
            </button>
            
            <div className="nav-dots">
              {sections.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentSection ? 'active' : ''}`}
                  onClick={() => goToSection(index)}
                  aria-label={`Ir para seção ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="nav-button next"
              onClick={nextSection}
              aria-label="Próxima seção"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Conteúdo do Carrossel */}
          <div className="carousel-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="carousel-slide"
              >
                <div className="section-icon-wrapper">
           
                </div>
                {renderSectionContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicador de Seção */}
          <div className="section-indicator">
            <span className="section-number">0{currentSection + 1}</span>
            <span className="section-divider">/</span>
            <span className="section-total">0{sections.length}</span>
            <span className="section-title">{sections[currentSection].title}</span>
          </div>
        </div>

        {/* Dica de Segurança */}
        <motion.div 
          className="security-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="tip-header">
            <FiHelpCircle className="tip-icon" />
            <span>Dica de Segurança</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={securityTipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="tip-content"
            >
              {securityTips[securityTipIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Card de Login - Lado Direito */}
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="card-content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link to="/" className="back-button">
              <FiArrowLeft className="back-icon" />
              Voltar para home
            </Link>

            <div className="auth-brand">
              <motion.div
                className="brand-logo"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTruck className="brand-icon" />
              </motion.div>
              <motion.h1
                className="brand-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Transita<span className="gradient-text">.AI</span>
              </motion.h1>
              <p className="brand-tagline">Sua jornada logística inteligente</p>
            </div>

            <motion.div
              className="auth-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2>Bem-vindo de volta! 👋</h2>
              <p>Entre na sua conta para acessar o dashboard completo</p>
            </motion.div>

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

            <motion.form
              onSubmit={handleEmailLogin}
              className="auth-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="label-icon" />
                  Email
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
                  Lembrar-me
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
                    Entrar na plataforma
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              className="auth-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <p>
                Não tem uma conta?{' '}
                <Link to="/registro" className="auth-link">
                  <FaUserPlus className="link-icon" />
                  Criar conta agora
                </Link>
              </p>
            </motion.div>
          </motion.div>
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