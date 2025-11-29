require('dotenv').config();
const connectDB = require('./config/database');

async function run() {
    await connectDB();

    const realtime = require('./services/realtimeDb');
    const firebaseUid = process.env.SEED_FIREBASE_UID || 'seed-test-uid';

    // Seed para Realtime DB
    const now = new Date().toISOString();
    const userRecord = {
        firebaseUid,
        nomeCompleto: 'Usuário Seed',
        email: 'seed@example.com',
        planoAtual: 'profissional',
        statusAssinatura: 'ativo',
        limiteConsultasMes: 150,
        dataCadastro: now,
        createdAt: now,
        updatedAt: now
    };
    await realtime.set(`/users/${firebaseUid}`, userRecord);

    // subscription
    const subRecord = {
        userId: firebaseUid,
        planoAtual: 'profissional',
        status: 'ativo',
        dataInicio: now,
        dataRenovacao: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        renovacaoAutomatica: true,
        metodoPagamento: 'pix',
        valorMensal: 99,
        createdAt: now,
        updatedAt: now
    };
    await realtime.set(`/subscriptions/${firebaseUid}`, subRecord);

    // consulta + multas
    const consulta = {
        userId: firebaseUid,
        placa: 'ABC1234',
        veiculo: { marca: 'Fiat', modelo: 'Uno', ano: '2016', cor: 'Prata' },
        estado: 'SP',
        statusConsulta: 'sucesso',
        valorTotal: 350,
        multas: [],
        createdAt: now,
        updatedAt: now
    };
    const consultaId = await realtime.push('/consultas', consulta);

    const multa1 = {
        consultaId,
        placa: 'ABC1234',
        descricao: 'Estacionamento irregular',
        valor: 150,
        data: new Date().toISOString(),
        local: 'Rua Teste, 100',
        estado: 'SP',
        cidade: 'São Paulo',
        createdAt: now,
        updatedAt: now
    };
    const multa2 = {
        consultaId,
        placa: 'ABC1234',
        descricao: 'Avanço de sinal',
        valor: 200,
        data: new Date().toISOString(),
        local: 'Avenida Exemplo, 200',
        estado: 'SP',
        cidade: 'São Paulo',
        createdAt: now,
        updatedAt: now
    };

    const multa1Id = await realtime.push('/multas', multa1);
    const multa2Id = await realtime.push('/multas', multa2);

    await realtime.update(`/consultas/${consultaId}`, { multas: [multa1Id, multa2Id], updatedAt: new Date().toISOString() });

    console.log('Seed RTDB concluído.');
    process.exit(0);
}

run().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
