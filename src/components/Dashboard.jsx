import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTruck,
  FaTools,
  FaBox,
  FaGasPump,
  FaRoute,
  FaUser,
  FaChartLine,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaDownload,
  FaSync,
  FaBell,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaRobot,
  FaCog,
  FaEyeSlash,
  FaShippingFast,
  FaMoneyCheckAlt,
  FaUserCheck,
  FaDatabase,
  FaCloud,
  FaShieldAlt
} from 'react-icons/fa';
import '../styles/Dashboard.css';

// Custom hooks avançados
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

// Componente de Métrica Avançada
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color, 
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

  return (
    <motion.div
      className={`dashboard-metric-card ${color} ${size} ${loading ? 'loading' : ''}`}
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
      <div className="metric-glow"></div>
      
      <div className="metric-header">
        <motion.div 
          className="metric-icon-container"
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          <div className="metric-icon">{icon}</div>
          {trend && (
            <motion.div 
              className={`trend-badge ${trend}`}
              animate={trend === 'up' ? { y: [0, -2, 0] } : { y: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {trend === 'up' ? '↗' : '↘'}
            </motion.div>
          )}
        </motion.div>
        
        <div className="metric-actions">
          <motion.button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </motion.button>
        </div>
      </div>

      <div className="metric-content">
        <motion.h3 
          className="metric-value"
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {loading ? '...' : value}
        </motion.h3>
        <p className="metric-title">{title}</p>
        {subtitle && (
          <motion.span 
            className="metric-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.span>
        )}
        
        {change && (
          <motion.div 
            className="metric-change"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={`change-indicator ${trend}`}>{change}</span>
          </motion.div>
        )}
      </div>

      {showSparkline && (
        <motion.div 
          className="metric-sparkline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="sparkline-chart">
            {sparklineData.map((point, index) => (
              <motion.div
                key={index}
                className="sparkline-bar"
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
            className="metric-expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="expanded-details">
              <div className="detail-item">
                <span className="detail-label">Meta Mensal</span>
                <span className="detail-value">+8%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Performance</span>
                <span className="detail-value">92%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tendência</span>
                <span className="detail-value positive">Positiva</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Componente de Insights de IA
const AIInsightsPanel = () => {
  const [expandedInsight, setExpandedInsight] = useState(null);

  const insights = [
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
  ];

  return (
    <motion.div 
      className="ai-insights-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="insights-header">
        <div className="header-content">
          <FaRobot className="ai-icon" />
          <h3>Insights de IA</h3>
          <span className="ai-badge">Beta</span>
        </div>
      </div>

      <div className="insights-list">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className={`insight-item ${insight.priority}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
          >
            <div className="insight-icon">
              {insight.type === 'optimization' && <FaRoute />}
              {insight.type === 'maintenance' && <FaTools />}
              {insight.type === 'efficiency' && <FaChartLine />}
            </div>
            
            <div className="insight-content">
              <div className="insight-main">
                <span className="insight-title">{insight.title}</span>
                <span className="insight-confidence">{insight.confidence}% conf.</span>
              </div>
              <p className="insight-description">{insight.description}</p>
            </div>

            <div className="insight-priority">
              <div className={`priority-dot ${insight.priority}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Componente de Analytics Preditivo
const PredictiveAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('performance');

  const performanceData = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => ({
      day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
      predicted: 80 + Math.random() * 15,
      actual: 75 + Math.random() * 20
    })),
    []
  );

  return (
    <motion.div 
      className="predictive-analytics"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="analytics-header">
        <h3>
          <FaChartLine className="header-icon" />
          Analytics Preditivo
        </h3>
        <select 
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="metric-select"
        >
          <option value="performance">Performance</option>
          <option value="efficiency">Eficiência</option>
          <option value="delivery">Entregas</option>
        </select>
      </div>

      <div className="predictive-chart">
        <div className="chart-container">
          {performanceData.map((data, index) => (
            <div key={index} className="chart-item">
              <div className="chart-bars">
                <motion.div 
                  className="predicted-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.predicted}%` }}
                  transition={{ delay: index * 0.1 }}
                />
                <motion.div 
                  className="actual-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.actual}%` }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
              </div>
              <span className="chart-label">{data.day}</span>
            </div>
          ))}
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color predicted"></div>
            <span>Previsto</span>
          </div>
          <div className="legend-item">
            <div className="legend-color actual"></div>
            <span>Real</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal do Dashboard
function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useLocalStorage('dashboard-view', 'overview');
  const [autoRefresh, setAutoRefresh] = useLocalStorage('dashboard-refresh', true);
  const [isDataPaused, setIsDataPaused] = useState(false);

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

  const metrics = [
    {
      title: 'Veículos em Operação',
      value: dashboardData.vehiclesInOperation,
      icon: <FaTruck />,
      color: 'primary',
      trend: 'up',
      change: '+12%',
      subtitle: '42/50 veículos',
      size: 'medium'
    },
    {
      title: 'Eficiência de Combustível',
      value: `${dashboardData.fuelEfficiency.toFixed(1)} km/L`,
      icon: <FaGasPump />,
      color: 'success',
      trend: 'up',
      change: '+0.4 km/L',
      subtitle: 'Meta: 8.0 km/L',
      size: 'medium'
    },
    {
      title: 'Performance',
      value: `${dashboardData.driverPerformance}%`,
      icon: <FaUser />,
      color: 'orange',
      trend: 'up',
      change: '+5%',
      subtitle: 'Motoristas ativos',
      size: 'large'
    },
    {
      title: 'Entregas no Prazo',
      value: `${dashboardData.onTimeDelivery}%`,
      icon: <FaCheckCircle />,
      color: 'success',
      trend: 'up',
      change: '+2%',
      subtitle: 'Meta: 95%',
      size: 'medium'
    },
    {
      title: 'Alertas de Manutenção',
      value: dashboardData.maintenanceAlerts,
      icon: <FaTools />,
      color: 'warning',
      trend: 'down',
      change: '-2',
      subtitle: '8 pendentes',
      size: 'medium'
    },
    {
      title: 'Redução de CO₂',
      value: `${dashboardData.co2Reduction}%`,
      icon: <FaCloud />,
      color: 'green',
      trend: 'up',
      change: '+1.2%',
      subtitle: 'vs mês anterior',
      size: 'medium'
    }
  ];

  const quickActions = [
    {
      icon: <FaPlus />,
      title: 'Nova Rota',
      description: 'Planejar rota otimizada',
      color: 'primary',
      action: () => console.log('Nova rota')
    },
    {
      icon: <FaTruck />,
      title: 'Alocar Veículo',
      description: 'Atribuir veículo à entrega',
      color: 'info',
      action: () => console.log('Alocar veículo')
    },
    {
      icon: <FaTools />,
      title: 'Manutenção',
      description: 'Agendar manutenção',
      color: 'warning',
      action: () => console.log('Manutenção')
    },
    {
      icon: <FaChartLine />,
      title: 'Relatórios',
      description: 'Gerar relatórios',
      color: 'success',
      action: () => console.log('Relatórios')
    }
  ];

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
    setIsDataPaused(!isPaused);
  }, [isPaused, pause, resume]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-main">
          <div className="header-title">
            <h1>Dashboard Logística</h1>
            <p>Monitoramento em tempo real da operação</p>
          </div>

          <div className="header-controls">
            <div className="view-controls">
              {['overview', 'analytics', 'operations'].map((mode) => (
                <button
                  key={mode}
                  className={`view-btn ${viewMode === mode ? 'active' : ''}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === 'overview' && 'Visão Geral'}
                  {mode === 'analytics' && 'Analytics'}
                  {mode === 'operations' && 'Operações'}
                </button>
              ))}
            </div>

            <div className="action-controls">
              <motion.button
                className={`control-btn ${autoRefresh ? 'active' : ''}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSync />
                Auto
              </motion.button>

              <motion.button
                className="control-btn"
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

        <div className="header-info">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.displayName || 'Operador'}</span>
              <span className="user-role">Gerente de Operações</span>
            </div>
          </div>
          
          <div className="time-info">
            <FaClock />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </motion.div>

      {/* Grid de Métricas */}
      <motion.div 
        className="metrics-grid"
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

      {/* Conteúdo Principal */}
      <div className="dashboard-content">
        <div className="content-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <AIInsightsPanel />
            
            <motion.div
              className="quick-actions-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Ações Rápidas</h3>
              <div className="actions-grid">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    className={`action-btn ${action.color}`}
                    onClick={action.action}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="action-icon">{action.icon}</div>
                    <div className="action-content">
                      <span className="action-title">{action.title}</span>
                      <span className="action-description">{action.description}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Área Principal */}
          <div className="main-content">
            <div className="main-row">
              <PredictiveAnalytics />
              
              <motion.div
                className="alerts-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="panel-header">
                  <h3>
                    <FaBell />
                    Alertas
                  </h3>
                  <span className="alerts-count">3</span>
                </div>
                
                <div className="alerts-list">
                  <div className="alert-item critical">
                    <FaExclamationTriangle />
                    <div className="alert-content">
                      <span className="alert-title">Manutenção Urgente</span>
                      <span className="alert-desc">SCA-2A17 - Freios</span>
                    </div>
                  </div>
                  
                  <div className="alert-item warning">
                    <FaClock />
                    <div className="alert-content">
                      <span className="alert-title">Rota com Atraso</span>
                      <span className="alert-desc">45min de atraso</span>
                    </div>
                  </div>
                  
                  <div className="alert-item info">
                    <FaGasPump />
                    <div className="alert-content">
                      <span className="alert-title">Abastecimento</span>
                      <span className="alert-desc">3 veículos</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="maintenance-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="panel-header">
                <h3>Manutenção Preditiva</h3>
                <button className="btn-primary">Agendar</button>
              </div>
              
              <div className="maintenance-list">
                <div className="maintenance-item">
                  <FaTools />
                  <div className="maintenance-content">
                    <span className="maintenance-title">Troca de Bateria</span>
                    <span className="maintenance-desc">SCA-4B28 - 15 dias</span>
                  </div>
                  <div className="priority medium"></div>
                </div>
                
                <div className="maintenance-item">
                  <FaTools />
                  <div className="maintenance-content">
                    <span className="maintenance-title">Alinhamento</span>
                    <span className="maintenance-desc">SCA-5C39 - 7 dias</span>
                  </div>
                  <div className="priority high"></div>
                </div>

                <div className="maintenance-item">
                  <FaTools />
                  <div className="maintenance-content">
                    <span className="maintenance-title">Troca de Óleo</span>
                    <span className="maintenance-desc">SCA-8D42 - 30 dias</span>
                  </div>
                  <div className="priority low"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="dashboard-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="footer-content">
          <div className="system-status">
            <div className="status-item online">
              <div className="status-dot"></div>
              <span>Sistema Online</span>
            </div>
            <div className="status-item online">
              <div className="status-dot"></div>
              <span>Dados em Tempo Real</span>
            </div>
          </div>
          <div className="footer-info">
            <span>LogiTech Pro • v2.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;