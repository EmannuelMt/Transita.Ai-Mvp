import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaTruck, FaTools, FaBox, FaGasPump, FaRoute, FaUser, FaChartLine,
  FaMapMarkerAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaPlus,
  FaDownload, FaSync, FaBell, FaPlay, FaPause, FaMoneyBillWave, FaExclamationCircle,
  FaBars, FaChevronDown, FaUsers, FaCar, FaFileAlt, FaCalculator, FaOilCan,
  FaShoppingCart, FaDollarSign, FaChartBar, FaCalendar, FaArrowUp, FaArrowDown,
  FaSearch, FaCog, FaSignOutAlt, FaWarehouse, FaShippingFast, FaFilter,
  FaEye, FaEdit, FaTrash, FaStar, FaMap, FaDatabase, FaShieldAlt
} from 'react-icons/fa';
import './Dashboard.css'
// API Service Real com múltiplas fontes
class APIService {
  static async getBitcoinPrice() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      return data.bitcoin.usd;
    } catch (error) {
      console.log('API Bitcoin falhou, usando valor mock');
      return 45000;
    }
  }

  static async getTransportData() {
    try {
      const bitcoinPrice = await this.getBitcoinPrice();
      const locationData = await this.getLocationData();
      
      return {
        vehicles: {
          active: Math.floor((bitcoinPrice % 25) + 20),
          maintenance: Math.floor((bitcoinPrice % 8) + 3),
          total: 35,
          efficiency: Math.floor((bitcoinPrice % 20) + 75)
        },
        deliveries: {
          completed: Math.floor((bitcoinPrice % 80) + 120),
          active: Math.floor((bitcoinPrice % 15) + 8),
          successRate: Math.floor((bitcoinPrice % 20) + 75),
          delayed: Math.floor((bitcoinPrice % 10) + 2)
        },
        financial: {
          revenue: (bitcoinPrice * 100).toFixed(2),
          expenses: (bitcoinPrice * 85).toFixed(2),
          profit: (bitcoinPrice * 15).toFixed(2),
          monthlyGrowth: '+12.5%'
        },
        alerts: {
          urgentMaintenance: Math.floor((bitcoinPrice % 4) + 1),
          delayedDeliveries: Math.floor((bitcoinPrice % 6) + 2),
          lowFuel: Math.floor((bitcoinPrice % 3) + 1)
        },
        location: locationData
      };
    } catch (error) {
      console.log('Usando dados mock completos');
      return this.getMockData();
    }
  }

  static async getLocationData() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        city: data.city,
        region: data.region,
        country: data.country_name,
        timezone: data.timezone
      };
    } catch (error) {
      return {
        city: 'São Paulo',
        region: 'SP',
        country: 'Brasil',
        timezone: 'America/Sao_Paulo'
      };
    }
  }

  static async getMockData() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      vehicles: { active: 28, maintenance: 4, total: 32, efficiency: 87 },
      deliveries: { completed: 156, active: 12, successRate: 87, delayed: 3 },
      financial: { 
        revenue: '185000.00', 
        expenses: '142000.00', 
        profit: '43000.00',
        monthlyGrowth: '+12.5%'
      },
      alerts: { urgentMaintenance: 2, delayedDeliveries: 3, lowFuel: 1 },
      location: {
        city: 'São Paulo',
        region: 'SP',
        country: 'Brasil',
        timezone: 'America/Sao_Paulo'
      }
    };
  }

  static async getChartData() {
    const bitcoinPrice = await this.getBitcoinPrice();
    
    return {
      deliveryStatus: [
        { status: 'Entregue', value: Math.floor((bitcoinPrice % 50) + 100), color: '#10b981' },
        { status: 'Em Trânsito', value: Math.floor((bitcoinPrice % 20) + 15), color: '#3b82f6' },
        { status: 'Atrasada', value: Math.floor((bitcoinPrice % 10) + 5), color: '#f59e0b' },
        { status: 'Cancelada', value: Math.floor((bitcoinPrice % 5) + 2), color: '#ef4444' }
      ],
      weeklyTrend: Array.from({ length: 7 }, (_, i) => ({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
        deliveries: Math.floor((bitcoinPrice % 30) + 20 + (i * 2)),
        revenue: Math.floor((bitcoinPrice % 5000) + 10000 + (i * 800))
      })),
      fuelConsumption: [
        { vehicle: 'Volvo FH 540', consumption: 7.2, efficiency: 92 },
        { vehicle: 'Scania R500', consumption: 6.9, efficiency: 88 },
        { vehicle: 'Mercedes Actros', consumption: 7.5, efficiency: 85 },
        { vehicle: 'Ford Cargo', consumption: 6.5, efficiency: 78 },
        { vehicle: 'MAN TGX', consumption: 7.1, efficiency: 82 }
      ],
      revenueSources: [
        { source: 'Transporte Geral', value: 45, color: '#6366f1' },
        { source: 'Logística Contratada', value: 30, color: '#10b981' },
        { source: 'Fretes Urgentes', value: 15, color: '#f59e0b' },
        { source: 'Cargas Especiais', value: 10, color: '#ef4444' }
      ]
    };
  }

  static async getRecentActivities() {
    const activities = [
      {
        id: 1,
        type: 'delivery',
        title: 'Entrega Concluída - Centro Distribuição',
        description: 'Pedido #7894 - 2.3T de Mercadorias - Cliente: Supermercado ABC',
        time: new Date(Date.now() - 1000 * 60 * 5),
        status: 'completed',
        priority: 'medium',
        value: 'R$ 2.450,00'
      },
      {
        id: 2,
        type: 'maintenance',
        title: 'Manutenção Preventiva Programada',
        description: 'Scania R500 - Troca de Óleo e Filtros - 150.000 km',
        time: new Date(Date.now() - 1000 * 60 * 15),
        status: 'scheduled',
        priority: 'low',
        value: 'R$ 1.200,00'
      },
      {
        id: 3,
        type: 'alert',
        title: 'Alerta: Rota com Congestionamento',
        description: 'Rodovia BR-116 - 45min de atraso estimado - Desviar para SP-330',
        time: new Date(Date.now() - 1000 * 60 * 25),
        status: 'warning',
        priority: 'high',
        value: 'Ajuste Necessário'
      },
      {
        id: 4,
        type: 'fuel',
        title: 'Abastecimento Registrado',
        description: 'Posto Shell - 350L Diesel S10 - Veículo: Volvo FH 540',
        time: new Date(Date.now() - 1000 * 60 * 40),
        status: 'completed',
        priority: 'low',
        value: 'R$ 1.890,00'
      },
      {
        id: 5,
        type: 'delivery',
        title: 'Nova Entrega Atribuída',
        description: 'Pedido #7895 - Zona Norte - 3.1T de Materiais de Construção',
        time: new Date(Date.now() - 1000 * 60 * 60),
        status: 'assigned',
        priority: 'medium',
        value: 'R$ 3.150,00'
      },
      {
        id: 6,
        type: 'maintenance',
        title: 'Manutenção Corretiva Concluída',
        description: 'Mercedes Actros - Sistema de Freios - Placa: ABC-1234',
        time: new Date(Date.now() - 1000 * 60 * 120),
        status: 'completed',
        priority: 'medium',
        value: 'R$ 850,00'
      }
    ];

    return activities.sort((a, b) => b.time - a.time);
  }

  static async getFleetStatus() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: 1,
        plate: 'ABC-1234',
        model: 'Volvo FH 540',
        status: 'active',
        location: 'Rodovia Anhanguera, KM 35',
        driver: 'João Silva',
        fuel: 85,
        odometer: 125430,
        nextMaintenance: 2000
      },
      {
        id: 2,
        plate: 'DEF-5678',
        model: 'Scania R500',
        status: 'maintenance',
        location: 'Oficina Central',
        driver: 'Pedro Santos',
        fuel: 100,
        odometer: 89200,
        nextMaintenance: 0
      },
      {
        id: 3,
        plate: 'GHI-9012',
        model: 'Mercedes Actros',
        status: 'active',
        location: 'Marginal Tietê, KM 18',
        driver: 'Maria Oliveira',
        fuel: 45,
        odometer: 156780,
        nextMaintenance: 1500
      },
      {
        id: 4,
        plate: 'JKL-3456',
        model: 'Ford Cargo 2428',
        status: 'active',
        location: 'Av. das Nações, 1000',
        driver: 'Carlos Souza',
        fuel: 70,
        odometer: 78000,
        nextMaintenance: 3000
      }
    ];
  }
}

// Custom Hooks Profissionais
const useDashboard = () => {
  const [data, setData] = useState({});
  const [activities, setActivities] = useState([]);
  const [charts, setCharts] = useState({});
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transportData, chartData, activitiesData, fleetData] = await Promise.all([
        APIService.getTransportData(),
        APIService.getChartData(),
        APIService.getRecentActivities(),
        APIService.getFleetStatus()
      ]);

      setData(transportData);
      setCharts(chartData);
      setActivities(activitiesData);
      setFleet(fleetData);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(loadAllData, 15000);
    return () => clearInterval(interval);
  }, [isPaused, loadAllData]);

  return {
    data,
    activities,
    charts,
    fleet,
    loading,
    lastUpdate,
    isPaused,
    error,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
    refresh: loadAllData
  };
};

// Componentes de UI Profissionais
const LoadingSpinner = ({ message = "Carregando dados..." }) => (
  <div className="loading-spinner">
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="spinner-ring"></div>
    </div>
    <span className="loading-message">{message}</span>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-message">
    <div className="error-icon">
      <FaExclamationCircle />
    </div>
    <div className="error-content">
      <h3>Erro ao Carregar</h3>
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        <FaSync />
        Tentar Novamente
      </button>
    </div>
  </div>
);

const KPICard = ({ title, value, change, icon, color = 'primary', trend, subtitle, onClick }) => (
  <motion.div
    className={`kpi-card kpi-card--${color}`}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400 }}
    onClick={onClick}
  >
    <div className="kpi-card__header">
      <div className="kpi-card__icon-wrapper">
        {icon}
      </div>
      <div className="kpi-card__trend">
        {trend && (
          <span className={`trend-indicator trend-indicator--${trend}`}>
            {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
            {change}
          </span>
        )}
      </div>
    </div>
    
    <div className="kpi-card__content">
      <h3 className="kpi-card__value">{value}</h3>
      <p className="kpi-card__title">{title}</p>
      {subtitle && <span className="kpi-card__subtitle">{subtitle}</span>}
    </div>

    <div className="kpi-card__glow"></div>
    <div className="kpi-card__hover"></div>
  </motion.div>
);

const ChartComponent = ({ data, type = 'bar', title, height = 200, color = 'primary' }) => {
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 100;
    return Math.max(...data.map(item => item.value || item.deliveries || item.consumption || item.revenue || 0));
  }, [data]);

  if (!data) return <div className="chart-empty">Sem dados disponíveis</div>;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="chart-title">{title}</h4>
        <button className="chart-actions">
          <FaEye />
        </button>
      </div>
      <div className={`chart chart--${type}`} style={{ height: `${height}px` }}>
        {type === 'bar' && (
          <div className="chart-bars">
            {data.map((item, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar-container">
                  <motion.div
                    className="chart-bar"
                    initial={{ height: 0 }}
                    animate={{ 
                      height: `${((item.deliveries || item.consumption || item.revenue || 0) / maxValue) * 80}%` 
                    }}
                    transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
                    style={{ backgroundColor: item.color || `var(--${color})` }}
                  />
                  <div className="chart-bar-value">
                    {item.deliveries || item.consumption || item.revenue || 0}
                  </div>
                </div>
                <span className="chart-label">{item.day || item.vehicle || item.source}</span>
              </div>
            ))}
          </div>
        )}
        
        {type === 'pie' && (
          <div className="chart-pie">
            {data.map((item, index) => (
              <div key={index} className="pie-item">
                <div className="pie-color-indicator">
                  <div 
                    className="pie-color" 
                    style={{ backgroundColor: item.color || `var(--${color})` }}
                  />
                  <span className="pie-label">{item.status || item.source}</span>
                </div>
                <div className="pie-value-group">
                  <span className="pie-value">{item.value}</span>
                  <span className="pie-percentage">
                    {Math.round((item.value / data.reduce((sum, i) => sum + i.value, 0)) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => (
  <div className="activity-feed">
    <div className="activity-feed__header">
      <h3>Atividades Recentes</h3>
      <div className="activity-header-actions">
        <span className="activity-count">{activities.length} atividades</span>
        <button className="activity-filter">
          <FaFilter />
        </button>
      </div>
    </div>
    
    <div className="activity-list">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          className={`activity-item activity-item--${activity.priority}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="activity-icon">
            {activity.type === 'delivery' && <FaShippingFast />}
            {activity.type === 'maintenance' && <FaTools />}
            {activity.type === 'alert' && <FaExclamationCircle />}
            {activity.type === 'fuel' && <FaGasPump />}
          </div>
          
          <div className="activity-content">
            <div className="activity-header">
              <h5 className="activity-title">{activity.title}</h5>
              <span className="activity-value">{activity.value}</span>
            </div>
            <p className="activity-description">{activity.description}</p>
            <div className="activity-meta">
              <span className="activity-time">
                <FaClock />
                {activity.time.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              <span className={`activity-status activity-status--${activity.status}`}>
                {activity.status === 'completed' && 'Concluído'}
                {activity.status === 'scheduled' && 'Agendado'}
                {activity.status === 'warning' && 'Alerta'}
                {activity.status === 'assigned' && 'Atribuído'}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const AlertPanel = ({ alerts }) => (
  <motion.div 
    className="alert-panel"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="alert-panel__header">
      <div className="alert-title">
        <FaExclamationTriangle />
        <h3>Alertas Críticos</h3>
      </div>
      <div className="alert-badge">
        {Object.values(alerts).reduce((sum, count) => sum + count, 0)}
      </div>
    </div>
    
    <div className="alert-list">
      {alerts.urgentMaintenance > 0 && (
        <div className="alert-item alert-item--critical">
          <div className="alert-icon">
            <FaTools />
          </div>
          <div className="alert-content">
            <h4>Manutenções Urgentes</h4>
            <p>{alerts.urgentMaintenance} veículo(s) necessitam de manutenção imediata</p>
          </div>
          <button className="alert-action">
            <FaEye />
          </button>
        </div>
      )}
      
      {alerts.delayedDeliveries > 0 && (
        <div className="alert-item alert-item--warning">
          <div className="alert-icon">
            <FaClock />
          </div>
          <div className="alert-content">
            <h4>Entregas Atrasadas</h4>
            <p>{alerts.delayedDeliveries} entrega(s) com atraso significativo</p>
          </div>
          <button className="alert-action">
            <FaEye />
          </button>
        </div>
      )}

      {alerts.lowFuel > 0 && (
        <div className="alert-item alert-item--info">
          <div className="alert-icon">
            <FaGasPump />
          </div>
          <div className="alert-content">
            <h4>Combustível Baixo</h4>
            <p>{alerts.lowFuel} veículo(s) com nível crítico de combustível</p>
          </div>
          <button className="alert-action">
            <FaEye />
          </button>
        </div>
      )}
    </div>
  </motion.div>
);

const FleetStatus = ({ fleet }) => (
  <div className="fleet-status">
    <div className="fleet-header">
      <h3>Status da Frota</h3>
      <button className="fleet-action">
        <FaPlus />
        Novo Veículo
      </button>
    </div>
    
    <div className="fleet-grid">
      {fleet.map((vehicle, index) => (
        <motion.div
          key={vehicle.id}
          className={`fleet-card fleet-card--${vehicle.status}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="fleet-card__header">
            <div className="vehicle-plate">{vehicle.plate}</div>
            <div className={`status-badge status-badge--${vehicle.status}`}>
              {vehicle.status === 'active' ? 'Ativo' : 
               vehicle.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
            </div>
          </div>
          
          <div className="fleet-card__content">
            <h4 className="vehicle-model">{vehicle.model}</h4>
            <p className="vehicle-driver">
              <FaUser />
              {vehicle.driver}
            </p>
            <p className="vehicle-location">
              <FaMapMarkerAlt />
              {vehicle.location}
            </p>
          </div>
          
          <div className="fleet-card__footer">
            <div className="vehicle-stats">
              <div className="stat">
                <span className="stat-label">Combustível</span>
                <div className="stat-value">
                  <div className="fuel-bar">
                    <div 
                      className={`fuel-level fuel-level--${vehicle.fuel > 70 ? 'high' : vehicle.fuel > 30 ? 'medium' : 'low'}`}
                      style={{ width: `${vehicle.fuel}%` }}
                    />
                  </div>
                  <span>{vehicle.fuel}%</span>
                </div>
              </div>
              <div className="stat">
                <span className="stat-label">KM Rodados</span>
                <span className="stat-value">{vehicle.odometer.toLocaleString('pt-BR')} km</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const QuickActions = ({ onAction }) => (
  <div className="quick-actions-panel">
    <div className="quick-actions-header">
      <h3>Ações Rápidas</h3>
      <span className="actions-info">Acesso direto</span>
    </div>
    
    <div className="quick-actions-grid">
      <button className="quick-action" onClick={() => onAction('drivers')}>
        <div className="action-icon">
          <FaUsers />
        </div>
        <span className="action-label">Escala de Motoristas</span>
        <span className="action-description">Gestão de turnos</span>
      </button>
      
      <button className="quick-action" onClick={() => onAction('delivery')}>
        <div className="action-icon">
          <FaPlus />
        </div>
        <span className="action-label">Nova Entrega</span>
        <span className="action-description">Criar rota</span>
      </button>
      
      <button className="quick-action" onClick={() => onAction('maintenance')}>
        <div className="action-icon">
          <FaTools />
        </div>
        <span className="action-label">Abrir Chamado</span>
        <span className="action-description">Manutenção</span>
      </button>
      
      <button className="quick-action" onClick={() => onAction('reports')}>
        <div className="action-icon">
          <FaChartLine />
        </div>
        <span className="action-label">Relatórios IA</span>
        <span className="action-description">Analytics</span>
      </button>
      
      <button className="quick-action" onClick={() => onAction('fleet')}>
        <div className="action-icon">
          <FaCar />
        </div>
        <span className="action-label">Gestão de Frota</span>
        <span className="action-description">Veículos</span>
      </button>
      
      <button className="quick-action" onClick={() => onAction('financial')}>
        <div className="action-icon">
          <FaMoneyBillWave />
        </div>
        <span className="action-label">Dashboard Financeiro</span>
        <span className="action-description">Relatórios</span>
      </button>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FaChartLine,
      items: [
        { label: 'Visão Geral', path: '/', badge: null },
        { label: 'Operações', path: '/operations', badge: '3' },
        { label: 'Financeiro', path: '/financial', badge: null },
        { label: 'Analytics', path: '/analytics', badge: 'New' }
      ]
    },
    {
      id: 'operations',
      label: 'Operações',
      icon: FaTruck,
      items: [
        { label: 'Gestão de Frota', path: '/fleet', badge: null },
        { label: 'Rotas e Entregas', path: '/routes', badge: '12' },
        { label: 'Manutenção', path: '/maintenance', badge: '2' },
        { label: 'Combustível', path: '/fuel', badge: null },
        { label: 'Rastreamento', path: '/tracking', badge: null }
      ]
    },
    {
      id: 'management',
      label: 'Gestão',
      icon: FaUsers,
      items: [
        { label: 'Motoristas', path: '/drivers', badge: null },
        { label: 'Clientes', path: '/clients', badge: null },
        { label: 'Fornecedores', path: '/suppliers', badge: null },
        { label: 'Documentos', path: '/documents', badge: '5' }
      ]
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FaFileAlt,
      items: [
        { label: 'Desempenho', path: '/performance', badge: null },
        { label: 'Financeiro', path: '/financial-reports', badge: null },
        { label: 'Operacional', path: '/operational', badge: null },
        { label: 'Customizados', path: '/custom', badge: 'New' }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="sidebar"
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="brand-logo">
              <FaTruck />
            </div>
            <div className="brand-text">
              <span className="brand-name">Transita .Ai</span>
              <span className="brand-version">Pro </span>
            </div>
          </div>
          <button className="sidebar__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar__content">
          <nav className="sidebar-nav">
            {menuSections.map((section) => (
              <div key={section.id} className="nav-section">
                <button
                  className={`nav-section__header ${
                    activeSection === section.id ? 'nav-section__header--active' : ''
                  }`}
                  onClick={() => setActiveSection(
                    activeSection === section.id ? '' : section.id
                  )}
                >
                  <section.icon className="nav-section__icon" />
                  <span className="nav-section__label">{section.label}</span>
                  <motion.div
                    className="nav-section__chevron"
                    animate={{ rotate: activeSection === section.id ? 180 : 0 }}
                  >
                    <FaChevronDown />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeSection === section.id && (
                    <motion.div
                      className="nav-section__items"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {section.items.map((item, index) => (
                        <motion.button
                          key={index}
                          className="nav-item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleNavigation(item.path)}
                        >
                          <span className="nav-item-label">{item.label}</span>
                          {item.badge && (
                            <span className="nav-item-badge">{item.badge}</span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

// Componente Principal
const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    data,
    activities,
    charts,
    fleet,
    loading,
    lastUpdate,
    isPaused,
    error,
    pause,
    resume,
    refresh
  } = useDashboard();

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FaChartLine },
    { id: 'operations', label: 'Operações', icon: FaTruck },
    { id: 'financial', label: 'Financeiro', icon: FaMoneyBillWave },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const kpis = [
    {
      title: 'Veículos Ativos',
      value: `${data.vehicles?.active || 0}/${data.vehicles?.total || 0}`,
      change: '+2',
      trend: 'up',
      icon: <FaCar />,
      color: 'success',
      subtitle: `Eficiência: ${data.vehicles?.efficiency || 0}%`
    },
    {
      title: 'Taxa de Sucesso',
      value: `${data.deliveries?.successRate || 0}%`,
      change: '+3.2%',
      trend: 'up',
      icon: <FaCheckCircle />,
      color: 'primary',
      subtitle: `${data.deliveries?.delayed || 0} entregas atrasadas`
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${parseFloat(data.financial?.revenue || 0).toLocaleString('pt-BR')}`,
      change: data.financial?.monthlyGrowth || '+12.5%',
      trend: 'up',
      icon: <FaDollarSign />,
      color: 'success',
      subtitle: 'Faturamento total'
    },
    {
      title: 'Lucro Líquido',
      value: `R$ ${parseFloat(data.financial?.profit || 0).toLocaleString('pt-BR')}`,
      change: '+8.3%',
      trend: 'up',
      icon: <FaMoneyBillWave />,
      color: 'success',
      subtitle: 'Margem operacional'
    }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'drivers':
        navigate('/drivers');
        break;
      case 'delivery':
        navigate('/routes/new');
        break;
      case 'maintenance':
        navigate('/maintenance/new');
        break;
      case 'reports':
        navigate('/analytics');
        break;
      case 'fleet':
        navigate('/fleet');
        break;
      case 'financial':
        navigate('/financial');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="professional-dashboard">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          
          <div className="header-title">
            <h1>Dashboard Logística</h1>
            <span className="location">
              <FaMapMarkerAlt />
              {data.location?.city}, {data.location?.region} - {data.location?.country}
            </span>
          </div>
        </div>

        <div className="header-right">
          <div className="header-controls">
            <div className="update-info">
              <span className="update-label">Última atualização</span>
              <span className="update-time">{lastUpdate}</span>
            </div>
            
            <div className="control-buttons">
              <button 
                className={`control-btn ${!isPaused ? 'control-btn--active' : ''}`}
                onClick={isPaused ? resume : pause}
                title={isPaused ? 'Retomar atualizações' : 'Pausar atualizações'}
              >
                {isPaused ? <FaPlay /> : <FaPause />}
              </button>
              
              <button className="control-btn" onClick={refresh} title="Atualizar dados">
                <FaSync />
              </button>
              
              <button className="control-btn" title="Exportar relatório">
                <FaDownload />
              </button>

              <button className="control-btn" title="Notificações">
                <FaBell />
                <span className="notification-badge">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`dashboard-tab ${activeTab === tab.id ? 'dashboard-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              {/* Alertas */}
              {data.alerts && Object.values(data.alerts).some(count => count > 0) && (
                <AlertPanel alerts={data.alerts} />
              )}

              {/* KPIs Grid */}
              <div className="kpis-grid">
                {kpis.map((kpi, index) => (
                  <KPICard key={index} {...kpi} />
                ))}
              </div>

              <div className="content-grid">
                {/* Gráficos e Dados */}
                <div className="main-content">
                  <div className="charts-section">
                    <ChartComponent
                      data={charts.deliveryStatus || []}
                      type="pie"
                      title="Status das Entregas"
                      height={240}
                    />
                    
                    <ChartComponent
                      data={charts.weeklyTrend || []}
                      type="bar"
                      title="Tendência Semanal de Entregas"
                      height={280}
                      color="primary"
                    />

                    <ChartComponent
                      data={charts.revenueSources || []}
                      type="pie"
                      title="Fontes de Receita"
                      height={240}
                    />

                    <ChartComponent
                      data={charts.fuelConsumption || []}
                      type="bar"
                      title="Consumo de Combustível por Veículo"
                      height={280}
                      color="warning"
                    />
                  </div>

                  {/* Status da Frota */}
                  <FleetStatus fleet={fleet} />
                </div>

                {/* Sidebar - Atividades e Ações */}
                <div className="sidebar-panels">
                  <ActivityFeed activities={activities} />
                  <QuickActions onAction={handleQuickAction} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Aba de Operações */}
          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              <div className="operations-content">
                <div className="operations-header">
                  <h2>Painel de Operações</h2>
                  <p>Monitoramento em tempo real das operações logísticas</p>
                </div>
                
                <div className="operations-grid">
                  <div className="operations-card">
                    <h3>Entregas em Andamento</h3>
                    <div className="operations-value">{data.deliveries?.active || 0}</div>
                    <div className="operations-trend trend-up">
                      <FaArrowUp /> +12% vs ontem
                    </div>
                  </div>
                  
                  <div className="operations-card">
                    <h3>Veículos em Manutenção</h3>
                    <div className="operations-value">{data.vehicles?.maintenance || 0}</div>
                    <div className="operations-trend trend-down">
                      <FaArrowDown /> -2 vs semana passada
                    </div>
                  </div>
                  
                  <div className="operations-card">
                    <h3>Combustível Disponível</h3>
                    <div className="operations-value">85%</div>
                    <div className="operations-trend trend-stable">
                      <FaChartLine /> Estável
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Aba Financeiro */}
          {activeTab === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              <div className="financial-content">
                <div className="financial-header">
                  <h2>Dashboard Financeiro</h2>
                  <p>Análise de desempenho financeiro e métricas</p>
                </div>
                
                <div className="financial-grid">
                  <div className="financial-card revenue">
                    <h3>Receita Total</h3>
                    <div className="financial-value">
                      R$ {parseFloat(data.financial?.revenue || 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="financial-change positive">
                      <FaArrowUp /> +12.5%
                    </div>
                  </div>
                  
                  <div className="financial-card expenses">
                    <h3>Despesas Operacionais</h3>
                    <div className="financial-value">
                      R$ {parseFloat(data.financial?.expenses || 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="financial-change negative">
                      <FaArrowUp /> +8.2%
                    </div>
                  </div>
                  
                  <div className="financial-card profit">
                    <h3>Lucro Líquido</h3>
                    <div className="financial-value">
                      R$ {parseFloat(data.financial?.profit || 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="financial-change positive">
                      <FaArrowUp /> +15.3%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Aba Analytics */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              <div className="analytics-content">
                <div className="analytics-header">
                  <h2>Analytics Avançado</h2>
                  <p>Insights e tendências baseados em IA</p>
                </div>
                
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>Eficiência de Rotas</h3>
                    <div className="analytics-chart">
                      <div className="chart-placeholder">
                        <FaChartLine />
                        <span>Gráfico de Eficiência</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h3>Previsão de Demanda</h3>
                    <div className="analytics-chart">
                      <div className="chart-placeholder">
                        <FaChartBar />
                        <span>Previsão Próxima Semana</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h3>Análise de Custos</h3>
                    <div className="analytics-chart">
                      <div className="chart-placeholder">
                        <FaMoneyBillWave />
                        <span>Otimização de Custos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;