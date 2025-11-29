import React, { useState, useEffect, useMemo } from 'react';
import { listarMultas } from '../../services/multas';
import {
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiSearch,
    FiFilter,
    FiDownload,
    FiEye,
    FiEdit,
    FiMap,
    FiPlus,
    FiArrowRight,
    FiBarChart2,
    FiRefreshCw,
    FiMoreVertical,
    FiStar,
    FiAlertCircle,
    FiChevronDown,
    FiChevronUp,
    FiCreditCard,
    FiFileText,
    FiCalendar,
    FiTrendingUp,
    FiMapPin
} from 'react-icons/fi';
import {
    MdWarning,
    MdPendingActions,
    MdCheckCircleOutline,
    MdCancel,
    MdLocationOn,
    MdExpandMore,
    MdPayments
} from 'react-icons/md';
import {
    IoStatsChart,
    IoSpeedometerOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { criarPagamento } from '../../services/pagamentos';
import { useAuth } from '../../context/AuthContext';

import './Multas.css';
import './MultasDashboard.css';

import { formatarMoeda, PERIODOS } from '../../utils/formatters';
import { obterEstatisticas, obterEstatisticasPorLocalidade } from '../../services/estatisticas';
import DashboardCard from '../../components/Dashboard/DashboardCard';
import PeriodSelector from '../../components/PeriodSelector/PeriodSelector';

const MultasPage = ({ onNavigate }) => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('pendentes');
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('mes');
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [estatisticas, setEstatisticas] = useState({
        total: 0,
        pendentes: 0,
        valorTotal: 0,
        valorPendente: 0,
        trends: {
            total: 0,
            pendentes: 0,
            valorTotal: 0,
            valorPendente: 0
        }
    });

    // Carregar estatísticas
    useEffect(() => {
        const carregarEstatisticas = async () => {
            try {
                setDashboardLoading(true);
                const response = await obterEstatisticas(periodo);
                setEstatisticas(response);
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setDashboardLoading(false);
            }
        };

        carregarEstatisticas();
    }, [periodo]);

    // Componente da Dashboard
    const Dashboard = () => {
        return (
            <div className="multas-dashboard">
                <div className="dashboard-header">
                    <h2>Resumo de Multas</h2>
                </div>
                <PeriodSelector value={periodo} onChange={setPeriodo} />

                <div className="dashboard-grid">
                    <DashboardCard
                        title="Total de Multas"
                        value={estatisticas.total}
                        subtitle={`Período: ${periodo}`}
                        trend
                        trendValue={estatisticas.trends.total}
                        icon={FiAlertTriangle}
                        loading={dashboardLoading}
                    />
                    <DashboardCard
                        title="Multas Pendentes"
                        value={estatisticas.pendentes}
                        subtitle="Aguardando pagamento"
                        trend
                        trendValue={estatisticas.trends.pendentes}
                        icon={FiClock}
                        loading={dashboardLoading}
                    />
                    <DashboardCard
                        title="Valor Total"
                        value={formatarMoeda(estatisticas.valorTotal)}
                        subtitle="Acumulado"
                        trend
                        trendValue={estatisticas.trends.valorTotal}
                        icon={FiDollarSign}
                        loading={dashboardLoading}
                    />
                    <DashboardCard
                        title="A Pagar"
                        value={formatarMoeda(estatisticas.valorPendente)}
                        subtitle="Valor pendente"
                        trend
                        trendValue={estatisticas.trends.valorPendente}
                        icon={FiCreditCard}
                        loading={dashboardLoading}
                    />
                </div>
            </div>
        );
    };

    const DashboardSection = () => (
        <div className="dashboard-grid">
            <DashboardCard
                title="Total de Multas"
                value={estatisticas.total}
                subtitle={`Período: ${periodo}`}
                trend
                trendValue={estatisticas.trends.total}
                icon={FiAlertTriangle}
            />
            <DashboardCard
                title="Multas Pendentes"
                value={estatisticas.pendentes}
                subtitle="Aguardando pagamento"
                trend
                trendValue={estatisticas.trends.pendentes}
                icon={FiClock}
            />
            <DashboardCard
                title="Valor Total"
                value={formatarMoeda(estatisticas.valorTotal)}
                subtitle="Acumulado"
                trend
                trendValue={estatisticas.trends.valorTotal}
                icon={FiDollarSign}
            />
            <DashboardCard
                title="A Pagar"
                value={formatarMoeda(estatisticas.valorPendente)}
                subtitle="Valor pendente"
                trend
                trendValue={estatisticas.trends.valorPendente}
                icon={FiCreditCard}
            />
        </div>
    );

    const PeriodoSelector = () => (
        <div className="periodo-selector">
            <label>Período:</label>
            <div className="periodo-buttons">
                {PERIODOS.map(p => (
                    <button
                        key={p.value}
                        className={`periodo-button ${periodo === p.value ? 'active' : ''}`}
                        onClick={() => setPeriodo(p.value)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const ActionButtons = () => (
        <div className="action-buttons">
            <button className="action-button primary" onClick={() => setShowAddMultaModal(true)}>
                <FiPlus /> Adicionar Multa
                <span className="button-description">Registrar multa manualmente</span>
            </button>
            <button className="action-button secondary" onClick={handlePagamentoLote}>
                <FiCreditCard /> Pagar Multas
                <span className="button-description">Realizar pagamento em lote</span>
            </button>
            <button className="action-button tertiary" onClick={handleGerarRelatorio}>
                <FiFileText /> Relatórios
                <span className="button-description">Gerar relatórios detalhados</span>
            </button>
            <button className="action-button quaternary" onClick={() => setShowLocalidadeModal(true)}>
                <FiMapPin /> Por Localidade
                <span className="button-description">Multas por estado/cidade</span>
            </button>
        </div>
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMulta, setSelectedMulta] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'data', direction: 'desc' });
    const [filterOpen, setFilterOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState('mes');
    const [filters, setFilters] = useState({
        status: [],
        estado: [],
        valor: { min: 0, max: 5000 },
        tipo: []
    });

    const valoresMultasPorEstado = {
        'SP': {
            'São Paulo': {
                excesso_velocidade: { minimo: 130.16, medio: 195.23, maximo: 293.47 },
                avanco_sinal: { minimo: 293.47, medio: 440.20, maximo: 880.41 },
                estacionamento: { minimo: 88.38, medio: 132.57, maximo: 176.76 },
                embriaguez: { minimo: 2934.70, medio: 4402.05, maximo: 8804.10 },
                celular: { minimo: 293.47, medio: 440.20, maximo: 586.94 }
            }
        },
        'RJ': {
            'Rio de Janeiro': {
                excesso_velocidade: { minimo: 130.16, medio: 195.23, maximo: 293.47 },
                avanco_sinal: { minimo: 293.47, medio: 440.20, maximo: 880.41 },
                estacionamento: { minimo: 88.38, medio: 132.57, maximo: 176.76 },
                embriaguez: { minimo: 2934.70, medio: 4402.05, maximo: 8804.10 },
                celular: { minimo: 293.47, medio: 440.20, maximo: 586.94 }
            }
        },
        'MG': {
            'Belo Horizonte': {
                excesso_velocidade: { minimo: 130.16, medio: 195.23, maximo: 293.47 },
                avanco_sinal: { minimo: 293.47, medio: 440.20, maximo: 880.41 },
                estacionamento: { minimo: 88.38, medio: 132.57, maximo: 176.76 },
                embriaguez: { minimo: 2934.70, medio: 4402.05, maximo: 8804.10 },
                celular: { minimo: 293.47, medio: 440.20, maximo: 586.94 }
            }
        },
        'RS': {
            'Porto Alegre': {
                excesso_velocidade: { minimo: 130.16, medio: 195.23, maximo: 293.47 },
                avanco_sinal: { minimo: 293.47, medio: 440.20, maximo: 880.41 },
                estacionamento: { minimo: 88.38, medio: 132.57, maximo: 176.76 },
                embriaguez: { minimo: 2934.70, medio: 4402.05, maximo: 8804.10 },
                celular: { minimo: 293.47, medio: 440.20, maximo: 586.94 }
            }
        },
        'PR': {
            'Curitiba': {
                excesso_velocidade: { minimo: 130.16, medio: 195.23, maximo: 293.47 },
                avanco_sinal: { minimo: 293.47, medio: 440.20, maximo: 880.41 },
                estacionamento: { minimo: 88.38, medio: 132.57, maximo: 176.76 },
                embriaguez: { minimo: 2934.70, medio: 4402.05, maximo: 8804.10 },
                celular: { minimo: 293.47, medio: 440.20, maximo: 586.94 }
            }
        }
    };

    const tiposMulta = {
        excesso_velocidade: { label: 'Excesso de Velocidade', cor: '#ef4444', pontos: 5 },
        avanco_sinal: { label: 'Avanço de Sinal', cor: '#f59e0b', pontos: 7 },
        estacionamento: { label: 'Estacionamento Irregular', cor: '#3b82f6', pontos: 3 },
        embriaguez: { label: 'Embriaguez ao Volante', cor: '#dc2626', pontos: 7 },
        celular: { label: 'Uso de Celular', cor: '#8b5cf6', pontos: 7 }
    };

    const [multas, setMultas] = useState([]);

    useEffect(() => {
        // Aguarda o carregamento do estado de autenticação
        let mounted = true;
        const fetch = async () => {
            // Se ainda está carregando auth, aguarda sem fazer nada
            if (authLoading) return;
            // Se usuário não autenticado, não tentamos buscar dados protegidos
            if (!user) {
                if (mounted) {
                    setMultas([]);
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(true);
            try {
                const data = await listarMultas({ page: 1, limit: 200 });
                const list = (data && data.multas) || data || [];
                const normalized = list.map(m => ({
                    id: m.id || m._id || m.codigo || '',
                    _id: m._id || m.id || null,
                    placa: m.placa || m.placa || '',
                    estado: m.estado || (m.local ? (m.local.split(' - ')[1] || '') : ''),
                    cidade: m.cidade || (m.local ? (m.local.split(' - ')[0] || '') : ''),
                    tipo: m.tipo || m.tipo || '',
                    descricao: m.descricao || m.descricao || '',
                    valor: Number(m.valor || 0),
                    pontos: m.pontos || 0,
                    data: m.data ? (new Date(m.data).toISOString().split('T')[0]) : (m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : ''),
                    status: m.status || 'pendente',
                    local: m.local || `${m.cidade || ''} - ${m.estado || ''}`,
                    veiculo: m.veiculo || '',
                    linkDocumento: m.linkDocumento || ''
                }));

                if (mounted) setMultas(normalized);
            } catch (err) {
                console.error('Erro ao buscar multas:', err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetch();
        return () => { mounted = false; };
    }, [user, authLoading]);

    const statusConfig = {
        pendente: {
            label: 'Pendente',
            color: 'orange',
            icon: <MdPendingActions />,
            bgColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'var(--warning)'
        },
        paga: {
            label: 'Paga',
            color: 'green',
            icon: <MdCheckCircleOutline />,
            bgColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'var(--success)'
        },
        vencida: {
            label: 'Vencida',
            color: 'red',
            icon: <MdWarning />,
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'var(--error)'
        },
        contestada: {
            label: 'Contestada',
            color: 'blue',
            icon: <FiFileText />,
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'var(--primary)'
        }
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const filteredAndSortedMultas = useMemo(() => {
        let filtered = multas.filter(multa =>
            (multa.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (multa.placa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (multa.descricao || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (multa.local || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        const now = new Date();
        let startDate = new Date();

        switch (timeFilter) {
            case 'hoje':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'semana':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'mes':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'ano':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                break;
        }

        if (timeFilter !== 'todos') {
            filtered = filtered.filter(multa => new Date(multa.data) >= startDate);
        }

        if (filters.status.length > 0 && activeTab === 'todas') {
            filtered = filtered.filter(multa => filters.status.includes(multa.status));
        } else if (activeTab !== 'todas') {
            filtered = filtered.filter(multa => multa.status === activeTab);
        }

        if (filters.estado.length > 0) {
            filtered = filtered.filter(multa => filters.estado.includes(multa.estado));
        }

        if (filters.tipo.length > 0) {
            filtered = filtered.filter(multa => filters.tipo.includes(multa.tipo));
        }

        filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [multas, searchTerm, filters, sortConfig, activeTab, timeFilter]);

    const stats = useMemo(() => {
        const multasFiltradas = filteredAndSortedMultas;
        const total = multasFiltradas.length;
        const pendentes = multasFiltradas.filter(m => m.status === 'pendente').length;
        const valorTotal = multasFiltradas.reduce((sum, m) => sum + m.valor, 0);
        const valorPendente = multasFiltradas
            .filter(m => m.status === 'pendente')
            .reduce((sum, m) => sum + m.valor, 0);

        return [
            {
                value: total.toString(),
                label: 'Total de Multas',
                icon: <FiAlertTriangle />,
                color: 'blue',
                change: '+5%',
                desc: `Período: ${timeFilter}`
            },
            {
                value: pendentes.toString(),
                label: 'Multas Pendentes',
                icon: <FiClock />,
                color: 'orange',
                change: '-2%',
                desc: 'Aguardando pagamento'
            },
            {
                value: valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                label: 'Valor Total',
                icon: <FiDollarSign />,
                color: 'purple',
                change: '+12%',
                desc: 'Acumulado'
            },
            {
                value: valorPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                label: 'A Pagar',
                icon: <MdPayments />,
                color: 'red',
                change: '-8%',
                desc: 'Valor pendente'
            }
        ];
    }, [filteredAndSortedMultas, timeFilter]);

    const tabs = [
        { key: 'pendentes', label: 'Pendentes', icon: <FiClock />, count: multas.filter(m => m.status === 'pendente').length },
        { key: 'paga', label: 'Pagas', icon: <FiCheckCircle />, count: multas.filter(m => m.status === 'paga').length },
        { key: 'vencida', label: 'Vencidas', icon: <MdWarning />, count: multas.filter(m => m.status === 'vencida').length },
        { key: 'todas', label: 'Todas', icon: <FiFilter />, count: multas.length }
    ];

    const quickActions = [
        {
            icon: <FiPlus />,
            title: 'Adicionar Multa',
            description: 'Registrar multa manualmente',
            color: 'var(--primary)',
            action: () => console.log('Adicionar multa')
        },
        {
            icon: <FiCreditCard />,
            title: 'Pagar Multas',
            description: 'Realizar pagamento em lote',
            color: 'var(--success)',
            action: () => console.log('Pagar multas')
        },
        {
            icon: <FiBarChart2 />,
            title: 'Relatórios',
            description: 'Gerar relatórios detalhados',
            color: 'var(--warning)',
            action: () => console.log('Relatórios')
        },
        {
            icon: <FiMapPin />,
            title: 'Por Localidade',
            description: 'Multas por estado/cidade',
            color: 'var(--info)',
            action: () => console.log('Por localidade')
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: index * 0.05,
                duration: 0.4
            }
        }),
        hover: {
            backgroundColor: 'var(--gray-50)',
            scale: 1.01,
            transition: { duration: 0.2 }
        }
    };

    const calcularMulta = (estado, cidade, tipo, gravidade = 'medio') => {
        const valor = valoresMultasPorEstado[estado]?.[cidade]?.[tipo]?.[gravidade] || 0;
        return valor;
    };

    if (isLoading) {
        return (
            <div className="multas-loading-container">
                <div className="multas-loading-content">
                    <motion.div
                        className="multas-loading-spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <FiAlertTriangle className="multas-spinner-icon" />
                    </motion.div>
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Carregando Sistema de Multas
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Calculando valores por estado e cidade...
                    </motion.p>
                </div>
            </div>
        );
    }

    // Se já carregou o estado de autenticação e não há usuário, pedir login
    if (!authLoading && !user) {
        return (
            <div className="multas-unauthenticated">
                <h2>É necessário efetuar login</h2>
                <p>Para ver suas multas, faça login na sua conta.</p>
                <button className="multas-btn-primary" onClick={() => { window.location.href = '/login'; }}>
                    Ir para Login
                </button>
            </div>
        );
    }

    return (
        <motion.div
            className="multas-container"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ marginTop: '0' }}
        >
            {/* Header Section */}
            <motion.div className="multas-header" variants={itemVariants}>
                <div className="multas-header-content">
                    <div className="multas-header-text">
                        <span className="multas-welcome-badge">
                            <FiAlertTriangle />
                            Sistema de Multas
                        </span>
                        <h1>Gerenciamento de Multas</h1>
                        <p className="multas-header-subtitle">
                            Controle completo de multas com cálculo real por estado e cidade
                        </p>
                    </div>
                    <div className="multas-header-actions">
                        <motion.button
                            className="multas-btn-primary multas-btn-large"
                            onClick={() => console.log('Nova multa')}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPlus className="multas-btn-icon" />
                            Adicionar Multa
                        </motion.button>
                        <motion.button
                            className="multas-btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    const data = await listarMultas({ page: 1, limit: 200 });
                                    const list = (data && data.multas) || data || [];
                                    const normalized = list.map(m => ({
                                        id: m.id || m._id || m.codigo || '',
                                        _id: m._id || m.id || null,
                                        placa: m.placa || '',
                                        estado: m.estado || (m.local ? (m.local.split(' - ')[1] || '') : ''),
                                        cidade: m.cidade || (m.local ? (m.local.split(' - ')[0] || '') : ''),
                                        tipo: m.tipo || '',
                                        descricao: m.descricao || '',
                                        valor: Number(m.valor || 0),
                                        pontos: m.pontos || 0,
                                        data: m.data ? (new Date(m.data).toISOString().split('T')[0]) : (m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : ''),
                                        status: m.status || 'pendente',
                                        local: m.local || `${m.cidade || ''} - ${m.estado || ''}`,
                                        veiculo: m.veiculo || '',
                                        linkDocumento: m.linkDocumento || ''
                                    }));
                                    setMultas(normalized);
                                } catch (err) {
                                    console.error('Erro ao atualizar multas:', err);
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                        >
                            <FiRefreshCw className="multas-btn-icon" />
                            Atualizar
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div className="multas-stats-grid" variants={containerVariants}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`multas-stat-card multas-stat-${stat.color}`}
                        variants={itemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="multas-stat-background-pattern"></div>
                        <div className="multas-stat-glow"></div>
                        <div className="multas-stat-content">
                            <div className="multas-stat-main">
                                <div className="multas-stat-icon-wrapper">
                                    {stat.icon}
                                </div>
                                <div className="multas-stat-values">
                                    <h3>{stat.value}</h3>
                                    <div className="multas-stat-label">{stat.label}</div>
                                    <div className="multas-stat-desc">{stat.desc}</div>
                                    <div className={`multas-stat-trend ${stat.change.includes('+') ? 'up' : 'down'}`}>
                                        <span className="multas-trend-icon">
                                            {stat.change.includes('+') ? '↗' : '↘'}
                                        </span>
                                        {stat.change}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="multas-stat-chart">
                            {[20, 45, 30, 60, 40, 70, 50].map((height, i) => (
                                <motion.div
                                    key={i}
                                    className="multas-chart-bar"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: index * 0.1 + i * 0.05, duration: 0.5 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filtro de Tempo */}
            <motion.div className="multas-time-filter" variants={itemVariants}>
                <div className="multas-time-filter-content">
                    <label>Período:</label>
                    <div className="multas-time-buttons">
                        {['hoje', 'semana', 'mes', 'ano', 'todos'].map(period => (
                            <motion.button
                                key={period}
                                className={`multas-time-btn ${timeFilter === period ? 'active' : ''}`}
                                onClick={() => setTimeFilter(period)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {period === 'hoje' && 'Hoje'}
                                {period === 'semana' && 'Esta Semana'}
                                {period === 'mes' && 'Este Mês'}
                                {period === 'ano' && 'Este Ano'}
                                {period === 'todos' && 'Todos'}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div className="multas-quick-actions" variants={itemVariants}>
                <div className="multas-quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            className="multas-quick-action-card"
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.action}
                            style={{ '--action-color': action.color }}
                        >
                            <div className="multas-action-card-glow"></div>
                            <div className="multas-action-card-background"></div>
                            <div className="multas-action-card-header">
                                <div className="multas-action-icon-container">
                                    <div className="multas-action-icon">
                                        {action.icon}
                                    </div>
                                </div>
                                <div className="multas-action-arrow">
                                    <FiArrowRight />
                                </div>
                            </div>
                            <div className="multas-action-card-content">
                                <h3>{action.title}</h3>
                                <p>{action.description}</p>
                            </div>
                            <div className="multas-action-hover-effect"></div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Controls Section */}
            <motion.div className="multas-controls-section" variants={itemVariants}>
                <div className="multas-tabs">
                    {tabs.map(tab => (
                        <motion.button
                            key={tab.key}
                            className={`multas-tab ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="multas-tab-icon">{tab.icon}</span>
                            {tab.label}
                            <span className="multas-tab-count">{tab.count}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="multas-search-controls">
                    <motion.div
                        className="multas-search-box"
                        whileFocus={{ scale: 1.02 }}
                    >
                        <FiSearch className="multas-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, placa, local ou tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="multas-search-input"
                        />
                        {searchTerm && (
                            <motion.button
                                className="multas-search-clear"
                                onClick={() => setSearchTerm('')}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                ×
                            </motion.button>
                        )}
                    </motion.div>

                    <div className="multas-controls-buttons">
                        <motion.button
                            className={`multas-btn-outline ${filterOpen ? 'active' : ''}`}
                            onClick={() => setFilterOpen(!filterOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiFilter className="multas-btn-icon" />
                            Filtros
                            {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </motion.button>
                        <motion.button
                            className="multas-btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiDownload className="multas-btn-icon" />
                            Exportar
                        </motion.button>
                    </div>
                </div>

                {/* Filtros Expandíveis */}
                <AnimatePresence>
                    {filterOpen && (
                        <motion.div
                            className="multas-filters-expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="multas-filters-content">
                                <div className="multas-filter-group">
                                    <label>Status</label>
                                    <div className="multas-filter-chips">
                                        {Object.entries(statusConfig).map(([key, config]) => (
                                            <motion.button
                                                key={key}
                                                className={`multas-filter-chip ${filters.status.includes(key) ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        status: prev.status.includes(key)
                                                            ? prev.status.filter(s => s !== key)
                                                            : [...prev.status, key]
                                                    }))
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    backgroundColor: filters.status.includes(key) ? config.bgColor : 'var(--gray-100)',
                                                    borderColor: filters.status.includes(key) ? config.borderColor : 'var(--gray-300)'
                                                }}
                                            >
                                                {config.icon}
                                                {config.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="multas-filter-group">
                                    <label>Estado</label>
                                    <div className="multas-filter-chips">
                                        {Object.keys(valoresMultasPorEstado).map(estado => (
                                            <motion.button
                                                key={estado}
                                                className={`multas-filter-chip ${filters.estado.includes(estado) ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        estado: prev.estado.includes(estado)
                                                            ? prev.estado.filter(e => e !== estado)
                                                            : [...prev.estado, estado]
                                                    }))
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiMapPin />
                                                {estado}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="multas-filter-group">
                                    <label>Tipo de Infração</label>
                                    <div className="multas-filter-chips">
                                        {Object.entries(tiposMulta).map(([key, tipo]) => (
                                            <motion.button
                                                key={key}
                                                className={`multas-filter-chip ${filters.tipo.includes(key) ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        tipo: prev.tipo.includes(key)
                                                            ? prev.tipo.filter(t => t !== key)
                                                            : [...prev.tipo, key]
                                                    }))
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    borderColor: filters.tipo.includes(key) ? tipo.cor : 'var(--gray-300)'
                                                }}
                                            >
                                                <div
                                                    className="multas-tipo-color"
                                                    style={{ backgroundColor: tipo.cor }}
                                                />
                                                {tipo.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Table Section */}
            <motion.div className="multas-table-container" variants={itemVariants}>
                <AnimatePresence>
                    {filteredAndSortedMultas.length > 0 ? (
                        <motion.div
                            className="multas-table-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <table className="multas-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('id')}>
                                            <div className="multas-th-content">
                                                ID Multa
                                                <motion.span
                                                    className="multas-sort-indicator"
                                                    animate={{ rotate: sortConfig.key === 'id' && sortConfig.direction === 'desc' ? 180 : 0 }}
                                                >
                                                    <MdExpandMore />
                                                </motion.span>
                                            </div>
                                        </th>
                                        <th onClick={() => handleSort('placa')}>
                                            <div className="multas-th-content">
                                                Placa
                                                <motion.span
                                                    className="multas-sort-indicator"
                                                    animate={{ rotate: sortConfig.key === 'placa' && sortConfig.direction === 'desc' ? 180 : 0 }}
                                                >
                                                    <MdExpandMore />
                                                </motion.span>
                                            </div>
                                        </th>
                                        <th>Localidade</th>
                                        <th onClick={() => handleSort('tipo')}>
                                            <div className="multas-th-content">
                                                Tipo
                                                <motion.span
                                                    className="multas-sort-indicator"
                                                    animate={{ rotate: sortConfig.key === 'tipo' && sortConfig.direction === 'desc' ? 180 : 0 }}
                                                >
                                                    <MdExpandMore />
                                                </motion.span>
                                            </div>
                                        </th>
                                        <th onClick={() => handleSort('valor')}>
                                            <div className="multas-th-content">
                                                Valor
                                                <motion.span
                                                    className="multas-sort-indicator"
                                                    animate={{ rotate: sortConfig.key === 'valor' && sortConfig.direction === 'desc' ? 180 : 0 }}
                                                >
                                                    <MdExpandMore />
                                                </motion.span>
                                            </div>
                                        </th>
                                        <th>Pontos</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedMultas.map((multa, index) => (
                                        <motion.tr
                                            key={multa.id}
                                            custom={index}
                                            variants={tableRowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            className="multas-row"
                                        >
                                            <td>
                                                <div className="multas-id-cell">
                                                    <div className="multas-id-content">
                                                        <span className="multas-id-text">{multa.id}</span>
                                                        {multa.desconto && (
                                                            <motion.span
                                                                className="multas-desconto-badge"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: index * 0.1 + 0.3 }}
                                                            >
                                                                <FiTrendingUp />
                                                                Desconto Disponível
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <span className="multas-date">
                                                        <FiCalendar />
                                                        {multa.data}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="multas-placa-info">
                                                    <span className="multas-placa-text">{multa.placa}</span>
                                                    <span className="multas-veiculo">
                                                        {multa.veiculo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="multas-local-info">
                                                    <span className="multas-cidade">
                                                        <MdLocationOn />
                                                        {multa.cidade}
                                                    </span>
                                                    <span className="multas-estado">
                                                        {multa.estado}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="multas-tipo-info">
                                                    <div
                                                        className="multas-tipo-indicator"
                                                        style={{ backgroundColor: tiposMulta[multa.tipo]?.cor || '#ccc' }}
                                                    />
                                                    <span>{multa.descricao}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="multas-valor">
                                                    <FiDollarSign />
                                                    {multa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="multas-pontos">
                                                    {multa.pontos} pts
                                                </span>
                                            </td>
                                            <td>
                                                <motion.div
                                                    className={`multas-status-badge multas-status-${multa.status}`}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <div className="multas-status-content">
                                                        {statusConfig[multa.status]?.icon}
                                                        {statusConfig[multa.status]?.label}
                                                    </div>
                                                </motion.div>
                                            </td>
                                            <td>
                                                <div className="multas-action-buttons">
                                                    {multa.status === 'pendente' && (
                                                        <motion.button
                                                            className="multas-action-btn multas-action-pay"
                                                            title="Pagar Multa"
                                                            whileHover={{ scale: 1.1, backgroundColor: 'var(--success-10)' }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={async () => {
                                                                try {
                                                                    const resp = await criarPagamento([multa._id || multa.id], 'pix');
                                                                    alert(`Pagamento criado. Status: ${resp.status || 'pendente'}`);
                                                                    // Recarregar lista após criação do pagamento
                                                                    setIsLoading(true);
                                                                    const data = await listarMultas({ page: 1, limit: 200 });
                                                                    const list = (data && data.multas) || data || [];
                                                                    const normalized = list.map(m => ({
                                                                        id: m.id || m._id || m.codigo || '',
                                                                        _id: m._id || m.id || null,
                                                                        placa: m.placa || '',
                                                                        estado: m.estado || (m.local ? (m.local.split(' - ')[1] || '') : ''),
                                                                        cidade: m.cidade || (m.local ? (m.local.split(' - ')[0] || '') : ''),
                                                                        tipo: m.tipo || '',
                                                                        descricao: m.descricao || '',
                                                                        valor: Number(m.valor || 0),
                                                                        pontos: m.pontos || 0,
                                                                        data: m.data ? (new Date(m.data).toISOString().split('T')[0]) : (m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : ''),
                                                                        status: m.status || 'pendente',
                                                                        local: m.local || `${m.cidade || ''} - ${m.estado || ''}`,
                                                                        veiculo: m.veiculo || '',
                                                                        linkDocumento: m.linkDocumento || ''
                                                                    }));
                                                                    setMultas(normalized);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert('Erro ao criar pagamento');
                                                                } finally {
                                                                    setIsLoading(false);
                                                                }
                                                            }}
                                                        >
                                                            <FiCreditCard />
                                                        </motion.button>
                                                    )}
                                                    <motion.button
                                                        className="multas-action-btn multas-action-view"
                                                        title="Visualizar"
                                                        whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-10)' }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiEye />
                                                    </motion.button>
                                                    <motion.button
                                                        className="multas-action-btn multas-action-edit"
                                                        title="Editar"
                                                        whileHover={{ scale: 1.1, backgroundColor: 'var(--warning-10)' }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        className="multas-action-btn multas-action-more"
                                                        title="Mais opções"
                                                        whileHover={{ scale: 1.1, backgroundColor: 'var(--gray-100)' }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiMoreVertical />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="multas-empty-state"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="multas-empty-icon">
                                <FiAlertTriangle />
                            </div>
                            <h3>Nenhuma multa encontrada</h3>
                            <p>Tente ajustar os filtros ou buscar por outros termos</p>
                            <motion.button
                                className="multas-btn-primary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({ status: [], estado: [], valor: { min: 0, max: 5000 }, tipo: [] });
                                    setTimeFilter('mes');
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiRefreshCw className="multas-btn-icon" />
                                Limpar Filtros
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Footer Summary */}
            <motion.div className="multas-footer-summary" variants={itemVariants}>
                <div className="multas-summary-content">
                    <div className="multas-summary-item">
                        <span className="multas-summary-label">Total de Multas:</span>
                        <span className="multas-summary-value">{filteredAndSortedMultas.length}</span>
                    </div>
                    <div className="multas-summary-item">
                        <span className="multas-summary-label">Valor Total:</span>
                        <span className="multas-summary-value">
                            {filteredAndSortedMultas.reduce((sum, multa) => sum + multa.valor, 0)
                                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                    <div className="multas-summary-item">
                        <span className="multas-summary-label">Última Atualização:</span>
                        <span className="multas-summary-value">Agora mesmo</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MultasPage;
