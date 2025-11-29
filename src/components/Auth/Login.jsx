import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  AuthErrorCodes
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

// React Icons
import {
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaKey,
  FaSpinner,
  FaTimes,
  FaRegPaperPlane,
  FaTruck,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaRoute,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaGasPump,
  FaTools,
  FaChartLine,
  FaTree,
  FaUserShield,
  FaPallet,
  FaWarehouse,
  FaBoxes,
  FaClipboardCheck,
  FaBalanceScale,
  FaClock,
  FaMoneyBillWave,
  FaLeaf,
  FaRecycle,
  FaRoute as FaRouteIcon,
  FaDatabase,
  FaCloud,
  FaMobileAlt,
  FaChartBar,
  FaCogs,
  FaTrafficLight,
  FaParking,
  FaTachometerAlt,
  FaThermometerHalf,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';

import {
  FiMail,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiBarChart2,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiDatabase,
  FiClock,
  FiStar,
  FiAward,
  FiTarget,
  FiNavigation,
  FiTool,
  FiBattery,
  FiPieChart,
  FiGlobe,
  FiAnchor
} from 'react-icons/fi';

// Import da imagem da logo
import Logotipofretevelocidadelaranja from '../../assets/images/Logotipofretevelocidadelaranja.png';
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
  const [loginSuccess, setLoginSuccess] = useState(false);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Partículas animadas
  const particlesRef = useRef([]);

  // Slides com paleta de cores melhorada para contraste
  const slides = [
    {
      title: "Otimização de Rotas Inteligente",
      description: "Reduza custos operacionais em até 35% com algoritmos de IA que calculam as melhores rotas considerando tráfego, pedágios e restrições veiculares em tempo real.",
      tips: [
        "Planeje rotas noturnas para evitar congestionamentos",
        "Considere restrições de altura e peso dos veículos",
        "Use dados históricos para prever tempos de viagem",
        "Evite vias com pedágios desnecessários",
        "Otimize sequência de entregas por região"
      ],
      gradient: "linear-gradient(135deg, #1a2a6c 0%, #2a4b8c 50%, #3a6bcc 100%)",
      icon: FiNavigation,
      stat: "35% economia",
      animation: "routeOptimization",
      color: "#1a2a6c",
      textColor: "#ffffff",
      tipColor: "#e3f2fd"
    },
    {
      title: "Gestão de Combustível Eficiente",
      description: "Controle e reduza custos com combustível através de monitoramento em tempo real, analytics preditivos e relatórios detalhados de consumo.",
      tips: [
        "Monitore a pressão dos pneus regularmente",
        "Evite acelerações bruscas e frenagens",
        "Mantenha a manutenção preventiva em dia",
        "Use ar condicionado de forma inteligente",
        "Planeje paradas estratégicas para abastecimento"
      ],
      gradient: "linear-gradient(135deg, #b21f1f 0%, #d32f2f 50%, #f44336 100%)",
      icon: FaGasPump,
      stat: "18% redução",
      animation: "fuelManagement",
      color: "#b21f1f",
      textColor: "#ffffff",
      tipColor: "#ffebee"
    },
    {
      title: "Manutenção Preditiva Avançada",
      description: "Antecipe problemas mecânicos com IA que analisa padrões de uso, condições operacionais e dados de sensores em tempo real.",
      tips: [
        "Crie checklists diários de verificação",
        "Documente todas as manutenções realizadas",
        "Treine motoristas para identificar sinais",
        "Monitore desgaste de componentes-chave",
        "Use sensores IoT para monitoramento contínuo"
      ],
      gradient: "linear-gradient(135deg, #00796b 0%, #009688 50%, #4db6ac 100%)",
      icon: FiTool,
      stat: "45% menos paradas",
      animation: "predictiveMaintenance",
      color: "#00796b",
      textColor: "#ffffff",
      tipColor: "#e0f2f1"
    },
    {
      title: "Rastreamento em Tempo Real",
      description: "Acompanhe toda sua frota com precisão milimétrica, alertas inteligentes e relatórios de desempenho detalhados 24/7.",
      tips: [
        "Estabeleça geofences para áreas de risco",
        "Monitore comportamentos de direção",
        "Use relatórios para otimizar rotinas",
        "Configure alertas de excesso de velocidade",
        "Integre com sistemas de tráfego em tempo real"
      ],
      gradient: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)",
      icon: FiMapPin,
      stat: "99.9% precisão",
      animation: "realTimeTracking",
      color: "#1b5e20",
      textColor: "#ffffff",
      tipColor: "#e8f5e8"
    },
    {
      title: "Gestão de Custos Detalhada",
      description: "Controle total sobre todos os custos operacionais com analytics avançados, relatórios personalizáveis e insights acionáveis.",
      tips: [
        "Categorize despesas por tipo e veículo",
        "Estabeleça metas de redução de custos",
        "Compare desempenho entre períodos",
        "Identifique oportunidades de economia",
        "Automatize relatórios financeiros"
      ],
      gradient: "linear-gradient(135deg, #7b1fa2 0%, #8e24aa 50%, #9c27b0 100%)",
      icon: FiPieChart,
      stat: "28% mais controle",
      animation: "costManagement",
      color: "#7b1fa2",
      textColor: "#ffffff",
      tipColor: "#f3e5f5"
    },
    {
      title: "Sustentabilidade e ESG",
      description: "Reduza emissões e otimize recursos com práticas logísticas sustentáveis e relatórios de impacto ambiental detalhados.",
      tips: [
        "Otimize cargas para reduzir viagens vazias",
        "Use veículos com menor emissão de CO2",
        "Implemente rotas eco-eficientes",
        "Monitore pegada de carbono",
        "Promova reciclagem de embalagens"
      ],
      gradient: "linear-gradient(135deg, #33691e 0%, #558b2f 50%, #689f38 100%)",
      icon: FaLeaf,
      stat: "22% menos emissões",
      animation: "sustainability",
      color: "#33691e",
      textColor: "#ffffff",
      tipColor: "#f1f8e9"
    },
    {
      title: "Gestão de Carga Inteligente",
      description: "Maximize a capacidade de carga e minimize custos com algoritmos de cubagem avançados e planejamento de carga otimizado.",
      tips: [
        "Otimize disposição de pallets no veículo",
        "Use cubagem dinâmica para cargas mistas",
        "Considere peso x volume nas operações",
        "Planeje sequência de carga/descarga",
        "Use embalagens modulares inteligentes"
      ],
      gradient: "linear-gradient(135deg, #e65100 0%, #ef6c00 50%, #f57c00 100%)",
      icon: FaBoxes,
      stat: "30% melhor uso",
      animation: "loadManagement",
      color: "#e65100",
      textColor: "#ffffff",
      tipColor: "#fff3e0"
    },
    {
      title: "Segurança Avançada",
      description: "Proteja sua frota, cargas e motoristas com tecnologia de ponta, monitoramento 24/7 e protocolos de segurança robustos.",
      tips: [
        "Implemente câmeras de segurança em tempo real",
        "Use sensores de fadiga do motorista",
        "Monitore condições climáticas em rota",
        "Tenha plano de contingência para roubos",
        "Faça treinamentos regulares de segurança"
      ],
      gradient: "linear-gradient(135deg, #004d40 0%, #00695c 50%, #00796b 100%)",
      icon: FiShield,
      stat: "95% segurança",
      animation: "advancedSecurity",
      color: "#004d40",
      textColor: "#ffffff",
      tipColor: "#e0f2f1"
    },
    {
      title: "Gestão de Performance",
      description: "Aumente a eficiência operacional com métricas de desempenho em tempo real e relatórios de produtividade detalhados.",
      tips: [
        "Monitore KPIs de desempenho por veículo",
        "Estabeleça metas de produtividade realistas",
        "Analise dados de telemetria em tempo real",
        "Otimize tempo de carga e descarga",
        "Use benchmarking entre motoristas"
      ],
      gradient: "linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)",
      icon: FiTrendingUp,
      stat: "40% eficiência",
      animation: "performanceManagement",
      color: "#4a148c",
      textColor: "#ffffff",
      tipColor: "#f3e5f5"
    },
    {
      title: "Integração Multimodal",
      description: "Otimize sua cadeia logística com integração entre diferentes modais de transporte e planejamento coordenado.",
      tips: [
        "Integre transporte rodoviário e ferroviário",
        "Use centros de consolidação estratégicos",
        "Otimize transferência entre modais",
        "Monitore performance de cada modal",
        "Planeje rotas multimodais inteligentes"
      ],
      gradient: "linear-gradient(135deg, #01579b 0%, #0277bd 50%, #0288d1 100%)",
      icon: FaTruck,
      stat: "25% integração",
      animation: "multimodalIntegration",
      color: "#01579b",
      textColor: "#ffffff",
      tipColor: "#e1f5fe"
    }
  ];

  // Efeito de partículas
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.particles-container');
      if (!container) return;

      // Limpar partículas existentes
      container.innerHTML = '';

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 8 + 2}px;
          height: ${Math.random() * 8 + 2}px;
          background: ${slides[currentSlide].color}60;
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: floatParticle ${Math.random() * 25 + 15}s infinite ease-in-out;
          animation-delay: ${Math.random() * 10}s;
          opacity: ${Math.random() * 0.6 + 0.2};
        `;
        container.appendChild(particle);
      }
    };

    createParticles();
  }, [currentSlide]);

  // Auto-play do carrossel
  useEffect(() => {
    if (isAutoPlaying && !loginSuccess) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, slides.length, loginSuccess]);

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

      // Animação de sucesso
      setLoginSuccess(true);
      setMessage({
        text: 'Login realizado com sucesso! Redirecionando...',
        type: 'success'
      });

      setTimeout(() => navigate('/dashboard', {
        replace: true,
        state: { message: 'Login realizado com sucesso!' }
      }), 3000);

    } catch (error) {
      console.error('Erro no login:', error);
      handleLoginError(error);
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
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  // Renderizar animação específica para cada slide
  const renderSlideAnimation = () => {
    const currentSlideData = slides[currentSlide];
    
    return (
      <div className={`slide-animation ${currentSlideData.animation}`}>
        <div className="animation-container">
          {currentSlideData.animation === 'routeOptimization' && (
            <div className="route-animation">
              <div className="route-line"></div>
              <div className="route-dots">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="route-dot" style={{ animationDelay: `${i * 0.6}s` }}></div>
                ))}
              </div>
              <div className="route-pin start"></div>
              <div className="route-pin end"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'fuelManagement' && (
            <div className="fuel-animation">
              <div className="fuel-gauge">
                <div className="fuel-level"></div>
                <div className="fuel-indicator"></div>
              </div>
              <div className="fuel-drops">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="fuel-drop" style={{ animationDelay: `${i * 0.8}s` }}></div>
                ))}
              </div>
            </div>
          )}
          
          {currentSlideData.animation === 'predictiveMaintenance' && (
            <div className="maintenance-animation">
              <div className="gear gear-1"></div>
              <div className="gear gear-2"></div>
              <div className="gear gear-3"></div>
              <div className="maintenance-sparkle"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'realTimeTracking' && (
            <div className="tracking-animation">
              <div className="radar"></div>
              <div className="signal signal-1"></div>
              <div className="signal signal-2"></div>
              <div className="signal signal-3"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'costManagement' && (
            <div className="cost-animation">
              <div className="chart-bars">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="chart-bar" style={{ '--delay': `${i * 0.3}s` }}></div>
                ))}
              </div>
              <div className="chart-line"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'sustainability' && (
            <div className="sustainability-animation">
              <div className="leaf leaf-1"></div>
              <div className="leaf leaf-2"></div>
              <div className="leaf leaf-3"></div>
              <div className="eco-bubble bubble-1"></div>
              <div className="eco-bubble bubble-2"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'loadManagement' && (
            <div className="load-animation">
              <div className="package package-1"></div>
              <div className="package package-2"></div>
              <div className="package package-3"></div>
              <div className="package package-4"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'advancedSecurity' && (
            <div className="security-animation">
              <div className="shield"></div>
              <div className="security-ring ring-1"></div>
              <div className="security-ring ring-2"></div>
              <div className="security-dot"></div>
            </div>
          )}
          
          {currentSlideData.animation === 'performanceManagement' && (
            <div className="performance-animation">
              <div className="performance-chart">
                <div className="chart-point point-1"></div>
                <div className="chart-point point-2"></div>
                <div className="chart-point point-3"></div>
                <div className="chart-point point-4"></div>
                <div className="chart-line"></div>
              </div>
            </div>
          )}
          
          {currentSlideData.animation === 'multimodalIntegration' && (
            <div className="multimodal-animation">
              <div className="modal modal-1"></div>
              <div className="modal modal-2"></div>
              <div className="modal modal-3"></div>
              <div className="connection-line"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`auth-container ${loginSuccess ? 'login-success' : ''}`}>
      {/* Efeito de partículas */}
      <div className="particles-container"></div>

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
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/" className="back-button">
                <FaArrowLeft className="back-icon" />
                Voltar ao site
              </Link>
            </motion.div>

            <div className="brand-section">
              <motion.div
                className="brand-logo-container"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                <div className="logo-wrapper">
                  <img src={Logotipofretevelocidadelaranja} alt="Transita.AI" className="logo-image" />
                  <div className="logo-glow"></div>
                </div>
                <motion.h1 
                  className="brand-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Transita<span className="gradient-text">.AI</span>
                </motion.h1>
              </motion.div>
              <motion.p 
                className="brand-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Sua jornada logística inteligente
              </motion.p>
            </div>

            <motion.div 
              className="welcome-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2>Bem-vindo de volta! 👋</h2>
              <p>Acesse sua conta para gerenciar sua operação logística</p>
            </motion.div>
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
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
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
                <div className="input-focus-border"></div>
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
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
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
                <div className="input-focus-border"></div>
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
            </motion.div>

            <motion.div
              className="form-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
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
            </motion.div>

            <motion.button
              type="submit"
              className="auth-button primary"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
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

          {/* Footer Simplificado */}
          <motion.div
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
          >
            <div className="footer-content">
              <div className="security-notice">
                <FiShield className="security-icon" />
                <span>Ambiente 100% seguro e criptografado</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Carrossel de Dicas de Logística - Direita */}
      <motion.div
        className="presentation-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          className="slide-background"
          style={{ 
            background: slides[currentSlide].gradient,
            color: slides[currentSlide].textColor
          }}
        >
          <div className="background-glow glow-1" style={{ background: slides[currentSlide].color }}></div>
          <div className="background-glow glow-2" style={{ background: slides[currentSlide].color }}></div>
          <div className="background-glow glow-3" style={{ background: slides[currentSlide].color }}></div>
        </div>

        {/* Animação específica do slide */}
        {renderSlideAnimation()}

        <div className="presentation-content">
          {/* Navegação */}
          <div className="slide-nav">
            <motion.button
              className="nav-button prev"
              onClick={prevSlide}
              aria-label="Slide anterior"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft />
            </motion.button>

            <div className="nav-dots">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            <motion.button
              className="nav-button next"
              onClick={nextSlide}
              aria-label="Próximo slide"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight />
            </motion.button>
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
                <div className="slide-header">
                  <motion.div 
                    className="slide-icon"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    style={{ backgroundColor: `${slides[currentSlide].color}30` }}
                  >
                    {(() => {
                      const IconComponent = slides[currentSlide].icon;
                      return <IconComponent className="icon" style={{ color: slides[currentSlide].textColor }} />;
                    })()}
                  </motion.div>
                  <motion.div 
                    className="slide-stat"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ 
                      backgroundColor: `${slides[currentSlide].color}40`,
                      border: `1px solid ${slides[currentSlide].color}60`
                    }}
                  >
                    <FiBarChart2 className="stat-icon" />
                    <span>{slides[currentSlide].stat}</span>
                  </motion.div>
                </div>

                <div className="slide-text">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ color: slides[currentSlide].textColor }}
                  >
                    {slides[currentSlide].title}
                  </motion.h2>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{ color: slides[currentSlide].textColor }}
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    className="logistics-tips"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <h4 style={{ color: slides[currentSlide].textColor }}>
                      <FiSettings className="tips-icon" />
                      Dicas Práticas:
                    </h4>
                    <ul>
                      {slides[currentSlide].tips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          style={{ 
                            backgroundColor: `${slides[currentSlide].color}20`,
                            borderLeftColor: slides[currentSlide].color,
                            color: slides[currentSlide].textColor
                          }}
                        >
                          <FiClock className="tip-icon" style={{ color: slides[currentSlide].color }} />
                          {tip}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicador */}
          <div className="slide-indicator">
            <span className="current" style={{ color: slides[currentSlide].textColor }}>0{currentSlide + 1}</span>
            <span className="divider" style={{ color: `${slides[currentSlide].textColor}80` }}>/</span>
            <span className="total" style={{ color: `${slides[currentSlide].textColor}80` }}>0{slides.length}</span>
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
                <motion.button 
                  className="modal-close" 
                  onClick={closeResetModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
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
                    <div className="input-focus-border"></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <motion.button
                  type="button"
                  className="auth-button secondary"
                  onClick={closeResetModal}
                  disabled={resetLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  className="auth-button primary"
                  onClick={() => handlePasswordReset(resetEmail)}
                  disabled={resetLoading || !resetEmail}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animação de Login Bem-sucedido */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            className="login-success-animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-content"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                className="success-check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <FaCheckCircle />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Login Realizado com Sucesso!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Redirecionando para o dashboard...
              </motion.p>
              <motion.div
                className="success-progress"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}