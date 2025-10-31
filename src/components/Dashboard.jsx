import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState({
    vehiclesInOperation: 0,
    maintenanceAlerts: 0,
    activeDeliveries: 0,
    fuelEfficiency: 0,
    totalDistance: 0,
    driverPerformance: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  // Simulação de dados da API
  useEffect(() => {
    // Em um cenário real, isso viria de uma API
    const fetchDashboardData = async () => {
      const mockData = {
        vehiclesInOperation: 42,
        maintenanceAlerts: 8,
        activeDeliveries: 156,
        fuelEfficiency: 7.8,
        totalDistance: 12500,
        driverPerformance: 92
      };
      
      const mockActivities = [
        { id: 1, vehicle: 'SCA-4B28', driver: 'João Silva', type: 'entrega', status: 'concluída', time: '10:30' },
        { id: 2, vehicle: 'SCA-5C39', driver: 'Maria Santos', type: 'manutenção', status: 'agendada', time: '11:15' },
        { id: 3, vehicle: 'SCA-2A17', driver: 'Pedro Costa', type: 'rota', status: 'atrasada', time: '12:45' },
        { id: 4, vehicle: 'SCA-8D42', driver: 'Ana Oliveira', type: 'entrega', status: 'em andamento', time: '13:20' }
      ];

      setDashboardData(mockData);
      setRecentActivities(mockActivities);
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'concluída': '#10B981',
      'em andamento': '#3B82F6',
      'atrasada': '#EF4444',
      'agendada': '#F59E0B'
    };
    return colors[status] || '#6B7280';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Painel de Controle - Frota</h1>
          <p>Monitoramento em tempo real da operação logística</p>
          <div className="user-welcome">
            <span>Bem-vindo, {user?.name || 'Operador'}</span>
            <span className="current-time">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card operational">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{dashboardData.vehiclesInOperation}</h3>
            <p>Veículos em Operação</p>
            <span className="stat-trend positive">+12% vs mês anterior</span>
          </div>
        </div>
        
        <div className="stat-card alerts">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{dashboardData.maintenanceAlerts}</h3>
            <p>Alertas de Manutenção</p>
            <span className="stat-trend negative">+2 pendentes</span>
          </div>
        </div>
        
        <div className="stat-card deliveries">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{dashboardData.activeDeliveries}</h3>
            <p>Entregas Ativas</p>
            <span className="stat-trend">86% no prazo</span>
          </div>
        </div>
        
        <div className="stat-card efficiency">
          <div className="stat-icon">⛽</div>
          <div className="stat-content">
            <h3>{dashboardData.fuelEfficiency} km/L</h3>
            <p>Eficiência de Combustível</p>
            <span className="stat-trend positive">+0.4 km/L</span>
          </div>
        </div>

        <div className="stat-card distance">
          <div className="stat-icon">🛣️</div>
          <div className="stat-content">
            <h3>{dashboardData.totalDistance.toLocaleString()} km</h3>
            <p>Distância Percorrida</p>
            <span className="stat-trend">Este mês</span>
          </div>
        </div>

        <div className="stat-card performance">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{dashboardData.driverPerformance}%</h3>
            <p>Performance dos Motoristas</p>
            <span className="stat-trend positive">+5%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="recent-activities">
            <h3>Atividades Recentes</h3>
            <div className="activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'entrega' && '📦'}
                    {activity.type === 'manutenção' && '🔧'}
                    {activity.type === 'rota' && '🗺️'}
                  </div>
                  <div className="activity-details">
                    <div className="activity-main">
                      <span className="vehicle">{activity.vehicle}</span>
                      <span className="driver">{activity.driver}</span>
                    </div>
                    <div className="activity-secondary">
                      <span className={`status status-${activity.status.replace(' ', '-')}`}
                            style={{ color: getStatusColor(activity.status) }}>
                        {activity.status}
                      </span>
                      <span className="time">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Ações Rápidas</h3>
            <div className="actions-grid">
              <button className="action-btn primary">
                <span className="action-icon">➕</span>
                Nova Rota
              </button>
              <button className="action-btn secondary">
                <span className="action-icon">🚛</span>
                Alocar Veículo
              </button>
              <button className="action-btn warning">
                <span className="action-icon">🔧</span>
                Agendar Manutenção
              </button>
              <button className="action-btn info">
                <span className="action-icon">📊</span>
                Relatório de Desempenho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
