const realtime = require('./realtimeDb');
const multaService = require('./multaService');

const CONSULTAS_PATH = '/consultas';

function consultaPath(id) { return `${CONSULTAS_PATH}/${id}`; }

async function createConsulta(userUid, data) {
    const now = new Date().toISOString();
    const record = {
        userId: userUid,
        placa: data.placa,
        veiculo: data.veiculo || null,
        estado: data.estado || null,
        statusConsulta: data.statusConsulta || 'pendente',
        detalhes: data.detalhes || null,
        multas: [],
        valorTotal: data.valorTotal || 0,
        dataHora: now,
        custoConsulta: data.custoConsulta || 0,
        createdAt: now,
        updatedAt: now
    };
    const key = await realtime.push(CONSULTAS_PATH, record);
    return { id: key, ...record };
}

async function getById(id) {
    const data = await realtime.get(consultaPath(id));
    if (!data) return null;
    return { id, ...data };
}

async function updateConsulta(id, updates) {
    updates.updatedAt = new Date().toISOString();
    await realtime.update(consultaPath(id), updates);
    const updated = await realtime.get(consultaPath(id));
    return { id, ...updated };
}

async function saveMultasForConsulta(consultaId, multasArray) {
    // cria cada multa vinculando a consultaId
    const createdIds = [];
    for (const m of multasArray) {
        const mRec = {
            consultaId,
            placa: m.placa,
            codigo: m.codigo || m.auto || '',
            descricao: m.descricao || m.infracao || '',
            valor: m.valor || 0,
            data: m.data ? new Date(m.data).toISOString() : new Date().toISOString(),
            local: m.local || m.localidade || '',
            orgao: m.orgao || m.orgaoEmissor || ''
        };
        const created = await multaService.create(mRec);
        createdIds.push(created.id);
    }
    // atualizar consulta com array de multas
    await realtime.update(consultaPath(consultaId), { multas: createdIds, updatedAt: new Date().toISOString() });
    return createdIds;
}

async function listByUser(userUid, { placa, estado, page = 1, limit = 10 } = {}) {
    const all = await realtime.get(CONSULTAS_PATH) || {};
    const arr = Object.keys(all)
        .map(k => ({ id: k, ...all[k] }))
        .filter(c => c.userId === userUid);

    let filtered = arr;
    if (placa) filtered = filtered.filter(c => c.placa === placa);
    if (estado) filtered = filtered.filter(c => c.estado === estado);

    const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = sorted.length;
    const start = (page - 1) * limit;
    const pageItems = sorted.slice(start, start + limit);

    // popular multas
    for (const c of pageItems) {
        if (Array.isArray(c.multas) && c.multas.length) {
            c.multas = await Promise.all(c.multas.map(id => multaService.getById(id)));
        } else c.multas = [];
    }

    return { consultas: pageItems, total };
}

module.exports = { createConsulta, getById, saveMultasForConsulta, listByUser };
