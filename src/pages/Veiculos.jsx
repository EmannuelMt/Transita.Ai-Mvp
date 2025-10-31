import React, { useState } from 'react';
import '../styles/veiculos.css';

const Veiculos = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('ativos');

  const veiculos = [
    {
      id: 1,
      placa: 'ABC1I23',
      modelo: 'Volvo FH 540',
      ano: 2022,
      capacidade: '25t',
      combustivel: 'Diesel',
      status: 'ativo',
      manutencao: '2024-02-15',
      motorista: 'Carlos Santos',
      localizacao: 'Em viagem - SP/RJ',
      km: '125.842'
    },
    {
      id: 2,
      placa: 'DEF4G56',
      modelo: 'Scania R440',
      ano: 2021,
      capacidade: '22t',
      combustivel: 'Diesel',
      status: 'ativo',
      manutencao: '2024-02-20',
      motorista: 'Maria Oliveira',
      localizacao: 'Centro de Distribuição',
      km: '98.756'
    },
    {
      id: 3,
      placa: 'GHI7J89',
      modelo: 'Mercedes Actros',
      ano: 2023,
      capacidade: '28t',
      combustivel: 'Diesel',
      status: 'manutencao',
      manutencao: '2024-01-25',
      motorista: 'Pedro Costa',
      localizacao: 'Oficina - São Paulo',
      km: '45.123'
    }
  ];

  return (
    <div className="veiculos-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Frota de Veículos</h1>
          <p>Gerencie toda sua frota em um só lugar</p>
        </div>
        <button className="btn-primary btn-large">
          <span className="btn-icon">🚚</span>
          Adicionar Veículo
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">🚚</div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Total de Veículos</p>
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
          <div className="stat-icon orange">🛠️</div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Em Manutenção</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🛣️</div>
          <div className="stat-content">
            <h3>15</h3>
            <p>Em Viagem</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="tabs">
          {['ativos', 'manutencao', 'disponiveis', 'todos'].map(tab => (
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
              placeholder="Buscar veículos..."
              className="search-input"
            />
          </div>
          <button className="btn-outline">
            <span className="btn-icon">📊</span>
            Filtrar
          </button>
        </div>
      </div>

      <div className="veiculos-grid">
        {veiculos.map(veiculo => (
          <div key={veiculo.id} className="veiculo-card">
            <div className="card-header">
              <div className="veiculo-placa">{veiculo.placa}</div>
              <span className={`status-badge ${veiculo.status}`}>
                {veiculo.status === 'ativo' ? 'Ativo' : 'Manutenção'}
              </span>
            </div>

            <div className="card-content">
              <div className="veiculo-modelo">{veiculo.modelo}</div>
              <div className="veiculo-info">
                <div className="info-item">
                  <span className="info-label">Ano:</span>
                  <span className="info-value">{veiculo.ano}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Capacidade:</span>
                  <span className="info-value">{veiculo.capacidade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Combustível:</span>
                  <span className="info-value">{veiculo.combustivel}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Quilometragem:</span>
                  <span className="info-value">{veiculo.km} km</span>
                </div>
              </div>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">👤 Motorista:</span>
                <span className="detail-value">{veiculo.motorista}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📍 Localização:</span>
                <span className="detail-value">{veiculo.localizacao}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🔧 Manutenção:</span>
                <span className="detail-value">{veiculo.manutencao}</span>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-outline btn-sm">
                <span className="btn-icon">🗺️</span>
                Rastrear
              </button>
              <button className="btn-outline btn-sm">
                <span className="btn-icon">🔧</span>
                Manutenção
              </button>
              <button className="btn-outline btn-sm">
                <span className="btn-icon">📋</span>
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Veiculos;
