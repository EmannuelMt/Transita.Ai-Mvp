import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaChartLine, 
  FaUsers,
  FaRoute,
  FaTools,
  FaPhone,
  FaStar,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaPlay,
  FaQuestionCircle,
  FaCreditCard,
  FaArrowRight,
  FaSync,
  FaLeaf,
  FaRocket,
  FaHeadset,
  FaCog,
  FaDatabase,
  FaMobileAlt,
  FaCloud,
  FaLock,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaExternalLinkAlt,
  FaRegHeart,
  FaBolt,
  FaAward,
  FaGlobeAmericas
} from 'react-icons/fa';
import '../styles/home.css';

// Hook personalizado para animações de entrada
const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });
  
  return { ref, isInView };
};

// Componente de Partículas Interativas
const InteractiveParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="interactive-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Componente de Card de Ação Rápida Super Melhorado
const QuickActionCard = ({ icon, title, description, color, action, badge, index }) => {
  const { ref, isInView } = useScrollAnimation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button 
      ref={ref}
      className={`quick-action-card ${color}`}
      onClick={action}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          duration: 0.6, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }
      } : { opacity: 0, y: 50, rotateX: 45 }}
    >
      <div className="action-card-glow"></div>
      <div className="action-card-background"></div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="action-card-sparkle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="action-card-header">
        <div className="action-icon-wrapper">
          <motion.div
            className="action-icon-container"
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="action-icon">{icon}</span>
            {badge && (
              <motion.span 
                className="action-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ 
                  delay: index * 0.1 + 0.3, 
                  type: "spring",
                  stiffness: 500 
                }}
              >
                {badge}
              </motion.span>
            )}
          </motion.div>
        </div>
        <motion.div 
          className="action-arrow"
          animate={isHovered ? { x: 5, scale: 1.1 } : { x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <FaArrowRight />
        </motion.div>
      </div>

      <div className="action-card-content">
        <motion.h3 
          className="action-title"
          animate={isHovered ? { color: 'var(--primary)' } : {}}
        >
          {title}
        </motion.h3>
        <p className="action-description">{description}</p>
      </div>

      <motion.div 
        className="action-hover-effect"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
      />
    </motion.button>
  );
};

// Componente de Estatística com Gráficos em Tempo Real
const AnimatedStatCard = ({ icon, value, label, color, change, trend, subtitle, index }) => {
  const { ref, isInView } = useScrollAnimation();
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const target = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) || 0 : value;
      const duration = 2000;
      const steps = 60;
      const stepValue = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          setAnimatedValue(target);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const displayValue = typeof value === 'string' && value.includes('R$') 
    ? `R$ ${animatedValue.toLocaleString()}`
    : typeof value === 'string' && value.includes('%')
    ? `${animatedValue}%`
    : animatedValue;

  return (
    <motion.div 
      ref={ref}
      className={`stat-card ${color}`}
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.8, 
          delay: index * 0.15,
          type: "spring",
          stiffness: 80
        }
      } : { opacity: 0, y: 60, scale: 0.8 }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      <div className="stat-background-pattern"></div>
      <div className="stat-glow"></div>
      <div className="stat-particles"></div>
      
      <div className="stat-content">
        <div className="stat-main">
          <motion.div 
            className="stat-icon-wrapper"
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
          >
            <span className="stat-icon">{icon}</span>
          </motion.div>
          <div className="stat-values">
            <motion.h3 
              className="stat-value"
              key={animatedValue}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {displayValue}
            </motion.h3>
            <p className="stat-label">{label}</p>
            {subtitle && (
              <motion.p 
                className="stat-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.5 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
        <motion.div 
          className={`stat-trend ${trend}`}
          initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
          animate={isInView ? { 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            transition: { 
              delay: index * 0.15 + 0.3,
              type: "spring",
              stiffness: 200
            }
          } : { opacity: 0, scale: 0.5, rotate: 180 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.span 
            className="trend-icon"
            animate={trend === 'up' ? { y: [0, -2, 0] } : { y: [0, 2, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {trend === 'up' ? '↗' : '↘'}
          </motion.span>
          {change}
        </motion.div>
      </div>

      {/* Mini gráfico animado */}
      <div className="stat-chart">
        {[20, 40, 60, 80, 100].map((height, i) => (
          <motion.div
            key={i}
            className="chart-bar"
            initial={{ height: 0 }}
            animate={isInView ? { height: `${height}%` } : { height: 0 }}
            transition={{ 
              delay: index * 0.15 + i * 0.1,
              duration: 0.8,
              type: "spring",
              stiffness: 50
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Componente de Feature Card com Efeito Parallax
const FeatureCard = ({ icon, title, description, delay = 0, index }) => {
  const { ref, isInView } = useScrollAnimation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={ref}
      className="feature-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.7, 
          delay: delay,
          type: "spring",
          stiffness: 80
        }
      } : { opacity: 0, y: 80, scale: 0.9 }}
      whileHover={{ 
        y: -20,
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
    >
      <div className="feature-card-glow"></div>
      <div className="feature-card-background"></div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="feature-card-orb"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="feature-icon-container"
        animate={isHovered ? { 
          scale: 1.2,
          rotateY: 180,
          transition: { duration: 0.6 }
        } : { 
          scale: 1,
          rotateY: 0,
          transition: { duration: 0.4 }
        }}
      >
        <div className="feature-icon">{icon}</div>
      </motion.div>
      
      <motion.h3
        animate={isHovered ? { color: 'var(--primary)' } : {}}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        animate={isHovered ? { color: 'var(--gray-700)' } : {}}
        transition={{ duration: 0.3 }}
      >
        {description}
      </motion.p>
      
      <motion.div 
        className="feature-number"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={isInView ? { 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
          transition: { 
            delay: delay + 0.4,
            type: "spring",
            stiffness: 200
          }
        } : { opacity: 0, scale: 0, rotate: -180 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      <motion.div 
        className="feature-hover-line"
        animate={isHovered ? { width: '100%' } : { width: '0%' }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

// Componente de Plano com Efeito de Destaque
const PremiumPlanCard = ({ name, price, features, recommended, color, period = 'mês', popular }) => {
  const { ref, isInView } = useScrollAnimation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={ref}
      className={`plan-card ${color} ${recommended ? 'recommended' : ''} ${popular ? 'popular' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.8,
          type: "spring",
          stiffness: 70
        }
      } : { opacity: 0, y: 60, scale: 0.9 }}
      whileHover={{ 
        y: recommended ? -20 : -10,
        scale: recommended ? 1.08 : 1.03,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
    >
      {/* Badges */}
      {recommended && (
        <motion.div 
          className="recommended-badge"
          initial={{ scale: 0, rotate: -180, y: -50 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <FaStar className="badge-star" />
          Mais Popular
        </motion.div>
      )}
      
      {popular && (
        <motion.div 
          className="popular-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <FaBolt />
          Tendência
        </motion.div>
      )}
      
      <div className="plan-glow"></div>
      <div className="plan-background"></div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="plan-hover-effect"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          />
        )}
      </AnimatePresence>
      
      <div className="plan-header">
        <motion.h3
          animate={isHovered ? { color: 'var(--primary)' } : {}}
        >
          {name}
        </motion.h3>
        <div className="plan-price">
          <motion.span 
            className="price"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          >
            {price}
          </motion.span>
          <span className="period">/{period}</span>
        </div>
        {recommended && (
          <motion.p 
            className="plan-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Ideal para empresas em crescimento
          </motion.p>
        )}
      </div>
      
      <ul className="plan-features">
        {features.map((feature, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { 
              opacity: 1, 
              x: 0,
              transition: { 
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 100
              }
            } : { opacity: 0, x: -30 }}
            whileHover={{ x: 5, color: 'var(--primary)' }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <FaCheckCircle className="feature-check" />
            </motion.div>
            {feature}
          </motion.li>
        ))}
      </ul>
      
      <motion.button 
        className={`plan-button ${recommended ? 'btn-premium' : 'btn-outline'}`}
        whileHover={{ 
          scale: 1.05,
          y: -2,
          transition: { type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Começar Agora</span>
        <motion.div
          animate={isHovered ? { x: 5, scale: 1.1 } : { x: 0, scale: 1 }}
        >
          <FaArrowRight className="btn-arrow" />
        </motion.div>
      </motion.button>

      {/* Elementos decorativos */}
      <div className="plan-decoration">
        <motion.div 
          className="decoration-orb"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

// Componente de Header com Navegação Suave
const AnimatedHeader = ({ user, onNavigate, isScrolled }) => {
  return (
    <motion.header 
      className={`dashboard-header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="header-content">
        <motion.div 
          className="header-brand"
          whileHover={{ scale: 1.05 }}
        >
          <FaRocket className="brand-icon" />
          <span className="brand-text">LogiTech Pro</span>
        </motion.div>
        
        <div className="header-text">
          <motion.div 
            className="welcome-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <span>🏢 Dashboard Operacional</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Bem-vindo, <span className="gradient-text">{user?.displayName || 'Operador'}</span>
          </motion.h1>
          <motion.p 
            className="header-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Aqui está o resumo completo da sua operação de transporte
          </motion.p>
        </div>
        
        <div className="header-actions">
          <motion.button 
            className="btn-primary" 
            onClick={() => onNavigate('novo-frete')}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTruck className="btn-icon" />
            Novo Frete
          </motion.button>
          <motion.button 
            className="btn-secondary"
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartLine className="btn-icon" />
            Relatório Diário
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

// Componente Principal Home
function Home({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const y = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dados melhorados com mais informações
  const operationalStats = [
    { 
      icon: <FaTruck />, 
      value: '24', 
      label: 'Veículos Ativos', 
      color: 'blue',
      change: '+12%',
      trend: 'up',
      subtitle: 'De 22 ontem'
    },
    { 
      icon: <FaSync />, 
      value: '18', 
      label: 'Cargas Ativas', 
      color: 'green',
      change: '+3',
      trend: 'up',
      subtitle: '5 entregues hoje'
    },
    { 
      icon: <FaChartLine />, 
      value: '42500', 
      label: 'Faturamento Mensal', 
      color: 'purple',
      change: '+8%',
      trend: 'up',
      subtitle: 'Meta: R$ 50.000'
    },
    { 
      icon: <FaCheckCircle />, 
      value: '94', 
      label: 'Entregas no Prazo', 
      color: 'orange',
      change: '+2%',
      trend: 'up',
      subtitle: '13/14 entregas'
    }
  ];

  const quickActions = [
    { 
      icon: <FaTruck />, 
      title: 'Novo Frete', 
      description: 'Cadastrar nova carga para transporte',
      color: 'primary',
      action: () => onNavigate('novo-frete'),
      badge: 'Novo'
    },
    { 
      icon: <FaMapMarkerAlt />, 
      title: 'Monitorar Frotas', 
      description: 'Rastreamento em tempo real dos veículos',
      color: 'secondary',
      action: () => onNavigate('monitoramento'),
      badge: 'Live'
    },
    { 
      icon: <FaChartLine />, 
      title: 'Relatórios', 
      description: 'Analisar desempenho e métricas',
      color: 'success',
      action: () => onNavigate('relatorios')
    },
    { 
      icon: <FaUsers />, 
      title: 'Motoristas', 
      description: 'Gerenciar equipe de condutores',
      color: 'warning',
      action: () => onNavigate('motoristas')
    },
    { 
      icon: <FaRoute />, 
      title: 'Rotas Otimizadas', 
      description: 'Planejar trajetos inteligentes',
      color: 'info',
      action: () => onNavigate('rotas')
    },
    { 
      icon: <FaTools />, 
      title: 'Manutenção', 
      description: 'Agendar serviços da frota',
      color: 'error',
      action: () => onNavigate('manutencao'),
      badge: '2'
    }
  ];

  const features = [
    {
      icon: <FaTruck />,
      title: 'Gestão de Frota Inteligente',
      description: 'Controle completo de veículos, manutenções e custos operacionais com IA preditiva'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Rastreamento em Tempo Real',
      description: 'Monitoramento 24/7 com atualizações instantâneas e alertas inteligentes'
    },
    {
      icon: <FaRoute />,
      title: 'Otimização de Rotas Avançada',
      description: 'Algoritmos de IA para planejamento de rotas que reduzem custos em até 30%'
    },
    {
      icon: <FaChartLine />,
      title: 'Analytics Preditivo',
      description: 'Relatórios detalhados com insights acionáveis e previsões de desempenho'
    },
    {
      icon: <FaLeaf />,
      title: 'Sustentabilidade',
      description: 'Monitoramento de emissões e rotas ecológicas para reduzir impacto ambiental'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Segurança Total',
      description: 'Sistema de segurança multicamada com criptografia de ponta a ponta'
    }
  ];

  const plans = [
    {
      name: 'Essencial',
      price: 'R$ 299',
      color: 'blue',
      period: 'mês',
      features: [
        'Até 5 veículos',
        'Rastreamento básico',
        'Relatórios simples',
        'Suporte por email',
        'App móvel básico',
        'Atualizações de segurança'
      ]
    },
    {
      name: 'Profissional',
      price: 'R$ 599',
      color: 'purple',
      period: 'mês',
      recommended: true,
      popular: true,
      features: [
        'Até 20 veículos',
        'Rastreamento avançado',
        'Relatórios detalhados',
        'Otimização de rotas com IA',
        'Suporte prioritário 24/7',
        'API acesso completo',
        'Analytics preditivo'
      ]
    },
    {
      name: 'Empresarial',
      price: 'R$ 999',
      color: 'orange',
      period: 'mês',
      features: [
        'Frota ilimitada',
        'Todos os recursos premium',
        'Dashboard customizado',
        'Suporte dedicado 24/7',
        'Treinamento personalizado',
        'Onboarding exclusivo',
        'Consultoria estratégica'
      ]
    }
  ];

  if (loading) {
    return (
      <motion.div 
        className="loading-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <InteractiveParticles />
        <div className="loading-content">
          <motion.div 
            className="loading-spinner"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <FaRocket className="spinner-icon" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Inicializando Sistema
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Preparando sua experiência personalizada
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section com Efeitos Avançados */}
      <motion.section 
        ref={heroRef}
        className="hero-section"
        style={{ opacity, scale, y }}
      >
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <InteractiveParticles />
        </div>
        
        <div className="hero-content">
          <motion.div 
            className="logo-section"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div 
              className="logo-wrapper"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="logo-icon"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaRocket />
              </motion.div>
              <span className="logo-text">LogiTech Pro</span>
            </motion.div>
            <motion.p 
              className="logo-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Revolucionando a Logística com IA
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="hero-text"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Transforme sua{' '}
              <motion.span 
                className="gradient-text"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Operação Logística
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Tecnologia avançada com IA para otimizar sua frota, reduzir custos em até 40% 
              e aumentar a eficiência operacional com nosso sistema completo de gestão inteligente
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button 
                className="btn-primary btn-large"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="btn-icon" />
                Começar Agora
              </motion.button>
              <motion.button 
                className="btn-secondary btn-large"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: '0 20px 40px rgba(255, 255, 255, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTruck className="btn-icon" />
                Ver Demonstração
              </motion.button>
            </motion.div>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="stat-item">
                <strong>+500</strong>
                <span>Clientes Ativos</span>
              </div>
              <div className="stat-item">
                <strong>99.5%</strong>
                <span>Satisfação</span>
              </div>
              <div className="stat-item">
                <strong>24/7</strong>
                <span>Suporte</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronDown />
        </motion.div>
      </motion.section>

      {/* Dashboard Section */}
      <section className="dashboard-section">
        <AnimatedHeader user={user} onNavigate={onNavigate} isScrolled={isScrolled} />

        {/* Stats Grid */}
        <div className="stats-section">
          <div className="container">
            <div className="section-header">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Visão Geral da Operação
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Métricas em tempo real do seu negócio
              </motion.p>
            </div>
            <div className="stats-grid">
              {operationalStats.map((stat, index) => (
                <AnimatedStatCard key={index} {...stat} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Ações Rápidas
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Atalhos para operações do dia a dia
                </motion.p>
              </div>
              <motion.button 
                className="btn-link"
                whileHover={{ x: 5 }}
              >
                Ver todos <FaArrowRight />
              </motion.button>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Como Podemos Ajudar sua Empresa
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Recursos desenvolvidos para otimizar sua operação
            </motion.p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                {...feature}
                index={index}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section className="plans-section">
        <div className="container">
          <div className="section-header center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Planos e Preços
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Escolha o plano ideal para o tamanho da sua operação
            </motion.p>
          </div>
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <PremiumPlanCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Final */}
      <section className="cta-section">
        <div className="cta-background"></div>
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Pronto para transformar sua operação logística?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Junte-se a mais de 500 empresas que já otimizaram seus processos conosco
              </motion.p>
            </div>
            <div className="cta-actions">
              <motion.button 
                className="btn-primary btn-large"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="btn-icon" />
                Começar Agora
              </motion.button>
              <motion.button 
                className="btn-secondary btn-large"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: '0 20px 40px rgba(255, 255, 255, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeadset className="btn-icon" />
                Falar com Especialista
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;