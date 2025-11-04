import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaHome, 
  FaChartLine, 
  FaTruck, 
  FaMapMarkerAlt,
  FaChevronDown,
  FaUsers,
  FaTools,
  FaChartBar,
  FaDollarSign,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserCircle,
  FaRoute,
  FaWarehouse,
  FaGasPump,
  FaClipboardCheck,
  FaPhoneAlt,
  FaRocket,
  FaCog,
  FaHeadset,
  FaBook,
  FaShieldAlt,
  FaTimes
} from 'react-icons/fa';
import { 
  HiMenuAlt3,
  HiX
} from 'react-icons/hi';
import { 
  RiDashboardFill,
  RiTruckFill,
  RiMapPinFill,
  RiUserFill,
  RiSettings4Fill,
  RiFlashlightFill
} from 'react-icons/ri';
import { 
  IoStatsChart,
  IoSpeedometer,
  IoLocation,
  IoPeople
} from 'react-icons/io5';
import './Navbar.css';

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
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [close]);

  return { isOpen, toggle, close, open, ref };
};

// Animated Icon Component
const AnimatedIcon = ({ icon: Icon, isActive, size = 20 }) => (
  <motion.div
    className={`nav-icon-wrapper ${isActive ? 'active' : ''}`}
    whileHover={{ 
      scale: 1.1,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={size} />
  </motion.div>
);

// Professional Navbar Component
const ProfessionalNavbar = ({ user, onLogout, sidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  
  const dropdown = useDropdown();
  const mobileMenu = useDropdown();
  const userMenu = useDropdown();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobileView(isMobile);
      if (!isMobile) {
        mobileMenu.close();
      }
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
    userMenu.close();
    onLogout();
  }, [onLogout, dropdown, mobileMenu, userMenu]);

  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const closeAllMenus = useCallback(() => {
    dropdown.close();
    mobileMenu.close();
    userMenu.close();
  }, [dropdown, mobileMenu, userMenu]);

  // Enhanced navigation data structure
  const navigationConfig = {
    primary: [
      { 
        path: '/', 
        icon: FaHome, 
        label: 'Início',
        description: 'Página inicial do sistema',
        color: '#6366f1'
      },
      { 
        path: '/dashboard', 
        icon: IoStatsChart, 
        label: 'Dashboard',
        description: 'Métricas e analytics em tempo real',
        color: '#10b981'
      },
      { 
        path: '/Multas', 
        icon: RiTruckFill, 
        label: 'Multas',
        description: 'Gestão inteligente de multas',
        color: '#f59e0b'
      },
      { 
        path: '/monitoramento', 
        icon: IoLocation, 
        label: 'Monitoramento',
        description: 'Rastreamento em tempo real',
        color: '#3b82f6'
      }
    ],
    userMenu: [
      {
        title: 'Sistema & Suporte',
        icon: RiSettings4Fill,
        color: '#8b5cf6',
        items: [
          { 
            path: '/configuracoes', 
            icon: FaCog, 
            label: 'Configurações',
            description: 'Personalização do sistema'
          },
          { 
            path: '/suporte', 
            icon: FaHeadset, 
            label: 'Suporte 24/7',
            description: 'Central de ajuda especializada'
          },
          { 
            path: '/documentacao', 
            icon: FaBook, 
            label: 'Documentação',
            description: 'Manuais e guias completos'
          },
          { 
            path: '/seguranca', 
            icon: FaShieldAlt, 
            label: 'Segurança',
            description: 'Configurações de segurança'
          }
        ]
      },
    ]
  };

  // Enhanced animation variants
  const animations = {
    navbar: {
      hidden: { y: -100, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
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
          delay: i * 0.1
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
        transition: { duration: 0.2 }
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
    mobileItem: {
      hidden: { x: 50, opacity: 0 },
      visible: (i) => ({
        x: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          delay: i * 0.1
        }
      })
    }
  };

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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Alternar menu lateral"
            >
              <FaBars className="trigger-icon" />
            </motion.button>

            <motion.div
              className="brand-container"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/" className="brand" onClick={closeAllMenus}>
                <div className="brand-icon-container">
                  <FaRocket className="brand-icon" />
                </div>
                <div className="brand-content">
                  <span className="brand-name">Transita .AI</span>
                  <span className="brand-tagline">Pro</span>
                </div>
              </Link>
            </motion.div>

            {/* Primary Navigation - Hidden on mobile */}
            {!mobileView && (
              <nav className="primary-nav" aria-label="Navegação principal">
                {navigationConfig.primary.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      className="nav-item"
                      custom={index}
                      variants={animations.navItem}
                    >
                      <Link 
                        to={item.path}
                        className={`nav-link ${active ? 'active' : ''}`}
                        onClick={closeAllMenus}
                        style={{ '--item-color': item.color }}
                      >
                        <AnimatedIcon icon={item.icon} isActive={active} />
                        <span className="nav-label">{item.label}</span>
                        
                        {active && (
                          <motion.div 
                            className="nav-indicator"
                            layoutId="navIndicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            )}
          </div>

          {/* User Menu & Actions - SEMPRE VISÍVEL, TANTO NO PC QUANTO MOBILE */}
          <div className="nav-section nav-section--secondary">
            
            {/* Menu do Usuário - VISÍVEL EM TODOS OS DISPOSITIVOS */}
            {user ? (
              <div className="nav-dropdown" ref={userMenu.ref}>
                <motion.button 
                  className={`user-trigger ${userMenu.isOpen ? 'active' : ''}`}
                  onClick={userMenu.toggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Menu do usuário"
                >
                  <div className="user-profile-mini">
                    <div className="user-avatar">
                      <FaUserCircle className="avatar-icon" />
                    </div>
                    {/* Informações do usuário visíveis apenas no PC */}
                    {!mobileView && (
                      <div className="user-info-mini">
                        <span className="user-name">{user.displayName || user.email}</span>
                        <span className="user-role">Usuário</span>
                      </div>
                    )}
                    <FaChevronDown className={`trigger-chevron ${userMenu.isOpen ? 'rotated' : ''}`} />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {userMenu.isOpen && (
                    <motion.div 
                      className={`dropdown-panel user-panel ${mobileView ? 'mobile-dropdown' : ''}`}
                      variants={animations.dropdown}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="dropdown-header">
                        <div className="user-header-content">
                          <div className="header-avatar">
                            <FaUserCircle />
                          </div>
                          <div>
                            <h3>Menu do Usuário</h3>
                            <span>Configurações e suporte</span>
                          </div>
                        </div>
                      </div>
                      
                      {navigationConfig.userMenu.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="dropdown-section">
                          <div className="section-header">
                            <div 
                              className="section-icon-container"
                              style={{ '--section-color': section.color }}
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
                                className={`dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                variants={animations.navItem}
                                custom={itemIndex}
                                whileHover={{ x: 4 }}
                              >
                                <Link 
                                  to={item.path}
                                  className="item-link"
                                  onClick={closeAllMenus}
                                >
                                  <div className="item-icon-container">
                                    <item.icon className="item-icon" />
                                  </div>
                                  <div className="item-content">
                                    <span className="item-title">{item.label}</span>
                                    <span className="item-description">{item.description}</span>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="dropdown-footer">
                        <motion.button 
                          className="logout-button"
                          onClick={handleLogout}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaSignOutAlt className="button-icon" />
                          <span>Sair do Sistema</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="auth-button" onClick={closeAllMenus}>
                  <FaSignInAlt className="button-icon" />
                  {!mobileView && <span>Acessar Sistema</span>}
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Trigger - APENAS PARA NAVEGAÇÃO PRINCIPAL */}
            {mobileView && (
              <motion.button
                className="nav-trigger nav-trigger--mobile"
                onClick={mobileMenu.toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Abrir menu de navegação"
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
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Panel - APENAS PARA NAVEGAÇÃO PRINCIPAL */}
      <AnimatePresence>
        {mobileMenu.isOpen && mobileView && (
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
                navigationConfig={navigationConfig}
                isActive={isActive}
                onClose={closeAllMenus}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile Navigation Component - APENAS NAVEGAÇÃO PRINCIPAL
const MobileNavigation = ({ navigationConfig, isActive, onClose }) => (
  <div className="mobile-nav">
    {/* Mobile Header with Close Button */}
    <div className="mobile-nav-header">
      <div className="mobile-header-content">
        <div className="mobile-brand">
          <div className="brand-icon-container">
            <FaRocket className="brand-icon" />
          </div>
          <div className="brand-content">
            <span className="brand-name">Transita .AI</span>
            <span className="brand-tagline">Pro</span>
          </div>
        </div>
        <motion.button 
          className="close-mobile-menu"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </motion.button>
      </div>
    </div>

    <div className="mobile-nav-content">
      {/* Primary Navigation */}
      <nav className="mobile-nav-section">
        <h3 className="section-title">Navegação Principal</h3>
        {navigationConfig.primary.map((item, index) => {
          const active = isActive(item.path);
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`mobile-nav-item ${active ? 'active' : ''}`}
                onClick={onClose}
                style={{ '--item-color': item.color }}
              >
                <div className="item-icon">
                  <AnimatedIcon icon={item.icon} isActive={active} size={18} />
                </div>
                <div className="item-content">
                  <span className="item-label">{item.label}</span>
                  <span className="item-description">{item.description}</span>
                </div>
                {active && (
                  <motion.div 
                    className="mobile-active-indicator"
                    layoutId="mobileActiveIndicator"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>

    {/* Mobile Footer */}
    <div className="mobile-nav-footer">
      <div className="mobile-app-info">
        <div className="app-version">
          <FaRocket className="version-icon" />
          <span>TrasitaPro v2.1.0</span>
        </div>
      </div>
      <div className="app-copyright">
        <span>© 2024 Trasita .AI Pro. Todos os direitos reservados.</span>
      </div>
    </div>
  </div>
);

export default ProfessionalNavbar;