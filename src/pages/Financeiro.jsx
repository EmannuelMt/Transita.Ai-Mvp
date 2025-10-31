import React, { useState } from 'react';
import '../styles/financeiro.css';

const Financeiro = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const financialData = {
    receita: 'R$ 42.500,00',
    despesas: 'R$ 28.300,00',
    lucro: 'R$ 14.200,00',
    margem: '33.4%'
  };

  const transacoes = [
    {
      id: 1,
      tipo: 'receita',
      descricao: 'Frete SP → RJ',
      valor: 'R$ 4.200,00',
      data: '2024-01-15',
      status: 'pago',
      cliente: 'Logística Brasil LTDA'
    },
    {
      id: 2,
      tipo: 'despesa',
      descricao: 'Manutenção Veicular',
      valor: 'R$ 2.500,00',
      data: '2024-01-14',
      status: 'pago',
      fornecedor: 'Oficina Central'
    },
    {
      id: 3,
      tipo: 'receita',
      descricao: 'Frete BH → DF',
      valor: 'R$ 3.800,00',
      data: '2024-01-13',
      status: 'pendente',
      cliente: 'Mercado Express'
    }
  ];

  return (
    <div className="financeiro-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestão Financeira</h1>
          <p>Controle completo das finanças da sua transportadora</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <span className="btn-icon">💸</span>
            Nova Transação
          </button>
          <button className="btn-secondary">
            <span className="btn-icon">📊</span>
            Relatório
          </button>
        </div>
      </div>

      <div className="financial-overview">
        <div className="overview-card receita">
          <div className="overview-icon">💰</div>
          <div className="overview-content">
            <h3>{financialData.receita}</h3>
            <p>Receita Total</p>
            <span className="trend positive">+12% este mês</span>
          </div>
        </div>
        
        <div className="overview-card despesas">
          <div className="overview-icon">💳</div>
          <div className="overview-content">
            <h3>{financialData.despesas}</h3>
            <p>Despesas Totais</p>
            <span className="trend negative">+8% este mês</span>
          </div>
        </div>
        
        <div className="overview-card lucro">
          <div className="overview-icon">📈</div>
          <div className="overview-content">
            <h3>{financialData.lucro}</h3>
            <p>Lucro Líquido</p>
            <span className="trend positive">+15% este mês</span>
          </div>
        </div>
        
        <div className="overview-card margem">
          <div className="overview-icon">🎯</div>
          <div className="overview-content">
            <h3>{financialData.margem}</h3>
            <p>Margem de Lucro</p>
            <span className="trend positive">+3% este mês</span>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="tabs">
          {['overview', 'transacoes', 'relatorios', 'fluxo'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="period-controls">
          <select className="period-select">
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
        </div>
      </div>

      <div className="content-grid">
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Fluxo de Caixa</h3>
              <span className="chart-subtitle">Últimos 6 meses</span>
            </div>
            <div className="chart-placeholder">
              <div className="chart-content">
                <span className="chart-icon">📊</span>
                <p>Gráfico de Fluxo de Caixa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <div className="transactions-card">
            <div className="card-header">
              <h3>Últimas Transações</h3>
              <button className="btn-link">Ver todas →</button>
            </div>
            <div className="transactions-list">
              {transacoes.map(transacao => (
                <div key={transacao.id} className="transaction-item">
                  <div className="transaction-icon">
                    {transacao.tipo === 'receita' ? '💰' : '💳'}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-info">
                      <span className="transaction-desc">{transacao.descricao}</span>
                      <span className="transaction-date">{transacao.data}</span>
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-client">
                        {transacao.cliente || transacao.fornecedor}
                      </span>
                      <span className={`transaction-status ${transacao.status}`}>
                        {transacao.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                  <div className={`transaction-value ${transacao.tipo}`}>
                    {transacao.tipo === 'receita' ? '+' : '-'}{transacao.valor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Faturamento Mensal</h4>
            <div className="stat-value">R$ 42.5k</div>
            <div className="stat-trend positive">+12%</div>
          </div>
          <div className="stat-card">
            <h4>Custo por KM</h4>
            <div className="stat-value">R$ 2,45</div>
            <div className="stat-trend negative">+5%</div>
          </div>
          <div className="stat-card">
            <h4>Ticket Médio</h4>
            <div className="stat-value">R$ 3.800</div>
            <div className="stat-trend positive">+8%</div>
          </div>
          <div className="stat-card">
            <h4>Dias de Receber</h4>
            <div className="stat-value">12 dias</div>
            <div className="stat-trend positive">-2 dias</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
