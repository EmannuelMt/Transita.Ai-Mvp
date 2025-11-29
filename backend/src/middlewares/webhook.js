/**
 * Middleware simples para validar webhooks via header secreto
 */
module.exports = (req, res, next) => {
    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) {
        // If not configured, allow for development but warn
        console.warn('WEBHOOK_SECRET not configured - webhook endpoint is insecure in development');
        return next();
    }

    const signature = req.headers['x-webhook-signature'] || req.headers['x-webhook-token'];
    if (!signature) return res.status(403).json({ message: 'Missing webhook signature' });
    if (signature !== secret) return res.status(403).json({ message: 'Invalid webhook signature' });
    next();
};
