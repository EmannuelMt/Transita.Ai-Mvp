const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const AWS = require('aws-sdk');
const { logger } = require('../utils/logger');

const execPromise = util.promisify(exec);

class BackupService {
    constructor() {
        // Configuração do S3
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1'
        });

        this.bucketName = process.env.AWS_BACKUP_BUCKET;
        this.backupDir = path.join(__dirname, '../../backups');

        // Cria diretório de backup se não existir
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    // Gera nome do arquivo de backup
    generateBackupFileName() {
        const date = new Date();
        return `backup-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getTime()}.gz`;
    }

    // Executa backup do MongoDB
    async backupMongoDB() {
        try {
            const fileName = this.generateBackupFileName();
            const filePath = path.join(this.backupDir, fileName);

            logger.info('Iniciando backup do MongoDB', { fileName });

            // Executa mongodump
            const { uri } = require('../config/database');
            await execPromise(`mongodump --uri="${uri}" --gzip --archive="${filePath}"`);

            logger.info('Backup do MongoDB concluído', { fileName });

            return filePath;
        } catch (error) {
            logger.error('Erro ao fazer backup do MongoDB', { error });
            throw error;
        }
    }

    // Faz upload do backup para S3
    async uploadToS3(filePath) {
        try {
            const fileName = path.basename(filePath);
            const fileStream = fs.createReadStream(filePath);

            logger.info('Iniciando upload para S3', { fileName });

            const uploadParams = {
                Bucket: this.bucketName,
                Key: `mongodb/${fileName}`,
                Body: fileStream
            };

            const result = await this.s3.upload(uploadParams).promise();

            logger.info('Upload para S3 concluído', {
                fileName,
                location: result.Location
            });

            return result;
        } catch (error) {
            logger.error('Erro ao fazer upload para S3', { error });
            throw error;
        }
    }

    // Remove backups antigos do S3
    async cleanupOldBackups() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const listParams = {
                Bucket: this.bucketName,
                Prefix: 'mongodb/'
            };

            const objects = await this.s3.listObjectsV2(listParams).promise();
            const oldObjects = objects.Contents.filter(obj => {
                return new Date(obj.LastModified) < thirtyDaysAgo;
            });

            if (oldObjects.length > 0) {
                const deleteParams = {
                    Bucket: this.bucketName,
                    Delete: {
                        Objects: oldObjects.map(obj => ({ Key: obj.Key }))
                    }
                };

                await this.s3.deleteObjects(deleteParams).promise();

                logger.info('Limpeza de backups antigos concluída', {
                    removedCount: oldObjects.length
                });
            }
        } catch (error) {
            logger.error('Erro ao limpar backups antigos', { error });
            throw error;
        }
    }

    // Remove arquivo local após upload
    async cleanupLocalFile(filePath) {
        try {
            await fs.promises.unlink(filePath);
            logger.info('Arquivo local removido', { filePath });
        } catch (error) {
            logger.error('Erro ao remover arquivo local', { error, filePath });
            // Não lança erro para não interromper o processo
        }
    }

    // Executa processo completo de backup
    async performBackup() {
        let backupPath;
        try {
            // Faz backup do MongoDB
            backupPath = await this.backupMongoDB();

            // Upload para S3
            await this.uploadToS3(backupPath);

            // Limpa backup local
            await this.cleanupLocalFile(backupPath);

            // Limpa backups antigos
            await this.cleanupOldBackups();

            logger.info('Processo de backup concluído com sucesso');
        } catch (error) {
            logger.error('Erro no processo de backup', { error });

            // Tenta limpar arquivo local em caso de erro
            if (backupPath) {
                await this.cleanupLocalFile(backupPath).catch(() => { });
            }

            throw error;
        }
    }

    // Restaura backup específico
    async restoreBackup(backupKey) {
        try {
            logger.info('Iniciando restauração de backup', { backupKey });

            // Download do S3
            const downloadPath = path.join(this.backupDir, 'temp-restore.gz');
            const downloadParams = {
                Bucket: this.bucketName,
                Key: backupKey
            };

            const fileStream = fs.createWriteStream(downloadPath);
            await new Promise((resolve, reject) => {
                this.s3.getObject(downloadParams)
                    .createReadStream()
                    .pipe(fileStream)
                    .on('finish', resolve)
                    .on('error', reject);
            });

            // Restaura MongoDB
            const { uri } = require('../config/database');
            await execPromise(`mongorestore --uri="${uri}" --gzip --archive="${downloadPath}"`);

            // Limpa arquivo temporário
            await this.cleanupLocalFile(downloadPath);

            logger.info('Restauração concluída com sucesso', { backupKey });
        } catch (error) {
            logger.error('Erro ao restaurar backup', { error, backupKey });
            throw error;
        }
    }

    // Lista backups disponíveis
    async listBackups() {
        try {
            const params = {
                Bucket: this.bucketName,
                Prefix: 'mongodb/'
            };

            const result = await this.s3.listObjectsV2(params).promise();

            return result.Contents.map(obj => ({
                key: obj.Key,
                size: obj.Size,
                lastModified: obj.LastModified
            }));
        } catch (error) {
            logger.error('Erro ao listar backups', { error });
            throw error;
        }
    }
}

module.exports = new BackupService();