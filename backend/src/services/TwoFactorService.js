const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

class TwoFactorService {
    constructor() {
        this.tempSecrets = new Map(); // Armazena segredos temporários durante setup
    }

    // Gera um novo segredo TOTP
    generateSecret(userId) {
        const secret = speakeasy.generateSecret({
            name: 'Transita.Ai',
            issuer: 'Transita.Ai Admin'
        });

        // Armazena temporariamente o segredo
        this.tempSecrets.set(userId, {
            secret: secret.base32,
            createdAt: new Date()
        });

        return {
            secret: secret.base32,
            otpauthUrl: secret.otpauth_url
        };
    }

    // Gera QR code para o segredo
    async generateQRCode(otpauthUrl) {
        try {
            return await QRCode.toDataURL(otpauthUrl);
        } catch (error) {
            console.error('Erro ao gerar QR code:', error);
            throw new Error('Falha ao gerar QR code');
        }
    }

    // Valida um código TOTP
    validateToken(secret, token) {
        try {
            return speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: token,
                window: 1 // Permite 1 intervalo antes/depois para compensar dessincronia
            });
        } catch (error) {
            console.error('Erro ao validar token:', error);
            return false;
        }
    }

    // Verifica um código durante o setup inicial
    verifySetup(userId, token) {
        const tempSecret = this.tempSecrets.get(userId);
        if (!tempSecret) {
            throw new Error('Setup não iniciado');
        }

        // Verifica se o setup não expirou (30 minutos)
        const setupAge = Date.now() - tempSecret.createdAt;
        if (setupAge > 30 * 60 * 1000) {
            this.tempSecrets.delete(userId);
            throw new Error('Setup expirado');
        }

        const isValid = this.validateToken(tempSecret.secret, token);
        if (isValid) {
            this.tempSecrets.delete(userId); // Limpa o segredo temporário
        }

        return isValid;
    }

    // Gera códigos de backup
    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(crypto.randomBytes(4).toString('hex'));
        }
        return codes;
    }

    // Valida um código de backup
    validateBackupCode(providedCode, hashedCodes) {
        return hashedCodes.some(hashedCode => {
            const hash = crypto.createHash('sha256')
                .update(providedCode)
                .digest('hex');
            return hash === hashedCode;
        });
    }

    // Hash um código de backup para armazenamento
    hashBackupCode(code) {
        return crypto.createHash('sha256')
            .update(code)
            .digest('hex');
    }

    // Limpa segredos temporários expirados
    cleanup() {
        const now = Date.now();
        for (const [userId, data] of this.tempSecrets.entries()) {
            if (now - data.createdAt > 30 * 60 * 1000) {
                this.tempSecrets.delete(userId);
            }
        }
    }
}

// Executa limpeza a cada hora
setInterval(() => {
    twoFactorService.cleanup();
}, 60 * 60 * 1000);

const twoFactorService = new TwoFactorService();
module.exports = twoFactorService;