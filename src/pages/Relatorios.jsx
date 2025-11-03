import React, { useState } from 'react';
import "../styles/Relatorios.css";


const Relatorios = ({ user, onNavigate }) => {
  const [periodo, setPeriodo] = useState('mes');

  const metricas = [
    {
      titulo: 'Faturamento Total',
      valor: 'R$ 42.500,00',
      variacao: '+12%',
      tendencia: 'up',
      icone: '💰'
    },
    {
      titulo: 'Entregas Realizadas',
      valor: '156',
      variacao: '+8%',
      tendencia: 'up',
      icone: '📦'
    },
    {
      titulo: 'Taxa de Entrega no Prazo',
      valor: '94%',
      variacao: '+3%',
      tendencia: 'up',
      icone: '✅'
    },
    {
      titulo: 'Custo Médio por KM',
      valor: 'R$ 2,45',
      variacao: '-5%',
      tendencia: 'down',
      icone: '⛽'
    }
  ];

  const topRotas = [
    { rota: 'SP → RJ', viagens: 45, faturamento: 'R$ 189.000' },
    { rota: 'SP → MG', viagens: 32, faturamento: 'R$ 134.400' },
    { rota: 'SP → PR', viagens: 28, faturamento: 'R$ 117.600' },
    { rota: 'SP → RS', viagens: 24, faturamento: 'R$ 100.800' }
  ];

  return (
    <div className="relatorios-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Relatórios e Analytics</h1>
          <p>Análises detalhadas do desempenho da sua operação</p>
        </div>
        <div className="header-actions">
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="period-select"
          >
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="ano">Este Ano</option>
          </select>
          <button className="btn-primary">
            <span className="btn-icon">📥</span>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {metricas.map((metrica, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">{metrica.icone}</div>
              <div className={`metric-trend ${metrica.tendencia}`}>
                {metrica.variacao}
              </div>
            </div>
            <div className="metric-content">
              <h3 className="metric-value">{metrica.valor}</h3>
              <p className="metric-title">{metrica.titulo}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Faturamento Mensal</h3>
            <span className="chart-subtitle">Últimos 6 meses</span>
          </div>
          <div className="chart-placeholder">
            <div className="chart-content">
              <span className="chart-icon">📈</span>
              <p>Gráfico de Faturamento</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Entregas por Status</h3>
            <span className="chart-subtitle">Distribuição atual</span>
          </div>
          <div className="chart-placeholder">
            <div className="chart-content">
              <span className="chart-icon">🍩</span>
              <p>Gráfico de Pizza</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tables-grid">
        <div className="table-card">
          <div className="table-header">
            <h3>Top Rotas</h3>
            <span className="table-subtitle">Rotas mais lucrativas</span>
          </div>
          <div className="table-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rota</th>
                  <th>Viagens</th>
                  <th>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {topRotas.map((rota, index) => (
                  <tr key={index}>
                    <td>
                      <div className="rota-info">
                        <span className="rota-text">{rota.rota}</span>
                      </div>
                    </td>
                    <td>
                      <span className="viagens-count">{rota.viagens}</span>
                    </td>
                    <td>
                      <span className="faturamento-value">{rota.faturamento}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Desempenho de Motoristas</h3>
            <span className="table-subtitle">Top performers</span>
          </div>
          <div className="table-content">
            <div className="performance-list">
              <div className="performance-item">
                <div className="driver-info">
                  <span className="driver-avatar">👤</span>
                  <div className="driver-details">
                    <span className="driver-name">Carlos Santos</span>
                    <span className="driver-stats">15 viagens • 4.8⭐</span>
                  </div>
                </div>
                <span className="performance-value">94%</span>
              </div>
              <div className="performance-item">
                <div className="driver-info">
                  <span className="driver-avatar">👤</span>
                  <div className="driver-details">
                    <span className="driver-name">Maria Oliveira</span>
                    <span className="driver-stats">12 viagens • 4.9⭐</span>
                  </div>
                </div>
                <span className="performance-value">96%</span>
              </div>
              <div className="performance-item">
                <div className="driver-info">
                  <span className="driver-avatar">👤</span>
                  <div className="driver-details">
                    <span className="driver-name">Pedro Costa</span>
                    <span className="driver-stats">18 viagens • 4.7⭐</span>
                  </div>
                </div>
                <span className="performance-value">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <div className="insights-header">
          <h3>📊 Insights e Recomendações</h3>
        </div>
        <div className="insights-grid">
          <div className="insight-card positive">
            <div className="insight-icon">🚀</div>
            <div className="insight-content">
              <h4>Alta Performance</h4>
              <p>Taxa de entregas no prazo aumentou 3% este mês</p>
            </div>
          </div>
          <div className="insight-card warning">
            <div className="insight-icon">⛽</div>
            <div className="insight-content">
              <h4>Otimização de Custos</h4>
              <p>Custo por KM reduziu 5% - continue assim!</p>
            </div>
          </div>
          <div className="insight-card info">
            <div className="insight-icon">🛣️</div>
            <div className="insight-content">
              <h4>Rota Popular</h4>
              <p>SP → RJ é sua rota mais lucrativa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
