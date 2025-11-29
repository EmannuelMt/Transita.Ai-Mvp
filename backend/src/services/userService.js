const realtime = require('./realtimeDb');

const USERS_PATH = '/users';

function userPathByUid(uid) {
    return `${USERS_PATH}/${uid}`;
}

async function getByFirebaseUid(uid) {
    if (!uid) return null;
    const data = await realtime.get(userPathByUid(uid));
    return data || null;
}

async function createFromDecoded(decoded) {
    const uid = decoded.uid;
    const now = new Date().toISOString();
    const isSuperAdmin = decoded.email === 'transitaaipro@gmail.com';
    const record = {
        firebaseUid: uid,
        nomeCompleto: decoded.name || decoded.email || null,
        email: decoded.email || null,
        empresa: null,
        cargo: null,
        telefone: null,
        pais: 'BR',
        fusoHorario: null,
        fotoPerfilUrl: null,
        idiomaPreferido: 'pt-BR',
        notificacoes: { email: true, push: true, sms: false },
        planoAtual: 'basico',
        statusAssinatura: 'ativo',
        dataInicioPlano: null,
        dataRenovacao: null,
        numeroConsultasMes: 0,
        limiteConsultasMes: 30,
        chaveAPI: null,
        isAdmin: isSuperAdmin,
        dataCadastro: now,
        updatedAt: now,
        createdAt: now
    };
    // Força isAdmin para superadministrador
    if (decoded.email === 'transitaaipro@gmail.com') {
        record.isAdmin = true;
        console.log('isAdmin forçado para true durante a criação do superadministrador.');
    }
    console.log('Criando usuário com os seguintes dados:', record);
    await realtime.set(userPathByUid(uid), record);
    return record;
}

async function getById(id) {
    // aqui tratamos id como firebaseUid
    return getByFirebaseUid(id);
}

async function updateById(id, updates) {
    const path = userPathByUid(id);
    updates.updatedAt = new Date().toISOString();

    // Log para verificar se a lógica de superadmin está sendo executada
    console.log(`Atualizando usuário: ${id}, updates:`, updates);

    // Força isAdmin=true para o superadmin
    if (updates.email === 'transitaaipro@gmail.com' || id === '8lQLdfcfxONHR1e2rvciqcpFrH42') {
        updates.isAdmin = true;
        console.log(`isAdmin forçado para true para o usuário: ${id}`);
    }

    await realtime.update(path, updates);
    const updated = await realtime.get(path);
    return updated;
}

async function findAndUpdateByFirebaseUid(uid, updates) {
    return updateById(uid, updates);
}

async function listAll() {
    const all = await realtime.get(USERS_PATH) || {};
    return Object.keys(all).map(k => ({ id: k, ...all[k] }));
}

async function deleteById(id) {
    const path = userPathByUid(id);
    const before = await realtime.get(path);
    await realtime.set(path, null);
    return before || null;
}

module.exports = {
    getByFirebaseUid,
    createFromDecoded,
    getById,
    updateById,
    findAndUpdateByFirebaseUid,
    listAll,
    deleteById
};
