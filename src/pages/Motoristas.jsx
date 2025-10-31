import React, { useState } from 'react';
import '../styles/motoristas.css';

const Motoristas = ({ user, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const motoristas = [
    {
      id: 1,
      nome: 'Carlos Santos',
      cnh: '12345678901',
      categoria: 'D',
      telefone: '(11) 99999-9999',
      status: 'disponivel',
      veiculo: 'Volvo FH - ABC1I23',
      viagensMes: 12,
      avaliacao: 4.8,
      ultimaViagem: '2024-01-15'
    },
    {
      id: 2,
      nome: 'Maria Oliveira',
      cnh: '23456789012',
      categoria: 'D',
      telefone: '(11) 98888-8888',
      status: 'em_viagem',
      veiculo: 'Scania R440 - DEF4G56',
      viagensMes: 8,
      avaliacao: 4.9,
      ultimaViagem: '2024-01-15'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      cnh: '34567890123',
      categoria: 'D',
      telefone: '(11) 97777-7777',
      status: 'disponivel',
      veiculo: 'Mercedes Actros - GHI7J89',
      viagensMes: 15,
      avaliacao: 4.7,
      ultimaViagem: '2024-01-14'
    }
  ];

  const statusConfig = {
    disponivel: { label: 'Disponível', color: 'green' },
    em_viagem: { label: 'Em Viagem', color: 'blue' },
    folga: { label: 'Folga', color: 'gray' },
    afastado: { label: 'Afastado', color: 'red' }
  };

  return (
    <div className="motoristas-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Gerenciar Motoristas</h1>
          <p>Controle completo da sua equipe de condutores</p>
        </div>
        <button className="btn-primary btn-large">
          <span className="btn-icon">👤</span>
          Novo Motorista
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Motoristas Ativos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-content">
            <h3>18</h3>
            <p>Disponíveis</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🛣️</div>
          <div className="stat-content">
            <h3>6</h3>
            <p>Em Viagem</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">⭐</div>
          <div className="stat-content">
            <h3>4.8</h3>
            <p>Avaliação Média</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar motoristas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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

      <div className="motoristas-grid">
        {motoristas.map(motorista => (
          <div key={motorista.id} className="motorista-card">
            <div className="card-header">
              <div className="motorista-avatar">
                <span>👤</span>
              </div>
              <div className="motorista-info">
                <h3 className="motorista-name">{motorista.nome}</h3>
                <span className="motorista-cnh">CNH: {motorista.cnh}</span>
              </div>
              <span className={`status-badge ${statusConfig[motorista.status].color}`}>
                {statusConfig[motorista.status].label}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">📞 Telefone:</span>
                <span className="detail-value">{motorista.telefone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🚛 Veículo:</span>
                <span className="detail-value">{motorista.veiculo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📊 Categoria:</span>
                <span className="detail-value">{motorista.categoria}</span>
              </div>
            </div>

            <div className="card-stats">
              <div className="stat">
                <span className="stat-value">{motorista.viagensMes}</span>
                <span className="stat-label">Viagens/Mês</span>
              </div>
              <div className="stat">
                <span className="stat-value">{motorista.avaliacao}</span>
                <span className="stat-label">Avaliação</span>
              </div>
              <div className="stat">
                <span className="stat-value">{motorista.ultimaViagem}</span>
                <span className="stat-label">Última Viagem</span>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-outline btn-sm">
                <span className="btn-icon">📞</span>
                Contatar
              </button>
              <button className="btn-outline btn-sm">
                <span className="btn-icon">📋</span>
                Detalhes
              </button>
              <button className="btn-outline btn-sm">
                <span className="btn-icon">✏️</span>
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Motoristas;
