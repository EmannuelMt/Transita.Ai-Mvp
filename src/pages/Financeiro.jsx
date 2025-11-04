// src/pages/Financeiro.jsx
import React, { useState, useMemo, useEffect } from 'react';
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
  FiChevronUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiTrash2,
  FiSearch,
  FiX,
  FiTruck,
  FiUsers,
  FiMapPin
} from 'react-icons/fi';
import { 
  MdAttachMoney,
  MdReceipt,
  MdAccountBalanceWallet,
  MdShowChart,
  MdOutlinePayment,
  MdPendingActions,
  MdAnalytics,
  MdInsights,
  MdSave,
  MdLocalGasStation,
  MdBuild,
  MdSecurity
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoSpeedometerOutline,
  IoCalendarClearOutline,
  IoCarSportOutline
} from 'react-icons/io5';

import './Financeiro.css'

// Serviço de IA Avançado
class FinancialAIService {
  static async analyzeFinancialData(financialData, transactions, vehicles) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const analysis = this.generateAdvancedAnalysis(financialData, transactions, vehicles);
        resolve(analysis);
      }, 1200);
    });
  }

  static generateAdvancedAnalysis(financialData, transactions, vehicles) {
    const healthScore = this.calculateHealthScore(financialData, transactions);
    const insights = this.generateBusinessInsights(financialData, transactions, vehicles);
    const vehiclesAnalysis = this.analyzeFleetPerformance(vehicles);
    const cashFlow = this.calculateCashFlow(transactions);
    const predictions = this.generateMarketPredictions(financialData);

    return {
      healthScore: healthScore.toFixed(1),
      insights,
      vehicles: vehiclesAnalysis,
      cashFlow,
      predictions,
      summary: this.generateExecutiveSummary(financialData, insights, healthScore),
      timestamp: new Date().toLocaleString('pt-BR')
    };
  }

  static calculateHealthScore(financialData, transactions) {
    let score = 7.0;
    const { receita, despesas, lucro, margem } = financialData;

    // Análise de rentabilidade
    if (margem > 25) score += 1;
    if (margem > 35) score += 1.5;
    if (lucro > receita * 0.25) score += 1;

    // Análise de liquidez
    const receitasPendentes = transactions
      .filter(t => t.tipo === 'receita' && t.status === 'pendente')
      .reduce((sum, t) => sum + t.valor, 0);

    if (receitasPendentes > receita * 0.2) score -= 1;
    if (receitasPendentes > receita * 0.3) score -= 1.5;

    // Diversificação
    const clientesUnicos = [...new Set(transactions
      .filter(t => t.tipo === 'receita')
      .map(t => t.cliente))];

    if (clientesUnicos.length >= 8) score += 1;
    if (clientesUnicos.length <= 3) score -= 0.5;

    return Math.min(10, Math.max(0, score));
  }

  static generateBusinessInsights(financialData, transactions, vehicles) {
    const insights = [];
    const { receita, despesas, lucro, margem } = financialData;

    // Insight 1: Eficiência Operacional
    const custoCombustivel = transactions
      .filter(t => t.categoria === 'combustivel')
      .reduce((sum, t) => sum + t.valor, 0);

    const eficienciaCombustivel = (custoCombustivel / despesas) * 100;
    if (eficienciaCombustivel > 35) {
      insights.push({
        id: 1,
        type: 'optimization',
        title: 'Otimização de Combustível',
        description: `Combustível representa ${eficienciaCombustivel.toFixed(1)}% dos custos totais`,
        suggestion: 'Implemente roteirização inteligente e treinamento de direção econômica',
        impact: 'high',
        economyPotential: custoCombustivel * 0.12,
        category: 'operational',
        urgency: 'medium'
      });
    }

    // Insight 2: Gestão Financeira
    if (margem < 28) {
      insights.push({
        id: 2,
        type: 'improvement',
        title: 'Expansão de Margem',
        description: `Margem atual de ${margem}% abaixo da meta setorial (30%)`,
        suggestion: 'Revise tabela de fretes e negocie melhores contratos',
        impact: 'high',
        economyPotential: receita * 0.08,
        category: 'financial',
        urgency: 'high'
      });
    }

    // Insight 3: Recebíveis
    const recebiveisAtrasados = transactions
      .filter(t => t.tipo === 'receita' && t.status === 'atrasado')
      .reduce((sum, t) => sum + t.valor, 0);

    if (recebiveisAtrasados > 0) {
      insights.push({
        id: 3,
        type: 'risk',
        title: 'Recebíveis em Atraso',
        description: `${this.formatCurrency(recebiveisAtrasados)} aguardando recebimento`,
        suggestion: 'Implemente processo de cobrança automatizada',
        impact: 'critical',
        economyPotential: recebiveisAtrasados * 0.9,
        category: 'financial',
        urgency: 'high'
      });
    }

    // Insight 4: Manutenção Preventiva
    const custoManutencao = transactions
      .filter(t => t.categoria === 'manutencao')
      .reduce((sum, t) => sum + t.valor, 0);

    const kmTotal = vehicles.reduce((sum, v) => sum + v.km, 0);
    const custoKmManutencao = custoManutencao / kmTotal;

    if (custoKmManutencao > 0.18) {
      insights.push({
        id: 4,
        type: 'warning',
        title: 'Custos de Manutenção',
        description: `Custo de manutenção por KM (R$ ${custoKmManutencao.toFixed(3)}) acima do ideal`,
        suggestion: 'Revise programa preventivo e negocie com oficinas parceiras',
        impact: 'medium',
        economyPotential: custoManutencao * 0.15,
        category: 'operational',
        urgency: 'medium'
      });
    }

    return insights.sort((a, b) => {
      const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return impactOrder[a.impact] - impactOrder[b.impact];
    });
  }

  static analyzeFleetPerformance(vehicles) {
    return vehicles.map(veiculo => {
      const roi = ((veiculo.receita - veiculo.custos) / veiculo.custos * 100);
      const eficiencia = veiculo.km / veiculo.combustivel;
      const lucro = veiculo.receita - veiculo.custos;
      const utilizacao = ((veiculo.diasTrabalhados || 20) / 22) * 100;

      // Classificação
      let performance = 'good';
      if (roi > 45) performance = 'excellent';
      else if (roi < 20) performance = 'needs_improvement';
      if (eficiencia < 2.5) performance = 'needs_improvement';

      return {
        ...veiculo,
        roi: roi.toFixed(1),
        eficiencia: eficiencia.toFixed(2),
        lucro,
        utilizacao: utilizacao.toFixed(1),
        performance,
        status: this.getVehicleStatus(roi, eficiencia, utilizacao)
      };
    }).sort((a, b) => b.lucro - a.lucro);
  }

  static getVehicleStatus(roi, eficiencia, utilizacao) {
    if (roi < 15) return 'Revisão Urgente';
    if (eficiencia < 2.3) return 'Otimizar Combustível';
    if (utilizacao < 70) return 'Baixa Utilização';
    return 'Operação OK';
  }

  static calculateCashFlow(transactions) {
    const ultimoMes = transactions.filter(t => {
      const data = new Date(t.data);
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);
      return data >= umMesAtras;
    });

    const entradas = ultimoMes
      .filter(t => t.tipo === 'receita' && t.status === 'pago')
      .reduce((sum, t) => sum + t.valor, 0);

    const saidas = ultimoMes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
      projecao: (entradas - saidas) * 1.15
    };
  }

  static generateMarketPredictions(financialData) {
    const crescimentoMercado = 0.12;
    const sazonalidade = 1.18;

    return {
      proximoTrimestre: {
        receita: financialData.receita * (1 + crescimentoMercado),
        lucro: financialData.lucro * (1 + crescimentoMercado * 1.3),
        margem: financialData.margem * 1.08
      },
      altaTemporada: {
        receita: financialData.receita * sazonalidade,
        lucro: financialData.lucro * sazonalidade,
        periodo: 'Junho-Agosto'
      }
    };
  }

  static generateExecutiveSummary(financialData, insights, healthScore) {
    const economiaTotal = insights.reduce((sum, i) => sum + i.economyPotential, 0);
    const insightsCriticos = insights.filter(i => i.impact === 'critical').length;

    return {
      economiaTotal,
      insightsCriticos,
      totalInsights: insights.length,
      situacao: healthScore >= 8 ? 'Excelente' : healthScore >= 6 ? 'Boa' : 'Requer Atenção',
      recomendacaoPrincipal: this.getStrategicRecommendation(insights),
      alertas: insights.filter(i => i.impact === 'critical' || i.impact === 'high').length
    };
  }

  static getStrategicRecommendation(insights) {
    if (insights.length === 0) return "Continue com as operações atuais - desempenho satisfatório";

    const critical = insights.find(i => i.impact === 'critical');
    if (critical) return `AÇÃO IMEDIATA: ${critical.suggestion}`;

    const highImpact = insights.find(i => i.impact === 'high');
    if (highImpact) return `PRIORIDADE: ${highImpact.suggestion}`;

    return `RECOMENDAÇÃO: ${insights[0].suggestion}`;
  }

  static formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  static async generateReport(period, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Relatório ${period} gerado com sucesso`,
          downloadUrl: '#',
          timestamp: new Date().toISOString()
        });
      }, 1500);
    });
  }
}

// Componente Principal
const Financeiro = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados financeiros realistas
  const financialData = useMemo(() => ({
    receita: 187500.00,
    despesas: 132000.00,
    lucro: 55500.00,
    margem: 29.6,
    receitaAnterior: 165000.00,
    despesasAnterior: 125000.00,
    lucroAnterior: 40000.00,
    margemAnterior: 24.2,
    metaMensal: 200000.00,
    crescimento: 13.6,
    custoPorKm: 2.18
  }), []);

  // Inicializar dados
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    
    // Dados de transações realistas
    const transacoesIniciais = [
      {
        id: 1,
        tipo: 'receita',
        descricao: 'Frete Soja - MT → SP',
        valor: 28500.00,
        data: '2024-01-15',
        status: 'pago',
        cliente: 'AgroComércio LTDA',
        categoria: 'frete_grao',
        metodo: 'transferencia'
      },
      {
        id: 2,
        tipo: 'despesa',
        descricao: 'Combustível - Posto BR',
        valor: 12500.00,
        data: '2024-01-14',
        status: 'pago',
        fornecedor: 'Posto BR Express',
        categoria: 'combustivel',
        metodo: 'cartao'
      },
      {
        id: 3,
        tipo: 'receita',
        descricao: 'Frete Eletrônicos - SP → RS',
        valor: 18200.00,
        data: '2024-01-13',
        status: 'pendente',
        cliente: 'TechImport S.A.',
        categoria: 'frete_eletronicos',
        metodo: 'boleto'
      },
      {
        id: 4,
        tipo: 'despesa',
        descricao: 'Manutenção Motor - Scania',
        valor: 8500.00,
        data: '2024-01-12',
        status: 'pago',
        fornecedor: 'Oficina Pesados',
        categoria: 'manutencao',
        metodo: 'pix'
      },
      {
        id: 5,
        tipo: 'receita',
        descricao: 'Frete Açúcar - PR → SC',
        valor: 15600.00,
        data: '2024-01-08',
        status: 'atrasado',
        cliente: 'Doces Nacional',
        categoria: 'frete_alimentos',
        metodo: 'transferencia'
      }
    ];

    // Dados de frota realistas
    const frotaRealista = [
      { 
        id: 1, 
        placa: 'ABC-9I87', 
        modelo: 'Volvo FH 540', 
        ano: 2022,
        receita: 65200, 
        custos: 38900, 
        km: 12500, 
        combustivel: 18500,
        diasTrabalhados: 20
      },
      { 
        id: 2, 
        placa: 'DEF-6H54', 
        modelo: 'Scania R450', 
        ano: 2021,
        receita: 58800, 
        custos: 36200, 
        km: 11800, 
        combustivel: 16800,
        diasTrabalhados: 22
      }
    ];

    setTransactions(transacoesIniciais);
    setVehicles(frotaRealista);

    try {
      const analysis = await FinancialAIService.analyzeFinancialData(
        financialData, 
        transacoesIniciais, 
        frotaRealista
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    setLoading(true);
    try {
      const analysis = await FinancialAIService.analyzeFinancialData(
        financialData, 
        transactions, 
        vehicles
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (type = 'pdf') => {
    setLoading(true);
    try {
      const result = await FinancialAIService.generateReport(selectedPeriod, {
        financialData,
        transactions,
        vehicles,
        analysis: aiAnalysis
      });
      alert(result.message);
    } catch (error) {
      alert('Erro ao exportar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = (transactionData) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id)) + 1,
      ...transactionData,
      data: new Date().toISOString().split('T')[0],
      status: transactionData.tipo === 'despesa' ? 'pago' : 'pendente'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setShowNewTransaction(false);
    setTimeout(handleRefreshAnalysis, 1000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.cliente || transaction.fornecedor || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  // Funções auxiliares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value}%`;
  };

  const getHealthColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      excellent: '#10b981',
      good: '#3b82f6',
      needs_improvement: '#f59e0b',
      critical: '#ef4444'
    };
    return colors[performance] || '#6b7280';
  };

  // Configurações
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: <MdShowChart /> },
    { key: 'ai', label: 'Análise IA', icon: <MdInsights /> },
    { key: 'transactions', label: 'Transações', icon: <MdReceipt /> },
    { key: 'fleet', label: 'Frota', icon: <IoCarSportOutline /> }
  ];

  const insightConfig = {
    optimization: { label: 'Otimização', color: '#3b82f6', icon: <FiTarget /> },
    improvement: { label: 'Melhoria', color: '#8b5cf6', icon: <FiTrendingUp /> },
    risk: { label: 'Risco', color: '#ef4444', icon: <FiAlertTriangle /> },
    warning: { label: 'Atenção', color: '#f59e0b', icon: <FiAlertTriangle /> }
  };

  // Componentes de renderização
  const renderDashboard = () => (
    <div className="financeiro-dashboard">
      {/* KPIs Principais */}
      <div className="kpis-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">
            <MdAttachMoney />
          </div>
          <div className="kpi-content">
            <h3>{formatCurrency(financialData.receita)}</h3>
            <p>Faturamento Mensal</p>
            <span className="kpi-trend positive">+{financialData.crescimento}%</span>
          </div>
        </div>
        
        <div className="kpi-card profit">
          <div className="kpi-icon">
            <FiTrendingUp />
          </div>
          <div className="kpi-content">
            <h3>{formatCurrency(financialData.lucro)}</h3>
            <p>Lucro Líquido</p>
            <span className="kpi-trend positive">+38.8%</span>
          </div>
        </div>
        
        <div className="kpi-card margin">
          <div className="kpi-icon">
            <FiBarChart2 />
          </div>
          <div className="kpi-content">
            <h3>{formatPercent(financialData.margem)}</h3>
            <p>Margem de Lucro</p>
            <span className="kpi-trend positive">+5.4%</span>
          </div>
        </div>
        
        <div className="kpi-card efficiency">
          <div className="kpi-icon">
            <IoSpeedometerOutline />
          </div>
          <div className="kpi-content">
            <h3>R$ {financialData.custoPorKm}</h3>
            <p>Custo por KM</p>
            <span className="kpi-trend negative">+3.2%</span>
          </div>
        </div>
      </div>

      {/* Saúde Financeira e Insights */}
      <div className="insights-health-grid">
        {aiAnalysis && (
          <>
            <div className="health-card">
              <div className="health-header">
                <h3>Saúde Financeira</h3>
                <div className="health-score">
                  <div className="score-circle">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none"/>
                      <circle cx="50" cy="50" r="45" stroke={getHealthColor(aiAnalysis.healthScore)} 
                        strokeWidth="8" fill="none" strokeLinecap="round"
                        strokeDasharray="283" strokeDashoffset={283 * (1 - aiAnalysis.healthScore / 10)}/>
                      <text x="50" y="55" textAnchor="middle" fill={getHealthColor(aiAnalysis.healthScore)} 
                        fontSize="20" fontWeight="bold">
                        {aiAnalysis.healthScore}
                      </text>
                    </svg>
                  </div>
                  <div className="score-info">
                    <span className={`status ${aiAnalysis.healthScore >= 8 ? 'excellent' : aiAnalysis.healthScore >= 6 ? 'good' : 'attention'}`}>
                      {aiAnalysis.summary.situacao}
                    </span>
                    <p>{aiAnalysis.summary.recomendacaoPrincipal}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-insights">
              <h3>Insights Rápidos</h3>
              <div className="insights-list">
                {aiAnalysis.insights.slice(0, 3).map(insight => (
                  <div key={insight.id} className={`insight-item ${insight.type}`}>
                    <div className="insight-icon">
                      {insightConfig[insight.type].icon}
                    </div>
                    <div className="insight-content">
                      <h4>{insight.title}</h4>
                      <p>{insight.description}</p>
                      <span className="economy">Economia: {formatCurrency(insight.economyPotential)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Performance da Frota */}
      {aiAnalysis && (
        <div className="fleet-overview">
          <div className="section-header">
            <h3>Performance da Frota</h3>
            <button className="btn-secondary">Ver Detalhes</button>
          </div>
          <div className="fleet-cards">
            {aiAnalysis.vehicles.slice(0, 2).map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-info">
                    <h4>{vehicle.placa}</h4>
                    <span>{vehicle.modelo}</span>
                  </div>
                  <div 
                    className="performance-badge"
                    style={{ backgroundColor: getPerformanceColor(vehicle.performance) }}
                  >
                    {vehicle.performance.replace('_', ' ')}
                  </div>
                </div>
                <div className="vehicle-stats">
                  <div className="stat">
                    <span>ROI</span>
                    <strong>{vehicle.roi}%</strong>
                  </div>
                  <div className="stat">
                    <span>Eficiência</span>
                    <strong>{vehicle.eficiencia} km/L</strong>
                  </div>
                  <div className="stat">
                    <span>Utilização</span>
                    <strong>{vehicle.utilizacao}%</strong>
                  </div>
                </div>
                <div className="vehicle-status">
                  <span>{vehicle.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAIAnalysis = () => (
    <div className="ai-analysis">
      {aiAnalysis && (
        <>
          <div className="analysis-header">
            <div className="header-content">
              <h2>Análise Inteligente Completa</h2>
              <p>Relatório gerado em: {aiAnalysis.timestamp}</p>
            </div>
            <div className="header-actions">
              <button className="btn-primary" onClick={() => handleExportReport('pdf')}>
                <FiDownload /> Exportar PDF
              </button>
            </div>
          </div>

          <div className="analysis-grid">
            <div className="executive-summary">
              <h3>Resumo Executivo</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <h4>Recomendação Principal</h4>
                  <p>{aiAnalysis.summary.recomendacaoPrincipal}</p>
                </div>
                <div className="summary-card">
                  <h4>Economia Potencial</h4>
                  <p className="economy-value">{formatCurrency(aiAnalysis.summary.economiaTotal)}</p>
                </div>
                <div className="summary-card">
                  <h4>Alertas Ativos</h4>
                  <p className="alerts-count">{aiAnalysis.summary.alertas} alertas</p>
                </div>
              </div>
            </div>

            <div className="detailed-insights">
              <h3>Análises Detalhadas</h3>
              <div className="insights-container">
                {aiAnalysis.insights.map(insight => (
                  <div key={insight.id} className="detailed-insight">
                    <div className="insight-header">
                      <div 
                        className="insight-type"
                        style={{ borderLeftColor: insightConfig[insight.type].color }}
                      >
                        <div className="type-icon">
                          {insightConfig[insight.type].icon}
                        </div>
                        <span>{insightConfig[insight.type].label}</span>
                      </div>
                      <div className={`impact-badge ${insight.impact}`}>
                        {insight.impact}
                      </div>
                    </div>
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                    <div className="insight-actions">
                      <div className="suggestion">
                        <strong>Sugestão:</strong> {insight.suggestion}
                      </div>
                      <div className="potential">
                        <strong>Potencial:</strong> 
                        <span>{formatCurrency(insight.economyPotential)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div className="transactions-page">
      <div className="page-header">
        <div className="header-content">
          <h2>Gestão de Transações</h2>
          <p>Controle completo de receitas e despesas</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowNewTransaction(true)}
          >
            <FiPlus /> Nova Transação
          </button>
        </div>
      </div>

      <div className="transactions-container">
        <div className="transactions-stats">
          <div className="stat-card">
            <span>Total Receitas</span>
            <strong>
              {formatCurrency(
                transactions.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0)
              )}
            </strong>
          </div>
          <div className="stat-card">
            <span>Total Despesas</span>
            <strong>
              {formatCurrency(
                transactions.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0)
              )}
            </strong>
          </div>
          <div className="stat-card">
            <span>Saldo</span>
            <strong>
              {formatCurrency(
                transactions.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0) -
                transactions.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0)
              )}
            </strong>
          </div>
        </div>

        <div className="transactions-list">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className="transaction-row">
              <div className="transaction-type">
                <div className={`type-icon ${transaction.tipo}`}>
                  {transaction.tipo === 'receita' ? <FiArrowUpRight /> : <FiArrowDownRight />}
                </div>
              </div>
              <div className="transaction-info">
                <h4>{transaction.descricao}</h4>
                <p>{transaction.cliente || transaction.fornecedor}</p>
                <span className="transaction-date">
                  <FiCalendar /> {transaction.data}
                </span>
              </div>
              <div className="transaction-status">
                <span className={`status-badge ${transaction.status}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="transaction-value">
                <span className={transaction.tipo}>
                  {transaction.tipo === 'receita' ? '+' : '-'}
                  {formatCurrency(transaction.valor)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="financeiro-container">
      {/* Header */}
      <header className="financeiro-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Painel Financeiro Inteligente</h1>
            <p>Gestão avançada com análise de IA para transportadoras</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-secondary"
              onClick={handleRefreshAnalysis}
              disabled={loading}
            >
              <FiRefreshCw /> {loading ? 'Atualizando...' : 'Atualizar Dados'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="financeiro-nav">
        <div className="nav-container">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Analisando dados com IA...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="financeiro-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'ai' && renderAIAnalysis()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'fleet' && aiAnalysis && (
          <div className="fleet-management">
            <h2>Gestão Completa da Frota</h2>
            {/* Conteúdo da frota */}
          </div>
        )}
      </main>

      {/* Modal Nova Transação */}
      {showNewTransaction && (
        <NewTransactionModal
          onClose={() => setShowNewTransaction(false)}
          onSave={handleNewTransaction}
        />
      )}
    </div>
  );
};

// Componente Modal
const NewTransactionModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    valor: '',
    categoria: 'frete_grao',
    cliente: '',
    fornecedor: '',
    metodo: 'transferencia'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.descricao && formData.valor) {
      onSave({
        ...formData,
        valor: parseFloat(formData.valor)
      });
    }
  };

  const categorias = {
    receita: ['frete_grao', 'frete_eletronicos', 'frete_alimentos', 'frete_quimicos'],
    despesa: ['combustivel', 'manutencao', 'seguro', 'impostos', 'salarios', 'outros']
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Nova Transação</h3>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Transação</label>
              <select 
                value={formData.tipo} 
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Categoria</label>
              <select 
                value={formData.categoria} 
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
              >
                {categorias[formData.tipo].map(cat => (
                  <option key={cat} value={cat}>
                    {cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Ex: Frete Soja - MT → SP"
              required
            />
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              placeholder="0,00"
              required
            />
          </div>

          {formData.tipo === 'receita' ? (
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                placeholder="Nome do cliente"
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Fornecedor</label>
              <input
                type="text"
                value={formData.fornecedor}
                onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
                placeholder="Nome do fornecedor"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <MdSave /> Salvar Transação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Financeiro;