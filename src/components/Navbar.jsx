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
  FaDatabase,
  FaNetworkWired,
  FaCloud
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  return { isOpen, toggle, close, open, ref };
};

// Animated Icon Component
const AnimatedIcon = ({ icon: Icon, isActive, size = 20 }) => (
  <motion.div
    className={`nav-icon-wrapper ${isActive ? 'active' : ''}`}
    whileHover={{ 
      scale: 1.2,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={size} />
    {isActive && (
      <motion.div
        className="icon-pulse"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )}
  </motion.div>
);

// Professional Navbar Component
const ProfessionalNavbar = ({ user, onLogout, sidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
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
        path: '/fretes', 
        icon: RiTruckFill, 
        label: 'Fretes',
        description: 'Gestão inteligente de transportes',
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
    icon: {
      hover: {
        scale: 1.2,
        rotate: 360,
        transition: { duration: 0.4 }
      }
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
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
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
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  <FaRocket className="brand-icon" />
                  <motion.div 
                    className="brand-glow"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="brand-content">
                  <motion.span 
                    className="brand-name"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Transita .AI
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
              {navigationConfig.primary.map((item, index) => {
                const active = isActive(item.path);
                return (
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
                      className={`nav-link ${active ? 'active' : ''}`}
                      onClick={closeAllMenus}
                      style={{ '--item-color': item.color }}
                    >
                      <AnimatedIcon icon={item.icon} isActive={active} />
                      <span className="nav-label">{item.label}</span>
                      
                      {/* Active Indicator */}
                      {active && (
                        <motion.div 
                          className="nav-indicator"
                          layoutId="navIndicator"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Hover Effect */}
                      <motion.div 
                        className="nav-hover-effect"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />

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
                );
              })}
            </nav>
          </div>

          {/* User Menu & Actions */}
          <div className="nav-section nav-section--secondary">
            {/* User Menu */}
            {user ? (
              <div className="nav-dropdown" ref={userMenu.ref}>
                <motion.button 
                  className={`user-trigger ${userMenu.isOpen ? 'active' : ''}`}
                  onClick={userMenu.toggle}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="user-profile-mini">
                    <motion.div 
                      className="user-avatar"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaUserCircle className="avatar-icon" />
                      <motion.div 
                        className="user-status"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <div className="user-info-mini">
                      <span className="user-name">{user.displayName || user.email}</span>
                      <span className="user-role">Usuário</span>
                    </div>
                    <motion.div
                      animate={{ rotate: userMenu.isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <FaChevronDown className="trigger-chevron" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {userMenu.isOpen && (
                    <motion.div 
                      className="dropdown-panel user-panel"
                      variants={animations.dropdown}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="dropdown-header">
                        <div className="user-header-content">
                          <motion.div 
                            className="header-avatar"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <FaUserCircle />
                          </motion.div>
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
                                    {isActive(item.path) && (
                                      <motion.div 
                                        className="item-active-indicator"
                                        layoutId="activeIndicator"
                                      />
                                    )}
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

                      <div className="dropdown-footer">
                        <motion.button 
                          className="logout-button"
                          onClick={handleLogout}
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaSignOutAlt className="button-icon" />
                          <span>Sair do Sistema</span>
                          <motion.div 
                            className="logout-glow"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
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
                  <span>Acessar Sistema</span>
                  <motion.div 
                    className="auth-glow"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
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
    </>
  );
};

// Enhanced Mobile Navigation Component
const MobileNavigation = ({ user, onLogout, navigationConfig, isActive, onClose }) => (
  <div className="mobile-nav">
    {/* User Header */}
    <div className="mobile-nav-header">
      {user ? (
        <div className="mobile-user-header">
          <motion.div 
            className="user-avatar-large"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <FaUserCircle className="avatar-icon" />
            <div className="user-status online" />
          </motion.div>
          <div className="user-details">
            <span className="user-name">{user.displayName || user.email}</span>
            <span className="user-role">Administrador do Sistema</span>
          </div>
          <motion.button 
            className="logout-button mobile"
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt />
          </motion.button>
        </div>
      ) : (
        <div className="mobile-auth-section">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/login" className="mobile-auth-button primary" onClick={onClose}>
              <FaSignInAlt />
              <span>Acessar Sistema</span>
            </Link>
          </motion.div>
        </div>
      )}
    </div>

    <div className="mobile-nav-content">
      {/* Primary Navigation */}
      <nav className="mobile-nav-section">
        <h3 className="section-title">Navegação Principal</h3>
        {navigationConfig.primary.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
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
          );
        })}
      </nav>

      {/* User Menu Sections */}
      {navigationConfig.userMenu.map((section, index) => (
        <nav key={index} className="mobile-nav-section">
          <h3 className="section-title">
            <div 
              className="title-icon-container"
              style={{ '--section-color': section.color }}
            >
              <section.icon className="title-icon" />
            </div>
            {section.title}
          </h3>
          {section.items.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${active ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="item-icon">
                  <item.icon />
                  {active && <div className="mobile-item-active-dot" />}
                </div>
                <div className="item-content">
                  <span className="item-label">{item.label}</span>
                  <span className="item-description">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      ))}
    </div>

    {/* Mobile Footer */}
    <div className="mobile-nav-footer">
      <div className="mobile-app-info">
        <motion.div 
          className="app-version"
          whileHover={{ scale: 1.05 }}
        >
          <FaRocket className="version-icon" />
          <span>TrasitaPro v2.1.0</span>
        </motion.div>
        <div className="app-stats">
          <motion.span 
            className="stat"
            whileHover={{ scale: 1.1 }}
          >
            <FaUserCircle />
            Online
          </motion.span>
        </div>
      </div>
      <motion.div 
        className="app-copyright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>© 205 Trasita .AI Pro. Todos os direitos reservados.</span>
      </motion.div>
    </div>
  </div>
);

export default ProfessionalNavbar;