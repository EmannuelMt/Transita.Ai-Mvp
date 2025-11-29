const realtime = require('./realtimeDb');

const PATH = '/subscriptions';

function path(userId) { return `${PATH}/${userId}`; }

async function getByUserId(userId) {
    const data = await realtime.get(path(userId));
    if (!data) return null;
    return { id: userId, ...data };
}

async function createOrUpdate(userId, payload) {
    const now = new Date().toISOString();
    payload.updatedAt = now;
    payload.userId = userId;
    // set will overwrite; acceptable for one-doc-per-user
    await realtime.set(path(userId), payload);
    return { id: userId, ...payload };
}

async function cancel(userId) {
    await realtime.update(path(userId), { status: 'cancelado', renovacaoAutomatica: false, updatedAt: new Date().toISOString() });
    return getByUserId(userId);
}

async function listAll() {
    const all = await realtime.get(PATH) || {};
    return Object.keys(all).map(k => ({ id: k, ...all[k] }));
}

async function deleteByUserId(userId) {
    const p = path(userId);
    const before = await realtime.get(p);
    await realtime.set(p, null);
    return before || null;
}

module.exports = { getByUserId, createOrUpdate, cancel, listAll, deleteByUserId };
