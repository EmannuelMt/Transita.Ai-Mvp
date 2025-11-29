const realtime = require('./realtimeDb');

const PATH = '/activityLogs';

async function create(payload) {
    const now = new Date().toISOString();
    payload.createdAt = now;
    payload.updatedAt = now;
    const key = await realtime.push(PATH, payload);
    return { id: key, ...payload };
}

async function list(filter = {}, { page = 1, limit = 50 } = {}) {
    const all = await realtime.get(PATH) || {};
    let arr = Object.keys(all).map(k => ({ id: k, ...all[k] }));
    if (filter.actorId) arr = arr.filter(a => a.actorId === filter.actorId);
    const total = arr.length;
    const sorted = arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);
    return { items, total };
}

module.exports = { create, list };
