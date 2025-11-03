import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTruck, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram,
  FaMapMarkerAlt,
  FaWrench,
  FaChartLine,
  FaFileAlt,
  FaCode,
  FaBook,
  FaBlog,
  FaServer,
  FaHeadset,
  FaPhone,
  FaEnvelope,
  FaMobileAlt,
  FaApple,
  FaGooglePlay,
  FaShieldAlt,
  FaFileContract,
  FaCookieBite,
  FaChevronRight,
  FaQrcode,
  FaDownload,
  FaRocket,
  FaAward,
  FaGlobeAmericas,
  FaRoute,
  FaCloudDownloadAlt,
  FaLock, // ✅ Ícone de segurança válido
  FaCog // ✅ Ícone de configurações válido
} from 'react-icons/fa';
import { 
  HiMenuAlt3,
  HiX,
  HiSearch,
  HiBell,
  HiCog,
  HiStatusOnline
} from 'react-icons/hi';
import { 
  RiCustomerService2Fill,
  RiSecurePaymentFill,
  RiGlobalLine
} from 'react-icons/ri';
import { 
  IoStatsChart,
  IoHardwareChipOutline
} from 'react-icons/io5';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);
    const [systemStatus, setSystemStatus] = useState('online');
    const [downloads, setDownloads] = useState({ ios: 12478, android: 18763 });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        const footer = document.querySelector('.footer');
        if (footer) observer.observe(footer);

        return () => observer.disconnect();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -5,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const stats = [
        { number: '50K+', label: 'Rotas Otimizadas' },
        { number: '1.2M', label: 'KM Monitorados' },
        { number: '99.9%', label: 'Uptime' },
        { number: '24/7', label: 'Suporte' }
    ];

    return (
        <motion.footer 
            className="footer"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="footer-background">
                <div className="footer-gradient"></div>
                <div className="footer-pattern"></div>
                <motion.div 
                    className="floating-element el-1"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <FaTruck />
                </motion.div>
                <motion.div 
                    className="floating-element el-2"
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -3, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    <FaMapMarkerAlt />
                </motion.div>
            </div>
            
            {/* Stats Bar */}
            <motion.div 
                className="footer-stats"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className="stats-container">
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            className="stat-item"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <motion.span 
                                className="stat-number"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.5 + index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                            >
                                {stat.number}
                            </motion.span>
                            <span className="stat-label">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="footer-content">
                {/* Company Info */}
                <motion.div className="footer-section main-info" variants={itemVariants}>
                    <motion.div 
                        className="footer-logo"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.div 
                            className="logo-icon-container"
                            whileHover={{ 
                                rotate: [0, -10, 0],
                                scale: 1.1
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <FaTruck className="logo-icon" />
                        </motion.div>
                        <div className="logo-content">
                            <span className="logo-text">Transita.AI</span>
                            <span className="logo-tagline">Inteligência Logística Avançada</span>
                        </div>
                    </motion.div>
                    
                    <p className="footer-description">
                        Plataforma de gestão logística completa com IA, oferecendo soluções 
                        inteligentes para otimização de rotas, monitoramento em tempo real 
                        e analytics preditivo para frotas de todos os tamanhos.
                    </p>

                    <div className="company-features">
                        <motion.div 
                            className="feature-item"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FaLock className="feature-icon" /> {/* ✅ Ícone válido */}
                            <span>Segurança Enterprise</span>
                        </motion.div>
                        <motion.div 
                            className="feature-item"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <IoHardwareChipOutline className="feature-icon" />
                            <span>Tecnologia AI</span>
                        </motion.div>
                        <motion.div 
                            className="feature-item"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <RiGlobalLine className="feature-icon" />
                            <span>Cobertura Global</span>
                        </motion.div>
                    </div>
                    
                    <div className="footer-social">
                        {[
                            { icon: FaLinkedin, label: 'LinkedIn', color: '#0077b5' },
                            { icon: FaTwitter, label: 'Twitter', color: '#1da1f2' },
                            { icon: FaFacebook, label: 'Facebook', color: '#1877f2' },
                            { icon: FaInstagram, label: 'Instagram', color: '#e4405f' }
                        ].map((social, index) => (
                            <motion.a 
                                key={index}
                                href="#" 
                                className="social-link"
                                whileHover={{ 
                                    scale: 1.15, 
                                    y: -3,
                                    backgroundColor: social.color
                                }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={social.label}
                                style={{ '--social-color': social.color }}
                            >
                                <social.icon className="social-icon" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Solutions */}
                <motion.div className="footer-section" variants={itemVariants}>
                    <h4 className="footer-title">
                        <IoStatsChart className="title-icon" />
                        Soluções
                        <motion.div 
                            className="title-underline"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        />
                    </h4>
                    <ul className="footer-links">
                        {[
                            { icon: FaMapMarkerAlt, text: 'Monitoramento Live', badge: 'NEW' },
                            { icon: FaRoute, text: 'Otimização AI', badge: 'AI' },
                            { icon: FaWrench, text: 'Manutenção Preditiva', badge: 'PRO' },
                            { icon: FaChartLine, text: 'Analytics Avançado', badge: 'AI' },
                            { icon: FaFileAlt, text: 'Relatórios Inteligentes' },
                            { icon: FaRocket, text: 'Performance Boost' }
                        ].map((item, index) => (
                            <motion.li 
                                key={index} 
                                className="footer-link-item"
                                whileHover={{ x: 8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <a href="#" className="footer-link">
                                    <item.icon className="link-icon" />
                                    <span className="link-text">{item.text}</span>
                                    {item.badge && (
                                        <span className={`link-badge ${item.badge.toLowerCase()}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    <FaChevronRight className="link-arrow" />
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Resources */}
                <motion.div className="footer-section" variants={itemVariants}>
                    <h4 className="footer-title">
                        <FaCode className="title-icon" />
                        Desenvolvedores
                        <motion.div 
                            className="title-underline"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        />
                    </h4>
                    <ul className="footer-links">
                        {[
                            { icon: FaCode, text: 'API Documentation', desc: 'REST & GraphQL' },
                            { icon: FaBook, text: 'Guia de Integração', desc: 'Quick Start' },
                            { icon: FaBook, text: 'SDK Libraries', desc: 'Multi-language' },
                            { icon: FaBlog, text: 'Tech Blog', desc: 'Latest Updates' },
                            { icon: FaServer, text: 'Status API', desc: 'Live Monitoring' },
                            { icon: FaAward, text: 'Showcase', desc: 'Success Stories' }
                        ].map((item, index) => (
                            <motion.li 
                                key={index}
                                className="footer-link-item"
                                whileHover={{ x: 8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <a href="#" className="footer-link">
                                    <item.icon className="link-icon" />
                                    <div className="link-content">
                                        <span className="link-text">{item.text}</span>
                                        <span className="link-desc">{item.desc}</span>
                                    </div>
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Support & Contact */}
                <motion.div className="footer-section" variants={itemVariants}>
                    <h4 className="footer-title">
                        <RiCustomerService2Fill className="title-icon" />
                        Suporte
                        <motion.div 
                            className="title-underline"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        />
                    </h4>
                    
                    <div className="support-cards">
                        <motion.div 
                            className="support-card"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="card-icon">
                                <FaHeadset />
                            </div>
                            <div className="card-content">
                                <h5>Suporte Premium</h5>
                                <p>Atendimento especializado 24/7</p>
                                <span className="card-badge">Response: 2min</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="support-card"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="card-icon">
                                <RiSecurePaymentFill />
                            </div>
                            <div className="card-content">
                                <h5>Consultoria</h5>
                                <p>Otimização personalizada</p>
                                <span className="card-badge">Enterprise</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="contact-info">
                        <motion.a 
                            href="tel:+551140041234"
                            className="contact-item phone"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="contact-icon">
                                <FaPhone />
                            </div>
                            <div className="contact-details">
                                <span className="contact-label">Telefone Premium</span>
                                <span className="contact-value">+55 (11) 4004-1234</span>
                            </div>
                        </motion.a>

                        <motion.a 
                            href="mailto:suporte@transita.ai"
                            className="contact-item email"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="contact-icon">
                                <FaEnvelope />
                            </div>
                            <div className="contact-details">
                                <span className="contact-label">Email Corporativo</span>
                                <span className="contact-value">suporte@transita.ai</span>
                            </div>
                        </motion.a>
                    </div>
                </motion.div>

                {/* Mobile App */}
                <motion.div className="footer-section app-section" variants={itemVariants}>
                    <h4 className="footer-title">
                        <FaMobileAlt className="title-icon" />
                        App Mobile
                        <motion.div 
                            className="title-underline"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        />
                    </h4>
                    
                    <motion.div 
                        className="app-showcase"
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <div className="app-header">
                            <FaCloudDownloadAlt className="app-header-icon" />
                            <span>Disponível nas lojas</span>
                        </div>
                        
                        <div className="download-stats">
                            <div className="download-stat">
                                <span className="stat-count">+{downloads.ios.toLocaleString()}</span>
                                <span className="stat-platform">iOS Downloads</span>
                            </div>
                            <div className="download-stat">
                                <span className="stat-count">+{downloads.android.toLocaleString()}</span>
                                <span className="stat-platform">Android Downloads</span>
                            </div>
                        </div>

                        <div className="app-buttons">
                            <motion.button 
                                className="app-btn app-store"
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -2,
                                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaApple className="app-icon" />
                                <div className="app-text">
                                    <span className="app-label">Download on the</span>
                                    <span className="app-store-name">App Store</span>
                                </div>
                            </motion.button>
                            
                            <motion.button 
                                className="app-btn google-play"
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -2,
                                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaGooglePlay className="app-icon" />
                                <div className="app-text">
                                    <span className="app-label">Get it on</span>
                                    <span className="app-store-name">Google Play</span>
                                </div>
                            </motion.button>
                        </div>

                        <div className="app-qr">
                            <motion.div 
                                className="qr-container"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaQrcode className="qr-icon" />
                                <span>Scan to Download</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer Bottom */}
            <motion.div 
                className="footer-bottom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
            >
                <div className="footer-bottom-content">
                    <div className="copyright-section">
                        <div className="copyright">
                            <span>&copy; {currentYear} Transita.AI Technologies.</span>
                            <span>Todos os direitos reservados.</span>
                        </div>
                        <div className="company-info">
                            <span>CNPJ: 12.345.678/0001-99</span>
                            <span>•</span>
                            <span>São Paulo - SP, Brasil</span>
                        </div>
                    </div>
                    
                    <div className="footer-legal">
                        {[
                            { icon: FaShieldAlt, text: 'Privacidade', desc: 'GDPR Compliant' },
                            { icon: FaFileContract, text: 'Termos', desc: 'Service Agreement' },
                            { icon: FaCookieBite, text: 'Cookies', desc: 'Preferences' },
                            { icon: FaDownload, text: 'Compliance', desc: 'LGPD' }
                        ].map((item, index) => (
                            <motion.a 
                                key={index}
                                href="#" 
                                className="legal-link"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <item.icon className="legal-icon" />
                                <div className="legal-text">
                                    <span>{item.text}</span>
                                    <span className="legal-desc">{item.desc}</span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                    
                    <div className="system-info">
                        <div className="version-info">
                            <span className="version">v2.4.1</span>
                            <span className="build">Build 2876</span>
                        </div>
                        <motion.div 
                            className="status-indicator online"
                            whileHover={{ scale: 1.05 }}
                            animate={{
                                boxShadow: [
                                    '0 0 0 0 rgba(16, 185, 129, 0.7)',
                                    '0 0 0 10px rgba(16, 185, 129, 0)',
                                    '0 0 0 0 rgba(16, 185, 129, 0)'
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        >
                            <motion.span 
                                className="status-dot"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <HiStatusOnline className="status-icon" />
                            <span className="status-text">Sistema Online</span>
                            <span className="status-uptime">99.99% Uptime</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;