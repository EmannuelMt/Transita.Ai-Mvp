const nodemailer = require('nodemailer');
const config = require('../config/email.config');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass
            }
        });
    }

    async sendAdminInvite(invite) {
        const inviteUrl = `${config.appUrl}/admin/accept-invite?token=${invite.token}`;

        const mailOptions = {
            from: config.from,
            to: invite.email,
            subject: 'Convite para Administrador - Transita.Ai',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Convite para Administrador</h2>
                    <p>Você foi convidado para ser administrador no sistema Transita.Ai.</p>
                    <p>Para aceitar o convite, clique no botão abaixo:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${inviteUrl}" 
                           style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Aceitar Convite
                        </a>
                    </div>
                    <p>Este convite expira em 48 horas.</p>
                    <p style="color: #666; font-size: 14px;">
                        Se você não esperava receber este convite, por favor ignore este email.
                    </p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendWelcomeAdmin(user) {
        const mailOptions = {
            from: config.from,
            to: user.email,
            subject: 'Bem-vindo(a) como Administrador - Transita.Ai',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Bem-vindo(a) como Administrador!</h2>
                    <p>Seu acesso como administrador foi confirmado com sucesso.</p>
                    <p>Você agora tem acesso a:</p>
                    <ul style="color: #666;">
                        <li>Painel administrativo completo</li>
                        <li>Gerenciamento de usuários</li>
                        <li>Controle de planos e assinaturas</li>
                        <li>Relatórios e análises</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${config.appUrl}/admin" 
                           style="background-color: #2196F3; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Acessar Painel Admin
                        </a>
                    </div>
                    <p>Em caso de dúvidas, entre em contato com o suporte.</p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendSubscriptionUpdate(user, subscription) {
        const planNames = {
            free: 'Gratuito',
            basic: 'Básico',
            pro: 'Profissional',
            enterprise: 'Empresarial',
            custom: 'Personalizado'
        };

        const statusNames = {
            active: 'Ativo',
            pending: 'Pendente',
            cancelled: 'Cancelado',
            trial: 'Período de Teste',
            suspended: 'Suspenso'
        };

        const mailOptions = {
            from: config.from,
            to: user.email,
            subject: `Atualização da sua Assinatura - Transita.Ai`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Atualização da sua Assinatura</h2>
                    <p>Sua assinatura foi atualizada com as seguintes informações:</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <p><strong>Plano:</strong> ${planNames[subscription.plan]}</p>
                        <p><strong>Status:</strong> ${statusNames[subscription.status]}</p>
                        <p><strong>Limite de Requisições:</strong> ${subscription.features.maxRequests}/mês</p>
                        ${subscription.dates.expirationDate ?
                    `<p><strong>Data de Expiração:</strong> ${new Date(subscription.dates.expirationDate).toLocaleDateString('pt-BR')}</p>`
                    : ''
                }
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${config.appUrl}/profile" 
                           style="background-color: #2196F3; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Ver Detalhes da Assinatura
                        </a>
                    </div>
                    <p style="color: #666;">
                        Se você não reconhece esta alteração, entre em contato com nosso suporte imediatamente.
                    </p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new EmailService();