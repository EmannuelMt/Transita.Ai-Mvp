import React, { useState, useEffect } from 'react';
import '../styles/monitoramento.css';

const Monitoramento = ({ user, onNavigate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

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
        peso: 15.2
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
        peso: 8.7
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
        peso: 22.1
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
        peso: 0
      }
    ];

    setVehicles(initialVehicles);
    setIsLoading(false);
    
    // Simula atualização em tempo real
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        ultimaAtualizacao: new Date(),
        velocidade: vehicle.status === 'em_viagem' 
          ? Math.max(0, vehicle.velocidade + (Math.random() - 0.5) * 10)
          : 0,
        combustivel: Math.max(5, vehicle.combustivel - (Math.random() * 0.1))
      })));
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      'em_viagem': { label: 'Em Viagem', color: '#10B981', icon: '🚚' },
      'carregando': { label: 'Carregando', color: '#F59E0B', icon: '📦' },
      'descanso': { label: 'Em Descanso', color: '#6B7280', icon: '🛌' },
      'manutencao': { label: 'Manutenção', color: '#EF4444', icon: '🔧' },
      'parado': { label: 'Parado', color: '#8B5CF6', icon: '⏸️' }
    };
    return statusMap[status] || { label: status, color: '#6B7280', icon: '❓' };
  };

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
    setTimeout(() => setIsLoading(false), 1000);
    setLastUpdate(new Date());
  };

  const getVehicleEfficiency = (vehicle) => {
    if (vehicle.velocidade === 0) return 'N/A';
    const efficiency = (vehicle.velocidade / 10 + Math.random() * 2).toFixed(1);
    return `${efficiency} km/L`;
  };

  if (isLoading) {
    return (
      <div className="monitoramento-container loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando dados da frota...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoramento-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Monitoramento em Tempo Real</h1>
          <p>Acompanhe toda sua frota em tempo real</p>
          <div className="last-update">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{vehicles.length}</span>
            <span className="stat-label">Veículos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {vehicles.filter(v => v.status === 'em_viagem').length}
            </span>
            <span className="stat-label">Em Viagem</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {vehicles.filter(v => v.status === 'manutencao').length}
            </span>
            <span className="stat-label">Manutenção</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleRefresh}>
            <span className="btn-icon">🔄</span>
            Atualizar
          </button>
          <button className="btn-secondary">
            <span className="btn-icon">📊</span>
            Relatórios
          </button>
          <button className="btn-outline">
            <span className="btn-icon">📱</span>
            App Mobile
          </button>
        </div>
      </div>

      <div className="monitoramento-content">
        <div className="vehicles-sidebar">
          <div className="sidebar-header">
            <h3>Frota Ativa</h3>
            <div className="sidebar-controls">
              <span className="vehicles-count">{vehicles.length} veículos</span>
              <div className="filter-buttons">
                <button className="filter-btn active">Todos</button>
                <button className="filter-btn">Em Viagem</button>
              </div>
            </div>
          </div>
          
          <div className="vehicles-list">
            {vehicles.map(vehicle => {
              const statusInfo = getStatusInfo(vehicle.status);
              return (
                <div 
                  key={vehicle.id}
                  className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? 'active' : ''}`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="vehicle-header">
                    <div className="vehicle-info">
                      <div className="vehicle-main">
                        <span className="vehicle-placa">{vehicle.placa}</span>
                        <span className="vehicle-modelo">{vehicle.modelo}</span>
                      </div>
                      <div className="vehicle-secondary">
                        <span className="vehicle-driver">{vehicle.motorista}</span>
                      </div>
                    </div>
                    <div className="status-indicator" style={{ backgroundColor: statusInfo.color }}>
                      <span className="status-icon">{statusInfo.icon}</span>
                    </div>
                  </div>
                  
                  <div className="vehicle-details">
                    <div className="detail-row">
                      <span className="detail-label">Destino:</span>
                      <span className="detail-value">{vehicle.destino}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Localização:</span>
                      <span className="detail-value truncate">{vehicle.localizacao}</span>
                    </div>
                    <div className="metrics-row">
                      <div className="metric">
                        <span className="metric-icon">📏</span>
                        <span>{vehicle.velocidade} km/h</span>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">⛽</span>
                        <span>{vehicle.combustivel}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">🛣️</span>
                        <span>{(vehicle.odometro / 1000).toFixed(0)}K km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="vehicle-footer">
                    <span className="update-time">{getTimeAgo(vehicle.ultimaAtualizacao)}</span>
                    <div className="vehicle-actions">
                      <button 
                        className="btn-icon-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactDriver(vehicle);
                        }}
                      >
                        📞
                      </button>
                      <button 
                        className="btn-icon-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRoute(vehicle);
                        }}
                      >
                        🗺️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="map-container">
          <div className="map-header">
            <h3>Visualização da Rota</h3>
            <div className="map-controls">
              <button className="map-btn">🗺️ Satélite</button>
              <button className="map-btn">📊 Tráfego</button>
            </div>
          </div>
          <div className="map-placeholder">
            <div className="map-content">
              <div className="map-visualization">
                <div className="route-map">
                  {selectedVehicle ? (
                    <>
                      <div className="route-path">
                        <div className="route-start">
                          <span className="route-marker">🟢</span>
                          <span>Origem</span>
                        </div>
                        <div className="route-line"></div>
                        <div className="route-current">
                          <span className="route-marker vehicle-marker">🚚</span>
                          <span>{selectedVehicle.localizacao}</span>
                        </div>
                        <div className="route-line"></div>
                        <div className="route-end">
                          <span className="route-marker">🔴</span>
                          <span>{selectedVehicle.destino}</span>
                        </div>
                      </div>
                      <div className="vehicle-on-map">
                        <h4>{selectedVehicle.placa}</h4>
                        <p>Posição atual: {selectedVehicle.localizacao}</p>
                      </div>
                    </>
                  ) : (
                    <div className="no-vehicle-selected">
                      <span className="map-icon">🗺️</span>
                      <h3>Mapa em Tempo Real</h3>
                      <p>Selecione um veículo para visualizar a rota</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="details-sidebar">
          {selectedVehicle ? (
            <div className="vehicle-details-panel">
              <div className="panel-header">
                <div className="vehicle-title">
                  <h3>{selectedVehicle.placa}</h3>
                  <span className="vehicle-model">{selectedVehicle.modelo}</span>
                </div>
                <div 
                  className="status-badge"
                  style={{ 
                    backgroundColor: getStatusInfo(selectedVehicle.status).color 
                  }}
                >
                  <span className="status-icon">
                    {getStatusInfo(selectedVehicle.status).icon}
                  </span>
                  {getStatusInfo(selectedVehicle.status).label}
                </div>
              </div>
              
              <div className="driver-info">
                <div className="driver-avatar">
                  {selectedVehicle.motorista.split(' ')[0][0]}
                  {selectedVehicle.motorista.split(' ')[1][0]}
                </div>
                <div className="driver-details">
                  <span className="driver-name">{selectedVehicle.motorista}</span>
                  <span className="driver-contact">📞 Contatar</span>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">⛽</span>
                    <span className="detail-label">Combustível</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-value">{selectedVehicle.combustivel}%</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${selectedVehicle.combustivel}%`,
                          backgroundColor: selectedVehicle.combustivel < 20 ? '#EF4444' : 
                                         selectedVehicle.combustivel < 40 ? '#F59E0B' : '#10B981'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">🌡️</span>
                    <span className="detail-label">Temperatura</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-value">{selectedVehicle.temperatura}°C</span>
                    <span className="detail-subtext">Carga: {selectedVehicle.carga}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">📏</span>
                    <span className="detail-label">Velocidade</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-value">{selectedVehicle.velocidade} km/h</span>
                    <span className="detail-subtext">
                      Eficiência: {getVehicleEfficiency(selectedVehicle)}
                    </span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">🛣️</span>
                    <span className="detail-label">Odômetro</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-value">
                      {selectedVehicle.odometro.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">⏱️</span>
                    <span className="detail-label">Tempo de Viagem</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-value">{selectedVehicle.tempo_viagem}h</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">⚖️</span>
                    <span className="detail-label">Carga</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-value">{selectedVehicle.peso} ton</span>
                    <span className="detail-subtext">{selectedVehicle.carga}</span>
                  </div>
                </div>
              </div>
              
              <div className="vehicle-actions-panel">
                <button 
                  className="btn-primary"
                  onClick={() => handleContactDriver(selectedVehicle)}
                >
                  <span className="btn-icon">📞</span>
                  Contatar Motorista
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => handleViewRoute(selectedVehicle)}
                >
                  <span className="btn-icon">🛣️</span>
                  Detalhes da Rota
                </button>
                <button className="btn-outline">
                  <span className="btn-icon">📋</span>
                  Histórico
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">🚛</div>
              <h4>Nenhum veículo selecionado</h4>
              <p>Selecione um veículo da lista para visualizar detalhes e localização</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitoramento;
