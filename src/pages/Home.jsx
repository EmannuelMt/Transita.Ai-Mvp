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
  FaGlobeAmericas,
  FaEnvelope,
  FaMapPin,
  FaBook,
  FaGraduationCap,
  FaLightbulb,
  FaHandshake,
  FaTrophy,
  FaMedal,
  FaUserTie,
  FaHistory,
  FaVideo,
  FaImages,
  FaNewspaper,
  FaBlog,
  FaPenAlt,
  FaCommentDots,
  FaComments,
  FaPaperPlane,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaWhatsapp
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

// Componente de Card de Ação Rápida
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

// Componente de Estatística com Gráficos
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

// Componente de Logo da Empresa
const CompanyLogo = () => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div 
      ref={ref}
      className="company-logo-section"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="logo-container">
        <motion.div 
          className="logo-main"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaRocket className="logo-icon" />
          <div className="logo-text">
            <span className="logo-primary">Transita</span>
            <span className="logo-secondary">.AI</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="logo-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          <FaAward className="tagline-icon" />
          <span>Líder em Soluções Logísticas Inteligentes</span>
        </motion.div>

        <motion.div 
          className="logo-certifications"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="certification">
            <FaShieldAlt />
            <span>ISO 9001 Certified</span>
          </div>
          <div className="certification">
            <FaMedal />
            <span>Prêmio Inovação 2024</span>
          </div>
          <div className="certification">
            <FaTrophy />
            <span>Top 10 Startups Brasil</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Componente Sobre a Empresa
const AboutCompany = () => {
  const { ref, isInView } = useScrollAnimation();

  const milestones = [
    { year: '2018', event: 'Fundação da LogiTech', icon: <FaRocket /> },
    { year: '2019', event: 'Primeiro Cliente Enterprise', icon: <FaUserTie /> },
    { year: '2020', event: 'Expansão Nacional', icon: <FaMapMarkedAlt /> },
    { year: '2021', event: 'Série A Funding', icon: <FaChartLine /> },
    { year: '2022', event: '+1000 Clientes', icon: <FaUsers /> },
    { year: '2023', event: 'IA Integrada', icon: <FaCog /> },
    { year: '2024', event: 'Expansão Internacional', icon: <FaGlobeAmericas /> }
  ];

  const values = [
    {
      icon: <FaLightbulb />,
      title: 'Inovação',
      description: 'Buscamos constantemente novas tecnologias e soluções criativas'
    },
    {
      icon: <FaHandshake />,
      title: 'Parceria',
      description: 'Trabalhamos lado a lado com nossos clientes para o sucesso mútuo'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Confiança',
      description: 'Segurança e transparência em todas as nossas operações'
    },
    {
      icon: <FaLeaf />,
      title: 'Sustentabilidade',
      description: 'Compromisso com operações logísticas eco-friendly'
    }
  ];

  return (
    <section ref={ref} className="about-company-section">
      <div className="container">
        <motion.div 
          className="section-header center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <h2>Sobre a Transita.AI</h2>
          <p>Transformando a logística brasileira com tecnologia de ponta</p>
        </motion.div>

        <div className="about-content">
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Nossa História</h3>
            <p>
              Fundada em 2018, a LogiTech nasceu da visão de revolucionar o setor logístico 
              brasileiro através da tecnologia. Começamos como uma pequena startup e hoje 
              somos referência em soluções inteligentes para gestão de frotas.
            </p>
            <p>
              Nossa missão é simplificar a complexidade das operações logísticas, 
              proporcionando eficiência, redução de custos e sustentabilidade para 
              empresas de todos os portes.
            </p>

            <div className="company-stats">
              <div className="stat">
                <strong>500+</strong>
                <span>Clientes Ativos</span>
              </div>
              <div className="stat">
                <strong>50K+</strong>
                <span>Entregas/Mês</span>
              </div>
              <div className="stat">
                <strong>99.8%</strong>
                <span>Disponibilidade</span>
              </div>
              <div className="stat">
                <strong>40%</strong>
                <span>Redução de Custos</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="about-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.4 }}
          >
            <div className="milestones-timeline">
              <h4>Nossa Jornada</h4>
              <div className="timeline">
                {milestones.map((milestone, index) => (
                  <motion.div 
                    key={index}
                    className="timeline-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="timeline-icon">{milestone.icon}</div>
                    <div className="timeline-content">
                      <span className="timeline-year">{milestone.year}</span>
                      <span className="timeline-event">{milestone.event}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="company-values"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Nossos Valores</h3>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Componente de Feature Card
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

// Componente de Plano
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

// Componente de Guia Rápido
const QuickGuide = () => {
  const { ref, isInView } = useScrollAnimation();

  const guides = [
    {
      step: 1,
      title: 'Configuração Inicial',
      description: 'Configure sua conta e adicione seus primeiros veículos',
      icon: <FaCog />,
      features: ['Cadastro de veículos', 'Configuração de motoristas', 'Definição de rotas base'],
      video: '/videos/setup-guide.mp4',
      duration: '5 min'
    },
    {
      step: 2,
      title: 'Primeiro Frete',
      description: 'Aprenda a criar e gerenciar seu primeiro frete',
      icon: <FaTruck />,
      features: ['Criação de fretes', 'Atribuição de veículos', 'Acompanhamento em tempo real'],
      video: '/videos/first-shipment.mp4',
      duration: '8 min'
    },
    {
      step: 3,
      title: 'Monitoramento',
      description: 'Monitore suas operações em tempo real',
      icon: <FaMapMarkerAlt />,
      features: ['Dashboard interativo', 'Alertas inteligentes', 'Relatórios automáticos'],
      video: '/videos/monitoring.mp4',
      duration: '6 min'
    },
    {
      step: 4,
      title: 'Otimização',
      description: 'Use nossas ferramentas de IA para otimizar rotas',
      icon: <FaRoute />,
      features: ['Otimização de rotas', 'Redução de custos', 'Previsão de entrega'],
      video: '/videos/optimization.mp4',
      duration: '7 min'
    }
  ];

  return (
    <section ref={ref} className="quick-guide-section">
      <div className="container">
        <motion.div 
          className="section-header center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <h2>Guia Rápido do Sistema</h2>
          <p>Aprenda a usar todas as funcionalidades em poucos minutos</p>
        </motion.div>

        <div className="guides-container">
          {guides.map((guide, index) => (
            <motion.div 
              key={guide.step}
              className="guide-card"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="guide-header">
                <div className="guide-step">Passo {guide.step}</div>
                <div className="guide-duration">
                  <FaClock />
                  {guide.duration}
                </div>
              </div>
              
              <div className="guide-icon">{guide.icon}</div>
              
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              
              <div className="guide-features">
                {guide.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="feature">
                    <FaCheckCircle />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="guide-actions">
                <motion.button 
                  className="btn-primary btn-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay />
                  Assistir Tutorial
                </motion.button>
                <button className="btn-outline btn-sm">
                  <FaBook />
                  Ler Documentação
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="guide-resources"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Recursos Adicionais</h3>
          <div className="resources-grid">
            <div className="resource-card">
              <FaGraduationCap className="resource-icon" />
              <h4>Academia Transita .AI Pro</h4>
              <p>Cursos completos e certificações</p>
              <button className="btn-link">
                Explorar Cursos <FaArrowRight />
              </button>
            </div>
            
            <div className="resource-card">
              <FaVideo className="resource-icon" />
              <h4>Webinars</h4>
              <p>Sessões ao vivo com especialistas</p>
              <button className="btn-link">
                Ver Agenda <FaArrowRight />
              </button>
            </div>
            
            <div className="resource-card">
              <FaFileAlt className="resource-icon" />
              <h4>Documentação</h4>
              <p>Manuais técnicos e APIs</p>
              <button className="btn-link">
                Acessar Docs <FaArrowRight />
              </button>
            </div>
            
            <div className="resource-card">
              <FaComments className="resource-icon" />
              <h4>Comunidade</h4>
              <p>Tire dúvidas com outros usuários</p>
              <button className="btn-link">
                Entrar na Comunidade <FaArrowRight />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Componente de Blog
const BlogSection = () => {
  const { ref, isInView } = useScrollAnimation();

  const blogPosts = [
    {
      id: 1,
      title: 'Como a IA está revolucionando a logística em 2024',
      excerpt: 'Descubra as principais tendências de inteligência artificial aplicadas à gestão de frotas e otimização de rotas...',
      author: 'Carlos Silva',
      date: '15 Mar 2024',
      readTime: '8 min',
      category: 'Tecnologia',
      image: '/images/blog-ia-logistica.jpg',
      featured: true
    },
    {
      id: 2,
      title: '5 Estratégias para Reduzir Custos na sua Frota',
      excerpt: 'Aprenda técnicas comprovadas para diminuir custos operacionais e aumentar a eficiência da sua frota...',
      author: 'Ana Costa',
      date: '12 Mar 2024',
      readTime: '6 min',
      category: 'Gestão',
      image: '/images/blog-reducao-custos.jpg'
    },
    {
      id: 3,
      title: 'Sustentabilidade na Logística: Um Guia Prático',
      excerpt: 'Como implementar práticas sustentáveis na sua operação logística e reduzir o impacto ambiental...',
      author: 'Pedro Santos',
      date: '10 Mar 2024',
      readTime: '10 min',
      category: 'Sustentabilidade',
      image: '/images/blog-sustentabilidade.jpg'
    },
    {
      id: 4,
      title: 'Novas Regulamentações do Setor de Transporte',
      excerpt: 'Fique por dentro das mudanças na legislação que afetam o transporte de cargas no Brasil...',
      author: 'Mariana Oliveira',
      date: '8 Mar 2024',
      readTime: '5 min',
      category: 'Legislação',
      image: '/images/blog-regulamentacoes.jpg'
    }
  ];

  return (
    <section ref={ref} className="blog-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <div className="section-title">
            <h2>Blog Transita .AI Pro</h2>
            <p>Fique por dentro das novidades do setor logístico</p>
          </div>
          <motion.button 
            className="btn-link"
            whileHover={{ x: 5 }}
          >
            Ver todos os artigos <FaArrowRight />
          </motion.button>
        </motion.div>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              className={`blog-card ${post.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
            >
              {post.featured && (
                <div className="featured-badge">
                  <FaStar />
                  Destaque
                </div>
              )}
              
              <div className="blog-image">
                <div className="image-placeholder">
                  <FaImages />
                </div>
                <div className="blog-category">{post.category}</div>
              </div>
              
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <div className="blog-footer">
                  <div className="blog-author">
                    <div className="author-avatar">
                      <FaUserTie />
                    </div>
                    <span>{post.author}</span>
                  </div>
                  
                  <motion.button 
                    className="btn-link btn-sm"
                    whileHover={{ x: 3 }}
                  >
                    Ler mais <FaArrowRight />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div 
          className="blog-newsletter"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5 }}
        >
          <div className="newsletter-content">
            <FaNewspaper className="newsletter-icon" />
            <div className="newsletter-text">
              <h4>Newsletter Transita .AI Pro</h4>
              <p>Receba as melhores dicas e novidades do setor logístico diretamente no seu email</p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Seu melhor email"
                className="newsletter-input"
              />
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Assinar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Componente de Contato e Suporte
const ContactSupport = () => {
  const { ref, isInView } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState('contact');

  const contactMethods = [
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      description: 'Suporte rápido via WhatsApp',
      info: '+55 (11) 99999-9999',
      action: 'Iniciar Conversa',
      color: '#25D366'
    },
    {
      icon: <FaPhoneAlt />,
      title: 'Telefone',
      description: 'Atendimento telefônico',
      info: '0800 123 4567',
      action: 'Ligar Agora',
      color: '#007bff'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      description: 'Suporte por email',
      info: 'suporte@logitech.com',
      action: 'Enviar Email',
      color: '#dc3545'
    },
    {
      icon: <FaComments />,
      title: 'Chat Online',
      description: 'Chat em tempo real',
      info: 'Disponível 24/7',
      action: 'Iniciar Chat',
      color: '#6f42c1'
    }
  ];

  const supportChannels = [
    {
      icon: <FaHeadset />,
      title: 'Suporte Técnico',
      description: 'Ajuda com problemas técnicos e configurações',
      availability: '24/7',
      responseTime: 'Até 15min'
    },
    {
      icon: <FaGraduationCap />,
      title: 'Suporte Educacional',
      description: 'Dúvidas sobre uso da plataforma e treinamentos',
      availability: '8h-18h',
      responseTime: 'Até 2h'
    },
    {
      icon: <FaUserTie />,
      title: 'Suporte Comercial',
      description: 'Informações sobre planos e contratações',
      availability: '9h-17h',
      responseTime: 'Até 1h'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Suporte Enterprise',
      description: 'Atendimento dedicado para clientes corporativos',
      availability: '24/7',
      responseTime: 'Imediato'
    }
  ];

  return (
    <section ref={ref} className="contact-support-section">
      <div className="container">
        <motion.div 
          className="section-header center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <h2>Fale Conosco</h2>
          <p>Estamos aqui para ajudar você a transformar sua operação logística</p>
        </motion.div>

        <div className="contact-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <FaEnvelope />
              Contato
            </button>
            <button 
              className={`tab-button ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <FaHeadset />
              Suporte
            </button>
            <button 
              className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <FaMapMarkedAlt />
              Nossas Unidades
            </button>
          </div>

          <div className="tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'contact' && (
                <motion.div 
                  className="contact-content"
                  key="contact"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="contact-methods">
                    {contactMethods.map((method, index) => (
                      <motion.div 
                        key={index}
                        className="contact-method"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div 
                          className="method-icon"
                          style={{ color: method.color }}
                        >
                          {method.icon}
                        </div>
                        <div className="method-content">
                          <h4>{method.title}</h4>
                          <p>{method.description}</p>
                          <span className="method-info">{method.info}</span>
                        </div>
                        <motion.button 
                          className="btn-primary btn-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ backgroundColor: method.color }}
                        >
                          {method.action}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="contact-form-container">
                    <h3>Envie sua Mensagem</h3>
                    <form className="contact-form">
                      <div className="form-row">
                        <input type="text" placeholder="Seu nome" required />
                        <input type="email" placeholder="Seu email" required />
                      </div>
                      <input type="text" placeholder="Assunto" required />
                      <select required>
                        <option value="">Selecione o departamento</option>
                        <option value="suporte">Suporte Técnico</option>
                        <option value="comercial">Comercial</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="outro">Outro</option>
                      </select>
                      <textarea 
                        placeholder="Como podemos ajudar você?" 
                        rows="5"
                        required
                      ></textarea>
                      <motion.button 
                        type="submit"
                        className="btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPaperPlane />
                        Enviar Mensagem
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div 
                  className="support-content"
                  key="support"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="support-channels">
                    {supportChannels.map((channel, index) => (
                      <motion.div 
                        key={index}
                        className="support-channel"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="channel-icon">{channel.icon}</div>
                        <div className="channel-content">
                          <h4>{channel.title}</h4>
                          <p>{channel.description}</p>
                          <div className="channel-meta">
                            <span>
                              <FaClock />
                              {channel.availability}
                            </span>
                            <span>
                              <FaBell />
                              {channel.responseTime}
                            </span>
                          </div>
                        </div>
                        <button className="btn-outline btn-sm">
                          Solicitar Suporte
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="support-resources">
                    <h3>Recursos de Ajuda</h3>
                    <div className="resources-grid">
                      <div className="resource">
                        <FaBook />
                        <span>Base de Conhecimento</span>
                      </div>
                      <div className="resource">
                        <FaVideo />
                        <span>Tutoriais em Vídeo</span>
                      </div>
                      <div className="resource">
                        <FaFileAlt />
                        <span>Documentação</span>
                      </div>
                      <div className="resource">
                        <FaComments />
                        <span>FAQ</span>
                      </div>
                      <div className="resource">
                        <FaGraduationCap />
                        <span>Treinamentos</span>
                      </div>
                      <div className="resource">
                        <FaNewspaper />
                        <span>Blog</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'locations' && (
                <motion.div 
                  className="locations-content"
                  key="locations"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="locations-grid">
                    <div className="location-card">
                      <div className="location-header">
                        <FaMapPin className="location-icon" />
                        <div>
                          <h4>São Paulo - Matriz</h4>
                          <p>Av. Paulista, 1000 - Bela Vista</p>
                        </div>
                      </div>
                      <div className="location-info">
                        <span><FaPhoneAlt /> (11) 3333-3333</span>
                        <span><FaEnvelope /> sp@logitech.com</span>
                        <span><FaClock /> Seg-Sex: 8h-18h</span>
                      </div>
                    </div>

                    <div className="location-card">
                      <div className="location-header">
                        <FaMapPin className="location-icon" />
                        <div>
                          <h4>Rio de Janeiro</h4>
                          <p>Av. Rio Branco, 100 - Centro</p>
                        </div>
                      </div>
                      <div className="location-info">
                        <span><FaPhoneAlt /> (21) 2222-2222</span>
                        <span><FaEnvelope /> rj@logitech.com</span>
                        <span><FaClock /> Seg-Sex: 8h-18h</span>
                      </div>
                    </div>

                    <div className="location-card">
                      <div className="location-header">
                        <FaMapPin className="location-icon" />
                        <div>
                          <h4>Belo Horizonte</h4>
                          <p>Av. do Contorno, 5000 - Lourdes</p>
                        </div>
                      </div>
                      <div className="location-info">
                        <span><FaPhoneAlt /> (31) 4444-4444</span>
                        <span><FaEnvelope /> bh@logitech.com</span>
                        <span><FaClock /> Seg-Sex: 8h-18h</span>
                      </div>
                    </div>

                    <div className="location-card">
                      <div className="location-header">
                        <FaMapPin className="location-icon" />
                        <div>
                          <h4>Porto Alegre</h4>
                          <p>Av. Assis Brasil, 1000 - Passo d'Areia</p>
                        </div>
                      </div>
                      <div className="location-info">
                        <span><FaPhoneAlt /> (51) 5555-5555</span>
                        <span><FaEnvelope /> poa@logitech.com</span>
                        <span><FaClock /> Seg-Sex: 8h-18h</span>
                      </div>
                    </div>
                  </div>

                  <div className="map-container">
                    <div className="map-placeholder">
                      <FaMapMarkedAlt />
                      <p>Mapa interativo das nossas localizações</p>
                      <button className="btn-primary">
                        Ver no Google Maps
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente de Header
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
          <span className="brand-text">Transita .AI Pro</span>
        </motion.div>
        
        <div className="header-text">
          <motion.div 
            className="welcome-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <span>🏢 Transita .AI Pro HomePage</span>
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

  // Dados para as seções
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
      name: 'Básico',
      price: ' R$49 ',
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
      price: 'R$99 ',
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
      price: 'R$249',
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
      {/* Hero Section */}
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
          <CompanyLogo />
          
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

      {/* Sobre a Empresa */}
      <AboutCompany />

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

      {/* Seção de Guia Rápido */}
      <QuickGuide />

      {/* Seção de Blog */}
      <BlogSection />

      {/* Seção de Contato e Suporte */}
      <ContactSupport />
    </div>
  );
}

export default Home;