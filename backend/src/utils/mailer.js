const nodemailer = require('nodemailer');

// Small mailer wrapper: if SMTP env vars are present, try to send emails.
// Otherwise, we fall back to returning the token to the caller (useful for local/dev).

const isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;
if (isConfigured) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

async function sendInviteEmail({ to, token, inviterEmail, appUrl }) {
    // appUrl is optional; used to build the confirmation link
    const confirmUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/accept-invite?token=${token}` : null;

    if (!isConfigured) {
        // Dev fallback: return token so the caller can display it
        return { sent: false, reason: 'SMTP not configured', token, confirmUrl };
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || inviterEmail || process.env.SMTP_USER,
        to,
        subject: 'Convite de administrador',
        text: `Você recebeu um convite para se tornar administrador. ${confirmUrl ? `Confirme aqui: ${confirmUrl}` : ''}`,
        html: `<p>Você recebeu um convite para se tornar administrador.</p>${confirmUrl ? `<p>Clique no link para aceitar: <a href="${confirmUrl}">${confirmUrl}</a></p>` : ''}`
    };

    const info = await transporter.sendMail(mailOptions);
    return { sent: true, info };
}

module.exports = { sendInviteEmail, isConfigured };
