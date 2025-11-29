module.exports = {
    // Diretório raiz para busca de testes
    roots: ['<rootDir>/src'],

    // Padrões de arquivos de teste
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],

    // Configuração de ambiente
    testEnvironment: 'node',

    // Cobertura de código
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/config/**',
        '!**/node_modules/**'
    ],

    // Configuração de timeout para testes
    testTimeout: 10000,

    // Módulos a serem transformados pelo Jest
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },

    // Configurações de módulos
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },

    // Setup global para testes
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Ignora certos padrões
    modulePathIgnorePatterns: ['<rootDir>/dist/'],

    // Variáveis de ambiente para testes
    globals: {
        'process.env': {
            NODE_ENV: 'test',
            ENCRYPTION_KEY: 'test-key-32-chars-exactly-here-now',
            JWT_SECRET: 'test-jwt-secret',
            SMTP_HOST: 'smtp.ethereal.email',
            SMTP_PORT: '587',
            SMTP_USER: 'test@ethereal.email',
            SMTP_PASS: 'testpass'
        }
    }
};