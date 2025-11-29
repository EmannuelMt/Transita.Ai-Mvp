const twoFactorService = require('../services/TwoFactorService');
const admin = require('firebase-admin');
const { body, validationResult } = require('express-validator');

const validate2FASetup = [
    body('token')
        .isString()
        .isLength({ min: 6, max: 6 })
        .matches(/^\d+$/)
        .withMessage('Token inválido')
];

const twoFactorController = {
    // Iniciar setup de 2FA
    startSetup: async (req, res) => {
        try {
            const userId = req.user.uid;

            // Verifica se já tem 2FA ativo
            const userRecord = await admin.auth().getUser(userId);
            if (userRecord.customClaims?.twoFactorEnabled) {
                return res.status(400).json({
                    message: '2FA já está ativo'
                });
            }

            // Gera novo segredo
            const { secret, otpauthUrl } = twoFactorService.generateSecret(userId);

            // Gera QR code
            const qrCode = await twoFactorService.generateQRCode(otpauthUrl);

            // Gera códigos de backup
            const backupCodes = twoFactorService.generateBackupCodes();

            // Armazena hash dos códigos de backup temporariamente
            const hashedBackupCodes = backupCodes.map(code =>
                twoFactorService.hashBackupCode(code)
            );

            // Armazena os hashes no custom claim temporariamente
            await admin.auth().setCustomUserClaims(userId, {
                ...userRecord.customClaims,
                tempBackupCodes: hashedBackupCodes
            });

            res.json({
                qrCode,
                backupCodes, // Envia códigos em texto plano apenas durante setup
                message: 'Use um aplicativo autenticador para escanear o QR code'
            });

        } catch (error) {
            console.error('Erro ao iniciar setup 2FA:', error);
            res.status(500).json({
                message: 'Erro ao iniciar setup de 2FA'
            });
        }
    },

    // Confirmar setup de 2FA
    confirmSetup: [
        validate2FASetup,
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const userId = req.user.uid;
                const { token } = req.body;

                // Verifica o token
                const isValid = twoFactorService.verifySetup(userId, token);
                if (!isValid) {
                    return res.status(400).json({
                        message: 'Token inválido'
                    });
                }

                // Atualiza claims do usuário
                const userRecord = await admin.auth().getUser(userId);
                const { tempBackupCodes, ...otherClaims } = userRecord.customClaims || {};

                await admin.auth().setCustomUserClaims(userId, {
                    ...otherClaims,
                    twoFactorEnabled: true,
                    backupCodes: tempBackupCodes // Move do temp para permanente
                });

                res.json({
                    message: '2FA ativado com sucesso'
                });

            } catch (error) {
                console.error('Erro ao confirmar setup 2FA:', error);
                res.status(500).json({
                    message: 'Erro ao confirmar setup de 2FA'
                });
            }
        }
    ],

    // Desativar 2FA
    disable: [
        validate2FASetup,
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const userId = req.user.uid;
                const { token } = req.body;

                // Verifica se 2FA está ativo
                const userRecord = await admin.auth().getUser(userId);
                if (!userRecord.customClaims?.twoFactorEnabled) {
                    return res.status(400).json({
                        message: '2FA não está ativo'
                    });
                }

                // Valida o token
                const isValid = twoFactorService.validateToken(
                    userRecord.customClaims.twoFactorSecret,
                    token
                );

                if (!isValid) {
                    return res.status(400).json({
                        message: 'Token inválido'
                    });
                }

                // Remove 2FA das claims
                const {
                    twoFactorEnabled,
                    twoFactorSecret,
                    backupCodes,
                    ...otherClaims
                } = userRecord.customClaims;

                await admin.auth().setCustomUserClaims(userId, otherClaims);

                res.json({
                    message: '2FA desativado com sucesso'
                });

            } catch (error) {
                console.error('Erro ao desativar 2FA:', error);
                res.status(500).json({
                    message: 'Erro ao desativar 2FA'
                });
            }
        }
    ],

    // Validar token 2FA
    validateToken: [
        validate2FASetup,
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const userId = req.user.uid;
                const { token, isBackupCode = false } = req.body;

                const userRecord = await admin.auth().getUser(userId);
                if (!userRecord.customClaims?.twoFactorEnabled) {
                    return res.status(400).json({
                        message: '2FA não está ativo'
                    });
                }

                let isValid = false;

                if (isBackupCode) {
                    // Valida código de backup
                    isValid = twoFactorService.validateBackupCode(
                        token,
                        userRecord.customClaims.backupCodes
                    );

                    if (isValid) {
                        // Remove o código de backup usado
                        const remainingCodes = userRecord.customClaims.backupCodes
                            .filter(code => code !== twoFactorService.hashBackupCode(token));

                        await admin.auth().setCustomUserClaims(userId, {
                            ...userRecord.customClaims,
                            backupCodes: remainingCodes
                        });
                    }
                } else {
                    // Valida token TOTP
                    isValid = twoFactorService.validateToken(
                        userRecord.customClaims.twoFactorSecret,
                        token
                    );
                }

                if (!isValid) {
                    return res.status(400).json({
                        message: 'Token inválido'
                    });
                }

                res.json({
                    message: 'Token válido',
                    valid: true
                });

            } catch (error) {
                console.error('Erro ao validar token 2FA:', error);
                res.status(500).json({
                    message: 'Erro ao validar token'
                });
            }
        }
    ],

    // Gerar novos códigos de backup
    generateNewBackupCodes: [
        validate2FASetup,
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const userId = req.user.uid;
                const { token } = req.body;

                const userRecord = await admin.auth().getUser(userId);
                if (!userRecord.customClaims?.twoFactorEnabled) {
                    return res.status(400).json({
                        message: '2FA não está ativo'
                    });
                }

                // Valida o token atual
                const isValid = twoFactorService.validateToken(
                    userRecord.customClaims.twoFactorSecret,
                    token
                );

                if (!isValid) {
                    return res.status(400).json({
                        message: 'Token inválido'
                    });
                }

                // Gera novos códigos
                const newBackupCodes = twoFactorService.generateBackupCodes();
                const hashedBackupCodes = newBackupCodes.map(code =>
                    twoFactorService.hashBackupCode(code)
                );

                // Atualiza os códigos no usuário
                await admin.auth().setCustomUserClaims(userId, {
                    ...userRecord.customClaims,
                    backupCodes: hashedBackupCodes
                });

                res.json({
                    backupCodes: newBackupCodes,
                    message: 'Novos códigos de backup gerados com sucesso'
                });

            } catch (error) {
                console.error('Erro ao gerar novos códigos de backup:', error);
                res.status(500).json({
                    message: 'Erro ao gerar novos códigos de backup'
                });
            }
        }
    ]
};

module.exports = twoFactorController;