const { disconnectDB } = require('../src/config/database');

// Garantir que, ao final da suíte de testes, a conexão com o MongoDB seja fechada.
afterAll(async () => {
    try {
        await disconnectDB();
    } catch (e) {
        // ignorar falhas no teardown
    }
});
