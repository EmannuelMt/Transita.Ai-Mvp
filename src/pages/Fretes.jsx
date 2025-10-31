import React, { useState } from 'react';
import '../styles/fretes.css';

const Fretes = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('ativos');
  const [searchTerm, setSearchTerm] = useState('');

  const fretes = [
    {
      id: 'TRK-2348',
      cliente: 'Logística Brasil LTDA',
      origem: 'São Paulo - SP',
      destino: 'Rio de Janeiro - RJ',
      peso: '12.5t',
      valor: 'R$ 4.200,00',
      status: 'em_transito',
      dataColeta: '2024-01-15',
      dataEntrega: '2024-01-16',
      motorista: 'Carlos Santos',
      veiculo: 'Volvo FH - ABC1I23'
    },
    {
      id: 'TRK-2349',
      cliente: 'Mercado Express',
      origem: 'Belo Horizonte - MG',
      destino: 'Brasília - DF',
      peso: '8.2t',
      valor: 'R$ 3.800,00',
      status: 'carregando',
      dataColeta: '2024-01-15',
      dataEntrega: '2024-01-17',
      motorista: 'Maria Oliveira',
      veiculo: 'Scania R440 - DEF4G56'
    },
    {
      id: 'TRK-2350',
      cliente: 'Indústria Nacional',
      origem: 'Curitiba - PR',
      destino: 'Porto Alegre - RS',
      peso: '15.8t',
      valor: 'R$ 5.100,00',
      status: 'pendente',
      dataColeta: '2024-01-16',
      dataEntrega: '2024-01-18',
      motorista: 'Pedro Costa',
      veiculo: 'Mercedes Actros - GHI7J89'
    }
  ];

  const statusConfig = {
    em_transito: { label: 'Em Trânsito', color: 'blue' },
    carregando: { label: 'Carregando', color: 'orange' },
    pendente: { label: 'Pendente', color: 'yellow' },
    entregue: { label: 'Entregue', color: 'green' },
    cancelado: { label: 'Cancelado', color: 'red' }
  };

  const filteredFretes = fretes.filter(frete =>
    frete.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    frete.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    frete.motorista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fretes-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Gerenciar Fretes</h1>
          <p>Controle completo das cargas e transportes</p>
        </div>
        <button 
          className="btn-primary btn-large"
          onClick={() => onNavigate('novo-frete')}
        >
          <span className="btn-icon">📋</span>
          Novo Frete
        </button>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">🚚</div>
          <div className="stat-content">
            <h3>18</h3>
            <p>Fretes Ativos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Entregues (Mês)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏱️</div>
          <div className="stat-content">
            <h3>5</h3>
            <p>Para Hoje</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">💰</div>
          <div className="stat-content">
            <h3>R$ 42.5k</h3>
            <p>Faturamento</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="tabs">
          {['ativos', 'pendentes', 'entregues', 'todos'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="search-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar fretes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
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

      {/* Table */}
      <div className="table-container">
        <table className="fretes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Origem → Destino</th>
              <th>Peso</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Motorista</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredFretes.map((frete) => (
              <tr key={frete.id}>
                <td>
                  <div className="frete-id">
                    <span className="id-text">{frete.id}</span>
                    <span className="date">{frete.dataColeta}</span>
                  </div>
                </td>
                <td>
                  <div className="cliente-info">
                    <span className="cliente-name">{frete.cliente}</span>
                    <span className="veiculo">{frete.veiculo}</span>
                  </div>
                </td>
                <td>
                  <div className="route-info">
                    <span className="origin">{frete.origem}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{frete.destino}</span>
                  </div>
                </td>
                <td>
                  <span className="peso">{frete.peso}</span>
                </td>
                <td>
                  <span className="valor">{frete.valor}</span>
                </td>
                <td>
                  <span className={`status-badge ${statusConfig[frete.status].color}`}>
                    {statusConfig[frete.status].label}
                  </span>
                </td>
                <td>
                  <div className="motorista-info">
                    <span className="motorista-name">{frete.motorista}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="Visualizar">
                      👁️
                    </button>
                    <button className="action-btn edit" title="Editar">
                      ✏️
                    </button>
                    <button className="action-btn track" title="Rastrear">
                      🗺️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredFretes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Nenhum frete encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos</p>
          <button className="btn-primary">
            <span className="btn-icon">📋</span>
            Criar Primeiro Frete
          </button>
        </div>
      )}
    </div>
  );
};

export default Fretes;
