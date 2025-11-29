const realtime = require('./realtimeDb');

const PATH = '/paymentHistory';

function path(id) { return `${PATH}/${id}`; }

async function create(payload) {
    const key = await realtime.push(PATH, payload);
    return { id: key, ...payload };
}

async function findAll() {
    const all = await realtime.get(PATH) || {};
    return Object.keys(all).map(k => ({ id: k, ...all[k] }));
}

async function findByTransactionId(transactionId) {
    const all = await findAll();
    return all.find(d => d.idTransacao === transactionId || d.transactionId === transactionId) || null;
}

async function updateById(id, updates) {
    await realtime.update(path(id), updates);
    return getById(id);
}

async function getById(id) {
    const data = await realtime.get(path(id));
    if (!data) return null;
    return { id, ...data };
}

async function findByTransactionId(transactionId) {
    const all = await realtime.get(PATH) || {};
    const foundKey = Object.keys(all).find(k => all[k].idTransacao === transactionId || all[k].transactionId === transactionId);
    if (!foundKey) return null;
    return { id: foundKey, ...all[foundKey] };
}

async function updateById(id, updates) {
    await realtime.update(path(id), updates);
    const updated = await realtime.get(path(id));
    return { id, ...updated };
}

module.exports = { create, getById, findByTransactionId, updateById, findAll };
