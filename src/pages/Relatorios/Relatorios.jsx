import React, { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { api } from '../../services/api';
import { obterEstatisticas } from '../../services/estatisticas';
import { gerarRelatorio, gerarRelatorioPagamentos, enviarRelatorioPorEmail } from '../../services/relatorios';
import './Relatorios.css';

const AVAILABLE_REPORTS = [
  { key: 'multas', label: 'Multas' },
  { key: 'financeiro', label: 'Financeiro' },
  { key: 'frota', label: 'Frota' }
];

const usePersisted = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) { }
  }, [key, state]);
  return [state, setState];
};

const ChartCard = ({ title, children }) => (
  <div className="chart-card">
    <div className="chart-header">
      <h3>{title}</h3>
    </div>
    <div className="chart-body">{children}</div>
  </div>
);

const Relatorios = ({ user }) => {
  const [periodo, setPeriodo] = usePersisted('relatorios.periodo', 'mes');
  const [selected, setSelected] = usePersisted('relatorios.selected', {
    multas: true,
    financeiro: false,
    frota: false
  });

  const [loadingMap, setLoadingMap] = useState({});
  const [dataMap, setDataMap] = useState({});
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportEmail, setExportEmail] = useState(user?.email || '');
  const [exportPassword, setExportPassword] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  const toggleReport = (key) => {
    setSelected((s) => ({ ...s, [key]: !s[key] }));
  };

  const fetchMultas = async () => {
    setLoadingMap((l) => ({ ...l, multas: true }));
    try {
      const resp = await obterEstatisticas(periodo);
      setDataMap((d) => ({ ...d, multas: resp }));
    } catch (err) {
      console.error('Erro ao buscar estatísticas de multas', err);
    } finally {
      setLoadingMap((l) => ({ ...l, multas: false }));
    }
  };

  const fetchFinanceiro = async () => {
    setLoadingMap((l) => ({ ...l, financeiro: true }));
    try {
      // endpoint exemplo - backend pode expor outro caminho
      const resp = await api.get('/financeiro/summary', { params: { periodo } });
      setDataMap((d) => ({ ...d, financeiro: resp.data }));
    } catch (err) {
      console.warn('Financeiro endpoint não disponível, usando mock', err);
      // mock data
      setDataMap((d) => ({ ...d, financeiro: { faturamento: [12000, 15000, 18000, 21000, 24000, 26000], meses: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'] } }));
    } finally {
      setLoadingMap((l) => ({ ...l, financeiro: false }));
    }
  };

  const fetchFrota = async () => {
    setLoadingMap((l) => ({ ...l, frota: true }));
    try {
      const resp = await api.get('/frota/summary', { params: { periodo } });
      setDataMap((d) => ({ ...d, frota: resp.data }));
    } catch (err) {
      console.warn('Frota endpoint não disponível, usando mock', err);
      setDataMap((d) => ({ ...d, frota: { disponiveis: 120, emServico: 85, manutencao: 15 } }));
    } finally {
      setLoadingMap((l) => ({ ...l, frota: false }));
    }
  };

  useEffect(() => {
    // fetch data for selected reports
    if (selected.multas) fetchMultas();
    if (selected.financeiro) fetchFinanceiro();
    if (selected.frota) fetchFrota();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  useEffect(() => {
    // when user toggles a report on, fetch its data
    Object.entries(selected).forEach(([key, val]) => {
      if (val && !dataMap[key]) {
        if (key === 'multas') fetchMultas();
        if (key === 'financeiro') fetchFinanceiro();
        if (key === 'frota') fetchFrota();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const reports = Object.keys(selected).filter((k) => selected[k]);
      await enviarRelatorioPorEmail({ reports, periodo, email: exportEmail, password: exportPassword });
      alert('Relatório solicitado. Verifique seu email em alguns minutos.');
      setExportModalOpen(false);
      setExportPassword('');
    } catch (err) {
      console.error(err);
      alert('Falha ao solicitar envio do relatório: ' + (err?.response?.data?.message || err.message));
    } finally {
      setExportLoading(false);
    }
  };

  const multasChart = useMemo(() => {
    const stats = dataMap.multas;
    if (!stats) return null;
    const categories = stats?.trends?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const series = [
      { name: 'Total', data: stats?.trends?.total || [10, 20, 30, 40, 50, 60] },
      { name: 'Pendentes', data: stats?.trends?.pendentes || [2, 5, 8, 4, 3, 6] }
    ];
    const options = { xaxis: { categories } };
    return { options, series };
  }, [dataMap.multas]);

  const financeiroChart = useMemo(() => {
    const d = dataMap.financeiro;
    if (!d) return null;
    const options = { xaxis: { categories: d.meses || ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'] } };
    const series = [{ name: 'Faturamento', data: d.faturamento || [] }];
    return { options, series };
  }, [dataMap.financeiro]);

  const frotaChart = useMemo(() => {
    const d = dataMap.frota;
    if (!d) return null;
    const options = { labels: ['Disponíveis', 'Em Serviço', 'Manutenção'] };
    const series = [d.disponiveis || 0, d.emServico || 0, d.manutencao || 0];
    return { options, series };
  }, [dataMap.frota]);

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
            <option value="todos">Todos</option>
          </select>
          <button className="btn-primary" onClick={() => setExportModalOpen(true)}>
            <span className="btn-icon">📥</span>
            Exportar & Enviar por Email
          </button>
        </div>
      </div>

      <div className="report-selector">
        {AVAILABLE_REPORTS.map((r) => (
          <label key={r.key} className="report-toggle">
            <input type="checkbox" checked={!!selected[r.key]} onChange={() => toggleReport(r.key)} />
            {r.label}
          </label>
        ))}
      </div>

      <div className="charts-grid">
        {selected.multas && (
          <ChartCard title="Multas">
            {loadingMap.multas ? <div>Carregando...</div> : (multasChart ? <Chart options={multasChart.options} series={multasChart.series} type="area" height={320} /> : <div>Sem dados</div>)}
          </ChartCard>
        )}

        {selected.financeiro && (
          <ChartCard title="Financeiro">
            {loadingMap.financeiro ? <div>Carregando...</div> : (financeiroChart ? <Chart options={financeiroChart.options} series={financeiroChart.series} type="bar" height={320} /> : <div>Sem dados</div>)}
          </ChartCard>
        )}

        {selected.frota && (
          <ChartCard title="Frota">
            {loadingMap.frota ? <div>Carregando...</div> : (frotaChart ? <Chart options={frotaChart.options} series={frotaChart.series} type="donut" height={320} /> : <div>Sem dados</div>)}
          </ChartCard>
        )}
      </div>

      {exportModalOpen && (
        <div className="export-modal">
          <div className="export-modal-card">
            <h3>Enviar relatório por email</h3>
            <p>Confirme com sua senha para autorizar o envio do relatório por email.</p>
            <label>Email</label>
            <input value={exportEmail} onChange={(e) => setExportEmail(e.target.value)} />
            <label>Senha</label>
            <input type="password" value={exportPassword} onChange={(e) => setExportPassword(e.target.value)} />
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setExportModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleExport} disabled={exportLoading || !exportPassword || !exportEmail}>{exportLoading ? 'Enviando...' : 'Confirmar e Enviar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;
