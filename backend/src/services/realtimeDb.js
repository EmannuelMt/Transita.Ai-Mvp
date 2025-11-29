const admin = require('../config/firebase');

function getRef(path = '/') {
    return admin.database().ref(path);
}

async function get(path = '/') {
    const snapshot = await getRef(path).once('value');
    return snapshot.val();
}

async function set(path, value) {
    await getRef(path).set(value);
    return true;
}

async function update(path, value) {
    await getRef(path).update(value);
    return true;
}

async function push(path, value) {
    const ref = getRef(path).push();
    await ref.set(value);
    return ref.key;
}

module.exports = {
    getRef,
    get,
    set,
    update,
    push,
};
