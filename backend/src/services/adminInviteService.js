const realtime = require('./realtimeDb');

const PATH = '/adminInvites';

function path(token) { return `${PATH}/${token}`; }

async function createInvite(token, payload) {
    // Save invite document using token as id for easy lookup
    await realtime.set(path(token), payload);
    return { id: token, ...payload };
}

async function getByToken(token) {
    const data = await realtime.get(path(token));
    if (!data) return null;
    return { id: token, ...data };
}

async function listAll() {
    const all = await realtime.get(PATH) || {};
    return Object.keys(all).map(k => ({ id: k, ...all[k] })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function updateToken(token, updates) {
    await realtime.update(path(token), updates);
    const updated = await realtime.get(path(token));
    return { id: token, ...updated };
}

module.exports = { createInvite, getByToken, listAll, updateToken };
