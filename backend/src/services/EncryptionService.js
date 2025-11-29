const crypto = require('crypto');

class EncryptionService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32; // 256 bits
        this.ivLength = 12; // 96 bits recomendado para GCM
        this.authTagLength = 16; // 128 bits

        // Inicializa a chave mestra em memória
        this.masterKey = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
        if (this.masterKey.length !== this.keyLength) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('Chave de criptografia inválida');
            } else {
                // Em desenvolvimento, gera uma chave aleatória
                this.masterKey = crypto.randomBytes(this.keyLength);
                console.warn('Usando chave de criptografia aleatória para desenvolvimento');
            }
        }
    }

    // Gera uma chave derivada usando HKDF
    async deriveKey(salt, info = '') {
        return new Promise((resolve, reject) => {
            crypto.hkdf(
                'sha256',
                this.masterKey,
                salt,
                info,
                this.keyLength,
                (err, derivedKey) => {
                    if (err) reject(err);
                    else resolve(derivedKey);
                }
            );
        });
    }

    // Encripta dados com uma chave derivada específica para cada usuário
    async encrypt(data, userId) {
        try {
            // Gera salt único para este usuário
            const salt = crypto.createHash('sha256')
                .update(userId)
                .digest();

            // Deriva uma chave específica para este usuário
            const key = await this.deriveKey(salt, 'encryption');

            // Gera IV único
            const iv = crypto.randomBytes(this.ivLength);

            // Cria cipher
            const cipher = crypto.createCipheriv(this.algorithm, key, iv, {
                authTagLength: this.authTagLength
            });

            // Encripta os dados
            const encrypted = Buffer.concat([
                cipher.update(JSON.stringify(data), 'utf8'),
                cipher.final()
            ]);

            // Obtém o authentication tag
            const authTag = cipher.getAuthTag();

            // Combina todos os componentes necessários para decriptação
            return Buffer.concat([
                salt,          // 32 bytes
                iv,           // 12 bytes
                authTag,      // 16 bytes
                encrypted    // resto
            ]).toString('base64');

        } catch (error) {
            console.error('Erro ao encriptar dados:', error);
            throw new Error('Falha na encriptação');
        }
    }

    // Decripta dados com a chave derivada do usuário
    async decrypt(encryptedData, userId) {
        try {
            // Converte dados de base64 para buffer
            const data = Buffer.from(encryptedData, 'base64');

            // Extrai componentes
            const salt = data.slice(0, 32);
            const iv = data.slice(32, 44);
            const authTag = data.slice(44, 60);
            const encrypted = data.slice(60);

            // Deriva a chave do usuário
            const key = await this.deriveKey(salt, 'encryption');

            // Cria decipher
            const decipher = crypto.createDecipheriv(this.algorithm, key, iv, {
                authTagLength: this.authTagLength
            });
            decipher.setAuthTag(authTag);

            // Decripta os dados
            const decrypted = Buffer.concat([
                decipher.update(encrypted),
                decipher.final()
            ]);

            return JSON.parse(decrypted.toString('utf8'));

        } catch (error) {
            console.error('Erro ao decriptar dados:', error);
            throw new Error('Falha na decriptação');
        }
    }

    // Gera um hash seguro para senhas ou outros dados sensíveis
    async hash(data, salt = crypto.randomBytes(16)) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(
                data,
                salt,
                100000, // Iterações
                64, // Tamanho do hash
                'sha512',
                (err, derivedKey) => {
                    if (err) reject(err);
                    else resolve({
                        hash: derivedKey.toString('hex'),
                        salt: salt.toString('hex')
                    });
                }
            );
        });
    }

    // Verifica um hash
    async verifyHash(data, hash, salt) {
        const verify = await this.hash(data, Buffer.from(salt, 'hex'));
        return verify.hash === hash;
    }

    // Gera um token seguro
    generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    // Gera um par de chaves RSA para criptografia assimétrica
    generateKeyPair() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
    }

    // Encripta dados com chave pública RSA
    encryptWithPublicKey(data, publicKey) {
        const buffer = Buffer.from(JSON.stringify(data));
        return crypto.publicEncrypt(publicKey, buffer).toString('base64');
    }

    // Decripta dados com chave privada RSA
    decryptWithPrivateKey(encryptedData, privateKey) {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
        return JSON.parse(decrypted.toString());
    }

    // Assina dados com chave privada RSA
    sign(data, privateKey) {
        const sign = crypto.createSign('SHA256');
        sign.update(JSON.stringify(data));
        return sign.sign(privateKey, 'base64');
    }

    // Verifica assinatura com chave pública RSA
    verify(data, signature, publicKey) {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(data));
        return verify.verify(publicKey, signature, 'base64');
    }
}

module.exports = new EncryptionService();