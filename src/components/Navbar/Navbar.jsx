import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiTruck,
  FiMapPin,
  FiUser,
  FiLogIn,
  FiSettings,
  FiBarChart2,
  FiBell,
  FiMenu,
  FiX,
  FiShield,
  FiHelpCircle,
  FiLogOut,
  FiClock,
  FiCreditCard,
  FiNavigation,
  FiRadio,
  FiTrendingUp,
  FiAlertTriangle,
  FiMap,
  FiLayers
} from 'react-icons/fi';
import {
  HiOutlineCog,
  HiOutlineUserCircle
} from 'react-icons/hi';
import './Navbar.css';

import Logotipofretevelocidadelaranja from '../../assets/images/Logotipofretevelocidadelaranja.png';

// Paleta de cores definida
const COLORS = {
  black: {
    pure: '#000000',
    soft: '#0A0A0A',
    section: '#111111'
  },
  blue: {
    primary: '#0053A6',
    dark: '#003F7F',
    vibrant: '#0A6CFF'
  },
  orange: {
    primary: '#FF6A00',
    soft: '#FF7F32',
    light: '#FFC29F'
  }
};

const GRADIENTS = {
  orangeToBlack: 'linear-gradient(135deg, #FF6A00 0%, #000000 100%)',
  blueToBlack: 'linear-gradient(135deg, #0053A6 0%, #000000 100%)',
  blueToOrange: 'linear-gradient(135deg, #0053A6 0%, #FF6A00 100%)',
  blackToBlue: 'linear-gradient(135deg, #000000 0%, #0053A6 100%)',
  orangeToBlue: 'linear-gradient(135deg, #FF6A00 0%, #0053A6 100%)',
  premium: 'linear-gradient(135deg, #FF6A00 0%, #0053A6 50%, #003F7F 100%)'
};

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

const AnimatedIcon = ({ icon: Icon, isActive, size = 20, animationType = "subtle", color }) => (
  <motion.div
    className={`nav-icon-wrapper ${isActive ? 'active' : ''}`}
    data-animation={animationType}
    whileHover={{
      scale: 1.15,
      rotate: animationType === 'spin' ? 180 : animationType === 'shake' ? [0, -3, 3, -3, 3, 0] : 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20,
        duration: animationType === 'spin' ? 0.3 : 0.2
      }
    }}
    whileTap={{
      scale: 0.9,
      transition: { duration: 0.1 }
    }}
    animate={{
      color: isActive ? 'var(--white)' : color || 'var(--gray-medium)',
      y: animationType === 'float' ? [0, -2, 0] : 0
    }}
    transition={{
      duration: animationType === 'float' ? 2.5 : 0.15,
      repeat: animationType === 'float' ? Infinity : 0,
      ease: "easeInOut"
    }}
  >
    <Icon size={size} />
  </motion.div>
);

const NotificationPanel = ({ isOpen, onClose, notifications }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="notification-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="notification-panel"
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 35
          }}
          style={{ originX: 0.95, originY: 0 }}
        >
          <div className="notification-header">
            <div className="notification-title">
              <div className="title-icon-wrapper">
                <FiBell className="title-icon" />
              </div>
              <div>
                <h3>Notificações</h3>
                <span className="notification-subtitle">Alertas do sistema</span>
              </div>
              <span className="notification-count">{notifications.length}</span>
            </div>
            <motion.button
              className="close-notifications"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </motion.button>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className="notification-item"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div
                    className="notification-icon"
                    style={{ background: notification.color }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <notification.icon />
                    </motion.div>
                  </div>
                  <div className="notification-content">
                    <div className="notification-header-content">
                      <p className="notification-title-text">{notification.title}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    {notification.action && (
                      <motion.button
                        className="notification-action"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {notification.action}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="no-notifications"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="no-notifications-icon-wrapper">
                  <FiBell className="no-notifications-icon" />
                </div>
                <p>Nenhuma notificação</p>
                <span>Novas notificações aparecerão aqui</span>
              </motion.div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <motion.button
                className="mark-all-read"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Marcar todas como lidas
              </motion.button>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const UserMenu = ({ isOpen, onClose, user, onLogout, isActive }) => {
  const userMenuItems = [
    {
      icon: FiUser,
      label: 'Meu Perfil',
      path: '/profile',
      color: COLORS.blue.vibrant,
      description: 'Gerencie suas informações',
      badge: 'Novo'
    },
    {
      icon: FiClock,
      label: 'Histórico',
      path: '/history',
      color: COLORS.blue.primary,
      description: 'Veja seu histórico'
    },
    {
      icon: FiCreditCard,
      label: 'Assinatura',
      path: '/subscription',
      color: COLORS.orange.primary,
      description: 'Gerencie sua assinatura',
      badge: 'Premium'
    },
    {
      icon: FiSettings,
      label: 'Configurações',
      path: '/settings',
      color: COLORS.blue.dark,
      description: 'Configurações da conta'
    },
    {
      icon: FiShield,
      label: 'Privacidade',
      path: '/privacy',
      color: COLORS.blue.vibrant,
      description: 'Configurações de privacidade'
    },
    {
      icon: FiHelpCircle,
      label: 'Ajuda & Suporte',
      path: '/support',
      color: COLORS.orange.soft,
      description: 'Central de ajuda'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="user-menu-sidebar"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40
          }}
        >
          <div className="user-menu-header">
            <motion.div
              className="user-avatar-large"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 600 }}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </motion.div>
            <div className="user-info">
              <h4>{user?.displayName || user?.email}</h4>
              <span className="user-premium-badge">
                <FiCreditCard />
                Usuário Premium
              </span>
            </div>
            <motion.button
              className="close-user-menu"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </motion.button>
          </div>

          <div className="user-menu-content">
            <nav className="user-menu-nav">
              {userMenuItems.map((item, index) => {
                const active = isActive(item.path);
                return (
                  <motion.div
                    key={item.path}
                    className="user-menu-item-wrapper"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`user-menu-item ${active ? 'active' : ''}`}
                      onClick={onClose}
                      style={{ '--item-color': item.color }}
                    >
                      <div className="user-menu-icon">
                        <AnimatedIcon
                          icon={item.icon}
                          isActive={active}
                          size={18}
                          animationType="subtle"
                          color={item.color}
                        />
                      </div>
                      <div className="user-menu-text">
                        <div className="user-menu-label-wrapper">
                          <span className="user-menu-label">{item.label}</span>
                          {item.badge && (
                            <span className="user-menu-badge">{item.badge}</span>
                          )}
                        </div>
                        <span className="user-menu-description">{item.description}</span>
                      </div>
                      {active && (
                        <motion.div
                          className="user-menu-indicator"
                          layoutId="userMenuActive"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="user-menu-footer">
              <motion.div
                className="user-stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
              </motion.div>

              <motion.button
                className="logout-button"
                onClick={onLogout}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiLogOut className="logout-icon" />
                <span>Sair da Conta</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Sidebar = ({ isOpen, onClose, user, onLogout, isActive }) => {
  const navigationConfig = [
    {
      path: '/',
      icon: FiHome,
      label: 'Início',
      description: 'Página inicial do sistema',
      color: COLORS.blue.vibrant,
      animation: 'subtle'
    },
    ...(user?.email === 'transitaaipro@gmail.com' ? [{
      path: '/admin',
      icon: FiShield,
      label: 'Admin',
      description: 'Painel de administração',
      color: COLORS.orange.primary,
      animation: 'pulse',
      badge: 'Admin'
    }] : []),
    {
      path: '/dashboard',
      icon: FiBarChart2,
      label: 'Dashboard',
      description: 'Métricas e analytics em tempo real',
      color: COLORS.blue.primary,
      animation: 'float'
    },
    {
      path: '/multas',
      icon: FiAlertTriangle,
      label: 'Multas',
      description: 'Gestão inteligente de multas',
      color: COLORS.orange.primary,
      animation: 'shake'
    },
    {
      path: '/monitoramento',
      icon: FiNavigation,
      label: 'Monitoramento',
      description: 'Rastreamento em tempo real',
      color: COLORS.blue.dark,
      animation: 'spin'
    },
    {
      path: '/rotas',
      icon: FiMap,
      label: 'Rotas',
      description: 'Planejamento de rotas',
      color: COLORS.blue.vibrant,
      animation: 'subtle'
    },
    {
      path: '/frota',
      icon: FiTruck,
      label: 'Frota',
      description: 'Gerenciamento de veículos',
      color: COLORS.orange.soft,
      animation: 'shake'
    },
    {
      path: '/relatorios',
      icon: FiLayers,
      label: 'Relatórios',
      description: 'Relatórios detalhados',
      color: COLORS.blue.primary,
      animation: 'float'
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 40
      }
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 40
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="sidebar-header">
              <motion.div
                className="sidebar-brand"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <img src={Logotipofretevelocidadelaranja} alt="Transita AI Pro" className="sidebar-logo" />
                <div className="brand-text">
                  <h3>Transita AI</h3>
                  <span>Professional</span>
                </div>
              </motion.div>
              <motion.button
                className="sidebar-close"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX />
              </motion.button>
            </div>

            <nav className="sidebar-nav">
              {navigationConfig.map((item, index) => {
                const active = isActive(item.path);
                return (
                  <motion.div
                    key={item.path}
                    className="sidebar-nav-item"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`sidebar-link ${active ? 'active' : ''}`}
                      onClick={onClose}
                      style={{ '--item-color': item.color }}
                    >
                      <div className="sidebar-icon">
                        <AnimatedIcon
                          icon={item.icon}
                          isActive={active}
                          size={20}
                          animationType={item.animation}
                          color={item.color}
                        />
                      </div>
                      <div className="sidebar-link-content">
                        <div className="sidebar-link-header">
                          <span className="sidebar-link-label">{item.label}</span>
                          {item.badge && (
                            <span className="sidebar-link-badge">{item.badge}</span>
                          )}
                        </div>
                        <span className="sidebar-link-description">{item.description}</span>
                      </div>
                      {active && (
                        <motion.div
                          className="sidebar-active-indicator"
                          layoutId="sidebarActive"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 700 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              {user ? (
                <motion.div
                  className="sidebar-user"
                  whileHover={{ scale: 1.02, y: -1 }}
                  transition={{ type: "spring", stiffness: 600 }}
                >
                  <div className="sidebar-user-avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User Avatar" />
                    ) : (
                      <HiOutlineUserCircle />
                    )}
                  </div>
                  <div className="sidebar-user-info">
                    <span className="user-name">{user.displayName || user.email}</span>
                    <span className="user-role">
                      <FiCreditCard />
                      Usuário Premium
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/login" className="sidebar-login-btn" onClick={onClose}>
                    <FiLogIn />
                    <span>Fazer Login</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProfessionalNavbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      icon: FiTruck,
      title: 'Nova Rota Disponível',
      message: 'Otimização de rota concluída para o veículo #1234',
      time: '5 min atrás',
      color: GRADIENTS.blueToOrange,
      action: 'Ver Rota'
    },
    {
      id: 2,
      icon: FiTrendingUp,
      title: 'Relatório Mensal',
      message: 'Seu relatório de desempenho está disponível',
      time: '1 hora atrás',
      color: GRADIENTS.orangeToBlue
    },
    {
      id: 3,
      icon: FiAlertTriangle,
      title: 'Alerta de Trânsito',
      message: 'Congestionamento detectado na sua rota atual',
      time: '2 horas atrás',
      color: GRADIENTS.orangeToBlack,
      action: 'Alternar Rota'
    }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(prev => !prev);
    setSidebarOpen(false);
    setNotificationsOpen(false);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsOpen(prev => !prev);
    setSidebarOpen(false);
    setUserMenuOpen(false);
  }, []);

  const closeAllMenus = useCallback(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    closeAllMenus();
    onLogout();
  }, [onLogout, closeAllMenus]);

  const navbarVariants = {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 40,
        mass: 1
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`professional-navbar ${isScrolled ? 'scrolled' : ''}`}
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="nav-container">
          {/* Left Section - Menu & Logo */}
          <div className="nav-left">
            <motion.button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Abrir menu lateral"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMenu />
            </motion.button>

            <motion.div
              className="nav-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <img src={Logotipofretevelocidadelaranja} alt="Transita AI" className="logo-image" />
              <span className="logo-text">Transita AI</span>
            </motion.div>
          </div>

          {/* Right Section - Actions */}
          <div className="nav-right">
            <motion.button
              className={`notification-toggle ${notificationsOpen ? 'active' : ''}`}
              onClick={toggleNotifications}
              aria-label="Notificações"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiBell />
              {notifications.length > 0 && (
                <motion.span
                  className="notification-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 700 }}
                >
                  {notifications.length}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu Trigger */}
            {user && (
              <motion.button
                className="user-sidebar-toggle"
                onClick={toggleUserMenu}
                aria-label="Menu do usuário"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="user-avatar" />
                ) : (
                  <HiOutlineUserCircle />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeAllMenus}
        user={user}
        onLogout={handleLogout}
        isActive={isActive}
      />

      {/* User Menu Sidebar */}
      <UserMenu
        isOpen={userMenuOpen}
        onClose={closeAllMenus}
        user={user}
        onLogout={handleLogout}
        isActive={isActive}
      />

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={closeAllMenus}
        notifications={notifications}
      />
    </>
  );
};

export default ProfessionalNavbar;