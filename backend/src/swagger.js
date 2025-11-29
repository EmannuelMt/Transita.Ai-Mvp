const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Transita.AI API',
        version: '1.0.0',
        description: 'Documentação mínima das rotas principais (consultas, multas, pagamentos)'
    },
    servers: [{ url: '/api' }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        '/consultas': {
            post: {
                summary: 'Criar consulta (realiza consulta de placa)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { placa: { type: 'string' }, estado: { type: 'string' } } }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Consulta criada e resultado retornado' },
                    '403': { description: 'Limite de consultas atingido' }
                }
            },
            get: {
                summary: 'Listar consultas do usuário',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } }
                ],
                responses: { '200': { description: 'Lista de consultas' } }
            }
        },
        '/multas': {
            get: {
                summary: 'Listar multas do usuário',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } }
                ],
                responses: { '200': { description: 'Lista de multas' } }
            }
        },
        '/health': {
            get: {
                summary: 'Healthcheck da API',
                responses: { '200': { description: 'Status OK' } }
            }
        }
    }
};

module.exports = (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
