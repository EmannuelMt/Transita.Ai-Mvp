import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiTruck,
    FiLinkedin,
    FiTwitter,
    FiInstagram,
    FiMapPin,
    FiTrendingUp,
    FiHeadphones,
    FiPhone,
    FiMail,
    FiShield,
    FiInfo,
    FiPackage,
    FiClock,
    FiDollarSign,
    FiGlobe,
    FiDatabase,
    FiBox,
    FiNavigation,
    FiCpu,
    FiSettings,
    FiBarChart2,
    FiUser,
    FiMessageCircle,
    FiAward,
    FiStar,
    FiZap
} from 'react-icons/fi';
import {
    HiOutlineChip,
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineDeviceMobile
} from 'react-icons/hi';
import './Footer.css';

// Import da logo - ajuste o caminho conforme necessário
import Logotipofretevelocidadelaranja from '../../assets/images/Logotipofretevelocidadelaranja.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredStat, setHoveredStat] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.05 }
        );

        const footer = document.querySelector('.footer-container');
        if (footer) observer.observe(footer);

        return () => observer.disconnect();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02,
            y: -5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const statVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            y: -3,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    };

    const socialVariants = {
        hover: {
            scale: 1.3,
            rotate: 360,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: { scale: 0.9 }
    };

    const stats = [
        {
            id: 1,
            value: "2.847",
            label: "Veículos Ativos",
            icon: FiTruck,
            color: "var(--orange-primary)"
        },
        {
            id: 2,
            value: "98.3%",
            label: "Eficiência em Rotas",
            icon: FiNavigation,
            color: "var(--blue-vibrant)"
        },
        {
            id: 3,
            value: "-23%",
            label: "Economia de Custos",
            icon: HiOutlineCurrencyDollar,
            color: "var(--orange-soft)"
        }
    ];

    const solutions = [
        {
            title: "Roteirização Inteligente",
            icon: FiNavigation,
            links: [
                { name: "Otimização com IA", icon: HiOutlineChip, href: "/solucoes/otimizacao-rotas" },
                { name: "Tráfego em Tempo Real", icon: FiTrendingUp, href: "/solucoes/trafego-tempo-real" },
                { name: "Rotas Dinâmicas", icon: FiSettings, href: "/solucoes/rotas-dinamicas" }
            ]
        },
        {
            title: "Gestão de Frota",
            icon: FiTruck,
            links: [
                { name: "Rastreamento GPS", icon: FiPackage, href: "/solucoes/rastreamento" },
                { name: "Gestão de Combustível", icon: FiTrendingUp, href: "/solucoes/gestao-combustivel" },
                { name: "Manutenção Preditiva", icon: FiCpu, href: "/solucoes/manutencao" }
            ]
        },
        {
            title: "Monitoramento",
            icon: FiMapPin,
            links: [
                { name: "Dashboard em Tempo Real", icon: FiBarChart2, href: "/solucoes/dashboard" },
                { name: "Alertas Inteligentes", icon: FiClock, href: "/solucoes/alertas" },
                { name: "Relatórios Avançados", icon: FiDatabase, href: "/solucoes/relatorios" }
            ]
        },
        {
            title: "Empresa",
            icon: FiGlobe,
            links: [
                { name: "Sobre Nós", icon: FiInfo, href: "/sobre" },
                { name: "Fale Conosco", icon: FiHeadphones, href: "/contato" },
                { name: "Trabalhe Conosco", icon: FiUser, href: "/carreiras" }
            ]
        }
    ];

    return (
        <motion.footer
            className="footer-container"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
        >
            {/* Background com Efeito de Profundidade */}
            <div className="footer-background">
                <div className="background-glow glow-1"></div>
                <div className="background-glow glow-2"></div>
                <div className="background-glow glow-3"></div>
                <div className="background-grid"></div>
            </div>

            {/* Conteúdo Principal */}
            <div className="footer-content">

                {/* Header do Footer */}
                <motion.div className="footer-header" variants={itemVariants}>
                    <div className="footer-brand">
                        <motion.div
                            className="brand-logo-container"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <div className="logo-wrapper">
                                <img
                                    src={Logotipofretevelocidadelaranja}
                                    alt="Transita.AI"
                                    className="logo-image"
                                />
                                <div className="logo-glow"></div>
                                <motion.div
                                    className="logo-pulse"
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <div className="brand-text">
                                <h2 className="brand-title">Transita.AI</h2>
                                <p className="brand-tagline">Inteligência Logística Avançada</p>
                                <div className="brand-badges">
                                    <motion.span
                                        className="brand-badge"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <FiAward className="badge-icon" />
                                        Tecnologia AI
                                    </motion.span>
                                    <motion.span
                                        className="brand-badge"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <FiZap className="badge-icon" />
                                        Tempo Real
                                    </motion.span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="footer-stats">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.id}
                                className="stat-item"
                                variants={statVariants}
                                initial="initial"
                                whileHover="hover"
                                onHoverStart={() => setHoveredStat(stat.id)}
                                onHoverEnd={() => setHoveredStat(null)}
                                custom={index}
                            >
                                <motion.div
                                    className="stat-icon-wrapper"
                                    animate={{
                                        scale: hoveredStat === stat.id ? 1.1 : 1,
                                        rotate: hoveredStat === stat.id ? 360 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <stat.icon className="stat-icon" />
                                </motion.div>
                                <div className="stat-info">
                                    <motion.span
                                        className="stat-value"
                                        animate={{ color: hoveredStat === stat.id ? stat.color : 'var(--white)' }}
                                    >
                                        {stat.value}
                                    </motion.span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                                {hoveredStat === stat.id && (
                                    <motion.div
                                        className="stat-hover-glow"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        style={{ background: stat.color }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Grid de Soluções */}
                <div className="solutions-grid">
                    {solutions.map((solution, index) => (
                        <motion.div
                            key={solution.title}
                            className="solution-column"
                            variants={itemVariants}
                            whileHover="hover"
                            custom={index}
                        >
                            <div className="column-header">
                                <motion.div
                                    className="column-icon-wrapper"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <solution.icon className="column-icon" />
                                </motion.div>
                                <h3>{solution.title}</h3>
                            </div>
                            <div className="solution-links">
                                {solution.links.map((link, linkIndex) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        className="solution-link"
                                        variants={itemVariants}
                                        whileHover={{
                                            x: 8,
                                            color: 'var(--white)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                        }}
                                        transition={{ delay: linkIndex * 0.1 }}
                                    >
                                        <motion.div
                                            className="link-icon-wrapper"
                                            whileHover={{ scale: 1.2, rotate: 15 }}
                                        >
                                            <link.icon className="link-icon" />
                                        </motion.div>
                                        <span>{link.name}</span>
                                        <motion.div
                                            className="link-arrow"
                                            initial={{ opacity: 0, x: -5 }}
                                            whileHover={{ opacity: 1, x: 0 }}
                                        >
                                            →
                                        </motion.div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Painel de Contato */}
                <motion.div
                    className="contact-panel"
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="panel-background-glow"></div>
                    <div className="panel-content">
                        <div className="contact-info">
                            <motion.h4
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Pronto para Otimizar sua Logística?
                            </motion.h4>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Entre em contato com nossa equipe de especialistas em IA
                            </motion.p>

                            <div className="contact-channels">
                                <motion.a
                                    href="tel:+551140028922"
                                    className="contact-channel"
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="channel-icon-wrapper"
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <FiPhone className="channel-icon" />
                                    </motion.div>
                                    <div className="channel-details">
                                        <span className="channel-name">Telefone</span>
                                        <span className="channel-value">+55 11 4002-8922</span>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href="mailto:comercial@transita.ai"
                                    className="contact-channel"
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="channel-icon-wrapper"
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <FiMail className="channel-icon" />
                                    </motion.div>
                                    <div className="channel-details">
                                        <span className="channel-name">Email</span>
                                        <span className="channel-value">comercial@transita.ai</span>
                                    </div>
                                </motion.a>
                            </div>
                        </div>

                        <div className="cta-section">
                            <motion.a
                                href="/demo"
                                className="cta-button primary"
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    boxShadow: "0 12px 40px rgba(255, 106, 0, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    <FiInfo className="button-icon" />
                                </motion.div>
                                <span>Solicitar Demonstração</span>
                            </motion.a>

                            <motion.a
                                href="/contato"
                                className="cta-button secondary"
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    backgroundColor: "rgba(255, 255, 255, 0.15)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiMessageCircle className="button-icon" />
                                <span>Falar com Especialista</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Inferior */}
                <motion.div className="footer-bottom" variants={itemVariants}>
                    <div className="bottom-content">
                        <div className="copyright-section">
                            <div className="copyright">
                                <motion.span
                                    whileHover={{ color: 'var(--orange-primary)' }}
                                >
                                    &copy; {currentYear} Transita.AI Tecnologia em Logística
                                </motion.span>
                                <span>Todos os direitos reservados</span>
                            </div>

                            <motion.div
                                className="security-badge"
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                <motion.div
                                    className="badge-icon-wrapper"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <FiShield className="badge-icon" />
                                </motion.div>
                                <span>Sistema Seguro e Certificado</span>
                            </motion.div>
                        </div>

                        <div className="footer-links">
                            {['Política de Privacidade', 'Termos de Uso', 'LGPD', 'Suporte'].map((link, index) => (
                                <motion.a
                                    key={link}
                                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                                    whileHover={{
                                        scale: 1.05,
                                        color: 'var(--orange-primary)',
                                        y: -2
                                    }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {link}
                                </motion.a>
                            ))}
                        </div>

                        <div className="social-links">
                            {[
                                { icon: FiLinkedin, href: "https://linkedin.com/company/transita-ai", label: "LinkedIn" },
                                { icon: FiTwitter, href: "https://twitter.com/transita_ai", label: "Twitter" },
                                { icon: FiInstagram, href: "https://instagram.com/transita.ai", label: "Instagram" }
                            ].map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="social-link"
                                    variants={socialVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    aria-label={social.label}
                                >
                                    <social.icon className="link-icon" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;