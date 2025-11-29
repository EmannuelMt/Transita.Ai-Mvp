require('dotenv').config();

const config = {
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    from: process.env.EMAIL_FROM || 'no-reply@transita.ai',
    appUrl: process.env.APP_URL || 'http://localhost:5173',
    dev: {
        // Em desenvolvimento, podemos desabilitar o envio real de emails
        enabled: process.env.NODE_ENV !== 'production',
        // E usar um serviço de captura de emails como Ethereal ou MailHog
        testAccount: null
    }
};

// Se estiver em desenvolvimento e não houver configuração SMTP,
// usa o Ethereal para testes
if (config.dev.enabled && !config.smtp.user) {
    const nodemailer = require('nodemailer');

    nodemailer.createTestAccount().then(testAccount => {
        config.dev.testAccount = testAccount;
        config.smtp = {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            user: testAccount.user,
            pass: testAccount.pass
        };
        console.log('Ethereal Email configurado para testes:', testAccount.web);
    });
}

module.exports = config;