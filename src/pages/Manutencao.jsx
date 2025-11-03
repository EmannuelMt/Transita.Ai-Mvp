import React, { useState, useMemo } from 'react';
import { 
  FiTool, 
  FiCalendar, 
  FiAlertTriangle, 
  FiDollarSign,
  FiFilter,
  FiDownload,
  FiEdit,
  FiEye,
  FiCheckCircle,
  FiPlus,
  FiClock,
  FiTruck,
  FiSettings,
  FiFileText,
  FiRefreshCw,
  FiBarChart2,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { 
  MdBuild,
  MdSchedule,
  MdWarning,
  MdCheckCircleOutline,
  MdCancel,
  MdLocalShipping
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoSettingsOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Manutencao.css';


const Manutencao = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedManutencao, setSelectedManutencao] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipo: [],
    prioridade: [],
    status: []
  });

  const manutencoes = [
    {
      id: 1,
      veiculo: 'Volvo FH - ABC1I23',
      placa: 'ABC1I23',
      modelo: 'Volvo FH 540',
      tipo: 'preventiva',
      descricao: 'Troca de óleo e filtros - Revisão periódica dos sistemas de lubrificação e filtragem do motor',
      dataSolicitacao: '2024-01-15',
      dataAgendada: '2024-01-20',
      dataConclusao: null,
      status: 'agendada',
      prioridade: 'alta',
      custoEstimado: 1200.00,
      custoReal: null,
      tempoEstimado: '4 horas',
      fornecedor: 'Oficina Central',
      mecanico: 'João Silva',
      pecas: ['Óleo motor', 'Filtro óleo', 'Filtro ar', 'Filtro combustível'],
      observacoes: 'Verificar também sistema de arrefecimento',
      historico: [
        { data: '2024-01-15', evento: 'Solicitação registrada', usuario: 'Sistema' },
        { data: '2024-01-16', evento: 'Agendamento confirmado', usuario: 'Maria Santos' }
      ]
    },
    {
      id: 2,
      veiculo: 'Scania R440 - DEF4G56',
      placa: 'DEF4G56',
      modelo: 'Scania R440',
      tipo: 'corretiva',
      descricao: 'Problema no sistema de freios - Reparo urgente no circuito hidráulico',
      dataSolicitacao: '2024-01-14',
      dataAgendada: '2024-01-16',
      dataConclusao: null,
      status: 'andamento',
      prioridade: 'urgente',
      custoEstimado: 2500.00,
      custoReal: null,
      tempoEstimado: '8 horas',
      fornecedor: 'Especialista em Freios',
      mecanico: 'Carlos Oliveira',
      pecas: ['Pastilhas freio', 'Discos', 'Cilindro mestre', 'Fluido freio'],
      observacoes: 'Veículo parado - Necessita reparo imediato',
      historico: [
        { data: '2024-01-14', evento: 'Solicitação urgente', usuario: 'Motorista' },
        { data: '2024-01-15', evento: 'Início dos reparos', usuario: 'Carlos Oliveira' }
      ]
    },
    {
      id: 3,
      veiculo: 'Mercedes Actros - GHI7J89',
      placa: 'GHI7J89',
      modelo: 'Mercedes Actros 2651',
      tipo: 'preventiva',
      descricao: 'Revisão periódica 50.000km - Inspeção completa do veículo',
      dataSolicitacao: '2024-01-10',
      dataAgendada: '2024-01-25',
      dataConclusao: null,
      status: 'agendada',
      prioridade: 'media',
      custoEstimado: 800.00,
      custoReal: null,
      tempoEstimado: '6 horas',
      fornecedor: 'Oficina Central',
      mecanico: 'Pedro Costa',
      pecas: ['Óleo diferencial', 'Filtros', 'Velas', 'Correia dentada'],
      observacoes: 'Verificar também alinhamento e balanceamento',
      historico: [
        { data: '2024-01-10', evento: 'Solicitação registrada', usuario: 'Sistema' }
      ]
    },
    {
      id: 4,
      veiculo: 'Ford Cargo - JKL0M12',
      placa: 'JKL0M12',
      modelo: 'Ford Cargo 2428',
      tipo: 'corretiva',
      descricao: 'Troca de embreagem - Desgaste excessivo do sistema',
      dataSolicitacao: '2024-01-12',
      dataAgendada: '2024-01-18',
      dataConclusao: '2024-01-18',
      status: 'concluida',
      prioridade: 'alta',
      custoEstimado: 1800.00,
      custoReal: 1750.00,
      tempoEstimado: '5 horas',
      fornecedor: 'Oficina Central',
      mecanico: 'Ana Rodrigues',
      pecas: ['Kit embreagem', 'Fluido', 'Cabo embreagem'],
      observacoes: 'Serviço concluído com sucesso',
      historico: [
        { data: '2024-01-12', evento: 'Solicitação registrada', usuario: 'Sistema' },
        { data: '2024-01-18', evento: 'Serviço iniciado', usuario: 'Ana Rodrigues' },
        { data: '2024-01-18', evento: 'Serviço concluído', usuario: 'Ana Rodrigues' }
      ]
    },
    {
      id: 5,
      veiculo: 'DAF XF - MNO3P45',
      placa: 'MNO3P45',
      modelo: 'DAF XF 480',
      tipo: 'preventiva',
      descricao: 'Troca de pneus - Rodízio e balanceamento completo',
      dataSolicitacao: '2024-01-13',
      dataAgendada: '2024-01-22',
      dataConclusao: null,
      status: 'agendada',
      prioridade: 'baixa',
      custoEstimado: 3200.00,
      custoReal: null,
      tempoEstimado: '3 horas',
      fornecedor: 'Borracheiro Especializado',
      mecanico: 'Roberto Lima',
      pecas: ['6 Pneus novos', 'Válvulas', 'Balanceamento'],
      observacoes: 'Pneus com desgaste irregular',
      historico: [
        { data: '2024-01-13', evento: 'Solicitação registrada', usuario: 'Sistema' }
      ]
    }
  ];

  const statusConfig = {
    agendada: { 
      label: 'Agendada', 
      color: 'var(--primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      icon: <MdSchedule />
    },
    andamento: { 
      label: 'Em Andamento', 
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: <MdBuild />
    },
    concluida: { 
      label: 'Concluída', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <MdCheckCircleOutline />
    },
    cancelada: { 
      label: 'Cancelada', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <MdCancel />
    }
  };

  const prioridadeConfig = {
    urgente: { 
      label: 'Urgente', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <FiAlertTriangle />
    },
    alta: { 
      label: 'Alta', 
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: <MdWarning />
    },
    media: { 
      label: 'Média', 
      color: 'var(--primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      icon: <IoSettingsOutline />
    },
    baixa: { 
      label: 'Baixa', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <FiSettings />
    }
  };

  const tipoConfig = {
    preventiva: { label: 'Preventiva', color: 'var(--primary)', icon: <FiSettings /> },
    corretiva: { label: 'Corretiva', color: 'var(--warning)', icon: <FiTool /> },
    preditiva: { label: 'Preditiva', color: 'var(--info)', icon: <FiBarChart2 /> }
  };

  const stats = [
    { 
      value: '8', 
      label: 'Pendentes', 
      icon: <FiTool />, 
      color: 'orange',
      change: '+2',
      desc: 'Aguardando ação'
    },
    { 
      value: '5', 
      label: 'Agendadas', 
      icon: <FiCalendar />, 
      color: 'blue',
      change: '+1',
      desc: 'Esta semana'
    },
    { 
      value: '2', 
      label: 'Urgentes', 
      icon: <FiAlertTriangle />, 
      color: 'red',
      change: '0',
      desc: 'Necessitam atenção'
    },
    { 
      value: 'R$ 12.4k', 
      label: 'Custo Mensal', 
      icon: <FiDollarSign />, 
      color: 'green',
      change: '-5%',
      desc: 'Vs mês anterior'
    }
  ];

  const tabs = [
    { key: 'pendentes', label: 'Pendentes', icon: <FiTool />, count: 8 },
    { key: 'andamento', label: 'Em Andamento', icon: <MdBuild />, count: 3 },
    { key: 'concluidas', label: 'Concluídas', icon: <FiCheckCircle />, count: 12 },
    { key: 'todas', label: 'Todas', icon: <FiFilter />, count: 23 }
  ];

  const alerts = [
    {
      id: 1,
      tipo: 'critical',
      titulo: 'Manutenção Urgente',
      descricao: 'Scania DEF4G56 - Problema crítico no sistema de freios',
      tempo: 'Necessita atenção imediata',
      icon: <FiAlertTriangle />,
      acao: 'Reparo urgente necessário'
    },
    {
      id: 2,
      tipo: 'warning',
      titulo: 'Preventiva Próxima',
      descricao: 'Volvo ABC1I23 - Revisão programada em 5 dias',
      tempo: 'Agendar com urgência',
      icon: <FiClock />,
      acao: 'Confirmar agendamento'
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Documentação',
      descricao: '3 veículos com documentação próxima do vencimento',
      tempo: 'Verificar documentos',
      icon: <FiFileText />,
      acao: 'Regularizar documentação'
    }
  ];

  const filteredManutencoes = useMemo(() => {
    let filtered = manutencoes;

    // Filtro por tipo
    if (filters.tipo.length > 0) {
      filtered = filtered.filter(m => filters.tipo.includes(m.tipo));
    }

    // Filtro por prioridade
    if (filters.prioridade.length > 0) {
      filtered = filtered.filter(m => filters.prioridade.includes(m.prioridade));
    }

    // Filtro por status
    if (filters.status.length > 0) {
      filtered = filtered.filter(m => filters.status.includes(m.status));
    }

    return filtered;
  }, [manutencoes, filters]);

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

  const cardVariants = {
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

  return (
    <motion.div 
      className="manutencao-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="manutencao-header" variants={itemVariants}>
        <div className="manutencao-header-content">
          <div className="manutencao-header-text">
            <span className="manutencao-welcome-badge">
              <FiTool />
              Gestão de Manutenção
            </span>
            <h1>Controle de Manutenções</h1>
            <p className="manutencao-header-subtitle">
              Gerencie e acompanhe toda a manutenção da frota em um só lugar
            </p>
          </div>
          <div className="manutencao-header-actions">
            <motion.button 
              className="manutencao-btn-primary manutencao-btn-large"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className="manutencao-btn-icon" />
              Nova Manutenção
            </motion.button>
            <motion.button 
              className="manutencao-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="manutencao-btn-icon" />
              Atualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="manutencao-stats-grid" variants={containerVariants}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`manutencao-stat-card manutencao-stat-${stat.color}`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="manutencao-stat-background-pattern"></div>
            <div className="manutencao-stat-glow"></div>
            <div className="manutencao-stat-content">
              <div className="manutencao-stat-main">
                <div className="manutencao-stat-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="manutencao-stat-values">
                  <h3>{stat.value}</h3>
                  <div className="manutencao-stat-label">{stat.label}</div>
                  <div className="manutencao-stat-desc">{stat.desc}</div>
                  <div className={`manutencao-stat-trend ${stat.change.includes('+') ? 'up' : stat.change.includes('-') ? 'down' : 'neutral'}`}>
                    <span className="manutencao-trend-icon">
                      {stat.change.includes('+') ? '↗' : stat.change.includes('-') ? '↘' : '→'}
                    </span>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
            <div className="manutencao-stat-chart">
              {[30, 45, 20, 60, 40, 70, 50].map((height, i) => (
                <motion.div
                  key={i}
                  className="manutencao-chart-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 + i * 0.05, duration: 0.5 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls Section */}
      <motion.div className="manutencao-controls-section" variants={itemVariants}>
        <div className="manutencao-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              className={`manutencao-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="manutencao-tab-icon">{tab.icon}</span>
              {tab.label}
              <span className="manutencao-tab-count">{tab.count}</span>
            </motion.button>
          ))}
        </div>
        
        <div className="manutencao-controls-buttons">
          <motion.button 
            className={`manutencao-btn-outline ${filterOpen ? 'active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiFilter className="manutencao-btn-icon" />
            Filtros
            {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
          </motion.button>
          <motion.button 
            className="manutencao-btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload className="manutencao-btn-icon" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* Filtros Expandíveis */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div 
            className="manutencao-filters-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="manutencao-filters-content">
              <div className="manutencao-filter-group">
                <label>Tipo de Manutenção</label>
                <div className="manutencao-filter-chips">
                  {Object.entries(tipoConfig).map(([key, config]) => (
                    <motion.button
                      key={key}
                      className={`manutencao-filter-chip ${filters.tipo.includes(key) ? 'active' : ''}`}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          tipo: prev.tipo.includes(key)
                            ? prev.tipo.filter(t => t !== key)
                            : [...prev.tipo, key]
                        }))
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: filters.tipo.includes(key) ? 'var(--primary-10)' : 'var(--gray-100)',
                        borderColor: filters.tipo.includes(key) ? 'var(--primary)' : 'var(--gray-300)',
                        color: filters.tipo.includes(key) ? 'var(--primary)' : 'var(--gray-700)'
                      }}
                    >
                      {config.icon}
                      {config.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="manutencao-filter-group">
                <label>Prioridade</label>
                <div className="manutencao-filter-chips">
                  {Object.entries(prioridadeConfig).map(([key, config]) => (
                    <motion.button
                      key={key}
                      className={`manutencao-filter-chip ${filters.prioridade.includes(key) ? 'active' : ''}`}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          prioridade: prev.prioridade.includes(key)
                            ? prev.prioridade.filter(p => p !== key)
                            : [...prev.prioridade, key]
                        }))
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: filters.prioridade.includes(key) ? config.bgColor : 'var(--gray-100)',
                        borderColor: filters.prioridade.includes(key) ? config.color : 'var(--gray-300)',
                        color: filters.prioridade.includes(key) ? config.color : 'var(--gray-700)'
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

      {/* Manutenções List */}
      <motion.div className="manutencao-list-container" variants={itemVariants}>
        <div className="manutencao-list">
          <AnimatePresence>
            {filteredManutencoes.map((manutencao, index) => (
              <motion.div
                key={manutencao.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`manutencao-card ${selectedManutencao?.id === manutencao.id ? 'active' : ''}`}
                onClick={() => setSelectedManutencao(manutencao)}
              >
                <div className="manutencao-card-header">
                  <div className="manutencao-veiculo-info">
                    <div className="manutencao-veiculo-main">
                      <span className="manutencao-veiculo-placa">
                        <FiTruck />
                        {manutencao.placa}
                      </span>
                      <span className="manutencao-veiculo-modelo">{manutencao.modelo}</span>
                    </div>
                    <div className="manutencao-tipo-info">
                      <span 
                        className="manutencao-tipo-badge"
                        style={{
                          backgroundColor: tipoConfig[manutencao.tipo]?.bgColor || 'var(--gray-100)',
                          color: tipoConfig[manutencao.tipo]?.color || 'var(--gray-700)'
                        }}
                      >
                        {tipoConfig[manutencao.tipo]?.icon}
                        {tipoConfig[manutencao.tipo]?.label}
                      </span>
                    </div>
                  </div>
                  <div className="manutencao-status-badges">
                    <span 
                      className="manutencao-status-badge"
                      style={{
                        backgroundColor: statusConfig[manutencao.status].bgColor,
                        borderColor: statusConfig[manutencao.status].color,
                        color: statusConfig[manutencao.status].color
                      }}
                    >
                      {statusConfig[manutencao.status].icon}
                      {statusConfig[manutencao.status].label}
                    </span>
                    <span 
                      className="manutencao-prioridade-badge"
                      style={{
                        backgroundColor: prioridadeConfig[manutencao.prioridade].bgColor,
                        borderColor: prioridadeConfig[manutencao.prioridade].color,
                        color: prioridadeConfig[manutencao.prioridade].color
                      }}
                    >
                      {prioridadeConfig[manutencao.prioridade].icon}
                      {prioridadeConfig[manutencao.prioridade].label}
                    </span>
                  </div>
                </div>

                <div className="manutencao-card-content">
                  <p className="manutencao-descricao">{manutencao.descricao}</p>
                  
                  <div className="manutencao-details-grid">
                    <div className="manutencao-detail-item">
                      <span className="manutencao-detail-label">
                        <FiCalendar />
                        Data Solicitação:
                      </span>
                      <span className="manutencao-detail-value">{manutencao.dataSolicitacao}</span>
                    </div>
                    <div className="manutencao-detail-item">
                      <span className="manutencao-detail-label">
                        <MdSchedule />
                        Data Agendada:
                      </span>
                      <span className="manutencao-detail-value">{manutencao.dataAgendada}</span>
                    </div>
                    <div className="manutencao-detail-item">
                      <span className="manutencao-detail-label">
                        <FiDollarSign />
                        Custo Estimado:
                      </span>
                      <span className="manutencao-detail-value">
                        {manutencao.custoEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <div className="manutencao-detail-item">
                      <span className="manutencao-detail-label">
                        <FiClock />
                        Tempo Estimado:
                      </span>
                      <span className="manutencao-detail-value">{manutencao.tempoEstimado}</span>
                    </div>
                  </div>

                  {/* Peças/Componentes */}
                  <div className="manutencao-pecas-list">
                    <span className="manutencao-pecas-label">Peças/Componentes:</span>
                    <div className="manutencao-pecas-chips">
                      {manutencao.pecas.slice(0, 3).map((peca, idx) => (
                        <span key={idx} className="manutencao-peca-chip">
                          {peca}
                        </span>
                      ))}
                      {manutencao.pecas.length > 3 && (
                        <span className="manutencao-peca-more">
                          +{manutencao.pecas.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="manutencao-card-actions">
                  <motion.button 
                    className="manutencao-btn-primary manutencao-btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit className="manutencao-btn-icon" />
                    Editar
                  </motion.button>
                  <motion.button 
                    className="manutencao-btn-outline manutencao-btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye className="manutencao-btn-icon" />
                    Detalhes
                  </motion.button>
                  {manutencao.status !== 'concluida' && (
                    <motion.button 
                      className="manutencao-btn-outline manutencao-btn-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiCheckCircle className="manutencao-btn-icon" />
                      Concluir
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Alerts Section */}
      <motion.div className="manutencao-alerts-section" variants={itemVariants}>
        <div className="manutencao-alerts-header">
          <h3>
            <FiAlertCircle />
            Alertas de Manutenção
          </h3>
          <span className="manutencao-alerts-count">{alerts.length} alertas</span>
        </div>
        <div className="manutencao-alerts-grid">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={`manutencao-alert-card manutencao-alert-${alert.tipo}`}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -2 }}
            >
              <div className="manutencao-alert-icon">
                {alert.icon}
              </div>
              <div className="manutencao-alert-content">
                <h4>{alert.titulo}</h4>
                <p>{alert.descricao}</p>
                <div className="manutencao-alert-footer">
                  <span className="manutencao-alert-time">{alert.tempo}</span>
                  <span className="manutencao-alert-acao">{alert.acao}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Manutencao;