import React, { useState } from 'react';
import { logout } from '../../../my-app/src/firebase/auth';
import '../styles/header.css';

function Header({ user, onLogout, onToggleSidebar, sidebarOpen }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const notifications = [
    { id: 1, type: 'success', message: 'Consulta finalizada com sucesso', time: '2 min ago', read: false },
    { id: 2, type: 'warning', message: 'Processo #1234 precisa de atenção', time: '1 hora atrás', read: false },
    { id: 3, type: 'info', message: 'Nova atualização disponível', time: '2 horas atrás', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section - Menu Toggle and Brand */}
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={onToggleSidebar}
          >
            <span className={`hamburger ${sidebarOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className="header-brand">
            <div className="logo">
              <span className="logo-icon">⚖️</span>
              <span className="logo-text">Transita.AI</span>
            </div>
            <div className="header-divider"></div>
            <div className="greeting">
              <span className="greeting-text">{getGreeting()}!</span>
              <span className="user-name">{user?.displayName || 'Advogado'}</span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar processos, clientes..." 
              className="search-input"
            />
            <button className="search-shortcut">⌘K</button>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="header-right">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-button">
              <span className="action-icon">⚡</span>
              <span className="action-text">Rápido</span>
            </button>
            <button className="action-button primary">
              <span className="action-icon">➕</span>
              <span className="action-text">Nova Consulta</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="notification-container">
            <button 
              className="icon-button notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <>
                <div 
                  className="menu-backdrop"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notificações</h3>
                    <span className="notification-count">{unreadCount} não lidas</span>
                  </div>
                  
                  <div className="notification-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                      >
                        <div className="notification-icon">
                          {notification.type === 'success' && '✅'}
                          {notification.type === 'warning' && '⚠️'}
                          {notification.type === 'info' && 'ℹ️'}
                        </div>
                        <div className="notification-content">
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="view-all-button">
                    Ver todas as notificações
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu-container">
            <button 
              className="user-avatar"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="avatar-wrapper">
                <span className="avatar-initials">
                  {getInitials(user?.email)}
                </span>
                <div className="user-status"></div>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showMenu && (
              <>
                <div 
                  className="menu-backdrop"
                  onClick={() => setShowMenu(false)}
                />
                <div className="dropdown-menu">
                  <div className="menu-user-info">
                    <div className="menu-avatar">
                      {getInitials(user?.email)}
                    </div>
                    <div className="menu-user-details">
                      <span className="menu-user-name">
                        {user?.displayName || 'Usuário'}
                      </span>
                      <span className="menu-user-email">
                        {user?.email}
                      </span>
                      <div className="user-plan">
                        <span className="plan-badge">PRO</span>
                        <span className="plan-text">Plano Professional</span>
                      </div>
                    </div>
                  </div>

                  <div className="menu-divider"></div>

                  <button className="menu-item">
                    <span className="menu-icon">👤</span>
                    Meu Perfil
                  </button>
                  
                  <button className="menu-item">
                    <span className="menu-icon">⚙️</span>
                    Configurações
                  </button>

                  <button className="menu-item">
                    <span className="menu-icon">🧮</span>
                    Meu Plano
                  </button>

                  <div className="menu-divider"></div>

                  <button className="menu-item">
                    <span className="menu-icon">🛟</span>
                    Ajuda & Suporte
                  </button>

                  <button className="menu-item">
                    <span className="menu-icon">📚</span>
                    Documentação
                  </button>

                  <div className="menu-divider"></div>

                  <button 
                    className="menu-item logout-button"
                    onClick={handleLogout}
                  >
                    <span className="menu-icon">🚪</span>
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
