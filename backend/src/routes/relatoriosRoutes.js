const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multaService = require('../services/multaService');
const EmailService = require('../services/EmailService');
const PDFDocument = require('pdfkit');

// POST /api/relatorios/export
// body: { reports: ['multas','financeiro','frota'], periodo, email, password }
router.post('/export', auth, async (req, res) => {
    try {
        const { reports = [], periodo = 'mes', email, password } = req.body || {};

        if (!Array.isArray(reports) || reports.length === 0) {
            return res.status(400).json({ message: 'Nenhum relatório selecionado' });
        }

        if (!email) return res.status(400).json({ message: 'Email de destino é obrigatório' });

        // Autorização adicional via senha de ação (opcional): se definido em env, exige correspondência
        const actionPassword = process.env.REPORTS_PASSWORD;
        if (actionPassword) {
            if (!password || password !== actionPassword) {
                return res.status(403).json({ message: 'Senha inválida para exportação' });
            }
        } else {
            // se não há senha configurada, apenas exigir que campo tenha valor (simples proteção)
            if (!password) return res.status(400).json({ message: 'Confirme sua senha para autorizar o envio' });
        }

        // coletar dados para os relatórios solicitados
        const parts = [];

        if (reports.includes('multas')) {
            const todas = await multaService.listAll();
            // filtrar por usuário
            const minhas = todas.filter(m => m.usuario === req.user.id);

            // aplicar período (simples): criar data inicial
            const dataInicial = new Date();
            switch (periodo) {
                case 'hoje': dataInicial.setHours(0, 0, 0, 0); break;
                case 'semana': dataInicial.setDate(dataInicial.getDate() - 7); break;
                case 'mes': dataInicial.setMonth(dataInicial.getMonth() - 1); break;
                case 'ano': dataInicial.setFullYear(dataInicial.getFullYear() - 1); break;
                case 'todos': dataInicial.setFullYear(2000); break;
            }

            const filtradas = minhas.filter(m => new Date(m.dataCriacao) >= dataInicial);
            const total = filtradas.length;
            const pendentes = filtradas.filter(m => m.status === 'pendente').length;
            const valorTotal = filtradas.reduce((s, it) => s + (Number(it.valor) || 0), 0);

            parts.push({ title: 'Relatório de Multas', summary: { total, pendentes, valorTotal }, items: filtradas });
        }

        // Financeiro / Frota: se não existirem serviços, retornaremos resumo vazio
        if (reports.includes('financeiro')) {
            parts.push({ title: 'Relatório Financeiro', summary: { note: 'Resumo financeiro não disponível no momento' }, items: [] });
        }

        if (reports.includes('frota')) {
            parts.push({ title: 'Relatório de Frota', summary: { note: 'Resumo frota não disponível no momento' }, items: [] });
        }

        // gerar PDF simples com PDFKit
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        const pdfEnd = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

        doc.fontSize(20).text('Relatórios Transita.Ai', { align: 'center' });
        doc.moveDown();

        parts.forEach((part) => {
            doc.fontSize(16).fillColor('#333').text(part.title);
            doc.moveDown(0.3);
            if (part.summary) {
                Object.entries(part.summary).forEach(([k, v]) => {
                    doc.fontSize(12).fillColor('#444').text(`${k}: ${typeof v === 'number' ? v : String(v)}`);
                });
            }
            doc.moveDown(0.3);
            if (part.items && part.items.length) {
                doc.fontSize(12).fillColor('#222');
                part.items.slice(0, 200).forEach((it, idx) => {
                    doc.text(`${idx + 1}. Placa: ${it.placa || 'N/A'} | Data: ${it.dataCriacao || 'N/A'} | Valor: ${it.valor || 0}`);
                });
                if (part.items.length > 200) doc.text(`... e mais ${part.items.length - 200} registros`);
            }
            doc.addPage();
        });

        doc.end();
        const pdfBuffer = await pdfEnd;

        // montar email
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'no-reply@transita.ai',
            to: email,
            subject: 'Seu relatório Transita.Ai',
            text: 'Em anexo está o relatório solicitado.',
            attachments: [
                { filename: 'relatorio-transitaai.pdf', content: pdfBuffer }
            ]
        };

        // enviar usando EmailService (instância exportada)
        const info = await EmailService.transporter.sendMail(mailOptions);

        return res.json({ success: true, messageId: info.messageId });

    } catch (error) {
        console.error('Erro em /api/relatorios/export:', error);
        return res.status(500).json({ message: 'Erro ao gerar/Enviar relatório', error: error.message });
    }
});

module.exports = router;
