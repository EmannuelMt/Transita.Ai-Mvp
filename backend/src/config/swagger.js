const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Transita.Ai API',
            version: '1.0.0',
            description: 'API para o sistema Transita.Ai',
            contact: {
                name: 'Suporte Transita.Ai',
                email: 'suporte@transita.ai'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            },
            {
                url: 'https://api.transita.ai',
                description: 'Servidor de Produção'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        description: 'Campo com erro'
                                    },
                                    message: {
                                        type: 'string',
                                        description: 'Descrição do erro'
                                    }
                                }
                            }
                        }
                    }
                },
                Subscription: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            description: 'ID do usuário'
                        },
                        plan: {
                            type: 'string',
                            enum: ['free', 'basic', 'pro', 'enterprise', 'custom'],
                            description: 'Tipo do plano'
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'pending', 'cancelled', 'trial', 'suspended'],
                            description: 'Status da assinatura'
                        },
                        features: {
                            type: 'object',
                            properties: {
                                maxRequests: {
                                    type: 'number',
                                    description: 'Limite de requisições'
                                },
                                customFeatures: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    },
                                    description: 'Recursos personalizados'
                                }
                            }
                        }
                    }
                },
                AdminInvite: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do convidado'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'accepted', 'expired', 'revoked'],
                            description: 'Status do convite'
                        },
                        invitedBy: {
                            type: 'string',
                            description: 'Email do administrador que fez o convite'
                        },
                        expiresAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de expiração do convite'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'], // Arquivos com anotações JSDoc
    security: [{
        bearerAuth: []
    }]
};

module.exports = swaggerJsdoc(options);