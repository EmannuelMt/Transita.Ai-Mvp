const encryptionService = require('../../services/EncryptionService');

describe('EncryptionService', () => {
    const testData = {
        sensitive: 'test-data',
        number: 123,
        nested: { field: 'value' }
    };
    const testUserId = 'test-user-123';

    describe('Symmetric Encryption', () => {
        test('should encrypt and decrypt data successfully', async () => {
            const encrypted = await encryptionService.encrypt(testData, testUserId);
            expect(typeof encrypted).toBe('string');
            expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/); // Base64

            const decrypted = await encryptionService.decrypt(encrypted, testUserId);
            expect(decrypted).toEqual(testData);
        });

        test('should generate different ciphertexts for same data and different users', async () => {
            const encrypted1 = await encryptionService.encrypt(testData, 'user1');
            const encrypted2 = await encryptionService.encrypt(testData, 'user2');
            expect(encrypted1).not.toBe(encrypted2);
        });

        test('should fail to decrypt with wrong user id', async () => {
            const encrypted = await encryptionService.encrypt(testData, testUserId);
            await expect(
                encryptionService.decrypt(encrypted, 'wrong-user')
            ).rejects.toThrow();
        });

        test('should fail to decrypt tampered data', async () => {
            const encrypted = await encryptionService.encrypt(testData, testUserId);
            const tampered = encrypted.substring(0, encrypted.length - 5) + 'XXXXX';
            await expect(
                encryptionService.decrypt(tampered, testUserId)
            ).rejects.toThrow();
        });
    });

    describe('Hashing', () => {
        test('should generate and verify hashes', async () => {
            const password = 'test-password';
            const { hash, salt } = await encryptionService.hash(password);

            expect(hash).toBeTruthy();
            expect(salt).toBeTruthy();

            const isValid = await encryptionService.verifyHash(password, hash, salt);
            expect(isValid).toBe(true);
        });

        test('should fail verification with wrong password', async () => {
            const password = 'test-password';
            const { hash, salt } = await encryptionService.hash(password);

            const isValid = await encryptionService.verifyHash('wrong-password', hash, salt);
            expect(isValid).toBe(false);
        });

        test('should generate different hashes for same password with different salts', async () => {
            const password = 'test-password';
            const result1 = await encryptionService.hash(password);
            const result2 = await encryptionService.hash(password);

            expect(result1.hash).not.toBe(result2.hash);
            expect(result1.salt).not.toBe(result2.salt);
        });
    });

    describe('RSA Encryption', () => {
        test('should generate valid key pair', () => {
            const { publicKey, privateKey } = encryptionService.generateKeyPair();
            expect(publicKey).toMatch(/^-----BEGIN PUBLIC KEY-----/);
            expect(privateKey).toMatch(/^-----BEGIN PRIVATE KEY-----/);
        });

        test('should encrypt and decrypt with RSA keys', () => {
            const { publicKey, privateKey } = encryptionService.generateKeyPair();
            const encrypted = encryptionService.encryptWithPublicKey(testData, publicKey);
            const decrypted = encryptionService.decryptWithPrivateKey(encrypted, privateKey);
            expect(decrypted).toEqual(testData);
        });

        test('should sign and verify data', () => {
            const { publicKey, privateKey } = encryptionService.generateKeyPair();
            const signature = encryptionService.sign(testData, privateKey);
            const isValid = encryptionService.verify(testData, signature, publicKey);
            expect(isValid).toBe(true);
        });

        test('should fail verification with tampered data', () => {
            const { publicKey, privateKey } = encryptionService.generateKeyPair();
            const signature = encryptionService.sign(testData, privateKey);
            const tamperedData = { ...testData, sensitive: 'tampered' };
            const isValid = encryptionService.verify(tamperedData, signature, publicKey);
            expect(isValid).toBe(false);
        });
    });

    describe('Token Generation', () => {
        test('should generate random tokens', () => {
            const token1 = encryptionService.generateToken();
            const token2 = encryptionService.generateToken();

            expect(token1).toHaveLength(64); // 32 bytes em hex
            expect(token2).toHaveLength(64);
            expect(token1).not.toBe(token2);
        });

        test('should generate tokens of specified length', () => {
            const length = 16;
            const token = encryptionService.generateToken(length);
            expect(token).toHaveLength(length * 2); // hex encoding
        });
    });
});