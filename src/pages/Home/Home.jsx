import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaTruck, FaChartLine, FaUsers, FaRoute, FaPhone, FaStar,
  FaShieldAlt, FaClock, FaCheckCircle, FaPlay, FaArrowRight,
  FaLeaf, FaRocket, FaHeadset, FaCloud, FaLock,
  FaCalendarAlt, FaFileAlt, FaBell, FaChevronDown,
  FaBolt, FaAward, FaGlobeAmericas, FaEnvelope,
  FaMapPin, FaGraduationCap, FaBook, FaHandshake, FaTrophy,
  FaUserTie, FaVideo, FaNewspaper, FaComments,
  FaPaperPlane, FaMapMarkedAlt, FaPhoneAlt, FaWhatsapp, FaDatabase,
  FaNetworkWired, FaRobot, FaMicrochip, FaQuoteLeft, FaQuoteRight,
  FaChevronUp, FaChevronRight, FaPlus, FaMinus, FaTimes
} from 'react-icons/fa';
import {
  GiDeliveryDrone, GiArtificialIntelligence, GiProcessor,
  GiRadarSweep, GiCircuitry, GiMineTruck, GiPathDistance,
  GiTreeGrowth, GiSecurityGate, GiRadarDish
} from 'react-icons/gi';
import {
  IoAnalytics, IoRocketSharp, IoPeople, IoEarth,
  IoFlash, IoStatsChart, IoCodeWorking, IoCloud
} from 'react-icons/io5';
import {
  RiCustomerService2Fill, RiGlobalLine, RiSecurePaymentLine,
  RiTeamFill, RiLightbulbFlashFill, RiRouteFill
} from 'react-icons/ri';
import Logotipofretevelocidadelaranja from '../../assets/images/Logotipofretevelocidadelaranja.png';
import './Home.css';


// Hook personalizado para animações de entrada
const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });
  return { ref, isInView };
};

// Componente de Partículas Interativas
const InteractiveParticles = ({ color = '#FF6A00', count = 15, size = 3 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * size + 1,
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
            background: color
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
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

// Componente de Seção com Animação
const AnimatedSection = ({ children, className = '', particleColor = '#FF6A00', particleCount = 10 }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.section
      ref={ref}
      className={`animated-section ${className}`}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <InteractiveParticles color={particleColor} count={particleCount} />
      {children}
    </motion.section>
  );
};

// Componente de Card de Estatística
const StatCard = ({ icon, value, label, index, suffix = '' }) => {
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
      : `${animatedValue.toLocaleString()}${suffix}`;

  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          delay: index * 0.15,
          type: "spring",
          stiffness: 100
        }
      } : { opacity: 0, y: 60, scale: 0.8 }}
      whileHover={{
        y: -15,
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      <div className="stat-glow"></div>

      <motion.div
        className="stat-icon-wrapper"
        animate={isInView ? {
          scale: [0.8, 1.2, 1],
          rotate: [0, 15, 0]
        } : {}}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
      >
        <span className="stat-icon">{icon}</span>
      </motion.div>

      <div className="stat-content">
        <motion.h3
          className="stat-value"
          key={animatedValue}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: index * 0.15 + 0.5 }}
        >
          {displayValue}
        </motion.h3>
        <motion.p
          className="stat-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.7 }}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Componente de Logo
const CompanyLogo = () => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className="company-logo-section"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
    >
      <div className="logo-container">
        <motion.div
          className="logo-wrapper"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.img
            src={Logotipofretevelocidadelaranja}
            alt="Transita.AI"
            className="logo-banner"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
        </motion.div>

        <motion.div
          className="logo-tagline"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="tagline-content">
            <GiArtificialIntelligence className="tagline-icon" />
            Inteligência Artificial em Logística
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Componente Sobre a Empresa
const AboutCompany = () => {
  const { ref, isInView } = useScrollAnimation();

  const values = [
    {
      icon: <GiArtificialIntelligence />,
      title: 'Inovação com IA',
      description: 'Soluções inteligentes que aprendem e evoluem com sua operação'
    },
    {
      icon: <RiTeamFill />,
      title: 'Parceria Estratégica',
      description: 'Trabalhamos como extensão do seu time para resultados excepcionais'
    },
    {
      icon: <RiSecurePaymentLine />,
      title: 'Segurança Máxima',
      description: 'Proteção de dados e operações com tecnologia de ponta'
    },
    {
      icon: <RiRouteFill />,
      title: 'Eficiência Radical',
      description: 'Redução de custos e otimização de processos logísticos'
    }
  ];

  return (
    <AnimatedSection className="about-company-section" particleColor="#0053A6" particleCount={12}>
      <div className="container">
        <div className="section-header center">
          <h2>
            Revolucionando a <span className="gradient-text">Logística Inteligente</span>
          </h2>
          <p>
            Tecnologia de ponta combinada com anos de expertise para transformar sua operação
          </p>
        </div>

        <div className="about-content-grid">
          <div className="about-text-content">
            <h3>
              Nossa <span className="accent-text">Jornada</span> de Excelência
            </h3>

            <p>
              Fundada em 2018, a Transita.AI nasceu da visão de revolucionar o setor logístico
              brasileiro através da inteligência artificial. Nossa plataforma integra machine learning
              avançado, análise preditiva e automação inteligente para entregar resultados tangíveis.
            </p>

            <p>
              Mais de 500 empresas de todos os portes confiam em nossa tecnologia para otimizar rotas,
              reduzir custos operacionais em até 40% e aumentar a eficiência de suas frotas.
            </p>

            <div className="about-stats-grid">
              <StatCard
                icon={<IoPeople />}
                value="500"
                label="Clientes Satisfeitos"
                index={0}
                suffix="+"
              />
              <StatCard
                icon={<IoEarth />}
                value="5"
                label="Anos de Experiência"
                index={1}
                suffix="+"
              />
              <StatCard
                icon={<FaTruck />}
                value="40"
                label="Redução de Custos"
                index={2}
                suffix="%"
              />
              <StatCard
                icon={<IoStatsChart />}
                value="99"
                label="Disponibilidade"
                index={3}
                suffix="%"
              />
            </div>
          </div>

          <div className="about-visual-content">
            <div className="floating-elements">
              <motion.div
                className="floating-element element-1"
                animate={{
                  y: [0, -25, 0],
                  rotate: [0, 8, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <GiProcessor />
              </motion.div>
              <motion.div
                className="floating-element element-2"
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <FaNetworkWired />
              </motion.div>
              <motion.div
                className="floating-element element-3"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 12, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <GiRadarDish />
              </motion.div>
              <motion.div
                className="floating-element element-4"
                animate={{
                  y: [0, 25, 0],
                  rotate: [0, -8, 0],
                  scale: [1, 1.08, 1]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <IoCloud />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="values-section">
          <h3>
            Nossos <span className="accent-text">Pilares</span> de Atuação
          </h3>

          <div className="values-grid-enhanced">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card-enhanced"
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.8 }}
                transition={{ delay: 2.0 + index * 0.2, duration: 0.6 }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                <motion.div
                  className="value-icon-container"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {value.icon}
                </motion.div>

                <h4>{value.title}</h4>
                <p>{value.description}</p>

                <div className="value-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
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
          duration: 0.8,
          delay: delay,
          type: "spring",
          stiffness: 100
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
            className="feature-sparkle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="feature-icon-wrapper"
        animate={isHovered ? {
          scale: 1.2,
          rotate: 360,
        } : {
          scale: 1,
          rotate: 0,
        }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="feature-icon"
          animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
        >
          {icon}
        </motion.span>
      </motion.div>

      <h3>{title}</h3>
      <p>{description}</p>

      <div className="feature-number">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="feature-hover-line" />
    </motion.div>
  );
};

// Componente de Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <GiMineTruck />,
      title: 'Gestão de Frota Inteligente',
      description: 'Controle completo de veículos, manutenções preditivas e custos operacionais com IA avançada'
    },
    {
      icon: <GiRadarDish />,
      title: 'Rastreamento em Tempo Real',
      description: 'Monitoramento 24/7 com atualizações instantâneas e alertas inteligentes proativos'
    },
    {
      icon: <GiPathDistance />,
      title: 'Otimização de Rotas Avançada',
      description: 'Algoritmos de IA que reduzem custos em até 30% e melhoram eficiência'
    },
    {
      icon: <IoAnalytics />,
      title: 'Analytics Preditivo',
      description: 'Relatórios detalhados com insights acionáveis e previsões de desempenho'
    },
    {
      icon: <GiTreeGrowth />,
      title: 'Sustentabilidade',
      description: 'Monitoramento de emissões e rotas ecológicas para reduzir impacto ambiental'
    },
    {
      icon: <GiSecurityGate />,
      title: 'Segurança Total',
      description: 'Sistema multicamada com criptografia de ponta a ponta e compliance'
    }
  ];

  return (
    <AnimatedSection className="features-section" particleColor="#FF6A00" particleCount={10}>
      <div className="container">
        <div className="section-header center">
          <h2>
            Soluções <span className="gradient-text">Inteligentes</span> para sua Frota
          </h2>
          <p>
            Tecnologia avançada desenvolvida para maximizar eficiência e reduzir custos
          </p>
        </div>

        <div className="features-grid-enhanced">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Componente de Plano
const PlanCard = ({ name, price, features, recommended, period = 'mês', popular }) => {
  const { ref, isInView } = useScrollAnimation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={`plan-card ${recommended ? 'recommended' : ''} ${popular ? 'popular' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }
      } : { opacity: 0, y: 60, scale: 0.9 }}
      whileHover={{
        y: recommended ? -20 : -10,
        scale: recommended ? 1.08 : 1.03,
        transition: { type: "spring", stiffness: 400, damping: 25 }
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
        <h3>{name}</h3>
        <div className="plan-price">
          <span className="price">{price}</span>
          <span className="period">/{period}</span>
        </div>
        {recommended && (
          <p className="plan-description">
            Ideal para empresas em crescimento acelerado
          </p>
        )}
      </div>

      <ul className="plan-features">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? {
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.1 + index * 0.05,
                type: "spring",
                stiffness: 100
              }
            } : { opacity: 0, x: -20 }}
            whileHover={{ x: 5 }}
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
        onClick={() => navigate('/login')}
        className={`plan-button ${recommended ? 'btn-premium' : 'btn-outline'}`}
        whileHover={{
          scale: 1.05,
          y: -3,
          transition: { type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Começar Agora</span>
        <motion.div
          animate={isHovered ? { x: 5, scale: 1.2 } : { x: 0, scale: 1 }}
        >
          <FaArrowRight className="btn-arrow" />
        </motion.div>
      </motion.button>

      <div className="plan-decoration">
        <motion.div
          className="decoration-orb"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.2, 1],
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

// Componente de Planos Section
const PlansSection = () => {
  const plans = [
    {
      name: 'Essencial',
      price: 'R$ 49',
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
      price: 'R$ 99',
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
        'Analytics preditivo',
        'Dashboard personalizado'
      ]
    },
    {
      name: 'Empresarial',
      price: 'R$ 249',
      period: 'mês',
      features: [
        'Frota ilimitada',
        'Todos os recursos premium',
        'Dashboard customizado',
        'Suporte dedicado 24/7',
        'Treinamento personalizado',
        'Onboarding exclusivo',
        'Consultoria estratégica',
        'Integrações avançadas'
      ]
    }
  ];

  return (
    <AnimatedSection className="plans-section" particleColor="#00FF88" particleCount={8}>
      <div className="container">
        <div className="section-header center">
          <h2>
            Planos que <span className="gradient-text">Crescem</span> com Você
          </h2>
          <p>
            Escolha a solução perfeita para o tamanho e ambição da sua operação
          </p>
        </div>
        <div className="plans-grid-enhanced">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Componente de FAQ Aprimorado
const FAQSection = () => {
  const { ref, isInView } = useScrollAnimation();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "Como a Transita.AI reduz custos logísticos?",
      answer: "Nossa plataforma utiliza algoritmos de IA para otimização de rotas, redução de consumo de combustível, manutenção preditiva e gestão inteligente de frota, resultando em economia média de 30-40% nos custos operacionais."
    },
    {
      question: "Qual o tempo de implementação do sistema?",
      answer: "A implementação leva de 2 a 4 semanas, dependendo do tamanho da frota e complexidade da operação. Oferecemos onboarding completo e suporte dedicado durante todo o processo."
    },
    {
      question: "O sistema funciona offline?",
      answer: "Sim, recursos essenciais como rastreamento e registro de atividades funcionam offline e sincronizam automaticamente quando a conexão é restabelecida."
    },
    {
      question: "É possível integrar com outros sistemas?",
      answer: "Sim, nossa API RESTful permite integração com ERPs, sistemas de gestão, WMS e outras plataformas através de documentação completa e suporte técnico especializado."
    },
    {
      question: "Como é a segurança dos dados?",
      answer: "Utilizamos criptografia de ponta a ponta, servidores em território nacional certificados, backups automáticos e compliance completo com a LGPD."
    },
    {
      question: "Há limite de veículos na plataforma?",
      answer: "Oferecemos planos escaláveis que se adaptam ao tamanho da sua frota, desde pequenas operações com 5 veículos até grandes frotas corporativas com milhares de unidades."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <AnimatedSection className="faq-section" particleColor="#003F7F" particleCount={8}>
      <div className="container">
        <div className="section-header center">
          <h2>
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p>
            Tire suas dúvidas sobre nossa plataforma e como podemos transformar sua operação logística
          </p>
        </div>

        <div className="faq-container">
          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{item.question}</span>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeIndex === index ? <FaMinus /> : <FaPlus />}
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="faq-cta">
            <h3>Ainda tem dúvidas?</h3>
            <p>Nossa equipe está pronta para ajudar você a encontrar a solução perfeita</p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHeadset />
              Falar com Especialista
            </motion.button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Componente de Testimonials
const TestimonialsSection = () => {
  const { ref, isInView } = useScrollAnimation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Carlos Silva",
      position: "Diretor de Logística",
      company: "Transportes Rápidos S.A.",
      content: "A Transita.AI revolucionou nossa operação. Reduzimos 35% nos custos com combustível e melhoramos a eficiência das rotas em 40%. A plataforma é intuitiva e o suporte é excepcional.",
      rating: 5,
      image: "👨‍💼"
    },
    {
      id: 2,
      name: "Ana Rodrigues",
      position: "Gerente de Operações",
      company: "Logística Brasil",
      content: "Implementamos a Transita.AI em toda nossa frota de 150 veículos. Os resultados foram impressionantes: 99% de precisão nas entregas e redução de 28% nos custos operacionais.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      id: 3,
      name: "Roberto Santos",
      position: "CEO",
      company: "Distribuidora Nacional",
      content: "A IA preditiva da Transita nos permitiu antecipar problemas e otimizar rotas em tempo real. O ROI foi alcançado em apenas 3 meses. Recomendo fortemente!",
      rating: 5,
      image: "👨‍💼"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <AnimatedSection className="testimonials-section" particleColor="#0053A6" particleCount={6}>
      <div className="container">
        <div className="section-header center">
          <h2>
            O que Nossos <span className="gradient-text">Clientes</span> Dizem
          </h2>
          <p>
            Descubra como empresas estão transformando suas operações logísticas com nossa tecnologia
          </p>
        </div>

        <div className="testimonials-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              className="testimonial-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-content">
                <FaQuoteLeft className="quote-icon quote-left" />
                <p>{testimonials[currentTestimonial].content}</p>
                <FaQuoteRight className="quote-icon quote-right" />
              </div>

              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].image}
                </div>
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].position}</p>
                  <span>{testimonials[currentTestimonial].company}</span>
                </div>
              </div>

              <div className="testimonial-rating">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FaStar key={i} className="star-icon" />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonials-nav">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${currentTestimonial === index ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>

          <div className="testimonials-stats">
            <div className="stat-item">
              <h3>4.9/5</h3>
              <p>Avaliação Média</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Clientes Satisfeitos</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Taxa de Retenção</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Componente Modal
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente de Contato e Suporte Aprimorado
const ContactSupport = () => {
  const { ref, isInView } = useScrollAnimation();
  const [activeModal, setActiveModal] = useState(null);

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
      description: 'Atendimento telefônico especializado',
      info: '0800 123 4567',
      action: 'Ligar Agora',
      color: '#0053A6'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      description: 'Suporte por email detalhado',
      info: 'suporte@transita.ai',
      action: 'Enviar Email',
      color: '#FF6A00'
    },
    {
      icon: <RiCustomerService2Fill />,
      title: 'Chat Online',
      description: 'Chat em tempo real',
      info: 'Disponível 24/7',
      action: 'Iniciar Chat',
      color: '#003F7F'
    }
  ];

  const supportChannels = [
    {
      icon: <FaHeadset />,
      title: 'Suporte Técnico',
      description: 'Ajuda com problemas técnicos e configurações avançadas',
      availability: '24/7',
      responseTime: 'Até 15min'
    },
    {
      icon: <FaGraduationCap />,
      title: 'Suporte Educacional',
      description: 'Dúvidas sobre uso da plataforma e treinamentos especializados',
      availability: '8h-18h',
      responseTime: 'Até 2h'
    },
    {
      icon: <FaUserTie />,
      title: 'Suporte Comercial',
      description: 'Informações sobre planos, contratações e negócios',
      availability: '9h-17h',
      responseTime: 'Até 1h'
    },
    {
      icon: <RiSecurePaymentLine />,
      title: 'Suporte Enterprise',
      description: 'Atendimento dedicado para clientes corporativos',
      availability: '24/7',
      responseTime: 'Imediato'
    }
  ];

  const locations = [
    {
      city: 'São Paulo - Matriz',
      address: 'Av. Paulista, 1000 - Bela Vista',
      phone: '(11) 3333-3333',
      email: 'sp@transita.ai',
      hours: 'Seg-Sex: 8h-18h'
    },
    {
      city: 'Rio de Janeiro',
      address: 'Av. Rio Branco, 100 - Centro',
      phone: '(21) 2222-2222',
      email: 'rj@transita.ai',
      hours: 'Seg-Sex: 8h-18h'
    },
    {
      city: 'Belo Horizonte',
      address: 'Av. do Contorno, 5000 - Lourdes',
      phone: '(31) 4444-4444',
      email: 'bh@transita.ai',
      hours: 'Seg-Sex: 8h-18h'
    }
  ];

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <AnimatedSection className="contact-support-section" particleColor="#003F7F" particleCount={10}>
      <div className="container">
        <div className="section-header center">
          <h2>
            Pronto para <span className="gradient-text">Transformar</span> sua Operação?
          </h2>
          <p>
            Nossa equipe especializada está pronta para ajudar você a alcançar novos patamares de eficiência
          </p>
        </div>

        <div className="contact-options-grid">
          <motion.div
            className="contact-option"
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => openModal('contact')}
          >
            <div className="option-icon">
              <FaEnvelope />
            </div>
            <h3>Contato</h3>
            <p>Entre em contato conosco através de diversos canais</p>
            <span className="option-cta">Entrar em Contato</span>
          </motion.div>

          <motion.div
            className="contact-option"
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => openModal('support')}
          >
            <div className="option-icon">
              <FaHeadset />
            </div>
            <h3>Suporte</h3>
            <p>Suporte técnico especializado para sua operação</p>
            <span className="option-cta">Solicitar Suporte</span>
          </motion.div>

          <motion.div
            className="contact-option"
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => openModal('locations')}
          >
            <div className="option-icon">
              <FaMapMarkedAlt />
            </div>
            <h3>Unidades</h3>
            <p>Encontre nossa unidade mais próxima de você</p>
            <span className="option-cta">Ver Localizações</span>
          </motion.div>
        </div>

        {/* Modal de Contato */}
        <Modal
          isOpen={activeModal === 'contact'}
          onClose={closeModal}
          title="Entre em Contato"
        >
          <div className="modal-contact-content">
            <div className="contact-methods-grid">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  className="contact-method-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="method-icon" style={{ color: method.color }}>
                    {method.icon}
                  </div>
                  <div className="method-info">
                    <h4>{method.title}</h4>
                    <p>{method.description}</p>
                    <span className="method-detail">{method.info}</span>
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
          </div>
        </Modal>

        {/* Modal de Suporte */}
        <Modal
          isOpen={activeModal === 'support'}
          onClose={closeModal}
          title="Solicitar Suporte"
        >
          <div className="modal-support-content">
            <div className="support-channels-grid">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={index}
                  className="support-channel-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="channel-icon">{channel.icon}</div>
                  <div className="channel-info">
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
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Solicitar Suporte
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </Modal>

        {/* Modal de Localizações */}
        <Modal
          isOpen={activeModal === 'locations'}
          onClose={closeModal}
          title="Nossas Unidades"
        >
          <div className="modal-locations-content">
            <div className="locations-grid">
              {locations.map((location, index) => (
                <motion.div
                  key={index}
                  className="location-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="location-header">
                    <FaMapPin className="location-icon" />
                    <div>
                      <h4>{location.city}</h4>
                      <p>{location.address}</p>
                    </div>
                  </div>
                  <div className="location-info">
                    <span><FaPhoneAlt /> {location.phone}</span>
                    <span><FaEnvelope /> {location.email}</span>
                    <span><FaClock /> {location.hours}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="map-container">
              <div className="map-placeholder">
                <FaMapMarkedAlt />
                <p>Mapa interativo das nossas localizações</p>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver no Google Maps
                </motion.button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </AnimatedSection>
  );
};

// Componente Principal Home
function Home({ user, onNavigate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="hero-section"
        style={{ opacity, scale }}
      >
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <InteractiveParticles />
        </div>

        <div className="hero-content">
          <CompanyLogo />

          <div className="hero-text">
            <h1>
              Transforme sua{' '}
              <span className="gradient-text">
                Operação Logística
              </span>
            </h1>

            <p>
              Tecnologia avançada com IA para otimizar sua frota, reduzir custos em até 40%
              e aumentar a eficiência operacional com nosso sistema completo de gestão inteligente
            </p>

            <div className="hero-actions">
              <motion.button
                className="btn-primary btn-large"
                onClick={() => navigate('/login')}
                whileHover={{
                  scale: 1.05,
                  y: -2,
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
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTruck className="btn-icon" />
                Ver Demonstração
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronDown />
        </motion.div>
      </motion.section>

      {/* Sobre a Empresa */}
      <AboutCompany />

      {/* Features Section */}
      <FeaturesSection />

      {/* Planos Section */}
      <PlansSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Seção de Contato e Suporte */}
      <ContactSupport />
    </div>
  );
}

export default Home;