const userService = require('../services/userService');
const { validateUser } = require('../utils/validation');
const { handleError } = require('../utils/errorHandler');
const admin = require('firebase-admin');
const Joi = require('joi');

class UserController {
    async getProfile(req, res) {
        try {
            const user = await userService.getById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    }

    async updateProfile(req, res) {
        try {
            const { error } = validateUser(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const user = await userService.updateById(req.user.id, req.body);
            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    }

    async updatePhoto(req, res) {
        try {
            const photoUrl = req.body.photoUrl;
            const user = await userService.updateById(req.user.id, { fotoPerfilUrl: photoUrl });
            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    }

    // Upload via backend: aceita multipart/form-data (campo 'avatar'), grava no Firebase Storage via Admin SDK
    async uploadPhotoFile(req, res) {
        try {
            if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'Arquivo não enviado' });

            // validação extra por segurança
            const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowed.includes(req.file.mimetype)) {
                return res.status(400).json({ message: 'Tipo de arquivo não permitido' });
            }
            if (req.file.size && req.file.size > 3 * 1024 * 1024) {
                return res.status(400).json({ message: 'Arquivo maior que 3MB' });
            }

            const user = await userService.getById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

            // tentar usar Firebase Storage; se não estiver configurado ou o bucket não existir,
            // fazer fallback para salvar localmente em backend/uploads/avatars/<uid>/
            let bucket = null;
            try {
                bucket = admin.storage().bucket();
            } catch (err) {
                console.warn('Firebase Storage não disponível, usando fallback local:', err.message || err);
                bucket = null;
            }

            const dest = `avatars/${user.firebaseUid}/${Date.now()}_${req.file.originalname}`;

            if (bucket) {
                const file = bucket.file(dest);

                // gravar arquivo no Storage
                try {
                    await file.save(req.file.buffer, { contentType: req.file.mimetype });

                    // tentar gerar signed URL de leitura com validade longa; se falhar, fallback para public URL
                    let accessUrl = null;
                    try {
                        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 ano
                        const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: expiresAt });
                        accessUrl = signedUrl;
                    } catch (e) {
                        // se não for possível gerar signed url (políticas de bucket), tentar tornar público
                        try { await file.makePublic(); } catch (e2) { /* ignore */ }
                        accessUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                    }

                    const updated = await userService.updateById(user.firebaseUid, { fotoPerfilUrl: accessUrl });
                    return res.json(updated);
                } catch (err) {
                    console.warn('Erro ao salvar no Firebase Storage, caindo para fallback local:', err.message || err);
                    // continuar para fallback local
                }
            }

            // Fallback local: salvar em disco e servir via /uploads
            const fs = require('fs');
            const path = require('path');
            const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'avatars', user.firebaseUid.toString());
            try {
                fs.mkdirSync(uploadsDir, { recursive: true });
                const safeName = `${Date.now()}_${req.file.originalname}`.replace(/[^a-zA-Z0-9._-]/g, '_');
                const filePath = path.join(uploadsDir, safeName);
                fs.writeFileSync(filePath, req.file.buffer);

                // url público relativo ao servidor
                const publicUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${user.firebaseUid}/${safeName}`;

                const updated = await userService.updateById(user.firebaseUid, { fotoPerfilUrl: publicUrl });
                return res.json(updated);
            } catch (err) {
                console.error('Erro no fallback local de upload:', err);
                return res.status(500).json({ message: 'Erro ao salvar arquivo (tente novamente mais tarde)' });
            }
        } catch (error) {
            handleError(res, error);
        }
    }

    async getPreferences(req, res) {
        try {
            const user = await userService.getById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
            res.json({ notificacoes: user.notificacoes, idiomaPreferido: user.idiomaPreferido, pais: user.pais, fusoHorario: user.fusoHorario });
        } catch (error) {
            handleError(res, error);
        }
    }

    // Gerar signed URL para upload direto do cliente (escrever)
    async generateUploadUrl(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

            const filename = req.body.filename || `avatar_${Date.now()}.bin`;
            const dest = `avatars/${user.firebaseUid}/${Date.now()}_${filename}`;

            let bucket;
            try {
                bucket = admin.storage().bucket();
            } catch (err) {
                return res.status(500).json({ message: 'Firebase Storage não configurado. Defina FIREBASE_STORAGE_BUCKET.' });
            }

            const file = bucket.file(dest);

            // signed URL para upload (write) - curto prazo
            const uploadExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
            const readExpires = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 ano

            const [uploadUrl] = await file.getSignedUrl({ action: 'write', expires: new Date(uploadExpires) });
            const [readUrl] = await file.getSignedUrl({ action: 'read', expires: new Date(readExpires) });

            return res.json({ uploadUrl, objectName: dest, readUrl });
        } catch (error) {
            handleError(res, error);
        }
    }

    // Confirmar que o upload terminou (opcional) e persistir a readUrl no usuário
    async finalizeUpload(req, res) {
        try {
            const { objectName } = req.body;
            if (!objectName) return res.status(400).json({ message: 'objectName é obrigatório' });

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

            let bucket;
            try {
                bucket = admin.storage().bucket();
            } catch (err) {
                return res.status(500).json({ message: 'Firebase Storage não configurado. Defina FIREBASE_STORAGE_BUCKET.' });
            }

            const file = bucket.file(objectName);
            // gerar signed read URL longa validade
            const readExpires = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 ano
            const [readUrl] = await file.getSignedUrl({ action: 'read', expires: new Date(readExpires) });

            const updated = await User.findByIdAndUpdate(user._id, { $set: { fotoPerfilUrl: readUrl } }, { new: true });
            res.json(updated);
        } catch (error) {
            handleError(res, error);
        }
    }

    async updatePreferences(req, res) {
        try {
            // validação com Joi
            const schema = Joi.object({
                notificacoes: Joi.object().pattern(Joi.string(), Joi.boolean()).optional(),
                idiomaPreferido: Joi.string().optional(),
                pais: Joi.string().optional(),
                fusoHorario: Joi.string().optional()
            }).min(1);

            const { error, value } = schema.validate(req.body, { stripUnknown: true });
            if (error) return res.status(400).json({ message: error.details[0].message });

            const updates = {};
            if (value.notificacoes) updates.notificacoes = value.notificacoes;
            if (value.idiomaPreferido) updates.idiomaPreferido = value.idiomaPreferido;
            if (value.pais) updates.pais = value.pais;
            if (value.fusoHorario) updates.fusoHorario = value.fusoHorario;

            const user = await userService.updateById(req.user.id, updates);
            // retornar somente os campos esperados
            res.json({ notificacoes: user.notificacoes, idiomaPreferido: user.idiomaPreferido, pais: user.pais, fusoHorario: user.fusoHorario });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getUsage(req, res) {
        try {
            const user = await userService.getById(req.user.id);
            res.json({
                consultasUsadas: user.numeroConsultasMes,
                limiteConsultas: user.limiteConsultasMes,
                consultasRestantes: user.limiteConsultasMes - user.numeroConsultasMes
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new UserController();