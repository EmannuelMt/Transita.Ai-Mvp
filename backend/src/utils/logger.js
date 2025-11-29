const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;

// Formatos personalizados
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;

    if (Object.keys(metadata).length > 0) {
        msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return msg;
});

// Configuração do logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        service: 'transita-ai-api',
        environment: process.env.NODE_ENV
    },
    transports: [
        // Logs de desenvolvimento (console colorido)
        new transports.Console({
            level: 'debug',
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            ),
            silent: process.env.NODE_ENV === 'production'
        }),

        // Logs de produção (JSON)
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(
                timestamp(),
                json()
            ),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),

        // Todos os logs
        new transports.File({
            filename: 'logs/combined.log',
            format: combine(
                timestamp(),
                json()
            ),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ],
    // Tratamento de exceções não capturadas
    exceptionHandlers: [
        new transports.File({
            filename: 'logs/exceptions.log',
            format: combine(
                timestamp(),
                json()
            )
        })
    ],
    // Tratamento de rejeições não tratadas
    rejectionHandlers: [
        new transports.File({
            filename: 'logs/rejections.log',
            format: combine(
                timestamp(),
                json()
            )
        })
    ]
});

// Adiciona log de métricas
const metrics = {
    requests: 0,
    errors: 0,
    activeUsers: new Set(),
    responseTime: {
        sum: 0,
        count: 0,
        avg: 0
    }
};

// Middleware para logging de requisições
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log da requisição
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userId: req.user?.uid
    });

    // Atualiza métricas
    metrics.requests++;
    if (req.user?.uid) {
        metrics.activeUsers.add(req.user.uid);
    }

    // Log da resposta
    res.on('finish', () => {
        const duration = Date.now() - start;

        // Atualiza métricas de tempo de resposta
        metrics.responseTime.sum += duration;
        metrics.responseTime.count++;
        metrics.responseTime.avg = metrics.responseTime.sum / metrics.responseTime.count;

        if (res.statusCode >= 400) {
            metrics.errors++;
        }

        logger.info('Request completed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            userId: req.user?.uid
        });
    });

    next();
};

// Função para registrar métricas periodicamente
const logMetrics = () => {
    logger.info('System metrics', {
        totalRequests: metrics.requests,
        totalErrors: metrics.errors,
        activeUsers: metrics.activeUsers.size,
        avgResponseTime: Math.round(metrics.responseTime.avg),
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
};

// Registra métricas a cada 5 minutos
setInterval(logMetrics, 5 * 60 * 1000);

// Exporta funções e middleware
module.exports = {
    logger,
    requestLogger,
    metrics,

    // Funções auxiliares para logging estruturado
    logUserAction: (userId, action, details) => {
        logger.info('User action', {
            userId,
            action,
            ...details
        });
    },

    logError: (error, context = {}) => {
        logger.error('Error occurred', {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            ...context
        });
    },

    logApiCall: (service, method, duration, success, details = {}) => {
        logger.info('External API call', {
            service,
            method,
            duration,
            success,
            ...details
        });
    },

    logSecurityEvent: (event, severity, details = {}) => {
        logger.warn('Security event', {
            event,
            severity,
            ...details
        });
    },

    logPerformanceMetric: (metric, value, tags = {}) => {
        logger.info('Performance metric', {
            metric,
            value,
            ...tags
        });
    }
};