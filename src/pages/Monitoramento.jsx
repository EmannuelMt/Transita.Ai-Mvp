import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiTruck, 
  FiRefreshCw, 
  FiMap, 
  FiPhone, 
  FiBarChart2,
  FiSmartphone,
  FiNavigation,
  FiClock,
  FiThermometer,
  FiDroplet,
  FiActivity,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
  FiPlay,
  FiPause,
  FiFlag
} from 'react-icons/fi';
import { 
  MdSatellite, 
  MdTraffic, 
  MdLocationOn,
  MdMyLocation,
  MdSpeed,
  MdLocalGasStation,
  MdDirectionsCar
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoSpeedometerOutline,
  IoTimeOutline,
  IoNavigateOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/monitoramento.css'

const Monitoramento = ({ user, onNavigate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [mapView, setMapView] = useState('standard');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulação de dados em tempo real
  useEffect(() => {
    const initialVehicles = [
      {
        id: 1,
        placa: 'ABC1I23',
        modelo: 'Volvo FH 540',
        motorista: 'Carlos Santos',
        status: 'em_viagem',
        localizacao: 'Rodovia Presidente Dutra, KM 42',
        destino: 'Rio de Janeiro - RJ',
        velocidade: 78,
        combustivel: 85,
        temperatura: 18,
        odometro: 125420,
        tempo_viagem: '2:45',
        ultimaAtualizacao: new Date(Date.now() - 120000),
        carga: 'Eletrônicos',
        peso: 15.2,
        efficiency: 2.8,
        nextMaintenance: 5000,
        alerts: ['manutencao_proxima'],
        routeProgress: 65
      },
      {
        id: 2,
        placa: 'DEF4G56',
        modelo: 'Scania R440',
        motorista: 'Maria Oliveira',
        status: 'carregando',
        localizacao: 'Centro de Distribuição - SP',
        destino: 'Brasília - DF',
        velocidade: 0,
        combustivel: 92,
        temperatura: 22,
        odometro: 89230,
        tempo_viagem: '0:00',
        ultimaAtualizacao: new Date(Date.now() - 300000),
        carga: 'Alimentos',
        peso: 8.7,
        efficiency: 3.1,
        nextMaintenance: 12000,
        alerts: [],
        routeProgress: 0
      },
      {
        id: 3,
        placa: 'GHI7J89',
        modelo: 'Mercedes Actros 2651',
        motorista: 'Pedro Costa',
        status: 'em_viagem',
        localizacao: 'BR-116, KM 128',
        destino: 'Porto Alegre - RS',
        velocidade: 82,
        combustivel: 68,
        temperatura: 16,
        odometro: 156780,
        tempo_viagem: '4:20',
        ultimaAtualizacao: new Date(Date.now() - 60000),
        carga: 'Automotivos',
        peso: 22.1,
        efficiency: 2.5,
        nextMaintenance: 2500,
        alerts: ['combustivel_baixo'],
        routeProgress: 45
      },
      {
        id: 4,
        placa: 'JKL0M12',
        modelo: 'Ford Cargo 2428',
        motorista: 'Ana Rodrigues',
        status: 'manutencao',
        localizacao: 'Oficina Central',
        destino: 'São Paulo - SP',
        velocidade: 0,
        combustivel: 45,
        temperatura: 25,
        odometro: 234560,
        tempo_viagem: '0:00',
        ultimaAtualizacao: new Date(Date.now() - 1800000),
        carga: 'Vazio',
        peso: 0,
        efficiency: 2.9,
        nextMaintenance: 0,
        alerts: ['em_manutencao'],
        routeProgress: 0
      },
      {
        id: 5,
        placa: 'MNO3P45',
        modelo: 'DAF XF 480',
        motorista: 'Roberto Silva',
        status: 'descanso',
        localizacao: 'Posto de Descanso - MG',
        destino: 'Belo Horizonte - MG',
        velocidade: 0,
        combustivel: 78,
        temperatura: 20,
        odometro: 189230,
        tempo_viagem: '0:00',
        ultimaAtualizacao: new Date(Date.now() - 900000),
        carga: 'Têxteis',
        peso: 12.5,
        efficiency: 2.7,
        nextMaintenance: 8000,
        alerts: [],
        routeProgress: 0
      }
    ];

    setVehicles(initialVehicles);
    setIsLoading(false);
    
    // Simula atualização em tempo real
    const interval = setInterval(() => {
      if (autoRefresh) {
        setVehicles(prev => prev.map(vehicle => ({
          ...vehicle,
          ultimaAtualizacao: new Date(),
          velocidade: vehicle.status === 'em_viagem' 
            ? Math.max(0, vehicle.velocidade + (Math.random() - 0.5) * 10)
            : 0,
          combustivel: Math.max(5, vehicle.combustivel - (Math.random() * 0.1)),
          routeProgress: vehicle.status === 'em_viagem' 
            ? Math.min(100, vehicle.routeProgress + (Math.random() * 2))
            : vehicle.routeProgress
        })));
        setLastUpdate(new Date());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const statusConfig = {
    'em_viagem': { 
      label: 'Em Viagem', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <FiNavigation />
    },
    'carregando': { 
      label: 'Carregando', 
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: <FiActivity />
    },
    'descanso': { 
      label: 'Em Descanso', 
      color: 'var(--gray-600)',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      icon: <FiClock />
    },
    'manutencao': { 
      label: 'Manutenção', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <FiSettings />
    },
    'parado': { 
      label: 'Parado', 
      color: 'var(--primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      icon: <FiPause />
    }
  };

  const alertConfig = {
    'combustivel_baixo': { label: 'Combustível Baixo', color: 'var(--error)', icon: <FiDroplet /> },
    'manutencao_proxima': { label: 'Manutenção Próxima', color: 'var(--warning)', icon: <FiSettings /> },
    'em_manutencao': { label: 'Em Manutenção', color: 'var(--error)', icon: <FiAlertCircle /> },
    'temperatura_alta': { label: 'Temperatura Alta', color: 'var(--error)', icon: <FiThermometer /> }
  };

  const filters = [
    { key: 'todos', label: 'Todos', icon: <FiTruck />, count: vehicles.length },
    { key: 'em_viagem', label: 'Em Viagem', icon: <FiNavigation />, count: vehicles.filter(v => v.status === 'em_viagem').length },
    { key: 'manutencao', label: 'Manutenção', icon: <FiSettings />, count: vehicles.filter(v => v.status === 'manutencao').length },
    { key: 'alertas', label: 'Com Alertas', icon: <FiAlertCircle />, count: vehicles.filter(v => v.alerts.length > 0).length }
  ];

  const filteredVehicles = useMemo(() => {
    if (activeFilter === 'todos') return vehicles;
    if (activeFilter === 'alertas') return vehicles.filter(v => v.alerts.length > 0);
    return vehicles.filter(v => v.status === activeFilter);
  }, [vehicles, activeFilter]);

  const stats = [
    {
      value: vehicles.length,
      label: 'Veículos Totais',
      icon: <FiTruck />,
      color: 'blue',
      change: '+2'
    },
    {
      value: vehicles.filter(v => v.status === 'em_viagem').length,
      label: 'Em Viagem',
      icon: <FiNavigation />,
      color: 'green',
      change: '+1'
    },
    {
      value: vehicles.filter(v => v.alerts.length > 0).length,
      label: 'Com Alertas',
      icon: <FiAlertCircle />,
      color: 'orange',
      change: '0'
    },
    {
      value: `${((vehicles.filter(v => v.status === 'em_viagem').length / vehicles.length) * 100).toFixed(0)}%`,
      label: 'Taxa de Utilização',
      icon: <IoStatsChart />,
      color: 'purple',
      change: '+5%'
    }
  ];

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    return `${Math.floor(diff / 3600)} h atrás`;
  };

  const handleContactDriver = (vehicle) => {
    // Simulação de contato
    alert(`Contatando motorista ${vehicle.motorista} (${vehicle.placa})`);
  };

  const handleViewRoute = (vehicle) => {
    // Simulação de visualização de rota
    alert(`Mostrando rota para ${vehicle.destino}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
    setLastUpdate(new Date());
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const vehicleCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4
      }
    }),
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <div className="monitoramento-loading-container">
        <div className="monitoramento-loading-content">
          <motion.div
            className="monitoramento-loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiNavigation className="monitoramento-spinner-icon" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Carregando Monitoramento
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Conectando com a frota em tempo real...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="monitoramento-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="monitoramento-header" variants={itemVariants}>
        <div className="monitoramento-header-content">
          <div className="monitoramento-header-text">
            <span className="monitoramento-welcome-badge">
              <FiNavigation />
              Monitoramento em Tempo Real
            </span>
            <h1>Controle da Frota</h1>
            <p className="monitoramento-header-subtitle">
              Acompanhe toda sua frota com atualizações em tempo real
            </p>
            <div className="monitoramento-last-update">
              <FiClock />
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              <span className={`auto-refresh-status ${autoRefresh ? 'active' : 'paused'}`}>
                {autoRefresh ? 'Atualização automática' : 'Atualização pausada'}
              </span>
            </div>
          </div>
          
          <div className="monitoramento-header-stats">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`monitoramento-stat-card monitoramento-stat-${stat.color}`}
                variants={itemVariants}
                whileHover={{ y: -2 }}
              >
                <div className="monitoramento-stat-background-pattern"></div>
                <div className="monitoramento-stat-content">
                  <div className="monitoramento-stat-main">
                    <div className="monitoramento-stat-icon-wrapper">
                      {stat.icon}
                    </div>
                    <div className="monitoramento-stat-values">
                      <h3>{stat.value}</h3>
                      <div className="monitoramento-stat-label">{stat.label}</div>
                      <div className={`monitoramento-stat-trend ${stat.change.includes('+') ? 'up' : 'neutral'}`}>
                        <span className="monitoramento-trend-icon">
                          {stat.change.includes('+') ? '↗' : '→'}
                        </span>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="monitoramento-header-actions">
          <motion.button 
            className={`monitoramento-btn-outline ${autoRefresh ? 'active' : ''}`}
            onClick={toggleAutoRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {autoRefresh ? <FiPause /> : <FiPlay />}
            {autoRefresh ? 'Pausar' : 'Retomar'} Auto
          </motion.button>
          <motion.button 
            className="monitoramento-btn-primary"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className="monitoramento-btn-icon" />
            Atualizar Agora
          </motion.button>
          <motion.button 
            className="monitoramento-btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBarChart2 className="monitoramento-btn-icon" />
            Relatórios
          </motion.button>
          <motion.button 
            className="monitoramento-btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSmartphone className="monitoramento-btn-icon" />
            App Mobile
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="monitoramento-content">
        {/* Vehicles Sidebar */}
        <motion.div className="monitoramento-sidebar" variants={itemVariants}>
          <div className="monitoramento-sidebar-header">
            <h3>Frota Ativa</h3>
            <div className="monitoramento-sidebar-controls">
              <span className="monitoramento-vehicles-count">
                {filteredVehicles.length} de {vehicles.length} veículos
              </span>
              <div className="monitoramento-filter-buttons">
                {filters.map(filter => (
                  <motion.button
                    key={filter.key}
                    className={`monitoramento-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="monitoramento-filter-icon">{filter.icon}</span>
                    {filter.label}
                    <span className="monitoramento-filter-count">{filter.count}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="monitoramento-vehicles-list">
            <AnimatePresence>
              {filteredVehicles.map((vehicle, index) => {
                const statusInfo = statusConfig[vehicle.status];
                return (
                  <motion.div
                    key={vehicle.id}
                    custom={index}
                    variants={vehicleCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`monitoramento-vehicle-card ${selectedVehicle?.id === vehicle.id ? 'active' : ''}`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="monitoramento-vehicle-header">
                      <div className="monitoramento-vehicle-info">
                        <div className="monitoramento-vehicle-main">
                          <span className="monitoramento-vehicle-placa">{vehicle.placa}</span>
                          <span className="monitoramento-vehicle-modelo">{vehicle.modelo}</span>
                        </div>
                        <div className="monitoramento-vehicle-secondary">
                          <span className="monitoramento-vehicle-driver">
                            <FiUser />
                            {vehicle.motorista}
                          </span>
                        </div>
                      </div>
                      <div 
                        className="monitoramento-status-indicator"
                        style={{ 
                          backgroundColor: statusInfo.bgColor,
                          borderColor: statusInfo.color,
                          color: statusInfo.color
                        }}
                      >
                        <span className="monitoramento-status-icon">{statusInfo.icon}</span>
                      </div>
                    </div>
                    
                    <div className="monitoramento-vehicle-details">
                      <div className="monitoramento-detail-row">
                        <span className="monitoramento-detail-label">
                          <MdLocationOn />
                          Destino:
                        </span>
                        <span className="monitoramento-detail-value">{vehicle.destino}</span>
                      </div>
                      <div className="monitoramento-detail-row">
                        <span className="monitoramento-detail-label">
                          <FiMap />
                          Localização:
                        </span>
                        <span className="monitoramento-detail-value truncate">{vehicle.localizacao}</span>
                      </div>
                      
                      {/* Alerts */}
                      <AnimatePresence>
                        {vehicle.alerts.length > 0 && (
                          <motion.div 
                            className="monitoramento-alerts-container"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {vehicle.alerts.map(alert => (
                              <div key={alert} className="monitoramento-alert-badge">
                                {alertConfig[alert]?.icon}
                                {alertConfig[alert]?.label}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="monitoramento-metrics-row">
                        <div className="monitoramento-metric">
                          <span className="monitoramento-metric-icon">
                            <MdSpeed />
                          </span>
                          <span>{vehicle.velocidade} km/h</span>
                        </div>
                        <div className="monitoramento-metric">
                          <span className="monitoramento-metric-icon">
                            <MdLocalGasStation />
                          </span>
                          <span>{vehicle.combustivel}%</span>
                        </div>
                        <div className="monitoramento-metric">
                          <span className="monitoramento-metric-icon">
                            <MdDirectionsCar />
                          </span>
                          <span>{(vehicle.odometro / 1000).toFixed(0)}K km</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="monitoramento-vehicle-footer">
                      <span className="monitoramento-update-time">
                        <FiClock />
                        {getTimeAgo(vehicle.ultimaAtualizacao)}
                      </span>
                      <div className="monitoramento-vehicle-actions">
                        <motion.button 
                          className="monitoramento-btn-icon-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactDriver(vehicle);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiPhone />
                        </motion.button>
                        <motion.button 
                          className="monitoramento-btn-icon-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRoute(vehicle);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiMap />
                        </motion.button>
                      </div>
                    </div>

                    {/* Progress Bar for traveling vehicles */}
                    {vehicle.status === 'em_viagem' && (
                      <div className="monitoramento-route-progress">
                        <div className="monitoramento-progress-bar">
                          <motion.div 
                            className="monitoramento-progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${vehicle.routeProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            style={{ backgroundColor: statusInfo.color }}
                          />
                        </div>
                        <span className="monitoramento-progress-text">
                          {vehicle.routeProgress.toFixed(0)}% concluído
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div className="monitoramento-map-container" variants={itemVariants}>
          <div className="monitoramento-map-header">
            <h3>Visualização da Rota</h3>
            <div className="monitoramento-map-controls">
              <motion.button 
                className={`monitoramento-map-btn ${mapView === 'satellite' ? 'active' : ''}`}
                onClick={() => setMapView('satellite')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdSatellite />
                Satélite
              </motion.button>
              <motion.button 
                className={`monitoramento-map-btn ${mapView === 'traffic' ? 'active' : ''}`}
                onClick={() => setMapView('traffic')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdTraffic />
                Tráfego
              </motion.button>
              <motion.button 
                className="monitoramento-map-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdMyLocation />
                Minha Localização
              </motion.button>
            </div>
          </div>
          <div className="monitoramento-map-placeholder">
            <div className="monitoramento-map-content">
              <div className="monitoramento-map-visualization">
                {selectedVehicle ? (
                  <motion.div 
                    className="monitoramento-route-map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="monitoramento-route-path">
                      <div className="monitoramento-route-start">
                        <span className="monitoramento-route-marker start">
                          <FiFlag />
                        </span>
                        <span>Origem - São Paulo</span>
                      </div>
                      <div className="monitoramento-route-line">
                        <motion.div 
                          className="monitoramento-route-progress-line"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </div>
                      <div className="monitoramento-route-current">
                        <motion.span 
                          className="monitoramento-route-marker vehicle"
                          animate={{ 
                            y: [0, -10, 0],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <FiTruck />
                        </motion.span>
                        <span>{selectedVehicle.localizacao}</span>
                      </div>
                      <div className="monitoramento-route-line">
                        <motion.div 
                          className="monitoramento-route-progress-line"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </div>
                      <div className="monitoramento-route-end">
                        <span className="monitoramento-route-marker end">
                          <FiNavigation />
                        </span>
                        <span>Destino - {selectedVehicle.destino}</span>
                      </div>
                    </div>
                    <div className="monitoramento-vehicle-on-map">
                      <h4>{selectedVehicle.placa}</h4>
                      <p>
                        <MdLocationOn />
                        Posição atual: {selectedVehicle.localizacao}
                      </p>
                      <div className="monitoramento-map-stats">
                        <span>Velocidade: {selectedVehicle.velocidade} km/h</span>
                        <span>Combustível: {selectedVehicle.combustivel}%</span>
                        <span>Progresso: {selectedVehicle.routeProgress.toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="monitoramento-no-vehicle-selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="monitoramento-map-icon">
                      <FiMap />
                    </div>
                    <h3>Mapa em Tempo Real</h3>
                    <p>Selecione um veículo para visualizar a rota e localização</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Sidebar */}
        <motion.div className="monitoramento-details-sidebar" variants={itemVariants}>
          <AnimatePresence>
            {selectedVehicle ? (
              <motion.div 
                className="monitoramento-vehicle-details-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="monitoramento-panel-header">
                  <div className="monitoramento-vehicle-title">
                    <h3>{selectedVehicle.placa}</h3>
                    <span className="monitoramento-vehicle-model">{selectedVehicle.modelo}</span>
                  </div>
                  <div 
                    className="monitoramento-status-badge"
                    style={{ 
                      backgroundColor: statusConfig[selectedVehicle.status].bgColor,
                      borderColor: statusConfig[selectedVehicle.status].color,
                      color: statusConfig[selectedVehicle.status].color
                    }}
                  >
                    <span className="monitoramento-status-icon">
                      {statusConfig[selectedVehicle.status].icon}
                    </span>
                    {statusConfig[selectedVehicle.status].label}
                  </div>
                </div>
                
                <div className="monitoramento-driver-info">
                  <div className="monitoramento-driver-avatar">
                    {selectedVehicle.motorista.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="monitoramento-driver-details">
                    <span className="monitoramento-driver-name">{selectedVehicle.motorista}</span>
                    <span className="monitoramento-driver-contact">
                      <FiPhone />
                      Contatar Motorista
                    </span>
                  </div>
                </div>

                <div className="monitoramento-details-grid">
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <MdLocalGasStation />
                      </span>
                      <span className="monitoramento-detail-label">Combustível</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.combustivel}%</span>
                      <div className="monitoramento-progress-bar">
                        <motion.div 
                          className="monitoramento-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedVehicle.combustivel}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          style={{ 
                            backgroundColor: selectedVehicle.combustivel < 20 ? 'var(--error)' : 
                                         selectedVehicle.combustivel < 40 ? 'var(--warning)' : 'var(--success)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <FiThermometer />
                      </span>
                      <span className="monitoramento-detail-label">Temperatura</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.temperatura}°C</span>
                      <span className="monitoramento-detail-subtext">Carga: {selectedVehicle.carga}</span>
                    </div>
                  </div>
                  
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <IoSpeedometerOutline />
                      </span>
                      <span className="monitoramento-detail-label">Velocidade</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.velocidade} km/h</span>
                      <span className="monitoramento-detail-subtext">
                        Eficiência: {selectedVehicle.efficiency} km/L
                      </span>
                    </div>
                  </div>
                  
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <MdDirectionsCar />
                      </span>
                      <span className="monitoramento-detail-label">Odômetro</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">
                        {selectedVehicle.odometro.toLocaleString('pt-BR')} km
                      </span>
                      <span className="monitoramento-detail-subtext">
                        Próxima manutenção: {selectedVehicle.nextMaintenance} km
                      </span>
                    </div>
                  </div>

                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <IoTimeOutline />
                      </span>
                      <span className="monitoramento-detail-label">Tempo de Viagem</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.tempo_viagem}h</span>
                      <span className="monitoramento-detail-subtext">
                        Progresso: {selectedVehicle.routeProgress.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <FiActivity />
                      </span>
                      <span className="monitoramento-detail-label">Carga</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.peso} ton</span>
                      <span className="monitoramento-detail-subtext">{selectedVehicle.carga}</span>
                    </div>
                  </div>
                </div>
                
                <div className="monitoramento-vehicle-actions-panel">
                  <motion.button 
                    className="monitoramento-btn-primary"
                    onClick={() => handleContactDriver(selectedVehicle)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPhone className="monitoramento-btn-icon" />
                    Contatar Motorista
                  </motion.button>
                  <motion.button 
                    className="monitoramento-btn-outline"
                    onClick={() => handleViewRoute(selectedVehicle)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMap className="monitoramento-btn-icon" />
                    Detalhes da Rota
                  </motion.button>
                  <motion.button 
                    className="monitoramento-btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiBarChart2 className="monitoramento-btn-icon" />
                    Histórico
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="monitoramento-no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="monitoramento-no-selection-icon">
                  <FiTruck />
                </div>
                <h4>Nenhum veículo selecionado</h4>
                <p>Selecione um veículo da lista para visualizar detalhes e localização</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Monitoramento;