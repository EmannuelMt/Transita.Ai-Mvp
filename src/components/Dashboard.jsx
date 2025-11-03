import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaTruck, FaTools, FaBox, FaGasPump, FaRoute, FaUser, FaChartLine,
  FaMapMarkerAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaPlus,
  FaDownload, FaSync, FaBell, FaPlay, FaPause, FaExpand, FaCompress,
  FaRobot, FaSignOutAlt, FaBars, FaChevronDown, FaChevronRight,
  FaFileAlt, FaCalculator, FaOilCan, FaMap, FaUsers, FaCar,
  FaRoute as FaRouteIcon, FaBoxOpen
} from 'react-icons/fa';
import { 
  RiDashboardFill, RiSettings4Fill 
} from 'react-icons/ri';
import '../styles/Dashboard.css';

// Custom hooks
const useRealtimeData = (initialData, updateInterval = 3000) => {
  const [data, setData] = useState(initialData);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        vehiclesInOperation: Math.max(35, Math.min(50, prev.vehiclesInOperation + (Math.random() > 0.9 ? 1 : Math.random() > 0.1 ? -1 : 0))),
        activeDeliveries: Math.max(120, Math.min(180, prev.activeDeliveries + (Math.random() > 0.6 ? 2 : -1))),
        fuelEfficiency: Math.max(6.5, Math.min(8.5, prev.fuelEfficiency + (Math.random() - 0.5) * 0.05)),
        totalDistance: prev.totalDistance + Math.floor(Math.random() * 50),
        driverPerformance: Math.max(85, Math.min(98, prev.driverPerformance + (Math.random() - 0.5) * 0.3)),
        onTimeDelivery: Math.max(88, Math.min(97, prev.onTimeDelivery + (Math.random() - 0.5) * 0.2)),
        co2Reduction: Math.max(10, Math.min(15, prev.co2Reduction + (Math.random() - 0.5) * 0.1)),
        routeEfficiency: Math.max(80, Math.min(95, prev.routeEfficiency + (Math.random() - 0.5) * 0.4))
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, isPaused]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const reset = useCallback(() => setData(initialData), [initialData]);

  return { data, isPaused, pause, resume, reset };
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

// Componente de Métrica
const MetricCard = React.memo(({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend, 
  change, 
  subtitle, 
  onClick,
  loading = false,
  size = 'medium',
  showSparkline = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sparklineData = useMemo(() => 
    Array.from({ length: 8 }, () => Math.random() * 100),
    []
  );

  const handleExpand = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <motion.div
      className={`lt-metric-card lt-metric-card--${color} lt-metric-card--${size} ${loading ? 'lt-metric-card--loading' : ''}`}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      layout
    >
      <div className="lt-metric-card__glow"></div>
      
      <div className="lt-metric-card__header">
        <motion.div 
          className="lt-metric-card__icon-container"
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          <div className="lt-metric-card__icon">{icon}</div>
          {trend && (
            <motion.div 
              className={`lt-metric-card__trend lt-metric-card__trend--${trend}`}
              animate={trend === 'up' ? { y: [0, -2, 0] } : { y: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {trend === 'up' ? '↗' : '↘'}
            </motion.div>
          )}
        </motion.div>
        
        <div className="lt-metric-card__actions">
          <motion.button
            className="lt-metric-card__action-btn"
            onClick={handleExpand}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </motion.button>
        </div>
      </div>

      <div className="lt-metric-card__content">
        <motion.h3 
          className="lt-metric-card__value"
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {loading ? '...' : value}
        </motion.h3>
        <p className="lt-metric-card__title">{title}</p>
        {subtitle && (
          <motion.span 
            className="lt-metric-card__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.span>
        )}
        
        {change && (
          <motion.div 
            className="lt-metric-card__change"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={`lt-metric-card__change-indicator lt-metric-card__change-indicator--${trend}`}>
              {change}
            </span>
          </motion.div>
        )}
      </div>

      {showSparkline && (
        <motion.div 
          className="lt-metric-card__sparkline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="lt-metric-card__sparkline-chart">
            {sparklineData.map((point, index) => (
              <motion.div
                key={index}
                className="lt-metric-card__sparkline-bar"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: point / 100 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="lt-metric-card__expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="lt-metric-card__details">
              <div className="lt-metric-card__detail-item">
                <span className="lt-metric-card__detail-label">Meta Mensal</span>
                <span className="lt-metric-card__detail-value">+8%</span>
              </div>
              <div className="lt-metric-card__detail-item">
                <span className="lt-metric-card__detail-label">Performance</span>
                <span className="lt-metric-card__detail-value">92%</span>
              </div>
              <div className="lt-metric-card__detail-item">
                <span className="lt-metric-card__detail-label">Tendência</span>
                <span className="lt-metric-card__detail-value lt-metric-card__detail-value--positive">
                  Positiva
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Componente de Insights de IA
const AIInsightsPanel = React.memo(() => {
  const [expandedInsight, setExpandedInsight] = useState(null);

  const insights = useMemo(() => [
    {
      id: 1,
      type: 'optimization',
      title: 'Otimização de Rotas',
      description: 'Redução de 12% no tempo de entrega possível',
      confidence: 94,
      impact: 'Alto',
      priority: 'high'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Manutenção Preditiva',
      description: '3 veículos necessitam de verificação nos freios',
      confidence: 87,
      impact: 'Médio',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'efficiency',
      title: 'Economia de Combustível',
      description: 'Rotas noturnas mostram melhor eficiência',
      confidence: 82,
      impact: 'Médio',
      priority: 'low'
    }
  ], []);

  const handleInsightClick = useCallback((id) => {
    setExpandedInsight(prev => prev === id ? null : id);
  }, []);

  return (
    <motion.div 
      className="lt-ai-insights-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="lt-ai-insights-panel__header">
        <div className="lt-ai-insights-panel__header-content">
          <FaRobot className="lt-ai-insights-panel__icon" />
          <h3 className="lt-ai-insights-panel__title">Insights de IA</h3>
          <span className="lt-ai-insights-panel__badge">Beta</span>
        </div>
      </div>

      <div className="lt-ai-insights-panel__list">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className={`lt-ai-insights-panel__item lt-ai-insights-panel__item--${insight.priority}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleInsightClick(insight.id)}
          >
            <div className="lt-ai-insights-panel__item-icon">
              {insight.type === 'optimization' && <FaRoute />}
              {insight.type === 'maintenance' && <FaTools />}
              {insight.type === 'efficiency' && <FaChartLine />}
            </div>
            
            <div className="lt-ai-insights-panel__item-content">
              <div className="lt-ai-insights-panel__item-main">
                <span className="lt-ai-insights-panel__item-title">{insight.title}</span>
                <span className="lt-ai-insights-panel__item-confidence">
                  {insight.confidence}% conf.
                </span>
              </div>
              <p className="lt-ai-insights-panel__item-description">{insight.description}</p>
            </div>

            <div className="lt-ai-insights-panel__item-priority">
              <div className={`lt-ai-insights-panel__priority-dot lt-ai-insights-panel__priority-dot--${insight.priority}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

// Componente de Analytics Preditivo
const PredictiveAnalytics = React.memo(() => {
  const [selectedMetric, setSelectedMetric] = useState('performance');

  const performanceData = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => ({
      day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
      predicted: 80 + Math.random() * 15,
      actual: 75 + Math.random() * 20
    })),
    []
  );

  const handleMetricChange = useCallback((e) => {
    setSelectedMetric(e.target.value);
  }, []);

  return (
    <motion.div 
      className="lt-predictive-analytics"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="lt-predictive-analytics__header">
        <h3 className="lt-predictive-analytics__title">
          <FaChartLine className="lt-predictive-analytics__header-icon" />
          Analytics Preditivo
        </h3>
        <select 
          value={selectedMetric}
          onChange={handleMetricChange}
          className="lt-predictive-analytics__select"
        >
          <option value="performance">Performance</option>
          <option value="efficiency">Eficiência</option>
          <option value="delivery">Entregas</option>
        </select>
      </div>

      <div className="lt-predictive-analytics__chart">
        <div className="lt-predictive-analytics__chart-container">
          {performanceData.map((data, index) => (
            <div key={index} className="lt-predictive-analytics__chart-item">
              <div className="lt-predictive-analytics__chart-bars">
                <motion.div 
                  className="lt-predictive-analytics__predicted-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.predicted}%` }}
                  transition={{ delay: index * 0.1 }}
                />
                <motion.div 
                  className="lt-predictive-analytics__actual-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.actual}%` }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
              </div>
              <span className="lt-predictive-analytics__chart-label">{data.day}</span>
            </div>
          ))}
        </div>
        
        <div className="lt-predictive-analytics__legend">
          <div className="lt-predictive-analytics__legend-item">
            <div className="lt-predictive-analytics__legend-color lt-predictive-analytics__legend-color--predicted"></div>
            <span>Previsto</span>
          </div>
          <div className="lt-predictive-analytics__legend-item">
            <div className="lt-predictive-analytics__legend-color lt-predictive-analytics__legend-color--actual"></div>
            <span>Real</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Componente Sidebar
const Sidebar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);

  const navigationConfig = useMemo(() => [
    {
      title: 'Operações Logísticas',
      icon: FaTruck,
      color: '#6366f1',
      items: [
        { 
          path: '/motoristas', 
          icon: FaUsers, 
          label: 'Motoristas',
          description: 'Gestão de colaboradores',
          features: ['Cadastro', 'Escalas', 'Desempenho']
        },
        { 
          path: '/veiculos', 
          icon: FaCar, 
          label: 'Frota Inteligente',
          description: 'Controle completo de veículos',
          features: ['Manutenção', 'Custos', 'Documentos']
        },
        { 
          path: '/rotas', 
          icon: FaRouteIcon, 
          label: 'Rotas Otimizadas',
          description: 'Planejamento com IA',
          features: ['Otimização', 'Tráfego', 'Custos']
        },
        { 
          path: '/cargas', 
          icon: FaBoxOpen, 
          label: 'Cargas',
          description: 'Gestão de inventário',
          features: ['Tracking', 'Documentos', 'Status']
        }
      ]
    },
    {
      title: 'Gestão & Analytics',
      icon: FaChartLine,
      color: '#10b981',
      items: [
        { 
          path: '/relatorios', 
          icon: FaFileAlt, 
          label: 'Relatórios Avançados',
          description: 'Analytics e insights preditivos',
          features: ['Dashboard', 'Export', 'KPI']
        },
        { 
          path: '/financeiro', 
          icon: FaCalculator, 
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
          icon: FaOilCan, 
          label: 'Combustível',
          description: 'Controle inteligente de abastecimento',
          features: ['Abastecimento', 'Medições', 'Economia']
        }
      ]
    },
    {
      title: 'Monitoramento',
      icon: FaMapMarkerAlt,
      color: '#3b82f6',
      items: [
        { 
          path: '/rastreamento', 
          icon: FaMap, 
          label: 'Rastreamento',
          description: 'Monitoramento em tempo real',
          features: ['GPS', 'Alertas', 'Histórico']
        },
        { 
          path: '/performance', 
          icon: FaChartLine, 
          label: 'Performance',
          description: 'Métricas de desempenho',
          features: ['KPI', 'Relatórios', 'Análise']
        }
      ]
    }
  ], []);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      document.querySelector('.lt-sidebar')?.classList.remove('lt-sidebar--mobile-open');
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const toggleSection = useCallback((index) => {
    setExpandedSection(prev => prev === index ? null : index);
  }, []);

  return (
    <motion.section 
      className="lt-sidebar"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="lt-sidebar__brand"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigation('/')}
      >
        <motion.div 
          className="lt-sidebar__brand-icon-container"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <FaTruck className="lt-sidebar__brand-icon" />
        </motion.div>
        <div className="lt-sidebar__brand-content">
          <span className="lt-sidebar__brand-name">LogiTech</span>
          <span className="lt-sidebar__brand-tagline">Pro</span>
        </div>
      </motion.div>

      <ul className="lt-sidebar__menu lt-sidebar__menu--top">
        <li className={location.pathname === '/' ? 'lt-sidebar__menu-item--active' : ''}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
            className="lt-sidebar__menu-link"
          >
            <RiDashboardFill className="lt-sidebar__menu-icon" />
            <span className="lt-sidebar__menu-text">Dashboard</span>
          </a>
        </li>
      </ul>

      <div className="lt-sidebar__navigation">
        {navigationConfig.map((section, sectionIndex) => (
          <div key={sectionIndex} className="lt-sidebar__section">
            <motion.div 
              className={`lt-sidebar__section-header ${expandedSection === sectionIndex ? 'lt-sidebar__section-header--expanded' : ''}`}
              onClick={() => toggleSection(sectionIndex)}
              whileHover={{ x: 4 }}
            >
              <div 
                className="lt-sidebar__section-icon-container"
                style={{ '--section-color': section.color }}
              >
                <section.icon className="lt-sidebar__section-icon" />
              </div>
              <span className="lt-sidebar__section-title">{section.title}</span>
              <motion.div 
                className="lt-sidebar__section-chevron"
                animate={{ rotate: expandedSection === sectionIndex ? 180 : 0 }}
              >
                <FaChevronDown />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {expandedSection === sectionIndex && (
                <motion.div 
                  className="lt-sidebar__section-items"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      className={`lt-sidebar__nav-item ${location.pathname === item.path ? 'lt-sidebar__nav-item--active' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.1 }}
                      whileHover={{ x: 8 }}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="lt-sidebar__nav-item-icon">
                        <item.icon />
                      </div>
                      <div className="lt-sidebar__nav-item-content">
                        <span className="lt-sidebar__nav-item-label">{item.label}</span>
                        <span className="lt-sidebar__nav-item-description">{item.description}</span>
                      </div>
                      <div className="lt-sidebar__nav-item-features">
                        {item.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="lt-sidebar__nav-item-feature">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <motion.div 
                        className="lt-sidebar__nav-arrow"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1, x: 4 }}
                      >
                        <FaChevronRight />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <ul className="lt-sidebar__menu lt-sidebar__menu--bottom">
        <li className={location.pathname === '/configuracoes' ? 'lt-sidebar__menu-item--active' : ''}>
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/configuracoes');
            }}
            className="lt-sidebar__menu-link"
          >
            <RiSettings4Fill className="lt-sidebar__menu-icon" />
            <span className="lt-sidebar__menu-text">Configurações</span>
          </a>
        </li>
        <li>
          <a href="#" className="lt-sidebar__menu-link lt-sidebar__menu-link--logout" onClick={handleLogout}>
            <FaSignOutAlt className="lt-sidebar__menu-icon" />
            <span className="lt-sidebar__menu-text">Sair</span>
          </a>
        </li>
      </ul>

      <motion.div 
        className="lt-sidebar__footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="lt-sidebar__user-info">
          <div className="lt-sidebar__user-avatar">
            <FaUser />
          </div>
          <div className="lt-sidebar__user-details">
            <span className="lt-sidebar__user-name">Operador</span>
            <span className="lt-sidebar__user-role">Gerente</span>
          </div>
        </div>
        <div className="lt-sidebar__app-version">
          <span>v2.1.0</span>
        </div>
      </motion.div>

      <motion.button 
        className="lt-sidebar__toggle"
        onClick={() => document.querySelector('.lt-sidebar')?.classList.toggle('lt-sidebar--mobile-open')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaBars />
      </motion.button>
    </motion.section>
  );
});

// Componente Principal do Dashboard
function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useLocalStorage('dashboard-view', 'overview');
  const [autoRefresh, setAutoRefresh] = useLocalStorage('dashboard-refresh', true);

  const { data: dashboardData, isPaused, pause, resume } = useRealtimeData({
    vehiclesInOperation: 42,
    maintenanceAlerts: 8,
    activeDeliveries: 156,
    fuelEfficiency: 7.8,
    totalDistance: 12500,
    driverPerformance: 92,
    onTimeDelivery: 94,
    co2Reduction: 12.5,
    routeEfficiency: 87,
    customerSatisfaction: 92
  });

  const metrics = useMemo(() => [
    {
      title: 'Veículos em Operação',
      value: dashboardData.vehiclesInOperation,
      icon: <FaTruck />,
      color: 'primary',
      trend: 'up',
      change: '+12%',
      subtitle: '42/50 veículos',
      size: 'medium',
      onClick: () => navigate('/veiculos')
    },
    {
      title: 'Eficiência de Combustível',
      value: `${dashboardData.fuelEfficiency.toFixed(1)} km/L`,
      icon: <FaGasPump />,
      color: 'success',
      trend: 'up',
      change: '+0.4 km/L',
      subtitle: 'Meta: 8.0 km/L',
      size: 'medium',
      onClick: () => navigate('/combustivel')
    },
    {
      title: 'Performance',
      value: `${dashboardData.driverPerformance}%`,
      icon: <FaUser />,
      color: 'warning',
      trend: 'up',
      change: '+5%',
      subtitle: 'Motoristas ativos',
      size: 'large',
      onClick: () => navigate('/motoristas')
    },
    {
      title: 'Entregas no Prazo',
      value: `${dashboardData.onTimeDelivery}%`,
      icon: <FaCheckCircle />,
      color: 'success',
      trend: 'up',
      change: '+2%',
      subtitle: 'Meta: 95%',
      size: 'medium',
      onClick: () => navigate('/relatorios')
    },
    {
      title: 'Alertas de Manutenção',
      value: dashboardData.maintenanceAlerts,
      icon: <FaTools />,
      color: 'error',
      trend: 'down',
      change: '-2',
      subtitle: '8 pendentes',
      size: 'medium',
      onClick: () => navigate('/manutencao')
    },
    {
      title: 'Redução de CO₂',
      value: `${dashboardData.co2Reduction}%`,
      icon: <FaChartLine />,
      color: 'info',
      trend: 'up',
      change: '+1.2%',
      subtitle: 'vs mês anterior',
      size: 'medium',
      onClick: () => navigate('/performance')
    }
  ], [dashboardData, navigate]);

  const quickActions = useMemo(() => [
    {
      icon: <FaPlus />,
      title: 'Nova Rota',
      description: 'Planejar rota otimizada',
      color: 'primary',
      action: () => navigate('/rotas')
    },
    {
      icon: <FaTruck />,
      title: 'Alocar Veículo',
      description: 'Atribuir veículo à entrega',
      color: 'info',
      action: () => navigate('/veiculos')
    },
    {
      icon: <FaTools />,
      title: 'Manutenção',
      description: 'Agendar manutenção',
      color: 'warning',
      action: () => navigate('/manutencao')
    },
    {
      icon: <FaChartLine />,
      title: 'Relatórios',
      description: 'Gerar relatórios',
      color: 'success',
      action: () => navigate('/relatorios')
    }
  ], [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshToggle = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, [setViewMode]);

  const handleAutoRefreshToggle = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, [setAutoRefresh]);

  return (
    <div className="lt-dashboard">
      <Sidebar />

      <div className="lt-dashboard__main">
        <main className="lt-dashboard__content">
          <div className="lt-dashboard__header">
            <div className="lt-dashboard__header-left">
              <h1 className="lt-dashboard__title">Dashboard Logística</h1>
              <nav className="lt-dashboard__breadcrumb">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('/'); }}
                  className="lt-dashboard__breadcrumb-link"
                >
                  Dashboard
                </a>
                <FaChevronRight className="lt-dashboard__breadcrumb-separator" />
                <a href="#" className="lt-dashboard__breadcrumb-link lt-dashboard__breadcrumb-link--active">
                  Início
                </a>
              </nav>
            </div>
            <motion.button 
              className="lt-dashboard__download-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log('Gerando PDF...')}
            >
              <FaDownload />
              <span className="lt-dashboard__download-text">Gerar PDF</span>
            </motion.button>
          </div>

          <div className="lt-dashboard__modern">
            <motion.div 
              className="lt-dashboard__modern-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="lt-dashboard__modern-header-main">
                <div className="lt-dashboard__modern-header-title">
                  <h1>Dashboard Logística</h1>
                  <p>Monitoramento em tempo real da operação</p>
                </div>

                <div className="lt-dashboard__modern-header-controls">
                  <div className="lt-dashboard__view-controls">
                    {['overview', 'analytics', 'operations'].map((mode) => (
                      <button
                        key={mode}
                        className={`lt-dashboard__view-btn ${viewMode === mode ? 'lt-dashboard__view-btn--active' : ''}`}
                        onClick={() => handleViewModeChange(mode)}
                      >
                        {mode === 'overview' && 'Visão Geral'}
                        {mode === 'analytics' && 'Analytics'}
                        {mode === 'operations' && 'Operações'}
                      </button>
                    ))}
                  </div>

                  <div className="lt-dashboard__action-controls">
                    <motion.button
                      className={`lt-dashboard__control-btn ${autoRefresh ? 'lt-dashboard__control-btn--active' : ''}`}
                      onClick={handleAutoRefreshToggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSync />
                      Auto
                    </motion.button>

                    <motion.button
                      className="lt-dashboard__control-btn"
                      onClick={handleRefreshToggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPaused ? <FaPlay /> : <FaPause />}
                      {isPaused ? 'Retomar' : 'Pausar'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lt-dashboard__metrics-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {metrics.map((metric, index) => (
                <MetricCard
                  key={metric.title}
                  {...metric}
                  loading={loading}
                />
              ))}
            </motion.div>

            <div className="lt-dashboard__content-area">
              <div className="lt-dashboard__content-layout">
                <div className="lt-dashboard__sidebar">
                  <AIInsightsPanel />
                  
                  <motion.div
                    className="lt-dashboard__quick-actions"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="lt-dashboard__quick-actions-title">Ações Rápidas</h3>
                    <div className="lt-dashboard__quick-actions-grid">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.title}
                          className={`lt-dashboard__quick-action-btn lt-dashboard__quick-action-btn--${action.color}`}
                          onClick={action.action}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <div className="lt-dashboard__quick-action-icon">{action.icon}</div>
                          <div className="lt-dashboard__quick-action-content">
                            <span className="lt-dashboard__quick-action-title">{action.title}</span>
                            <span className="lt-dashboard__quick-action-description">
                              {action.description}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="lt-dashboard__main-content">
                  <div className="lt-dashboard__main-row">
                    <PredictiveAnalytics />
                    
                    <motion.div
                      className="lt-dashboard__alerts-panel"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="lt-dashboard__alerts-header">
                        <h3 className="lt-dashboard__alerts-title">
                          <FaBell />
                          Alertas
                        </h3>
                        <span className="lt-dashboard__alerts-count">3</span>
                      </div>
                      
                      <div className="lt-dashboard__alerts-list">
                        <div className="lt-dashboard__alert-item lt-dashboard__alert-item--critical">
                          <FaExclamationTriangle />
                          <div className="lt-dashboard__alert-content">
                            <span className="lt-dashboard__alert-title">Manutenção Urgente</span>
                            <span className="lt-dashboard__alert-description">SCA-2A17 - Freios</span>
                          </div>
                        </div>
                        
                        <div className="lt-dashboard__alert-item lt-dashboard__alert-item--warning">
                          <FaClock />
                          <div className="lt-dashboard__alert-content">
                            <span className="lt-dashboard__alert-title">Rota com Atraso</span>
                            <span className="lt-dashboard__alert-description">45min de atraso</span>
                          </div>
                        </div>
                        
                        <div className="lt-dashboard__alert-item lt-dashboard__alert-item--info">
                          <FaGasPump />
                          <div className="lt-dashboard__alert-content">
                            <span className="lt-dashboard__alert-title">Abastecimento</span>
                            <span className="lt-dashboard__alert-description">3 veículos</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="lt-dashboard__maintenance-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="lt-dashboard__maintenance-header">
                      <h3 className="lt-dashboard__maintenance-title">Manutenção Preditiva</h3>
                      <motion.button 
                        className="lt-dashboard__maintenance-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/manutencao')}
                      >
                        Agendar
                      </motion.button>
                    </div>
                    
                    <div className="lt-dashboard__maintenance-list">
                      <div className="lt-dashboard__maintenance-item">
                        <FaTools />
                        <div className="lt-dashboard__maintenance-content">
                          <span className="lt-dashboard__maintenance-title">Troca de Bateria</span>
                          <span className="lt-dashboard__maintenance-description">SCA-4B28 - 15 dias</span>
                        </div>
                        <div className="lt-dashboard__maintenance-priority lt-dashboard__maintenance-priority--medium"></div>
                      </div>
                      
                      <div className="lt-dashboard__maintenance-item">
                        <FaTools />
                        <div className="lt-dashboard__maintenance-content">
                          <span className="lt-dashboard__maintenance-title">Alinhamento</span>
                          <span className="lt-dashboard__maintenance-description">SCA-5C39 - 7 dias</span>
                        </div>
                        <div className="lt-dashboard__maintenance-priority lt-dashboard__maintenance-priority--high"></div>
                      </div>

                      <div className="lt-dashboard__maintenance-item">
                        <FaTools />
                        <div className="lt-dashboard__maintenance-content">
                          <span className="lt-dashboard__maintenance-title">Troca de Óleo</span>
                          <span className="lt-dashboard__maintenance-description">SCA-8D42 - 30 dias</span>
                        </div>
                        <div className="lt-dashboard__maintenance-priority lt-dashboard__maintenance-priority--low"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;