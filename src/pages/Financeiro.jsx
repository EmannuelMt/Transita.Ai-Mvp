import React, { useState, useMemo } from 'react';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPlus,
  FiBarChart2,
  FiDownload,
  FiCalendar,
  FiFilter,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCreditCard,
  FiPieChart,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { 
  MdAttachMoney,
  MdReceipt,
  MdAccountBalanceWallet,
  MdShowChart,
  MdOutlinePayment,
  MdPendingActions
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoSpeedometerOutline,
  IoCalendarClearOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

import '../styles/Financeiro.css'

const Financeiro = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [filterOpen, setFilterOpen] = useState(false);

  const financialData = {
    receita: 42500.00,
    despesas: 28300.00,
    lucro: 14200.00,
    margem: 33.4,
    receitaAnterior: 37900.00,
    despesasAnterior: 26200.00,
    lucroAnterior: 11700.00,
    margemAnterior: 30.9
  };

  const transacoes = [
    {
      id: 1,
      tipo: 'receita',
      descricao: 'Frete SP → RJ - Carga Eletrônicos',
      valor: 4200.00,
      data: '2024-01-15',
      status: 'pago',
      cliente: 'Logística Brasil LTDA',
      categoria: 'frete_nacional',
      metodo: 'transferencia',
      vencimento: '2024-01-15',
      pagamento: '2024-01-15'
    },
    {
      id: 2,
      tipo: 'despesa',
      descricao: 'Manutenção Preventiva - Volvo FH',
      valor: 2500.00,
      data: '2024-01-14',
      status: 'pago',
      fornecedor: 'Oficina Central',
      categoria: 'manutencao',
      metodo: 'pix',
      vencimento: '2024-01-14',
      pagamento: '2024-01-14'
    },
    {
      id: 3,
      tipo: 'receita',
      descricao: 'Frete BH → DF - Carga Alimentos',
      valor: 3800.00,
      data: '2024-01-13',
      status: 'pendente',
      cliente: 'Mercado Express',
      categoria: 'frete_nacional',
      metodo: 'boleto',
      vencimento: '2024-01-20',
      pagamento: null
    },
    {
      id: 4,
      tipo: 'despesa',
      descricao: 'Combustível - Posto Shell',
      valor: 1850.00,
      data: '2024-01-12',
      status: 'pago',
      fornecedor: 'Posto Shell BR',
      categoria: 'combustivel',
      metodo: 'cartao',
      vencimento: '2024-01-12',
      pagamento: '2024-01-12'
    },
    {
      id: 5,
      tipo: 'receita',
      descricao: 'Frete Curitiba → Porto Alegre',
      valor: 5100.00,
      data: '2024-01-11',
      status: 'atrasado',
      cliente: 'Indústria Nacional',
      categoria: 'frete_nacional',
      metodo: 'transferencia',
      vencimento: '2024-01-10',
      pagamento: null
    }
  ];

  const stats = [
    { 
      value: 'R$ 42.5k', 
      label: 'Faturamento Mensal', 
      icon: <MdAttachMoney />, 
      color: 'green',
      change: '+12%',
      desc: 'Vs mês anterior'
    },
    { 
      value: 'R$ 2,45', 
      label: 'Custo por KM', 
      icon: <IoSpeedometerOutline />, 
      color: 'orange',
      change: '+5%',
      desc: 'Vs mês anterior'
    },
    { 
      value: 'R$ 3.800', 
      label: 'Ticket Médio', 
      icon: <FiTrendingUp />, 
      color: 'blue',
      change: '+8%',
      desc: 'Por frete'
    },
    { 
      value: '12 dias', 
      label: 'Dias p/ Receber', 
      icon: <IoCalendarClearOutline />, 
      color: 'purple',
      change: '-2 dias',
      desc: 'Média de recebimento'
    }
  ];

  const overviewCards = [
    {
      tipo: 'receita',
      valor: financialData.receita,
      label: 'Receita Total',
      icon: <FiTrendingUp />,
      color: 'green',
      trend: '+12%',
      trendDirection: 'up',
      desc: 'Este mês',
      valorAnterior: financialData.receitaAnterior
    },
    {
      tipo: 'despesas',
      valor: financialData.despesas,
      label: 'Despesas Totais',
      icon: <FiTrendingDown />,
      color: 'red',
      trend: '+8%',
      trendDirection: 'down',
      desc: 'Este mês',
      valorAnterior: financialData.despesasAnterior
    },
    {
      tipo: 'lucro',
      valor: financialData.lucro,
      label: 'Lucro Líquido',
      icon: <MdAccountBalanceWallet />,
      color: 'blue',
      trend: '+15%',
      trendDirection: 'up',
      desc: 'Este mês',
      valorAnterior: financialData.lucroAnterior
    },
    {
      tipo: 'margem',
      valor: financialData.margem,
      label: 'Margem de Lucro',
      icon: <FiBarChart2 />,
      color: 'purple',
      trend: '+3%',
      trendDirection: 'up',
      desc: 'Este mês',
      valorAnterior: financialData.margemAnterior
    }
  ];

  const tabs = [
    { key: 'overview', label: 'Visão Geral', icon: <MdShowChart /> },
    { key: 'transacoes', label: 'Transações', icon: <MdReceipt /> },
    { key: 'relatorios', label: 'Relatórios', icon: <FiBarChart2 /> },
    { key: 'fluxo', label: 'Fluxo de Caixa', icon: <FiTrendingUp /> }
  ];

  const periods = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' }
  ];

  const statusConfig = {
    pago: { 
      label: 'Pago', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <MdOutlinePayment />
    },
    pendente: { 
      label: 'Pendente', 
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: <MdPendingActions />
    },
    atrasado: { 
      label: 'Atrasado', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <FiCalendar />
    }
  };

  const tipoConfig = {
    receita: { 
      label: 'Receita', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <FiArrowUpRight />
    },
    despesa: { 
      label: 'Despesa', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <FiArrowDownRight />
    }
  };

  const filteredTransacoes = useMemo(() => {
    return transacoes;
  }, [transacoes]);

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.4
      }
    }),
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTrend = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1) + '%',
      direction: change >= 0 ? 'up' : 'down'
    };
  };

  return (
    <motion.div 
      className="financeiro-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="financeiro-header" variants={itemVariants}>
        <div className="financeiro-header-content">
          <div className="financeiro-header-text">
            <span className="financeiro-welcome-badge">
              <FiDollarSign />
              Gestão Financeira
            </span>
            <h1>Controle Financeiro</h1>
            <p className="financeiro-header-subtitle">
              Acompanhe e gerencie as finanças da sua transportadora em tempo real
            </p>
          </div>
          <div className="financeiro-header-actions">
            <motion.button 
              className="financeiro-btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className="financeiro-btn-icon" />
              Nova Transação
            </motion.button>
            <motion.button 
              className="financeiro-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload className="financeiro-btn-icon" />
              Exportar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Financial Overview */}
      <motion.div className="financeiro-overview" variants={containerVariants}>
        {overviewCards.map((card, index) => {
          const trend = calculateTrend(card.valor, card.valorAnterior);
          return (
            <motion.div
              key={card.tipo}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`financeiro-overview-card financeiro-overview-${card.tipo}`}
            >
              <div className="financeiro-overview-background-pattern"></div>
              <div className="financeiro-overview-glow"></div>
              <div className="financeiro-overview-content">
                <div className="financeiro-overview-main">
                  <div 
                    className="financeiro-overview-icon-wrapper"
                    style={{ 
                      backgroundColor: `var(--${card.color})`,
                      color: 'white'
                    }}
                  >
                    {card.icon}
                  </div>
                  <div className="financeiro-overview-values">
                    <h3>{card.tipo === 'margem' ? `${card.valor}%` : formatCurrency(card.valor)}</h3>
                    <div className="financeiro-overview-label">{card.label}</div>
                    <div className="financeiro-overview-desc">{card.desc}</div>
                    <div className={`financeiro-overview-trend ${trend.direction}`}>
                      <span className="financeiro-trend-icon">
                        {trend.direction === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                      </span>
                      {trend.value} vs anterior
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Controls Section */}
      <motion.div className="financeiro-controls-section" variants={itemVariants}>
        <div className="financeiro-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              className={`financeiro-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="financeiro-tab-icon">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
        
        <div className="financeiro-controls-right">
          <div className="financeiro-period-controls">
            <motion.select 
              className="financeiro-period-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              whileFocus={{ scale: 1.02 }}
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </motion.select>
          </div>
          
          <div className="financeiro-controls-buttons">
            <motion.button 
              className={`financeiro-btn-outline ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen(!filterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFilter className="financeiro-btn-icon" />
              Filtros
              {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
            <motion.button 
              className="financeiro-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="financeiro-btn-icon" />
              Atualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filtros Expandíveis */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div 
            className="financeiro-filters-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="financeiro-filters-content">
              <div className="financeiro-filter-group">
                <label>Tipo de Transação</label>
                <div className="financeiro-filter-chips">
                  {Object.entries(tipoConfig).map(([key, config]) => (
                    <motion.button
                      key={key}
                      className="financeiro-filter-chip"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: config.bgColor,
                        borderColor: config.color,
                        color: config.color
                      }}
                    >
                      {config.icon}
                      {config.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="financeiro-filter-group">
                <label>Status</label>
                <div className="financeiro-filter-chips">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <motion.button
                      key={key}
                      className="financeiro-filter-chip"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: config.bgColor,
                        borderColor: config.color,
                        color: config.color
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

      {/* Content Grid */}
      <div className="financeiro-content-grid">
        {/* Chart Section */}
        <motion.div className="financeiro-chart-section" variants={itemVariants}>
          <div className="financeiro-chart-card">
            <div className="financeiro-chart-header">
              <div className="financeiro-chart-title">
                <h3>Fluxo de Caixa</h3>
                <span className="financeiro-chart-subtitle">Últimos 6 meses</span>
              </div>
              <div className="financeiro-chart-actions">
                <motion.button 
                  className="financeiro-btn-icon-small"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEye />
                </motion.button>
                <motion.button 
                  className="financeiro-btn-icon-small"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiDownload />
                </motion.button>
              </div>
            </div>
            <div className="financeiro-chart-placeholder">
              <div className="financeiro-chart-content">
                <div className="financeiro-chart-icon">
                  <FiBarChart2 />
                </div>
                <h4>Análise de Fluxo de Caixa</h4>
                <p>Visualize a evolução das suas receitas e despesas</p>
                <div className="financeiro-chart-legend">
                  <div className="legend-item">
                    <span className="legend-color receita"></span>
                    <span>Receitas</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color despesa"></span>
                    <span>Despesas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions Section */}
        <motion.div className="financeiro-transactions-section" variants={itemVariants}>
          <div className="financeiro-transactions-card">
            <div className="financeiro-card-header">
              <div className="financeiro-card-title">
                <h3>Últimas Transações</h3>
                <span className="financeiro-card-subtitle">5 transações recentes</span>
              </div>
              <motion.button 
                className="financeiro-btn-link"
                whileHover={{ x: 5 }}
              >
                Ver todas <FiArrowUpRight />
              </motion.button>
            </div>
            <div className="financeiro-transactions-list">
              <AnimatePresence>
                {filteredTransacoes.map((transacao, index) => (
                  <motion.div
                    key={transacao.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="financeiro-transaction-item"
                  >
                    <div 
                      className="financeiro-transaction-icon"
                      style={{
                        backgroundColor: tipoConfig[transacao.tipo].bgColor,
                        color: tipoConfig[transacao.tipo].color
                      }}
                    >
                      {tipoConfig[transacao.tipo].icon}
                    </div>
                    <div className="financeiro-transaction-details">
                      <div className="financeiro-transaction-info">
                        <span className="financeiro-transaction-desc">
                          {transacao.descricao}
                        </span>
                        <span className="financeiro-transaction-date">
                          <FiCalendar />
                          {transacao.data}
                        </span>
                      </div>
                      <div className="financeiro-transaction-meta">
                        <span className="financeiro-transaction-client">
                          {transacao.cliente || transacao.fornecedor}
                        </span>
                        <span 
                          className="financeiro-transaction-status"
                          style={{
                            backgroundColor: statusConfig[transacao.status].bgColor,
                            borderColor: statusConfig[transacao.status].color,
                            color: statusConfig[transacao.status].color
                          }}
                        >
                          {statusConfig[transacao.status].icon}
                          {statusConfig[transacao.status].label}
                        </span>
                      </div>
                    </div>
                    <div 
                      className={`financeiro-transaction-value ${transacao.tipo}`}
                      style={{ color: tipoConfig[transacao.tipo].color }}
                    >
                      {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div className="financeiro-quick-stats" variants={itemVariants}>
        <div className="financeiro-stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`financeiro-stat-card financeiro-stat-${stat.color}`}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -2 }}
            >
              <div className="financeiro-stat-background-pattern"></div>
              <div className="financeiro-stat-content">
                <div className="financeiro-stat-header">
                  <div 
                    className="financeiro-stat-icon"
                    style={{ color: `var(--${stat.color})` }}
                  >
                    {stat.icon}
                  </div>
                  <div className={`financeiro-stat-trend ${stat.change.includes('+') ? 'positive' : 'negative'}`}>
                    <span className="financeiro-trend-icon">
                      {stat.change.includes('+') ? <FiTrendingUp /> : <FiTrendingDown />}
                    </span>
                    {stat.change}
                  </div>
                </div>
                <div className="financeiro-stat-values">
                  <div className="financeiro-stat-main-value">{stat.value}</div>
                  <div className="financeiro-stat-label">{stat.label}</div>
                  <div className="financeiro-stat-desc">{stat.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Financeiro;