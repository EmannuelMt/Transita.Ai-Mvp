// Mock do Firebase Admin (sempre presente nos testes)
jest.mock('firebase-admin', () => ({
    auth: () => ({
        getUser: jest.fn(),
        setCustomUserClaims: jest.fn(),
        verifyIdToken: jest.fn()
    }),
    initializeApp: jest.fn(),
    apps: []
}));

// Configurações globais do Jest
jest.setTimeout(10000);

// Suprimir logs durante os testes
global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
};