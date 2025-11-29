const fs = require('fs');
const path = require('path');

// Central loader for middlewares in both `middleware/` and `middlewares/` folders.
// This file is non-destructive: it only attempts to require JS files that exist
// and exports them in an object keyed by filename (without extension).

const middlewares = {};

function loadDir(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) return;
        const files = fs.readdirSync(dirPath);
        files.forEach((f) => {
            if (!f.endsWith('.js')) return;
            const key = path.basename(f, '.js');
            try {
                middlewares[key] = require(path.join(dirPath, f));
            } catch (err) {
                // don't throw - log to console for debugging
                console.warn('Failed to load middleware', f, err && err.message ? err.message : err);
            }
        });
    } catch (err) {
        // ignore
    }
}

// load from sibling folder `middleware` (if present)
loadDir(path.join(__dirname));
// load from sibling folder `middlewares` (some projects use plural)
loadDir(path.join(__dirname, '..', 'middlewares'));

module.exports = middlewares;
