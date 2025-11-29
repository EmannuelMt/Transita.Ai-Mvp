const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const multaRoutes = require('./routes/multaRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentHistoryRoutes = require('./routes/paymentHistoryRoutes');
const activityRoutes = require('./routes/activityRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const estatisticasRoutes = require('./routes/estatisticasRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');
const healthRoutes = require('./routes/healthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const setupRoutes = require('./routes/setupRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// servir uploads públicos (fallback local)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/multas', multaRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payment-history', paymentHistoryRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/estatisticas', estatisticasRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', setupRoutes); // Rotas especiais de configuração admin
app.use('/api/admin', adminRoutes);
app.use('/api/invites', inviteRoutes);

// Swagger docs (minimal)
try {
    const mountSwagger = require('./swagger');
    mountSwagger(app);
} catch (err) {
    console.warn('Swagger not mounted:', err.message);
}

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
