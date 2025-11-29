const Redis = require('ioredis');
const { logger } = require('../utils/logger');

class CacheService {
    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.client.on('error', (error) => {
            logger.error('Redis error', { error });
        });

        this.client.on('connect', () => {
            logger.info('Redis connected');
        });
    }

    // Define um valor no cache
    async set(key, value, expirationInSeconds = 3600) {
        try {
            const serializedValue = JSON.stringify(value);
            await this.client.set(key, serializedValue, 'EX', expirationInSeconds);

            logger.debug('Cache set', { key, expirationInSeconds });
            return true;
        } catch (error) {
            logger.error('Error setting cache', { error, key });
            return false;
        }
    }

    // Obtém um valor do cache
    async get(key) {
        try {
            const value = await this.client.get(key);
            if (!value) return null;

            logger.debug('Cache hit', { key });
            return JSON.parse(value);
        } catch (error) {
            logger.error('Error getting cache', { error, key });
            return null;
        }
    }

    // Remove um valor do cache
    async del(key) {
        try {
            await this.client.del(key);
            logger.debug('Cache deleted', { key });
            return true;
        } catch (error) {
            logger.error('Error deleting cache', { error, key });
            return false;
        }
    }

    // Limpa todo o cache
    async clear() {
        try {
            await this.client.flushall();
            logger.info('Cache cleared');
            return true;
        } catch (error) {
            logger.error('Error clearing cache', { error });
            return false;
        }
    }

    // Define um valor no cache apenas se a chave não existir
    async setNX(key, value, expirationInSeconds = 3600) {
        try {
            const serializedValue = JSON.stringify(value);
            const result = await this.client.set(
                key,
                serializedValue,
                'EX',
                expirationInSeconds,
                'NX'
            );

            logger.debug('Cache setNX', { key, success: !!result });
            return !!result;
        } catch (error) {
            logger.error('Error in setNX', { error, key });
            return false;
        }
    }

    // Incrementa um contador
    async increment(key, amount = 1) {
        try {
            const result = await this.client.incrby(key, amount);
            logger.debug('Cache increment', { key, amount, newValue: result });
            return result;
        } catch (error) {
            logger.error('Error incrementing cache', { error, key });
            return null;
        }
    }

    // Decrementa um contador
    async decrement(key, amount = 1) {
        try {
            const result = await this.client.decrby(key, amount);
            logger.debug('Cache decrement', { key, amount, newValue: result });
            return result;
        } catch (error) {
            logger.error('Error decrementing cache', { error, key });
            return null;
        }
    }

    // Adiciona um valor a um set
    async sadd(key, ...members) {
        try {
            const result = await this.client.sadd(key, ...members);
            logger.debug('Cache sadd', { key, members, added: result });
            return result;
        } catch (error) {
            logger.error('Error in sadd', { error, key });
            return null;
        }
    }

    // Remove um valor de um set
    async srem(key, ...members) {
        try {
            const result = await this.client.srem(key, ...members);
            logger.debug('Cache srem', { key, members, removed: result });
            return result;
        } catch (error) {
            logger.error('Error in srem', { error, key });
            return null;
        }
    }

    // Verifica se um valor existe em um set
    async sismember(key, member) {
        try {
            const result = await this.client.sismember(key, member);
            logger.debug('Cache sismember', { key, member, exists: !!result });
            return !!result;
        } catch (error) {
            logger.error('Error in sismember', { error, key });
            return null;
        }
    }

    // Obtém todos os membros de um set
    async smembers(key) {
        try {
            const result = await this.client.smembers(key);
            logger.debug('Cache smembers', { key, count: result.length });
            return result;
        } catch (error) {
            logger.error('Error in smembers', { error, key });
            return null;
        }
    }

    // Define um valor com hash
    async hset(key, field, value) {
        try {
            const serializedValue = JSON.stringify(value);
            await this.client.hset(key, field, serializedValue);
            logger.debug('Cache hset', { key, field });
            return true;
        } catch (error) {
            logger.error('Error in hset', { error, key });
            return false;
        }
    }

    // Obtém um valor de hash
    async hget(key, field) {
        try {
            const value = await this.client.hget(key, field);
            if (!value) return null;

            logger.debug('Cache hget', { key, field });
            return JSON.parse(value);
        } catch (error) {
            logger.error('Error in hget', { error, key });
            return null;
        }
    }

    // Remove um campo de hash
    async hdel(key, field) {
        try {
            await this.client.hdel(key, field);
            logger.debug('Cache hdel', { key, field });
            return true;
        } catch (error) {
            logger.error('Error in hdel', { error, key });
            return false;
        }
    }

    // Adiciona item a uma lista
    async lpush(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            const result = await this.client.lpush(key, serializedValue);
            logger.debug('Cache lpush', { key, length: result });
            return result;
        } catch (error) {
            logger.error('Error in lpush', { error, key });
            return null;
        }
    }

    // Remove e retorna último item da lista
    async rpop(key) {
        try {
            const value = await this.client.rpop(key);
            if (!value) return null;

            logger.debug('Cache rpop', { key });
            return JSON.parse(value);
        } catch (error) {
            logger.error('Error in rpop', { error, key });
            return null;
        }
    }

    // Obtém itens de uma lista
    async lrange(key, start, stop) {
        try {
            const values = await this.client.lrange(key, start, stop);
            logger.debug('Cache lrange', { key, count: values.length });
            return values.map(v => JSON.parse(v));
        } catch (error) {
            logger.error('Error in lrange', { error, key });
            return null;
        }
    }

    // Define tempo de expiração
    async expire(key, seconds) {
        try {
            await this.client.expire(key, seconds);
            logger.debug('Cache expire set', { key, seconds });
            return true;
        } catch (error) {
            logger.error('Error setting expiration', { error, key });
            return false;
        }
    }

    // Fecha a conexão
    async close() {
        try {
            await this.client.quit();
            logger.info('Redis connection closed');
        } catch (error) {
            logger.error('Error closing Redis connection', { error });
        }
    }
}

module.exports = new CacheService();