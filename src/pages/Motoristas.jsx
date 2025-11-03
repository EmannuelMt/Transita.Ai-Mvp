import React, { useState, useMemo } from 'react';
import { 
  FiUser, 
  FiUserPlus, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiPhone, 
  FiFileText, 
  FiEdit,
  FiStar,
  FiMap,
  FiTruck,
  FiCalendar,
  FiAward,
  FiRefreshCw,
  FiMail,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { 
  MdOutlineDirectionsCar,
  MdOutlinePhone,
  MdOutlineEmail,
  MdOutlineLocationOn,
  MdCheckCircle,
  MdPending,
  MdWarning
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoPersonOutline,
  IoTimeOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import '.Motorista.css';
const Motoristas = ({ user, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');
  const [selectedMotorista, setSelectedMotorista] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const motoristas = [
    {
      id: 1,
      nome: 'Carlos Santos',
      cnh: '12345678901',
      categoria: 'D',
      telefone: '(11) 99999-9999',
      email: 'carlos.santos@transporte.com',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      status: 'disponivel',
      veiculo: 'Volvo FH - ABC1I23',
      viagensMes: 12,
      avaliacao: 4.8,
      ultimaViagem: '2024-01-15',
      totalViagens: 156,
      horasTrabalhadas: '180h',
      dataAdmissao: '2022-03-15',
      especializacoes: ['Carga Frágil', 'Produtos Perigosos', 'Refrigerados'],
      documentacao: {
        cnhValidade: '2026-05-20',
        moppValidade: '2025-08-15',
        asoValidade: '2024-12-10'
      },
      contatoEmergencia: {
        nome: 'Ana Santos',
        telefone: '(11) 98888-7777',
        parentesco: 'Esposa'
      }
    },
    {
      id: 2,
      nome: 'Maria Oliveira',
      cnh: '23456789012',
      categoria: 'D',
      telefone: '(11) 98888-8888',
      email: 'maria.oliveira@transporte.com',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      status: 'em_viagem',
      veiculo: 'Scania R440 - DEF4G56',
      viagensMes: 8,
      avaliacao: 4.9,
      ultimaViagem: '2024-01-15',
      totalViagens: 89,
      horasTrabalhadas: '165h',
      dataAdmissao: '2023-01-10',
      especializacoes: ['Carga Viva', 'Oversize', 'Express'],
      documentacao: {
        cnhValidade: '2027-02-28',
        moppValidade: '2025-11-30',
        asoValidade: '2024-09-20'
      },
      contatoEmergencia: {
        nome: 'João Oliveira',
        telefone: '(11) 97777-6666',
        parentesco: 'Marido'
      }
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      cnh: '34567890123',
      categoria: 'D',
      telefone: '(11) 97777-7777',
      email: 'pedro.costa@transporte.com',
      endereco: 'Rua Augusta, 500 - São Paulo, SP',
      status: 'disponivel',
      veiculo: 'Mercedes Actros - GHI7J89',
      viagensMes: 15,
      avaliacao: 4.7,
      ultimaViagem: '2024-01-14',
      totalViagens: 203,
      horasTrabalhadas: '195h',
      dataAdmissao: '2021-08-22',
      especializacoes: ['Carga Pesada', 'Produtos Químicos', 'Longa Distância'],
      documentacao: {
        cnhValidade: '2025-12-15',
        moppValidade: '2024-10-25',
        asoValidade: '2024-06-30'
      },
      contatoEmergencia: {
        nome: 'Carla Costa',
        telefone: '(11) 96666-5555',
        parentesco: 'Irmã'
      }
    },
    {
      id: 4,
      nome: 'Ana Rodrigues',
      cnh: '45678901234',
      categoria: 'E',
      telefone: '(11) 96666-6666',
      email: 'ana.rodrigues@transporte.com',
      endereco: 'Rua Consolação, 789 - São Paulo, SP',
      status: 'folga',
      veiculo: 'Ford Cargo - JKL0M12',
      viagensMes: 10,
      avaliacao: 4.6,
      ultimaViagem: '2024-01-13',
      totalViagens: 134,
      horasTrabalhadas: '170h',
      dataAdmissao: '2022-11-05',
      especializacoes: ['Carga Seca', 'Frigorífica', 'Urbana'],
      documentacao: {
        cnhValidade: '2026-08-10',
        moppValidade: '2025-05-18',
        asoValidade: '2024-11-15'
      },
      contatoEmergencia: {
        nome: 'Roberto Rodrigues',
        telefone: '(11) 95555-4444',
        parentesco: 'Pai'
      }
    },
    {
      id: 5,
      nome: 'Roberto Silva',
      cnh: '56789012345',
      categoria: 'D',
      telefone: '(11) 95555-5555',
      email: 'roberto.silva@transporte.com',
      endereco: 'Alameda Santos, 456 - São Paulo, SP',
      status: 'afastado',
      veiculo: 'DAF XF - MNO3P45',
      viagensMes: 0,
      avaliacao: 4.5,
      ultimaViagem: '2024-01-05',
      totalViagens: 178,
      horasTrabalhadas: '0h',
      dataAdmissao: '2021-12-01',
      especializacoes: ['Carga Perigosa', 'Internacional', 'Bitrem'],
      documentacao: {
        cnhValidade: '2025-09-30',
        moppValidade: '2024-12-20',
        asoValidade: '2024-03-15'
      },
      contatoEmergencia: {
        nome: 'Maria Silva',
        telefone: '(11) 94444-3333',
        parentesco: 'Mãe'
      }
    }
  ];

  const statusConfig = {
    disponivel: { 
      label: 'Disponível', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <MdCheckCircle />
    },
    em_viagem: { 
      label: 'Em Viagem', 
      color: 'var(--primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      icon: <MdOutlineDirectionsCar />
    },
    folga: { 
      label: 'Folga', 
      color: 'var(--gray-600)',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      icon: <IoTimeOutline />
    },
    afastado: { 
      label: 'Afastado', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <MdWarning />
    }
  };

  const stats = [
    { 
      value: '24', 
      label: 'Motoristas Ativos', 
      icon: <IoPersonOutline />, 
      color: 'blue',
      change: '+3',
      desc: 'Total na frota'
    },
    { 
      value: '18', 
      label: 'Disponíveis', 
      icon: <MdCheckCircle />, 
      color: 'green',
      change: '+2',
      desc: 'Prontos para viagem'
    },
    { 
      value: '6', 
      label: 'Em Viagem', 
      icon: <FiMap />, 
      color: 'orange',
      change: '-1',
      desc: 'Em transporte'
    },
    { 
      value: '4.8', 
      label: 'Avaliação Média', 
      icon: <FiStar />, 
      color: 'purple',
      change: '+0.1',
      desc: 'Satisfação dos clientes'
    }
  ];

  const filters = [
    { key: 'todos', label: 'Todos', icon: <FiUser />, count: motoristas.length },
    { key: 'disponivel', label: 'Disponíveis', icon: <MdCheckCircle />, count: motoristas.filter(m => m.status === 'disponivel').length },
    { key: 'em_viagem', label: 'Em Viagem', icon: <FiMap />, count: motoristas.filter(m => m.status === 'em_viagem').length },
    { key: 'folga', label: 'Folga', icon: <IoTimeOutline />, count: motoristas.filter(m => m.status === 'folga').length }
  ];

  const filteredMotoristas = useMemo(() => {
    let filtered = motoristas.filter(motorista =>
      motorista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorista.cnh.includes(searchTerm) ||
      motorista.telefone.includes(searchTerm)
    );

    if (activeFilter !== 'todos') {
      filtered = filtered.filter(motorista => motorista.status === activeFilter);
    }

    return filtered;
  }, [motoristas, searchTerm, activeFilter]);

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

  const handleContact = (motorista, tipo) => {
    if (tipo === 'telefone') {
      alert(`Ligando para ${motorista.nome}: ${motorista.telefone}`);
    } else if (tipo === 'email') {
      alert(`Enviando email para ${motorista.nome}: ${motorista.email}`);
    } else if (tipo === 'whatsapp') {
      alert(`Abrindo WhatsApp para ${motorista.nome}: ${motorista.telefone}`);
    }
  };

  return (
    <motion.div 
      className="motoristas-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="motoristas-header" variants={itemVariants}>
        <div className="motoristas-header-content">
          <div className="motoristas-header-text">
            <span className="motoristas-welcome-badge">
              <FiUser />
              Gestão de Motoristas
            </span>
            <h1>Equipe de Condutores</h1>
            <p className="motoristas-header-subtitle">
              Gerencie e acompanhe o desempenho da sua equipe de motoristas
            </p>
          </div>
          <div className="motoristas-header-actions">
            <motion.button 
              className="motoristas-btn-primary motoristas-btn-large"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUserPlus className="motoristas-btn-icon" />
              Novo Motorista
            </motion.button>
            <motion.button 
              className="motoristas-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="motoristas-btn-icon" />
              Atualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="motoristas-stats-grid" variants={containerVariants}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`motoristas-stat-card motoristas-stat-${stat.color}`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="motoristas-stat-background-pattern"></div>
            <div className="motoristas-stat-glow"></div>
            <div className="motoristas-stat-content">
              <div className="motoristas-stat-main">
                <div className="motoristas-stat-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="motoristas-stat-values">
                  <h3>{stat.value}</h3>
                  <div className="motoristas-stat-label">{stat.label}</div>
                  <div className="motoristas-stat-desc">{stat.desc}</div>
                  <div className={`motoristas-stat-trend ${stat.change.includes('+') ? 'up' : stat.change.includes('-') ? 'down' : 'neutral'}`}>
                    <span className="motoristas-trend-icon">
                      {stat.change.includes('+') ? '↗' : stat.change.includes('-') ? '↘' : '→'}
                    </span>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
            <div className="motoristas-stat-chart">
              {[25, 40, 30, 55, 45, 65, 50].map((height, i) => (
                <motion.div
                  key={i}
                  className="motoristas-chart-bar"
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
      <motion.div className="motoristas-controls-section" variants={itemVariants}>
        <div className="motoristas-tabs">
          {filters.map(filter => (
            <motion.button
              key={filter.key}
              className={`motoristas-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="motoristas-tab-icon">{filter.icon}</span>
              {filter.label}
              <span className="motoristas-tab-count">{filter.count}</span>
            </motion.button>
          ))}
        </div>
        
        <div className="motoristas-search-controls">
          <motion.div 
            className="motoristas-search-box"
            whileFocus={{ scale: 1.02 }}
          >
            <FiSearch className="motoristas-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome, CNH ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="motoristas-search-input"
            />
            {searchTerm && (
              <motion.button 
                className="motoristas-search-clear"
                onClick={() => setSearchTerm('')}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                ×
              </motion.button>
            )}
          </motion.div>

          <div className="motoristas-controls-buttons">
            <motion.button 
              className={`motoristas-btn-outline ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen(!filterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFilter className="motoristas-btn-icon" />
              Filtros
              {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
            <motion.button 
              className="motoristas-btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload className="motoristas-btn-icon" />
              Exportar
            </motion.button>
          </div>
        </div>

        {/* Filtros Expandíveis */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div 
              className="motoristas-filters-expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="motoristas-filters-content">
                <div className="motoristas-filter-group">
                  <label>Categoria CNH</label>
                  <div className="motoristas-filter-chips">
                    {['A', 'B', 'C', 'D', 'E'].map(categoria => (
                      <motion.button
                        key={categoria}
                        className="motoristas-filter-chip"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {categoria}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="motoristas-filter-group">
                  <label>Avaliação</label>
                  <div className="motoristas-filter-chips">
                    {['4.5+', '4.0+', '3.5+', 'Todas'].map(avaliacao => (
                      <motion.button
                        key={avaliacao}
                        className="motoristas-filter-chip"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiStar />
                        {avaliacao}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Motoristas Grid */}
      <motion.div className="motoristas-grid-container" variants={itemVariants}>
        <div className="motoristas-grid">
          <AnimatePresence>
            {filteredMotoristas.map((motorista, index) => (
              <motion.div
                key={motorista.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`motorista-card ${selectedMotorista?.id === motorista.id ? 'active' : ''}`}
                onClick={() => setSelectedMotorista(motorista)}
              >
                <div className="motorista-card-header">
                  <div className="motorista-avatar">
                    <div className="motorista-avatar-initials">
                      {motorista.nome.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="motorista-status-indicator" style={{ 
                      backgroundColor: statusConfig[motorista.status].color 
                    }} />
                  </div>
                  <div className="motorista-info">
                    <h3 className="motorista-name">{motorista.nome}</h3>
                    <span className="motorista-cnh">CNH: {motorista.cnh}</span>
                    <span className="motorista-categoria">Categoria: {motorista.categoria}</span>
                  </div>
                  <div 
                    className="motorista-status-badge"
                    style={{ 
                      backgroundColor: statusConfig[motorista.status].bgColor,
                      borderColor: statusConfig[motorista.status].color,
                      color: statusConfig[motorista.status].color
                    }}
                  >
                    {statusConfig[motorista.status].icon}
                    {statusConfig[motorista.status].label}
                  </div>
                </div>

                <div className="motorista-card-details">
                  <div className="motorista-contact-info">
                    <div className="contact-item">
                      <MdOutlinePhone />
                      <span>{motorista.telefone}</span>
                    </div>
                    <div className="contact-item">
                      <MdOutlineEmail />
                      <span>{motorista.email}</span>
                    </div>
                    <div className="contact-item">
                      <FiTruck />
                      <span>{motorista.veiculo}</span>
                    </div>
                  </div>

                  <div className="motorista-stats">
                    <div className="motorista-stat">
                      <div className="stat-value">{motorista.viagensMes}</div>
                      <div className="stat-label">Viagens/Mês</div>
                    </div>
                    <div className="motorista-stat">
                      <div className="stat-value">
                        <FiStar />
                        {motorista.avaliacao}
                      </div>
                      <div className="stat-label">Avaliação</div>
                    </div>
                    <div className="motorista-stat">
                      <div className="stat-value">{motorista.totalViagens}</div>
                      <div className="stat-label">Total Viagens</div>
                    </div>
                  </div>

                  {/* Especializações */}
                  <div className="motorista-especializacoes">
                    <span className="especializacoes-label">Especializações:</span>
                    <div className="especializacoes-chips">
                      {motorista.especializacoes.slice(0, 2).map((especializacao, idx) => (
                        <span key={idx} className="especializacao-chip">
                          {especializacao}
                        </span>
                      ))}
                      {motorista.especializacoes.length > 2 && (
                        <span className="especializacao-more">
                          +{motorista.especializacoes.length - 2} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="motorista-card-actions">
                  <div className="contact-actions">
                    <motion.button 
                      className="motoristas-btn-icon-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact(motorista, 'telefone');
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Ligar"
                    >
                      <FiPhone />
                    </motion.button>
                    <motion.button 
                      className="motoristas-btn-icon-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact(motorista, 'email');
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Email"
                    >
                      <FiMail />
                    </motion.button>
                    <motion.button 
                      className="motoristas-btn-icon-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact(motorista, 'whatsapp');
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="WhatsApp"
                    >
                      <FiMessageSquare />
                    </motion.button>
                  </div>
                  <div className="action-buttons">
                    <motion.button 
                      className="motoristas-btn-outline motoristas-btn-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiFileText className="motoristas-btn-icon" />
                      Detalhes
                    </motion.button>
                    <motion.button 
                      className="motoristas-btn-outline motoristas-btn-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEdit className="motoristas-btn-icon" />
                      Editar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredMotoristas.length === 0 && (
            <motion.div 
              className="motoristas-empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="empty-icon">
                <FiUser />
              </div>
              <h3>Nenhum motorista encontrado</h3>
              <p>
                {searchTerm 
                  ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`
                  : 'Não há motoristas correspondentes aos filtros aplicados.'
                }
              </p>
              {(searchTerm || activeFilter !== 'todos') && (
                <motion.button 
                  className="motoristas-btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('todos');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiRefreshCw className="motoristas-btn-icon" />
                  Limpar Filtros
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Motoristas;