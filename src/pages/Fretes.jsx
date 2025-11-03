import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiMap,
  FiPlus,
  FiArrowRight,
  FiPackage,
  FiUser,
  FiCalendar,
  FiNavigation,
  FiBarChart2,
  FiRefreshCw,
  FiMoreVertical,
  FiStar,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { 
  MdLocalShipping, 
  MdPendingActions,
  MdCheckCircleOutline,
  MdCancel,
  MdLocationOn,
  MdExpandMore,
  MdWarning
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoSpeedometerOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

import '../styles/fretes.css'

const Fretes = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('ativos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFrete, setSelectedFrete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    valor: { min: 0, max: 10000 },
    data: ''
  });

  // Simular loading inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const fretes = [
    {
      id: 'TRK-2348',
      cliente: 'Logística Brasil LTDA',
      origem: 'São Paulo - SP',
      destino: 'Rio de Janeiro - RJ',
      peso: '12.5t',
      valor: 4200.00,
      status: 'em_transito',
      dataColeta: '2024-01-15',
      dataEntrega: '2024-01-16',
      motorista: 'Carlos Santos',
      veiculo: 'Volvo FH - ABC1I23',
      progresso: 65,
      prioridade: 'alta',
      notas: 'Carga frágil - Manuseio especial necessário'
    },
    {
      id: 'TRK-2349',
      cliente: 'Mercado Express',
      origem: 'Belo Horizonte - MG',
      destino: 'Brasília - DF',
      peso: '8.2t',
      valor: 3800.00,
      status: 'carregando',
      dataColeta: '2024-01-15',
      dataEntrega: '2024-01-17',
      motorista: 'Maria Oliveira',
      veiculo: 'Scania R440 - DEF4G56',
      progresso: 30,
      prioridade: 'media',
      notas: 'Entrega urgente - Cliente premium'
    },
    {
      id: 'TRK-2350',
      cliente: 'Indústria Nacional',
      origem: 'Curitiba - PR',
      destino: 'Porto Alegre - RS',
      peso: '15.8t',
      valor: 5100.00,
      status: 'pendente',
      dataColeta: '2024-01-16',
      dataEntrega: '2024-01-18',
      motorista: 'Pedro Costa',
      veiculo: 'Mercedes Actros - GHI7J89',
      progresso: 0,
      prioridade: 'baixa',
      notas: 'Aguardando documentação'
    },
    {
      id: 'TRK-2351',
      cliente: 'Exportadora Nacional',
      origem: 'Santos - SP',
      destino: 'Porto de Itajaí - SC',
      peso: '22.3t',
      valor: 8750.00,
      status: 'entregue',
      dataColeta: '2024-01-10',
      dataEntrega: '2024-01-14',
      motorista: 'João Silva',
      veiculo: 'Volvo FH - JKL0M12',
      progresso: 100,
      prioridade: 'media',
      notas: 'Entregue com sucesso - Cliente satisfeito'
    },
    {
      id: 'TRK-2352',
      cliente: 'Distribuidora Rápida',
      origem: 'Campinas - SP',
      destino: 'Goiânia - GO',
      peso: '5.7t',
      valor: 3200.00,
      status: 'em_transito',
      dataColeta: '2024-01-14',
      dataEntrega: '2024-01-16',
      motorista: 'Ana Rodrigues',
      veiculo: 'Ford Cargo - MNO3P45',
      progresso: 45,
      prioridade: 'alta',
      notas: 'Monitoramento GPS ativo'
    }
  ];

  const statusConfig = {
    em_transito: { 
      label: 'Em Trânsito', 
      color: 'blue', 
      icon: <MdLocalShipping />,
      bgColor: 'var(--primary-10)',
      borderColor: 'var(--primary)'
    },
    carregando: { 
      label: 'Carregando', 
      color: 'orange', 
      icon: <FiPackage />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'var(--warning)'
    },
    pendente: { 
      label: 'Pendente', 
      color: 'yellow', 
      icon: <MdPendingActions />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'var(--warning)'
    },
    entregue: { 
      label: 'Entregue', 
      color: 'green', 
      icon: <MdCheckCircleOutline />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'var(--success)'
    },
    cancelado: { 
      label: 'Cancelado', 
      color: 'red', 
      icon: <MdCancel />,
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'var(--error)'
    }
  };

  const prioridadeConfig = {
    alta: { label: 'Alta', color: 'var(--error)', icon: <MdWarning /> },
    media: { label: 'Média', color: 'var(--warning)', icon: <FiAlertCircle /> },
    baixa: { label: 'Baixa', color: 'var(--success)', icon: <FiCheckCircle /> }
  };

  const stats = [
    { 
      value: '18', 
      label: 'Fretes Ativos', 
      icon: <FiTruck />, 
      color: 'blue',
      change: '+12%',
      desc: 'Em andamento'
    },
    { 
      value: '24', 
      label: 'Entregues (Mês)', 
      icon: <FiCheckCircle />, 
      color: 'green',
      change: '+8%',
      desc: 'Janeiro 2024'
    },
    { 
      value: '5', 
      label: 'Para Hoje', 
      icon: <FiClock />, 
      color: 'orange',
      change: '-2%',
      desc: 'Prioritários'
    },
    { 
      value: 'R$ 42.5k', 
      label: 'Faturamento', 
      icon: <FiDollarSign />, 
      color: 'purple',
      change: '+15%',
      desc: 'Este mês'
    }
  ];

  const tabs = [
    { key: 'ativos', label: 'Ativos', icon: <FiTruck />, count: 18 },
    { key: 'pendentes', label: 'Pendentes', icon: <MdPendingActions />, count: 5 },
    { key: 'entregues', label: 'Entregues', icon: <FiCheckCircle />, count: 24 },
    { key: 'todos', label: 'Todos', icon: <FiFilter />, count: 47 }
  ];

  const quickActions = [
    { 
      icon: <FiPlus />, 
      title: 'Novo Frete', 
      description: 'Criar novo pedido de transporte',
      color: 'var(--primary)',
      action: () => onNavigate('novo-frete')
    },
    { 
      icon: <FiMap />, 
      title: 'Rastreamento', 
      description: 'Acompanhe fretes em tempo real',
      color: 'var(--success)',
      action: () => console.log('Rastrear')
    },
    { 
      icon: <FiBarChart2 />, 
      title: 'Relatórios', 
      description: 'Gerar relatórios de desempenho',
      color: 'var(--warning)',
      action: () => console.log('Relatórios')
    },
    { 
      icon: <FiDownload />, 
      title: 'Exportar Dados', 
      description: 'Exportar planilha com dados',
      color: 'var(--info)',
      action: () => console.log('Exportar')
    }
  ];

  // Função de ordenação
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filtragem e ordenação
  const filteredAndSortedFretes = useMemo(() => {
    let filtered = fretes.filter(frete =>
      frete.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frete.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frete.motorista.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aplicar filtros adicionais
    if (filters.status.length > 0) {
      filtered = filtered.filter(frete => filters.status.includes(frete.status));
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [fretes, searchTerm, filters, sortConfig]);

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

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4
      }
    }),
    hover: {
      backgroundColor: 'var(--gray-50)',
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <div className="fretes-loading-container">
        <div className="fretes-loading-content">
          <motion.div
            className="fretes-loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiTruck className="fretes-spinner-icon" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Carregando Fretes
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Preparando sua dashboard de transportes...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="fretes-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ marginTop: '0' }}
    >
      {/* Header Section */}
      <motion.div className="fretes-header" variants={itemVariants}>
        <div className="fretes-header-content">
          <div className="fretes-header-text">
            <span className="fretes-welcome-badge">
              <FiTruck />
              Gestão de Transportes
            </span>
            <h1>Gerenciar Fretes</h1>
            <p className="fretes-header-subtitle">
              Controle completo das cargas e transportes em tempo real
            </p>
          </div>
          <div className="fretes-header-actions">
            <motion.button 
              className="fretes-btn-primary fretes-btn-large"
              onClick={() => onNavigate('novo-frete')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className="fretes-btn-icon" />
              Novo Frete
            </motion.button>
            <motion.button 
              className="fretes-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="fretes-btn-icon" />
              Atualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="fretes-stats-grid" variants={containerVariants}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`fretes-stat-card fretes-stat-${stat.color}`}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="fretes-stat-background-pattern"></div>
            <div className="fretes-stat-glow"></div>
            <div className="fretes-stat-content">
              <div className="fretes-stat-main">
                <div className="fretes-stat-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="fretes-stat-values">
                  <h3>{stat.value}</h3>
                  <div className="fretes-stat-label">{stat.label}</div>
                  <div className="fretes-stat-desc">{stat.desc}</div>
                  <div className={`fretes-stat-trend ${stat.change.includes('+') ? 'up' : 'down'}`}>
                    <span className="fretes-trend-icon">
                      {stat.change.includes('+') ? '↗' : '↘'}
                    </span>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
            <div className="fretes-stat-chart">
              {[20, 45, 30, 60, 40, 70, 50].map((height, i) => (
                <motion.div
                  key={i}
                  className="fretes-chart-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 + i * 0.05, duration: 0.5 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="fretes-quick-actions" variants={itemVariants}>
        <div className="fretes-quick-actions-grid">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className="fretes-quick-action-card"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              style={{ '--action-color': action.color }}
            >
              <div className="fretes-action-card-glow"></div>
              <div className="fretes-action-card-background"></div>
              <div className="fretes-action-card-header">
                <div className="fretes-action-icon-container">
                  <div className="fretes-action-icon">
                    {action.icon}
                  </div>
                </div>
                <div className="fretes-action-arrow">
                  <FiArrowRight />
                </div>
              </div>
              <div className="fretes-action-card-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="fretes-action-hover-effect"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div className="fretes-controls-section" variants={itemVariants}>
        <div className="fretes-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              className={`fretes-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="fretes-tab-icon">{tab.icon}</span>
              {tab.label}
              <span className="fretes-tab-count">{tab.count}</span>
            </motion.button>
          ))}
        </div>
        
        <div className="fretes-search-controls">
          <motion.div 
            className="fretes-search-box"
            whileFocus={{ scale: 1.02 }}
          >
            <FiSearch className="fretes-search-icon" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente ou motorista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fretes-search-input"
            />
            {searchTerm && (
              <motion.button 
                className="fretes-search-clear"
                onClick={() => setSearchTerm('')}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                ×
              </motion.button>
            )}
          </motion.div>

          <div className="fretes-controls-buttons">
            <motion.button 
              className={`fretes-btn-outline ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen(!filterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFilter className="fretes-btn-icon" />
              Filtros
              {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
            <motion.button 
              className="fretes-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload className="fretes-btn-icon" />
              Exportar
            </motion.button>
          </div>
        </div>

        {/* Filtros Expandíveis */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div 
              className="fretes-filters-expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="fretes-filters-content">
                <div className="fretes-filter-group">
                  <label>Status</label>
                  <div className="fretes-filter-chips">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <motion.button
                        key={key}
                        className={`fretes-filter-chip ${filters.status.includes(key) ? 'active' : ''}`}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            status: prev.status.includes(key)
                              ? prev.status.filter(s => s !== key)
                              : [...prev.status, key]
                          }))
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          backgroundColor: filters.status.includes(key) ? config.bgColor : 'var(--gray-100)',
                          borderColor: filters.status.includes(key) ? config.borderColor : 'var(--gray-300)'
                        }}
                      >
                        {config.icon}
                        {config.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Table Section */}
      <motion.div className="fretes-table-container" variants={itemVariants}>
        <AnimatePresence>
          {filteredAndSortedFretes.length > 0 ? (
            <motion.div 
              className="fretes-table-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <table className="fretes-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>
                      <div className="fretes-th-content">
                        ID do Frete
                        <motion.span 
                          className="fretes-sort-indicator"
                          animate={{ rotate: sortConfig.key === 'id' && sortConfig.direction === 'desc' ? 180 : 0 }}
                        >
                          <MdExpandMore />
                        </motion.span>
                      </div>
                    </th>
                    <th onClick={() => handleSort('cliente')}>
                      <div className="fretes-th-content">
                        Cliente
                        <motion.span 
                          className="fretes-sort-indicator"
                          animate={{ rotate: sortConfig.key === 'cliente' && sortConfig.direction === 'desc' ? 180 : 0 }}
                        >
                          <MdExpandMore />
                        </motion.span>
                      </div>
                    </th>
                    <th>Origem → Destino</th>
                    <th onClick={() => handleSort('peso')}>
                      <div className="fretes-th-content">
                        Peso
                        <motion.span 
                          className="fretes-sort-indicator"
                          animate={{ rotate: sortConfig.key === 'peso' && sortConfig.direction === 'desc' ? 180 : 0 }}
                        >
                          <MdExpandMore />
                        </motion.span>
                      </div>
                    </th>
                    <th onClick={() => handleSort('valor')}>
                      <div className="fretes-th-content">
                        Valor
                        <motion.span 
                          className="fretes-sort-indicator"
                          animate={{ rotate: sortConfig.key === 'valor' && sortConfig.direction === 'desc' ? 180 : 0 }}
                        >
                          <MdExpandMore />
                        </motion.span>
                      </div>
                    </th>
                    <th>Status</th>
                    <th>Motorista</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedFretes.map((frete, index) => (
                    <motion.tr
                      key={frete.id}
                      custom={index}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="fretes-row"
                    >
                      <td>
                        <div className="fretes-id-cell">
                          <div className="fretes-id-content">
                            <span className="fretes-id-text">{frete.id}</span>
                            {frete.prioridade === 'alta' && (
                              <motion.span 
                                className="fretes-priority-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <FiStar />
                                Alta Prioridade
                              </motion.span>
                            )}
                          </div>
                          <span className="fretes-date">
                            <FiCalendar />
                            {frete.dataColeta}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="fretes-cliente-info">
                          <span className="fretes-cliente-name">{frete.cliente}</span>
                          <span className="fretes-veiculo">
                            <FiTruck />
                            {frete.veiculo}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="fretes-route-info">
                          <span className="fretes-origin">
                            <MdLocationOn />
                            {frete.origem}
                          </span>
                          <motion.span 
                            className="fretes-arrow"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <FiArrowRight />
                          </motion.span>
                          <span className="fretes-destination">
                            <MdLocationOn />
                            {frete.destino}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="fretes-peso">
                          <FiPackage />
                          {frete.peso}
                        </span>
                      </td>
                      <td>
                        <span className="fretes-valor">
                          <FiDollarSign />
                          {frete.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td>
                        <motion.div 
                          className={`fretes-status-badge fretes-status-${frete.status}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="fretes-status-content">
                            {statusConfig[frete.status].icon}
                            {statusConfig[frete.status].label}
                            {frete.progresso > 0 && frete.progresso < 100 && (
                              <div className="fretes-progress-bar">
                                <motion.div 
                                  className="fretes-progress-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${frete.progresso}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </td>
                      <td>
                        <div className="fretes-motorista-info">
                          <span className="fretes-motorista-name">
                            <FiUser />
                            {frete.motorista}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="fretes-action-buttons">
                          <motion.button 
                            className="fretes-action-btn fretes-action-view" 
                            title="Visualizar"
                            whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-10)' }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEye />
                          </motion.button>
                          <motion.button 
                            className="fretes-action-btn fretes-action-edit" 
                            title="Editar"
                            whileHover={{ scale: 1.1, backgroundColor: 'var(--warning-10)' }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit />
                          </motion.button>
                          <motion.button 
                            className="fretes-action-btn fretes-action-track" 
                            title="Rastrear"
                            whileHover={{ scale: 1.1, backgroundColor: 'var(--success-10)' }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiNavigation />
                          </motion.button>
                          <motion.button 
                            className="fretes-action-btn fretes-action-more" 
                            title="Mais opções"
                            whileHover={{ scale: 1.1, backgroundColor: 'var(--gray-100)' }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiMoreVertical />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div 
              className="fretes-empty-state"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="fretes-empty-icon">
                <FiTruck />
              </div>
              <h3>Nenhum frete encontrado</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos</p>
              <motion.button 
                className="fretes-btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ status: [], valor: { min: 0, max: 10000 }, data: '' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="fretes-btn-icon" />
                Limpar Filtros
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Summary */}
      <motion.div className="fretes-footer-summary" variants={itemVariants}>
        <div className="fretes-summary-content">
          <div className="fretes-summary-item">
            <span className="fretes-summary-label">Total de Fretes:</span>
            <span className="fretes-summary-value">{filteredAndSortedFretes.length}</span>
          </div>
          <div className="fretes-summary-item">
            <span className="fretes-summary-label">Valor Total:</span>
            <span className="fretes-summary-value">
              {filteredAndSortedFretes.reduce((sum, frete) => sum + frete.valor, 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="fretes-summary-item">
            <span className="fretes-summary-label">Última Atualização:</span>
            <span className="fretes-summary-value">Agora mesmo</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Fretes;