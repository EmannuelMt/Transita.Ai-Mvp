const request = require('supertest');
const app = require('../src/app');
const { disconnectDB } = require('../src/config/database');

describe('Health route', () => {
    test('GET /api/health should return ok true', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
        expect(res.body).toHaveProperty('mongo');
    }, 10000);

    // garantir que a conexão com o Mongo seja fechada para evitar handles abertos
    afterAll(async () => {
        try {
            await disconnectDB();
        } catch (e) {
            // ignorar erros de desconexão no teardown do teste
        }
    });
});
