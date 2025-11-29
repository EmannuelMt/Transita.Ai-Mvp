const realtime = require('./realtimeDb');

const MULTAS_PATH = '/multas';

function multaPath(id) { return `${MULTAS_PATH}/${id}`; }

async function create(multa) {
    // cria um novo nó com push() e define os dados
    const key = await realtime.push(MULTAS_PATH, multa);
    return { id: key, ...multa };
}

async function getById(id) {
    const data = await realtime.get(multaPath(id));
    if (!data) return null;
    return { id, ...data };
}

async function update(id, updates) {
    await realtime.update(multaPath(id), updates);
    const updated = await realtime.get(multaPath(id));
    return { id, ...updated };
}

async function listByConsultaId(consultaId) {
    // ler todas multas e filtrar por consultaId
    const all = await realtime.get(MULTAS_PATH) || {};
    return Object.keys(all)
        .filter(k => all[k].consultaId === consultaId)
        .map(k => ({ id: k, ...all[k] }));
}

async function listAll() {
    const all = await realtime.get(MULTAS_PATH) || {};
    return Object.keys(all).map(k => ({ id: k, ...all[k] }));
}

async function deleteById(id) {
    const path = multaPath(id);
    const before = await realtime.get(path);
    await realtime.set(path, null);
    return before || null;
}

module.exports = { create, getById, update, listByConsultaId, listAll, deleteById };
