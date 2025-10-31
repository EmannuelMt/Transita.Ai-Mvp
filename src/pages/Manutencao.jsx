import React, { useState } from 'react';
import '../styles/manutencao.css';

const Manutencao = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('pendentes');

  const manutencoes = [
    {
      id: 1,
      veiculo: 'Volvo FH - ABC1I23',
      tipo: 'Preventiva',
      descricao: 'Troca de óleo e filtros',
      dataSolicitacao: '2024-01-15',
      dataAgendada: '2024-01-20',
      status: 'agendada',
      prioridade: 'alta',
      custoEstimado: 'R$ 1.200,00'
    },
    {
      id: 2,
      veiculo: 'Scania R440 - DEF4G56',
      tipo: 'Corretiva',
      descricao: 'Problema no sistema de freios',
      dataSolicitacao: '2024-01-14',
      dataAgendada: '2024-01-16',
      status: 'andamento',
      prioridade: 'urgente',
      custoEstimado: 'R$ 2.500,00'
    },
    {
      id: 3,
      veiculo: 'Mercedes Actros - GHI7J89',
      tipo: 'Preventiva',
      descricao: 'Revisão periódica 50.000km',
      dataSolicitacao: '2024-01-10',
      dataAgendada: '2024-01-25',
      status: 'agendada',
      prioridade: 'media',
      custoEstimado: 'R$ 800,00'
    }
  ];

  const statusConfig = {
    agendada: { label: 'Agendada', color: 'blue' },
    andamento: { label: 'Em Andamento', color: 'orange' },
    concluida: { label: 'Concluída', color: 'green' },
    cancelada: { label: 'Cancelada', color: 'red' }
  };

  const prioridadeConfig = {
    urgente: { label: 'Urgente', color: 'red' },
    alta: { label: 'Alta', color: 'orange' },
    media: { label: 'Média', color: 'yellow' },
    baixa: { label: 'Baixa', color: 'green' }
  };

  return (
    <div className="manutencao-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestão de Manutenção</h1>
          <p>Controle e acompanhamento da manutenção da frota</p>
        </div>
        <button className="btn-primary btn-large">
          <span className="btn-icon">🔧</span>
          Nova Manutenção
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon orange">🛠️</div>
          <div className="stat-content">
            <h3>8</h3>
            <p>Manutenções Pendentes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-content">
            <h3>5</h3>
            <p>Agendadas Esta Semana</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">⚠️</div>
          <div className="stat-content">
            <h3>2</h3>
            <p>Urgentes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-content">
            <h3>R$ 12.4k</h3>
            <p>Custo Mensal</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="tabs">
          {['pendentes', 'andamento', 'concluidas', 'todas'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="filter-controls">
          <button className="btn-outline">
            <span className="btn-icon">📊</span>
            Filtrar
          </button>
          <button className="btn-outline">
            <span className="btn-icon">📥</span>
            Exportar
          </button>
        </div>
      </div>

      <div className="manutencoes-list">
        {manutencoes.map(manutencao => (
          <div key={manutencao.id} className="manutencao-card">
            <div className="card-header">
              <div className="veiculo-info">
                <span className="veiculo-placa">{manutencao.veiculo}</span>
                <span className="manutencao-tipo">{manutencao.tipo}</span>
              </div>
              <div className="status-badges">
                <span className={`status-badge ${statusConfig[manutencao.status].color}`}>
                  {statusConfig[manutencao.status].label}
                </span>
                <span className={`prioridade-badge ${prioridadeConfig[manutencao.prioridade].color}`}>
                  {prioridadeConfig[manutencao.prioridade].label}
                </span>
              </div>
            </div>

            <div className="card-content">
              <p className="descricao">{manutencao.descricao}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">📅 Data Solicitação:</span>
                  <span className="detail-value">{manutencao.dataSolicitacao}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🕐 Data Agendada:</span>
                  <span className="detail-value">{manutencao.dataAgendada}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💰 Custo Estimado:</span>
                  <span className="detail-value">{manutencao.custoEstimado}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-primary btn-sm">
                <span className="btn-icon">✏️</span>
                Editar
              </button>
              <button className="btn-outline btn-sm">
                <span className="btn-icon">📋</span>
                Detalhes
              </button>
              <button className="btn-outline btn-sm">
                <span className="btn-icon">✅</span>
                Concluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="alerts-section">
        <div className="alert-header">
          <h3>⚠️ Alertas de Manutenção</h3>
        </div>
        <div className="alerts-grid">
          <div className="alert-card critical">
            <div className="alert-icon">🔴</div>
            <div className="alert-content">
              <h4>Manutenção Urgente</h4>
              <p>Scania DEF4G56 - Problema no sistema de freios</p>
              <span className="alert-time">Necessita atenção imediata</span>
            </div>
          </div>
          <div className="alert-card warning">
            <div className="alert-icon">🟡</div>
            <div className="alert-content">
              <h4>Preventiva Próxima</h4>
              <p>Volvo ABC1I23 - Revisão em 5 dias</p>
              <span className="alert-time">Agendar com urgência</span>
            </div>
          </div>
          <div className="alert-card info">
            <div className="alert-icon">🔵</div>
            <div className="alert-content">
              <h4>Documentação</h4>
              <p>3 veículos com documentação próxima do vencimento</p>
              <span className="alert-time">Verificar documentos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manutencao;
