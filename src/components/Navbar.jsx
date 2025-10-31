import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaQuestionCircle
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
  RiSettings4Fill
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

// Professional Navbar Component
const ProfessionalNavbar = ({ user, onLogout, sidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  
  const dropdown = useDropdown();
  const mobileMenu = useDropdown();
  const searchModal = useDropdown();

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
  }, [dropdown, mobileMenu, searchModal]);

  // Navigation data structure
  const navigationConfig = {
    primary: [
      { 
        path: '/', 
        icon: FaHome, 
        label: 'Início',
        description: 'Página inicial do sistema',
        badge: null
      },
      { 
        path: '/dashboard', 
        icon: RiDashboardFill, 
        label: 'Dashboard',
        description: 'Métricas e analytics',
        badge: '3'
      },
      { 
        path: '/fretes', 
        icon: RiTruckFill, 
        label: 'Fretes',
        description: 'Gestão de transportes',
        badge: '12'
      },
      { 
        path: '/monitoramento', 
        icon: RiMapPinFill, 
        label: 'Monitoramento',
        description: 'Rastreamento em tempo real',
        badge: null
      }
    ],
    dropdown: [
      {
        title: 'Operações',
        icon: FaTruck,
        color: '#4fc3f7',
        items: [
          { 
            path: '/motoristas', 
            icon: RiUserFill, 
            label: 'Motoristas',
            description: 'Gestão de colaboradores'
          },
          { 
            path: '/veiculos', 
            icon: FaTruck, 
            label: 'Frota',
            description: 'Controle de veículos'
          },
          { 
            path: '/rotas', 
            icon: FaRoute, 
            label: 'Rotas',
            description: 'Planejamento de trajetos'
          },
          { 
            path: '/cargas', 
            icon: FaWarehouse, 
            label: 'Cargas',
            description: 'Gestão de inventário'
          }
        ]
      },
      {
        title: 'Gestão',
        icon: FaChartBar,
        color: '#29b6f6',
        items: [
          { 
            path: '/relatorios', 
            icon: FaChartBar, 
            label: 'Relatórios',
            description: 'Analytics e insights'
          },
          { 
            path: '/financeiro', 
            icon: FaDollarSign, 
            label: 'Financeiro',
            description: 'Controle financeiro'
          },
          { 
            path: '/manutencao', 
            icon: FaTools, 
            label: 'Manutenção',
            description: 'Agendamentos e ordens'
          },
          { 
            path: '/combustivel', 
            icon: FaGasPump, 
            label: 'Combustível',
            description: 'Controle de abastecimento'
          }
        ]
      },
      {
        title: 'Suporte',
        icon: HiCog,
        color: '#26c6da',
        items: [
          { 
            path: '/configuracoes', 
            icon: RiSettings4Fill, 
            label: 'Configurações',
            description: 'Preferências do sistema'
          },
          { 
            path: '/suporte', 
            icon: FaPhoneAlt, 
            label: 'Suporte',
            description: 'Central de ajuda'
          },
          { 
            path: '/documentacao', 
            icon: FaClipboardCheck, 
            label: 'Documentação',
            description: 'Manuais e guias'
          }
        ]
      }
    ]
  };

  // Animation variants
  const animations = {
    navbar: {
      hidden: { y: -100, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20
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
          stiffness: 150,
          delay: i * 0.1
        }
      }),
      hover: {
        scale: 1.02,
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
        y: -10,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      },
      exit: { 
        opacity: 0, 
        y: -10,
        transition: { duration: 0.2 }
      }
    },
    mobileMenu: {
      hidden: { 
        opacity: 0,
        x: "100%",
        transition: { duration: 0.3 }
      },
      visible: { 
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      },
      exit: { 
        opacity: 0,
        x: "100%",
        transition: { duration: 0.3 }
      }
    }
  };

  // Search Component
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
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-header">
              <h3>Buscar no sistema</h3>
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
                placeholder="Buscar por fretes, motoristas, veículos..."
                className="search-input"
                autoFocus
              />
            </div>
            <div className="search-suggestions">
              <span className="suggestion-title">Sugestões:</span>
              <div className="suggestion-tags">
                {['Fretes ativos', 'Motoristas', 'Relatórios', 'Manutenção'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="suggestion-tag"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.nav 
        className={`professional-navbar ${isScrolled ? 'scrolled' : ''} ${mobileView ? 'mobile' : ''}`}
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
                  <FaShieldAlt className="brand-icon" />
                </motion.div>
                <div className="brand-content">
                  <motion.span 
                    className="brand-name"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Transita.AI
                  </motion.span>
                  <span className="brand-tagline">Logistics Intelligence</span>
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
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
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
              <motion.button
                className="nav-action"
                onClick={searchModal.open}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="Buscar"
              >
                <HiSearch className="action-icon" />
              </motion.button>

              <motion.button
                className="nav-action"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Notificações"
              >
                <HiBell className="action-icon" />
                <motion.span 
                  className="action-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  3
                </motion.span>
              </motion.button>
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
                    {navigationConfig.dropdown.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="dropdown-section">
                        <div className="section-header">
                          <div 
                            className="section-icon-container"
                            style={{ '--icon-color': section.color }}
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
                                  className="item-icon-container"
                                  style={{ '--icon-color': section.color }}
                                >
                                  <item.icon className="item-icon" />
                                </div>
                                <div className="item-content">
                                  <span className="item-title">{item.label}</span>
                                  <span className="item-description">{item.description}</span>
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
                    <div className="user-status" />
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

// Mobile Navigation Component
const MobileNavigation = ({ user, onLogout, navigationConfig, isActive, onClose }) => (
  <div className="mobile-nav">
    {/* User Header */}
    {user && (
      <div className="mobile-user-header">
        <div className="user-avatar-large">
          <FaUserCircle className="avatar-icon" />
          <div className="user-status online" />
        </div>
        <div className="user-details">
          <span className="user-name">{user.displayName || user.email}</span>
          <span className="user-role">Administrador do Sistema</span>
        </div>
        <motion.button 
          className="logout-button"
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt />
        </motion.button>
      </div>
    )}

    <div className="mobile-nav-content">
      {/* Primary Navigation */}
      <nav className="mobile-nav-section">
        <h3 className="section-title">Navegação Principal</h3>
        {navigationConfig.primary.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
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
          </Link>
        ))}
      </nav>

      {/* Dropdown Sections */}
      {navigationConfig.dropdown.map((section, index) => (
        <nav key={index} className="mobile-nav-section">
          <h3 className="section-title">
            <section.icon className="title-icon" />
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
              </div>
            </Link>
          ))}
        </nav>
      ))}
    </div>

    {/* Mobile Footer */}
    <div className="mobile-nav-footer">
      {!user && (
        <Link to="/login" className="mobile-auth-button" onClick={onClose}>
          <FaSignInAlt />
          <span>Acessar Sistema</span>
        </Link>
      )}
      <div className="mobile-app-info">
        <span className="app-version">v2.1.0</span>
        <span className="app-copyright">© 2024 Transita.AI</span>
      </div>
    </div>
  </div>
);

export default ProfessionalNavbar;