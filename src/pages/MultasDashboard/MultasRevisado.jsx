import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

import { listarMultas } from '../../services/multas';
import { criarPagamento } from '../../services/pagamentos';
import { obterEstatisticas, obterEstatisticasPorLocalidade } from '../../services/estatisticas';
import { consultarPlaca, adicionarMulta } from '../../services/multas';
import { gerarRelatorio } from '../../services/relatorios';
import DashboardCard from '../../components/Dashboard/DashboardCard';
import PeriodSelector from '../../components/PeriodSelector/PeriodSelector';
import Modal from '../../components/Modal/Modal';
import AddMultaForm from '../../components/AddMultaForm/AddMultaForm';
import { formatarMoeda, PERIODOS } from '../../utils/formatters';

import './Multas.css';

const Multas = ({ onNavigate }) => {
    // Estados
    const [activeTab, setActiveTab] = useState('pendentes');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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

    // Estados dos modais
    const [showAddMultaModal, setShowAddMultaModal] = useState(false);
    const [showConsultaPlacaModal, setShowConsultaPlacaModal] = useState(false);
    const [showLocalidadeModal, setShowLocalidadeModal] = useState(false);
    const [showRelatorioModal, setShowRelatorioModal] = useState(false);
    const [placaConsulta, setPlacaConsulta] = useState('');
    const [consultaResult, setConsultaResult] = useState(null);
    const [loadingConsulta, setLoadingConsulta] = useState(false);
    const [selectedMulta, setSelectedMulta] = useState(null);

    // Estados de filtros e ordenação
    const [sortConfig, setSortConfig] = useState({ key: 'data', direction: 'desc' });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: [],
        estado: [],
        valor: { min: 0, max: 5000 },
        tipo: []
    });

    // Efeitos
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

    // Handlers
    const handleAddMulta = async (multaData) => {
        try {
            setIsLoading(true);
            await adicionarMulta(multaData);
            setShowAddMultaModal(false);
            const novasEstatisticas = await obterEstatisticas(periodo);
            setEstatisticas(novasEstatisticas);
        } catch (error) {
            console.error('Erro ao adicionar multa:', error);
            alert('Erro ao adicionar multa. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConsultaPlaca = async () => {
        try {
            setLoadingConsulta(true);
            const result = await consultarPlaca(placaConsulta);
            setConsultaResult(result);
        } catch (error) {
            console.error('Erro ao consultar placa:', error);
            alert('Erro ao consultar placa. Verifique o formato e tente novamente.');
        } finally {
            setLoadingConsulta(false);
        }
    };

    const handleGerarRelatorio = async () => {
        try {
            setIsLoading(true);
            const relatorio = await gerarRelatorio({ periodo, filtros: filters });
            const url = window.URL.createObjectURL(new Blob([relatorio]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio-multas-${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Componentes internos
    const ConsultaPlacaModal = () => (
        <Modal
            isOpen={showConsultaPlacaModal}
            onClose={() => {
                setShowConsultaPlacaModal(false);
                setConsultaResult(null);
                setPlacaConsulta('');
            }}
            title="Consulta de Placa"
        >
            <div className="consulta-placa-form">
                <div className="input-group">
                    <input
                        type="text"
                        value={placaConsulta}
                        onChange={(e) => setPlacaConsulta(e.target.value.toUpperCase())}
                        placeholder="Digite a placa (AAA0000)"
                        maxLength={7}
                    />
                    <button
                        onClick={handleConsultaPlaca}
                        disabled={loadingConsulta || placaConsulta.length !== 7}
                    >
                        {loadingConsulta ? 'Consultando...' : 'Consultar'}
                    </button>
                </div>
                {consultaResult && (
                    <div className="consulta-result">
                        <h3>Resultado da Consulta</h3>
                        <div className="result-info">
                            <p><strong>Placa:</strong> {consultaResult.placa}</p>
                            <p><strong>Veículo:</strong> {consultaResult.modelo}</p>
                            <p><strong>Ano:</strong> {consultaResult.ano}</p>
                            <p><strong>Cor:</strong> {consultaResult.cor}</p>
                            <p><strong>Status:</strong> {consultaResult.status}</p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );

    const AddMultaModal = () => (
        <Modal
            isOpen={showAddMultaModal}
            onClose={() => setShowAddMultaModal(false)}
            title="Adicionar Nova Multa"
        >
            <AddMultaForm onSubmit={handleAddMulta} onCancel={() => setShowAddMultaModal(false)} />
        </Modal>
    );

    // Render principal
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
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Modais */}
            <ConsultaPlacaModal />
            <AddMultaModal />

            <motion.div
                className="multas-container"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.div className="multas-header" variants={itemVariants}>
                    <div className="multas-header-content">
                        <div className="multas-header-title">
                            <span className="multas-welcome-badge">
                                <FiAlertTriangle />
                                Sistema de Multas
                            </span>
                            <h1>Gerenciamento de Multas</h1>
                            <p>Controle completo de multas com cálculo real por estado e cidade</p>
                        </div>

                        <div className="multas-header-actions">
                            <motion.button
                                className="multas-btn-primary"
                                onClick={() => setShowAddMultaModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiPlus className="multas-btn-icon" />
                                Adicionar Multa
                            </motion.button>

                            <motion.button
                                className="multas-btn-secondary"
                                onClick={() => setShowConsultaPlacaModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiSearch className="multas-btn-icon" />
                                Consultar Placa
                            </motion.button>

                            <motion.button
                                className="multas-btn-secondary"
                                onClick={handleGerarRelatorio}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiFileText className="multas-btn-icon" />
                                Relatórios
                            </motion.button>

                            <motion.button
                                className="multas-btn-secondary"
                                onClick={() => setShowLocalidadeModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiMapPin className="multas-btn-icon" />
                                Por Localidade
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Section */}
                <motion.div className="multas-dashboard-section" variants={itemVariants}>
                    {dashboardLoading ? (
                        <div className="dashboard-grid">
                            {[...Array(4)].map((_, index) => (
                                <DashboardCard key={index} loading />
                            ))}
                        </div>
                    ) : (
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
                        </div>
                    )}
                </motion.div>

            </motion.div>
        </>
    );
};

export default Multas;