const compression = require('compression');
const { logger } = require('../utils/logger');

// Configuração de compressão
const compressionMiddleware = compression({
    // Nível de compressão (0-9)
    level: 6,

    // Threshold em bytes (não comprime respostas menores que 1KB)
    threshold: 1024,

    // Filtro para determinar quais respostas comprimir
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }

        // Comprime por padrão
        return compression.filter(req, res);
    }
});

// Middleware de otimização de performance
const performanceMiddleware = (req, res, next) => {
    // Adiciona headers de cache
    res.set({
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'Surrogate-Control': 'max-age=600',
        'Vary': 'Accept-Encoding'
    });

    // Timing-Allow-Origin para métricas de performance
    res.set('Timing-Allow-Origin', '*');

    // Headers de segurança
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    });

    // Remove headers desnecessários
    res.removeHeader('X-Powered-By');

    // Log de performance
    const start = process.hrtime();

    // Função para calcular duração em ms
    const getDurationInMs = () => {
        const diff = process.hrtime(start);
        return (diff[0] * 1e9 + diff[1]) / 1e6;
    };

    // Intercepta o método end para logging
    const originalEnd = res.end;
    res.end = function (...args) {
        const duration = getDurationInMs();
        const contentLength = res.get('Content-Length');

        logger.info('Response complete', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            contentLength,
            compressed: res.get('Content-Encoding') === 'gzip'
        });

        originalEnd.apply(res, args);
    };

    next();
};

// Rate limiting
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
});

const rateLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'rate-limit:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite por IP
    message: {
        error: 'Muitas requisições, tente novamente mais tarde.'
    },
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });

        res.status(429).json({
            error: 'Muitas requisições, tente novamente mais tarde.'
        });
    }
});

// Middleware de otimização de queries MongoDB
// MongoDB/Mongoose removed — this middleware is a no-op now
const mongooseQueryOptimizer = (req, res, next) => {
    return next();
};

// Middleware de otimização de JSON
const jsonOptimizer = (req, res, next) => {
    // Substitui o método json do response
    const originalJson = res.json;
    res.json = function (obj) {
        // Remove campos nulos ou undefined
        const cleanObj = JSON.parse(JSON.stringify(obj));

        // Converte datas para ISO string
        const convertDates = (obj) => {
            for (let key in obj) {
                if (obj[key] instanceof Date) {
                    obj[key] = obj[key].toISOString();
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    convertDates(obj[key]);
                }
            }
        };

        convertDates(cleanObj);

        return originalJson.call(this, cleanObj);
    };

    next();
};

module.exports = {
    compression: compressionMiddleware,
    performance: performanceMiddleware,
    rateLimit: rateLimiter,
    queryOptimizer: mongooseQueryOptimizer,
    jsonOptimizer
};