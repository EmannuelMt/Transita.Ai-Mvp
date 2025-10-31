import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FaBars, 
  FaShieldAlt, 
  FaHome, 
  FaChartLine, 
  FaTruckLoading, 
  FaMapMarkerAlt,
  FaTh,
  FaChevronDown,
  FaUsers,
  FaTruck,
  FaTools,
  FaChartBar,
  FaDollarSign,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserCircle,
  FaSearch,
  FaBell,
  FaCog,
  FaRoute,
  FaWarehouse,
  FaGasPump,
  FaClipboardCheck,
  FaPhoneAlt,
  FaQuestionCircle,
  FaRocket,
  FaLeaf,
  FaBolt,
  FaStar,
  FaHeart,
  FaSun,
  FaMoon,
  FaPalette
} from 'react-icons/fa';
import { 
  HiMenuAlt3,
  HiX,
  HiSearch,
  HiBell,
  HiCog
} from 'react-icons/hi';
import { 
  RiDashboardFill,
  RiTruckFill,
  RiMapPinFill,
  RiUserFill,
  RiSettings4Fill,
  RiFlashlightFill
} from 'react-icons/ri';
import '../styles/navbar.css';

// Custom hook for dropdown management
const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  return { isOpen, toggle, close, open, ref };
};

// Theme Toggle Component
const ThemeToggle = ({ theme, onThemeChange }) => {
  return (
    <motion.button
      className="theme-toggle"
      onClick={onThemeChange}
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <FaMoon className="theme-icon" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <FaSun className="theme-icon" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Professional Navbar Component
const ProfessionalNavbar = ({ user, onLogout, sidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Novo frete disponível', time: '5 min ago', read: false },
    { id: 2, type: 'warning', title: 'Manutenção preventiva', time: '1 hora atrás', read: false },
    { id: 3, type: 'success', title: 'Pagamento confirmado', time: '2 horas atrás', read: true }
  ]);
  
  const dropdown = useDropdown();
  const mobileMenu = useDropdown();
  const searchModal = useDropdown();
  const notificationsDropdown = useDropdown();

  const { scrollY } = useScroll();
  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );
  const navbarShadow = useTransform(
    scrollY,
    [0, 100],
    ['0 1px 3px rgba(0,0,0,0.1)', '0 8px 25px rgba(0,0,0,0.15)']
  );

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobileView(isMobile);
      if (!isMobile) mobileMenu.close();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenu]);

  const handleLogout = useCallback(() => {
    dropdown.close();
    mobileMenu.close();
    onLogout();
  }, [onLogout, dropdown, mobileMenu]);

  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const closeAllMenus = useCallback(() => {
    dropdown.close();
    mobileMenu.close();
    searchModal.close();
    notificationsDropdown.close();
  }, [dropdown, mobileMenu, searchModal, notificationsDropdown]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation data structure - Atualizada para combinar com a home
  const navigationConfig = {
    primary: [
      { 
        path: '/', 
        icon: FaHome, 
        label: 'Início',
        description: 'Página inicial do sistema',
        badge: null,
        gradient: 'primary'
      },
      { 
        path: '/dashboard', 
        icon: RiDashboardFill, 
        label: 'Dashboard',
        description: 'Métricas e analytics em tempo real',
        badge: '3',
        gradient: 'success'
      },
      { 
        path: '/fretes', 
        icon: RiTruckFill, 
        label: 'Fretes',
        description: 'Gestão inteligente de transportes',
        badge: '12',
        gradient: 'warning'
      },
      { 
        path: '/monitoramento', 
        icon: RiMapPinFill, 
        label: 'Monitoramento',
        description: 'Rastreamento em tempo real com IA',
        badge: null,
        gradient: 'info'
      }
    ],
    dropdown: [
      {
        title: 'Operações Logísticas',
        icon: FaTruck,
        color: '#6366f1',
        gradient: 'primary',
        items: [
          { 
            path: '/motoristas', 
            icon: RiUserFill, 
            label: 'Motoristas',
            description: 'Gestão de colaboradores',
            features: ['Cadastro', 'Escalas', 'Desempenho']
          },
          { 
            path: '/veiculos', 
            icon: FaTruck, 
            label: 'Frota Inteligente',
            description: 'Controle completo de veículos',
            features: ['Manutenção', 'Custos', 'Documentos']
          },
          { 
            path: '/rotas', 
            icon: FaRoute, 
            label: 'Rotas Otimizadas',
            description: 'Planejamento com IA',
            features: ['Otimização', 'Tráfego', 'Custos']
          },
          { 
            path: '/cargas', 
            icon: FaWarehouse, 
            label: 'Cargas',
            description: 'Gestão de inventário',
            features: ['Tracking', 'Documentos', 'Status']
          }
        ]
      },
      {
        title: 'Gestão & Analytics',
        icon: FaChartBar,
        color: '#10b981',
        gradient: 'success',
        items: [
          { 
            path: '/relatorios', 
            icon: FaChartBar, 
            label: 'Relatórios Avançados',
            description: 'Analytics e insights preditivos',
            features: ['Dashboard', 'Export', 'KPI']
          },
          { 
            path: '/financeiro', 
            icon: FaDollarSign, 
            label: 'Financeiro',
            description: 'Controle financeiro automatizado',
            features: ['Faturamento', 'Custos', 'Fluxo']
          },
          { 
            path: '/manutencao', 
            icon: FaTools, 
            label: 'Manutenção',
            description: 'Gestão preditiva de manutenções',
            features: ['Agendamentos', 'Histórico', 'Custos']
          },
          { 
            path: '/combustivel', 
            icon: FaGasPump, 
            label: 'Combustível',
            description: 'Controle inteligente de abastecimento',
            features: ['Abastecimento', 'Medições', 'Economia']
          }
        ]
      },
      {
        title: 'Sistema & Suporte',
        icon: RiSettings4Fill,
        color: '#8b5cf6',
        gradient: 'purple',
        items: [
          { 
            path: '/configuracoes', 
            icon: RiSettings4Fill, 
            label: 'Configurações',
            description: 'Personalização do sistema',
            features: ['Preferências', 'Integrações', 'Segurança']
          },
          { 
            path: '/suporte', 
            icon: FaPhoneAlt, 
            label: 'Suporte 24/7',
            description: 'Central de ajuda especializada',
            features: ['Chat', 'Ticket', 'Remote']
          },
          { 
            path: '/documentacao', 
            icon: FaClipboardCheck, 
            label: 'Documentação',
            description: 'Manuais e guias completos',
            features: ['API', 'Tutoriais', 'FAQ']
          },
          { 
            path: '/integracao', 
            icon: FaBolt, 
            label: 'Integrações',
            description: 'Conecte com outras plataformas',
            features: ['ERP', 'Tracking', 'Payment']
          }
        ]
      }
    ]
  };

  // Animation variants - Melhoradas
  const animations = {
    navbar: {
      hidden: { y: -100, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25
        }
      }
    },
    navItem: {
      hidden: { opacity: 0, x: -20 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 200,
          delay: i * 0.05
        }
      }),
      hover: {
        scale: 1.05,
        y: -2,
        transition: {
          type: "spring",
          stiffness: 400
        }
      }
    },
    dropdown: {
      hidden: { 
        opacity: 0, 
        y: -20,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30
        }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.15 }
      }
    },
    mobileMenu: {
      hidden: { 
        opacity: 0,
        x: "100%",
        transition: { duration: 0.3, ease: "easeInOut" }
      },
      visible: { 
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 40
        }
      },
      exit: { 
        opacity: 0,
        x: "100%",
        transition: { duration: 0.25, ease: "easeInOut" }
      }
    },
    notification: {
      hidden: { opacity: 0, x: 50 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
          delay: i * 0.1,
          type: "spring",
          stiffness: 300
        }
      })
    }
  };

  // Search Component - Melhorado
  const SearchModal = () => (
    <AnimatePresence>
      {searchModal.isOpen && (
        <>
          <motion.div 
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={searchModal.close}
          />
          <motion.div 
            className="search-modal"
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-header">
              <div className="search-title">
                <HiSearch className="title-icon" />
                <h3>Busca Inteligente</h3>
              </div>
              <motion.button
                className="search-close-btn"
                onClick={searchModal.close}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiX />
              </motion.button>
            </div>
            
            <div className="search-input-container">
              <HiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por fretes, motoristas, veículos, relatórios..."
                className="search-input"
                autoFocus
              />
              <motion.button 
                className="search-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBolt />
              </motion.button>
            </div>

            <div className="search-suggestions">
              <div className="suggestion-section">
                <span className="suggestion-title">Busca Rápida</span>
                <div className="suggestion-tags">
                  {['Fretes ativos', 'Motoristas disponíveis', 'Relatórios mensais', 'Manutenção pendente', 'Rotas otimizadas'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      className="suggestion-tag"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <div className="search-recent">
              <span className="recent-title">Buscas Recentes</span>
              <div className="recent-items">
                {['Relatório de desempenho', 'Frota Mercedes', 'Manutenção preventiva'].map((item, i) => (
                  <motion.div
                    key={item}
                    className="recent-item"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <HiSearch />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Notifications Dropdown
  const NotificationsDropdown = () => (
    <AnimatePresence>
      {notificationsDropdown.isOpen && (
        <motion.div 
          className="notifications-panel"
          ref={notificationsDropdown.ref}
          variants={animations.dropdown}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="notifications-header">
            <h4>Notificações</h4>
            {unreadCount > 0 && (
              <motion.button 
                className="mark-read-btn"
                onClick={markAllAsRead}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Marcar como lida
              </motion.button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                custom={i}
                variants={animations.notification}
              >
                <div className="notification-icon">
                  {notification.type === 'info' && <FaBell />}
                  {notification.type === 'warning' && <FaBolt />}
                  {notification.type === 'success' && <FaCheckCircle />}
                </div>
                <div className="notification-content">
                  <span className="notification-title">{notification.title}</span>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {!notification.read && <div className="notification-dot" />}
              </motion.div>
            ))}
          </div>

          <div className="notifications-footer">
            <Link to="/notificacoes" onClick={closeAllMenus}>
              Ver todas as notificações
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.nav 
        className={`professional-navbar ${isScrolled ? 'scrolled' : ''} ${mobileView ? 'mobile' : ''}`}
        style={{
          background: navbarBackground,
          boxShadow: navbarShadow
        }}
        variants={animations.navbar}
        initial="hidden"
        animate="visible"
      >
        <div className="nav-container">
          {/* Brand & Primary Navigation */}
          <div className="nav-section nav-section--primary">
            <motion.button 
              className="nav-trigger nav-trigger--sidebar"
              onClick={onToggleSidebar}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <FaBars className="trigger-icon" />
              </motion.div>
            </motion.button>

            <motion.div
              className="brand-container"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/" className="brand" onClick={closeAllMenus}>
                <motion.div
                  className="brand-icon-container"
                  whileHover={{ 
                    rotate: [0, -10, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  <FaRocket className="brand-icon" />
                </motion.div>
                <div className="brand-content">
                  <motion.span 
                    className="brand-name"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    LogiTech
                  </motion.span>
                  <motion.span 
                    className="brand-tagline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Pro
                  </motion.span>
                </div>
              </Link>
            </motion.div>

            {/* Primary Navigation */}
            <nav className="primary-nav" aria-label="Navegação principal">
              {navigationConfig.primary.map((item, index) => (
                <motion.div
                  key={item.path}
                  className="nav-item"
                  custom={index}
                  variants={animations.navItem}
                  onHoverStart={() => setActiveHover(item.path)}
                  onHoverEnd={() => setActiveHover(null)}
                >
                  <Link 
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''} ${item.gradient}`}
                    onClick={closeAllMenus}
                  >
                    <motion.div
                      className="nav-icon-wrapper"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <item.icon className="nav-icon" />
                      {item.badge && (
                        <motion.span 
                          className="nav-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </motion.div>
                    <span className="nav-label">{item.label}</span>
                    
                    {/* Active Indicator */}
                    {isActive(item.path) && (
                      <motion.div 
                        className="nav-indicator"
                        layoutId="navIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Hover Tooltip */}
                    <AnimatePresence>
                      {activeHover === item.path && (
                        <motion.div 
                          className="nav-tooltip"
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        >
                          {item.description}
                          <div className="tooltip-arrow" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Secondary Navigation & Actions */}
          <div className="nav-section nav-section--secondary">
            {/* Quick Actions */}
            <div className="nav-actions">
              <ThemeToggle theme={theme} onThemeChange={toggleTheme} />

              <motion.button
                className="nav-action"
                onClick={searchModal.open}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="Busca inteligente"
              >
                <HiSearch className="action-icon" />
              </motion.button>

              <div className="nav-dropdown nav-notifications" ref={notificationsDropdown.ref}>
                <motion.button
                  className="nav-action"
                  onClick={notificationsDropdown.toggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Notificações"
                >
                  <HiBell className="action-icon" />
                  {unreadCount > 0 && (
                    <motion.span 
                      className="action-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>
                <NotificationsDropdown />
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="nav-dropdown" ref={dropdown.ref}>
              <motion.button 
                className={`dropdown-trigger ${dropdown.isOpen ? 'active' : ''}`}
                onClick={dropdown.toggle}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTh className="trigger-icon" />
                <span className="trigger-label">Recursos</span>
                <motion.div
                  animate={{ rotate: dropdown.isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <FaChevronDown className="trigger-chevron" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {dropdown.isOpen && (
                  <motion.div 
                    className="dropdown-panel"
                    variants={animations.dropdown}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="dropdown-header">
                      <h3>Navegação Completa</h3>
                      <span>Todos os módulos do sistema</span>
                    </div>
                    
                    {navigationConfig.dropdown.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="dropdown-section">
                        <div className="section-header">
                          <div 
                            className={`section-icon-container ${section.gradient}`}
                          >
                            <section.icon className="section-icon" />
                          </div>
                          <div className="section-info">
                            <h4 className="section-title">{section.title}</h4>
                            <span className="section-subtitle">{section.items.length} recursos</span>
                          </div>
                        </div>
                        <div className="section-items">
                          {section.items.map((item, itemIndex) => (
                            <motion.div
                              key={item.path}
                              className="dropdown-item"
                              variants={animations.navItem}
                              custom={itemIndex}
                              whileHover={{ x: 4 }}
                            >
                              <Link 
                                to={item.path}
                                className="item-link"
                                onClick={closeAllMenus}
                              >
                                <div 
                                  className={`item-icon-container ${section.gradient}`}
                                >
                                  <item.icon className="item-icon" />
                                </div>
                                <div className="item-content">
                                  <span className="item-title">{item.label}</span>
                                  <span className="item-description">{item.description}</span>
                                  <div className="item-features">
                                    {item.features?.map((feature, i) => (
                                      <span key={i} className="item-feature">{feature}</span>
                                    ))}
                                  </div>
                                </div>
                                <motion.div 
                                  className="item-arrow"
                                  initial={{ x: -5, opacity: 0 }}
                                  whileHover={{ x: 0, opacity: 1 }}
                                >
                                  <FaChevronDown />
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            {user ? (
              <motion.div 
                className="user-context"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="user-profile">
                  <motion.div 
                    className="user-avatar"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaUserCircle className="avatar-icon" />
                    <div className="user-status online" />
                  </motion.div>
                  <div className="user-info">
                    <span className="user-name">{user.displayName || user.email}</span>
                    <span className="user-role">Administrador</span>
                  </div>
                </div>
                <motion.button 
                  className="user-action"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title="Sair do sistema"
                >
                  <FaSignOutAlt className="action-icon" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="auth-button" onClick={closeAllMenus}>
                  <FaSignInAlt className="button-icon" />
                  <span>Acessar Sistema</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Trigger */}
            <motion.button
              className="nav-trigger nav-trigger--mobile"
              onClick={mobileMenu.toggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenu.isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <HiX className="trigger-icon" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <HiMenuAlt3 className="trigger-icon" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {mobileMenu.isOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAllMenus}
            />
            <motion.div 
              className="mobile-panel"
              ref={mobileMenu.ref}
              variants={animations.mobileMenu}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MobileNavigation 
                user={user}
                onLogout={handleLogout}
                navigationConfig={navigationConfig}
                isActive={isActive}
                onClose={closeAllMenus}
                theme={theme}
                onThemeChange={toggleTheme}
                unreadCount={unreadCount}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal />
    </>
  );
};

// Mobile Navigation Component - Melhorado
const MobileNavigation = ({ user, onLogout, navigationConfig, isActive, onClose, theme, onThemeChange, unreadCount }) => (
  <div className="mobile-nav">
    {/* User Header */}
    <div className="mobile-nav-header">
      {user ? (
        <div className="mobile-user-header">
          <div className="user-avatar-large">
            <FaUserCircle className="avatar-icon" />
            <div className="user-status online" />
          </div>
          <div className="user-details">
            <span className="user-name">{user.displayName || user.email}</span>
            <span className="user-role">Administrador do Sistema</span>
          </div>
          <div className="user-actions">
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            <motion.button 
              className="logout-button"
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="mobile-auth-section">
          <Link to="/login" className="mobile-auth-button primary" onClick={onClose}>
            <FaSignInAlt />
            <span>Acessar Sistema</span>
          </Link>
          <Link to="/register" className="mobile-auth-button secondary" onClick={onClose}>
            <FaUserCircle />
            <span>Criar Conta</span>
          </Link>
        </div>
      )}
    </div>

    <div className="mobile-nav-content">
      {/* Primary Navigation */}
      <nav className="mobile-nav-section">
        <h3 className="section-title">Navegação Principal</h3>
        {navigationConfig.primary.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''} ${item.gradient}`}
            onClick={onClose}
          >
            <div className="item-icon">
              <item.icon />
              {item.badge && <span className="item-badge">{item.badge}</span>}
            </div>
            <div className="item-content">
              <span className="item-label">{item.label}</span>
              <span className="item-description">{item.description}</span>
            </div>
            <motion.div 
              className="item-arrow"
              whileHover={{ x: 3 }}
            >
              <FaChevronDown />
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Dropdown Sections */}
      {navigationConfig.dropdown.map((section, index) => (
        <nav key={index} className="mobile-nav-section">
          <h3 className="section-title">
            <div className={`title-icon-container ${section.gradient}`}>
              <section.icon className="title-icon" />
            </div>
            {section.title}
          </h3>
          {section.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="mobile-nav-item"
              onClick={onClose}
            >
              <div className="item-icon">
                <item.icon />
              </div>
              <div className="item-content">
                <span className="item-label">{item.label}</span>
                <span className="item-description">{item.description}</span>
                <div className="item-features">
                  {item.features?.map((feature, i) => (
                    <span key={i} className="item-feature">{feature}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </nav>
      ))}
    </div>

    {/* Mobile Footer */}
    <div className="mobile-nav-footer">
      <div className="mobile-app-info">
        <div className="app-version">
          <FaRocket className="version-icon" />
          <span>LogiTech Pro v2.1.0</span>
        </div>
        <div className="app-stats">
          <span className="stat">
            <FaUserCircle />
            12 online
          </span>
          <span className="stat">
            <FaBell />
            {unreadCount} notif.
          </span>
        </div>
      </div>
      <div className="app-copyright">
        <span>© 2024 LogiTech Pro. Todos os direitos reservados.</span>
      </div>
    </div>
  </div>
);

// Componente auxiliar para ícone de check
const FaCheckCircle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm6.2 8.8l-6.8 6.8-3.2-3.2a1 1 0 00-1.4 1.4l4 4a1 1 0 001.4 0l7.5-7.5a1 1 0 00-1.4-1.4z"/>
  </svg>
);

export default ProfessionalNavbar;